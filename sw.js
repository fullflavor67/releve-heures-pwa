const CACHE_NAME = "releve-heures-cache-v1";
const urlsToCache = [
  "./index.html",
  "./app.js",
  "./style.css",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Installation du service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Activation
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

// Interception des requêtes
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
