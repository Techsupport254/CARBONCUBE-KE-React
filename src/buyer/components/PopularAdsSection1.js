import React from "react";
import { Card } from "react-bootstrap";
import { getBorderColor } from "../utils/sellerTierUtils";

const PopularAdsSection = ({ ads, onAdClick, isLoading = false }) => {
	// Debug: Log the ads data
	console.log("PopularAdsSection received ads:", ads?.length || 0);
	if (ads && ads.length > 0) {
		console.log("First ad data:", {
			id: ads[0].id,
			title: ads[0].title,
			first_media_url: ads[0].first_media_url,
			media_urls: ads[0].media_urls,
			media: ads[0].media,
		});
	}
	// Helper function to get the first image URL from an ad
	const getFirstImageUrl = (ad) => {
		// Try different possible image sources
		if (ad.first_media_url) {
			return ad.first_media_url;
		}
		if (
			ad.media_urls &&
			Array.isArray(ad.media_urls) &&
			ad.media_urls.length > 0
		) {
			return ad.media_urls[0];
		}
		if (ad.media && Array.isArray(ad.media) && ad.media.length > 0) {
			return ad.media[0];
		}
		return null;
	};

	if (isLoading) {
		return (
			<Card className="bg-white mb-8 mx-0 shadow-2xl border-0 rounded-2xl overflow-hidden">
				<Card.Header className="w-full flex justify-between items-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white px-4 sm:px-6 py-4 sm:py-5 shadow-xl">
					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 bg-white/25 rounded-full" />
						<div>
							<h3 className="mb-0 font-bold text-lg sm:text-xl md:text-2xl">
								Best Sellers
							</h3>
							<p className="text-xs sm:text-sm opacity-90 mb-0">
								Top Rated Products
							</p>
						</div>
					</div>
					<div className="hidden sm:block" />
				</Card.Header>
				<Card.Body className="p-4 sm:p-6">
					<div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 sm:pb-6 scrollbar-hide snap-x snap-mandatory">
						{Array.from({ length: 6 }).map((_, i) => (
							<div
								key={i}
								className="flex-shrink-0 w-44 sm:w-52 md:w-60 snap-start"
							>
								<Card className="h-full bg-white rounded-2xl overflow-hidden border-0 shadow-xl">
									<div className="relative h-52 bg-gray-200 animate-pulse" />
									<div className="p-4 bg-white border-t border-gray-100">
										<div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
										<div className="mt-2 h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
									</div>
								</Card>
							</div>
						))}
					</div>
				</Card.Body>
			</Card>
		);
	}

	return (
		<Card className="bg-white mb-8 mx-0 shadow-2xl border-0 rounded-2xl overflow-hidden">
			<Card.Header className="w-full flex justify-between items-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white px-4 sm:px-6 py-4 sm:py-5 shadow-xl">
				<div className="flex items-center space-x-3">
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
						<h3 className="mb-0 font-bold text-lg sm:text-xl md:text-2xl">
							Best Sellers
						</h3>
						<p className="text-xs sm:text-sm opacity-90 mb-0">
							Top Rated Products
						</p>
					</div>
				</div>
				<div className="hidden sm:block">
					<div className="text-right">
						<div className="text-sm opacity-90">Featured</div>
						<div className="text-xs opacity-75">Premium Selection</div>
					</div>
				</div>
			</Card.Header>
			<Card.Body className="p-4 sm:p-6">
				<div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 sm:pb-6 scrollbar-hide snap-x snap-mandatory">
					{ads &&
						ads.slice(0, 12).map((ad) => {
							const borderColor = getBorderColor(ad.seller_tier);
							const imageUrl = getFirstImageUrl(ad);

							// Debug: Log image URL for first few ads
							if (ad.id <= 3) {
								console.log(`Ad ${ad.id} image URL:`, imageUrl);
							}

							return (
								<div
									key={ad.id}
									className="flex-shrink-0 w-44 sm:w-52 md:w-60 snap-start"
								>
									<Card
										className="h-full bg-white rounded-2xl overflow-hidden hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 border-0 shadow-xl group relative"
										style={{
											border: `3px solid ${borderColor}`,
										}}
									>
										<div className="relative">
											{/* Tier label */}
											<div
												className="absolute top-2 left-2 z-10 text-dark px-2 py-1 text-xs rounded-full font-medium shadow-sm"
												style={{
													backgroundColor: borderColor,
												}}
											>
												{ad.tier_name}
											</div>

											{/* Product image */}
											<div className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
												<Card.Img
													variant="top"
													src={
														imageUrl
															? "https://picsum.photos/300/300?random=" + ad.id
															: "https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Test+Image"
													}
													alt={ad.title || "Product Image"}
													className="object-contain w-full h-full cursor-pointer transition-all duration-300 group-hover:scale-110"
													onClick={() => onAdClick(ad.id)}
													onLoad={(e) => {
														console.log(
															`Image loaded successfully for ad ${ad.id}:`,
															e.target.src
														);
														e.target.style.opacity = "1";
													}}
													onError={(e) => {
														console.error(
															`Image failed to load for ad ${ad.id}:`,
															e.target.src
														);
														// Use a placeholder image as fallback
														e.target.src =
															"https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Error+Loading";
														e.target.style.opacity = "1";
													}}
												/>
											</div>

											{/* Hover overlay */}
											<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
												<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
													<svg
														className="w-8 h-8 text-white"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fillRule="evenodd"
															d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
															clipRule="evenodd"
														/>
													</svg>
												</div>
											</div>
										</div>

										{/* Product title */}
										<div className="p-4 bg-white border-t border-gray-100">
											<h6
												className="text-sm font-semibold text-gray-800 truncate cursor-pointer hover:text-blue-600 transition-colors duration-200"
												onClick={() => onAdClick(ad.id)}
												title={ad.title}
											>
												{ad.title}
											</h6>
											<div className="flex items-center justify-between mt-2">
												<span className="text-xs text-gray-500">
													Premium Product
												</span>
												<div className="flex items-center space-x-1">
													<svg
														className="w-3 h-3 text-yellow-500"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
													</svg>
													<span className="text-xs text-yellow-600 font-medium">
														Best Seller
													</span>
												</div>
											</div>
										</div>
									</Card>
								</div>
							);
						})}
				</div>
			</Card.Body>
		</Card>
	);
};

export default PopularAdsSection;
