import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	Row,
	Col,
	Card,
	Carousel,
	Container,
	Button,
	Modal,
	Toast,
	ToastContainer,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar,
	faStarHalfAlt,
	faStar as faStarEmpty,
} from "@fortawesome/free-solid-svg-icons";
import TopNavbar from "../components/TopNavbar"; // Import your TopNavbar component
import Sidebar from "../components/Sidebar"; // Import your Sidebar component
import { motion } from "framer-motion"; // For animations
import Spinner from "react-spinkit";
import AlertModal from "../../components/AlertModal";
import Swal from "sweetalert2";
import axios from "axios"; // Assuming you're using axios
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../css/AdDetails.css"; // Custom styling for the page
import slugify from "../../utils/slugify"; // Import the slugify utility function
import useSEO from "../../hooks/useSEO";
import { generateProductSEO } from "../../utils/seoHelpers";
import { logClickEvent } from "../../utils/clickEventLogger"; // Import the enhanced click event logger

const AdDetails = () => {
	const { adId } = useParams();
	const [ad, setAd] = useState(null);
	const [loading, setLoading] = useState(true);
	const [relatedAds, setRelatedAds] = useState([]);
	const [error, setError] = useState(null);
	const [sidebarOpen, setSidebarOpen] = useState(false); // Manage sidebar state
	const [searchQuery, setSearchQuery] = useState(""); // Manage search query state
	const [wish_listLoading, setBookmarkLoading] = React.useState(false);
	const [wish_listError, setBookmarkError] = React.useState(null);
	const [showModal, setShowModal] = useState(false);
	const [showAlertModal, setShowAlertModal] = useState(false);
	const [alertModal, setAlertModal] = useState("");
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

	// Generate SEO data based on ad content
	const seoData = generateProductSEO(ad);
	useSEO(seoData);

	useEffect(() => {
		if (ad && ad.seller_id && showShopModal) {
			setIsLoadingSellerAds(true);

			fetch(`${process.env.REACT_APP_BACKEND_URL}/sellers/${ad.seller_id}/ads`)
				.then((res) => res.json())
				.then((data) => {
					setSellerAds(data);
					setIsLoadingSellerAds(false);
				})
				.catch((err) => {
					console.error("Failed to fetch seller ads:", err);
					setIsLoadingSellerAds(false);
				});
		}
	}, [ad, showShopModal]); // ✅ Do NOT destructure ad.seller_id directly here

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
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/buyer/ads/${adId}`
				);
				if (!response.ok) throw new Error("Failed to fetch ad details");
				const data = await response.json();
				setAd(data);
			} catch (error) {
				setError("Error loading ad details.");
			} finally {
				setLoading(false);
			}
		};

		// Fetch Related Ads
		const fetchRelatedAds = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/buyer/ads/${adId}/related`
				);
				if (!response.ok) throw new Error("Failed to fetch related ads");
				const data = await response.json();
				setRelatedAds(data);
			} catch (error) {
				setError("Error fetching related ads.");
			}
		};

		// Fetch all data
		fetchAdDetails();
		fetchRelatedAds();
	}, [adId]);

	const handleCloseAlertModal = () => {
		setShowAlertModal(false); // Close the modal
	};

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
			    // console.log("Sending message:", message); // Debug log

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
			    // console.log("Response:", responseData); // Debug log

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
			console.error("Error sending message:", error); // Debug log
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

		    // console.log("Button clicked, adId:", adId);

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
		// console.log('Search for:', searchw);
	};

	const handleAddToWishlist = async () => {
		if (!ad) return;

		try {
			setBookmarkLoading(true);
			setBookmarkError(null);

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
					icon: "success", // ✅ show the success icon
					title: "Added to Wishlist!",
					message: "The ad has been successfully added to your wishlist.",
					confirmText: "Awesome", // ✅ single confirm button
					showCancel: false, // ❌ no cancel button
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
			setBookmarkError("Failed to add ad to the wishlist. Please try again.");
			setShowAlertModal(true);
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
			return <div className="rating-stars">Invalid rating</div>;
		}

		const fullStars = Math.floor(Math.max(0, Math.min(rating, 5)));
		const halfStar = rating % 1 >= 0.5;
		const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

		return (
			<div className="rating-container">
				<div className="rating-stars">
					{[...Array(fullStars)].map((_, index) => (
						<FontAwesomeIcon
							key={`full-${index}`}
							icon={faStar}
							className="rating-star"
							style={{ color: "#FFC107" }} // Gold
						/>
					))}
					{halfStar && (
						<FontAwesomeIcon
							icon={faStarHalfAlt}
							className="rating-star"
							style={{ color: "#FFC107" }} // Soft Gold
						/>
					)}
					{[...Array(emptyStars)].map((_, index) => (
						<FontAwesomeIcon
							key={`empty-${index}`}
							icon={faStarEmpty}
							className="rating-star"
							style={{ color: "#CCCCCC" }} // Neutral gray
						/>
					))}
				</div>
				<span
					style={{ fontSize: "14px" }}
					className="review-count text-secondary"
				>
					<em>{rating.toFixed(1)}/5</em> <em>({reviewCount} Ratings)</em>
				</span>
			</div>
		);
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
			<div className="rounded p-0 position-relative">
				{/* Default Image Case */}
				{!ad.media_urls || ad.media_urls.length === 0 ? (
					<img
						src="default-image-url"
						alt="default"
						className="ad-image img-fluid"
					/>
				) : (
					<div>
						<div className="position-relative">
							<Carousel
								activeIndex={carouselActiveIndex}
								onSelect={(selectedIndex) =>
									setCarouselActiveIndex(selectedIndex)
								}
								className="custom-carousel"
								controls={ad.media_urls.length > 1}
								indicators={false}
							>
								{ad.media_urls.map((url, index) => (
									<Carousel.Item key={index}>
										<img
											className="ad-image"
											src={url}
											alt={`Slide ${index + 1}`}
										/>
									</Carousel.Item>
								))}
							</Carousel>

							{/* 🔢 Fixed Image number overlay - outside carousel */}
							{ad.media_urls.length > 1 && (
								<div
									className="position-absolute bottom-0 start-0 m-3 px-3 py-1 text-dark animate__animated animate__fadeIn"
									style={{
										fontSize: "0.9rem",
										zIndex: 1050,
										textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
									}}
								>
									{carouselActiveIndex + 1} / {ad.media_urls.length}
								</div>
							)}

							{/* 🖼️ Image Thumbnails Preview - only show if more than 1 image */}
							{ad.media_urls && ad.media_urls.length > 1 && (
								<div
									className="position-absolute bottom-0 end-0 m-3"
									style={{ zIndex: 1050 }}
								>
									<div className="d-flex gap-2">
										{ad.media_urls.map((image, index) => (
											<div
												key={index}
												className={`thumbnail-preview ${
													index === carouselActiveIndex ? "active" : ""
												}`}
												onClick={() => setCarouselActiveIndex(index)}
												style={{
													width: "40px",
													height: "40px",
													cursor: "pointer",
													border:
														index === carouselActiveIndex
															? "2px solid #ffc107"
															: "2px solid rgba(255,255,255,0.5)",
													borderRadius: "8px",
													overflow: "hidden",
													opacity: index === carouselActiveIndex ? 1 : 0.7,
													transition: "all 0.3s ease",
													backgroundColor: "rgba(0,0,0,0.1)",
												}}
												onMouseEnter={(e) => {
													if (index !== carouselActiveIndex) {
														e.target.style.opacity = "0.9";
														e.target.style.transform = "scale(1.05)";
													}
												}}
												onMouseLeave={(e) => {
													if (index !== carouselActiveIndex) {
														e.target.style.opacity = "0.7";
														e.target.style.transform = "scale(1)";
													}
												}}
											>
												<img
													src={image}
													alt={`Thumbnail ${index + 1}`}
													style={{
														width: "100%",
														height: "100%",
														objectFit: "cover",
														pointerEvents: "none",
													}}
												/>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		);
	};

	const getBorderColor = (tierId) => {
		const tierColors = {
			1: "#F0FFF0", // Free (Blue)
			2: "#FF5733", // Basic (Red-Orange)
			3: "#28A745", // Standard (Bright Green)
			4: "#FFC107", // Premium (Gold-like yellow)
		};
		return tierColors[tierId] || "transparent"; // No border color for Free tier
	};

	const tierId = ad?.seller_tier?.id || ad?.seller_tier;
	const borderColor = getBorderColor(tierId);

	const conditionLabels = {
		brand_new: "Brand New",
		second_hand: "Second Hand",
	};

	const conditionColors = {
		brand_new: "#28a745", // Bootstrap success green
		second_hand: "#ffc107", // Bootstrap warning yellow
	};

	if (loading) {
		return (
			<div className="centered-loader">
				<Spinner
					variant="warning"
					name="cube-grid"
					style={{ width: 100, height: 100 }}
				/>
			</div>
		);
	}

	if (error) {
		return <div className="text-center py-5 text-danger">{error}</div>;
	}

	return (
		<>
			{/* Top Navbar */}
			<TopNavbar
				onSidebarToggle={handleSidebarToggle}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				handleSearch={handleSearch}
			/>
			<div className="ads-details-page">
				<Container fluid>
					<Row>
						<Col xs={12} md={2} className="p-0">
							<Sidebar isOpen={sidebarOpen} />
						</Col>
						<Col xs={12} md={10} lg={9} className="p-0 p-lg-1">
							{/* Main Content Area */}
							<div
								className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}
							>
								<div className="ad-details-page container py-3">
									{ad && (
										<>
											<div style={{ position: "relative" }}>
												{/* Tier Label (FLOATING in the corner) */}
												<div
													className="tier-label text-dark"
													style={{
														position: "absolute",
														top: "2px",
														right: "-11px",
														padding: "2px 6px",
														fontSize: "14px",
														fontWeight: "bold",
														backgroundColor: borderColor,
														borderTopLeftRadius: "0px",
														borderTopRightRadius: "4px",
														borderBottomRightRadius: "0px",
														borderBottomLeftRadius: "6px",
														zIndex: 2,
													}}
												>
													{ad.tier_name || "Free"}{" "}
													{/* Show tier name, default to "Free" */}
												</div>

												{/* Top Section */}
												<Row
													className="ad-details shadow-lg rounded-2 p-1 p-md-3 p-xs-2 mb-4 mb-xs-3"
													style={{
														borderColor,
														borderWidth: "2px",
														borderStyle: "solid",
													}}
												>
													{/* Image Carousel */}
													<Col
														xs={12}
														md={7}
														className="d-flex align-items-center justify-content-center text-center mb-3 mb-md-0"
														style={{ minHeight: "100%" }}
													>
														<motion.div
															initial={{ opacity: 0, scale: 0.9 }}
															animate={{ opacity: 1, scale: 1 }}
															transition={{ duration: 0.5 }}
															className="w-100"
														>
															{renderCarousel()}
														</motion.div>
													</Col>

													{/* Ad Info */}
													<Col xs={12} md={4}>
														<h3 className="display-6 text-dark mb-3">
															{ad.title}
														</h3>
														<div className="mb-2">
															<p>
																<strong>Brand:</strong> {ad.brand}
															</p>
															<p>
																<strong>Manufacturer:</strong> {ad.manufacturer}
															</p>
															<p>
																<strong>Category:</strong> {ad.category_name}
															</p>
															<p>
																<strong>Subcategory:</strong>{" "}
																{ad.subcategory_name}
															</p>
															<p>
																<strong>Condition:</strong>{" "}
																<span
																	style={{
																		backgroundColor:
																			conditionColors[ad.condition],
																		color:
																			ad.condition === "second_hand"
																				? "#000"
																				: "#fff",
																		padding: "3px 6px",
																		borderRadius: "8px",
																		fontStyle: "italic",
																		fontSize: "13px",
																	}}
																>
																	{conditionLabels[ad.condition]}
																</span>
															</p>

															{/* Rating */}
															<div
																onClick={handleShowModal}
																className="cursor-pointer mb-3"
															>
																<p className="mb-0">
																	<strong>Product rating:</strong>
																</p>
																<span className="star-rating">
																	{renderRatingStars(
																		ad.mean_rating,
																		ad.review_count
																	)}
																</span>
															</div>

															{/* Modern Seller Section */}
															<div
																className="mt-3 p-2 rounded"
																onClick={() => setShowShopModal(true)}
																role="button"
																style={{
																	cursor: "pointer",
																	borderColor,
																	borderWidth: "2px",
																	backgroundColor: "#e0e0e0",
																	borderStyle: "solid",
																}}
															>
																<div className="d-flex align-items-center">
																	{ad.seller_profile_picture && (
																		<img
																			src={
																				ad.seller_profile_picture ||
																				"/default-avatar.png"
																			}
																			alt="Seller Profile"
																			className="rounded-circle me-3"
																			style={{
																				width: "50px",
																				height: "50px",
																				objectFit: "cover",
																			}}
																		/>
																	)}
																	<div>
																		<h6 className="mb-1 text-dark fw-bold">
																			{ad.seller_enterprise_name || "N/A"}
																		</h6>
																		<Button
																			variant="warning"
																			className="text-dark btn-sm rounded-pill py-0"
																		>
																			View Shop
																		</Button>
																	</div>
																</div>
															</div>
														</div>

														{/* Price */}
														<h4 className="ad-price my-1 px-2">
															<span
																className="text-success"
																style={{ fontSize: "15px" }}
															>
																{" "}
																<em>Kshs: </em>
															</span>
															<strong className="text-danger display-6">
																{ad.price
																	? Number(ad.price)
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
																							<span
																								style={{ fontSize: "16px" }}
																							>
																								.
																							</span>
																							<span className="price-decimal">
																								{part}
																							</span>
																						</>
																					)}
																				</React.Fragment>
																			))
																	: "N/A"}
															</strong>
														</h4>

														{/* Buttons */}
														<Row className="gx-2 mt-2 mt-lg-4">
															<Col xs={12} className="mb-2">
																<motion.div
																	whileHover={{ scale: 1.02 }}
																	whileTap={{ scale: 0.95 }}
																>
																	{showSellerDetails && seller ? (
																		<a
																			href={`tel:${seller.phone_number}`}
																			className="text-decoration-none"
																			style={{ display: "block" }}
																		>
																			<Button
																				type="button"
																				className="w-100 py-2 rounded-pill fancy-button text-dark"
																				disabled={loading}
																			>
																				{seller.phone_number}
																			</Button>
																		</a>
																	) : (
																		<Button
																			type="button"
																			className="w-100 py-2 rounded-pill fancy-button"
																			onClick={handleRevealSellerDetails}
																			disabled={loading}
																		>
																			{loading ? (
																				<>
																					<Spinner
																						animation="border"
																						size="sm"
																						className="me-2"
																					/>
																					Loading...
																				</>
																			) : (
																				"📞 Reveal Seller Contact"
																			)}
																		</Button>
																	)}
																</motion.div>
															</Col>

															<Col xs={12} className="mb-2">
																<motion.div
																	whileHover={{ scale: 1.02 }}
																	whileTap={{ scale: 0.95 }}
																>
																	<Button
																		className="w-100 py-2 rounded-pill fancy-button"
																		disabled={!ad || wish_listLoading}
																		onClick={handleAddToWishlist}
																	>
																		🔖 Add to Wish List
																	</Button>
																</motion.div>
															</Col>

															<Col xs={12} className="mb-2">
																<motion.div
																	whileHover={{ scale: 1.02 }}
																	whileTap={{ scale: 0.95 }}
																>
																	<Button
																		className="w-100 py-2 rounded-pill fancy-button"
																		onClick={handleShowReviewModal}
																	>
																		📝 Leave a Review
																	</Button>
																</motion.div>
															</Col>

															<Col xs={12} className="mb-2">
																<motion.div
																	whileHover={{ scale: 1.02 }}
																	whileTap={{ scale: 0.95 }}
																>
																	<Button
																		className="w-100 py-2 rounded-pill fancy-button"
																		onClick={handleOpenChatModal}
																	>
																		💬 Start Chat with Seller
																	</Button>
																</motion.div>
															</Col>
														</Row>

														{/* Alert/Error */}
														<AlertModal
															isVisible={showAlertModal}
															message={alertModal}
															onClose={handleCloseAlertModal}
															loading={false}
														/>
														{wish_listError && (
															<div className="text-danger text-center mt-3">
																{wish_listError}
															</div>
														)}
													</Col>
												</Row>

												{/* Description & Dimensions */}
												<Row className="ad-details shadow-lg rounded-2 border p-1 p-md-3 p-xs-2 mb-4 mb-xs-3">
													<Col xs={12} md={7}>
														<h4>Description</h4>
														<p className="lead text-secondary">
															{ad.description}
														</p>
													</Col>
													<Col xs={12} md={4} className="mb-2 mb-md-0">
														<Card className="border-0 shadow-sm custom-card p-0">
															<Card.Header className="bg-dark text-white">
																Dimensions
															</Card.Header>
															<Card.Body className="py-2">
																<Row>
																	<Col xs={6}>
																		<p>
																			<strong>Height:</strong> {ad.item_height}{" "}
																			cm
																		</p>
																		<p>
																			<strong>Width:</strong> {ad.item_width} cm
																		</p>
																	</Col>
																	<Col xs={6}>
																		<p>
																			<strong>Length:</strong> {ad.item_length}{" "}
																			cm
																		</p>
																		<p>
																			<strong>Weight:</strong> {ad.item_weight}{" "}
																			{ad.weight_unit}
																		</p>
																	</Col>
																</Row>
															</Card.Body>
														</Card>
													</Col>
												</Row>
											</div>
										</>
									)}

									{/* Related Ads */}
									<h3 className="related-ads-title mb-3">Related Ads</h3>
									<Row className="related-ads">
										{relatedAds.slice(0, 4).map((relatedAd) => {
											const borderColor = getBorderColor(relatedAd.seller_tier);
											return (
												<Col
													key={relatedAd.id}
													xs={6}
													md={3}
													className="mb-2 mb-lg-4 p-1"
												>
													<Card
														onClick={() => handleAdClick(relatedAd.id)}
														style={{ border: `2px solid ${borderColor}` }}
													>
														<div style={{ position: "relative" }}>
															<div
																className="tier-label text-dark"
																style={{
																	position: "absolute",
																	top: "0px",
																	right: "-1px",
																	padding: "2px 6px",
																	fontSize: "12px",
																	backgroundColor: borderColor,
																	borderTopLeftRadius: "0px",
																	borderTopRightRadius: "2px",
																	borderBottomRightRadius: "0px",
																	borderBottomLeftRadius: "4px",
																	zIndex: 20,
																}}
															>
																{relatedAd.tier_name}
															</div>
															<Card.Img
																className="ad-image"
																variant="top"
																src={
																	relatedAd.media_urls[0] || "default-image-url"
																}
																alt={relatedAd.title}
															/>
														</div>

														<Card.Body className="px-2 py-2">
															<Card.Title className="mb-1 ad-title">
																{relatedAd.title}
															</Card.Title>
															<Card.Text>
																<span
																	className="text-success"
																	style={{ fontSize: "15px" }}
																>
																	<em>Kshs: </em>
																</span>
																<strong
																	style={{ fontSize: "20px" }}
																	className="text-danger"
																>
																	{relatedAd.price
																		? Number(relatedAd.price)
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
																								<span
																									style={{ fontSize: "16px" }}
																								>
																									.
																								</span>
																								<span className="price-decimal">
																									{part}
																								</span>
																							</>
																						)}
																					</React.Fragment>
																				))
																		: "N/A"}
																</strong>
															</Card.Text>
														</Card.Body>
													</Card>
												</Col>
											);
										})}
									</Row>
								</div>
							</div>
						</Col>
					</Row>
				</Container>

				<Modal centered show={showModal} onHide={handleCloseModal}>
					<Modal.Header className="justify-content-center p-1 p-lg-2">
						<Modal.Title>Ad Ratings</Modal.Title>
					</Modal.Header>
					<Modal.Body className="px-1 px-lg-2 py-0">
						{loadingReviews ? (
							<div className="text-center">
								<Spinner animation="border" />
								<p>Loading reviews...</p>
							</div>
						) : reviewsError ? (
							<div className="text-danger">{reviewsError}</div>
						) : reviews.length === 0 ? (
							<p>No reviews available for this ad.</p>
						) : (
							<div>
								{reviews.map((review, index) => {
									// Determine full stars, half stars, and empty stars based on the review rating
									const fullStars = Math.floor(review.rating);
									const halfStar = review.rating % 1 !== 0;
									const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

									return (
										<Card key={index} className="my-2 my-lg-3 custom-card">
											<Card.Body className="py-2">
												<Card.Title>{review.buyer.name}</Card.Title>
												<Card.Text>{review.review}</Card.Text>
												<div className="rating-stars d-flex align-items-center">
													{[...Array(fullStars)].map((_, i) => (
														<FontAwesomeIcon
															key={i}
															icon={faStar}
															className="rating-star filled"
														/>
													))}
													{halfStar && (
														<FontAwesomeIcon
															icon={faStarHalfAlt}
															className="rating-star half-filled"
														/>
													)}
													{[...Array(emptyStars)].map((_, i) => (
														<FontAwesomeIcon
															key={i}
															icon={faStarEmpty}
															className="rating-star empty text-white"
														/>
													))}
												</div>
											</Card.Body>
										</Card>
									);
								})}
							</div>
						)}
					</Modal.Body>
					<Modal.Footer className="p-0 p-lg-1">
						<Button variant="danger" onClick={handleCloseModal}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>

				<Modal
					centered
					show={showReviewModal}
					onHide={handleCloseReviewModal}
					className="sweetalert-modal"
				>
					<div className="sweetalert-container glass-bg rounded-4 px-3 py-2 text-center">
						<div className="sweetalert-icon bg-warning text-white mb-3">
							<FontAwesomeIcon icon={faStar} className="fa-lg" />
						</div>

						<h4 className="text-white fw-semibold mb-3">Write a Review</h4>

						<div className="mb-3 text-light">
							<label className="form-label d-block">Rating:</label>
							<div className="d-flex justify-content-center">
								{[1, 2, 3, 4, 5].map((star) => (
									<FontAwesomeIcon
										key={star}
										icon={star <= rating ? faStar : faStarEmpty}
										className={`rating-star mx-1 ${
											star <= rating ? "filled" : "empty"
										}`}
										style={{ fontSize: "30px", cursor: "pointer" }}
										onClick={() => handleRatingClick(star)}
									/>
								))}
							</div>
						</div>

						<div className="mb-3">
							<label className="form-label text-light text-start">
								Your Review:
							</label>
							<textarea
								className="form-control sweetalert-textarea"
								rows="4"
								value={reviewText}
								onChange={(e) => setReviewText(e.target.value)}
								placeholder="Share your thoughts..."
							/>
						</div>

						{submitError && (
							<div className="alert alert-danger py-2">{submitError}</div>
						)}

						<div className="d-flex justify-content-center gap-3 mt-4">
							<Button
								variant="danger"
								className="sweetalert-cancel-btn"
								onClick={handleCloseReviewModal}
							>
								Cancel
							</Button>
							<Button
								variant="warning"
								className="sweetalert-confirm-btn"
								onClick={handleSubmitReview}
								disabled={isSubmitting}
							>
								{isSubmitting ? "Submitting..." : "Submit"}
							</Button>
						</div>
					</div>
				</Modal>

				<Modal
					show={showShopModal}
					onHide={() => setShowShopModal(false)}
					centered
					size="xl"
					className="glass-modal"
				>
					<Modal.Header className="justify-content-center">
						<Modal.Title>{ad.seller_enterprise_name}'s Shop</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{isLoadingSellerAds ? (
							<div className="text-center py-4">
								<div
									className="spinner-border text-primary"
									role="status"
								></div>
							</div>
						) : sellerAds.length > 0 ? (
							<Row>
								{sellerAds.map((item) => (
									<Col
										xs={6}
										md={6}
										lg={3}
										key={item.id}
										className="mb-3 px-2 px-md-2"
									>
										<Card className="h-100">
											<Card.Img
												variant="top"
												className="ad-image"
												style={{ cursor: "pointer" }}
												onClick={() => handleAdClick(item.id)}
												src={
													item.media && item.media.length > 0
														? item.media[0]
														: "default-image-url"
												}
											/>

											<Card.Body className="px-2 py-2 bookmark-body d-flex flex-column justify-content-center">
												<div className="d-flex justify-content-between align-items-center h-100 w-100">
													{/* Title + Price */}
													<div className="flex-grow-1" style={{ minWidth: 0 }}>
														<Card.Title
															className="mb-1 ad-title text-truncate"
															style={{
																whiteSpace: "nowrap",
																overflow: "hidden",
																textOverflow: "ellipsis",
															}}
														>
															{item.title}
														</Card.Title>

														<Card.Text className="mb-0">
															<span
																className="text-success"
																style={{ fontSize: "15px" }}
															>
																Kshs:{" "}
															</span>
															<strong
																style={{ fontSize: "20px" }}
																className="text-danger"
															>
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
																							<span
																								style={{ fontSize: "16px" }}
																							>
																								.
																							</span>
																							<span className="price-decimal">
																								{part}
																							</span>
																						</>
																					)}
																				</React.Fragment>
																			))
																	: "N/A"}
															</strong>
														</Card.Text>
													</div>
												</div>
											</Card.Body>
										</Card>
									</Col>
								))}
							</Row>
						) : (
							<p className="text-muted">No ads available from this seller.</p>
						)}
					</Modal.Body>
				</Modal>

				<AlertModal {...alertModalConfig} />

				<ToastContainer
					position="bottom-end"
					className="p-3"
					style={{ zIndex: 9999 }}
				>
					<Toast
						show={showSellerToast}
						onClose={() => setShowSellerToast(false)}
						delay={3000}
						autohide
						bg="warning"
					>
						<Toast.Header closeButton>
							<strong className="me-auto">Success</strong>
						</Toast.Header>
						<Toast.Body className="text-black">
							Seller contact revealed successfully!
						</Toast.Body>
					</Toast>
				</ToastContainer>
			</div>
		</>
	);
};

export default AdDetails;
