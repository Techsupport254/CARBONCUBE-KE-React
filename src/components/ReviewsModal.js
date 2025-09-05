import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar,
	faStarHalfAlt,
	faTimes,
	faReply,
	faUser,
	faCalendarAlt,
	faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";

const ReviewsModal = ({ show, onHide, shopSlug, shopName }) => {
	const [reviews, setReviews] = useState([]);
	const [statistics, setStatistics] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (show && shopSlug) {
			fetchReviews();
		}
	}, [show, shopSlug]);

	useEffect(() => {
		if (show && shopSlug && currentPage > 1) {
			loadMoreReviews();
		}
	}, [currentPage]);

	const fetchReviews = async () => {
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
	};

	const loadMoreReviews = async () => {
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
	};

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
			size="xl"
			className="reviews-modal"
		>
			<Modal.Header className="border-0 pb-0 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-2xl">
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center space-x-3">
						<div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
							<FontAwesomeIcon
								icon={faStar}
								className="text-gray-900 text-xl"
							/>
						</div>
						<div>
							<Modal.Title className="text-xl font-bold text-white mb-1">
								{shopName} Reviews
							</Modal.Title>
							{statistics && (
								<p className="text-gray-300 text-sm">
									{statistics.total_reviews} reviews •{" "}
									{statistics.average_rating} average rating
								</p>
							)}
						</div>
					</div>
					<button
						onClick={handleClose}
						className="text-gray-300 hover:text-white transition-colors"
					>
						<FontAwesomeIcon icon={faTimes} className="text-xl" />
					</button>
				</div>
			</Modal.Header>

			<Modal.Body className="pt-0">
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
					<div className="space-y-6">
						{/* Statistics Section */}
						{statistics && statistics.total_reviews > 0 && (
							<div className="bg-gray-50 rounded-lg p-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Average Rating */}
									<div className="text-center">
										<div className="text-4xl font-bold text-gray-900 mb-2">
											{statistics.average_rating}
										</div>
										<div className="flex justify-center mb-2">
											{renderStars(statistics.average_rating)}
										</div>
										<p className="text-sm text-gray-600">
											Based on {statistics.total_reviews} reviews
										</p>
									</div>

									{/* Rating Distribution */}
									<div>
										<h4 className="font-semibold text-gray-900 mb-3">
											Rating Distribution
										</h4>
										<div className="space-y-2">
											{statistics.rating_distribution
												.slice()
												.reverse()
												.map((dist) => (
													<div
														key={dist.rating}
														className="flex items-center space-x-2"
													>
														<span className="text-sm font-medium text-gray-700 w-8">
															{dist.rating}
														</span>
														<FontAwesomeIcon
															icon={faStar}
															className="text-yellow-400 text-xs"
														/>
														<div className="flex-1 bg-gray-200 rounded-full h-2">
															<div
																className="bg-yellow-400 h-2 rounded-full"
																style={{ width: `${dist.percentage}%` }}
															></div>
														</div>
														<span className="text-xs text-gray-600 w-12">
															{dist.count}
														</span>
													</div>
												))}
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Reviews List */}
						{reviews.length === 0 ? (
							<div className="text-center py-8">
								<div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
									<FontAwesomeIcon
										icon={faStar}
										className="text-gray-400 text-2xl"
									/>
								</div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									No Reviews Yet
								</h3>
								<p className="text-gray-500">
									This shop doesn't have any reviews yet.
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{reviews.map((review) => (
									<div
										key={review.id}
										className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
									>
										{/* Review Header */}
										<div className="flex items-start justify-between mb-3">
											<div className="flex items-center space-x-3">
												<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
													<FontAwesomeIcon
														icon={faUser}
														className="text-gray-500"
													/>
												</div>
												<div>
													<h4 className="font-medium text-gray-900">
														{review.buyer.name}
													</h4>
													<div className="flex items-center space-x-2">
														<div className="flex">
															{renderStars(review.rating)}
														</div>
														<span className="text-sm text-gray-500">
															{formatDate(review.created_at)}
														</span>
													</div>
												</div>
											</div>
										</div>

										{/* Review Content */}
										<div className="mb-3">
											<p className="text-gray-700 leading-relaxed">
												{review.review}
											</p>
										</div>

										{/* Product Info */}
										<div className="bg-gray-50 rounded-lg p-3 mb-3">
											<div className="flex items-center space-x-2 text-sm text-gray-600">
												<FontAwesomeIcon icon={faShoppingBag} />
												<span className="font-medium">Product:</span>
												<span>{review.ad.title}</span>
												<span className="text-yellow-600 font-semibold">
													KSh {review.ad.price?.toLocaleString()}
												</span>
											</div>
										</div>

										{/* Seller Reply */}
										{review.seller_reply && (
											<div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-3">
												<div className="flex items-center space-x-2 mb-2">
													<FontAwesomeIcon
														icon={faReply}
														className="text-yellow-600"
													/>
													<span className="font-medium text-yellow-800">
														Seller Response
													</span>
												</div>
												<p className="text-yellow-700 leading-relaxed">
													{review.seller_reply}
												</p>
											</div>
										)}
									</div>
								))}

								{/* Load More Button */}
								{hasMore && (
									<div className="text-center pt-4">
										<Button
											variant="outline-warning"
											onClick={handleLoadMore}
											disabled={isLoading}
											className="px-6 py-2"
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
												"Load More Reviews"
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
