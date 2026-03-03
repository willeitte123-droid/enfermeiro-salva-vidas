const CACHE_NAME = 'enfermagem-pro-v15';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/offline.html',
  '/images/icon-192.png',
  '/images/icon-512.png'
];

// Instalação
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Ativação
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // IGNORAR requisições do Chrome Extensions e do servidor de desenvolvimento Vite/HMR
  if (
    !url.protocol.startsWith('http') || 
    url.hostname === 'localhost' || 
    url.pathname.includes('node_modules') ||
    url.pathname.includes('@vite') ||
    url.pathname.includes('@react-refresh')
  ) {
    return;
  }

  // 1. Navegação (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html') || caches.match('/offline.html'))
    );
    return;
  }

  // 2. Estáticos (Cache First)
  const isStatic = url.pathname.match(/\.(png|jpg|jpeg|svg|css|js|json|ico|woff2|woff|ttf)$/i);
  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    );
    return;
  }

  // 3. Outros (Network Only) - Removido o retorno manual de 503 para evitar erros no console
});