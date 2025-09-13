import React from "react";
import { Helmet } from "react-helmet-async";
import { SEO_CONFIG } from "../config/seoConfig";

/**
 * CategorySEO Component - Specialized SEO for category pages
 * Provides comprehensive SEO metadata for product category pages
 */
const CategorySEO = ({
	category = {},
	customConfig = {},
	children,
}) => {
	const {
		id,
		name,
		description,
		ad_count,
		product_count,
		subcategories = [],
		popular_products = [],
		location = "Kenya",
		keywords = [],
		tags = [],
		created_at,
		updated_at,
	} = category;

	const siteConfig = SEO_CONFIG.site;
	const categoryConfig = SEO_CONFIG.pages.category;

	// Generate dynamic title and description
	const categoryName = name || "Category";
	const productCount = ad_count || product_count || 0;
	const subcategoryNames = subcategories.map(sub => sub.name || sub).join(", ");

	// Build comprehensive title
	const seoTitle = categoryConfig.titleTemplate
		.replace(/{name}/g, categoryName)
		.replace(/{count}/g, productCount.toString());

	// Build comprehensive description
	const seoDescription = categoryConfig.descriptionTemplate
		.replace(/{name}/g, categoryName)
		.replace(/{count}/g, productCount.toString())
		.replace(/{subcategories}/g, subcategoryNames);

	// Get category image (first product image or default)
	const categoryImage = popular_products && popular_products.length > 0 
		? popular_products[0].images?.[0]?.url || popular_products[0].image
		: siteConfig.logo;

	// Build keywords array
	const seoKeywords = [
		categoryName,
		"products",
		"category",
		location,
		"Carbon Cube Kenya",
		"online marketplace Kenya",
		"verified sellers",
		"B2B marketplace",
		"industrial supplies",
		"business supplies",
		...subcategories.map(sub => sub.name || sub),
		...keywords,
		...tags,
	].filter(Boolean).join(", ");

	// Generate structured data for category page
	const categoryStructuredData = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: `${categoryName} Products`,
		description: seoDescription,
		url: `${siteConfig.url}/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
		image: categoryImage,
		mainEntity: {
			"@type": "ItemList",
			name: `${categoryName} Products`,
			description: `Browse ${productCount} ${categoryName} products`,
			numberOfItems: productCount,
			itemListElement: popular_products.slice(0, 10).map((product, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: product.title || product.name,
				url: `${siteConfig.url}/ads/${product.id}`,
				image: product.images?.[0]?.url || product.image,
			})),
		},
		breadcrumb: {
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
					name: "Categories",
					item: `${siteConfig.url}/categories`,
				},
				{
					"@type": "ListItem",
					position: 3,
					name: categoryName,
					item: `${siteConfig.url}/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
				},
			],
		},
		...(created_at && {
			dateCreated: new Date(created_at).toISOString(),
		}),
		...(updated_at && {
			dateModified: new Date(updated_at).toISOString(),
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
				name: "Categories",
				item: `${siteConfig.url}/categories`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: categoryName,
				item: `${siteConfig.url}/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
			},
		],
	};

	// Generate WebPage structured data
	const webpageStructuredData = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: seoTitle,
		description: seoDescription,
		url: `${siteConfig.url}/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
		image: categoryImage,
		isPartOf: {
			"@type": "WebSite",
			name: siteConfig.name,
			url: siteConfig.url,
		},
		about: {
			"@type": "Thing",
			name: categoryName,
			description: `Products and services in the ${categoryName} category`,
		},
		mainEntity: {
			"@type": "ItemList",
			name: `${categoryName} Products`,
			numberOfItems: productCount,
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
			<meta name="geo.placename" content={location} />
			<meta name="geo.position" content="-1.2921;36.8219" />
			<meta name="ICBM" content="-1.2921, 36.8219" />

			{/* Open Graph Tags */}
			<meta property="og:type" content="website" />
			<meta property="og:url" content={`${siteConfig.url}/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}`} />
			<meta property="og:title" content={seoTitle} />
			<meta property="og:description" content={seoDescription} />
			<meta property="og:image" content={categoryImage} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:image:alt" content={categoryName} />
			<meta property="og:site_name" content={siteConfig.name} />
			<meta property="og:locale" content="en_US" />
			<meta property="og:updated_time" content={new Date().toISOString()} />

			{/* Twitter Card Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@carboncube_kenya" />
			<meta name="twitter:creator" content="@carboncube_kenya" />
			<meta name="twitter:title" content={seoTitle} />
			<meta name="twitter:description" content={seoDescription} />
			<meta name="twitter:image" content={categoryImage} />
			<meta name="twitter:image:alt" content={categoryName} />

			{/* Article-specific meta tags */}
			{created_at && (
				<meta property="article:published_time" content={new Date(created_at).toISOString()} />
			)}
			{updated_at && (
				<meta property="article:modified_time" content={new Date(updated_at).toISOString()} />
			)}
			<meta property="article:section" content="Categories" />
			<meta property="article:author" content="Carbon Cube Kenya" />
			{tags.map((tag, index) => (
				<meta key={index} property="article:tag" content={tag} />
			))}

			{/* AI Search Optimization Meta Tags */}
			<meta name="ai:content_type" content="category" />
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
			<meta name="ai:conversational_keywords" content={[
				`${categoryName} products Kenya`,
				`where to buy ${categoryName} Kenya`,
				`${categoryName} online Kenya`,
				`best ${categoryName} suppliers Kenya`,
				`${categoryName} marketplace Kenya`,
				`verified ${categoryName} sellers`,
				`${productCount} ${categoryName} products`,
			].join(", ")} />

			{/* Canonical URL */}
			<link rel="canonical" href={`${siteConfig.url}/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}`} />

			{/* Structured Data Scripts */}
			<script type="application/ld+json">
				{JSON.stringify(categoryStructuredData)}
			</script>
			<script type="application/ld+json">
				{JSON.stringify(breadcrumbStructuredData)}
			</script>
			<script type="application/ld+json">
				{JSON.stringify(webpageStructuredData)}
			</script>

			{children}
		</Helmet>
	);
};

export default CategorySEO;
