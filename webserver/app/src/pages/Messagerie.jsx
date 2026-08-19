import React, { useState } from 'react';

const MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: "Sarah Dupont",
    avatar: "SD",
    lastMessage: "Merci pour votre aide !",
    timestamp: "10:30",
    unread: 2
  },
  {
    id: 2,
    name: "Support Technique",
    avatar: "ST",
    lastMessage: "Votre commande a été expédiée",
    timestamp: "Hier",
    unread: 0
  },
  {
    id: 3,
    name: "Jean Martin",
    avatar: "JM",
    lastMessage: "Question sur le produit XYZ",
    timestamp: "Lun 18",
    unread: 5
  },
  {
    id: 4,
    name: "Marie Leclerc",
    avatar: "ML",
    lastMessage: "Confirmation de retour reçue",
    timestamp: "Sam 16",
    unread: 0
  },
  {
    id: 5,
    name: "Équipe Logistique",
    avatar: "EL",
    lastMessage: "Livraison prévue demain entre 14h et 18h",
    timestamp: "Ven 15",
    unread: 1
  }
];

const MOCK_MESSAGES = {
  1: [
    { id: 1, sender: "Sarah Dupont", text: "Bonjour, j'ai une question sur ma commande #12345", timestamp: "10:15", isOwn: false },
    { id: 2, sender: "Admin", text: "Bonjour Sarah ! Je suis là pour vous aider. Quel est votre problème ?", timestamp: "10:18", isOwn: true },
    { id: 3, sender: "Sarah Dupont", text: "Le produit reçu n'a pas la bonne taille. C'est vraiment dommage...", timestamp: "10:20", isOwn: false },
    { id: 4, sender: "Admin", text: "Je suis désolé d'apprendre ça. Je vous envoie une étiquette de retour tout de suite.", timestamp: "10:25", isOwn: true },
    { id: 5, sender: "Sarah Dupont", text: "Merci pour votre aide !", timestamp: "10:30", isOwn: false }
  ],
  2: [
    { id: 1, sender: "Support Technique", text: "Bonjour, votre commande #12346 a été préparée", timestamp: "09:00", isOwn: false },
    { id: 2, sender: "Admin", text: "Merci de votre achat !", timestamp: "09:05", isOwn: true },
    { id: 3, sender: "Support Technique", text: "Votre commande a été expédiée", timestamp: "14:30", isOwn: false }
  ],
  3: [
    { id: 1, sender: "Jean Martin", text: "Bonjour, je voudrais savoir les dimensions exactes du produit", timestamp: "08:00", isOwn: false },
    { id: 2, sender: "Jean Martin", text: "C'est pour savoir si ça rentre dans mon espace", timestamp: "08:05", isOwn: false },
    { id: 3, sender: "Jean Martin", text: "Quelqu'un peut répondre ?", timestamp: "09:30", isOwn: false },
    { id: 4, sender: "Jean Martin", text: "Je suis intéressé par une commande groupée aussi", timestamp: "11:00", isOwn: false },
    { id: 5, sender: "Jean Martin", text: "Question sur le produit XYZ", timestamp: "13:45", isOwn: false }
  ],
  4: [
    { id: 1, sender: "Marie Leclerc", text: "Bonjour, j'aimerais retourner mon article", timestamp: "Hier", isOwn: false },
    { id: 2, sender: "Admin", text: "Bien sûr ! Je traite votre demande.", timestamp: "Hier", isOwn: true },
    { id: 3, sender: "Marie Leclerc", text: "Merci beaucoup", timestamp: "Hier", isOwn: false },
    { id: 4, sender: "Admin", text: "Confirmation de retour reçue", timestamp: "Aujourd'hui", isOwn: true }
  ],
  5: [
    { id: 1, sender: "Équipe Logistique", text: "Votre colis est en transit", timestamp: "Ven 15 14:00", isOwn: false },
    { id: 2, sender: "Équipe Logistique", text: "Livraison prévue demain entre 14h et 18h", timestamp: "Ven 15 16:30", isOwn: false }
  ]
};

function Messagerie() {
  // États pour gérer les conversations et messages
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState(MOCK_CONVERSATIONS[0]);
  const [messages, setMessages] = useState(MOCK_MESSAGES[MOCK_CONVERSATIONS[0].id]);
  const [messageText, setMessageText] = useState("");

  // Fonction pour envoyer un message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim() === '') return;

    // À implémenter : ajouter le message à la liste
    // const newMessage = { id: messages.length + 1, sender: 'admin', text: messageText, timestamp: new Date() };
    // setMessages([...messages, newMessage]);

    setMessageText('');
  };

  // Fonction pour sélectionner une conversation
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    // ✅ MODIF : Charger les messages de la conversation sélectionnée
    setMessages(MOCK_MESSAGES[conversation.id]);
  };

  return (
    <div className="messagerie-container">
      {/* En-tête */}
      <div className="messagerie-header">
        <h1>Messagerie</h1>
        <p className="subtitle">Gérez vos conversations avec les clients</p>
      </div>

      {/* Contenu principal */}
      <div className="messagerie-content">
        {/* Sidebar - Liste des conversations */}
        <aside className="messagerie-sidebar">
          <div className="sidebar-header">
            <h2>Conversations</h2>
            {/* À ajouter : bouton pour nouvelle conversation */}
          </div>

          <div className="conversations-list">
            {conversations.length === 0 ? (
              <p className="empty-state">Aucune conversation</p>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="conversation-avatar">
                    {/* ✅ MODIF : Utiliser avatar ou les initiales */}
                    {conversation.avatar}
                  </div>
                  <div className="conversation-info">
                    <h3>{conversation.name}</h3>
                    <p className="last-message">{conversation.lastMessage}</p>
                  </div>
                  <div className="conversation-meta">
                    {/* ✅ MODIF : Ajouter le timestamp */}
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
                <p className="conversation-meta">
                  {/* À ajouter : infos sur le client, numéro de commande, etc. */}
                </p>
              </div>

              {/* Zone des messages */}
              <div className="messages-container">
                {messages.length === 0 ? (
                  <p className="empty-messages">Aucun message dans cette conversation</p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.isOwn ? 'sent' : 'received'}`}
                    >
                      <div className="message-bubble">
                        <p>{message.text}</p>
                        <span className="message-time">{message.timestamp}</span>
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
              <p>Sélectionnez une conversation pour commencer</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Messagerie;
