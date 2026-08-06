import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/UI/Button';

const inputClasses =
  'w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] ' +
  'bg-[var(--color-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] ' +
  'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-colors';

function Login() {
  const navigate = useNavigate();
  const { login, register, error, setError } = useAuthStore();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const isRegister = mode === 'register';

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (error) setError(null);
  };

  const switchMode = () => {
    setError(null);
    setForm({ username: '', email: '', password: '' });
    setMode((m) => (m === 'login' ? 'register' : 'login'));
  };

  const validate = () => {
    if (isRegister && !form.username.trim()) return "Choisis un nom d'utilisateur.";
    if (!form.email.trim()) return 'Merci de renseigner ton email.';
    if (!form.password) return 'Merci de renseigner ton mot de passe.';
    if (form.password.length < 6) return 'Le mot de passe doit faire au moins 6 caractères.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setIsShaking(true);
      return;
    }

    setSubmitting(true);
    // TODO: retirer ce délai simulé quand le vrai backend sera branché —
    // il sert juste à laisser le temps de voir le spinner sur le mock actuel.
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (isRegister) {
      await register(form.email, form.password, form.username.trim());
    } else {
      await login(form.email, form.password);
    }

    setSubmitting(false);
    navigate('/');
  };

  return (
    <div className="auth-backdrop min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-blue-500 transition-colors transition-colors mb-8"
        >
        <ArrowLeft size={16} strokeWidth={2.75} />
          Retour à la boutique
        </Link>

        <div className="animate-fade-slide-up">
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-bold text-[var(--color-text)]">
              🛍️ TheGoodCorner
            </Link>
            <p className="text-[var(--color-text-muted)] mt-2">
              {isRegister ? 'Crée ton compte en quelques secondes' : 'Content de te revoir'}
            </p>
          </div>

          <div
            className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-lg p-8 ${
              isShaking ? 'animate-shake' : ''
            }`}
            onAnimationEnd={() => setIsShaking(false)}
          >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {isRegister && (
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Nom d'utilisateur
                  </label>
                  <div className="relative">
                    <UserIcon
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                      aria-hidden="true"
                    />
                    <input
                      id="username"
                      type="text"
                      autoComplete="username"
                      value={form.username}
                      onChange={handleChange('username')}
                      placeholder="khalid"
                      disabled={submitting}
                      className={inputClasses}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder="max@example.com"
                    disabled={submitting}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    type="password"
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    value={form.password}
                    onChange={handleChange('password')}
                    placeholder="••••••••"
                    disabled={submitting}
                    className={inputClasses}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-[var(--color-danger)]" role="alert">
                  {error}
                </p>
              )}

              <Button type="submit" variant="primary" fullWidth loading={submitting}>
                {isRegister ? 'Créer mon compte' : 'Se connecter'}
              </Button>
            </form>

            <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
              {isRegister ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
              <button
                type="button"
                onClick={switchMode}
                disabled={submitting}
                className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
              >
                {isRegister ? 'Se connecter' : "S'inscrire"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
