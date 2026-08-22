import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Plus, Send, Search, ArrowLeft } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';
import { useMessageStore } from '../stores/messageStore';
import { Button } from '../components/UI/Button';
import { getInitials, getAvatarColor } from '../utils/avatar';
import SelectUserModal from '../components/chat/SelectUserModal';

function formatMessageTime(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatConversationTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const isToday = date.toDateString() === new Date().toDateString();
  return isToday
    ? date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

function Messagerie() {
  const currentUser = useUserStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initializing = useAuthStore((state) => state.initializing);

  const conversations = useMessageStore((state) => state.conversations);
  const conversationsLoading = useMessageStore((state) => state.conversationsLoading);
  const fetchConversations = useMessageStore((state) => state.fetchConversations);
  const activeConversationId = useMessageStore((state) => state.activeConversationId);
  const setActiveConversation = useMessageStore((state) => state.setActiveConversation);
  const messagesByConversation = useMessageStore((state) => state.messagesByConversation);
  const messagesLoading = useMessageStore((state) => state.messagesLoading);
  const sendMessage = useMessageStore((state) => state.sendMessage);
  const sending = useMessageStore((state) => state.sending);
  const startConversationWith = useMessageStore((state) => state.startConversationWith);

  const [showUserModal, setShowUserModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [search, setSearch] = useState('');
  // Sur mobile, on affiche soit la liste soit la conversation ouverte,
  // jamais les deux en même temps (pas assez de place).
  const [showThreadOnMobile, setShowThreadOnMobile] = useState(false);

  useEffect(() => {
    if (isAuthenticated && currentUser?.id) {
      fetchConversations();
    }
  }, [isAuthenticated, currentUser?.id, fetchConversations]);

  if (initializing) {
    return <div className="container py-16 text-center text-[var(--color-text-muted)]">Chargement...</div>;
  }

  if (!isAuthenticated || !currentUser?.id) {
    return (
      <div className="container py-16 text-center bg-[var(--color-bg)]">
        <MessageCircle size={40} className="text-[var(--color-text-muted)] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
          Connecte-toi pour accéder à ta messagerie
        </h1>
        <p className="text-[var(--color-text-muted)] mb-6">
          Retrouve ici toutes tes conversations avec les autres utilisateurs.
        </p>
        <Button to="/authentication" variant="primary">Se connecter</Button>
      </div>
    );
  }

  const activeConversation =
    conversations.find((c) => String(c.interlocutor.id) === String(activeConversationId)) || null;
  const activeMessages = activeConversationId ? messagesByConversation[activeConversationId] || [] : [];

  const filteredConversations = search.trim()
    ? conversations.filter((c) => c.interlocutor.username?.toLowerCase().includes(search.trim().toLowerCase()))
    : conversations;

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
    const trimmed = messageText.trim();
    if (!trimmed || !activeConversationId) return;
    setMessageText('');
    try {
      await sendMessage(activeConversationId, trimmed);
    } catch {
      setMessageText(trimmed); // on remet le texte si l'envoi échoue
    }
  };

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
          {/* Liste des conversations */}
          <aside
            className={`w-full sm:w-80 flex-shrink-0 border-r border-[var(--color-border)] flex-col ${
              showThreadOnMobile ? 'hidden sm:flex' : 'flex'
            }`}
          >
            <div className="p-3 border-b border-[var(--color-border)]">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une conversation..."
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversationsLoading ? (
                <div className="p-3 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-[var(--radius-md)] bg-[var(--color-surface-hover)] animate-pulse" />
                  ))}
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6 py-16">
                  <p className="text-sm text-[var(--color-text-muted)] mb-4">Aucune conversation pour l'instant.</p>
                  <Button variant="outline" size="sm" icon={Plus} onClick={() => setShowUserModal(true)}>
                    Démarrer une discussion
                  </Button>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const { interlocutor, lastMessage } = conversation;
                  const isActive = String(interlocutor.id) === String(activeConversationId);
                  return (
                    <button
                      key={interlocutor.id}
                      onClick={() => handleSelectConversation(interlocutor.id)}
                      className={`w-full flex items-center gap-3 p-3 text-left border-b border-[var(--color-border)] transition-colors ${
                        isActive ? 'bg-[var(--color-surface-hover)]' : 'hover:bg-[var(--color-surface-hover)]'
                      }`}
                    >
                      {interlocutor.avatar ? (
                        <img
                          src={interlocutor.avatar}
                          alt={interlocutor.username}
                          className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div
                          className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold ${getAvatarColor(interlocutor.username)}`}
                        >
                          {getInitials(interlocutor.username)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-[var(--color-text)] truncate">
                            {interlocutor.username}
                          </span>
                          {lastMessage?.createdAt && (
                            <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0">
                              {formatConversationTime(lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                          {lastMessage?.content || 'Nouvelle conversation'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Fil de discussion */}
          <div className={`flex-1 flex-col ${showThreadOnMobile ? 'flex' : 'hidden sm:flex'}`}>
            {!activeConversation ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <MessageCircle size={40} className="text-[var(--color-text-muted)] mb-4" />
                <p className="font-semibold text-[var(--color-text)] mb-1">Sélectionne une conversation</p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Choisis une discussion dans la liste, ou démarre-en une nouvelle.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 p-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                  <button
                    onClick={() => setShowThreadOnMobile(false)}
                    className="sm:hidden text-[var(--color-text-muted)]"
                    aria-label="Retour aux conversations"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <Link
                    to={`/profile/${activeConversation.interlocutor.id}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    {activeConversation.interlocutor.avatar ? (
                      <img
                        src={activeConversation.interlocutor.avatar}
                        alt={activeConversation.interlocutor.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${getAvatarColor(activeConversation.interlocutor.username)}`}
                      >
                        {getInitials(activeConversation.interlocutor.username)}
                      </div>
                    )}
                    <span className="font-semibold text-[var(--color-text)]">
                      {activeConversation.interlocutor.username}
                    </span>
                  </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--color-bg)]">
                  {messagesLoading && activeMessages.length === 0 ? (
                    <div className="space-y-3 animate-pulse">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-10 w-2/3 rounded-[var(--radius-lg)] bg-[var(--color-surface-hover)] ${i % 2 ? 'ml-auto' : ''}`}
                        />
                      ))}
                    </div>
                  ) : activeMessages.length === 0 ? (
                    <p className="text-center text-sm text-[var(--color-text-muted)] mt-8">
                      Aucun message pour le moment — dis bonjour !
                    </p>
                  ) : (
                    activeMessages.map((message) => {
                      const isMine = String(message.senderId) === String(currentUser.id);
                      return (
                        <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[75%] sm:max-w-[60%] rounded-[var(--radius-lg)] px-4 py-2.5 ${
                              isMine
                                ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-br-sm'
                                : 'bg-[var(--color-surface-hover)] text-[var(--color-text)] rounded-bl-sm'
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                            <p className={`text-[10px] mt-1 ${isMine ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}>
                              {formatMessageTime(message.createdAt)}
                              {message.modifiedAt ? ' · modifié' : ''}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="flex items-center gap-3 p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Écris un message..."
                    disabled={sending}
                    className="flex-1 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-colors disabled:opacity-60"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    icon={Send}
                    iconOnly
                    disabled={sending || !messageText.trim()}
                    aria-label="Envoyer"
                  />
                </form>
              </>
            )}
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
