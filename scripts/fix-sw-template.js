#!/usr/bin/env node

/**
 * Fix Service Worker Template Variables
 * Replaces template variables with actual values
 */

const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "../public");
const SW_PATH = path.join(PUBLIC_DIR, "sw.js");

console.log("🔧 Fixing service worker template variables...");

function fixServiceWorkerTemplate() {
	try {
		const timestamp = Date.now();
		
		// Read the current service worker
		let swContent = fs.readFileSync(SW_PATH, "utf8");
		
		// Replace template variables with actual values
		swContent = swContent.replace(/\$\{Date\.now\(\)\}/g, timestamp);
		
		// Write the fixed service worker
		fs.writeFileSync(SW_PATH, swContent);
		
		console.log("✅ Service worker template variables fixed with timestamp:", timestamp);
	} catch (error) {
		console.error("❌ Error fixing service worker:", error.message);
		process.exit(1);
	}
}

// Run if called directly
if (require.main === module) {
	fixServiceWorkerTemplate();
}

module.exports = { fixServiceWorkerTemplate };
