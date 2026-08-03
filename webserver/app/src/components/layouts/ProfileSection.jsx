import React from 'react';
import { Link } from 'react-router-dom';
import avatardefault from '../../assets/profil_image.jpg'
import { useAuthStore } from '../../stores/authStore'
import { useUIStore } from '../../stores/uiStore';
import { Button } from '../UI/Button'
import Avatar from '../UI/Avatar'

function ProfileSection() {
  const { isAuthenticated, user, logout, login, register } = useAuthStore()
  const { openDropdowns, toggleDropdown, closeDropdown } = useUIStore()

  const isOpen = openDropdowns['profile'] || false

  const handleLogin = () => {
    login('test@example.com', 'password123')
  }

  const handleLogout = () => {
    logout()
    closeDropdown('profile')
  }

  const handleItemClick = () => {
    closeDropdown('profile')
  }
  
  if (!isAuthenticated) {
    return (
      <Button onClick={handleLogin} variant='ghost'>
        Se connecter
      </Button>
    );
  }

  return (
    <>
    {isOpen && (
      <div
        className='fixed inset-0 z-[999]'
        onClick={() => closeDropdown('profile')}
      />
    )}
    <div className="profile-section">
          <Button 
            onClick= {() => toggleDropdown('profile')} 
            variant='ghost'
            className='profile-button'
          >
            <Avatar
              src={user?.avatar || avatardefault}
              alt={user?.name || "Profil"} 
              size="sm"
            />
            <span>Profil</span>
          </Button>

          {isOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-header">
              <p className="user-name">{user?.name || 'Utilisateur'}</p>
              <p className="user-email">{user?.email || ''}</p>
            </div>

            <hr className="dropdown-divider" />

            <Link to="/profile" onClick={handleItemClick}>
              <button className="dropdown-item">
                👤 Mon Profil
              </button>
            </Link>

            <button className="dropdown-item" onClick={handleItemClick}>
              ⚙️ Paramètres
            </button>

            <button className="dropdown-item" onClick={handleItemClick}>
              🔐 Sécurité
            </button>

            <hr className="dropdown-divider" />

            <button 
              className="dropdown-item logout-item"
              onClick={handleLogout}
            >
              🚪 Se déconnecter
            </button>
          </div>
        )}
    </div>
    </>
  )
}

export default ProfileSection