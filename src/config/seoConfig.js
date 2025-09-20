// Comprehensive SEO Configuration for Carbon Cube Kenya
// This file contains advanced SEO configurations for different page types

export const SEO_CONFIG = {
	// Default site configuration
	site: {
		name: "Carbon Cube Kenya",
		description:
			"Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.",
		url: "https://carboncube-ke.com",
		logo: "https://carboncube-ke.com/og-image.png",
		themeColor: "#FFD700",
		locale: "en_US",
		alternateLocales: ["sw-KE"],
		contact: {
			phone: "+254 712 990 524",
			email: "info@carboncube-ke.com",
			address: {
				street: "9th Floor, CMS Africa, Kilimani",
				city: "Nairobi",
				region: "Nairobi",
				country: "KE",
				postalCode: "00100",
				coordinates: {
					latitude: -1.2921,
					longitude: 36.8219,
				},
			},
		},
		social: {
			facebook: "https://www.facebook.com/profile.php?id=61574066312678",
			twitter: "@carboncube_kenya",
			linkedin: "https://www.linkedin.com/company/carbon-cube-kenya/",
			instagram: "https://www.instagram.com/carboncube_kenya/",
		},
	},

	// Performance optimization settings
	performance: {
		preloadFonts: [], // Removed to prevent preload warnings
		preloadImages: [],
		dnsPrefetch: [
			"https://fonts.googleapis.com",
			"https://fonts.gstatic.com",
			"https://www.googletagmanager.com",
			"https://cdn.matomo.cloud",
			"https://res.cloudinary.com",
		],
	},

	// AI Search Optimization settings
	aiSearch: {
		enabled: true,
		contentType: "marketplace",
		expertiseLevel: "expert",
		contentDepth: "comprehensive",
		aiFriendlyFormat: true,
		aiCitationOptimized: true,
		conversationalKeywords: [
			"where to buy products online in Kenya",
			"best online marketplace Kenya",
			"trusted sellers Kenya",
			"verified suppliers Kenya",
			"B2B marketplace Kenya",
			"industrial supplies Kenya",
			"auto parts Kenya",
			"hardware suppliers Kenya",
			"business supplies Kenya",
			"procurement Kenya",
			"digital marketplace Kenya",
			"AI-powered marketplace Kenya",
			"sustainable sourcing Kenya",
			"fast delivery Kenya",
			"secure payment Kenya",
			"mobile money Kenya",
			"M-Pesa Kenya",
			"cash on delivery Kenya",
			"free shipping Kenya",
		],
	},

	// Default structured data templates
	structuredData: {
		organization: {
			"@context": "https://schema.org",
			"@type": "Organization",
			name: "Carbon Cube Kenya",
			description:
				"Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.",
			url: "https://carboncube-ke.com",
			logo: "https://carboncube-ke.com/og-image.png",
			sameAs: [
				"https://www.linkedin.com/company/carbon-cube-kenya/",
				"https://www.facebook.com/profile.php?id=61574066312678",
				"https://www.instagram.com/carboncube_kenya/",
			],
			contactPoint: {
				"@type": "ContactPoint",
				contactType: "customer service",
				availableLanguage: "English",
				areaServed: "KE",
				telephone: "+254 712 990 524",
				email: "info@carboncube-ke.com",
			},
			address: {
				"@type": "PostalAddress",
				streetAddress: "9th Floor, CMS Africa, Kilimani",
				addressLocality: "Nairobi",
				addressRegion: "Nairobi",
				addressCountry: "KE",
				postalCode: "00100",
			},
			foundingDate: "2023",
			numberOfEmployees: {
				"@type": "QuantitativeValue",
				minValue: 2,
				maxValue: 10,
			},
			industry: "Internet Marketplace Platforms",
		},

		website: {
			"@context": "https://schema.org",
			"@type": "WebSite",
			url: "https://carboncube-ke.com/",
			name: "Carbon Cube Kenya",
			description: "Kenya's most trusted and secure online marketplace",
			potentialAction: {
				"@type": "SearchAction",
				target: "https://carboncube-ke.com/search?q={search_term_string}",
				"query-input": "required name=search_term_string",
			},
		},

		localBusiness: {
			"@context": "https://schema.org",
			"@type": "LocalBusiness",
			name: "Carbon Cube Kenya",
			description:
				"Smart, AI-powered marketplace connecting credible sellers with serious buyers in Kenya",
			url: "https://carboncube-ke.com",
			telephone: "+254 712 990 524",
			email: "info@carboncube-ke.com",
			image: "https://carboncube-ke.com/og-image.png",
			address: {
				"@type": "PostalAddress",
				streetAddress: "9th Floor, CMS Africa, Kilimani",
				addressLocality: "Nairobi",
				addressRegion: "Nairobi",
				addressCountry: "KE",
				postalCode: "00100",
			},
			geo: {
				"@type": "GeoCoordinates",
				latitude: -1.2921,
				longitude: 36.8219,
			},
			openingHours: "Mo-Su 00:00-23:59",
			priceRange: "$$",
			currenciesAccepted: "KES",
			paymentAccepted: "Cash, Credit Card, Mobile Money",
			areaServed: "KE",
			serviceType: "Online Marketplace",
		},
	},

	// Page-specific configurations
	pages: {
		home: {
			title:
				"Carbon Cube Kenya - Kenya's #1 Online Marketplace | Trusted Sellers & Buyers",
			description:
				"Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement. Discover thousands of products from verified sellers across Kenya with secure payment and fast delivery.",
			keywords:
				"Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce, AI-powered marketplace, digital procurement Kenya, seller verification, sustainable sourcing Kenya, online shopping Kenya, B2B marketplace, auto parts Kenya, industrial supplies, hardware suppliers, verified suppliers, business growth Kenya",
			type: "website",
			section: "Homepage",
			tags: ["Marketplace", "E-commerce", "Kenya", "B2B", "Verified Sellers"],
		},

		product: {
			titleTemplate: "{title} | {brand} - KSh {price} | Carbon Cube Kenya",
			descriptionTemplate:
				"Buy {title} for KSh {price} on Carbon Cube Kenya. {condition} {category} from verified seller {seller}. Fast delivery across Kenya.",
			type: "product",
			section: "Products",
			currency: "KES",
			availability: "in stock",
			condition: "new",
		},

		shop: {
			titleTemplate: "{name} - Shop | {count} Products | {tier} Tier Seller",
			descriptionTemplate:
				"Shop {name} on Carbon Cube Kenya. {count} products available from {tier} tier verified seller in {location}. Fast delivery across Kenya.",
			type: "website",
			section: "Shop",
		},

		category: {
			titleTemplate: "{name} • {count} ads | Carbon Cube Kenya",
			descriptionTemplate:
				"Browse {count} {name} products on Carbon Cube Kenya. Quality {name} from verified sellers with fast delivery across Kenya. {subcategories}",
			type: "website",
			section: "Categories",
			// Enhanced category SEO settings
			richSnippets: true,
			showAdCount: true,
			includeLocationKeywords: true,
			includePricingKeywords: true,
			structuredDataType: "CollectionPage",
			breadcrumbEnabled: true,
			searchActionEnabled: true,
		},
	},

	// Advanced meta tags for different platforms
	platforms: {
		facebook: {
			appId: null, // Add Facebook App ID if available
			locale: "en_US",
		},
		twitter: {
			site: "@carboncube_kenya",
			creator: "@carboncube_kenya",
			card: "summary_large_image",
		},
		linkedin: {
			locale: "en_US",
		},
		whatsapp: {
			locale: "en_US",
		},
	},

	// Security and privacy settings
	security: {
		referrerPolicy: "strict-origin-when-cross-origin",
		contentSecurityPolicy: null, // Add CSP if needed
		robots:
			"index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
	},

	// Accessibility settings
	accessibility: {
		viewport:
			"width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes",
		themeColor: "#FFD700",
		appleMobileWebAppCapable: "yes",
		appleMobileWebAppStatusBarStyle: "default",
		formatDetection: "telephone=no",
	},
};

// Helper function to generate comprehensive SEO data
export const generateComprehensiveSEO = (
	pageType,
	data = {},
	customConfig = {}
) => {
	const config = { ...SEO_CONFIG, ...customConfig };
	const pageConfig = config.pages[pageType] || config.pages.home;

	// Generate title
	let title = pageConfig.title || pageConfig.titleTemplate;
	if (pageConfig.titleTemplate && data) {
		title = pageConfig.titleTemplate
			.replace(/{title}/g, data.title || "")
			.replace(/{brand}/g, data.brand || "")
			.replace(/{price}/g, data.price || "")
			.replace(/{name}/g, data.name || data.enterprise_name || "")
			.replace(/{count}/g, data.count || data.product_count || "")
			.replace(/{tier}/g, data.tier || "Free")
			.replace(/{location}/g, data.location || "");
	}

	// Generate description
	let description = pageConfig.description || pageConfig.descriptionTemplate;
	if (pageConfig.descriptionTemplate && data) {
		description = pageConfig.descriptionTemplate
			.replace(/{title}/g, data.title || "")
			.replace(/{price}/g, data.price || "")
			.replace(/{condition}/g, data.condition || "new")
			.replace(/{category}/g, data.category || data.category_name || "")
			.replace(/{seller}/g, data.seller || data.seller_enterprise_name || "")
			.replace(/{name}/g, data.name || data.enterprise_name || "")
			.replace(/{count}/g, data.count || data.product_count || "")
			.replace(/{tier}/g, data.tier || "Free")
			.replace(/{location}/g, data.location || "");
	}

	return {
		title,
		description,
		keywords: data.keywords || pageConfig.keywords || "",
		url:
			data.url ||
			(pageType === "home"
				? config.site.url
				: `${config.site.url}/${pageType}`),
		type: pageConfig.type || "website",
		image: data.image || config.site.logo,
		imageWidth: 1200,
		imageHeight: 630,
		section: pageConfig.section || "General",
		tags: data.tags || pageConfig.tags || [],
		locale: config.site.locale,
		alternateLocales: config.site.alternateLocales,
		themeColor: config.site.themeColor,
		viewport: config.accessibility.viewport,
		robots: config.security.robots,
		aiSearchOptimized: config.aiSearch.enabled,
		contentType: config.aiSearch.contentType,
		expertiseLevel: config.aiSearch.expertiseLevel,
		contentDepth: config.aiSearch.contentDepth,
		aiFriendlyFormat: config.aiSearch.aiFriendlyFormat,
		aiCitationOptimized: config.aiSearch.aiCitationOptimized,
		conversationalKeywords: config.aiSearch.conversationalKeywords,
		preloadFonts: config.performance.preloadFonts,
		preloadImages: config.performance.preloadImages,
		dnsPrefetch: config.performance.dnsPrefetch,
		structuredData: config.structuredData.organization,
		additionalStructuredData: [config.structuredData.website],
		customMetaTags: [
			{
				name: "apple-mobile-web-app-capable",
				content: config.accessibility.appleMobileWebAppCapable,
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: config.accessibility.appleMobileWebAppStatusBarStyle,
			},
			{
				name: "format-detection",
				content: config.accessibility.formatDetection,
			},
			{ name: "referrer", content: config.security.referrerPolicy },
			{ property: "og:locale", content: config.site.locale },
			{ property: "og:site_name", content: config.site.name },
			{ name: "twitter:card", content: config.platforms.twitter.card },
			{ name: "twitter:site", content: config.platforms.twitter.site },
			{ name: "twitter:creator", content: config.platforms.twitter.creator },
		],
	};
};

export default SEO_CONFIG;
