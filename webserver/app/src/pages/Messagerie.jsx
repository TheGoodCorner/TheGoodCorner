// Messagerie.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { SendMessage, GetMessage, GetAllMessages } from '../api/messageApi';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';
import SelectUserModal from '../components/chat/SelectUserModal';

function Messagerie() {
  const { user } = useUserStore();
  const { isAuthenticated, initializing } = useAuthStore()

  // États pour les conversations
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadConversations();
    }
  }, [user?.id, isAuthenticated]);

  const loadConversations = async () => {
  if (!isAuthenticated || !user?.id) return;
  
  try {
    setLoading(true);
    // ✅ Appeler la bonne fonction
    const convList = await GetAllMessages();
    
    // ✅ Vérifier que c'est un tableau
    if (Array.isArray(convList)) {
      setConversations(convList);
    } else {
      setConversations([]);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des conversations:', error);
    setConversations([]);
  } finally {
    setLoading(false);
  }
};

  // ✅ Quand on sélectionne un utilisateur dans la modal
  const handleSelectUser = async (selectedUser) => {
    const conversation = {
      id: selectedUser.id,
      userId: selectedUser.id,
      name: selectedUser.name,
      avatar: selectedUser.avatar,
      lastMessage: "Démarrer une nouvelle conversation",
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      unread: 0
    };

    setSelectedConversation(conversation);

    // ✅ Charger les messages existants
    try {
      const msgs = await GetMessage(user?.id, selectedUser.id);
      setMessages(msgs || []);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      setMessages([]);
    }

    // ✅ Ajouter à la liste si nouveau
    if (!conversations.find(c => c.userId === selectedUser.id)) {
      setConversations([conversation, ...conversations]);
    }
  };

  // ✅ Sélectionner une conversation existante
  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);

    try {
      const msgs = await GetMessage(user?.id, conversation.userId);
      setMessages(msgs || []);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  // ✅ Envoyer un message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    try {
      await SendMessage(user?.id, selectedConversation.userId, messageText);

      // Recharger les messages
      const msgs = await GetMessage(user?.id, selectedConversation.userId);
      setMessages(msgs || []);

      setMessageText('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };


  // ✅ PLACEHOLDER - Si pas connecté ou en cours d'initialisation
  if (initializing) {
    return (
      <div className="messagerie-container">
        <div className="messagerie-header">
          <h1>Messagerie</h1>
          <p className="subtitle">Gérez vos conversations</p>
        </div>
        <div className="auth-placeholder">
          <div className="placeholder-content">
            <p>Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.id) {
    return (
      <div className="messagerie-container">
        <div className="messagerie-header">
          <h1>Messagerie</h1>
          <p className="subtitle">Gérez vos conversations</p>
        </div>

        {/* ✅ PLACEHOLDER D'AUTHENTIFICATION */}
        <div className="auth-placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">💬</div>
            <h2>Connectez-vous pour accéder à la messagerie</h2>
            <p>Créez un compte ou connectez-vous pour commencer à discuter avec d'autres utilisateurs.</p>
            
            <div className="placeholder-buttons">
              <Link to="/authentication" className="btn-login">
                Se connecter
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="messagerie-container">
      {/* En-tête */}
      <div className="messagerie-header">
        <h1>Messagerie</h1>
        <p className="subtitle">Gérez vos conversations</p>
      </div>

      {/* Contenu principal */}
      <div className="messagerie-content">
        {/* Sidebar - Liste des conversations */}
        <aside className="messagerie-sidebar">
          <div className="sidebar-header">
            <h2>Conversations</h2>
            <button
              className="create-conversation-btn"
              onClick={() => setShowUserModal(true)}
            >
              ➕ Nouvelle discussion
            </button>
          </div>

          <div className="conversations-list">
            {conversations.length === 0 ? (
              <p className="empty-state">Aucune conversation. Créez-en une!</p>
            ) : (
              conversations?.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="conversation-avatar">
                    {conversation.avatar ? (
                      <img src={conversation.avatar} alt={conversation.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {conversation.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="conversation-info">
                    <h3>{conversation.name}</h3>
                    <p className="last-message">{conversation.lastMessage}</p>
                  </div>
                  <div className="conversation-meta">
                    <span className="timestamp">{conversation.timestamp}</span>
                  </div>
                  {conversation.unread > 0 && (
                    <span className="unread-badge">{conversation.unread}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Zone de conversation */}
        <main className="messagerie-main">
          {selectedConversation ? (
            <>
              {/* En-tête de la conversation */}
              <div className="conversation-header">
                <h2>{selectedConversation.name}</h2>
              </div>

              {/* Zone des messages */}
              <div className="messages-container">
                {messages.length === 0 ? (
                  <p className="empty-messages">Aucun message pour le moment</p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.sender_id === user?.id ? 'sent' : 'received'}`}
                    >
                      <div className="message-bubble">
                        <p>{message.content}</p>
                        <span className="message-time">
                          {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Zone de saisie */}
              <form className="message-input-area" onSubmit={handleSendMessage}>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="message-input"
                  rows="3"
                />
                <button type="submit" className="send-button">
                  Envoyer
                </button>
              </form>
            </>
          ) : (
            <div className="no-conversation">
              <p>Sélectionnez une conversation ou créez une nouvelle discussion</p>
            </div>
          )}
        </main>
      </div>

      {/* Modal de sélection d'utilisateur */}
      <SelectUserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
}

export default Messagerie;
