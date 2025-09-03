#!/usr/bin/env node

/**
 * Cache Management Script
 * Manages cache invalidation and version control for development
 */

const fs = require("fs");
const path = require("path");

const BUILD_DIR = path.join(__dirname, "../build");
const PUBLIC_DIR = path.join(__dirname, "../public");

// Cache management configuration
const CACHE_CONFIG = {
	// Version for cache busting
	version: Date.now().toString(),

	// Files that should never be cached
	noCache: ["index.html", "sw.js", "manifest.json", "manifest.webmanifest"],

	// Files that should have short cache
	shortCache: ["*.js", "*.css"],

	// Files that can be cached long-term
	longCache: ["*.webp", "*.png", "*.jpg", "*.ico", "*.woff2", "*.woff"],
};

function manageCache() {
	try {
		console.log("🔧 Managing cache configuration...");

		// Step 1: Update service worker with version
		updateServiceWorker();

		// Step 2: Update HTML with cache-busting
		updateHTMLCacheBusting();

		// Step 3: Create cache headers file
		createCacheHeaders();

		// Step 4: Update nginx configuration
		updateNginxConfig();

		console.log("Cache management completed");
	} catch (error) {
		console.error("Error managing cache:", error.message);
		process.exit(1);
	}
}

function updateServiceWorker() {
	console.log("Updating service worker with version...");

	const timestamp = Date.now();
	const swContent = `
// Service Worker for Carbon Cube Kenya - Version ${timestamp}
const CACHE_VERSION = '${timestamp}';
const STATIC_CACHE = 'carbon-cube-static-${timestamp}';
const DYNAMIC_CACHE = 'carbon-cube-dynamic-${timestamp}';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/static/js/main.js',
  '/static/css/main.css',
  '/optimized-banners/banner-01-2xl.webp',
  '/optimized-banners/banner-02-2xl.webp',
  '/optimized-banners/banner-03-2xl.webp',
  '/optimized-banners/banner-04-2xl.webp',
  '/optimized-banners/banner-05-2xl.webp',
  '/favicon.ico',
  '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files with version:', CACHE_VERSION);
        return Promise.allSettled(
          STATIC_FILES.map(url => 
            cache.add(url).catch(error => {
              console.log('Failed to cache ' + url + ':', error);
              return null;
            })
          )
        );
      })
      .catch((error) => {
        console.log('Cache install failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle HTML files - always fetch fresh
  if (request.destination === 'document' || url.pathname === '/') {
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

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response
          const responseClone = response.clone();
          
          // Cache successful API responses for short time
          if (response.status === 200) {
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          
          return response;
        })
        .catch(() => {
          // Fallback to cached version if available
          return caches.match(request);
        })
    );
    return;
  }

  // Handle image requests
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(request)
            .then((response) => {
              // Cache successful image responses
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
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
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Cache successful responses
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
            
            return response;
          });
      })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implement background sync logic here
  console.log('Background sync triggered');
}

// Message event for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
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
`;

	const swPath = path.join(BUILD_DIR, "sw.js");
	fs.writeFileSync(swPath, swContent);

	console.log("Service worker updated with version:", timestamp);
}

function updateHTMLCacheBusting() {
	console.log("📝 Updating HTML with cache-busting...");

	const indexPath = path.join(BUILD_DIR, "index.html");
	let htmlContent = fs.readFileSync(indexPath, "utf8");

	// Add cache-busting script
	const cacheBustingScript = `
		<script>
			// Cache management for development
			(function() {
				const CACHE_VERSION = '${timestamp}';
				
				// Clear old caches on page load
				if ('caches' in window) {
					caches.keys().then((cacheNames) => {
						cacheNames.forEach((cacheName) => {
							if (!cacheName.includes(CACHE_VERSION)) {
								caches.delete(cacheName);
								console.log('Cleared old cache:', cacheName);
							}
						});
					});
				}
				
				// Force reload if service worker is outdated
				if ('serviceWorker' in navigator) {
					navigator.serviceWorker.getRegistration().then((registration) => {
						if (registration && registration.active) {
							registration.active.postMessage({
								type: 'SKIP_WAITING'
							});
						}
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
					navigator.serviceWorker.register('/sw.js?v=${timestamp}', {
						scope: '/',
						updateViaCache: 'none'
					})
					.then((registration) => {
						console.log('SW registered with version:', '${timestamp}');
						
						// Check for updates
						registration.addEventListener('updatefound', () => {
							const newWorker = registration.installing;
							newWorker.addEventListener('statechange', () => {
								if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
									// New version available
									if (confirm('New version available. Reload to update?')) {
										window.location.reload();
									}
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

	// Replace existing service worker registration
	htmlContent = htmlContent.replace(
		/<script>[\s\S]*?serviceWorker[\s\S]*?<\/script>/g,
		swRegistration
	);

	fs.writeFileSync(indexPath, htmlContent);
	console.log("HTML updated with cache-busting");
}

function createCacheHeaders() {
	console.log(" Creating cache headers file...");

	const headersContent = `# Cache headers for Carbon Cube Kenya
# Generated on ${new Date().toISOString()}

# Never cache these files
/index.html
/sw.js
/manifest.json
/manifest.webmanifest
*.map

# Short cache for JS and CSS (1 hour)
/static/js/*
/static/css/*
Cache-Control: public, max-age=3600

# Long cache for static assets (1 year)
/optimized-banners/*
*.webp
*.png
*.jpg
*.ico
*.woff2
*.woff
Cache-Control: public, max-age=31536000, immutable

# API responses (no cache)
/api/*
Cache-Control: no-cache, no-store, must-revalidate
`;

	const headersPath = path.join(BUILD_DIR, "_headers");
	fs.writeFileSync(headersPath, headersContent);

	console.log("Cache headers file created");
}

function updateNginxConfig() {
	console.log("🔧 Updating nginx configuration...");

	const nginxPath = path.join(__dirname, "../nginx.conf");
	let nginxContent = fs.readFileSync(nginxPath, "utf8");

	// Update cache headers for better development experience
	nginxContent = nginxContent.replace(
		/location = \/index\.html \{[\s\S]*?\}/g,
		`location = /index.html {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
        add_header Pragma "no-cache";
    }`
	);

	nginxContent = nginxContent.replace(
		/location = \/service-worker\.js \{[\s\S]*?\}/g,
		`location = /sw.js {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
        add_header Pragma "no-cache";
    }`
	);

	// Add version-based cache busting
	nginxContent = nginxContent.replace(
		/location ~\* \.(js\|css\|png\|jpg\|jpeg\|gif\|ico\|svg\|woff\|woff2\|ttf\|eot\) \{[\s\S]*?\}/g,
		`location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        # Add version parameter for cache busting
        if ($arg_v) {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
    }`
	);

	fs.writeFileSync(nginxPath, nginxContent);
	console.log("Nginx configuration updated");
}

// Run if called directly
if (require.main === module) {
	manageCache();
}

module.exports = { manageCache };
