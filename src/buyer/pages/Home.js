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
import { useNavigate, useSearchParams } from "react-router-dom"; // Import useSearchParams
import { createSlug } from "../../utils/slugUtils";
// import "../css/Home.css"; // Removed CSS import
import Footer from "../../components/Footer";
import {
	logClickEvent,
	logAdSearch,
	logSubcategoryClick,
} from "../../utils/clickEventLogger";
import ComprehensiveSEO from "../../components/ComprehensiveSEO";
import HomepageSEO from "../../components/HomepageSEO";
import {
	generateHomeSEO,
	generateCategoryPageSEO,
} from "../../utils/seoHelpers";
import apiService from "../../services/apiService";
// import {
// 	smartReshuffle,
// 	createDebouncedReshuffle,
// 	AutoReshuffleManager,
// 	enhancedSmartReshuffle,
// } from "../utils/adReshuffleUtils";

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

const Home = ({ onLogout }) => {
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
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchShops, setSearchShops] = useState([]); // Add shops state
	const [isSearching, setIsSearching] = useState(false);
	const [totalResultsCount, setTotalResultsCount] = useState(0); // Add total results count state

	const [currentSearchType, setCurrentSearchType] = useState(""); // Track if it's a subcategory search
	const [displayedResults, setDisplayedResults] = useState([]);
	// eslint-disable-next-line no-unused-vars
	const [currentPage, setCurrentPage] = useState(1);
	// eslint-disable-next-line no-unused-vars
	const [hasSearched, setHasSearched] = useState(false); // Track if a search has been performed
	const RESULTS_PER_PAGE = 24; // Show 24 items per page (6 items per row × 4 rows)
	const navigate = useNavigate(); // Initialize useNavigate
	const [searchParams] = useSearchParams(); // Initialize useSearchParams
	const [isComponentMounted, setIsComponentMounted] = useState(false);

	// Removed SEARCH_DELAY constant - search now only triggers on form submission

	// Category and subcategory state for navbar
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedSubcategory, setSelectedSubcategory] = useState("All");

	// Flag to track if component has been initialized from URL parameters
	const [isInitialized, setIsInitialized] = useState(false);

	// Ref to track abort controller for search requests
	const abortControllerRef = useRef(null);

	// Enhanced reshuffle functionality state
	const [lastReshuffleTime, setLastReshuffleTime] = useState(null);
	const [isReshuffling, setIsReshuffling] = useState(false);
	// const [reshuffleTrigger, setReshuffleTrigger] = useState("initial"); // Commented out unused variable
	const [userBehavior, setUserBehavior] = useState(
		{
			preferredCategories: [],
			clickedAds: [],
			avoidedAds: [],
			timeOnPage: 0,
			lastActivity: Date.now(),
			scrollDepth: 0,
		},
		[navigate]
	);
	// const autoReshuffleManagerRef = useRef(null); // Commented out unused variable
	const pageLoadTimeRef = useRef(Date.now());

	// Ref to prevent duplicate requests
	const isProcessingRef = useRef(false);

	// Ref to debounce dropdown selections
	const dropdownDebounceRef = useRef(null);

	// Ref to track last search parameters to prevent duplicate searches
	const lastSearchParamsRef = useRef(null);

	// Get search parameters for SEO and other uses

	// Enhanced SEO Implementation with React Helmet
	const seoData = (() => {
		// Check if we're on a category page
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

		// Default to homepage SEO with enhanced React Helmet integration
		return {
			...generateHomeSEO(categories),
			// Enhanced URL and canonical - use proper canonical URL
			url: "https://carboncube-ke.com",
			canonical: "https://carboncube-ke.com",
			// Enhanced hreflang for internationalization
			alternateLanguages: [
				{ lang: "en", url: "https://carboncube-ke.com/" },
				{ lang: "sw-KE", url: "https://carboncube-ke.com/sw-KE/" },
				{ lang: "x-default", url: "https://carboncube-ke.com/" },
			],
			customMetaTags: [
				// Homepage-specific meta tags
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
				{ name: "homepage:launch_year", content: "2023" },
				{ name: "homepage:business_type", content: "B2B Marketplace" },

				// Open Graph enhancements
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
				{
					property: "article:tag",
					content: "Marketplace, E-commerce, Kenya, B2B, Verified Sellers",
				},

				// Business information
				{
					name: "business:contact_data:street_address",
					content: "9th Floor, CMS Africa, Kilimani",
				},
				{ name: "business:contact_data:locality", content: "Nairobi" },
				{ name: "business:contact_data:region", content: "Nairobi" },
				{ name: "business:contact_data:postal_code", content: "00100" },
				{ name: "business:contact_data:country_name", content: "Kenya" },
				{
					name: "business:contact_data:phone_number",
					content: "+254 712 990 524",
				},
				{
					name: "business:contact_data:email",
					content: "info@carboncube-ke.com",
				},

				// Geographic and language information
				{ name: "geo.region", content: "KE" },
				{ name: "geo.placename", content: "Nairobi, Kenya" },
				{ name: "geo.position", content: "-1.2921;36.8219" },
				{ name: "ICBM", content: "-1.2921, 36.8219" },
				{ name: "language", content: "English" },
				{ name: "locale", content: "en_KE" },

				// Mobile and app information
				{ name: "mobile-web-app-capable", content: "yes" },
				{ name: "apple-mobile-web-app-capable", content: "yes" },
				{ name: "apple-mobile-web-app-status-bar-style", content: "default" },
				{ name: "apple-mobile-web-app-title", content: "Carbon Cube Kenya" },
				{ name: "application-name", content: "Carbon Cube Kenya" },
				{ name: "msapplication-TileColor", content: "#FFD700" },
				{ name: "msapplication-config", content: "/browserconfig.xml" },

				// Performance and accessibility
				{ name: "format-detection", content: "telephone=no" },
				{ name: "referrer", content: "strict-origin-when-cross-origin" },
				{ name: "theme-color", content: "#FFD700" },
				{ name: "msapplication-navbutton-color", content: "#FFD700" },
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
				"verified suppliers Kenya",
				"B2B marketplace Kenya",
				"industrial supplies Kenya",
				"auto parts Kenya",
				"hardware suppliers Kenya",
				"business supplies Kenya",
				"procurement Kenya",
				"digital marketplace Kenya",
				"AI-powered marketplace Kenya",
				"sustainable sourcing Kenya",
				"fast delivery Kenya",
				"secure payment Kenya",
				"mobile money Kenya",
				"M-Pesa Kenya",
				"cash on delivery Kenya",
				"free shipping Kenya",
				"online shopping Kenya",
				"ecommerce Kenya",
				"digital procurement Kenya",
				"seller verification Kenya",
				"business growth Kenya",
				"Carbon Cube Kenya marketplace",
				"online shopping platform Kenya",
				"how to shop safely online Kenya",
				"verified marketplace Kenya",
				"secure online shopping Kenya",
			],
			aiCitationOptimized: true,
			// Enhanced structured data for React Helmet
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
				// Enhanced Organization Schema
				{
					"@context": "https://schema.org",
					"@type": "Organization",
					name: "Carbon Cube Kenya",
					description:
						"Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.",
					url: "https://carboncube-ke.com",
					logo: "https://carboncube-ke.com/logo.png",
					contactPoint: {
						"@type": "ContactPoint",
						contactType: "customer service",
						availableLanguage: "English",
						areaServed: "KE",
						telephone: "+254 712 990 524",
						email: "info@carboncube-ke.com",
					},
					address: {
						"@type": "PostalAddress",
						streetAddress: "9th Floor, CMS Africa, Kilimani",
						addressLocality: "Nairobi",
						addressRegion: "Nairobi",
						addressCountry: "KE",
						postalCode: "00100",
					},
					foundingDate: "2023",
					industry: "Internet Marketplace Platforms",
					sameAs: [
						"https://www.facebook.com/carboncube.kenya",
						"https://www.instagram.com/carboncube.kenya",
						"https://www.linkedin.com/company/carbon-cube-kenya",
					],
				},
				// Enhanced LocalBusiness Schema
				{
					"@context": "https://schema.org",
					"@type": "LocalBusiness",
					name: "Carbon Cube Kenya",
					description:
						"Smart, AI-powered marketplace connecting credible sellers with serious buyers in Kenya",
					url: "https://carboncube-ke.com",
					telephone: "+254 712 990 524",
					email: "info@carboncube-ke.com",
					image: "https://carboncube-ke.com/logo.png",
					address: {
						"@type": "PostalAddress",
						streetAddress: "9th Floor, CMS Africa, Kilimani",
						addressLocality: "Nairobi",
						addressRegion: "Nairobi",
						addressCountry: "KE",
						postalCode: "00100",
					},
					geo: {
						"@type": "GeoCoordinates",
						latitude: -1.2921,
						longitude: 36.8219,
					},
					openingHours: "Mo-Su 00:00-23:59",
					priceRange: "$$",
					currenciesAccepted: "KES",
					paymentAccepted: "Cash, Credit Card, Mobile Money, M-Pesa",
					areaServed: "KE",
					serviceType: "Online Marketplace",
				},
				// Enhanced BreadcrumbList Schema
				{
					"@context": "https://schema.org",
					"@type": "BreadcrumbList",
					itemListElement: [
						{
							"@type": "ListItem",
							position: 1,
							name: "Home",
							item: "https://carboncube-ke.com/",
						},
					],
				},
				// Enhanced Service Schema
				{
					"@context": "https://schema.org",
					"@type": "Service",
					name: "Online Marketplace Services",
					description:
						"AI-powered marketplace connecting verified sellers with buyers in Kenya",
					provider: {
						"@type": "Organization",
						name: "Carbon Cube Kenya",
					},
					areaServed: {
						"@type": "Country",
						name: "Kenya",
					},
					serviceType: "E-commerce Marketplace",
					offers: {
						"@type": "Offer",
						description: "Free registration for buyers and sellers",
						price: "0",
						priceCurrency: "KES",
					},
				},
			],
		};
	})();

	// Prepare SEO data for ComprehensiveSEO component
	// const seoConfig = (() => { // Commented out unused variable
	// 	const categoryParam = searchParams.get("category");
	// 	const subcategoryParam = searchParams.get("subcategory");
	// 	const queryParam = searchParams.get("query");

	// 	return {
	// 		pageType: categoryParam && categoryParam !== "All" ? "category" : "home",
	// 		data: {
	// 			categories,
	// 			searchResults,
	// 			category:
	// 				categoryParam && categoryParam !== "All"
	// 					? categories.find(
	// 							(cat) =>
	// 								cat.slug === categoryParam || cat.name === categoryParam
	// 					  )
	// 					: null,
	// 			subcategory:
	// 				subcategoryParam && subcategoryParam !== "All"
	// 					? categories
	// 							.find((cat) =>
	// 								cat.subcategories?.find(
	// 									(sub) =>
	// 										sub.slug === subcategoryParam ||
	// 										sub.name === subcategoryParam
	// 								)
	// 							)
	// 							?.subcategories?.find(
	// 								(sub) =>
	// 									sub.slug === subcategoryParam ||
	// 									sub.name === subcategoryParam
	// 							)
	// 					: null,
	// 			query: queryParam || "",
	// 			// Additional data for enhanced SEO
	// 			count: searchResults.length,
	// 			name:
	// 				categoryParam && categoryParam !== "All"
	// 					? categories.find(
	// 							(cat) =>
	// 								cat.slug === categoryParam || cat.name === categoryParam
	// 					  )?.name
	// 					: "Carbon Cube Kenya",
	// 			subcategories:
	// 				categoryParam && categoryParam !== "All"
	// 					? categories
	// 							.find(
	// 								(cat) =>
	// 									cat.slug === categoryParam || cat.name === categoryParam
	// 							)
	// 							?.subcategories?.map((sub) => sub.name)
	// 							.join(", ")
	// 					: "",
	// 		},
	// 		customConfig: {
	// 			// Override default config with our enhanced SEO data
	// 			...seoData,
	// 			// Ensure proper URL handling
	// 			url: window.location.href,
	// 			canonical: window.location.href,
	// 		},
	// 	};
	// })();

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

							// Process ads data

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
						setCategoriesError("Failed to load categories");
					}

					// Handle ads
					if (adsResult.status === "fulfilled") {
						setAds(adsResult.value.organizedAds);
						setSubcategoryCounts(adsResult.value.subcategoryCounts);
						setAdsError(null);
					} else {
						setAdsError("Failed to load ads");
						setAds({});
					}

					// Handle best sellers
					if (bestSellersResult.status === "fulfilled") {
						setBestSellers(bestSellersResult.value);
						setBestSellersError(null);
					} else {
						setBestSellersError("Failed to load best sellers");
						setBestSellers([]);
					}
				}
			} catch (err) {
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

	// Initialize component state from URL parameters on mount
	useEffect(() => {
		setIsComponentMounted(true);

		// Initialize state directly from URL parameters
		const query = searchParams.get("query") || "";
		const category = searchParams.get("category") || "All";
		const subcategory = searchParams.get("subcategory") || "All";
		const page = searchParams.get("page") || "1";

		// Initialize all state from URL parameters immediately
		setSearchQuery(query);
		// Convert category and subcategory to numbers if they're not "All"
		setSelectedCategory(category === "All" ? "All" : parseInt(category, 10));
		setSelectedSubcategory(
			subcategory === "All" ? "All" : parseInt(subcategory, 10)
		);
		setCurrentPage(parseInt(page, 10));

		// Removed debounced query initialization - search now only triggers on form submission

		// Don't set lastSearchParamsRef here - let the URL change effect handle it
		// This ensures the URL change effect can detect initial load with search params

		// Mark as initialized to prevent debounced search from running
		setIsInitialized(true);

		return () => setIsComponentMounted(false);
	}, [searchParams]);

	// Removed debounced search effect - search now only triggers on form submission

	// Removed URL update effect - URL updating now happens in handleSearch function

	// Effect to handle category/subcategory changes immediately (no debouncing)
	useEffect(() => {
		// This effect handles category/subcategory changes from the navbar
		// It will be triggered when the URL changes due to category/subcategory selection
	}, [searchParams]);

	// Simplified effect - just handle empty search state
	useEffect(() => {
		const query = searchParams.get("query");
		const category = searchParams.get("category");
		const subcategory = searchParams.get("subcategory");

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
			});
			return;
		}
	}, [searchParams]);

	// Define fetchSearchResults function using useCallback
	const fetchSearchResults = useCallback(
		async (
			pageOverride = null,
			queryOverride = null,
			categoryOverride = null,
			subcategoryOverride = null
		) => {
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

				// Extract search parameters from URL or use overrides
				const searchQuery =
					queryOverride !== null
						? queryOverride
						: searchParams.get("query") || "";
				const searchCategory =
					categoryOverride !== null
						? categoryOverride
						: searchParams.get("category") || "All";
				const searchSubcategory =
					subcategoryOverride !== null
						? subcategoryOverride
						: searchParams.get("subcategory") || "All";
				// Use pageOverride if provided, otherwise get from URL
				const currentPage =
					pageOverride !== null
						? pageOverride
						: parseInt(searchParams.get("page") || "1", 10);

				// Determine if we're in search mode (any search parameters present)
				const hasSearchParams =
					searchQuery.trim() ||
					(searchCategory && searchCategory !== "All") ||
					(searchSubcategory && searchSubcategory !== "All");

				// Use API service for optimized data fetching
				let results;
				if (searchQuery.trim()) {
					// Special handling for "best sellers" query
					if (
						searchQuery.toLowerCase().includes("best sellers") ||
						searchQuery.toLowerCase().includes("best+sellers")
					) {
						// For best sellers, use the best sellers endpoint
						results = await apiService.getBestSellers({
							page: currentPage,
							per_page: RESULTS_PER_PAGE,
						});
					} else {
						// For regular text search, use the search endpoint with category filtering
						results = await apiService.searchAds(searchQuery, {
							category: searchCategory,
							subcategory: searchSubcategory,
							page: currentPage,
							per_page: RESULTS_PER_PAGE, // Always 24 for search results
						});
					}
				} else {
					// For category/subcategory filtering without search query, use the main ads endpoint
					const params = {
						page: currentPage,
					};

					// Use different per_page based on search mode
					if (hasSearchParams) {
						// Search mode: fetch exactly 24 items per page
						params.per_page = RESULTS_PER_PAGE;
					} else {
						// Home page mode: fetch more items to display normally
						params.per_page = 200;
					}

					// Only use balanced distribution if no category/subcategory filtering
					if (searchCategory === "All" && searchSubcategory === "All") {
						params.balanced = true;
					}

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

				if (results.best_sellers) {
					// Best sellers response format
					ads = results.best_sellers;
				} else if (results.ads) {
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

					// Calculate and store total results count
					const totalCount =
						results.pagination?.total_count ||
						results.pagination?.ads?.total_count ||
						results.total_count ||
						results.total ||
						ads.length;

					setTotalResultsCount(totalCount);

					// Initialize displayed results inline to avoid dependency issues
					const query = searchParams.get("query");

					if (!query || query.trim() === "") {
						setDisplayedResults(ads);
						setCurrentPage(currentPage); // Use the page we're fetching
					} else {
						// For search queries, show all results from first page
						setDisplayedResults(ads);
						setCurrentPage(currentPage); // Use the page we're fetching
					}

					setError(null); // Clear any previous errors
					setHasSearched(true); // Mark that a search was performed
				});

				if (searchQuery.trim()) {
					// Check if it's a best sellers search
					if (
						searchQuery.toLowerCase().includes("best sellers") ||
						searchQuery.toLowerCase().includes("best+sellers")
					) {
						setCurrentSearchType("best-sellers");
					} else {
						setCurrentSearchType("search");
						await logAdSearch(searchQuery, searchCategory, searchSubcategory);
					}
				} else if (searchSubcategory !== "All") {
					setCurrentSearchType(`subcategory-${searchSubcategory}`);
				} else {
					setCurrentSearchType("category");
				}
			} catch (error) {
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
					setError(
						"Network error. Please check your connection and try again."
					);
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
		},
		[searchParams, isComponentMounted, isSearching]
	);

	// Separate effect to handle URL changes and trigger search
	useEffect(() => {
		// Only run if component is mounted and initialized
		if (!isComponentMounted || !isInitialized) {
			return;
		}

		// Extract search parameters from URL
		const query = searchParams.get("query") || "";
		const category = searchParams.get("category") || "All";
		const subcategory = searchParams.get("subcategory") || "All";
		const page = searchParams.get("page") || "1";

		// Create search parameters object for comparison
		const currentSearchParams = {
			query: query,
			category: category,
			subcategory: subcategory,
			page: page,
		};

		// Check if search parameters have actually changed
		const paramsChanged =
			JSON.stringify(currentSearchParams) !==
			JSON.stringify(lastSearchParamsRef.current);

		// Also trigger search if we have search parameters and this is the first time we're seeing them
		const hasSearchParams =
			query.trim() || category !== "All" || subcategory !== "All";

		// Check if this is the first time we're processing these search parameters
		const isFirstTimeWithParams =
			hasSearchParams && !lastSearchParamsRef.current;

		// ENABLED: Trigger searches based on URL parameters for category/subcategory filtering
		// This allows filtering when navigating with category/subcategory parameters
		lastSearchParamsRef.current = currentSearchParams;

		// Only trigger search if parameters have actually changed or this is the first time
		if (paramsChanged || isFirstTimeWithParams) {
			fetchSearchResults();
		} else {
		}
	}, [searchParams, isComponentMounted, isInitialized, fetchSearchResults]);

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

	const handleAdClick = useCallback(
		async (adUrl, adId) => {
			if (!adId || adId === "unknown") {
				// Still try to navigate even with invalid ID for better UX
			}

			try {
				// Log the 'Ad-Click' event before navigating (only if adId is valid)
				if (
					adId &&
					adId !== "unknown" &&
					typeof adId === "string" &&
					adId.length > 0
				) {
					await logClickEvent(adId, "Ad-Click");
				} else {
					// Skip click event logging due to invalid adId
				}

				// Preserve current query parameters when navigating to ad details
				const currentParams = new URLSearchParams(window.location.search);
				const currentQuery = currentParams.toString();
				const separator = currentQuery ? "&" : "?";

				// Navigate to the ad details page with preserved query parameters
				navigate(`${adUrl}${separator}${currentQuery}`);
			} catch (error) {
				// Proceed with navigation even if logging fails
				const currentParams = new URLSearchParams(window.location.search);
				const currentQuery = currentParams.toString();
				const separator = currentQuery ? "&" : "?";
				navigate(`${adUrl}${separator}${currentQuery}`);
			}
		},
		[navigate]
	);

	const handleShopClick = (shop) => {
		const slug = createSlug(shop.enterprise_name);

		// Preserve current query parameters when navigating to shop
		const currentParams = new URLSearchParams(window.location.search);
		const currentQuery = currentParams.toString();
		const separator = currentQuery ? "?" : "";

		navigate(`/shop/${slug}${separator}${currentQuery}`);
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

		// Reset page to 1 when search parameters change
		params.set("page", "1");

		// Navigate to search results
		navigate(`/?${params.toString()}`);
	};

	// Update handleSubcategoryClick to use URL navigation and handle the search properly
	const handleSubcategoryClick = async (subcategoryName, categoryId) => {
		// Navigate to URL with subcategory parameters using category ID
		navigate(
			`/?query=&category=${categoryId}&subcategory=${encodeURIComponent(
				subcategoryName
			)}`
		);

		// Log the subcategory click
		await logSubcategoryClick(subcategoryName, categoryId);
	};

	// Reshuffle functionality
	const performReshuffle = useCallback(
		(options = {}) => {
			if (isReshuffling || Object.keys(ads).length === 0) return;

			const {
				trigger = "manual",
				// userBehavior: reshuffleUserBehavior, // Commented out unused variable
				// timestamp, // Commented out unused variable
				sessionDuration,
			} = options;

			setIsReshuffling(true);
			// setReshuffleTrigger(trigger); // Commented out - variable not defined

			try {
				// Update user behavior with current session data
				const currentTimeOnPage = Date.now() - pageLoadTimeRef.current;
				const scrollDepth = Math.max(
					userBehavior.scrollDepth || 0,
					(window.scrollY /
						(document.documentElement.scrollHeight - window.innerHeight)) *
						100
				);

				const updatedUserBehavior = {
					...userBehavior,
					timeOnPage: currentTimeOnPage,
					lastActivity: Date.now(),
					scrollDepth,
					sessionDuration:
						sessionDuration || Date.now() - pageLoadTimeRef.current,
					trigger,
				};

				// Use enhanced smart reshuffle for better personalization
				// const reshuffledAds = enhancedSmartReshuffle( // Commented out - function not imported
				// 	ads,
				// 	updatedUserBehavior,
				// 	{ trigger, timestamp },
				// 	{
				// 		maintainTierOrder: true,
				// 		shuffleWithinTier: true,
				// 	}
				// );

				// Fallback: simple reshuffle without enhanced features
				const reshuffledAds = ads; // Keep original ads for now

				// Update ads state with smooth transition
				setAds(reshuffledAds);
				setLastReshuffleTime(Date.now());

				// Update user behavior state
				setUserBehavior(updatedUserBehavior);
			} catch (error) {
				// Handle reshuffle error silently
			} finally {
				setIsReshuffling(false);
			}
		},
		[ads, userBehavior, isReshuffling]
	);

	// Debounced reshuffle function
	// const debouncedReshuffle = useMemo( // Commented out unused variable
	// 	() => createDebouncedReshuffle(performReshuffle, 2000),
	// 	[performReshuffle]
	// );

	// Enhanced automatic reshuffle system
	useEffect(() => {
		if (Object.keys(ads).length === 0 || !isComponentMounted) return;

		// Initialize the auto reshuffle manager
		// const reshuffleManager = new AutoReshuffleManager(); // Commented out - class not imported

		// Define reshuffle callbacks (silent operation)
		// const onReshuffleStart = (triggerType) => { // Commented out unused variable
		// 	setIsReshuffling(true);
		// 	// setReshuffleTrigger(triggerType); // Commented out - variable not defined
		// };

		// const onReshuffleEnd = (triggerType) => { // Commented out unused variable
		// 	setIsReshuffling(false);
		// };

		// Start the intelligent reshuffle system
		// reshuffleManager.start(performReshuffle, { // Commented out - manager not available
		// 	userBehavior,
		// 	onReshuffleStart,
		// 	onReshuffleEnd,
		// });

		// autoReshuffleManagerRef.current = reshuffleManager; // Commented out - manager not available

		// Cleanup on unmount
		return () => {
			// if (autoReshuffleManagerRef.current) { // Commented out - manager not available
			// 	autoReshuffleManagerRef.current.stop();
			// }
		};
	}, [ads, performReshuffle, userBehavior, isComponentMounted]);

	// Manual reshuffle function for user-triggered reshuffles
	// const handleManualReshuffle = useCallback(() => { // Commented out unused variable
	// 	performReshuffle({
	// 		trigger: "manual",
	// 		timestamp: Date.now(),
	// 	});
	// }, [performReshuffle]);

	// Track user behavior for intelligent reshuffling
	const trackUserBehavior = useCallback((action, data) => {
		setUserBehavior((prev) => {
			const updated = { ...prev };

			switch (action) {
				case "adClick":
					if (data.adId && !updated.clickedAds.includes(data.adId)) {
						updated.clickedAds = [...updated.clickedAds, data.adId];
					}
					if (
						data.categoryName &&
						!updated.preferredCategories.includes(data.categoryName)
					) {
						updated.preferredCategories = [
							...updated.preferredCategories,
							data.categoryName,
						];
					}
					break;
				case "adAvoid":
					if (data.adId && !updated.avoidedAds.includes(data.adId)) {
						updated.avoidedAds = [...updated.avoidedAds, data.adId];
					}
					break;
				case "activity":
					updated.lastActivity = Date.now();
					break;
				default:
					break;
			}

			return updated;
		});
	}, []);

	// Track user activity for intelligent reshuffling
	useEffect(() => {
		const handleActivity = () => {
			trackUserBehavior("activity");
		};

		const handleScroll = () => {
			// Track scroll depth for reshuffle personalization
			const scrollDepth = Math.max(
				userBehavior.scrollDepth || 0,
				(window.scrollY /
					(document.documentElement.scrollHeight - window.innerHeight)) *
					100
			);

			setUserBehavior((prev) => ({
				...prev,
				scrollDepth: Math.min(scrollDepth, 100), // Cap at 100%
			}));
		};

		// Track various user activities
		const events = ["mousedown", "mousemove", "keypress", "touchstart"];
		events.forEach((event) => {
			document.addEventListener(event, handleActivity, { passive: true });
		});

		// Separate scroll tracking
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			events.forEach((event) => {
				document.removeEventListener(event, handleActivity, true);
			});
			window.removeEventListener("scroll", handleScroll, true);
		};
	}, [trackUserBehavior, userBehavior.scrollDepth]);

	// Enhanced handleAdClick with behavior tracking
	const handleAdClickWithTracking = useCallback(
		async (adUrl, adId) => {
			// Track user behavior
			const ad = Object.values(ads)
				.flat()
				.find((a) => a.id === adId);
			if (ad) {
				trackUserBehavior("adClick", {
					adId,
					categoryName: ad.category_name,
					subcategoryName: ad.subcategory_name,
				});
			}

			// Call original handleAdClick with both parameters
			await handleAdClick(adUrl, adId);
		},
		[handleAdClick, ads, trackUserBehavior]
	);

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
		setHasSearched(false); // Reset search state
	};

	// Handle subcategory pagination - now handles both subcategory and main pagination
	const handleSubcategoryLoadMore = (
		newProducts,
		subcategoryName,
		subcategoryId
	) => {
		// Ensure newProducts is an array before processing
		if (!Array.isArray(newProducts)) {
			return;
		}

		// Batch state updates to prevent flickering
		startTransition(() => {
			// If this is pagination (subcategoryName is "pagination"), replace results
			if (subcategoryName === "pagination") {
				setSearchResults(newProducts);
				setDisplayedResults(newProducts);
			} else {
				// For subcategory load more, append to existing results
				const currentResults = Array.isArray(searchResults)
					? searchResults
					: [];

				// Create a Set of existing ad IDs for efficient duplicate checking
				const existingIds = new Set(currentResults.map((ad) => ad.id));

				// Filter out any new products that already exist in searchResults
				const uniqueNewProducts = newProducts.filter(
					(ad) => !existingIds.has(ad.id)
				);

				// Add only the unique new products to the existing search results
				const updatedResults = [...currentResults, ...uniqueNewProducts];

				// Update the search results with the new products
				setSearchResults(updatedResults);
				setDisplayedResults(updatedResults);
			}
		});
	};

	// Wrapper function for navbar search - triggers search immediately on form submission
	const handleNavbarSearch = (query, category = "All", subcategory = "All") => {
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
		params.set("page", "1"); // Reset to page 1 for new search

		// Update URL
		const newUrl = params.toString() ? `/?${params.toString()}` : "/";
		navigate(newUrl, { replace: true });

		// Scroll to top for better UX
		window.scrollTo({ top: 0, behavior: "smooth" });

		// Trigger the search immediately with the new parameters
		fetchSearchResults(null, query, category, subcategory);
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
				setSelectedCategory(
					categoryId === "All" ? "All" : parseInt(categoryId, 10)
				);
				setSelectedSubcategory("All");

				// Trigger search immediately for category changes
				const params = new URLSearchParams();
				if (searchQuery.trim()) {
					params.set("query", searchQuery.trim());
				}
				if (categoryId !== "All") {
					params.set("category", categoryId);
				}
				// Reset page to 1 when search parameters change
				params.set("page", "1");
				navigate(`/?${params.toString()}`);

				// Scroll to top for better UX
				window.scrollTo({ top: 0, behavior: "smooth" });
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
				setSelectedSubcategory(
					subcategoryId === "All" ? "All" : parseInt(subcategoryId, 10)
				);

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
				// Reset page to 1 when search parameters change
				params.set("page", "1");
				navigate(`/?${params.toString()}`);

				// Scroll to top for better UX
				window.scrollTo({ top: 0, behavior: "smooth" });
			});
		}, 100); // Small delay to prevent rapid-fire updates
	};

	// Handle page changes for pagination
	const handlePageChange = (page) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("page", page.toString());

		// Update URL with new page parameter
		navigate(`/?${newSearchParams.toString()}`, { replace: true });

		// Update current page state
		setCurrentPage(page);

		// Scroll to top for better UX
		window.scrollTo({ top: 0, behavior: "smooth" });

		// Trigger search with the new page
		fetchSearchResults(page);
	};

	// Do not early-return on error; show alerts inline instead

	return (
		<>
			<HomepageSEO categories={categories} />
			<Navbar
				mode="buyer"
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				handleSearch={handleNavbarSearch}
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
				onLogout={onLogout}
			/>
			<div className="flex flex-col xl:flex-row gap-2 sm:gap-4 lg:gap-6 xl:gap-8 min-h-screen">
				<div className="flex-1 min-w-0 w-full max-w-7xl mx-auto relative z-0 transition-all duration-300 ease-in-out">
					<div className="w-full">
						{/* Show Banner only when not in search mode */}
						{(() => {
							const query = searchParams.get("query");
							const category = searchParams.get("category");
							const subcategory = searchParams.get("subcategory");
							const hasSearchParams =
								query !== null ||
								(category && category !== "All") ||
								(subcategory && subcategory !== "All");

							// Hide banner if searching, has search query, or has URL search parameters
							return !isSearching && !searchQuery && !hasSearchParams;
						})() && <Banner />}
						<div
							className={`px-0 ${(() => {
								const query = searchParams.get("query");
								const category = searchParams.get("category");
								const subcategory = searchParams.get("subcategory");
								const hasSearchParams =
									query !== null ||
									(category && category !== "All") ||
									(subcategory && subcategory !== "All");

								// Use normal positioning for search results, responsive overlap positioning for homepage
								return hasSearchParams || searchQuery || isSearching
									? "mt-0 sm:mt-4" // Zero margin for small screens, normal spacing for larger screens
									: "mt-0 sm:-translate-y-[5vh] md:-translate-y-[8vh] lg:-translate-y-[10vh] xl:-translate-y-[12vh] 2xl:-translate-y-[15vh]"; // Zero margin for small screens, responsive overlap for larger screens
							})()} relative z-10 transition-transform duration-300  px-0 sm:px-4 md:px-6 lg:px-8 pb-0 sm:pb-4 md:pb-6 lg:pb-8`}
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
									const query = searchParams.get("query");
									const category = searchParams.get("category");
									const subcategory = searchParams.get("subcategory");

									// Only show search results if we have a query parameter OR category/subcategory filtering
									return (
										query !== null ||
										(category && category !== "All") ||
										(subcategory && subcategory !== "All")
									);
							  })() ? (
								(() => {
									return (
										<>
											<SearchResultSection
												results={displayedResults}
												searchQuery={searchQuery}
												searchShops={searchShops}
												handleShopClick={handleShopClick}
												isLoading={isSearching}
												errorMessage={error}
												onPageChange={handlePageChange}
												isSearchContext={(() => {
													const query = searchParams.get("query");
													const category = searchParams.get("category");
													const subcategory = searchParams.get("subcategory");
													// True for search queries OR category/subcategory filtering
													return (
														query !== null ||
														(category && category !== "All") ||
														(subcategory && subcategory !== "All")
													);
												})()}
												onRetry={() => {
													// Retry the search
													const query = searchParams.get("query");
													if (query) {
														handleSearch(query);
													}
												}}
												getHeaderTitle={() => {
													// Get URL parameters for category and subcategory
													const categoryParam = searchParams.get("category");
													const subcategoryParam =
														searchParams.get("subcategory");

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
												onLoadMore={handleSubcategoryLoadMore}
												selectedCategory={(() => {
													return searchParams.get("category") || "All";
												})()}
												selectedSubcategory={(() => {
													return searchParams.get("subcategory") || "All";
												})()}
												categories={categories}
												subcategoryCounts={subcategoryCounts}
												totalResultsProp={(() => {
													// Get total count from the last API response
													const query = searchParams.get("query");
													if (query && query.trim()) {
														// For search queries, use the total count from the API response
														return totalResultsCount;
													}
													return displayedResults.length;
												})()}
											/>

											{/* Pagination controls for search context */}
											{(() => {
												const query = searchParams.get("query");
												const category = searchParams.get("category");
												const subcategory = searchParams.get("subcategory");
												const hasSearchParams =
													query !== null ||
													(category && category !== "All") ||
													(subcategory && subcategory !== "All");

												if (!hasSearchParams) return null;

												const totalPages = Math.ceil(
													totalResultsCount / RESULTS_PER_PAGE
												);

												if (totalPages <= 1) return null;

												return (
													<div className="flex justify-center mt-6 sm:mt-7 md:mt-8">
														<div className="flex items-center gap-2">
															<button
																onClick={() =>
																	handlePageChange(currentPage - 1)
																}
																disabled={currentPage <= 1 || isSearching}
																className="px-3 py-1.5 text-sm border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded"
															>
																Previous
															</button>

															{/* Page numbers */}
															<div className="flex items-center gap-1">
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
																			<button
																				key={pageNum}
																				onClick={() =>
																					handlePageChange(pageNum)
																				}
																				disabled={isSearching}
																				className={`px-2 py-1 text-sm rounded ${
																					pageNum === currentPage
																						? "bg-yellow-500 text-white"
																						: "border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
																				} disabled:opacity-50 disabled:cursor-not-allowed`}
																			>
																				{pageNum}
																			</button>
																		);
																	}
																)}
															</div>

															<button
																onClick={() =>
																	handlePageChange(currentPage + 1)
																}
																disabled={
																	currentPage >= totalPages || isSearching
																}
																className="px-3 py-1.5 text-sm border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded"
															>
																Next
															</button>
														</div>

														{/* Debug info */}
														<div className="ml-4 text-sm text-gray-500">
															{isSearching ? (
																<span
																	className="spinner-border spinner-border-sm me-2"
																	role="status"
																	aria-hidden="true"
																></span>
															) : (
																`Page ${currentPage} of ${totalPages} (${totalResultsCount} total items)`
															)}
														</div>
													</div>
												);
											})()}
										</>
									);
								})()
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
																				categoryId={category.id}
																				randomizedSubcategories={
																					randomizedSubcategories
																				}
																				ads={ads}
																				handleAdClick={
																					handleAdClickWithTracking
																				}
																				handleSubcategoryClick={
																					handleSubcategoryClick
																				}
																				isReshuffled={
																					!!lastReshuffleTime &&
																					Date.now() - lastReshuffleTime <
																						300000
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
													onViewMore={() => {
														// Navigate to search results showing all best sellers
														navigate(
															`/?query=best+sellers&category=All&subcategory=All`
														);
													}}
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
