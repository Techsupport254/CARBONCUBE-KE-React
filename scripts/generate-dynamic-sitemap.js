const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Configuration
const API_BASE_URL =
	process.env.REACT_APP_BACKEND_URL ||
	process.env.API_URL ||
	"https://carboncube-ke.com/api";
const SITE_BASE_URL =
	process.env.REACT_APP_SITE_URL ||
	process.env.SITE_URL ||
	"https://carboncube-ke.com";

console.log(`🔧 Using API URL: ${API_BASE_URL}`);
console.log(`🔧 Using Site URL: ${SITE_BASE_URL}`);

// Static routes with metadata
const staticRoutes = [
	{
		path: "/",
		lastmod: new Date().toISOString().split("T")[0],
		changefreq: "daily",
		priority: "1.0",
		keywords:
			"Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce, AI-powered marketplace, digital procurement Kenya, seller verification, sustainable sourcing Kenya, online shopping Kenya",
	},
	{
		path: "/categories",
		lastmod: new Date().toISOString().split("T")[0],
		changefreq: "weekly",
		priority: "0.9",
		keywords:
			"product categories, browse by category, Kenya marketplace categories, online shopping categories",
	},
	{
		path: "/ads",
		lastmod: new Date().toISOString().split("T")[0],
		changefreq: "hourly",
		priority: "0.8",
		keywords:
			"products, buy online Kenya, marketplace products, verified sellers, secure shopping, ecommerce Kenya",
	},
	{
		path: "/about-us",
		lastmod: new Date().toISOString().split("T")[0],
		changefreq: "monthly",
		priority: "0.7",
		keywords:
			"about Carbon Cube Kenya, Kenya marketplace, digital procurement, verified sellers, company information, Kenya ecommerce",
	},
	{
		path: "/contact-us",
		lastmod: new Date().toISOString().split("T")[0],
		changefreq: "monthly",
		priority: "0.7",
		keywords:
			"contact Carbon Cube Kenya, customer support, Kenya marketplace support, help desk, contact information, Kenya ecommerce support",
	},
	{
		path: "/buyer-signup",
		lastmod: new Date().toISOString().split("T")[0],
		changefreq: "monthly",
		priority: "0.6",
		keywords:
			"buyer signup, join Carbon Cube Kenya, create account, Kenya online shopping, marketplace registration, buyer registration",
	},
	{
		path: "/seller-signup",
		lastmod: new Date().toISOString().split("T")[0],
		changefreq: "monthly",
		priority: "0.6",
		keywords:
			"seller signup, become a seller, Carbon Cube Kenya seller registration, Kenya marketplace seller, online selling, seller registration",
	},
	{
		path: "/login",
		lastmod: new Date().toISOString().split("T")[0],
		changefreq: "monthly",
		priority: "0.6",
		keywords:
			"login Carbon Cube Kenya, sign in, marketplace login, Kenya online shopping, seller login, buyer login",
	},
	{
		path: "/terms-and-conditions",
		lastmod: new Date().toISOString().split("T")[0],
		changefreq: "monthly",
		priority: "0.5",
		keywords:
			"terms and conditions, Carbon Cube Kenya legal, Kenya marketplace terms, user agreement, platform terms",
	},
	{
		path: "/privacy-policy",
		lastmod: new Date().toISOString().split("T")[0],
		changefreq: "monthly",
		priority: "0.5",
		keywords:
			"privacy policy, Carbon Cube Kenya data protection, Kenya marketplace privacy, user data protection, GDPR compliance",
	},
	{
		path: "/faq",
		lastmod: new Date().toISOString().split("T")[0],
		changefreq: "monthly",
		priority: "0.6",
		keywords:
			"FAQ, frequently asked questions, Carbon Cube Kenya help, Kenya marketplace FAQ, customer support",
	},
	{
		path: "/how-it-works",
		lastmod: new Date().toISOString().split("T")[0],
		changefreq: "monthly",
		priority: "0.7",
		keywords:
			"how it works, Carbon Cube Kenya guide, Kenya marketplace tutorial, online shopping guide, buyer guide, seller guide",
	},
];

// Fetch categories and subcategories from API
async function fetchCategoriesAndSubcategories() {
	try {
		console.log("📡 Fetching categories and subcategories...");
		console.log(`📡 Categories API: ${API_BASE_URL}/buyer/categories`);
		console.log(`📡 Subcategories API: ${API_BASE_URL}/buyer/subcategories`);

		const [categoriesResponse, subcategoriesResponse] = await Promise.all([
			axios
				.get(`${API_BASE_URL}/buyer/categories`, {
					timeout: 10000,
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				})
				.catch((error) => {
					console.error(`Categories API Error: ${error.message}`);
					console.error(`Status: ${error.response?.status}`);
					console.error(`Data: ${JSON.stringify(error.response?.data)}`);
					return { data: [] };
				}),
			axios
				.get(`${API_BASE_URL}/buyer/subcategories`, {
					timeout: 10000,
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				})
				.catch((error) => {
					console.error(`Subcategories API Error: ${error.message}`);
					console.error(`Status: ${error.response?.status}`);
					console.error(`Data: ${JSON.stringify(error.response?.data)}`);
					return { data: [] };
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

		const categoriesRaw = categoriesResponse.data;
		const subcategoriesRaw = subcategoriesResponse.data;

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

		const categories = Array.isArray(categoriesRaw)
			? categoriesRaw
			: Array.isArray(categoriesRaw?.categories)
			? categoriesRaw.categories
			: [];
		const subcategories = Array.isArray(subcategoriesRaw)
			? subcategoriesRaw
			: Array.isArray(subcategoriesRaw?.subcategories)
			? subcategoriesRaw.subcategories
			: [];

		console.log(
			`Found ${categories.length} categories and ${subcategories.length} subcategories`
		);

		// If no categories found, use fallback sample data for SEO
		if (categories.length === 0) {
			console.log(
				"⚠️ No categories found from API, using fallback sample data..."
			);
			const fallbackCategories = [
				{ id: 1, name: "Electronics" },
				{ id: 2, name: "Fashion" },
				{ id: 3, name: "Home & Garden" },
				{ id: 4, name: "Automotive" },
				{ id: 5, name: "Sports & Outdoors" },
				{ id: 6, name: "Books & Media" },
				{ id: 7, name: "Health & Beauty" },
				{ id: 8, name: "Toys & Games" },
			];
			const fallbackSubcategories = [
				{ id: 1, category_id: 1, name: "Smartphones" },
				{ id: 2, category_id: 1, name: "Laptops" },
				{ id: 3, category_id: 2, name: "Men's Clothing" },
				{ id: 4, category_id: 2, name: "Women's Clothing" },
				{ id: 5, category_id: 3, name: "Furniture" },
				{ id: 6, category_id: 3, name: "Kitchen Appliances" },
				{ id: 7, category_id: 4, name: "Cars" },
				{ id: 8, category_id: 4, name: "Motorcycles" },
				{ id: 9, category_id: 5, name: "Fitness Equipment" },
				{ id: 10, category_id: 5, name: "Outdoor Gear" },
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
			lastmod: new Date().toISOString().split("T")[0],
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
				lastmod: new Date().toISOString().split("T")[0],
				changefreq: "daily",
				priority: "0.7",
				keywords: `${subcategory.name}, ${subcategory.name} Kenya, ${category.name}, ${subcategory.name} ${category.name}, online shopping Kenya, Carbon Cube Kenya, verified sellers`,
			});
		}
	});

	return subcategoryUrls;
}

// Generate XML sitemap
function generateSitemapXML(urls) {
	const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
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

		// Generate URLs
		const categoryUrls = generateCategoryUrls(categories);
		const subcategoryUrls = generateSubcategoryUrls(subcategories, categories);

		// Combine all URLs
		const allUrls = [...staticRoutes, ...categoryUrls, ...subcategoryUrls];

		console.log(`📊 Generated ${allUrls.length} URLs total:`);
		console.log(`   - ${staticRoutes.length} static routes`);
		console.log(`   - ${categoryUrls.length} category pages`);
		console.log(`   - ${subcategoryUrls.length} subcategory pages`);

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
