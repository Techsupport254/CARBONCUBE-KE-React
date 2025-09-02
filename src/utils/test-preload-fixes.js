// Test script to verify preload link fixes
const testPreloadLinkFixes = () => {
	// Check if preload links exist
	const preloadLinks = document.querySelectorAll('link[rel="preload"]');

	// Check which ones don't have 'as' attribute
	const linksWithoutAs = document.querySelectorAll(
		'link[rel="preload"]:not([as])'
	);

	// Log details of problematic links
	linksWithoutAs.forEach((link, index) => {
		// Link details available for debugging
	});

	// Check if our fix function is working
	if (typeof window.fixPreloadLinks === "function") {
		window.fixPreloadLinks();

		// Check again after fixing
		setTimeout(() => {
			const remainingLinksWithoutAs = document.querySelectorAll(
				'link[rel="preload"]:not([as])'
			);
			// Remaining links without 'as' attribute
		}, 1000);
	}
};

// Run the test when the page loads
window.addEventListener("load", () => {
	setTimeout(testPreloadLinkFixes, 2000);
});

// Make the test function available globally for manual testing
window.testPreloadLinkFixes = testPreloadLinkFixes;

module.exports = { testPreloadLinkFixes };
