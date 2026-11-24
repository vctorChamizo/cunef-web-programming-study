'use strict';
// Offline support for the study site. Network first, so students always get the latest version
// when online; the cached copy is only used when the network fails.
const CACHE = 'g247-study-v15';
const SHELL = ['./', 'index.html', 'assets/styles.css', 'assets/app.js', 'assets/icon.svg', 'data/course.js', 'data/quizzes.js', 'data/guides.js', 'data/exercises.js', 'data/explain.js', 'data/practice-bank.js', 'data/en/course.js', 'data/en/quizzes.js', 'data/en/exercises.js', 'data/en/explain.js', 'data/en/practice-bank.js', 'assets/i18n-en.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('index.html'))),
  );
});
