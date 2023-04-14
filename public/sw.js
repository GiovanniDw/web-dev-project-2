const CORE_CACHE_NAME = 'cache-v3';
const RUNTIME_CACHE_NAME = 'runtime-cache';
const CORE_ASSETS = [
  '/',
  '/index.css',
  '/index.js',
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CORE_CACHE_NAME && cacheName !== RUNTIME_CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        )
      })
  )
})

self.addEventListener('fetch', (event) => {
  const path = new URL(event.request.url).pathname

  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE_NAME)
        .then(cache => cache.match(event.request))
        .then(response => response || fetchAndCache(event.request))
        .catch(() => caches.open(CORE_CACHE_NAME)
          .then(cache => cache.match('/offline')))
    )
  } else if (CORE_ASSETS.includes(path)) {
    event.respondWith(
      caches.open(CORE_CACHE_NAME)
        .then(cache => cache.match(path))
    )
  }
})

function fetchAndCache(request) {
  return fetch(request)
    .then(response => {
      const clone = response.clone()
      caches.open(RUNTIME_CACHE_NAME)
        .then(cache => cache.put(request, clone))

      return response
    })
}