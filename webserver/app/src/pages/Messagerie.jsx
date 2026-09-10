import { useEffect, useState } from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';
import { useMessageStore } from '../stores/messageStore';
import { Button } from '../components/UI/Button';
import SelectUserModal from '../components/chat/SelectUserModal';
import ConversationsSidebar from '../components/chat/ConversationsSidebar';
import ChatThread from '../components/chat/ChatThread';

function Messagerie() {
  const currentUser = useUserStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initializing = useAuthStore((state) => state.initializing);

  const conversations = useMessageStore((state) => state.conversations);
  const hiddenConversationIds = useMessageStore((state) => state.hiddenConversationIds);
  const hideConversation = useMessageStore((state) => state.hideConversation);
  const unreadCounts = useMessageStore((state) => state.unreadCounts);
  const clearActiveConversation = useMessageStore((state) => state.clearActiveConversation);
  const conversationsLoading = useMessageStore((state) => state.conversationsLoading);
  const fetchConversations = useMessageStore((state) => state.fetchConversations);
  const activeConversationId = useMessageStore((state) => state.activeConversationId);
  const setActiveConversation = useMessageStore((state) => state.setActiveConversation);
  const messagesByConversation = useMessageStore((state) => state.messagesByConversation);
  const messagesLoading = useMessageStore((state) => state.messagesLoading);
  const sendMessage = useMessageStore((state) => state.sendMessage);
  const sending = useMessageStore((state) => state.sending);
  const startConversationWith = useMessageStore((state) => state.startConversationWith);
  const updateMessage = useMessageStore((state) => state.updateMessage);
  const deleteMessage = useMessageStore((state) => state.deleteMessage);
  const [sendError, setSendError] = useState(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [search, setSearch] = useState('');

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  // Sur mobile, on affiche soit la liste soit la conversation ouverte
  const [showThreadOnMobile, setShowThreadOnMobile] = useState(false);

  useEffect(() => {
    if (isAuthenticated && currentUser?.id) {
      fetchConversations();
    }
  }, [isAuthenticated, currentUser?.id, fetchConversations]);

  useEffect(() => {
    return () => {
      clearActiveConversation();
    };
  }, [clearActiveConversation]);

  const activeConversation =
    conversations.find((c) => String(c.interlocutor.id) === String(activeConversationId)) || null;
  const activeMessages = activeConversationId ? messagesByConversation[activeConversationId] || [] : [];

  const startEditingMessage = (message) => {
    setEditingMessageId(message.id);
    setEditingContent(message.content);
  };

  const cancelEditingMessage = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  const saveEditingMessage = async () => {
    const trimmed = editingContent.trim();
    const messageId = editingMessageId;
    const original = activeMessages.find((m) => m.id === messageId)?.content;
    setEditingMessageId(null);

    // Sécurité de longueur et de contenu
    if (!trimmed || !activeConversationId || trimmed === original || trimmed.length > 5000) return;

    try {
      await updateMessage(messageId, activeConversationId, trimmed);
    } catch {
      // rollback déjà appliqué dans le store
    }
  };

  const handleDeleteConversation = (interlocutorId) => {
    hideConversation(interlocutorId);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId, activeConversationId);
    } catch {
      // rollback déjà appliqué dans le store
    }
  };

  const handleSelectConversation = (conversationId) => {
    setActiveConversation(conversationId);
    setShowThreadOnMobile(true);
  };

  const handleSelectUser = (selectedUser) => {
    startConversationWith(selectedUser);
    setShowThreadOnMobile(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
	setSendError(null);
    const trimmed = messageText.trim();
    
    // Sécurité de longueur et contenu vide
    if (!trimmed || !activeConversationId || trimmed.length > 5000) {
		setSendError('Le message est trop long (maximum 5000 caractères).');
		return;
	}

    setMessageText('');
    try {
      await sendMessage(activeConversationId, trimmed);
    } catch (err) {
      setMessageText(trimmed); // Restauration en cas d'échec
	  setSendError(err?.message || 'Erreur lors de l\'envoi du message');
    }
	const handleMessageTextChange = (text) => {
	  setMessageText(text);
	  if (sendError)
		setSendError(null);
	};
  };

  if (initializing) {
    return <div className="container py-16 text-center text-[var(--color-text-muted)]">Chargement...</div>;
  }

  if (!isAuthenticated || !currentUser?.id) {
    return (
      <div className="w-full min-h-[calc(100vh-theme(spacing.16))] flex items-center justify-center bg-transparent">
        <div className="container py-16 text-center">
          <MessageCircle size={40} className="text-[var(--color-text)] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            Connecte-toi pour accéder à ta messagerie
          </h1>
          <p className="text-[var(--color-text)] mb-6">
            Retrouve ici toutes tes conversations avec les autres utilisateurs.
          </p>
          <Button to="/authentication" variant="primary">Se connecter</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg)]">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">Messagerie</h1>
          <Button variant="primary" icon={Plus} onClick={() => setShowUserModal(true)}>
            Nouvelle discussion
          </Button>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-lg overflow-hidden h-[calc(100vh-14rem)] min-h-[480px] flex">
          <ConversationsSidebar
            conversations={conversations}
            hiddenConversationIds={hiddenConversationIds}
            unreadCounts={unreadCounts}
            loading={conversationsLoading}
            activeConversationId={activeConversationId}
            search={search}
            onSearchChange={setSearch}
            onSelectConversation={handleSelectConversation}
            onNewConversation={() => setShowUserModal(true)}
            onDeleteConversation={handleDeleteConversation}
            className={showThreadOnMobile ? 'hidden sm:flex' : 'flex'}
          />

          {/* min-w-0 est indispensable pour empêcher les enfants flex de forcer la largeur */}
          <div className={`flex-1 min-w-0 flex-col ${showThreadOnMobile ? 'flex' : 'hidden sm:flex'}`}>
            <ChatThread
              conversation={activeConversation}
              messages={activeMessages}
              messagesLoading={messagesLoading}
              currentUserId={currentUser.id}
              editingMessageId={editingMessageId}
              editingContent={editingContent}
			  sendError={sendError}
              onEditingContentChange={setEditingContent}
              onStartEdit={startEditingMessage}
              onSaveEdit={saveEditingMessage}
              onCancelEdit={cancelEditingMessage}
              onDeleteMessage={handleDeleteMessage}
              messageText={messageText}
              onMessageTextChange={setMessageText}
              onSendMessage={handleSendMessage}
              sending={sending}
              onBack={() => setShowThreadOnMobile(false)}
            />
          </div>
        </div>
      </div>

      <SelectUserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
}

export default Messagerie;