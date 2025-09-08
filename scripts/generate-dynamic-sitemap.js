const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Configuration
const API_BASE_URL =
	process.env.REACT_APP_BACKEND_URL ||
	process.env.API_URL ||
	"https://carboncube-ke.com";
const SITE_BASE_URL =
	process.env.REACT_APP_SITE_URL ||
	process.env.SITE_URL ||
	"https://carboncube-ke.com";

console.log(`🔧 Using API URL: ${API_BASE_URL}`);
console.log(`🔧 Using Site URL: ${SITE_BASE_URL}`);

// Force current date for sitemap generation - use UTC to ensure consistency
const now = new Date();
// Force to September 7th, 2025 for correct date
const CURRENT_DATE = "2025-09-07";
const BUILD_TIMESTAMP = now.toISOString();

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
];

// Fallback data for development/testing
function getFallbackCategories() {
	return [
		{
			id: 1,
			name: "Automotive Parts & Accessories",
			slug: "automotive-parts-accessories",
		},
		{
			id: 2,
			name: "Computer, Parts & Accessories",
			slug: "computer-parts-accessories",
		},
		{ id: 3, name: "Filtration", slug: "filtration" },
		{ id: 4, name: "Hardware Tools", slug: "hardware-tools" },
		{ id: 6, name: "Equipment Leasing", slug: "equipment-leasing" },
	];
}

function getFallbackSubcategories() {
	return [
		{ id: 1, name: "Batteries", slug: "batteries", category_id: 1 },
		{ id: 2, name: "Lubricants", slug: "lubricants", category_id: 1 },
		{ id: 3, name: "Accessories", slug: "accessories", category_id: 1 },
		{ id: 4, name: "Spare Parts", slug: "spare-parts", category_id: 1 },
		{ id: 5, name: "Tyres", slug: "tyres", category_id: 1 },
		{ id: 6, name: "Others", slug: "others", category_id: 1 },
		{
			id: 7,
			name: "Cooling & Maintenance",
			slug: "cooling-maintenance",
			category_id: 2,
		},
		{
			id: 8,
			name: "Internal Components",
			slug: "internal-components",
			category_id: 2,
		},
		{
			id: 9,
			name: "Networking Equipment",
			slug: "networking-equipment",
			category_id: 2,
		},
		{ id: 10, name: "Peripherals", slug: "peripherals", category_id: 2 },
		{ id: 11, name: "Storage", slug: "storage", category_id: 2 },
		{ id: 12, name: "Accessories", slug: "accessories", category_id: 2 },
		{ id: 13, name: "Others", slug: "others", category_id: 2 },
		{ id: 14, name: "Air Filters", slug: "air-filters", category_id: 3 },
		{ id: 15, name: "Fuel Filters", slug: "fuel-filters", category_id: 3 },
		{
			id: 16,
			name: "Industrial Filters",
			slug: "industrial-filters",
			category_id: 3,
		},
		{
			id: 17,
			name: "Oil & Hydraulic Filters",
			slug: "oil-hydraulic-filters",
			category_id: 3,
		},
		{ id: 18, name: "Others", slug: "others", category_id: 3 },
		{ id: 19, name: "Safety Wear", slug: "safety-wear", category_id: 4 },
		{
			id: 20,
			name: "Hand & Power Tools",
			slug: "hand-power-tools",
			category_id: 4,
		},
		{
			id: 21,
			name: "Power & Electrical Equipment",
			slug: "power-electrical-equipment",
			category_id: 4,
		},
		{
			id: 22,
			name: "Plumbing Supplies",
			slug: "plumbing-supplies",
			category_id: 4,
		},
		{ id: 23, name: "Others", slug: "others", category_id: 4 },
		{
			id: 32,
			name: "Earth Moving Equipment",
			slug: "earth-moving-equipment",
			category_id: 6,
		},
		{
			id: 33,
			name: "Lifting Equipment",
			slug: "lifting-equipment",
			category_id: 6,
		},
		{
			id: 34,
			name: "Concrete Equipment",
			slug: "concrete-equipment",
			category_id: 6,
		},
		{
			id: 35,
			name: "Drilling Equipment",
			slug: "drilling-equipment",
			category_id: 6,
		},
		{
			id: 36,
			name: "Compacting Equipment",
			slug: "compacting-equipment",
			category_id: 6,
		},
		{ id: 37, name: "Others", slug: "others", category_id: 6 },
	];
}

function getFallbackAds() {
	return [
		{ id: 1, title: "iPhone 14 Pro Max", slug: "iphone-14-pro-max" },
		{ id: 2, title: "Samsung Galaxy S23", slug: "samsung-galaxy-s23" },
		{ id: 3, title: "MacBook Pro M2", slug: "macbook-pro-m2" },
		{ id: 4, title: "Toyota Camry 2023", slug: "toyota-camry-2023" },
		{ id: 5, title: "Honda CBR 600RR", slug: "honda-cbr-600rr" },
		{ id: 6, title: "Sofa Set 3+2", slug: "sofa-set-3-2" },
		{ id: 7, title: "Power Drill Set", slug: "power-drill-set" },
		{ id: 8, title: "Nike Air Max", slug: "nike-air-max" },
		{ id: 9, title: "Adidas Running Shoes", slug: "adidas-running-shoes" },
		{ id: 10, title: "Treadmill Pro", slug: "treadmill-pro" },
	];
}

function getFallbackSellers() {
	return [
		{ id: 1, enterprise_name: "TechStore Kenya", slug: "techstore-kenya" },
		{ id: 2, enterprise_name: "AutoParts Nairobi", slug: "autoparts-nairobi" },
		{ id: 3, enterprise_name: "Fashion Hub", slug: "fashion-hub" },
		{ id: 4, enterprise_name: "Home Solutions", slug: "home-solutions" },
		{ id: 5, enterprise_name: "Sports World", slug: "sports-world" },
	];
}

// Fetch categories and subcategories from API
async function fetchCategoriesAndSubcategories() {
	try {
		console.log("📡 Fetching categories and subcategories...");
		console.log(`📡 Categories API: ${API_BASE_URL}/api/sitemap/categories`);
		console.log(
			`📡 Subcategories API: ${API_BASE_URL}/api/sitemap/subcategories`
		);

		// Try dedicated sitemap endpoints first (no pagination limits)
		// If they fail, fallback to regular API endpoints
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
					.get(`${API_BASE_URL}/api/buyer/categories`, {
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
					.get(`${API_BASE_URL}/api/buyer/subcategories`, {
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
				"⚠️ Categories API returned HTML (likely authentication issue), using fallback data"
			);
			categories = getFallbackCategories();
		} else {
			categories = Array.isArray(categoriesRaw)
				? categoriesRaw
				: Array.isArray(categoriesRaw?.categories)
				? categoriesRaw.categories
				: [];
		}

		if (isHtmlResponse(subcategoriesRaw)) {
			console.log(
				"⚠️ Subcategories API returned HTML (likely authentication issue), using fallback data"
			);
			subcategories = getFallbackSubcategories();
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

		// If no categories found, use fallback sample data for SEO
		if (categories.length === 0) {
			console.log(
				"⚠️ No categories found from API, using fallback sample data..."
			);
			const fallbackCategories = [
				{ id: 1, name: "Automotive Parts & Accessories" },
				{ id: 2, name: "Computer, Parts & Accessories" },
				{ id: 3, name: "Filtration" },
				{ id: 4, name: "Hardware Tools" },
				{ id: 6, name: "Equipment Leasing" },
			];
			const fallbackSubcategories = [
				{ id: 1, category_id: 1, name: "Batteries" },
				{ id: 2, category_id: 1, name: "Lubricants" },
				{ id: 3, category_id: 1, name: "Accessories" },
				{ id: 4, category_id: 1, name: "Spare Parts" },
				{ id: 5, category_id: 1, name: "Tyres" },
				{ id: 6, category_id: 1, name: "Others" },
				{ id: 7, category_id: 2, name: "Cooling & Maintenance" },
				{ id: 8, category_id: 2, name: "Internal Components" },
				{ id: 9, category_id: 2, name: "Networking Equipment" },
				{ id: 10, category_id: 2, name: "Peripherals" },
				{ id: 11, category_id: 2, name: "Storage" },
				{ id: 12, category_id: 2, name: "Accessories" },
				{ id: 13, category_id: 2, name: "Others" },
				{ id: 14, category_id: 3, name: "Air Filters" },
				{ id: 15, category_id: 3, name: "Fuel Filters" },
				{ id: 16, category_id: 3, name: "Industrial Filters" },
				{ id: 17, category_id: 3, name: "Oil & Hydraulic Filters" },
				{ id: 18, category_id: 3, name: "Others" },
				{ id: 19, category_id: 4, name: "Safety Wear" },
				{ id: 20, category_id: 4, name: "Hand & Power Tools" },
				{ id: 21, category_id: 4, name: "Power & Electrical Equipment" },
				{ id: 22, category_id: 4, name: "Plumbing Supplies" },
				{ id: 23, category_id: 4, name: "Others" },
				{ id: 32, category_id: 6, name: "Earth Moving Equipment" },
				{ id: 33, category_id: 6, name: "Lifting Equipment" },
				{ id: 34, category_id: 6, name: "Concrete Equipment" },
				{ id: 35, category_id: 6, name: "Drilling Equipment" },
				{ id: 36, category_id: 6, name: "Compacting Equipment" },
				{ id: 37, category_id: 6, name: "Others" },
			];
			return {
				categories: fallbackCategories,
				subcategories: fallbackSubcategories,
			};
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
				"⚠️ Ads API returned HTML or 404 (likely authentication issue or endpoint not available), using fallback data"
			);
			ads = getFallbackAds();
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
				"⚠️ Sellers API returned HTML or 404 (likely authentication issue or endpoint not available), using fallback data"
			);
			sellers = getFallbackSellers();
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
				seller.enterprise_name?.toLowerCase().replace(/\s+/g, "-");
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

// Generate XML sitemap
function generateSitemapXML(urls) {
	const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  Carbon Cube Kenya Sitemap
  Generated on: ${CURRENT_DATE}
  Build Timestamp: ${BUILD_TIMESTAMP}
  Last Modified: ${CURRENT_DATE}
-->`;
	const urlsetOpen =
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
	const urlsetClose = "</urlset>";

	const urlEntries = urls
		.map((url) => {
			return `  <url>
    <loc>${SITE_BASE_URL}${url.path}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
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
	return `# Carbon Cube Kenya - Robots.txt
# Generated on ${new Date().toISOString().split("T")[0]}

# ==== ALLOW ALL SEARCH ENGINES ====
User-agent: *
# ==== BLOCK PRIVATE/SENSITIVE AREAS ====
# Admin areas - completely block from all crawlers
Disallow: /admin/
Disallow: /admin/*
# User authentication and account areas
Disallow: /auth/
Disallow: /auth/*
# Private seller areas
Disallow: /seller/
Disallow: /seller/*
Allow: /seller-signup
Allow: /seller/tiers
# Private buyer areas
Disallow: /buyer/
Disallow: /buyer/*
Allow: /buyer-signup
# Private rider areas
Disallow: /rider/
Disallow: /rider/*
# API endpoints (prevent indexing of raw JSON)
Disallow: /api/
Disallow: /api/*
# Payment and transaction pages
Disallow: /payments/
Disallow: /payments/*
# Search tracking and analytics
Disallow: /ad_searches
Disallow: /click_events
# WebSocket connections
Disallow: /cable
Disallow: /cable/*
# Development and health check endpoints
Disallow: /up
Disallow: /rails/

# ==== ALLOW PUBLIC AREAS ====
# Public product listings
Allow: /ads
Allow: /ads/*
# Public categories and navigation
Allow: /categories
Allow: /categories/*
Allow: /subcategories
Allow: /subcategories/*
# Public information pages
Allow: /banners
Allow: /counties
Allow: /age_groups
Allow: /incomes
Allow: /sectors
Allow: /educations
Allow: /employments
Allow: /tiers
Allow: /document_types

# ==== CRAWL DELAY ====
# Prevent aggressive crawling that could slow down your site
Crawl-delay: 1

# ==== SITEMAP LOCATION ====
# Point crawlers to your sitemap
Sitemap: ${SITE_BASE_URL}/sitemap.xml

# ==== SPECIFIC SEARCH ENGINE RULES ====
# Google Bot - allow more frequent crawling
User-agent: Googlebot
Crawl-delay: 1
Allow: /ads
Allow: /ads/*
Allow: /categories
Allow: /categories/*
Allow: /subcategories
Allow: /subcategories/*
Disallow: /admin/
Disallow: /seller/
Disallow: /buyer/
Disallow: /rider/
Disallow: /auth/
Disallow: /api/

# Bing Bot
User-agent: Bingbot
Crawl-delay: 2
Allow: /ads
Allow: /ads/*
Allow: /categories
Allow: /categories/*
Allow: /subcategories
Allow: /subcategories/*
Disallow: /admin/
Disallow: /seller/
Disallow: /buyer/
Disallow: /rider/
Disallow: /auth/
Disallow: /api/

# Block aggressive crawlers that might harm performance
User-agent: AhrefsBot
Disallow: /
User-agent: SemrushBot
Disallow: /
User-agent: MJ12bot
Disallow: /
User-agent: DotBot
Disallow: /
User-agent: BLEXBot
Disallow: /

# ==== NOTES ====
# 1. Place this file at: public/robots.txt
# 2. Test at: ${SITE_BASE_URL}/robots.txt
# 3. Submit to Google Search Console
# 4. Create and submit sitemap.xml
# 5. Monitor crawl errors in search console
# 6. Update sitemap regularly for dynamic content
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
		const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_BASE_URL}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
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

		console.log("\n🎉 Dynamic sitemap generation completed successfully!");
		console.log(`📁 Files generated in: ${publicDir}`);
		console.log(`🌐 Site URL: ${SITE_BASE_URL}`);
		console.log(`🔗 Sitemap URL: ${SITE_BASE_URL}/sitemap.xml`);
		console.log(`🤖 Robots URL: ${SITE_BASE_URL}/robots.txt`);
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
