const CACHE_NAME = "na-cache-v1";

// Rutas estáticas clave que queremos disponibles offline
const URLS_A_CACHEAR = [
    "/",
    "/index.html",
    "/css/style.css",
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
    // No cachear páginas que dependen de login/datos personales
    if (event.request.url.includes("miPlan") || event.request.url.includes("cuota")) {
        return;
    }

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