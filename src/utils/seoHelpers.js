// Dynamic SEO Helper Functions for Carbon Cube Kenya
// Focused on categories, subcategories, and marketplace optimization

// Base configuration
const SITE_CONFIG = {
	name: "Carbon Cube Kenya",
	url: "https://carboncube-ke.com",
	description:
		"Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.",
	logo: "https://carboncube-ke.com/logo.png",
	keywords:
		"Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce, AI-powered marketplace, digital procurement Kenya, seller verification, sustainable sourcing Kenya",
};

// Generate dynamic category SEO
export const generateCategorySEO = (category, subcategories = [], ads = []) => {
	if (!category) return {};

	const categoryName = category.name;
	const subcategoryNames = subcategories.map((sub) => sub.name).join(", ");
	const adCount = ads.length;

	const title = `${categoryName} in Kenya - Buy Online | Carbon Cube Kenya`;
	const description = `Browse ${adCount} ${categoryName.toLowerCase()} products from verified sellers in Kenya. Find ${subcategoryNames} and more on Carbon Cube Kenya's trusted marketplace.`;
	const keywords = `${categoryName}, ${categoryName} Kenya, ${subcategoryNames}, online ${categoryName.toLowerCase()}, Carbon Cube Kenya, verified sellers, Kenya marketplace`;
	const url = `${SITE_CONFIG.url}/categories/${category.id}`;

	// Category structured data
	const categoryStructuredData = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: categoryName,
		description: description,
		url: url,
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: adCount,
			itemListElement: ads.slice(0, 10).map((ad, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Product",
					name: ad.title,
					url: `${SITE_CONFIG.url}/ads/${ad.id}`,
					image: ad.media?.[0],
					offers: {
						"@type": "Offer",
						price: ad.price,
						priceCurrency: "KES",
					},
				},
			})),
		},
	};

	// Breadcrumb structured data
	const breadcrumbStructuredData = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: SITE_CONFIG.url,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Categories",
				item: `${SITE_CONFIG.url}/categories`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: categoryName,
				item: url,
			},
		],
	};

	return {
		title,
		description,
		keywords,
		url,
		type: "website",
		structuredData: categoryStructuredData,
		additionalStructuredData: [breadcrumbStructuredData],
	};
};

// Generate dynamic subcategory SEO
export const generateSubcategorySEO = (subcategory, category, ads = []) => {
	if (!subcategory || !category) return {};

	const subcategoryName = subcategory.name;
	const categoryName = category.name;
	const adCount = ads.length;

	const title = `${subcategoryName} in Kenya - ${categoryName} | Carbon Cube Kenya`;
	const description = `Find ${adCount} ${subcategoryName.toLowerCase()} products in ${categoryName.toLowerCase()} from verified sellers in Kenya. Shop securely on Carbon Cube Kenya's trusted marketplace.`;
	const keywords = `${subcategoryName}, ${subcategoryName} Kenya, ${categoryName}, ${subcategoryName} ${categoryName}, online shopping Kenya, Carbon Cube Kenya, verified sellers`;
	const url = `${SITE_CONFIG.url}/subcategories/${subcategory.id}`;

	// Subcategory structured data
	const subcategoryStructuredData = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: subcategoryName,
		description: description,
		url: url,
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: adCount,
			itemListElement: ads.slice(0, 10).map((ad, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Product",
					name: ad.title,
					url: `${SITE_CONFIG.url}/ads/${ad.id}`,
					image: ad.media?.[0],
					offers: {
						"@type": "Offer",
						price: ad.price,
						priceCurrency: "KES",
					},
				},
			})),
		},
	};

	// Breadcrumb structured data
	const breadcrumbStructuredData = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: SITE_CONFIG.url,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Categories",
				item: `${SITE_CONFIG.url}/categories`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: categoryName,
				item: `${SITE_CONFIG.url}/categories/${category.id}`,
			},
			{
				"@type": "ListItem",
				position: 4,
				name: subcategoryName,
				item: url,
			},
		],
	};

	return {
		title,
		description,
		keywords,
		url,
		type: "website",
		structuredData: subcategoryStructuredData,
		additionalStructuredData: [breadcrumbStructuredData],
	};
};

// Generate home page SEO with dynamic categories
export const generateHomeSEO = (categories = []) => {
	const categoryNames = categories.map((cat) => cat.name).join(", ");
	const totalSubcategories = categories.reduce(
		(total, cat) => total + (cat.subcategories?.length || 0),
		0
	);

	const title = "Kenya's Trusted Digital Marketplace | Carbon Cube Kenya";
	const description = `Browse ${categories.length} categories and ${totalSubcategories} subcategories on Carbon Cube Kenya. Find ${categoryNames} and more from verified sellers in Kenya's most secure online marketplace.`;
	const keywords = `${SITE_CONFIG.keywords}, ${categoryNames}, online shopping Kenya, marketplace categories, verified sellers Kenya`;

	// Website structured data
	const websiteStructuredData = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		url: SITE_CONFIG.url,
		name: SITE_CONFIG.name,
		description: SITE_CONFIG.description,
		potentialAction: {
			"@type": "SearchAction",
			target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
			"query-input": "required name=search_term_string",
		},
	};

	// Organization structured data
	const organizationStructuredData = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: SITE_CONFIG.name,
		description: SITE_CONFIG.description,
		url: SITE_CONFIG.url,
		logo: SITE_CONFIG.logo,
		sameAs: [
			"https://www.linkedin.com/company/carbon-cube-kenya/?viewAsMember=true",
			"https://www.facebook.com/profile.php?id=61574066312678",
			"https://www.instagram.com/carboncube_kenya/",
		],
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "customer service",
			availableLanguage: "English",
			areaServed: "KE",
			telephone: "+254713270764",
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
		numberOfEmployees: "2-10",
		industry: "Internet Marketplace Platforms",
	};

	// Local business structured data
	const localBusinessStructuredData = {
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		name: SITE_CONFIG.name,
		description: SITE_CONFIG.description,
		url: SITE_CONFIG.url,
		telephone: "+254713270764",
		email: "info@carboncube-ke.com",
		image: SITE_CONFIG.logo,
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
		areaServed: {
			"@type": "Country",
			name: "Kenya",
		},
		serviceType: "Online Marketplace",
	};

	return {
		title,
		description,
		keywords,
		url: SITE_CONFIG.url,
		type: "website",
		structuredData: websiteStructuredData,
		additionalStructuredData: [
			organizationStructuredData,
			localBusinessStructuredData,
		],
	};
};

// Generate product SEO
export const generateProductSEO = (ad) => {
	if (!ad) return {};

	// Enhanced title with more context
	const title = `${ad.title} - ${ad.brand || "Product"} | ${
		ad.category_name || "Category"
	} | Carbon Cube Kenya`;

	// Enhanced description with more details
	const description = ad.description
		? `${ad.description.substring(0, 140)}...`
		: `Buy ${ad.title} from verified seller ${
				ad.seller_enterprise_name || ad.seller_name || "on Carbon Cube Kenya"
		  }. ${
				ad.condition === "brand_new" ? "Brand new" : "Quality"
		  } product with secure shopping.`;

	// Enhanced keywords with more relevant terms
	const keywords = [
		ad.title,
		ad.brand,
		ad.manufacturer,
		ad.category_name,
		ad.subcategory_name,
		ad.condition === "brand_new" ? "brand new" : "used",
		"online shopping Kenya",
		"Carbon Cube Kenya",
		"verified seller",
		"secure marketplace",
		"Kenya ecommerce",
	]
		.filter(Boolean)
		.join(", ");

	const image = ad.media_urls?.[0] || ad.first_media_url || SITE_CONFIG.logo;
	const url = `${SITE_CONFIG.url}/ads/${ad.id}`;

	// Enhanced Product structured data
	const productStructuredData = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: ad.title,
		description: ad.description,
		image: ad.media_urls || [image],
		brand: {
			"@type": "Brand",
			name: ad.brand || ad.manufacturer || SITE_CONFIG.name,
		},
		manufacturer: {
			"@type": "Organization",
			name: ad.manufacturer || ad.brand || SITE_CONFIG.name,
		},
		category: ad.category_name,
		additionalProperty: [
			{
				"@type": "PropertyValue",
				name: "Condition",
				value: ad.condition === "brand_new" ? "New" : "Used",
			},
			{
				"@type": "PropertyValue",
				name: "Seller Tier",
				value: ad.seller_tier_name || "Standard",
			},
		],
		offers: {
			"@type": "Offer",
			price: ad.price,
			priceCurrency: "KES",
			priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
				.toISOString()
				.split("T")[0],
			availability:
				ad.quantity > 0
					? "https://schema.org/InStock"
					: "https://schema.org/OutOfStock",
			seller: {
				"@type": "Organization",
				name: ad.seller_enterprise_name || ad.seller_name || SITE_CONFIG.name,
				url: `${SITE_CONFIG.url}/seller/${ad.seller_id}`,
			},
			url: url,
			itemCondition:
				ad.condition === "brand_new"
					? "https://schema.org/NewCondition"
					: "https://schema.org/UsedCondition",
		},
		aggregateRating:
			ad.rating || ad.mean_rating || ad.average_rating
				? {
						"@type": "AggregateRating",
						ratingValue: ad.rating || ad.mean_rating || ad.average_rating,
						reviewCount:
							ad.review_count || ad.reviews_count || ad.total_reviews || 0,
						bestRating: 5,
						worstRating: 1,
				  }
				: undefined,
		url: url,
	};

	// Enhanced Breadcrumb structured data with better URL handling
	const breadcrumbStructuredData = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: SITE_CONFIG.url,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: ad.category_name || "Categories",
				item: ad.category_id
					? `${SITE_CONFIG.url}/categories/${ad.category_id}`
					: `${SITE_CONFIG.url}/categories`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: ad.subcategory_name || ad.category_name || "Products",
				item: ad.subcategory_id
					? `${SITE_CONFIG.url}/subcategories/${ad.subcategory_id}`
					: ad.category_id
					? `${SITE_CONFIG.url}/categories/${ad.category_id}`
					: url,
			},
			{
				"@type": "ListItem",
				position: 4,
				name: ad.title,
				item: url,
			},
		],
	};

	return {
		title,
		description,
		keywords,
		image,
		url,
		type: "product",
		structuredData: productStructuredData,
		additionalStructuredData: [breadcrumbStructuredData],
		// Additional SEO data for better categorization
		category: ad.category_name,
		subcategory: ad.subcategory_name,
		brand: ad.brand,
		manufacturer: ad.manufacturer,
		condition: ad.condition,
		price: ad.price,
		currency: "KES",
		availability: ad.quantity > 0 ? "in stock" : "out of stock",
	};
};

// Generate search results SEO
export const generateSearchResultsSEO = (
	searchQuery,
	results = [],
	category = null,
	subcategory = null
) => {
	const categoryName = category?.name || "";
	const subcategoryName = subcategory?.name || "";
	const resultCount = results.length;

	let title, description, keywords;

	if (category && subcategory) {
		title = `${subcategoryName} in ${categoryName} - Search Results | Carbon Cube Kenya`;
		description = `Find ${resultCount} ${subcategoryName.toLowerCase()} products in ${categoryName.toLowerCase()} for "${searchQuery}" on Carbon Cube Kenya. Browse from verified sellers in Kenya.`;
		keywords = `${searchQuery}, ${subcategoryName}, ${categoryName}, ${subcategoryName} ${categoryName}, search results, Carbon Cube Kenya`;
	} else if (category) {
		title = `${categoryName} - Search Results for "${searchQuery}" | Carbon Cube Kenya`;
		description = `Find ${resultCount} ${categoryName.toLowerCase()} products for "${searchQuery}" on Carbon Cube Kenya. Browse from verified sellers in Kenya.`;
		keywords = `${searchQuery}, ${categoryName}, ${categoryName} Kenya, search results, Carbon Cube Kenya`;
	} else {
		title = `Search Results for "${searchQuery}" - Carbon Cube Kenya`;
		description = `Find ${resultCount} results for "${searchQuery}" on Carbon Cube Kenya. Browse products from verified sellers in Kenya.`;
		keywords = `${searchQuery}, search results, Carbon Cube Kenya, Kenya marketplace, online shopping`;
	}

	const url = `${SITE_CONFIG.url}/search?q=${encodeURIComponent(searchQuery)}`;

	// Search results structured data
	const searchResultsStructuredData = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: `Search Results for "${searchQuery}"`,
		description: description,
		numberOfItems: resultCount,
		itemListElement: results.slice(0, 10).map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "Product",
				name: item.title,
				url: `${SITE_CONFIG.url}/ads/${item.id}`,
				image: item.media?.[0],
				offers: {
					"@type": "Offer",
					price: item.price,
					priceCurrency: "KES",
				},
			},
		})),
	};

	return {
		title,
		description,
		keywords,
		url,
		type: "website",
		structuredData: searchResultsStructuredData,
	};
};

// Generate categories listing page SEO
export const generateCategoriesListingSEO = (categories = []) => {
	const categoryNames = categories.map((cat) => cat.name).join(", ");
	const totalSubcategories = categories.reduce(
		(total, cat) => total + (cat.subcategories?.length || 0),
		0
	);

	const title = "Product Categories - Browse by Category | Carbon Cube Kenya";
	const description = `Browse ${categories.length} categories and ${totalSubcategories} subcategories on Carbon Cube Kenya. Find ${categoryNames} and more from verified sellers in Kenya.`;
	const keywords = `product categories, ${categoryNames}, browse by category, Kenya marketplace categories, online shopping categories, Carbon Cube Kenya`;

	const url = `${SITE_CONFIG.url}/categories`;

	// Categories listing structured data
	const categoriesListingStructuredData = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: "Product Categories",
		description: description,
		url: url,
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: categories.length,
			itemListElement: categories.map((category, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "CollectionPage",
					name: category.name,
					url: `${SITE_CONFIG.url}/categories/${category.id}`,
					description: `Browse ${category.name} products from verified sellers on Carbon Cube Kenya`,
				},
			})),
		},
	};

	// Breadcrumb structured data
	const breadcrumbStructuredData = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: SITE_CONFIG.url,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Categories",
				item: url,
			},
		],
	};

	return {
		title,
		description,
		keywords,
		url,
		type: "website",
		structuredData: categoriesListingStructuredData,
		additionalStructuredData: [breadcrumbStructuredData],
	};
};

// Generate about page SEO
export const generateAboutPageSEO = () => {
	const title = "About Carbon Cube Kenya - Kenya's Trusted Digital Marketplace";
	const description =
		"Learn about Carbon Cube Kenya, Kenya's most trusted and secure online marketplace. Discover how we connect verified sellers with buyers using AI-powered tools and seamless digital procurement.";
	const keywords =
		"about Carbon Cube Kenya, Kenya marketplace, digital procurement, verified sellers, company information, Kenya ecommerce, online marketplace Kenya";
	const url = `${SITE_CONFIG.url}/about-us`;

	// About page structured data
	const aboutPageStructuredData = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: "About Carbon Cube Kenya",
		description: description,
		url: url,
		mainEntity: {
			"@type": "Organization",
			name: SITE_CONFIG.name,
			description: SITE_CONFIG.description,
			url: SITE_CONFIG.url,
			logo: SITE_CONFIG.logo,
			foundingDate: "2024",
			address: {
				"@type": "PostalAddress",
				streetAddress: "9th Floor, CMS Africa, Kilimani",
				addressLocality: "Nairobi",
				addressRegion: "Nairobi",
				addressCountry: "KE",
				postalCode: "00100",
			},
		},
	};

	return {
		title,
		description,
		keywords,
		url,
		type: "website",
		structuredData: aboutPageStructuredData,
	};
};

// Generate contact page SEO
export const generateContactPageSEO = () => {
	const title = "Contact Carbon Cube Kenya - Customer Support";
	const description =
		"Get in touch with Carbon Cube Kenya's customer support team. We're here to help with your online marketplace questions, seller verification, and digital procurement needs in Kenya.";
	const keywords =
		"contact Carbon Cube Kenya, customer support, Kenya marketplace support, help desk, contact information, Kenya ecommerce support";
	const url = `${SITE_CONFIG.url}/contact-us`;

	// Contact page structured data
	const contactPageStructuredData = {
		"@context": "https://schema.org",
		"@type": "ContactPage",
		name: "Contact Carbon Cube Kenya",
		description: description,
		url: url,
		mainEntity: {
			"@type": "Organization",
			name: SITE_CONFIG.name,
			contactPoint: {
				"@type": "ContactPoint",
				contactType: "customer service",
				availableLanguage: "English",
				areaServed: "KE",
				telephone: "+254713270764",
				email: "info@carboncube-ke.com",
			},
		},
	};

	return {
		title,
		description,
		keywords,
		url,
		type: "website",
		structuredData: contactPageStructuredData,
	};
};

// Generate signup page SEO
export const generateSignupPageSEO = (type = "buyer") => {
	const isBuyer = type === "buyer";
	const title = isBuyer
		? "Join Carbon Cube Kenya - Buyer Registration"
		: "Become a Seller - Carbon Cube Kenya Registration";
	const description = isBuyer
		? "Join Carbon Cube Kenya as a buyer and start shopping from verified sellers. Create your account today and enjoy secure online shopping in Kenya's most trusted marketplace."
		: "Become a verified seller on Carbon Cube Kenya. Register your business and start selling to customers across Kenya with our secure marketplace platform.";
	const keywords = isBuyer
		? "buyer signup, join Carbon Cube Kenya, create account, Kenya online shopping, marketplace registration, buyer registration"
		: "seller signup, become a seller, Carbon Cube Kenya seller registration, Kenya marketplace seller, online selling, seller registration";
	const url = `${SITE_CONFIG.url}/${type}-signup`;

	// Signup page structured data
	const signupPageStructuredData = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: title,
		description: description,
		url: url,
		mainEntity: {
			"@type": "Organization",
			name: SITE_CONFIG.name,
			url: SITE_CONFIG.url,
		},
	};

	return {
		title,
		description,
		keywords,
		url,
		type: "website",
		structuredData: signupPageStructuredData,
	};
};

// Generate FAQ page SEO
export const generateFAQPageSEO = () => {
	const title = "FAQ - Frequently Asked Questions | Carbon Cube Kenya";
	const description =
		"Find answers to frequently asked questions about Carbon Cube Kenya. Learn about our marketplace, seller verification, buyer protection, and digital procurement services in Kenya.";
	const keywords =
		"FAQ, frequently asked questions, Carbon Cube Kenya help, Kenya marketplace FAQ, customer support, marketplace help";
	const url = `${SITE_CONFIG.url}/faq`;

	// FAQ page structured data
	const faqPageStructuredData = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		name: "Carbon Cube Kenya FAQ",
		description: description,
		url: url,
		mainEntity: {
			"@type": "Organization",
			name: SITE_CONFIG.name,
			url: SITE_CONFIG.url,
		},
	};

	return {
		title,
		description,
		keywords,
		url,
		type: "website",
		structuredData: faqPageStructuredData,
	};
};

// Generate terms page SEO
export const generateTermsPageSEO = () => {
	const title = "Terms and Conditions | Carbon Cube Kenya";
	const description =
		"Read Carbon Cube Kenya's terms and conditions. Understand our marketplace rules, user agreements, and platform policies for buyers and sellers in Kenya.";
	const keywords =
		"terms and conditions, Carbon Cube Kenya legal, Kenya marketplace terms, user agreement, platform terms, marketplace policies";
	const url = `${SITE_CONFIG.url}/terms-and-conditions`;

	// Terms page structured data
	const termsPageStructuredData = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Terms and Conditions",
		description: description,
		url: url,
		mainEntity: {
			"@type": "Organization",
			name: SITE_CONFIG.name,
			url: SITE_CONFIG.url,
		},
	};

	return {
		title,
		description,
		keywords,
		url,
		type: "website",
		structuredData: termsPageStructuredData,
	};
};

// Generate privacy policy page SEO
export const generatePrivacyPolicySEO = () => {
	const title = "Privacy Policy | Carbon Cube Kenya";
	const description =
		"Learn about Carbon Cube Kenya's privacy policy and data protection practices. Understand how we protect your personal information and comply with data protection regulations in Kenya.";
	const keywords =
		"privacy policy, Carbon Cube Kenya data protection, Kenya marketplace privacy, user data protection, GDPR compliance, data privacy";
	const url = `${SITE_CONFIG.url}/privacy-policy`;

	// Privacy policy page structured data
	const privacyPageStructuredData = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Privacy Policy",
		description: description,
		url: url,
		mainEntity: {
			"@type": "Organization",
			name: SITE_CONFIG.name,
			url: SITE_CONFIG.url,
		},
	};

	return {
		title,
		description,
		keywords,
		url,
		type: "website",
		structuredData: privacyPageStructuredData,
	};
};
