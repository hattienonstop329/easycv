// Service worker for easycv. Local-first means we want the builder to keep
// working even when the user is offline. Strategy: stale-while-revalidate
// for same-origin GET requests, network-only for everything else (so API
// calls to anthropic.com always go to the network).

// Bumped cache name forces old caches (which may hold dev chunks that no
// longer exist on disk) to be evicted in the activate handler.
const CACHE = 'easycv-v2';
const PRECACHE = ['/', '/builder', '/templates', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE).catch(() => {})),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Only handle our own origin — never cache API calls (Anthropic etc).
  if (url.origin !== self.location.origin) return;
  // Never cache any Next.js asset. Production chunks are content-hashed
  // (so the browser cache handles them), and dev chunks change every
  // recompile — caching them strands the app on the next restart.
  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/__nextjs')) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      const fetchPromise = fetch(req)
        .then((res) => {
          // Only cache successful, basic responses
          if (res && res.status === 200 && res.type === 'basic') {
            cache.put(req, res.clone()).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    }),
  );
});
