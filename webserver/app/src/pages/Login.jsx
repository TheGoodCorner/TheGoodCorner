import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowLeft } from 'lucide-react';
import { useLoginForm } from '../hooks/useLoginForm';
import { Button } from '../components/UI/Button';
import { FormField } from '../components/UI/FormField';

function Login() {
  const navigate = useNavigate();
  const {
    isRegister,
    form,
    submitting,
    isShaking,
    error,
    handleChange,
    switchMode,
    submit,
    clearShake,
  } = useLoginForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(() => navigate('/'));
  };

  return (
    <div className="auth-backdrop min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-blue-500 transition-colors mb-8"
        >
          <ArrowLeft size={16} strokeWidth={2.75}/>
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
            onAnimationEnd={clearShake}
          >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {isRegister && (
                <FormField
                  id="username"
                  label="Nom d'utilisateur"
                  icon={UserIcon}
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  onChange={handleChange('username')}
                  placeholder="max"
                  disabled={submitting}
                />
              )}

              <FormField
                id="email"
                label="Email"
                icon={Mail}
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="khalid@example.com"
                disabled={submitting}
              />

              <FormField
                id="password"
                label="Mot de passe"
                icon={Lock}
                type="password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={form.password}
                onChange={handleChange('password')}
                placeholder="••••••••"
                disabled={submitting}
              />

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
              <Button
                type="switch mode"
                onClick={switchMode}
                disabled={submitting}
                variant='gohst'
                className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
              >
                {isRegister ? 'Se connecter' : "S'inscrire"}
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
