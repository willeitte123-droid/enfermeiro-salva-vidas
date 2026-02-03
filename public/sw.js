const CACHE_NAME = 'enfermagem-pro-v14';
const ASSETS_TO_CACHE = [
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
  self.skipWaiting(); // Força o SW a ativar imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch((err) => console.error('[Service Worker] Falha no cache inicial:', err))
  );
});

// Ativação: Limpeza de caches antigos
self.addEventListener('activate', (event) => {
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
    }).then(() => self.clients.claim()) // Assume o controle das páginas imediatamente
  );
});

// Interceptação de requisições (Fetch)
self.addEventListener('fetch', (event) => {
  // Ignora requisições não-GET ou de outras origens (exceto assets comuns se necessário)
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // 1. Navegação (HTML): Network First (Tenta rede, se falhar, vai pro Cache)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Se offline, tenta retornar o index.html (SPA)
          return caches.match('/index.html')
            .then((cachedResponse) => {
              if (cachedResponse) return cachedResponse;
              // Se nem o index.html estiver no cache, retorna página de erro
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // 2. Arquivos Estáticos (Imagens, CSS, JS, Fontes): Cache First (Tenta cache, se falhar, rede)
  // Isso melhora muito a performance e a pontuação no Lighthouse
  const isStatic = requestUrl.pathname.match(/\.(png|jpg|jpeg|svg|css|js|json|ico|woff2|woff|ttf)$/i);

  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
    );
    return;
  }

  // 3. Outras requisições (API, etc): Network Only (ou Network First padrão)
  event.respondWith(
    fetch(event.request).catch(() => {
      // Opcional: retornar algo genérico se API falhar
      return new Response(JSON.stringify({ error: 'Network error' }), { 
          status: 503, 
          headers: { 'Content-Type': 'application/json' } 
      });
    })
  );
});