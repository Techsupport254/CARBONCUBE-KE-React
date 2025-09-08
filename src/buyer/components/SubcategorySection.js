import React from "react";
import { Card } from "react-bootstrap";
import {
	getBorderColor,
	getTierName,
	getTierId,
} from "../utils/sellerTierUtils";

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

const SubcategorySection = ({
	subcategory,
	categoryName,
	ads,
	onAdClick,
	onSubcategoryClick,
	isLoading = false,
	errorMessage,
	onRetry,
}) => {
	// Sort ads by tier priority (Premium → Standard → Basic → Free), then by quantity, then by created_at
	const sortedAds = Array.isArray(ads) ? sortAdsByTier(ads) : [];

	// Take first 4 ads (this will be Premium → Standard → Basic → Free to fill remaining slots)
	const displayedAds = sortedAds.slice(0, 4);

	// Debug logging removed for cleaner console

	return (
		<Card className="h-full bg-white/90 rounded-lg flex flex-col border border-gray-100">
			<Card.Body className="p-0 flex-grow flex flex-col justify-between">
				{!isLoading && errorMessage && (
					<div className="mb-0.5 p-0.5 sm:p-0.5 md:p-1 bg-yellow-100 text-yellow-800 border border-yellow-200 flex items-center justify-between">
						<span className="text-[10px] sm:text-xs md:text-sm">
							{errorMessage}
						</span>
						{onRetry && (
							<button
								onClick={onRetry}
								className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-1 md:px-1.5 py-0.5 rounded bg-yellow-200 hover:bg-yellow-300"
							>
								Retry
							</button>
						)}
					</div>
				)}
				{/* Responsive grid: 2x2 ads on all screen sizes */}
				<div
					className="grid grid-cols-2 grid-rows-2 gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 h-full p-0.5 sm:p-1 md:p-1.5"
					style={{
						alignItems: "stretch",
						justifyItems: "stretch",
						minHeight: "20vh",
						gridTemplateRows: "1fr 1fr",
					}}
				>
					{Array.from({ length: 4 }).map((_, i) => {
						const ad = displayedAds[i];

						if (!isLoading && ad) {
							const borderColor = getBorderColor(getTierId(ad));
							return (
								<div
									key={ad.id}
									className="h-full w-full flex items-stretch relative group cursor-pointer"
								>
									<Card
										className="h-full w-full bg-white rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col relative"
										style={{ border: `2px solid ${borderColor}` }}
									>
										{/* Tier badge - smaller tag-like design */}
										<div
											className="absolute top-0.5 left-0.5 px-1 py-0.5 text-[7px] sm:text-[8px] md:text-[9px] font-medium text-white rounded-full z-10 shadow-sm"
											style={{ backgroundColor: borderColor }}
											role="status"
											aria-label={`${getTierName(ad)} tier product`}
										>
											{getTierName(ad)}
										</div>
										<div className="flex flex-col h-full">
											{/* Ad image */}
											<div className="relative h-auto aspect-square overflow-hidden flex-shrink-0">
												{ad.first_media_url ||
												(ad.media_urls &&
													Array.isArray(ad.media_urls) &&
													ad.media_urls.length > 0) ||
												(ad.media &&
													Array.isArray(ad.media) &&
													ad.media.length > 0) ? (
													<img
														src={
															ad.first_media_url
																? ad.first_media_url.replace(/\n/g, "").trim()
																: ad.media_urls &&
																  Array.isArray(ad.media_urls) &&
																  ad.media_urls.length > 0
																? ad.media_urls[0].replace(/\n/g, "").trim()
																: ad.media[0].replace(/\n/g, "").trim()
														}
														alt={ad.title || "Product Image"}
														className="w-full h-full object-contain rounded-lg cursor-pointer transition-opacity duration-300 ease-in-out"
														loading="lazy"
														onClick={() => onAdClick(ad.id)}
														onLoad={(e) => {
															e.target.style.opacity = "1";
														}}
														onError={(e) => {
															e.target.style.display = "none";
															e.target.nextElementSibling.style.display =
																"flex";
														}}
													/>
												) : null}
												<div
													className={`w-full h-full ${
														ad.first_media_url ||
														(ad.media_urls &&
															Array.isArray(ad.media_urls) &&
															ad.media_urls.length > 0) ||
														(ad.media &&
															Array.isArray(ad.media) &&
															ad.media.length > 0)
															? "hidden"
															: "flex"
													} bg-gradient-to-br from-gray-100 to-gray-200 flex-col items-center justify-center rounded-lg`}
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
													<div className="text-[8px] text-gray-500 font-medium text-center px-1">
														No Image
													</div>
												</div>
											</div>

											{/* Ad title and price - now inside the card */}
											<div className="px-0.5 sm:px-1 md:px-1.5 lg:px-2 py-0.5 sm:py-0.5 md:py-1 bg-white flex flex-col justify-between flex-grow">
												<h3
													className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-800 text-center w-full truncate cursor-pointer hover:text-blue-600 transition-colors duration-200 mb-1"
													onClick={() => onAdClick(ad.id)}
													title={ad.title}
												>
													{ad.title}
												</h3>
												{/* Price */}
												<div className="text-center">
													<span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-orange-700">
														KES{" "}
														{ad.price
															? parseFloat(ad.price).toLocaleString()
															: "N/A"}
													</span>
												</div>
											</div>
										</div>
									</Card>

									{/* Enhanced Tooltip for full title and price */}
									<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 max-w-[200px] whitespace-normal">
										<div className="font-semibold mb-2 text-center">
											{ad.title}
										</div>
										<div className="text-yellow-300 font-bold text-center">
											KES{" "}
											{ad.price ? parseFloat(ad.price).toLocaleString() : "N/A"}
										</div>
										{/* Tooltip arrow */}
										<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-gray-900"></div>
									</div>
								</div>
							);
						}

						// Empty slot that maintains consistent sizing
						return (
							<div
								key={`slot-${i}`}
								className="h-full w-full min-h-[8vh] sm:min-h-[10vh] md:min-h-[12vh] lg:min-h-[14vh]"
							>
								{/* Completely empty slot */}
							</div>
						);
					})}
				</div>
			</Card.Body>

			{/* Subcategory footer */}
			<Card.Footer className="flex justify-start border-t border-gray-200 bg-gray-50 px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-0.5 md:py-1 mt-auto">
				{isLoading ? (
					<div className="h-3 sm:h-4 md:h-5 w-16 sm:w-20 md:w-24 bg-gray-200 rounded animate-pulse" />
				) : (
					<h3
						className="m-0 cursor-pointer transition-all duration-300 hover:text-blue-600 hover:translate-x-1 font-semibold text-gray-800 text-[10px] sm:text-xs md:text-sm"
						onClick={() => onSubcategoryClick(subcategory, categoryName)}
					>
						{subcategory}
					</h3>
				)}
			</Card.Footer>
		</Card>
	);
};

export default SubcategorySection;
