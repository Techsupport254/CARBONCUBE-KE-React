import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faCheckCircle,
	faShieldAlt,
	faStore,
	faStar,
	faCrown,
	faGem,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
import sellerGuideImage from "../assets/banners/become-a-seller-guide.png";

function BecomeASeller() {
	// Timeline steps data
	const timelineSteps = [
		{
			id: 1,
			title: "Create Account",
			subtitle: "Register and verify your seller account",
			steps: [
				"Visit carboncube-ke.com",
				"Click Sign In → Seller Registration",
				"Fill registration form",
				"Verify email with OTP",
			],
			image:
				"https://images.tango.us/workflows/ec503821-d8e2-45e4-98bb-37cbdd801eee/steps/98befb83-77eb-4509-b419-b1abda78f74b/2a3670fb-86df-4364-92b3-6927566489b9.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&fp-z=2.0000&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=519&mark-y=243&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz02NTYmaD03MiZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw",
			alt: "Account registration process",
		},
		{
			id: 2,
			title: "Access Dashboard",
			subtitle: "Log in and explore your seller dashboard",
			steps: [
				"Log in with your credentials",
				"Access seller dashboard",
				"Navigate to Manage Products",
			],
			image:
				"https://images.tango.us/workflows/ec503821-d8e2-45e4-98bb-37cbdd801eee/steps/68f4d850-5e0e-4b44-b72c-75da4b97b0dc/25c9d45c-32f8-4a64-a2eb-0c02b71b8703.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.2531&fp-y=0.5252&fp-z=1.8592&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=299&mark-y=370&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz01MzEmaD0xMTgmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D",
			alt: "Seller dashboard access",
		},
		{
			id: 3,
			title: "Create First Ad",
			subtitle: "Add your first product listing",
			steps: [
				'Click "Create Your First Ad"',
				"Fill in product details",
				"Upload product images",
				"Publish your ad",
			],
			image:
				"https://images.tango.us/workflows/ec503821-d8e2-45e4-98bb-37cbdd801eee/steps/1784efd2-a091-47f9-8323-077b2ae613a3/9cb0fc09-78f1-4a56-a5b5-93be8ac69173.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=913&mark-y=726&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0xMjEmaD0zNiZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw",
			alt: "Create first advertisement",
		},
		{
			id: 4,
			title: "Manage Listings",
			subtitle: "View, edit, and optimize your ads",
			steps: [
				"View all your ads",
				"Edit ad details anytime",
				"Delete ads when needed",
				"Track performance metrics",
			],
			image:
				"https://images.tango.us/workflows/ec503821-d8e2-45e4-98bb-37cbdd801eee/steps/1f755371-d95b-433b-b77d-6a476884b793/d8e2e377-edf7-49ed-91af-1b512fc3dd1e.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.1950&fp-y=0.3704&fp-z=1.9847&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=2560&mark-y=282&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0zNzgmaD0zNDcmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D",
			alt: "Manage your advertisements",
		},
	];

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
		title:
			"Become a Seller - Carbon Cube Kenya | Start Selling Auto Parts & Electronics and more",
		description:
			"Join Carbon Cube Kenya as a seller and showcase your products to thousands of buyers. Sell auto parts, filters, hardware, electronics, phones, TVs and more. Start selling for free today!",
		keywords:
			"become seller, sell online Kenya, auto parts seller, electronics seller, Carbon Cube Kenya, online marketplace, seller registration, Kenya marketplace, free seller account",
		url: `${window.location.origin}/become-a-seller`,
		type: "website",
		section: "Seller Information",
		tags: [
			"Seller Registration",
			"Online Selling",
			"Marketplace",
			"Kenya",
			"Auto Parts",
			"Electronics",
		],
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "Become a Seller - Carbon Cube Kenya",
			description:
				"Learn how to become a seller on Carbon Cube Kenya and start selling auto parts, electronics, and more",
			url: `${window.location.origin}/become-a-seller`,
			mainEntity: {
				"@type": "HowTo",
				name: "How to Become a Seller on Carbon Cube Kenya",
				description:
					"Step-by-step guide to becoming a seller on Carbon Cube Kenya",
				step: [
					{
						"@type": "HowToStep",
						name: "Search",
						text: "Go to carboncube-ke.com",
					},
					{
						"@type": "HowToStep",
						name: "Click",
						text: "Select the Sign In button at the top right",
					},
					{
						"@type": "HowToStep",
						name: "Select",
						text: "On the sign-in page, choose Seller Registration at the bottom",
					},
					{
						"@type": "HowToStep",
						name: "Details",
						text: "Enter your information in the form",
					},
					{
						"@type": "HowToStep",
						name: "Terms",
						text: "Read and accept the terms and conditions, then sign up",
					},
					{
						"@type": "HowToStep",
						name: "Log In",
						text: "You'll be redirected to the sign-in page. Enter your username and password",
					},
				],
			},
			provider: {
				"@type": "Organization",
				name: "Carbon Cube Kenya",
				url: "https://carboncube-ke.com",
				logo: `${window.location.origin}/assets/banners/carbon-cube-logo.png`,
				contactPoint: {
					"@type": "ContactPoint",
					telephone: "+254 712 990 524",
					contactType: "customer service",
					email: "info@carboncube-ke.com",
				},
			},
		},
		conversationalKeywords: [
			"how to become a seller on Carbon Cube Kenya",
			"Carbon Cube Kenya seller registration",
			"sell auto parts online Kenya",
			"Kenya marketplace seller account",
			"Carbon Cube seller signup process",
		],
		robots: "index, follow",
		canonical: `${window.location.origin}/become-a-seller`,
		alternate: {
			en: `${window.location.origin}/become-a-seller`,
		},
		openGraph: {
			title:
				"Become a Seller - Carbon Cube Kenya | Start Selling Auto Parts & Electronics",
			description:
				"Join Carbon Cube Kenya as a seller and showcase your products to thousands of buyers. Sell auto parts, filters, hardware, electronics, phones, TVs and more. Start selling for free today!",
			type: "website",
			url: `${window.location.origin}/become-a-seller`,
			siteName: "Carbon Cube Kenya",
			locale: "en_KE",
			images: [
				{
					url: `${window.location.origin}/assets/banners/become-a-seller-guide.png`,
					width: 1200,
					height: 630,
					alt: "Become a Seller Guide - Carbon Cube Kenya",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			site: "@CarbonCubeKE",
			creator: "@CarbonCubeKE",
			title:
				"Become a Seller - Carbon Cube Kenya | Start Selling Auto Parts & Electronics",
			description:
				"Join Carbon Cube Kenya as a seller and showcase your products to thousands of buyers. Start selling for free today!",
			image: `${window.location.origin}/assets/banners/become-a-seller-guide.png`,
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
				content: "sellers, entrepreneurs, business owners",
			},
		],
	});

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
							icon={faStore}
							className="text-2xl sm:text-3xl lg:text-4xl text-white"
						/>
					</div>
					<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-3 sm:mb-4 lg:mb-6 leading-tight">
						Become a Seller
					</h1>
					<p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-black opacity-90 mb-4 sm:mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed">
						Join Carbon Cube Kenya and showcase your products to thousands of
						buyers across Kenya
					</p>
					<div
						className="bg-black text-yellow-400 rounded-full px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 inline-flex items-center gap-2 sm:gap-3 hover:bg-gray-900 transition-colors duration-300"
						onClick={() => (window.location.href = "/seller-signup")}
						style={{ cursor: "pointer" }}
					>
						<FontAwesomeIcon
							icon={faShieldAlt}
							className="text-yellow-400 text-sm sm:text-base lg:text-lg"
						/>
						<span className="text-yellow-400 font-semibold text-sm sm:text-base lg:text-lg">
							Start Selling for Free Today
						</span>
					</div>
				</div>
			</section>

			{/* Main Content Introduction */}
			<div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 mb-8 sm:mb-12 lg:mb-16 xl:mb-20">
				<div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-center max-w-7xl mx-auto">
					<div className="space-y-4 sm:space-y-6 lg:space-y-8">
						<div>
							<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight">
								Start Your Selling Journey
							</h2>
							<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
								Join thousands of successful sellers on Carbon Cube Kenya and
								reach customers looking for quality products across the country.
							</p>
						</div>

						{/* Key Benefits */}
						<div>
							<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
								Why Sell With Us?
							</h3>
							<div className="grid sm:grid-cols-1 gap-2 sm:gap-3 lg:gap-4">
								<div className="flex items-center p-2 sm:p-3 lg:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
									<div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 flex-shrink-0">
										<FontAwesomeIcon
											icon={faCheckCircle}
											className="text-green-500 text-sm sm:text-base lg:text-lg"
										/>
									</div>
									<span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">
										100% Commission Free
									</span>
								</div>
								<div className="flex items-center p-2 sm:p-3 lg:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
									<div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 flex-shrink-0">
										<FontAwesomeIcon
											icon={faCheckCircle}
											className="text-green-500 text-sm sm:text-base lg:text-lg"
										/>
									</div>
									<span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">
										Instant Visibility
									</span>
								</div>
								<div className="flex items-center p-2 sm:p-3 lg:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
									<div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 flex-shrink-0">
										<FontAwesomeIcon
											icon={faCheckCircle}
											className="text-green-500 text-sm sm:text-base lg:text-lg"
										/>
									</div>
									<span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">
										Real Buyers
									</span>
								</div>
								<div className="flex items-center p-2 sm:p-3 lg:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
									<div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 flex-shrink-0">
										<FontAwesomeIcon
											icon={faCheckCircle}
											className="text-green-500 text-sm sm:text-base lg:text-lg"
										/>
									</div>
									<span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">
										Easy Management
									</span>
								</div>
							</div>
						</div>

						{/* Call to Action */}
						<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 pt-2 sm:pt-3 lg:pt-4">
							<a
								href="/seller-signup"
								className="bg-yellow-500 text-black px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg sm:rounded-xl font-semibold hover:bg-yellow-600 transition-colors text-center no-underline shadow-sm hover:shadow-md text-sm sm:text-base"
							>
								Start Selling Now
							</a>
							<a
								href="/login"
								className="border-2 border-gray-300 text-gray-700 px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors text-center no-underline text-sm sm:text-base"
							>
								Already a Seller?
							</a>
						</div>
					</div>

					<div className="text-center">
						<div className="aspect-w-4 aspect-h-3">
							<img
								src={sellerGuideImage}
								alt="Become a Seller Guide - Step by step process to start selling on Carbon Cube Kenya"
								className="w-full h-120"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Getting Started Timeline */}
			<div className="mb-8 sm:mb-12 lg:mb-16 xl:mb-20">
				<div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16">
					<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
						Getting Started in 4 Simple Steps
					</h2>
					<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4">
						Follow our streamlined process to start selling on Carbon Cube Kenya
					</p>
				</div>

				<div className="max-w-6xl mx-auto">
					{/* Timeline container with progress line */}
					<div className="relative">
						{/* Progress line */}
						<div className="absolute left-6 sm:left-7 lg:left-8 top-0 bottom-0 w-0.5 bg-gray-300 hidden lg:block"></div>

						{/* Render timeline steps dynamically */}
						{timelineSteps.map((step, index) => (
							<div
								key={step.id}
								className={`relative ${
									index < timelineSteps.length - 1
										? "mb-8 sm:mb-12 lg:mb-16"
										: ""
								}`}
							>
								<div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-start">
									{/* Left section with number and title */}
									<div className="flex items-center gap-3 sm:gap-4 lg:gap-6 w-full lg:w-1/3">
										<div className="bg-yellow-500 text-black rounded-full w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 flex items-center justify-center font-bold text-lg sm:text-xl lg:text-2xl relative z-10 border-2 sm:border-4 border-white shadow-sm flex-shrink-0">
											{step.id}
										</div>
										<div className="flex-1 lg:block">
											<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
												{step.title}
											</h3>
											<p className="text-sm sm:text-base text-gray-600 leading-relaxed">
												{step.subtitle}
											</p>
										</div>
									</div>

									{/* Right section with steps and image */}
									<div className="w-full lg:w-2/3 bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-1 sm:p-2 md:p-3 lg:p-4 xl:p-6 border-2 border-gray-200 hover:border-gray-300 transition-colors">
										<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8 items-start sm:items-center">
											{/* Steps list */}
											<div className="space-y-1 sm:space-y-2 lg:space-y-3 w-full sm:w-1/2 lg:w-2/5">
												{step.steps.map((stepItem, stepIndex) => (
													<div
														key={stepIndex}
														className="flex items-center gap-1 sm:gap-2 lg:gap-3 p-1 sm:p-2 lg:p-3 bg-gray-50 rounded-md sm:rounded-lg"
													>
														<div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
															<FontAwesomeIcon
																icon={faCheckCircle}
																className="text-green-500 text-xs sm:text-sm"
															/>
														</div>
														<span className="text-xs sm:text-sm text-gray-700 font-medium leading-tight">
															{stepItem}
														</span>
													</div>
												))}
											</div>

											{/* Image */}
											<div className="text-center w-full sm:w-1/2 lg:w-3/5">
												<div className="bg-white rounded-md sm:rounded-lg lg:rounded-xl p-1 sm:p-2 lg:p-3 xl:p-4 border-2 border-gray-200 inline-block w-full">
													<img
														src={step.image}
														alt={step.alt}
														className="w-full h-auto object-contain rounded-md sm:rounded-lg"
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Upgrade to Sell More Section */}
			<div className="mb-8 sm:mb-12 lg:mb-16 max-w-7xl mx-auto px-2 sm:px-4 text-center">
				<div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
					<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
						Upgrade to Sell More
					</h2>
					<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
						Choose the plan that works best for your business needs
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
					{/* Render pricing tiers dynamically */}
					{pricingTiers.map((tier) => (
						<div
							key={tier.id}
							className={`bg-white rounded-lg sm:rounded-xl lg:rounded-2xl border ${
								tier.borderColor
							} p-1 sm:p-2 md:p-3 text-center ${
								tier.hoverBorderColor
							} transition-colors ${tier.isPopular ? "relative" : ""}`}
						>
							{/* Popular badge */}
							{tier.isPopular && (
								<div className="absolute -top-2 sm:-top-3 lg:-top-4 left-1/2 transform -translate-x-1/2">
									<span className="bg-green-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 lg:px-4 lg:py-1 rounded-full text-xs sm:text-sm font-medium">
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
								<span className="text-gray-600 ml-1 sm:ml-2 text-xs sm:text-sm lg:text-base">
									{tier.period}
								</span>
							</div>

							{/* Features */}
							<ul className="text-center space-y-0.5 sm:space-y-1">
								{tier.features.map((feature, index) => (
									<li key={index} className="flex items-center justify-center">
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

				{/* Call to Action */}
				<div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 text-center">
					<div className="bg-black text-white rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
						<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4">
							Ready to Start Selling?
						</h2>
						<p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-4 sm:mb-5 lg:mb-6">
							Join thousands of successful sellers on Carbon Cube Kenya and
							start connecting with buyers today.
						</p>
						<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center">
							<a
								href="/seller-signup"
								className="bg-yellow-500 text-black px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors no-underline text-sm sm:text-base"
							>
								Sign Up Now
							</a>
							<a
								href="/login"
								className="border border-gray-300 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors no-underline text-sm sm:text-base"
							>
								Already Have an Account?
							</a>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
}

export default BecomeASeller;
