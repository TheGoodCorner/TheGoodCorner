import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] gap-6">
      <h1 className="text-8xl font-bold text-[var(--color-primary)]">404</h1>
      <p className="text-xl font-semibold text-[var(--color-text)]">Page introuvable</p>
      <p className="text-sm text-[var(--color-text-muted)]">La page que tu cherches n'existe pas.</p>
      <Link to="/" className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-[var(--radius-md)] font-semibold hover:bg-[var(--color-primary-hover)] transition-colors">
        Retour à l'accueil
      </Link>
    </div>
  );
}