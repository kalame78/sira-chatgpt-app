// Nom du cache
const CACHE_NAME = 'sira-coraniques-v2';

// Fichiers de base à mettre en cache
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './service-worker.js'
  // Tu peux ajouter ici d'autres fichiers statiques locaux si besoin
];

// Installation : mise en cache du "shell" de l'app
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch : stratégie "cache d'abord, puis réseau"
self.addEventListener('fetch', event => {
  const request = event.request;

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then(networkResponse => {
          // On ne met en cache que les requêtes GET du même domaine
          if (
            request.method === 'GET' &&
            request.url.startsWith(self.location.origin)
          ) {
            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, clonedResponse);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // En cas d'échec réseau total, on renvoie au moins la page principale
          return caches.match('./index.html');
        });
    })
  );
});

