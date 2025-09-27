import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * ProductSEO Component - Optimized SEO for product/ad pages
 * Lightweight and fast meta tag generation for millisecond response times
 */
const ProductSEO = ({ product = {}, customConfig = {}, children }) => {
	const {
		id,
		title,
		description,
		price,
		currency = "KES",
		condition = "new",
		category,
		category_name,
		brand,
		seller,
		seller_enterprise_name,
		images = [],
		location,
		availability = "in stock",
		sku,
		keywords = [],
		tags = [],
	} = product;

	// Fast, optimized title and description generation
	const productTitle = title || "Product Details";
	const productDescription =
		description ||
		`Buy ${productTitle} on Carbon Cube Kenya. Fast delivery across Kenya.`;
	const sellerName = seller_enterprise_name || seller || "Verified Seller";
	const categoryName = category_name || category || "Products";
	const productPrice = price ? `KSh ${parseFloat(price).toLocaleString()}` : "";
	const productLocation = location || "Kenya";

	// Optimized title generation
	const seoTitle = `${productTitle} | ${brand ? brand + " - " : ""}${
		productPrice ? productPrice + " - " : ""
	}Carbon Cube Kenya`;

	// Optimized description generation
	const seoDescription =
		productDescription ||
		`Buy ${productTitle}${brand ? ` by ${brand}` : ""}${
			productPrice ? ` for ${productPrice}` : ""
		} on Carbon Cube Kenya. ${condition} ${categoryName} from verified seller ${sellerName} in ${productLocation}. Fast delivery across Kenya.`;

	// Get primary image with fallback
	const primaryImage = (() => {
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
		productTitle,
		categoryName,
		brand,
		sellerName,
		productLocation,
		// High-performing local search terms
		`${categoryName} near me`,
		`${categoryName} in ${productLocation}`,
		`${categoryName} shop near me`,
		`${categoryName} store in ${productLocation}`,
		`buy ${categoryName} online Kenya`,
		`${categoryName} online store Kenya`,
		// Category-specific terms based on actual categories
		...(categoryName.toLowerCase().includes("automotive")
			? [
					`automotive supplies ${productLocation}`,
					`car parts ${productLocation}`,
					`auto parts shop Kenya`,
					`car accessories online Kenya`,
					`tyres ${productLocation}`,
					`batteries ${productLocation}`,
					`lubricants ${productLocation}`,
			  ]
			: []),
		...(categoryName.toLowerCase().includes("computer")
			? [
					`computer parts ${productLocation}`,
					`computer accessories ${productLocation}`,
					`networking equipment ${productLocation}`,
					`computer hardware ${productLocation}`,
					`IT equipment Kenya`,
			  ]
			: []),
		...(categoryName.toLowerCase().includes("filtration")
			? [
					`filters ${productLocation}`,
					`air filters ${productLocation}`,
					`fuel filters ${productLocation}`,
					`oil filters ${productLocation}`,
					`industrial filters ${productLocation}`,
			  ]
			: []),
		...(categoryName.toLowerCase().includes("hardware")
			? [
					`hardware tools ${productLocation}`,
					`power tools ${productLocation}`,
					`hand tools ${productLocation}`,
					`safety equipment ${productLocation}`,
					`plumbing supplies ${productLocation}`,
			  ]
			: []),
		// Marketplace and trust signals
		"Carbon Cube Kenya",
		"online marketplace Kenya",
		"buy online Kenya",
		"shop online Nairobi",
		"verified seller",
		"fast delivery Kenya",
		"secure online shopping Kenya",
		...keywords.slice(0, 5), // Limit to prevent bloat
		...tags.slice(0, 3),
	]
		.filter(Boolean)
		.join(", ");

	// Lightweight structured data for product
	const productStructuredData = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: productTitle,
		description: seoDescription,
		image: primaryImage,
		...(brand && { brand: { "@type": "Brand", name: brand } }),
		offers: {
			"@type": "Offer",
			price: price,
			priceCurrency: currency,
			availability: `https://schema.org/${
				availability === "in stock" ? "InStock" : "OutOfStock"
			}`,
			itemCondition: `https://schema.org/${
				condition === "new" ? "NewCondition" : "UsedCondition"
			}`,
			seller: { "@type": "Organization", name: sellerName },
		},
		category: categoryName,
		sku: sku || id,
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
			<meta property="og:type" content="product" />
			<meta property="og:title" content={seoTitle} />
			<meta property="og:description" content={seoDescription} />
			<meta property="og:image" content={primaryImage} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:image:alt" content={productTitle} />
			<meta property="og:site_name" content="Carbon Cube Kenya" />
			<meta property="og:url" content={`https://carboncube-ke.com/ads/${id}`} />

			{/* Product-specific Open Graph tags */}
			{price && (
				<meta property="product:price:amount" content={price.toString()} />
			)}
			<meta property="product:price:currency" content={currency} />
			<meta property="product:availability" content={availability} />
			<meta property="product:condition" content={condition} />
			{brand && <meta property="product:brand" content={brand} />}
			<meta property="product:category" content={categoryName} />

			{/* Twitter Card Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={seoTitle} />
			<meta name="twitter:description" content={seoDescription} />
			<meta name="twitter:image" content={primaryImage} />

			{/* Canonical URL */}
			<link rel="canonical" href={`https://carboncube-ke.com/ads/${id}`} />

			{/* Structured Data - Single optimized script */}
			<script type="application/ld+json">
				{JSON.stringify(productStructuredData)}
			</script>

			{children}
		</Helmet>
	);
};

export default ProductSEO;
