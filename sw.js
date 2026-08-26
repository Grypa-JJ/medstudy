// sw.js
// Service worker do trybu offline. Cache'uje TYLKO statyczne zasoby tej samej
// domeny (HTML/JS/CSS/obrazki/meta.json) - nigdy zapytań do Supabase (auth,
// RLS-owana treść pytań, zapis postępu). Te muszą zawsze iść na żywo do sieci,
// inaczej użytkownik offline widziałby cudzą/nieaktualną sesję albo stary stan
// bazy zamiast czytelnego błędu "brak internetu".
//
// Numer w CACHE_NAME podbij przy każdej zmianie listy APP_SHELL, żeby stare
// urządzenia dostały nowy zestaw plików zamiast trzymać się starego cache'a.
const CACHE_NAME = "medstudy-shell-v1";

const APP_SHELL = [
    "./",
    "./index.html",
    "./manifest.json",
    "./supabase-config.js",
    "./supabase-client.js",
    "./auth.js",
    "./id-utils.js",
    "./storage.js",
    "./content.js",
    "./study_plan.js",
    "./validator.js",
    "./kotek.gif",
    "./brand-assets/favicon-64.png",
    "./brand-assets/favicon-180.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((names) => Promise.all(
                names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
            ))
            .then(() => self.clients.claim())
    );
});

// meta.json (metadane + obrazki pytań, kilka MB) rośnie z czasem - trzymamy
// stale-while-revalidate zamiast cache-first: użytkownik offline dostaje
// ostatnią znaną wersję natychmiast, a online w tle dogrywa się świeższa,
// więc kolejne odświeżenie ma już aktualne dane bez czekania.
function staleWhileRevalidate(request) {
    return caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
            const network = fetch(request)
                .then((response) => {
                    if (response.ok) cache.put(request, response.clone());
                    return response;
                })
                .catch(() => cached);
            return cached || network;
        })
    );
}

function cacheFirst(request) {
    return caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
            if (response.ok) {
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
        });
    });
}

self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Nigdy nie przechwytuj zapytań spoza własnej domeny (Supabase, CDN
    // supabase-js) ani zapytań innych niż GET (POST/PATCH do bazy).
    if (url.origin !== self.location.origin || request.method !== "GET") return;

    if (url.pathname.endsWith("/meta.json")) {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }

    event.respondWith(cacheFirst(request));
});
