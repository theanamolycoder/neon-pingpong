// Neon Pong service worker: network-first, so players always get the newest version when online,
// and the last good copy keeps the game (and vs-AI mode) working when the connection drops.
const CACHE = 'neon-pong-v2';
self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', 'index.html', 'manifest.webmanifest', 'icon.svg'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
    const r = e.request;
    if (r.method !== 'GET') return;
    if (new URL(r.url).origin !== self.location.origin) return;   // never touch PeerJS / Firebase / fonts traffic
    e.respondWith(
        // no-cache: always ask the server for the newest copy instead of a stale browser-cached one
        fetch(r, { cache: 'no-cache' }).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(r, copy)); } return res; })
            .catch(() => caches.match(r).then((m) => m || caches.match('index.html')))
    );
});
