import { Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import { Button } from '../UI/Button';
import { FormField } from '../UI/FormField';

export function TwoFactorSettings() {
  const [enabled, setEnabled] = useState(null);
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [secret, setSecret] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    apiClient.get('/auth/2fa').then(({ data }) => setEnabled(data.enabled)).catch(err => setError(err.message));
  }, []);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const action = enabled ? 'disable' : secret ? 'enable' : 'setup';
      const { data } = await apiClient.post(`/auth/2fa/${action}`, { password, code });
      if (action === 'setup') setSecret(data.secret);
      else {
        setEnabled(action === 'enable');
        setRecoveryCodes(data.recoveryCodes || []);
        setSecret('');
        setPassword('');
        setCode('');
      }
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return (
    <section className="p-6 sm:p-8 border-b border-[var(--color-border)] text-[var(--color-text)]">
      <h2 className="text-2xl font-bold mb-3">Double authentification</h2>
      <p className="mb-4">{enabled === null ? 'Chargement…' : enabled ? '2FA activée' : 'Active la double authentification'}</p>
      {recoveryCodes.length > 0 ? (
        <div className="space-y-3">
          <p>Voici une liste de codes individuels de secours, ils sont à usage unique.<br /> Ils vous serviront en cas de perte de votre secret.<br /> Gardez les précieusement et ne les partagez pas.</p>
          <pre className="select-all">{recoveryCodes.map((item, index) => `code ${index + 1} - ${item}`).join('\n')}</pre>
          <Button onClick={() => setRecoveryCodes([])}>Continuer</Button>
        </div>
      ) : enabled !== null && (
        <form onSubmit={submit} className="max-w-md space-y-4">
          <FormField icon={Lock} id="2fa-password" label="Mot de passe" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} disabled={busy} />
          {secret && <div className="space-y-2">
            <p>Enregistrez le secret dans votre application d'authentification (TOTP)<br />. Ne le partagez à personne car il permet la generation de code d'acces.</p>
            <code className="block break-all select-all">{secret}</code>
          </div>}
          {(enabled || secret) && <FormField icon={Lock} id="2fa-code" label={enabled ? 'Code de l’application ou code de secours' : 'Code à six chiffres'} type="text" autoComplete="one-time-code" required value={code} onChange={e => setCode(e.target.value)} disabled={busy} />}
          <Button type="submit" loading={busy}>{enabled ? 'Désactiver' : secret ? 'Confirmer l’activation' : 'Configurer'}</Button>
          {secret && <Button type="button" disabled={busy} onClick={() => { setSecret(''); setCode(''); }}>Recommencer</Button>}
        </form>
      )}
      {error && <p role="alert" className="mt-3 text-[var(--color-danger)]">{error}</p>}
    </section>
  );
}
