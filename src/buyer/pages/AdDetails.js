import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Carousel, Modal, Toast, ToastContainer } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar,
	faStarHalfAlt,
	faStar as faStarEmpty,
	faPhone,
	faHeart,
	faEdit,
	faComments,
	faSpinner,
	faTimes,
	faCheck,
	faExclamationTriangle,
	faUser,
	faBuilding,
	faTag,
	faBox,
	faRuler,
	faWeightHanging,
	faMapMarkerAlt,
	faShieldAlt,
	faEye,
	faArrowLeft,
	faArrowRight,
	faChevronLeft,
	faChevronRight,
	faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import Spinner from "react-spinkit";
import AlertModal from "../../components/AlertModal";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useSEO from "../../hooks/useSEO";
import { generateProductSEO } from "../../utils/seoHelpers";
import { getBorderColor } from "../utils/sellerTierUtils";
import { logClickEvent } from "../../utils/clickEventLogger";

const AdDetails = () => {
	const { adId } = useParams();
	const [ad, setAd] = useState(null);
	const [loading, setLoading] = useState(true);
	const [relatedAds, setRelatedAds] = useState([]);
	const [error, setError] = useState(null);
	const [sidebarOpen, setSidebarOpen] = useState(false); // Manage sidebar state
	const [searchQuery, setSearchQuery] = useState(""); // Manage search query state
	const [wish_listLoading, setBookmarkLoading] = React.useState(false);
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
	const [showSellerToast, setShowSellerToast] = useState(false);
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
	const [isLargeScreen, setIsLargeScreen] = useState(false);
	const [showAllRelatedProducts, setShowAllRelatedProducts] = useState(false);

	const handleViewAllRelatedProducts = () => {
		setShowAllRelatedProducts(!showAllRelatedProducts);
	};

	// Check screen size for related products display
	useEffect(() => {
		const checkScreenSize = () => {
			setIsLargeScreen(window.innerWidth >= 1024);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);

		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	// Generate SEO data based on ad content - only when ad is loaded
	const seoData = ad
		? generateProductSEO(ad)
		: {
				title: "Product Details - Carbon Cube Kenya",
				description: "Loading product details...",
				keywords: "Carbon Cube Kenya, online marketplace, product details",
				url: `${window.location.origin}/ads/${adId}`,
				type: "product",
		  };
	useSEO(seoData);

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
					console.error("Failed to fetch seller ads:", err);
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
		const token = sessionStorage.getItem("token");

		if (!token) {
			// Update the alert modal config with the desired configuration
			setAlertModalConfig({
				isVisible: true,
				message: "You must be Signed In to post a review.",
				title: "Login Required",
				icon: "warning",
				confirmText: "Go to Login", // Set the correct confirm button text
				cancelText: "Cancel",
				showCancel: true,
				onConfirm: () => navigate("/login"),
				onClose: () =>
					setAlertModalConfig((prev) => ({ ...prev, isVisible: false })),
			});
			return;
		}

		// If token exists, show the review modal
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
				console.error("Error fetching ad details:", error);

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
				const url = `${process.env.REACT_APP_BACKEND_URL}/buyer/ads/${adId}/related`;

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
					const text = await response.text().catch(() => "<no body>");
					console.error("Related ads fetch failed", {
						url,
						status: response.status,
						statusText: response.statusText,
						body: text,
					});

					// Handle specific error cases
					if (response.status === 404) {
						console.warn("Ad not found, skipping related ads");
						setRelatedAds([]);
						return;
					}

					throw new Error(
						`Failed to fetch related ads (status ${response.status})`
					);
				}

				const data = await response.json();
				setRelatedAds(data);
			} catch (error) {
				console.error("Error fetching related ads:", error);

				// Handle specific error types
				if (error.name === "AbortError") {
					console.warn("Related ads request timed out");
				} else if (error.message.includes("Failed to fetch")) {
					console.warn("Network error while fetching related ads");
				}

				setRelatedAds([]);
			}
		};

		// Fetch all data
		fetchAdDetails();
		fetchRelatedAds();
	}, [adId]);

	const fetchSellerDetails = async () => {
		try {
			const token = sessionStorage.getItem("token");

			if (!token) {
				throw new Error("You must be logged in to view seller details.");
			}

			// Set a local loading state instead of the global one
			// This prevents a full re-render of the component
			let sellerData;

			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/buyer/ads/${adId}/seller`,
				{
					signal: AbortSignal.timeout(10000),
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!response.ok) {
				const errorText = await response.text();
				console.error("Fetch error:", {
					status: response.status,
					statusText: response.statusText,
					body: errorText,
				});
				throw new Error(
					`HTTP error! status: ${response.status}, message: ${errorText}`
				);
			}

			sellerData = await response.json();
			return sellerData;
		} catch (error) {
			console.error("Detailed error:", {
				message: error.message,
				name: error.name,
				stack: error.stack,
			});

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
		const token = sessionStorage.getItem("token");

		if (!token) {
			setAlertModalConfig({
				isVisible: true,
				message: "You must be signed in to submit a review.",
				title: "Login Required",
				icon: "warning",
				confirmText: "Go to Login", // Ensure this is explicitly set here
				cancelText: "Cancel",
				showCancel: true,
				onConfirm: () => navigate("/login"),
				onClose: () =>
					setAlertModalConfig((prev) => ({ ...prev, isVisible: false })),
			});
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
		const token = sessionStorage.getItem("token");
		if (!token) {
			Swal.fire({
				title: "Login Required",
				text: "You must be signed in to start a chat with the seller.",
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "Go to Login",
				cancelButtonText: "Cancel",
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
			}).then((result) => {
				if (result.isConfirmed) {
					navigate("/login");
				}
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

				suggestedMessages.forEach((msg) => {
					const btn = document.createElement("button");
					btn.textContent = msg;
					btn.className = "swal2-styled";
					btn.style.cssText = `
                margin: 3px; padding: 3px 6px; background-color: #ffc107; color: #1e293b;
                border: 2px solid #ffc107; border-radius: 30px; font-size: 0.85rem; cursor: pointer;
                `;
					btn.onclick = () => {
						textarea.value = msg;
					};
					container.appendChild(btn);
				});
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
		const token = sessionStorage.getItem("token");

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
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/buyer/conversations`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						conversation: {
							seller_id: ad?.seller_id,
							ad_id: ad?.id,
						},
						message: message.trim(), // Ensure no extra whitespace
					}),
				}
			);

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
			console.error("Error sending message:", error);
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
		}

		try {
			// Log the click event first with enhanced tracking (no auth required)
			await logClickEvent(adId, "Reveal-Seller-Details", {
				seller_id: ad?.seller_id,
				ad_title: ad?.title,
				action: "reveal_seller_contact",
			});

			// Check if user is authenticated for fetching seller details
			const token = sessionStorage.getItem("token");
			if (!token) {
				setAlertModalConfig({
					isVisible: true,
					message: "You must be signed in to view seller details.",
					title: "Login Required",
					icon: "warning",
					confirmText: "Go to Login",
					cancelText: "Cancel",
					showCancel: true,
					onConfirm: () => navigate("/login"),
					onClose: () =>
						setAlertModalConfig((prev) => ({ ...prev, isVisible: false })),
				});
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
			console.error("Error revealing seller details:", error);

			// Show a user-friendly error
			setAlertModalConfig({
				isVisible: true,
				message: "Failed to reveal seller contact. Please try again.",
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
			}
		}
	};

	const handleSidebarToggle = () => {
		setSidebarOpen(!sidebarOpen); // Toggle the sidebar open state
	};

	const handleSearch = () => {
		// Implement search functionality here
	};

	const handleAddToWishlist = async () => {
		if (!ad) return;

		try {
			setBookmarkLoading(true);

			// Step 1: Log the 'Add-to-Wishlist' event with enhanced tracking (no auth required)
			await logClickEvent(ad.id, "Add-to-Wish-List", {
				seller_id: ad?.seller_id,
				ad_title: ad?.title,
				action: "add_to_wishlist",
			});

			// Check if user is authenticated for adding to wishlist
			const token = sessionStorage.getItem("token");
			if (!token) {
				setAlertModalConfig({
					isVisible: true,
					message: "You must be signed in to add to your wishlist.",
					title: "Login Required",
					icon: "warning",
					confirmText: "Go to Login",
					cancelText: "Cancel",
					showCancel: true,
					onConfirm: () => navigate("/login"),
					onClose: () =>
						setAlertModalConfig((prev) => ({ ...prev, isVisible: false })),
				});
				return;
			}

			// Step 2: API call to add the ad to the wishlist
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/buyer/wish_lists`,
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
			return <div className="text-gray-400">Invalid rating</div>;
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
							className="text-yellow-400 text-lg"
						/>
					))}
					{halfStar && (
						<FontAwesomeIcon
							icon={faStarHalfAlt}
							className="text-yellow-400 text-lg"
						/>
					)}
					{[...Array(emptyStars)].map((_, index) => (
						<FontAwesomeIcon
							key={`empty-${index}`}
							icon={faStarEmpty}
							className="text-gray-300 text-lg"
						/>
					))}
				</div>
				<span className="text-sm text-gray-500">
					<em>{rating.toFixed(1)}/5</em> <em>({reviewCount} Ratings)</em>
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
			console.error("Failed to load more seller ads:", error);
		} finally {
			setIsLoadingMoreSellerAds(false);
		}
	};

	const handleAdClick = async (adId) => {
		if (!adId) return;

		try {
			setShowShopModal(false); // close modal
			await logClickEvent(adId, "Ad-Click", {
				action: "navigate_to_ad",
				source: "related_ads",
			});
		} catch (error) {
			console.warn("Logging failed, proceeding...");
		}

		navigate(`/ads/${adId}`);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const renderCarousel = () => {
		return (
			<div className="w-full h-full rounded-2xl overflow-hidden relative">
				{/* Default Image Case */}
				{!ad.media_urls || ad.media_urls.length === 0 ? (
					<div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-2xl">
						<div className="text-center">
							<FontAwesomeIcon
								icon={faBox}
								className="text-gray-400 text-6xl mb-4"
							/>
							<p className="text-gray-500 text-lg font-medium">
								No Image Available
							</p>
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
							controls={ad.media_urls.length > 1}
							indicators={false}
							interval={null}
						>
							{ad.media_urls.map((url, index) => (
								<Carousel.Item key={index} className="h-full">
									<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
										<img
											className="w-full h-full object-contain rounded-xl"
											src={url}
											alt={`Product ${index + 1}`}
											onError={(e) => {
												e.target.src =
													"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTgwIDEwNUwxNTAgMTM1TDEyMCAxMDVMMTUwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
											}}
										/>
									</div>
								</Carousel.Item>
							))}
						</Carousel>

						{/* Image Counter */}
						{ad.media_urls.length > 1 && (
							<div className="absolute bottom-16 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm z-30">
								{carouselActiveIndex + 1} / {ad.media_urls.length}
							</div>
						)}

						{/* Thumbnail Navigation */}
						{ad.media_urls && ad.media_urls.length > 1 && (
							<div className="absolute bottom-16 right-4 z-30">
								<div className="flex gap-2">
									{ad.media_urls.map((image, index) => (
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
												src={image}
												alt={`Thumbnail ${index + 1}`}
												className="w-full h-full object-cover"
												onError={(e) => {
													e.target.src =
														"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTgwIDEwNUwxNTAgMTM1TDEyMCAxMDVMMTUwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
												}}
											/>
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
					onSidebarToggle={() => {}}
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
					onSidebarToggle={() => {}}
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
					onSidebarToggle={() => {}}
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
					onSidebarToggle={() => {}}
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
			<Navbar
				mode="buyer"
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				handleSearch={handleSearch}
				onSidebarToggle={handleSidebarToggle}
				showSearch={true}
				showCategories={true}
				showUserMenu={true}
				showCart={true}
				showWishlist={true}
			/>
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
				<div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
					<div className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
						<Sidebar isOpen={sidebarOpen} onToggle={handleSidebarToggle} />
					</div>

					{/* Main Content Area */}
					<div className="flex-1 min-w-0 max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-6 lg:py-8">
						{ad && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className="space-y-2 sm:space-y-6 lg:space-y-8"
							>
								{/* Breadcrumb */}
								<nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-6 overflow-x-auto">
									<button
										onClick={() => navigate("/")}
										className="hover:text-yellow-600 transition-colors whitespace-nowrap"
									>
										<FontAwesomeIcon
											icon={faArrowLeft}
											className="mr-1 sm:mr-2"
										/>
										Home
									</button>
									<FontAwesomeIcon
										icon={faChevronRight}
										className="text-gray-400 flex-shrink-0"
									/>
									<span className="text-gray-700 truncate">
										{ad.category_name}
									</span>
									<FontAwesomeIcon
										icon={faChevronRight}
										className="text-gray-400 flex-shrink-0"
									/>
									<span className="text-gray-700 truncate">
										{ad.subcategory_name}
									</span>
								</nav>

								{/* Product Header */}
								{(() => {
									const borderColor = getBorderColor(ad.seller_tier);
									return (
										<div
											className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden relative"
											style={{ border: `2px solid ${borderColor}` }}
										>
											{/* Tier Badge */}
											<div className="absolute top-3 sm:top-6 right-3 sm:right-6 z-30">
												<div
													className="px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg backdrop-blur-sm"
													style={{ backgroundColor: borderColor }}
												>
													<FontAwesomeIcon
														icon={faShieldAlt}
														className="mr-1 sm:mr-2"
													/>
													{ad.seller_tier_name || "Free"}
												</div>
											</div>

											<div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
												{/* Image Gallery */}
												<div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 lg:p-6 flex items-center justify-center min-h-[280px] sm:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] rounded-lg sm:rounded-xl lg:rounded-2xl">
													{/* Product Status Badge */}
													<div className="absolute top-3 sm:top-6 left-3 sm:left-6 z-20">
														<div
															className={`px-2 sm:px-3 py-1 backdrop-blur-md text-white rounded-full text-xs font-semibold shadow-lg border border-white/20 ${
																ad.quantity > 0
																	? "bg-green-500/90"
																	: "bg-red-500/90"
															}`}
														>
															<FontAwesomeIcon
																icon={ad.quantity > 0 ? faCheck : faTimes}
																className="mr-1"
															/>
															{ad.quantity > 0 ? "In Stock" : "Out of Stock"}
														</div>
													</div>

													{/* Image Container with Enhanced Styling */}
													<div className="relative w-full h-full max-w-2xl z-10">
														{renderCarousel()}
													</div>

													{/* Bottom Info Bar */}
													<div className="absolute bottom-1 sm:bottom-2 left-2 sm:left-6 right-2 sm:right-6 z-20">
														<div className="bg-white/80 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/20 shadow-lg">
															<div className="flex items-center justify-between">
																<div className="flex items-center space-x-2 sm:space-x-4">
																	<div className="flex items-center text-xs text-gray-700">
																		<FontAwesomeIcon
																			icon={faEye}
																			className="mr-1 text-gray-500"
																		/>
																		<span className="hidden sm:inline">
																			{ad.seller_tier_name === "Premium"
																				? "Premium listing"
																				: "Standard listing"}
																		</span>
																		<span className="sm:hidden">
																			{ad.seller_tier_name === "Premium"
																				? "Premium"
																				: "Standard"}
																		</span>
																	</div>
																	<div className="flex items-center text-xs text-gray-700">
																		<FontAwesomeIcon
																			icon={faShieldAlt}
																			className="mr-1 text-gray-500"
																		/>
																		<span className="hidden sm:inline">
																			{ad.seller?.document_verified
																				? "Verified product"
																				: "Unverified product"}
																		</span>
																		<span className="sm:hidden">
																			{ad.seller?.document_verified
																				? "Verified"
																				: "Unverified"}
																		</span>
																	</div>
																</div>
																<div className="text-xs text-gray-600 font-medium">
																	{ad.quantity > 0
																		? `${ad.quantity} units available`
																		: "Out of stock"}
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

												{/* Product Info */}
												<div className="p-3 sm:p-6 lg:p-8 xl:p-10 bg-white">
													<div className="space-y-3 sm:space-y-6 lg:space-y-8">
														{/* Title and Basic Info */}
														<div className="space-y-2 sm:space-y-3 lg:space-y-4 pr-16 sm:pr-20 lg:pr-24">
															<h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-black leading-tight">
																{ad.title}
															</h1>

															{/* Product Meta */}
															<div className="mb-6">
																<table className="w-full">
																	<tbody className="space-y-2">
																		<tr className="border-b border-gray-100">
																			<td className="py-3 px-0 text-sm text-gray-500 font-medium w-1/3">
																				<FontAwesomeIcon
																					icon={faTag}
																					className="mr-2 text-gray-600"
																				/>
																				Brand
																			</td>
																			<td className="py-3 px-0 text-sm font-semibold text-gray-900">
																				{ad.brand}
																			</td>
																		</tr>
																		<tr className="border-b border-gray-100">
																			<td className="py-3 px-0 text-sm text-gray-500 font-medium w-1/3">
																				<FontAwesomeIcon
																					icon={faBuilding}
																					className="mr-2 text-gray-600"
																				/>
																				Manufacturer
																			</td>
																			<td className="py-3 px-0 text-sm font-semibold text-gray-900">
																				{ad.manufacturer}
																			</td>
																		</tr>
																		<tr className="border-b border-gray-100">
																			<td className="py-3 px-0 text-sm text-gray-500 font-medium w-1/3">
																				<FontAwesomeIcon
																					icon={faBox}
																					className="mr-2 text-gray-600"
																				/>
																				Category
																			</td>
																			<td className="py-3 px-0 text-sm font-semibold text-gray-900">
																				{ad.category_name}
																			</td>
																		</tr>
																		<tr>
																			<td className="py-3 px-0 text-sm text-gray-500 font-medium w-1/3">
																				<FontAwesomeIcon
																					icon={faTag}
																					className="mr-2 text-gray-600"
																				/>
																				Subcategory
																			</td>
																			<td className="py-3 px-0 text-sm font-semibold text-gray-900">
																				{ad.subcategory_name}
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>

															{/* Condition Badge */}
															<div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 p-2 sm:p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg sm:rounded-xl lg:rounded-2xl border border-yellow-200">
																<div className="flex items-center space-x-2 sm:space-x-4">
																	<div className="flex items-center space-x-1 sm:space-x-2">
																		<span className="text-lg sm:text-2xl font-bold text-gray-900">
																			KSh{" "}
																			{ad.price
																				? Number(ad.price).toFixed(2)
																				: "N/A"}
																		</span>
																	</div>
																	<div className="flex items-center space-x-1 sm:space-x-2">
																		<span
																			className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${
																				ad.condition === "brand_new"
																					? "bg-green-500 text-white"
																					: ad.condition === "second_hand"
																					? "bg-orange-500 text-white"
																					: ad.condition === "refurbished"
																					? "bg-blue-500 text-white"
																					: "bg-gray-500 text-white"
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
																</div>
																<div className="text-xs sm:text-sm text-gray-600">
																	Listed{" "}
																	{ad.created_at
																		? new Date(
																				ad.created_at
																		  ).toLocaleDateString("en-US", {
																				day: "numeric",
																				month: "long",
																				year: "numeric",
																		  })
																		: "Recently"}
																</div>
															</div>
														</div>

														{/* Rating Section */}
														<div
															onClick={handleShowModal}
															className="group cursor-pointer p-4 bg-white/90 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/95 hover:shadow-xl transition-all duration-300 shadow-lg"
														>
															<div className="flex items-center justify-between mb-2">
																<p className="text-xs font-semibold text-gray-800">
																	<FontAwesomeIcon
																		icon={faStar}
																		className="mr-1 text-yellow-500"
																	/>
																	Rating
																</p>
																<FontAwesomeIcon
																	icon={faChevronRight}
																	className="text-gray-400 text-xs group-hover:text-gray-600 transition-colors"
																/>
															</div>
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

														{/* Seller Section */}
														<div
															className="p-3 sm:p-6 rounded-xl border border-yellow-200 cursor-pointer transition-all duration-200 hover:shadow-lg bg-yellow-50"
															onClick={() => setShowShopModal(true)}
														>
															<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
																<div className="flex items-center space-x-3 sm:space-x-4">
																	<div className="relative">
																		{ad.seller_profile_picture ? (
																			<img
																				src={ad.seller_profile_picture}
																				alt="Seller Profile"
																				className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white shadow-lg"
																			/>
																		) : (
																			<div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-500 flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg">
																				<FontAwesomeIcon icon={faUser} />
																			</div>
																		)}
																		{ad.seller?.document_verified && (
																			<div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-green-500 border-2 border-white">
																				<FontAwesomeIcon icon={faCheck} />
																			</div>
																		)}
																	</div>
																	<div>
																		<h3 className="font-bold text-gray-900 text-base sm:text-lg">
																			{ad.seller_enterprise_name ||
																				ad.seller?.enterprise_name ||
																				ad.seller_name ||
																				"N/A"}
																		</h3>
																		<div className="flex items-center space-x-3 mt-1">
																			<p className="text-gray-600 text-xs sm:text-sm flex items-center">
																				<FontAwesomeIcon
																					icon={faMapMarkerAlt}
																					className="mr-1"
																				/>
																				{ad.seller?.document_verified
																					? "Verified Seller"
																					: "Unverified Seller"}
																			</p>
																			<p className="text-gray-500 text-xs sm:text-sm flex items-center">
																				<FontAwesomeIcon
																					icon={faShieldAlt}
																					className="mr-1"
																				/>
																				{ad.seller_tier_name || "Free"} Tier
																			</p>
																		</div>
																	</div>
																</div>
																<button className="px-4 sm:px-6 py-2 sm:py-3 bg-yellow-500 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-yellow-600 transition-all duration-200 shadow-md flex items-center justify-center space-x-2">
																	<FontAwesomeIcon
																		icon={faEye}
																		className="mr-1"
																	/>
																	<span>View Shop</span>
																</button>
															</div>
														</div>

														{/* Action Buttons */}
														<div className="space-y-3 sm:space-y-6">
															{/* Primary Action - Contact */}
															{showSellerDetails && seller ? (
																<a
																	href={`tel:${seller.phone_number}`}
																	className="block w-full"
																>
																	<button className="w-full py-2.5 sm:py-4 px-3 sm:px-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg sm:rounded-xl lg:rounded-2xl font-bold hover:from-gray-900 hover:to-gray-950 transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl">
																		<FontAwesomeIcon
																			icon={faPhone}
																			className="text-lg sm:text-xl"
																		/>
																		<span className="text-base sm:text-lg">
																			{seller.phone_number}
																		</span>
																	</button>
																</a>
															) : (
																<button
																	className="w-full py-2.5 sm:py-4 px-3 sm:px-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg sm:rounded-xl lg:rounded-2xl font-bold hover:from-gray-900 hover:to-gray-950 transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl"
																	onClick={handleRevealSellerDetails}
																	disabled={loading}
																>
																	{loading ? (
																		<>
																			<FontAwesomeIcon
																				icon={faSpinner}
																				className="animate-spin text-lg sm:text-xl"
																			/>
																			<span className="text-base sm:text-lg">
																				Loading...
																			</span>
																		</>
																	) : (
																		<>
																			<FontAwesomeIcon
																				icon={faPhone}
																				className="text-lg sm:text-xl"
																			/>
																			<span className="text-base sm:text-lg">
																				Reveal Seller Contact
																			</span>
																		</>
																	)}
																</button>
															)}

															{/* Secondary Actions - Horizontal Cards */}
															<div className="grid grid-cols-3 gap-1.5 sm:gap-4">
																<button
																	className="group p-1.5 sm:p-3 bg-white rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 flex flex-col items-center justify-center space-y-1 sm:space-y-2"
																	disabled={!ad || wish_listLoading}
																	onClick={handleAddToWishlist}
																>
																	<div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-red-50 to-red-100 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:from-red-100 group-hover:to-red-200 transition-all duration-300">
																		<FontAwesomeIcon
																			icon={faHeart}
																			className="text-red-500 text-base sm:text-xl group-hover:scale-110 transition-transform duration-300"
																		/>
																	</div>
																	<span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
																		Wishlist
																	</span>
																</button>

																<button
																	className="group p-1.5 sm:p-3 bg-white rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 flex flex-col items-center justify-center space-y-1 sm:space-y-2"
																	onClick={handleShowReviewModal}
																>
																	<div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:from-yellow-100 group-hover:to-yellow-200 transition-all duration-300">
																		<FontAwesomeIcon
																			icon={faEdit}
																			className="text-yellow-600 text-base sm:text-xl group-hover:scale-110 transition-transform duration-300"
																		/>
																	</div>
																	<span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
																		Review
																	</span>
																</button>

																<button
																	className="group p-1.5 sm:p-3 bg-white rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 flex flex-col items-center justify-center space-y-1 sm:space-y-2"
																	onClick={handleOpenChatModal}
																>
																	<div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
																		<FontAwesomeIcon
																			icon={faComments}
																			className="text-blue-600 text-base sm:text-xl group-hover:scale-110 transition-transform duration-300"
																		/>
																	</div>
																	<span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
																		Chat
																	</span>
																</button>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									);
								})()}

								{/* Description & Dimensions */}
								<div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
									{/* Description */}
									<div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl p-3 sm:p-6 lg:p-8 border border-gray-100">
										<div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-6">
											<FontAwesomeIcon
												icon={faEdit}
												className="text-yellow-500 text-lg sm:text-xl"
											/>
											<h2 className="text-xl sm:text-2xl font-bold text-gray-900">
												Description
											</h2>
										</div>
										<div className="prose prose-sm sm:prose-lg max-w-none">
											<p className="text-gray-700 leading-relaxed text-base sm:text-lg">
												{ad.description}
											</p>
										</div>
									</div>

									{/* Dimensions */}
									<div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden border border-gray-100">
										<div className="bg-gray-800 text-white px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
											<div className="flex items-center space-x-2 sm:space-x-3">
												<FontAwesomeIcon
													icon={faRuler}
													className="text-lg sm:text-xl"
												/>
												<h3 className="text-lg sm:text-xl font-bold">
													Dimensions
												</h3>
											</div>
										</div>
										<div className="p-3 sm:p-6 lg:p-8">
											<div className="space-y-3 sm:space-y-6">
												<div className="flex justify-between items-center py-2 sm:py-4 border-b border-gray-100">
													<div className="flex items-center space-x-2 sm:space-x-3">
														<FontAwesomeIcon
															icon={faRuler}
															className="text-gray-600 w-3 sm:w-4"
														/>
														<span className="font-semibold text-gray-700 text-sm sm:text-base">
															Height
														</span>
													</div>
													<span className="text-gray-900 font-medium text-sm sm:text-base">
														{ad.item_height || "Not specified"} cm
													</span>
												</div>
												<div className="flex justify-between items-center py-2 sm:py-4 border-b border-gray-100">
													<div className="flex items-center space-x-2 sm:space-x-3">
														<FontAwesomeIcon
															icon={faRuler}
															className="text-gray-600 w-3 sm:w-4"
														/>
														<span className="font-semibold text-gray-700 text-sm sm:text-base">
															Width
														</span>
													</div>
													<span className="text-gray-900 font-medium text-sm sm:text-base">
														{ad.item_width || "Not specified"} cm
													</span>
												</div>
												<div className="flex justify-between items-center py-2 sm:py-4 border-b border-gray-100">
													<div className="flex items-center space-x-2 sm:space-x-3">
														<FontAwesomeIcon
															icon={faRuler}
															className="text-gray-600 w-3 sm:w-4"
														/>
														<span className="font-semibold text-gray-700 text-sm sm:text-base">
															Length
														</span>
													</div>
													<span className="text-gray-900 font-medium text-sm sm:text-base">
														{ad.item_length || "Not specified"} cm
													</span>
												</div>
												<div className="flex justify-between items-center py-2 sm:py-4">
													<div className="flex items-center space-x-2 sm:space-x-3">
														<FontAwesomeIcon
															icon={faWeightHanging}
															className="text-gray-600 w-3 sm:w-4"
														/>
														<span className="font-semibold text-gray-700 text-sm sm:text-base">
															Weight
														</span>
													</div>
													<span className="text-gray-900 font-medium text-sm sm:text-base">
														{ad.item_weight || "Not specified"}{" "}
														{ad.weight_unit || "g"}
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Related Products */}
								<div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl p-3 sm:p-6 lg:p-8 border border-gray-100">
									<div className="flex items-center justify-between mb-3 sm:mb-6 lg:mb-8">
										<div className="flex items-center space-x-2 sm:space-x-3">
											<FontAwesomeIcon
												icon={faBox}
												className="text-gray-600 text-lg sm:text-xl"
											/>
											<h2 className="text-xl sm:text-2xl font-bold text-gray-900">
												Related Products
											</h2>
										</div>
										<button
											onClick={handleViewAllRelatedProducts}
											className="text-gray-600 hover:text-gray-800 font-semibold transition-colors text-sm sm:text-base flex items-center"
										>
											{showAllRelatedProducts ? "Show Less" : "View All"}{" "}
											<FontAwesomeIcon
												icon={
													showAllRelatedProducts ? faChevronLeft : faArrowRight
												}
												className="ml-1"
											/>
										</button>
									</div>

									{Array.isArray(relatedAds) && relatedAds.length > 0 ? (
										<div
											className={`grid gap-2 sm:gap-3 lg:gap-4 h-full ${
												showAllRelatedProducts
													? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
													: "grid-cols-2 grid-rows-2 lg:grid-cols-5 lg:grid-rows-1"
											}`}
										>
											{relatedAds
												.slice(
													0,
													showAllRelatedProducts
														? relatedAds.length
														: isLargeScreen
														? 5
														: 4
												)
												.map((relatedAd) => {
													const borderColor = getBorderColor(
														relatedAd.seller_tier
													);
													return (
														<div
															key={relatedAd.id}
															className="h-full w-full flex items-stretch relative group"
														>
															<Card
																className="h-full w-full bg-white rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col relative cursor-pointer"
																style={{ border: `2px solid ${borderColor}` }}
																onClick={() => handleAdClick(relatedAd.id)}
															>
																{/* Tier badge - smaller tag-like design */}
																<div
																	className="absolute top-1 left-1 px-1.5 py-0.5 text-xs font-medium text-white rounded-full z-10 shadow-sm"
																	style={{ backgroundColor: borderColor }}
																	role="status"
																	aria-label={`${
																		relatedAd.seller_tier_name || "Free"
																	} tier product`}
																>
																	{relatedAd.seller_tier_name || "Free"}
																</div>
																<div className="flex flex-col h-full">
																	{/* Ad image */}
																	<Card.Img
																		variant="top"
																		loading="lazy"
																		src={
																			relatedAd.first_media_url
																				? relatedAd.first_media_url
																						.replace(/\n/g, "")
																						.trim()
																				: relatedAd.media_urls &&
																				  Array.isArray(relatedAd.media_urls) &&
																				  relatedAd.media_urls.length > 0
																				? relatedAd.media_urls[0]
																						.replace(/\n/g, "")
																						.trim()
																				: relatedAd.media &&
																				  Array.isArray(relatedAd.media) &&
																				  relatedAd.media.length > 0
																				? relatedAd.media[0]
																						.replace(/\n/g, "")
																						.trim()
																				: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTgwIDEwNUwxNTAgMTM1TDEyMCAxMDVMMTUwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+"
																		}
																		alt={relatedAd.title || "Product Image"}
																		className="object-contain w-full h-auto aspect-square rounded-lg transition-opacity duration-300 ease-in-out"
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
																		<h6 className="text-xs font-medium text-gray-800 text-center w-full truncate hover:text-blue-600 transition-colors duration-200">
																			{relatedAd.title}
																		</h6>
																	</div>
																</div>
															</Card>

															{/* Tooltip for full title */}
															<div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 max-w-xs">
																{relatedAd.title}
																{/* Tooltip arrow */}
																<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
															</div>
														</div>
													);
												})}
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
					<Modal.Header className="border-0 pb-0">
						<Modal.Title className="text-xl font-bold text-gray-900">
							<FontAwesomeIcon icon={faStar} className="mr-2 text-yellow-500" />
							Product Reviews
						</Modal.Title>
					</Modal.Header>
					<Modal.Body className="pt-0">
						{loadingReviews ? (
							<div className="text-center py-8">
								<FontAwesomeIcon
									icon={faSpinner}
									className="animate-spin text-2xl text-yellow-500 mb-4"
								/>
								<p className="text-gray-600">Loading reviews...</p>
							</div>
						) : reviewsError ? (
							<div className="text-center py-8">
								<FontAwesomeIcon
									icon={faExclamationTriangle}
									className="text-red-500 text-2xl mb-4"
								/>
								<p className="text-red-600">{reviewsError}</p>
							</div>
						) : reviews.length === 0 ? (
							<div className="text-center py-8">
								<FontAwesomeIcon
									icon={faStar}
									className="text-gray-400 text-2xl mb-4"
								/>
								<p className="text-gray-500 text-lg">
									No reviews available for this product.
								</p>
								<p className="text-gray-400">Be the first to leave a review!</p>
							</div>
						) : (
							<div className="space-y-4 max-h-96 overflow-y-auto">
								{reviews.map((review, index) => {
									const fullStars = Math.floor(review.rating);
									const halfStar = review.rating % 1 !== 0;
									const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

									return (
										<div
											key={index}
											className="bg-gray-50 rounded-xl p-6 border border-gray-200"
										>
											<div className="flex items-center justify-between mb-3">
												<h4 className="font-semibold text-gray-900">
													{review.buyer.name}
												</h4>
												<div className="flex items-center space-x-1">
													{[...Array(fullStars)].map((_, i) => (
														<FontAwesomeIcon
															key={i}
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
													{[...Array(emptyStars)].map((_, i) => (
														<FontAwesomeIcon
															key={i}
															icon={faStarEmpty}
															className="text-gray-300 text-sm"
														/>
													))}
												</div>
											</div>
											<p className="text-gray-700 leading-relaxed">
												{review.review}
											</p>
										</div>
									);
								})}
							</div>
						)}
					</Modal.Body>
					<Modal.Footer className="border-0 pt-0">
						<button
							className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-xl font-semibold hover:bg-yellow-600 transition-colors"
							onClick={handleCloseModal}
						>
							Close
						</button>
					</Modal.Footer>
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
										<div
											key={item.id}
											className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
											onClick={() => handleAdClick(item.id)}
										>
											{/* Product Image Container */}
											<div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 p-2">
												<img
													className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
													src={
														item.media && item.media.length > 0
															? item.media[0]
															: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTgwIDEwNUwxNTAgMTM1TDEyMCAxMDVMMTUwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+"
													}
													alt={item.title || "Seller product image"}
													onError={(e) => {
														e.target.src =
															"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTgwIDEwNUwxNTAgMTM1TDEyMCAxMDVMMTUwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
													}}
												/>

												{/* Price Tag */}
												<div className="absolute top-3 right-3">
													<div>
														<div className="flex items-center space-x-1">
															<span className="text-yellow-400 text-xs font-medium">
																KSh
															</span>
															<span className="text-sm font-bold">
																{item.price
																	? Number(item.price)
																			.toFixed(2)
																			.split(".")
																			.map((part, index) => (
																				<React.Fragment key={index}>
																					{index === 0 ? (
																						<span className="price-integer">
																							{parseInt(
																								part,
																								10
																							).toLocaleString()}
																						</span>
																					) : (
																						<>
																							<span className="text-xs">.</span>
																							<span className="price-decimal">
																								{part}
																							</span>
																						</>
																					)}
																				</React.Fragment>
																			))
																	: "N/A"}
															</span>
														</div>
													</div>
												</div>
											</div>

											{/* Product Info */}
											<div className="p-4 space-y-3">
												{/* Product Title */}
												<h4 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors">
													{item.title}
												</h4>

												{/* Product Meta */}
												<div className="flex items-center justify-between text-xs text-gray-500">
													<span className="flex items-center">
														<FontAwesomeIcon icon={faBox} className="mr-1" />
														{item.category_name}
													</span>
													<span className="flex items-center">
														<FontAwesomeIcon icon={faTag} className="mr-1" />
														{item.brand || "N/A"}
													</span>
												</div>
											</div>
										</div>
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
		</>
	);
};

export default AdDetails;
