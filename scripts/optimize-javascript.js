#!/usr/bin/env node

/**
 * JavaScript Bundle Optimizer
 * Optimizes JavaScript loading and reduces unused code
 */

const fs = require("fs");
const path = require("path");

const BUILD_DIR = path.join(__dirname, "../build");
const STATIC_JS_DIR = path.join(BUILD_DIR, "static/js");

// JavaScript optimization configuration
const JS_OPTIMIZATION_CONFIG = {
	// Chunks to preload with high priority
	preload: ["main", "vendors", "react"],

	// Chunks to load with low priority
	lowPriority: ["analytics", "utils"],

	// Chunks to defer loading
	defer: ["bootstrap", "common"],
};

function optimizeJavaScriptLoading() {
	try {
		console.log("🔧 Optimizing JavaScript loading...");

		// Read the current index.html
		const indexPath = path.join(BUILD_DIR, "index.html");
		let htmlContent = fs.readFileSync(indexPath, "utf8");

		// Get all JavaScript files
		const jsFiles = fs
			.readdirSync(STATIC_JS_DIR)
			.filter((file) => file.endsWith(".js"))
			.map((file) => {
				const name = file.replace(/\.js$/, "").replace(/\.[a-f0-9]+$/, "");
				return { name, file };
			});

		// Remove existing script tags
		htmlContent = htmlContent.replace(
			/<script[^>]*src="\/static\/js\/[^"]*\.js"[^>]*><\/script>/g,
			""
		);

		// Add optimized script loading
		let scriptTags = "";

		// Add preload for critical scripts
		jsFiles.forEach(({ name, file }) => {
			if (JS_OPTIMIZATION_CONFIG.preload.includes(name)) {
				scriptTags += `\n\t\t<link rel="preload" href="/static/js/${file}" as="script" fetchpriority="high">`;
			}
		});

		// Add main script with high priority
		const mainScript = jsFiles.find(({ name }) => name === "main");
		if (mainScript) {
			scriptTags += `\n\t\t<script src="/static/js/${mainScript.file}" defer></script>`;
		}

		// Add other scripts with appropriate loading strategies
		jsFiles.forEach(({ name, file }) => {
			if (name === "main") return; // Already added

			if (JS_OPTIMIZATION_CONFIG.lowPriority.includes(name)) {
				scriptTags += `\n\t\t<script src="/static/js/${file}" defer></script>`;
			} else if (JS_OPTIMIZATION_CONFIG.defer.includes(name)) {
				scriptTags += `\n\t\t<script src="/static/js/${file}" defer></script>`;
			} else {
				scriptTags += `\n\t\t<script src="/static/js/${file}" defer></script>`;
			}
		});

		// Insert script tags before closing body tag
		htmlContent = htmlContent.replace("</body>", `${scriptTags}\n\t</body>`);

		// Write the updated HTML
		fs.writeFileSync(indexPath, htmlContent);

		console.log("JavaScript loading optimized successfully");
		console.log(`📊 Total JavaScript files: ${jsFiles.length}`);

		// Calculate total JavaScript size
		let totalSize = 0;
		jsFiles.forEach(({ file }) => {
			const filePath = path.join(STATIC_JS_DIR, file);
			totalSize += fs.statSync(filePath).size;
		});

		console.log(
			`💾 Total JavaScript size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`
		);
	} catch (error) {
		console.error("Error optimizing JavaScript loading:", error.message);
		process.exit(1);
	}
}

// Run if called directly
if (require.main === module) {
	optimizeJavaScriptLoading();
}

module.exports = { optimizeJavaScriptLoading };
