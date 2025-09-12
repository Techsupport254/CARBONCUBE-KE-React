import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faMobile,
	faCreditCard,
	faShieldAlt,
	faExclamationTriangle,
	faCheckCircle,
	faPhone,
	faMoneyBillWave,
	faLock,
	faUser,
	faStar,
	faGem,
	faCrown,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";

function HowToPay() {
	// Pricing tiers data
	const pricingTiers = [
		{
			id: 1,
			name: "Free",
			price: "KES 0",
			period: "/month",
			icon: faUser,
			iconColor: "text-gray-600",
			iconBg: "bg-gray-100",
			borderColor: "border-gray-200",
			hoverBorderColor: "hover:border-gray-300",
			features: [
				"Up to 10 product listings",
				"Basic marketplace access",
				"Email support",
				"Basic analytics",
				"Standard payment processing",
			],
			featureIconColor: "text-gray-400",
		},
		{
			id: 2,
			name: "Basic",
			price: "KES 3,000",
			period: "/month",
			icon: faStar,
			iconColor: "text-blue-600",
			iconBg: "bg-blue-100",
			borderColor: "border-blue-200",
			hoverBorderColor: "hover:border-blue-300",
			features: [
				"Up to 100 product listings",
				"Improved listing visibility",
				"Advanced analytics dashboard",
				"Priority email support",
				"Basic promotional tools",
				"Inventory management",
			],
			featureIconColor: "text-blue-500",
		},
		{
			id: 3,
			name: "Standard",
			price: "KES 7,500",
			period: "/month",
			icon: faGem,
			iconColor: "text-green-600",
			iconBg: "bg-green-100",
			borderColor: "border-2 border-green-500",
			hoverBorderColor: "hover:border-green-600",
			isPopular: true,
			features: [
				"Up to 400 product listings",
				"Priority listing in searches",
				"Full discount offers",
				"Advanced promotional tools",
				"Phone & email support",
				"Custom branding options",
				"Bulk upload tools",
			],
			featureIconColor: "text-green-500",
		},
		{
			id: 4,
			name: "Premium",
			price: "KES 15,000",
			period: "/month",
			icon: faCrown,
			iconColor: "text-amber-600",
			iconBg: "bg-amber-100",
			borderColor: "border-amber-200",
			hoverBorderColor: "hover:border-amber-300",
			features: [
				"Up to 2,000 product listings",
				"Featured listing options",
				"Advanced promotional tools",
				"24/7 dedicated support",
				"Custom storefront design",
				"API access & integrations",
				"Advanced analytics & reports",
				"White-label solutions",
			],
			featureIconColor: "text-amber-500",
		},
	];

	// SEO Implementation
	useSEO({
		title: "How to Pay - Seller Payment Guide | Carbon Cube Kenya",
		description:
			"Learn how to make M-Pesa payments to upgrade your seller tier on Carbon Cube Kenya. Step-by-step guide for seller subscription payments with paybill number 4160265.",
		keywords:
			"how to pay Carbon Cube Kenya, M-Pesa payment guide, seller subscription, tier upgrade payment, Carbon Cube payment process, M-Pesa paybill 4160265, Kenya mobile payment",
		url: `${window.location.origin}/how-to-pay`,
		type: "website",
		section: "Seller Information",
		tags: [
			"Payment Guide",
			"M-Pesa",
			"Seller Subscription",
			"Tier Upgrade",
			"Mobile Payment",
		],
		structuredData: {
			"@context": "https://schema.org",
			"@type": "HowTo",
			name: "How to Pay for Seller Tier Upgrade - Carbon Cube Kenya",
			description:
				"Step-by-step guide for making M-Pesa payments to upgrade seller tier",
			url: `${window.location.origin}/how-to-pay`,
			step: [
				{
					"@type": "HowToStep",
					name: "Go to M-Pesa Menu",
					text: "Go to the M-Pesa menu on your phone",
				},
				{
					"@type": "HowToStep",
					name: "Select Lipa na M-Pesa",
					text: "Select Lipa na M-Pesa",
				},
				{
					"@type": "HowToStep",
					name: "Choose Paybill",
					text: "Choose Paybill",
				},
				{
					"@type": "HowToStep",
					name: "Enter Business Number",
					text: "Enter Business Number: 4160265",
				},
				{
					"@type": "HowToStep",
					name: "Enter Account Number",
					text: "Enter Account Number: Your Phone Number (used during registration)",
				},
				{
					"@type": "HowToStep",
					name: "Enter Amount",
					text: "Enter the Amount (KES 500, 1000, etc. depending on your tier)",
				},
				{
					"@type": "HowToStep",
					name: "Confirm Payment",
					text: "Enter your M-Pesa PIN and confirm",
				},
			],
			provider: {
				"@type": "Organization",
				name: "Carbon Cube Kenya",
				url: "https://carboncube-ke.com",
				logo: `${window.location.origin}/assets/banners/carbon-cube-logo.png`,
				contactPoint: {
					"@type": "ContactPoint",
					telephone: "+254-712-990524",
					contactType: "customer service",
					email: "info@carboncube-ke.com",
				},
			},
			offers: {
				"@type": "Offer",
				name: "Seller Tier Subscription",
				description: "Subscription plans for Carbon Cube Kenya sellers",
				priceSpecification: [
					{
						"@type": "PriceSpecification",
						name: "Basic Tier",
						price: "3000",
						priceCurrency: "KES",
						unitText: "per month",
					},
					{
						"@type": "PriceSpecification",
						name: "Standard Tier",
						price: "7500",
						priceCurrency: "KES",
						unitText: "per month",
					},
					{
						"@type": "PriceSpecification",
						name: "Premium Tier",
						price: "15000",
						priceCurrency: "KES",
						unitText: "per month",
					},
				],
			},
		},
		conversationalKeywords: [
			"how to pay Carbon Cube Kenya M-Pesa",
			"seller tier upgrade payment",
			"Carbon Cube subscription payment",
			"M-Pesa paybill Carbon Cube",
			"seller payment guide Kenya",
			"M-Pesa payment Carbon Cube Kenya",
		],
		robots: "index, follow",
		canonical: `${window.location.origin}/how-to-pay`,
		alternate: {
			en: `${window.location.origin}/how-to-pay`,
		},
		openGraph: {
			title: "How to Pay - Seller Payment Guide | Carbon Cube Kenya",
			description:
				"Learn how to make M-Pesa payments to upgrade your seller tier on Carbon Cube Kenya. Step-by-step guide for seller subscription payments.",
			type: "website",
			url: `${window.location.origin}/how-to-pay`,
			siteName: "Carbon Cube Kenya",
			locale: "en_KE",
			images: [
				{
					url: `${window.location.origin}/assets/banners/how-to-pay-guide.png`,
					width: 1200,
					height: 630,
					alt: "How to Pay Guide - Carbon Cube Kenya Seller Payment",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			site: "@CarbonCubeKE",
			creator: "@CarbonCubeKE",
			title: "How to Pay - Seller Payment Guide | Carbon Cube Kenya",
			description:
				"Learn how to make M-Pesa payments to upgrade your seller tier on Carbon Cube Kenya. Step-by-step guide for seller subscription payments.",
			image: `${window.location.origin}/assets/banners/how-to-pay-guide.png`,
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
				content: "© 2024 Carbon Cube Kenya. All rights reserved.",
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
				content: "sellers, business owners, entrepreneurs",
			},
			{
				name: "payment-method",
				content: "M-Pesa",
			},
			{
				name: "paybill-number",
				content: "4160265",
			},
		],
	});

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Navbar mode="minimal" showSearch={false} showCategories={false} />

			{/* Hero Section */}
			<section
				className="py-6 sm:py-8 lg:py-12 text-dark position-relative overflow-hidden"
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
					<div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-black rounded-full mx-auto mb-3 sm:mb-4 lg:mb-6 flex items-center justify-center border-2 sm:border-4 border-white">
						<FontAwesomeIcon
							icon={faCreditCard}
							className="text-lg sm:text-xl lg:text-2xl text-white"
						/>
					</div>
					<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-black mb-2 sm:mb-3 lg:mb-4 leading-tight">
						How to Pay
					</h1>
					<p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-black opacity-90 mb-3 sm:mb-4 lg:mb-6 max-w-3xl mx-auto leading-relaxed">
						Complete guide for seller tier subscriptions
					</p>
					<div
						className="bg-black text-yellow-400 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-3 inline-flex items-center gap-1.5 sm:gap-2 hover:bg-gray-900 transition-colors duration-300"
						style={{ cursor: "pointer" }}
					>
						<FontAwesomeIcon
							icon={faShieldAlt}
							className="text-yellow-400 text-xs sm:text-sm lg:text-base"
						/>
						<span className="text-yellow-400 font-semibold text-xs sm:text-sm lg:text-base">
							Secure M-Pesa Payments
						</span>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<section className="py-8 sm:py-12 lg:py-16 flex-grow-1">
				<div className="container mx-auto px-2 sm:px-4">
					{/* Introduction */}
					<div className="text-center mb-8 sm:mb-12 lg:mb-16 max-w-4xl mx-auto">
						<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
							Seller Tier Subscription
						</h2>
						<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
							Unlock premium features and grow your business with our flexible
							tier plans. All payments are processed securely through M-Pesa for
							instant activation.
						</p>
					</div>

					{/* Payment Process Overview */}
					<div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 lg:mb-16">
						<div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
							<div>
								<h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
									Payment Process Overview
								</h3>
								<p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
									Our secure M-Pesa payment system ensures instant tier upgrades
									once payment is received. Follow the simple steps below to
									complete your subscription.
								</p>
								<div className="space-y-3 sm:space-y-4">
									<div className="flex items-center">
										<div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
											<FontAwesomeIcon
												icon={faShieldAlt}
												className="text-green-600 text-sm sm:text-base lg:text-lg"
											/>
										</div>
										<div>
											<h4 className="font-semibold text-gray-900 text-sm sm:text-base">
												Secure & Instant
											</h4>
											<p className="text-gray-600 text-xs sm:text-sm">
												Bank-level security with instant processing
											</p>
										</div>
									</div>
									<div className="flex items-center">
										<div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
											<FontAwesomeIcon
												icon={faMobile}
												className="text-blue-600 text-sm sm:text-base lg:text-lg"
											/>
										</div>
										<div>
											<h4 className="font-semibold text-gray-900 text-sm sm:text-base">
												M-Pesa Integration
											</h4>
											<p className="text-gray-600 text-xs sm:text-sm">
												Seamless payment through Kenya's leading mobile money
												service
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="text-center">
								<div className="relative">
									<img
										src="https://res.cloudinary.com/dvczs0agl/image/upload/w_1200,q_85,f_auto,fl_lossy/v1757574384/HOW_TO_PAY-01_wkqw5e.png"
										alt="How to Pay Guide - Step by step payment process for Carbon Cube Kenya sellers"
										className="w-full h-120 object-contain rounded-xl"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Tier Information */}
					<div className="mb-8 sm:mb-12 lg:mb-16 text-center">
						<div className="mb-6 sm:mb-8 lg:mb-12">
							<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
								Available Tiers
							</h2>
							<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600">
								Choose the tier that best fits your business needs
							</p>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
							{/* Render pricing tiers dynamically */}
							{pricingTiers.map((tier) => (
								<div
									key={tier.id}
									className={`bg-white rounded-xl sm:rounded-2xl border ${
										tier.borderColor
									} p-2 sm:p-3 text-center ${
										tier.hoverBorderColor
									} transition-colors ${tier.isPopular ? "relative" : ""}`}
								>
									{/* Popular badge */}
									{tier.isPopular && (
										<div className="absolute -top-2 sm:-top-3 lg:-top-4 left-1/2 transform -translate-x-1/2">
											<span className="bg-green-500 text-white px-2 sm:px-3 lg:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
												Popular
											</span>
										</div>
									)}

									{/* Icon */}
									<div
										className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${tier.iconBg} rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3`}
									>
										<FontAwesomeIcon
											icon={tier.icon}
											className={`text-sm sm:text-base lg:text-xl ${tier.iconColor}`}
										/>
									</div>

									{/* Title */}
									<h3 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
										{tier.name}
									</h3>

									{/* Price */}
									<div className="mb-2 sm:mb-3">
										<span
											className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold ${
												tier.name === "Free"
													? "text-gray-900"
													: tier.name === "Basic"
													? "text-blue-600"
													: tier.name === "Standard"
													? "text-green-600"
													: "text-amber-600"
											}`}
										>
											{tier.price}
										</span>
										<span className="text-gray-600 ml-1 sm:ml-2 text-xs sm:text-sm">
											{tier.period}
										</span>
									</div>

									{/* Features */}
									<ul className="text-center space-y-0.5 sm:space-y-1">
										{tier.features.map((feature, index) => (
											<li
												key={index}
												className="flex items-center justify-center"
											>
												<FontAwesomeIcon
													icon={faCheckCircle}
													className={`${tier.featureIconColor} mr-1.5 sm:mr-2 text-xs sm:text-sm`}
												/>
												<span className="text-gray-700 text-xs sm:text-sm">
													{feature}
												</span>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>

					{/* M-Pesa Payment Process */}
					<section className="py-6 sm:py-8 lg:py-12">
						<div className="container mx-auto px-2 sm:px-4">
							<div className="text-center mb-6 sm:mb-8 lg:mb-12">
								<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
									M-Pesa Payment Process
								</h2>
								<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
									Follow these simple steps to complete your payment securely
									through M-Pesa
								</p>
							</div>

							<div className="max-w-6xl mx-auto">
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
									{[
										{
											step: 1,
											title: "Go to M-Pesa Menu",
											description: "Open the M-Pesa menu on your phone",
											icon: faMobile,
										},
										{
											step: 2,
											title: "Select Lipa na M-Pesa",
											description: "Choose the Lipa na M-Pesa option",
											icon: faCreditCard,
										},
										{
											step: 3,
											title: "Choose Paybill",
											description: "Select Paybill as your payment method",
											icon: faMoneyBillWave,
										},
										{
											step: 4,
											title: "Enter Business Number",
											description: "Enter Business Number: 4160265",
											icon: faPhone,
										},
										{
											step: 5,
											title: "Enter Account Number",
											description:
												"Enter your phone number (used during registration)",
											icon: faPhone,
										},
										{
											step: 6,
											title: "Enter Amount",
											description:
												"Enter the amount (KES 3,000, 7,500, or 15,000)",
											icon: faMoneyBillWave,
										},
										{
											step: 7,
											title: "Confirm Payment",
											description: "Enter your M-Pesa PIN and confirm",
											icon: faLock,
										},
									].map((item) => (
										<div
											key={item.step}
											className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all duration-300"
										>
											<div className="text-center">
												<div className="mb-3 sm:mb-4">
													<div
														className="bg-yellow-500 text-white rounded-full flex items-center justify-center mx-auto font-bold"
														style={{ width: "48px", height: "48px" }}
													>
														<span className="text-lg sm:text-xl">
															{item.step}
														</span>
													</div>
												</div>
												<h5 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
													{item.title}
												</h5>
												<p className="text-gray-600 text-xs sm:text-sm mb-0">
													{item.description}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Payment Confirmation */}
							<div className="mt-8 sm:mt-10 lg:mt-12 text-center">
								<div className="bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
									<div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-green-100 rounded-full mb-4 sm:mb-6">
										<FontAwesomeIcon
											icon={faCheckCircle}
											className="text-lg sm:text-xl lg:text-2xl text-green-600"
										/>
									</div>
									<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-800 mb-3 sm:mb-4">
										Payment Confirmation
									</h3>
									<p className="text-sm sm:text-base lg:text-lg text-green-700 leading-relaxed">
										Once payment is received, your seller account is instantly
										upgraded to the chosen tier. You'll receive a confirmation
										SMS and can start using your new features immediately.
									</p>
								</div>
							</div>
						</div>
					</section>

					{/* Important Information */}
					<div className="mb-8 sm:mb-12 lg:mb-16">
						<div className="text-center mb-6 sm:mb-8 lg:mb-12">
							<div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-yellow-100 rounded-full mb-4 sm:mb-6">
								<FontAwesomeIcon
									icon={faExclamationTriangle}
									className="text-lg sm:text-xl lg:text-2xl text-yellow-600"
								/>
							</div>
							<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
								Important Information
							</h2>
							<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
								Please read these important details about our payment system
							</p>
						</div>

						<div className="max-w-5xl mx-auto">
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
								<div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8 text-center hover:border-gray-300 transition-colors">
									<div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
										<FontAwesomeIcon
											icon={faExclamationTriangle}
											className="text-lg sm:text-xl lg:text-2xl text-yellow-600"
										/>
									</div>
									<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
										No Buyer-Seller Payments
									</h3>
									<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
										Carbon Cube does not handle payments between buyers and
										sellers. We only process seller subscription payments.
									</p>
								</div>

								<div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8 text-center hover:border-gray-300 transition-colors">
									<div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
										<FontAwesomeIcon
											icon={faExclamationTriangle}
											className="text-lg sm:text-xl lg:text-2xl text-yellow-600"
										/>
									</div>
									<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
										Direct Contact Required
									</h3>
									<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
										Buyers must contact you directly to arrange payment for
										products. We facilitate connections, not transactions.
									</p>
								</div>

								<div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8 text-center hover:border-gray-300 transition-colors sm:col-span-2 lg:col-span-1">
									<div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
										<FontAwesomeIcon
											icon={faExclamationTriangle}
											className="text-lg sm:text-xl lg:text-2xl text-yellow-600"
										/>
									</div>
									<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
										Tier Upgrades Only
									</h3>
									<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
										Payments to Carbon Cube are exclusively for upgrading your
										seller account to access premium features and increased
										listing limits.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}

export default HowToPay;
