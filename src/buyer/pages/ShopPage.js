import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { getFallbackImage } from "../../utils/imageUtils";
import {
	getTierName,
	getTierId,
	getBorderColor,
} from "../utils/sellerTierUtils";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ReviewsModal from "../../components/ReviewsModal";
import LeaveReviewModal from "../../components/LeaveReviewModal";
import useSEO from "../../hooks/useSEO";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faShare,
	faStar,
	faStarHalfAlt,
	faTimes,
	faCopy,
} from "@fortawesome/free-solid-svg-icons";
import {
	faFacebook,
	faTwitter,
	faWhatsapp,
	faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import Spinner from "react-spinkit";

const ShopPage = () => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const [shop, setShop] = useState(null);
	const [ads, setAds] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [showShareModal, setShowShareModal] = useState(false);
	const [showReviewsModal, setShowReviewsModal] = useState(false);
	const [showLeaveReviewModal, setShowLeaveReviewModal] = useState(false);
	const [reviewStats, setReviewStats] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const [currentUserId, setCurrentUserId] = useState(null);

	// Initialize authentication state
	useEffect(() => {
		const token = sessionStorage.getItem("token");
		const role = sessionStorage.getItem("userRole");
		const userId = sessionStorage.getItem("userId");

		if (token && role) {
			setIsAuthenticated(true);
			setUserRole(role);
			setCurrentUserId(userId);
		}
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
						Authorization: "Bearer " + sessionStorage.getItem("token"),
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
				url: `${window.location.origin}/shop/${encodeURIComponent(slug)}`,
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
					return `https://via.placeholder.com/1200x630/FFD700/000000?text=${encodeURIComponent(
						shop?.enterprise_name || "Shop"
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
					{ property: "place:location:latitude", content: "-1.2921" },
					{ property: "place:location:longitude", content: "36.8219" },
					{ property: "place:name", content: shop.enterprise_name },
					{ property: "place:region", content: shop.county || "Kenya" },
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

	useSEO(seoData);

	useEffect(() => {
		const fetchShopData = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/shop/${slug}?page=${currentPage}&per_page=20`,
					{
						headers: {
							Authorization: "Bearer " + sessionStorage.getItem("token"),
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch shop data");
				}

				const data = await response.json();
				setShop(data.shop);
				setAds(data.ads);
				setHasMore(data.pagination.current_page < data.pagination.total_pages);
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

	const handleAdClick = (adId) => {
		navigate(`/ads/${adId}`);
	};

	const handleLoadMore = () => {
		setCurrentPage((prev) => prev + 1);
	};

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
								className="cursor-pointer hover:text-yellow-600 transition-colors"
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
										className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md text-sm sm:text-base lg:w-auto"
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
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
									{/* Location */}
									{(shop.city ||
										shop.county ||
										shop.sub_county ||
										shop.address) && (
										<div className="text-center sm:text-left">
											<div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
												Location
											</div>
											<div className="text-sm text-gray-900">
												{[shop.city, shop.sub_county, shop.county]
													.filter(Boolean)
													.join(", ")}
											</div>
										</div>
									)}

									{/* Registration Number */}
									{shop.business_registration_number && (
										<div className="text-center sm:text-left">
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
										<div className="text-center sm:text-left">
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
										<div className="text-center sm:text-left">
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

									{/* Address */}
									{shop.address && (
										<div className="text-center sm:text-left">
											<div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
												Address
											</div>
											<div className="text-sm text-gray-900">
												{shop.address}
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
											className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-medium text-xs transition-colors"
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
											<h4 className="font-medium text-gray-900 mb-2 text-sm">
												Rating Breakdown
											</h4>
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
										<h4 className="text-sm font-medium text-gray-900 mb-1">
											No Reviews Yet
										</h4>
										<p className="text-xs text-gray-500 mb-3">
											This shop doesn't have any reviews yet.
										</p>
										<div className="flex gap-2 justify-center">
											<button
												onClick={handleLeaveReview}
												className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-medium text-xs transition-colors"
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

						{/* Products */}
						<div className="mb-4 sm:mb-6">
							<h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4">
								Products ({shop.product_count})
							</h2>

							{ads.length === 0 ? (
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
										No Products Available
									</h3>
									<p className="text-sm sm:text-base text-gray-500">
										This shop doesn't have any products listed yet.
									</p>
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
									{ads.map((ad, index) => {
										const borderColor = getBorderColor(getTierId(ad));
										return (
											<div
												key={ad.id}
												className="group cursor-pointer transition-transform hover:scale-105 h-full"
												onClick={() => handleAdClick(ad.id)}
											>
												<div
													className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 h-full flex flex-col"
													style={{ border: `2px solid ${borderColor}` }}
												>
													{/* Product Image */}
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
																	: getFallbackImage()
															}
															alt={ad.title}
															className="w-full aspect-square object-contain rounded-t-lg"
															loading={index < 4 ? "eager" : "lazy"}
															fetchPriority={index < 2 ? "high" : "auto"}
															width="400"
															height="400"
															onError={(e) => {
																e.target.src = getFallbackImage();
															}}
														/>
														{/* Tier Badge */}
														<div className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10">
															<span
																className="text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium text-white shadow-sm"
																style={{
																	backgroundColor: getBorderColor(
																		getTierId(ad)
																	),
																}}
															>
																{getTierName(ad)}
															</span>
														</div>
													</div>

													{/* Product Info */}
													<div className="p-1.5 sm:p-2 lg:p-3 flex-1 flex flex-col">
														<h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-1 line-clamp-2">
															{ad.title}
														</h3>
														<p className="text-sm sm:text-lg font-bold text-yellow-700 mb-2">
															KSh {ad.price?.toLocaleString() || "N/A"}
														</p>
														<div className="mt-auto">
															<p className="text-xs text-gray-500">
																{ad.category_name} › {ad.subcategory_name}
															</p>
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							)}

							{/* Load More Button */}
							{hasMore && ads.length > 0 && (
								<div className="text-center mt-8">
									<Button
										variant="outline-warning"
										onClick={handleLoadMore}
										className="px-6 py-2"
									>
										Load More Products
									</Button>
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
