const CACHE_NAME = 'evjf-v6';

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

// Safari/iOS always fetches <video> sources with a Range header, even on
// first load. The Cache API ignores that header when matching, so serving
// the cached entry as-is would return a full 200 body for a request that
// expects a 206 partial response — Safari then refuses to play some
// videos. Slice the cached bytes ourselves and answer with a proper
// 206 Partial Content response instead.
async function handleRangeRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (!cachedResponse) {
    try {
      return await fetch(request);
    } catch (err) {
      return new Response('', { status: 503 });
    }
  }

  const buffer = await cachedResponse.arrayBuffer();
  const totalLength = buffer.byteLength;
  const rangeHeader = request.headers.get('range') || '';
  const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);

  let start = 0;
  let end = totalLength - 1;
  if (match) {
    if (match[1] === '' && match[2] !== '') {
      // Suffix range, e.g. "bytes=-500" means "the last 500 bytes".
      start = Math.max(0, totalLength - Number(match[2]));
    } else {
      if (match[1] !== '') start = Number(match[1]);
      if (match[2] !== '') end = Number(match[2]);
    }
  }
  end = Math.min(end, totalLength - 1);

  if (start > end || start >= totalLength) {
    return new Response('', {
      status: 416,
      statusText: 'Range Not Satisfiable',
      headers: { 'Content-Range': `bytes */${totalLength}` },
    });
  }

  const slice = buffer.slice(start, end + 1);

  return new Response(slice, {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': cachedResponse.headers.get('Content-Type') || 'application/octet-stream',
      'Content-Range': `bytes ${start}-${end}/${totalLength}`,
      'Content-Length': String(slice.byteLength),
      'Accept-Ranges': 'bytes',
    },
  });
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.headers.has('range')) {
    event.respondWith(handleRangeRequest(request));
    return;
  }

  // Cache-first for precached media/pages: guarantees offline playback even
  // when the network is technically reachable but flaky (e.g. weak signal).
  // Falls back to network for anything not in the precache list, and updates
  // the cache in the background so future offline visits stay fresh.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
