import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * ShopSEO Component - Optimized SEO for shop/seller pages
 * Lightweight and fast meta tag generation for millisecond response times
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
		keywords = [],
		tags = [],
	} = shop;

	// Fast, optimized title and description generation
	const shopName = enterprise_name || name || "Shop";
	const productCount = product_count || ads_count || 0;
	const tierName = tier || "Free";
	const shopLocation = location || "Kenya";

	// Optimized title generation
	const seoTitle = `${shopName} - Shop | ${productCount} Products | ${tierName} Tier Seller`;

	// Optimized description generation
	const seoDescription =
		description ||
		`Shop ${shopName} on Carbon Cube Kenya. ${productCount} products available from ${tierName} tier verified seller${
			shopLocation ? ` in ${shopLocation}` : ""
		}. Fast delivery across Kenya.`;

	// Get primary image with optimized fallback
	const primaryImage = (() => {
		if (shop.profile_picture) {
			return shop.profile_picture.startsWith("http")
				? shop.profile_picture
				: `https://carboncube-ke.com${shop.profile_picture}`;
		}
		if (images && images.length > 0) {
			const firstImage = images[0];
			return typeof firstImage === "string"
				? firstImage
				: firstImage.url || firstImage;
		}
		return "https://carboncube-ke.com/og-image.png";
	})();

	// Optimized keywords generation with comprehensive Kenya marketplace SEO terms
	const seoKeywords = [
		shopName,
		"shop",
		"seller",
		shopLocation,
		`${tierName} tier`,
		// High-performing local search terms
		`${shopName} near me`,
		`${shopName} in ${shopLocation}`,
		`shop near me`,
		`store in ${shopLocation}`,
		// Category-specific terms based on shop categories
		...categories
			.slice(0, 3)
			.map((cat) => {
				const catLower = cat.toLowerCase();
				if (catLower.includes("automotive")) {
					return [
						`automotive shop ${shopLocation}`,
						`car parts shop ${shopLocation}`,
						`auto parts store Kenya`,
						`automotive supplies ${shopLocation}`,
						`tyres shop ${shopLocation}`,
						`batteries shop ${shopLocation}`,
					];
				} else if (catLower.includes("computer")) {
					return [
						`computer shop ${shopLocation}`,
						`IT store ${shopLocation}`,
						`computer accessories ${shopLocation}`,
						`networking equipment ${shopLocation}`,
						`computer hardware ${shopLocation}`,
					];
				} else if (catLower.includes("filtration")) {
					return [
						`filters shop ${shopLocation}`,
						`air filters ${shopLocation}`,
						`fuel filters ${shopLocation}`,
						`oil filters ${shopLocation}`,
						`industrial filters ${shopLocation}`,
					];
				} else if (catLower.includes("hardware")) {
					return [
						`hardware shop ${shopLocation}`,
						`tools store ${shopLocation}`,
						`power tools ${shopLocation}`,
						`hand tools ${shopLocation}`,
						`safety equipment ${shopLocation}`,
						`plumbing supplies ${shopLocation}`,
					];
				}
				return [];
			})
			.flat(),
		// Marketplace and trust signals
		"Carbon Cube Kenya",
		"online marketplace Kenya",
		"buy online Kenya",
		"shop online Nairobi",
		"verified seller",
		"fast delivery Kenya",
		"secure online shopping Kenya",
		...keywords.slice(0, 3),
		...tags.slice(0, 2),
	]
		.filter(Boolean)
		.join(", ");

	// Lightweight structured data for shop
	const shopStructuredData = {
		"@context": "https://schema.org",
		"@type": "Store",
		name: shopName,
		description: seoDescription,
		url: `https://carboncube-ke.com/shop/${
			enterprise_name?.toLowerCase().replace(/\s+/g, "-") || "shop"
		}`,
		image: primaryImage,
		address: {
			"@type": "PostalAddress",
			addressLocality: shopLocation,
			addressRegion: "Kenya",
			addressCountry: "KE",
		},
		areaServed: "KE",
		serviceType: "Online Store",
		...(rating && {
			aggregateRating: {
				"@type": "AggregateRating",
				ratingValue: rating,
				reviewCount: reviews_count || 0,
			},
		}),
	};

	return (
		<Helmet>
			{/* Essential Meta Tags - Optimized for speed */}
			<title>{seoTitle}</title>
			<meta name="description" content={seoDescription} />
			<meta name="keywords" content={seoKeywords} />
			<meta name="robots" content="index, follow" />
			<meta name="author" content="Carbon Cube Kenya" />

			{/* Open Graph Tags - Essential only */}
			<meta property="og:type" content="website" />
			<meta property="og:title" content={seoTitle} />
			<meta property="og:description" content={seoDescription} />
			<meta property="og:image" content={primaryImage} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta
				property="og:image:alt"
				content={`${shopName} - Shop on Carbon Cube Kenya`}
			/>
			<meta property="og:site_name" content="Carbon Cube Kenya" />
			<meta
				property="og:url"
				content={`https://carboncube-ke.com/shop/${
					enterprise_name?.toLowerCase().replace(/\s+/g, "-") || "shop"
				}`}
			/>

			{/* Twitter Card Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={seoTitle} />
			<meta name="twitter:description" content={seoDescription} />
			<meta name="twitter:image" content={primaryImage} />

			{/* Canonical URL */}
			<link
				rel="canonical"
				href={`https://carboncube-ke.com/shop/${
					enterprise_name?.toLowerCase().replace(/\s+/g, "-") || "shop"
				}`}
			/>

			{/* Structured Data - Single optimized script */}
			<script type="application/ld+json">
				{JSON.stringify(shopStructuredData)}
			</script>

			{children}
		</Helmet>
	);
};

export default ShopSEO;
