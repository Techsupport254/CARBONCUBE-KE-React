import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { getValidImageUrl, getFallbackImage } from "../../utils/imageUtils";

const ProductImageGallery = ({
	ad,
	carouselActiveIndex,
	setCarouselActiveIndex,
}) => {
	const [imageError, setImageError] = useState({});

	const handleImageError = (index) => {
		setImageError((prev) => ({ ...prev, [index]: true }));
	};

	const handleCarouselSelect = (selectedIndex) => {
		setCarouselActiveIndex(selectedIndex);
	};

	const renderImage = (imageUrl, index) => {
		const hasError = imageError[index];
		const validUrl = hasError ? getFallbackImage() : getValidImageUrl(imageUrl);

		return (
			<div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden bg-gray-100">
				<img
					src={validUrl}
					alt={`Product ${index + 1}`}
					className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
					onError={() => handleImageError(index)}
					loading="lazy"
				/>
				{/* Image Counter */}
				<div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium">
					{index + 1} / {ad.images?.length || 1}
				</div>
			</div>
		);
	};

	if (!ad?.images || ad.images.length === 0) {
		return (
			<div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden bg-gray-100">
				<img
					src={getFallbackImage()}
					alt="Product"
					className="w-full h-full object-cover"
				/>
				<div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium">
					1 / 1
				</div>
			</div>
		);
	}

	if (ad.images.length === 1) {
		return renderImage(ad.images[0], 0);
	}

	return (
		<div className="space-y-3 sm:space-y-4">
			{/* Main Image Display */}
			<div className="relative">
				{renderImage(ad.images[carouselActiveIndex], carouselActiveIndex)}

				{/* Carousel Controls */}
				{ad.images.length > 1 && (
					<>
						<button
							onClick={() =>
								setCarouselActiveIndex(
									carouselActiveIndex === 0
										? ad.images.length - 1
										: carouselActiveIndex - 1
								)
							}
							className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
						>
							<FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
						</button>
						<button
							onClick={() =>
								setCarouselActiveIndex(
									carouselActiveIndex === ad.images.length - 1
										? 0
										: carouselActiveIndex + 1
								)
							}
							className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
						>
							<FontAwesomeIcon icon={faChevronRight} className="text-sm" />
						</button>
					</>
				)}
			</div>

			{/* Thumbnail Navigation */}
			{ad.images.length > 1 && (
				<div className="flex space-x-2 overflow-x-auto pb-2">
					{ad.images.map((image, index) => (
						<button
							key={index}
							onClick={() => handleCarouselSelect(index)}
							className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
								index === carouselActiveIndex
									? "border-yellow-500 ring-2 ring-yellow-200"
									: "border-gray-200 hover:border-gray-300"
							}`}
						>
							<img
								src={getValidImageUrl(image)}
								alt={`Thumbnail ${index + 1}`}
								className="w-full h-full object-cover"
								onError={() => handleImageError(`thumb_${index}`)}
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default ProductImageGallery;
