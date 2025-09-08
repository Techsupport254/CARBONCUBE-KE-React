import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { getAdImageUrl } from "../../utils/imageUtils";

// Helper function to get tier priority (higher number = higher priority)
const getTierPriority = (ad) => {
	const tier = ad.seller_tier || 1; // Default to Free (1) if no tier
	// Premium = 4, Standard = 3, Basic = 2, Free = 1
	return tier;
};

// Helper function to sort ads by tier priority (Premium → Standard → Basic → Free)
const sortAdsByTier = (ads) => {
	return [...ads].sort((a, b) => {
		const tierA = getTierPriority(a);
		const tierB = getTierPriority(b);

		// Higher tier number = higher priority
		if (tierA !== tierB) {
			return tierB - tierA;
		}

		// If same tier, sort by quantity (descending)
		const quantityDiff = (b.quantity || 0) - (a.quantity || 0);
		if (quantityDiff !== 0) return quantityDiff;

		// If same quantity, sort by creation date (newest first)
		return new Date(b.created_at || 0) - new Date(a.created_at || 0);
	});
};

const PopularAdsSection = ({
	ads = [],
	onAdClick,
	isLoading = false,
	errorMessage,
	onRetry,
}) => {
	// Handle best sellers data format from backend
	const processedAds = Array.isArray(ads)
		? ads.map((ad) => ({
				id: ad.ad_id,
				title: ad.title,
				media: ad.media,
				price: ad.price,
				quantity: ad.quantity,
				created_at: ad.created_at,
				seller_tier: ad.seller_tier_id,
				comprehensive_score: ad.comprehensive_score,
				metrics: ad.metrics,
				// Add other fields that might be needed
				seller_name: ad.seller_name,
				category_name: ad.category_name,
				subcategory_name: ad.subcategory_name,
		  }))
		: [];

	// Sort ads by comprehensive score (already sorted by backend, but ensure order)
	const sortedAds = processedAds.sort(
		(a, b) => (b.comprehensive_score || 0) - (a.comprehensive_score || 0)
	);

	const popularProducts = sortedAds.slice(0, 8).map((ad, index) => ({
		id: ad.id,
		name: ad.title || `Product ${index + 1}`,
		image: getAdImageUrl(ad),
		price: ad.price,
		comprehensive_score: ad.comprehensive_score,
		metrics: ad.metrics,
	}));

	// Loading skeletons (fixed layout)
	if (isLoading) {
		return (
			<div className="w-full border-2 border-gray-200 rounded-2xl overflow-hidden">
				<div className="w-full bg-secondary text-white p-2 md:p-3 shadow-xl flex">
					<div className="w-1/2 flex items-center space-x-3">
						<div className="w-8 h-8 md:w-10 md:h-10 bg-white/25 rounded-full" />
						<div>
							<h3 className="mb-0 font-bold text-lg sm:text-xl md:text-2xl">
								Best Sellers
							</h3>
							<p className="text-xs sm:text-sm opacity-90 mb-0">
								Popular Products
							</p>
						</div>
					</div>
					<div className="hidden sm:block w-1/2" />
				</div>
				<div className="p-3 sm:p-4">
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="flex flex-col items-center text-center">
								<div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse" />
								<div className="mt-2 h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (!isLoading && errorMessage) {
		return (
			<div className="w-full border-2 border-gray-200 rounded-2xl overflow-hidden">
				<div className="w-full bg-secondary text-white p-2 shadow-xl flex">
					<div className="w-1/2 flex items-center space-x-3">
						<div className="w-10 h-10 bg-white/25 rounded-full flex items-center justify-center shadow-lg" />
						<div>
							<h3 className="mb-0 font-bold text-xl sm:text-2xl">
								Best Sellers
							</h3>
							<p className="text-sm opacity-90 mb-0">Popular Products</p>
						</div>
					</div>
				</div>
				<div className="p-4">
					<div className="flex items-center justify-between p-3 bg-yellow-100 text-yellow-800 rounded border border-yellow-200">
						<span className="text-sm">{errorMessage}</span>
						{onRetry && (
							<button
								onClick={onRetry}
								className="text-xs px-2 py-1 rounded bg-yellow-200 hover:bg-yellow-300"
							>
								Retry
							</button>
						)}
					</div>
				</div>
			</div>
		);
	}

	// If no ads are available, show a message
	if (!isLoading && popularProducts.length === 0) {
		return (
			<div className="w-full">
				<div className="w-full bg-secondary text-white p-2 shadow-xl flex">
					<div className="w-1/2 flex items-center space-x-3">
						<div className="w-10 h-10 bg-white/25 rounded-full flex items-center justify-center shadow-lg">
							<svg
								className="w-6 h-6 text-white"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
						</div>
						<div>
							<h3 className="mb-0 font-bold text-xl sm:text-2xl">
								Best Sellers
							</h3>
							<p className="text-sm opacity-90 mb-0">Popular Products</p>
						</div>
					</div>
					<div className="hidden sm:block w-1/2">
						<div className="text-right">
							<div className="text-sm opacity-90">Featured</div>
							<div className="text-xs opacity-75">Premium Selection</div>
						</div>
					</div>
				</div>
				<div className="p-4">
					<div className="text-center text-gray-500">
						<p>No popular products available at the moment.</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full border-2 border-gray-200 rounded-2xl overflow-hidden">
			{/* Header */}
			<div className="w-full bg-secondary text-white p-2 md:p-3 shadow-xl flex">
				<div className="w-1/2 flex items-center space-x-3">
					<div className="w-8 h-8 md:w-10 md:h-10 bg-white/25 rounded-full flex items-center justify-center shadow-lg">
						<svg
							className="w-5 h-5 md:w-6 md:h-6 text-white"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
					</div>
					<div>
						<h3 className="mb-0 font-bold text-lg sm:text-xl md:text-2xl">
							Best Sellers
						</h3>
						<p className="text-xs sm:text-sm opacity-90 mb-0">
							Popular Products
						</p>
					</div>
				</div>
				<div className="hidden sm:block w-1/2">
					<div className="text-right">
						<div className="text-xs sm:text-sm opacity-90">Featured</div>
						<div className="text-[10px] sm:text-xs opacity-75">
							Premium Selection
						</div>
					</div>
				</div>
			</div>
			{/* Body */}
			<div className="p-3 sm:p-4">
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
					{popularProducts.map((product, index) => (
						<div
							key={product.id || index}
							className="group h-full"
							onClick={() => onAdClick && onAdClick(product)}
						>
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col cursor-pointer">
								{/* Image Section */}
								<div className="relative h-32 sm:h-36 lg:h-40 overflow-hidden flex-shrink-0">
									{product.image &&
									product.image !==
										"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTgwIDEwNUwxNTAgMTM1TDEyMCAxMDVMMTUwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+" ? (
										<img
											src={product.image}
											alt={product.name}
											className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
										/>
									) : (
										<div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-200">
											<div className="text-gray-400 group-hover:text-gray-500 transition-colors duration-200">
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
									)}

									{/* Best Seller Badge - Top Left */}
									<div className="absolute top-1 left-1">
										<span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 whitespace-nowrap">
											Best Seller
										</span>
									</div>

									{/* Rating Badge - Top Right */}
									{product.metrics?.avg_rating &&
										product.metrics.avg_rating > 0 && (
											<div className="absolute top-1 right-1 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center gap-1">
												<FontAwesomeIcon
													icon={faStar}
													className="text-xs text-yellow-400"
												/>
												<span className="text-xs text-gray-600 font-medium">
													{product.metrics.avg_rating.toFixed(1)}
												</span>
											</div>
										)}
								</div>

								{/* Content Section */}
								<div className="p-2 sm:p-3 flex flex-col flex-grow">
									{/* Title */}
									<h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2 group-hover:text-yellow-600 transition-colors duration-200 flex-grow">
										{product.name}
									</h3>

									{/* Price */}
									<div className="flex items-center justify-between">
										<span className="text-sm sm:text-base font-bold text-green-600">
											Kshs{" "}
											{product.price
												? parseFloat(product.price).toLocaleString()
												: "N/A"}
										</span>
										{product.metrics?.total_sold && (
											<span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
												Sold: {product.metrics.total_sold}
											</span>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default PopularAdsSection;
