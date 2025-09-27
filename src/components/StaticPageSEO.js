import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * StaticPageSEO Component - SEO for static pages like About, Contact, Terms, etc.
 * Provides comprehensive SEO metadata for static content pages
 */
const StaticPageSEO = ({
	pageType,
	title,
	description,
	keywords,
	customConfig = {},
}) => {
	const siteConfig = {
		name: "Carbon Cube Kenya",
		url: "https://carboncube-ke.com",
		logo: "https://carboncube-ke.com/logo.png",
	};

	// Default SEO data for different page types
	const seoData = {
		about: {
			title: "About Carbon Cube Kenya | Kenya's Trusted Online Marketplace",
			description:
				"Learn about Carbon Cube Kenya, Kenya's most trusted online marketplace connecting verified sellers with buyers. Discover our mission, values, and commitment to secure e-commerce in Kenya.",
			keywords:
				"about Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce Kenya, company information, Kenya marketplace, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		contact: {
			title: "Contact Carbon Cube Kenya | Get Help & Support",
			description:
				"Contact Carbon Cube Kenya for support, inquiries, or business partnerships. Get help with your account, technical issues, or learn about selling on Kenya's trusted marketplace.",
			keywords:
				"contact Carbon Cube Kenya, customer support Kenya, marketplace support, business inquiries Kenya, help center, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		terms: {
			title: "Terms & Conditions | Carbon Cube Kenya",
			description:
				"Read Carbon Cube Kenya's terms and conditions for using our online marketplace. Understand your rights and responsibilities as a buyer or seller on Kenya's trusted platform.",
			keywords:
				"terms and conditions, Carbon Cube Kenya terms, marketplace terms, user agreement, legal terms Kenya, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		privacy: {
			title: "Privacy Policy | Carbon Cube Kenya",
			description:
				"Learn how Carbon Cube Kenya protects your privacy and personal information. Read our comprehensive privacy policy for Kenya's trusted online marketplace.",
			keywords:
				"privacy policy, data protection Kenya, personal information, privacy rights, GDPR compliance Kenya, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		faqs: {
			title: "Frequently Asked Questions | Carbon Cube Kenya Help Center",
			description:
				"Find answers to common questions about Carbon Cube Kenya marketplace. Get help with buying, selling, payments, and using Kenya's trusted online platform.",
			keywords:
				"FAQ Carbon Cube Kenya, help center, marketplace questions, buying help, selling help, payment questions, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		vendorHelp: {
			title: "Vendor Help Center | How to Sell on Carbon Cube Kenya",
			description:
				"Complete guide for vendors and sellers on Carbon Cube Kenya. Learn how to create listings, manage your shop, and grow your business on Kenya's trusted marketplace.",
			keywords:
				"vendor help, seller guide, how to sell online Kenya, marketplace selling, vendor support, seller tips, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		howToPay: {
			title: "How to Pay on Carbon Cube Kenya | Payment Methods Guide",
			description:
				"Learn about payment methods on Carbon Cube Kenya. Complete guide to M-Pesa, mobile money, credit cards, and secure payments on Kenya's trusted marketplace.",
			keywords:
				"payment methods Kenya, M-Pesa payment, mobile money, credit card payment, secure payments, payment guide, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		howToShop: {
			title: "How to Shop on Carbon Cube Kenya | Buyer's Guide",
			description:
				"Complete shopping guide for Carbon Cube Kenya. Learn how to find products, compare prices, make secure purchases, and get the best deals on Kenya's trusted marketplace.",
			keywords:
				"shopping guide, how to buy online Kenya, marketplace shopping, buyer tips, secure shopping, product search, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		becomeSeller: {
			title: "Become a Seller on Carbon Cube Kenya | Start Selling Today",
			description:
				"Join Carbon Cube Kenya as a verified seller. Start your online business, reach thousands of buyers, and grow your sales on Kenya's most trusted marketplace platform.",
			keywords:
				"become a seller, start selling online Kenya, vendor registration, seller signup, online business Kenya, marketplace selling, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		"data-deletion": {
			title: "Data Deletion Request | Carbon Cube Kenya Privacy",
			description:
				"Request data deletion from Carbon Cube Kenya. Learn about your privacy rights and how to delete your account data on Kenya's trusted online marketplace.",
			keywords:
				"data deletion, privacy rights, account deletion, GDPR Kenya, data protection, personal information, Carbon Cube Kenya privacy, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
	};

	// Get SEO data for the page type
	const pageSEO = seoData[pageType] || {
		title: title || "Carbon Cube Kenya | Kenya's Trusted Online Marketplace",
		description:
			description ||
			"Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.",
		keywords:
			keywords ||
			"Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce",
	};

	// Enhanced structured data for static pages
	const staticPageStructuredData = {
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
				url: siteConfig.logo,
			},
		},
		mainEntity: {
			"@type": "Organization",
			name: "Carbon Cube Kenya",
			url: siteConfig.url,
			description: "Kenya's most trusted and secure online marketplace",
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
				name: pageSEO.title.split(" | ")[0],
				item: `${siteConfig.url}/${pageType}`,
			},
		],
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
			<meta
				property="og:image:alt"
				content="Carbon Cube Kenya - Kenya's Trusted Online Marketplace"
			/>
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
			<meta
				name="twitter:image:alt"
				content="Carbon Cube Kenya - Kenya's Trusted Online Marketplace"
			/>

			{/* Canonical URL */}
			<link rel="canonical" href={`${siteConfig.url}/${pageType}`} />

			{/* Structured Data Scripts */}
			<script type="application/ld+json">
				{JSON.stringify(staticPageStructuredData)}
			</script>
			<script type="application/ld+json">
				{JSON.stringify(breadcrumbStructuredData)}
			</script>
		</Helmet>
	);
};

export default StaticPageSEO;
