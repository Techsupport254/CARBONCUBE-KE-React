import React from "react";
import { Card } from "react-bootstrap";
import { getBorderColor } from "../utils/sellerTierUtils";

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
	// Sort ads by quantity (descending), then by created_at (descending) for stable sorting, and take first 4
	const sortedAds = Array.isArray(ads)
		? [...ads].sort((a, b) => {
				const quantityDiff = (b.quantity || 0) - (a.quantity || 0);
				if (quantityDiff !== 0) return quantityDiff;
				// If quantities are equal, sort by created_at for stable ordering
				return new Date(b.created_at || 0) - new Date(a.created_at || 0);
		  })
		: [];
	const displayedAds = sortedAds.slice(0, 4);

	// Debug logging for Accessories subcategory
	if (subcategory === "Accessories") {
		console.log(
			`Accessories subcategory - Total ads: ${
				ads?.length || 0
			}, Displayed ads: ${displayedAds.length}`
		);
		displayedAds.forEach((ad, i) => {
			console.log(`  ${i + 1}. ${ad.title} - Quantity: ${ad.quantity}`);
		});
	}

	return (
		<Card className="h-full bg-white/90 rounded-lg flex flex-col min-h-[30vh] border border-gray-100">
			<Card.Body className="p-2 sm:p-2.5 flex-grow flex flex-col justify-between">
				{!isLoading && errorMessage && (
					<div className="mb-1 p-1 bg-yellow-100 text-yellow-800 border border-yellow-200 flex items-center justify-between">
						<span className="text-[11px] sm:text-xs">{errorMessage}</span>
						{onRetry && (
							<button
								onClick={onRetry}
								className="text-[11px] px-2 py-0.5 rounded bg-yellow-200 hover:bg-yellow-300"
							>
								Retry
							</button>
						)}
					</div>
				)}
				{/* Always render 2x2 grid with fixed dimensions */}
				<div
					className="grid grid-cols-2 grid-rows-2 gap-2 sm:gap-2.5 h-full"
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
							const borderColor = getBorderColor(ad.seller_tier);
							return (
								<div
									key={ad.id}
									className="h-full w-full flex items-stretch relative group"
								>
									<Card
										className="h-full w-full bg-white rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col relative"
										style={{ border: `2px solid ${borderColor}` }}
									>
										{/* Tier badge */}
										<div
											className="absolute top-1 left-1 px-1.5 py-0.5 text-[10px] font-medium text-white rounded z-10"
											style={{ backgroundColor: borderColor }}
										>
											{ad.seller_tier_name || "Free"}
										</div>
										<div className="flex flex-col h-full">
											{/* Ad image */}
											<Card.Img
												variant="top"
												loading="lazy"
												src={
													ad.first_media_url
														? ad.first_media_url.replace(/\n/g, "").trim()
														: ad.media_urls &&
														  Array.isArray(ad.media_urls) &&
														  ad.media_urls.length > 0
														? ad.media_urls[0].replace(/\n/g, "").trim()
														: ad.media &&
														  Array.isArray(ad.media) &&
														  ad.media.length > 0
														? ad.media[0].replace(/\n/g, "").trim()
														: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTgwIDEwNUwxNTAgMTM1TDEyMCAxMDVMMTUwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+"
												}
												alt={ad.title || "Product Image"}
												className="object-contain w-full h-auto aspect-square rounded-lg cursor-pointer transition-opacity duration-300 ease-in-out"
												onClick={() => onAdClick(ad.id)}
												onLoad={(e) => {
													e.target.style.opacity = "1";
												}}
												onError={(e) => {
													// Use a data URI as fallback to prevent infinite loops
													e.target.src =
														"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTgwIDEwNUwxNTAgMTM1TDEyMCAxMDVMMTUwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
													e.target.style.opacity = "1";
												}}
											/>

											{/* Ad title - now inside the card */}
											<div className="px-2 py-1 bg-white">
												<h6
													className="text-xs sm:text-[13px] font-medium text-gray-800 text-center w-full truncate cursor-pointer hover:text-blue-600 transition-colors duration-200"
													onClick={() => onAdClick(ad.id)}
												>
													{ad.title}
												</h6>
											</div>
										</div>
									</Card>

									{/* Tooltip for full title */}
									<div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 max-w-xs">
										{ad.title}
										{/* Tooltip arrow */}
										<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
									</div>
								</div>
							);
						}

						// Empty slot that maintains consistent sizing
						return (
							<div key={`slot-${i}`} className="h-full w-full min-h-[8vh]">
								{/* Completely empty slot */}
							</div>
						);
					})}
				</div>
			</Card.Body>

			{/* Subcategory footer */}
			<Card.Footer className="flex justify-start border-t border-gray-200 bg-gray-50 px-2 py-1 mt-auto">
				{isLoading ? (
					<div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
				) : (
					<h6
						className="m-0 cursor-pointer transition-all duration-300 hover:text-blue-600 hover:translate-x-1 font-semibold text-gray-800 text-xs sm:text-sm"
						onClick={() => onSubcategoryClick(subcategory, categoryName)}
					>
						{subcategory}
					</h6>
				)}
			</Card.Footer>
		</Card>
	);
};

export default SubcategorySection;
