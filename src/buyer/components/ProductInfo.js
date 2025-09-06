import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faBox, faRuler, faWeightHanging } from "@fortawesome/free-solid-svg-icons";

const ProductInfo = ({ ad }) => {
	const [showFullDescription, setShowFullDescription] = useState(false);

	const formatPrice = (price) => {
		if (!price) return "Price not available";
		return new Intl.NumberFormat("en-KE", {
			style: "currency",
			currency: "KES",
			minimumFractionDigits: 0,
		}).format(price);
	};

	const formatCondition = (condition) => {
		switch (condition) {
			case "new":
				return "New";
			case "used":
				return "Used";
			case "refurbished":
				return "Refurbished";
			default:
				return condition || "Unknown";
		}
	};

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Product Meta */}
			<div className="space-y-3 sm:space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2 sm:space-x-3">
						<FontAwesomeIcon icon={faTag} className="text-yellow-500 text-sm sm:text-base" />
						<span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
							{formatPrice(ad.price)}
						</span>
					</div>
					<div className="flex items-center space-x-2">
						<span className="text-xs sm:text-sm text-gray-500">Condition:</span>
						<span className="text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
							{formatCondition(ad.condition)}
						</span>
					</div>
				</div>

				{/* Additional Product Details */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
					{ad.brand && (
						<div className="flex items-center space-x-2">
							<FontAwesomeIcon icon={faBox} className="text-gray-400 text-sm" />
							<span className="text-sm text-gray-600">
								<strong>Brand:</strong> {ad.brand}
							</span>
						</div>
					)}
					{ad.model && (
						<div className="flex items-center space-x-2">
							<FontAwesomeIcon icon={faBox} className="text-gray-400 text-sm" />
							<span className="text-sm text-gray-600">
								<strong>Model:</strong> {ad.model}
							</span>
						</div>
					)}
					{ad.dimensions && (
						<div className="flex items-center space-x-2">
							<FontAwesomeIcon icon={faRuler} className="text-gray-400 text-sm" />
							<span className="text-sm text-gray-600">
								<strong>Dimensions:</strong> {ad.dimensions}
							</span>
						</div>
					)}
					{ad.weight && (
						<div className="flex items-center space-x-2">
							<FontAwesomeIcon icon={faWeightHanging} className="text-gray-400 text-sm" />
							<span className="text-sm text-gray-600">
								<strong>Weight:</strong> {ad.weight}
							</span>
						</div>
					)}
				</div>
			</div>

			{/* Description */}
			{ad.description && (
				<div className="space-y-2 sm:space-y-3">
					<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
						Description
					</h3>
					<div className="text-sm text-gray-700 leading-relaxed">
						{ad.description.length > 200 ? (
							<>
								<p
									className={
										showFullDescription
											? ""
											: ""
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
										setShowFullDescription(!showFullDescription)
									}
									className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-2 transition-colors"
								>
									{showFullDescription
										? "Show Less"
										: "Show More"}
								</button>
							</>
						) : (
							<p>{ad.description}</p>
						)}
					</div>
				</div>
			)}

			{/* Condition Badge */}
			<div className="flex items-center space-x-2">
				<span className="text-xs sm:text-sm text-gray-500">Listed</span>
				{ad.created_at
					? new Date(ad.created_at).toLocaleDateString("en-US", {
						day: "numeric",
						month: "long",
						year: "numeric",
					})
					: "Recently"}
			</div>
		</div>
	);
};

export default ProductInfo;
