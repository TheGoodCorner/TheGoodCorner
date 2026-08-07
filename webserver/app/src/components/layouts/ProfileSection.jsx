import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../UI/Button';
import Avatar from '../UI/Avatar';
import { Dropdown } from '../UI/Dropdown';
import { LogOut, UserRound, MessageCircle, Settings} from 'lucide-react'

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
        <Avatar src={user?.avatar} alt={user?.username || 'Profil'} size="sm" />
        <span>{user?.username || 'Profil'}</span>
      </Dropdown.Trigger>

      <Dropdown.Menu>
        <Dropdown.Label>
          <p className="text-base font-medium text-[var(--color-text)]">
            {user?.username || 'Utilisateur'}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">{user?.email || ''}</p>
        </Dropdown.Label>

        <Dropdown.Separator />

        <Dropdown.Item as={Link} to="/profile">
          <UserRound/>
            Mon Profil
        </Dropdown.Item>
        <Dropdown.Item>
          <MessageCircle/>
            Mes messages
        </Dropdown.Item>
        <Dropdown.Item>
          <Settings/>
            Parametres
        </Dropdown.Item>

        <Dropdown.Separator />

        <Dropdown.Item variant="danger" onClick={logout}>
          <LogOut/>
            Se déconnecter
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ProfileSection;
