// Analytics Test Script for Browser Console
// Copy and paste this into your browser's developer console

console.log("🔍 Starting Analytics Test...");

// Test 1: Check if analytics objects exist
console.log("📊 Checking analytics objects...");
console.log(
	"Google Analytics (gtag):",
	typeof window.gtag !== "undefined" ? "✅ Loaded" : "❌ Not Loaded"
);
console.log(
	"Matomo (_mtm):",
	typeof window._mtm !== "undefined" ? "✅ Loaded" : "❌ Not Loaded"
);

// Test 2: Test Google Analytics
if (typeof window.gtag !== "undefined") {
	console.log("🔵 Testing Google Analytics...");
	try {
		window.gtag("event", "console_test", {
			event_category: "Analytics Test",
			event_label: "Console Test Event",
			value: 1,
		});
		console.log("✅ Google Analytics event sent successfully");
	} catch (error) {
		console.error("❌ Google Analytics error:", error);
	}
} else {
	console.log("❌ Google Analytics not available");
}

// Test 3: Test Matomo
if (typeof window._mtm !== "undefined") {
	console.log("🟠 Testing Matomo...");
	try {
		window._mtm.push({
			event: "custom",
			category: "Analytics Test",
			action: "console_test",
			name: "Console Test Event",
			value: 1,
		});
		console.log("✅ Matomo event sent successfully");
	} catch (error) {
		console.error("❌ Matomo error:", error);
	}
} else {
	console.log("❌ Matomo not available");
}

// Test 4: Check network requests
console.log("🌐 Checking network requests...");
console.log("Look for requests to:");
console.log("- googletagmanager.com (Google Analytics)");
console.log("- matomo.cloud (Matomo)");

// Test 5: Test page view tracking
console.log("📄 Testing page view tracking...");
if (typeof window.gtag !== "undefined") {
	window.gtag("config", "G-JCS1KWM0GH", {
		page_title: "Analytics Test Page",
		page_location: window.location.href,
	});
	console.log("✅ Google Analytics page view sent");
}

if (typeof window._mtm !== "undefined") {
	window._mtm.push({
		event: "page_view",
		page_title: "Analytics Test Page",
		page_url: window.location.href,
	});
	console.log("✅ Matomo page view sent");
}

console.log("🎯 Analytics test complete!");
console.log("📊 Check your analytics dashboards for the test events.");
