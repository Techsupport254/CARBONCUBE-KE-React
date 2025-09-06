import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSpinner,
	faBox,
	faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { getValidImageUrl, getFallbackImage } from "../../utils/imageUtils";

const ShopModal = ({
	showShopModal,
	setShowShopModal,
	sellerAds,
	isLoadingSellerAds,
	loadMoreSellerAds,
	isLoadingMoreSellerAds,
	hasMoreSellerAds,
	totalSellerAdsCount,
	ad,
}) => {
	const formatPrice = (price) => {
		if (!price) return "Price not available";
		return new Intl.NumberFormat("en-KE", {
			style: "currency",
			currency: "KES",
			minimumFractionDigits: 0,
		}).format(price);
	};

	return (
		<Modal
			centered
			show={showShopModal}
			onHide={() => setShowShopModal(false)}
			size="xl"
		>
			<Modal.Header className="border-0 pb-0">
				<Modal.Title className="text-xl font-bold text-gray-900">
					<FontAwesomeIcon icon={faBox} className="mr-2 text-yellow-500" />
					{ad?.seller_enterprise_name ||
						ad?.seller?.enterprise_name ||
						ad?.seller_name ||
						"Seller"}
					's Shop
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="pt-0">
				{isLoadingSellerAds ? (
					<div className="text-center py-8">
						<FontAwesomeIcon
							icon={faSpinner}
							className="animate-spin text-2xl text-yellow-500 mb-4"
						/>
						<p className="text-gray-600">Loading products...</p>
					</div>
				) : sellerAds.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-gray-500">No products available in this shop.</p>
					</div>
				) : (
					<div className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
							{sellerAds.map((product) => (
								<div
									key={product.id}
									className="group cursor-pointer bg-white rounded-lg border border-gray-200 hover:border-yellow-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
								>
									<div className="relative">
										{/* Product Image Container */}
										<div className="relative w-full h-32 sm:h-40 overflow-hidden">
											<img
												src={getValidImageUrl(product.images?.[0])}
												alt={product.title}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
												onError={(e) => {
													e.target.src = getFallbackImage();
												}}
											/>
										</div>

										{/* Price Tag */}
										<div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
											{formatPrice(product.price)}
										</div>
									</div>

									{/* Product Info */}
									<div className="p-3">
										{/* Product Title */}
										<h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-yellow-600 transition-colors">
											{product.title}
										</h3>

										{/* Product Meta */}
										<div className="flex items-center justify-between text-xs text-gray-500">
											<span>{product.location || "Nairobi"}</span>
											<span>
												{new Date(product.created_at).toLocaleDateString()}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Load More Button */}
						{hasMoreSellerAds && (
							<div className="text-center pt-4">
								<Button
									variant="outline"
									onClick={loadMoreSellerAds}
									disabled={isLoadingMoreSellerAds}
									className="border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white"
								>
									{isLoadingMoreSellerAds ? (
										<>
											<FontAwesomeIcon
												icon={faSpinner}
												className="animate-spin mr-2"
											/>
											Loading...
										</>
									) : (
										<>
											Load More Products
											<FontAwesomeIcon icon={faArrowRight} className="ml-2" />
										</>
									)}
								</Button>
							</div>
						)}

						{/* Products Count */}
						<div className="text-center text-sm text-gray-500 pt-2">
							Showing {sellerAds.length} of {totalSellerAdsCount} products
						</div>
					</div>
				)}
			</Modal.Body>
			<Modal.Footer className="border-0 pt-0">
				<Button variant="secondary" onClick={() => setShowShopModal(false)}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ShopModal;
