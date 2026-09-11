import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trans, useLingui } from '@lingui/react/macro';
import { useThemeStore } from '../../stores/themeStore';
import { useCartStore } from '../../stores/cartStore';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { Button } from '../UI/Button';
import Avatar from '../UI/Avatar';
import {
  Moon,
  Sun,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  UserRound,
  MessageCircle,
  Settings,
  Package,
} from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { NotificationBell } from './NotificationBell';

function Navbar() {
  const { t } = useLingui();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const cartCount = useCartStore((state) => state.cartCount);
  const { isAuthenticated, logout, initializing } = useAuthStore();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const openUi = useUIStore((state) => state.openUi);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useClickOutside(() => setProfileOpen(false), profileOpen);

  const userMenuItems = useMemo(
    () => [
      { to: '/profile', icon: UserRound, label: t`Mon profil` },
      { to: '/messagerie', icon: MessageCircle, label: t`Messagerie` },
      { to: '/orders', icon: Package, label: t`Mes commandes` },
      { to: '/settings', icon: Settings, label: t`Paramètres` },
    ],
    [t]
  );

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const navLink =
    'px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors';

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link
            to="/"
            className="text-xl font-bold text-[var(--color-primary)] whitespace-nowrap flex-shrink-0"
          >
            🛍️ TheGoodCorner
          </Link>

          <ul className="hidden md:flex items-center gap-1 flex-1">
            <li>
              <Link to="/" className={navLink}>
                <Trans>Accueil</Trans>
              </Link>
            </li>
            <li>
              <Link to="/products" className={navLink}>
                <Trans>Produits</Trans>
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link to="/messagerie" className={navLink}>
                  <Trans>Messagerie</Trans>
                </Link>
              </li>
            )}
          </ul>

          <div className="hidden md:flex items-center gap-1">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              icon={theme === 'light' ? Moon : Sun}
              aria-label={t`Thème`}
            />

            {/* Desktop Notification Bell */}
            {isAuthenticated && <NotificationBell />}

            <div className="relative">
              <Button
                onClick={() => openUi('cart-popover')}
                variant="ghost"
                icon={ShoppingCart}
                aria-label={t`Panier`}
              />
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold pointer-events-none">
                  {cartCount}
                </div>
              )}
            </div>

            <div className="hidden md:block">
              {initializing ? (
                <div className="w-24 h-9 rounded-[var(--radius-md)] bg-[var(--color-surface-hover)] animate-pulse" />
              ) : isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((o) => !o)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)] transition-colors"
                  >
                    <Avatar
                      src={user?.avatar}
                      alt={user?.username}
                      name={user?.username}
                      size="sm"
                    />
                    <span className="text-sm font-medium text-[var(--color-text)] max-w-[100px] truncate">
                      {user?.username}
                    </span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-xl py-1 z-50">
                      <div className="px-3 py-2 border-b border-[var(--color-border)]">
                        <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                          {user?.username}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] truncate">
                          {user?.email}
                        </p>
                      </div>
                      {userMenuItems.map(({ to, icon: Icon, label }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
                        >
                          <Icon size={16} /> {label}
                        </Link>
                      ))}
                      <div className="border-t border-[var(--color-border)] mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-surface)] transition-colors"
                        >
                          <LogOut size={16} />
                          <Trans>Se déconnecter</Trans>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/authentication"
                  className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-sm font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  <Trans>Se connecter</Trans>
                </Link>
              )}
            </div>
          </div>

          <div className="flex md:hidden items-center gap-1">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              icon={theme === 'light' ? Moon : Sun}
              aria-label={t`Thème`}
            />

            {/* Mobile Notification Bell */}
            {isAuthenticated && <NotificationBell />}

            <div className="relative">
              <Button
                onClick={() => openUi('cart-popover')}
                variant="ghost"
                icon={ShoppingCart}
                aria-label={t`Panier`}
              />
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold pointer-events-none">
                  {cartCount}
                </div>
              )}
            </div>

            {!isAuthenticated && (
              <Link
                to="/authentication"
                className="px-3 py-1.5 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                <Trans>Se connecter</Trans>
              </Link>
            )}

            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] transition-colors"
              aria-label={t`Menu`}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] py-2 px-4">
          <ul className="flex flex-col gap-1 mb-3">
            <li>
              <Link to="/" onClick={() => setMobileOpen(false)} className={`block ${navLink}`}>
                <Trans>Accueil</Trans>
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={() => setMobileOpen(false)} className={`block ${navLink}`}>
                <Trans>Produits</Trans>
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li>
                  <Link
                    to="/messagerie"
                    onClick={() => setMobileOpen(false)}
                    className={`block ${navLink}`}
                  >
                    <Trans>Messagerie</Trans>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className={`block ${navLink}`}
                  >
                    <Trans>Mon profil</Trans>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orders"
                    onClick={() => setMobileOpen(false)}
                    className={`block ${navLink}`}
                  >
                    <Trans>Mes commandes</Trans>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    onClick={() => setMobileOpen(false)}
                    className={`block ${navLink}`}
                  >
                    <Trans>Paramètres</Trans>
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="border-t border-[var(--color-border)] pt-3">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar
                    src={user?.avatar}
                    alt={user?.username}
                    name={user?.username}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                      {user?.username}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 flex-shrink-0 px-3 py-1.5 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-surface)] rounded-[var(--radius-md)] transition-colors"
                >
                  <LogOut size={15} />
                  <Trans>Déconnexion</Trans>
                </button>
              </div>
            ) : (
              <Link
                to="/authentication"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-sm font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                <Trans>Se connecter</Trans>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;