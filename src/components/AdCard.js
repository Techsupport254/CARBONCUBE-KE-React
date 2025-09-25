import React from "react";
import { Card } from "react-bootstrap";
import { getBorderColor } from "../buyer/utils/sellerTierUtils";
import { getValidImageUrl } from "../utils/imageUtils";
import { generateAdUrl } from "../utils/slugUtils";
import ResponsiveImage from "./ResponsiveImage";

/**
 * Unified AdCard component for consistent display across all pages
 * Used in: Home page, Search results, Shop pages, Related products, Best sellers
 */
const AdCard = ({
	ad,
	onClick,
	className = "",
	showTierBadge = true,
	showTierBorder = true,
	showRating = true,
	showPrice = true,
	showTitle = true,
	size = "default", // "small", "default", "large"
	variant = "default", // "default", "best-seller", "featured"
	...props
}) => {
	if (!ad) return null;

	// Size configurations
	const sizeConfig = {
		small: {
			imageHeight: "h-24 sm:h-28 md:h-32",
			titleSize: "text-xs",
			priceSize: "text-xs",
			ratingSize: "text-xs",
			padding: "p-1 sm:p-2",
			badgeSize: "text-[8px] sm:text-xs px-1 sm:px-1.5 py-0.5",
			iconSize: "w-3 h-3",
		},
		default: {
			imageHeight: "h-32 sm:h-36 lg:h-40",
			titleSize: "text-sm",
			priceSize: "text-sm",
			ratingSize: "text-xs",
			padding: "p-2 sm:p-3",
			badgeSize: "text-[8px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1",
			iconSize: "w-3 h-3",
		},
		large: {
			imageHeight: "h-40 sm:h-44 lg:h-48",
			titleSize: "text-base",
			priceSize: "text-base",
			ratingSize: "text-sm",
			padding: "p-3 sm:p-4",
			badgeSize: "text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1",
			iconSize: "w-4 h-4",
		},
	};

	const config = sizeConfig[size] || sizeConfig.default;

	// Get image URL with fallback
	const getImageUrl = () => {
		if (ad.first_media_url) {
			return getValidImageUrl(ad.first_media_url);
		}
		if (
			ad.media_urls &&
			Array.isArray(ad.media_urls) &&
			ad.media_urls.length > 0
		) {
			return getValidImageUrl(ad.media_urls[0]);
		}
		if (ad.media && Array.isArray(ad.media) && ad.media.length > 0) {
			return getValidImageUrl(ad.media[0]);
		}
		return null;
	};

	const imageUrl = getImageUrl();
	const hasImage =
		imageUrl &&
		imageUrl !==
			"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTgwIDEwNUwxNTAgMTM1TDEyMCAxMDVMMTUwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";

	// Get seller tier border color
	const borderColor = getBorderColor(ad.seller_tier);

	// Calculate rating display - ensure it's always a number
	const rating =
		parseFloat(ad.rating || ad.mean_rating || ad.average_rating || 0) || 0;

	// Variant-specific styling
	const getVariantClasses = () => {
		switch (variant) {
			case "best-seller":
				return "shadow-lg hover:shadow-xl";
			case "featured":
				return "shadow-md hover:shadow-lg";
			default:
				return "shadow-sm hover:shadow-md";
		}
	};

	return (
		<Card
			className={`h-full w-full bg-white rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col relative cursor-pointer ${getVariantClasses()} ${className}`}
			style={
				showTierBorder
					? { border: `2px solid ${borderColor}` }
					: { border: `1px solid #e5e7eb` }
			}
			onClick={() => {
				if (onClick) {
					const adUrl = generateAdUrl(ad);
					const adId = ad.id || ad.ad_id;

					// Debug logging to understand the issue
					console.log("AdCard click - ad object:", ad);
					console.log("AdCard click - ad.id:", ad.id);
					console.log("AdCard click - ad.ad_id:", ad.ad_id);
					console.log("AdCard click - final adId:", adId);

					// Additional fallback: if no id is found, try to extract from URL or use a placeholder
					const finalAdId =
						adId || ad.title?.replace(/\s+/g, "-").toLowerCase() || "unknown";

					if (!adId) {
						console.warn("No valid ad ID found, using fallback:", finalAdId);
					}

					onClick(adUrl, finalAdId);
				}
			}}
			{...props}
		>
			{/* Tier Badge */}
			{showTierBadge && ad.seller_tier_name && (
				<div
					className={`absolute top-1 left-1 ${config.badgeSize} font-medium text-white rounded-full z-10 shadow-sm`}
					style={{ backgroundColor: borderColor }}
					role="status"
					aria-label={`${ad.seller_tier_name || "Free"} tier product`}
				>
					{ad.seller_tier_name || "Free"}
				</div>
			)}

			{/* Variant Badge */}
			{variant === "best-seller" && (
				<div
					className={`absolute top-1 ${
						showTierBadge && ad.seller_tier_name ? "right-1" : "left-1"
					} px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-medium bg-yellow-100 text-yellow-800 whitespace-nowrap z-10 shadow-sm`}
				>
					<span className="hidden sm:inline">Best Seller</span>
					<span className="sm:hidden">BS</span>
				</div>
			)}

			{variant === "featured" && (
				<div className="absolute top-1 right-1 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap z-10 shadow-sm">
					<span className="hidden sm:inline">Featured</span>
					<span className="sm:hidden">F</span>
				</div>
			)}

			<div className="flex flex-col h-full">
				{/* Image Section */}
				<div className="relative h-auto aspect-square overflow-hidden flex-shrink-0">
					{hasImage ? (
						<ResponsiveImage
							src={imageUrl}
							alt={ad.title || "Product Image"}
							className="w-full h-full object-contain rounded-lg cursor-pointer transition-opacity duration-300 ease-in-out"
							loading="lazy"
							sizes="(max-width: 480px) 128px, (max-width: 640px) 192px, (max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
							onError={(e) => {
								e.target.style.display = "none";
								e.target.nextSibling.style.display = "flex";
							}}
						/>
					) : null}

					{/* Fallback for no image */}
					<div
						className={`w-full h-full ${
							hasImage ? "hidden" : "flex"
						} bg-gradient-to-br from-gray-100 to-gray-200 flex-col items-center justify-center rounded-lg`}
					>
						<div className="text-gray-400">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="mb-1"
							>
								<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
								<circle cx="8.5" cy="8.5" r="1.5" />
								<polyline points="21,15 16,10 5,21" />
							</svg>
						</div>
						<div className="text-[8px] text-gray-500 font-medium text-center px-1">
							No Image
						</div>
					</div>
				</div>

				{/* Content Section */}
				<div className="px-0.5 sm:px-1 md:px-1.5 lg:px-2 py-0.5 sm:py-0.5 md:py-1 bg-white flex flex-col justify-between flex-grow">
					{/* Title */}
					{showTitle && (
						<h3
							className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-800 text-left w-full truncate cursor-pointer hover:text-blue-600 transition-colors duration-200 mb-1"
							title={ad.title}
						>
							{ad.title}
						</h3>
					)}

					{/* Price and Rating */}
					<div className="flex justify-between items-center">
						{/* Price */}
						{showPrice && (
							<span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-orange-700">
								KES {ad.price ? parseFloat(ad.price).toLocaleString() : "N/A"}
							</span>
						)}

						{/* Rating */}
						{showRating && (
							<div className="flex items-center gap-0.5">
								<svg
									className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 ${
										rating === 0 ? "text-gray-300" : "text-yellow-400"
									}`}
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
								<span
									className={`text-[8px] sm:text-[9px] md:text-[10px] font-medium ${
										rating === 0 ? "text-gray-400" : "text-gray-600"
									}`}
								>
									{typeof rating === "number" ? rating.toFixed(1) : "0.0"}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Enhanced Tooltip for full title and price */}
			<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 max-w-[200px] whitespace-normal">
				<div className="font-semibold mb-2 text-center">{ad.title}</div>
				<div className="text-yellow-300 font-bold text-center">
					KSh{" "}
					{ad.price
						? Number(ad.price).toLocaleString("en-KE", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
						  })
						: "N/A"}
				</div>
				{/* Tooltip arrow */}
				<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-gray-900"></div>
			</div>
		</Card>
	);
};

export default AdCard;
