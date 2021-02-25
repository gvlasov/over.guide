self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('smolguide').then(function(cache) {
            return cache.addAll([
                '/index.html',
            ]);
        })
    );
});

self.addEventListener('fetch', function(e) {
    /*
    * Fetch event handler is a must to enable beforeinstallprompt event
    * https://stackoverflow.com/a/51248010/1542343
    */
    // e.respondWith(
    //     caches.match(e.request).then(function(response) {
    //         return response || fetch(e.request);
    //     })
    // );
});