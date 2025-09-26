import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Carousel, Modal, Toast, ToastContainer } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar,
	faStarHalfAlt,
	faStar as faStarEmpty,
	faHeart,
	faEdit,
	faComments,
	faSpinner,
	faCheck,
	faExclamationTriangle,
	faUser,
	faBuilding,
	faBox,
	faShieldAlt,
	faArrowLeft,
	faArrowRight,
	faChevronLeft,
	faChevronRight,
	faArrowDown,
	faShare,
	faShareAlt,
	faCog,
} from "@fortawesome/free-solid-svg-icons";
import {
	faFacebook,
	faTwitter,
	faWhatsapp,
	faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import Navbar from "../../components/Navbar";
import AdCard from "../../components/AdCard";

import { motion } from "framer-motion";
import Spinner from "react-spinkit";
import AlertModal from "../../components/AlertModal";
import Swal from "sweetalert2";
import axios from "axios";
import ProductSEO from "../../components/ProductSEO";
import { getBorderColor } from "../utils/sellerTierUtils";
import { logClickEvent } from "../../utils/clickEventLogger";
import { getValidImageUrl } from "../../utils/imageUtils";
import Footer from "../../components/Footer";

const AdDetails = () => {
	const { slug } = useParams();
	const [searchParams] = useSearchParams();
	const adId = searchParams.get("id");
	const [ad, setAd] = useState(null);
	const [loading, setLoading] = useState(true);
	const [relatedAds, setRelatedAds] = useState([]);
	const [error, setError] = useState(null);
	const [wish_listLoading, setBookmarkLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [reviews, setReviews] = useState([]);
	const [loadingReviews, setLoadingReviews] = useState(false);
	const [reviewsError, setReviewsError] = useState(null);
	const [seller, setSeller] = useState(null);
	const [showSellerDetails, setShowSellerDetails] = useState(false); // State to toggle visibility
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [reviewText, setReviewText] = useState("");
	const [rating, setRating] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const navigate = useNavigate(); // Initialize useNavigate

	// Helper function to get user ID from JWT token
	const getUserIdFromToken = () => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				// Check if token has the correct JWT format (3 parts separated by dots)
				const parts = token.split(".");
				if (parts.length !== 3) {
					return null;
				}

				const payload = JSON.parse(atob(parts[1]));
				const userId =
					payload.seller_id ||
					payload.user_id ||
					payload.buyer_id ||
					payload.rider_id ||
					payload.id;
				return userId;
			} catch (error) {
				return null;
			}
		}
		return null;
	};

	// Check if current user is the owner of the ad
	const isAdOwner = () => {
		const role = sessionStorage.getItem("userRole");
		const userId = getUserIdFromToken();

		// Check if the current seller is the owner of this ad
		return (
			role === "seller" &&
			userId &&
			(ad?.seller_id === parseInt(userId) ||
				ad?.seller?.id === parseInt(userId))
		);
	};

	// Handle navigation to manage product page
	const handleManageProduct = () => {
		navigate(`/seller/ads/${adId}`);
	};
	const [showSellerToast, setShowSellerToast] = useState(false);
	const [showFullDescription, setShowFullDescription] = useState(false);
	const [carouselActiveIndex, setCarouselActiveIndex] = useState(0);
	// const handleCloseChatModal = () => setShowChatModal(false);
	// const [showChatModal, setShowChatModal] = useState(false);
	const [showShopModal, setShowShopModal] = useState(false);
	const [sellerAds, setSellerAds] = useState([]);
	const [isLoadingSellerAds, setIsLoadingSellerAds] = useState(false);
	const [sellerAdsPage, setSellerAdsPage] = useState(1);
	const [hasMoreSellerAds, setHasMoreSellerAds] = useState(true);
	const [isLoadingMoreSellerAds, setIsLoadingMoreSellerAds] = useState(false);
	const [totalSellerAdsCount, setTotalSellerAdsCount] = useState(0);
	const [showAllRelatedProducts, setShowAllRelatedProducts] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);

	// Authentication state
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const [currentUserId, setCurrentUserId] = useState(null);

	const handleViewShop = () => {
		const shopName =
			ad.seller_enterprise_name ||
			ad.seller?.enterprise_name ||
			ad.seller_name ||
			"shop";
		const slug = shopName
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");

		// Preserve current query parameters when navigating to shop
		const currentParams = new URLSearchParams(window.location.search);
		const currentQuery = currentParams.toString();
		const separator = currentQuery ? "?" : "";

		navigate(`/shop/${slug}${separator}${currentQuery}`);
	};

	const handleViewAllRelatedProducts = () => {
		setShowAllRelatedProducts(!showAllRelatedProducts);
	};

	// Social sharing functions
	const handleShare = () => {
		setShowShareModal(true);
	};

	const handleCloseShareModal = () => {
		setShowShareModal(false);
	};

	const shareToFacebook = () => {
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(`${ad?.title} - Carbon Cube Kenya`);
		window.open(
			`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
			"_blank",
			"width=600,height=400"
		);
	};

	const shareToTwitter = () => {
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(
			`Check out this product: ${ad?.title} on Carbon Cube Kenya`
		);
		window.open(
			`https://twitter.com/intent/tweet?url=${url}&text=${text}`,
			"_blank",
			"width=600,height=400"
		);
	};

	const shareToWhatsApp = () => {
		const text = encodeURIComponent(
			`Check out this product: ${ad?.title} on Carbon Cube Kenya - ${window.location.href}`
		);
		window.open(`https://wa.me/?text=${text}`, "_blank");
	};

	const shareToLinkedIn = () => {
		const url = encodeURIComponent(window.location.href);
		const title = encodeURIComponent(
			ad?.title || "Product on Carbon Cube Kenya"
		);
		window.open(
			`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`,
			"_blank",
			"width=600,height=400"
		);
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setAlertModalConfig({
				isVisible: true,
				title: "Link Copied!",
				message: "Product link has been copied to your clipboard.",
				icon: "success",
				confirmText: "Great!",
				showCancel: false,
				onClose: () =>
					setAlertModalConfig((prev) => ({ ...prev, isVisible: false })),
			});
		} catch (err) {
			// Copy failed silently
		}
	};

	// Check screen size for related products display

	// SEO is now handled by ProductSEO component
	// Prepare product data for SEO
	const productData = ad
		? {
				id: ad.id,
				title: ad.title,
				description: ad.description,
				price: ad.price,
				currency: "KES",
				condition:
					ad.condition === "brand_new"
						? "new"
						: ad.condition === "second_hand"
						? "used"
						: "refurbished",
				category: ad.category_name,
				category_name: ad.category_name,
				brand: ad.brand,
				seller: ad.seller_name,
				seller_enterprise_name: ad.seller_enterprise_name,
				images: ad.media_urls ? ad.media_urls.map((url) => ({ url })) : [],
				location: ad.location || "Kenya",
				availability: "in stock",
				sku: ad.id?.toString(),
				created_at: ad.created_at,
				updated_at: ad.updated_at,
				keywords: [
					ad.title,
					ad.brand,
					ad.category_name,
					ad.subcategory_name,
					ad.condition,
					"Carbon Cube Kenya",
					"online marketplace Kenya",
					"verified seller",
				].filter(Boolean),
				tags: [ad.category_name, ad.subcategory_name, ad.condition].filter(
					Boolean
				),
		  }
		: null;

	// Initialize authentication state
	useEffect(() => {
		const initializeAuth = () => {
			const token = localStorage.getItem("token");
			if (token) {
				const role = sessionStorage.getItem("userRole");
				const userId = getUserIdFromToken();

				setUserRole(role);
				setCurrentUserId(userId);
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
				setUserRole(null);
				setCurrentUserId(null);
			}
		};
		initializeAuth();
	}, []);

	useEffect(() => {
		if (ad && (ad.seller_id || ad.seller?.id) && showShopModal) {
			setIsLoadingSellerAds(true);
			setSellerAdsPage(1);
			setHasMoreSellerAds(true);
			setTotalSellerAdsCount(0);

			const sellerId = ad.seller_id || ad.seller?.id;

			// Get total count first
			fetch(`${process.env.REACT_APP_BACKEND_URL}/sellers/${sellerId}/ads`)
				.then((res) => {
					if (!res.ok) {
						throw new Error(`HTTP error! status: ${res.status}`);
					}
					return res.json();
				})
				.then((allData) => {
					const allAdsArray = Array.isArray(allData) ? allData : [];
					setTotalSellerAdsCount(allAdsArray.length);

					// Then get paginated data for display
					return fetch(
						`${process.env.REACT_APP_BACKEND_URL}/sellers/${sellerId}/ads?page=1&limit=12`
					);
				})
				.then((res) => {
					if (!res.ok) {
						throw new Error(`HTTP error! status: ${res.status}`);
					}
					return res.json();
				})
				.then((data) => {
					const adsArray = Array.isArray(data) ? data : [];
					setSellerAds(adsArray);
					setHasMoreSellerAds(adsArray.length === 12); // If we got 12 items, there might be more
					setIsLoadingSellerAds(false);
				})
				.catch((err) => {
					setSellerAds([]);
					setHasMoreSellerAds(false);
					setTotalSellerAdsCount(0);
					setIsLoadingSellerAds(false);
				});
		}
	}, [ad, showShopModal]); // Do NOT destructure ad.seller_id directly here

	const handleShowModal = async () => {
		setShowModal(true);
		setLoadingReviews(true);

		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/ads/${adId}/reviews`
			);
			if (!response.ok) throw new Error("Failed to fetch reviews");
			const data = await response.json();
			setReviews(data);
		} catch (error) {
			setReviewsError("Error loading reviews.");
		} finally {
			setLoadingReviews(false);
		}
	};

	const handleCloseModal = () => setShowModal(false);

	const handleShowReviewModal = () => {
		if (!isAuthenticated) {
			// Automatically redirect to login page with current URL as redirect parameter
			const currentUrl = window.location.pathname + window.location.search;
			navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
			return;
		}

		// Check if the current user is the seller of this ad
		const role = sessionStorage.getItem("userRole");
		const userId = getUserIdFromToken();

		if (
			role === "seller" &&
			ad &&
			userId &&
			(ad.seller_id === parseInt(userId) || ad.seller?.id === parseInt(userId))
		) {
			setAlertModalConfig({
				isVisible: true,
				message: "You cannot review your own ad.",
				title: "Review Not Allowed",
				icon: "warning",
				confirmText: "OK",
				cancelText: "",
				showCancel: false,
				onClose: () =>
					setAlertModalConfig((prev) => ({ ...prev, isVisible: false })),
			});
			return;
		}

		// If all checks pass, show the review modal
		setShowReviewModal(true);
	};

	const handleCloseReviewModal = () => {
		setShowReviewModal(false);
		setReviewText("");
		setRating(0);
		setSubmitError(null);
	};

	const handleRatingClick = (selectedRating) => {
		setRating(selectedRating);
	};

	useEffect(() => {
		if (!adId) {
			setError("Ad ID is missing.");
			setLoading(false);
			return;
		}

		// Reset seller-related states on ad change
		setShowSellerDetails(false);
		setSeller(null);

		// Fetch Ad Details
		const fetchAdDetails = async () => {
			try {
				// Add timeout for mobile devices and better error handling
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/buyer/ads/${adId}`,
					{
						signal: controller.signal,
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
					}
				);

				clearTimeout(timeoutId);

				if (!response.ok) {
					if (response.status === 404) {
						setError("not_found");
						return;
					}
					throw new Error(
						`Failed to fetch ad details (status ${response.status})`
					);
				}
				const data = await response.json();
				setAd(data);
			} catch (error) {
				// Handle specific error types
				if (error.name === "AbortError") {
					setError("timeout_error");
				} else if (error.message.includes("Failed to fetch")) {
					setError("network_error");
				} else {
					setError("load_error");
				}
			} finally {
				setLoading(false);
			}
		};

		// Fetch Related Ads
		const fetchRelatedAds = async () => {
			try {
				// Clean the adId to remove any extra characters including ?
				const cleanAdId = adId?.toString().replace(/[?&]/g, "").trim();

				const url = `${process.env.REACT_APP_BACKEND_URL}/buyer/ads/${cleanAdId}/related`;

				// Add timeout for mobile devices and better error handling
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

				const response = await fetch(url, {
					signal: controller.signal,
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				});

				clearTimeout(timeoutId);

				if (!response.ok) {
					// Handle specific error cases
					if (response.status === 404) {
						setRelatedAds([]);
						return;
					}

					throw new Error(
						`Failed to fetch related ads (status ${response.status})`
					);
				}

				const data = await response.json();

				// Handle both array and single object responses
				let relatedAdsArray = Array.isArray(data) ? data : data ? [data] : [];

				// Filter out the current ad from related ads
				const currentAdId = parseInt(cleanAdId);
				relatedAdsArray = relatedAdsArray.filter((relatedAd) => {
					return relatedAd.id !== currentAdId;
				});

				setRelatedAds(relatedAdsArray);
			} catch (error) {
				// Handle specific error types silently
				if (error.name === "AbortError") {
					// Request timed out
				} else if (error.message.includes("Failed to fetch")) {
					// Network error
				}

				setRelatedAds([]);
			}
		};

		// Fetch all data
		fetchAdDetails();
		// Only fetch related ads if we have a valid adId
		if (adId && adId !== "unknown") {
			fetchRelatedAds();
		} else {
			setRelatedAds([]);
		}
	}, [adId]);

	const fetchSellerDetails = async () => {
		try {
			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("You must be logged in to view seller details.");
			}

			// Clean the adId to remove any extra characters
			const cleanAdId = adId?.toString().replace(/[?&]/g, "").trim();

			const url = `${process.env.REACT_APP_BACKEND_URL}/buyer/ads/${cleanAdId}/seller`;

			const response = await fetch(url, {
				signal: AbortSignal.timeout(10000),
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`HTTP error! status: ${response.status}, message: ${errorText}`
				);
			}

			const sellerData = await response.json();
			return sellerData;
		} catch (error) {
			throw error;
		}
	};

	const [alertModalConfig, setAlertModalConfig] = useState({
		isVisible: false,
		message: "",
		title: "",
		icon: "",
		confirmText: "",
		cancelText: "",
		showCancel: true,
		onClose: () => {},
	});

	const handleSubmitReview = async () => {
		const token = localStorage.getItem("token");

		if (!token) {
			// Automatically redirect to login page with current URL as redirect parameter
			const currentUrl = window.location.pathname + window.location.search;
			navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
			return;
		}

		if (rating === 0) {
			setSubmitError("Please select a rating.");
			return;
		}

		if (!reviewText.trim()) {
			setSubmitError("Please enter a review.");
			return;
		}

		setIsSubmitting(true);
		setSubmitError(null);

		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/buyer/ads/${adId}/reviews`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						review: {
							rating: rating,
							review: reviewText,
						},
					}),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to submit review");
			}

			// Close review modal first
			handleCloseReviewModal();

			// Show success alert after a slight delay to ensure smooth transition
			setTimeout(() => {
				setAlertModalConfig({
					isVisible: true,
					message: "Your review was submitted successfully!",
					title: "Thank You!",
					icon: "success",
					confirmText: "Awesome!",
					cancelText: "Close",
					showCancel: false,
					onClose: () =>
						setAlertModalConfig((prev) => ({ ...prev, isVisible: false })),
				});
			}, 300);
		} catch (error) {
			setSubmitError("Failed to submit review. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleOpenChatModal = () => {
		const token = localStorage.getItem("token");
		if (!token) {
			// Automatically redirect to login page with current URL as redirect parameter
			const currentUrl = window.location.pathname + window.location.search;
			navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
			return;
		}

		// Prevent sellers from messaging their own ads
		const role = sessionStorage.getItem("userRole");
		const userId = getUserIdFromToken();

		if (
			role === "seller" &&
			userId &&
			(ad?.seller_id === parseInt(userId) ||
				ad?.seller?.id === parseInt(userId))
		) {
			Swal.fire({
				title: "Cannot Message Yourself",
				text: "You cannot send messages to your own ads.",
				icon: "info",
				confirmButtonText: "OK",
				customClass: {
					popup: "futuristic-swal rounded-4 glass-bg",
					title: "fw-semibold text-white",
					htmlContainer: "text-light",
					confirmButton: "btn rounded-pill futuristic-confirm",
				},
				backdrop: "rgba(0, 0, 0, 0.6)",
				buttonsStyling: false,
			});
			return;
		}

		const suggestedMessages = [
			`Is this still available?`,
			`Can you share more details about the product?`,
			`What's your best price for this item?`,
			`Hello, I'm interested in "${ad?.title}". When can I pick it up?`,
		];

		Swal.fire({
			title: "Start Chat with Seller",
			html: `
            <p>Click a message below or type your own:</p>
            <div id="suggested-msg-container" style="margin-bottom: 10px;"></div>
            <textarea id="chat-message" class="swal2-textarea" placeholder="Type your message..."
                style="
                width: 85%; 
                height: 100px; 
                background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                border: 2px solid transparent;
                border-radius: 12px;
                padding: 16px;
                font-family: 'Fira Sans Extra Condensed', sans-serif;
                font-size: 15px;
                color: #1e293b;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.7);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                resize: vertical;
                outline: none;
                backdrop-filter: blur(10px);
                background-attachment: fixed;
                "
            ></textarea>
            `,
			icon: "info",
			confirmButtonText: "Send Message",
			cancelButtonText: "Cancel",
			showCancelButton: true,
			customClass: {
				popup: "futuristic-swal rounded-4 glass-bg",
				title: "fw-semibold text-white",
				htmlContainer: "text-light",
				actions: "futuristic-actions",
				confirmButton: "btn rounded-pill futuristic-confirm",
				cancelButton: "btn rounded-pill futuristic-cancel",
			},
			backdrop: "rgba(0, 0, 0, 0.6)",
			buttonsStyling: false,
			didOpen: () => {
				const container = document.getElementById("suggested-msg-container");
				const textarea = document.getElementById("chat-message");

				// Only proceed if container exists
				if (container) {
					suggestedMessages.forEach((msg) => {
						const btn = document.createElement("button");
						btn.textContent = msg;
						btn.className = "swal2-styled";
						btn.style.cssText = `
                margin: 3px; padding: 3px 6px; background-color: #ffc107; color: #1e293b;
                border: 2px solid #ffc107; border-radius: 30px; font-size: 0.85rem; cursor: pointer;
                `;
						btn.onclick = () => {
							if (textarea) {
								textarea.value = msg;
							}
						};
						container.appendChild(btn);
					});
				}
			},
			preConfirm: () => {
				const msg = document.getElementById("chat-message")?.value.trim();
				if (!msg) {
					Swal.showValidationMessage("Please enter a message");
					return false;
				}
				return msg;
			},
		}).then((result) => {
			if (result.isConfirmed && result.value) {
				handleSendChatMessage(result.value);
			}
		});
	};

	const handleSendChatMessage = async (message) => {
		const token = localStorage.getItem("token");

		// Validate message before sending
		if (!message || message.trim() === "") {
			setAlertModalConfig({
				isVisible: true,
				title: "Error",
				message: "Message cannot be empty. Please enter a message.",
				icon: "error",
				confirmText: "Okay",
				showCancel: false,
				onClose: () =>
					setAlertModalConfig((prev) => ({ ...prev, isVisible: false })),
			});
			return;
		}

		try {
			// Use unified conversations endpoint for all user types
			const endpoint = `${process.env.REACT_APP_BACKEND_URL}/conversations`;

			// Determine the correct parameters based on user role
			const requestBody = {
				ad_id: ad?.id,
				content: message.trim(),
			};

			// If current user is a seller messaging another seller about their ad
			if (userRole === "seller") {
				// For seller-to-seller conversations, set seller_id to the ad owner
				// The backend will automatically set inquirer_seller_id to current user
				requestBody.seller_id = ad?.seller_id; // The ad owner
				// Don't set buyer_id - backend will handle seller-to-seller logic
			} else {
				// For buyer-to-seller conversations
				requestBody.seller_id = ad?.seller_id; // The ad owner
				requestBody.buyer_id = currentUserId; // Current buyer
			}

			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(requestBody),
			});

			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(responseData.error || "Failed to create conversation");
			}

			setTimeout(() => {
				setAlertModalConfig({
					isVisible: true,
					title: "Message Sent!",
					message: "Your message was sent and a chat has been created.",
					icon: "success",
					confirmText: "Awesome!",
					showCancel: false,
					onClose: () =>
						setAlertModalConfig((prev) => ({ ...prev, isVisible: false })),
				});
			}, 300);
		} catch (error) {
			// Handle error silently
			setAlertModalConfig({
				isVisible: true,
				title: "Error",
				message: `Failed to send message: ${error.message}`,
				icon: "error",
				confirmText: "Okay",
				showCancel: false,
				onClose: () =>
					setAlertModalConfig((prev) => ({ ...prev, isVisible: false })),
			});
		}
	};

	const handleRevealSellerDetails = async (e) => {
		// Make sure to prevent default on the event object
		if (e && e.preventDefault) {
			e.preventDefault();
		}

		// Set local loading state for just this button
		const revealButtonRef = e?.currentTarget;
		if (revealButtonRef) {
			revealButtonRef.disabled = true;
			revealButtonRef.textContent = "Loading...";
		}

		try {
			// Log the click event first with enhanced tracking (no auth required)
			await logClickEvent(adId, "Reveal-Seller-Details", {
				seller_id: ad?.seller_id,
				ad_title: ad?.title,
				action: "reveal_seller_contact",
			});

			// Check if user is authenticated for fetching seller details
			const token = localStorage.getItem("token");
			if (!token) {
				// Automatically redirect to login page with current URL as redirect parameter
				const currentUrl = window.location.pathname + window.location.search;
				navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
				return;
			}

			// Only fetch seller details if not already available
			if (!seller) {
				const sellerData = await fetchSellerDetails();
				setSeller(sellerData);
			}

			// Show seller details and toast
			setShowSellerDetails(true);
			setShowSellerToast(true);
		} catch (error) {
			// Handle error with better feedback

			// Show a user-friendly error
			setAlertModalConfig({
				isVisible: true,
				message: `Failed to reveal seller contact: ${error.message}. Please try again.`,
				title: "Error",
				icon: "error",
				confirmText: "OK",
				showCancel: false,
				onClose: () =>
					setAlertModalConfig((prev) => ({ ...prev, isVisible: false })),
			});
		} finally {
			// Re-enable the button
			if (revealButtonRef) {
				revealButtonRef.disabled = false;
				revealButtonRef.textContent = "Reveal Seller Contact";
			}
		}
	};

	const handleAddToWishlist = async () => {
		if (!ad) return;

		// Prevent sellers from adding their own ads to wishlist
		const role = sessionStorage.getItem("userRole");
		const userId = getUserIdFromToken();

		if (
			role === "seller" &&
			userId &&
			(ad?.seller_id === parseInt(userId) ||
				ad?.seller?.id === parseInt(userId))
		) {
			setAlertModalConfig({
				isVisible: true,
				message: "You cannot add your own ads to wishlist.",
				title: "Cannot Add Own Ad",
				icon: "info",
				confirmText: "OK",
				showCancel: false,
				onClose: () =>
					setAlertModalConfig((prev) => ({ ...prev, isVisible: false })),
			});
			return;
		}

		try {
			setBookmarkLoading(true);

			// Step 1: Log the 'Add-to-Wishlist' event with enhanced tracking (no auth required)
			await logClickEvent(ad.id, "Add-to-Wish-List", {
				seller_id: ad?.seller_id,
				ad_title: ad?.title,
				action: "add_to_wishlist",
			});

			// Check if user is authenticated for adding to wishlist
			const token = localStorage.getItem("token");
			if (!token) {
				// Automatically redirect to login page with current URL as redirect parameter
				const currentUrl = window.location.pathname + window.location.search;
				navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
				return;
			}

			// Step 2: API call to add the ad to the wishlist
			// Use appropriate endpoint based on user role
			const wishlistEndpoint =
				userRole === "seller"
					? `${process.env.REACT_APP_BACKEND_URL}/buyer/wish_lists` // Sellers can use buyer wishlist endpoint
					: `${process.env.REACT_APP_BACKEND_URL}/buyer/wish_lists`;

			const response = await axios.post(
				wishlistEndpoint,
				{ ad_id: ad.id },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			// Check if the response is successful
			if (response.status === 201) {
				setAlertModalConfig({
					isVisible: true,
					icon: "success", // show the success icon
					title: "Added to Wishlist!",
					message: "The ad has been successfully added to your wishlist.",
					confirmText: "Awesome", // single confirm button
					showCancel: false, // no cancel button
					onConfirm: () =>
						setAlertModalConfig((prev) => ({ ...prev, isVisible: false })),
				});
			} else {
				setAlertModalConfig({
					isVisible: true,
					icon: "error",
					title: "Oops!",
					message: "Something went wrong. Please try again.",
					confirmText: false,
					showCancel: "Close",
					onConfirm: () =>
						setAlertModalConfig((prev) => ({ ...prev, isVisible: false })),
				});
			}
		} catch (error) {
			setAlertModalConfig({
				isVisible: true,
				icon: "error",
				title: "Error",
				message: "Failed to add ad to the wishlist. Please try again.",
				confirmText: false,
				showCancel: "Close",
				onConfirm: () =>
					setAlertModalConfig((prev) => ({ ...prev, isVisible: false })),
			});
		} finally {
			setBookmarkLoading(false);
		}
	};

	const renderRatingStars = (rating, reviewCount) => {
		if (typeof rating !== "number" || rating < 0) {
			return (
				<div className="flex items-center space-x-2">
					<div className="flex items-center space-x-1">
						{[...Array(5)].map((_, index) => (
							<FontAwesomeIcon
								key={`empty-${index}`}
								icon={faStarEmpty}
								className="text-gray-300 text-sm"
							/>
						))}
					</div>
					<span className="text-sm text-gray-500 italic">
						{rating.toFixed(1)}/5 ({reviewCount} Ratings)
					</span>
				</div>
			);
		}

		const fullStars = Math.floor(Math.max(0, Math.min(rating, 5)));
		const halfStar = rating % 1 >= 0.5;
		const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

		return (
			<div className="flex items-center space-x-2">
				<div className="flex items-center space-x-1">
					{[...Array(fullStars)].map((_, index) => (
						<FontAwesomeIcon
							key={`full-${index}`}
							icon={faStar}
							className="text-yellow-400 text-sm"
						/>
					))}
					{halfStar && (
						<FontAwesomeIcon
							icon={faStarHalfAlt}
							className="text-yellow-400 text-sm"
						/>
					)}
					{[...Array(emptyStars)].map((_, index) => (
						<FontAwesomeIcon
							key={`empty-${index}`}
							icon={faStarEmpty}
							className="text-gray-300 text-sm"
						/>
					))}
				</div>
				<span className="text-sm text-gray-500 italic">
					{rating.toFixed(1)}/5 ({reviewCount} Ratings)
				</span>
			</div>
		);
	};

	const handleLoadMoreSellerAds = async () => {
		if (!ad || !hasMoreSellerAds || isLoadingMoreSellerAds) return;

		const sellerId = ad.seller_id || ad.seller?.id;
		const nextPage = sellerAdsPage + 1;

		setIsLoadingMoreSellerAds(true);

		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/sellers/${sellerId}/ads?page=${nextPage}&limit=12`
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			const newAds = Array.isArray(data) ? data : [];

			if (newAds.length > 0) {
				setSellerAds((prev) => [...prev, ...newAds]);
				setSellerAdsPage(nextPage);
				setHasMoreSellerAds(newAds.length === 12);
			} else {
				setHasMoreSellerAds(false);
			}
		} catch (error) {
			// Handle error silently
		} finally {
			setIsLoadingMoreSellerAds(false);
		}
	};

	const handleAdClick = async (adUrl, adId) => {
		if (!adId) return;

		try {
			setShowShopModal(false); // close modal
			await logClickEvent(adId, "Ad-Click", {
				action: "navigate_to_ad",
				source: "related_ads",
			});
		} catch (error) {
			// Logging failed, proceed silently
		}

		// Preserve current query parameters when navigating to ad details
		const currentParams = new URLSearchParams(window.location.search);
		const currentQuery = currentParams.toString();
		const separator = currentQuery ? "&" : "?";

		navigate(`${adUrl}${separator}${currentQuery}`);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const renderCarousel = () => {
		return (
			<div className="w-full h-full rounded-2xl overflow-hidden relative">
				{/* Default Image Case */}
				{(!ad.media_urls || ad.media_urls.length === 0) &&
				(!ad.media || ad.media.length === 0) ? (
					<div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center rounded-2xl">
						<div className="text-gray-400">
							<svg
								width="64"
								height="64"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="mb-3"
							>
								<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
								<circle cx="8.5" cy="8.5" r="1.5" />
								<polyline points="21,15 16,10 5,21" />
							</svg>
						</div>
						<div className="text-sm text-gray-500 font-medium text-center px-4">
							No Image Available
						</div>
					</div>
				) : (
					<div className="relative w-full h-full">
						<Carousel
							activeIndex={carouselActiveIndex}
							onSelect={(selectedIndex) =>
								setCarouselActiveIndex(selectedIndex)
							}
							className="h-full"
							controls={(ad.media_urls || ad.media || []).length > 1}
							indicators={false}
							interval={null}
						>
							{(ad.media_urls || ad.media || []).map((url, index) => (
								<Carousel.Item key={index} className="h-full">
									<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
										<img
											className="w-full h-full object-contain rounded-xl"
											src={getValidImageUrl(url)}
											alt={`Product ${index + 1}`}
											onError={(e) => {
												e.target.style.display = "none";
												e.target.nextSibling.style.display = "flex";
											}}
										/>
										{/* Fallback for failed image */}
										<div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl hidden">
											<div className="text-gray-400">
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
									</div>
								</Carousel.Item>
							))}
						</Carousel>

						{/* Image Counter */}
						{(ad.media_urls || ad.media || []).length > 1 && (
							<div className="absolute bottom-16 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm z-30">
								{carouselActiveIndex + 1} /{" "}
								{(ad.media_urls || ad.media || []).length}
							</div>
						)}

						{/* Thumbnail Navigation */}
						{(ad.media_urls || ad.media || []).length > 1 && (
							<div className="absolute bottom-16 right-4 z-30">
								<div className="flex gap-2">
									{(ad.media_urls || ad.media || []).map((image, index) => (
										<div
											key={index}
											className={`cursor-pointer transition-all duration-300 rounded-lg overflow-hidden border-2 ${
												index === carouselActiveIndex
													? "border-yellow-500 scale-110"
													: "border-white border-opacity-50 hover:border-opacity-75"
											}`}
											onClick={() => setCarouselActiveIndex(index)}
											style={{
												width: "40px",
												height: "40px",
											}}
										>
											<img
												src={getValidImageUrl(image)}
												alt={`Thumbnail ${index + 1}`}
												className="w-full h-full object-cover"
												onError={(e) => {
													e.target.style.display = "none";
													e.target.nextSibling.style.display = "flex";
												}}
											/>
											{/* Fallback for failed thumbnail */}
											<div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 hidden">
												<div className="text-gray-400">
													<svg
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
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
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Spinner
					variant="warning"
					name="cube-grid"
					style={{ width: 100, height: 100 }}
				/>
			</div>
		);
	}

	if (error === "not_found") {
		return (
			<>
				<Navbar
					mode="buyer"
					searchQuery={""}
					setSearchQuery={() => {}}
					handleSearch={() => {}}
					showSearch={true}
					showCategories={true}
					showUserMenu={true}
					showCart={true}
					showWishlist={true}
				/>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
					<h3 className="text-gray-500 mb-2">This ad is no longer available</h3>
					<p className="text-gray-400 mb-8">
						It may have been removed or never existed in this environment.
					</p>
					<button
						className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-full px-6 py-3 font-medium transition-colors"
						onClick={() => navigate("/")}
					>
						Back to Home
					</button>
				</div>
			</>
		);
	}

	if (error === "load_error") {
		return (
			<>
				<Navbar
					mode="buyer"
					searchQuery={""}
					setSearchQuery={() => {}}
					handleSearch={() => {}}
					showSearch={true}
					showCategories={true}
					showUserMenu={true}
					showCart={true}
					showWishlist={true}
				/>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
					<h3 className="text-red-600 mb-2">Error loading ad details.</h3>
					<p className="text-gray-400 mb-8">
						Please refresh the page or return to the homepage.
					</p>
					<button
						className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-full px-6 py-3 font-medium transition-colors"
						onClick={() => navigate("/")}
					>
						Back to Home
					</button>
				</div>
			</>
		);
	}

	if (error === "timeout_error") {
		return (
			<>
				<Navbar
					mode="buyer"
					searchQuery={""}
					setSearchQuery={() => {}}
					handleSearch={() => {}}
					showSearch={true}
					showCategories={true}
					showUserMenu={true}
					showCart={true}
					showWishlist={true}
				/>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
					<h3 className="text-yellow-600 mb-2">Request Timeout</h3>
					<p className="text-gray-400 mb-8">
						The request took too long to complete. This might be due to a slow
						connection.
					</p>
					<div className="space-x-4">
						<button
							className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-full px-6 py-3 font-medium transition-colors"
							onClick={() => window.location.reload()}
						>
							Retry
						</button>
						<button
							className="bg-gray-500 hover:bg-gray-600 text-white rounded-full px-6 py-3 font-medium transition-colors"
							onClick={() => navigate("/")}
						>
							Back to Home
						</button>
					</div>
				</div>
			</>
		);
	}

	if (error === "network_error") {
		return (
			<>
				<Navbar
					mode="buyer"
					searchQuery={""}
					setSearchQuery={() => {}}
					handleSearch={() => {}}
					showSearch={true}
					showCategories={true}
					showUserMenu={true}
					showCart={true}
					showWishlist={true}
				/>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
					<h3 className="text-red-600 mb-2">Network Error</h3>
					<p className="text-gray-400 mb-8">
						Unable to connect to the server. Please check your internet
						connection.
					</p>
					<div className="space-x-4">
						<button
							className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-full px-6 py-3 font-medium transition-colors"
							onClick={() => window.location.reload()}
						>
							Retry
						</button>
						<button
							className="bg-gray-500 hover:bg-gray-600 text-white rounded-full px-6 py-3 font-medium transition-colors"
							onClick={() => navigate("/")}
						>
							Back to Home
						</button>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<ProductSEO product={productData} />
			<Navbar
				mode="buyer"
				showSearch={false}
				showCategories={true}
				showUserMenu={true}
				showCart={true}
				showWishlist={true}
			/>
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
				<div className="flex flex-col xl:flex-row gap-2 sm:gap-4 lg:gap-6 xl:gap-8">
					{/* Main Content Area */}
					<div className="flex-1 min-w-0 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-6 lg:py-8 relative z-0">
						{ad && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className="space-y-2 sm:space-y-6 lg:space-y-8"
							>
								{/* Breadcrumb */}
								<nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 md:mb-6 overflow-x-auto pb-2">
									<button
										onClick={() => navigate(-1)}
										className="hover:text-yellow-600 transition-colors whitespace-nowrap flex items-center"
									>
										<FontAwesomeIcon
											icon={faArrowLeft}
											className="mr-1 sm:mr-2 text-sm"
										/>
										<span className="hidden xs:inline">Back</span>
									</button>
									<FontAwesomeIcon
										icon={faChevronRight}
										className="text-gray-400 flex-shrink-0 text-xs"
									/>
									<span className="text-gray-700 truncate max-w-[120px] sm:max-w-none">
										{ad.category_name}
									</span>
									<FontAwesomeIcon
										icon={faChevronRight}
										className="text-gray-400 flex-shrink-0 text-xs"
									/>
									<span className="text-gray-700 truncate max-w-[120px] sm:max-w-none">
										{ad.subcategory_name}
									</span>
								</nav>

								{/* Product Title */}
								<div className="mb-4 sm:mb-6">
									<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black leading-tight">
										{ad.title}
									</h1>
								</div>

								{/* Product Header */}
								{(() => {
									const borderColor = getBorderColor(ad.seller_tier);
									return (
										<div
											className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl overflow-hidden relative w-full"
											style={{
												border: `2px solid ${borderColor}`,
												position: "relative",
											}}
										>
											{/* Tier Badge */}
											<div className="absolute top-3 left-3 z-30">
												<div
													className="px-2 py-1 text-white rounded text-xs font-medium"
													style={{ backgroundColor: borderColor }}
												>
													{ad.seller_tier_name || "Free"} Tier
												</div>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full">
												{/* Image Gallery */}
												<div className="relative p-2 sm:p-3 md:p-4 lg:p-6 flex items-center justify-center min-h-[250px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] overflow-hidden">
													{/* Image Container with Enhanced Styling */}
													<div className="relative w-full h-full max-w-2xl z-10">
														{renderCarousel()}
													</div>

													{/* Bottom Info Bar */}
													<div className="absolute bottom-3 left-3 right-3 z-20">
														<div className="bg-white/90 rounded p-2 border border-gray-200">
															<div className="flex items-center justify-between text-xs text-gray-600">
																<div className="flex items-center space-x-3">
																	<span>
																		{ad.seller_tier_name === "Premium"
																			? "Premium listing"
																			: "Standard listing"}
																	</span>
																	<span>
																		{ad.seller?.document_verified
																			? "Verified product"
																			: "Unverified product"}
																	</span>
																</div>
															</div>
														</div>
													</div>

													{/* Carousel Controls Enhancement */}
													<style>{`
												.carousel-control-prev,
												.carousel-control-next {
													z-index: 40 !important;
													opacity: 0.8 !important;
													background: rgba(0, 0, 0, 0.3) !important;
													border-radius: 50% !important;
													width: 40px !important;
													height: 40px !important;
													margin: auto 10px !important;
												}
												.carousel-control-prev:hover,
												.carousel-control-next:hover {
													opacity: 1 !important;
													background: rgba(0, 0, 0, 0.5) !important;
												}
											`}</style>
												</div>

												{/* Mobile Section - Shop and Action Buttons (below image on small screens) */}
												<div className="md:hidden p-2 sm:p-3 bg-white w-full space-y-3">
													{/* Seller Section */}
													<div
														className="p-3 rounded border border-gray-200 cursor-pointer hover:bg-gray-50"
														onClick={handleViewShop}
													>
														<div className="flex items-center justify-between">
															<div className="flex items-center space-x-3">
																<div className="relative">
																	{ad.seller_profile_picture ? (
																		<img
																			src={ad.seller_profile_picture}
																			alt="Seller Profile"
																			className="w-12 h-12 rounded-full object-cover border border-gray-200"
																		/>
																	) : (
																		<div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-lg font-bold">
																			<FontAwesomeIcon icon={faUser} />
																		</div>
																	)}
																	{ad.seller?.document_verified && (
																		<div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
																			<FontAwesomeIcon
																				icon={faCheck}
																				className="text-white text-xs"
																			/>
																		</div>
																	)}
																</div>
																<div>
																	<h3 className="font-semibold text-gray-900 text-sm">
																		{ad.seller_enterprise_name ||
																			ad.seller?.enterprise_name ||
																			ad.seller_name ||
																			"N/A"}
																	</h3>
																	<div className="flex items-center space-x-3 mt-1">
																		<span className="text-xs text-gray-600">
																			{ad.seller?.document_verified
																				? "Verified"
																				: "Unverified"}
																		</span>
																		<span className="text-xs text-gray-600">
																			{ad.seller_tier_name || "Free"} Tier
																		</span>
																	</div>
																</div>
															</div>
															<button className="px-3 py-2 bg-gray-800 text-white rounded text-xs font-medium hover:bg-gray-900">
																View Shop
															</button>
														</div>
													</div>

													{/* Price Section - Mobile Only */}
													<div className="w-full bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm">
														<div className="flex flex-wrap items-center justify-between gap-3">
															{/* Price */}
															<div className="flex items-center space-x-1">
																<span className="text-sm sm:text-base text-gray-600">
																	KSh
																</span>
																<span className="text-xl sm:text-2xl font-bold text-gray-900">
																	{ad.price
																		? Number(ad.price).toLocaleString("en-KE", {
																				minimumFractionDigits: 2,
																				maximumFractionDigits: 2,
																		  })
																		: "N/A"}
																</span>
															</div>

															{/* Condition */}
															<div className="flex items-center">
																<span
																	className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold rounded-lg text-white whitespace-nowrap ${
																		ad.condition === "brand_new"
																			? "bg-green-500"
																			: ad.condition === "second_hand"
																			? "bg-orange-500"
																			: ad.condition === "refurbished"
																			? "bg-blue-500"
																			: "bg-gray-500"
																	}`}
																>
																	{ad.condition === "brand_new"
																		? "Brand New"
																		: ad.condition === "second_hand"
																		? "Used"
																		: ad.condition === "refurbished"
																		? "Refurbished"
																		: ad.condition || "Unknown"}
																</span>
															</div>

															{/* Listing Date */}
															<div className="text-xs sm:text-sm text-gray-500">
																Listed{" "}
																{ad.created_at
																	? new Date(ad.created_at).toLocaleDateString(
																			"en-US",
																			{
																				day: "numeric",
																				month: "long",
																				year: "numeric",
																			}
																	  )
																	: "Recently"}
															</div>
														</div>
													</div>

													{/* Action Buttons - Mobile Only */}
													<div className="space-y-3">
														{/* Show different content based on ownership */}
														{isAdOwner() ? (
															/* Owner View - Manage Product Button */
															<button
																className="w-full py-3 px-4 bg-yellow-600 text-white rounded font-medium hover:bg-yellow-700 flex items-center justify-center space-x-2"
																onClick={handleManageProduct}
															>
																<FontAwesomeIcon icon={faCog} />
																<span>Manage Product</span>
															</button>
														) : /* Non-Owner View - Contact Seller */
														true ? (
															<>
																{(() => {
																	return showSellerDetails && seller ? (
																		<div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
																			<div className="space-y-2 sm:space-y-3">
																				<div className="flex items-center space-x-2">
																					<FontAwesomeIcon
																						icon={faUser}
																						className="text-gray-500 text-sm"
																					/>
																					<a
																						href={`tel:${seller.phone_number}`}
																						className="text-gray-800 hover:text-blue-600 transition-colors text-sm sm:text-base font-medium"
																					>
																						{seller.phone_number}
																					</a>
																				</div>
																				{seller.email && (
																					<div className="flex items-center space-x-2">
																						<FontAwesomeIcon
																							icon={faComments}
																							className="text-gray-500 text-sm"
																						/>
																						<a
																							href={`mailto:${seller.email}`}
																							className="text-gray-800 hover:text-blue-600 transition-colors text-sm sm:text-base font-medium"
																						>
																							{seller.email}
																						</a>
																					</div>
																				)}
																				{seller.location && (
																					<div className="flex items-center space-x-2">
																						<FontAwesomeIcon
																							icon={faBuilding}
																							className="text-gray-500 text-sm"
																						/>
																						<span className="text-gray-800 text-sm sm:text-base font-medium">
																							{seller.location}
																						</span>
																					</div>
																				)}
																			</div>
																		</div>
																	) : (
																		<button
																			className="w-full py-2 px-3 sm:py-3 sm:px-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors text-sm sm:text-base"
																			onClick={handleRevealSellerDetails}
																			disabled={loading}
																		>
																			{loading
																				? "Loading..."
																				: "Reveal Seller Contact"}
																		</button>
																	);
																})()}
															</>
														) : null}

														{/* Secondary Actions */}
														{!isAdOwner() && (
															<div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
																{/* Allow sellers to add to wishlist */}
																{true ? (
																	<button
																		className="p-3 bg-white rounded border border-gray-200 hover:bg-gray-50 flex flex-col items-center space-y-1"
																		disabled={!ad || wish_listLoading}
																		onClick={handleAddToWishlist}
																	>
																		<FontAwesomeIcon
																			icon={faHeart}
																			className="text-red-500"
																		/>
																		<span className="text-xs font-medium text-gray-700">
																			Wishlist
																		</span>
																	</button>
																) : null}

																{userRole !== "seller" && (
																	<button
																		className="p-3 bg-white rounded border border-gray-200 hover:bg-gray-50 flex flex-col items-center space-y-1"
																		onClick={handleShowReviewModal}
																	>
																		<FontAwesomeIcon
																			icon={faEdit}
																			className="text-yellow-600"
																		/>
																		<span className="text-xs font-medium text-gray-700">
																			Review
																		</span>
																	</button>
																)}

																{/* Allow sellers to chat */}
																{true ? (
																	<button
																		className="p-3 bg-white rounded border border-gray-200 hover:bg-gray-50 flex flex-col items-center space-y-1"
																		onClick={handleOpenChatModal}
																	>
																		<FontAwesomeIcon
																			icon={faComments}
																			className="text-blue-600"
																		/>
																		<span className="text-xs font-medium text-gray-700">
																			Chat
																		</span>
																	</button>
																) : null}

																<button
																	className="p-3 bg-white rounded border border-gray-200 hover:bg-gray-50 flex flex-col items-center space-y-1"
																	onClick={handleShare}
																>
																	<FontAwesomeIcon
																		icon={faShareAlt}
																		className="text-green-600"
																	/>
																	<span className="text-xs font-medium text-gray-700">
																		Share
																	</span>
																</button>
															</div>
														)}

														{/* Show only Share button for ad owners */}
														{isAdOwner() && (
															<div className="flex justify-center">
																<button
																	className="p-3 bg-white rounded border border-gray-200 hover:bg-gray-50 flex flex-col items-center space-y-1 w-20"
																	onClick={handleShare}
																>
																	<FontAwesomeIcon
																		icon={faShareAlt}
																		className="text-green-600"
																	/>
																	<span className="text-xs font-medium text-gray-700">
																		Share
																	</span>
																</button>
															</div>
														)}
													</div>
												</div>

												{/* Product Info */}
												<div className="p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 bg-white w-full">
													<div className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
														{/* Basic Info */}
														<div className="space-y-2 sm:space-y-3 lg:space-y-4">
															{/* Product Meta */}
															<div className="mb-4 sm:mb-6">
																<table className="w-full">
																	<tbody>
																		<tr className="border-b border-gray-100">
																			<td className="py-2 text-sm text-gray-500 font-medium w-1/3">
																				Brand
																			</td>
																			<td className="py-2 text-sm font-semibold text-gray-900">
																				{ad.brand}
																			</td>
																		</tr>
																		<tr className="border-b border-gray-100">
																			<td className="py-2 text-sm text-gray-500 font-medium w-1/3">
																				Manufacturer
																			</td>
																			<td className="py-2 text-sm font-semibold text-gray-900">
																				{ad.manufacturer}
																			</td>
																		</tr>
																		<tr className="border-b border-gray-100">
																			<td className="py-2 text-sm text-gray-500 font-medium w-1/3">
																				Category
																			</td>
																			<td className="py-2 text-sm font-semibold text-gray-900">
																				{ad.category_name}
																			</td>
																		</tr>
																		<tr className="border-b border-gray-100">
																			<td className="py-2 text-sm text-gray-500 font-medium w-1/3">
																				Subcategory
																			</td>
																			<td className="py-2 text-sm font-semibold text-gray-900">
																				{ad.subcategory_name}
																			</td>
																		</tr>
																		<tr className="border-b border-gray-100">
																			<td className="py-2 text-sm text-gray-500 font-medium w-1/3">
																				Height
																			</td>
																			<td className="py-2 text-sm font-semibold text-gray-900">
																				{ad.item_height
																					? `${ad.item_height} cm`
																					: "Not specified cm"}
																			</td>
																		</tr>
																		<tr className="border-b border-gray-100">
																			<td className="py-2 text-sm text-gray-500 font-medium w-1/3">
																				Width
																			</td>
																			<td className="py-2 text-sm font-semibold text-gray-900">
																				{ad.item_width
																					? `${ad.item_width} cm`
																					: "Not specified cm"}
																			</td>
																		</tr>
																		<tr className="border-b border-gray-100">
																			<td className="py-2 text-sm text-gray-500 font-medium w-1/3">
																				Length
																			</td>
																			<td className="py-2 text-sm font-semibold text-gray-900">
																				{ad.item_length
																					? `${ad.item_length} cm`
																					: "Not specified cm"}
																			</td>
																		</tr>
																		<tr>
																			<td className="py-2 text-sm text-gray-500 font-medium w-1/3">
																				Weight
																			</td>
																			<td className="py-2 text-sm font-semibold text-gray-900">
																				{ad.item_weight
																					? `${ad.item_weight} ${
																							ad.weight_unit || "Grams"
																					  }`
																					: "Not specified Grams"}
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>

															{/* Description */}
															{ad.description && (
																<div className="mb-4 sm:mb-6">
																	<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
																		Description
																	</h3>
																	<div className="text-sm text-gray-700 leading-relaxed">
																		{ad.description.length > 200 ? (
																			<>
																				<p
																					className={
																						showFullDescription
																							? ""
																							: "line-clamp-3"
																					}
																					style={
																						!showFullDescription
																							? {
																									display: "-webkit-box",
																									WebkitLineClamp: 3,
																									WebkitBoxOrient: "vertical",
																									overflow: "hidden",
																							  }
																							: {}
																					}
																				>
																					{ad.description}
																				</p>
																				<button
																					onClick={() =>
																						setShowFullDescription(
																							!showFullDescription
																						)
																					}
																					className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-2 transition-colors"
																				>
																					{showFullDescription
																						? "Show less"
																						: "Read more"}
																				</button>
																			</>
																		) : (
																			<p>{ad.description}</p>
																		)}
																	</div>
																</div>
															)}
														</div>

														{/* Rating Section */}
														<div
															onClick={handleShowModal}
															className="group cursor-pointer w-full bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200"
														>
															<div className="flex items-center justify-between">
																<div className="flex items-center space-x-2">
																	<FontAwesomeIcon
																		icon={faStar}
																		className="text-yellow-500 text-sm"
																	/>
																	<span className="text-sm font-medium text-gray-900">
																		Rating
																	</span>
																</div>
																<FontAwesomeIcon
																	icon={faChevronRight}
																	className="text-gray-400 text-sm group-hover:text-gray-600 transition-colors"
																/>
															</div>
															<div className="mt-2">
																{renderRatingStars(
																	ad.rating ||
																		ad.mean_rating ||
																		ad.average_rating ||
																		0,
																	ad.review_count ||
																		ad.reviews_count ||
																		ad.total_reviews ||
																		0
																)}
															</div>
														</div>

														{/* Seller Section - Hidden on small screens, shown on md and up */}
														<div
															className="hidden md:block p-3 rounded border border-gray-200 cursor-pointer hover:bg-gray-50"
															onClick={handleViewShop}
														>
															<div className="flex items-center justify-between">
																<div className="flex items-center space-x-3">
																	<div className="relative">
																		{ad.seller_profile_picture ? (
																			<img
																				src={ad.seller_profile_picture}
																				alt="Seller Profile"
																				className="w-12 h-12 rounded-full object-cover border border-gray-200"
																			/>
																		) : (
																			<div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-lg font-bold">
																				<FontAwesomeIcon icon={faUser} />
																			</div>
																		)}
																		{ad.seller?.document_verified && (
																			<div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
																				<FontAwesomeIcon
																					icon={faCheck}
																					className="text-white text-xs"
																				/>
																			</div>
																		)}
																	</div>
																	<div>
																		<h3 className="font-semibold text-gray-900 text-sm">
																			{ad.seller_enterprise_name ||
																				ad.seller?.enterprise_name ||
																				ad.seller_name ||
																				"N/A"}
																		</h3>
																		<div className="flex items-center space-x-3 mt-1">
																			<span className="text-xs text-gray-600">
																				{ad.seller?.document_verified
																					? "Verified"
																					: "Unverified"}
																			</span>
																			<span className="text-xs text-gray-600">
																				{ad.seller_tier_name || "Free"} Tier
																			</span>
																		</div>
																	</div>
																</div>
																<button className="px-3 py-2 bg-gray-800 text-white rounded text-xs font-medium hover:bg-gray-900">
																	View Shop
																</button>
															</div>
														</div>

														{/* Action Buttons - Hidden on small screens, shown on md and up */}
														<div className="hidden md:block space-y-3">
															{/* Show different content based on ownership */}
															{isAdOwner() ? (
																/* Owner View - Manage Product Button */
																<button
																	className="w-full py-3 px-4 bg-yellow-600 text-white rounded font-medium hover:bg-yellow-700 flex items-center justify-center space-x-2"
																	onClick={handleManageProduct}
																>
																	<FontAwesomeIcon icon={faCog} />
																	<span>Manage Product</span>
																</button>
															) : /* Non-Owner View - Contact Seller */
															true ? (
																<>
																	{(() => {
																		return showSellerDetails && seller ? (
																			<div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
																				<div className="space-y-2 sm:space-y-3">
																					<div className="flex items-center space-x-2">
																						<FontAwesomeIcon
																							icon={faUser}
																							className="text-gray-500 text-sm"
																						/>
																						<a
																							href={`tel:${seller.phone_number}`}
																							className="text-gray-800 hover:text-blue-600 transition-colors text-sm sm:text-base font-medium"
																						>
																							{seller.phone_number}
																						</a>
																					</div>
																					{seller.email && (
																						<div className="flex items-center space-x-2">
																							<FontAwesomeIcon
																								icon={faComments}
																								className="text-gray-500 text-sm"
																							/>
																							<a
																								href={`mailto:${seller.email}`}
																								className="text-gray-800 hover:text-blue-600 transition-colors text-sm sm:text-base font-medium"
																							>
																								{seller.email}
																							</a>
																						</div>
																					)}
																					{seller.location && (
																						<div className="flex items-center space-x-2">
																							<FontAwesomeIcon
																								icon={faBuilding}
																								className="text-gray-500 text-sm"
																							/>
																							<span className="text-gray-800 text-sm sm:text-base font-medium">
																								{seller.location}
																							</span>
																						</div>
																					)}
																				</div>
																			</div>
																		) : (
																			<button
																				className="w-full py-2 px-3 sm:py-3 sm:px-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors text-sm sm:text-base"
																				onClick={handleRevealSellerDetails}
																				disabled={loading}
																			>
																				{loading
																					? "Loading..."
																					: "Reveal Seller Contact"}
																			</button>
																		);
																	})()}
																</>
															) : null}

															{/* Secondary Actions */}
															{!isAdOwner() && (
																<div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
																	{/* Allow sellers to add to wishlist */}
																	{true ? (
																		<button
																			className="p-3 bg-white rounded border border-gray-200 hover:bg-gray-50 flex flex-col items-center space-y-1"
																			disabled={!ad || wish_listLoading}
																			onClick={handleAddToWishlist}
																		>
																			<FontAwesomeIcon
																				icon={faHeart}
																				className="text-red-500"
																			/>
																			<span className="text-xs font-medium text-gray-700">
																				Wishlist
																			</span>
																		</button>
																	) : null}

																	{userRole !== "seller" && (
																		<button
																			className="p-3 bg-white rounded border border-gray-200 hover:bg-gray-50 flex flex-col items-center space-y-1"
																			onClick={handleShowReviewModal}
																		>
																			<FontAwesomeIcon
																				icon={faEdit}
																				className="text-yellow-600"
																			/>
																			<span className="text-xs font-medium text-gray-700">
																				Review
																			</span>
																		</button>
																	)}

																	{/* Allow sellers to chat */}
																	{true ? (
																		<button
																			className="p-3 bg-white rounded border border-gray-200 hover:bg-gray-50 flex flex-col items-center space-y-1"
																			onClick={handleOpenChatModal}
																		>
																			<FontAwesomeIcon
																				icon={faComments}
																				className="text-blue-600"
																			/>
																			<span className="text-xs font-medium text-gray-700">
																				Chat
																			</span>
																		</button>
																	) : null}

																	<button
																		className="p-3 bg-white rounded border border-gray-200 hover:bg-gray-50 flex flex-col items-center space-y-1"
																		onClick={handleShare}
																	>
																		<FontAwesomeIcon
																			icon={faShareAlt}
																			className="text-green-600"
																		/>
																		<span className="text-xs font-medium text-gray-700">
																			Share
																		</span>
																	</button>
																</div>
															)}

															{/* Show only Share button for ad owners */}
															{isAdOwner() && (
																<div className="flex justify-center">
																	<button
																		className="p-3 bg-white rounded border border-gray-200 hover:bg-gray-50 flex flex-col items-center space-y-1 w-20"
																		onClick={handleShare}
																	>
																		<FontAwesomeIcon
																			icon={faShareAlt}
																			className="text-green-600"
																		/>
																		<span className="text-xs font-medium text-gray-700">
																			Share
																		</span>
																	</button>
																</div>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									);
								})()}

								{/* Related Products */}
								<div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6 lg:p-8 border border-gray-100">
									<div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6 lg:mb-8">
										<h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
											Related Products
										</h2>
										<button
											onClick={handleViewAllRelatedProducts}
											className="text-gray-600 hover:text-gray-800 font-semibold transition-colors text-xs sm:text-sm md:text-base flex items-center"
										>
											{showAllRelatedProducts ? "Show Less" : "View All"}{" "}
											<FontAwesomeIcon
												icon={
													showAllRelatedProducts ? faChevronLeft : faArrowRight
												}
												className="ml-1 text-xs sm:text-sm"
											/>
										</button>
									</div>

									{Array.isArray(relatedAds) && relatedAds.length > 0 ? (
										<div
											className={`grid gap-2 sm:gap-3 md:gap-4 h-full ${
												showAllRelatedProducts
													? "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
													: "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
											}`}
										>
											{relatedAds
												.slice(
													0,
													showAllRelatedProducts ? relatedAds.length : 12
												)
												.map((relatedAd) => (
													<AdCard
														key={relatedAd.id}
														ad={relatedAd}
														onClick={handleAdClick}
														size="default"
														className="h-full"
													/>
												))}
										</div>
									) : (
										<div className="text-center py-6 sm:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl lg:rounded-2xl">
											<FontAwesomeIcon
												icon={faBox}
												className="text-gray-400 text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4"
											/>
											<p className="text-gray-500 text-lg sm:text-xl font-medium">
												No related products available.
											</p>
											<p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
												Check back later for more products.
											</p>
										</div>
									)}
								</div>
							</motion.div>
						)}
					</div>
				</div>

				{/* Modals */}
				<Modal centered show={showModal} onHide={handleCloseModal} size="lg">
					<Modal.Header className="border-b border-gray-100 pb-3">
						<div className="flex items-center justify-between w-full">
							<Modal.Title className="text-lg font-semibold text-gray-900">
								<FontAwesomeIcon
									icon={faStar}
									className="mr-2 text-yellow-500"
								/>
								Reviews ({reviews.length})
							</Modal.Title>
							<button
								onClick={handleCloseModal}
								className="text-gray-400 hover:text-gray-600 transition-colors"
							>
								<FontAwesomeIcon icon={faChevronRight} className="text-lg" />
							</button>
						</div>
					</Modal.Header>
					<Modal.Body className="p-0">
						{loadingReviews ? (
							<div className="text-center py-12">
								<FontAwesomeIcon
									icon={faSpinner}
									className="animate-spin text-xl text-gray-400 mb-3"
								/>
								<p className="text-gray-500 text-sm">Loading reviews...</p>
							</div>
						) : reviewsError ? (
							<div className="text-center py-12">
								<FontAwesomeIcon
									icon={faExclamationTriangle}
									className="text-red-400 text-xl mb-3"
								/>
								<p className="text-red-500 text-sm">{reviewsError}</p>
							</div>
						) : reviews.length === 0 ? (
							<div className="text-center py-12">
								<FontAwesomeIcon
									icon={faStar}
									className="text-gray-300 text-xl mb-3"
								/>
								<p className="text-gray-500 text-sm">No reviews yet</p>
								<p className="text-gray-400 text-xs mt-1">
									Be the first to review!
								</p>
							</div>
						) : (
							<div className="max-h-96 overflow-y-auto">
								{reviews.map((review, index) => {
									const fullStars = Math.floor(review.rating);
									const halfStar = review.rating % 1 !== 0;
									const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

									return (
										<div
											key={index}
											className={`p-4 ${
												index !== reviews.length - 1
													? "border-b border-gray-100"
													: ""
											}`}
										>
											<div className="flex items-start space-x-3">
												{/* Avatar */}
												<div className="flex-shrink-0">
													{review.buyer.profile_picture ? (
														<img
															src={review.buyer.profile_picture}
															alt={review.buyer.name}
															className="w-8 h-8 rounded-full object-cover border border-gray-200"
														/>
													) : (
														<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
															<FontAwesomeIcon
																icon={faUser}
																className="text-gray-500 text-xs"
															/>
														</div>
													)}
												</div>

												{/* Review Content Column */}
												<div className="flex-1 min-w-0 space-y-0">
													{/* Name and Rating Row */}
													<div className="flex items-baseline space-x-2">
														<h4 className="font-medium text-gray-900 text-sm truncate">
															{review.buyer.name}
														</h4>
														<div className="flex items-center space-x-1">
															{[...Array(fullStars)].map((_, i) => (
																<FontAwesomeIcon
																	key={i}
																	icon={faStar}
																	className="text-yellow-400 text-xs"
																/>
															))}
															{halfStar && (
																<FontAwesomeIcon
																	icon={faStarHalfAlt}
																	className="text-yellow-400 text-xs"
																/>
															)}
															{[...Array(emptyStars)].map((_, i) => (
																<FontAwesomeIcon
																	key={i}
																	icon={faStarEmpty}
																	className="text-gray-300 text-xs"
																/>
															))}
															<span className="text-xs text-gray-500 ml-1">
																{review.rating.toFixed(1)}
															</span>
														</div>
													</div>

													{/* Review Text */}
													<p className="text-gray-700 text-sm leading-relaxed">
														{review.review}
													</p>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</Modal.Body>
				</Modal>

				{/* Review Modal */}
				<Modal
					centered
					show={showReviewModal}
					onHide={handleCloseReviewModal}
					size="md"
				>
					<Modal.Header className="border-0 pb-0">
						<Modal.Title className="text-xl font-bold text-gray-900">
							<FontAwesomeIcon icon={faEdit} className="mr-2 text-yellow-500" />
							Write a Review
						</Modal.Title>
					</Modal.Header>
					<Modal.Body className="pt-0">
						<div className="space-y-6">
							{/* Rating */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-3">
									Rating:
								</label>
								<div className="flex justify-center space-x-2">
									{[1, 2, 3, 4, 5].map((star) => (
										<FontAwesomeIcon
											key={star}
											icon={star <= rating ? faStar : faStarEmpty}
											className={`text-3xl cursor-pointer transition-colors ${
												star <= rating ? "text-yellow-400" : "text-gray-300"
											} hover:text-yellow-400`}
											onClick={() => handleRatingClick(star)}
										/>
									))}
								</div>
							</div>

							{/* Review Text */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-3">
									Your Review:
								</label>
								<textarea
									className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
									rows="4"
									value={reviewText}
									onChange={(e) => setReviewText(e.target.value)}
									placeholder="Share your thoughts about this product..."
								/>
							</div>

							{submitError && (
								<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
									<FontAwesomeIcon
										icon={faExclamationTriangle}
										className="mr-2"
									/>
									{submitError}
								</div>
							)}
						</div>
					</Modal.Body>
					<Modal.Footer className="border-0 pt-0">
						<div className="flex space-x-3 w-full">
							<button
								className="flex-1 px-6 py-2 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
								onClick={handleCloseReviewModal}
							>
								Cancel
							</button>
							<button
								className="flex-1 px-6 py-2 bg-yellow-500 text-gray-900 rounded-xl font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50"
								onClick={handleSubmitReview}
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<FontAwesomeIcon
											icon={faSpinner}
											className="animate-spin mr-2"
										/>
										Submitting...
									</>
								) : (
									"Submit Review"
								)}
							</button>
						</div>
					</Modal.Footer>
				</Modal>

				{/* Shop Modal */}
				<Modal
					show={showShopModal}
					onHide={() => {
						setShowShopModal(false);
						setSellerAdsPage(1);
						setHasMoreSellerAds(true);
						setSellerAds([]);
						setTotalSellerAdsCount(0);
					}}
					centered
					size="xl"
				>
					<Modal.Header className="border-0 pb-0 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-2xl">
						<div className="flex items-center justify-between w-full">
							<div className="flex items-center space-x-3">
								<div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
									<FontAwesomeIcon
										icon={faBuilding}
										className="text-gray-900 text-xl"
									/>
								</div>
								<div>
									<Modal.Title className="text-xl font-bold text-white mb-1">
										{ad?.seller_enterprise_name || ad?.seller_name || "Seller"}
										's Shop
									</Modal.Title>
									<p className="text-gray-300 text-sm">
										{totalSellerAdsCount} products available
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-2">
								<div className="px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white rounded-full text-xs font-semibold shadow-lg">
									<FontAwesomeIcon icon={faCheck} className="mr-1" />
									Verified
								</div>
								<div className="px-3 py-1 bg-yellow-500/90 backdrop-blur-sm text-gray-900 rounded-full text-xs font-semibold shadow-lg">
									<FontAwesomeIcon icon={faShieldAlt} className="mr-1" />
									{ad?.seller_tier_name || "Free"} Tier
								</div>
							</div>
						</div>
					</Modal.Header>
					<Modal.Body className="pt-0">
						{isLoadingSellerAds ? (
							<div className="text-center py-12">
								<FontAwesomeIcon
									icon={faSpinner}
									className="animate-spin text-3xl text-yellow-500 mb-4"
								/>
								<p className="text-gray-600">Loading shop items...</p>
							</div>
						) : sellerAds.length > 0 ? (
							<div className="space-y-6">
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
									{sellerAds.map((item) => (
										<AdCard
											key={item.id}
											ad={item}
											onClick={handleAdClick}
											size="large"
											className="group"
											showTierBadge={false}
											showRating={false}
											showTitle={true}
											showPrice={false}
										/>
									))}
								</div>

								{/* Load More Button */}
								{hasMoreSellerAds && (
									<div className="text-center pt-4">
										<button
											onClick={handleLoadMoreSellerAds}
											disabled={isLoadingMoreSellerAds}
											className="px-8 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all duration-200 flex items-center justify-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{isLoadingMoreSellerAds ? (
												<>
													<FontAwesomeIcon
														icon={faSpinner}
														className="animate-spin text-lg"
													/>
													<span>Loading...</span>
												</>
											) : (
												<>
													<FontAwesomeIcon
														icon={faArrowDown}
														className="text-lg"
													/>
													<span>Load More Products</span>
												</>
											)}
										</button>
									</div>
								)}

								{/* Products Count */}
								<div className="text-center text-sm text-gray-500 pt-2">
									Showing {sellerAds.length} products
								</div>
							</div>
						) : (
							<div className="text-center py-12">
								<FontAwesomeIcon
									icon={faBox}
									className="text-gray-400 text-4xl mb-4"
								/>
								<p className="text-gray-500 text-lg">
									No products available from this seller.
								</p>
							</div>
						)}
					</Modal.Body>
				</Modal>

				{/* Share Modal */}
				<Modal
					centered
					show={showShareModal}
					onHide={handleCloseShareModal}
					size="sm"
				>
					<Modal.Header className="border-0 pb-0">
						<Modal.Title className="text-xl font-bold text-gray-900">
							<FontAwesomeIcon
								icon={faShareAlt}
								className="mr-2 text-green-500"
							/>
							Share Product
						</Modal.Title>
					</Modal.Header>
					<Modal.Body className="pt-0">
						<div className="space-y-4">
							<p className="text-gray-600 text-sm">
								Share this product with your friends and family
							</p>

							<div className="grid grid-cols-2 gap-3">
								<button
									onClick={shareToFacebook}
									className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									<FontAwesomeIcon icon={faFacebook} className="text-lg" />
									<span className="text-sm font-medium">Facebook</span>
								</button>

								<button
									onClick={shareToTwitter}
									className="flex items-center justify-center space-x-2 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
								>
									<FontAwesomeIcon icon={faTwitter} className="text-lg" />
									<span className="text-sm font-medium">Twitter</span>
								</button>

								<button
									onClick={shareToWhatsApp}
									className="flex items-center justify-center space-x-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
								>
									<FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
									<span className="text-sm font-medium">WhatsApp</span>
								</button>

								<button
									onClick={shareToLinkedIn}
									className="flex items-center justify-center space-x-2 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
								>
									<FontAwesomeIcon icon={faLinkedin} className="text-lg" />
									<span className="text-sm font-medium">LinkedIn</span>
								</button>
							</div>

							<div className="pt-2">
								<button
									onClick={copyToClipboard}
									className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
								>
									<FontAwesomeIcon icon={faShare} className="text-lg" />
									<span className="text-sm font-medium">Copy Link</span>
								</button>
							</div>
						</div>
					</Modal.Body>
					<Modal.Footer className="border-0 pt-0">
						<button
							className="w-full px-6 py-2 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
							onClick={handleCloseShareModal}
						>
							Close
						</button>
					</Modal.Footer>
				</Modal>

				{/* Alert Modal */}
				<AlertModal {...alertModalConfig} />

				{/* Toast Container */}
				<ToastContainer
					position="bottom-end"
					className="p-4"
					style={{ zIndex: 9999 }}
				>
					<Toast
						show={showSellerToast}
						onClose={() => setShowSellerToast(false)}
						delay={3000}
						autohide
						bg="success"
					>
						<Toast.Header closeButton>
							<strong className="me-auto">Success</strong>
						</Toast.Header>
						<Toast.Body className="text-black">
							<FontAwesomeIcon icon={faCheck} className="mr-2 text-green-500" />
							Seller contact revealed successfully!
						</Toast.Body>
					</Toast>
				</ToastContainer>
			</div>
			<Footer />
		</>
	);
};

export default AdDetails;
