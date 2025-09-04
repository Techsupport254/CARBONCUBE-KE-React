import React from "react";
import { Button } from "react-bootstrap";
import { getAdImageUrl, getFallbackImage } from "../../utils/imageUtils";
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

const SearchResultSection = ({
	results,
	searchQuery,
	getHeaderTitle,
	handleAdClick,
	handleClearSearch,
	hasMore,
	onLoadMore,
	isLoading = false,
	errorMessage,
	onRetry,
	selectedCategory = "All",
	selectedSubcategory = "All",
	categories = [],
	subcategoryCounts = {},
}) => {
	// Group results by subcategory for better organization
	const groupedResults = React.useMemo(() => {
		if (!results || results.length === 0) return {};

		// First, sort all results by tier priority
		const sortedResults = sortAdsByTier(results);

		const grouped = sortedResults.reduce((groups, ad) => {
			// Normalize subcategory name to handle different formats
			let subcategoryName =
				ad.subcategory?.name || ad.subcategory_name || "Other";

			// Trim whitespace and normalize
			subcategoryName = subcategoryName.trim();

			// Handle case where subcategory might be null/undefined
			if (!subcategoryName || subcategoryName === "") {
				subcategoryName = "Other";
			}

			if (!groups[subcategoryName]) {
				groups[subcategoryName] = [];
			}
			groups[subcategoryName].push(ad);
			return groups;
		}, {});

		return grouped;
	}, [results]);

	const subcategoryNames = Object.keys(groupedResults);
	const isGroupedView = subcategoryNames.length > 1;

	// Limit initial display to 20 items for search queries, but show all for category filtering
	const [displayCount, setDisplayCount] = React.useState(20);

	// Track display counts for each subcategory when filtering by category
	const [subcategoryDisplayCounts, setSubcategoryDisplayCounts] =
		React.useState({});

	// Track total available products for each subcategory
	const [subcategoryTotalCounts, setSubcategoryTotalCounts] = React.useState(
		{}
	);

	// Track loading states for each subcategory
	const [subcategoryLoadingStates, setSubcategoryLoadingStates] =
		React.useState({});

	// Update display count when results change for category filtering
	React.useEffect(() => {
		if (results && results.length > 0) {
			// If filtering by category/subcategory, show all results
			if (selectedCategory !== "All" || selectedSubcategory !== "All") {
				setDisplayCount(results.length);
			} else {
				// For search queries, start with 20
				setDisplayCount(20);
			}
		}
	}, [results, selectedCategory, selectedSubcategory]);

	// Initialize subcategory display counts
	React.useEffect(() => {
		if (isGroupedView) {
			const initialCounts = {};
			Object.keys(groupedResults).forEach((subcategoryName) => {
				// If this subcategory doesn't have a display count yet, initialize it
				if (!subcategoryDisplayCounts[subcategoryName]) {
					initialCounts[subcategoryName] = Math.min(
						20,
						groupedResults[subcategoryName].length
					);
				} else {
					// Keep existing count
					initialCounts[subcategoryName] =
						subcategoryDisplayCounts[subcategoryName];
				}
			});

			// Only update if there are new subcategories to initialize
			const hasNewSubcategories = Object.keys(groupedResults).some(
				(subcategoryName) => !subcategoryDisplayCounts[subcategoryName]
			);

			if (hasNewSubcategories) {
				setSubcategoryDisplayCounts(initialCounts);
			}

			// Initialize total counts based on the balanced algorithm (20 per subcategory)
			const initialTotalCounts = {};
			Object.keys(groupedResults).forEach((subcategoryName) => {
				// For now, we'll assume each subcategory has at least 20 products
				// In a real implementation, you might want to fetch this from the API
				initialTotalCounts[subcategoryName] = Math.max(
					20,
					groupedResults[subcategoryName].length
				);
			});
			setSubcategoryTotalCounts(initialTotalCounts);
		}
	}, [
		groupedResults,
		isGroupedView,
		selectedCategory,
		selectedSubcategory,
		subcategoryDisplayCounts,
	]);

	const handleLoadMore = () => {
		setDisplayCount((prev) => prev + 20);
	};

	const handleSubcategoryLoadMore = (subcategoryName) => {
		// Set loading state for this subcategory
		setSubcategoryLoadingStates((prev) => ({
			...prev,
			[subcategoryName]: true,
		}));

		// Find the subcategory ID for this subcategory name
		const subcategory = Object.values(groupedResults[subcategoryName] || [])[0];
		if (!subcategory) {
			return;
		}

		const subcategoryId = subcategory.subcategory_id;
		const currentCount = subcategoryDisplayCounts[subcategoryName] || 20;
		const nextPage = Math.floor(currentCount / 20) + 1;

		// Fetch more products for this subcategory
		fetch(
			`${process.env.REACT_APP_BACKEND_URL}/buyer/ads/load_more_subcategory?subcategory_id=${subcategoryId}&page=${nextPage}&per_page=20`,
			{
				headers: {
					Authorization: "Bearer " + sessionStorage.getItem("token"),
				},
			}
		)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((responseData) => {
				// Handle new response format with metadata
				const newProducts = responseData.ads || responseData;

				if (newProducts && newProducts.length > 0) {
					// Ensure new products have the correct subcategory information
					const processedNewProducts = newProducts.map((product) => ({
						...product,
						subcategory_name: subcategoryName, // Set the correct subcategory name
						subcategory: {
							...product.subcategory,
							name: subcategoryName, // Ensure the subcategory object has the correct name
						},
					}));

					// Update the display count for this subcategory
					setSubcategoryDisplayCounts((prev) => {
						const newCount =
							prev[subcategoryName] + processedNewProducts.length;
						return {
							...prev,
							[subcategoryName]: newCount,
						};
					});

					// Update the main results by calling a callback with the new products
					if (onLoadMore) {
						// Pass the new products and subcategory info to the parent
						onLoadMore(processedNewProducts, subcategoryName, subcategoryId);
					}
				} else {
					// No new products received
				}

				// Clear loading state
				setSubcategoryLoadingStates((prev) => ({
					...prev,
					[subcategoryName]: false,
				}));
			})
			.catch((error) => {
				// Clear loading state on error
				setSubcategoryLoadingStates((prev) => ({
					...prev,
					[subcategoryName]: false,
				}));
			});
	};

	// Check if there are more products available for each subcategory
	const hasMoreForSubcategory = (subcategoryName) => {
		const currentCount = subcategoryDisplayCounts[subcategoryName] || 20;
		const isLoading = subcategoryLoadingStates[subcategoryName] || false;

		// Don't show button while loading
		if (isLoading) return false;

		// Find the subcategory ID for this subcategory name
		const subcategory = Object.values(groupedResults[subcategoryName] || [])[0];
		if (!subcategory) return false;

		const subcategoryId = subcategory.subcategory_id;
		const totalAvailable = subcategoryCounts[subcategoryId] || 0;

		// Show button if we have loaded less than the total available
		return currentCount < totalAvailable;
	};

	const canLoadMore = results.length > displayCount;

	// Create limited results based on search vs category filtering
	const limitedResults = React.useMemo(() => {
		// Sort results by tier priority first
		const sortedResults = sortAdsByTier(results);
		return sortedResults.slice(0, displayCount);
	}, [results, displayCount]);

	// Create limited grouped results with individual subcategory limits
	const limitedGroupedResults = React.useMemo(() => {
		if (!groupedResults || Object.keys(groupedResults).length === 0) return {};

		const limited = {};
		Object.keys(groupedResults).forEach((subcategoryName) => {
			const allProducts = groupedResults[subcategoryName];
			const displayCount =
				subcategoryDisplayCounts[subcategoryName] || allProducts.length;
			// Use the display count to show the correct number of products
			limited[subcategoryName] = allProducts.slice(0, displayCount);
		});

		return limited;
	}, [groupedResults, subcategoryDisplayCounts, results.length]);

	return (
		<div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 min-h-screen">
			{/* Enhanced Header */}
			<div className="mb-4 sm:mb-5 md:mb-6 mt-2 sm:mt-3 md:mt-4">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
					<div>
						<h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
							{searchQuery && searchQuery.trim() !== ""
								? `Search Results for "${searchQuery}"`
								: getHeaderTitle()}
							{/* Product Count - only show for search queries, not category filters */}
							{searchQuery &&
								searchQuery.trim() !== "" &&
								results &&
								results.length > 0 && (
									<span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-normal text-gray-600 ml-2 sm:ml-3">
										({results.length}{" "}
										{results.length === 1 ? "product" : "products"})
									</span>
								)}
						</h1>
						{/* Filter Display */}
						{(selectedCategory !== "All" || selectedSubcategory !== "All") && (
							<div className="flex items-center gap-2 mb-2">
								<span className="text-xs sm:text-sm text-gray-600">
									Filter:
								</span>
								<div className="flex items-center gap-1">
									{selectedCategory !== "All" && (
										<span className="inline-flex items-center px-2 sm:px-3 py-1 text-xs sm:text-sm bg-yellow-100 text-yellow-800 rounded-full font-medium">
											{(() => {
												const category = categories.find(
													(c) =>
														c.id === parseInt(selectedCategory) ||
														c.id === selectedCategory
												);
												return category ? category.name : selectedCategory;
											})()}
										</span>
									)}
									{selectedSubcategory !== "All" && (
										<>
											<span className="text-gray-400">•</span>
											<span className="inline-flex items-center px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
												{(() => {
													const category = categories.find(
														(c) =>
															c.id === parseInt(selectedCategory) ||
															c.id === selectedCategory
													);
													if (category) {
														const subcategory = category.subcategories?.find(
															(sc) =>
																sc.id === parseInt(selectedSubcategory) ||
																sc.id === selectedSubcategory
														);
														return subcategory
															? subcategory.name
															: selectedSubcategory;
													}
													return selectedSubcategory;
												})()}
											</span>
										</>
									)}
								</div>
							</div>
						)}
						{isGroupedView && limitedResults.length > 0 && (
							<p className="text-gray-600 text-xs sm:text-sm md:text-base">
								Browse by subcategory
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
					<span className="text-gray-700 font-medium">
						{searchQuery && searchQuery.trim() !== ""
							? `Search Results for "${searchQuery}"`
							: getHeaderTitle()}
					</span>
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
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
					<h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2">
						No Results Found
					</h3>
					<p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base mb-4">
						No results found for "{searchQuery || "your search"}". Try searching
						for automotive parts like: filters, batteries, pumps, brakes, or
						tires
					</p>
				</div>
			) : (
				<div className="space-y-6 sm:space-y-7 md:space-y-8">
					{isGroupedView ? (
						// Grouped by subcategory view
						Object.keys(limitedGroupedResults).map((subcategoryName) => (
							<div
								key={`${subcategoryName}-${
									subcategoryDisplayCounts[subcategoryName] || 0
								}`}
								className="bg-white rounded-lg shadow-sm border"
							>
								<div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
									<h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 flex items-center justify-between">
										<span>{subcategoryName}</span>
										<span className="text-xs sm:text-sm font-normal text-yellow-800 bg-yellow-100 px-2 sm:px-3 py-1 rounded-full">
											{limitedGroupedResults[subcategoryName].length} of{" "}
											{(() => {
												// Find the subcategory ID for this subcategory name
												const subcategory = Object.values(
													groupedResults[subcategoryName] || []
												)[0];
												if (!subcategory)
													return groupedResults[subcategoryName].length;

												const subcategoryId = subcategory.subcategory_id;
												const totalAvailable =
													subcategoryCounts[subcategoryId] ||
													groupedResults[subcategoryName].length;

												return totalAvailable;
											})()}{" "}
											items
										</span>
									</h2>
								</div>
								<div className="p-3 sm:p-4 md:p-6">
									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
										{limitedGroupedResults[subcategoryName].map((ad, index) => {
											const borderColor = getBorderColor(getTierId(ad));
											return (
												<div
													key={`${ad.id}-${subcategoryName}-${
														subcategoryDisplayCounts[subcategoryName] || 0
													}`}
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
																{getTierName(ad)}
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
									{/* Load More button for this subcategory */}
									{hasMoreForSubcategory(subcategoryName) && (
										<div className="text-center mt-4 sm:mt-5 md:mt-6">
											<Button
												variant="warning"
												onClick={() =>
													handleSubcategoryLoadMore(subcategoryName)
												}
												disabled={
													subcategoryLoadingStates[subcategoryName] || false
												}
												className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-pill font-medium shadow-sm text-sm"
											>
												{subcategoryLoadingStates[subcategoryName] ? (
													<>
														<span
															className="spinner-border spinner-border-sm me-2"
															role="status"
															aria-hidden="true"
														></span>
														Loading...
													</>
												) : (
													(() => {
														const subcategory = Object.values(
															groupedResults[subcategoryName] || []
														)[0];
														if (!subcategory)
															return `Load More ${subcategoryName}`;

														const subcategoryId = subcategory.subcategory_id;
														const totalAvailable =
															subcategoryCounts[subcategoryId] || 0;
														const currentCount =
															subcategoryDisplayCounts[subcategoryName] || 20;
														const remaining = totalAvailable - currentCount;

														return `Load More ${subcategoryName} (${remaining} remaining)`;
													})()
												)}
											</Button>
										</div>
									)}
								</div>
							</div>
						))
					) : (
						// Single grid view for search results
						<div className="bg-white rounded-lg shadow-sm border">
							<div className="p-3 sm:p-4 md:p-6">
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
									{limitedResults.map((ad) => {
										const borderColor = getBorderColor(getTierId(ad));
										return (
											<div
												key={ad.id}
												className="group cursor-pointer transition-transform hover:scale-105 h-full"
												onClick={() => handleAdClick(ad.id)}
											>
												<div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow h-full flex flex-col">
													<div className="relative flex-shrink-0">
														<img
															src={getAdImageUrl(ad)}
															alt={ad.title}
															className="w-full aspect-square object-contain rounded-t-lg"
															loading="lazy"
															onError={(e) => {
																e.target.src = getFallbackImage();
															}}
														/>
														<div
															className="absolute top-1 sm:top-2 left-1 sm:left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium text-white rounded"
															style={{ backgroundColor: borderColor }}
														>
															{getTierName(ad)}
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

					{canLoadMore && !isGroupedView && (
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
