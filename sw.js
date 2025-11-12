// Service Worker Premium pour GameTournament
const CACHE_NAME = 'gametournament-pro-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Installation avec cache premium
self.addEventListener('install', event => {
  console.log('🎮 Installation du Service Worker GameTournament...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Cache premium ouvert');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('🎯 Toutes les ressources gaming sont en cache');
        return self.skipWaiting();
      })
  );
});

// Activation et nettoyage
self.addEventListener('activate', event => {
  console.log('⚡ Activation du Service Worker GameTournament');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Nettoyage ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('🎮 Service Tournament activé avec succès!');
      return self.clients.claim();
    })
  );
});

// Gestion des requêtes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourne la ressource en cache ou fetch
        if (response) {
          return response;
        }
        
        // Clone la requête
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Vérifie si la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone la réponse
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
      .catch(() => {
        // Fallback pour les pages
        if (event.request.mode === 'navigate') {
          return caches.match('./');
        }
      })
  );
});

// Gestion des messages
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});