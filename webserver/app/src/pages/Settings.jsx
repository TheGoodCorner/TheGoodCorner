import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trans, useLingui } from '@lingui/react/macro';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useLanguageStore } from '../stores/languageStore';
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
  const { t } = useLingui();

  const notificationsEnabled = useNotificationStore((state) => state.notificationsEnabled);
  const toggleNotifications = useNotificationStore((state) => state.toggleNotifications);
  const token = useAuthStore((state) => state.token) || localStorage.getItem('token');
  const logout = useAuthStore((state) => state.logout);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDarkMode = theme === 'dark';

  const { locale, setLocale } = useLanguageStore();

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

  const [isDevUnlocked, setIsDevUnlocked] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [amountToAdd, setAmountToAdd] = useState(1000);
  const [devFeedback, setDevFeedback] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLanguageChange = (e) => {
    setLocale(e.target.value);
  };

  const handleToggleNotifications = () => {
    toggleNotifications();
  };

  const handleUnlockDev = (e) => {
    e.preventDefault();
    if (secretInput.trim() === DEV_SECRET) {
      setIsDevUnlocked(true);
      setDevFeedback({ type: 'success', message: t`Developer mode unlocked!` });
      setSecretInput('');
    } else {
      setDevFeedback({ type: 'error', message: t`Invalid secret pass phrase.` });
    }
  };

  const handleAddFunds = async () => {
    const numericAmount = parseFloat(amountToAdd);

    if (!userId) {
      setDevFeedback({ type: 'error', message: t`User ID not found in token.` });
      return;
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setDevFeedback({ type: 'error', message: t`Please enter a valid amount.` });
      return;
    }

    try {
      const response = await apiClient.post(`/walletTopUp/${userId}`, {
        amount: numericAmount,
      });

      const data = response.data;

      setDevFeedback({
        type: 'success',
        message: t`+${numericAmount}€ successfully credited! (New balance: ${data.newBudget ?? 'updated'}€)`,
      });
    } catch (err) {
      setDevFeedback({
        type: 'error',
        message: err.response?.data?.message || err.message || t`Error crediting wallet.`,
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) {
      setError(t`User identifier not found.`);
      return;
    }

    if (!window.confirm(t`Permanently delete your account? This cannot be undone.`)) return;

    setLoading(true);
    setError(null);

    try {
      await apiClient.delete(`/user/${userId}`);

      alert(t`Account deleted successfully.`);
      if (logout) logout();
      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      setError(err.message || t`Error during deletion.`);
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
          <Trans>Settings</Trans>
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
            <Trans>Application language</Trans>
          </label>
          <select
            id="language-select"
            value={locale}
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
              <Trans>Dark mode</Trans>
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {isDarkMode ? <Trans>Dark theme active</Trans> : <Trans>Light theme active</Trans>}
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
              <Trans>Notifications</Trans>
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {notificationsEnabled ? (
                <Trans>Notifications enabled</Trans>
              ) : (
                <Trans>Notifications disabled</Trans>
              )}
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
              🛠️ <Trans>Developer Mode</Trans>
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
                <Trans>Unlocked</Trans>
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
                placeholder={t`Enter secret passphrase...`}
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
                <Trans>Validate</Trans>
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
                <Trans>Add funds to wallet (EUR):</Trans>
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
                  <Trans>Credit Account</Trans>
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
            <Trans>Danger Zone</Trans>
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
            <Trans>Once your account is deleted, all your data will be permanently removed from the system.</Trans>
          </p>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={loading}
            className="px-5 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold transition active:scale-[0.98]"
            style={{
              backgroundColor: loading ? 'var(--color-surface-hover)' : 'var(--color-danger)',
              color: loading ? 'var(--color-danger)' : 'var(--color-on-danger)',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? <Trans>Deleting...</Trans> : <Trans>Delete Account</Trans>}
          </button>
        </div>
      </div>
    </div>
  );
}