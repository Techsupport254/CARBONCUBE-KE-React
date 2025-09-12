import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faShoppingCart,
	faShieldAlt,
	faCreditCard,
	faUser,
	faPhone,
	faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
import howToShopGuide from "../assets/banners/how-to-shop-guide.png";

const HowToShop = () => {
	// Shopping process steps data
	const shoppingSteps = [
		{
			id: 1,
			title: "Sign In",
			subtitle: "Visit Carbon Cube Kenya and sign in to your buyer account",
			steps: ["Visit carboncube-ke.com", "Sign in to your buyer account"],
			image:
				"https://images.tango.us/workflows/5d3ccfaa-585a-4a7c-a922-113e799d7c0c/steps/be6a004f-74e3-4406-b1e9-4e63db1d87cb/13d6229e-f4b2-4f04-b210-bce48e3a58ac.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.9572&fp-y=0.0268&fp-z=2.9681&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=935&mark-y=21&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0yMjQmaD05NCZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw",
			alt: "Visit Carbon Cube Kenya and sign in to your buyer account",
		},
		{
			id: 2,
			title: "Fill Form",
			subtitle: "Fill the form and submit to sign in",
			steps: ["Fill the form", "Submit to sign in"],
			image:
				"https://images.tango.us/workflows/5d3ccfaa-585a-4a7c-a922-113e799d7c0c/steps/9201f7b2-bcd9-426e-84e1-121b80e4d622/87b54923-348d-4276-bdde-3ef4d7aebf83.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.6028&fp-y=0.5000&fp-z=1.8732&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=293&mark-y=387&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz02MTQmaD04NCZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw",
			alt: "Type password",
		},
		{
			id: 3,
			title: "Browse Ads",
			subtitle: "Click on the ad you are interested in to view the details",
			steps: ["Browse available ads", "Click on the ad you're interested in"],
			image:
				"https://images.tango.us/workflows/5d3ccfaa-585a-4a7c-a922-113e799d7c0c/steps/d7bff101-14c0-4b9f-9317-45607a8788c7/3f7c5a66-35a0-4308-8bcc-d24c8ab8fdd8.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.2549&fp-y=0.6011&fp-z=2.3345&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=472&mark-y=300&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0yNTcmaD0yNTcmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D",
			alt: "Click on the ad you are interested in to view the details",
		},
		{
			id: 4,
			title: "View Details",
			subtitle:
				"Once in the ad details, you can view the ad details and even the shop",
			steps: ["View ad details", "Check shop information"],
			image:
				"https://images.tango.us/workflows/5d3ccfaa-585a-4a7c-a922-113e799d7c0c/steps/c8e02b8d-36be-4c62-9415-bf177aeda7e1/05e12a8d-f165-4390-833d-cb7c7a3e66d7.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=963&mark-y=605&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz03MyZoPTI5JmZpdD1jcm9wJmNvcm5lci1yYWRpdXM9MTA%3D",
			alt: "Once in the ad details, you can view the ad details and even the shop",
		},
		{
			id: 5,
			title: "Reveal Contact",
			subtitle: "Click on Reveal Seller Contact to get the seller contact",
			steps: ["Click Reveal Seller Contact", "Get seller contact information"],
			image:
				"https://images.tango.us/workflows/5d3ccfaa-585a-4a7c-a922-113e799d7c0c/steps/b39c1e22-fc57-4de4-9c0e-cd271741bbda/59f5906f-750a-4b01-9cf4-5989bd3a22ca.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.6866&fp-y=0.8070&fp-z=2.0012&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=153&mark-y=480&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz04OTUmaD05MiZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw",
			alt: "Click on Reveal Seller Contact to get the seller contact",
		},
		{
			id: 6,
			title: "Contact Seller",
			subtitle:
				"Once you have the contacts, you can contact the seller for negotiations and agreements",
			steps: ["Contact the seller", "Negotiate terms", "Make agreements"],
			image:
				"https://images.tango.us/workflows/5d3ccfaa-585a-4a7c-a922-113e799d7c0c/steps/c019f78a-ac1f-46e2-ab05-08443c8ca622/e0451555-fe35-40f1-970d-94184e07f2e0.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.6866&fp-y=0.8070&fp-z=2.0012&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=153&mark-y=480&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz04OTUmaD05MiZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw",
			alt: "Once you have the contacts, you can contact the seller for negotiations and agreements",
		},
	];

	const buyingProcess = [
		{
			icon: faUser,
			title: "View Seller Details",
			description:
				"Once registered, you can view seller phone numbers and contact details",
			iconBg: "bg-yellow-100",
			iconColor: "text-yellow-600",
		},
		{
			icon: faPhone,
			title: "Direct Communication",
			description:
				"Call, text, or email sellers directly to make inquiries and place orders",
			iconBg: "bg-yellow-100",
			iconColor: "text-yellow-600",
		},
		{
			icon: faCreditCard,
			title: "Negotiate & Arrange",
			description:
				"Negotiate prices, arrange delivery, or agree on pickup directly with the seller",
			iconBg: "bg-yellow-100",
			iconColor: "text-yellow-600",
		},
	];

	// SEO Implementation
	useSEO({
		title: "How to Access Seller Contact - Shopping Guide | Carbon Cube Kenya",
		description:
			"Learn how to browse products and access seller contact information on Carbon Cube Kenya. Step-by-step guide for contacting sellers directly and making purchases.",
		keywords:
			"how to shop Carbon Cube Kenya, seller contact, shopping process, buyer guide, Carbon Cube marketplace, Kenya online shopping, buyer registration, direct seller contact",
		url: `${window.location.origin}/how-to-shop`,
		type: "website",
		section: "Buyer Information",
		tags: [
			"Buyer Guide",
			"Shopping Process",
			"Buyer Registration",
			"Marketplace",
			"Online Shopping",
			"Kenya",
		],
		structuredData: {
			"@context": "https://schema.org",
			"@type": "HowTo",
			name: "How to Access Seller Contact on Carbon Cube Kenya",
			description:
				"Step-by-step guide for browsing products and contacting sellers directly",
			url: `${window.location.origin}/how-to-shop`,
			step: [
				{
					"@type": "HowToStep",
					name: "Sign In",
					text: "Visit Carbon Cube Kenya and sign in to your buyer account",
				},
				{
					"@type": "HowToStep",
					name: "Fill Form",
					text: "Fill the form and submit to sign in",
				},
				{
					"@type": "HowToStep",
					name: "Browse Ads",
					text: "Click on the ad you are interested in to view the details",
				},
				{
					"@type": "HowToStep",
					name: "View Details",
					text: "Once in the ad details, you can view the ad details and even the shop",
				},
				{
					"@type": "HowToStep",
					name: "Reveal Contact",
					text: "Click on Reveal Seller Contact to get the seller contact",
				},
				{
					"@type": "HowToStep",
					name: "Contact Seller",
					text: "Once you have the contacts, you can contact the seller for negotiations and agreements",
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
			audience: {
				"@type": "Audience",
				audienceType: "buyers, shoppers, consumers",
			},
		},
		conversationalKeywords: [
			"how to shop on Carbon Cube Kenya",
			"Carbon Cube Kenya buyer guide",
			"how to contact sellers Carbon Cube",
			"Kenya online shopping guide",
			"Carbon Cube marketplace shopping",
			"buyer registration Carbon Cube Kenya",
		],
		robots: "index, follow",
		canonical: `${window.location.origin}/how-to-shop`,
		alternate: {
			en: `${window.location.origin}/how-to-shop`,
		},
		openGraph: {
			title:
				"How to Access Seller Contact - Shopping Guide | Carbon Cube Kenya",
			description:
				"Learn how to browse products and access seller contact information on Carbon Cube Kenya. Step-by-step guide for contacting sellers directly.",
			type: "website",
			url: `${window.location.origin}/how-to-shop`,
			siteName: "Carbon Cube Kenya",
			locale: "en_KE",
			images: [
				{
					url: `${window.location.origin}/assets/banners/how-to-shop-guide.png`,
					width: 1200,
					height: 630,
					alt: "How to Shop Guide - Carbon Cube Kenya Buyer Guide",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			site: "@CarbonCubeKE",
			creator: "@CarbonCubeKE",
			title:
				"How to Access Seller Contact - Shopping Guide | Carbon Cube Kenya",
			description:
				"Learn how to browse products and access seller contact information on Carbon Cube Kenya. Step-by-step guide for contacting sellers directly.",
			image: `${window.location.origin}/assets/banners/how-to-shop-guide.png`,
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
				content: "buyers, shoppers, consumers",
			},
			{
				name: "audience",
				content: "general public, online shoppers",
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
							icon={faShoppingCart}
							className="text-2xl sm:text-3xl lg:text-4xl text-white"
						/>
					</div>
					<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-3 sm:mb-4 lg:mb-6 leading-tight">
						How to Shop
					</h1>
					<p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-black opacity-90 mb-4 sm:mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed">
						Complete guide for accessing seller contact information on Carbon
						Cube Kenya
					</p>
					<div
						className="bg-black text-yellow-400 rounded-full px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 inline-flex items-center gap-2 sm:gap-3 hover:bg-gray-900 transition-colors duration-300"
						onClick={() => (window.location.href = "/buyer-signup")}
						style={{ cursor: "pointer" }}
					>
						<FontAwesomeIcon
							icon={faShieldAlt}
							className="text-yellow-400 text-sm sm:text-base lg:text-lg"
						/>
						<span className="text-yellow-400 font-semibold text-sm sm:text-base lg:text-lg">
							Start Shopping for Free Today
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
								Start Your Shopping Journey
							</h2>
							<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
								Learn how to browse products and access seller contact
								information on Carbon Cube Kenya. Connect directly with sellers
								for negotiations and purchases.
							</p>
						</div>

						{/* Key Benefits */}
						<div>
							<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
								Why Shop With Us?
							</h3>
							<div className="grid sm:grid-cols-1 gap-2 sm:gap-3 lg:gap-4">
								<div className="flex items-center p-2 sm:p-3 lg:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
									<div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 flex-shrink-0">
										<FontAwesomeIcon
											icon={faCheckCircle}
											className="text-yellow-500 text-sm sm:text-base lg:text-lg"
										/>
									</div>
									<span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">
										Free Registration
									</span>
								</div>
								<div className="flex items-center p-2 sm:p-3 lg:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
									<div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 flex-shrink-0">
										<FontAwesomeIcon
											icon={faCheckCircle}
											className="text-yellow-500 text-sm sm:text-base lg:text-lg"
										/>
									</div>
									<span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">
										Direct Seller Contact
									</span>
								</div>
								<div className="flex items-center p-2 sm:p-3 lg:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
									<div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 flex-shrink-0">
										<FontAwesomeIcon
											icon={faCheckCircle}
											className="text-yellow-500 text-sm sm:text-base lg:text-lg"
										/>
									</div>
									<span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">
										No Middleman Fees
									</span>
								</div>
								<div className="flex items-center p-2 sm:p-3 lg:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
									<div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 flex-shrink-0">
										<FontAwesomeIcon
											icon={faCheckCircle}
											className="text-yellow-500 text-sm sm:text-base lg:text-lg"
										/>
									</div>
									<span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">
										Flexible Transactions
									</span>
								</div>
							</div>
						</div>

						{/* Call to Action */}
						<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 pt-2 sm:pt-3 lg:pt-4">
							<a
								href="/buyer-signup"
								className="bg-yellow-500 text-black px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg sm:rounded-xl font-semibold hover:bg-yellow-600 transition-colors text-center no-underline shadow-sm hover:shadow-md text-sm sm:text-base"
							>
								Start Shopping Now
							</a>
							<a
								href="/login"
								className="border-2 border-gray-300 text-gray-700 px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors text-center no-underline text-sm sm:text-base"
							>
								Already a Buyer?
							</a>
						</div>
					</div>

					<div className="text-center">
						<div className="aspect-w-4 aspect-h-3">
							<img
								src={howToShopGuide}
								alt="How to Shop Guide - Step by step process to start shopping on Carbon Cube Kenya"
								className="w-full h-120"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Shopping Process Steps */}
			<div className="mb-8 sm:mb-12 lg:mb-16 xl:mb-20">
				<div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16">
					<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
						How to Access Seller Contact
					</h2>
					<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4">
						Follow these steps to browse products and contact sellers directly
						on Carbon Cube Kenya
					</p>
				</div>

				<div className="max-w-6xl mx-auto">
					{/* Timeline container with progress line */}
					<div className="relative">
						{/* Progress line */}
						<div className="absolute left-6 sm:left-7 lg:left-8 top-0 bottom-0 w-0.5 bg-gray-300 hidden lg:block"></div>

						{/* Render timeline steps dynamically */}
						{shoppingSteps.map((step, index) => (
							<div
								key={step.id}
								className={`relative ${
									index < shoppingSteps.length - 1
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
														<div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
															<FontAwesomeIcon
																icon={faCheckCircle}
																className="text-yellow-500 text-xs sm:text-sm"
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

			{/* How Buying Works Section */}
			<div className="mb-8 sm:mb-12 lg:mb-16 xl:mb-20 px-2 lg:px-0">
				<div className="max-w-7xl mx-auto">
					<div className="text-left mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16">
						<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
							How Buying Works
						</h2>
						<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl leading-relaxed">
							Once registered, you can start shopping and connecting with
							sellers directly
						</p>
					</div>
				</div>

				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
						{buyingProcess.map((process, index) => (
							<div
								key={index}
								className="group bg-white rounded-xl lg:rounded-2xl p-2 lg:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg"
							>
								<div className="flex items-start space-x-4">
									<div
										className={`${process.iconBg} rounded-xl w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
									>
										<FontAwesomeIcon
											icon={process.icon}
											className={`${process.iconColor} text-xl lg:text-2xl`}
										/>
									</div>
									<div className="flex-1">
										<h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3">
											{process.title}
										</h3>
										<p className="text-sm lg:text-base text-gray-600 leading-relaxed">
											{process.description}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Important Information */}
			<div className="mb-8 sm:mb-12 lg:mb-16 xl:mb-20 px-2 lg:px-0">
				<div className="max-w-7xl mx-auto">
					<div className="text-left mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16">
						<div className="flex items-center space-x-3 mb-4 sm:mb-6">
							<div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
								<FontAwesomeIcon
									icon={faCheckCircle}
									className="text-lg sm:text-xl lg:text-2xl text-yellow-600"
								/>
							</div>
							<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">
								Important Information
							</h2>
						</div>
						<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl leading-relaxed">
							Understanding how transactions work on Carbon Cube Kenya
						</p>
					</div>
				</div>

				<div className="max-w-7xl mx-auto">
					<div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl lg:rounded-2xl p-2 lg:p-8">
						<div className="flex items-start space-x-4 lg:space-x-6">
							<div className="w-12 h-12 lg:w-14 lg:h-14 bg-yellow-200 rounded-xl flex items-center justify-center flex-shrink-0">
								<FontAwesomeIcon
									icon={faCheckCircle}
									className="text-lg lg:text-xl text-yellow-700"
								/>
							</div>
							<div className="flex-1">
								<h3 className="text-lg lg:text-xl font-bold text-yellow-800 mb-3 lg:mb-4">
									Direct Buyer-to-Seller Transactions
								</h3>
								<p className="text-sm lg:text-base text-yellow-700 leading-relaxed">
									Carbon Cube is not a middleman for payments. All transactions
									are buyer-to-seller directly, giving you flexibility and
									control over your purchases. This means you can negotiate
									terms, arrange delivery methods, and handle payments directly
									with sellers.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Call to Action */}
			<div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 px-2 lg:px-0">
				<div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-xl lg:rounded-2xl p-2 lg:p-8 max-w-7xl mx-auto border border-gray-700">
					<div className="text-left">
						<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 lg:mb-5">
							Ready to Start Shopping?
						</h2>
						<p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 sm:mb-7 lg:mb-8 max-w-2xl">
							Join thousands of satisfied customers on Carbon Cube Kenya and
							start connecting with sellers today.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
							<a
								href="/buyer-signup"
								className="bg-yellow-500 text-black px-6 py-3 lg:px-8 lg:py-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors no-underline text-center text-sm sm:text-base shadow-sm hover:shadow-md"
							>
								Sign Up Now
							</a>
							<a
								href="/login"
								className="border border-gray-400 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-lg font-semibold hover:bg-gray-800 hover:border-gray-500 transition-colors no-underline text-center text-sm sm:text-base"
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
};

export default HowToShop;
