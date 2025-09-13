#!/usr/bin/env node

/**
 * Dynamic Routes Generator for React-Snap
 *
 * This script fetches popular ads and shops from your API
 * and generates a routes list for react-snap to pre-render.
 *
 * Usage: node scripts/generate-routes.js
 */

const fs = require("fs");
const path = require("path");

// Configuration
const API_BASE_URL =
	process.env.REACT_APP_BACKEND_URL || "https://carboncube-ke.com";
const OUTPUT_FILE = path.join(__dirname, "../react-snap-routes.json");
const MAX_ADS = 50; // Maximum number of ads to pre-render
const MAX_SHOPS = 30; // Maximum number of shops to pre-render

// Static routes that should always be pre-rendered
const STATIC_ROUTES = [
	"/",
	"/about-us",
	"/contact-us",
	"/vendor-help",
	"/faqs",
	"/terms-and-conditions",
	"/privacy",
	"/how-to-pay",
	"/how-to-shop",
	"/become-a-seller",
	"/categories",
	"/login",
	"/buyer-signup",
	"/seller-signup",
];

/**
 * Fetch popular ads from the API
 */
async function fetchPopularAds() {
	try {
		console.log("Fetching popular ads...");

		// Try to fetch from your API endpoint
		const response = await fetch(`${API_BASE_URL}/api/ads?limit=${MAX_ADS}`);

		if (!response.ok) {
			console.warn(`Failed to fetch ads: ${response.status}`);
			return [];
		}

		const data = await response.json();
		const ads = Array.isArray(data) ? data : data.ads || [];

		return ads.map((ad) => `/ads/${ad.id}`).slice(0, MAX_ADS);
	} catch (error) {
		console.warn("Error fetching popular ads:", error.message);
		return [];
	}
}

/**
 * Fetch popular shops from the API
 */
async function fetchPopularShops() {
	try {
		console.log("Fetching popular shops...");

		// Try to fetch from your API endpoint
		const response = await fetch(
			`${API_BASE_URL}/api/sellers?limit=${MAX_SHOPS}`
		);

		if (!response.ok) {
			console.warn(`Failed to fetch shops: ${response.status}`);
			return [];
		}

		const data = await response.json();
		const shops = Array.isArray(data) ? data : data.sellers || [];

		return shops
			.map(
				(shop) =>
					`/shop/${encodeURIComponent(
						shop.slug ||
							shop.enterprise_name?.toLowerCase().replace(/\s+/g, "-")
					)}`
			)
			.slice(0, MAX_SHOPS);
	} catch (error) {
		console.warn("Error fetching popular shops:", error.message);
		return [];
	}
}

/**
 * Generate sample routes for testing (fallback)
 */
function generateSampleRoutes() {
	console.log("Generating sample routes for testing...");

	const sampleAds = [];
	const sampleShops = [];

	// Generate sample ad routes
	for (let i = 1; i <= 10; i++) {
		sampleAds.push(`/ads/sample-ad-${i}`);
	}

	// Generate sample shop routes
	for (let i = 1; i <= 5; i++) {
		sampleShops.push(`/shop/sample-shop-${i}`);
	}

	return [...sampleAds, ...sampleShops];
}

/**
 * Main function to generate routes
 */
async function generateRoutes() {
	console.log("🚀 Generating dynamic routes for react-snap...");

	try {
		// Fetch dynamic routes from API
		const [adsRoutes, shopsRoutes] = await Promise.all([
			fetchPopularAds(),
			fetchPopularShops(),
		]);

		// Combine all routes
		const allRoutes = [...STATIC_ROUTES, ...adsRoutes, ...shopsRoutes];

		// If no dynamic routes were fetched, use sample routes
		if (adsRoutes.length === 0 && shopsRoutes.length === 0) {
			console.log("No dynamic routes fetched, using sample routes");
			const sampleRoutes = generateSampleRoutes();
			allRoutes.push(...sampleRoutes);
		}

		// Remove duplicates
		const uniqueRoutes = [...new Set(allRoutes)];

		// Create the routes configuration
		const routesConfig = {
			include: uniqueRoutes,
			exclude: [
				"/admin/*",
				"/seller/*",
				"/buyer/*",
				"/sales/*",
				"/analytics-test",
				"/fingerprint",
			],
			skipThirdPartyRequests: true,
			cacheAjaxRequests: false,
			preloadImages: false,
			fixWebpackChunksIssue: false,
			asyncScriptTags: true,
			minifyHtml: {
				collapseWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true,
			},
		};

		// Write to file
		fs.writeFileSync(OUTPUT_FILE, JSON.stringify(routesConfig, null, 2));

		console.log(`✅ Generated ${uniqueRoutes.length} routes:`);
		console.log(`   - Static routes: ${STATIC_ROUTES.length}`);
		console.log(`   - Ad routes: ${adsRoutes.length}`);
		console.log(`   - Shop routes: ${shopsRoutes.length}`);
		console.log(`   - Total unique routes: ${uniqueRoutes.length}`);
		console.log(`📁 Routes saved to: ${OUTPUT_FILE}`);

		// Also update package.json reactSnap config
		updatePackageJson(uniqueRoutes);
	} catch (error) {
		console.error("❌ Error generating routes:", error);
		process.exit(1);
	}
}

/**
 * Update package.json with the generated routes
 */
function updatePackageJson(routes) {
	try {
		const packageJsonPath = path.join(__dirname, "../package.json");
		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

		if (!packageJson.reactSnap) {
			packageJson.reactSnap = {};
		}

		packageJson.reactSnap.include = routes;

		fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
		console.log("📦 Updated package.json with generated routes");
	} catch (error) {
		console.warn("⚠️  Could not update package.json:", error.message);
	}
}

// Run the script
if (require.main === module) {
	generateRoutes();
}

module.exports = { generateRoutes, fetchPopularAds, fetchPopularShops };
