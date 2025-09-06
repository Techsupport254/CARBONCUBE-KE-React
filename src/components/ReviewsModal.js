import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar,
	faStarHalfAlt,
	faTimes,
	faReply,
	faUser,
	faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";

// Add CSS for line clamping
const lineClampStyle = {
	display: "-webkit-box",
	WebkitLineClamp: 2,
	WebkitBoxOrient: "vertical",
	overflow: "hidden",
};

const ReviewsModal = ({ show, onHide, shopSlug, shopName }) => {
	const [reviews, setReviews] = useState([]);
	const [statistics, setStatistics] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [error, setError] = useState(null);

	const fetchReviews = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/shop/${shopSlug}/reviews?page=1&per_page=10`,
				{
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch reviews");
			}

			const data = await response.json();
			setReviews(data.reviews);
			setStatistics(data.statistics);
			setHasMore(data.pagination.current_page < data.pagination.total_pages);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	}, [shopSlug]);

	const loadMoreReviews = useCallback(async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/shop/${shopSlug}/reviews?page=${currentPage}&per_page=10`,
				{
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			if (!response.ok) {
				throw new Error("Failed to load more reviews");
			}

			const data = await response.json();
			setReviews((prev) => [...prev, ...data.reviews]);
			setHasMore(data.pagination.current_page < data.pagination.total_pages);
		} catch (err) {
			console.error("Error loading more reviews:", err);
		}
	}, [shopSlug, currentPage]);

	const handleLoadMore = () => {
		setCurrentPage((prev) => prev + 1);
	};

	const handleClose = () => {
		setReviews([]);
		setStatistics(null);
		setCurrentPage(1);
		setHasMore(true);
		setError(null);
		onHide();
	};

	useEffect(() => {
		if (show && shopSlug) {
			fetchReviews();
		}
	}, [show, shopSlug, fetchReviews]);

	useEffect(() => {
		if (show && shopSlug && currentPage > 1) {
			loadMoreReviews();
		}
	}, [currentPage, show, shopSlug, loadMoreReviews]);

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

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<Modal
			show={show}
			onHide={handleClose}
			centered
			size="lg"
			className="reviews-modal"
		>
			<Modal.Header className="border-0 pb-2">
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center space-x-3">
						<div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
							<FontAwesomeIcon
								icon={faStar}
								className="text-gray-900 text-sm"
							/>
						</div>
						<div>
							<Modal.Title className="text-lg font-semibold text-gray-900">
								{shopName} Reviews
							</Modal.Title>
							{statistics && (
								<p className="text-gray-500 text-sm">
									{statistics.total_reviews} reviews •{" "}
									{statistics.average_rating} avg
								</p>
							)}
						</div>
					</div>
					<button
						onClick={handleClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<FontAwesomeIcon icon={faTimes} className="text-lg" />
					</button>
				</div>
			</Modal.Header>

			<Modal.Body className="pt-0 max-h-96 overflow-y-auto">
				{isLoading && reviews.length === 0 ? (
					<div className="flex justify-center items-center py-8">
						<Spinner animation="border" variant="warning" />
					</div>
				) : error ? (
					<div className="text-center py-8">
						<p className="text-red-600 mb-4">{error}</p>
						<Button variant="outline-warning" onClick={fetchReviews}>
							Try Again
						</Button>
					</div>
				) : (
					<div className="space-y-3">
						{/* Compact Statistics */}
						{statistics && statistics.total_reviews > 0 && (
							<div className="bg-gray-50 rounded-lg p-3 mb-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div className="text-2xl font-bold text-gray-900">
											{statistics.average_rating}
										</div>
										<div className="flex">
											{renderStars(statistics.average_rating)}
										</div>
									</div>
									<div className="text-sm text-gray-600">
										{statistics.total_reviews} reviews
									</div>
								</div>
							</div>
						)}

						{/* Reviews List */}
						{reviews.length === 0 ? (
							<div className="text-center py-6">
								<div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
									<FontAwesomeIcon icon={faStar} className="text-gray-400" />
								</div>
								<h3 className="text-base font-medium text-gray-900 mb-1">
									No Reviews Yet
								</h3>
								<p className="text-sm text-gray-500">
									This shop doesn't have any reviews yet.
								</p>
							</div>
						) : (
							<div className="space-y-3">
								{reviews.map((review) => (
									<div
										key={review.id}
										className="border-b border-gray-100 pb-3 last:border-b-0"
									>
										{/* Compact Review Header */}
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center space-x-2">
												<div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
													<FontAwesomeIcon
														icon={faUser}
														className="text-gray-500 text-xs"
													/>
												</div>
												<span className="text-sm font-medium text-gray-900">
													{review.buyer.name}
												</span>
												<div className="flex">{renderStars(review.rating)}</div>
											</div>
											<span className="text-xs text-gray-500">
												{formatDate(review.created_at)}
											</span>
										</div>

										{/* Review Content */}
										<p
											className="text-sm text-gray-700 mb-2"
											style={lineClampStyle}
										>
											{review.review}
										</p>

										{/* Compact Product Info */}
										<div className="flex items-center space-x-1 text-xs text-gray-500">
											<FontAwesomeIcon
												icon={faShoppingBag}
												className="text-xs"
											/>
											<span>{review.ad.title}</span>
											<span className="text-yellow-600 font-medium">
												KSh {review.ad.price?.toLocaleString()}
											</span>
										</div>

										{/* Seller Reply */}
										{review.seller_reply && (
											<div className="mt-2 bg-yellow-50 rounded p-2">
												<div className="flex items-center space-x-1 mb-1">
													<FontAwesomeIcon
														icon={faReply}
														className="text-yellow-600 text-xs"
													/>
													<span className="text-xs font-medium text-yellow-800">
														Seller Response
													</span>
												</div>
												<p
													className="text-xs text-yellow-700"
													style={lineClampStyle}
												>
													{review.seller_reply}
												</p>
											</div>
										)}
									</div>
								))}

								{/* Load More Button */}
								{hasMore && (
									<div className="text-center pt-3">
										<Button
											variant="outline-warning"
											size="sm"
											onClick={handleLoadMore}
											disabled={isLoading}
											className="px-4 py-1"
										>
											{isLoading ? (
												<>
													<Spinner
														animation="border"
														size="sm"
														className="me-2"
													/>
													Loading...
												</>
											) : (
												"Load More"
											)}
										</Button>
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</Modal.Body>
		</Modal>
	);
};

export default ReviewsModal;
