/**
 * SEO Utility Functions for Carbon Cube Kenya
 * Handles canonical URLs, hreflang, and other SEO optimizations
 */

const BASE_URL = "https://carboncube-ke.com";

/**
 * Generate canonical URL for a given path
 * Ensures consistent canonical URLs and prevents duplicate content issues
 */
export const getCanonicalUrl = (path = "", queryParams = null) => {
	// Remove leading slash if present
	const cleanPath = path.startsWith("/") ? path.slice(1) : path;

	// Build base URL
	let canonicalUrl = BASE_URL;

	// Add path if provided and not root
	if (cleanPath && cleanPath !== "" && cleanPath !== "home") {
		canonicalUrl += `/${cleanPath}`;
	}

	// Filter out tracking parameters and only include SEO-relevant query params
	const allowedParams = [
		"q",
		"category",
		"subcategory",
		"location",
		"sort",
		"page",
	];
	if (queryParams && Object.keys(queryParams).length > 0) {
		const searchParams = new URLSearchParams();
		Object.entries(queryParams).forEach(([key, value]) => {
			// Only include allowed parameters and exclude tracking parameters
			if (
				allowedParams.includes(key) &&
				value !== null &&
				value !== undefined &&
				value !== "" &&
				!key.includes("fbclid") &&
				!key.includes("utm_") &&
				!key.includes("gclid") &&
				!key.includes("from")
			) {
				searchParams.append(key, value);
			}
		});

		if (searchParams.toString()) {
			canonicalUrl += `?${searchParams.toString()}`;
		}
	}

	return canonicalUrl;
};

/**
 * Generate hreflang links for internationalization
 * Returns properly formatted hreflang attributes
 */
export const getHreflangLinks = (
	currentPath = "",
	supportedLocales = ["en", "sw-KE"]
) => {
	const hreflangLinks = [];

	// Add current page for each supported locale
	supportedLocales.forEach((locale) => {
		const localeUrl =
			locale === "en"
				? getCanonicalUrl(currentPath)
				: `${getCanonicalUrl(currentPath)}/${locale}`;

		hreflangLinks.push({
			rel: "alternate",
			hreflang: locale,
			href: localeUrl,
		});
	});

	// Add x-default (usually English)
	hreflangLinks.push({
		rel: "alternate",
		hreflang: "x-default",
		href: getCanonicalUrl(currentPath),
	});

	return hreflangLinks;
};

/**
 * Clean and normalize URL paths for SEO
 * Removes trailing slashes, handles duplicates, etc.
 */
export const normalizePath = (path) => {
	if (!path || path === "/") return "";

	// Remove leading slash
	let normalizedPath = path.startsWith("/") ? path.slice(1) : path;

	// Remove trailing slash
	normalizedPath = normalizedPath.endsWith("/")
		? normalizedPath.slice(0, -1)
		: normalizedPath;

	// Handle common redirects
	const redirectMap = {
		home: "",
		index: "",
		main: "",
	};

	return redirectMap[normalizedPath] || normalizedPath;
};

/**
 * Generate SEO-friendly URLs for different page types
 */
export const generateSEOUrl = (pageType, data = {}) => {
	const baseUrl = getCanonicalUrl();

	switch (pageType) {
		case "home":
			return baseUrl;

		case "product":
			const productSlug = data.slug || data.id || "product";
			return `${baseUrl}/ads/${productSlug}`;

		case "shop":
			const shopSlug = data.slug || data.id || "shop";
			return `${baseUrl}/shop/${shopSlug}`;

		case "category":
			const categorySlug = data.slug || data.id || "category";
			return `${baseUrl}/categories/${categorySlug}`;

		case "seller":
			const sellerSlug = data.slug || data.id || "seller";
			return `${baseUrl}/seller/${sellerSlug}`;

		case "search":
			const query = data.query || "";
			const category = data.category || "";
			const params = {};
			if (query) params.q = query;
			if (category) params.category = category;
			return getCanonicalUrl("search", params);

		default:
			return getCanonicalUrl(pageType);
	}
};

/**
 * Clean URL by removing tracking parameters
 * Removes Facebook, Google, and other tracking parameters
 */
export const cleanUrl = (url) => {
	if (!url) return url;

	try {
		const urlObj = new URL(url);
		const trackingParams = [
			"fbclid",
			"utm_source",
			"utm_medium",
			"utm_campaign",
			"utm_term",
			"utm_content",
			"gclid",
			"gclsrc",
			"dclid",
			"wbraid",
			"gbraid",
			"from",
			"ref",
			"source",
			"campaign",
			"medium",
			"content",
			"term",
			"affiliate",
			"partner",
		];

		// Remove tracking parameters
		trackingParams.forEach((param) => {
			urlObj.searchParams.delete(param);
		});

		return urlObj.toString();
	} catch (error) {
		return url;
	}
};

/**
 * Validate and fix common SEO issues
 */
export const validateSEO = (seoData) => {
	const issues = [];
	const fixes = {};

	// Check canonical URL
	if (seoData.canonical) {
		if (!seoData.canonical.startsWith(BASE_URL)) {
			issues.push("Canonical URL doesn't match base domain");
			fixes.canonical = getCanonicalUrl(seoData.path);
		}

		// Check for duplicate content issues
		if (seoData.canonical.includes("/home")) {
			issues.push("Canonical URL contains /home (duplicate content)");
			fixes.canonical = getCanonicalUrl();
		}
	}

	// Check hreflang format
	if (seoData.hreflang) {
		seoData.hreflang.forEach((link) => {
			if (link.hreflang && link.hreflang.includes("_")) {
				issues.push(
					`Invalid hreflang format: ${link.hreflang} (should use hyphens)`
				);
			}
		});
	}

	// Check meta description length
	if (seoData.description) {
		if (seoData.description.length > 160) {
			issues.push("Meta description too long (>160 characters)");
		}
		if (seoData.description.length < 120) {
			issues.push("Meta description too short (<120 characters)");
		}
	}

	// Check title length
	if (seoData.title) {
		if (seoData.title.length > 60) {
			issues.push("Title too long (>60 characters)");
		}
		if (seoData.title.length < 30) {
			issues.push("Title too short (<30 characters)");
		}
	}

	return {
		issues,
		fixes,
		isValid: issues.length === 0,
	};
};

/**
 * Generate comprehensive SEO data for a page
 */
export const generatePageSEO = (pageType, data = {}, currentPath = "") => {
	const normalizedPath = normalizePath(currentPath);
	const canonicalUrl = getCanonicalUrl(normalizedPath);
	const hreflangLinks = getHreflangLinks(normalizedPath);

	const seoData = {
		title:
			data.title ||
			"Carbon Cube Kenya | Kenya's Most Trusted Online Marketplace",
		description:
			data.description ||
			"Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement. Discover thousands of products from verified sellers across Kenya with secure payment and fast delivery.",
		canonical: canonicalUrl,
		hreflang: hreflangLinks,
		path: normalizedPath,
		url: generateSEOUrl(pageType, data),
		...data,
	};

	// Validate and fix issues
	const validation = validateSEO(seoData);
	if (!validation.isValid) {
		return {
			...seoData,
			...validation.fixes,
		};
	}

	return seoData;
};

/**
 * Get current page path for SEO
 */
export const getCurrentPath = () => {
	if (typeof window === "undefined") return "";

	const path = window.location.pathname;
	return normalizePath(path);
};

/**
 * Check if current page should have canonical URL
 * Some pages (like login, admin) shouldn't be indexed
 */
export const shouldIndexPage = (path) => {
	const noIndexPaths = [
		"login",
		"admin",
		"seller/dashboard",
		"buyer/profile",
		"buyer/messages",
		"buyer/wish_lists",
		"sales/dashboard",
		"rider/dashboard",
	];

	const normalizedPath = normalizePath(path);

	// Check if any no-index path matches
	return !noIndexPaths.some((noIndexPath) =>
		normalizedPath.startsWith(noIndexPath)
	);
};

const seoUtils = {
	getCanonicalUrl,
	getHreflangLinks,
	normalizePath,
	generateSEOUrl,
	validateSEO,
	generatePageSEO,
	getCurrentPath,
	shouldIndexPage,
};

export default seoUtils;
