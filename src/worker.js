const CACHE_NAME = 'v1'
const urlsToCache = ['/']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/'])
    })
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.url.indexOf('http') !== 0) return

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response
      const fetchRequest = event.request.clone()
      return fetch(fetchRequest).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    })
  )
})
