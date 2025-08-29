import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MpesaPaymentGuide from "../components/MpesaPaymentGuide";
import FeatureComparisonTable from "../components/FeatureComparisonTable";
import Navbar from "../../components/Navbar"; // Unified navbar
import "../css/Tiers.css";
import Footer from "../../components/Footer"; // Adjust path if necessary
import { jwtDecode } from "jwt-decode";

const TierPage = () => {
	const [tiers, setTiers] = useState([]);
	const [selectedTier, setSelectedTier] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const [isSellerLoggedIn, setIsSellerLoggedIn] = useState(false);

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_BACKEND_URL}/tiers`)
			.then((response) => {
				setTiers(response.data || []);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error fetching tier data:", err);
				setError("Failed to fetch tier data. Please try again later.");
				setLoading(false);
			});
	}, []);

	const handleSelectTier = async (tierId) => {
		const sellerId = getSellerIdFromToken();
		if (!sellerId) {
			console.error("Seller ID not found in session storage.");
			return;
		}

		try {
			const response = await fetch(
				`/${process.env.REACT_APP_BACKEND_URL}/seller/tiers/${tierId}/update_tier`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Send token
					},
				}
			);

			const data = await response.json();
			if (response.ok) {
				// Tier updated successfully
			} else {
				console.error("Failed to update tier:", data.error);
			}
		} catch (error) {
			console.error("Error updating tier:", error);
		}
	};

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (token) {
			try {
				const decoded = jwtDecode(token);
				if (decoded.seller_id) {
					setIsSellerLoggedIn(true);
				}
			} catch (error) {
				console.error("Invalid token:", error);
			}
		}
	}, []);

	function getSellerIdFromToken() {
		const token = sessionStorage.getItem("token"); // Adjust if stored differently
		if (!token) {
			console.error("Token not found in session storage");
			return null;
		}

		try {
			const decodedToken = jwtDecode(token);
			return decodedToken.seller_id; // Ensure this matches your token structure
		} catch (error) {
			console.error("Failed to decode token:", error);
			return null;
		}
	}

	if (loading) {
		return (
			<div className="min-h-[40vh] flex items-center justify-center">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 text-center my-12">
				<h2 className="text-red-600 text-2xl font-semibold mb-2">Error</h2>
				<p className="text-gray-700">{error}</p>
			</div>
		);
	}

	return (
		<div className="px-0 py-0">
			{/* Top Navbar Minimal */}
			<Navbar mode="minimal" showSearch={false} showCategories={false} />

			{/* Hero Section */}
			<section
				className="relative overflow-hidden py-12 text-gray-900"
				style={{ backgroundColor: "#ffc107" }}
			>
				{/* Subtle background pattern */}
				<div className="position-absolute top-0 start-0 w-100 h-100 opacity-50">
					<div
						style={{
							background:
								"repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.1) 35px, rgba(0,0,0,.1) 70px)",
							width: "100%",
							height: "100%",
						}}
					></div>
				</div>
				<div className="container max-w-7xl mx-auto px-4 text-center relative">
					<div className="flex justify-center mb-3">
						<div className="bg-gray-900 rounded-full p-3">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="text-warning"
							>
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
							</svg>
						</div>
					</div>
					<h1 className="text-4xl md:text-5xl font-extrabold mb-3">
						Tiers & Pricing
					</h1>
					<p className="text-lg md:text-xl mb-4">
						Choose the Perfect Plan for Your Business
					</p>
					<p className="mb-6 text-sm opacity-75">
						Whether you're just starting out or ready to scale, we have a plan
						that fits your needs
					</p>
					{/* Show only if seller is logged in */}
					{isSellerLoggedIn && (
						<button
							onClick={() => navigate("/seller/ads")}
							className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-5 py-3 shadow"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
							</svg>
							<span>Back to Home</span>
						</button>
					)}
				</div>
			</section>

			{/* Pricing Section */}
			<section className="p-4">
				<div className="container max-w-7xl mx-auto px-2">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
						{tiers
							.slice()
							.sort((a, b) => a.id - b.id)
							.map((tier) => (
								<div key={tier.id} className="h-full">
									<div
										role="button"
										tabIndex={0}
										onClick={() => setSelectedTier(tier.id)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ")
												setSelectedTier(tier.id);
										}}
										className={`flex h-full flex-col justify-between rounded-2xl border bg-white shadow-md p-4 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${
											selectedTier === tier.id
												? "ring-2 ring-blue-500 bg-blue-50 border-blue-500"
												: "border-gray-200"
										}`}
									>
										<div>
											<div className="mb-2 flex items-center justify-between">
												<h3 className="text-xl font-bold text-gray-800">
													{tier.name}
												</h3>
												<span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
													Ads:{" "}
													{tier.name === "Premium" ? (
														<span style={{ fontSize: "1.05rem" }}>∞</span>
													) : (
														tier.ads_limit
													)}
												</span>
											</div>
											<p className="text-sm text-gray-600 mb-3">
												Choose the plan that fits your needs.
											</p>
											<ul className="list-none mb-3 space-y-1">
												{(tier.tier_features || []).map((feature) => (
													<li key={feature.id} className="flex items-center">
														<svg
															width="16"
															height="16"
															viewBox="0 0 24 24"
															fill="currentColor"
															className="text-green-600 mr-2"
														>
															<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
														</svg>
														{feature.feature_name}
													</li>
												))}
											</ul>
											<div className="text-center">
												{tier.id !== 1 ? (
													(tier.tier_pricings || []).map((pricing) => (
														<div
															key={pricing.id}
															className="text-base font-medium my-2"
														>
															<span>
																<strong>{pricing.duration_months}</strong>{" "}
																months:
																<em className="text-green-600"> Kshs: </em>
																<strong className="text-red-600 ml-1 text-lg">
																	{pricing.price
																		? parseFloat(pricing.price)
																				.toFixed(2)
																				.split(".")
																				.map((part, index) => (
																					<React.Fragment key={index}>
																						{index === 0 ? (
																							<span>
																								{parseInt(
																									part,
																									10
																								).toLocaleString()}
																							</span>
																						) : (
																							<>
																								<span className="text-base">
																									.
																								</span>
																								<span>{part}</span>
																							</>
																						)}
																					</React.Fragment>
																				))
																		: "N/A"}
																</strong>
															</span>
														</div>
													))
												) : (
													<p className="text-center text-gray-500">Free Tier</p>
												)}
												<div className="mt-4">
													<button
														onClick={(e) => {
															e.stopPropagation();
															setSelectedTier(tier.id);
														}}
														className={`w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
															selectedTier === tier.id
																? "bg-blue-600 text-white hover:bg-blue-700"
																: "bg-gray-900 text-white hover:bg-black"
														}
														}`}
													>
														Select {tier.name}
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			</section>

			{/* Mpesa Payment Guide */}
			<MpesaPaymentGuide />

			{/* Feature Breakdown */}
			<FeatureComparisonTable />

			{/* FAQs Section */}
			<section className="py-12 bg-gray-100">
				<div className="container max-w-7xl mx-auto px-4">
					<div className="text-center mb-5">
						<div className="d-flex justify-content-center mb-3">
							<div className="bg-warning rounded-circle p-3">
								<svg
									width="32"
									height="32"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="text-dark"
								>
									<path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 6c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
								</svg>
							</div>
						</div>
						<h2 className="fw-bold text-dark mb-3">
							Frequently Asked Questions
						</h2>
						<p className="text-muted fs-5">
							Everything you need to know about our pricing tiers
						</p>
					</div>
					<div className="space-y-4">
						{/* FAQ Item 1 */}
						<div className="bg-white rounded-lg shadow-md overflow-hidden">
							<button
								className="w-full bg-blue-600 text-white px-6 py-4 text-left flex items-center justify-between hover:bg-blue-700 transition-colors duration-200"
								onClick={() => {
									const content = document.getElementById("faq-content-1");
									content.classList.toggle("hidden");
									const icon = document.getElementById("faq-icon-1");
									icon.classList.toggle("rotate-180");
								}}
							>
								<div className="flex items-center">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="mr-3"
									>
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
									</svg>
									<span className="font-semibold">
										What happens if I upgrade or downgrade my tier?
									</span>
								</div>
								<svg
									id="faq-icon-1"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="transform transition-transform duration-200"
								>
									<path d="M7 10l5 5 5-5z" />
								</svg>
							</button>
							<div
								id="faq-content-1"
								className="hidden bg-gray-50 px-6 py-4 border-t border-gray-200"
							>
								<p className="text-gray-700 leading-relaxed">
									When you upgrade or downgrade, your billing will be adjusted
									accordingly. Your features will change to match the selected
									tier. Any unused portion of your current billing cycle will be
									credited to your account, and new charges will be prorated
									based on the remaining days in your billing cycle.
								</p>
							</div>
						</div>

						{/* FAQ Item 2 */}
						<div className="bg-white rounded-lg shadow-md overflow-hidden">
							<button
								className="w-full bg-gray-800 text-white px-6 py-4 text-left flex items-center justify-between hover:bg-gray-900 transition-colors duration-200"
								onClick={() => {
									const content = document.getElementById("faq-content-2");
									content.classList.toggle("hidden");
									const icon = document.getElementById("faq-icon-2");
									icon.classList.toggle("rotate-180");
								}}
							>
								<div className="flex items-center">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="mr-3"
									>
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
									</svg>
									<span className="font-semibold">
										Can I change my tier anytime?
									</span>
								</div>
								<svg
									id="faq-icon-2"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="transform transition-transform duration-200"
								>
									<path d="M7 10l5 5 5-5z" />
								</svg>
							</button>
							<div
								id="faq-content-2"
								className="hidden bg-gray-50 px-6 py-4 border-t border-gray-200"
							>
								<p className="text-gray-700 leading-relaxed">
									Yes, you can change your tier anytime. We provide flexibility
									so you can choose what fits your evolving needs. Changes take
									effect immediately, and you'll have access to all features
									included in your new tier right away.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section
				className="py-5 text-dark position-relative overflow-hidden"
				style={{ backgroundColor: "#ffc107" }}
			>
				{/* Subtle background pattern */}
				<div className="position-absolute top-0 start-0 w-100 h-100 opacity-50">
					<div
						style={{
							background:
								"repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.1) 35px, rgba(0,0,0,.1) 70px)",
							width: "100%",
							height: "100%",
						}}
					></div>
				</div>
				<div className="container max-w-7xl mx-auto px-4 text-center position-relative">
					<div className="d-flex justify-content-center mb-3">
						<div className="bg-dark rounded-circle p-3">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="text-warning"
							>
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
							</svg>
						</div>
					</div>
					<h2 className="display-5 fw-bold mb-3">Ready to Get Started?</h2>
					<p className="lead mb-4 fs-5">
						Choose your plan and start growing your business today!
					</p>
					<button
						className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-5 py-3 shadow"
						onClick={() => handleSelectTier(selectedTier)}
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
						</svg>
						<span>Select Your Plan</span>
					</button>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default TierPage;
