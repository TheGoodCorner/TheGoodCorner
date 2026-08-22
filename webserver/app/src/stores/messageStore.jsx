import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SendMessage, GetMessage, GetAllMessages, UpdateMessage, DeleteMessage } from '../api/messageApi';
import { useUserStore } from './userStore';

/**
 * Store de la messagerie.
 *
 * Forme d'une conversation telle que renvoyée par GET /message
 * (MessageService.getConversationList) :
 *   { interlocutor: { id, username, avatar, email }, lastMessage: { id, content, createdAt, senderId, modifiedAt } | null }
 *
 * Pas de compteur de non-lus exposé par cette route (le schema a bien
 * Message.isRead, mais rien ne l'agrège ici) — pas de badge "non lu"
 * affiché côté front tant que ce n'est pas branché côté back.
 *
 * Persistance volontairement limitée à `conversations` (résumés légers) —
 * sert juste à afficher quelque chose instantanément à l'ouverture de la
 * page pendant que le vrai fetch tourne en arrière-plan, comme cartStore.
 * Le CONTENU des messages n'est JAMAIS persisté (donnée privée, toujours
 * rechargée depuis l'API) et est vidé à la déconnexion — voir
 * authStore.logout() → useMessageStore.getState().reset().
 *
 * Temps réel : src/socket.js appelle receiveMessage / handleMessageUpdated /
 * handleMessageDeleted sur les événements receive_direct_message /
 * message_updated / message_deleted.
 */
export const useMessageStore = create(
  persist(
    (set, get) => ({
      conversations: [],
      conversationsLoading: false,
      conversationsError: null,

      activeConversationId: null,

      // Jamais persisté : toujours frais depuis l'API.
      messagesByConversation: {},
      messagesLoading: false,
      messagesError: null,

      sending: false,
      error: null,

      fetchConversations: async () => {
        set({ conversationsLoading: true, conversationsError: null });
        try {
          const data = await GetAllMessages();
          set({ conversations: Array.isArray(data) ? data : [], conversationsLoading: false });
        } catch (err) {
          set({ conversationsError: err.message, conversationsLoading: false });
          console.error('fetchConversations error:', err);
        }
      },

      setActiveConversation: (conversationId) => {
        set({ activeConversationId: conversationId });
        get().fetchMessages(conversationId);
      },

      // Toujours re-fetch (pas de cache) : les messages sont une donnée
      // privée qui doit rester à jour, contrairement aux résumés de conv.
      fetchMessages: async (conversationId) => {
        set({ messagesLoading: true, messagesError: null });
        try {
          const data = await GetMessage(conversationId);
          set((state) => ({
            messagesByConversation: {
              ...state.messagesByConversation,
              [conversationId]: Array.isArray(data) ? data : [],
            },
            messagesLoading: false,
          }));
        } catch (err) {
          set({ messagesError: err.message, messagesLoading: false });
          console.error('fetchMessages error:', err);
        }
      },

      sendMessage: async (conversationId, content) => {
        set({ sending: true, error: null });
        try {
          SendMessage(conversationId, content); // ← PAS d'await, pas d'assignment
          // La réponse vient via le socket listener → receiveMessage()
          set({ sending: false });
          return; // ← Retourne sans newMessage
        } catch (err) {
          set({ error: err.message, sending: false });
          console.error('sendMessage error:', err);
          throw err;
        }
      },

      // Prêt côté store, pas encore branché à l'UI.
      updateMessage: async (messageId, conversationId, content) => {
        try {
          const updated = await UpdateMessage(messageId, content);
          set((state) => ({
            messagesByConversation: {
              ...state.messagesByConversation,
              [conversationId]: (state.messagesByConversation[conversationId] || []).map((m) =>
                m.id === messageId ? updated : m
              ),
            },
          }));
          return updated;
        } catch (err) {
          console.error('updateMessage error:', err);
          throw err;
        }
      },

      deleteMessage: async (messageId, conversationId) => {
        try {
          await DeleteMessage(messageId);
          set((state) => ({
            messagesByConversation: {
              ...state.messagesByConversation,
              [conversationId]: (state.messagesByConversation[conversationId] || []).filter(
                (m) => m.id !== messageId
              ),
            },
          }));
        } catch (err) {
          console.error('deleteMessage error:', err);
          throw err;
        }
      },

      // Démarre (ou rouvre) une conversation avec un utilisateur choisi
      // dans SelectUserModal, avant même qu'un premier message soit envoyé.
      startConversationWith: (selectedUser) => {
        const exists = get().conversations.some((c) => String(c.interlocutor.id) === String(selectedUser.id));
        if (!exists) {
          const draft = { interlocutor: selectedUser, lastMessage: null };
          set((state) => ({ conversations: [draft, ...state.conversations] }));
        }
        get().setActiveConversation(selectedUser.id);
      },

      // Met à jour (ou crée) l'entrée "dernier message" d'une conversation
      // dans la liste, sans tout re-fetch — utilisé après un envoi et par
      // les événements socket entrants. Fait remonter la conversation en
      // haut de liste (comme une vraie messagerie).
      _touchConversation: (conversationId, message) => {
        set((state) => {
          const idx = state.conversations.findIndex((c) => String(c.interlocutor.id) === String(conversationId));
          const lastMessage = {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            senderId: message.senderId,
            modifiedAt: message.modifiedAt,
          };

          if (idx === -1) {
            // Premier message reçu de quelqu'un pas encore dans la liste :
            // on construit la conversation à partir de l'expéditeur inclus
            // dans le message (voir MessageService.saveMessage → sender).
            if (!message.sender) return state; // pas assez d'info, un fetchConversations() la ramènera
            return { conversations: [{ interlocutor: message.sender, lastMessage }, ...state.conversations] };
          }

          const updated = { ...state.conversations[idx], lastMessage };
          const rest = state.conversations.filter((_, i) => i !== idx);
          return { conversations: [updated, ...rest] };
        });
      },

      // --- Points d'entrée temps réel (appelés depuis src/socket.js) ---

      receiveMessage: (message) => {
        const currentUser = useUserStore.getState().user;
        // Détermine l'ID de la conversation :
        // c'est l'ID de l'autre personne (pas de soi-même)
        const conversationId = message.senderId === currentUser?.id 
          ? message.receiverId  // Je suis le sender → convo avec le receiver
          : message.senderId;   // Je suis le receiver → convo avec le sender
        set((state) => {
          const existing = state.messagesByConversation[conversationId] || [];
          const alreadyKnown = existing.some((m) => m.id === message.id);
          return {
            messagesByConversation: alreadyKnown
              ? state.messagesByConversation
              : { ...state.messagesByConversation, [conversationId]: [...existing, message] },
          };
        });
        get()._touchConversation(conversationId, message);
      },

      handleMessageUpdated: (message) => {
        set((state) => {
          const conversationId = Object.keys(state.messagesByConversation).find((cid) =>
            (state.messagesByConversation[cid] || []).some((m) => m.id === message.id)
          );
          if (!conversationId) return state;
          return {
            messagesByConversation: {
              ...state.messagesByConversation,
              [conversationId]: state.messagesByConversation[conversationId].map((m) =>
                m.id === message.id ? message : m
              ),
            },
          };
        });
      },

      handleMessageDeleted: ({ messageId }) => {
        set((state) => {
          const next = { ...state.messagesByConversation };
          for (const cid of Object.keys(next)) {
            next[cid] = next[cid].filter((m) => m.id !== messageId);
          }
          return { messagesByConversation: next };
        });
      },

      clearError: () => set({ error: null, conversationsError: null, messagesError: null }),

      // Vide tout à la déconnexion — les messages sont une donnée privée,
      // pas question qu'ils traînent en mémoire/localStorage pour le
      // prochain compte connecté sur ce navigateur.
      reset: () =>
        set({
          conversations: [],
          activeConversationId: null,
          messagesByConversation: {},
          error: null,
          conversationsError: null,
          messagesError: null,
        }),
    }),
    {
      name: 'message-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ conversations: state.conversations }),
    }
  )
);
