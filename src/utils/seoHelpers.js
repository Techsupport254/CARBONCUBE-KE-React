// Comprehensive SEO Helper Functions for Carbon Cube Kenya

// Generate comprehensive product SEO data
export const generateProductSEO = (product) => {
	if (!product) return null;

	const price = product.price ? Number(product.price).toFixed(2) : "0.00";
	const availability = "in stock";
	const condition = product.condition || "new";
	const brand = product.brand || "Unknown";
	const category = product.category_name || "General";
	const sku = product.id?.toString() || "";

	// Generate comprehensive description
	const description = (() => {
		if (product.description) {
			return `${product.description.substring(0, 160)}... Buy ${
				product.title
			} for KSh ${price} on Carbon Cube Kenya. ${condition} ${category} from verified seller ${
				product.seller_enterprise_name || product.seller_name
			}. Fast delivery across Kenya.`;
		} else {
			return `Buy ${
				product.title
			} for KSh ${price} on Carbon Cube Kenya. ${condition} ${category} from verified seller ${
				product.seller_enterprise_name || product.seller_name
			}. Fast delivery across Kenya.`;
		}
	})();

	// Generate comprehensive keywords
	const keywords = [
		product.title,
		`${product.title} Kenya`,
		`${product.title} price`,
		`${product.title} buy online`,
		brand,
		`${brand} ${product.title}`,
		category,
		product.subcategory_name,
		product.seller_enterprise_name,
		`${product.seller_enterprise_name} shop`,
		"Carbon Cube Kenya",
		"online shopping Kenya",
		"Kenya marketplace",
		"verified seller Kenya",
		"fast delivery Kenya",
		"secure payment Kenya",
		"mobile money Kenya",
		"M-Pesa Kenya",
		"cash on delivery Kenya",
		"free shipping Kenya",
		"Kenya e-commerce",
		"B2B marketplace Kenya",
		"industrial supplies Kenya",
		"auto parts Kenya",
		"hardware suppliers Kenya",
		"business supplies Kenya",
		"procurement Kenya",
		"digital marketplace Kenya",
		"AI-powered marketplace",
		"sustainable sourcing Kenya",
		"trusted suppliers Kenya",
	]
		.filter(Boolean)
		.join(", ");

	return {
		title: `${product.title} | ${brand} - KSh ${price} | Carbon Cube Kenya`,
		description,
		keywords,
		url: `https://carboncube-ke.com/ads/${product.id}`,
		type: "product",
		image:
			product.images && product.images.length > 0
				? product.images[0]
				: "https://carboncube-ke.com/og-image.png",
		imageWidth: 1200,
		imageHeight: 630,
		price: price,
		currency: "KES",
		availability,
		condition,
		brand,
		category,
		sku,
		publishedTime: product.created_at,
		modifiedTime: product.updated_at || product.created_at,
		section: category,
		tags: [brand, category, product.subcategory_name].filter(Boolean),
		conversationalKeywords: [
			`where to buy ${product.title} in Kenya`,
			`${product.title} price in Kenya`,
			`best ${product.title} Kenya`,
			`${product.title} online Kenya`,
			`${brand} ${product.title} Kenya`,
			`${category} Kenya`,
			`${product.title} delivery Kenya`,
			`${product.title} seller Kenya`,
			`${product.title} reviews Kenya`,
			`${product.title} comparison Kenya`,
		],
	};
};

// Generate comprehensive shop SEO data
export const generateShopSEO = (shop) => {
	if (!shop) return null;

	const tier = shop.tier || "Free";
	const rating = shop.average_rating
		? ` Rated ${shop.average_rating}/5 stars`
		: "";
	const reviews =
		shop.total_reviews > 0 ? ` with ${shop.total_reviews} reviews` : "";
	const location = [shop.city, shop.sub_county, shop.county]
		.filter(Boolean)
		.join(", ");

	// Generate comprehensive description
	const description = (() => {
		if (shop.description) {
			return `${shop.description.substring(0, 160)}... Shop ${
				shop.enterprise_name
			} on Carbon Cube Kenya. ${
				shop.product_count
			} products available from ${tier} tier verified seller${
				location ? ` in ${location}` : ""
			}.${rating}${reviews}. Fast delivery across Kenya.`;
		} else {
			return `Shop ${shop.enterprise_name} on Carbon Cube Kenya. ${
				shop.product_count
			} products available from ${tier} tier verified seller${
				location ? ` in ${location}` : ""
			}.${rating}${reviews}. Browse quality products with fast delivery across Kenya.`;
		}
	})();

	// Generate comprehensive keywords
	const keywords = [
		shop.enterprise_name,
		`${shop.enterprise_name} shop`,
		`${shop.enterprise_name} store`,
		shop.categories || "",
		shop.city || "",
		shop.county || "",
		shop.sub_county || "",
		`${tier} tier seller`,
		"online shop Kenya",
		"Carbon Cube Kenya",
		"Kenya marketplace",
		`${shop.product_count} products`,
		shop.business_registration_number
			? `registered business ${shop.business_registration_number}`
			: "",
		"Kenya e-commerce",
		"online shopping Kenya",
		"verified seller Kenya",
		"B2B marketplace Kenya",
		"industrial supplies Kenya",
		"auto parts Kenya",
		"hardware suppliers Kenya",
		"business supplies Kenya",
		"procurement Kenya",
		"digital marketplace Kenya",
		"AI-powered marketplace",
		"sustainable sourcing Kenya",
		"trusted suppliers Kenya",
		"fast delivery Kenya",
		"secure payment Kenya",
		"mobile money Kenya",
		"M-Pesa Kenya",
		"cash on delivery Kenya",
		"free shipping Kenya",
	]
		.filter(Boolean)
		.join(", ");

	return {
		title: `${shop.enterprise_name} - Shop | ${shop.product_count} Products | ${tier} Tier Seller`,
		description,
		keywords,
		url: `https://carboncube-ke.com/shop/${shop.slug}`,
		type: "website",
		image: shop.logo_url || "https://carboncube-ke.com/og-image.png",
		imageWidth: 1200,
		imageHeight: 630,
		publishedTime: shop.created_at,
		modifiedTime: shop.updated_at || shop.created_at,
		section: "Shop",
		tags: [shop.categories, shop.city, shop.county, tier].filter(Boolean),
		customMetaTags: [
			{ name: "shop:product_count", content: shop.product_count.toString() },
			{ name: "shop:tier", content: tier },
			{ name: "shop:location", content: location },
			{ name: "shop:rating", content: shop.average_rating?.toString() || "0" },
			{ name: "shop:reviews", content: shop.total_reviews?.toString() || "0" },
			{
				property: "og:shop:product_count",
				content: shop.product_count.toString(),
			},
			{ property: "og:shop:tier", content: tier },
			{ property: "og:shop:location", content: location },
			{
				property: "og:shop:rating",
				content: shop.average_rating?.toString() || "0",
			},
			{
				property: "og:shop:reviews",
				content: shop.total_reviews?.toString() || "0",
			},
			{ property: "article:section", content: "Shop" },
			{
				property: "article:tag",
				content: [shop.categories, shop.city, tier].filter(Boolean).join(", "),
			},
		],
		conversationalKeywords: [
			`${shop.enterprise_name} shop Kenya`,
			`${shop.enterprise_name} products Kenya`,
			`${shop.enterprise_name} reviews Kenya`,
			`${shop.enterprise_name} location Kenya`,
			`${shop.enterprise_name} contact Kenya`,
			`${shop.enterprise_name} delivery Kenya`,
			`${shop.enterprise_name} prices Kenya`,
			`${shop.enterprise_name} quality Kenya`,
			`${shop.enterprise_name} rating Kenya`,
			`${shop.enterprise_name} tier Kenya`,
		],
	};
};

// Generate comprehensive homepage SEO data
export const generateHomeSEO = (categories = []) => {
	const categoryNames = categories
		.slice(0, 10)
		.map((cat) => cat.name)
		.join(", ");
	const totalCategories = categories.length;

	// Ensure minimum length for SEO validation
	const baseDescription =
		"Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.";
	const categoryDescription =
		totalCategories > 0
			? ` Browse ${totalCategories} categories with thousands of products from verified sellers across Kenya.`
			: " Discover thousands of products from verified sellers across Kenya with secure payment and fast delivery.";

	const fullDescription = baseDescription + categoryDescription;

	return {
		title: "Carbon Cube Kenya | Kenya's Most Trusted Online Marketplace",
		description: fullDescription,
		keywords: `Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce, AI-powered marketplace, digital procurement Kenya, seller verification, sustainable sourcing Kenya, online shopping Kenya, B2B marketplace, auto parts Kenya, industrial supplies, hardware suppliers, verified suppliers, business growth Kenya, ${categoryNames}`,
		url: "https://carboncube-ke.com/",
		canonical: "https://carboncube-ke.com/",
		type: "website",
		image: "https://carboncube-ke.com/og-image.png",
		imageWidth: 1200,
		imageHeight: 630,
		section: "Homepage",
		tags: ["Marketplace", "E-commerce", "Kenya", "B2B", "Verified Sellers"],
		robots:
			"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
		alternateLanguages: [
			{ lang: "en", url: "https://carboncube-ke.com/" },
			{ lang: "sw-KE", url: "https://carboncube-ke.com/sw-KE/" },
			{ lang: "x-default", url: "https://carboncube-ke.com/" },
		],
		customMetaTags: [
			// Homepage-specific meta tags
			{ name: "homepage:featured_categories", content: categoryNames },
			{
				name: "homepage:total_categories",
				content: totalCategories.toString(),
			},
			{ name: "homepage:marketplace_type", content: "E-commerce Marketplace" },
			{ name: "homepage:target_country", content: "Kenya" },
			{
				name: "homepage:verification_status",
				content: "Verified Sellers Only",
			},
			{ name: "homepage:launch_year", content: "2023" },
			{ name: "homepage:business_type", content: "B2B Marketplace" },

			// Open Graph enhancements
			{ property: "og:homepage:featured_categories", content: categoryNames },
			{
				property: "og:homepage:total_categories",
				content: totalCategories.toString(),
			},
			{
				property: "og:homepage:marketplace_type",
				content: "E-commerce Marketplace",
			},
			{ property: "og:homepage:target_country", content: "Kenya" },
			{
				property: "og:homepage:verification_status",
				content: "Verified Sellers Only",
			},
			{ property: "article:section", content: "Homepage" },
			{
				property: "article:tag",
				content: "Marketplace, E-commerce, Kenya, B2B, Verified Sellers",
			},

			// Business information
			{
				name: "business:contact_data:street_address",
				content: "9th Floor, CMS Africa, Kilimani",
			},
			{ name: "business:contact_data:locality", content: "Nairobi" },
			{ name: "business:contact_data:region", content: "Nairobi" },
			{ name: "business:contact_data:postal_code", content: "00100" },
			{ name: "business:contact_data:country_name", content: "Kenya" },
			{
				name: "business:contact_data:phone_number",
				content: "+254 712 990 524",
			},
			{
				name: "business:contact_data:email",
				content: "info@carboncube-ke.com",
			},

			// Geographic and language information
			{ name: "geo.region", content: "KE" },
			{ name: "geo.placename", content: "Nairobi, Kenya" },
			{ name: "geo.position", content: "-1.2921;36.8219" },
			{ name: "ICBM", content: "-1.2921, 36.8219" },
			{ name: "language", content: "English" },
			{ name: "locale", content: "en_KE" },

			// Mobile and app information
			{ name: "mobile-web-app-capable", content: "yes" },
			{ name: "apple-mobile-web-app-capable", content: "yes" },
			{ name: "apple-mobile-web-app-status-bar-style", content: "default" },
			{ name: "apple-mobile-web-app-title", content: "Carbon Cube Kenya" },
			{ name: "application-name", content: "Carbon Cube Kenya" },
			{ name: "msapplication-TileColor", content: "#FFD700" },
			{ name: "msapplication-config", content: "/browserconfig.xml" },

			// Performance and accessibility
			{ name: "format-detection", content: "telephone=no" },
			{ name: "referrer", content: "strict-origin-when-cross-origin" },
			{ name: "theme-color", content: "#FFD700" },
			{ name: "msapplication-navbutton-color", content: "#FFD700" },
		],
		// Enhanced structured data for better search engine understanding
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: "Carbon Cube Kenya",
			description: "Kenya's most trusted and secure online marketplace",
			url: "https://carboncube-ke.com/",
			potentialAction: {
				"@type": "SearchAction",
				target:
					"https://carboncube-ke.com/buyer/ads/search?q={search_term_string}",
				"query-input": "required name=search_term_string",
			},
			mainEntity: {
				"@type": "ItemList",
				name: "Product Categories",
				description: "Browse products by category on Carbon Cube Kenya",
				url: "https://carboncube-ke.com/buyer/categories",
				numberOfItems: totalCategories,
			},
		},
		additionalStructuredData: [
			// Organization Schema
			{
				"@context": "https://schema.org",
				"@type": "Organization",
				name: "Carbon Cube Kenya",
				description:
					"Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.",
				url: "https://carboncube-ke.com",
				logo: "https://carboncube-ke.com/og-image.png",
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
				industry: "Internet Marketplace Platforms",
				sameAs: [
					"https://www.facebook.com/carboncube.kenya",
					"https://www.instagram.com/carboncube.kenya",
					"https://www.linkedin.com/company/carbon-cube-kenya",
				],
			},
			// LocalBusiness Schema
			{
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
				paymentAccepted: "Cash, Credit Card, Mobile Money, M-Pesa",
				areaServed: "KE",
				serviceType: "Online Marketplace",
			},
			// FAQ Schema for Homepage
			{
				"@context": "https://schema.org",
				"@type": "FAQPage",
				mainEntity: [
					{
						"@type": "Question",
						name: "What is Carbon Cube Kenya?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.",
						},
					},
					{
						"@type": "Question",
						name: "How do I start shopping on Carbon Cube Kenya?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "Simply browse our categories, search for products, and purchase from verified sellers. All transactions are secure and protected.",
						},
					},
					{
						"@type": "Question",
						name: "Are all sellers verified on Carbon Cube Kenya?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "Yes, all sellers on Carbon Cube Kenya go through a verification process to ensure quality and reliability.",
						},
					},
					{
						"@type": "Question",
						name: "What payment methods are accepted?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "We accept cash, credit cards, mobile money, and bank transfers for secure transactions.",
						},
					},
				],
			},
		],
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
			"online shopping Kenya",
			"ecommerce Kenya",
			"digital procurement Kenya",
			"seller verification Kenya",
			"business growth Kenya",
			"Carbon Cube Kenya marketplace",
			"online shopping platform Kenya",
			"how to shop safely online Kenya",
			"verified marketplace Kenya",
			"secure online shopping Kenya",
		],
		// AI Search Optimization
		aiSearchOptimized: true,
		contentType: "marketplace",
		expertiseLevel: "expert",
		contentDepth: "comprehensive",
		aiFriendlyFormat: true,
		aiCitationOptimized: true,
	};
};

// Generate comprehensive category SEO data with rich snippets optimization
export const generateCategorySEO = (category, subcategories = [], ads = []) => {
	if (!category) return null;

	const subcategoryNames = subcategories.map((sub) => sub.name).join(", ");
	const productCount = category.product_count || ads.length || 0;
	const adCount = ads.length || 0;

	// Generate rich snippet description similar to Jiji
	const description = (() => {
		const baseDescription = `Browse ${productCount} ${category.name} products on Carbon Cube Kenya. Quality ${category.name} from verified sellers with fast delivery across Kenya.`;

		if (subcategoryNames) {
			return `${baseDescription} Subcategories: ${subcategoryNames}.`;
		}

		return baseDescription;
	})();

	// Generate comprehensive keywords including location and pricing
	const keywords = [
		category.name,
		`${category.name} Kenya`,
		`${category.name} products`,
		`${category.name} online`,
		`${category.name} suppliers`,
		`${category.name} sellers`,
		`${category.name} Nairobi`,
		`${category.name} Mombasa`,
		`${category.name} Kisumu`,
		`${category.name} prices`,
		`${category.name} cheap`,
		`${category.name} wholesale`,
		`${category.name} retail`,
		`buy ${category.name} Kenya`,
		`${category.name} for sale`,
		`${category.name} marketplace`,
		`Carbon Cube Kenya`,
		"online shopping Kenya",
		"Kenya marketplace",
		"verified sellers Kenya",
		"fast delivery Kenya",
		"secure payment Kenya",
		"mobile money Kenya",
		"M-Pesa Kenya",
		"cash on delivery Kenya",
		"free shipping Kenya",
		subcategoryNames,
	]
		.filter(Boolean)
		.join(", ");

	// Generate structured data for categories
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: `${category.name} | Carbon Cube Kenya`,
		description: description,
		url: `https://carboncube-ke.com/category/${category.slug}`,
		image: category.image_url || "https://carboncube-ke.com/og-image.png",
		mainEntity: {
			"@type": "ItemList",
			name: `${category.name} Products`,
			numberOfItems: productCount,
			itemListElement: ads.slice(0, 10).map((ad, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Product",
					name: ad.title,
					description: ad.description,
					image:
						ad.images && ad.images[0]
							? ad.images[0]
							: "https://carboncube-ke.com/og-image.png",
					offers: {
						"@type": "Offer",
						price: ad.price,
						priceCurrency: "KES",
						availability: "https://schema.org/InStock",
						seller: {
							"@type": "Organization",
							name: ad.seller_enterprise_name || ad.seller_name,
						},
					},
				},
			})),
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Home",
					item: "https://carboncube-ke.com",
				},
				{
					"@type": "ListItem",
					position: 2,
					name: "Categories",
					item: "https://carboncube-ke.com/categories",
				},
				{
					"@type": "ListItem",
					position: 3,
					name: category.name,
					item: `https://carboncube-ke.com/category/${category.slug}`,
				},
			],
		},
		potentialAction: {
			"@type": "SearchAction",
			target: `https://carboncube-ke.com/search?category=${category.slug}&q={search_term_string}`,
			"query-input": "required name=search_term_string",
		},
	};

	return {
		title: `${category.name} • ${productCount} ads | Carbon Cube Kenya`,
		description,
		keywords,
		url: `https://carboncube-ke.com/category/${category.slug}`,
		type: "website",
		image: category.image_url || "https://carboncube-ke.com/og-image.png",
		imageWidth: 1200,
		imageHeight: 630,
		section: category.name,
		tags: [category.name, ...subcategories.map((sub) => sub.name)],
		structuredData,
		customMetaTags: [
			{ name: "category:product_count", content: productCount.toString() },
			{ name: "category:ad_count", content: adCount.toString() },
			{ name: "category:subcategories", content: subcategoryNames },
			{ name: "category:slug", content: category.slug },
			{ name: "category:parent", content: category.parent_category || "root" },
			{
				property: "og:category:product_count",
				content: productCount.toString(),
			},
			{ property: "og:category:ad_count", content: adCount.toString() },
			{ property: "og:category:subcategories", content: subcategoryNames },
			{ property: "og:category:slug", content: category.slug },
			{
				property: "og:category:parent",
				content: category.parent_category || "root",
			},
			{ property: "article:section", content: category.name },
			{ property: "article:tag", content: subcategoryNames },
			{ property: "product:category", content: category.name },
			{ property: "product:category:count", content: productCount.toString() },
		],
		conversationalKeywords: [
			`${category.name} Kenya`,
			`${category.name} products Kenya`,
			`${category.name} suppliers Kenya`,
			`${category.name} sellers Kenya`,
			`${category.name} online Kenya`,
			`${category.name} delivery Kenya`,
			`${category.name} prices Kenya`,
			`${category.name} quality Kenya`,
			`${category.name} reviews Kenya`,
			`${category.name} comparison Kenya`,
			`buy ${category.name} online Kenya`,
			`${category.name} marketplace Kenya`,
			`${category.name} wholesale Kenya`,
			`${category.name} retail Kenya`,
			`${category.name} cheap Kenya`,
			`${category.name} best price Kenya`,
			`${category.name} verified sellers Kenya`,
			`${category.name} fast delivery Kenya`,
			`${category.name} secure payment Kenya`,
			`${category.name} mobile money Kenya`,
		],
	};
};

// Generate SEO for category pages using URL parameters (/?query=&category=Automotive)
export const generateCategoryPageSEO = (
	category,
	subcategory,
	ads = [],
	searchQuery = ""
) => {
	if (!category) return null;

	const productCount = ads.length || 0;
	const adCount = ads.length || 0;

	// Generate title based on search context
	const title = (() => {
		if (searchQuery) {
			return `${searchQuery} in ${category.name} • ${productCount} results | Carbon Cube Kenya`;
		} else if (subcategory) {
			return `${subcategory.name} • ${productCount} ads | Carbon Cube Kenya`;
		} else {
			return `${category.name} • ${productCount} ads | Carbon Cube Kenya`;
		}
	})();

	// Generate description similar to Jiji's approach
	const description = (() => {
		if (searchQuery) {
			return `Search results for "${searchQuery}" in ${category.name} on Carbon Cube Kenya. ${productCount} products found from verified sellers with fast delivery across Kenya.`;
		} else if (subcategory) {
			return `Browse ${productCount} ${subcategory.name} products on Carbon Cube Kenya. Quality ${subcategory.name} from verified sellers in ${category.name} category with fast delivery across Kenya.`;
		} else {
			return `Browse ${productCount} ${category.name} products on Carbon Cube Kenya. Quality ${category.name} from verified sellers with fast delivery across Kenya.`;
		}
	})();

	// Generate comprehensive keywords
	const keywords = [
		category.name,
		`${category.name} Kenya`,
		`${category.name} products`,
		`${category.name} online`,
		`${category.name} suppliers`,
		`${category.name} sellers`,
		`${category.name} Nairobi`,
		`${category.name} Mombasa`,
		`${category.name} Kisumu`,
		`${category.name} prices`,
		`${category.name} cheap`,
		`${category.name} wholesale`,
		`${category.name} retail`,
		`buy ${category.name} Kenya`,
		`${category.name} for sale`,
		`${category.name} marketplace`,
		`Carbon Cube Kenya`,
		"online shopping Kenya",
		"Kenya marketplace",
		"verified sellers Kenya",
		"fast delivery Kenya",
		"secure payment Kenya",
		"mobile money Kenya",
		"M-Pesa Kenya",
		"cash on delivery Kenya",
		"free shipping Kenya",
		...(subcategory ? [subcategory.name, `${subcategory.name} Kenya`] : []),
		...(searchQuery ? [searchQuery, `${searchQuery} Kenya`] : []),
	]
		.filter(Boolean)
		.join(", ");

	// Generate structured data for category pages
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: title,
		description: description,
		url: `https://carboncube-ke.com/?category=${category.slug}${
			subcategory ? `&subcategory=${subcategory.slug}` : ""
		}${searchQuery ? `&query=${encodeURIComponent(searchQuery)}` : ""}`,
		image: category.image_url || "https://carboncube-ke.com/og-image.png",
		mainEntity: {
			"@type": "ItemList",
			name: `${category.name} Products`,
			numberOfItems: productCount,
			itemListElement: ads.slice(0, 10).map((ad, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Product",
					name: ad.title,
					description: ad.description,
					image:
						ad.images && ad.images[0]
							? ad.images[0]
							: "https://carboncube-ke.com/og-image.png",
					offers: {
						"@type": "Offer",
						price: ad.price,
						priceCurrency: "KES",
						availability: "https://schema.org/InStock",
						seller: {
							"@type": "Organization",
							name: ad.seller_enterprise_name || ad.seller_name,
						},
					},
				},
			})),
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Home",
					item: "https://carboncube-ke.com",
				},
				{
					"@type": "ListItem",
					position: 2,
					name: "Categories",
					item: "https://carboncube-ke.com/categories",
				},
				{
					"@type": "ListItem",
					position: 3,
					name: category.name,
					item: `https://carboncube-ke.com/?category=${category.slug}`,
				},
				...(subcategory
					? [
							{
								"@type": "ListItem",
								position: 4,
								name: subcategory.name,
								item: `https://carboncube-ke.com/?category=${category.slug}&subcategory=${subcategory.slug}`,
							},
					  ]
					: []),
			],
		},
		potentialAction: {
			"@type": "SearchAction",
			target: `https://carboncube-ke.com/?category=${category.slug}&q={search_term_string}`,
			"query-input": "required name=search_term_string",
		},
	};

	return {
		title,
		description,
		keywords,
		url: `https://carboncube-ke.com/?category=${category.slug}${
			subcategory ? `&subcategory=${subcategory.slug}` : ""
		}${searchQuery ? `&query=${encodeURIComponent(searchQuery)}` : ""}`,
		type: "website",
		image: category.image_url || "https://carboncube-ke.com/og-image.png",
		imageWidth: 1200,
		imageHeight: 630,
		section: subcategory ? subcategory.name : category.name,
		tags: [
			category.name,
			...(subcategory ? [subcategory.name] : []),
			...(searchQuery ? [searchQuery] : []),
		],
		structuredData,
		customMetaTags: [
			{ name: "category:product_count", content: productCount.toString() },
			{ name: "category:ad_count", content: adCount.toString() },
			{ name: "category:name", content: category.name },
			{ name: "category:slug", content: category.slug },
			...(subcategory
				? [
						{ name: "subcategory:name", content: subcategory.name },
						{ name: "subcategory:slug", content: subcategory.slug },
				  ]
				: []),
			...(searchQuery ? [{ name: "search:query", content: searchQuery }] : []),
			{
				property: "og:category:product_count",
				content: productCount.toString(),
			},
			{ property: "og:category:ad_count", content: adCount.toString() },
			{ property: "og:category:name", content: category.name },
			{ property: "og:category:slug", content: category.slug },
			...(subcategory
				? [
						{ property: "og:subcategory:name", content: subcategory.name },
						{ property: "og:subcategory:slug", content: subcategory.slug },
				  ]
				: []),
			...(searchQuery
				? [{ property: "og:search:query", content: searchQuery }]
				: []),
			{
				property: "article:section",
				content: subcategory ? subcategory.name : category.name,
			},
			{
				property: "article:tag",
				content: [
					category.name,
					...(subcategory ? [subcategory.name] : []),
				].join(", "),
			},
			{ property: "product:category", content: category.name },
			{ property: "product:category:count", content: productCount.toString() },
		],
		conversationalKeywords: [
			`${category.name} Kenya`,
			`${category.name} products Kenya`,
			`${category.name} suppliers Kenya`,
			`${category.name} sellers Kenya`,
			`${category.name} online Kenya`,
			`${category.name} delivery Kenya`,
			`${category.name} prices Kenya`,
			`${category.name} quality Kenya`,
			`${category.name} reviews Kenya`,
			`${category.name} comparison Kenya`,
			`buy ${category.name} online Kenya`,
			`${category.name} marketplace Kenya`,
			`${category.name} wholesale Kenya`,
			`${category.name} retail Kenya`,
			`${category.name} cheap Kenya`,
			`${category.name} best price Kenya`,
			`${category.name} verified sellers Kenya`,
			`${category.name} fast delivery Kenya`,
			`${category.name} secure payment Kenya`,
			`${category.name} mobile money Kenya`,
			...(subcategory
				? [
						`${subcategory.name} Kenya`,
						`${subcategory.name} products Kenya`,
						`${subcategory.name} suppliers Kenya`,
						`${subcategory.name} sellers Kenya`,
				  ]
				: []),
			...(searchQuery
				? [
						`${searchQuery} Kenya`,
						`${searchQuery} ${category.name} Kenya`,
						`buy ${searchQuery} Kenya`,
						`${searchQuery} online Kenya`,
				  ]
				: []),
		],
	};
};

const seoHelpers = {
	generateProductSEO,
	generateShopSEO,
	generateHomeSEO,
	generateCategorySEO,
	generateCategoryPageSEO,
};

export default seoHelpers;
