import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faQuestionCircle,
	faSearch,
	faChevronDown,
	faChevronUp,
	faPhone,
	faEnvelope,
	faClock,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useSEO from "../hooks/useSEO";

const FAQs = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [expandedFAQ, setExpandedFAQ] = useState(null);
	const [activeCategory, setActiveCategory] = useState("general");

	// SEO Implementation
	useSEO({
		title: "FAQs - Carbon Cube Kenya | Frequently Asked Questions",
		description:
			"Find answers to frequently asked questions about Carbon Cube Kenya marketplace. Learn about selling, buying, payments, seller tiers, and how to use our platform effectively.",
		keywords:
			"Carbon Cube Kenya FAQ, frequently asked questions, marketplace help, seller FAQ, buyer FAQ, Carbon Cube support, Kenya marketplace questions, online shopping help Kenya",
		url: `${window.location.origin}/faqs`,
		type: "website",
		section: "Support",
		tags: ["FAQ", "Help", "Support", "Questions", "Kenya", "Marketplace"],
		structuredData: {
			"@context": "https://schema.org",
			"@type": "FAQPage",
			name: "Carbon Cube Kenya FAQs",
			description:
				"Frequently asked questions about Carbon Cube Kenya marketplace",
			url: `${window.location.origin}/faqs`,
			mainEntity: [
				{
					"@type": "Question",
					name: "How do I become a seller on Carbon Cube Kenya?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Visit our Become a Seller page to learn about the registration process. You can start selling for free with our Free tier, which allows up to 10 product listings.",
					},
				},
				{
					"@type": "Question",
					name: "What payment methods do you accept?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "We accept M-Pesa payments for seller subscriptions. Use paybill number 4160265 to upgrade your seller tier. For product purchases, buyers contact sellers directly.",
					},
				},
				{
					"@type": "Question",
					name: "How do I contact a seller about a product?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Sign up as a buyer, browse products, and click 'Reveal Seller Contact' to get the seller's contact information. You can then contact them directly for negotiations.",
					},
				},
			],
		},
		conversationalKeywords: [
			"Carbon Cube Kenya FAQ",
			"frequently asked questions Carbon Cube",
			"Carbon Cube marketplace help",
			"how to use Carbon Cube Kenya",
			"Carbon Cube seller questions",
			"Carbon Cube buyer questions",
		],
		robots: "index, follow",
		canonical: `${window.location.origin}/faqs`,
		alternate: {
			en: `${window.location.origin}/faqs`,
		},
		openGraph: {
			title: "FAQs - Carbon Cube Kenya | Frequently Asked Questions",
			description:
				"Find answers to frequently asked questions about Carbon Cube Kenya marketplace. Learn about selling, buying, payments, and more.",
			type: "website",
			url: `${window.location.origin}/faqs`,
			siteName: "Carbon Cube Kenya",
			locale: "en_KE",
			images: [
				{
					url: `${window.location.origin}/assets/banners/carbon-cube-logo.png`,
					width: 1200,
					height: 630,
					alt: "Carbon Cube Kenya FAQs",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			site: "@CarbonCubeKE",
			creator: "@CarbonCubeKE",
			title: "FAQs - Carbon Cube Kenya | Frequently Asked Questions",
			description:
				"Find answers to frequently asked questions about Carbon Cube Kenya marketplace.",
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
				content: "customers, sellers, buyers, general public",
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

	const faqCategories = [
		{
			id: "general",
			title: "General Questions",
			icon: faQuestionCircle,
			faqs: [
				{
					question: "What is Carbon Cube Kenya?",
					answer:
						"Carbon Cube Kenya is Kenya's trusted digital marketplace that connects verified sellers with buyers. We provide a secure platform for online shopping with AI-powered tools and strict verification systems.",
				},
				{
					question: "How does Carbon Cube Kenya work?",
					answer:
						"Buyers browse products from verified sellers, reveal seller contact information, and negotiate directly with sellers. Sellers list products, manage their inventory, and handle transactions directly with buyers.",
				},
				{
					question: "Is Carbon Cube Kenya safe to use?",
					answer:
						"Yes, Carbon Cube Kenya prioritizes safety through seller verification, secure platform infrastructure, and direct buyer-seller communication. We verify all sellers before they can list products.",
				},
				{
					question: "What are your business hours?",
					answer:
						"Our customer support is available Monday to Friday, 8 AM to 5 PM East Africa Time. You can reach us via phone, email, or visit our Nairobi office.",
				},
			],
		},
		{
			id: "selling",
			title: "Selling on Carbon Cube",
			icon: faQuestionCircle,
			faqs: [
				{
					question: "How do I become a seller on Carbon Cube Kenya?",
					answer:
						"Visit our Become a Seller page to learn about the registration process. You can start selling for free with our Free tier, which allows up to 10 product listings.",
				},
				{
					question: "What are the different seller tiers?",
					answer:
						"We offer three tiers: Free (10 products), Premium (50 products), and Enterprise (unlimited products). Each tier includes different features and benefits to help you grow your business.",
				},
				{
					question: "How do I upgrade my seller tier?",
					answer:
						"Upgrade your tier through the seller dashboard or contact our support team. Payment is made via M-Pesa using paybill number 4160265. Your upgrade takes effect immediately after payment confirmation.",
				},
				{
					question: "How do I add a new product listing?",
					answer:
						"Log into your seller dashboard and click 'Add Product'. Fill in the product details, upload images, set pricing, and publish your listing. High-quality images and detailed descriptions help attract more buyers.",
				},
			],
		},
		{
			id: "buying",
			title: "Buying on Carbon Cube",
			icon: faQuestionCircle,
			faqs: [
				{
					question: "How do I contact a seller about a product?",
					answer:
						"Sign up as a buyer, browse products, and click 'Reveal Seller Contact' to get the seller's contact information. You can then contact them directly for negotiations.",
				},
				{
					question: "Do I need to register to browse products?",
					answer:
						"You can browse products without registration, but you need to sign up as a buyer to reveal seller contact information and make purchases.",
				},
				{
					question: "How do I make payments to sellers?",
					answer:
						"Carbon Cube Kenya does not handle payments between buyers and sellers. Buyers contact sellers directly for payment arrangements, giving you full control over your transactions.",
				},
				{
					question: "Are all sellers verified?",
					answer:
						"Yes, all sellers on Carbon Cube Kenya go through a verification process before they can list products. This ensures quality and trust in our marketplace.",
				},
			],
		},
		{
			id: "payments",
			title: "Payments & Subscriptions",
			icon: faQuestionCircle,
			faqs: [
				{
					question: "What payment methods do you accept?",
					answer:
						"We accept M-Pesa payments for seller subscriptions. Use paybill number 4160265 to upgrade your seller tier. For product purchases, buyers contact sellers directly.",
				},
				{
					question: "When is my subscription payment due?",
					answer:
						"Subscription payments are due monthly on the same date you first subscribed. You'll receive email reminders before your payment is due.",
				},
				{
					question: "How do I handle payments from buyers?",
					answer:
						"Carbon Cube Kenya does not handle payments between buyers and sellers. Buyers contact you directly for payment arrangements, giving you full control over your transactions.",
				},
				{
					question: "Can I get a refund for my subscription?",
					answer:
						"Refund policies vary by tier and circumstances. Contact our support team to discuss refund options for your specific situation.",
				},
			],
		},
		{
			id: "support",
			title: "Support & Contact",
			icon: faQuestionCircle,
			faqs: [
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
					question: "How do I report a problem with a seller or buyer?",
					answer:
						"Contact our support team immediately with details about the issue. We take all reports seriously and will investigate promptly to ensure marketplace integrity.",
				},
			],
		},
	];

	// Get current category FAQs
	const currentCategory = faqCategories.find(
		(cat) => cat.id === activeCategory
	);
	const currentFAQs = currentCategory ? currentCategory.faqs : [];

	// Flatten all FAQs for search
	const allFAQs = faqCategories.flatMap((category) =>
		category.faqs.map((faq) => ({ ...faq, category: category.title }))
	);

	// Filter FAQs based on search query
	const filteredFAQs = searchQuery
		? allFAQs.filter(
				(faq) =>
					faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
					faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: currentFAQs;

	const toggleFAQ = (index) => {
		setExpandedFAQ(expandedFAQ === index ? null : index);
	};

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
					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-3 sm:mb-4 lg:mb-6 leading-tight">
						Frequently Asked Questions
					</h1>
					<p className="text-base sm:text-lg md:text-xl lg:text-2xl text-black opacity-90 mb-4 sm:mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed">
						Find answers to common questions about Carbon Cube Kenya
					</p>
					<div
						className="bg-black text-yellow-400 rounded-full px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 inline-flex items-center gap-2 sm:gap-3 hover:bg-gray-900 transition-colors duration-300"
						onClick={() => (window.location.href = "/contact-us")}
						style={{ cursor: "pointer" }}
					>
						<FontAwesomeIcon
							icon={faPhone}
							className="text-yellow-400 text-sm sm:text-base lg:text-lg"
						/>
						<span className="text-yellow-400 font-semibold text-sm sm:text-base lg:text-lg">
							Still Need Help?
						</span>
					</div>
				</div>
			</section>

			{/* Main Content Section */}
			<section className="py-8 sm:py-12 lg:py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Header */}
					<div className="text-center mb-8 sm:mb-12">
						<p className="text-gray-500 text-sm sm:text-base mb-2">
							Most people ask about
						</p>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
							Frequently asked questions
						</h2>
					</div>

					{/* Search Bar */}
					<div className="max-w-2xl mx-auto mb-8 sm:mb-12">
						<div className="relative">
							<input
								type="text"
								placeholder="Search frequently asked questions..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-base"
							/>
							<FontAwesomeIcon
								icon={faSearch}
								className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
							/>
						</div>
					</div>

					{/* Main Layout */}
					<div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
						{/* Sidebar Navigation */}
						<div className="lg:w-1/4">
							<div className="bg-gray-50 rounded-lg p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Categories
								</h3>
								<nav className="space-y-2">
									{faqCategories.map((category) => (
										<button
											key={category.id}
											onClick={() => {
												setActiveCategory(category.id);
												setSearchQuery("");
											}}
											className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
												activeCategory === category.id
													? "bg-yellow-400 text-black font-semibold"
													: "text-gray-700 hover:bg-gray-100"
											}`}
										>
											{category.title}
										</button>
									))}
								</nav>
							</div>
						</div>

						{/* Main Content */}
						<div className="lg:w-3/4">
							{searchQuery ? (
								// Search Results
								<div className="space-y-4">
									<div className="mb-6">
										<h3 className="text-lg font-semibold text-gray-900 mb-2">
											Search Results
										</h3>
										<p className="text-gray-600 text-sm">
											Found {filteredFAQs.length} result
											{filteredFAQs.length !== 1 ? "s" : ""} for "{searchQuery}"
										</p>
									</div>

									{filteredFAQs.map((faq, index) => (
										<div
											key={index}
											className="bg-white border border-gray-200 rounded-lg overflow-hidden"
										>
											<button
												onClick={() => toggleFAQ(index)}
												className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
											>
												<div className="flex-1">
													<div className="text-xs text-yellow-600 font-semibold mb-1">
														{faq.category}
													</div>
													<h4 className="text-base font-semibold text-gray-900">
														{faq.question}
													</h4>
												</div>
												<FontAwesomeIcon
													icon={
														expandedFAQ === index ? faChevronUp : faChevronDown
													}
													className="text-gray-500 flex-shrink-0 ml-4"
												/>
											</button>
											{expandedFAQ === index && (
												<div className="px-6 py-4 bg-white border-t border-gray-200">
													<p className="text-gray-600 leading-relaxed text-sm">
														{faq.answer}
													</p>
												</div>
											)}
										</div>
									))}

									{filteredFAQs.length === 0 && (
										<div className="text-center py-12">
											<div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
												<FontAwesomeIcon
													icon={faQuestionCircle}
													className="text-gray-400 text-xl"
												/>
											</div>
											<h3 className="text-lg font-bold text-gray-900 mb-3">
												No results found
											</h3>
											<p className="text-gray-600 mb-6 text-sm">
												Try searching with different keywords or contact our
												support team for help.
											</p>
											<div className="flex flex-col sm:flex-row gap-3 justify-center">
												<button
													onClick={() => setSearchQuery("")}
													className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 text-sm"
												>
													Clear Search
												</button>
												<button
													onClick={() => (window.location.href = "/contact-us")}
													className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 text-sm"
												>
													Contact Support
												</button>
											</div>
										</div>
									)}
								</div>
							) : (
								// Category FAQs
								<div className="space-y-4">
									<div className="mb-6">
										<h3 className="text-lg font-semibold text-gray-900">
											{currentCategory?.title}
										</h3>
									</div>

									{currentFAQs.map((faq, index) => (
										<div
											key={index}
											className="bg-white border border-gray-200 rounded-lg overflow-hidden"
										>
											<button
												onClick={() => toggleFAQ(index)}
												className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
											>
												<h4 className="text-base font-semibold text-gray-900 pr-4">
													{faq.question}
												</h4>
												<FontAwesomeIcon
													icon={
														expandedFAQ === index ? faChevronUp : faChevronDown
													}
													className="text-gray-500 flex-shrink-0"
												/>
											</button>
											{expandedFAQ === index && (
												<div className="px-6 py-4 bg-white border-t border-gray-200">
													<p className="text-gray-600 leading-relaxed text-sm">
														{faq.answer}
													</p>
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Contact Support Section */}
			<section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-8 sm:mb-10">
						<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
							Still Need Help?
						</h2>
						<p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
							Can't find the answer you're looking for? Our support team is here
							to help
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
						{/* Phone Support */}
						<div className="bg-white rounded-lg p-6 sm:p-8 border border-gray-200 text-center">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center">
								<FontAwesomeIcon
									icon={faPhone}
									className="text-black text-lg"
								/>
							</div>
							<h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
								Call Us
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4">
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
						<div className="bg-white rounded-lg p-6 sm:p-8 border border-gray-200 text-center">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center">
								<FontAwesomeIcon
									icon={faEnvelope}
									className="text-black text-lg"
								/>
							</div>
							<h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
								Email Us
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4">
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
						<div className="bg-white rounded-lg p-6 sm:p-8 border border-gray-200 text-center">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center">
								<FontAwesomeIcon
									icon={faClock}
									className="text-black text-lg"
								/>
							</div>
							<h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
								Business Hours
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4">
								We're here to help you
							</p>
							<p className="text-gray-700 font-semibold text-sm sm:text-base">
								Mon - Fri, 8 AM - 5 PM EAT
							</p>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</>
	);
};

export default FAQs;
