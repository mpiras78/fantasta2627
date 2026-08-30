// Service worker: cache-first per gli asset dell'app, per permettere l'uso offline
// una volta installata (es. dopo "Aggiungi a schermata Home").
//
// IMPORTANTE: quando si modificano i file dell'app (js/css/immagini), aggiornare
// CACHE_NAME (es. incrementare il numero di versione) così i client scaricano
// la nuova versione invece di continuare a servire la cache vecchia.
const CACHE_NAME = 'fantasta2627-v1';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './css/style.css',
  './js/data.js',
  './js/state.js',
  './js/main.js',
  './img/assist.png',
  './img/cleansheet.png',
  './img/cleansheet_2.png',
  './img/goal.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Strategia: cache-first con fallback di rete, poi aggiornamento della cache in background.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
