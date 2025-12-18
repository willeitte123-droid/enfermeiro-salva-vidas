const CACHE_NAME = 'enfermagem-pro-cache-v12'; // Versão incrementada para forçar atualização
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  // Força o SW a ativar imediatamente, ignorando a espera
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
  // Assume o controle de todas as abas abertas imediatamente
  event.waitUntil(clients.claim());

  // Limpa caches antigos (como a versão que mostra a tela Blick)
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Ignora requisições que não sejam do mesmo domínio ou métodos diferentes de GET
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // ESTRATÉGIA PARA NAVEGAÇÃO (HTML): Network First, then Cache (App Shell)
  // Isso resolve o problema de links do Google ou rotas diretas
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          // Se estiver offline ou rede falhar, retorna o index.html (SPA)
          return caches.match('/index.html')
            .then((cachedResponse) => {
              return cachedResponse || caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // ESTRATÉGIA PARA ARQUIVOS ESTÁTICOS: Cache First, then Network
  const isStatic = requestUrl.pathname.match(/\.(png|jpg|jpeg|svg|css|js|json|ico|woff2)$/);

  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  } else {
    // Padrão: Network First
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});