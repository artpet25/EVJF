const CACHE_NAME = 'evjf-v5';

const PRECACHE_ASSETS = [
  '/EVJF/',
  '/EVJF/index.html',
  '/EVJF/manifest.json',
  '/EVJF/css/style.css',
  '/EVJF/css/fonts/fonts.css',
  '/EVJF/css/fonts/eb-garamond-400.woff2',
  '/EVJF/css/fonts/eb-garamond-400-italic.woff',
  '/EVJF/css/fonts/medievalsharp-400.woff2',
  '/EVJF/js/app.js',
  '/EVJF/photos/crew-aoidos.jpeg',
  '/EVJF/photos/crew-eretai.jpeg',
  '/EVJF/photos/crew-keryx.jpeg',
  '/EVJF/photos/crew-kubernetes.jpeg',
  '/EVJF/photos/crew-mantis.jpeg',
  '/EVJF/photos/crew-nautikos.jpeg',
  '/EVJF/photos/crew-phagos.jpeg',
  '/EVJF/photos/crew-proreus.jpeg',
  '/EVJF/photos/cyclops-1.jpeg',
  '/EVJF/photos/cyclops-2.jpeg',
  '/EVJF/photos/photo-1.jpeg',
  '/EVJF/photos/photo-2.jpeg',
  '/EVJF/photos/photo-3.jpeg',
  '/EVJF/photos/photo-4.jpeg',
  '/EVJF/photos/photo-5.jpeg',
  '/EVJF/photos/photo-6.jpeg',
  '/EVJF/photos/tapestry-1.jpeg',
  '/EVJF/photos/ending.jpeg',
  '/EVJF/videos/video-1.mp4',
  '/EVJF/videos/video-2.mp4',
  '/EVJF/videos/video-3.mp4',
  '/EVJF/videos/video-4.mp4',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn('Precache failed for', url, err))
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Cache-first for precached media/pages: guarantees offline playback even
  // when the network is technically reachable but flaky (e.g. weak signal).
  // Falls back to network for anything not in the precache list, and updates
  // the cache in the background so future offline visits stay fresh.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
