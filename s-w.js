var CACHE_NAME = 'offline';
var contentToCache = [
    '/js/animframe_polyfill.js',
    'js/application.js',
    'js/bind_polyfill.js',
    '/script.js',
    '/manifest.json',
    '/index.html'
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
      caches.open(cacheName).then((cache) => {
            console.log('[Servicio Worker] Almacena todo en caché: contenido e intérprete de la aplicación');
        return cache.addAll(contentToCache);
      })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
      caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
          if(key !== cacheName) {
            return caches.delete(key);
          }
        }));
      })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
      caches.match(e.request).then((r) => {
            console.log('[Servicio Worker] Obteniendo recurso: '+e.request.url);
        return r || fetch(e.request).then((response) => {
                  return caches.open(cacheName).then((cache) => {
            console.log('[Servicio Worker] Almacena el nuevo recurso: '+e.request.url);
            cache.put(e.request, response.clone());
            return response;
          });
        });
      })
    );
});