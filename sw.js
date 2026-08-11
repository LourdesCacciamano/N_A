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
    if (event.request.method !== "GET") return; // no se puede cachear POST/PUT, etc.

    // Red primero: si hay internet, siempre trae la versión real y de paso
    // actualiza la caché. Solo si falla (sin conexión) usa lo guardado.
    // Así los cambios se ven al toque, sin depender de subir CACHE_NAME.
    event.respondWith(
        fetch(event.request)
            .then((respuestaRed) => {
                if (respuestaRed.ok) {
                    const copia = respuestaRed.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
                }
                return respuestaRed;
            })
            .catch(() => caches.match(event.request))
    );
});