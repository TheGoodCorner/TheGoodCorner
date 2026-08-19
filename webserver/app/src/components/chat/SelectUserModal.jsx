// components/SelectUserModal.jsx
import React, { useState, useEffect } from 'react';
import { GetAllUsers } from '../../api/userApi';


function SelectUserModal({ isOpen, onClose, onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await GetAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
    setLoading(false);
  };

  // Filtrer les utilisateurs selon la recherche
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Sélectionnez un utilisateur</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {loading ? (
          <p className="loading">Chargement...</p>
        ) : (
          <div className="users-list">
            {filteredUsers.length === 0 ? (
              <p className="no-users">Aucun utilisateur trouvé</p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="user-item"
                  onClick={() => {
                    onSelectUser(user);
                    onClose();
                  }}
                >
                  <div className="user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                  <span className="arrow">→</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectUserModal;
