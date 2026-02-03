const CACHE_NAME = 'enfermagem-pro-cache-v13'; // Versão incrementada
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/offline.html',
  '/images/icon-192.png',
  '/images/icon-512.png'
];

// Instalação: Cache dos arquivos essenciais (App Shell)
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Ativa imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.error('[Service Worker] Falha no cache inicial:', err))
  );
});

// Ativação: Limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()); // Assume controle das abas
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptação de requisições (Fetch)
self.addEventListener('fetch', (event) => {
  // Ignora requisições não-GET ou cross-origin (exceto fontes/imagens comuns se necessário)
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // 1. Navegação (HTML): Network First, fallback to Cache, fallback to Offline Page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          // Se offline, tenta retornar o index.html (SPA) ou a página offline
          return caches.match('/index.html')
            .then((cachedResponse) => {
              return cachedResponse || caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // 2. Arquivos Estáticos (Imagens, CSS, JS, Fontes): Cache First, fallback to Network
  // Melhora a performance carregando do disco primeiro
  const isStatic = requestUrl.pathname.match(/\.(png|jpg|jpeg|svg|css|js|json|ico|woff2|woff|ttf)$/i);

  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          // Opcional: Cachear dinamicamente novos arquivos estáticos
          // if (networkResponse && networkResponse.status === 200) {
          //   const responseClone = networkResponse.clone();
          //   caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          // }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Padrão para outras requisições (API, etc): Network First
  event.respondWith(
    fetch(event.request).catch(() => {
      // Se falhar (offline), tenta ver se tem no cache (improvável para API, mas seguro)
      return caches.match(event.request);
    })
  );
});