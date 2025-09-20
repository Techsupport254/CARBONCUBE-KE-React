import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * AuthPageSEO Component - SEO for authentication pages
 * Provides comprehensive SEO metadata for login, signup, and password reset pages
 */
const AuthPageSEO = ({ 
	pageType, 
	title, 
	description, 
	keywords, 
	customConfig = {} 
}) => {
	const siteConfig = {
		name: "Carbon Cube Kenya",
		url: "https://carboncube-ke.com",
		logo: "https://carboncube-ke.com/logo.png",
	};

	// Default SEO data for different auth page types
	const seoData = {
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
		forgotPassword: {
			title: "Reset Your Password | Carbon Cube Kenya Account Recovery",
			description: "Reset your Carbon Cube Kenya account password securely. Recover access to your buyer or seller account on Kenya's trusted online marketplace.",
			keywords: "password reset, account recovery, forgot password, secure recovery, password help, account access"
		}
	};

	// Get SEO data for the page type
	const pageSEO = seoData[pageType] || {
		title: title || "Carbon Cube Kenya | Kenya's Trusted Online Marketplace",
		description: description || "Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.",
		keywords: keywords || "Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce"
	};

	// Enhanced structured data for auth pages
	const authPageStructuredData = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: pageSEO.title,
		description: pageSEO.description,
		url: `${siteConfig.url}/${pageType}`,
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
				name: pageSEO.title.split(' | ')[0],
				item: `${siteConfig.url}/${pageType}`
			}
		]
	};

	return (
		<Helmet>
			{/* Primary Meta Tags */}
			<title>{pageSEO.title}</title>
			<meta name="title" content={pageSEO.title} />
			<meta name="description" content={pageSEO.description} />
			<meta name="keywords" content={pageSEO.keywords} />
			<meta name="author" content="Carbon Cube Kenya Team" />
			<meta name="robots" content="index, follow" />
			<meta name="language" content="English" />
			<meta name="geo.region" content="KE" />
			<meta name="geo.placename" content="Kenya" />
			<meta name="geo.position" content="-1.2921;36.8219" />
			<meta name="ICBM" content="-1.2921, 36.8219" />

			{/* Open Graph Tags */}
			<meta property="og:type" content="website" />
			<meta property="og:url" content={`${siteConfig.url}/${pageType}`} />
			<meta property="og:title" content={pageSEO.title} />
			<meta property="og:description" content={pageSEO.description} />
			<meta property="og:image" content={siteConfig.logo} />
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
			<meta name="twitter:title" content={pageSEO.title} />
			<meta name="twitter:description" content={pageSEO.description} />
			<meta name="twitter:image" content={siteConfig.logo} />
			<meta name="twitter:image:alt" content="Carbon Cube Kenya - Kenya's Trusted Online Marketplace" />

			{/* Canonical URL */}
			<link rel="canonical" href={`${siteConfig.url}/${pageType}`} />

			{/* Structured Data Scripts */}
			<script type="application/ld+json">
				{JSON.stringify(authPageStructuredData)}
			</script>
			<script type="application/ld+json">
				{JSON.stringify(breadcrumbStructuredData)}
			</script>
		</Helmet>
	);
};

export default AuthPageSEO;
