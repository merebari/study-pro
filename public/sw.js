/* Study Pro service worker — offline-first for visited pages & static assets. */
const VERSION = "studypro-v1";
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const PRECACHE = ["/", "/icon.svg", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || !request.url.startsWith(self.location.origin)) return;
  const url = new URL(request.url);

  // Cache-first for static assets & images
  if (url.pathname.startsWith("/_next/static") || url.pathname.startsWith("/images") || url.pathname.endsWith(".svg") || url.pathname.endsWith(".png")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
            return res;
          })
      )
    );
    return;
  }

  // Network-first for pages & API, falling back to cache when offline
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok && (request.mode === "navigate" || url.pathname.startsWith("/api"))) {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((c) => c.put(request, copy));
        }
        return res;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") {
          const home = await caches.match("/");
          if (home) return home;
        }
        return new Response("You are offline and this page was not cached yet.", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        });
      })
  );
});
