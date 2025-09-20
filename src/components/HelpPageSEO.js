import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * HelpPageSEO Component - SEO for help and guide pages
 * Provides comprehensive SEO metadata for help, FAQ, and guide pages
 */
const HelpPageSEO = ({ 
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

	// Default SEO data for different help page types
	const seoData = {
		faqs: {
			title: "Frequently Asked Questions | Carbon Cube Kenya Help Center",
			description: "Find answers to common questions about Carbon Cube Kenya marketplace. Get help with buying, selling, payments, shipping, and using Kenya's trusted online platform.",
			keywords: "FAQ Carbon Cube Kenya, help center, marketplace questions, buying help, selling help, payment questions, shipping questions, customer support"
		},
		vendorHelp: {
			title: "Vendor Help Center | How to Sell on Carbon Cube Kenya",
			description: "Complete guide for vendors and sellers on Carbon Cube Kenya. Learn how to create listings, manage your shop, optimize sales, and grow your business on Kenya's trusted marketplace.",
			keywords: "vendor help, seller guide, how to sell online Kenya, marketplace selling, vendor support, seller tips, business growth, online selling guide"
		},
		howToPay: {
			title: "How to Pay on Carbon Cube Kenya | Complete Payment Guide",
			description: "Learn about all payment methods on Carbon Cube Kenya including M-Pesa, mobile money, credit cards, and bank transfers. Secure payment guide for Kenya's trusted marketplace.",
			keywords: "payment methods Kenya, M-Pesa payment, mobile money, credit card payment, bank transfer, secure payments, payment guide, online payments Kenya"
		},
		howToShop: {
			title: "How to Shop on Carbon Cube Kenya | Complete Buyer's Guide",
			description: "Complete shopping guide for Carbon Cube Kenya. Learn how to find products, compare prices, make secure purchases, track orders, and get the best deals on Kenya's trusted marketplace.",
			keywords: "shopping guide, how to buy online Kenya, marketplace shopping, buyer tips, secure shopping, product search, order tracking, shopping tips"
		},
		becomeSeller: {
			title: "Become a Seller on Carbon Cube Kenya | Complete Seller's Guide",
			description: "Join Carbon Cube Kenya as a verified seller and start your online business. Complete guide to registration, listing products, managing orders, and growing your sales on Kenya's trusted marketplace.",
			keywords: "become a seller, start selling online Kenya, vendor registration, seller signup, online business Kenya, marketplace selling, seller guide, business setup"
		}
	};

	// Get SEO data for the page type
	const pageSEO = seoData[pageType] || {
		title: title || "Help Center | Carbon Cube Kenya",
		description: description || "Get help and support for using Carbon Cube Kenya marketplace. Find guides, FAQs, and tips for buying and selling on Kenya's trusted online platform.",
		keywords: keywords || "help center, Carbon Cube Kenya support, marketplace help, buying help, selling help, customer support"
	};

	// Enhanced structured data for help pages
	const helpPageStructuredData = {
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

	// FAQ structured data for FAQ pages
	const faqStructuredData = pageType === 'faqs' ? {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: [
			{
				"@type": "Question",
				name: "How do I create an account on Carbon Cube Kenya?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "You can create an account by clicking the 'Sign Up' button and choosing either 'Buyer' or 'Seller' registration. Fill in your details and verify your email to get started."
				}
			},
			{
				"@type": "Question",
				name: "What payment methods are accepted?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "We accept M-Pesa, mobile money, credit cards, and bank transfers. All payments are processed securely through our trusted payment partners."
				}
			},
			{
				"@type": "Question",
				name: "How do I track my order?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "You can track your order through your account dashboard or by using the tracking number provided by the seller. You'll receive updates via SMS and email."
				}
			}
		]
	} : null;

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
				name: "Help Center",
				item: `${siteConfig.url}/help`
			},
			{
				"@type": "ListItem",
				position: 3,
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
			<meta property="og:image:alt" content="Carbon Cube Kenya Help Center" />
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
			<meta name="twitter:image:alt" content="Carbon Cube Kenya Help Center" />

			{/* Canonical URL */}
			<link rel="canonical" href={`${siteConfig.url}/${pageType}`} />

			{/* Structured Data Scripts */}
			<script type="application/ld+json">
				{JSON.stringify(helpPageStructuredData)}
			</script>
			{faqStructuredData && (
				<script type="application/ld+json">
					{JSON.stringify(faqStructuredData)}
				</script>
			)}
			<script type="application/ld+json">
				{JSON.stringify(breadcrumbStructuredData)}
			</script>
		</Helmet>
	);
};

export default HelpPageSEO;
