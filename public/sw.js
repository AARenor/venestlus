const CACHE = "venestlus-v5";
const SHELL = ["/", "/app.js", "/style.css", "/manifest.webmanifest",
  "/icons/icon-192.png", "/icons/icon-512.png",
  "/icons/icon-maskable-512.png", "/icons/apple-touch-icon.png",
  // self-hosted fonts (Playfair Display + Inter, latin / latin-ext / cyrillic)
  "/fonts/inter-latin.woff2", "/fonts/inter-latin-ext.woff2", "/fonts/inter-cyrillic.woff2",
  "/fonts/playfair-700-latin.woff2", "/fonts/playfair-700-latin-ext.woff2", "/fonts/playfair-700-cyrillic.woff2"];

// Precache with cache:"no-cache" so a CDN revalidation can never pin stale
// shell assets right after a deploy (CDN may serve max-age on static files).
self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(SHELL.map(async (p) => {
      try {
        const r = await fetch(p, { cache: "no-cache" });
        if (r.ok) await c.put(p, r);
      } catch (err) { /* offline install: keep going, fetch handler covers it */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return; // network-only for API
  e.respondWith(
    caches.match(url.pathname).then((hit) => {
      if (hit) {
        // stale-while-revalidate for shell files: serve fast, refresh cache in
        // background (defeats CDN/browser staleness without a version bump)
        if (SHELL.some((p) => url.pathname === p) || url.pathname === "/") {
          e.waitUntil(
            fetch(e.request, { cache: "no-cache" })
              .then((r) => { if (r.ok) return caches.open(CACHE).then((c) => c.put(url.pathname, r.clone())); })
              .catch(() => {})
          );
        }
        return hit;
      }
      const inShell = SHELL.some((p) => url.pathname === p);
      return fetch(e.request, inShell ? { cache: "no-cache" } : {}).then((res) => {
        if (res.ok && SHELL.some((p) => url.pathname === p || (p === "/" && url.pathname === "/"))) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(url.pathname, copy));
        }
        return res;
      }).catch(() => caches.match("/"));
    })
  );
});
