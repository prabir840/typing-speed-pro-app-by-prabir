const CACHE_NAME = 'speed-typer-pro-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './correct.wav',
  './wrong.wav',
  './gameover-86548.mp3',
  './combo-sound.mp3',
  './click.mp3'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
/* Duplicate urlsToCache declaration removed to fix redeclaration error */

