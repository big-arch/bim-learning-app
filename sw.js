const CACHE_NAME = "bim-academy-v28";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./learning.js",
  "./assets/autocad.svg",
  "./assets/bim.svg",
  "./assets/workshop-banner.jpg",
  "./assets/civil3d.svg",
  "./assets/english.svg",
  "./assets/manager.svg",
  "./assets/navisworks.svg",
  "./assets/practice.svg",
  "./assets/revit.svg",
  "./assets/revitserver.svg",
  "./assets/software.svg",

  "./data/editor-changes.js",
  "./icons/training-sheet.svg",
  "./icons/training-schedule.svg",
  "./heroes.js",
  "./heroes-pixel.js",
  "./heroes.css",
  "./sims.js",
  "./covers.js",
  "./vendor/supabase.js",
  "./data/cases.js",
  "./data/paths.js",
  "./manifest.webmanifest",
  "./version.json",
  "./data/figures.js",
  "./data/course-bim.js",
  "./data/course-revit.js",
  "./data/course-navisworks.js",
  "./data/course-autocad.js",
  "./data/course-civil3d.js",
  "./data/course-practice.js",
  "./data/course-manager.js",
  "./data/course-revit-server.js",
  "./data/course-english.js",
  "./data/course-software.js",
  "./data/workshops.js",
  "./data/glossary.js",
  "./data/videos.js",
  "./data/news.js",
  "./data/checklists.js",
  "./data/warnings.js",
  "./data/questions-extra.js",
  "./icons/bim-icon.svg",
  "./icons/bim-icon-180.png",
  "./icons/bim-icon-192.png",
  "./icons/bim-icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL.map((url) => new Request(url, { cache: "reload" }))))

  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("bim-academy-") && key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

// Сеть в приоритете, кэш — как резерв: приложение обновляется сразу,
// но продолжает работать без интернета.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          }
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: APP_SHELL.includes("./" + url.pathname.split(self.registration.scope.replace(self.location.origin, ""))[1]) }).then((cached) => cached || Response.error()))
  );
});
