import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faQuestionCircle,
	faPhone,
	faEnvelope,
	faClock,
	faExclamationTriangle,
	faUser,
	faStore,
	faCreditCard,
	faChartLine,
	faFileAlt,
	faHeadset,
	faRocket,
	faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useSEO from "../hooks/useSEO";

const VendorHelp = () => {
	const [activeTab, setActiveTab] = useState("getting-started");
	const [searchQuery, setSearchQuery] = useState("");

	// SEO Implementation
	useSEO({
		title:
			"Vendor Help Center - Carbon Cube Kenya | Seller Support & Resources",
		description:
			"Get help and support for selling on Carbon Cube Kenya. Find answers to common questions, learn about seller tiers, payments, and how to grow your business on Kenya's trusted marketplace.",
		keywords:
			"vendor help Carbon Cube Kenya, seller support, marketplace help, seller guide Kenya, Carbon Cube seller resources, seller FAQ, Kenya marketplace support",
		url: `${window.location.origin}/vendor-help`,
		type: "website",
		section: "Support",
		tags: ["Vendor", "Help", "Support", "Seller", "Kenya", "Marketplace"],
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "Vendor Help Center - Carbon Cube Kenya",
			description:
				"Comprehensive help and support resources for sellers on Carbon Cube Kenya marketplace",
			url: `${window.location.origin}/vendor-help`,
			mainEntity: {
				"@type": "Organization",
				name: "Carbon Cube Kenya",
				contactPoint: {
					"@type": "ContactPoint",
					contactType: "customer service",
					availableLanguage: "English",
					areaServed: "KE",
					telephone: "+254 712 990 524",
					email: "info@carboncube-ke.com",
				},
			},
		},
		conversationalKeywords: [
			"vendor help Carbon Cube Kenya",
			"seller support Carbon Cube",
			"how to sell on Carbon Cube Kenya",
			"Carbon Cube seller guide",
			"marketplace seller help Kenya",
			"Carbon Cube vendor resources",
		],
		robots: "index, follow",
		canonical: `${window.location.origin}/vendor-help`,
		alternate: {
			en: `${window.location.origin}/vendor-help`,
		},
		openGraph: {
			title:
				"Vendor Help Center - Carbon Cube Kenya | Seller Support & Resources",
			description:
				"Get help and support for selling on Carbon Cube Kenya. Find answers to common questions and learn how to grow your business.",
			type: "website",
			url: `${window.location.origin}/vendor-help`,
			siteName: "Carbon Cube Kenya",
			locale: "en_KE",
			images: [
				{
					url: `${window.location.origin}/assets/banners/carbon-cube-logo.png`,
					width: 1200,
					height: 630,
					alt: "Carbon Cube Kenya Vendor Help",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			site: "@CarbonCubeKE",
			creator: "@CarbonCubeKE",
			title:
				"Vendor Help Center - Carbon Cube Kenya | Seller Support & Resources",
			description:
				"Get help and support for selling on Carbon Cube Kenya. Find answers to common questions and learn how to grow your business.",
			image: `${window.location.origin}/assets/banners/carbon-cube-logo.png`,
		},
		additionalMetaTags: [
			{
				name: "author",
				content: "Carbon Cube Kenya",
			},
			{
				name: "publisher",
				content: "Carbon Cube Kenya",
			},
			{
				name: "copyright",
				content: "© 2025 Carbon Cube Kenya. All rights reserved.",
			},
			{
				name: "language",
				content: "en-KE",
			},
			{
				name: "geo.region",
				content: "KE",
			},
			{
				name: "geo.country",
				content: "Kenya",
			},
			{
				name: "geo.placename",
				content: "Nairobi",
			},
			{
				name: "distribution",
				content: "global",
			},
			{
				name: "rating",
				content: "general",
			},
			{
				name: "revisit-after",
				content: "7 days",
			},
			{
				name: "target",
				content: "sellers, vendors, business owners",
			},
			{
				name: "theme-color",
				content: "#ffc107",
			},
			{
				name: "msapplication-TileColor",
				content: "#ffc107",
			},
			{
				name: "apple-mobile-web-app-title",
				content: "Carbon Cube Kenya",
			},
		],
	});

	const tabs = [
		{ id: "getting-started", label: "Getting Started", icon: faRocket },
		{ id: "seller-tiers", label: "Seller Tiers", icon: faChartLine },
		{ id: "payments", label: "Payments", icon: faCreditCard },
		{ id: "account", label: "Account", icon: faUser },
		{ id: "products", label: "Products", icon: faStore },
		{ id: "support", label: "Support", icon: faHeadset },
	];

	const faqData = {
		"getting-started": [
			{
				question: "How do I become a seller on Carbon Cube Kenya?",
				answer:
					"To become a seller, visit our Become a Seller page and complete the registration process. You'll need to provide business information, contact details, and choose your seller tier. Once approved, you can start listing products immediately.",
			},
			{
				question: "What documents do I need to register as a seller?",
				answer:
					"You'll need a valid Kenyan ID, business registration documents (if applicable), and contact information. For business accounts, additional documentation may be required depending on your business type.",
			},
			{
				question: "How long does seller approval take?",
				answer:
					"Seller approval typically takes 1-3 business days. We review all applications to ensure marketplace quality and security. You'll receive an email notification once your account is approved.",
			},
			{
				question: "Can I start selling immediately after registration?",
				answer:
					"Yes! Once your account is approved, you can immediately start listing products. We recommend starting with the Free tier to test the platform before upgrading to higher tiers.",
			},
		],
		"seller-tiers": [
			{
				question: "What are the different seller tiers available?",
				answer:
					"We offer three tiers: Free (10 products), Premium (50 products), and Enterprise (unlimited products). Each tier includes different features and benefits to help you grow your business.",
			},
			{
				question: "How do I upgrade my seller tier?",
				answer:
					"Upgrade your tier through the seller dashboard or contact our support team. Payment is made via M-Pesa using paybill number 4160265. Your upgrade takes effect immediately after payment confirmation.",
			},
			{
				question: "What happens to my products when I upgrade?",
				answer:
					"All your existing products remain active. Upgrading simply increases your product limit, allowing you to list more items without any disruption to your current listings.",
			},
			{
				question: "Can I downgrade my seller tier?",
				answer:
					"Yes, you can downgrade your tier. However, if you have more products than the new tier allows, you'll need to remove excess products before the downgrade takes effect.",
			},
		],
		payments: [
			{
				question: "How do I pay for my seller subscription?",
				answer:
					"Payments are made via M-Pesa using paybill number 4160265. Follow the payment instructions in your seller dashboard or contact support for assistance with the payment process.",
			},
			{
				question: "When is my subscription payment due?",
				answer:
					"Subscription payments are due monthly on the same date you first subscribed. You'll receive email reminders before your payment is due.",
			},
			{
				question: "What payment methods do you accept?",
				answer:
					"We currently accept M-Pesa payments for seller subscriptions. This ensures secure, instant payments directly from your mobile money account.",
			},
			{
				question: "How do I handle payments from buyers?",
				answer:
					"Carbon Cube Kenya does not handle payments between buyers and sellers. Buyers contact you directly for payment arrangements, giving you full control over your transactions.",
			},
		],
		account: [
			{
				question: "How do I update my seller profile information?",
				answer:
					"Log into your seller dashboard and navigate to the Profile section. You can update your business information, contact details, and profile picture at any time.",
			},
			{
				question: "Can I change my business name after registration?",
				answer:
					"Yes, you can update your business name through your seller dashboard. Changes may take up to 24 hours to reflect across the platform.",
			},
			{
				question: "How do I reset my seller account password?",
				answer:
					"Use the 'Forgot Password' link on the login page or contact our support team. We'll send password reset instructions to your registered email address.",
			},
			{
				question: "Can I have multiple seller accounts?",
				answer:
					"We allow one seller account per business entity. If you have multiple businesses, each can have its own separate seller account.",
			},
		],
		products: [
			{
				question: "How do I add a new product listing?",
				answer:
					"Log into your seller dashboard and click 'Add Product'. Fill in the product details, upload images, set pricing, and publish your listing. High-quality images and detailed descriptions help attract more buyers.",
			},
			{
				question: "What's the maximum number of product images I can upload?",
				answer:
					"You can upload up to 10 images per product. We recommend using high-quality, well-lit photos that showcase your product from different angles.",
			},
			{
				question: "How do I edit or remove a product listing?",
				answer:
					"Go to your seller dashboard, find the product you want to modify, and click 'Edit' or 'Delete'. Changes are saved immediately and visible to buyers right away.",
			},
			{
				question: "What product categories are available?",
				answer:
					"We have categories for Electronics, Fashion, Home & Garden, Health & Beauty, Sports, Books, and more. Choose the most appropriate category for better product visibility.",
			},
		],
		support: [
			{
				question: "How can I contact Carbon Cube support?",
				answer:
					"Contact us via email at info@carboncube-ke.com, phone at +254 712 990 524, or through the contact form on our website. We're available Monday-Friday, 8 AM-5 PM EAT.",
			},
			{
				question: "What's the best way to get help with a technical issue?",
				answer:
					"For technical issues, email us with detailed information about the problem, including screenshots if possible. We typically respond within 24 hours during business days.",
			},
			{
				question: "Do you offer seller training or resources?",
				answer:
					"Yes! We provide seller guides, best practices documentation, and regular webinars to help you succeed on our platform. Check your seller dashboard for available resources.",
			},
			{
				question: "How do I report a problem with a buyer?",
				answer:
					"Contact our support team immediately with details about the issue. We take all reports seriously and will investigate promptly to ensure marketplace integrity.",
			},
		],
	};

	const filteredFAQs = faqData[activeTab].filter(
		(faq) =>
			faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<>
			<Navbar mode="minimal" showSearch={false} showCategories={false} />

			{/* Hero Section */}
			<section
				className="py-8 sm:py-12 lg:py-16 text-dark position-relative overflow-hidden"
				style={{ backgroundColor: "#ffc107" }}
			>
				{/* Subtle background pattern */}
				<div className="position-absolute top-0 start-0 w-100 h-100 opacity-30">
					<div
						style={{
							background:
								"repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px)",
							width: "100%",
							height: "100%",
						}}
					></div>
				</div>
				<div className="container mx-auto px-2 sm:px-4 text-center position-relative max-w-6xl">
					<div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-black rounded-full mx-auto mb-4 sm:mb-6 lg:mb-8 flex items-center justify-center border-2 sm:border-4 border-white">
						<FontAwesomeIcon
							icon={faQuestionCircle}
							className="text-2xl sm:text-3xl lg:text-4xl text-white"
						/>
					</div>
					<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-3 sm:mb-4 lg:mb-6 leading-tight">
						Vendor Help Center
					</h1>
					<p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-black opacity-90 mb-4 sm:mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed">
						Everything you need to succeed as a seller on Carbon Cube Kenya
					</p>
					<div
						className="bg-black text-yellow-400 rounded-full px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 inline-flex items-center gap-2 sm:gap-3 hover:bg-gray-900 transition-colors duration-300"
						onClick={() => (window.location.href = "/become-a-seller")}
						style={{ cursor: "pointer" }}
					>
						<FontAwesomeIcon
							icon={faRocket}
							className="text-yellow-400 text-sm sm:text-base lg:text-lg"
						/>
						<span className="text-yellow-400 font-semibold text-sm sm:text-base lg:text-lg">
							Start Selling Today
						</span>
					</div>
				</div>
			</section>

			{/* Quick Help Section */}
			<section className="py-8 sm:py-12 lg:py-16 bg-white">
				<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
					<div className="text-center mb-8 sm:mb-12 lg:mb-16">
						<p className="text-sm text-gray-500 mb-2">/quick help/</p>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
							Get Help Fast
						</h2>
						<p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
							Find answers to common questions and get the support you need
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
						{/* Contact Support */}
						<div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 text-center">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
								<FontAwesomeIcon
									icon={faPhone}
									className="text-black text-lg sm:text-xl"
								/>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
								Call Support
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
								Speak directly with our support team
							</p>
							<a
								href="tel:+254712990524"
								className="text-yellow-600 hover:text-yellow-700 font-semibold text-sm sm:text-base"
							>
								+254 712 990524
							</a>
						</div>

						{/* Email Support */}
						<div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 text-center">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
								<FontAwesomeIcon
									icon={faEnvelope}
									className="text-black text-lg sm:text-xl"
								/>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
								Email Support
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
								Send us your questions anytime
							</p>
							<a
								href="mailto:info@carboncube-ke.com"
								className="text-yellow-600 hover:text-yellow-700 font-semibold text-sm sm:text-base"
							>
								info@carboncube-ke.com
							</a>
						</div>

						{/* Business Hours */}
						<div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 text-center">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
								<FontAwesomeIcon
									icon={faClock}
									className="text-black text-lg sm:text-xl"
								/>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
								Business Hours
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
								We're here to help you
							</p>
							<p className="text-gray-700 font-semibold text-sm sm:text-base">
								Mon - Fri, 8 AM - 5 PM EAT
							</p>
						</div>

						{/* Seller Resources */}
						<div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 text-center">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
								<FontAwesomeIcon
									icon={faFileAlt}
									className="text-black text-lg sm:text-xl"
								/>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
								Seller Resources
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
								Guides and best practices
							</p>
							<button
								onClick={() => (window.location.href = "/become-a-seller")}
								className="text-yellow-600 hover:text-yellow-700 font-semibold text-sm sm:text-base"
							>
								View Resources
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
					<div className="text-center mb-8 sm:mb-12 lg:mb-16">
						<p className="text-sm text-gray-500 mb-2">
							/frequently asked questions/
						</p>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
							Frequently Asked Questions
						</h2>
						<p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
							Find answers to common seller questions organized by topic
						</p>
					</div>

					{/* Search Bar */}
					<div className="max-w-2xl mx-auto mb-8 sm:mb-12">
						<div className="relative">
							<input
								type="text"
								placeholder="Search help articles..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
							/>
							<FontAwesomeIcon
								icon={faQuestionCircle}
								className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
							/>
						</div>
					</div>

					{/* Tabs */}
					<div className="mb-8 sm:mb-12">
						<div className="flex flex-wrap justify-center gap-2 sm:gap-4">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors duration-200 flex items-center gap-2 ${
										activeTab === tab.id
											? "bg-black text-white"
											: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
									}`}
								>
									<FontAwesomeIcon icon={tab.icon} className="text-sm" />
									{tab.label}
								</button>
							))}
						</div>
					</div>

					{/* FAQ Content */}
					<div className="space-y-4 sm:space-y-6">
						{filteredFAQs.map((faq, index) => (
							<div
								key={index}
								className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300"
							>
								<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
									{faq.question}
								</h3>
								<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
									{faq.answer}
								</p>
							</div>
						))}
					</div>

					{/* No Results */}
					{filteredFAQs.length === 0 && searchQuery && (
						<div className="text-center py-8 sm:py-12">
							<div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
								<FontAwesomeIcon
									icon={faExclamationTriangle}
									className="text-gray-400 text-xl sm:text-2xl"
								/>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
								No results found
							</h3>
							<p className="text-gray-600 mb-6 sm:mb-8">
								Try searching with different keywords or contact our support
								team for help.
							</p>
							<button
								onClick={() => setSearchQuery("")}
								className="bg-black text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 text-sm sm:text-base"
							>
								Clear Search
							</button>
						</div>
					)}
				</div>
			</section>

			{/* Additional Resources Section */}
			<section className="py-8 sm:py-12 lg:py-16 bg-white">
				<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
					<div className="text-center mb-8 sm:mb-12 lg:mb-16">
						<p className="text-sm text-gray-500 mb-2">/additional resources/</p>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
							Additional Resources
						</h2>
						<p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
							More tools and information to help you succeed
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
						{/* Seller Tiers Guide */}
						<div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full mb-4 sm:mb-6 flex items-center justify-center">
								<FontAwesomeIcon
									icon={faChartLine}
									className="text-black text-lg sm:text-xl"
								/>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
								Seller Tiers Guide
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4 sm:mb-6">
								Learn about our different seller tiers and choose the right one
								for your business needs.
							</p>
							<button
								onClick={() => (window.location.href = "/seller/tiers")}
								className="text-yellow-600 hover:text-yellow-700 font-semibold text-sm sm:text-base"
							>
								View Tiers →
							</button>
						</div>

						{/* Payment Guide */}
						<div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full mb-4 sm:mb-6 flex items-center justify-center">
								<FontAwesomeIcon
									icon={faCreditCard}
									className="text-black text-lg sm:text-xl"
								/>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
								Payment Guide
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4 sm:mb-6">
								Step-by-step guide on how to make payments for your seller
								subscription via M-Pesa.
							</p>
							<button
								onClick={() => (window.location.href = "/how-to-pay")}
								className="text-yellow-600 hover:text-yellow-700 font-semibold text-sm sm:text-base"
							>
								Payment Guide →
							</button>
						</div>

						{/* Contact Support */}
						<div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full mb-4 sm:mb-6 flex items-center justify-center">
								<FontAwesomeIcon
									icon={faHandshake}
									className="text-black text-lg sm:text-xl"
								/>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
								Contact Support
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4 sm:mb-6">
								Still need help? Our support team is ready to assist you with
								any questions or issues.
							</p>
							<button
								onClick={() => (window.location.href = "/contact-us")}
								className="text-yellow-600 hover:text-yellow-700 font-semibold text-sm sm:text-base"
							>
								Contact Us →
							</button>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</>
	);
};

export default VendorHelp;
