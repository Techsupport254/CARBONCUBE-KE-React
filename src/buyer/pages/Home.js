import React, {
	useState,
	useEffect,
	useMemo,
	useCallback,
	useRef,
	startTransition,
} from "react";
// import TopNavbar from "../components/TopNavbar"; // Commented out old navbar
import Navbar from "../../components/Navbar"; // New unified navbar
import Banner from "../components/Banner";
import CategorySection from "../components/CategorySection";
import PopularAdsSection from "../components/PopularAdsSection";
import SearchResultSection from "../components/SearchResultSection";
import Spinner from "react-spinkit";
// import AdDetailsModal from '../components/AdDetailsModal';
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate
import { createSlug } from "../../utils/slugUtils";
// import "../css/Home.css"; // Removed CSS import
import Footer from "../../components/Footer";
import {
	logClickEvent,
	logAdSearch,
	logSubcategoryClick,
} from "../../utils/clickEventLogger";
import useSEO from "../../hooks/useSEO";
import {
	generateHomeSEO,
	generateCategoryPageSEO,
} from "../../utils/seoHelpers";
import apiService from "../../services/apiService";

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
	const [bestSellers, setBestSellers] = useState([]);
	const [subcategoryCounts, setSubcategoryCounts] = useState({});
	// const [allAds, setAllAds] = useState({});
	// Loading and error states
	const [isLoadingCategories, setIsLoadingCategories] = useState(true);
	const [isLoadingAds, setIsLoadingAds] = useState(true);
	const [isLoadingBestSellers, setIsLoadingBestSellers] = useState(true);

	// Initial loading states - will be set to false when data loads
	const [categoriesError, setCategoriesError] = useState(null);
	const [adsError, setAdsError] = useState(null);
	const [bestSellersError, setBestSellersError] = useState(null);
	const [error, setError] = useState(null); // search error only
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchShops, setSearchShops] = useState([]); // Add shops state
	const [isSearching, setIsSearching] = useState(false);

	const [currentSearchType, setCurrentSearchType] = useState(""); // Track if it's a subcategory search
	const [displayedResults, setDisplayedResults] = useState([]);
	// eslint-disable-next-line no-unused-vars
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	// eslint-disable-next-line no-unused-vars
	const [hasSearched, setHasSearched] = useState(false); // Track if a search has been performed
	const RESULTS_PER_PAGE = 18; // Show 18 items per page (3 rows of 6 items)
	const navigate = useNavigate(); // Initialize useNavigate
	const [isComponentMounted, setIsComponentMounted] = useState(false);

	// Debounced search functionality
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
	const SEARCH_DELAY = 3000; // 3000ms (3 seconds) delay for debounced search

	// Category and subcategory state for navbar
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedSubcategory, setSelectedSubcategory] = useState("All");

	// Flag to prevent circular updates
	const [isUpdatingUrl, setIsUpdatingUrl] = useState(false);

	// Ref to track abort controller for search requests
	const abortControllerRef = useRef(null);

	// Ref to prevent duplicate requests
	const isProcessingRef = useRef(false);

	// Ref to debounce dropdown selections
	const dropdownDebounceRef = useRef(null);

	// Ref to track last search parameters to prevent duplicate searches
	const lastSearchParamsRef = useRef(null);

	// Get location before using it in seoData
	const location = useLocation();

	// Enhanced SEO Implementation
	const seoData = (() => {
		// Check if we're on a category page
		const searchParams = new URLSearchParams(location.search);
		const categoryParam = searchParams.get("category");
		const subcategoryParam = searchParams.get("subcategory");
		const queryParam = searchParams.get("query");

		// If we have category parameters, generate category-specific SEO
		if (categoryParam && categoryParam !== "All") {
			const category = categories.find(
				(cat) => cat.slug === categoryParam || cat.name === categoryParam
			);
			const subcategory =
				subcategoryParam && subcategoryParam !== "All"
					? categories
							.find((cat) =>
								cat.subcategories?.find(
									(sub) =>
										sub.slug === subcategoryParam ||
										sub.name === subcategoryParam
								)
							)
							?.subcategories?.find(
								(sub) =>
									sub.slug === subcategoryParam || sub.name === subcategoryParam
							)
					: null;

			if (category) {
				return generateCategoryPageSEO(
					category,
					subcategory,
					searchResults,
					queryParam || ""
				);
			}
		}

		// Default to homepage SEO
		return {
			...generateHomeSEO(categories),
			// Advanced SEO Features
			alternateLanguages: [
				{ lang: "en", url: `${window.location.origin}/` },
				{ lang: "sw", url: `${window.location.origin}/sw/` },
			],
			customMetaTags: [
				{
					name: "homepage:featured_categories",
					content: categories
						.slice(0, 5)
						.map((cat) => cat.name)
						.join(", "),
				},
				{
					name: "homepage:total_categories",
					content: categories.length.toString(),
				},
				{
					name: "homepage:marketplace_type",
					content: "E-commerce Marketplace",
				},
				{ name: "homepage:target_country", content: "Kenya" },
				{
					name: "homepage:verification_status",
					content: "Verified Sellers Only",
				},
				{
					property: "og:homepage:featured_categories",
					content: categories
						.slice(0, 5)
						.map((cat) => cat.name)
						.join(", "),
				},
				{
					property: "og:homepage:total_categories",
					content: categories.length.toString(),
				},
				{
					property: "og:homepage:marketplace_type",
					content: "E-commerce Marketplace",
				},
				{ property: "og:homepage:target_country", content: "Kenya" },
				{
					property: "og:homepage:verification_status",
					content: "Verified Sellers Only",
				},
				{ property: "article:section", content: "Homepage" },
				{ property: "article:tag", content: "Marketplace, E-commerce, Kenya" },
			],
			imageWidth: 1200,
			imageHeight: 630,
			themeColor: "#FFD700",
			viewport:
				"width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes",
			// AI Search Optimization
			aiSearchOptimized: true,
			contentType: "marketplace",
			expertiseLevel: "expert",
			contentDepth: "comprehensive",
			aiFriendlyFormat: true,
			conversationalKeywords: [
				"where to buy products online in Kenya",
				"best online marketplace Kenya",
				"trusted sellers Kenya",
				"secure online shopping Kenya",
				"verified marketplace Kenya",
				"how to shop safely online Kenya",
				"Carbon Cube Kenya marketplace",
				"online shopping platform Kenya",
			],
			aiCitationOptimized: true,
			additionalStructuredData: [
				...(generateHomeSEO(categories).additionalStructuredData || []),
				// Enhanced FAQ Schema for Homepage
				{
					"@context": "https://schema.org",
					"@type": "FAQPage",
					mainEntity: [
						{
							"@type": "Question",
							name: "What is Carbon Cube Kenya?",
							acceptedAnswer: {
								"@type": "Answer",
								text: "Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.",
							},
						},
						{
							"@type": "Question",
							name: "How do I start shopping on Carbon Cube Kenya?",
							acceptedAnswer: {
								"@type": "Answer",
								text: "Simply browse our categories, search for products, and purchase from verified sellers. All transactions are secure and protected.",
							},
						},
						{
							"@type": "Question",
							name: "Are all sellers verified on Carbon Cube Kenya?",
							acceptedAnswer: {
								"@type": "Answer",
								text: "Yes, all sellers on Carbon Cube Kenya go through a verification process to ensure quality and reliability.",
							},
						},
						{
							"@type": "Question",
							name: "What payment methods are accepted?",
							acceptedAnswer: {
								"@type": "Answer",
								text: "We accept cash, credit cards, mobile money, and bank transfers for secure transactions.",
							},
						},
					],
				},
				// Enhanced ItemList Schema for Featured Categories
				{
					"@context": "https://schema.org",
					"@type": "ItemList",
					name: "Featured Categories on Carbon Cube Kenya",
					description:
						"Browse our featured product categories from verified sellers",
					numberOfItems: categories.length,
					itemListElement: categories.slice(0, 10).map((category, index) => ({
						"@type": "ListItem",
						position: index + 1,
						item: {
							"@type": "CollectionPage",
							name: category.name,
							description: `Browse ${category.name} products from verified sellers`,
							url: `${window.location.origin}/categories/${category.id}`,
							numberOfItems: category.subcategories?.length || 0,
						},
					})),
				},
			],
		};
	})();

	const seoComponent = useSEO(seoData);

	useEffect(() => {
		let isMounted = true;

		// Fetch all data in parallel for instant loading
		const fetchAllData = async () => {
			try {
				// Start all requests simultaneously
				const [categoriesResult, adsResult, bestSellersResult] =
					await Promise.allSettled([
						// Categories fetch
						apiService
							.batchFetch([
								`${process.env.REACT_APP_BACKEND_URL}/buyer/categories`,
								`${process.env.REACT_APP_BACKEND_URL}/buyer/subcategories`,
							])
							.then(([categoryData, subcategoryData]) => {
								const categoriesWithSubcategories = categoryData.map(
									(category) => ({
										...category,
										subcategories: subcategoryData.filter(
											(sub) => sub.category_id === category.id
										),
									})
								);
								return categoriesWithSubcategories;
							}),

						// Ads fetch with reduced timeout and fewer items
						fetch(
							`${process.env.REACT_APP_BACKEND_URL}/buyer/ads?per_page=100&balanced=true`,
							{
								headers: {
									Accept: "application/json",
									"Content-Type": "application/json",
								},
							}
						).then(async (response) => {
							if (!response.ok) {
								throw new Error(`Failed to fetch ads: ${response.status}`);
							}
							const adData = await response.json();

							// Handle new API response format with subcategory counts
							let ads, subcategoryCounts;
							if (adData.ads && adData.subcategory_counts) {
								// New format with subcategory counts
								ads = adData.ads;
								subcategoryCounts = adData.subcategory_counts;
							} else {
								// Old format - just array of ads
								ads = adData;
								subcategoryCounts = {};
							}

							// Organize ads by subcategory ID
							const organizedAds = {};
							if (Array.isArray(ads)) {
								ads.forEach((ad) => {
									if (ad.subcategory_id) {
										if (!organizedAds[ad.subcategory_id]) {
											organizedAds[ad.subcategory_id] = [];
										}
										organizedAds[ad.subcategory_id].push(ad);
									}
								});
							}

							return { organizedAds, subcategoryCounts };
						}),

						// Best sellers fetch with reduced timeout
						fetch(
							`${process.env.REACT_APP_BACKEND_URL}/best_sellers?limit=20`,
							{
								headers: {
									Accept: "application/json",
									"Content-Type": "application/json",
								},
							}
						).then(async (response) => {
							if (!response.ok) {
								throw new Error(
									`Failed to fetch best sellers: ${response.status}`
								);
							}
							const bestSellersData = await response.json();
							return bestSellersData.best_sellers || [];
						}),
					]);

				// Process results
				if (isMounted) {
					// Handle categories
					if (categoriesResult.status === "fulfilled") {
						setCategories(categoriesResult.value);
						setCategoriesError(null);
					} else {
						console.error("Categories Fetch Error:", categoriesResult.reason);
						setCategoriesError("Failed to load categories");
					}

					// Handle ads
					if (adsResult.status === "fulfilled") {
						setAds(adsResult.value.organizedAds);
						setSubcategoryCounts(adsResult.value.subcategoryCounts);
						setAdsError(null);
					} else {
						console.error("Ads Fetch Error:", adsResult.reason);
						setAdsError("Failed to load ads");
						setAds({});
					}

					// Handle best sellers
					if (bestSellersResult.status === "fulfilled") {
						setBestSellers(bestSellersResult.value);
						setBestSellersError(null);
					} else {
						console.error(
							"Best Sellers Fetch Error:",
							bestSellersResult.reason
						);
						setBestSellersError("Failed to load best sellers");
						setBestSellers([]);
					}
				}
			} catch (err) {
				console.error("Data Fetch Error:", err);
				if (isMounted) {
					setCategoriesError("Failed to load data");
					setAdsError("Failed to load data");
					setBestSellersError("Failed to load data");
				}
			} finally {
				if (isMounted) {
					setIsLoadingCategories(false);
					setIsLoadingAds(false);
					setIsLoadingBestSellers(false);
				}
			}
		};

		fetchAllData();

		return () => {
			isMounted = false;
		};
	}, []);

	// Memoize flattened ads to prevent unnecessary re-renders (kept for other components that might need it)
	// eslint-disable-next-line no-unused-vars
	const flattenedAds = useMemo(() => {
		const flat = Object.values(ads).flat();
		return flat;
	}, [ads]);

	// Update the useEffect that handles location search to better manage state
	useEffect(() => {
		setIsComponentMounted(true);
		return () => setIsComponentMounted(false);
	}, []);

	// Debounced search effect - triggers search after user stops typing
	useEffect(() => {
		// Don't debounce empty queries - clear immediately
		if (!searchQuery || searchQuery.trim() === "") {
			setDebouncedSearchQuery("");
			return;
		}

		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, SEARCH_DELAY);

		return () => clearTimeout(timer);
	}, [searchQuery, SEARCH_DELAY]);

	// Effect to update URL when debounced search query changes
	useEffect(() => {
		if (!isComponentMounted || isUpdatingUrl) {
			return;
		}

		// Update URL with debounced search query
		const params = new URLSearchParams(location.search);
		const currentQuery = params.get("query");
		const category = params.get("category");
		const subcategory = params.get("subcategory");

		// Only update URL if the debounced query is different from current URL query
		if (debouncedSearchQuery !== currentQuery) {
			setIsUpdatingUrl(true);

			const newParams = new URLSearchParams();

			// Add search query if it exists and is not empty
			if (debouncedSearchQuery && debouncedSearchQuery.trim() !== "") {
				newParams.set("query", debouncedSearchQuery.trim());
			}

			// Add category if it exists
			if (category && category !== "All") {
				newParams.set("category", category);
			}

			// Add subcategory if it exists
			if (subcategory && subcategory !== "All") {
				newParams.set("subcategory", subcategory);
			}

			// If we have no search query and no category/subcategory filters, go to home page
			if (!debouncedSearchQuery || debouncedSearchQuery.trim() === "") {
				if (!category || category === "All") {
					if (!subcategory || subcategory === "All") {
						navigate("/", { replace: true });
						setIsUpdatingUrl(false);
						return;
					}
				}
			}

			// Update URL without adding to browser history (replace current entry)
			const newUrl = newParams.toString() ? `/?${newParams.toString()}` : "/";
			navigate(newUrl, { replace: true });

			// Reset the flag after a short delay to allow the navigation to complete
			setTimeout(() => setIsUpdatingUrl(false), 100);
		}
	}, [
		debouncedSearchQuery,
		isComponentMounted,
		navigate,
		isUpdatingUrl,
		location.search,
	]);

	// Effect to handle category/subcategory changes immediately (no debouncing)
	useEffect(() => {
		// This effect handles category/subcategory changes from the navbar
		// It will be triggered when the URL changes due to category/subcategory selection
	}, [location.search]);

	// Simplified effect - just handle empty search state
	useEffect(() => {
		// Prevent running if we're updating URL
		if (isUpdatingUrl) {
			return;
		}

		const params = new URLSearchParams(location.search);
		const query = params.get("query");
		const category = params.get("category");
		const subcategory = params.get("subcategory");

		// Handle empty search query immediately (but allow category/subcategory filtering)
		if (
			(!query || query.trim() === "") &&
			(!category || category === "All") &&
			(!subcategory || subcategory === "All")
		) {
			// Batch state updates to prevent flickering
			startTransition(() => {
				setSearchResults([]);
				setSearchShops([]); // Clear shops
				setCurrentSearchType("");
				setIsSearching(false);
				setHasSearched(false);
				setDisplayedResults([]);
				setCurrentPage(1);
				setHasMore(true);
			});
			return;
		}
	}, [location.search, isUpdatingUrl]);

	// Define fetchSearchResults function using useCallback
	const fetchSearchResults = useCallback(async () => {
		// Prevent multiple simultaneous requests
		if (isSearching || isProcessingRef.current) {
			return;
		}

		isProcessingRef.current = true;
		setIsSearching(true);
		setError(null);

		// Cancel any existing request
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		// Create new AbortController for request cancellation
		const abortController = new AbortController();
		abortControllerRef.current = abortController;
		const timeoutId = setTimeout(() => abortController.abort(), 10000);

		try {
			// Check if component is still mounted
			if (!isComponentMounted) {
				return;
			}

			// Extract search parameters from URL
			const searchParams = new URLSearchParams(location.search);
			const searchQuery = searchParams.get("query") || "";
			const searchCategory = searchParams.get("category") || "All";
			const searchSubcategory = searchParams.get("subcategory") || "All";

			// Use API service for optimized data fetching
			let results;
			if (searchQuery.trim()) {
				// For text search, use the search endpoint
				results = await apiService.searchAds(searchQuery, {
					category: searchCategory,
					subcategory: searchSubcategory,
					page: 1,
					per_page: 20,
				});
			} else {
				// For category/subcategory filtering, use the main ads endpoint
				const params = {
					per_page: 200,
					balanced: true,
				};

				// Add category filter if specified
				if (searchCategory && searchCategory !== "All") {
					params.category_id = searchCategory;
				}

				// Add subcategory filter if specified
				if (searchSubcategory && searchSubcategory !== "All") {
					params.subcategory_id = searchSubcategory;
				}

				results = await apiService.getAds(params);
			}

			clearTimeout(timeoutId);

			// Check if component is still mounted before processing results
			if (!isComponentMounted) {
				return;
			}

			// Add a small delay to prevent rapid flickering
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Check if component is still mounted after delay
			if (!isComponentMounted) {
				return;
			}

			// Process results based on search type
			let ads = [];
			let shops = [];

			if (results.ads) {
				ads = results.ads;
			} else if (Array.isArray(results)) {
				ads = results;
			}

			// Extract shops from results if they exist
			if (results.shops) {
				shops = results.shops;
			}

			// Batch state updates to prevent flickering
			startTransition(() => {
				setSearchResults(ads);
				setSearchShops(shops);

				// Initialize displayed results inline to avoid dependency issues
				const params = new URLSearchParams(location.search);
				const query = params.get("query");

				if (!query || query.trim() === "") {
					setDisplayedResults(ads);
					setCurrentPage(1);
					setHasMore(false); // No pagination for category filtering
				} else {
					const initialResults = ads.slice(0, RESULTS_PER_PAGE);
					setDisplayedResults(initialResults);
					setCurrentPage(1);
					setHasMore(ads.length > RESULTS_PER_PAGE);
				}

				setError(null); // Clear any previous errors
				setHasSearched(true); // Mark that a search was performed
			});

			if (searchQuery.trim()) {
				setCurrentSearchType("search");
				await logAdSearch(searchQuery, searchCategory, searchSubcategory);
			} else if (searchSubcategory !== "All") {
				setCurrentSearchType(`subcategory-${searchSubcategory}`);
			} else {
				setCurrentSearchType("category");
			}
		} catch (error) {
			console.error("Search error:", error);

			// Clear timeout on error
			clearTimeout(timeoutId);

			// Handle different types of errors
			if (error.name === "AbortError") {
				// Request was cancelled or timed out
				setError("Request timed out. Please try again.");
			} else if (
				error.message.includes("Failed to fetch") ||
				error.message.includes("ERR_NETWORK_CHANGED")
			) {
				setError("Network error. Please check your connection and try again.");
			} else if (error.message.includes("ERR_CONNECTION_REFUSED")) {
				setError("Unable to connect to server. Please try again later.");
			} else {
				setError(error.message);
			}

			setSearchResults([]);
			setSearchShops([]);
			setIsSearching(false);
			setHasSearched(false);
		} finally {
			setIsSearching(false);
			isProcessingRef.current = false;
			// Clear the abort controller ref if this is the current request
			if (abortControllerRef.current === abortController) {
				abortControllerRef.current = null;
			}
		}
	}, [location.search, isComponentMounted, isSearching]);

	// Separate effect to handle URL changes and trigger search
	useEffect(() => {
		// Only run if component is mounted and not updating URL
		if (!isComponentMounted || isUpdatingUrl) {
			return;
		}

		// Extract search parameters from URL
		const searchParams = new URLSearchParams(location.search);
		const query = searchParams.get("query") || "";
		const category = searchParams.get("category") || "All";
		const subcategory = searchParams.get("subcategory") || "All";

		// Create search parameters object for comparison
		const currentSearchParams = {
			query: query,
			category: category,
			subcategory: subcategory,
		};

		// Check if search parameters have actually changed
		const paramsChanged =
			JSON.stringify(currentSearchParams) !==
			JSON.stringify(lastSearchParamsRef.current);

		if (paramsChanged) {
			lastSearchParamsRef.current = currentSearchParams;
			// Execute search only if parameters have changed
			fetchSearchResults();
		}
	}, [location.search, isComponentMounted, isUpdatingUrl, fetchSearchResults]);

	// Cleanup effect to abort pending requests on unmount
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
				abortControllerRef.current = null;
			}
			isProcessingRef.current = false;
			// Clear dropdown debounce timeout
			if (dropdownDebounceRef.current) {
				clearTimeout(dropdownDebounceRef.current);
				dropdownDebounceRef.current = null;
			}
			// Reset search params tracking
			lastSearchParamsRef.current = null;
		};
	}, []);

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

	const handleShopClick = (shop) => {
		const slug = createSlug(shop.enterprise_name);
		navigate(`/shop/${slug}`);
	};

	// Function to log a click event

	const handleSearch = (query, category = "All", subcategory = "All") => {
		// Don't search if query is empty and no category/subcategory filters
		if (!query.trim() && category === "All" && subcategory === "All") {
			return;
		}

		// Update the search query state
		setSearchQuery(query);

		// Build search URL with proper parameters
		const params = new URLSearchParams();
		if (query.trim()) {
			params.set("query", query.trim());
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
		setSearchShops([]); // Clear shops
		setSearchQuery("");
		setCurrentSearchType("");
		setIsSearching(false);
		setDisplayedResults([]);
		setCurrentPage(1);
		setHasMore(true);
		setHasSearched(false); // Reset search state
	};

	const handleSubcategoryLoadMore = (
		newProducts,
		subcategoryName,
		subcategoryId
	) => {
		// Batch state updates to prevent flickering
		startTransition(() => {
			// Add the new products to the existing search results
			const updatedResults = [...searchResults, ...newProducts];

			// Update the search results with the new products
			setSearchResults(updatedResults);
			setDisplayedResults(updatedResults);
		});
	};

	// Wrapper function for navbar search (maintains old signature)
	const handleNavbarSearch = (query, category = "All", subcategory = "All") => {
		handleSearch(query, category, subcategory);
	};

	// Handlers for category and subcategory changes
	const handleCategoryChange = (categoryId) => {
		// Prevent unnecessary updates if the same category is selected
		if (selectedCategory === categoryId) {
			return;
		}

		// Clear any existing debounce
		if (dropdownDebounceRef.current) {
			clearTimeout(dropdownDebounceRef.current);
		}

		// Debounce the dropdown selection to prevent rapid updates
		dropdownDebounceRef.current = setTimeout(() => {
			// Batch all state updates and navigation to prevent flickering
			startTransition(() => {
				setSelectedCategory(categoryId);
				setSelectedSubcategory("All");

				// Trigger search immediately for category changes
				const params = new URLSearchParams();
				if (searchQuery.trim()) {
					params.set("query", searchQuery.trim());
				}
				if (categoryId !== "All") {
					params.set("category", categoryId);
				}
				navigate(`/?${params.toString()}`);
			});
		}, 100); // Small delay to prevent rapid-fire updates
	};

	const handleSubcategoryChange = (subcategoryId) => {
		// Prevent unnecessary updates if the same subcategory is selected
		if (selectedSubcategory === subcategoryId) {
			return;
		}

		// Clear any existing debounce
		if (dropdownDebounceRef.current) {
			clearTimeout(dropdownDebounceRef.current);
		}

		// Debounce the dropdown selection to prevent rapid updates
		dropdownDebounceRef.current = setTimeout(() => {
			// Batch all state updates and navigation to prevent flickering
			startTransition(() => {
				setSelectedSubcategory(subcategoryId);

				// Trigger search immediately for subcategory changes
				const params = new URLSearchParams();
				if (searchQuery.trim()) {
					params.set("query", searchQuery.trim());
				}
				if (selectedCategory !== "All") {
					params.set("category", selectedCategory);
				}
				if (subcategoryId !== "All") {
					params.set("subcategory", subcategoryId);
				}
				navigate(`/?${params.toString()}`);
			});
		}, 100); // Small delay to prevent rapid-fire updates
	};

	// Do not early-return on error; show alerts inline instead

	return (
		<>
			{seoComponent}
			<Navbar
				mode="buyer"
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				handleSearch={handleNavbarSearch}
				onSidebarToggle={handleSidebarToggle}
				showSearch={true}
				showCategories={true}
				showUserMenu={true}
				showNotifications={true}
				showCart={true}
				showWishlist={true}
				isSearchLoading={isSearching}
				selectedCategory={selectedCategory}
				selectedSubcategory={selectedSubcategory}
				onCategoryChange={handleCategoryChange}
				onSubcategoryChange={handleSubcategoryChange}
			/>
			<div className="flex flex-col xl:flex-row gap-2 sm:gap-4 lg:gap-6 xl:gap-8">
				<div className="flex-1 min-w-0 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 pb-2 sm:pb-4 md:pb-6 lg:pb-8 relative z-0 transition-all duration-300 ease-in-out">
					<div className="w-full">
						{/* Show Banner only when not in search mode */}
						{(() => {
							const params = new URLSearchParams(location.search);
							const query = params.get("query");
							const category = params.get("category");

							const subcategory = params.get("subcategory");
							const hasSearchParams =
								query !== null ||
								(category && category !== "All") ||
								(subcategory && subcategory !== "All");

							// Hide banner if searching, has search query, or has URL search parameters
							return !isSearching && !searchQuery && !hasSearchParams;
						})() && <Banner />}
						<div
							className={`px-0 ${(() => {
								const params = new URLSearchParams(location.search);
								const query = params.get("query");
								const category = params.get("category");
								const subcategory = params.get("subcategory");
								const hasSearchParams =
									query !== null ||
									(category && category !== "All") ||
									(subcategory && subcategory !== "All");

								// Use normal positioning for search results, responsive overlap positioning for homepage
								return hasSearchParams || searchQuery || isSearching
									? "mt-4" // Normal spacing for search results
									: "mt-0 sm:-translate-y-[5vh] md:-translate-y-[8vh] lg:-translate-y-[10vh] xl:-translate-y-[12vh] 2xl:-translate-y-[15vh]"; // Responsive overlap for homepage
							})()} relative z-10 transition-transform duration-300`}
						>
							{isSearching ? (
								<div className="flex justify-center items-center h-screen w-full">
									<Spinner
										variant="warning"
										name="cube-grid"
										style={{ width: 50, height: 50 }}
									/>
								</div>
							) : (() => {
									// Check if we're in a search context
									const params = new URLSearchParams(location.search);
									const query = params.get("query");
									const category = params.get("category");
									const subcategory = params.get("subcategory");

									// Only show search results if we have a query parameter OR category/subcategory filtering
									return (
										query !== null ||
										(category && category !== "All") ||
										(subcategory && subcategory !== "All")
									);
							  })() ? (
								<SearchResultSection
									results={displayedResults}
									searchQuery={searchQuery}
									searchShops={searchShops}
									handleShopClick={handleShopClick}
									isLoading={isSearching}
									errorMessage={error}
									isSearchContext={(() => {
										const params = new URLSearchParams(location.search);
										const query = params.get("query");
										const category = params.get("category");
										const subcategory = params.get("subcategory");
										// True for search queries OR category/subcategory filtering
										return (
											query !== null ||
											(category && category !== "All") ||
											(subcategory && subcategory !== "All")
										);
									})()}
									onRetry={() => {
										// Retry the search
										const params = new URLSearchParams(location.search);
										const query = params.get("query");
										if (query) {
											handleSearch(query);
										}
									}}
									getHeaderTitle={() => {
										// Get URL parameters for category and subcategory
										const params = new URLSearchParams(location.search);
										const categoryParam = params.get("category");
										const subcategoryParam = params.get("subcategory");

										// If we have subcategory filter, show subcategory name
										if (subcategoryParam && subcategoryParam !== "All") {
											const category = categories.find(
												(c) =>
													c.id === parseInt(categoryParam) ||
													c.id === categoryParam
											);
											if (category) {
												const subcategory = category.subcategories?.find(
													(sc) =>
														sc.id === parseInt(subcategoryParam) ||
														sc.id === subcategoryParam
												);
												if (subcategory) {
													return `${subcategory.name} Products`;
												}
											}
										}

										// If we have category filter, show category name
										if (categoryParam && categoryParam !== "All") {
											const category = categories.find(
												(c) =>
													c.id === parseInt(categoryParam) ||
													c.id === categoryParam
											);
											if (category) {
												return `${category.name} Products`;
											}
										}

										// Fallback for search queries
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
									onLoadMore={handleSubcategoryLoadMore}
									selectedCategory={(() => {
										const params = new URLSearchParams(location.search);
										return params.get("category") || "All";
									})()}
									selectedSubcategory={(() => {
										const params = new URLSearchParams(location.search);
										return params.get("subcategory") || "All";
									})()}
									categories={categories}
									subcategoryCounts={subcategoryCounts}
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

															// Note: shuffleArray function removed as it was unused
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

														{/* Skeleton loading for ads when categories are loaded but ads are still loading */}
														{!isLoadingCategories && isLoadingAds && (
															<div className="space-y-8">
																{Array.from({ length: 3 }).map(
																	(_, categoryIdx) => (
																		<div key={categoryIdx} className="mb-8">
																			<div className="h-8 bg-gray-200 animate-pulse rounded mb-4 w-48"></div>
																			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
																				{Array.from({ length: 6 }).map(
																					(_, adIdx) => (
																						<div
																							key={adIdx}
																							className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
																						>
																							<div className="h-32 sm:h-36 lg:h-40 bg-gray-200 animate-pulse"></div>
																							<div className="p-2 sm:p-3">
																								<div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
																								<div className="h-3 bg-gray-200 animate-pulse rounded w-2/3"></div>
																							</div>
																						</div>
																					)
																				)}
																			</div>
																		</div>
																	)
																)}
															</div>
														)}
													</>
												)}

											{/* Popular Ads Section - Always show when not searching */}
											{!isSearching && (
												<PopularAdsSection
													ads={bestSellers}
													onAdClick={handleAdClick}
													isLoading={isLoadingBestSellers}
													errorMessage={bestSellersError}
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
