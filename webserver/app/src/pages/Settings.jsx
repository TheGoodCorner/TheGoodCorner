import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { apiClient } from '../api/client';
import { useNotificationStore } from '../stores/notificationStore';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

const DEV_SECRET = 'GoodCornerPass';

export default function Settings() {
  const navigate = useNavigate();

  const notificationsEnabled = useNotificationStore((state) => state.notificationsEnabled);
  const toggleNotifications = useNotificationStore((state) => state.toggleNotifications);
  const token = useAuthStore((state) => state.token) || localStorage.getItem('token');
  const logout = useAuthStore((state) => state.logout);

   const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDarkMode = theme === 'dark';

  const userId = useMemo(() => {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return payload.id || payload.userId || payload.sub || null;
    } catch (err) {
      console.error('Erreur décodage JWT:', err);
      return null;
    }
  }, [token]);

  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'fr');

  const [isDevUnlocked, setIsDevUnlocked] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [amountToAdd, setAmountToAdd] = useState(1000);
  const [devFeedback, setDevFeedback] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(10000);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    localStorage.setItem('language', selectedLang);
  };

  const handleToggleNotifications = () => {
    toggleNotifications();
  };

  const handleUnlockDev = (e) => {
    e.preventDefault();
    if (secretInput.trim() === DEV_SECRET) {
      setIsDevUnlocked(true);
      setDevFeedback({ type: 'success', message: 'Mode développeur activé !' });
      setSecretInput('');
    } else {
      setDevFeedback({ type: 'error', message: 'Phrase secrète incorrecte.' });
    }
  };

  const handleAddFunds = async () => {
    const numericAmount = parseFloat(amountToAdd);
    const MAX_AMOUNT = 2147483646;

    if (!userId) {
      setDevFeedback({ type: 'error', message: 'ID utilisateur introuvable dans le token.' });
      return;
    }

    if (isNaN(numericAmount) || numericAmount <= 0 || numericAmount > MAX_AMOUNT) {
      setDevFeedback({ type: 'error', message: 'Veuillez saisir un montant valide.' });
      return;
    }
    if (currentBudget + numericAmount > MAX_AMOUNT) {
    setDevFeedback({type: 'error', message: `Le solde total ne peut pas dépasser ${MAX_AMOUNT}€. (Solde actuel : ${currentBudget}€)`,});
    return;
    }

    try {
      const response = await apiClient.post(`/walletTopUp/${userId}`, {
        amount: numericAmount,
      });

      const data = response.data;
      const updatedBudget = currentBudget + numericAmount;

      setCurrentBudget(updatedBudget);
      setDevFeedback({
        type: 'success',
        message: `+${numericAmount}€ crédités avec succès ! (Nouveau solde: ${data.newBudget ?? 'mis à jour'}€)`,
      });
    } catch (err) {
      setDevFeedback({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Erreur lors du crédit.',
      });
    }
  };

  const handleDeleteClick = () => {
    if (!userId) {
        setError('Identifiant utilisateur introuvable.');
        return;
    }
    setShowConfirm(true);
  };

  const confirmDeleteAccount = async () => {
      setShowConfirm(false);
      setLoading(true);
      setError(null);

      try {
          await apiClient.delete(`/user/${userId}`);
          if (logout) logout();
          localStorage.removeItem('token');
          navigate('/');
      } catch (err) {
          setError(err.message || 'Erreur lors de la suppression.');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div
      className="min-h-[calc(100vh-140px)] py-12 px-4 flex justify-center items-start"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <div
        className="w-full max-w-xl rounded-[var(--radius-lg)] p-8 shadow-2xl"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          borderWidth: '1px',
        }}
      >
        <h1 className="text-2xl font-bold mb-6 tracking-wide" style={{ color: 'var(--color-text)' }}>
          Paramètres
        </h1>

        {error && (
          <div
            className="mb-6 p-3 text-sm rounded-[var(--radius-md)]"
            style={{
              backgroundColor: 'var(--color-danger-surface)',
              borderColor: 'var(--color-danger)',
              borderWidth: '1px',
              color: 'var(--color-danger)',
            }}
          >
            {error}
          </div>
        )}

        <div
          className="mb-6 pb-6"
          style={{ borderBottomColor: 'var(--color-border)', borderBottomWidth: '1px' }}
        >
          <label
            htmlFor="language-select"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Langue de l'application
          </label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            className="w-full rounded-[var(--radius-md)] p-3 text-base outline-none focus:ring-2 cursor-pointer"
            style={{
              backgroundColor: 'var(--color-surface-hover)',
              borderColor: 'var(--color-border)',
              borderWidth: '1px',
              color: 'var(--color-text)',
              focusRingColor: 'var(--color-primary)',
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div
          className="mb-6 pb-6 flex items-center justify-between"
          style={{ borderBottomColor: 'var(--color-border)', borderBottomWidth: '1px' }}
        >
          <div>
            <h2 className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              Mode sombre
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {isDarkMode ? 'Thème sombre actif' : 'Thème clair actif'}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isDarkMode}
            onClick={toggleTheme}
            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2"
            style={{
              backgroundColor: isDarkMode ? 'var(--color-primary)' : 'var(--color-surface-hover)',
              focusRingColor: 'var(--color-primary)',
            }}
          >
            <span
              className="inline-block h-5 w-5 rounded-full shadow-lg transition duration-200"
              style={{
                backgroundColor: 'var(--color-on-primary)',
                transform: isDarkMode ? 'translateX(20px)' : 'translateX(0)',
              }}
            />
          </button>
        </div>

        <div
          className="mb-6 pb-6 flex items-center justify-between"
          style={{ borderBottomColor: 'var(--color-border)', borderBottomWidth: '1px' }}
        >
          <div>
            <h2 className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              Notifications
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {notificationsEnabled ? 'Notifications activées' : 'Notifications désactivées'}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={notificationsEnabled}
            onClick={handleToggleNotifications}
            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2"
            style={{
              backgroundColor: notificationsEnabled ? 'var(--color-primary)' : 'var(--color-surface-hover)',
              focusRingColor: 'var(--color-primary)',
            }}
          >
            <span
              className="inline-block h-5 w-5 rounded-full shadow-lg transition duration-200"
              style={{
                backgroundColor: 'var(--color-on-primary)',
                transform: notificationsEnabled ? 'translateX(20px)' : 'translateX(0)',
              }}
            />
          </button>
        </div>

        <div
          className="mb-8 pb-8"
          style={{ borderBottomColor: 'var(--color-border)', borderBottomWidth: '1px' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
              🛠️ Mode Développeur
            </h2>
            {isDevUnlocked && (
              <span
                className="text-xs px-2 py-0.5 rounded font-mono"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderWidth: '1px',
                  color: 'var(--color-on-primary)',
                }}
              >
                Déverrouillé
              </span>
            )}
          </div>

          {devFeedback && (
            <div
              className="mb-4 p-2.5 rounded text-xs font-mono"
              style={{
                backgroundColor: devFeedback.type === 'success' ? 'var(--color-surface-hover)' : 'var(--color-danger-surface)',
                borderColor: devFeedback.type === 'success' ? 'var(--color-primary)' : 'var(--color-danger)',
                borderWidth: '1px',
                color: devFeedback.type === 'success' ? 'var(--color-primary)' : 'var(--color-danger)',
              }}
            >
              {devFeedback.message}
            </div>
          )}

          {!isDevUnlocked ? (
            <form onSubmit={handleUnlockDev} className="flex gap-2">
              <input
                type="password"
                placeholder="Entrez la phrase secrète..."
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                className="flex-1 rounded-[var(--radius-md)] px-3 py-2 text-sm outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-surface-hover)',
                  borderColor: 'var(--color-border)',
                  borderWidth: '1px',
                  color: 'var(--color-text)',
                }}
              />
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-sm rounded-[var(--radius-md)] transition hover:opacity-90"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                }}
              >
                Valider
              </button>
            </form>
          ) : (
            <div
              className="p-4 rounded-[var(--radius-md)] space-y-3"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                borderWidth: '1px',
              }}
            >
              <label className="block text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
                Ajouter des fonds au portefeuille (EUR) :
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  step="10"
                  value={amountToAdd}
                  onChange={(e) => setAmountToAdd(e.target.value)}
                  className="w-32 rounded-[var(--radius-md)] px-3 py-2 text-sm outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-surface-hover)',
                    borderColor: 'var(--color-border)',
                    borderWidth: '1px',
                    color: 'var(--color-text)',
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddFunds}
                  className="px-4 py-2 font-medium text-sm rounded-[var(--radius-md)] transition hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                  }}
                >
                  Créditer le compte
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className="p-5 rounded-[var(--radius-lg)]"
          style={{
            backgroundColor: 'var(--color-danger-surface)',
            borderColor: 'var(--color-danger)',
            borderWidth: '1px',
          }}
        >
          <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-danger)' }}>
            Zone de danger
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
            Une fois votre compte supprimé, toutes vos données seront définitivement effacées du système.
          </p>
          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={loading}
            className="px-5 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold transition active:scale-[0.98]"
            style={{
              backgroundColor: loading ? 'var(--color-surface-hover)' : 'var(--color-danger)',
              color: loading ? 'var(--color-danger)' : 'var(--color-on-danger)',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          > 
            {loading ? 'Suppression...' : 'Supprimer le compte'}
          </button>
        </div>

        {showConfirm && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={() => setShowConfirm(false)}
          >
            <div
              className="rounded-[var(--radius-lg)] p-6 max-w-sm w-full mx-4"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                borderWidth: '1px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                Supprimer votre compte ?
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                Cette action est définitive et irréversible. Toutes vos données seront perdues.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold transition"
                  style={{
                    backgroundColor: 'var(--color-surface-hover)',
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                    borderWidth: '1px',
                  }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteAccount}
                  disabled={loading}
                  className="px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold transition"
                  style={{
                    backgroundColor: 'var(--color-danger)',
                    color: 'var(--color-on-danger)',
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Suppression...' : 'Supprimer définitivement'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}