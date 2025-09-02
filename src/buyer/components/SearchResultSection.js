import React from "react";
import { Button } from "react-bootstrap";
import { getBorderColor } from "../utils/sellerTierUtils";

const SearchResultSection = ({
	results,
	getHeaderTitle,
	handleAdClick,
	handleClearSearch,
	hasMore,
	onLoadMore,
	isLoading = false,
	errorMessage,
	onRetry,
}) => {
	// Group results by subcategory for better organization
	const groupedResults = React.useMemo(() => {
		if (!results || results.length === 0) return {};

		return results.reduce((groups, ad) => {
			const subcategoryName =
				ad.subcategory?.name || ad.subcategory_name || "Other";
			if (!groups[subcategoryName]) {
				groups[subcategoryName] = [];
			}
			groups[subcategoryName].push(ad);
			return groups;
		}, {});
	}, [results]);

	const subcategoryNames = Object.keys(groupedResults);
	const isGroupedView = subcategoryNames.length > 1;

	// Limit initial display to 20 items
	const [displayCount, setDisplayCount] = React.useState(20);
	const limitedResults = results.slice(0, displayCount);
	const limitedGroupedResults = React.useMemo(() => {
		if (!limitedResults || limitedResults.length === 0) return {};

		return limitedResults.reduce((groups, ad) => {
			const subcategoryName =
				ad.subcategory?.name || ad.subcategory_name || "Other";
			if (!groups[subcategoryName]) {
				groups[subcategoryName] = [];
			}
			groups[subcategoryName].push(ad);
			return groups;
		}, {});
	}, [limitedResults]);

	const handleLoadMore = () => {
		setDisplayCount((prev) => prev + 20);
	};

	const canLoadMore = results.length > displayCount;

	return (
		<div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 min-h-[30vh]">
			{/* Enhanced Header */}
			<div className="mb-4 sm:mb-5 md:mb-6 mt-2 sm:mt-3 md:mt-4">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
					<div>
						<h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
							{getHeaderTitle()}
						</h1>
						{isGroupedView && (
							<p className="text-gray-600 text-xs sm:text-sm md:text-base">
								Browse by subcategory • {limitedResults.length} of{" "}
								{results.length} products shown
							</p>
						)}
					</div>
					<Button
						variant="outline-warning"
						size="sm"
						onClick={handleClearSearch}
						className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 border-2 hover:bg-yellow-50 transition-colors text-dark"
					>
						← Back to Home
					</Button>
				</div>

				{/* Breadcrumb */}
				<nav className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
					<span
						onClick={handleClearSearch}
						className="cursor-pointer hover:text-yellow-600 transition-colors"
					>
						Home
					</span>
					<span className="mx-1 sm:mx-2">›</span>
					<span className="text-gray-700 font-medium">{getHeaderTitle()}</span>
				</nav>
			</div>

			{!isLoading && errorMessage && (
				<div className="flex items-center justify-between p-2 sm:p-3 md:p-4 mb-4 sm:mb-5 md:mb-6 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
					<span className="text-xs sm:text-sm">{errorMessage}</span>
					{onRetry && (
						<Button
							variant="warning"
							size="sm"
							onClick={onRetry}
							className="text-xs px-2 sm:px-3 py-1 sm:py-1.5"
						>
							Retry
						</Button>
					)}
				</div>
			)}

			{isLoading ? (
				<div className="space-y-6 sm:space-y-7 md:space-y-8">
					{Array.from({ length: 3 }).map((_, sectionIndex) => (
						<div key={sectionIndex}>
							<div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded w-32 sm:w-40 md:w-48 mb-3 sm:mb-4 animate-pulse"></div>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
								{Array.from({ length: 6 }).map((_, i) => (
									<div key={i} className="bg-white rounded-lg shadow-sm border">
										<div className="w-full aspect-square bg-gray-200 animate-pulse rounded-t-lg" />
										<div className="p-2 sm:p-2.5 md:p-3">
											<div className="h-3 sm:h-3.5 md:h-4 bg-gray-200 rounded w-full mb-1 sm:mb-2 animate-pulse" />
											<div className="h-2 sm:h-2.5 md:h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			) : limitedResults.length === 0 ? (
				<div className="text-center py-8 sm:py-10 md:py-12">
					<div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
						<svg
							className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4l-2 3h-4l-2-3H4"
							/>
						</svg>
					</div>
					<h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2">
						No products found
					</h3>
					<p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
						Try adjusting your search or browse other categories
					</p>
				</div>
			) : (
				<div className="space-y-6 sm:space-y-7 md:space-y-8">
					{isGroupedView ? (
						// Grouped by subcategory view
						Object.keys(limitedGroupedResults).map((subcategoryName) => (
							<div
								key={subcategoryName}
								className="bg-white rounded-lg shadow-sm border"
							>
								<div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
									<h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 flex items-center justify-between">
										<span>{subcategoryName}</span>
										<span className="text-xs sm:text-sm font-normal text-gray-600 bg-yellow-100 text-yellow-800 px-2 sm:px-3 py-1 rounded-full">
											{limitedGroupedResults[subcategoryName].length} items
										</span>
									</h2>
								</div>
								<div className="p-3 sm:p-4 md:p-6">
									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
										{limitedGroupedResults[subcategoryName].map((ad) => {
											const borderColor = getBorderColor(ad.seller_tier);
											return (
												<div
													key={ad.id}
													className="group cursor-pointer transition-transform hover:scale-105 h-full"
													onClick={() => handleAdClick(ad.id)}
												>
													<div className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-200 hover:border-yellow-300 h-full flex flex-col">
														{/* Tier badge */}
														<div className="relative flex-shrink-0">
															<img
																src={
																	ad.first_media_url
																		? ad.first_media_url
																				.replace(/\n/g, "")
																				.trim()
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
																alt={ad.title}
																className="w-full aspect-square object-contain rounded-t-lg"
																loading="lazy"
																onError={(e) => {
																	e.target.src =
																		"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTgwIDEwNUwxNTAgMTM1TDEyMCAxMDVMMTUwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
																}}
															/>
															<div
																className="absolute top-1 sm:top-2 left-1 sm:left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium text-white rounded"
																style={{ backgroundColor: borderColor }}
															>
																{ad.seller_tier_name || "Free"}
															</div>
														</div>

														<div className="p-2 sm:p-2.5 md:p-3 flex-grow flex flex-col">
															<h3 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2 flex-grow">
																{ad.title}
															</h3>
															<div className="flex items-center justify-between mt-auto">
																<p className="text-sm sm:text-base md:text-lg font-bold text-yellow-600">
																	KES{" "}
																	{ad.price
																		? parseFloat(ad.price).toLocaleString()
																		: "N/A"}
																</p>
															</div>
															<p className="text-xs text-gray-500 mt-1">
																{ad.seller?.enterprise_name || "Unknown Seller"}
															</p>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						))
					) : (
						// Single grid view for search results
						<div className="bg-white rounded-lg shadow-sm border">
							<div className="p-3 sm:p-4 md:p-6">
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
									{limitedResults.map((ad) => {
										const borderColor = getBorderColor(ad.seller_tier);
										return (
											<div
												key={ad.id}
												className="group cursor-pointer transition-transform hover:scale-105 h-full"
												onClick={() => handleAdClick(ad.id)}
											>
												<div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow h-full flex flex-col">
													<div className="relative flex-shrink-0">
														<img
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
															alt={ad.title}
															className="w-full aspect-square object-contain rounded-t-lg"
															loading="lazy"
															onError={(e) => {
																e.target.src =
																	"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ci8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTgwIDEwNUwxNTAgMTM1TDEyMCAxMDVMMTUwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
															}}
														/>
														<div
															className="absolute top-1 sm:top-2 left-1 sm:left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium text-white rounded"
															style={{ backgroundColor: borderColor }}
														>
															{ad.seller_tier_name || "Free"}
														</div>
													</div>

													<div className="p-2 sm:p-2.5 md:p-3 flex-grow flex flex-col">
														<h3 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2 flex-grow">
															{ad.title}
														</h3>
														<div className="flex items-center justify-between mt-auto">
															<p className="text-sm sm:text-base md:text-lg font-bold text-yellow-600">
																KES{" "}
																{ad.price
																	? parseFloat(ad.price).toLocaleString()
																	: "N/A"}
															</p>
														</div>
														<p className="text-xs text-gray-500 mt-1">
															{ad.seller?.enterprise_name || "Unknown Seller"}
														</p>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					)}

					{canLoadMore && (
						<div className="text-center mt-6 sm:mt-7 md:mt-8">
							<Button
								variant="warning"
								onClick={handleLoadMore}
								className="px-6 sm:px-7 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-pill font-medium shadow-sm text-sm sm:text-base"
							>
								Load More Products ({results.length - displayCount} remaining)
							</Button>
						</div>
					)}

					{hasMore && (
						<div className="text-center mt-6 sm:mt-7 md:mt-8">
							<Button
								variant="warning"
								onClick={onLoadMore}
								className="px-6 sm:px-7 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-pill font-medium shadow-sm text-sm sm:text-base"
							>
								Load More Products
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SearchResultSection;
