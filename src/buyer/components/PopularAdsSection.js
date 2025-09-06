import React from "react";
import { getAdImageUrl } from "../../utils/imageUtils";
import ResponsiveImage from "../../components/ResponsiveImage";

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
	// Sort ads by quantity (descending) and get the first 8
	const sortedAds = Array.isArray(ads)
		? sortAdsByTier(ads) // First sort by tier priority
		: [];
	const popularProducts = sortedAds.slice(0, 8).map((ad, index) => ({
		id: ad.id,
		name: ad.title || `Product ${index + 1}`,
		image: getAdImageUrl(ad),
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
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
					{popularProducts.map((product) => (
						<div
							key={product.id}
							className="flex flex-col items-center text-center hover:shadow-lg transition-all duration-200 cursor-pointer group"
							onClick={() => onAdClick && onAdClick(product.id)}
						>
							<div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
								<ResponsiveImage
									src={product.image}
									alt={product.name}
									width={200}
									height={200}
									className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
									loading="lazy"
									sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
									quality={75}
								/>
							</div>
							<div className="mt-2 text-xs sm:text-sm line-clamp-2">
								{product.name}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default PopularAdsSection;
