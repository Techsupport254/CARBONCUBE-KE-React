import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight,
	faChevronLeft,
	faBox,
} from "@fortawesome/free-solid-svg-icons";
import { getValidImageUrl, getFallbackImage } from "../../utils/imageUtils";

const RelatedProducts = ({
	relatedAds,
	showAllRelatedProducts,
	handleViewAllRelatedProducts,
	navigate,
}) => {
	const formatPrice = (price) => {
		if (!price) return "Price not available";
		return new Intl.NumberFormat("en-KE", {
			style: "currency",
			currency: "KES",
			minimumFractionDigits: 0,
		}).format(price);
	};

	const formatSellerTier = (tier) => {
		// Handle numeric tier values from API
		if (typeof tier === "number") {
			switch (tier) {
				case 1:
					return "Free";
				case 2:
					return "Basic";
				case 3:
					return "Standard";
				case 4:
					return "Premium";
				default:
					return "Verified";
			}
		}

		// Handle string tier values (legacy)
		switch (tier) {
			case "bronze":
				return "Bronze";
			case "silver":
				return "Silver";
			case "gold":
				return "Gold";
			case "platinum":
				return "Platinum";
			default:
				return "Verified";
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

	const displayedAds = showAllRelatedProducts
		? relatedAds
		: relatedAds.slice(0, 4);

	return (
		<div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6 lg:p-8 border border-gray-100">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
				<div className="flex items-center space-x-2 sm:space-x-3">
					<h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
						Related Products
					</h2>
				</div>
				<button
					onClick={handleViewAllRelatedProducts}
					className="text-gray-600 hover:text-gray-800 font-semibold transition-colors text-xs sm:text-sm md:text-base flex items-center self-start sm:self-auto"
				>
					{showAllRelatedProducts ? "Show Less" : "View All"}{" "}
					<FontAwesomeIcon
						icon={showAllRelatedProducts ? faChevronLeft : faArrowRight}
						className="ml-1 text-xs"
					/>
				</button>
			</div>

			{relatedAds.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
					{displayedAds.map((relatedAd) => (
						<div
							key={relatedAd.id}
							onClick={() => {
								// Preserve current query parameters when navigating to ad details
								const currentParams = new URLSearchParams(
									window.location.search
								);
								const currentQuery = currentParams.toString();
								const separator = currentQuery ? "?" : "";

								navigate(`/ads/${relatedAd.id}${separator}${currentQuery}`);
							}}
							className="group cursor-pointer bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-yellow-300 hover:shadow-md transition-all duration-300 overflow-hidden"
						>
							<div className="relative">
								{/* Tier badge - smaller tag-like design */}
								{relatedAd.seller_tier && (
									<div className="absolute top-2 left-2 z-10">
										<span
											className={`text-xs px-2 py-1 rounded-full border ${getSellerTierColor(
												relatedAd.seller_tier
											)}`}
										>
											{formatSellerTier(relatedAd.seller_tier)}
										</span>
									</div>
								)}

								{/* Ad image */}
								<div className="relative w-full h-32 sm:h-40 md:h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
									{relatedAd.images && relatedAd.images.length > 0 ? (
										<img
											src={getValidImageUrl(relatedAd.images[0])}
											alt={relatedAd.title}
											className="w-full h-full object-cover transition-transform duration-300"
											onError={(e) => {
												e.target.style.display = "none";
												e.target.nextSibling.style.display = "flex";
											}}
										/>
									) : null}
									{/* Fallback for no image */}
									<div
										className={`w-full h-full flex flex-col items-center justify-center ${
											relatedAd.images && relatedAd.images.length > 0
												? "hidden"
												: "flex"
										}`}
									>
										<div className="text-gray-400">
											<svg
												width="32"
												height="32"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="mb-1"
											>
												<rect
													x="3"
													y="3"
													width="18"
													height="18"
													rx="2"
													ry="2"
												/>
												<circle cx="8.5" cy="8.5" r="1.5" />
												<polyline points="21,15 16,10 5,21" />
											</svg>
										</div>
										<div className="text-xs text-gray-500 font-medium text-center px-2">
											No Image
										</div>
									</div>
								</div>

								{/* Ad title - now inside the card */}
								<div className="p-3 sm:p-4">
									<h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-yellow-600 transition-colors">
										{relatedAd.title}
									</h3>

									{/* Tooltip for full title */}
									{relatedAd.title && relatedAd.title.length > 50 && (
										<div className="group/tooltip relative">
											{/* Tooltip arrow */}
											<div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800 opacity-0 group-hover/tooltip:opacity-100 transition-opacity"></div>
										</div>
									)}

									<div className="flex items-center justify-between">
										<span className="text-sm sm:text-base font-bold text-yellow-600">
											{formatPrice(relatedAd.price)}
										</span>
										<span className="text-xs text-gray-500">
											{relatedAd.location || "Nairobi"}
										</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-8 sm:py-12">
					<div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
						<FontAwesomeIcon
							icon={faBox}
							className="text-gray-400 text-xl sm:text-2xl"
						/>
					</div>
					<p className="text-gray-500 text-lg sm:text-xl font-medium">
						No related products available.
					</p>
					<p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
						Check back later for more products.
					</p>
				</div>
			)}
		</div>
	);
};

export default RelatedProducts;
