import { Link } from 'react-router-dom';

export default function TooManyRequest() {
  return (
	<div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] gap-6">
	  <h1 className="text-8xl font-bold text-[var(--color-primary)]">429</h1>
	  <p className="text-xl font-semibold text-[var(--color-text)]">Trop de requete</p>
	  <p className="text-sm text-[var(--color-text-muted)]">Attendez quelques instants que le serveur se stabilise.</p>
	  <Link to="/" className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-[var(--radius-md)] font-semibold hover:bg-[var(--color-primary-hover)] transition-colors">
		Retour à l'accueil
	  </Link>
	</div>
  );
}