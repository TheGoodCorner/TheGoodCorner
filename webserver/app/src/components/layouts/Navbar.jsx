import { Link } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore'
import { useCartStore } from '../../stores/cartStore'
import { useMessageStore } from '../../stores/messageStore'
import { useUIStore } from '../../stores/uiStore';
import { Button } from '../UI/Button';
import { Moon, Sun, ShoppingCart, Bell } from 'lucide-react'
import { useClickOutside } from '../../hooks/useClickOutside'
import { NotificationPopover } from '../../pages/NotificationPopover'
import { useAuthStore } from '../../stores/authStore'

import ProfileDropdown from '../profile/ProfileDropdown'

function Navbar() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const cartCount = useCartStore((state) => state.cartCount)
  const unreadCounts = useMessageStore((state) => state.unreadCounts)
  const notificationCount = Object.values(unreadCounts).reduce((sum, n) => sum + n, 0)
  const openUi = useUIStore((state) => state.openUi)
  const toggleUi = useUIStore((state) => state.toggleUi)
  const closeUi = useUIStore((state) => state.closeUi)
  const isNotifOpen = useUIStore((state) => state.UserInterfaces['notification-popover']) || false
  const notifRef = useClickOutside(() => closeUi('notification-popover'), isNotifOpen)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  
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
      {isAuthenticated && (
        <div className="relative" ref={notifRef}>
          <Button
            onClick={() => {toggleUi('notification-popover')}}
            variant='ghost'
            icon={Bell}
            title="Notifications"
            aria-label="Notifications"
          />
          {notificationCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {notificationCount}
            </div>
          )}
          <NotificationPopover />
        </div>
      )}
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
