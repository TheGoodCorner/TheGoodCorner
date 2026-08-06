import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../UI/Button';
import Avatar from '../UI/Avatar';
import { Dropdown } from '../UI/Dropdown';

function ProfileSection() {
  const { isAuthenticated, user, logout, login } = useAuthStore();


  if (!isAuthenticated) {
    return (
      <Button to="/authentication" variant="ghost">
        <Avatar size="sm" />
        Se connecter
      </Button>
    );
  }

  return (
    <Dropdown>
      <Dropdown.Trigger as={Button} variant="ghost">
        <Avatar src={user?.avatar} alt={user?.name || 'Profil'} size="sm" />
        <span>Profil</span>
      </Dropdown.Trigger>

      <Dropdown.Menu>
        <Dropdown.Label>
          <p className="text-sm font-medium text-[var(--color-text)]">
            {user?.name || 'Utilisateur'}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">{user?.email || ''}</p>
        </Dropdown.Label>

        <Dropdown.Separator />

        <Dropdown.Item as={Link} to="/profile">
          👤 Mon Profil
        </Dropdown.Item>
        <Dropdown.Item>⚙️ Paramètres</Dropdown.Item>
        <Dropdown.Item>🔐 Sécurité</Dropdown.Item>

        <Dropdown.Separator />

        <Dropdown.Item variant="danger" onClick={logout}>
          🚪 Se déconnecter
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ProfileSection;
