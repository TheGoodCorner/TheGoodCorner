import { Link } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore'
import { useCartStore } from '../../stores/cartStore'
import { Button } from '../UI/Button';
import ProfileSection from './ProfileSection'
import { Moon, Sun } from 'lucide-react'

function Navbar() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const cartCount = useCartStore((state) => state.cartCount)

  return (
    <nav className={`navbar navbar-${theme}`}>
          <Link to="/" className="navbar-logo">
            🛍️ TheGoodCorner
          </Link>
      <div className="container">
        <div className="navbar-wrapper">
          
          <ul className={`navbar-menu`}>
            <li><Link to="/" className="navbar-link">Accueil</Link></li>
            <li><Link to="/products" className="navbar-link">Produits</Link></li>
            <li><Link to="/contact" className="navbar-link">Messagerie</Link></li>
          </ul>
          <div className="navbar-actions">
            <ProfileSection />
          </div>

        </div>
      </div>

          <Button
            onClick={toggleTheme}
            variant="ghost"
            icon={theme === 'light' ? Moon : Sun}
            title={`Passer au thème ${theme === 'light' ? 'sombre' : 'clair'}`}
            aria-label={`Passer au thème ${theme === 'light' ? 'sombre' : 'clair'}`}
          />
    </nav>
  );
}

export default Navbar;
