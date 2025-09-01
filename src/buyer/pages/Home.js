import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
// import TopNavbar from "../components/TopNavbar"; // Commented out old navbar
import Navbar from "../../components/Navbar"; // New unified navbar
import Banner from "../components/Banner";
import CategorySection from "../components/CategorySection";
import PopularAdsSection from "../components/PopularAdsSection";
import SearchResultSection from "../components/SearchResultSection";
import Spinner from "react-spinkit";
// import AdDetailsModal from '../components/AdDetailsModal';
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate
// import "../css/Home.css"; // Removed CSS import
import Footer from "../../components/Footer";
import {
	logClickEvent,
	logAdSearch,
	logSubcategoryClick,
} from "../../utils/clickEventLogger";
import useSEO from "../../hooks/useSEO";
import { generateHomeSEO } from "../../utils/seoHelpers";

/*
Responsive breakpoints reference

Commonly used ranges (industry-wide)
- Phones: ≤ 576px
- Small tablets: 577–768px
- Tablets/small laptops: 769–992px
- Desktops: 993–1200px
- Large desktops: ≥ 1201px

Framework defaults (authoritative)
- Tailwind CSS (default) — Tailwind “Screens” docs
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px
*/

const Home = () => {
	const [categories, setCategories] = useState([]);
	const [ads, setAds] = useState({});
	// const [allAds, setAllAds] = useState({});
	// Loading and error states
	const [isLoadingCategories, setIsLoadingCategories] = useState(true);
	const [isLoadingAds, setIsLoadingAds] = useState(true);

	// Force loading state for styling - remove this when done
	// Comment out the lines below to stop the forced loading
	useEffect(() => {
		setIsLoadingCategories(false);
		setIsLoadingAds(false);
	}, []);
	const [categoriesError, setCategoriesError] = useState(null);
	const [adsError, setAdsError] = useState(null);
	const [error, setError] = useState(null); // search error only
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);

	const [currentSearchType, setCurrentSearchType] = useState(""); // Track if it's a subcategory search
	const [displayedResults, setDisplayedResults] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const RESULTS_PER_PAGE = 18; // Show 18 items per page (3 rows of 6 items)
	const navigate = useNavigate(); // Initialize useNavigate
	const [isComponentMounted, setIsComponentMounted] = useState(false);

	// SEO Implementation
	const seoData = generateHomeSEO(categories);
	useSEO(seoData);

	useEffect(() => {
		let isMounted = true;

		// Fetch categories and subcategories
		const fetchCategories = async () => {
			try {
				// Add timeout for mobile devices
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout

				const [categoryResponse, subcategoryResponse] = await Promise.all([
					fetch(`${process.env.REACT_APP_BACKEND_URL}/buyer/categories`, {
						signal: controller.signal,
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
					}),
					fetch(`${process.env.REACT_APP_BACKEND_URL}/buyer/subcategories`, {
						signal: controller.signal,
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
					}),
				]);

				clearTimeout(timeoutId);

				if (!categoryResponse.ok || !subcategoryResponse.ok) {
					throw new Error("Failed to fetch categories/subcategories");
				}
				const [categoryData, subcategoryData] = await Promise.all([
					categoryResponse.json(),
					subcategoryResponse.json(),
				]);
				const categoriesWithSubcategories = categoryData.map((category) => ({
					...category,
					subcategories: subcategoryData.filter(
						(sub) => sub.category_id === category.id
					),
				}));
				if (isMounted) {
					setCategories(categoriesWithSubcategories);
				}
			} catch (err) {
				console.error("Categories Fetch Error:", err);

				// Handle specific error types
				if (err.name === "AbortError") {
					setCategoriesError("Request timeout - please check your connection");
				} else if (err.message.includes("Failed to fetch")) {
					setCategoriesError(
						"Network error - please check your internet connection"
					);
				} else {
					setCategoriesError("Failed to load categories");
				}
			} finally {
				if (isMounted) {
					setIsLoadingCategories(false);
				}
			}
		};

		// Fetch ads
		const fetchAds = async () => {
			try {
				setIsLoadingAds(true);
				setAdsError(null);

				// Add timeout for mobile devices
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout for ads

				const adResponse = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/buyer/ads?per_page=200&balanced=true`,
					{
						signal: controller.signal,
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
					}
				);

				clearTimeout(timeoutId);

				if (!adResponse.ok) {
					const errorText = await adResponse.text();
					console.error("Ads response error:", errorText);
					throw new Error(
						`Failed to fetch ads: ${adResponse.status} ${adResponse.statusText}`
					);
				}

				const adData = await adResponse.json();

				// Organize ads by subcategory ID
				const organizedAds = {};
				if (Array.isArray(adData)) {
					adData.forEach((ad) => {
						if (ad.subcategory_id) {
							if (!organizedAds[ad.subcategory_id]) {
								organizedAds[ad.subcategory_id] = [];
							}
							organizedAds[ad.subcategory_id].push(ad);
						}
					});
				}

				if (isMounted) {
					setAds(organizedAds);
				}
			} catch (err) {
				console.error("Ads Fetch Error:", err);

				// Handle specific error types
				if (err.name === "AbortError") {
					setAdsError("Request timeout - please check your connection");
				} else if (err.message.includes("Failed to fetch")) {
					setAdsError("Network error - please check your internet connection");
				} else {
					setAdsError("Failed to load ads");
				}
				if (isMounted) {
					setAds({});
				}
			} finally {
				if (isMounted) {
					setIsLoadingAds(false);
				}
			}
		};

		fetchCategories();
		fetchAds();

		return () => {
			isMounted = false;
		};
	}, []);

	const location = useLocation();

	// Memoize flattened ads to prevent unnecessary re-renders
	const flattenedAds = useMemo(() => {
		const flat = Object.values(ads).flat();
		return flat;
	}, [ads]);

	// Update the useEffect that handles location search to better manage state
	useEffect(() => {
		setIsComponentMounted(true);
		return () => setIsComponentMounted(false);
	}, [isComponentMounted]);

	// Update the search results useEffect to only run when component is mounted
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const query = params.get("query");
		const category = params.get("category");
		const subcategory = params.get("subcategory");

		// Only trigger search if we have actual search parameters
		// Ignore other parameters like 'from', 'utm_source', etc.
		const hasSearchParams =
			(query && query.trim() !== "") ||
			(category && category !== "All") ||
			(subcategory && subcategory !== "All");

		if (!hasSearchParams) {
			setSearchResults([]);
			setCurrentSearchType("");
			setIsSearching(false);
			return;
		}

		const fetchSearchResults = async () => {
			setIsSearching(true);
			setError(null); // Clear previous errors
			try {
				const searchQuery = query || "";
				const searchCategory = category || "All";
				const searchSubcategory = subcategory || "All";

				console.log("Searching for:", {
					searchQuery,
					searchCategory,
					searchSubcategory,
				});

				const response = await fetch(
					`${
						process.env.REACT_APP_BACKEND_URL
					}/buyer/ads/search?query=${encodeURIComponent(
						searchQuery
					)}&category=${encodeURIComponent(
						searchCategory
					)}&subcategory=${encodeURIComponent(
						searchSubcategory
					)}&page=1&per_page=20`,
					{
						headers: {
							Authorization: "Bearer " + sessionStorage.getItem("token"),
						},
					}
				);

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(
						`Search failed: ${response.status} ${response.statusText} - ${errorText}`
					);
				}

				const results = await response.json();
				console.log("Search results:", results);

				if (!results || results.length === 0) {
					setSearchResults([]);
					setDisplayedResults([]);
					setError(
						`No results found for "${searchQuery}". Try searching for: filter, pump, or battery`
					);
				} else {
					setSearchResults(results);
					initializeDisplayedResults(results);
					setError(null); // Clear any previous errors
				}

				if (searchQuery.trim()) {
					setCurrentSearchType("search");
				} else if (searchSubcategory !== "All") {
					setCurrentSearchType(`subcategory-${searchSubcategory}`);
				} else {
					setCurrentSearchType("category");
				}

				await logAdSearch(searchQuery, searchCategory, searchSubcategory);
			} catch (error) {
				console.error("Search error:", error);
				if (error.message.includes("Failed to fetch")) {
					setError(
						"Unable to connect to search service. Please check your connection."
					);
				} else {
					setError(error.message);
				}
				setSearchResults([]);
			} finally {
				setIsSearching(false);
			}
		};

		fetchSearchResults();
	}, [location.search]);

	const handleSidebarToggle = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const handleAdClick = async (adId) => {
		if (!adId) {
			console.error("Invalid adId");
			return;
		}

		try {
			// Log the 'Ad-Click' event before navigating
			await logClickEvent(adId, "Ad-Click");

			// Navigate to the ad details page without replacing current history entry
			// This preserves the back button functionality
			navigate(`/ads/${adId}`);
		} catch (error) {
			console.error("Error logging ad click:", error);

			// Proceed with navigation even if logging fails
			navigate(`/ads/${adId}`);
		}
	};

	// Function to log a click event

	const handleSearch = (e, category = "All", subcategory = "All") => {
		e.preventDefault();

		// Don't search if query is empty and no category/subcategory filters
		if (!searchQuery.trim() && category === "All" && subcategory === "All") {
			return;
		}

		// Build search URL with proper parameters
		const params = new URLSearchParams();
		if (searchQuery.trim()) {
			params.set("query", searchQuery.trim());
		}
		if (category !== "All") {
			params.set("category", category);
		}
		if (subcategory !== "All") {
			params.set("subcategory", subcategory);
		}

		// Navigate to search results
		navigate(`/?${params.toString()}`);
	};

	// Update handleSubcategoryClick to use URL navigation and handle the search properly
	const handleSubcategoryClick = async (subcategoryName, categoryName) => {
		// Navigate to URL with subcategory parameters
		navigate(
			`/?query=&category=${encodeURIComponent(
				categoryName
			)}&subcategory=${encodeURIComponent(subcategoryName)}`
		);

		// Log the subcategory click
		await logSubcategoryClick(subcategoryName, categoryName);
	};

	// Function to clear search results and return to home view
	const handleClearSearch = () => {
		// Use replace to avoid adding to history stack
		navigate("/", { replace: true });
		setSearchResults([]);
		setSearchQuery("");
		setCurrentSearchType("");
		setIsSearching(false);
		setDisplayedResults([]);
		setCurrentPage(1);
		setHasMore(true);
	};

	// Function to load more results
	const handleLoadMore = () => {
		const nextPage = currentPage + 1;
		const startIndex = (nextPage - 1) * RESULTS_PER_PAGE;
		const endIndex = startIndex + RESULTS_PER_PAGE;
		const newResults = searchResults.slice(startIndex, endIndex);

		setDisplayedResults((prev) => [...prev, ...newResults]);
		setCurrentPage(nextPage);
		setHasMore(endIndex < searchResults.length);
	};

	// Function to initialize displayed results when search results change
	const initializeDisplayedResults = (results) => {
		const initialResults = results.slice(0, RESULTS_PER_PAGE);
		setDisplayedResults(initialResults);
		setCurrentPage(1);
		setHasMore(results.length > RESULTS_PER_PAGE);
	};

	// Do not early-return on error; show alerts inline instead

	return (
		<>
			<Navbar
				mode="buyer"
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				handleSearch={handleSearch}
				onSidebarToggle={handleSidebarToggle}
				showSearch={true}
				showCategories={true}
				showUserMenu={true}
				showNotifications={true}
				showCart={true}
				showWishlist={true}
			/>
			<div className="flex flex-col md:flex-row p-0 m-0">
				<div className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
					<Sidebar isOpen={sidebarOpen} onToggle={handleSidebarToggle} />
				</div>
				<div className="flex-1 bg-gray-300 font-['Fira_Sans_Extra_Condensed'] font-normal transition-all duration-300 ease-in-out">
					<div className="w-full">
						{!isSearching && searchResults.length === 0 && <Banner />}
						<div
							className={`px-0 ${
								!isSearching && searchResults.length === 0
									? "mt-0 md:-translate-y-[10vh] lg:-translate-y-[10vh] xl:-translate-y-[15vh] 2xl:-translate-y-[20vh]"
									: ""
							} relative z-2 transition-transform duration-300`}
						>
							{isSearching ? (
								<div className="flex justify-center items-center h-screen w-full">
									<Spinner
										variant="warning"
										name="cube-grid"
										style={{ width: 50, height: 50 }}
									/>
								</div>
							) : searchResults.length > 0 ? (
								<SearchResultSection
									results={displayedResults}
									getHeaderTitle={() => {
										if (
											typeof currentSearchType === "string" &&
											currentSearchType.startsWith("subcategory-")
										) {
											const rawName = currentSearchType.replace(
												"subcategory-",
												""
											);
											const formatted = rawName
												.replace(/-/g, " ")
												.replace(/\b\w/g, (c) => c.toUpperCase());
											return `${formatted} Products`;
										}
										return "Search Results";
									}}
									handleAdClick={handleAdClick}
									handleClearSearch={handleClearSearch}
									hasMore={hasMore}
									onLoadMore={handleLoadMore}
								/>
							) : (
								<div className="relative z-10">
									<div className="max-w-7xl mx-auto px-0">
										<div className="mx-0 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10 2xl:mx-12">
											{/* Inline alerts */}
											{error && (
												<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
													<div className="flex items-center">
														<div className="flex-shrink-0">
															<svg
																className="h-5 w-5 text-red-400"
																viewBox="0 0 20 20"
																fill="currentColor"
															>
																<path
																	fillRule="evenodd"
																	d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
																	clipRule="evenodd"
																/>
															</svg>
														</div>
														<div className="ml-3">
															<h3 className="text-sm font-medium text-red-800">
																Search Error
															</h3>
															<div className="mt-1 text-sm text-red-700">
																{error}
															</div>
														</div>
													</div>
												</div>
											)}
											{(categoriesError || adsError) && (
												<div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
													<div className="flex items-center justify-center">
														<div className="flex-shrink-0">
															<svg
																className="h-5 w-5 text-yellow-400"
																viewBox="0 0 20 20"
																fill="currentColor"
															>
																<path
																	fillRule="evenodd"
																	d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
																	clipRule="evenodd"
																/>
															</svg>
														</div>
														<div className="ml-3 text-center">
															<h3 className="text-sm font-medium text-yellow-800">
																Connection Issue
															</h3>
															<div className="mt-1 text-sm text-yellow-700">
																{categoriesError || adsError}
															</div>
															<div className="mt-2">
																<button
																	onClick={() => window.location.reload()}
																	className="text-xs px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md transition-colors"
																>
																	Try Again
																</button>
															</div>
														</div>
													</div>
												</div>
											)}

											{/* Loading state for categories and ads */}
											{!isSearching &&
												(isLoadingCategories || isLoadingAds) && (
													<div className="flex justify-center items-center min-h-[60vh] w-full bg-gray-50 rounded-lg">
														<div className="text-center flex flex-col items-center justify-center">
															<Spinner
																variant="warning"
																name="cube-grid"
																style={{ width: 60, height: 60 }}
															/>
															<div className="mt-4 text-gray-600 font-medium text-center">
																Loading categories and products...
															</div>
															<div className="mt-2 text-gray-500 text-sm text-center">
																Please wait while we fetch the latest products
															</div>
														</div>
													</div>
												)}

											{/* Categories Section - Always show when not searching */}
											{!isSearching &&
												categories.length > 0 &&
												Object.keys(ads).length === 0 &&
												!isLoadingAds && (
													<div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
														<div className="flex items-center justify-center">
															<div className="flex-shrink-0">
																<svg
																	className="h-5 w-5 text-blue-400"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="currentColor"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																	/>
																</svg>
															</div>
															<div className="ml-3">
																<span className="text-sm font-medium text-blue-800">
																	Categories loaded successfully. Loading
																	products...
																</span>
															</div>
														</div>
													</div>
												)}

											{!isSearching &&
												categories.length > 0 &&
												Object.keys(ads).length > 0 && (
													<>
														{(() => {
															// Filter categories that have ads
															const categoriesWithAds = categories.filter(
																(category) => {
																	const allSubcategories =
																		category.subcategories || [];
																	if (allSubcategories.length === 0)
																		return false;

																	const subcategoriesWithAds =
																		allSubcategories.filter(
																			(subcategory) =>
																				ads[subcategory.id] &&
																				Array.isArray(ads[subcategory.id]) &&
																				ads[subcategory.id].length > 0
																		);
																	return subcategoriesWithAds.length > 0;
																}
															);

															// If no categories have ads, show empty state
															if (categoriesWithAds.length === 0) {
																return (
																	<div className="mb-8 p-8 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
																		<div className="text-center">
																			<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
																				<svg
																					className="h-6 w-6 text-gray-400"
																					fill="none"
																					viewBox="0 0 24 24"
																					stroke="currentColor"
																				>
																					<path
																						strokeLinecap="round"
																						strokeLinejoin="round"
																						strokeWidth={2}
																						d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
																					/>
																				</svg>
																			</div>
																			<h3 className="text-lg font-medium text-gray-900 mb-2">
																				No products available at the moment
																			</h3>
																			<p className="text-gray-500 text-sm mb-4">
																				We're working on adding new products.
																				Please check back later.
																			</p>
																			<button
																				onClick={() => window.location.reload()}
																				className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
																			>
																				Refresh Page
																			</button>
																		</div>
																	</div>
																);
															}

															// Function to shuffle an array
															const shuffleArray = (array) => {
																return array
																	.map((value) => ({
																		value,
																		sort: Math.random(),
																	}))
																	.sort((a, b) => a.sort - b.sort)
																	.map(({ value }) => value);
															};

															return categoriesWithAds.map(
																(category, index) => {
																	// Get all subcategories for this category
																	const allSubcategories =
																		category.subcategories || [];

																	// If no subcategories, skip this category
																	if (allSubcategories.length === 0) {
																		return null;
																	}

																	// Check if any subcategory has ads
																	const subcategoriesWithAds =
																		allSubcategories.filter(
																			(subcategory) =>
																				ads[subcategory.id] &&
																				Array.isArray(ads[subcategory.id]) &&
																				ads[subcategory.id].length > 0
																		);

																	// If no subcategories have ads, skip this category
																	if (subcategoriesWithAds.length === 0) {
																		return null;
																	}

																	// Sort subcategories by number of ads (descending) and take first 4
																	const sortedSubcategories =
																		subcategoriesWithAds.sort((a, b) => {
																			const aCount = ads[a.id]
																				? ads[a.id].length
																				: 0;
																			const bCount = ads[b.id]
																				? ads[b.id].length
																				: 0;
																			return bCount - aCount; // Descending order
																		});
																	const randomizedSubcategories =
																		sortedSubcategories.slice(0, 4);

																	return (
																		<div key={category.id} className="mb-8">
																			<CategorySection
																				title={category.name}
																				randomizedSubcategories={
																					randomizedSubcategories
																				}
																				ads={ads}
																				handleAdClick={handleAdClick}
																				handleSubcategoryClick={
																					handleSubcategoryClick
																				}
																			/>
																		</div>
																	);
																}
															);
														})()}
														{isLoadingCategories && (
															<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
																{Array.from({ length: 4 }).map((_, idx) => (
																	<div
																		key={idx}
																		className="h-48 bg-gray-200 animate-pulse rounded"
																	/>
																))}
															</div>
														)}
													</>
												)}

											{/* Popular Ads Section - Always show when not searching */}
											{!isSearching && (
												<PopularAdsSection
													ads={flattenedAds}
													onAdClick={handleAdClick}
													isLoading={isLoadingAds}
												/>
											)}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default Home;
