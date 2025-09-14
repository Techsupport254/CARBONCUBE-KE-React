import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar,
	faStarHalfAlt,
	faTimes,
	faShoppingBag,
	faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { getFallbackImage } from "../utils/imageUtils";

const LeaveReviewModal = ({ show, onHide, shopName, products }) => {
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// Check authentication when modal opens
	useEffect(() => {
		if (show) {
			const token = localStorage.getItem("token");

			if (token) {
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
			}
		}
	}, [show]);

	const handleProductSelect = (product) => {
		setSelectedProduct(product);
	};

	const handleReviewProduct = () => {
		if (selectedProduct) {
			// Navigate to the product page where they can leave a review
			window.location.href = `/ads/${selectedProduct.id}`;
		}
	};

	const handleClose = () => {
		setSelectedProduct(null);
		onHide();
	};

	const renderStars = (rating) => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 >= 0.5; // Show half star if decimal >= 0.5

		// Add full stars
		for (let i = 0; i < fullStars; i++) {
			stars.push(
				<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />
			);
		}

		// Add half star if needed
		if (hasHalfStar) {
			stars.push(
				<FontAwesomeIcon
					key="half"
					icon={faStarHalfAlt}
					className="text-yellow-400"
				/>
			);
		}

		// Add empty stars
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

	return (
		<Modal
			show={show}
			onHide={handleClose}
			size="lg"
			centered
			className="leave-review-modal"
		>
			<Modal.Header className="border-0 pb-0">
				<div className="flex items-center justify-between w-full">
					<div>
						<Modal.Title className="text-lg font-semibold text-gray-900">
							Leave a Review for {shopName}
						</Modal.Title>
						<p className="text-sm text-gray-600 mt-1">
							Select a product you've purchased to leave a review
						</p>
					</div>
					<button
						onClick={handleClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<FontAwesomeIcon icon={faTimes} className="text-lg" />
					</button>
				</div>
			</Modal.Header>

			<Modal.Body className="pt-0">
				{!isAuthenticated ? (
					<div className="text-center py-8">
						<div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
							<FontAwesomeIcon
								icon={faTimes}
								className="text-red-500 text-xl"
							/>
						</div>
						<h4 className="text-base font-medium text-gray-900 mb-2">
							Authentication Required
						</h4>
						<p className="text-sm text-gray-500 mb-4">
							You must be logged in to leave a review.
						</p>
						<Button
							variant="warning"
							onClick={() => {
								onHide();
								window.location.href = "/login";
							}}
						>
							Go to Login
						</Button>
					</div>
				) : !selectedProduct ? (
					<div>
						<div className="mb-4">
							<h4 className="text-base font-medium text-gray-900 mb-3">
								Choose a Product to Review
							</h4>
							<p className="text-sm text-gray-600">
								Select a product you've purchased from {shopName} to leave a
								review.
							</p>
						</div>

						{products.length === 0 ? (
							<div className="text-center py-8">
								<div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
									<FontAwesomeIcon
										icon={faShoppingBag}
										className="text-gray-400 text-xl"
									/>
								</div>
								<h4 className="text-base font-medium text-gray-900 mb-2">
									No Products Available
								</h4>
								<p className="text-sm text-gray-500">
									This shop doesn't have any products to review yet.
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
								{products.map((product) => (
									<div
										key={product.id}
										onClick={() => handleProductSelect(product)}
										className="cursor-pointer border border-gray-200 rounded-lg p-3 hover:border-yellow-400 hover:shadow-md transition-all duration-200"
									>
										<div className="flex items-start gap-3">
											<img
												src={
													product.first_media_url
														? product.first_media_url.replace(/\n/g, "").trim()
														: product.media_urls &&
														  Array.isArray(product.media_urls) &&
														  product.media_urls.length > 0
														? product.media_urls[0].replace(/\n/g, "").trim()
														: product.media &&
														  Array.isArray(product.media) &&
														  product.media.length > 0
														? product.media[0].replace(/\n/g, "").trim()
														: getFallbackImage()
												}
												alt={product.title}
												className="w-12 h-12 object-contain rounded flex-shrink-0"
												onError={(e) => {
													e.target.src = getFallbackImage();
												}}
											/>
											<div className="flex-1 min-w-0">
												<h5 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
													{product.title}
												</h5>
												<p className="text-sm font-bold text-yellow-600 mb-1">
													KSh {product.price?.toLocaleString() || "N/A"}
												</p>
												<p className="text-xs text-gray-500">
													{product.category_name} › {product.subcategory_name}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				) : (
					<div>
						<div className="mb-4">
							<h4 className="text-base font-medium text-gray-900 mb-3">
								Selected Product
							</h4>
						</div>

						<div className="border border-gray-200 rounded-lg p-4 mb-4">
							<div className="flex items-start gap-4">
								<img
									src={
										selectedProduct.first_media_url
											? selectedProduct.first_media_url
													.replace(/\n/g, "")
													.trim()
											: selectedProduct.media_urls &&
											  Array.isArray(selectedProduct.media_urls) &&
											  selectedProduct.media_urls.length > 0
											? selectedProduct.media_urls[0].replace(/\n/g, "").trim()
											: selectedProduct.media &&
											  Array.isArray(selectedProduct.media) &&
											  selectedProduct.media.length > 0
											? selectedProduct.media[0].replace(/\n/g, "").trim()
											: getFallbackImage()
									}
									alt={selectedProduct.title}
									className="w-16 h-16 object-contain rounded flex-shrink-0"
									onError={(e) => {
										e.target.src = getFallbackImage();
									}}
								/>
								<div className="flex-1">
									<h5 className="text-base font-medium text-gray-900 mb-1">
										{selectedProduct.title}
									</h5>
									<p className="text-base font-bold text-yellow-600 mb-2">
										KSh {selectedProduct.price?.toLocaleString() || "N/A"}
									</p>
									<p className="text-sm text-gray-500 mb-2">
										{selectedProduct.category_name} ›{" "}
										{selectedProduct.subcategory_name}
									</p>
									<div className="flex items-center gap-1">
										<span className="text-sm text-gray-600">
											Average Rating:
										</span>
										<div className="flex items-center gap-1">
											{renderStars(selectedProduct.average_rating || 0)}
											<span className="text-sm text-gray-600 ml-1">
												({selectedProduct.reviews_count || 0} reviews)
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
							<div className="flex items-start gap-3">
								<div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
									<FontAwesomeIcon
										icon={faArrowRight}
										className="text-white text-xs"
									/>
								</div>
								<div>
									<h5 className="text-sm font-medium text-blue-900 mb-1">
										Ready to Review?
									</h5>
									<p className="text-sm text-blue-700">
										You'll be taken to the product page where you can leave a
										detailed review with rating and comments about your
										experience with this product.
									</p>
								</div>
							</div>
						</div>

						<div className="flex gap-3">
							<Button
								variant="outline-secondary"
								onClick={() => setSelectedProduct(null)}
								className="flex-1"
							>
								Back to Products
							</Button>
							<Button
								variant="warning"
								onClick={handleReviewProduct}
								className="flex-1"
							>
								Leave Review
								<FontAwesomeIcon icon={faArrowRight} className="ml-2" />
							</Button>
						</div>
					</div>
				)}
			</Modal.Body>
		</Modal>
	);
};

export default LeaveReviewModal;
