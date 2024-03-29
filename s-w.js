var cacheName = 'offline';
var version = '1';
var contentToCache = [
    'js/animframe_polyfill.js',
    'js/application.js',
    'js/bind_polyfill.js',
    'js/classlist_polyfill.js',
    'js/game_manager.js',
    'js/grid.js',
    'js/html_actuator.js',
    'js/keyboard_input_manager.js',
    'js/local_storage_manager.js',
    'js/tile.js',
    'meta/apple-touch-icon.png',
    'meta/apple-touch-startup-image-640x920.png',
    'meta/apple-touch-startup-image-640x1096.png',
    'style/fonts/clear-sans.css',
    'style/fonts/ClearSans-Bold-webfont.eot',
    'style/fonts/ClearSans-Bold-webfont.svg',
    'style/fonts/ClearSans-Bold-webfont.woff',
    'style/fonts/ClearSans-Light-webfont.eot',
    'style/fonts/ClearSans-Light-webfont.svg',
    'style/fonts/ClearSans-Light-webfont.woff',
    'style/fonts/ClearSans-Regular-webfont.eot',
    'style/fonts/ClearSans-Regular-webfont.svg',
    'style/fonts/ClearSans-Regular-webfont.woff',
    'style/main.css',
    'script.js',
    'index.html'
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