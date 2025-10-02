import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEdit,
	faShare,
	faStar,
	faStarHalfAlt,
	faChartLine,
	faUsers,
	faBox,
	faExternalLinkAlt,
	faSpinner,
	faStore,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";
import Spinner from "react-spinkit";
import AlertModal from "../../components/AlertModal";

const SellerShop = () => {
	const [shopData, setShopData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isSharing, setIsSharing] = useState(false);

	const [showAlertModal, setShowAlertModal] = useState(false);
	const [alertModalMessage, setAlertModalMessage] = useState("");
	const [alertModalConfig, setAlertModalConfig] = useState({
		icon: "",
		title: "",
		confirmText: "",
		cancelText: "",
		showCancel: false,
		onConfirm: () => {},
	});

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
			const token = localStorage.getItem("token");

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
		if (!shopData?.enterprise_name || isSharing) return;

		const shopSlug = shopData.enterprise_name
			.toLowerCase()
			.replace(/\s+/g, "-");
		const shopUrl = `${window.location.origin}/shop/${shopSlug}`;
		const shopTitle = `${shopData.enterprise_name} - Shop on CarbonCube Kenya`;

		setIsSharing(true);

		try {
			if (navigator.share) {
				await navigator.share({
					title: shopTitle,
					text: `Check out ${shopData.enterprise_name} on CarbonCube Kenya!`,
					url: shopUrl,
				});
			} else {
				// Show loading state for clipboard operation
				await navigator.clipboard.writeText(shopUrl);
				setAlertModalMessage("Shop URL copied to clipboard!");
				setAlertModalConfig({
					icon: "success",
					title: "URL Copied",
					confirmText: "OK",
					cancelText: "",
					showCancel: false,
					onConfirm: () => setShowAlertModal(false),
				});
				setShowAlertModal(true);
			}
		} catch (error) {
			// Handle specific Web Share API errors
			if (error.name === "AbortError") {
				// User canceled the share dialog - this is normal, don't show error
			} else if (error.name === "InvalidStateError") {
				// Previous share operation hasn't completed yet
				setAlertModalMessage(
					"Please wait for the previous share operation to complete."
				);
				setAlertModalConfig({
					icon: "warning",
					title: "Share in Progress",
					confirmText: "OK",
					cancelText: "",
					showCancel: false,
					onConfirm: () => setShowAlertModal(false),
				});
				setShowAlertModal(true);
			} else {
				// Other errors - fallback to clipboard
				try {
					// Keep loading state during clipboard fallback
					await navigator.clipboard.writeText(shopUrl);
					setAlertModalMessage("Shop URL copied to clipboard!");
					setAlertModalConfig({
						icon: "success",
						title: "URL Copied",
						confirmText: "OK",
						cancelText: "",
						showCancel: false,
						onConfirm: () => setShowAlertModal(false),
					});
					setShowAlertModal(true);
				} catch (clipboardError) {
					setAlertModalMessage(
						"Unable to share or copy URL. Please try again."
					);
					setAlertModalConfig({
						icon: "error",
						title: "Share Failed",
						confirmText: "OK",
						cancelText: "",
						showCancel: false,
						onConfirm: () => setShowAlertModal(false),
					});
					setShowAlertModal(true);
				}
			}
		} finally {
			setIsSharing(false);
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
			<div className="max-w-7xl mx-auto px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 xl:px-10 xl:py-12">
				{/* Header Section */}
				<div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
					<div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 md:p-8">
						<div className="flex flex-col md:flex-row md:items-center gap-4 sm:gap-6 md:gap-8">
							{/* Shop Logo */}
							<div className="flex-shrink-0">
								{shopData.profile_picture ? (
									<img
										src={shopData.profile_picture}
										alt={shopData.enterprise_name}
										className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg object-cover border border-gray-200"
									/>
								) : (
									<div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
										<FontAwesomeIcon
											icon={faStore}
											className="text-gray-500 text-lg sm:text-xl md:text-2xl"
										/>
									</div>
								)}
							</div>

							{/* Shop Info */}
							<div className="flex-1">
								<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
									{shopData.enterprise_name}
								</h1>
								<p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
									{shopData.description || "No description available"}
								</p>
							</div>

							{/* Tier Badge */}
							<div className="flex-shrink-0">
								<span className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 rounded-md text-xs sm:text-sm md:text-base font-medium bg-yellow-500 text-white">
									{shopData.seller_tier_name || "Free"} Plan
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
					{/* Products Card */}
					<div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">
									Total Products
								</p>
								<p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
									{shopData.total_ads || 0}
								</p>
							</div>
							<div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
								<FontAwesomeIcon
									icon={faBox}
									className="text-gray-600 text-lg sm:text-xl"
								/>
							</div>
						</div>
					</div>

					{/* Reviews Card */}
					<div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">
									Customer Reviews
								</p>
								<p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
									{shopData.total_reviews || 0}
								</p>
							</div>
							<div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
								<FontAwesomeIcon
									icon={faUsers}
									className="text-gray-600 text-lg sm:text-xl"
								/>
							</div>
						</div>
					</div>

					{/* Rating Card */}
					<div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">
									Average Rating
								</p>
								<p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
									{shopData.mean_rating
										? shopData.mean_rating.toFixed(1)
										: "0.0"}
								</p>
							</div>
							<div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
								<FontAwesomeIcon
									icon={faStar}
									className="text-gray-600 text-lg sm:text-xl"
								/>
							</div>
						</div>
						{shopData.mean_rating > 0 && (
							<div className="flex items-center gap-1 mt-2 sm:mt-3">
								{renderStars(shopData.mean_rating)}
							</div>
						)}
					</div>

					{/* Wishlist Card */}
					<div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">
									Wishlisted Items
								</p>
								<p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
									{shopData.total_wishlisted || 0}
								</p>
							</div>
							<div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
								<FontAwesomeIcon
									icon={faStar}
									className="text-gray-600 text-lg sm:text-xl"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
					<h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
						Quick Actions
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
						<button
							onClick={handleViewShop}
							className="flex items-center gap-3 p-3 sm:p-4 md:p-5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
						>
							<div className="p-2 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gray-600 rounded-lg group-hover:bg-gray-700 transition-colors flex items-center justify-center">
								<FontAwesomeIcon
									icon={faExternalLinkAlt}
									className="text-white text-sm sm:text-base"
								/>
							</div>
							<div className="text-left">
								<p className="font-medium text-gray-900 text-sm sm:text-base">
									View Shop
								</p>
								<p className="text-xs sm:text-sm text-gray-600">
									Preview your public shop
								</p>
							</div>
						</button>

						<button
							onClick={handleShareShop}
							disabled={isSharing}
							className={`flex items-center gap-3 p-3 sm:p-4 md:p-5 rounded-lg border transition-colors group ${
								isSharing
									? "bg-gray-50 border-gray-200 cursor-not-allowed"
									: "bg-gray-50 hover:bg-gray-100 border-gray-200"
							}`}
						>
							<div
								className={`p-2 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg transition-colors flex items-center justify-center ${
									isSharing
										? "bg-gray-400"
										: "bg-gray-500 group-hover:bg-gray-600"
								}`}
							>
								<FontAwesomeIcon
									icon={isSharing ? faSpinner : faShare}
									className={`text-white text-sm sm:text-base ${
										isSharing ? "animate-spin" : ""
									}`}
								/>
							</div>
							<div className="text-left">
								<p className="font-medium text-gray-900 text-sm sm:text-base">
									{isSharing ? "Sharing..." : "Share Shop"}
								</p>
								<p className="text-xs sm:text-sm text-gray-600">
									Share your shop link
								</p>
							</div>
						</button>

						<button
							onClick={handleEditProfile}
							className="flex items-center gap-3 p-3 sm:p-4 md:p-5 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors group"
						>
							<div className="p-2 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-yellow-500 rounded-lg group-hover:bg-yellow-600 transition-colors flex items-center justify-center">
								<FontAwesomeIcon
									icon={faEdit}
									className="text-white text-sm sm:text-base"
								/>
							</div>
							<div className="text-left">
								<p className="font-medium text-gray-900 text-sm sm:text-base">
									Edit Profile
								</p>
								<p className="text-xs sm:text-sm text-gray-600">
									Update shop information
								</p>
							</div>
						</button>

						<button
							onClick={() => navigate("/seller/ads")}
							className="flex items-center gap-3 p-3 sm:p-4 md:p-5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
						>
							<div className="p-2 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gray-600 rounded-lg group-hover:bg-gray-700 transition-colors flex items-center justify-center">
								<FontAwesomeIcon
									icon={faBox}
									className="text-white text-sm sm:text-base"
								/>
							</div>
							<div className="text-left">
								<p className="font-medium text-gray-900 text-sm sm:text-base">
									Manage Products
								</p>
								<p className="text-xs sm:text-sm text-gray-600">
									Add, edit, or remove products
								</p>
							</div>
						</button>

						<button
							onClick={() => navigate("/seller/analytics")}
							className="flex items-center gap-3 p-3 sm:p-4 md:p-5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
						>
							<div className="p-2 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gray-600 rounded-lg group-hover:bg-gray-700 transition-colors flex items-center justify-center">
								<FontAwesomeIcon
									icon={faChartLine}
									className="text-white text-sm sm:text-base"
								/>
							</div>
							<div className="text-left">
								<p className="font-medium text-gray-900 text-sm sm:text-base">
									View Analytics
								</p>
								<p className="text-xs sm:text-sm text-gray-600">
									Track performance metrics
								</p>
							</div>
						</button>

						<button
							onClick={() => navigate("/seller/profile")}
							className="flex items-center gap-3 p-3 sm:p-4 md:p-5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
						>
							<div className="p-2 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gray-600 rounded-lg group-hover:bg-gray-700 transition-colors flex items-center justify-center">
								<FontAwesomeIcon
									icon={faUsers}
									className="text-white text-sm sm:text-base"
								/>
							</div>
							<div className="text-left">
								<p className="font-medium text-gray-900 text-sm sm:text-base">
									Account Settings
								</p>
								<p className="text-xs sm:text-sm text-gray-600">
									Manage account preferences
								</p>
							</div>
						</button>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 md:p-8">
					<h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
						Recent Activity
					</h3>
					<div className="space-y-3 sm:space-y-4">
						<div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
							<div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
								<FontAwesomeIcon
									icon={faBox}
									className="text-gray-600 text-sm sm:text-base"
								/>
							</div>
							<div className="flex-1">
								<p className="text-sm sm:text-base font-medium text-gray-900">
									Product Management
								</p>
								<p className="text-xs sm:text-sm text-gray-600">
									You have {shopData.total_ads || 0} products in your shop
								</p>
							</div>
							<button
								onClick={() => navigate("/seller/ads")}
								className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-600 hover:bg-gray-700 text-white text-xs sm:text-sm rounded-md transition-colors"
							>
								Manage
							</button>
						</div>

						<div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
							<div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
								<FontAwesomeIcon
									icon={faUsers}
									className="text-gray-600 text-sm sm:text-base"
								/>
							</div>
							<div className="flex-1">
								<p className="text-sm sm:text-base font-medium text-gray-900">
									Customer Reviews
								</p>
								<p className="text-xs sm:text-sm text-gray-600">
									{shopData.total_reviews > 0
										? `You have ${shopData.total_reviews} customer reviews`
										: "No reviews yet - encourage customers to leave feedback"}
								</p>
							</div>
							<button
								onClick={() => navigate("/seller/analytics")}
								className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-600 hover:bg-gray-700 text-white text-xs sm:text-sm rounded-md transition-colors"
							>
								View
							</button>
						</div>

						<div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
							<div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
								<FontAwesomeIcon
									icon={faChartLine}
									className="text-gray-600 text-sm sm:text-base"
								/>
							</div>
							<div className="flex-1">
								<p className="text-sm sm:text-base font-medium text-gray-900">
									Performance Analytics
								</p>
								<p className="text-xs sm:text-sm text-gray-600">
									Track your shop's performance and growth
								</p>
							</div>
							<button
								onClick={() => navigate("/seller/analytics")}
								className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-600 hover:bg-gray-700 text-white text-xs sm:text-sm rounded-md transition-colors"
							>
								Analyze
							</button>
						</div>
					</div>
				</div>
			</div>

			<AlertModal
				show={showAlertModal}
				onHide={() => setShowAlertModal(false)}
				message={alertModalMessage}
				config={alertModalConfig}
			/>
		</div>
	);
};

export default SellerShop;
