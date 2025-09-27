import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * CategoryPageSEO Component - SEO for category and product listing pages
 * Provides comprehensive SEO metadata for category pages and product listings
 */
const CategoryPageSEO = ({
	pageType = "categories",
	categoryName,
	categoryDescription,
	productCount,
	keywords,
	customConfig = {},
}) => {
	const siteConfig = {
		name: "Carbon Cube Kenya",
		url: "https://carboncube-ke.com",
		logo: "https://carboncube-ke.com/logo.png",
	};

	// Generate dynamic title and description
	const seoTitle = categoryName
		? `${categoryName} Products | ${
				productCount || 0
		  } Items | Carbon Cube Kenya`
		: "Browse All Categories | Carbon Cube Kenya Marketplace";

	const seoDescription =
		categoryDescription ||
		(categoryName
			? `Browse ${
					productCount || 0
			  } ${categoryName} products on Carbon Cube Kenya. Quality ${categoryName} from verified sellers with fast delivery across Kenya.`
			: "Browse all product categories on Carbon Cube Kenya. Find thousands of products from verified sellers across Kenya with secure payments and fast delivery.");

	// Generate comprehensive category-specific keywords
	const generateCategoryKeywords = (categoryName) => {
		if (!categoryName) {
			return [
				"categories, product categories, browse products, Carbon Cube Kenya, online marketplace Kenya, verified sellers, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
			].join(", ");
		}

		const categoryLower = categoryName.toLowerCase();
		const baseKeywords = [
			categoryName,
			`${categoryName} products Kenya`,
			`${categoryName} online Kenya`,
			`${categoryName} near me`,
			`${categoryName} in Nairobi`,
			`${categoryName} shop Kenya`,
			`buy ${categoryName} online Kenya`,
			`${categoryName} online store Kenya`,
			"Carbon Cube Kenya",
			"online marketplace Kenya",
			"verified sellers",
			"secure shopping Kenya",
			"fast delivery Kenya",
		];

		// Add category-specific keywords based on actual categories
		if (categoryLower.includes("automotive")) {
			baseKeywords.push(
				`automotive supplies Kenya`,
				`car parts Kenya`,
				`auto parts shop Kenya`,
				`car accessories Kenya`,
				`tyres Kenya`,
				`batteries Kenya`,
				`lubricants Kenya`
			);
		} else if (categoryLower.includes("computer")) {
			baseKeywords.push(
				`computer parts Kenya`,
				`computer accessories Kenya`,
				`networking equipment Kenya`,
				`computer hardware Kenya`,
				`IT equipment Kenya`
			);
		} else if (categoryLower.includes("filtration")) {
			baseKeywords.push(
				`filters Kenya`,
				`air filters Kenya`,
				`fuel filters Kenya`,
				`oil filters Kenya`,
				`industrial filters Kenya`
			);
		} else if (categoryLower.includes("hardware")) {
			baseKeywords.push(
				`hardware tools Kenya`,
				`power tools Kenya`,
				`hand tools Kenya`,
				`safety equipment Kenya`,
				`plumbing supplies Kenya`
			);
		}

		return baseKeywords.filter(Boolean).join(", ");
	};

	const seoKeywords = keywords || generateCategoryKeywords(categoryName);

	// Enhanced structured data for category pages
	const categoryPageStructuredData = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: seoTitle,
		description: seoDescription,
		url: `${siteConfig.url}/${pageType}${
			categoryName ? `/${categoryName.toLowerCase().replace(/\s+/g, "-")}` : ""
		}`,
		publisher: {
			"@type": "Organization",
			name: "Carbon Cube Kenya",
			url: siteConfig.url,
			logo: {
				"@type": "ImageObject",
				url: siteConfig.logo,
			},
		},
		mainEntity: {
			"@type": "ItemList",
			name: categoryName ? `${categoryName} Products` : "All Categories",
			description: seoDescription,
			numberOfItems: productCount || 0,
			itemListElement: categoryName
				? [
						{
							"@type": "ListItem",
							position: 1,
							name: categoryName,
							item: `${siteConfig.url}/categories/${categoryName
								.toLowerCase()
								.replace(/\s+/g, "-")}`,
						},
				  ]
				: [],
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
				item: siteConfig.url,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Categories",
				item: `${siteConfig.url}/categories`,
			},
			...(categoryName
				? [
						{
							"@type": "ListItem",
							position: 3,
							name: categoryName,
							item: `${siteConfig.url}/categories/${categoryName
								.toLowerCase()
								.replace(/\s+/g, "-")}`,
						},
				  ]
				: []),
		],
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
			<meta name="geo.placename" content="Kenya" />
			<meta name="geo.position" content="-1.2921;36.8219" />
			<meta name="ICBM" content="-1.2921, 36.8219" />

			{/* Open Graph Tags */}
			<meta property="og:type" content="website" />
			<meta
				property="og:url"
				content={`${siteConfig.url}/${pageType}${
					categoryName
						? `/${categoryName.toLowerCase().replace(/\s+/g, "-")}`
						: ""
				}`}
			/>
			<meta property="og:title" content={seoTitle} />
			<meta property="og:description" content={seoDescription} />
			<meta property="og:image" content={siteConfig.logo} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta
				property="og:image:alt"
				content={`${categoryName || "Categories"} - Carbon Cube Kenya`}
			/>
			<meta property="og:site_name" content="Carbon Cube Kenya" />
			<meta property="og:locale" content="en_US" />
			<meta property="og:updated_time" content={new Date().toISOString()} />

			{/* Twitter Card Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@carboncube_kenya" />
			<meta name="twitter:creator" content="@carboncube_kenya" />
			<meta name="twitter:title" content={seoTitle} />
			<meta name="twitter:description" content={seoDescription} />
			<meta name="twitter:image" content={siteConfig.logo} />
			<meta
				name="twitter:image:alt"
				content={`${categoryName || "Categories"} - Carbon Cube Kenya`}
			/>

			{/* Canonical URL */}
			<link
				rel="canonical"
				href={`${siteConfig.url}/${pageType}${
					categoryName
						? `/${categoryName.toLowerCase().replace(/\s+/g, "-")}`
						: ""
				}`}
			/>

			{/* Structured Data Scripts */}
			<script type="application/ld+json">
				{JSON.stringify(categoryPageStructuredData)}
			</script>
			<script type="application/ld+json">
				{JSON.stringify(breadcrumbStructuredData)}
			</script>
		</Helmet>
	);
};

export default CategoryPageSEO;
