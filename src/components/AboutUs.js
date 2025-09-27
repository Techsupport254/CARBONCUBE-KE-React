import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCheckCircle,
	faLock,
	faRobot,
	faStore,
	faHandshake,
	faAward,
	faChartLine,
	faShield,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import StaticPageSEO from "./StaticPageSEO";

// Using public path for image
const AboutUsImage = "/assets/about-us.jpg";

const AboutUs = () => {
	// Prepare page data for SEO
	const pageData = {
		title: "About Us - Carbon Cube Kenya | Kenya's Trusted Marketplace",
		description:
			"Learn about Carbon Cube Kenya, Kenya's trusted digital marketplace connecting verified sellers with buyers. Discover our mission, team, and commitment to secure, AI-powered e-commerce solutions across Kenya.",
		keywords: [
			"about Carbon Cube Kenya",
			"Kenya marketplace company",
			"digital procurement platform",
			"verified sellers Kenya",
			"AI-powered marketplace",
			"online shopping Kenya",
			"Nairobi marketplace",
			"Kenyan e-commerce platform",
			"trusted sellers Kenya",
			"digital marketplace Kenya",
			"Carbon Cube company Kenya",
			"Kenya online shopping platform",
			"e-commerce Kenya",
			"marketplace Kenya",
			"online store Kenya",
			"digital shopping Kenya",
		],
		image: AboutUsImage,
		url: `${window.location.origin}/about-us`,
		section: "About",
		tags: ["About", "Company", "Team", "Mission", "Kenya", "Marketplace"],
	};

	return (
		<>
			<StaticPageSEO pageType="about" pageData={pageData} />
			<Navbar mode="minimal" showSearch={false} showCategories={false} />

			{/* Hero Section - Standard Typography */}
			<section
				className="py-16 sm:py-20 lg:py-24 text-dark position-relative overflow-hidden"
				style={{ backgroundColor: "#ffc107" }}
			>
				{/* Subtle background pattern */}
				<div className="position-absolute top-0 start-0 w-100 h-100 opacity-60">
					<div
						style={{
							background:
								"repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px)",
							width: "100%",
							height: "100%",
						}}
					></div>
				</div>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center position-relative">
					<div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-black rounded-full mx-auto mb-6 sm:mb-8 flex items-center justify-center border-2 sm:border-4 border-white shadow-lg">
						<FontAwesomeIcon
							icon={faStore}
							className="text-2xl sm:text-3xl lg:text-4xl text-white"
						/>
					</div>
					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
						About Us
					</h1>
					<p className="text-lg sm:text-xl lg:text-2xl text-black opacity-90 max-w-3xl mx-auto leading-relaxed">
						Kenya's Trusted Digital Marketplace
					</p>
				</div>
			</section>

			{/* Commitment Section - Standard Layout */}
			<section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
						<div>
							<div className="inline-flex items-center bg-yellow-500 text-gray-900 px-4 py-2 rounded-full mb-6 lg:mb-8">
								<FontAwesomeIcon icon={faShield} className="mr-2" />
								<span className="font-semibold text-sm">Our Promise</span>
							</div>
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 lg:mb-8">
								Our Commitment to You
							</h2>
							<div className="space-y-4 lg:space-y-6">
								<p className="text-base lg:text-lg text-gray-600 leading-relaxed">
									We're building a safe, future-ready marketplace where Kenyans
									can buy and sell with complete confidence. Whether you're a
									buyer seeking reliable products or a seller ready to grow your
									business, CarbonCube Kenya is designed with your success as
									our priority.
								</p>
								<p className="text-base lg:text-lg text-gray-600 leading-relaxed">
									We're constantly evolving — guided by AI innovation, valuable
									user feedback, and rigorous quality assurance — to deliver a
									marketplace built on trust, transparency, and unlimited
									opportunity.
								</p>
							</div>
							<div className="flex flex-col sm:flex-row gap-4 mt-8 lg:mt-10">
								<button className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-full text-base font-semibold hover:bg-yellow-600 transition-colors">
									Join the Marketplace
								</button>
								<button
									onClick={() => {
										document.getElementById("why-choose-us")?.scrollIntoView({
											behavior: "smooth",
										});
									}}
									className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full text-base font-semibold hover:bg-gray-50 transition-colors"
								>
									Learn More
								</button>
							</div>
						</div>
						<div className="flex justify-center lg:justify-end">
							<img
								src={AboutUsImage}
								alt="Marketplace Illustration"
								className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl rounded-xl lg:rounded-2xl shadow-lg object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Mission & Vision - Standard Layout */}
			<section className="py-16 sm:py-20 lg:py-24 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12 lg:mb-16">
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
							Our Foundation
						</h2>
						<p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
							Built on trust, powered by innovation
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
						{/* Vision */}
						<div className="bg-gray-50 rounded-2xl lg:rounded-3xl p-6 lg:p-8 relative overflow-hidden">
							<div className="absolute top-4 right-4 lg:top-6 lg:right-6">
								<FontAwesomeIcon
									icon={faChartLine}
									className="text-2xl lg:text-3xl text-yellow-500 opacity-30"
								/>
							</div>
							<div className="flex items-center mb-4 lg:mb-6">
								<div className="bg-yellow-500 rounded-full p-3 lg:p-4 mr-4">
									<FontAwesomeIcon
										icon={faAward}
										className="text-xl lg:text-2xl text-gray-900"
									/>
								</div>
								<h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
									Our Vision
								</h3>
							</div>
							<p className="text-base lg:text-lg text-gray-600 leading-relaxed">
								To be Kenya's most trusted and innovative online marketplace,
								setting the standard for digital commerce across East Africa.
							</p>
						</div>

						{/* Mission */}
						<div className="bg-gray-50 rounded-2xl lg:rounded-3xl p-6 lg:p-8 relative overflow-hidden">
							<div className="absolute top-4 right-4 lg:top-6 lg:right-6">
								<FontAwesomeIcon
									icon={faHandshake}
									className="text-2xl lg:text-3xl text-yellow-500 opacity-30"
								/>
							</div>
							<div className="flex items-center mb-4 lg:mb-6">
								<div className="bg-yellow-500 rounded-full p-3 lg:p-4 mr-4">
									<FontAwesomeIcon
										icon={faCheckCircle}
										className="text-xl lg:text-2xl text-gray-900"
									/>
								</div>
								<h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
									Our Mission
								</h3>
							</div>
							<p className="text-base lg:text-lg text-gray-600 leading-relaxed">
								To build Kenya's most secure and intelligent digital marketplace
								by leveraging AI and strict verification systems to connect
								trusted, independent sellers with buyers.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Why Choose Us - Standard Grid */}
			<section
				id="why-choose-us"
				className="py-16 sm:py-20 lg:py-24 bg-gray-50"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12 lg:mb-16">
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
							Why Choose CarbonCube?
						</h2>
						<p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
							Experience the future of online shopping in Kenya
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
						<div className="bg-white rounded-2xl p-6 lg:p-8 text-center hover-lift">
							<div className="bg-yellow-100 rounded-full w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-4 lg:mb-6">
								<FontAwesomeIcon
									icon={faStore}
									className="text-xl lg:text-2xl text-yellow-600"
								/>
							</div>
							<h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">
								Trusted Marketplace
							</h3>
							<p className="text-sm lg:text-base text-gray-600">
								Discover reliable, verified products from a wide community of
								independent Kenyan sellers with guaranteed authenticity.
							</p>
						</div>

						<div className="bg-white rounded-2xl p-6 lg:p-8 text-center hover-lift">
							<div className="bg-yellow-100 rounded-full w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-4 lg:mb-6">
								<FontAwesomeIcon
									icon={faRobot}
									className="text-xl lg:text-2xl text-yellow-600"
								/>
							</div>
							<h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">
								AI-Powered Experience
							</h3>
							<p className="text-sm lg:text-base text-gray-600">
								Smart recommendations, fraud detection, and personalized
								shopping — all powered by cutting-edge AI solutions.
							</p>
						</div>

						<div className="bg-white rounded-2xl p-6 lg:p-8 text-center hover-lift">
							<div className="bg-yellow-100 rounded-full w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-4 lg:mb-6">
								<FontAwesomeIcon
									icon={faCheckCircle}
									className="text-xl lg:text-2xl text-yellow-600"
								/>
							</div>
							<h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">
								Verified Sellers
							</h3>
							<p className="text-sm lg:text-base text-gray-600">
								Shop confidently through our robust seller verification system
								that promotes safety, quality, and trust.
							</p>
						</div>

						<div className="bg-white rounded-2xl p-6 lg:p-8 text-center hover-lift">
							<div className="bg-yellow-100 rounded-full w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-4 lg:mb-6">
								<FontAwesomeIcon
									icon={faLock}
									className="text-xl lg:text-2xl text-yellow-600"
								/>
							</div>
							<h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">
								Secure Transactions
							</h3>
							<p className="text-sm lg:text-base text-gray-600">
								Your payments and personal data are protected using bank-grade,
								encrypted security technology.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section - Standard Numbers */}
			<section className="py-16 sm:py-20 lg:py-24 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12 lg:mb-16">
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
							Our Impact
						</h2>
						<p className="text-lg sm:text-xl text-gray-600">
							Growing together with Kenya's digital economy
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 text-center">
						<div className="space-y-4">
							<h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-yellow-600">
								15+
							</h3>
							<p className="text-base sm:text-lg text-gray-600">
								Verified Sellers
							</p>
						</div>
						<div className="space-y-4">
							<h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-yellow-600">
								700+
							</h3>
							<p className="text-base sm:text-lg text-gray-600">
								Products Listed
							</p>
						</div>
						<div className="space-y-4">
							<h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-yellow-600">
								99.9%
							</h3>
							<p className="text-base sm:text-lg text-gray-600">
								Uptime Guarantee
							</p>
						</div>
					</div>
				</div>
			</section>

			<Footer />

			<style jsx>{`
				.hover-lift {
					transition: transform 0.3s ease, box-shadow 0.3s ease;
				}
				.hover-lift:hover {
					transform: translateY(-5px);
					box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
				}
			`}</style>
		</>
	);
};

export default AboutUs;
