import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar,
	faStarHalfAlt,
	faStar as faStarEmpty,
	faEdit,
	faTrashCan,
	faRotateLeft,
	faArrowLeft,
	faCalendarAlt,
	faBox,
	faRuler,
	faWeightHanging,
	faComments,
	faCheck,
	faExclamationTriangle,
	faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import Navbar from "../../components/Navbar";
import Spinner from "react-spinkit";
import Swal from "sweetalert2";
import { Toast, ToastContainer } from "react-bootstrap";
import { Image, Card, Typography, Row, Col, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const SellerAdDetails = () => {
	const { adId } = useParams();
	const navigate = useNavigate();
	const [ad, setAd] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [reviews, setReviews] = useState([]);
	const [loadingReviews, setLoadingReviews] = useState(false);
	const [buyerDetails, setBuyerDetails] = useState(null);
	const [loadingBuyerDetails, setLoadingBuyerDetails] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState("success");
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const [previewTitle, setPreviewTitle] = useState("");

	useEffect(() => {
		const fetchAdDetails = async () => {
			try {
				const token = sessionStorage.getItem("token");

				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/seller/ads/${adId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch ad details");
				}

				const data = await response.json();
				setAd(data);
			} catch (error) {
				console.error("Error fetching ad details:", error);
				setError("Failed to load ad details");
			} finally {
				setLoading(false);
			}
		};

		fetchAdDetails();
	}, [adId]);

	useEffect(() => {
		if (ad) {
			// Debug: Log the ad data to see what we're working with
			console.log("Ad data:", ad);
			console.log("Ad media:", ad.media);

			// Reviews and buyer details are now included in the main ad response
			if (ad.reviews) {
				setReviews(ad.reviews);
			}
			if (ad.buyer_details) {
				setBuyerDetails(ad.buyer_details);
			}
			setLoadingReviews(false);
			setLoadingBuyerDetails(false);
		}
	}, [ad]);

	const renderRatingStars = (rating) => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			if (i <= Math.floor(rating)) {
				stars.push(
					<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />
				);
			} else if (i === Math.ceil(rating) && rating % 1 !== 0) {
				stars.push(
					<FontAwesomeIcon
						key={i}
						icon={faStarHalfAlt}
						className="text-yellow-400"
					/>
				);
			} else {
				stars.push(
					<FontAwesomeIcon
						key={i}
						icon={faStarEmpty}
						className="text-gray-300"
					/>
				);
			}
		}
		return stars;
	};

	const getBuyerDetailsForReview = (review) => {
		if (!buyerDetails?.reviewers) {
			return null;
		}

		const buyerInfo = buyerDetails.reviewers.find(
			(r) => r.review_id === review.id
		);
		return buyerInfo;
	};

	const formatDateWithTime = (dateString) => {
		if (!dateString) return "N/A";

		const date = new Date(dateString);
		if (isNaN(date.getTime())) return "Invalid Date";

		const day = date.getDate();
		const month = date.toLocaleDateString("en-US", { month: "long" });
		const year = date.getFullYear();
		const time = date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});

		// Add ordinal suffix to day
		const getOrdinalSuffix = (day) => {
			if (day >= 11 && day <= 13) return "th";
			switch (day % 10) {
				case 1:
					return "st";
				case 2:
					return "nd";
				case 3:
					return "rd";
				default:
					return "th";
			}
		};

		return `${day}${getOrdinalSuffix(day)} ${month}, ${year} at ${time}`;
	};

	const handleEditAd = () => {
		if (!ad) return;

		// Navigate to separate edit page
		navigate(`/seller/ads/${adId}/edit`);
	};

	const showToastNotification = (message, type = "success") => {
		setToastMessage(message);
		setToastType(type);
		setShowToast(true);
	};

	const handlePreview = (imageUrl, title) => {
		setPreviewImage(imageUrl);
		setPreviewVisible(true);
		setPreviewTitle(title);
	};

	const handleCancelPreview = () => {
		setPreviewVisible(false);
		setPreviewImage("");
		setPreviewTitle("");
	};

	const handleDeleteAd = async () => {
		const result = await Swal.fire({
			title: "Delete Ad",
			text: "Are you sure you want to delete this ad? This action cannot be undone.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#dc3545",
			cancelButtonColor: "#6c757d",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "Cancel",
		});

		if (!result.isConfirmed) {
			return;
		}

		try {
			const token = sessionStorage.getItem("token");
			if (!token) {
				showToastNotification("No authentication token found", "error");
				return;
			}

			const response = await fetch(`http://localhost:3001/seller/ads/${adId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				showToastNotification("Ad deleted successfully!", "success");
				// Redirect to ads list after a short delay
				setTimeout(() => {
					navigate("/seller/ads");
				}, 1500);
			} else {
				const errorData = await response.json();
				console.error("Error deleting ad:", errorData);
				showToastNotification(
					"Failed to delete ad. Please try again.",
					"error"
				);
			}
		} catch (error) {
			console.error("Error deleting ad:", error);
			showToastNotification(
				"An error occurred while deleting the ad. Please try again.",
				"error"
			);
		}
	};

	const handleRestoreAd = async () => {
		const result = await Swal.fire({
			title: "Restore Ad",
			text: "Are you sure you want to restore this ad?",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#28a745",
			cancelButtonColor: "#6c757d",
			confirmButtonText: "Yes, restore it!",
			cancelButtonText: "Cancel",
		});

		if (!result.isConfirmed) {
			return;
		}

		try {
			const token = sessionStorage.getItem("token");
			if (!token) {
				showToastNotification("No authentication token found", "error");
				return;
			}

			const response = await fetch(
				`http://localhost:3001/seller/ads/${adId}/restore`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.ok) {
				showToastNotification("Ad restored successfully!", "success");
				// Refresh the page to show updated status
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			} else {
				const errorData = await response.json();
				console.error("Error restoring ad:", errorData);
				showToastNotification(
					"Failed to restore ad. Please try again.",
					"error"
				);
			}
		} catch (error) {
			console.error("Error restoring ad:", error);
			showToastNotification(
				"An error occurred while restoring the ad. Please try again.",
				"error"
			);
		}
	};

	const formatPrice = (price) => {
		if (!price) return "N/A";
		const formattedPrice = parseFloat(price).toFixed(2);
		const [integerPart, decimalPart] = formattedPrice.split(".");
		return (
			<>
				{integerPart}
				{decimalPart !== "00" && (
					<>
						.<span className="text-gray-500">{decimalPart}</span>
					</>
				)}
			</>
		);
	};

	const getConditionBadge = (condition) => {
		if (condition === "brand_new") {
			return (
				<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
					Brand New
				</span>
			);
		} else if (condition === "second_hand") {
			return (
				<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
					Second Hand
				</span>
			);
		}
		return (
			<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
				Not Specified
			</span>
		);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<Spinner name="circle" color="#3B82F6" />
			</div>
		);
	}

	if (error || !ad) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-xl mb-4">
						<FontAwesomeIcon icon={faBox} className="text-4xl" />
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Ad Not Found
					</h2>
					<p className="text-gray-600 mb-4">
						{error || "This ad could not be found."}
					</p>
					<button
						onClick={() => navigate("/seller/ads")}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Back to Ads
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar mode="seller" showSearch={false} showCategories={false} />
			<div className="flex">
				<Sidebar />
				<div className="flex-1 p-2 sm:p-6 max-w-7xl mx-auto w-full">
					{/* Header */}
					<div className="mb-4 sm:mb-6">
						<button
							onClick={() => navigate("/seller/ads")}
							className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
						>
							<FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
							Back to Ads
						</button>
						<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
							<div className="flex-1 min-w-0">
								<h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words">
									{ad.title}
								</h1>
								<p className="text-gray-600 mt-1 text-sm sm:text-base">
									Ad ID: {ad.id}
								</p>
							</div>
							<div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
								<button
									onClick={handleEditAd}
									className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base min-w-[100px] whitespace-nowrap"
								>
									<FontAwesomeIcon icon={faEdit} />
									Edit Ad
								</button>
								{ad.deleted ? (
									<button
										onClick={handleRestoreAd}
										className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base min-w-[100px] whitespace-nowrap"
									>
										<FontAwesomeIcon icon={faRotateLeft} />
										Restore
									</button>
								) : (
									<button
										onClick={handleDeleteAd}
										className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base min-w-[100px] whitespace-nowrap"
									>
										<FontAwesomeIcon icon={faTrashCan} />
										Delete
									</button>
								)}
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
						{/* Main Content */}
						<div className="lg:col-span-3 space-y-4 sm:space-y-6">
							{/* Images */}
							<Card title="Images" className="mb-6">
								{ad.media && ad.media.length > 0 ? (
									<Row gutter={[16, 16]}>
										{ad.media.map((image, index) => (
											<Col key={index} xs={24} sm={12} lg={8}>
												<Card
													hoverable
													cover={
														<Image
															src={image}
															alt={`${ad.title} - ${index + 1}`}
															height={200}
															style={{ objectFit: "cover" }}
															preview={{
																src: image,
																onVisibleChange: (visible) => {
																	if (visible) {
																		handlePreview(
																			image,
																			`${ad.title} - ${index + 1}`
																		);
																	}
																},
															}}
														/>
													}
												>
													<div className="text-center text-xs text-gray-500">
														Image {index + 1}
													</div>
												</Card>
											</Col>
										))}
									</Row>
								) : (
									<div className="text-center py-8 text-gray-500">
										<PlusOutlined
											style={{ fontSize: "48px", marginBottom: "16px" }}
										/>
										<Typography.Text type="secondary">
											No images available
										</Typography.Text>
									</div>
								)}
							</Card>

							{/* Ant Design Image Preview Modal */}
							<Modal
								open={previewVisible}
								title={previewTitle}
								footer={null}
								onCancel={handleCancelPreview}
								width="80%"
								style={{ top: 20 }}
								closeIcon={
									<FontAwesomeIcon
										icon={faTimes}
										style={{ fontSize: "20px", color: "#666" }}
									/>
								}
								className="image-preview-modal"
							>
								<Image
									src={previewImage}
									style={{ width: "100%" }}
									preview={false}
								/>
							</Modal>

							{/* Description */}
							<div className="bg-white rounded-lg shadow-sm p-2 sm:p-6">
								<h2 className="text-lg font-semibold text-gray-900 mb-4">
									Description
								</h2>
								<p className="text-gray-700 whitespace-pre-wrap">
									{ad.description}
								</p>
							</div>

							{/* Reviews */}
							<div className="bg-white rounded-lg shadow-sm p-2 sm:p-6">
								{/* Header */}
								<div className="border-b border-gray-100">
									<div className="flex items-center justify-between">
										<h2 className="text-lg font-semibold text-gray-900">
											Reviews
										</h2>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<div className="flex">
												{renderRatingStars(
													ad.average_rating || ad.mean_rating || 0
												)}
											</div>
											<span className="font-medium">
												{(ad.average_rating || ad.mean_rating || 0).toFixed(1)}
											</span>
											<span className="text-gray-400">•</span>
											<span>
												{reviews.length} review{reviews.length !== 1 ? "s" : ""}
											</span>
											{buyerDetails && (
												<>
													<span className="text-gray-400">•</span>
													<span>
														{buyerDetails.unique_reviewers} reviewer
														{buyerDetails.unique_reviewers !== 1 ? "s" : ""}
													</span>
												</>
											)}
										</div>
									</div>
								</div>

								{loadingReviews || loadingBuyerDetails ? (
									<div className="text-center py-8">
										<Spinner name="circle" color="#3B82F6" />
										<p className="text-gray-600 mt-2">
											Loading reviews and buyer details...
										</p>
									</div>
								) : reviews.length > 0 ? (
									<div className="space-y-4">
										{reviews.map((review, index) => {
											const buyerInfo = getBuyerDetailsForReview(review);
											return (
												<div
													key={index}
													className="border-b border-gray-50 last:border-b-0"
												>
													<div className="flex items-start gap-3">
														{/* Avatar */}
														<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
															<span className="text-xs font-medium text-gray-600">
																{(
																	buyerInfo?.full_name ||
																	review.buyer_name ||
																	"A"
																)
																	.charAt(0)
																	.toUpperCase()}
															</span>
														</div>

														{/* Content */}
														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-2 mb-2">
																<span className="font-medium text-gray-900 text-sm">
																	{buyerInfo?.full_name ||
																		review.buyer_name ||
																		"Anonymous"}
																</span>
																<div className="flex">
																	{renderRatingStars(review.rating)}
																</div>
																<span className="text-xs text-gray-500">
																	{review.created_at &&
																	!isNaN(new Date(review.created_at).getTime())
																		? new Date(
																				review.created_at
																		  ).toLocaleDateString("en-US", {
																				month: "short",
																				day: "numeric",
																				year: "numeric",
																		  })
																		: "Recently"}
																</span>
															</div>

															{/* Enhanced buyer info */}
															{buyerInfo && (
																<div className="mb-2 flex flex-wrap gap-2 text-xs text-gray-500">
																	{buyerInfo.city && buyerInfo.county && (
																		<span className="bg-gray-100 px-2 py-1 rounded">
																			{buyerInfo.city}, {buyerInfo.county}
																		</span>
																	)}
																	{buyerInfo.age_group && (
																		<span className="bg-gray-100 px-2 py-1 rounded">
																			{buyerInfo.age_group}
																		</span>
																	)}
																	{buyerInfo.gender && (
																		<span className="bg-gray-100 px-2 py-1 rounded">
																			{buyerInfo.gender}
																		</span>
																	)}
																	{buyerInfo.is_deleted && (
																		<span className="bg-red-100 text-red-600 px-2 py-1 rounded">
																			Account Deleted
																		</span>
																	)}
																</div>
															)}

															<p className="text-gray-700 text-sm leading-relaxed m-0">
																{review.review}
															</p>
															{review.helpful_count > 0 && (
																<div className="mt-2 text-xs text-gray-500">
																	{review.helpful_count} found helpful
																</div>
															)}
														</div>
													</div>
												</div>
											);
										})}
									</div>
								) : (
									<div className="text-center py-8">
										<div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
											<FontAwesomeIcon
												icon={faComments}
												className="text-lg text-gray-400"
											/>
										</div>
										<p className="text-gray-500 text-sm">No reviews yet</p>
									</div>
								)}
							</div>
						</div>

						{/* Sidebar */}
						<div className="lg:col-span-2 space-y-4 sm:space-y-6">
							{/* Price & Status */}
							<div className="bg-white rounded-lg shadow-sm p-2 sm:p-6">
								<h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
									Price & Status
								</h2>
								<div className="space-y-2 sm:space-y-3">
									<div className="flex justify-between items-center">
										<span className="text-gray-600 text-sm sm:text-base">
											Price:
										</span>
										<span className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
											Kshs {formatPrice(ad.price)}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600">Quantity:</span>
										<span className="font-semibold">{ad.quantity || 0}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600">Sold:</span>
										<span className="font-semibold">
											{ad.quantity_sold || 0}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600">Status:</span>
										{ad.deleted ? (
											<span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
												Deleted
											</span>
										) : ad.sold_out ? (
											<span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
												Sold Out
											</span>
										) : (
											<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
												Active
											</span>
										)}
									</div>
								</div>
							</div>

							{/* Product Details */}
							<div className="bg-white rounded-lg shadow-sm p-2 sm:p-6">
								<h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
									Product Details
								</h2>
								<div className="space-y-2 sm:space-y-3">
									<div className="flex justify-between items-center">
										<span className="text-gray-600">Category:</span>
										<span className="font-semibold">
											{ad.category?.name || "N/A"}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600">Subcategory:</span>
										<span className="font-semibold">
											{ad.subcategory?.name || "N/A"}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600">Brand:</span>
										<span className="font-semibold">{ad.brand || "N/A"}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600">Manufacturer:</span>
										<span className="font-semibold">
											{ad.manufacturer || "N/A"}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600">Condition:</span>
										{getConditionBadge(ad.condition)}
									</div>
								</div>
							</div>

							{/* Dimensions */}
							{(ad.item_length ||
								ad.item_width ||
								ad.item_height ||
								ad.item_weight) && (
								<div className="bg-white rounded-lg shadow-sm p-2 sm:p-6">
									<h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
										Dimensions
									</h2>
									<div className="space-y-2 sm:space-y-3">
										<div className="flex justify-between items-center">
											<span className="text-gray-600 flex items-center gap-2">
												<FontAwesomeIcon icon={faRuler} />
												Length:
											</span>
											<span className="font-semibold">
												{ad.item_length ? `${ad.item_length} cm` : "N/A"}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-gray-600 flex items-center gap-2">
												<FontAwesomeIcon icon={faRuler} />
												Width:
											</span>
											<span className="font-semibold">
												{ad.item_width ? `${ad.item_width} cm` : "N/A"}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-gray-600 flex items-center gap-2">
												<FontAwesomeIcon icon={faRuler} />
												Height:
											</span>
											<span className="font-semibold">
												{ad.item_height ? `${ad.item_height} cm` : "N/A"}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-gray-600 flex items-center gap-2">
												<FontAwesomeIcon icon={faWeightHanging} />
												Weight:
											</span>
											<span className="font-semibold">
												{ad.item_weight
													? `${ad.item_weight} ${ad.weight_unit || "kg"}`
													: "N/A"}
											</span>
										</div>
									</div>
								</div>
							)}

							{/* Created Date */}
							<div className="bg-white rounded-lg shadow-sm p-2 sm:p-6">
								<h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
									Timeline
								</h2>
								<div className="space-y-2 sm:space-y-3">
									<div className="flex justify-between items-center">
										<span className="text-gray-600 flex items-center gap-2">
											<FontAwesomeIcon icon={faCalendarAlt} />
											Created:
										</span>
										<span className="font-semibold text-sm">
											{formatDateWithTime(ad.created_at)}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 flex items-center gap-2">
											<FontAwesomeIcon icon={faCalendarAlt} />
											Updated:
										</span>
										<span className="font-semibold text-sm">
											{formatDateWithTime(ad.updated_at)}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Toast Container */}
			<ToastContainer
				position="bottom-end"
				className="p-4"
				style={{ zIndex: 9999 }}
			>
				<Toast
					show={showToast}
					onClose={() => setShowToast(false)}
					delay={4000}
					autohide
					bg={toastType === "success" ? "success" : "danger"}
				>
					<Toast.Header closeButton>
						<strong className="me-auto">
							{toastType === "success" ? "Success" : "Error"}
						</strong>
					</Toast.Header>
					<Toast.Body className="text-white">
						<FontAwesomeIcon
							icon={toastType === "success" ? faCheck : faExclamationTriangle}
							className="mr-2"
						/>
						{toastMessage}
					</Toast.Body>
				</Toast>
			</ToastContainer>
		</div>
	);
};

export default SellerAdDetails;
