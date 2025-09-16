#!/usr/bin/env node

/**
 * Comprehensive SEO Generator for Carbon Cube Kenya
 *
 * This script generates:
 * - Dynamic sitemap.xml with current timestamps
 * - Dynamic robots.txt with current generation date
 * - Sitemap index file
 * - URL list for reference
 * - Static HTML files for each route with proper meta tags (for social media crawlers)
 *
 * Features:
 * - ✅ Dynamic dates (no hardcoded timestamps)
 * - ✅ Comprehensive URL coverage
 * - ✅ Real API data only (no fallback data)
 * - ✅ Static HTML generation for social media sharing
 * - ✅ Proper Open Graph and Twitter Card meta tags
 * - ✅ Structured data (JSON-LD) for search engines
 * - ✅ Detailed logging and error handling
 * - ✅ Easy to run and maintain
 *
 * Usage:
 *   node scripts/seo-generator.js
 *   npm run generate-seo
 *   npm run update-seo
 */

// Configuration
const API_BASE_URL =
	process.env.REACT_APP_BACKEND_URL ||
	process.env.API_URL ||
	"https://carboncube-ke.com";
const SITE_BASE_URL =
	process.env.REACT_APP_SITE_URL ||
	process.env.SITE_URL ||
	"https://carboncube-ke.com";

// Import required modules
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

console.log(`🔧 Using API URL: ${API_BASE_URL}`);
console.log(`🔧 Using Site URL: ${SITE_BASE_URL}`);

// Dynamic date generation - always use current date/time
const now = new Date();
const CURRENT_DATE = now.toISOString().split("T")[0];
const BUILD_TIMESTAMP = now.toISOString();
const GENERATION_DATE = now.toLocaleDateString("en-US", {
	year: "numeric",
	month: "long",
	day: "numeric",
});

console.log(`🚀 Starting dynamic sitemap generation...`);
console.log(`📅 Current Date: ${CURRENT_DATE}`);
console.log(`⏰ Build Timestamp: ${BUILD_TIMESTAMP}`);

// Static routes with metadata
const staticRoutes = [
	{
		path: "/",
		lastmod: CURRENT_DATE,
		changefreq: "daily",
		priority: "1.0",
		keywords:
			"Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce, AI-powered marketplace, digital procurement Kenya, seller verification, sustainable sourcing Kenya, online shopping Kenya",
	},
	// Removed /home route since we redirect /home to / to prevent duplicate content
	{
		path: "/seller/tiers",
		lastmod: CURRENT_DATE,
		changefreq: "weekly",
		priority: "0.7",
		keywords:
			"seller tiers Carbon Cube Kenya, seller subscription plans, tier pricing, seller upgrade options, Kenya marketplace seller tiers",
	},
	{
		path: "/categories",
		lastmod: CURRENT_DATE,
		changefreq: "weekly",
		priority: "0.9",
		keywords:
			"product categories, browse by category, Kenya marketplace categories, online shopping categories",
	},
	{
		path: "/ads",
		lastmod: CURRENT_DATE,
		changefreq: "hourly",
		priority: "0.8",
		keywords:
			"products, buy online Kenya, marketplace products, verified sellers, secure shopping, ecommerce Kenya",
	},
	{
		path: "/buyer/ads",
		lastmod: CURRENT_DATE,
		changefreq: "hourly",
		priority: "0.8",
		keywords:
			"buy products Kenya, online shopping Kenya, verified sellers, secure marketplace, Carbon Cube Kenya",
	},
	{
		path: "/buyer/categories",
		lastmod: CURRENT_DATE,
		changefreq: "weekly",
		priority: "0.8",
		keywords:
			"product categories Kenya, browse products, online shopping categories, marketplace categories",
	},
	{
		path: "/buyer/subcategories",
		lastmod: CURRENT_DATE,
		changefreq: "weekly",
		priority: "0.7",
		keywords:
			"product subcategories Kenya, detailed product browsing, online shopping subcategories",
	},
	{
		path: "/seller/categories",
		lastmod: CURRENT_DATE,
		changefreq: "weekly",
		priority: "0.7",
		keywords:
			"seller categories Kenya, become a seller, marketplace categories, online selling Kenya",
	},
	{
		path: "/seller/subcategories",
		lastmod: CURRENT_DATE,
		changefreq: "weekly",
		priority: "0.6",
		keywords:
			"seller subcategories Kenya, detailed selling categories, online marketplace subcategories",
	},
	{
		path: "/about-us",
		lastmod: CURRENT_DATE,
		changefreq: "monthly",
		priority: "0.7",
		keywords:
			"about Carbon Cube Kenya, Kenya marketplace, digital procurement, verified sellers, company information, Kenya ecommerce",
	},
	{
		path: "/contact-us",
		lastmod: CURRENT_DATE,
		changefreq: "monthly",
		priority: "0.7",
		keywords:
			"contact Carbon Cube Kenya, customer support, Kenya marketplace support, help desk, contact information, Kenya ecommerce support",
	},
	{
		path: "/buyer-signup",
		lastmod: CURRENT_DATE,
		changefreq: "monthly",
		priority: "0.6",
		keywords:
			"buyer signup, join Carbon Cube Kenya, create account, Kenya online shopping, marketplace registration, buyer registration",
	},
	{
		path: "/seller-signup",
		lastmod: CURRENT_DATE,
		changefreq: "monthly",
		priority: "0.6",
		keywords:
			"seller signup, become a seller, Carbon Cube Kenya seller registration, Kenya marketplace seller, online selling, seller registration",
	},
	{
		path: "/login",
		lastmod: CURRENT_DATE,
		changefreq: "monthly",
		priority: "0.6",
		keywords:
			"login Carbon Cube Kenya, sign in, marketplace login, Kenya online shopping, seller login, buyer login",
	},
	{
		path: "/forgot-password",
		lastmod: CURRENT_DATE,
		changefreq: "monthly",
		priority: "0.5",
		keywords:
			"forgot password Carbon Cube Kenya, password reset, account recovery, marketplace password help, Kenya online shopping password",
	},
	{
		path: "/terms-and-conditions",
		lastmod: CURRENT_DATE,
		changefreq: "monthly",
		priority: "0.5",
		keywords:
			"terms and conditions, Carbon Cube Kenya legal, Kenya marketplace terms, user agreement, platform terms",
	},
	{
		path: "/privacy-policy",
		lastmod: CURRENT_DATE,
		changefreq: "monthly",
		priority: "0.5",
		keywords:
			"privacy policy, Carbon Cube Kenya data protection, Kenya marketplace privacy, user data protection, GDPR compliance",
	},
	{
		path: "/privacy",
		lastmod: CURRENT_DATE,
		changefreq: "monthly",
		priority: "0.5",
		keywords:
			"privacy policy, Carbon Cube Kenya data protection, Kenya marketplace privacy, user data protection, GDPR compliance",
	},
	{
		path: "/faq",
		lastmod: CURRENT_DATE,
		changefreq: "monthly",
		priority: "0.6",
		keywords:
			"FAQ, frequently asked questions, Carbon Cube Kenya help, Kenya marketplace FAQ, customer support",
	},
	{
		path: "/how-it-works",
		lastmod: CURRENT_DATE,
		changefreq: "monthly",
		priority: "0.7",
		keywords:
			"how it works, Carbon Cube Kenya guide, Kenya marketplace tutorial, online shopping guide, buyer guide, seller guide",
	},
	{
		path: "/how-to-pay",
		lastmod: CURRENT_DATE,
		changefreq: "monthly",
		priority: "0.7",
		keywords:
			"how to pay Carbon Cube Kenya, M-Pesa payment guide, seller subscription, tier upgrade payment, Carbon Cube payment process, M-Pesa paybill 4160265, Kenya mobile payment",
	},
	{
		path: "/how-to-shop",
		lastmod: CURRENT_DATE,
		changefreq: "monthly",
		priority: "0.7",
		keywords:
			"how to shop Carbon Cube Kenya, online shopping guide, buyer tutorial, marketplace shopping guide, Kenya online shopping tips",
	},
	{
		path: "/become-a-seller",
		lastmod: CURRENT_DATE,
		changefreq: "monthly",
		priority: "0.7",
		keywords:
			"become a seller Carbon Cube Kenya, seller registration guide, how to become a seller, Kenya marketplace seller, online selling guide, seller signup process",
	},
	{
		path: "/vendor-help",
		lastmod: CURRENT_DATE,
		changefreq: "monthly",
		priority: "0.6",
		keywords:
			"vendor help Carbon Cube Kenya, seller support, marketplace help, seller assistance, vendor guide, seller help center",
	},
	{
		path: "/seller-help",
		lastmod: CURRENT_DATE,
		changefreq: "monthly",
		priority: "0.6",
		keywords:
			"seller help Carbon Cube Kenya, seller support, marketplace help, seller assistance, seller guide, seller help center",
	},
];

// HTML Template for static pages
const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />

		<!-- Favicon and App Icons -->
		<link rel="icon" type="image/x-icon" href="/favicon.ico" />
		<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
		<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
		<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />

		<!-- Apple Touch Icons -->
		<link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />
		<link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png" />
		<link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
		<link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
		<link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
		<link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
		<link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
		<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
		<link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon-167x167.png" />
		<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
		<link rel="apple-touch-icon" sizes="1024x1024" href="/apple-touch-icon-1024x1024.png" />
		<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
		<link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-precomposed.png" />

		<!-- Android Chrome Icons -->
		<link rel="icon" type="image/png" sizes="36x36" href="/android-chrome-36x36.png" />
		<link rel="icon" type="image/png" sizes="48x48" href="/android-chrome-48x48.png" />
		<link rel="icon" type="image/png" sizes="72x72" href="/android-chrome-72x72.png" />
		<link rel="icon" type="image/png" sizes="96x96" href="/android-chrome-96x96.png" />
		<link rel="icon" type="image/png" sizes="144x144" href="/android-chrome-144x144.png" />
		<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
		<link rel="icon" type="image/png" sizes="256x256" href="/android-chrome-256x256.png" />
		<link rel="icon" type="image/png" sizes="384x384" href="/android-chrome-384x384.png" />
		<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />

		<!-- PWA Icons -->
		<link rel="icon" type="image/png" sizes="192x192" href="/logo192.png" />
		<link rel="icon" type="image/png" sizes="512x512" href="/logo512.png" />
		<link rel="icon" type="image/png" sizes="192x192" href="/web-app-manifest-192x192.png" />
		<link rel="icon" type="image/png" sizes="512x512" href="/web-app-manifest-512x512.png" />

		<!-- Web App Manifest -->
		<link rel="manifest" href="/manifest.webmanifest" />
		<link rel="manifest" href="/manifest.json" />
		<link rel="manifest" href="/site.webmanifest" />

		<!-- Essential Meta Tags -->
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="theme-color" content="#ffc107" />
		<meta name="msapplication-TileColor" content="#ffc107" />
		<meta name="mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-status-bar-style" content="default" />
		<meta name="apple-mobile-web-app-title" content="Carbon Cube Kenya" />
		<meta name="application-name" content="Carbon Cube Kenya" />

		<!-- Dynamic Meta Tags for Social Media Crawlers -->
		<title>{{title}}</title>
		<meta name="description" content="{{description}}" />
		<meta name="keywords" content="{{keywords}}" />
		<meta name="author" content="Carbon Cube Kenya Team" />
		<meta name="robots" content="index, follow" />
		<meta name="language" content="English" />
		<meta name="geo.region" content="KE" />
		<meta name="geo.placename" content="Kenya" />
		<meta name="geo.position" content="-1.2921;36.8219" />
		<meta name="ICBM" content="-1.2921, 36.8219" />

		<!-- Open Graph Meta Tags (Facebook, LinkedIn, etc.) -->
		<meta property="og:type" content="{{ogType}}" />
		<meta property="og:url" content="{{ogUrl}}" />
		<meta property="og:title" content="{{ogTitle}}" />
		<meta property="og:description" content="{{ogDescription}}" />
		<meta property="og:image" content="{{ogImage}}" />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:image:alt" content="{{ogImageAlt}}" />
		<meta property="og:site_name" content="Carbon Cube Kenya" />
		<meta property="og:locale" content="en_US" />
		<meta property="og:updated_time" content="{{ogUpdatedTime}}" />

		<!-- Twitter Card Meta Tags -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:site" content="@carboncube_kenya" />
		<meta name="twitter:creator" content="@carboncube_kenya" />
		<meta name="twitter:title" content="{{twitterTitle}}" />
		<meta name="twitter:description" content="{{twitterDescription}}" />
		<meta name="twitter:image" content="{{twitterImage}}" />
		<meta name="twitter:image:alt" content="{{twitterImageAlt}}" />

		<!-- Additional SEO Meta Tags -->
		<meta name="format-detection" content="telephone=no" />
		<meta name="referrer" content="strict-origin-when-cross-origin" />
		<meta name="googlebot" content="index, follow" />
		<meta name="bingbot" content="index, follow" />

		<!-- Canonical URL -->
		<link rel="canonical" href="{{canonicalUrl}}" />

		<!-- Basic Structured Data (JSON-LD) for Search Engines -->
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "{{schemaType}}",
			"name": "{{schemaName}}",
			"description": "{{schemaDescription}}",
			"url": "{{schemaUrl}}",
			"image": "{{schemaImage}}",
			"sameAs": [
				"https://www.linkedin.com/company/carbon-cube-kenya/",
				"https://www.facebook.com/profile.php?id=61574066312678",
				"https://www.instagram.com/carboncube_kenya/"
			],
			"contactPoint": {
				"@type": "ContactPoint",
				"contactType": "customer service",
				"availableLanguage": "English",
				"areaServed": "KE",
				"telephone": "+254713270764",
				"email": "info@carboncube-ke.com"
			},
			"address": {
				"@type": "PostalAddress",
				"streetAddress": "9th Floor, CMS Africa, Kilimani",
				"addressLocality": "Nairobi",
				"addressRegion": "Nairobi",
				"addressCountry": "KE",
				"postalCode": "00100"
			},
			"foundingDate": "2023",
			"industry": "Internet Marketplace Platforms"
		}
		</script>

		<!-- Resource Hints for Performance -->
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link rel="preconnect" href="https://www.googletagmanager.com" />
		<link rel="preconnect" href="https://cdn.matomo.cloud" />
		<link rel="preconnect" href="https://res.cloudinary.com" />
		<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
		<link rel="dns-prefetch" href="https://cdn.matomo.cloud" />
		<link rel="dns-prefetch" href="https://res.cloudinary.com" />
		<link rel="dns-prefetch" href="https://api.cloudinary.com" />

		<!-- Font Loading -->
		<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" />
		<noscript>
			<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
		</noscript>

		<!-- Critical CSS for above-the-fold content -->
		<style>
			body {
				background-color: #f9fafb;
				margin: 0;
				padding: 0;
				font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
				line-height: 1.5;
			}
			#root {
				min-height: 100vh;
			}
			.loading-spinner {
				display: flex;
				justify-content: center;
				align-items: center;
				min-height: 200px;
			}
		</style>
	</head>

	<body style="background-color: #e0e0e0">
		<noscript>You need to enable JavaScript to run this app.</noscript>
		<div id="root"></div>
		
		<!-- React App Scripts -->
		<script>
			// Analytics loading deferred
			window.addEventListener("load", function () {
				setTimeout(function () {
					// Google Analytics
					(function (i, s, o, g, r, a, m) {
						i["GoogleAnalyticsObject"] = r;
						(i[r] = i[r] || function () {
							(i[r].q = i[r].q || []).push(arguments);
						}),
						(i[r].l = 1 * new Date());
						(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
						a.async = 1;
						a.src = g;
						m.parentNode.insertBefore(a, m);
					})(
						window,
						document,
						"script",
						"https://www.googletagmanager.com/gtag/js?id=G-JCS1KWM0GH",
						"ga"
					);
					ga("create", "G-JCS1KWM0GH", "auto");
					ga("send", "pageview");
				}, 1000);
			});
		</script>
	</body>
</html>`;

// No fallback data - only use real API data

// Fetch categories and subcategories from API
async function fetchCategoriesAndSubcategories() {
	try {
		console.log("📡 Fetching categories and subcategories...");
		console.log(`📡 Categories API: ${API_BASE_URL}/sitemap/categories`);
		console.log(`📡 Subcategories API: ${API_BASE_URL}/sitemap/subcategories`);

		// Try API endpoints with /api/ prefix first
		let categoriesResponse, subcategoriesResponse;

		[categoriesResponse, subcategoriesResponse] = await Promise.all([
			axios
				.get(`${API_BASE_URL}/api/sitemap/categories`, {
					timeout: 15000,
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"User-Agent": "CarbonCube-SitemapGenerator/1.0",
					},
					validateStatus: function (status) {
						return status < 500; // Resolve only if the status code is less than 500
					},
				})
				.catch((error) => {
					console.error(`Categories API Error: ${error.message}`);
					console.error(`Status: ${error.response?.status}`);
					console.error(
						`Data: ${JSON.stringify(error.response?.data)?.substring(
							0,
							200
						)}...`
					);
					return { data: [], status: error.response?.status };
				}),
			axios
				.get(`${API_BASE_URL}/api/sitemap/subcategories`, {
					timeout: 15000,
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"User-Agent": "CarbonCube-SitemapGenerator/1.0",
					},
					validateStatus: function (status) {
						return status < 500; // Resolve only if the status code is less than 500
					},
				})
				.catch((error) => {
					console.error(`Subcategories API Error: ${error.message}`);
					console.error(`Status: ${error.response?.status}`);
					console.error(
						`Data: ${JSON.stringify(error.response?.data)?.substring(
							0,
							200
						)}...`
					);
					return { data: [], status: error.response?.status };
				}),
		]);

		console.log(
			`📡 Categories Response Status: ${categoriesResponse.status || "N/A"}`
		);
		console.log(
			`📡 Subcategories Response Status: ${
				subcategoriesResponse.status || "N/A"
			}`
		);

		let categoriesRaw = categoriesResponse.data;
		let subcategoriesRaw = subcategoriesResponse.data;

		// Check if we got HTML responses or 404 errors (endpoints not available yet)
		const isHtmlResponse = (data) => {
			return typeof data === "string" && data.includes("<!doctype html>");
		};

		const is404Error = (data, status) => {
			return (
				status === 404 || (typeof data === "object" && data.status === 404)
			);
		};

		if (
			isHtmlResponse(categoriesRaw) ||
			isHtmlResponse(subcategoriesRaw) ||
			is404Error(categoriesRaw, categoriesResponse.status) ||
			is404Error(subcategoriesRaw, subcategoriesResponse.status)
		) {
			console.log(
				"⚠️ Sitemap endpoints not available, falling back to regular API endpoints"
			);

			[categoriesResponse, subcategoriesResponse] = await Promise.all([
				axios
					.get(`${API_BASE_URL}/buyer/categories`, {
						timeout: 15000,
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
							"User-Agent": "CarbonCube-SitemapGenerator/1.0",
						},
						validateStatus: function (status) {
							return status < 500;
						},
					})
					.catch((error) => {
						console.error(`Fallback Categories API Error: ${error.message}`);
						return { data: [], status: error.response?.status };
					}),
				axios
					.get(`${API_BASE_URL}/buyer/subcategories`, {
						timeout: 15000,
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
							"User-Agent": "CarbonCube-SitemapGenerator/1.0",
						},
						validateStatus: function (status) {
							return status < 500;
						},
					})
					.catch((error) => {
						console.error(`Fallback Subcategories API Error: ${error.message}`);
						return { data: [], status: error.response?.status };
					}),
			]);

			// Update data after fallback
			categoriesRaw = categoriesResponse.data;
			subcategoriesRaw = subcategoriesResponse.data;
		}

		console.log(
			`📡 Categories Raw Data: ${JSON.stringify(categoriesRaw).substring(
				0,
				200
			)}...`
		);
		console.log(
			`📡 Subcategories Raw Data: ${JSON.stringify(subcategoriesRaw).substring(
				0,
				200
			)}...`
		);

		let categories = [];
		let subcategories = [];

		if (isHtmlResponse(categoriesRaw)) {
			console.log(
				"❌ Categories API returned HTML (likely authentication issue), skipping categories"
			);
			categories = [];
		} else {
			categories = Array.isArray(categoriesRaw)
				? categoriesRaw
				: Array.isArray(categoriesRaw?.categories)
				? categoriesRaw.categories
				: [];
		}

		if (isHtmlResponse(subcategoriesRaw)) {
			console.log(
				"❌ Subcategories API returned HTML (likely authentication issue), skipping subcategories"
			);
			subcategories = [];
		} else {
			subcategories = Array.isArray(subcategoriesRaw)
				? subcategoriesRaw
				: Array.isArray(subcategoriesRaw?.subcategories)
				? subcategoriesRaw.subcategories
				: [];
		}

		console.log(
			`Found ${categories.length} categories and ${subcategories.length} subcategories`
		);

		// If no categories found, return empty arrays (no fallback data)
		if (categories.length === 0) {
			console.log(
				"⚠️ No categories found from API, proceeding with empty data"
			);
		}

		return { categories, subcategories };
	} catch (error) {
		console.error("Error fetching categories/subcategories:", error.message);
		console.error("Full error:", error);
		return { categories: [], subcategories: [] };
	}
}

// Generate category URLs
function generateCategoryUrls(categories) {
	const categoryUrls = [];

	(Array.isArray(categories) ? categories : []).forEach((category) => {
		categoryUrls.push({
			path: `/categories/${category.id}`,
			lastmod: CURRENT_DATE,
			changefreq: "daily",
			priority: "0.8",
			keywords: `${category.name}, ${
				category.name
			} Kenya, online ${category.name.toLowerCase()}, Carbon Cube Kenya, verified sellers`,
		});
	});

	return categoryUrls;
}

// Generate subcategory URLs
function generateSubcategoryUrls(subcategories, categories) {
	const subcategoryUrls = [];

	(Array.isArray(subcategories) ? subcategories : []).forEach((subcategory) => {
		const category = categories.find(
			(cat) => cat.id === subcategory.category_id
		);
		if (category) {
			subcategoryUrls.push({
				path: `/subcategories/${subcategory.id}`,
				lastmod: CURRENT_DATE,
				changefreq: "daily",
				priority: "0.7",
				keywords: `${subcategory.name}, ${subcategory.name} Kenya, ${category.name}, ${subcategory.name} ${category.name}, online shopping Kenya, Carbon Cube Kenya, verified sellers`,
			});
		}
	});

	return subcategoryUrls;
}

// Fetch individual ads for sitemap - dedicated endpoint returns all ads
async function fetchAds() {
	try {
		console.log("📡 Fetching individual ads...");
		console.log(`📡 Ads API: ${API_BASE_URL}/api/sitemap/ads`);

		const adsResponse = await axios
			.get(`${API_BASE_URL}/api/sitemap/ads`, {
				timeout: 30000, // Longer timeout for large dataset
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"User-Agent": "CarbonCube-SitemapGenerator/1.0",
				},
				validateStatus: function (status) {
					return status < 500; // Resolve only if the status code is less than 500
				},
			})
			.catch((error) => {
				console.error(`Ads API Error: ${error.message}`);
				console.error(`Status: ${error.response?.status}`);
				console.error(
					`Data: ${JSON.stringify(error.response?.data)?.substring(0, 200)}...`
				);
				return { data: [], status: error.response?.status };
			});

		console.log(`📡 Ads Response Status: ${adsResponse.status || "N/A"}`);

		const adsData = adsResponse.data;

		// Check if response is HTML (indicates authentication issue) or 404 (endpoint not available)
		const isHtmlResponse = (data) => {
			return typeof data === "string" && data.includes("<!doctype html>");
		};

		const is404Error = (data, status) => {
			return (
				status === 404 || (typeof data === "object" && data.status === 404)
			);
		};

		let ads = [];
		if (isHtmlResponse(adsData) || is404Error(adsData, adsResponse.status)) {
			console.log(
				"❌ Ads API returned HTML or 404 (likely authentication issue or endpoint not available), skipping ads"
			);
			ads = [];
		} else {
			ads = Array.isArray(adsData) ? adsData : [];
		}

		console.log(`Found ${ads.length} total individual ads`);
		return ads;
	} catch (error) {
		console.error("Error fetching ads:", error.message);
		return [];
	}
}

// Generate individual ad URLs
function generateAdUrls(ads) {
	const adUrls = [];

	(Array.isArray(ads) ? ads : []).forEach((ad) => {
		if (ad.id && ad.title) {
			adUrls.push({
				path: `/ads/${ad.id}`,
				lastmod: CURRENT_DATE,
				changefreq: "weekly",
				priority: "0.6",
				keywords: `${ad.title}, ${ad.title} Kenya, Carbon Cube Kenya, online shopping, verified seller, marketplace`,
			});
		}
	});

	return adUrls;
}

// Fetch sellers for shop pages
async function fetchSellers() {
	try {
		console.log("📡 Fetching sellers for shop pages...");
		console.log(`📡 Sellers API: ${API_BASE_URL}/api/sitemap/sellers`);

		const sellersResponse = await axios
			.get(`${API_BASE_URL}/api/sitemap/sellers`, {
				timeout: 15000,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"User-Agent": "CarbonCube-SitemapGenerator/1.0",
				},
				validateStatus: function (status) {
					return status < 500; // Resolve only if the status code is less than 500
				},
			})
			.catch((error) => {
				console.error(`Sellers API Error: ${error.message}`);
				console.error(`Status: ${error.response?.status}`);
				console.error(
					`Data: ${JSON.stringify(error.response?.data)?.substring(0, 200)}...`
				);
				return { data: [], status: error.response?.status };
			});

		console.log(
			`📡 Sellers Response Status: ${sellersResponse.status || "N/A"}`
		);

		const sellersData = sellersResponse.data;

		// Check if response is HTML (indicates authentication issue) or 404 (endpoint not available)
		const isHtmlResponse = (data) => {
			return typeof data === "string" && data.includes("<!doctype html>");
		};

		const is404Error = (data, status) => {
			return (
				status === 404 || (typeof data === "object" && data.status === 404)
			);
		};

		let sellers = [];
		if (
			isHtmlResponse(sellersData) ||
			is404Error(sellersData, sellersResponse.status)
		) {
			console.log(
				"❌ Sellers API returned HTML or 404 (likely authentication issue or endpoint not available), skipping sellers"
			);
			sellers = [];
		} else {
			sellers = Array.isArray(sellersData)
				? sellersData
				: Array.isArray(sellersData?.sellers)
				? sellersData.sellers
				: [];
		}

		console.log(`Found ${sellers.length} sellers`);
		return sellers;
	} catch (error) {
		console.error("Error fetching sellers:", error.message);
		return [];
	}
}

// Generate seller shop URLs
function generateSellerShopUrls(sellers) {
	const shopUrls = [];

	(Array.isArray(sellers) ? sellers : []).forEach((seller) => {
		if (seller.id && (seller.slug || seller.enterprise_name)) {
			const slug =
				seller.slug ||
				seller.enterprise_name
					?.toLowerCase()
					.replace(/\s+/g, "-")
					.replace(/[&<>"'`]/g, "") // Remove XML special characters
					.replace(/[^\w\-]/g, ""); // Remove any remaining non-word characters except hyphens
			const name = seller.enterprise_name || seller.name || slug;

			shopUrls.push({
				path: `/shop/${slug}`,
				lastmod: CURRENT_DATE,
				changefreq: "weekly",
				priority: "0.7",
				keywords: `${name}, ${name} Kenya, Carbon Cube Kenya seller, online shop Kenya, verified seller, marketplace shop`,
			});
		}
	});

	return shopUrls;
}

// Escape XML special characters
function escapeXml(str) {
	if (typeof str !== "string") return str;
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

// Generate HTML meta data for a route
function generateRouteMetaData(route, additionalData = {}) {
	const siteName = "Carbon Cube Kenya";
	const fullTitle = route.title ? `${route.title} | ${siteName}` : siteName;
	const description =
		route.description ||
		"Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.";
	const keywords =
		route.keywords ||
		"Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce";
	const image = "https://carboncube-ke.com/logo.png";
	const url = `${SITE_BASE_URL}${route.path}`;
	const currentTime = new Date().toISOString();

	return {
		title: fullTitle,
		description: description,
		keywords: keywords,
		ogType: route.ogType || "website",
		ogUrl: url,
		ogTitle: fullTitle,
		ogDescription: description,
		ogImage: image,
		ogImageAlt: fullTitle,
		ogUpdatedTime: currentTime,
		twitterTitle: fullTitle,
		twitterDescription: description,
		twitterImage: image,
		twitterImageAlt: fullTitle,
		canonicalUrl: url,
		schemaType: route.schemaType || "WebPage",
		schemaName: route.schemaName || fullTitle,
		schemaDescription: description,
		schemaUrl: url,
		schemaImage: image,
		...additionalData,
	};
}

// Generate static HTML files for all routes
function generateAllStaticHTML(allUrls, buildDir) {
	console.log("📄 Generating static HTML files for social media crawlers...");

	const compiledTemplate = Handlebars.compile(HTML_TEMPLATE);
	let generatedCount = 0;

	allUrls.forEach((route) => {
		try {
			const metaData = generateRouteMetaData(route);
			const html = compiledTemplate(metaData);

			// Determine file path
			let filePath;
			if (route.path === "/") {
				filePath = path.join(buildDir, "index.html");
			} else {
				// Create directory structure for nested routes
				const routePath = route.path.replace(/^\//, ""); // Remove leading slash
				const routeDir = path.join(buildDir, routePath);
				filePath = path.join(routeDir, "index.html");

				// Create directory if it doesn't exist
				if (!fs.existsSync(routeDir)) {
					fs.mkdirSync(routeDir, { recursive: true });
				}
			}

			fs.writeFileSync(filePath, html);
			generatedCount++;

			if (generatedCount % 10 === 0) {
				console.log(`📄 Generated ${generatedCount} HTML files...`);
			}
		} catch (error) {
			console.error(`Error generating HTML for ${route.path}:`, error.message);
		}
	});

	console.log(`📄 Generated ${generatedCount} static HTML files total`);
	return generatedCount;
}

// Generate XML sitemap
function generateSitemapXML(urls) {
	const currentDate = new Date().toISOString().split("T")[0];
	const currentTimestamp = new Date().toISOString();

	const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  Carbon Cube Kenya Sitemap
  Generated on: ${currentDate}
  Build Timestamp: ${currentTimestamp}
  Last Modified: ${currentDate}
-->`;
	const urlsetOpen =
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
	const urlsetClose = "</urlset>";

	const urlEntries = urls
		.map((url) => {
			const escapedPath = escapeXml(url.path);
			const escapedUrl = `${SITE_BASE_URL}${escapedPath}`;
			return `  <url>
    <loc>${escapedUrl}</loc>
    <lastmod>${escapeXml(url.lastmod)}</lastmod>
    <changefreq>${escapeXml(url.changefreq)}</changefreq>
    <priority>${escapeXml(url.priority)}</priority>
  </url>`;
		})
		.join("\n");

	return `${xmlHeader}
${urlsetOpen}
${urlEntries}
${urlsetClose}`;
}

// Generate robots.txt
function generateRobotsTxt() {
	return `# *
User-agent: *
Allow: /

# Googlebot
User-agent: Googlebot
Allow: /*.xml$
Allow: /*.txt$

# Bingbot
User-agent: Bingbot
Allow: /*.xml$
Allow: /*.txt$
Crawl-delay: 1

# Slurp
User-agent: Slurp
Allow: /*.xml$
Allow: /*.txt$
Crawl-delay: 1

# Host
Host: ${SITE_BASE_URL}

# Sitemaps
Sitemap: ${SITE_BASE_URL}/sitemap.xml
`;
}

// Main function to generate all files
async function generateDynamicSitemap() {
	try {
		console.log("🚀 Starting dynamic sitemap generation...");

		// Create public directory if it doesn't exist
		const publicDir = path.join(__dirname, "../public");
		if (!fs.existsSync(publicDir)) {
			fs.mkdirSync(publicDir, { recursive: true });
		}

		// Fetch dynamic data
		const { categories, subcategories } =
			await fetchCategoriesAndSubcategories();
		const ads = await fetchAds();
		const sellers = await fetchSellers();

		// Generate URLs
		const categoryUrls = generateCategoryUrls(categories);
		const subcategoryUrls = generateSubcategoryUrls(subcategories, categories);
		const adUrls = generateAdUrls(ads);
		const shopUrls = generateSellerShopUrls(sellers);

		// Combine all URLs
		const allUrls = [
			...staticRoutes,
			...categoryUrls,
			...subcategoryUrls,
			...adUrls,
			...shopUrls,
		];

		console.log(`📊 Generated ${allUrls.length} URLs total:`);
		console.log(`   - ${staticRoutes.length} static routes`);
		console.log(`   - ${categoryUrls.length} category pages`);
		console.log(`   - ${subcategoryUrls.length} subcategory pages`);
		console.log(`   - ${adUrls.length} individual ad pages`);
		console.log(`   - ${shopUrls.length} seller shop pages`);

		// Generate sitemap XML
		const sitemapXML = generateSitemapXML(allUrls);
		const sitemapPath = path.join(publicDir, "sitemap.xml");
		fs.writeFileSync(sitemapPath, sitemapXML);
		console.log(`Sitemap generated: ${sitemapPath}`);

		// Generate robots.txt
		const robotsTxt = generateRobotsTxt();
		const robotsPath = path.join(publicDir, "robots.txt");
		fs.writeFileSync(robotsPath, robotsTxt);
		console.log(`Robots.txt generated: ${robotsPath}`);

		// Generate sitemap index (if needed for multiple sitemaps)
		const currentDate = new Date().toISOString().split("T")[0];
		const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_BASE_URL}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

		const sitemapIndexPath = path.join(publicDir, "sitemap-index.xml");
		fs.writeFileSync(sitemapIndexPath, sitemapIndexXML);
		console.log(`Sitemap index generated: ${sitemapIndexPath}`);

		// Generate URL list for reference
		const urlList = allUrls
			.map((url) => `${SITE_BASE_URL}${url.path}`)
			.join("\n");
		const urlListPath = path.join(publicDir, "urls.txt");
		fs.writeFileSync(urlListPath, urlList);
		console.log(`URL list generated: ${urlListPath}`);

		// Generate static HTML files for social media crawlers
		const buildDir = path.join(__dirname, "../build");
		if (!fs.existsSync(buildDir)) {
			fs.mkdirSync(buildDir, { recursive: true });
		}

		const htmlCount = generateAllStaticHTML(allUrls, buildDir);

		// Generate sitemap stats JSON
		const sitemapStats = {
			totalUrls: allUrls.length,
			staticPages: staticRoutes.length,
			publicCategories: categoryUrls.length,
			publicAds: adUrls.length,
			publicBanners: 0, // Not implemented yet
			staticHtmlFiles: htmlCount,
			generatedAt: BUILD_TIMESTAMP,
			baseUrl: SITE_BASE_URL,
			apiUrl: API_BASE_URL,
			note: "This sitemap is generated from public API endpoints (no authentication required). No fallback data used - only real API data. Static HTML files generated for social media crawlers.",
		};
		const sitemapStatsPath = path.join(publicDir, "sitemap-stats.json");
		fs.writeFileSync(sitemapStatsPath, JSON.stringify(sitemapStats, null, 2));
		console.log(`Sitemap stats generated: ${sitemapStatsPath}`);

		console.log(
			"\n🎉 Dynamic sitemap and static HTML generation completed successfully!"
		);
		console.log(`📁 Files generated in: ${publicDir}`);
		console.log(`📄 Static HTML files generated in: ${buildDir}`);
		console.log(`🌐 Site URL: ${SITE_BASE_URL}`);
		console.log(`🔗 Sitemap URL: ${SITE_BASE_URL}/sitemap.xml`);
		console.log(`🤖 Robots URL: ${SITE_BASE_URL}/robots.txt`);
		console.log(`📊 Total URLs: ${allUrls.length}`);
		console.log(`📄 Total HTML files: ${htmlCount}`);
	} catch (error) {
		console.error("Error generating sitemap:", error);
		process.exit(1);
	}
}

// Run the generator
if (require.main === module) {
	generateDynamicSitemap();
}

module.exports = { generateDynamicSitemap };
