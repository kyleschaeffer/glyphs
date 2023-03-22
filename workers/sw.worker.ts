const CACHE_VERSION = '1.0'
const CACHED_RESOURCES = ['/', '/favicon.svg', '/glyphs/15.0.json']

async function cacheAllRequests(requests: RequestInfo[]) {
  const cache = await caches.open(CACHE_VERSION)
  await cache.addAll(requests)
}

async function cacheRequest(request: Request, response: Response) {
  const cache = await caches.open(CACHE_VERSION)
  await cache.put(request, response)
}

async function handleFetch(request: Request, preloadResponsePromise: Promise<Response>, fallbackUrl?: string) {
  const responseFromCache = await caches.match(request)
  if (responseFromCache) {
    return responseFromCache
  }

  const preloadResponse = await preloadResponsePromise
  if (preloadResponse) {
    cacheRequest(request, preloadResponse.clone())
    return preloadResponse
  }

  try {
    const responseFromNetwork = await fetch(request)
    if (new URL(request.url).protocol !== 'chrome-extension:') {
      cacheRequest(request, responseFromNetwork.clone())
    }
    return responseFromNetwork
  } catch (error) {
    if (fallbackUrl) {
      const fallbackResponse = await caches.match(fallbackUrl)
      if (fallbackResponse) {
        return fallbackResponse
      }
    }
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}

async function enableNavigationPreload() {
  await (self as any).registration.navigationPreload?.enable()
}

self.addEventListener('activate', (event: any) => event.waitUntil(enableNavigationPreload()))
self.addEventListener('install', (event: any) => event.waitUntil(cacheAllRequests(CACHED_RESOURCES)))
self.addEventListener('fetch', (event: any) => event.respondWith(handleFetch(event.request, event.preloadResponse)))

export {}
