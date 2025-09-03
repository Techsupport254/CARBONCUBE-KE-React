import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import sourceTrackingService from "./utils/sourceTracking";
import { getDeviceFingerprint } from "./utils/deviceFingerprint";
import {
	optimizeFontLoading,
	optimizeCriticalPath,
	checkPerformanceBudget,
	logMemoryUsage,
	optimizeCSSDelivery,
	optimizeJavaScriptLoading,
	fixPreloadLinks,
	managePreloadLinks,
} from "./utils/performance";

// Performance monitoring
const reportWebVitalsWithDetails = (metric) => {
	// Send to analytics if metric is defined
	if (metric) {
		reportWebVitals(metric);
	}
};

// Track the visit for analytics at the root level (respect backend exclusion)
(async () => {
	const fingerprint = getDeviceFingerprint();
	const API_URL = process.env.REACT_APP_BACKEND_URL || "/api";

	// Only rely on backend exclusion for visit tracking
	let isExcluded = false;
	try {
		const deviceId = fingerprint.hash;
		const resp = await fetch(
			`${API_URL}/internal_user_exclusions/check/${deviceId}`
		);
		if (resp.ok) {
			const data = await resp.json();
			if ((data && data.status === "approved") || data?.is_excluded === true) {
				isExcluded = true;
			}
		}
	} catch (e) {
		// Ignore network errors and proceed with tracking by default
	}

	if (isExcluded) {
		return;
	}

	sourceTrackingService.trackVisit().catch((error) => {
		console.error("Source tracking failed:", error);
	});
})();

// Enhanced cache busting for production
const clearAllCaches = () => {
	if ("caches" in window) {
		caches.keys().then((cacheNames) => {
			cacheNames.forEach((cacheName) => {
				// Clear ALL caches to prevent any caching issues
				caches.delete(cacheName);
				console.log("Cleared cache:", cacheName);
			});
		});
	}
};

// Aggressive service worker unregistration
const unregisterAllServiceWorkers = () => {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.getRegistrations().then((registrations) => {
			registrations.forEach((registration) => {
				registration.unregister();
				console.log("Unregistered service worker:", registration.scope);
			});
		});
	}
};

// Force reload if service worker is controlling the page
const forceReloadIfControlled = () => {
	if (navigator.serviceWorker && navigator.serviceWorker.controller) {
		console.log("Service worker is controlling the page, forcing reload");
		window.location.reload(true);
	}
};

// Add cache busting to all script and link tags
const addCacheBustingToResources = () => {
	const timestamp = Date.now();
	const scripts = document.querySelectorAll('script[src]');
	const links = document.querySelectorAll('link[href]');
	
	scripts.forEach(script => {
		if (script.src && !script.src.includes('?v=')) {
			script.src = script.src + (script.src.includes('?') ? '&' : '?') + 'v=' + timestamp;
		}
	});
	
	links.forEach(link => {
		if (link.href && !link.href.includes('?v=')) {
			link.href = link.href + (link.href.includes('?') ? '&' : '?') + 'v=' + timestamp;
		}
	});
};

// Performance optimizations
const initializePerformanceOptimizations = () => {
	// Clear all caches first
	clearAllCaches();
	unregisterAllServiceWorkers();
	forceReloadIfControlled();
	addCacheBustingToResources();

	// Manage preload links with enhanced monitoring
	managePreloadLinks();

	// Optimize CSS delivery first
	optimizeCSSDelivery();

	// Optimize font loading
	optimizeFontLoading();

	// Optimize critical rendering path
	optimizeCriticalPath();

	// Optimize JavaScript loading
	optimizeJavaScriptLoading();

	// Register service worker for caching
	// registerServiceWorker();

	// Check performance budget after page load
	window.addEventListener("load", () => {
		setTimeout(() => {
			checkPerformanceBudget();
			logMemoryUsage();
			// Fix preload links again after page load
			fixPreloadLinks();
		}, 1000);
	});
};

// Initialize performance optimizations
initializePerformanceOptimizations();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// Performance monitoring with detailed reporting
reportWebVitalsWithDetails();
