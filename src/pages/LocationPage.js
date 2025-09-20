import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LocalSEO from "../components/LocalSEO";

/**
 * LocationPage Component - Location-specific landing pages for local SEO
 * Helps platform appear in searches like "air filters around me"
 */
const LocationPage = () => {
	const { location } = useParams();
	const [locationData, setLocationData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Major Kenyan cities and their data
	const kenyanCities = {
		nairobi: {
			name: "Nairobi",
			displayName: "Nairobi",
			coordinates: { latitude: -1.2921, longitude: 36.8219 },
			population: "4.4M",
			description:
				"Kenya's capital and largest city, home to major businesses and industries",
			keyIndustries: [
				"Technology",
				"Finance",
				"Manufacturing",
				"Healthcare",
				"Education",
			],
			popularCategories: [
				"Electronics",
				"Office Supplies",
				"Automotive Parts",
				"Medical Equipment",
				"Industrial Supplies",
			],
		},
		mombasa: {
			name: "Mombasa",
			displayName: "Mombasa",
			coordinates: { latitude: -4.0435, longitude: 39.6682 },
			population: "1.2M",
			description: "Kenya's main port city and coastal business hub",
			keyIndustries: [
				"Shipping",
				"Tourism",
				"Manufacturing",
				"Agriculture",
				"Logistics",
			],
			popularCategories: [
				"Marine Equipment",
				"Tourism Supplies",
				"Agricultural Products",
				"Logistics Equipment",
				"Construction Materials",
			],
		},
		kisumu: {
			name: "Kisumu",
			displayName: "Kisumu",
			coordinates: { latitude: -0.0917, longitude: 34.768 },
			population: "400K",
			description: "Western Kenya's commercial center and Lake Victoria port",
			keyIndustries: [
				"Agriculture",
				"Fishing",
				"Manufacturing",
				"Healthcare",
				"Education",
			],
			popularCategories: [
				"Agricultural Equipment",
				"Fishing Supplies",
				"Medical Equipment",
				"Educational Materials",
				"Industrial Supplies",
			],
		},
		nakuru: {
			name: "Nakuru",
			displayName: "Nakuru",
			coordinates: { latitude: -0.3072, longitude: 36.08 },
			population: "570K",
			description: "Agricultural hub and Rift Valley's commercial center",
			keyIndustries: [
				"Agriculture",
				"Manufacturing",
				"Tourism",
				"Education",
				"Healthcare",
			],
			popularCategories: [
				"Agricultural Equipment",
				"Farm Supplies",
				"Educational Materials",
				"Medical Equipment",
				"Tourism Supplies",
			],
		},
		eldoret: {
			name: "Eldoret",
			displayName: "Eldoret",
			coordinates: { latitude: 0.5143, longitude: 35.2698 },
			population: "475K",
			description: "Agricultural and educational center in the Rift Valley",
			keyIndustries: [
				"Agriculture",
				"Education",
				"Manufacturing",
				"Healthcare",
				"Sports",
			],
			popularCategories: [
				"Agricultural Equipment",
				"Educational Materials",
				"Medical Equipment",
				"Sports Equipment",
				"Industrial Supplies",
			],
		},
		thika: {
			name: "Thika",
			displayName: "Thika",
			coordinates: { latitude: -1.0333, longitude: 37.0833 },
			population: "250K",
			description: "Industrial town known for manufacturing and agriculture",
			keyIndustries: [
				"Manufacturing",
				"Agriculture",
				"Textiles",
				"Food Processing",
				"Automotive",
			],
			popularCategories: [
				"Industrial Equipment",
				"Agricultural Equipment",
				"Textile Supplies",
				"Food Processing Equipment",
				"Automotive Parts",
			],
		},
	};

	useEffect(() => {
		const fetchLocationData = async () => {
			try {
				setLoading(true);

				// Get location data from our cities database
				const cityData = kenyanCities[location?.toLowerCase()];

				if (!cityData) {
					setError("Location not found");
					setLoading(false);
					return;
				}

				// Use default location data
				setLocationData(cityData);

				setLoading(false);
			} catch (err) {
				setError("Failed to load location data");
				setLoading(false);
			}
		};

		if (location) {
			fetchLocationData();
		}
	}, [location]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (error || !locationData) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Location Not Found
					</h1>
					<p className="text-gray-600 mb-8">
						The requested location could not be found.
					</p>
					<a
						href="/"
						className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
					>
						Return Home
					</a>
				</div>
			</div>
		);
	}

	return (
		<>
			<LocalSEO
				location={locationData.displayName}
				serviceArea={locationData.displayName}
				businessType="Digital Marketplace"
			/>

			<div className="min-h-screen bg-gray-50">
				{/* Hero Section */}
				<div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
						<div className="text-center">
							<h1 className="text-4xl md:text-6xl font-bold mb-6">
								{locationData.displayName} Digital Marketplace
							</h1>
							<p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
								Find verified sellers and quality products in{" "}
								{locationData.displayName}. Kenya's trusted B2B marketplace with
								secure transactions and local business directory.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<a
									href="/categories"
									className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
								>
									Browse Categories
								</a>
								<a
									href="/seller-signup"
									className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
								>
									Become a Seller
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Location Info Section */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-3xl font-bold text-gray-900 mb-6">
								About {locationData.displayName}
							</h2>
							<p className="text-lg text-gray-600 mb-6">
								{locationData.description}
							</p>
							<div className="grid grid-cols-2 gap-4 mb-6">
								<div className="bg-blue-50 p-4 rounded-lg">
									<h3 className="font-semibold text-blue-900">Population</h3>
									<p className="text-blue-700">{locationData.population}</p>
								</div>
								<div className="bg-green-50 p-4 rounded-lg">
									<h3 className="font-semibold text-green-900">
										Active Sellers
									</h3>
									<p className="text-green-700">500+</p>
								</div>
							</div>
						</div>
						<div className="bg-gray-100 p-8 rounded-lg">
							<h3 className="text-xl font-semibold mb-4">Key Industries</h3>
							<div className="flex flex-wrap gap-2">
								{locationData.keyIndustries.map((industry, index) => (
									<span
										key={index}
										className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
									>
										{industry}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Popular Categories Section */}
				<div className="bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
						<h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
							Popular Categories in {locationData.displayName}
						</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
							{locationData.popularCategories.map((category, index) => (
								<div
									key={index}
									className="bg-gray-50 p-6 rounded-lg text-center hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all cursor-pointer"
								>
									<div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
										<span className="text-blue-600 font-bold text-lg">
											{category.charAt(0)}
										</span>
									</div>
									<h3 className="font-semibold text-gray-900 mb-2">
										{category}
									</h3>
									<p className="text-sm text-gray-600">50+ products</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Local Sellers Section */}
				<div className="bg-gray-50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
						<h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
							Verified Sellers in {locationData.displayName}
						</h2>
						<div className="grid md:grid-cols-3 gap-8">
							<div className="bg-white p-6 rounded-lg shadow-sm">
								<div className="flex items-center mb-4">
									<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
										<span className="text-green-600 font-bold">✓</span>
									</div>
									<div>
										<h3 className="font-semibold text-gray-900">
											Verified Businesses
										</h3>
										<p className="text-sm text-gray-600">
											All sellers are verified
										</p>
									</div>
								</div>
								<p className="text-gray-600">
									Every seller on our platform goes through a comprehensive
									verification process to ensure quality and trustworthiness.
								</p>
							</div>
							<div className="bg-white p-6 rounded-lg shadow-sm">
								<div className="flex items-center mb-4">
									<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
										<span className="text-blue-600 font-bold">🔒</span>
									</div>
									<div>
										<h3 className="font-semibold text-gray-900">
											Secure Transactions
										</h3>
										<p className="text-sm text-gray-600">Protected payments</p>
									</div>
								</div>
								<p className="text-gray-600">
									All transactions are protected with advanced security measures
									and fraud prevention systems.
								</p>
							</div>
							<div className="bg-white p-6 rounded-lg shadow-sm">
								<div className="flex items-center mb-4">
									<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
										<span className="text-purple-600 font-bold">⚡</span>
									</div>
									<div>
										<h3 className="font-semibold text-gray-900">
											Fast Delivery
										</h3>
										<p className="text-sm text-gray-600">
											Quick local delivery
										</p>
									</div>
								</div>
								<p className="text-gray-600">
									Enjoy fast local delivery with our network of verified
									delivery partners across {locationData.displayName}.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* CTA Section */}
				<div className="bg-blue-600 text-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
						<div className="text-center">
							<h2 className="text-3xl font-bold mb-6">
								Start Shopping in {locationData.displayName}
							</h2>
							<p className="text-xl mb-8 max-w-2xl mx-auto">
								Join thousands of businesses already using Carbon Cube Kenya to
								find quality products and trusted suppliers.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<a
									href="/"
									className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
								>
									Start Shopping
								</a>
								<a
									href="/contact-us"
									className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
								>
									Contact Us
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default LocationPage;
