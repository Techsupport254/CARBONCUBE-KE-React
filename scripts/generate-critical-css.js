#!/usr/bin/env node

/**
 * Critical CSS Generator
 * Extracts and inlines critical CSS to improve First Contentful Paint
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BUILD_DIR = path.join(__dirname, "../build");
const INDEX_HTML = path.join(BUILD_DIR, "index.html");

// Critical CSS content for above-the-fold content
const CRITICAL_CSS = `
/* Critical CSS for above-the-fold content */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #e0e0e0;
}

#root {
  min-height: 100vh;
}

/* Critical navbar styles */
.navbar {
  background-color: #000;
  padding: 0.5rem 0;
}

.navbar-brand {
  color: #ffc107 !important;
  font-weight: bold;
  font-size: 1.5rem;
}

/* Critical search form styles */
.search-form {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #ffc107;
  border-radius: 50px;
  font-size: 1rem;
}

.search-button {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 50px;
  background-color: #ffc107;
  border: none;
  border-radius: 0 50px 50px 0;
  color: #000;
}

/* Critical banner styles */
.carousel {
  margin-bottom: 2rem;
}

.carousel-item img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* Critical button styles */
.btn-primary {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #000;
}

.btn-primary:hover {
  background-color: #e0a800;
  border-color: #e0a800;
  color: #000;
}

/* Critical loading states */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

/* Critical responsive styles */
@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1.2rem;
  }
  
  .search-input {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}

/* Critical font loading optimization */
.fonts-loaded {
  font-display: swap;
}

/* Critical layout shift prevention */
img {
  max-width: 100%;
  height: auto;
}

/* Critical skeleton loading */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
`;

function findMainCSSFile() {
	try {
		const cssDir = path.join(BUILD_DIR, "static/css");
		const files = fs.readdirSync(cssDir);
		const mainCSSFile = files.find(
			(file) => file.startsWith("main.") && file.endsWith(".css")
		);

		if (!mainCSSFile) {
			throw new Error("Main CSS file not found");
		}

		return path.join(cssDir, mainCSSFile);
	} catch (error) {
		console.error("Error finding main CSS file:", error.message);
		return null;
	}
}

function generateCriticalCSS() {
	try {
		console.log("🔧 Generating critical CSS...");

		// Create critical CSS file
		const criticalCSSPath = path.join(BUILD_DIR, "critical.css");
		fs.writeFileSync(criticalCSSPath, CRITICAL_CSS);

		// Find the main CSS file dynamically
		const mainCSSPath = findMainCSSFile();
		if (!mainCSSPath) {
			console.log(
				"⚠️ Main CSS file not found, skipping size calculation and HTML modification"
			);
			console.log("📁 Critical CSS saved to: " + criticalCSSPath);
			return; // Exit early if no main CSS file found
		}

		// Read the current index.html
		let htmlContent = fs.readFileSync(INDEX_HTML, "utf8");

		// Add critical CSS inline in the head
		const criticalCSSInline = `<style id="critical-css">${CRITICAL_CSS}</style>`;

		// Insert critical CSS after the title tag
		htmlContent = htmlContent.replace(
			/<title>.*?<\/title>/,
			(match) => `${match}\n\t\t${criticalCSSInline}`
		);

		// Find the main CSS link in the HTML
		const cssLinkMatch = htmlContent.match(
			/<link rel="stylesheet" href="\/static\/css\/main\.[^"]+\.css">/
		);
		if (cssLinkMatch) {
			const cssLink = cssLinkMatch[0];
			const cssHref = cssLink.match(/href="([^"]+)"/)[1];

			// Add preload for main CSS with low priority
			const preloadCSS = `\n\t\t<link rel="preload" href="${cssHref}" as="style" onload="this.onload=null;this.rel='stylesheet'">`;
			htmlContent = htmlContent.replace(cssLink, preloadCSS);

			// Add noscript fallback for CSS
			const noscriptCSS = `\n\t\t<noscript><link rel="stylesheet" href="${cssHref}"></noscript>`;
			htmlContent = htmlContent.replace(
				/<link rel="preload" href="[^"]+" as="style" onload="this\.onload=null;this\.rel='stylesheet'">/,
				(match) => `${match}${noscriptCSS}`
			);
		}

		// Write the updated HTML
		fs.writeFileSync(INDEX_HTML, htmlContent);

		console.log("Critical CSS generated and inlined successfully");
		console.log("📁 Critical CSS saved to: " + criticalCSSPath);

		// Calculate size savings if main CSS file exists
		if (mainCSSPath) {
			try {
				const originalSize = fs.statSync(mainCSSPath).size;
				const criticalSize = Buffer.byteLength(CRITICAL_CSS, "utf8");
				const savings = ((originalSize - criticalSize) / 1024).toFixed(2);

				console.log("💾 Estimated CSS savings: " + savings + " KB");
			} catch (error) {
				console.log("⚠️ Could not calculate size savings");
			}
		}
	} catch (error) {
		console.error("Error generating critical CSS:", error.message);
		// Don't exit with error code 1, just log the error
		console.log("⚠️ Critical CSS generation failed, but build can continue");
	}
}

// Run if called directly
if (require.main === module) {
	generateCriticalCSS();
}

module.exports = { generateCriticalCSS };
