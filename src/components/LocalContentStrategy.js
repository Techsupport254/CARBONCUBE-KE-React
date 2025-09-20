import React from "react";

/**
 * LocalContentStrategy Component
 * Provides comprehensive local content strategy for appearing in "around me" searches
 */
const LocalContentStrategy = () => {
	// Content strategy for different search intents
	const contentStrategy = {
		air_filters_around_me: {
			title: "Air Filters Around Me - Local Suppliers",
			content:
				"Find air filter suppliers near you in Kenya. Browse automotive, HVAC, and industrial air filters from verified local dealers.",
			keywords: [
				"air filters around me",
				"air filters near me",
				"air filter suppliers Kenya",
				"automotive air filters Kenya",
				"HVAC air filters Kenya",
				"industrial air filters Kenya",
			],
			landingPage: "/categories/air-filters",
			cta: "Browse Air Filters",
		},
		automotive_parts_around_me: {
			title: "Automotive Parts Around Me - Local Dealers",
			content:
				"Discover automotive parts and accessories from verified local dealers. Find car parts, accessories, and maintenance supplies near you.",
			keywords: [
				"automotive parts around me",
				"car parts near me",
				"auto parts Kenya",
				"automotive supplies Kenya",
				"car accessories Kenya",
				"vehicle parts Kenya",
			],
			landingPage: "/categories/automotive",
			cta: "Shop Automotive Parts",
		},
		office_supplies_around_me: {
			title: "Office Supplies Around Me - Business Solutions",
			content:
				"Get office supplies and business equipment from local suppliers. Find everything from stationery to office furniture near you.",
			keywords: [
				"office supplies around me",
				"office equipment near me",
				"business supplies Kenya",
				"office furniture Kenya",
				"stationery Kenya",
				"business equipment Kenya",
			],
			landingPage: "/categories/office-supplies",
			cta: "Shop Office Supplies",
		},
		electronics_around_me: {
			title: "Electronics Around Me - Tech Solutions",
			content:
				"Find electronic devices, components, and tech accessories from verified local suppliers. Get the latest technology near you.",
			keywords: [
				"electronics around me",
				"electronic devices near me",
				"tech supplies Kenya",
				"electronic components Kenya",
				"gadgets Kenya",
				"technology Kenya",
			],
			landingPage: "/categories/electronics",
			cta: "Shop Electronics",
		},
		industrial_equipment_around_me: {
			title: "Industrial Equipment Around Me - Manufacturing Solutions",
			content:
				"Source industrial equipment, machinery, and manufacturing supplies from local verified suppliers. Find everything for your business needs.",
			keywords: [
				"industrial equipment around me",
				"manufacturing equipment near me",
				"industrial supplies Kenya",
				"machinery Kenya",
				"industrial tools Kenya",
				"manufacturing supplies Kenya",
			],
			landingPage: "/categories/industrial",
			cta: "Shop Industrial Equipment",
		},
	};

	// Local SEO content templates
	const contentTemplates = {
		locationLanding: {
			title: "{Location} Digital Marketplace - Verified Sellers & Buyers",
			description:
				"Find verified sellers and quality products in {Location}. Kenya's trusted B2B marketplace with secure transactions and local business directory.",
			headings: [
				"About {Location} Marketplace",
				"Popular Categories in {Location}",
				"Verified Sellers in {Location}",
				"Why Choose Carbon Cube Kenya in {Location}",
				"Start Shopping in {Location}",
			],
			content: [
				"Discover the best local suppliers and verified sellers in {Location}. Our platform connects businesses with trusted suppliers across Kenya.",
				"Browse popular product categories including automotive parts, electronics, office supplies, and industrial equipment.",
				"All sellers on our platform are verified and trusted, ensuring quality products and secure transactions.",
				"Enjoy fast local delivery, competitive pricing, and excellent customer support in {Location}.",
			],
		},
		categoryLanding: {
			title: "{Category} Around Me - Local Suppliers in {Location}",
			description:
				"Find {Category} suppliers near you in {Location}. Browse verified local dealers and get quality products delivered fast.",
			headings: [
				"{Category} Suppliers in {Location}",
				"Popular {Category} Products",
				"Local {Category} Dealers",
				"Why Buy {Category} from Carbon Cube Kenya",
				"Get {Category} Delivered to {Location}",
			],
			content: [
				"Find the best {Category} suppliers in {Location} with our verified seller network.",
				"Browse thousands of {Category} products from trusted local dealers.",
				"Enjoy competitive pricing, fast delivery, and quality guarantee on all {Category} products.",
				"Get {Category} delivered to your location in {Location} with our reliable delivery network.",
			],
		},
	};

	// Local business directory structure
	const businessDirectory = {
		cities: [
			"Nairobi",
			"Mombasa",
			"Kisumu",
			"Nakuru",
			"Eldoret",
			"Thika",
			"Malindi",
			"Kitale",
			"Garissa",
			"Kakamega",
		],
		categories: [
			"Air Filters",
			"Automotive Parts",
			"Electronics",
			"Office Supplies",
			"Industrial Equipment",
			"Medical Equipment",
			"Agricultural Products",
			"Construction Materials",
			"Textiles",
			"Food & Beverage",
		],
		searchTerms: [
			"around me",
			"near me",
			"local",
			"in my area",
			"close to me",
			"nearby",
			"in my city",
			"in my town",
		],
	};

	return (
		<div className="local-content-strategy">
			<div className="max-w-6xl mx-auto p-6">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">
					Local Content Strategy for "Around Me" Searches
				</h1>

				{/* Content Strategy Overview */}
				<div className="grid md:grid-cols-2 gap-8 mb-12">
					<div className="bg-blue-50 rounded-lg p-6">
						<h2 className="text-xl font-semibold text-blue-900 mb-4">
							Search Intent Optimization
						</h2>
						<ul className="space-y-2 text-blue-800">
							<li>• Target "around me" and "near me" searches</li>
							<li>• Create location-specific landing pages</li>
							<li>• Optimize for local business directories</li>
							<li>• Use geo-targeted keywords</li>
							<li>• Implement local structured data</li>
						</ul>
					</div>

					<div className="bg-green-50 rounded-lg p-6">
						<h2 className="text-xl font-semibold text-green-900 mb-4">
							Content Types
						</h2>
						<ul className="space-y-2 text-green-800">
							<li>• Location-specific landing pages</li>
							<li>• Category + location combinations</li>
							<li>• Local business directories</li>
							<li>• Geo-targeted blog content</li>
							<li>• Local supplier profiles</li>
						</ul>
					</div>
				</div>

				{/* Content Strategy Examples */}
				<div className="space-y-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">
						Content Strategy Examples
					</h2>

					{Object.entries(contentStrategy).map(([key, strategy]) => (
						<div key={key} className="bg-white rounded-lg shadow-md p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-3">
								{strategy.title}
							</h3>
							<p className="text-gray-600 mb-4">{strategy.content}</p>
							<div className="flex flex-wrap gap-2 mb-4">
								{strategy.keywords.map((keyword, index) => (
									<span
										key={index}
										className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
									>
										{keyword}
									</span>
								))}
							</div>
							<div className="flex gap-4">
								<a
									href={strategy.landingPage}
									className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
								>
									{strategy.cta}
								</a>
								<span className="text-sm text-gray-500 self-center">
									Landing Page: {strategy.landingPage}
								</span>
							</div>
						</div>
					))}
				</div>

				{/* Content Templates */}
				<div className="mt-12">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">
						Content Templates
					</h2>

					<div className="grid md:grid-cols-2 gap-8">
						<div className="bg-white rounded-lg shadow-md p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Location Landing Page Template
							</h3>
							<div className="space-y-3">
								<div>
									<strong>Title:</strong>{" "}
									{contentTemplates.locationLanding.title}
								</div>
								<div>
									<strong>Description:</strong>{" "}
									{contentTemplates.locationLanding.description}
								</div>
								<div>
									<strong>Headings:</strong>
									<ul className="ml-4 mt-2">
										{contentTemplates.locationLanding.headings.map(
											(heading, index) => (
												<li key={index} className="text-sm text-gray-600">
													• {heading}
												</li>
											)
										)}
									</ul>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-md p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Category Landing Page Template
							</h3>
							<div className="space-y-3">
								<div>
									<strong>Title:</strong>{" "}
									{contentTemplates.categoryLanding.title}
								</div>
								<div>
									<strong>Description:</strong>{" "}
									{contentTemplates.categoryLanding.description}
								</div>
								<div>
									<strong>Headings:</strong>
									<ul className="ml-4 mt-2">
										{contentTemplates.categoryLanding.headings.map(
											(heading, index) => (
												<li key={index} className="text-sm text-gray-600">
													• {heading}
												</li>
											)
										)}
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Implementation Checklist */}
				<div className="mt-12 bg-yellow-50 rounded-lg p-6">
					<h3 className="text-lg font-semibold text-yellow-900 mb-4">
						Implementation Checklist
					</h3>
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h4 className="font-semibold text-yellow-800 mb-2">
								Content Creation
							</h4>
							<ul className="space-y-1 text-yellow-700 text-sm">
								<li>• Create location-specific landing pages</li>
								<li>• Develop category + location content</li>
								<li>• Write local business directory content</li>
								<li>• Create geo-targeted blog posts</li>
								<li>• Develop local supplier profiles</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold text-yellow-800 mb-2">
								SEO Optimization
							</h4>
							<ul className="space-y-1 text-yellow-700 text-sm">
								<li>• Implement local structured data</li>
								<li>• Optimize for "around me" keywords</li>
								<li>• Create location-specific meta tags</li>
								<li>• Build local backlinks</li>
								<li>• Monitor local search performance</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LocalContentStrategy;
