const CACHE_NAME = 'enfermagem-pro-cache-v10';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('Falha ao registrar cache:', err);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Verifica extensões de arquivo estático
  const isStatic = event.request.url.match(/\.(png|jpg|jpeg|svg|css|js|json|ico)$/);

  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  } else {
    // Estratégia Network First para navegação e API
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then((response) => {
              if (response) return response;
              
              // CRITICAL FIX FOR SPA: 
              // Se for uma navegação (HTML), retorna o index.html do cache (App Shell)
              // Isso permite que o React Router assuma o controle mesmo offline ou em rotas profundas
              if (event.request.mode === 'navigate') {
                return caches.match('/index.html')
                  .then((indexResponse) => {
                    return indexResponse || caches.match('/offline.html');
                  });
              }
            });
        })
    );
  }
});