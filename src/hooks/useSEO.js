import { Helmet } from "react-helmet-async";

const useSEO = ({
	title,
	description,
	keywords,
	image,
	url,
	type = "website",
	author = "Carbon Cube Kenya Team",
	structuredData = null,
	additionalStructuredData = [],
	alternateLanguages = [],
	customMetaTags = [],
	viewport = "width=device-width, initial-scale=1.0",
	themeColor = "#FFD700",
	imageWidth = null,
	imageHeight = null,
	robots = "index, follow",
	canonical = null,
	sitemap = null,
	preload = [],
	prefetch = [],
	performance = true,
	// AI Search Optimization
	aiSearchOptimized = true,
	contentType = "article",
	expertiseLevel = "expert",
	contentDepth = "comprehensive",
	aiFriendlyFormat = true,
	conversationalKeywords = [],
	aiCitationOptimized = true,
	// Advanced SEO Features
	publishedTime = null,
	modifiedTime = null,
	expirationTime = null,
	section = null,
	tags = [],
	locale = "en_US",
	alternateLocale = [],
	// E-commerce specific
	price = null,
	currency = "KES",
	availability = "in stock",
	condition = "new",
	brand = null,
	category = null,
	sku = null,
	// Performance and Accessibility
	criticalCSS = null,
	preloadFonts = [],
	preloadImages = [],
	// Social Media Optimization
	facebookAppId = null,
	twitterSite = "@carboncube_kenya",
	twitterCreator = "@carboncube_kenya",
	// Advanced Meta Tags
	geoLocation = null,
	contactInfo = null,
	businessHours = null,
	// Schema.org specific
	schemaType = "WebPage",
	organizationInfo = null,
	// Security and Privacy
	referrerPolicy = "strict-origin-when-cross-origin",
	contentSecurityPolicy = null,
}) => {
	const siteName = "Carbon Cube Kenya";
	const fullTitle = title ? `${title} | ${siteName}` : siteName;
	const defaultDescription =
		"Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.";
	const defaultImage = "https://carboncube-ke.com/logo.png";
	const defaultUrl = "https://carboncube-ke.com";

	// Build comprehensive meta tags array
	const metaTags = [
		// Primary meta tags
		{ name: "title", content: fullTitle },
		{ name: "description", content: description || defaultDescription },
		{ name: "keywords", content: keywords },
		{ name: "author", content: author },
		{ name: "robots", content: robots },
		{ name: "language", content: "English" },
		{ name: "geo.region", content: "KE" },
		{ name: "geo.placename", content: "Kenya" },
		{ name: "geo.position", content: "-1.2921;36.8219" },
		{ name: "ICBM", content: "-1.2921, 36.8219" },
		{ name: "viewport", content: viewport },
		{ name: "theme-color", content: themeColor },
		{ name: "msapplication-TileColor", content: themeColor },
		{ name: "msapplication-config", content: "/browserconfig.xml" },
		{ name: "apple-mobile-web-app-capable", content: "yes" },
		{ name: "apple-mobile-web-app-status-bar-style", content: "default" },
		{ name: "apple-mobile-web-app-title", content: siteName },
		{ name: "application-name", content: siteName },
		{ name: "mobile-web-app-capable", content: "yes" },
		{ name: "format-detection", content: "telephone=no" },
		{ name: "referrer", content: referrerPolicy },

		// Open Graph tags
		{ property: "og:type", content: type },
		{ property: "og:url", content: url || defaultUrl },
		{ property: "og:title", content: fullTitle },
		{ property: "og:description", content: description || defaultDescription },
		{ property: "og:image", content: image || defaultImage },
		{ property: "og:site_name", content: siteName },
		{ property: "og:locale", content: locale },
		{
			property: "og:updated_time",
			content: modifiedTime || new Date().toISOString(),
		},

		// Twitter Card tags
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:site", content: twitterSite },
		{ name: "twitter:creator", content: twitterCreator },
		{ name: "twitter:title", content: fullTitle },
		{ name: "twitter:description", content: description || defaultDescription },
		{ name: "twitter:image", content: image || defaultImage },
		{ name: "twitter:image:alt", content: fullTitle },

		// Article specific meta tags
		...(publishedTime
			? [{ property: "article:published_time", content: publishedTime }]
			: []),
		...(modifiedTime
			? [{ property: "article:modified_time", content: modifiedTime }]
			: []),
		...(expirationTime
			? [{ property: "article:expiration_time", content: expirationTime }]
			: []),
		...(section ? [{ property: "article:section", content: section }] : []),
		...(author ? [{ property: "article:author", content: author }] : []),
		...(tags.length
			? tags.map((tag) => ({ property: "article:tag", content: tag }))
			: []),

		// E-commerce specific meta tags
		...(price
			? [{ property: "product:price:amount", content: price.toString() }]
			: []),
		...(price
			? [{ property: "product:price:currency", content: currency }]
			: []),
		...(availability
			? [{ property: "product:availability", content: availability }]
			: []),
		...(condition
			? [{ property: "product:condition", content: condition }]
			: []),
		...(brand ? [{ property: "product:brand", content: brand }] : []),
		...(category ? [{ property: "product:category", content: category }] : []),
		...(sku ? [{ property: "product:sku", content: sku }] : []),

		// Facebook specific
		...(facebookAppId
			? [{ property: "fb:app_id", content: facebookAppId }]
			: []),

		// Geographic and location data
		...(geoLocation
			? [
					{ name: "geo.region", content: geoLocation.region },
					{ name: "geo.placename", content: geoLocation.placename },
					{
						name: "geo.position",
						content: `${geoLocation.latitude};${geoLocation.longitude}`,
					},
					{
						name: "ICBM",
						content: `${geoLocation.latitude}, ${geoLocation.longitude}`,
					},
			  ]
			: []),

		// Contact information
		...(contactInfo
			? [
					{ name: "contact:phone_number", content: contactInfo.phone },
					{ name: "contact:email", content: contactInfo.email },
					{ name: "contact:website", content: contactInfo.website },
			  ]
			: []),
	];

	// Add image dimensions if provided
	if (imageWidth) {
		metaTags.push({
			property: "og:image:width",
			content: imageWidth.toString(),
		});
	}
	if (imageHeight) {
		metaTags.push({
			property: "og:image:height",
			content: imageHeight.toString(),
		});
	}

	// Add alternate locale tags
	if (alternateLocale && alternateLocale.length > 0) {
		alternateLocale.forEach((loc) => {
			metaTags.push({ property: "og:locale:alternate", content: loc });
		});
	}

	// Add AI Search Optimization Meta Tags
	if (aiSearchOptimized) {
		metaTags.push(
			{ name: "ai:content_type", content: contentType },
			{ name: "ai:expertise_level", content: expertiseLevel },
			{ name: "ai:content_depth", content: contentDepth },
			{
				name: "ai:format_optimized",
				content: aiFriendlyFormat ? "true" : "false",
			},
			{
				name: "ai:citation_optimized",
				content: aiCitationOptimized ? "true" : "false",
			},
			{ name: "ai:experience", content: "verified" },
			{ name: "ai:expertise", content: "high" },
			{ name: "ai:authoritativeness", content: "established" },
			{ name: "ai:trustworthiness", content: "verified" },
			{ name: "google:ai_overviews", content: "optimized" },
			{ name: "bing:ai_chat", content: "optimized" },
			{ name: "openai:chatgpt", content: "optimized" },
			{ name: "ai:content_quality", content: "high" },
			{ name: "ai:factual_accuracy", content: "verified" },
			{ name: "ai:source_reliability", content: "high" },
			{ name: "ai:content_freshness", content: "current" },
			{ name: "ai:content_completeness", content: "comprehensive" },
			{ name: "ai:content_relevance", content: "high" },
			{ name: "ai:content_originality", content: "original" },
			{ name: "ai:content_engagement", content: "high" },
			{ name: "ai:content_accessibility", content: "accessible" },
			{ name: "ai:content_mobile_friendly", content: "yes" },
			{ name: "ai:content_page_speed", content: "fast" },
			{ name: "ai:content_security", content: "secure" },
			{ name: "ai:content_privacy", content: "compliant" }
		);

		// Conversational search optimization
		if (conversationalKeywords && conversationalKeywords.length > 0) {
			metaTags.push({
				name: "ai:conversational_keywords",
				content: conversationalKeywords.join(", "),
			});
		}
	}

	// Add custom meta tags
	if (customMetaTags && customMetaTags.length > 0) {
		metaTags.push(...customMetaTags);
	}

	// Build links array
	const links = [];

	// Add canonical URL
	if (canonical || url) {
		links.push({ rel: "canonical", href: canonical || url || defaultUrl });
	}

	// Add sitemap link if provided
	if (sitemap) {
		links.push({ rel: "sitemap", type: "application/xml", href: sitemap });
	}

	// Add alternate language links
	if (alternateLanguages && alternateLanguages.length > 0) {
		alternateLanguages.forEach(({ lang, url: altUrl }) => {
			links.push({ rel: "alternate", hreflang: lang, href: altUrl });
		});
	}

	// Add preload links
	if (preload && preload.length > 0) {
		preload.forEach((resource) => {
			links.push({
				rel: "preload",
				href: resource.url,
				as: resource.as || "script",
			});
		});
	}

	// Add prefetch links
	if (prefetch && prefetch.length > 0) {
		prefetch.forEach((resource) => {
			links.push({ rel: "prefetch", href: resource.url });
		});
	}

	// Add preload fonts
	if (preloadFonts && preloadFonts.length > 0) {
		preloadFonts.forEach((font) => {
			links.push({
				rel: "preload",
				href: font.url,
				as: "font",
				type: font.type || "font/woff2",
				crossOrigin: "anonymous",
			});
		});
	}

	// Add preload images
	if (preloadImages && preloadImages.length > 0) {
		preloadImages.forEach((img) => {
			// Handle both string URLs and objects with url property
			const href = typeof img === "string" ? img : img.url;
			links.push({ rel: "preload", href, as: "image" });
		});
	}

	// Add DNS prefetch for external resources
	const dnsPrefetchDomains = [
		"https://fonts.googleapis.com",
		"https://fonts.gstatic.com",
		"https://www.googletagmanager.com",
		"https://cdn.matomo.cloud",
		"https://res.cloudinary.com",
	];
	dnsPrefetchDomains.forEach((domain) => {
		links.push({ rel: "dns-prefetch", href: domain });
	});

	// Build structured data scripts
	const scripts = [];

	// Default organization structured data
	const defaultOrganizationData = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Carbon Cube Kenya",
		description:
			"Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.",
		url: "https://carboncube-ke.com",
		logo: "https://carboncube-ke.com/logo.png",
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
		numberOfEmployees: {
			"@type": "QuantitativeValue",
			minValue: 2,
			maxValue: 10,
		},
		industry: "Internet Marketplace Platforms",
	};

	// Add default organization data if not provided
	if (
		!structuredData &&
		!additionalStructuredData.some((data) => data["@type"] === "Organization")
	) {
		scripts.push({
			type: "application/ld+json",
			children: JSON.stringify(defaultOrganizationData),
		});
	}

	// Add custom structured data
	if (structuredData) {
		scripts.push({
			type: "application/ld+json",
			children: JSON.stringify(structuredData),
		});
	}

	// Add additional structured data
	if (additionalStructuredData && additionalStructuredData.length > 0) {
		additionalStructuredData.forEach((data) => {
			scripts.push({
				type: "application/ld+json",
				children: JSON.stringify(data),
			});
		});
	}

	// Add WebSite structured data
	const websiteData = {
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
	};

	scripts.push({
		type: "application/ld+json",
		children: JSON.stringify(websiteData),
	});

	return (
		<Helmet>
			<title>{fullTitle}</title>
			{metaTags.map((tag, index) => {
				if (tag.property) {
					return (
						<meta key={index} property={tag.property} content={tag.content} />
					);
				} else {
					return <meta key={index} name={tag.name} content={tag.content} />;
				}
			})}
			{links.map((link, index) => (
				<link key={index} {...link} />
			))}
			{scripts.map((script, index) => (
				<script key={index} {...script} />
			))}
			{criticalCSS && <style>{criticalCSS}</style>}
		</Helmet>
	);
};

export default useSEO;
