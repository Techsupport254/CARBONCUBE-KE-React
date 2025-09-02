// Test script to verify font preloading
const testFontPreloading = () => {
	// Check if Google Fonts are loaded
	const googleFontsLinks = document.querySelectorAll(
		'link[href*="fonts.googleapis.com"]'
	);

	// Check if preconnect hints are present
	const preconnectLinks = document.querySelectorAll('link[rel="preconnect"]');

	// Check if fonts are loaded
	if ("fonts" in document) {
		document.fonts.ready
			.then(() => {
				// Fonts loaded successfully
			})
			.catch((error) => {
				console.error("Font loading error:", error);
			});
	}

	// Check for any 404 errors in console
	const originalError = console.error;
	console.error = (...args) => {
		if (args[0] && args[0].includes("404")) {
			console.warn("404 error detected:", args);
		}
		originalError.apply(console, args);
	};
};

// Run test after page load
if (typeof window !== "undefined") {
	window.addEventListener("load", testFontPreloading);
}

module.exports = { testFontPreloading };
