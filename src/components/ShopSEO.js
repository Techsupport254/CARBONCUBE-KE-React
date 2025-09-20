import React from "react";
import { Helmet } from "react-helmet-async";
import { SEO_CONFIG } from "../config/seoConfig";

/**
 * ShopSEO Component - Specialized SEO for shop/seller pages
 * Provides comprehensive SEO metadata for individual seller shops
 */
const ShopSEO = ({ shop = {}, customConfig = {}, children }) => {
	const {
		enterprise_name,
		name,
		description,
		location,
		tier,
		product_count,
		ads_count,
		reviews_count,
		rating,
		categories = [],
		images = [],
		created_at,
		updated_at,
		keywords = [],
		tags = [],
	} = shop;

	const siteConfig = SEO_CONFIG.site;
	const shopConfig = SEO_CONFIG.pages.shop;

	// Generate dynamic title and description
	const shopName = enterprise_name || name || "Shop";
	const productCount = product_count || ads_count || 0;
	const tierName = tier || "Free";
	const shopLocation = location || "Kenya";

	// Build comprehensive title
	const seoTitle = shopConfig.titleTemplate
		.replace(/{name}/g, shopName)
		.replace(/{count}/g, productCount.toString())
		.replace(/{tier}/g, tierName);

	// Build comprehensive description
	const seoDescription =
		description ||
		shopConfig.descriptionTemplate
			.replace(/{name}/g, shopName)
			.replace(/{count}/g, productCount.toString())
			.replace(/{tier}/g, tierName)
			.replace(/{location}/g, shopLocation);

	// Get primary image (shop logo, profile picture, or first product image)
	const primaryImage = (() => {
		// First try profile_picture if available
		if (shop.profile_picture) {
			return shop.profile_picture.startsWith("http")
				? shop.profile_picture
				: `https://carboncube-ke.com${shop.profile_picture}`;
		}
		// Then try images array
		if (images && images.length > 0) {
			return images[0].url || images[0];
		}
		// Try to get first product image from ads if available
		if (shop.ads && shop.ads.length > 0) {
			const firstAd = shop.ads[0];
			if (firstAd.images && firstAd.images.length > 0) {
				return firstAd.images[0].url || firstAd.images[0];
			}
		}
		// Fallback to site logo
		return siteConfig.logo;
	})();

	// Build keywords array
	const seoKeywords = [
		shopName,
		"shop",
		"store",
		"seller",
		shopLocation,
		tierName + " tier",
		"Carbon Cube Kenya",
		"online marketplace Kenya",
		"verified seller",
		"B2B marketplace",
		...categories,
		...keywords,
		...tags,
	]
		.filter(Boolean)
		.join(", ");

	// Generate structured data for shop/seller
	const shopStructuredData = {
		"@context": "https://schema.org",
		"@type": "Store",
		name: shopName,
		description: seoDescription,
		url: `${siteConfig.url}/shop/${
			enterprise_name?.toLowerCase().replace(/\s+/g, "-") || "shop"
		}`,
		image: primaryImage,
		telephone: "+254 712 990 524", // Default contact
		email: "info@carboncube-ke.com", // Default contact
		address: {
			"@type": "PostalAddress",
			addressLocality: shopLocation,
			addressRegion: "Kenya",
			addressCountry: "KE",
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
		serviceType: "Online Store",
		...(rating && {
			aggregateRating: {
				"@type": "AggregateRating",
				ratingValue: rating,
				reviewCount: reviews_count || 0,
			},
		}),
		...(created_at && {
			foundingDate: new Date(created_at).toISOString(),
		}),
	};

	// Generate breadcrumb structured data
	const breadcrumbStructuredData = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: siteConfig.url,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Shops",
				item: `${siteConfig.url}/shops`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: shopName,
				item: `${siteConfig.url}/shop/${
					enterprise_name?.toLowerCase().replace(/\s+/g, "-") || "shop"
				}`,
			},
		],
	};

	// Generate collection structured data for shop products
	const collectionStructuredData = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: `${shopName} Products`,
		description: `Browse ${productCount} products from ${shopName}`,
		url: `${siteConfig.url}/shop/${
			enterprise_name?.toLowerCase().replace(/\s+/g, "-") || "shop"
		}`,
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: productCount,
			itemListElement: categories.map((category, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: category,
				item: `${siteConfig.url}/categories/${category.toLowerCase()}`,
			})),
		},
	};

	return (
		<Helmet>
			{/* Primary Meta Tags */}
			<title>{seoTitle}</title>
			<meta name="title" content={seoTitle} />
			<meta name="description" content={seoDescription} />
			<meta name="keywords" content={seoKeywords} />
			<meta name="author" content="Carbon Cube Kenya Team" />
			<meta name="robots" content="index, follow" />
			<meta name="language" content="English" />
			<meta name="geo.region" content="KE" />
			<meta name="geo.placename" content={shopLocation} />
			<meta name="geo.position" content="-1.2921;36.8219" />
			<meta name="ICBM" content="-1.2921, 36.8219" />

			{/* Open Graph Tags */}
			<meta property="og:type" content="website" />
			<meta
				property="og:url"
				content={`${siteConfig.url}/shop/${
					enterprise_name?.toLowerCase().replace(/\s+/g, "-") || "shop"
				}`}
			/>
			<meta property="og:title" content={seoTitle} />
			<meta property="og:description" content={seoDescription} />
			<meta property="og:image" content={primaryImage} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta
				property="og:image:alt"
				content={`${shopName} - Shop on Carbon Cube Kenya`}
			/>
			<meta property="og:image:type" content="image/jpeg" />
			<meta property="og:image:secure_url" content={primaryImage} />
			<meta property="og:site_name" content={siteConfig.name} />
			<meta property="og:locale" content="en_US" />
			<meta property="og:updated_time" content={new Date().toISOString()} />

			{/* Business-specific Open Graph tags */}
			<meta
				property="business:contact_data:street_address"
				content={shopLocation}
			/>
			<meta property="business:contact_data:locality" content={shopLocation} />
			<meta property="business:contact_data:region" content="Kenya" />
			<meta property="business:contact_data:postal_code" content="00100" />
			<meta property="business:contact_data:country_name" content="Kenya" />

			{/* Twitter Card Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@carboncube_kenya" />
			<meta name="twitter:creator" content="@carboncube_kenya" />
			<meta name="twitter:title" content={seoTitle} />
			<meta name="twitter:description" content={seoDescription} />
			<meta name="twitter:image" content={primaryImage} />
			<meta
				name="twitter:image:alt"
				content={`${shopName} - Shop on Carbon Cube Kenya`}
			/>
			<meta name="twitter:image:width" content="1200" />
			<meta name="twitter:image:height" content="630" />

			{/* Article-specific meta tags */}
			{created_at && (
				<meta
					property="article:published_time"
					content={new Date(created_at).toISOString()}
				/>
			)}
			{updated_at && (
				<meta
					property="article:modified_time"
					content={new Date(updated_at).toISOString()}
				/>
			)}
			<meta property="article:section" content="Shops" />
			<meta property="article:author" content={shopName} />
			{tags.map((tag, index) => (
				<meta key={index} property="article:tag" content={tag} />
			))}

			{/* AI Search Optimization Meta Tags */}
			<meta name="ai:content_type" content="business" />
			<meta name="ai:expertise_level" content="expert" />
			<meta name="ai:content_depth" content="comprehensive" />
			<meta name="ai:format_optimized" content="true" />
			<meta name="ai:citation_optimized" content="true" />
			<meta name="ai:experience" content="verified" />
			<meta name="ai:expertise" content="high" />
			<meta name="ai:authoritativeness" content="established" />
			<meta name="ai:trustworthiness" content="verified" />
			<meta name="google:ai_overviews" content="optimized" />
			<meta name="bing:ai_chat" content="optimized" />
			<meta name="openai:chatgpt" content="optimized" />
			<meta name="ai:content_quality" content="high" />
			<meta name="ai:factual_accuracy" content="verified" />
			<meta name="ai:source_reliability" content="high" />
			<meta name="ai:content_freshness" content="current" />
			<meta name="ai:content_completeness" content="comprehensive" />
			<meta name="ai:content_relevance" content="high" />
			<meta name="ai:content_originality" content="original" />
			<meta name="ai:content_engagement" content="high" />
			<meta name="ai:content_accessibility" content="accessible" />
			<meta name="ai:content_mobile_friendly" content="yes" />
			<meta name="ai:content_page_speed" content="fast" />
			<meta name="ai:content_security" content="secure" />
			<meta name="ai:content_privacy" content="compliant" />

			{/* Conversational Keywords */}
			<meta
				name="ai:conversational_keywords"
				content={[
					`${shopName} shop Kenya`,
					`${shopName} products online`,
					`${tierName} tier seller ${shopName}`,
					`${shopName} ${shopLocation}`,
					`verified seller ${shopName}`,
					`${productCount} products ${shopName}`,
					`shop ${shopName} Carbon Cube`,
				].join(", ")}
			/>

			{/* Canonical URL */}
			<link
				rel="canonical"
				href={`${siteConfig.url}/shop/${
					enterprise_name?.toLowerCase().replace(/\s+/g, "-") || "shop"
				}`}
			/>

			{/* Structured Data Scripts */}
			<script type="application/ld+json">
				{JSON.stringify(shopStructuredData)}
			</script>
			<script type="application/ld+json">
				{JSON.stringify(breadcrumbStructuredData)}
			</script>
			<script type="application/ld+json">
				{JSON.stringify(collectionStructuredData)}
			</script>

			{children}
		</Helmet>
	);
};

export default ShopSEO;
