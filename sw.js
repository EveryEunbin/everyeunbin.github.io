const CacheVersion = 1;
const cacheName = `pwa-v${CacheVersion}`;
const filesToCache = [
  "/",
  "/css/style.css",
  "/css/scan.css",
  "/sw.js",
  "/js/runsw.js",
  "/js/scan.js",
  "/assets/favicon.ico",
  "/assets/favicon-32x32.png",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
  "/assets/markable_icon.png",
  "/assets/apple-touch-icon-180x180.png",
  "/manifest.json"
];

// Service Worker
self.addEventListener("install", function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log("Opened cache", cacheName);
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  let pathname = new URL(event.request.url).pathname;
  if (filesToCache.indexOf(pathname) === -1) return;

  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        console.log("Found ", event.request.url, " in cache");
        return response;
      }
      return fetch(event.request).then(function (response) {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        var responseToCache = response.clone();
        caches.open(cacheName).then(function (cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  var cacheKeeplist = [cacheName];
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("delete cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
