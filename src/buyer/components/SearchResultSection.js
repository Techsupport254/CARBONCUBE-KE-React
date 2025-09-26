import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createSlug } from "../../utils/slugUtils";
import { Button } from "react-bootstrap";
import AdCard from "../../components/AdCard";
import { getBorderColor } from "../utils/sellerTierUtils";

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

		// If same tier, sort by creation date (newest first)
		return new Date(b.created_at || 0) - new Date(a.created_at || 0);
	});
};

const SearchResultSection = ({
	results,
	searchQuery,
	searchShops = [], // Add shops prop
	getHeaderTitle,
	handleAdClick,
	handleShopClick, // Add handleShopClick prop
	handleClearSearch,
	onLoadMore,
	isLoading = false,
	errorMessage,
	onRetry,
	selectedCategory = "All",
	selectedSubcategory = "All",
	categories = [],
	subcategoryCounts = {},
	isSearchContext = false,
	totalResultsProp = null, // Add totalResults prop
	onPageChange, // Add callback for page changes
}) => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	// Debug: Log props received
	// Handle shop click - use prop if provided, otherwise use default behavior
	const handleShopClickInternal = (shop) => {
		if (handleShopClick) {
			// Use the prop function if provided
			handleShopClick(shop);
		} else {
			// Default behavior - preserve query parameters when navigating to shop
			const slug = createSlug(shop.enterprise_name);
			const currentParams = new URLSearchParams(window.location.search);
			const currentQuery = currentParams.toString();
			const separator = currentQuery ? "?" : "";

			// Use React Router navigation with preserved query parameters
			navigate(`/shop/${slug}${separator}${currentQuery}`);
		}
	};
	// Remove grouping logic - show all results in a single grid

	// Pagination state
	const [currentPage, setCurrentPage] = React.useState(1);
	const [totalPages, setTotalPages] = React.useState(1);
	const [totalResults, setTotalResults] = React.useState(0);
	const [isLoadingPage, setIsLoadingPage] = React.useState(false);
	const ITEMS_PER_PAGE = 24; // Show 24 items per page (6 items per row × 4 rows)

	// Remove subcategory pagination - not needed without filtering

	// Carousel state for shops
	const [currentShopIndex, setCurrentShopIndex] = React.useState(0);
	const [shopsPerView, setShopsPerView] = React.useState(4); // Default for desktop
	const shopsContainerRef = React.useRef(null);

	// Track previous totalResultsProp to detect new searches
	const prevTotalResultsProp = React.useRef(totalResultsProp);

	// Update pagination when results change
	React.useEffect(() => {
		// Calculate new values
		let newTotalCount = 0;
		let newTotalPagesCount = 1;
		let shouldResetPage = false;

		if (results && results.length > 0) {
			// Use totalResults prop if available and greater than 0, otherwise calculate from results length
			newTotalCount =
				totalResultsProp && totalResultsProp > 0
					? totalResultsProp
					: results.length;
			newTotalPagesCount = Math.ceil(newTotalCount / ITEMS_PER_PAGE);

			// Only reset to page 1 when totalResultsProp changes (new search), not when pagination changes
			if (
				totalResultsProp &&
				totalResultsProp !== prevTotalResultsProp.current
			) {
				shouldResetPage = true;
				prevTotalResultsProp.current = totalResultsProp;
			} else {
			}
		} else if (totalResultsProp && totalResultsProp > 0) {
			// Even if no results on current page, we might have totalResults from API
			newTotalCount = totalResultsProp;
			newTotalPagesCount = Math.ceil(totalResultsProp / ITEMS_PER_PAGE);
		} else {
			newTotalCount = 0;
			newTotalPagesCount = 1;
			shouldResetPage = true;
		}

		// Only update state if values have actually changed to prevent infinite loops
		setTotalPages((prev) =>
			prev !== newTotalPagesCount ? newTotalPagesCount : prev
		);
		setTotalResults((prev) => (prev !== newTotalCount ? newTotalCount : prev));

		if (shouldResetPage) {
			setCurrentPage(1);
		}
	}, [results, totalResultsProp, currentPage]); // Include all dependencies

	// Track previous URL page to avoid unnecessary updates
	const prevUrlPageRef = React.useRef(1);

	// Sync currentPage with URL when component receives new results
	React.useEffect(() => {
		if (searchQuery && searchQuery.trim() !== "") {
			const urlPage = parseInt(searchParams.get("page") || "1", 10);

			// Only update if the URL page has actually changed
			if (urlPage !== prevUrlPageRef.current) {
				setCurrentPage(urlPage);
				prevUrlPageRef.current = urlPage;
			}
		}
	}, [searchQuery, searchParams, currentPage]); // Include all dependencies

	// Handle responsive carousel sizing
	React.useEffect(() => {
		const updateShopsPerView = () => {
			const width = window.innerWidth;
			if (width < 640) {
				setShopsPerView(1); // Mobile: 1 shop per view
			} else if (width < 768) {
				setShopsPerView(2); // Small tablet: 2 shops per view
			} else if (width < 1024) {
				setShopsPerView(3); // Tablet: 3 shops per view
			} else {
				setShopsPerView(4); // Desktop: 4 shops per view
			}
		};

		updateShopsPerView();
		window.addEventListener("resize", updateShopsPerView);
		return () => window.removeEventListener("resize", updateShopsPerView);
	}, []);

	// Carousel navigation functions
	const scrollToShop = (index) => {
		if (shopsContainerRef.current) {
			const container = shopsContainerRef.current;
			const shopWidth = container.scrollWidth / searchShops.length;
			const scrollPosition = index * shopWidth;
			container.scrollTo({
				left: scrollPosition,
				behavior: "smooth",
			});
		}
		setCurrentShopIndex(index);
	};

	const nextShops = () => {
		const maxIndex = Math.max(0, searchShops.length - shopsPerView);
		const nextIndex = Math.min(currentShopIndex + shopsPerView, maxIndex);
		scrollToShop(nextIndex);
	};

	const prevShops = () => {
		const prevIndex = Math.max(0, currentShopIndex - shopsPerView);
		scrollToShop(prevIndex);
	};

	// Remove subcategory data fetching - not needed without filtering

	// Remove subcategory initialization - not needed without filtering

	// Pagination handlers
	const handlePageChange = async (page) => {
		if (page === currentPage || isLoadingPage) return;

		setIsLoadingPage(true);
		setCurrentPage(page);

		// Call the callback to update URL if provided
		if (onPageChange) {
			onPageChange(page);
		}

		// If we're in a search context (parent handles API calls), just update the page
		// The parent component will handle the API call
		if (isSearchContext) {
			setIsLoadingPage(false);
			return;
		}

		try {
			// Extract search parameters from URL
			const searchQuery = searchParams.get("query") || "";
			const searchCategory = searchParams.get("category") || "All";
			const searchSubcategory = searchParams.get("subcategory") || "All";

			let apiUrl;
			if (searchQuery.trim()) {
				// For text search, use the search endpoint
				apiUrl = `${
					process.env.REACT_APP_BACKEND_URL
				}/buyer/ads/search?query=${encodeURIComponent(
					searchQuery
				)}&page=${page}&ads_per_page=${ITEMS_PER_PAGE}`;

				// Add category filters if specified
				if (searchCategory !== "All") {
					apiUrl += `&category=${encodeURIComponent(searchCategory)}`;
				}
				if (searchSubcategory !== "All") {
					apiUrl += `&subcategory=${encodeURIComponent(searchSubcategory)}`;
				}
			} else {
				// For category/subcategory filtering, use the main ads endpoint
				apiUrl = `${process.env.REACT_APP_BACKEND_URL}/buyer/ads?page=${page}&per_page=${ITEMS_PER_PAGE}&balanced=true`;

				// Add category filter if specified
				if (searchCategory !== "All") {
					apiUrl += `&category_id=${searchCategory}`;
				}

				// Add subcategory filter if specified
				if (searchSubcategory !== "All") {
					apiUrl += `&subcategory_id=${searchSubcategory}`;
				}
			}

			const response = await fetch(apiUrl, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const responseData = await response.json();

			// Process results
			let newAds = [];
			if (responseData.ads) {
				newAds = responseData.ads;
			} else if (Array.isArray(responseData)) {
				newAds = responseData;
			}

			// Update the results via the onLoadMore callback
			if (onLoadMore) {
				onLoadMore(newAds, "pagination", page);
			}

			// Handle new pagination metadata format
			if (responseData.pagination && responseData.pagination.ads) {
				const adsPagination = responseData.pagination.ads;
				setTotalPages(adsPagination.total_pages);
				setTotalResults(adsPagination.total_count);
			} else if (responseData.total) {
				setTotalPages(Math.ceil(responseData.total / ITEMS_PER_PAGE));
				setTotalResults(responseData.total);
			} else if (responseData.total_count) {
				setTotalPages(Math.ceil(responseData.total_count / ITEMS_PER_PAGE));
				setTotalResults(responseData.total_count);
			}
		} catch (error) {
			console.error("Error loading page:", error);
		} finally {
			setIsLoadingPage(false);
		}

		// Scroll to top when page changes
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Remove subcategory page change handler - not needed without filtering

	// Remove subcategory total pages function - not needed without filtering

	// Create paginated results based on current page
	const paginatedResults = React.useMemo(() => {
		// Sort results by tier priority first
		const sortedResults = sortAdsByTier(results);

		// If we're in a search context (parent handles pagination), return all results
		if (isSearchContext) {
			return sortedResults;
		}

		// Calculate start and end indices for current page
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;

		return sortedResults.slice(startIndex, endIndex);
	}, [results, currentPage, isSearchContext]);

	// Remove paginated grouped results - not needed without filtering

	// Debug: Log current state before render

	return (
		<div className="max-w-7xl mx-auto px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8 min-h-screen overflow-hidden">
			{/* Enhanced Header */}
			<div className="mb-2 sm:mb-5 md:mb-6 mt-1 sm:mt-3 md:mt-4">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-3 md:gap-4 mb-2 sm:mb-4">
					<div className="flex-1 min-w-0">
						<h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">
							{searchQuery && searchQuery.trim() !== ""
								? `Search Results for "${searchQuery}"`
								: getHeaderTitle()}
							{/* Product Count - only show for search queries, not category filters */}
							{searchQuery &&
								searchQuery.trim() !== "" &&
								results &&
								results.length > 0 && (
									<span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-normal text-gray-600 ml-2 sm:ml-3">
										({totalResults || results.length}{" "}
										{(totalResults || results.length) === 1
											? "product"
											: "products"}
										)
									</span>
								)}
						</h1>
						{/* Remove filter display - not needed without filtering */}
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
				<nav className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">
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

			{/* Shops Section - Show when there are matching shops */}
			{searchShops && searchShops.length > 0 && (
				<div className="mb-3 sm:mb-8">
					<div className="flex items-center justify-between mb-2 sm:mb-5">
						<h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
							Matching Shops
						</h2>
						{searchShops.length > shopsPerView && (
							<div className="flex items-center gap-2">
								<button
									onClick={prevShops}
									disabled={currentShopIndex === 0}
									className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
									aria-label="Previous shops"
								>
									<svg
										className="w-4 h-4 text-gray-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 19l-7-7 7-7"
										/>
									</svg>
								</button>
								<button
									onClick={nextShops}
									disabled={
										currentShopIndex >= searchShops.length - shopsPerView
									}
									className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
									aria-label="Next shops"
								>
									<svg
										className="w-4 h-4 text-gray-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							</div>
						)}
					</div>

					<div className="relative">
						<div
							ref={shopsContainerRef}
							className="flex gap-2 sm:gap-5 overflow-x-auto scrollbar-hide scroll-smooth"
							style={{
								scrollbarWidth: "none",
								msOverflowStyle: "none",
								WebkitOverflowScrolling: "touch",
							}}
						>
							{searchShops.map((shop) => {
								const borderColor = getBorderColor(shop.tier_id);
								return (
									<div
										key={shop.id}
										className="bg-white rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer group h-full overflow-hidden flex-shrink-0"
										style={{
											border: `3px solid ${borderColor}`,
											width: `calc((100% - ${
												(shopsPerView - 1) * 1.25
											}rem) / ${shopsPerView})`,
											minWidth: "280px", // Ensure minimum width for readability
											maxWidth: "320px", // Prevent cards from becoming too wide
										}}
										onClick={() => handleShopClickInternal(shop)}
									>
										<div className="p-2 sm:p-5 md:p-6 h-full flex flex-col">
											{/* Header Section */}
											<div className="flex items-start mb-2 sm:mb-4">
												{shop.profile_picture ? (
													<img
														src={shop.profile_picture}
														alt={shop.enterprise_name}
														className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover mr-3 sm:mr-4 flex-shrink-0 shadow-md"
														onError={(e) => {
															e.target.style.display = "none";
														}}
													/>
												) : (
													<div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 shadow-md">
														<svg
															className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-500"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
															/>
														</svg>
													</div>
												)}
												<div className="flex-1 min-w-0">
													<h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 line-clamp-2 break-words leading-tight">
														{shop.enterprise_name}
													</h3>
												</div>
											</div>

											{/* Description */}
											{shop.description && (
												<p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4 line-clamp-2 flex-grow leading-relaxed">
													{shop.description}
												</p>
											)}

											{/* Bottom Section */}
											<div className="mt-auto space-y-2 sm:space-y-3">
												{/* Stats Row */}
												<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
													<div className="flex items-center text-xs sm:text-sm text-gray-600">
														<svg
															className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-400 flex-shrink-0"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
															/>
														</svg>
														<span className="font-medium truncate">
															{shop.product_count} products
														</span>
													</div>
													{shop.address && (
														<div className="flex items-center text-xs sm:text-sm text-gray-500">
															<svg
																className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-400 flex-shrink-0"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
																/>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
																/>
															</svg>
															<span className="truncate max-w-[100px] sm:max-w-[120px] md:max-w-[140px]">
																{shop.address}
															</span>
														</div>
													)}
												</div>

												{/* Action Button, Rating, and Tier Badge */}
												<div className="pt-2 border-t border-gray-100">
													<div className="flex items-center justify-between gap-2">
														{/* Left side: Tier Badge and Rating */}
														<div className="flex items-center gap-2 flex-1 min-w-0">
															{/* Tier Badge */}
															<span
																className="px-2 sm:px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg flex-shrink-0"
																style={{ backgroundColor: borderColor }}
															>
																{shop.tier}
															</span>

															{/* Rating */}
															{shop.avg_rating !== null &&
																shop.avg_rating !== undefined && (
																	<div
																		className={`flex items-center text-xs ${
																			shop.avg_rating === 0
																				? "text-gray-400"
																				: "text-gray-600"
																		}`}
																	>
																		<svg
																			className={`w-3 h-3 mr-1 ${
																				shop.avg_rating === 0
																					? "text-gray-300"
																					: "text-yellow-400"
																			}`}
																			fill="currentColor"
																			viewBox="0 0 20 20"
																		>
																			<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
																		</svg>
																		<span
																			className={`font-medium ${
																				shop.avg_rating === 0
																					? "text-gray-400"
																					: ""
																			}`}
																		>
																			{(shop.avg_rating || 0).toFixed(1)}
																		</span>
																	</div>
																)}
														</div>

														{/* Right side: View Shop Button */}
														<div className="flex items-center text-xs sm:text-sm font-semibold text-orange-700 group-hover:text-orange-800 transition-colors flex-shrink-0">
															<span className="hidden sm:inline">
																View Shop
															</span>
															<span className="sm:hidden">View</span>
															<svg
																className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M9 5l7 7-7 7"
																/>
															</svg>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			)}

			{!isLoading && errorMessage && (
				<div className="flex items-center justify-between p-1 sm:p-3 md:p-4 mb-2 sm:mb-5 md:mb-6 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
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
				<div className="space-y-3 sm:space-y-7 md:space-y-8">
					{Array.from({ length: 3 }).map((_, sectionIndex) => (
						<div key={sectionIndex}>
							<div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded w-32 sm:w-40 md:w-48 mb-2 sm:mb-4 animate-pulse"></div>
							<div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-1 sm:gap-3 md:gap-4">
								{Array.from({ length: 6 }).map((_, i) => (
									<div key={i} className="bg-transparent rounded-lg">
										<div className="w-full aspect-square bg-gray-200 animate-pulse rounded-t-lg" />
										<div className="p-1 sm:p-2.5 md:p-3">
											<div className="h-3 sm:h-3.5 md:h-4 bg-gray-200 rounded w-full mb-1 sm:mb-2 animate-pulse" />
											<div className="h-2 sm:h-2.5 md:h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			) : paginatedResults.length === 0 && isSearchContext ? (
				<div className="text-center py-4 sm:py-10 md:py-12">
					<div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 mx-auto mb-2 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
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
					<p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base mb-2">
						No results found for "{searchQuery || "your search"}". Try searching
						for automotive parts like: filters, batteries, pumps, brakes, or
						tires
					</p>
				</div>
			) : paginatedResults.length === 0 ? null : ( // Return null when not in search context and no results
				<div className="space-y-3 sm:space-y-7 md:space-y-8">
					{/* Single grid view for all results */}
					<div className="bg-transparent rounded-lg">
						<div className="p-0 sm:p-3">
							<div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1 sm:gap-3 lg:gap-4">
								{paginatedResults.map((ad) => {
									// Normalize tier data for consistent display
									const normalizedAd = {
										...ad,
										seller_tier: ad.seller_tier || ad.seller_tier_id || 1,
										seller_tier_name: ad.seller_tier_name || "Free",
									};

									return (
										<AdCard
											key={ad.id || ad.ad_id || `ad-${Math.random()}`}
											ad={normalizedAd}
											onClick={handleAdClick}
											size="default"
											variant="default"
											showTierBadge={true}
											showTierBorder={true}
											showRating={true}
											showPrice={true}
											showTitle={true}
											isLoading={isLoading}
											className="h-full"
										/>
									);
								})}
							</div>

							{/* Pagination controls for main results - inside the white container */}
							{!isSearchContext && totalPages > 1 && (
								<div className="flex flex-col sm:flex-row justify-center items-center mt-3 sm:mt-7 md:mt-8 gap-2 sm:gap-0">
									<div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
										<Button
											variant="outline-warning"
											size="sm"
											onClick={() => handlePageChange(currentPage - 1)}
											disabled={currentPage <= 1 || isLoadingPage}
											className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm"
										>
											<span className="hidden sm:inline">Previous</span>
											<span className="sm:hidden">Prev</span>
										</Button>

										{/* Page numbers */}
										<div className="flex items-center gap-1 flex-wrap justify-center">
											{Array.from(
												{ length: Math.min(5, totalPages) },
												(_, i) => {
													let pageNum;
													if (totalPages <= 5) {
														pageNum = i + 1;
													} else if (currentPage <= 3) {
														pageNum = i + 1;
													} else if (currentPage >= totalPages - 2) {
														pageNum = totalPages - 4 + i;
													} else {
														pageNum = currentPage - 2 + i;
													}

													return (
														<Button
															key={pageNum}
															variant={
																currentPage === pageNum
																	? "warning"
																	: "outline-warning"
															}
															size="sm"
															onClick={() => handlePageChange(pageNum)}
															disabled={isLoadingPage}
															className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm min-w-[32px] sm:min-w-[36px]"
														>
															{pageNum}
														</Button>
													);
												}
											)}
										</div>

										<Button
											variant="outline-warning"
											size="sm"
											onClick={() => handlePageChange(currentPage + 1)}
											disabled={currentPage >= totalPages || isLoadingPage}
											className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm"
										>
											<span className="hidden sm:inline">Next</span>
											<span className="sm:hidden">Next</span>
										</Button>
									</div>
									{/* Page info */}
									<div className="text-xs sm:text-sm text-gray-500 text-center mt-2 sm:mt-0 sm:ml-4">
										{isLoadingPage ? (
											<span
												className="spinner-border spinner-border-sm me-2"
												role="status"
												aria-hidden="true"
											></span>
										) : (
											`Page ${currentPage} of ${totalPages} (${totalResults} total items)`
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default SearchResultSection;
