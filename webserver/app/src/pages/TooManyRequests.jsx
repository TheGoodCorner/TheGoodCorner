import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TooManyRequests() {

  const BLOCK_DURATION = 4000;

  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(BLOCK_DURATION / 1000));

  useEffect(() => {
    const interval = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    const timeout = setTimeout(() => navigate(-1), BLOCK_DURATION);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);


    return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] gap-6">
      <h1 className="text-8xl font-bold text-[var(--color-primary)]">429</h1>
      <p className="text-xl font-semibold text-[var(--color-text)]">Trop de requêtes envoyees, laisse le serveur respirer</p>
      <p className="text-sm text-[var(--color-text-muted)]">Merci de patienter quelques instants...</p>
      <p className="text-sm text-[var(--color-text-muted)]">Retour automatique dans {secondsLeft}s</p>
    </div>
  );
}