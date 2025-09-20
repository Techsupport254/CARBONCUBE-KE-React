import React from "react";

/**
 * GoogleMyBusinessOptimization Component
 * Provides guidance and structured data for Google My Business optimization
 */
const GoogleMyBusinessOptimization = () => {
	// Google My Business optimization checklist
	const optimizationChecklist = [
		{
			title: "Business Information",
			items: [
				"Complete business name: 'Carbon Cube Kenya'",
				"Add business description with local keywords",
				"Set correct business category: 'Online Marketplace' or 'E-commerce Platform'",
				"Add business hours (24/7 for online business)",
				"Include phone number: +254 712 990 524",
				"Add website URL: https://carboncube-ke.com",
				"Add business email: info@carboncube-ke.com",
			],
		},
		{
			title: "Location & Service Areas",
			items: [
				"Set primary location: Nairobi, Kenya",
				"Add service areas: All major Kenyan cities",
				"Include specific neighborhoods and regions",
				"Add delivery radius information",
				"Specify areas served: Kenya, East Africa",
			],
		},
		{
			title: "Photos & Media",
			items: [
				"Upload high-quality logo image",
				"Add business photos showing team/office",
				"Include product showcase images",
				"Add customer testimonial photos",
				"Upload video content if available",
				"Ensure all images are optimized for web",
			],
		},
		{
			title: "Reviews & Ratings",
			items: [
				"Encourage customer reviews",
				"Respond to all reviews professionally",
				"Monitor review sentiment",
				"Address negative feedback",
				"Share positive reviews on social media",
				"Use reviews in marketing materials",
			],
		},
		{
			title: "Posts & Updates",
			items: [
				"Regular business updates",
				"Product announcements",
				"Industry news and insights",
				"Customer success stories",
				"Promotional offers",
				"Event announcements",
			],
		},
		{
			title: "Local SEO Keywords",
			items: [
				"Kenya marketplace",
				"B2B platform Kenya",
				"Online shopping Kenya",
				"Digital marketplace Kenya",
				"Verified sellers Kenya",
				"Business directory Kenya",
				"E-commerce platform Kenya",
				"Local suppliers Kenya",
				"Business network Kenya",
				"Digital procurement Kenya",
			],
		},
	];

	// Local business attributes for Google My Business
	const businessAttributes = {
		amenities: [
			"Online ordering",
			"Digital payments",
			"Mobile app",
			"Customer support",
			"Secure transactions",
			"Verified sellers",
			"Fast delivery",
			"Bulk ordering",
			"Business accounts",
			"API integration",
		],
		services: [
			"B2B marketplace",
			"Seller verification",
			"Payment processing",
			"Order management",
			"Customer support",
			"Business analytics",
			"Digital marketing",
			"Supply chain management",
			"Quality assurance",
			"Logistics coordination",
		],
		highlights: [
			"AI-powered matching",
			"Secure transactions",
			"Verified sellers only",
			"24/7 customer support",
			"Mobile-friendly platform",
			"Multi-language support",
			"Real-time tracking",
			"Quality guarantee",
			"Fast delivery",
			"Competitive pricing",
		],
	};

	return (
		<div className="google-my-business-optimization">
			<div className="max-w-4xl mx-auto p-6">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">
					Google My Business Optimization Guide
				</h1>

				{/* Optimization Checklist */}
				<div className="space-y-8">
					{optimizationChecklist.map((section, index) => (
						<div key={index} className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">
								{section.title}
							</h2>
							<ul className="space-y-2">
								{section.items.map((item, itemIndex) => (
									<li key={itemIndex} className="flex items-start">
										<span className="text-green-500 mr-2">✓</span>
										<span className="text-gray-700">{item}</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Business Attributes */}
				<div className="mt-12 grid md:grid-cols-3 gap-6">
					<div className="bg-blue-50 rounded-lg p-6">
						<h3 className="text-lg font-semibold text-blue-900 mb-4">
							Amenities
						</h3>
						<ul className="space-y-2">
							{businessAttributes.amenities.map((amenity, index) => (
								<li key={index} className="text-blue-700 text-sm">
									• {amenity}
								</li>
							))}
						</ul>
					</div>

					<div className="bg-green-50 rounded-lg p-6">
						<h3 className="text-lg font-semibold text-green-900 mb-4">
							Services
						</h3>
						<ul className="space-y-2">
							{businessAttributes.services.map((service, index) => (
								<li key={index} className="text-green-700 text-sm">
									• {service}
								</li>
							))}
						</ul>
					</div>

					<div className="bg-purple-50 rounded-lg p-6">
						<h3 className="text-lg font-semibold text-purple-900 mb-4">
							Highlights
						</h3>
						<ul className="space-y-2">
							{businessAttributes.highlights.map((highlight, index) => (
								<li key={index} className="text-purple-700 text-sm">
									• {highlight}
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Action Items */}
				<div className="mt-12 bg-yellow-50 rounded-lg p-6">
					<h3 className="text-lg font-semibold text-yellow-900 mb-4">
						Immediate Action Items
					</h3>
					<ol className="space-y-2 text-yellow-800">
						<li>1. Claim and verify Google My Business listing</li>
						<li>2. Complete all business information sections</li>
						<li>3. Upload high-quality photos and logo</li>
						<li>4. Set up regular posting schedule</li>
						<li>5. Encourage customer reviews</li>
						<li>6. Monitor and respond to reviews</li>
						<li>7. Track performance metrics</li>
						<li>8. Optimize for local search terms</li>
					</ol>
				</div>
			</div>
		</div>
	);
};

export default GoogleMyBusinessOptimization;
