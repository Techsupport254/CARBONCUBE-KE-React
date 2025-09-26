import React, { useState, useEffect, useCallback } from "react";
import {
	useParams,
	useNavigate,
	useLocation,
	useSearchParams,
} from "react-router-dom";
import { Button } from "react-bootstrap";
import { generateAdUrl } from "../../utils/slugUtils";
import {
	getTierName,
	getTierId,
	getBorderColor,
} from "../utils/sellerTierUtils";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ReviewsModal from "../../components/ReviewsModal";
import LeaveReviewModal from "../../components/LeaveReviewModal";
import ShopSEO from "../../components/ShopSEO";
import PageSEO from "../../components/PageSEO";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { preloadShopIcons } from "../../utils/iconLoader";
import ResponsiveImage from "../../components/ResponsiveImage";
import Spinner from "react-spinkit";

// Import specific icons for better performance
import {
	faShare,
	faStar,
	faStarHalfAlt,
	faTimes,
	faCopy,
	faSearch,
	faFilter,
} from "@fortawesome/free-solid-svg-icons";
import {
	faFacebook,
	faTwitter,
	faWhatsapp,
	faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const ShopPage = () => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const [shop, setShop] = useState(null);
	const [ads, setAds] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(() => {
		const page = parseInt(searchParams.get("page") || "1", 10);
		return page;
	});
	const [totalPages, setTotalPages] = useState(1);
	const [totalResults, setTotalResults] = useState(0);
	const [showShareModal, setShowShareModal] = useState(false);
	const [showReviewsModal, setShowReviewsModal] = useState(false);
	const [showLeaveReviewModal, setShowLeaveReviewModal] = useState(false);
	const [reviewStats, setReviewStats] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const [currentUserId, setCurrentUserId] = useState(null);

	// Search and filter states - initialize from URL params
	const [searchTerm, setSearchTerm] = useState(() => {
		const params = new URLSearchParams(location.search);
		return params.get("search") || "";
	});
	const [selectedCategory, setSelectedCategory] = useState(() => {
		const params = new URLSearchParams(location.search);
		return params.get("category") || "All";
	});
	const [selectedSubcategory, setSelectedSubcategory] = useState(() => {
		const params = new URLSearchParams(location.search);
		return params.get("subcategory") || "All";
	});
	const [categories, setCategories] = useState([]);
	const [filteredAds, setFilteredAds] = useState([]);
	const [isFiltering, setIsFiltering] = useState(false);

	// Initialize authentication state
	useEffect(() => {
		const token = localStorage.getItem("token");
		const role = sessionStorage.getItem("userRole");
		const userId = sessionStorage.getItem("userId");

		if (token && role) {
			setIsAuthenticated(true);
			setUserRole(role);
			setCurrentUserId(userId);
		}

		// Preload shop icons for better performance
		preloadShopIcons();
	}, []);

	const handleShareShop = () => {
		if (!shop) {
			return;
		}
		setShowShareModal(true);
	};

	const handleCloseShareModal = () => {
		setShowShareModal(false);
	};

	const shareToFacebook = () => {
		const shopUrl = `${window.location.origin}/shop/${encodeURIComponent(
			slug
		)}`;
		const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
			shopUrl
		)}`;
		window.open(facebookUrl, "_blank", "width=600,height=400");
		setShowShareModal(false);
	};

	const shareToTwitter = () => {
		const shopUrl = `${window.location.origin}/shop/${encodeURIComponent(
			slug
		)}`;
		const tweetText = `Check out ${shop.enterprise_name} on Carbon Cube Kenya! Browse ${shop.product_count} products.`;
		const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
			tweetText
		)}&url=${encodeURIComponent(shopUrl)}`;
		window.open(twitterUrl, "_blank", "width=600,height=400");
		setShowShareModal(false);
	};

	const shareToWhatsApp = () => {
		const shopUrl = `${window.location.origin}/shop/${encodeURIComponent(
			slug
		)}`;
		const message = `Check out ${shop.enterprise_name} on Carbon Cube Kenya! Browse ${shop.product_count} products: ${shopUrl}`;
		const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
		window.open(whatsappUrl, "_blank");
		setShowShareModal(false);
	};

	const shareToLinkedIn = () => {
		const shopUrl = `${window.location.origin}/shop/${encodeURIComponent(
			slug
		)}`;
		const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
			shopUrl
		)}`;
		window.open(linkedinUrl, "_blank", "width=600,height=400");
		setShowShareModal(false);
	};

	const copyToClipboard = async () => {
		const shopUrl = `${window.location.origin}/shop/${encodeURIComponent(
			slug
		)}`;
		try {
			await navigator.clipboard.writeText(shopUrl);
			setShowShareModal(false);
		} catch (error) {
			console.error("Error copying to clipboard:", error);
		}
	};

	const fetchReviewStats = useCallback(async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/shop/${slug}/reviews?page=1&per_page=1`,
				{
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token"),
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				setReviewStats(data.statistics);
			}
		} catch (err) {
			console.error("Error fetching review stats:", err);
		}
	}, [slug]);

	const renderStars = (rating) => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 !== 0;

		for (let i = 0; i < fullStars; i++) {
			stars.push(
				<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />
			);
		}

		if (hasHalfStar) {
			stars.push(
				<FontAwesomeIcon
					key="half"
					icon={faStarHalfAlt}
					className="text-yellow-400"
				/>
			);
		}

		const emptyStars = 5 - Math.ceil(rating);
		for (let i = 0; i < emptyStars; i++) {
			stars.push(
				<FontAwesomeIcon
					key={`empty-${i}`}
					icon={faStar}
					className="text-gray-300"
				/>
			);
		}

		return stars;
	};

	// Generate comprehensive SEO data based on shop content
	const seoData = shop
		? {
				title: `${shop.enterprise_name} - Shop | ${
					shop.product_count
				} Products | ${shop.tier || "Free"} Tier Seller`,
				description: (() => {
					const location = [shop.city, shop.sub_county, shop.county]
						.filter(Boolean)
						.join(", ");
					const tier = shop.tier || "Free";
					const rating = shop.average_rating
						? ` Rated ${shop.average_rating}/5 stars`
						: "";
					const reviews =
						shop.total_reviews > 0 ? ` with ${shop.total_reviews} reviews` : "";

					if (shop.description) {
						return `${shop.description.substring(0, 160)}... Shop ${
							shop.enterprise_name
						} on Carbon Cube Kenya. ${
							shop.product_count
						} products available from ${tier} tier verified seller${
							location ? ` in ${location}` : ""
						}.${rating}${reviews}. Fast delivery across Kenya.`;
					} else {
						return `Shop ${shop.enterprise_name} on Carbon Cube Kenya. ${
							shop.product_count
						} products available from ${tier} tier verified seller${
							location ? ` in ${location}` : ""
						}.${rating}${reviews}. Browse quality products with fast delivery across Kenya.`;
					}
				})(),
				keywords: `${shop.enterprise_name}, ${shop.enterprise_name} shop, ${
					shop.enterprise_name
				} store, ${shop.categories || ""}, ${shop.city || ""}, ${
					shop.county || ""
				}, ${shop.sub_county || ""}, ${
					shop.tier || "Free"
				} tier seller, online shop Kenya, Carbon Cube Kenya, Kenya marketplace, ${
					shop.product_count
				} products, ${
					shop.business_registration_number
						? `registered business ${shop.business_registration_number}`
						: ""
				}, Kenya e-commerce, online shopping Kenya, verified seller Kenya`,
				url: `https://carboncube-ke.com/shop/${shop.slug}`,
				canonicalUrl: `https://carboncube-ke.com/shop/${shop.slug}`,
				type: "website",
				image: (() => {
					if (shop?.profile_picture && shop.profile_picture.trim() !== "") {
						if (shop.profile_picture.startsWith("http")) {
							return shop.profile_picture;
						}
						if (shop.profile_picture.startsWith("/")) {
							return `https://carboncube-ke.com${shop.profile_picture}`;
						}
						return shop.profile_picture;
					}
					// Create a more attractive placeholder image with shop branding
					return `https://via.placeholder.com/1200x630/FFD700/000000?text=${encodeURIComponent(
						`${shop?.enterprise_name || "Shop"} - Carbon Cube Kenya`
					)}`;
				})(),
				author: `${shop.enterprise_name} Team`,
				structuredData: {
					"@context": "https://schema.org",
					"@type": "LocalBusiness",
					name: shop.enterprise_name,
					description:
						shop.description ||
						`Shop ${shop.enterprise_name} on Carbon Cube Kenya`,
					url: `${window.location.origin}/shop/${encodeURIComponent(slug)}`,
					image: (() => {
						if (shop?.profile_picture && shop.profile_picture.trim() !== "") {
							if (shop.profile_picture.startsWith("http")) {
								return shop.profile_picture;
							}
							if (shop.profile_picture.startsWith("/")) {
								return `https://carboncube-ke.com${shop.profile_picture}`;
							}
							return shop.profile_picture;
						}
						return `https://via.placeholder.com/1200x630/FFD700/000000?text=${encodeURIComponent(
							shop?.enterprise_name || "Shop"
						)}`;
					})(),
					address: shop.address
						? {
								"@type": "PostalAddress",
								streetAddress: shop.address,
								addressLocality: shop.city || "Kenya",
								addressRegion: shop.county || "Kenya",
								addressCountry: "KE",
						  }
						: undefined,
					telephone: shop.phone_number,
					email: shop.email,
					foundingDate: shop.created_at,
					numberOfEmployees: "1-10",
					priceRange: "$$",
					paymentAccepted: "Cash, Mobile Money, Bank Transfer",
					currenciesAccepted: "KES",
					aggregateRating:
						shop.total_reviews > 0
							? {
									"@type": "AggregateRating",
									ratingValue: shop.average_rating.toString(),
									reviewCount: shop.total_reviews.toString(),
							  }
							: undefined,
					hasOfferCatalog: {
						"@type": "OfferCatalog",
						name: `${shop.enterprise_name} Products`,
						numberOfItems: shop.product_count,
					},
					sameAs: [
						`${window.location.origin}/shop/${encodeURIComponent(slug)}`,
					],
				},
				additionalStructuredData: [
					{
						"@context": "https://schema.org",
						"@type": "BreadcrumbList",
						itemListElement: [
							{
								"@type": "ListItem",
								position: 1,
								name: "Home",
								item: `${window.location.origin}/`,
							},
							{
								"@type": "ListItem",
								position: 2,
								name: "Shops",
								item: `${window.location.origin}/shops`,
							},
							{
								"@type": "ListItem",
								position: 3,
								name: shop.enterprise_name,
								item: `${window.location.origin}/shop/${encodeURIComponent(
									slug
								)}`,
							},
						],
					},
					{
						"@context": "https://schema.org",
						"@type": "WebPage",
						name: `${shop.enterprise_name} - Shop`,
						description:
							shop.description ||
							`Shop ${shop.enterprise_name} on Carbon Cube Kenya`,
						url: `${window.location.origin}/shop/${encodeURIComponent(slug)}`,
						isPartOf: {
							"@type": "WebSite",
							name: "Carbon Cube Kenya",
							url: "https://carboncube.co.ke",
						},
						about: {
							"@type": "LocalBusiness",
							name: shop.enterprise_name,
						},
					},
					// Enhanced FAQ Schema for Shop
					{
						"@context": "https://schema.org",
						"@type": "FAQPage",
						mainEntity: [
							{
								"@type": "Question",
								name: `What products does ${shop.enterprise_name} sell?`,
								acceptedAnswer: {
									"@type": "Answer",
									text: `${shop.enterprise_name} offers ${shop.product_count} products across various categories. Browse our shop to see all available items.`,
								},
							},
							{
								"@type": "Question",
								name: `Is ${shop.enterprise_name} a verified seller?`,
								acceptedAnswer: {
									"@type": "Answer",
									text: `Yes, ${shop.enterprise_name} is a ${
										shop.tier || "Free"
									} tier verified seller on Carbon Cube Kenya with ${
										shop.total_reviews || 0
									} reviews and a ${shop.average_rating || 0}/5 star rating.`,
								},
							},
							{
								"@type": "Question",
								name: `Where is ${shop.enterprise_name} located?`,
								acceptedAnswer: {
									"@type": "Answer",
									text: `${shop.enterprise_name} is located in ${[
										shop.city,
										shop.sub_county,
										shop.county,
									]
										.filter(Boolean)
										.join(", ")}.`,
								},
							},
						],
					},
					// Enhanced Review Schema for Shop
					...(shop.average_rating && shop.total_reviews > 0
						? [
								{
									"@context": "https://schema.org",
									"@type": "Review",
									itemReviewed: {
										"@type": "LocalBusiness",
										name: shop.enterprise_name,
										description:
											shop.description ||
											`Shop ${shop.enterprise_name} on Carbon Cube Kenya`,
									},
									reviewRating: {
										"@type": "Rating",
										ratingValue: shop.average_rating,
										bestRating: 5,
										worstRating: 1,
									},
									author: {
										"@type": "Organization",
										name: "Carbon Cube Kenya Customers",
									},
									datePublished: shop.created_at,
									publisher: {
										"@type": "Organization",
										name: "Carbon Cube Kenya",
									},
								},
						  ]
						: []),
				],
				// Advanced SEO Features
				alternateLanguages: [
					{
						lang: "en",
						url: `${window.location.origin}/shop/${encodeURIComponent(slug)}`,
					},
					{
						lang: "sw",
						url: `${window.location.origin}/sw/shop/${encodeURIComponent(
							slug
						)}`,
					},
				],
				customMetaTags: [
					// Business Information
					{ name: "business:name", content: shop.enterprise_name },
					{ name: "business:type", content: "Local Business" },
					{
						name: "business:location",
						content: [shop.city, shop.county].filter(Boolean).join(", "),
					},
					{
						name: "business:rating",
						content: shop.average_rating?.toString() || "0",
					},
					{
						name: "business:review_count",
						content: shop.total_reviews?.toString() || "0",
					},
					{
						name: "business:product_count",
						content: shop.product_count?.toString() || "0",
					},
					{ name: "business:tier", content: shop.tier || "Free" },

					// Enhanced Open Graph Tags for Social Media
					{ property: "og:business:name", content: shop.enterprise_name },
					{ property: "og:business:type", content: "Local Business" },
					{
						property: "og:business:location",
						content: [shop.city, shop.county].filter(Boolean).join(", "),
					},
					{
						property: "og:business:rating",
						content: shop.average_rating?.toString() || "0",
					},
					{
						property: "og:business:review_count",
						content: shop.total_reviews?.toString() || "0",
					},
					{
						property: "og:business:product_count",
						content: shop.product_count?.toString() || "0",
					},
					{ property: "og:business:tier", content: shop.tier || "Free" },

					// Additional Open Graph Properties for Better Social Sharing
					{ property: "og:image:type", content: "image/png" },
					{
						property: "og:image:secure_url",
						content: (() => {
							if (shop?.profile_picture && shop.profile_picture.trim() !== "") {
								if (shop.profile_picture.startsWith("http")) {
									return shop.profile_picture;
								}
								if (shop.profile_picture.startsWith("/")) {
									return `https://carboncube-ke.com${shop.profile_picture}`;
								}
								return shop.profile_picture;
							}
							return `https://via.placeholder.com/1200x630/FFD700/000000?text=${encodeURIComponent(
								`${shop?.enterprise_name || "Shop"} - Carbon Cube Kenya`
							)}`;
						})(),
					},
					{
						property: "og:image:alt",
						content: `${shop.enterprise_name} - Shop on Carbon Cube Kenya`,
					},
					{
						property: "og:updated_time",
						content: shop.updated_at || shop.created_at,
					},
					{ property: "og:see_also", content: "https://carboncube-ke.com" },

					// Twitter Card Enhancements
					{
						name: "twitter:image:alt",
						content: `${shop.enterprise_name} - Shop on Carbon Cube Kenya`,
					},
					{ name: "twitter:label1", content: "Products" },
					{
						name: "twitter:data1",
						content: shop.product_count?.toString() || "0",
					},
					{ name: "twitter:label2", content: "Rating" },
					{
						name: "twitter:data2",
						content: shop.average_rating
							? `${shop.average_rating}/5`
							: "No rating",
					},

					// Location and Place Information
					{ property: "place:location:latitude", content: "-1.2921" },
					{ property: "place:location:longitude", content: "36.8219" },
					{ property: "place:name", content: shop.enterprise_name },
					{ property: "place:region", content: shop.county || "Kenya" },

					// Additional Meta Tags for Better SEO
					{ name: "application-name", content: "Carbon Cube Kenya" },
					{
						name: "apple-mobile-web-app-title",
						content: `${shop.enterprise_name} - Carbon Cube`,
					},
					{
						name: "msapplication-TileTitle",
						content: `${shop.enterprise_name} Shop`,
					},
					{ name: "msapplication-TileColor", content: "#FFD700" },

					// WhatsApp and Social Media Specific
					{ property: "og:locale:alternate", content: "sw_KE" },
					{
						name: "whatsapp:description",
						content: `Shop ${shop.enterprise_name} on Carbon Cube Kenya - ${shop.product_count} products available`,
					},

					// Additional Business Schema
					{ name: "business:contact:phone", content: shop.phone_number || "" },
					{ name: "business:contact:email", content: shop.email || "" },
					{ name: "business:address", content: shop.address || "" },
				],
				imageWidth: 1200,
				imageHeight: 630,
				themeColor: "#FFD700",
				viewport:
					"width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes",
				// AI Search Optimization
				aiSearchOptimized: true,
				contentType: "business",
				expertiseLevel: "expert",
				contentDepth: "comprehensive",
				aiFriendlyFormat: true,
				conversationalKeywords: [
					`${shop.enterprise_name} shop Kenya`,
					`buy from ${shop.enterprise_name} Kenya`,
					`${shop.enterprise_name} products Kenya`,
					`verified seller ${shop.enterprise_name}`,
					`${shop.enterprise_name} ${shop.tier || "Free"} tier`,
					`shop ${shop.enterprise_name} Carbon Cube`,
					`${shop.enterprise_name} ${shop.city || "Kenya"}`,
					`trusted seller ${shop.enterprise_name}`,
				],
				aiCitationOptimized: true,
		  }
		: {
				title: "Shop | Carbon Cube Kenya",
				description:
					"Browse shops on Carbon Cube Kenya - Kenya's trusted online marketplace",
				keywords: "shop, Carbon Cube Kenya, online shopping Kenya",
				url: `${window.location.origin}/shop/${encodeURIComponent(slug)}`,
				type: "website",
		  };

	// Fetch categories
	const fetchCategories = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/buyer/categories`,
				{
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token"),
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				setCategories(data);
			}
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	};

	useEffect(() => {
		const fetchShopData = async () => {
			try {
				setIsLoading(true);

				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/shop/${slug}?page=${currentPage}&per_page=20`,
					{
						headers: {
							Authorization: "Bearer " + localStorage.getItem("token"),
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch shop data");
				}

				const data = await response.json();

				// Set shop data (only fetch once)
				if (currentPage === 1) {
					setShop(data.shop);
					fetchCategories();
				}

				// Set ads and pagination data for current page
				setAds(data.ads);
				setFilteredAds(data.ads);
				setTotalPages(data.pagination.total_pages);
				setTotalResults(data.pagination.total_count);
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchShopData();
	}, [slug, currentPage]);

	useEffect(() => {
		if (shop) {
			fetchReviewStats();
		}
	}, [shop, fetchReviewStats]);

	// Sync currentPage with URL parameters
	useEffect(() => {
		const urlPage = parseInt(searchParams.get("page") || "1", 10);
		if (urlPage !== currentPage) {
			setCurrentPage(urlPage);
		}
	}, [searchParams, currentPage]);

	const handleAdClick = (adUrl, adId) => {
		// Preserve current query parameters when navigating to ad details
		const currentParams = new URLSearchParams(window.location.search);
		const currentQuery = currentParams.toString();
		const separator = currentQuery ? "&" : "?";

		navigate(`${adUrl}${separator}${currentQuery}`);
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
		// Update URL parameters
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("page", page.toString());
		setSearchParams(newSearchParams);
		// Scroll to top when page changes
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Function to update URL parameters
	const updateURLParams = (search, category, subcategory) => {
		const params = new URLSearchParams();
		if (search && search.trim()) params.set("search", search.trim());
		if (category && category !== "All") params.set("category", category);
		if (subcategory && subcategory !== "All")
			params.set("subcategory", subcategory);

		const newSearch = params.toString();
		const newURL = newSearch ? `?${newSearch}` : "";
		navigate(`${location.pathname}${newURL}`, { replace: true });
	};

	// Search and filter handlers
	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchTerm(value);
		updateURLParams(value, selectedCategory, selectedSubcategory);
	};

	const handleCategoryChange = (e) => {
		const categoryId = e.target.value;
		setSelectedCategory(categoryId);
		setSelectedSubcategory("All"); // Reset subcategory when category changes
		updateURLParams(searchTerm, categoryId, "All");
	};

	const handleSubcategoryChange = (e) => {
		const subcategoryId = e.target.value;
		setSelectedSubcategory(subcategoryId);
		updateURLParams(searchTerm, selectedCategory, subcategoryId);
	};

	const clearFilters = () => {
		setSearchTerm("");
		setSelectedCategory("All");
		setSelectedSubcategory("All");
		updateURLParams("", "All", "All");
	};

	// Handle URL parameter changes
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const urlSearch = params.get("search") || "";
		const urlCategory = params.get("category") || "All";
		const urlSubcategory = params.get("subcategory") || "All";

		// Update state if URL params differ from current state
		if (urlSearch !== searchTerm) setSearchTerm(urlSearch);
		if (urlCategory !== selectedCategory) {
			setSelectedCategory(urlCategory);
			// Reset subcategory if category changed
			if (urlCategory === "All") {
				setSelectedSubcategory("All");
			}
		}
		if (urlSubcategory !== selectedSubcategory)
			setSelectedSubcategory(urlSubcategory);
	}, [location.search, searchTerm, selectedCategory, selectedSubcategory]);

	// Validate subcategory selection
	useEffect(() => {
		if (selectedCategory === "All" && selectedSubcategory !== "All") {
			setSelectedSubcategory("All");
		}
	}, [selectedCategory, selectedSubcategory]);

	// Filter ads based on search term and category/subcategory
	useEffect(() => {
		setIsFiltering(true);

		let filtered = [...ads];

		// Filter by search term
		if (searchTerm.trim()) {
			filtered = filtered.filter((ad) =>
				ad.title.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Filter by category
		if (selectedCategory !== "All") {
			filtered = filtered.filter((ad) => {
				return (
					ad.category_id === parseInt(selectedCategory) ||
					ad.category?.id === parseInt(selectedCategory)
				);
			});
		}

		// Filter by subcategory
		if (selectedSubcategory !== "All") {
			filtered = filtered.filter((ad) => {
				return (
					ad.subcategory_id === parseInt(selectedSubcategory) ||
					ad.subcategory?.id === parseInt(selectedSubcategory)
				);
			});
		}

		setFilteredAds(filtered);
		setIsFiltering(false);
	}, [ads, searchTerm, selectedCategory, selectedSubcategory]);

	const handleBackToSearch = () => {
		navigate(-1);
	};

	const handleLeaveReview = () => {
		if (!isAuthenticated) {
			// Show login prompt
			if (
				window.confirm(
					"You must be logged in to leave a review. Would you like to go to the login page?"
				)
			) {
				navigate("/login");
			}
			return;
		}

		if (
			userRole === "seller" &&
			shop &&
			currentUserId &&
			shop.id === parseInt(currentUserId)
		) {
			alert("You cannot review your own shop.");
			return;
		}

		setShowLeaveReviewModal(true);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
					<div className="flex justify-center items-center h-64">
						<Spinner
							variant="warning"
							name="cube-grid"
							style={{ width: 50, height: 50 }}
						/>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
						<p className="text-gray-600 mb-4">{error}</p>
						<Button onClick={handleBackToSearch} variant="warning">
							← Back to Search
						</Button>
					</div>
				</div>
			</div>
		);
	}

	if (!shop) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-900 mb-4">
							Shop Not Found
						</h1>
						<Button onClick={handleBackToSearch} variant="warning">
							← Back to Search
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{shop ? (
				<ShopSEO shop={seoData} />
			) : (
				<PageSEO
					pageType="shop"
					title={`Shop - ${slug || "Loading..."} | Carbon Cube Kenya`}
					description="Browse products from verified sellers on Carbon Cube Kenya. Fast delivery across Kenya."
					keywords="shop, products, verified sellers, Kenya marketplace"
				/>
			)}
			<Navbar
				mode="buyer"
				showSearch={false}
				showCategories={true}
				showUserMenu={true}
				showCart={true}
				showWishlist={true}
			/>
			<div className="flex-1">
				<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
					{/* Header */}
					<div className="mb-4 sm:mb-8">
						{/* Breadcrumb */}
						<nav className="text-sm text-gray-500 mb-3 sm:mb-4">
							<span
								onClick={() => navigate("/")}
								className="cursor-pointer hover:text-amber-700 transition-colors"
							>
								Home
							</span>
							<span className="mx-2">›</span>
							<span className="text-gray-700 font-medium">
								{shop.enterprise_name}
							</span>
						</nav>

						{/* Shop Info */}
						<div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
							<div className="flex flex-col lg:flex-row lg:items-start gap-4">
								{/* Logo, Shop Name, Tier and Product Count - Left side on large screens */}
								<div className="flex items-center gap-3 w-full lg:flex-1">
									{shop.profile_picture ? (
										<img
											src={shop.profile_picture}
											alt={shop.enterprise_name}
											className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full object-cover flex-shrink-0"
											onError={(e) => {
												e.target.style.display = "none";
											}}
										/>
									) : (
										<div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
											<svg
												className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-gray-400"
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
										<h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 break-words">
											{shop.enterprise_name}
										</h1>
										<div className="flex items-center gap-2 mt-1 sm:mt-2">
											<span
												className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium text-white"
												style={{
													backgroundColor: getBorderColor(shop.tier_id),
												}}
											>
												{shop.tier}
											</span>
											<span className="text-xs sm:text-sm text-gray-500">
												{shop.product_count} products
											</span>
										</div>
									</div>
								</div>

								{/* Share Button and Shop Details - Right side on large screens */}
								<div className="flex flex-col gap-3 lg:gap-4 lg:w-auto lg:items-end">
									<button
										onClick={handleShareShop}
										disabled={!shop}
										className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md text-sm sm:text-base lg:w-auto"
									>
										<FontAwesomeIcon icon={faShare} />
										<span className="hidden sm:inline">Share Shop</span>
										<span className="sm:hidden">Share</span>
									</button>
								</div>
							</div>

							{/* Description - Full width below on all screen sizes */}
							{shop.description && shop.description.trim() !== "" ? (
								<div className="mt-4 lg:mt-6">
									<p className="text-sm sm:text-base text-gray-600">
										{shop.description}
									</p>
								</div>
							) : (
								<div className="mt-4 lg:mt-6">
									<p className="text-sm sm:text-base text-gray-500 italic">
										No description available for this shop.
									</p>
								</div>
							)}

							{/* Shop Details Row */}
							<div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-200">
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
									{/* Location & Address */}
									{(shop.city ||
										shop.county ||
										shop.sub_county ||
										shop.address) && (
										<div className="text-left">
											<div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
												Location
											</div>
											<div className="text-sm text-gray-900">
												{(() => {
													const locationParts = [
														shop.city,
														shop.sub_county,
														shop.county,
													].filter(Boolean);
													const address = shop.address;

													// If address contains location info, don't repeat it
													if (address && locationParts.length > 0) {
														const addressLower = address.toLowerCase();
														const hasLocationInAddress = locationParts.some(
															(part) =>
																addressLower.includes(part.toLowerCase())
														);

														if (hasLocationInAddress) {
															return address;
														} else {
															return `${locationParts.join(", ")}, ${address}`;
														}
													} else if (address) {
														return address;
													} else {
														return locationParts.join(", ");
													}
												})()}
											</div>
										</div>
									)}

									{/* Registration Number */}
									{shop.business_registration_number && (
										<div className="text-left">
											<div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
												Registration
											</div>
											<div className="text-sm text-gray-900 font-mono">
												{shop.business_registration_number}
											</div>
										</div>
									)}

									{/* Owner */}
									{shop.fullname && (
										<div className="text-left">
											<div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
												Owner
											</div>
											<div className="text-sm text-gray-900">
												{shop.fullname}
											</div>
										</div>
									)}

									{/* Member Since */}
									{shop.created_at && (
										<div className="text-left">
											<div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
												Member Since
											</div>
											<div className="text-sm text-gray-900">
												{new Date(shop.created_at).toLocaleDateString("en-US", {
													year: "numeric",
													month: "short",
													day: "numeric",
												})}
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Reviews Section - Integrated within the shop card */}
							<div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-200">
								<div className="flex items-center justify-between mb-3">
									<h2 className="text-base sm:text-lg font-semibold text-gray-900">
										Customer Reviews
									</h2>
									<div className="flex items-center gap-2">
										<button
											onClick={handleLeaveReview}
											className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium text-xs transition-colors"
										>
											Leave Review
										</button>
										<button
											onClick={() => setShowReviewsModal(true)}
											className="text-yellow-700 hover:text-yellow-800 font-medium text-xs sm:text-sm transition-colors"
										>
											View All Reviews
										</button>
									</div>
								</div>

								{reviewStats && reviewStats.total_reviews > 0 ? (
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
										{/* Average Rating */}
										<div className="text-center sm:text-left">
											<div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
												{reviewStats.average_rating}
											</div>
											<div className="flex justify-center sm:justify-start mb-1">
												{renderStars(reviewStats.average_rating)}
											</div>
											<p className="text-xs sm:text-sm text-gray-600">
												Based on {reviewStats.total_reviews} reviews
											</p>
										</div>

										{/* Rating Distribution */}
										<div>
											<h3 className="font-medium text-gray-900 mb-2 text-sm">
												Rating Breakdown
											</h3>
											<div className="space-y-1">
												{reviewStats.rating_distribution
													.slice()
													.reverse()
													.map((dist) => (
														<div
															key={dist.rating}
															className="flex items-center space-x-2"
														>
															<span className="text-xs font-medium text-gray-700 w-4">
																{dist.rating}
															</span>
															<FontAwesomeIcon
																icon={faStar}
																className="text-yellow-400 text-xs"
															/>
															<div className="flex-1 bg-gray-200 rounded-full h-1.5">
																<div
																	className="bg-yellow-400 h-1.5 rounded-full"
																	style={{ width: `${dist.percentage}%` }}
																></div>
															</div>
															<span className="text-xs text-gray-600 w-6">
																{dist.count}
															</span>
														</div>
													))}
											</div>
										</div>
									</div>
								) : (
									<div className="text-center py-4">
										<div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
											<FontAwesomeIcon
												icon={faStar}
												className="text-gray-400 text-lg"
											/>
										</div>
										<h3 className="text-sm font-medium text-gray-900 mb-1">
											No Reviews Yet
										</h3>
										<p className="text-xs text-gray-500 mb-3">
											This shop doesn't have any reviews yet.
										</p>
										<div className="flex gap-2 justify-center">
											<button
												onClick={handleLeaveReview}
												className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium text-xs transition-colors"
											>
												Leave Review
											</button>
											<button
												onClick={() => setShowReviewsModal(true)}
												className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium text-xs transition-colors"
											>
												View Reviews
											</button>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Search and Filter Section */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
							<div className="flex flex-col gap-3">
								{/* Search Bar */}
								<div className="w-full">
									<div className="relative">
										<input
											type="text"
											placeholder="Search products in this shop..."
											value={searchTerm}
											onChange={handleSearchChange}
											className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
										/>
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<FontAwesomeIcon
												icon={faSearch}
												className="h-4 w-4 text-gray-400"
											/>
										</div>
									</div>
								</div>

								{/* Category Filters */}
								<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
									{/* Category Filter */}
									<div className="flex-1 min-w-0">
										<select
											id="category-select"
											value={selectedCategory}
											onChange={handleCategoryChange}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white"
											aria-label="Select Category"
										>
											<option value="All">All Categories</option>
											{categories.map((category) => (
												<option key={category.id} value={category.id}>
													{category.name}
												</option>
											))}
										</select>
									</div>

									{/* Subcategory Filter */}
									<div className="flex-1 min-w-0">
										<select
											id="subcategory-select"
											value={selectedSubcategory}
											onChange={handleSubcategoryChange}
											className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm ${
												selectedCategory === "All"
													? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
													: "border-gray-300 bg-white"
											}`}
											disabled={selectedCategory === "All"}
											aria-label="Select Subcategory"
										>
											<option value="All">
												{selectedCategory === "All"
													? "Select Category First"
													: "All Subcategories"}
											</option>
											{selectedCategory !== "All" &&
												categories
													.find((cat) => cat.id === parseInt(selectedCategory))
													?.subcategories?.map((subcategory) => (
														<option key={subcategory.id} value={subcategory.id}>
															{subcategory.name}
														</option>
													))}
										</select>
									</div>

									{/* Clear Filters Button */}
									{(searchTerm ||
										selectedCategory !== "All" ||
										selectedSubcategory !== "All") && (
										<div className="flex-shrink-0">
											<button
												onClick={clearFilters}
												className="w-full sm:w-auto px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
											>
												<FontAwesomeIcon icon={faFilter} className="h-3 w-3" />
												Clear
											</button>
										</div>
									)}
								</div>
							</div>

							{/* Filter Results Summary */}
							{(searchTerm ||
								selectedCategory !== "All" ||
								selectedSubcategory !== "All") && (
								<div className="mt-3 pt-3 border-t border-gray-200">
									<div className="flex items-center justify-between">
										<div className="text-sm text-gray-600">
											<span className="font-medium">
												{filteredAds.length} of {ads.length} products
											</span>
											{searchTerm && (
												<span className="ml-2">matching "{searchTerm}"</span>
											)}
											{selectedCategory !== "All" && (
												<span className="ml-2">
													in{" "}
													{
														categories.find(
															(c) => c.id === parseInt(selectedCategory)
														)?.name
													}
												</span>
											)}
											{selectedSubcategory !== "All" && (
												<span className="ml-2">
													›{" "}
													{
														categories
															.find((c) => c.id === parseInt(selectedCategory))
															?.subcategories?.find(
																(s) => s.id === parseInt(selectedSubcategory)
															)?.name
													}
												</span>
											)}
										</div>
										{isFiltering && (
											<div className="flex items-center text-sm text-gray-500">
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500 mr-2"></div>
												Filtering...
											</div>
										)}
									</div>
								</div>
							)}
						</div>

						{/* Products */}
						<div className="mb-4 sm:mb-6">
							<h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4">
								Products ({shop?.product_count || filteredAds.length})
							</h2>

							{filteredAds.length === 0 ? (
								<div className="text-center py-8 sm:py-12">
									<div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
										<svg
											className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
											/>
										</svg>
									</div>
									<h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
										{ads.length === 0
											? "No Products Available"
											: "No Products Found"}
									</h3>
									<p className="text-sm sm:text-base text-gray-500">
										{ads.length === 0
											? "This shop doesn't have any products listed yet."
											: "No products match your current search and filter criteria."}
									</p>
									{ads.length > 0 && (
										<button
											onClick={clearFilters}
											className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
										>
											Clear Filters
										</button>
									)}
								</div>
							) : (
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
									{filteredAds.map((ad, index) => {
										const borderColor = getBorderColor(getTierId(ad));
										return (
											<div
												key={ad.id}
												className="group cursor-pointer h-full"
												onClick={() => {
													const adUrl = generateAdUrl(ad);
													const adId = ad.id;
													handleAdClick(adUrl, adId);
												}}
											>
												<div
													className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 h-full flex flex-col"
													style={{ border: `2px solid ${borderColor}` }}
												>
													{/* Product Image */}
													<div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden flex-shrink-0">
														{ad.first_media_url ||
														(ad.media_urls &&
															Array.isArray(ad.media_urls) &&
															ad.media_urls.length > 0) ||
														(ad.media &&
															Array.isArray(ad.media) &&
															ad.media.length > 0) ? (
															<ResponsiveImage
																src={
																	ad.first_media_url
																		? ad.first_media_url
																				.replace(/\n/g, "")
																				.trim()
																		: ad.media_urls &&
																		  Array.isArray(ad.media_urls) &&
																		  ad.media_urls.length > 0
																		? ad.media_urls[0].replace(/\n/g, "").trim()
																		: ad.media[0].replace(/\n/g, "").trim()
																}
																alt={ad.title}
																className="w-full h-full group-hover:scale-105 transition-transform duration-200"
																loading="lazy"
																sizes="(max-width: 640px) 192px, (max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
																onError={(e) => {
																	if (e.target) {
																		e.target.style.display = "none";
																	}
																	if (e.target && e.target.nextElementSibling) {
																		e.target.nextElementSibling.style.display =
																			"flex";
																	}
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
															} bg-gradient-to-br from-gray-100 to-gray-200 flex-col items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-200`}
														>
															<div className="text-gray-400 group-hover:text-gray-500 transition-colors duration-200">
																<svg
																	width="48"
																	height="48"
																	viewBox="0 0 24 24"
																	fill="none"
																	stroke="currentColor"
																	strokeWidth="1.5"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	className="mb-2"
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
															<div className="text-xs text-gray-500 font-medium text-center px-2">
																No Image
															</div>
														</div>
														{/* Tier Badge */}
														<div
															className="absolute top-1 sm:top-2 left-1 sm:left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium text-white rounded"
															style={{ backgroundColor: borderColor }}
														>
															{getTierName(ad)}
														</div>
													</div>

													<div className="p-2 sm:p-3 flex flex-col flex-grow">
														<h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2 group-hover:text-amber-700 transition-colors duration-200 flex-grow text-left">
															{ad.title}
														</h3>
														{/* Price and Rating with justify-between */}
														<div className="flex justify-between items-center">
															{/* Price */}
															<span className="text-sm sm:text-base font-bold text-green-600">
																KES{" "}
																{ad.price
																	? parseFloat(ad.price).toLocaleString()
																	: "N/A"}
															</span>
															{/* Rating with single star */}
															{(ad.average_rating && ad.average_rating > 0) ||
															(ad.review_stats &&
																ad.review_stats.average > 0) ? (
																<div className="flex items-center gap-1">
																	<svg
																		className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400"
																		fill="currentColor"
																		viewBox="0 0 20 20"
																	>
																		<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
																	</svg>
																	<span className="text-xs sm:text-sm text-gray-600 font-medium">
																		{(
																			ad.average_rating ||
																			ad.review_stats?.average ||
																			0
																		).toFixed(1)}
																	</span>
																</div>
															) : (
																<div className="flex items-center gap-1">
																	<svg
																		className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300"
																		fill="currentColor"
																		viewBox="0 0 20 20"
																	>
																		<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
																	</svg>
																	<span className="text-xs sm:text-sm text-gray-400 font-medium">
																		0.0
																	</span>
																</div>
															)}
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							)}

							{/* Pagination Controls */}
							{ads.length > 0 &&
								!searchTerm &&
								selectedCategory === "All" &&
								selectedSubcategory === "All" &&
								totalPages > 1 && (
									<div className="flex justify-center mt-8">
										<div className="flex items-center gap-2">
											<Button
												variant="outline-warning"
												size="sm"
												onClick={() => handlePageChange(currentPage - 1)}
												disabled={currentPage <= 1 || isLoading}
												className="px-3 py-1.5 text-sm"
											>
												Previous
											</Button>

											{/* Page numbers */}
											<div className="flex items-center gap-1">
												{Array.from(
													{ length: Math.min(5, totalPages) },
													(_, i) => {
														const pageNum =
															Math.max(
																1,
																Math.min(totalPages - 4, currentPage - 2)
															) + i;
														if (pageNum > totalPages) return null;

														return (
															<Button
																key={pageNum}
																variant={
																	pageNum === currentPage
																		? "warning"
																		: "outline-warning"
																}
																size="sm"
																onClick={() => handlePageChange(pageNum)}
																disabled={isLoading}
																className="px-3 py-1.5 text-sm min-w-[40px]"
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
												disabled={currentPage >= totalPages || isLoading}
												className="px-3 py-1.5 text-sm"
											>
												Next
											</Button>
										</div>

										{/* Page info */}
										<div className="text-sm text-gray-500 text-center mt-2 ml-4">
											{isLoading ? (
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
			</div>
			<Footer />

			{/* Reviews Modal */}
			<ReviewsModal
				show={showReviewsModal}
				onHide={() => setShowReviewsModal(false)}
				shopSlug={slug}
				shopName={shop?.enterprise_name}
			/>

			{/* Leave Review Modal */}
			<LeaveReviewModal
				show={showLeaveReviewModal}
				onHide={() => setShowLeaveReviewModal(false)}
				shopName={shop?.enterprise_name}
				products={ads}
			/>

			{/* Share Modal */}
			{showShareModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg p-6 max-w-md w-full">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Share Shop
							</h3>
							<button
								onClick={handleCloseShareModal}
								className="text-gray-400 hover:text-gray-600"
							>
								<FontAwesomeIcon icon={faTimes} />
							</button>
						</div>

						<div className="space-y-3">
							<p className="text-sm text-gray-600 mb-4">
								Share {shop?.enterprise_name} with your friends and family
							</p>

							<div className="grid grid-cols-2 gap-3">
								<button
									onClick={shareToFacebook}
									className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
								>
									<FontAwesomeIcon icon={faFacebook} />
									<span className="text-sm">Facebook</span>
								</button>

								<button
									onClick={shareToTwitter}
									className="flex items-center justify-center gap-2 p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
								>
									<FontAwesomeIcon icon={faTwitter} />
									<span className="text-sm">Twitter</span>
								</button>

								<button
									onClick={shareToWhatsApp}
									className="flex items-center justify-center gap-2 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
								>
									<FontAwesomeIcon icon={faWhatsapp} />
									<span className="text-sm">WhatsApp</span>
								</button>

								<button
									onClick={shareToLinkedIn}
									className="flex items-center justify-center gap-2 p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
								>
									<FontAwesomeIcon icon={faLinkedin} />
									<span className="text-sm">LinkedIn</span>
								</button>
							</div>

							<button
								onClick={copyToClipboard}
								className="w-full flex items-center justify-center gap-2 p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
							>
								<FontAwesomeIcon icon={faCopy} />
								<span className="text-sm">Copy Link</span>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ShopPage;
