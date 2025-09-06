import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar,
	faStarHalfAlt,
	faStar as faStarEmpty,
	faUser,
	faBuilding,
	faMapMarkerAlt,
	faShieldAlt,
	faPhone,
	faComments,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const SellerInfo = ({
	ad,
	seller,
	showSellerDetails,
	setShowSellerDetails,
	handleShowModal,
	handleOpenChatModal,
	handleViewShop,
	handleRevealSellerContact,
	isAuthenticated,
	currentUserId,
	navigate,
}) => {
	const formatSellerTier = (tier) => {
		// Handle numeric tier values from API
		if (typeof tier === "number") {
			switch (tier) {
				case 1:
					return "Free Seller";
				case 2:
					return "Basic Seller";
				case 3:
					return "Standard Seller";
				case 4:
					return "Premium Seller";
				default:
					return "Verified Seller";
			}
		}

		// Handle string tier values (legacy)
		switch (tier) {
			case "bronze":
				return "Bronze Seller";
			case "silver":
				return "Silver Seller";
			case "gold":
				return "Gold Seller";
			case "platinum":
				return "Platinum Seller";
			default:
				return "Verified Seller";
		}
	};

	const getSellerTierColor = (tier) => {
		// Handle numeric tier values from API
		if (typeof tier === "number") {
			switch (tier) {
				case 1:
					return "text-gray-600 bg-gray-50 border-gray-200"; // Free
				case 2:
					return "text-blue-600 bg-blue-50 border-blue-200"; // Basic
				case 3:
					return "text-green-600 bg-green-50 border-green-200"; // Standard
				case 4:
					return "text-purple-600 bg-purple-50 border-purple-200"; // Premium
				default:
					return "text-green-600 bg-green-50 border-green-200";
			}
		}

		// Handle string tier values (legacy)
		switch (tier) {
			case "bronze":
				return "text-amber-600 bg-amber-50 border-amber-200";
			case "silver":
				return "text-gray-600 bg-gray-50 border-gray-200";
			case "gold":
				return "text-yellow-600 bg-yellow-50 border-yellow-200";
			case "platinum":
				return "text-purple-600 bg-purple-50 border-purple-200";
			default:
				return "text-green-600 bg-green-50 border-green-200";
		}
	};

	const renderStars = (rating) => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 !== 0;

		for (let i = 0; i < fullStars; i++) {
			stars.push(
				<FontAwesomeIcon
					key={i}
					icon={faStar}
					className="text-yellow-400 text-xs"
				/>
			);
		}

		if (hasHalfStar) {
			stars.push(
				<FontAwesomeIcon
					key="half"
					icon={faStarHalfAlt}
					className="text-yellow-400 text-xs"
				/>
			);
		}

		const emptyStars = 5 - Math.ceil(rating);
		for (let i = 0; i < emptyStars; i++) {
			stars.push(
				<FontAwesomeIcon
					key={`empty-${i}`}
					icon={faStarEmpty}
					className="text-gray-300 text-xs"
				/>
			);
		}

		return stars;
	};

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Rating Section */}
			<div
				onClick={handleShowModal}
				className="group cursor-pointer p-4 bg-white/90 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/95 hover:shadow-xl transition-all duration-300 shadow-lg"
			>
				<div className="flex items-center justify-between mb-2">
					<p className="text-xs font-semibold text-gray-800">
						<FontAwesomeIcon icon={faStar} className="mr-1 text-yellow-500" />
						Rating
					</p>
					<FontAwesomeIcon
						icon={faChevronRight}
						className="text-gray-400 text-xs group-hover:text-gray-600 transition-colors"
					/>
				</div>
				<div className="flex items-center space-x-2">
					<div className="flex items-center space-x-1">
						{renderStars(seller?.average_rating || 0)}
					</div>
					<span className="text-sm font-medium text-gray-700">
						{seller?.average_rating
							? seller.average_rating.toFixed(1)
							: "No rating"}
					</span>
					<span className="text-xs text-gray-500">
						({seller?.reviews_count || 0} reviews)
					</span>
				</div>
			</div>

			{/* Seller Section */}
			<div className="bg-white/90 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-4 sm:p-6">
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
							<FontAwesomeIcon
								icon={faUser}
								className="text-white text-sm sm:text-base"
							/>
						</div>
						<div>
							<h3 className="text-sm sm:text-base font-semibold text-gray-900">
								{ad.seller_enterprise_name ||
									ad.seller?.enterprise_name ||
									ad.seller_name ||
									"Seller"}
							</h3>
							<div className="flex items-center space-x-2 mt-1">
								<span
									className={`text-xs px-2 py-1 rounded-full border ${getSellerTierColor(
										ad.seller_tier || "verified"
									)}`}
								>
									{formatSellerTier(ad.seller_tier || "verified")}
								</span>
								{seller?.is_verified && (
									<FontAwesomeIcon
										icon={faShieldAlt}
										className="text-green-500 text-xs"
									/>
								)}
							</div>
						</div>
					</div>
					<button
						onClick={() => setShowSellerDetails(!showSellerDetails)}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<FontAwesomeIcon
							icon={faChevronRight}
							className={`text-sm transition-transform ${
								showSellerDetails ? "rotate-90" : ""
							}`}
						/>
					</button>
				</div>

				{showSellerDetails && (
					<div className="space-y-3 pt-4 border-t border-gray-100">
						{seller?.location && (
							<div className="flex items-center space-x-2">
								<FontAwesomeIcon
									icon={faMapMarkerAlt}
									className="text-gray-400 text-sm"
								/>
								<span className="text-sm text-gray-600">{seller.location}</span>
							</div>
						)}
						{seller?.business_type && (
							<div className="flex items-center space-x-2">
								<FontAwesomeIcon
									icon={faBuilding}
									className="text-gray-400 text-sm"
								/>
								<span className="text-sm text-gray-600">
									{seller.business_type}
								</span>
							</div>
						)}
						<div className="flex items-center space-x-2">
							<span className="text-sm text-gray-600">
								<strong>Member since:</strong>{" "}
								{seller?.created_at
									? new Date(seller.created_at).getFullYear()
									: "Unknown"}
							</span>
						</div>
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
					{/* Primary Action - Contact */}
					{isAuthenticated && currentUserId !== ad.seller_id ? (
						<button
							onClick={handleRevealSellerContact}
							className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
						>
							<FontAwesomeIcon icon={faPhone} className="text-sm" />
							<span className="text-sm sm:text-base">Contact Seller</span>
						</button>
					) : (
						<button
							onClick={() => navigate("/login")}
							className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
						>
							<FontAwesomeIcon icon={faPhone} className="text-sm" />
							<span className="text-sm sm:text-base">Login to Contact</span>
						</button>
					)}

					{/* Secondary Actions */}
					<div className="flex space-x-2">
						<button
							onClick={handleViewShop}
							className="p-3 bg-white rounded border border-gray-200 hover:bg-gray-50 flex flex-col items-center space-y-1"
						>
							<FontAwesomeIcon icon={faBuilding} className="text-blue-600" />
							<span className="text-xs font-medium text-gray-700">Shop</span>
						</button>
						<button
							onClick={handleOpenChatModal}
							className="p-3 bg-white rounded border border-gray-200 hover:bg-gray-50 flex flex-col items-center space-y-1"
						>
							<FontAwesomeIcon icon={faComments} className="text-blue-600" />
							<span className="text-xs font-medium text-gray-700">Chat</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SellerInfo;
