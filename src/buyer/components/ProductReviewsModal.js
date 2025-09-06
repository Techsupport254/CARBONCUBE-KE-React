import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar,
	faStarHalfAlt,
	faStar as faStarEmpty,
	faSpinner,
	faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

const ProductReviewsModal = ({
	showModal,
	handleCloseModal,
	loadingReviews,
	reviewsError,
	reviews,
	showReviewModal,
	setShowReviewModal,
	reviewText,
	setReviewText,
	rating,
	setRating,
	isSubmitting,
	submitError,
	handleSubmitReview,
	ad,
}) => {
	const renderStars = (rating) => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 !== 0;

		for (let i = 0; i < fullStars; i++) {
			stars.push(
				<FontAwesomeIcon
					key={i}
					icon={faStar}
					className="text-yellow-400 text-sm"
				/>
			);
		}

		if (hasHalfStar) {
			stars.push(
				<FontAwesomeIcon
					key="half"
					icon={faStarHalfAlt}
					className="text-yellow-400 text-sm"
				/>
			);
		}

		const emptyStars = 5 - Math.ceil(rating);
		for (let i = 0; i < emptyStars; i++) {
			stars.push(
				<FontAwesomeIcon
					key={`empty-${i}`}
					icon={faStarEmpty}
					className="text-gray-300 text-sm"
				/>
			);
		}

		return stars;
	};

	const renderStarInput = () => {
		return (
			<div className="flex space-x-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type="button"
						onClick={() => setRating(star)}
						className="focus:outline-none"
					>
						<FontAwesomeIcon
							icon={faStar}
							className={`text-2xl ${
								star <= rating ? "text-yellow-400" : "text-gray-300"
							} hover:text-yellow-400 transition-colors`}
						/>
					</button>
				))}
			</div>
		);
	};

	return (
		<>
			{/* Review Modal */}
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
							<p className="text-gray-500">
								No reviews yet. Be the first to review!
							</p>
						</div>
					) : (
						<div className="space-y-4 max-h-96 overflow-y-auto">
							{reviews.map((review) => (
								<div
									key={review.id}
									className="border-b border-gray-200 pb-4 last:border-b-0"
								>
									<div className="flex items-start space-x-3">
										<div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
											<span className="text-white font-semibold text-sm">
												{review.buyer_name?.charAt(0) || "U"}
											</span>
										</div>
										<div className="flex-1">
											<div className="flex items-center space-x-2 mb-1">
												<span className="font-semibold text-gray-900">
													{review.buyer_name || "Anonymous"}
												</span>
												<div className="flex items-center space-x-1">
													{renderStars(review.rating)}
												</div>
											</div>
											<p className="text-gray-700 text-sm">{review.comment}</p>
											<p className="text-gray-500 text-xs mt-1">
												{new Date(review.created_at).toLocaleDateString()}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</Modal.Body>
				<Modal.Footer className="border-0 pt-0">
					<Button variant="secondary" onClick={handleCloseModal}>
						Close
					</Button>
					<Button
						variant="primary"
						onClick={() => setShowReviewModal(true)}
						className="bg-yellow-500 hover:bg-yellow-600 border-yellow-500 hover:border-yellow-600"
					>
						Write a Review
					</Button>
				</Modal.Footer>
			</Modal>

			{/* Write Review Modal */}
			<Modal
				centered
				show={showReviewModal}
				onHide={() => setShowReviewModal(false)}
				size="md"
			>
				<Modal.Header className="border-0 pb-0">
					<Modal.Title className="text-xl font-bold text-gray-900">
						Write a Review
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className="pt-0">
					<div className="space-y-4">
						{/* Rating */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Rating *
							</label>
							{renderStarInput()}
						</div>

						{/* Review Text */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Your Review *
							</label>
							<textarea
								value={reviewText}
								onChange={(e) => setReviewText(e.target.value)}
								placeholder="Share your experience with this product..."
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
								rows={4}
								required
							/>
						</div>

						{submitError && (
							<div className="text-red-600 text-sm">{submitError}</div>
						)}
					</div>
				</Modal.Body>
				<Modal.Footer className="border-0 pt-0">
					<Button variant="secondary" onClick={() => setShowReviewModal(false)}>
						Cancel
					</Button>
					<Button
						variant="primary"
						onClick={handleSubmitReview}
						disabled={isSubmitting || !rating || !reviewText.trim()}
						className="bg-yellow-500 hover:bg-yellow-600 border-yellow-500 hover:border-yellow-600"
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
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default ProductReviewsModal;
