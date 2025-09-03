// Service Worker for Carbon Cube Kenya - Version ${Date.now()}
const CACHE_VERSION = "${Date.now()}";
const STATIC_CACHE = "carbon-cube-static-${Date.now()}";
const DYNAMIC_CACHE = "carbon-cube-dynamic-${Date.now()}";

// Files to cache immediately
const STATIC_FILES = [
	"/",
	"/static/js/main.js",
	"/static/css/main.css",
	"/optimized-banners/banner-01-2xl.webp",
	"/optimized-banners/banner-02-2xl.webp",
	"/optimized-banners/banner-03-2xl.webp",
	"/optimized-banners/banner-04-2xl.webp",
	"/optimized-banners/banner-05-2xl.webp",
	"/favicon.ico",
	"/manifest.json",
];

// Install event - cache static files
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(STATIC_CACHE)
			.then((cache) => {
				console.log("Caching static files with version:", CACHE_VERSION);
				return Promise.allSettled(
					STATIC_FILES.map((url) =>
						cache.add(url).catch((error) => {
							console.log("Failed to cache " + url + ":", error);
							return null;
						})
					)
				);
			})
			.catch((error) => {
				console.log("Cache install failed:", error);
			})
	);
	self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
						console.log("Deleting old cache:", cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
	self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== "GET") {
		return;
	}

	// Skip chrome-extension and other non-http requests
	if (!url.protocol.startsWith("http")) {
		return;
	}

	// Handle HTML files - always fetch fresh
	if (request.destination === "document" || url.pathname === "/") {
		event.respondWith(
			fetch(request)
				.then((response) => {
					// Don't cache HTML files
					return response;
				})
				.catch(() => {
					// Fallback to cached version if available
					return caches.match(request);
				})
		);
		return;
	}

	// Handle API requests - never cache in development
	if (url.pathname.startsWith("/api/")) {
		event.respondWith(
			fetch(request)
				.then((response) => {
					return response;
				})
				.catch(() => {
					// No fallback for API requests
					return new Response("Network error", { status: 503 });
				})
		);
		return;
	}

	// Handle image requests
	if (request.destination === "image") {
		event.respondWith(
			caches.match(request).then((response) => {
				if (response) {
					return response;
				}

				return fetch(request).then((response) => {
					// Cache successful image responses
					if (response.status === 200) {
						const responseClone = response.clone();
						caches.open(DYNAMIC_CACHE).then((cache) => {
							cache.put(request, responseClone);
						});
					}
					return response;
				});
			})
		);
		return;
	}

	// Handle static files
	event.respondWith(
		caches.match(request).then((response) => {
			if (response) {
				return response;
			}

			return fetch(request).then((response) => {
				// Don't cache non-successful responses
				if (!response || response.status !== 200 || response.type !== "basic") {
					return response;
				}

				// Cache successful responses
				const responseClone = response.clone();
				caches.open(DYNAMIC_CACHE).then((cache) => {
					cache.put(request, responseClone);
				});

				return response;
			});
		})
	);
});

// Background sync for offline functionality
self.addEventListener("sync", (event) => {
	if (event.tag === "background-sync") {
		event.waitUntil(doBackgroundSync());
	}
});

function doBackgroundSync() {
	// Implement background sync logic here
	console.log("Background sync triggered");
}

// Message event for cache management
self.addEventListener("message", (event) => {
	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}

	if (event.data && event.data.type === "CLEAR_CACHE") {
		event.waitUntil(
			caches.keys().then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						return caches.delete(cacheName);
					})
				);
			})
		);
	}
});

// Push notification handling
self.addEventListener("push", (event) => {
	if (event.data) {
		const data = event.data.json();
		const options = {
			body: data.body,
			icon: "/favicon.ico",
			badge: "/favicon.ico",
			vibrate: [100, 50, 100],
			data: {
				dateOfArrival: Date.now(),
				primaryKey: 1,
			},
		};

		event.waitUntil(self.registration.showNotification(data.title, options));
	}
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	event.waitUntil(clients.openWindow("/"));
});
