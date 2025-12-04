const CACHE_NAME = 'enfermagem-pro-cache-v6';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força ativação imediata
  
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
  event.waitUntil(clients.claim()); // Controla as páginas imediatamente

  // Limpa caches antigos
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
  // Estratégia: Network First, falling back to Cache
  // Importante: Não interceptar requisições de API ou externas se não necessário
  
  const isStatic = event.request.url.match(/\.(png|jpg|jpeg|svg|css|js|json)$/);

  if (isStatic) {
    // Cache First para imagens e estilos estáticos
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  } else {
    // Network First para navegação e dados (garante atualização)
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then((response) => {
              if (response) return response;
              if (event.request.mode === 'navigate') {
                return caches.match('/offline.html');
              }
            });
        })
    );
  }
});