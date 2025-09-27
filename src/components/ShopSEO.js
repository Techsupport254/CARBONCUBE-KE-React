import React from "react";
import { Helmet } from "react-helmet-async";
import { cleanUrl } from "../utils/seoUtils";

/**
 * ShopSEO Component - Optimized SEO for shop/seller pages
 * Lightweight and fast meta tag generation for millisecond response times
 */
const ShopSEO = ({ shop = {}, customConfig = {}, children }) => {
	const {
		enterprise_name,
		name,
		description,
		city,
		county,
		sub_county,
		tier,
		product_count,
		ads_count,
		average_rating,
		total_reviews,
		categories = [],
		images = [],
		keywords = [],
		tags = [],
	} = shop;

	// Fast, optimized title and description generation
	const shopName = enterprise_name || name || "Shop";
	const productCount = product_count || ads_count || 0;
	const tierName = tier || "Free";
	const shopLocation =
		[city, sub_county, county].filter(Boolean).join(", ") || "Kenya";

	// Enhanced title generation for browser tab
	const seoTitle = (() => {
		// Start with shop name and key info
		let title = `${shopName} - Shop | ${productCount} Products | ${tierName} Tier`;

		// Add location if available and not just "Kenya"
		if (shopLocation && shopLocation !== "Kenya") {
			title += ` | ${shopLocation}`;
		}

		// Add rating if available
		if (average_rating && average_rating > 0) {
			title += ` | ${average_rating}/5★`;
		}

		// Add key words from description if available (first 2-3 meaningful words)
		if (description && description.trim()) {
			const descWords = description
				.split(" ")
				.filter((word) => word.length > 3)
				.slice(0, 2)
				.join(" ");
			if (descWords) {
				title += ` | ${descWords}`;
			}
		}

		// Add brand
		title += ` | Carbon Cube Kenya`;

		// Ensure title doesn't exceed 60 characters for optimal display
		return title.length > 60 ? title.substring(0, 57) + "..." : title;
	})();

	// Optimized description generation
	const ratingText =
		average_rating && average_rating > 0
			? ` Rated ${average_rating}/5 stars`
			: "";
	const reviewsText =
		total_reviews && total_reviews > 0 ? ` with ${total_reviews} reviews` : "";
	const locationText =
		shopLocation && shopLocation !== "Kenya" ? ` in ${shopLocation}` : "";

	// Enhanced description that incorporates shop description
	const seoDescription = (() => {
		if (description && description.trim()) {
			// If shop has a description, use it as the base and add SEO elements
			const truncatedDescription =
				description.length > 120
					? description.substring(0, 120) + "..."
					: description;
			return `${truncatedDescription} Shop ${shopName} on Carbon Cube Kenya. ${productCount} products available from ${tierName} tier verified seller${locationText}.${ratingText}${reviewsText} Fast delivery across Kenya.`;
		} else {
			// Fallback description if no shop description
			return `Shop ${shopName} on Carbon Cube Kenya. ${productCount} products available from ${tierName} tier verified seller${locationText}.${ratingText}${reviewsText} Fast delivery across Kenya.`;
		}
	})();

	// Get primary image with optimized fallback
	const primaryImage = (() => {
		if (shop.profile_picture) {
			return shop.profile_picture.startsWith("http")
				? shop.profile_picture
				: `https://carboncube-ke.com${shop.profile_picture}`;
		}
		if (Array.isArray(images) && images.length > 0) {
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
		// Include shop description keywords if available
		...(description
			? description
					.split(" ")
					.slice(0, 5)
					.filter((word) => word.length > 3)
			: []),
		// High-performing local search terms
		`${shopName} near me`,
		`${shopName} in ${shopLocation}`,
		`shop near me`,
		`store in ${shopLocation}`,
		// Category-specific terms based on shop categories
		...(Array.isArray(categories)
			? categories
					.slice(0, 3)
					.map((cat) => {
						const catLower = typeof cat === "string" ? cat.toLowerCase() : "";
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
					.flat()
			: []),
		// Marketplace and trust signals
		"Carbon Cube Kenya",
		"online marketplace Kenya",
		"buy online Kenya",
		"shop online Nairobi",
		"verified seller",
		"fast delivery Kenya",
		"secure online shopping Kenya",
		...(Array.isArray(keywords) ? keywords.slice(0, 3) : []),
		...(Array.isArray(tags) ? tags.slice(0, 2) : []),
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
		...(average_rating &&
			average_rating > 0 && {
				aggregateRating: {
					"@type": "AggregateRating",
					ratingValue: average_rating,
					reviewCount: total_reviews || 0,
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
			{description && <meta name="shop:description" content={description} />}

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
				href={cleanUrl(
					`https://carboncube-ke.com/shop/${
						enterprise_name?.toLowerCase().replace(/\s+/g, "-") || "shop"
					}`
				)}
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
