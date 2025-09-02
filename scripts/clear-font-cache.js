// Clear any cached font references and restart development server
const clearFontCache = () => {
	console.log("Clearing font cache...");

	// Remove any existing font preload links that reference non-existent fonts
	const existingFontLinks = document.querySelectorAll('link[href*="fonts"]');
	existingFontLinks.forEach((link) => {
		// Remove references to non-existent font files
		if (
			link.href.includes("inter-var.woff2") ||
			link.href.includes("poppins-var.woff2")
		) {
			link.remove();
			console.log("Removed non-existent font link:", link.href);
		}
	});

	// Clear any font cache
	if ("caches" in window) {
		caches.keys().then((cacheNames) => {
			cacheNames.forEach((cacheName) => {
				if (cacheName.includes("font") || cacheName.includes("static")) {
					caches.delete(cacheName);
					console.log("Cleared cache:", cacheName);
				}
			});
		});
	}
};

// Run cache clearing
if (typeof window !== "undefined") {
	clearFontCache();
}

module.exports = { clearFontCache };
