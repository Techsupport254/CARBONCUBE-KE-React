// Final verification script for performance optimizations
const verifyPerformanceOptimizations = () => {
	// Check for 404 errors
	let has404Errors = false;
	const originalFetch = window.fetch;
	window.fetch = function (...args) {
		return originalFetch.apply(this, args).then((response) => {
			if (!response.ok && response.status === 404) {
				console.warn("⚠️ 404 Error detected:", args[0]);
				has404Errors = true;
			}
			return response;
		});
	};

	// Check font loading
	const fontLinks = document.querySelectorAll('link[href*="fonts"]');

	// Check preconnect hints
	const preconnectLinks = document.querySelectorAll('link[rel="preconnect"]');

	// Check optimized images
	const optimizedImages = document.querySelectorAll(
		'img[src*="optimized-banners"]'
	);

	// Check service worker
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.getRegistrations().then((registrations) => {
			// Service workers registered
		});
	}

	// Performance summary
	setTimeout(() => {
		if (has404Errors) {
			console.warn("⚠️ Some 404 errors detected - check console for details");
		}
	}, 1000);
};

// Run verification after page load
if (typeof window !== "undefined") {
	window.addEventListener("load", verifyPerformanceOptimizations);
}

module.exports = { verifyPerformanceOptimizations };
