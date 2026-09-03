import { create } from 'zustand';
import {
  sendFriendRequestRequest,
  acceptFriendRequestRequest,
  rejectFriendRequestRequest,
  deleteFriendRequestRequest,
  fetchFriendRequestsRequest,
  fetchFriendsRequest,
} from '../api/friendApi';

export const useFriendStore = create((set) => ({
  // Amitié : liste d'amis acceptés + demandes en attente. `friends` et
  // `friendRequests` (reçues) existaient déjà ; `sentFriendRequests` est
  // nouveau — sans lui impossible d'afficher "mes demandes envoyées",
  // /friend-requests/pending ne renvoyant que les demandes reçues.
  friends: [],
  friendRequests: [], // demandes REÇUES en attente (PENDING)
  sentFriendRequests: [], // demandes ENVOYÉES en attente (PENDING)
  submitting: false,
  error: null,

  // POST /friend-requests — affecte TES demandes envoyées, pas les reçues.
  sendFriendRequest: async (receiverId) => {
    set({ submitting: true, error: null });
    try {
      const newRequest = await sendFriendRequestRequest(receiverId);
      set((state) => ({ sentFriendRequests: [...state.sentFriendRequests, newRequest], submitting: false }));
      return newRequest;
    } catch (err) {
      set({ error: err.message, submitting: false });
      console.error('sendFriendRequest error:', err);
      throw err;
    }
  },

  // PATCH .../accept — retire la demande de tes demandes reçues et ajoute
  // l'expéditeur à ta liste d'amis.
  acceptFriendRequest: async (id) => {
    set({ submitting: true, error: null });
    try {
      const accepted = await acceptFriendRequestRequest(id);
      set({ submitting: false });
      return accepted;
    } catch (err) {
      set({ error: err.message, submitting: false });
      console.error('acceptFriendRequest error:', err);
      throw err;
    }
  },

  // PATCH .../reject — retire la demande de tes demandes reçues.
  rejectFriendRequest: async (id) => {
    set({ submitting: true, error: null });
    try {
      const rejected = await rejectFriendRequestRequest(id);
      set({ submitting: false });
      return rejected;
    } catch (err) {
      set({ error: err.message, submitting: false });
      console.error('rejectFriendRequest error:', err);
      throw err;
    }
  },

  // DELETE /friend-requests/:id — sert à la fois à annuler une demande
  // envoyée et à retirer un ami (même endpoint côté back, seul l'id passé
  // change). On ne sait pas toujours lequel des deux cas c'est d'ici, donc
  // on rafraîchit les deux listes concernées ; celle qui n'est pas
  // concernée ne changera juste pas.
  deleteFriendRequest: async (id) => {
    set({ submitting: true, error: null });
    try {
      await deleteFriendRequestRequest(id);
      set({ submitting: false });

    } catch (err) {
      set({ error: err.message, submitting: false });
      console.error('deleteFriendRequest error:', err);
      throw err;
    }
  },


  // GET /friend-requests?status=PENDING&type=received — demandes REÇUES
  fetchReceivedFriendRequests: async () => {
    try {
      const data = await fetchFriendRequestsRequest({ status: 'PENDING', type: 'received' });
      console.log("data.received dans fetchReceivedFriendRequests:", data.received);
      set({ friendRequests: data?.received || [] });
    } catch (err) {
      console.error('fetchReceivedFriendRequests error:', err);
    }
  },

  // GET /friend-requests?status=PENDING&type=sent — demandes que TU as
  // envoyées et qui attendent encore une réponse. Pas de raccourci
  // dédié côté back pour ça (/pending ne donne que les reçues), donc
  // on repasse par la route générique avec le bon filtre.
  fetchSentFriendRequests: async () => {
    try {
      const data = await fetchFriendRequestsRequest({ status: 'PENDING', type: 'sent' });
      console.log("data.sent dans fetchSentfriendreuests de store :", data.sent)
      console.log("data dans fetchSentfriendreuests de store :", data)
      set({ sentFriendRequests: data?.sent || [] });
    } catch (err) {
      console.error('fetchSentFriendRequests error:', err);
    }
  },

    // GET /friends. La route ne renvoie que l'id de l'UTILISATEUR ami,
    // alors que "retirer un ami" (DELETE /friend-requests/:id) attend
    // l'id de la FriendRequest sous-jacente. On le retrouve en croisant
    // avec les requests ACCEPTED (reçues + envoyées) et on l'attache à
    // chaque ami sous `friendRequestId`.
    // → Si un jour le back ajoute ce champ directement dans la réponse
    // de /friends, ce croisement (et l'appel réseau en plus qu'il coûte)
    // pourra sauter.
    fetchFriends: async () => {
      try {
        const [friendsData, acceptedData] = await Promise.all([
          fetchFriendsRequest(),
          fetchFriendRequestsRequest({ status: 'ACCEPTED' }),
        ]);
        const acceptedRequests = [
          ...(acceptedData?.received || []),
          ...(acceptedData?.sent || []),
        ];
        const friends = (friendsData?.friends || []).map((friend) => {
          const match = acceptedRequests.find(
            (r) => r.sender?.id === friend.id || r.receiver?.id === friend.id
          );
          return { ...friend, friendRequestId: match?.id ?? null };
        });
        set({ friends });
      } catch (err) {
        console.error('fetchFriends error:', err);
      }
    },

  clearError: () => set({ error: null }),
}));
