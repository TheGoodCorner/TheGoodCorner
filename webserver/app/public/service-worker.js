/**
 * Service Worker — TheGoodCorner
 *
 * Objectif volontairement mesuré pour une marketplace : rendre l'app
 * installable et résiliente sur un réseau instable (assets instantanés,
 * repli propre si la connexion tombe), SANS prétendre à un mode 100%
 * hors-ligne — impossible de toute façon de payer, discuter ou voir un
 * stock à jour sans réseau. Voir les 3 stratégies ci-dessous.
 *
 * Incrémenter CACHE_VERSION à chaque changement de stratégie de cache
 * (pas besoin de le faire à chaque déploiement : les assets hashés par
 * le build sont eux gérés automatiquement par staleWhileRevalidate).
 */

const CACHE_VERSION = 'v3';
const STATIC_CACHE = `tgc-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `tgc-runtime-${CACHE_VERSION}`;
const API_CACHE = `tgc-api-${CACHE_VERSION}`;
const CURRENT_CACHES = [STATIC_CACHE, RUNTIME_CACHE, API_CACHE];

const OFFLINE_URL = '/offline.html';

// Volontairement minimal : le build CRA hash les noms de fichiers
// (main.abc123.js), donc impossible de les lister à l'avance sans
// outillage supplémentaire (workbox-webpack-plugin). Ils sont capturés
// à la volée par staleWhileRevalidate dès le premier chargement, ce qui
// suffit largement en pratique.
const PRECACHE_URLS = ['/', OFFLINE_URL, '/manifest.json'];
const OFFLINE_IMAGE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
  <circle cx="8.5" cy="8.5" r="1.5"/>
  <polyline points="21 15 16 10 5 21"/>
  <line x1="2" y1="2" x2="22" y2="22" stroke="#ef4444" stroke-width="2"/>
</svg>
`.trim();
// ---------- INSTALL ----------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  // Pas de self.skipWaiting() ici : le nouveau SW reste "waiting" tant
  // que l'utilisateur n'a pas confirmé la mise à jour côté app (voir
  // serviceWorkerRegistration.js -> applyUpdate()). On évite ainsi de
  // rafraîchir l'app sous les pieds de quelqu'un en plein paiement.
});

// ---------- ACTIVATE ----------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => !CURRENT_CACHES.includes(key)).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Déclenché par applyUpdate() côté client une fois que l'utilisateur a
// accepté le rafraîchissement (toast "Nouvelle version disponible").
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ---------- FETCH ----------
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Seul le GET est intercepté : les mutations (login, création produit,
  // paiement, suppression...) doivent TOUJOURS partir au réseau, jamais
  // être servies ni écrites depuis un cache.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Laisse passer tout ce qui n'est pas http(s) (ex: extensions navigateur)
  if (!url.protocol.startsWith('http')) return;

  // Stripe.js / iframe Stripe : jamais interceptés, réseau direct requis
  // par leurs propres mécanismes anti-fraude.
  if (url.hostname.includes('stripe.com')) return;

  // --- Navigation (chargement de page / F5) ---
  // Network-first : priorité à la version la plus fraîche de l'app, avec
  // repli sur le cache puis sur /offline.html si le réseau est HS. Une
  // fois reconnecté, c'est React Router qui reprend la main normalement.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, STATIC_CACHE, OFFLINE_URL));
    return;
  }

  // --- Appels API (/api/...) ---
  // Network-first + repli cache : prix, stock et messages changent en
  // permanence donc on veut du frais en priorité, mais un repli sur la
  // dernière réponse connue évite une page blanche sur réseau instable.
  // ATTENTION : le repli cache peut renvoyer une donnée légèrement
  // périmée (ex: ancien stock) — c'est le compromis accepté ici, au
  // profit de la résilience plutôt que d'une erreur brute.
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // --- Assets statiques same-origin (JS/CSS/fonts buildés, noms hashés
  // donc immuables) et images produits/avatars ---
  // Stale-while-revalidate : sert le cache instantanément si dispo, tout
  // en revalidant en arrière-plan. Idéal pour des fichiers dont le nom
  // change à chaque nouveau contenu (un nouveau build = un nouveau hash).
  event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
});

// ---------- Stratégies ----------

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (fallbackUrl) {
      const offline = await caches.match(fallbackUrl);
      if (offline) return offline;
    }
    return new Response(
      JSON.stringify({ 
        error: 'Network unavailable and no cache found',
        offline: true 
      }), 
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkFetch = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => {
      // Si le réseau échoue et qu'on a la version en cache, on la sert
      if (cached) return cached;

	  if (request.destination === 'image' || request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
        return new Response(OFFLINE_IMAGE_SVG, {
          headers: { 'Content-Type': 'image/svg+xml' },
        });
      }
      // Si l'image n'est JAMAIS passée par le cache, on évite le crash
      // en retournant une Response 404 ou 503 propre
      return new Response('', {
        status: 404,
        statusText: 'Not Found in Cache and Offline'
      });
    });

  // Si on a le cache, on le sert tout de suite, sinon on attend le réseau
  return cached || networkFetch;
}
