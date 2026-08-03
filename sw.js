const CACHE_NAME = "na-cache-v7"; // subí el número respecto al que tengas ahora

// Rutas estáticas clave que queremos disponibles offline
const URLS_A_CACHEAR = [
    "/",
    "/index.html",
    "/paginasLogin/miPlan.html",
    "/css/style.css",
    "/javaScript/firebasePlan.js",
    "/javaScript/menuAuth.js",
    "/imagenes/logoB.png",
    "/manifest.json"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_A_CACHEAR))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((nombres) =>
            Promise.all(
                nombres
                    .filter((nombre) => nombre !== CACHE_NAME)
                    .map((nombre) => caches.delete(nombre))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((respuestaCache) => {
            return (
                respuestaCache ||
                fetch(event.request).catch(() => {
                    // acá podrías devolver una página offline.html si querés
                })
            );
        })
    );
});