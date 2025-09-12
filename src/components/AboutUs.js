import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBuilding,
	faShieldAlt,
	faCheckCircle,
	faLock,
	faRobot,
	faStore,
	faHandshake,
	faGlobe,
	faHeart,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useSEO from "../hooks/useSEO";

// Using public path for image
const AboutUsImage = "/assets/about-us.jpg";

const AboutUs = () => {
	// SEO Implementation
	useSEO({
		title: "About Us - Carbon Cube Kenya | Kenya's Trusted Marketplace",
		description:
			"Learn about Carbon Cube Kenya, Kenya's trusted digital marketplace. Discover our mission to connect verified sellers with buyers through secure, AI-powered tools.",
		keywords:
			"about Carbon Cube Kenya, Kenya marketplace, digital procurement, verified sellers, AI-powered marketplace, online shopping Kenya, Nairobi marketplace, Kenyan e-commerce, trusted sellers Kenya, digital marketplace Kenya, Carbon Cube company, Kenya online shopping platform",
		url: `${window.location.origin}/about-us`,
		type: "website",
		section: "Company",
		tags: ["About", "Company", "Mission", "Vision", "Kenya", "Marketplace"],
		structuredData: {
			"@context": "https://schema.org",
			"@type": "Organization",
			name: "Carbon Cube Kenya",
			description:
				"Kenya's trusted digital marketplace connecting verified sellers with buyers",
			url: `${window.location.origin}`,
			logo: `${window.location.origin}/assets/banners/carbon-cube-logo.png`,
			sameAs: [
				"https://www.linkedin.com/company/carbon-cube-kenya/?viewAsMember=true",
				"https://www.facebook.com/profile.php?id=61574066312678",
				"https://www.instagram.com/carboncube_kenya/",
			],
			contactPoint: {
				"@type": "ContactPoint",
				contactType: "customer service",
				availableLanguage: "English",
				areaServed: "KE",
				telephone: "+254-712-990524",
				email: "info@carboncube-ke.com",
			},
			address: {
				"@type": "PostalAddress",
				streetAddress: "9th Floor, CMS Africa, Kilimani",
				addressLocality: "Nairobi",
				addressRegion: "Nairobi",
				addressCountry: "KE",
				postalCode: "00100",
			},
			foundingDate: "2023",
			numberOfEmployees: {
				"@type": "QuantitativeValue",
				minValue: 2,
				maxValue: 10,
			},
			industry: "Internet Marketplace Platforms",
		},
		conversationalKeywords: [
			"about Carbon Cube Kenya",
			"Carbon Cube Kenya company",
			"Kenya marketplace story",
			"Carbon Cube mission vision",
			"online shopping Kenya",
			"what is Carbon Cube Kenya",
			"Carbon Cube Kenya marketplace",
			"Kenya digital marketplace",
			"Nairobi online shopping",
			"Kenyan e-commerce platform",
			"Carbon Cube Kenya sellers",
			"trusted marketplace Kenya",
		],
		robots: "index, follow",
		canonical: `${window.location.origin}/about-us`,
		alternate: {
			en: `${window.location.origin}/about-us`,
		},
		openGraph: {
			title: "About Us - Carbon Cube Kenya | Kenya's Trusted Marketplace",
			description:
				"Learn about Carbon Cube Kenya, Kenya's trusted digital marketplace. Discover our mission to connect verified sellers with buyers through secure, AI-powered tools.",
			type: "website",
			url: `${window.location.origin}/about-us`,
			siteName: "Carbon Cube Kenya",
			locale: "en_KE",
			images: [
				{
					url: `${window.location.origin}/assets/banners/carbon-cube-logo.png`,
					width: 1200,
					height: 630,
					alt: "About Carbon Cube Kenya",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			site: "@CarbonCubeKE",
			creator: "@CarbonCubeKE",
			title: "About Us - Carbon Cube Kenya | Kenya's Trusted Marketplace",
			description:
				"Learn about Carbon Cube Kenya, Kenya's trusted digital marketplace. Discover our mission to connect verified sellers with buyers.",
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
				content: "customers, partners, general public",
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

	return (
		<>
			<Navbar mode="minimal" showSearch={false} showCategories={false} />

			{/* 1. Hero Section - Introduction */}
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
							icon={faBuilding}
							className="text-2xl sm:text-3xl lg:text-4xl text-white"
						/>
					</div>
					<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-3 sm:mb-4 lg:mb-6 leading-tight">
						About Carbon Cube Kenya
					</h1>
					<p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-black opacity-90 mb-4 sm:mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed">
						Kenya's Trusted Digital Marketplace
					</p>
					<div
						className="bg-black text-yellow-400 rounded-full px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 inline-flex items-center gap-2 sm:gap-3 hover:bg-gray-900 transition-colors duration-300"
						onClick={() => (window.location.href = "/")}
						style={{ cursor: "pointer" }}
					>
						<FontAwesomeIcon
							icon={faShieldAlt}
							className="text-yellow-400 text-sm sm:text-base lg:text-lg"
						/>
						<span className="text-yellow-400 font-semibold text-sm sm:text-base lg:text-lg">
							Explore Marketplace
						</span>
					</div>
				</div>
			</section>

			{/* 2. Our Promise Section - Commitment First */}
			<section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
						<div>
							<div className="space-y-6 sm:space-y-8">
								<div>
									<div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold mb-4">
										<FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
										Our Promise
									</div>
									<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
										Our Commitment to You
									</h2>
								</div>
								<div className="space-y-4 sm:space-y-6">
									<p className="text-gray-600 leading-relaxed">
										We're building a safe, future-ready marketplace where
										Kenyans can buy and sell with complete confidence. Whether
										you're a buyer seeking reliable products or a seller ready
										to grow your business, Carbon Cube Kenya is designed with
										your success as our priority.
									</p>
									<p className="text-gray-600 leading-relaxed">
										We're constantly evolving — guided by AI innovation,
										valuable user feedback, and rigorous quality assurance — to
										deliver a marketplace built on trust, transparency, and
										unlimited opportunity for all Kenyans.
									</p>
								</div>
								<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
									<button
										onClick={() => (window.location.href = "/become-a-seller")}
										className="bg-black text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 text-sm sm:text-base"
									>
										Join the Marketplace
									</button>
									<button
										onClick={() => (window.location.href = "/contact-us")}
										className="border border-gray-300 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
									>
										Learn More
									</button>
								</div>
							</div>
						</div>
						<div>
							<img
								src={AboutUsImage}
								alt="Carbon Cube Kenya Marketplace"
								className="w-full h-auto rounded-xl sm:rounded-2xl shadow-sm"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* 3. Vision & Mission Section - Core Foundation */}
			<section className="py-8 sm:py-12 lg:py-16 bg-white">
				<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
					<div className="text-center mb-8 sm:mb-12 lg:mb-16">
						<p className="text-sm text-gray-500 mb-2">/our foundation/</p>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
							Our Foundation
						</h2>
						<p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
							Built on trust, powered by innovation
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
						{/* Vision Card */}
						<div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 transition-colors duration-300">
							<div className="flex items-start space-x-4 sm:space-x-6">
								<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
									<FontAwesomeIcon
										icon={faGlobe}
										className="text-black text-lg sm:text-xl"
									/>
								</div>
								<div>
									<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
										Our Vision
									</h3>
									<p className="text-gray-600 leading-relaxed">
										To be Kenya's most trusted and innovative online
										marketplace, setting the standard for digital commerce
										across East Africa and empowering local businesses to
										compete globally.
									</p>
								</div>
							</div>
						</div>

						{/* Mission Card */}
						<div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 transition-colors duration-300">
							<div className="flex items-start space-x-4 sm:space-x-6">
								<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
									<FontAwesomeIcon
										icon={faHandshake}
										className="text-black text-lg sm:text-xl"
									/>
								</div>
								<div>
									<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
										Our Mission
									</h3>
									<p className="text-gray-600 leading-relaxed">
										To build Kenya's most secure and intelligent digital
										marketplace by leveraging AI and strict verification systems
										to connect trusted, independent sellers with buyers,
										fostering economic growth and digital inclusion.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 4. Company Story Section - Our Journey */}
			<section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
					<div className="text-center mb-8 sm:mb-12 lg:mb-16">
						<p className="text-sm text-gray-500 mb-2">/our story/</p>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
							Building Kenya's Future of Commerce
						</h2>
						<p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
							Founded in 2023, Carbon Cube Kenya emerged from a vision to create
							Kenya's most trusted and innovative digital marketplace. We
							believe in empowering local businesses while providing consumers
							with unmatched security and convenience.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
						<div className="order-2 lg:order-1">
							<div className="space-y-6 sm:space-y-8">
								<div>
									<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
										Our Journey
									</h3>
									<p className="text-gray-600 leading-relaxed">
										Starting with a small team of passionate innovators, we've
										built a platform that combines cutting-edge AI technology
										with rigorous verification systems to create a marketplace
										where trust is paramount.
									</p>
								</div>
								<div>
									<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
										Our Impact
									</h3>
									<p className="text-gray-600 leading-relaxed">
										Today, we're proud to connect over 100 active sellers with
										thousands of customers across Kenya, fostering economic
										growth and digital inclusion in our communities.
									</p>
								</div>
								<div>
									<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
										Made in Kenya, For Kenya
									</h3>
									<p className="text-gray-600 leading-relaxed">
										We're not just another marketplace. We're a Kenyan company
										building solutions specifically for Kenyan businesses and
										consumers, understanding local needs and challenges.
									</p>
								</div>
							</div>
						</div>
						<div className="order-1 lg:order-2">
							<div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 border border-gray-200">
								<div className="text-center">
									<div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
										<FontAwesomeIcon
											icon={faHeart}
											className="text-black text-xl sm:text-2xl"
										/>
									</div>
									<h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
										Community First
									</h4>
									<p className="text-gray-600 leading-relaxed">
										We believe in the power of community. Every feature we
										build, every policy we create, and every decision we make is
										guided by our commitment to serving Kenya's vibrant business
										community.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 5. Why Choose Us Section - Value Propositions */}
			<section className="py-8 sm:py-12 lg:py-16 bg-white">
				<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
					<div className="text-center mb-8 sm:mb-12 lg:mb-16">
						<p className="text-sm text-gray-500 mb-2">/why choose us/</p>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
							Why Choose Carbon Cube?
						</h2>
						<p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
							Experience the future of online shopping in Kenya
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
						{/* Trusted Marketplace */}
						<div className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 text-center">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
								<FontAwesomeIcon
									icon={faStore}
									className="text-black text-lg sm:text-xl"
								/>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
								Trusted Marketplace
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
								Discover reliable, verified products from a wide community of
								independent Kenyan sellers with guaranteed authenticity and
								quality assurance.
							</p>
						</div>

						{/* AI-Powered Experience */}
						<div className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 text-center">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
								<FontAwesomeIcon
									icon={faRobot}
									className="text-black text-lg sm:text-xl"
								/>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
								AI-Powered Experience
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
								Smart recommendations, fraud detection, and personalized
								shopping experiences powered by cutting-edge artificial
								intelligence technology.
							</p>
						</div>

						{/* Verified Sellers */}
						<div className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 text-center">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
								<FontAwesomeIcon
									icon={faCheckCircle}
									className="text-black text-lg sm:text-xl"
								/>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
								Verified Sellers
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
								Shop confidently through our robust seller verification system
								that promotes safety, quality, and trust in every transaction
								and interaction.
							</p>
						</div>

						{/* Secure Transactions */}
						<div className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 text-center">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
								<FontAwesomeIcon
									icon={faLock}
									className="text-black text-lg sm:text-xl"
								/>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
								Secure Transactions
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
								Your payments and personal data are protected using bank-grade,
								encrypted security technology you can trust for all your
								marketplace activities.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* 6. Stats Section - Proof of Success */}
			<section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
					<div className="text-center mb-8 sm:mb-12 lg:mb-16">
						<p className="text-sm text-gray-500 mb-2">/our impact/</p>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
							Growing Together
						</h2>
						<p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
							Numbers that reflect our commitment to Kenya's digital economy
						</p>
					</div>

					<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
						<div className="text-center">
							<div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
								<h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-400 mb-2 sm:mb-3">
									100+
								</h3>
								<p className="text-gray-600 font-semibold text-sm sm:text-base">
									Active Sellers
								</p>
							</div>
						</div>
						<div className="text-center">
							<div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
								<h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-400 mb-2 sm:mb-3">
									1,000+
								</h3>
								<p className="text-gray-600 font-semibold text-sm sm:text-base">
									Products Listed
								</p>
							</div>
						</div>
						<div className="text-center">
							<div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
								<h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-400 mb-2 sm:mb-3">
									99.9%
								</h3>
								<p className="text-gray-600 font-semibold text-sm sm:text-base">
									Uptime Guarantee
								</p>
							</div>
						</div>
						<div className="text-center">
							<div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
								<h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-400 mb-2 sm:mb-3">
									24/7
								</h3>
								<p className="text-gray-600 font-semibold text-sm sm:text-base">
									Customer Support
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</>
	);
};

export default AboutUs;
