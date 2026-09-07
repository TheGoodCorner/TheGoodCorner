import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { apiClient } from '../api/client';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

const DEV_SECRET = 'GoodCornerPass';

export default function Settings() {
  const navigate = useNavigate();

  // Extraction propre du token et de logout depuis authStore
  const token = useAuthStore((state) => state.token) || localStorage.getItem('token');
  const logout = useAuthStore((state) => state.logout);

  // Extraction automatique de l'ID utilisateur depuis le JWT
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
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // États Mode Développeur
  const [isDevUnlocked, setIsDevUnlocked] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [amountToAdd, setAmountToAdd] = useState(1000);
  const [devFeedback, setDevFeedback] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    localStorage.setItem('language', selectedLang);
  };

  const handleToggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem('notificationsEnabled', JSON.stringify(newState));
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

    if (!userId) {
      setDevFeedback({ type: 'error', message: 'ID utilisateur introuvable dans le token.' });
      return;
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setDevFeedback({ type: 'error', message: 'Veuillez saisir un montant valide.' });
      return;
    }

    try {
      const response = await apiClient.post(`/walletTopUp/${userId}`, {
        amount: numericAmount,
      });

      const data = response.data


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

  const handleDeleteAccount = async () => {
    if (!userId) {
      setError('Identifiant utilisateur introuvable.');
      return;
    }

    if (!window.confirm('Confirmer la suppression définitive du compte ?')) return;

    setLoading(true);
    setError(null);

    try {
      await apiClient.delete(`/user/${userId}`);

      alert('Compte supprimé avec succès.');
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
    <div className="min-h-[calc(100vh-140px)] bg-slate-950 text-slate-100 py-12 px-4 flex justify-center items-start">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-white tracking-wide">Paramètres</h1>

        {error && (
          <div className="mb-6 p-3 bg-red-950/60 border border-red-800 text-red-300 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* 1. Sélection de la langue */}
        <div className="mb-6 pb-6 border-b border-slate-800">
          <label htmlFor="language-select" className="block text-sm font-medium text-slate-300 mb-2">
            Langue de l'application
          </label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Notifications */}
        <div className="mb-6 pb-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-slate-200">Notifications</h2>
            <p className="text-xs text-slate-400 mt-1">
              {notificationsEnabled ? 'Notifications activées' : 'Notifications désactivées'}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={notificationsEnabled}
            onClick={handleToggleNotifications}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              notificationsEnabled ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-lg transition duration-200 ${
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 3. Developer Mode (Recharge Portefeuille) */}
        <div className="mb-8 pb-8 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
              🛠️ Mode Développeur
            </h2>
            {isDevUnlocked && (
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono">
                Déverrouillé
              </span>
            )}
          </div>

          {devFeedback && (
            <div
              className={`mb-4 p-2.5 rounded text-xs font-mono border ${
                devFeedback.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-red-950/40 border-red-800 text-red-300'
              }`}
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
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-yellow-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-semibold text-sm rounded-lg transition"
              >
                Valider
              </button>
            </form>
          ) : (
            <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-lg space-y-3">
              <label className="block text-xs font-mono text-slate-400">
                Ajouter des fonds au portefeuille (EUR) :
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  step="10"
                  value={amountToAdd}
                  onChange={(e) => setAmountToAdd(e.target.value)}
                  className="w-32 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddFunds}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition"
                >
                  Créditer le compte
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Danger Zone */}
        <div className="p-5 border border-red-900/60 rounded-xl bg-red-950/20">
          <h2 className="text-lg font-semibold text-red-400 mb-1">Zone de danger</h2>
          <p className="text-sm text-slate-400 mb-5">
            Une fois votre compte supprimé, toutes vos données seront définitivement effacées du système.
          </p>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={loading}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
              loading
                ? 'bg-red-900/40 text-red-300 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white active:scale-[0.98]'
            }`}
          >
            {loading ? 'Suppression...' : 'Supprimer le compte'}
          </button>
        </div>
      </div>
    </div>
  );
}