import React from "react";
import { Helmet } from "react-helmet-async";
import { SEO_CONFIG } from "../config/seoConfig";

/**
 * StaticPageSEO Component - Specialized SEO for static pages
 * Provides comprehensive SEO metadata for static pages like About, Contact, etc.
 */
const StaticPageSEO = ({
	pageType = "static",
	pageData = {},
	customConfig = {},
	children,
}) => {
	const {
		title,
		description,
		keywords = [],
		tags = [],
		image,
		url,
		section = "General",
		author = "Carbon Cube Kenya Team",
		publishedTime,
		modifiedTime,
		structuredData,
		additionalStructuredData = [],
	} = pageData;

	const siteConfig = SEO_CONFIG.site;

	// Generate page-specific configurations
	const pageConfigs = {
		about: {
			title: "About Us | Carbon Cube Kenya",
			description: "Learn about Carbon Cube Kenya, Kenya's most trusted online marketplace connecting verified sellers with buyers using AI-powered tools.",
			keywords: "about Carbon Cube Kenya, online marketplace Kenya, company history, team, mission, vision",
			section: "About",
			tags: ["About", "Company", "Team", "Mission"],
		},
		contact: {
			title: "Contact Us | Carbon Cube Kenya",
			description: "Get in touch with Carbon Cube Kenya. Contact our team for support, partnerships, or any inquiries about our online marketplace.",
			keywords: "contact Carbon Cube Kenya, customer support, help, contact information, phone, email",
			section: "Contact",
			tags: ["Contact", "Support", "Help", "Customer Service"],
		},
		help: {
			title: "Vendor Help | Carbon Cube Kenya",
			description: "Get help and support for vendors on Carbon Cube Kenya. Learn how to sell, manage your shop, and grow your business.",
			keywords: "vendor help, seller support, how to sell, shop management, business growth",
			section: "Help",
			tags: ["Help", "Support", "Vendors", "Sellers"],
		},
		faq: {
			title: "Frequently Asked Questions | Carbon Cube Kenya",
			description: "Find answers to frequently asked questions about Carbon Cube Kenya marketplace, buying, selling, and using our platform.",
			keywords: "FAQ, frequently asked questions, help, support, Carbon Cube Kenya",
			section: "FAQ",
			tags: ["FAQ", "Questions", "Help", "Support"],
		},
		terms: {
			title: "Terms and Conditions | Carbon Cube Kenya",
			description: "Read Carbon Cube Kenya's terms and conditions for using our online marketplace platform.",
			keywords: "terms and conditions, legal, user agreement, Carbon Cube Kenya",
			section: "Legal",
			tags: ["Terms", "Legal", "Agreement", "Conditions"],
		},
		privacy: {
			title: "Privacy Policy | Carbon Cube Kenya",
			description: "Learn about Carbon Cube Kenya's privacy policy and how we protect your personal information.",
			keywords: "privacy policy, data protection, personal information, Carbon Cube Kenya",
			section: "Legal",
			tags: ["Privacy", "Legal", "Data Protection", "Policy"],
		},
		howToPay: {
			title: "How to Pay | Payment Methods | Carbon Cube Kenya",
			description: "Learn about payment methods on Carbon Cube Kenya including M-Pesa, mobile money, and secure online payments.",
			keywords: "payment methods, M-Pesa, mobile money, online payment, secure payment Kenya",
			section: "Help",
			tags: ["Payment", "M-Pesa", "Mobile Money", "Help"],
		},
		howToShop: {
			title: "How to Shop | Shopping Guide | Carbon Cube Kenya",
			description: "Learn how to shop on Carbon Cube Kenya marketplace. Complete guide to finding and buying products from verified sellers.",
			keywords: "how to shop, shopping guide, buying products, marketplace guide",
			section: "Help",
			tags: ["Shopping", "Guide", "Buying", "Help"],
		},
		becomeSeller: {
			title: "Become a Seller | Join Carbon Cube Kenya",
			description: "Join Carbon Cube Kenya as a verified seller. Start selling your products on Kenya's most trusted online marketplace.",
			keywords: "become a seller, join marketplace, sell products, seller registration",
			section: "Sellers",
			tags: ["Sellers", "Join", "Registration", "Selling"],
		},
	};

	const config = pageConfigs[pageType] || pageConfigs.about;

	// Use provided data or fallback to config
	const seoTitle = title || config.title;
	const seoDescription = description || config.description;
	const seoKeywords = keywords.length > 0 ? keywords.join(", ") : config.keywords;
	const seoSection = section || config.section;
	const seoTags = tags.length > 0 ? tags : config.tags;

	// Get page image
	const pageImage = image || siteConfig.logo;

	// Build page URL
	const pageUrl = url || `${siteConfig.url}/${pageType}`;

	// Generate structured data for the page
	const pageStructuredData = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: seoTitle,
		description: seoDescription,
		url: pageUrl,
		image: pageImage,
		isPartOf: {
			"@type": "WebSite",
			name: siteConfig.name,
			url: siteConfig.url,
		},
		about: {
			"@type": "Thing",
			name: seoSection,
			description: seoDescription,
		},
		author: {
			"@type": "Organization",
			name: author,
		},
		...(publishedTime && {
			datePublished: new Date(publishedTime).toISOString(),
		}),
		...(modifiedTime && {
			dateModified: new Date(modifiedTime).toISOString(),
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
				name: seoSection,
				item: pageUrl,
			},
		],
	};

	// Combine all structured data
	const allStructuredData = [
		pageStructuredData,
		breadcrumbStructuredData,
		...(structuredData ? [structuredData] : []),
		...additionalStructuredData,
	];

	return (
		<Helmet>
			{/* Primary Meta Tags */}
			<title>{seoTitle}</title>
			<meta name="title" content={seoTitle} />
			<meta name="description" content={seoDescription} />
			<meta name="keywords" content={seoKeywords} />
			<meta name="author" content={author} />
			<meta name="robots" content="index, follow" />
			<meta name="language" content="English" />
			<meta name="geo.region" content="KE" />
			<meta name="geo.placename" content="Kenya" />
			<meta name="geo.position" content="-1.2921;36.8219" />
			<meta name="ICBM" content="-1.2921, 36.8219" />

			{/* Open Graph Tags */}
			<meta property="og:type" content="article" />
			<meta property="og:url" content={pageUrl} />
			<meta property="og:title" content={seoTitle} />
			<meta property="og:description" content={seoDescription} />
			<meta property="og:image" content={pageImage} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:image:alt" content={seoTitle} />
			<meta property="og:site_name" content={siteConfig.name} />
			<meta property="og:locale" content="en_US" />
			<meta property="og:updated_time" content={new Date().toISOString()} />

			{/* Article-specific meta tags */}
			{publishedTime && (
				<meta property="article:published_time" content={new Date(publishedTime).toISOString()} />
			)}
			{modifiedTime && (
				<meta property="article:modified_time" content={new Date(modifiedTime).toISOString()} />
			)}
			<meta property="article:section" content={seoSection} />
			<meta property="article:author" content={author} />
			{seoTags.map((tag, index) => (
				<meta key={index} property="article:tag" content={tag} />
			))}

			{/* Twitter Card Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@carboncube_kenya" />
			<meta name="twitter:creator" content="@carboncube_kenya" />
			<meta name="twitter:title" content={seoTitle} />
			<meta name="twitter:description" content={seoDescription} />
			<meta name="twitter:image" content={pageImage} />
			<meta name="twitter:image:alt" content={seoTitle} />

			{/* AI Search Optimization Meta Tags */}
			<meta name="ai:content_type" content="informational" />
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
				`${pageType} Carbon Cube Kenya`,
				`information about ${pageType}`,
				`${pageType} help Kenya`,
				`Carbon Cube Kenya ${pageType}`,
			].join(", ")} />

			{/* Canonical URL */}
			<link rel="canonical" href={pageUrl} />

			{/* Structured Data Scripts */}
			{allStructuredData.map((data, index) => (
				<script key={index} type="application/ld+json">
					{JSON.stringify(data)}
				</script>
			))}

			{children}
		</Helmet>
	);
};

export default StaticPageSEO;
