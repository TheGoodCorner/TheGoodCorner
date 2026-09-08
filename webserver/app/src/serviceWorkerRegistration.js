/**
 * Enregistrement du service worker — adapté du template officiel
 * Create React App, avec un point d'entrée (onUpdate) pour notifier
 * l'app quand une nouvelle version est prête, plutôt que de rafraîchir
 * silencieusement sous les pieds de quelqu'un (ex: en plein paiement).
 *
 * Volontairement inactif en dev (NODE_ENV !== 'production') : un SW qui
 * met en cache le bundle pendant `npm start` fait plus de mal que de
 * bien (rechargements fantômes, cache qui ne suit pas le hot-reload).
 */

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/)
);

/**
 * @param {{ onSuccess?: (reg: ServiceWorkerRegistration) => void, onUpdate?: (reg: ServiceWorkerRegistration) => void }} config
 */
export function register(config) {
  if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) {
    return;
  }

  const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
  if (publicUrl.origin !== window.location.origin) {
    // Le SW ne peut pas fonctionner si PUBLIC_URL pointe vers une autre
    // origine (ex: assets servis depuis un CDN).
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

    if (isLocalhost) {
      checkValidServiceWorker(swUrl, config);
    } else {
      registerValidSW(swUrl, config);
    }
  });
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Un SW précédent contrôlait déjà la page : c'est une MISE
              // À JOUR. Le nouveau SW reste "waiting" — à l'app de
              // décider quand basculer (voir applyUpdate ci-dessous).
              console.log('[SW] Nouvelle version disponible.');
              config?.onUpdate?.(registration);
            } else {
              console.log('[SW] Contenu mis en cache pour un usage hors-ligne.');
              config?.onSuccess?.(registration);
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error("[SW] Échec de l'enregistrement :", error);
    });

  // Recharge la page une seule fois quand le nouveau SW prend le
  // contrôle (déclenché par applyUpdate() -> postMessage SKIP_WAITING).
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (response.status === 404 || (contentType != null && contentType.indexOf('javascript') === -1)) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => window.location.reload());
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('[SW] Aucune connexion réseau — app en mode hors-ligne.');
    });
}

/**
 * Fait passer le SW "waiting" à l'état actif. À appeler depuis l'UI (ex:
 * bouton "Rafraîchir" du toast de mise à jour affiché via onUpdate()).
 * Déclenche 'controllerchange' -> reload (voir registerValidSW).
 */
export function applyUpdate(registration) {
  registration?.waiting?.postMessage({ type: 'SKIP_WAITING' });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => registration.unregister())
      .catch((error) => console.error(error.message));
  }
}
