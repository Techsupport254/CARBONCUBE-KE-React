import React from "react";
import AdCard from "../../components/AdCard";
import { Card } from "react-bootstrap";

const PopularAdsSection = ({
	ads = [],
	onAdClick,
	isLoading = false,
	errorMessage,
	onRetry,
	onViewMore,
}) => {
	// Handle best sellers data format from backend
	const processedAds = Array.isArray(ads)
		? ads.map((ad) => ({
				id: ad.ad_id,
				title: ad.title,
				media: ad.media,
				media_urls: ad.media_urls,
				first_media_url: ad.first_media_url,
				price: ad.price,
				created_at: ad.created_at,
				seller_tier: ad.seller_tier_id,
				seller_tier_name: ad.seller_tier_name,
				comprehensive_score: ad.comprehensive_score,
				metrics: ad.metrics,
				rating: ad.rating || ad.mean_rating || ad.average_rating,
				review_count: ad.review_count || ad.reviews_count || ad.total_reviews,
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

	const popularProducts = sortedAds.slice(0, 18);

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
				<div className="p-0.5 sm:p-1 md:p-1.5 lg:p-2">
					<div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2">
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
		<Card className="mx-0 shadow-xl rounded-lg border-0 relative z-10">
			<Card.Header
				className="bg-secondary text-white rounded-t-lg flex justify-between items-center shadow-md cursor-pointer hover:bg-yellow-600 transition-colors duration-200 px-2 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-3 md:py-4"
				onClick={onViewMore}
				title="View all Best Sellers"
			>
				{/* Header */}
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
						<div className="text-xs sm:text-sm opacity-90">View All →</div>
						<div className="text-[10px] sm:text-xs opacity-75">
							Best Sellers
						</div>
					</div>
				</div>
			</Card.Header>
			<Card.Body className="bg-transparent p-0 min-h-[30vh]">
				{/* Body */}
				<div
					className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 p-0.5 sm:p-1 md:p-1.5 lg:p-2 h-full"
					style={{
						alignItems: "stretch",
						justifyItems: "stretch",
						minHeight: "30vh",
					}}
				>
					{popularProducts.map((product, index) => (
						<AdCard
							key={product.id || index}
							ad={product}
							onClick={onAdClick}
							size="default"
							variant="best-seller"
							showTierBadge={false}
							showTierBorder={true}
							showRating={true}
							showPrice={true}
							showTitle={true}
						/>
					))}
				</div>
			</Card.Body>
		</Card>
	);
};

export default PopularAdsSection;
