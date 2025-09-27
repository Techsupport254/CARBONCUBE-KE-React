import React from "react";
import { Helmet } from "react-helmet-async";
import { getCanonicalUrl, cleanUrl } from "../utils/seoUtils";

/**
 * PageSEO Component - Optimized SEO component for all pages
 * Lightweight and fast meta tag generation for millisecond response times
 */
const PageSEO = ({
	pageType,
	title,
	description,
	keywords,
	image,
	url,
	customConfig = {},
}) => {
	// Fast, optimized SEO data for different page types
	const defaultSEO = {
		home: {
			title:
				"Carbon Cube Kenya - Kenya's #1 Online Marketplace | Trusted Sellers & Buyers",
			description:
				"Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement. Discover thousands of products from verified sellers across Kenya with secure payment and fast delivery.",
			keywords:
				"Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce, AI-powered marketplace, digital procurement Kenya, seller verification, sustainable sourcing Kenya, online shopping Kenya, B2B marketplace, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, verified suppliers, business growth Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		product: {
			title: "Product Details | Carbon Cube Kenya",
			description:
				"View product details on Carbon Cube Kenya. Buy from verified sellers with fast delivery across Kenya.",
			keywords:
				"product, buy online, verified sellers, Kenya marketplace, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		shop: {
			title: "Shop | Carbon Cube Kenya",
			description:
				"Browse shops on Carbon Cube Kenya - Kenya's trusted online marketplace",
			keywords:
				"shop, Carbon Cube Kenya, online shopping Kenya, shop near me, store in Nairobi, automotive shop Nairobi, computer shop Nairobi, filters shop Nairobi, hardware shop Nairobi, car parts shop Kenya, IT store Kenya, auto parts store Kenya, automotive supplies Kenya, computer accessories Kenya, power tools Kenya, buy online Kenya, shop online Nairobi, secure online shopping Kenya, fast delivery Kenya",
		},
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
		login: {
			title: "Login to Carbon Cube Kenya | Access Your Account",
			description:
				"Login to your Carbon Cube Kenya account to access your dashboard, manage your listings, or start shopping on Kenya's trusted online marketplace.",
			keywords:
				"login Carbon Cube Kenya, user login, account access, marketplace login, secure login Kenya, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		buyerSignup: {
			title: "Join Carbon Cube Kenya as a Buyer | Free Registration",
			description:
				"Sign up as a buyer on Carbon Cube Kenya and access thousands of verified products from trusted sellers. Start shopping with secure payments and fast delivery across Kenya.",
			keywords:
				"buyer signup, join marketplace Kenya, free registration, buyer account, shopping signup, customer registration, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		sellerSignup: {
			title:
				"Become a Seller on Carbon Cube Kenya | Start Your Online Business",
			description:
				"Join Carbon Cube Kenya as a verified seller and reach thousands of buyers. Start selling your products with secure payments, fast delivery, and business growth tools.",
			keywords:
				"seller signup, become a seller, vendor registration, online business Kenya, marketplace selling, seller account, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		categories: {
			title: "Browse All Categories | Carbon Cube Kenya Marketplace",
			description:
				"Browse all product categories on Carbon Cube Kenya. Find thousands of products from verified sellers across Kenya with secure payments and fast delivery.",
			keywords:
				"categories, product categories, browse products, Carbon Cube Kenya, online marketplace Kenya, verified sellers, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		faqs: {
			title: "Frequently Asked Questions | Carbon Cube Kenya Help Center",
			description:
				"Find answers to common questions about Carbon Cube Kenya marketplace. Get help with buying, selling, payments, shipping, and using Kenya's trusted online platform.",
			keywords:
				"FAQ Carbon Cube Kenya, help center, marketplace questions, buying help, selling help, payment questions, shipping questions, customer support, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
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
		"how-to-pay": {
			title: "How to Pay - Seller Payment Guide | Carbon Cube Kenya",
			description:
				"Learn how to make M-Pesa payments to upgrade your seller tier on Carbon Cube Kenya. Step-by-step guide for seller subscription payments.",
			keywords:
				"how to pay Carbon Cube Kenya, M-Pesa payment guide, seller subscription payment, payment methods Kenya, seller tier upgrade, Carbon Cube payment process, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		"how-to-shop": {
			title: "How to Shop on Carbon Cube Kenya | Complete Buyer's Guide",
			description:
				"Complete shopping guide for Carbon Cube Kenya. Learn how to find products, compare prices, make secure purchases, track orders, and get the best deals on Kenya's trusted marketplace.",
			keywords:
				"shopping guide, how to buy online Kenya, marketplace shopping, buyer tips, secure shopping, product search, order tracking, shopping tips, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		becomeSeller: {
			title: "Become a Seller on Carbon Cube Kenya | Complete Seller's Guide",
			description:
				"Join Carbon Cube Kenya as a verified seller and start your online business. Complete guide to registration, listing products, managing orders, and growing your sales on Kenya's trusted marketplace.",
			keywords:
				"become a seller, start selling online Kenya, vendor registration, seller signup, online business Kenya, marketplace selling, seller guide, business setup, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		vendorHelp: {
			title: "Vendor Help Center | How to Sell on Carbon Cube Kenya",
			description:
				"Complete guide for vendors and sellers on Carbon Cube Kenya. Learn how to create listings, manage your shop, optimize sales, and grow your business on Kenya's trusted marketplace.",
			keywords:
				"vendor help, seller guide, how to sell online Kenya, marketplace selling, vendor support, seller tips, business growth, online selling guide, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		"data-deletion": {
			title: "Data Deletion Request | Carbon Cube Kenya Privacy",
			description:
				"Request data deletion from Carbon Cube Kenya. Learn about your privacy rights and how to delete your account data on Kenya's trusted online marketplace.",
			keywords:
				"data deletion, privacy rights, account deletion, GDPR Kenya, data protection, personal information, Carbon Cube Kenya privacy, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		location: {
			title: "Local Products | Carbon Cube Kenya",
			description:
				"Find products and sellers in your local area on Carbon Cube Kenya. Discover local businesses and products available near you.",
			keywords:
				"local products, local sellers, location-based shopping, local marketplace, Carbon Cube Kenya, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		notFound: {
			title: "Page Not Found | Carbon Cube Kenya",
			description:
				"The page you're looking for doesn't exist. Return to Carbon Cube Kenya homepage to continue shopping.",
			keywords:
				"page not found, 404 error, Carbon Cube Kenya, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		deviceFingerprint: {
			title: "Device Fingerprint | Carbon Cube Kenya",
			description:
				"Device fingerprint information and privacy settings for Carbon Cube Kenya.",
			keywords:
				"device fingerprint, privacy settings, device information, Carbon Cube Kenya, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		analyticsTest: {
			title: "Analytics Test | Carbon Cube Kenya",
			description:
				"Analytics testing page for Carbon Cube Kenya development and debugging.",
			keywords:
				"analytics test, development tools, debugging, Carbon Cube Kenya, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
		seoTest: {
			title: "SEO Test | Carbon Cube Kenya",
			description:
				"SEO testing and validation page for Carbon Cube Kenya development.",
			keywords:
				"SEO test, development tools, SEO validation, Carbon Cube Kenya, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, secure online shopping Kenya, fast delivery Kenya",
		},
	};

	// Fast SEO data resolution
	const pageSEO = defaultSEO[pageType] || {
		title: title || "Carbon Cube Kenya | Kenya's Trusted Online Marketplace",
		description:
			description ||
			"Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.",
		keywords:
			keywords ||
			"Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce",
	};

	// Optimized final values
	const finalTitle = title || pageSEO.title;
	const finalDescription = description || pageSEO.description;
	const finalKeywords = keywords || pageSEO.keywords;
	const finalImage = image || "https://carboncube-ke.com/og-image.png";
	const finalUrl = url || `https://carboncube-ke.com/${pageType}`;

	// Lightweight structured data
	const pageStructuredData = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: finalTitle,
		description: finalDescription,
		url: finalUrl,
		publisher: {
			"@type": "Organization",
			name: "Carbon Cube Kenya",
			url: "https://carboncube-ke.com",
		},
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
			<meta name="twitter:title" content={finalTitle} />
			<meta name="twitter:description" content={finalDescription} />
			<meta name="twitter:image" content={finalImage} />
			<meta
				name="twitter:image:alt"
				content="Carbon Cube Kenya - Kenya's Trusted Online Marketplace"
			/>

			{/* Canonical URL */}
			<link rel="canonical" href={cleanUrl(finalUrl)} />

			{/* Structured Data Scripts */}
			<script type="application/ld+json">
				{JSON.stringify(pageStructuredData)}
			</script>
		</Helmet>
	);
};

export default PageSEO;
