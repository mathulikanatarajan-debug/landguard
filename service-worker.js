/* ==========================================================================
   LANDSLIDEGUARD NER - SERVICE WORKER (PWA Offline Caching)
   ========================================================================== */

const CACHE_NAME = "landguard-v1.0.0";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./css/dashboard.css",
  "./css/map.css",
  "./css/animations.css",
  "./css/chatbot.css",
  "./css/alerts.css",
  "./css/responsive.css",
  "./js/api.js",
  "./js/language.js",
  "./js/earth.js",
  "./js/map.js",
  "./js/dashboard.js",
  "./js/prediction.js",
  "./js/forecast.js",
  "./js/alerts.js",
  "./js/analytics.js",
  "./js/historical-replay.js",
  "./js/safety.js",
  "./js/chatbot.js",
  "./js/voice.js",
  "./js/offline.js",
  "./js/main.js",
  "./locales/en.json",
  "./locales/ta.json",
  "./locales/hi.json",
  "./locales/te.json",
  "./locales/ml.json",
  "./data/chatbot_knowledge.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell assets...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Fallback for html pages when completely offline
        if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("./index.html");
        }
      });
    })
  );
});
