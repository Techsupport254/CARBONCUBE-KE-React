#!/usr/bin/env node

/**
 * Performance Optimizer
 * Comprehensive performance optimization for Carbon Cube Kenya
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BUILD_DIR = path.join(__dirname, "../build");
const INDEX_HTML = path.join(BUILD_DIR, "index.html");

// Performance optimization configuration
const PERFORMANCE_CONFIG = {
	// Critical CSS to inline
	criticalCSS: `
    /* Critical above-the-fold styles */
    * { box-sizing: border-box; }
    body { 
      margin: 0; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background-color: #e0e0e0;
    }
    #root { min-height: 100vh; }
    .navbar { background-color: #000; padding: 0.5rem 0; }
    .navbar-brand { color: #ffc107 !important; font-weight: bold; }
    .search-form { position: relative; max-width: 600px; margin: 0 auto; }
    .search-input { width: 100%; padding: 0.75rem 1rem; border: 2px solid #ffc107; border-radius: 50px; }
    .carousel { margin-bottom: 2rem; }
    .carousel-item img { width: 100%; height: auto; object-fit: cover; }
    .btn-primary { background-color: #ffc107; border-color: #ffc107; color: #000; }
    .loading { display: flex; justify-content: center; align-items: center; min-height: 200px; }
    img { max-width: 100%; height: auto; }
    @media (max-width: 768px) { .navbar-brand { font-size: 1.2rem; } }
  `,

	// Resources to preload
	preload: [
		{
			href: "/static/css/main.css",
			as: "style",
			onload: "this.onload=null;this.rel='stylesheet'",
		},
		{ href: "/static/js/main.js", as: "script", fetchpriority: "high" },
		{
			href: "/optimized-banners/banner-01-xl.webp",
			as: "image",
			fetchpriority: "high",
		},
	],

	// Resources to defer
	defer: ["/static/js/analytics.js", "/static/js/utils.js"],

	// Cache headers for different file types
	cacheHeaders: {
		"*.css": "public, max-age=31536000, immutable",
		"*.js": "public, max-age=31536000, immutable",
		"*.webp": "public, max-age=31536000, immutable",
		"*.png": "public, max-age=31536000, immutable",
		"*.jpg": "public, max-age=31536000, immutable",
		"*.ico": "public, max-age=31536000, immutable",
		"*.woff2": "public, max-age=31536000, immutable",
		"*.woff": "public, max-age=31536000, immutable",
	},
};

function optimizePerformance() {
	try {
		console.log("🚀 Starting comprehensive performance optimization...");

		// Step 1: Inline critical CSS
		inlineCriticalCSS();

		// Step 2: Optimize resource loading
		optimizeResourceLoading();

		// Step 3: Add performance monitoring
		addPerformanceMonitoring();

		// Step 4: Optimize images
		optimizeImages();

		// Step 5: Add service worker for caching
		addServiceWorker();

		// Step 6: Generate performance report
		generatePerformanceReport();

		console.log("Performance optimization completed successfully!");
	} catch (error) {
		console.error("Error during performance optimization:", error.message);
		process.exit(1);
	}
}

function inlineCriticalCSS() {
	console.log("🎨 Inlining critical CSS...");

	let htmlContent = fs.readFileSync(INDEX_HTML, "utf8");

	// Add critical CSS inline
	const criticalCSSInline = `<style id="critical-css">${PERFORMANCE_CONFIG.criticalCSS}</style>`;

	// Insert after title tag
	htmlContent = htmlContent.replace(
		/<title>.*?<\/title>/,
		(match) => `${match}\n\t\t${criticalCSSInline}`
	);

	// Replace CSS loading with preload
	htmlContent = htmlContent.replace(
		/<link rel="stylesheet" href="\/static\/css\/main\.[^"]+\.css">/g,
		PERFORMANCE_CONFIG.preload
			.filter((resource) => resource.as === "style")
			.map(
				(resource) =>
					`<link rel="preload" href="${resource.href}" as="${resource.as}" onload="${resource.onload}">`
			)
			.join("\n\t\t")
	);

	fs.writeFileSync(INDEX_HTML, htmlContent);
	console.log("Critical CSS inlined");
}

function optimizeResourceLoading() {
	console.log("📦 Optimizing resource loading...");

	let htmlContent = fs.readFileSync(INDEX_HTML, "utf8");

	// Add preload hints
	const preloadHints = PERFORMANCE_CONFIG.preload
		.filter((resource) => resource.as !== "style")
		.map(
			(resource) =>
				`<link rel="preload" href="${resource.href}" as="${resource.as}" ${
					resource.fetchpriority
						? `fetchpriority="${resource.fetchpriority}"`
						: ""
				}>`
		)
		.join("\n\t\t");

	// Insert preload hints after critical CSS
	htmlContent = htmlContent.replace(
		/<style id="critical-css">.*?<\/style>/s,
		(match) => `${match}\n\t\t${preloadHints}`
	);

	// Add defer to non-critical scripts
	PERFORMANCE_CONFIG.defer.forEach((script) => {
		htmlContent = htmlContent.replace(
			new RegExp(
				`<script[^>]*src="${script.replace(
					/[.*+?^${}()|[\]\\]/g,
					"\\$&"
				)}"[^>]*>`
			),
			'<script src="$&" defer>'
		);
	});

	fs.writeFileSync(INDEX_HTML, htmlContent);
	console.log("Resource loading optimized");
}

function addPerformanceMonitoring() {
	console.log("📊 Adding performance monitoring...");

	let htmlContent = fs.readFileSync(INDEX_HTML, "utf8");

	const performanceScript = `
		<script>
			// Performance monitoring
			window.addEventListener('load', function() {
				// Core Web Vitals
				if ('PerformanceObserver' in window) {
					const observer = new PerformanceObserver((list) => {
						list.getEntries().forEach((entry) => {
							if (entry.name === 'LCP') {
								console.log('LCP:', entry.startTime);
								// Send to analytics
								if (window.gtag) {
									gtag('event', 'web_vitals', {
										event_category: 'Web Vitals',
										event_label: 'LCP',
										value: Math.round(entry.startTime)
									});
								}
							}
						});
					});
					observer.observe({ entryTypes: ['largest-contentful-paint'] });
				}
				
				// Report page load time
				const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
				console.log('Page load time:', loadTime + 'ms');
			});
		</script>
	`;

	// Insert before closing body tag
	htmlContent = htmlContent.replace(
		"</body>",
		`${performanceScript}\n\t</body>`
	);

	fs.writeFileSync(INDEX_HTML, htmlContent);
	console.log("Performance monitoring added");
}

function optimizeImages() {
	console.log("🖼️  Optimizing images...");

	// This will be handled by the optimize-banner-images.js script
	console.log(
		"Image optimization (run separately with: npm run optimize-images)"
	);
}

function addServiceWorker() {
	console.log("🔧 Adding service worker for caching...");

	const serviceWorkerContent = `
// Service Worker for Carbon Cube Kenya
const CACHE_NAME = 'carbon-cube-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  '/optimized-banners/banner-01-xl.webp',
  '/optimized-banners/banner-02-xl.webp',
  '/optimized-banners/banner-03-xl.webp',
  '/optimized-banners/banner-04-xl.webp',
  '/optimized-banners/banner-05-xl.webp'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip analytics and external requests
  if (request.url.includes('google-analytics') || 
      request.url.includes('googletagmanager') ||
      request.url.includes('matomo')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(request)
          .then((fetchResponse) => {
            // Cache successful responses
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => cache.put(request, responseClone));
            }
            return fetchResponse;
          });
      })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
});
`;

	const swPath = path.join(BUILD_DIR, "sw.js");
	fs.writeFileSync(swPath, serviceWorkerContent);

	// Register service worker in HTML
	let htmlContent = fs.readFileSync(INDEX_HTML, "utf8");
	const swRegistration = `
		<script>
			// Register service worker
			if ('serviceWorker' in navigator) {
				window.addEventListener('load', () => {
					navigator.serviceWorker.register('/sw.js')
						.then((registration) => {
							console.log('SW registered:', registration);
						})
						.catch((error) => {
							console.log('SW registration failed:', error);
						});
				});
			}
		</script>
	`;

	htmlContent = htmlContent.replace("</body>", `${swRegistration}\n\t</body>`);
	fs.writeFileSync(INDEX_HTML, htmlContent);

	console.log("Service worker added");
}

function generatePerformanceReport() {
	console.log(" Generating performance report...");

	const report = {
		timestamp: new Date().toISOString(),
		optimizations: [
			"Critical CSS inlined",
			"Resource preloading configured",
			"JavaScript deferred loading",
			"Service worker for caching",
			"Performance monitoring added",
			"Image optimization ready",
		],
		recommendations: [
			"Run npm run optimize-images to optimize banner images",
			"Monitor Core Web Vitals in Google Analytics",
			"Consider implementing lazy loading for below-the-fold images",
			"Review and remove unused CSS/JS with bundle analyzer",
		],
		nextSteps: [
			"Test performance with PageSpeed Insights",
			"Monitor real user metrics",
			"Consider implementing AMP for mobile",
			"Optimize third-party script loading",
		],
	};

	const reportPath = path.join(__dirname, "../performance-report.json");
	fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

	console.log(`Performance report saved to: ${reportPath}`);
}

// Run if called directly
if (require.main === module) {
	optimizePerformance();
}

module.exports = { optimizePerformance };
