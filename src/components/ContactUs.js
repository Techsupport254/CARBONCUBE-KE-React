import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faShieldAlt,
	faMapMarkerAlt,
	faClock,
	faCheckCircle,
	faExclamationTriangle,
	faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
	faFacebook,
	faLinkedin,
	faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useSEO from "../hooks/useSEO";

const ContactUs = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus(null);

		try {
			const response = await fetch(
				`${
					process.env.REACT_APP_BACKEND_URL || "https://carboncube-ke.com"
				}/contact/submit`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				}
			);

			const result = await response.json();

			if (response.ok && result.success) {
				setSubmitStatus("success");
				// Clear form after successful submission
				setFormData({
					name: "",
					email: "",
					phone: "",
					subject: "",
					message: "",
				});
			} else {
				setSubmitStatus("error");
				console.error(
					"Contact form error:",
					result.error || result.message || "Unknown error"
				);
			}
		} catch (error) {
			setSubmitStatus("error");
			console.error("Network error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	// SEO Implementation
	useSEO({
		title: "Contact Us - Carbon Cube Kenya | Get Support & Help",
		description:
			"Get in touch with Carbon Cube Kenya for support, partnerships, and inquiries. Contact us via phone, email, or visit our Nairobi office. We're here to help!",
		keywords:
			"contact Carbon Cube Kenya, customer support, Kenya marketplace support, help desk, Nairobi office, Carbon Cube contact information",
		url: `${window.location.origin}/contact-us`,
		type: "website",
		section: "Support",
		tags: ["Contact", "Support", "Help", "Customer Service", "Nairobi"],
		structuredData: {
			"@context": "https://schema.org",
			"@type": "ContactPage",
			name: "Contact Carbon Cube Kenya",
			description:
				"Get in touch with Carbon Cube Kenya for support and inquiries",
			url: `${window.location.origin}/contact-us`,
			mainEntity: {
				"@type": "Organization",
				name: "Carbon Cube Kenya",
				contactPoint: [
					{
						"@type": "ContactPoint",
						contactType: "customer service",
						telephone: "+254 712 990 524",
						availableLanguage: "English",
						areaServed: "KE",
						hoursAvailable: {
							"@type": "OpeningHoursSpecification",
							dayOfWeek: [
								"Monday",
								"Tuesday",
								"Wednesday",
								"Thursday",
								"Friday",
							],
							opens: "08:00",
							closes: "17:00",
						},
					},
					{
						"@type": "ContactPoint",
						contactType: "customer service",
						email: "info@carboncube-ke.com",
						availableLanguage: "English",
					},
				],
				address: {
					"@type": "PostalAddress",
					streetAddress: "9th Floor, CMS Africa, Kilimani",
					addressLocality: "Nairobi",
					addressRegion: "Nairobi",
					addressCountry: "KE",
					postalCode: "00100",
				},
			},
		},
		conversationalKeywords: [
			"how to contact Carbon Cube Kenya",
			"Carbon Cube Kenya customer support",
			"Nairobi office Carbon Cube",
			"Carbon Cube help desk",
			"Carbon Cube contact information",
		],
		robots: "index, follow",
		canonical: `${window.location.origin}/contact-us`,
		alternate: {
			en: `${window.location.origin}/contact-us`,
		},
		openGraph: {
			title: "Contact Us - Carbon Cube Kenya | Get Support & Help",
			description:
				"Get in touch with Carbon Cube Kenya for support, partnerships, and inquiries. Contact us via phone, email, or visit our Nairobi office.",
			type: "website",
			url: `${window.location.origin}/contact-us`,
			siteName: "Carbon Cube Kenya",
			locale: "en_KE",
			images: [
				{
					url: `${window.location.origin}/assets/banners/carbon-cube-logo.png`,
					width: 1200,
					height: 630,
					alt: "Contact Carbon Cube Kenya",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			site: "@CarbonCubeKE",
			creator: "@CarbonCubeKE",
			title: "Contact Us - Carbon Cube Kenya | Get Support & Help",
			description:
				"Get in touch with Carbon Cube Kenya for support, partnerships, and inquiries. We're here to help!",
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
				<div className="container mx-auto px-2 sm:px-4 text-center position-relative max-w-6xl">
					<div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white rounded-full mx-auto mb-4 sm:mb-6 lg:mb-8 flex items-center justify-center border-2 sm:border-4 border-black shadow-sm">
						<FontAwesomeIcon
							icon={faEnvelope}
							className="text-black text-2xl sm:text-3xl lg:text-4xl"
						/>
					</div>
					<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-3 sm:mb-4 lg:mb-6 leading-tight">
						Contact Us
					</h1>
					<p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-black opacity-90 mb-4 sm:mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed">
						We're here to help! Get in touch with our team for support,
						partnerships, or any questions you may have.
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

			{/* Contact Information and Form Section */}
			<section className="py-8 sm:py-12 lg:py-16 bg-white">
				<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
						{/* Contact Information (Second on mobile) */}
						<div className="lg:order-1">
							<div className="p-0 sm:p-6 lg:p-8">
								<div>
									<div className="flex items-center gap-3 mb-4">
										<img
											src="https://carboncube-ke.com/logo.png"
											alt="Carbon Cube Kenya"
											className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
											onError={(e) => {
												e.target.style.display = "none";
											}}
										/>
										<p className="text-sm text-gray-500">/get in touch/</p>
									</div>
									<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
										We're here to help you succeed on our marketplace
									</h2>
									<p className="text-gray-600 leading-relaxed">
										Connect with Carbon Cube Kenya for support, partnerships,
										and marketplace assistance. We're committed to helping you
										succeed in Kenya's premier online marketplace.
									</p>
								</div>

								{/* Contact Details */}
								<div className="space-y-6 sm:space-y-8">
									{/* Call Center */}
									<div>
										<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
											Call Center
										</h3>
										<div className="space-y-2">
											<p className="text-gray-700 text-sm sm:text-base">
												+254 712 990 524
											</p>
											<p className="text-gray-700 text-sm sm:text-base">
												Mon - Fri, 8 AM - 5 PM EAT
											</p>
										</div>
									</div>

									{/* Our Location */}
									<div>
										<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
											Our Location
										</h3>
										<p className="text-gray-700 text-sm sm:text-base">
											9th Floor, CMS Africa, Kilimani, Nairobi, Kenya
										</p>
									</div>

									{/* Email */}
									<div>
										<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
											Email
										</h3>
										<p className="text-gray-700 text-sm sm:text-base">
											info@carboncube-ke.com
										</p>
									</div>

									{/* Social Network */}
									<div>
										<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
											Social Network
										</h3>
										<div className="flex space-x-4 sm:space-x-6">
											<a
												href="https://www.facebook.com/profile.php?id=61574066312678"
												target="_blank"
												rel="noopener noreferrer"
												className="text-gray-600 hover:text-yellow-500 transition-colors p-2 hover:bg-gray-100 rounded-lg"
												aria-label="Follow us on Facebook"
											>
												<FontAwesomeIcon
													icon={faFacebook}
													className="text-xl sm:text-2xl lg:text-3xl"
												/>
											</a>
											<a
												href="https://www.linkedin.com/company/carbon-cube-kenya/?viewAsMember=true"
												target="_blank"
												rel="noopener noreferrer"
												className="text-gray-600 hover:text-yellow-500 transition-colors p-2 hover:bg-gray-100 rounded-lg"
												aria-label="Connect with us on LinkedIn"
											>
												<FontAwesomeIcon
													icon={faLinkedin}
													className="text-xl sm:text-2xl lg:text-3xl"
												/>
											</a>
											<a
												href="https://www.instagram.com/carboncube_kenya/"
												target="_blank"
												rel="noopener noreferrer"
												className="text-gray-600 hover:text-yellow-500 transition-colors p-2 hover:bg-gray-100 rounded-lg"
												aria-label="Follow us on Instagram"
											>
												<FontAwesomeIcon
													icon={faInstagram}
													className="text-xl sm:text-2xl lg:text-3xl"
												/>
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Contact Form (First on mobile) */}
						<div className="lg:order-2">
							<div className="bg-gray-50 rounded-xl sm:rounded-2xl p-2 sm:p-6 lg:p-8">
								<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
									Get in Touch
								</h3>
								<p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
									Have a question about selling on our marketplace or need
									support? Fill out the form below and we'll get back to you as
									soon as possible.
								</p>

								{/* Success/Error Messages */}
								{submitStatus === "success" && (
									<div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
										<FontAwesomeIcon
											icon={faCheckCircle}
											className="text-green-600 mr-3 text-lg mt-0.5 flex-shrink-0"
										/>
										<div>
											<h4 className="text-green-800 font-semibold">
												Message Sent Successfully!
											</h4>
											<p className="text-green-700 text-sm">
												Thank you for contacting us! We've received your message
												and will get back to you within 24 hours. Please check
												your email for a confirmation.
											</p>
										</div>
									</div>
								)}

								{submitStatus === "error" && (
									<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
										<FontAwesomeIcon
											icon={faExclamationTriangle}
											className="text-red-600 mr-3 text-lg mt-0.5 flex-shrink-0"
										/>
										<div>
											<h4 className="text-red-800 font-semibold">
												Error Sending Message
											</h4>
											<p className="text-red-700 text-sm">
												There was an error sending your message. Please try
												again in a few moments, or contact us directly at{" "}
												<a
													href="mailto:info@carboncube-ke.com"
													className="text-red-700 underline hover:text-red-900"
												>
													info@carboncube-ke.com
												</a>{" "}
												or call +254 712 990 524.
											</p>
										</div>
									</div>
								)}

								<form onSubmit={handleSubmit} className="space-y-4">
									{/* Full Name */}
									<div>
										<input
											type="text"
											name="name"
											value={formData.name}
											onChange={handleInputChange}
											required
											className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-sm sm:text-base"
											placeholder="Your full name"
										/>
									</div>

									{/* Email */}
									<div>
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											required
											className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-sm sm:text-base"
											placeholder="Your email address"
										/>
									</div>

									{/* Subject */}
									<div>
										<input
											type="text"
											name="subject"
											value={formData.subject}
											onChange={handleInputChange}
											required
											className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-sm sm:text-base"
											placeholder="What can we help you with?"
										/>
									</div>

									{/* Message */}
									<div>
										<textarea
											name="message"
											value={formData.message}
											onChange={handleInputChange}
											required
											rows={4}
											className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 resize-none text-sm sm:text-base"
											placeholder="Tell us about your inquiry or how we can help you with our marketplace..."
										/>
									</div>

									{/* Submit Button */}
									<button
										type="submit"
										disabled={isSubmitting}
										className="w-full bg-black text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm sm:text-base border border-black hover:border-gray-800"
									>
										{isSubmitting ? (
											<>
												<svg
													className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												Sending Message...
											</>
										) : (
											<>&gt; Send message</>
										)}
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Map Section */}
			<section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
					<div className="text-center mb-8 sm:mb-12 lg:mb-16">
						<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
							Find Us
						</h2>
						<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
							Visit our office in Nairobi's Kilimani area. We're located on the
							9th floor of CMS Africa.
						</p>
					</div>

					<div className="bg-white rounded-xl lg:rounded-2xl overflow-hidden shadow-lg">
						<div className="h-96 lg:h-[500px]">
							<iframe
								title="CMS Africa House, Kilimani - Carbon Cube Kenya Office"
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7995958858055!2d36.787293276026126!3d-1.294788035637667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10969d1409f1%3A0x9cb370689cc9135e!2sCMS-Africa!5e0!3m2!1sen!2ske!4v1754370979247!5m2!1sen!2ske"
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowFullScreen=""
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
							></iframe>
						</div>
						<div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-gray-50 to-white">
							<div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8">
								<div className="flex items-center space-x-2 sm:space-x-3">
									<FontAwesomeIcon
										icon={faMapMarkerAlt}
										className="text-yellow-600 text-base sm:text-lg"
									/>
									<span className="text-gray-700 font-semibold text-sm sm:text-base text-center sm:text-left">
										9th Floor, CMS Africa, Kilimani
									</span>
								</div>
								<div className="flex items-center space-x-2 sm:space-x-3">
									<FontAwesomeIcon
										icon={faClock}
										className="text-yellow-600 text-base sm:text-lg"
									/>
									<span className="text-gray-700 font-semibold text-sm sm:text-base text-center sm:text-left">
										Mon - Fri, 9 AM - 5 PM
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-8 sm:py-12 lg:py-16 bg-white">
				<div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8">
					<div className="text-center mb-8 sm:mb-12 lg:mb-16">
						<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
							Frequently Asked Questions
						</h2>
						<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
							Quick answers to common questions about Carbon Cube Kenya
						</p>
					</div>

					<div className="space-y-4 lg:space-y-6">
						{[
							{
								question: "How do I become a seller on Carbon Cube Kenya?",
								answer:
									"Visit our Become a Seller page to learn about the registration process. You can start selling for free with our Free tier, which allows up to 10 product listings.",
							},
							{
								question: "What payment methods do you accept?",
								answer:
									"We accept M-Pesa payments for seller subscriptions. Use paybill number 4160265 to upgrade your seller tier. For product purchases, buyers contact sellers directly.",
							},
							{
								question: "How do I contact a seller about a product?",
								answer:
									"Sign up as a buyer, browse products, and click 'Reveal Seller Contact' to get the seller's contact information. You can then contact them directly for negotiations.",
							},
							{
								question: "What are your business hours?",
								answer:
									"Our customer support is available Monday to Friday, 8 AM to 5 PM East Africa Time. You can reach us via phone, email, or visit our Nairobi office.",
							},
							{
								question: "Do you handle payments between buyers and sellers?",
								answer:
									"No, Carbon Cube Kenya does not handle payments between buyers and sellers. All transactions are direct between buyers and sellers, giving you full control over your purchases.",
							},
						].map((faq, index) => (
							<div
								key={index}
								className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl lg:rounded-2xl p-4 lg:p-6 hover:border-gray-300 transition-all duration-300"
							>
								<h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">
									{faq.question}
								</h3>
								<p className="text-sm lg:text-base text-gray-600 leading-relaxed">
									{faq.answer}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<Footer />
		</>
	);
};

export default ContactUs;
