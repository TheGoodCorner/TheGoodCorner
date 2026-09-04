import { Link } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore'
import { useCartStore } from '../../stores/cartStore'
import { useUIStore } from '../../stores/uiStore';
import { Button } from '../UI/Button';
import ProfileDropdown from '../profile/ProfileDropdown'
import { Moon, Sun, ShoppingCart, Bell } from 'lucide-react'

function Navbar() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const cartCount = useCartStore((state) => state.cartCount)
  const openUi = useUIStore((state) => state.openUi)

  return (
    <nav className={`navbar navbar-${theme}`}>
      <Link to="/" className="navbar-logo">
        🛍️ TheGoodCorner
      </Link>
      <Button
        onClick={toggleTheme}
        variant="ghost"
        icon={theme === 'light' ? Moon : Sun}
        title={`Passer au thème ${theme === 'light' ? 'sombre' : 'clair'}`}
        aria-label={`Passer au thème ${theme === 'light' ? 'sombre' : 'clair'}`}
      />
      <div className="container">
        <div className="navbar-wrapper">
          <ul className={`navbar-menu`}>
            <li><Link to="/" className="navbar-link">Accueil</Link></li>
            <li><Link to="/products" className="navbar-link">Produits</Link></li>
            <li><Link to="/messagerie" className="navbar-link">Messagerie</Link></li>
          </ul>
          <div className="navbar-actions">
            <ProfileDropdown />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
      <div className="relative">
        <Button
          variant='ghost'
          icon={Bell}
          title="Notifications"
          aria-label="Notifications"
        />
      </div>
      <div className="relative">
        <Button
          onClick={() => {openUi('cart-popover')}}
          variant='ghost'
          icon={ShoppingCart}
          title="Panier d'articles"
          aria-label="Panier d'articles"
        />
      {cartCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
          {cartCount}
        </div>
      )}
      </div>
      </div>
    </nav>
  );
}

export default Navbar;
