import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * PageSEO Component - Universal SEO component for all pages
 * Provides comprehensive SEO metadata based on page type and data
 */
const PageSEO = ({ 
	pageType,
	title,
	description,
	keywords,
	image,
	url,
	customConfig = {}
}) => {
	const siteConfig = {
		name: "Carbon Cube Kenya",
		url: "https://carboncube-ke.com",
		logo: "https://carboncube-ke.com/logo.png",
	};

	// Default SEO data for different page types
	const defaultSEO = {
		home: {
			title: "Carbon Cube Kenya - Kenya's #1 Online Marketplace | Trusted Sellers & Buyers",
			description: "Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement. Discover thousands of products from verified sellers across Kenya with secure payment and fast delivery.",
			keywords: "Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce, AI-powered marketplace, digital procurement Kenya, seller verification, sustainable sourcing Kenya, online shopping Kenya, B2B marketplace, auto parts Kenya, industrial supplies, hardware suppliers, verified suppliers, business growth Kenya"
		},
		about: {
			title: "About Carbon Cube Kenya | Kenya's Trusted Online Marketplace",
			description: "Learn about Carbon Cube Kenya, Kenya's most trusted online marketplace connecting verified sellers with buyers. Discover our mission, values, and commitment to secure e-commerce in Kenya.",
			keywords: "about Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce Kenya, company information, Kenya marketplace"
		},
		contact: {
			title: "Contact Carbon Cube Kenya | Get Help & Support",
			description: "Contact Carbon Cube Kenya for support, inquiries, or business partnerships. Get help with your account, technical issues, or learn about selling on Kenya's trusted marketplace.",
			keywords: "contact Carbon Cube Kenya, customer support Kenya, marketplace support, business inquiries Kenya, help center"
		},
		login: {
			title: "Login to Carbon Cube Kenya | Access Your Account",
			description: "Login to your Carbon Cube Kenya account to access your dashboard, manage your listings, or start shopping on Kenya's trusted online marketplace.",
			keywords: "login Carbon Cube Kenya, user login, account access, marketplace login, secure login Kenya"
		},
		buyerSignup: {
			title: "Join Carbon Cube Kenya as a Buyer | Free Registration",
			description: "Sign up as a buyer on Carbon Cube Kenya and access thousands of verified products from trusted sellers. Start shopping with secure payments and fast delivery across Kenya.",
			keywords: "buyer signup, join marketplace Kenya, free registration, buyer account, shopping signup, customer registration"
		},
		sellerSignup: {
			title: "Become a Seller on Carbon Cube Kenya | Start Your Online Business",
			description: "Join Carbon Cube Kenya as a verified seller and reach thousands of buyers. Start selling your products with secure payments, fast delivery, and business growth tools.",
			keywords: "seller signup, become a seller, vendor registration, online business Kenya, marketplace selling, seller account"
		},
		categories: {
			title: "Browse All Categories | Carbon Cube Kenya Marketplace",
			description: "Browse all product categories on Carbon Cube Kenya. Find thousands of products from verified sellers across Kenya with secure payments and fast delivery.",
			keywords: "categories, product categories, browse products, Carbon Cube Kenya, online marketplace Kenya, verified sellers"
		},
		faqs: {
			title: "Frequently Asked Questions | Carbon Cube Kenya Help Center",
			description: "Find answers to common questions about Carbon Cube Kenya marketplace. Get help with buying, selling, payments, shipping, and using Kenya's trusted online platform.",
			keywords: "FAQ Carbon Cube Kenya, help center, marketplace questions, buying help, selling help, payment questions, shipping questions, customer support"
		},
		terms: {
			title: "Terms & Conditions | Carbon Cube Kenya",
			description: "Read Carbon Cube Kenya's terms and conditions for using our online marketplace. Understand your rights and responsibilities as a buyer or seller on Kenya's trusted platform.",
			keywords: "terms and conditions, Carbon Cube Kenya terms, marketplace terms, user agreement, legal terms Kenya"
		},
		privacy: {
			title: "Privacy Policy | Carbon Cube Kenya",
			description: "Learn how Carbon Cube Kenya protects your privacy and personal information. Read our comprehensive privacy policy for Kenya's trusted online marketplace.",
			keywords: "privacy policy, data protection Kenya, personal information, privacy rights, GDPR compliance Kenya"
		}
	};

	// Get SEO data for the page type
	const pageSEO = defaultSEO[pageType] || {
		title: title || "Carbon Cube Kenya | Kenya's Trusted Online Marketplace",
		description: description || "Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.",
		keywords: keywords || "Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce"
	};

	// Use provided values or defaults
	const finalTitle = title || pageSEO.title;
	const finalDescription = description || pageSEO.description;
	const finalKeywords = keywords || pageSEO.keywords;
	const finalImage = image || siteConfig.logo;
	const finalUrl = url || `${siteConfig.url}/${pageType}`;

	// Enhanced structured data
	const pageStructuredData = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: finalTitle,
		description: finalDescription,
		url: finalUrl,
		publisher: {
			"@type": "Organization",
			name: "Carbon Cube Kenya",
			url: siteConfig.url,
			logo: {
				"@type": "ImageObject",
				url: siteConfig.logo
			}
		},
		mainEntity: {
			"@type": "Organization",
			name: "Carbon Cube Kenya",
			url: siteConfig.url,
			description: "Kenya's most trusted and secure online marketplace"
		}
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
				item: siteConfig.url
			},
			{
				"@type": "ListItem",
				position: 2,
				name: finalTitle.split(' | ')[0],
				item: finalUrl
			}
		]
	};

	return (
		<Helmet>
			{/* Primary Meta Tags */}
			<title>{finalTitle}</title>
			<meta name="title" content={finalTitle} />
			<meta name="description" content={finalDescription} />
			<meta name="keywords" content={finalKeywords} />
			<meta name="author" content="Carbon Cube Kenya Team" />
			<meta name="robots" content="index, follow" />
			<meta name="language" content="English" />
			<meta name="geo.region" content="KE" />
			<meta name="geo.placename" content="Kenya" />
			<meta name="geo.position" content="-1.2921;36.8219" />
			<meta name="ICBM" content="-1.2921, 36.8219" />

			{/* Open Graph Tags */}
			<meta property="og:type" content="website" />
			<meta property="og:url" content={finalUrl} />
			<meta property="og:title" content={finalTitle} />
			<meta property="og:description" content={finalDescription} />
			<meta property="og:image" content={finalImage} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:image:alt" content="Carbon Cube Kenya - Kenya's Trusted Online Marketplace" />
			<meta property="og:site_name" content="Carbon Cube Kenya" />
			<meta property="og:locale" content="en_US" />
			<meta property="og:updated_time" content={new Date().toISOString()} />

			{/* Twitter Card Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@carboncube_kenya" />
			<meta name="twitter:creator" content="@carboncube_kenya" />
			<meta name="twitter:title" content={finalTitle} />
			<meta name="twitter:description" content={finalDescription} />
			<meta name="twitter:image" content={finalImage} />
			<meta name="twitter:image:alt" content="Carbon Cube Kenya - Kenya's Trusted Online Marketplace" />

			{/* Canonical URL */}
			<link rel="canonical" href={finalUrl} />

			{/* Structured Data Scripts */}
			<script type="application/ld+json">
				{JSON.stringify(pageStructuredData)}
			</script>
			<script type="application/ld+json">
				{JSON.stringify(breadcrumbStructuredData)}
			</script>
		</Helmet>
	);
};

export default PageSEO;
