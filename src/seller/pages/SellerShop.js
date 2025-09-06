import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEdit,
	faShare,
	faStar,
	faStarHalfAlt,
	faShoppingBag,
	faChartLine,
	faUsers,
	faBox,
	faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import Navbar from "../../components/Navbar";
import Spinner from "react-spinkit";

const SellerShop = () => {
	const [shopData, setShopData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState("overview");

	const navigate = useNavigate();

	const getTierName = (tierId) => {
		switch (tierId) {
			case 1:
				return "Free";
			case 2:
				return "Basic";
			case 3:
				return "Standard";
			case 4:
				return "Premium";
			default:
				return "Free";
		}
	};

	const fetchShopData = useCallback(async () => {
		try {
			setIsLoading(true);
			const token = sessionStorage.getItem("token");

			// Fetch both profile and analytics data
			const [profileResponse, analyticsResponse] = await Promise.all([
				fetch(`${process.env.REACT_APP_BACKEND_URL}/seller/profile`, {
					headers: { Authorization: `Bearer ${token}` },
				}),
				fetch(`${process.env.REACT_APP_BACKEND_URL}/seller/analytics`, {
					headers: { Authorization: `Bearer ${token}` },
				}),
			]);

			if (!profileResponse.ok || !analyticsResponse.ok) {
				throw new Error("Failed to fetch shop data");
			}

			const profileData = await profileResponse.json();
			const analyticsData = await analyticsResponse.json();

			// Combine the data
			const combinedData = {
				...profileData,
				total_ads: analyticsData.total_ads || 0,
				total_reviews: analyticsData.total_reviews || 0,
				mean_rating: analyticsData.average_rating || 0,
				total_wishlisted: analyticsData.total_ads_wishlisted || 0,
				tier_id: analyticsData.tier_id,
				seller_tier_name: getTierName(analyticsData.tier_id),
			};

			setShopData(combinedData);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchShopData();
	}, [fetchShopData]);

	const renderStars = (rating) => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 >= 0.5;

		for (let i = 0; i < fullStars; i++) {
			stars.push(
				<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />
			);
		}

		if (hasHalfStar) {
			stars.push(
				<FontAwesomeIcon
					key="half"
					icon={faStarHalfAlt}
					className="text-yellow-400"
				/>
			);
		}

		const emptyStars = 5 - Math.ceil(rating);
		for (let i = 0; i < emptyStars; i++) {
			stars.push(
				<FontAwesomeIcon
					key={`empty-${i}`}
					icon={faStar}
					className="text-gray-300"
				/>
			);
		}

		return stars;
	};

	const handleEditProfile = () => {
		navigate("/seller/profile?edit=true");
	};

	const handleViewShop = () => {
		if (shopData?.enterprise_name) {
			const shopSlug = shopData.enterprise_name
				.toLowerCase()
				.replace(/\s+/g, "-");
			window.open(`/shop/${shopSlug}`, "_blank");
		}
	};

	const handleShareShop = async () => {
		if (!shopData?.enterprise_name) return;

		const shopSlug = shopData.enterprise_name
			.toLowerCase()
			.replace(/\s+/g, "-");
		const shopUrl = `${window.location.origin}/shop/${shopSlug}`;
		const shopTitle = `${shopData.enterprise_name} - Shop on CarbonCube Kenya`;

		try {
			if (navigator.share) {
				await navigator.share({
					title: shopTitle,
					text: `Check out ${shopData.enterprise_name} on CarbonCube Kenya!`,
					url: shopUrl,
				});
			} else {
				await navigator.clipboard.writeText(shopUrl);
				alert("Shop URL copied to clipboard!");
			}
		} catch (error) {
			console.error("Error sharing:", error);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar
					mode="seller"
					showSearch={false}
					showCategories={false}
					showCart={false}
					showWishlist={false}
				/>
				<div className="flex flex-col lg:flex-row min-h-screen">
					<Sidebar />
					<div className="flex-1 min-w-0 lg:ml-0 flex items-center justify-center p-4">
						<div className="text-center">
							<Spinner
								variant="warning"
								name="cube-grid"
								style={{ width: 40, height: 40 }}
							/>
							<p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">
								Loading shop data...
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar
					mode="seller"
					showSearch={false}
					showCategories={false}
					showCart={false}
					showWishlist={false}
				/>
				<div className="flex flex-col lg:flex-row min-h-screen">
					<Sidebar />
					<div className="flex-1 min-w-0 lg:ml-0 flex items-center justify-center p-4">
						<div className="text-center">
							<h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
								Error
							</h2>
							<p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
								{error}
							</p>
							<button
								onClick={fetchShopData}
								className="px-3 sm:px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
							>
								Try Again
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!shopData) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar
					mode="seller"
					showSearch={false}
					showCategories={false}
					showCart={false}
					showWishlist={false}
				/>
				<div className="flex flex-col lg:flex-row min-h-screen">
					<Sidebar />
					<div className="flex-1 min-w-0 lg:ml-0 flex items-center justify-center p-4">
						<div className="text-center">
							<h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
								No Shop Data
							</h2>
							<p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
								Unable to load shop information.
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar
				mode="seller"
				showSearch={false}
				showCategories={false}
				showCart={false}
				showWishlist={false}
			/>
			<div className="flex flex-col lg:flex-row min-h-screen">
				<Sidebar />
				<div className="flex-1 min-w-0 lg:ml-0">
					<div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-2 sm:py-3 md:py-4 lg:py-6 xl:py-8">
						{/* Shop Overview Card */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
							{/* Mobile Layout - Stacked */}
							<div className="flex flex-col gap-3 sm:gap-4 lg:hidden">
								{/* Logo and Name Row */}
								<div className="flex items-start gap-3 sm:gap-4">
									{/* Shop Logo */}
									<div className="flex-shrink-0">
										{shopData.profile_picture ? (
											<img
												src={shopData.profile_picture}
												alt={shopData.enterprise_name}
												className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 sm:border-4 border-gray-200"
											/>
										) : (
											<div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-600 flex items-center justify-center border-2 sm:border-4 border-gray-200">
												<span className="text-white text-sm sm:text-lg font-bold">
													{shopData.enterprise_name
														? shopData.enterprise_name.charAt(0).toUpperCase()
														: "S"}
												</span>
											</div>
										)}
									</div>

									{/* Shop Name and Description */}
									<div className="flex-1 min-w-0">
										<h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 truncate">
											{shopData.enterprise_name}
										</h2>
										<p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
											{shopData.description || "No description available"}
										</p>
									</div>
								</div>

								{/* Stats Row */}
								<div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
									<span className="flex items-center gap-1 sm:gap-2">
										<FontAwesomeIcon
											icon={faBox}
											className="text-gray-400 text-xs sm:text-sm"
										/>
										{shopData.total_ads || 0} Products
									</span>
									<span className="flex items-center gap-1 sm:gap-2">
										<FontAwesomeIcon
											icon={faUsers}
											className="text-gray-400 text-xs sm:text-sm"
										/>
										{shopData.total_reviews || 0} Reviews
									</span>
									<span className="flex items-center gap-1 sm:gap-2">
										<FontAwesomeIcon
											icon={faChartLine}
											className="text-gray-400 text-xs sm:text-sm"
										/>
										{shopData.mean_rating
											? `${shopData.mean_rating.toFixed(1)}/5`
											: "No Rating"}
									</span>
								</div>

								{/* Tier Badge */}
								<div className="flex justify-center">
									<span
										className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-white"
										style={{
											backgroundColor:
												shopData.seller_tier_name === "Premium"
													? "#F59E0B"
													: shopData.seller_tier_name === "Standard"
													? "#10B981"
													: shopData.seller_tier_name === "Basic"
													? "#3B82F6"
													: "#6B7280",
										}}
									>
										{shopData.seller_tier_name || "Free"}
									</span>
								</div>
							</div>

							{/* Desktop Layout - Horizontal */}
							<div className="hidden lg:flex flex-col gap-4 xl:gap-6">
								{/* Logo, Name and Description Row */}
								<div className="flex items-start gap-4 xl:gap-6">
									{/* Shop Logo */}
									<div className="flex-shrink-0">
										{shopData.profile_picture ? (
											<img
												src={shopData.profile_picture}
												alt={shopData.enterprise_name}
												className="w-16 h-16 xl:w-20 xl:h-20 rounded-full object-cover border-4 border-gray-200"
											/>
										) : (
											<div className="w-16 h-16 xl:w-20 xl:h-20 rounded-full bg-blue-600 flex items-center justify-center border-4 border-gray-200">
												<span className="text-white text-xl xl:text-2xl font-bold">
													{shopData.enterprise_name
														? shopData.enterprise_name.charAt(0).toUpperCase()
														: "S"}
												</span>
											</div>
										)}
									</div>

									{/* Shop Name and Description */}
									<div className="flex-1 min-w-0">
										<h2 className="text-lg xl:text-xl 2xl:text-2xl font-bold text-gray-900 mb-2 truncate">
											{shopData.enterprise_name}
										</h2>
										<p className="text-sm xl:text-base text-gray-600 line-clamp-3">
											{shopData.description || "No description available"}
										</p>
									</div>
								</div>

								{/* Stats and Tier Badge Row - Always at Bottom */}
								<div className="flex flex-wrap items-center justify-between gap-4 xl:gap-6">
									{/* Statistics */}
									<div className="flex flex-wrap items-center gap-4 xl:gap-6 text-sm xl:text-base text-gray-500">
										<span className="flex items-center gap-2">
											<FontAwesomeIcon icon={faBox} className="text-gray-400" />
											{shopData.total_ads || 0} Products
										</span>
										<span className="flex items-center gap-2">
											<FontAwesomeIcon
												icon={faUsers}
												className="text-gray-400"
											/>
											{shopData.total_reviews || 0} Reviews
										</span>
										<span className="flex items-center gap-2">
											<FontAwesomeIcon
												icon={faChartLine}
												className="text-gray-400"
											/>
											{shopData.mean_rating
												? `${shopData.mean_rating.toFixed(1)}/5`
												: "No Rating"}
										</span>
									</div>

									{/* Tier Badge */}
									<div className="flex-shrink-0">
										<span
											className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
											style={{
												backgroundColor:
													shopData.seller_tier_name === "Premium"
														? "#F59E0B"
														: shopData.seller_tier_name === "Standard"
														? "#10B981"
														: shopData.seller_tier_name === "Basic"
														? "#3B82F6"
														: "#6B7280",
											}}
										>
											{shopData.seller_tier_name || "Free"}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Tabs */}
						<div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8">
							<div className="border-b border-gray-200">
								<nav className="-mb-px flex gap-1 sm:gap-2 md:gap-0 md:space-x-4 lg:space-x-6 xl:space-x-8 overflow-x-auto scrollbar-hide">
									{[
										{ id: "overview", label: "Overview", icon: faChartLine },
										{ id: "products", label: "Products", icon: faBox },
										{ id: "reviews", label: "Reviews", icon: faStar },
										{ id: "analytics", label: "Analytics", icon: faChartLine },
									].map((tab) => (
										<button
											key={tab.id}
											onClick={() => setActiveTab(tab.id)}
											className={`flex items-center justify-center gap-1 sm:gap-2 py-2 px-2 sm:px-3 md:px-1 border-b-2 font-medium text-xs sm:text-sm flex-1 sm:flex-none whitespace-nowrap min-w-0 transition-colors ${
												activeTab === tab.id
													? "border-yellow-500 text-yellow-600"
													: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
											}`}
										>
											<FontAwesomeIcon
												icon={tab.icon}
												className="text-xs sm:text-sm flex-shrink-0"
											/>
											<span className="hidden xs:inline truncate">
												{tab.label}
											</span>
											<span className="xs:hidden truncate">
												{tab.label.charAt(0)}
											</span>
										</button>
									))}
								</nav>
							</div>
						</div>

						{/* Tab Content */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-5 lg:p-6">
							{activeTab === "overview" && (
								<div>
									<h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
										Shop Overview
									</h3>

									{/* Quick Actions */}
									<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
										<button
											onClick={handleViewShop}
											className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base"
										>
											<FontAwesomeIcon
												icon={faExternalLinkAlt}
												className="text-xs sm:text-sm"
											/>
											<span>View Shop</span>
										</button>
										<button
											onClick={handleShareShop}
											className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base"
										>
											<FontAwesomeIcon
												icon={faShare}
												className="text-xs sm:text-sm"
											/>
											<span>Share Shop</span>
										</button>
										<button
											onClick={handleEditProfile}
											className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base"
										>
											<FontAwesomeIcon
												icon={faEdit}
												className="text-xs sm:text-sm"
											/>
											<span>Edit Profile</span>
										</button>
									</div>
									<div className="text-center py-3 sm:py-4 md:py-6 lg:py-8">
										<FontAwesomeIcon
											icon={faShoppingBag}
											className="text-gray-400 text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3 md:mb-4"
										/>
										<h4 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-2">
											Welcome to your shop dashboard!
										</h4>
										<p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 px-2 sm:px-4 text-left sm:text-center max-w-2xl mx-auto">
											Here you can manage your products, view customer reviews,
											and track your shop's performance.
										</p>
										<div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 md:gap-4">
											<button
												onClick={() => navigate("/seller/ads")}
												className="px-3 sm:px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base"
											>
												Manage Products
											</button>
											<button
												onClick={() => navigate("/seller/analytics")}
												className="px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base"
											>
												View Analytics
											</button>
										</div>
									</div>
								</div>
							)}

							{activeTab === "products" && (
								<div>
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-3">
										<h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
											Products
										</h3>
										<button
											onClick={() => navigate("/seller/ads")}
											className="px-3 sm:px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base w-full sm:w-auto"
										>
											Manage Products
										</button>
									</div>
									<p className="text-xs sm:text-sm md:text-base text-gray-600">
										You have {shopData.total_ads || 0} products in your shop.
										Click "Manage Products" to add, edit, or remove products.
									</p>
								</div>
							)}

							{activeTab === "reviews" && (
								<div>
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-3">
										<h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
											Customer Reviews
										</h3>
										<button
											onClick={() => navigate("/seller/analytics")}
											className="px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base w-full sm:w-auto"
										>
											View Analytics
										</button>
									</div>
									<div className="py-3 sm:py-4 md:py-6 lg:py-8">
										<div className="text-center mb-3 sm:mb-4">
											<FontAwesomeIcon
												icon={faStar}
												className="text-gray-400 text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3 md:mb-4"
											/>
											<h4 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-2">
												{shopData.total_reviews > 0
													? `${shopData.total_reviews} Reviews`
													: "No Reviews Yet"}
											</h4>
											{shopData.mean_rating > 0 && (
												<div className="flex items-center justify-center gap-1 mb-2">
													{renderStars(shopData.mean_rating)}
													<span className="ml-2 text-xs sm:text-sm md:text-base text-gray-600">
														({shopData.mean_rating.toFixed(1)})
													</span>
												</div>
											)}
										</div>
										<p className="text-xs sm:text-sm md:text-base text-gray-600 px-2 sm:px-4 text-left sm:text-center max-w-2xl mx-auto">
											{shopData.total_reviews > 0
												? "Your customers appreciate your products!"
												: "Encourage customers to leave reviews after their purchases."}
										</p>
									</div>
								</div>
							)}

							{activeTab === "analytics" && (
								<div>
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-3">
										<h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
											Shop Analytics
										</h3>
										<button
											onClick={() => navigate("/seller/analytics")}
											className="px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base w-full sm:w-auto"
										>
											View Detailed Analytics
										</button>
									</div>
									<p className="text-xs sm:text-sm md:text-base text-gray-600 text-left sm:text-center max-w-2xl mx-auto">
										Get detailed insights into your shop performance, customer
										behavior, and sales trends.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SellerShop;
