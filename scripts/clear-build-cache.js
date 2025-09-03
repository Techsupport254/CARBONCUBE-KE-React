#!/usr/bin/env node

/**
 * Build Cache Clearing Script
 * Clears all caches after build process to ensure fresh deployment
 */

const fs = require("fs");
const path = require("path");

const BUILD_DIR = path.join(__dirname, "../build");
const PUBLIC_DIR = path.join(__dirname, "../public");

console.log("🧹 Clearing build caches...");

function clearBuildCache() {
	try {
		// Step 1: Update service worker with new version
		updateServiceWorkerVersion();

		// Step 2: Add cache-busting to HTML
		addCacheBustingToHTML();

		// Step 3: Create cache-clearing script in build
		createCacheClearingScript();

		// Step 4: Update manifest with new version
		updateManifestVersion();

		console.log("✅ Build cache clearing completed successfully");
	} catch (error) {
		console.error("❌ Error clearing build cache:", error.message);
		process.exit(1);
	}
}

function updateServiceWorkerVersion() {
	console.log("📝 Updating service worker with new version...");

	const timestamp = Date.now();
	const swContent = `// Service Worker for Carbon Cube Kenya - Version ${timestamp}
const CACHE_VERSION = "${timestamp}";
const STATIC_CACHE = "carbon-cube-static-${timestamp}";
const DYNAMIC_CACHE = "carbon-cube-dynamic-${timestamp}";

// Files to cache immediately - only cache files that are guaranteed to exist
const STATIC_FILES = [
	"/",
	"/favicon.ico",
	"/manifest.json",
	"/optimized-banners/banner-01-2xl.webp",
	"/optimized-banners/banner-02-2xl.webp",
	"/optimized-banners/banner-03-2xl.webp",
	"/optimized-banners/banner-04-2xl.webp",
	"/optimized-banners/banner-05-2xl.webp",
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

	// Handle static files - use a more intelligent caching strategy
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

				// Only cache static assets, not API responses or HTML
				const url = new URL(request.url);
				const isStaticAsset = 
					url.pathname.startsWith('/static/') ||
					url.pathname.startsWith('/optimized-banners/') ||
					url.pathname === '/favicon.ico' ||
					url.pathname === '/manifest.json';

				if (isStaticAsset) {
					// Cache successful static asset responses
					const responseClone = response.clone();
					caches.open(DYNAMIC_CACHE).then((cache) => {
						cache.put(request, responseClone);
					});
				}

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
`;

	const swPath = path.join(BUILD_DIR, "sw.js");
	fs.writeFileSync(swPath, swContent);

	console.log("Service worker updated with version:", timestamp);
}

function addCacheBustingToHTML() {
	console.log("📝 Adding cache-busting to HTML...");

	const indexPath = path.join(BUILD_DIR, "index.html");
	let htmlContent = fs.readFileSync(indexPath, "utf8");

	// Add cache-busting script
	const cacheBustingScript = `
		<script>
			// Cache management for production - CLEAR ALL CACHES ONLY
			(function() {
				const CACHE_VERSION = '${Date.now()}';
				
				// Clear ALL caches on page load - no filtering
				if ('caches' in window) {
					caches.keys().then((cacheNames) => {
						console.log('Found caches to clear:', cacheNames);
						cacheNames.forEach((cacheName) => {
							caches.delete(cacheName);
							console.log('Cleared cache:', cacheName);
						});
					});
				}
				
				// Unregister ALL service workers
				if ('serviceWorker' in navigator) {
					navigator.serviceWorker.getRegistrations().then((registrations) => {
						registrations.forEach((registration) => {
							registration.unregister();
							console.log('Unregistered service worker:', registration.scope);
						});
					});
				}
				
				// Add version to all static assets
				const addVersionToAssets = () => {
					const links = document.querySelectorAll('link[href*="/static/"]');
					links.forEach((link) => {
						if (link.href && !link.href.includes('v=')) {
							link.href += (link.href.includes('?') ? '&' : '?') + 'v=' + CACHE_VERSION;
						}
					});
					
					const scripts = document.querySelectorAll('script[src*="/static/"]');
					scripts.forEach((script) => {
						if (script.src && !script.src.includes('v=')) {
							script.src += (script.src.includes('?') ? '&' : '?') + 'v=' + CACHE_VERSION;
						}
					});
				};
				
				// Run after DOM is loaded
				if (document.readyState === 'loading') {
					document.addEventListener('DOMContentLoaded', addVersionToAssets);
				} else {
					addVersionToAssets();
				}
			})();
		</script>
	`;

	// Insert cache-busting script in head
	htmlContent = htmlContent.replace(
		"</head>",
		`${cacheBustingScript}\n\t</head>`
	);

	// Update service worker registration
	const swRegistration = `
		<script>
			// Register service worker with version control
			if ('serviceWorker' in navigator) {
				window.addEventListener('load', () => {
					navigator.serviceWorker.register('/sw.js?v=${Date.now()}', {
						scope: '/',
						updateViaCache: 'none'
					})
					.then((registration) => {
						console.log('SW registered with version:', '${Date.now()}');
						
						// Check for updates
						registration.addEventListener('updatefound', () => {
							const newWorker = registration.installing;
							newWorker.addEventListener('statechange', () => {
								if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
									// New version available - auto reload
									window.location.reload();
								}
							});
						});
					})
					.catch((error) => {
						console.log('SW registration failed:', error);
					});
				});
			}
		</script>
	`;

	// Replace existing service worker registration or add new one
	if (htmlContent.includes("serviceWorker")) {
		htmlContent = htmlContent.replace(
			/<script>[\s\S]*?serviceWorker[\s\S]*?<\/script>/g,
			swRegistration
		);
	} else {
		htmlContent = htmlContent.replace(
			"</body>",
			`${swRegistration}\n\t</body>`
		);
	}

	fs.writeFileSync(indexPath, htmlContent);
	console.log("HTML updated with cache-busting");
}

function createCacheClearingScript() {
	console.log("📝 Creating cache-clearing script...");

	const cacheClearScript = `
		<script>
			// Auto-clear ALL caches on page load (preserve storage)
			(function() {
				const CACHE_VERSION = '${Date.now()}';
				
				// Clear ALL service workers - no filtering
				if ('serviceWorker' in navigator) {
					navigator.serviceWorker.getRegistrations().then((registrations) => {
						console.log('Found service workers to unregister:', registrations.length);
						registrations.forEach((registration) => {
							registration.unregister();
							console.log('Unregistered service worker:', registration.scope);
						});
					});
				}
				
				// Clear ALL caches - no filtering
				if ('caches' in window) {
					caches.keys().then((cacheNames) => {
						console.log('Found caches to clear:', cacheNames);
						cacheNames.forEach((cacheName) => {
							caches.delete(cacheName);
							console.log('Cleared cache:', cacheName);
						});
					});
				}
			})();
		</script>
	`;

	const indexPath = path.join(BUILD_DIR, "index.html");
	let htmlContent = fs.readFileSync(indexPath, "utf8");

	// Add cache clearing script
	htmlContent = htmlContent.replace(
		"</head>",
		`${cacheClearScript}\n\t</head>`
	);

	fs.writeFileSync(indexPath, htmlContent);
	console.log("Cache-clearing script added to HTML");
}

function updateManifestVersion() {
	console.log("📝 Updating manifest version...");

	const manifestPath = path.join(BUILD_DIR, "manifest.json");
	if (fs.existsSync(manifestPath)) {
		const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
		manifest.version = `1.0.${Date.now()}`;
		manifest.timestamp = Date.now();
		fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
		console.log("Manifest updated with new version");
	}
}

// Run the cache clearing
clearBuildCache();
