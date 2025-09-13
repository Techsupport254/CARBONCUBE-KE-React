import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card } from "react-bootstrap";
import AdCard from "../../components/AdCard";

// Helper function to get tier priority (higher number = higher priority)
const getTierPriority = (ad) => {
	const tier = ad.seller_tier || 1; // Default to Free (1) if no tier
	// Premium = 4, Standard = 3, Basic = 2, Free = 1
	return tier;
};

// Helper function to sort ads by tier priority (Premium → Standard → Basic → Free)
const sortAdsByTier = (ads) => {
	return [...ads].sort((a, b) => {
		const tierA = getTierPriority(a);
		const tierB = getTierPriority(b);

		// Higher tier number = higher priority
		if (tierA !== tierB) {
			return tierB - tierA;
		}

		// If same tier, sort by creation date (newest first)
		return new Date(b.created_at || 0) - new Date(a.created_at || 0);
	});
};

const SubcategorySection = ({
	subcategory,
	categoryName,
	categoryId,
	ads,
	onAdClick,
	onSubcategoryClick,
	isLoading = false,
	errorMessage,
	onRetry,
	isReshuffled = false,
}) => {
	const [isAnimating, setIsAnimating] = useState(false);
	const [previousAds, setPreviousAds] = useState([]);
	const [isMobile, setIsMobile] = useState(false);

	// Handle window resize to update mobile status
	const handleResize = useCallback(() => {
		setIsMobile(window.innerWidth < 640);
	}, []);

	useEffect(() => {
		// Set initial mobile status
		handleResize();

		// Add resize listener
		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => window.removeEventListener("resize", handleResize);
	}, [handleResize]);

	// Memoize sorted ads to prevent unnecessary recalculations
	const sortedAds = useMemo(() => {
		if (!Array.isArray(ads)) return [];

		// If ads have been reshuffled, preserve the reshuffled order
		// Only apply tier sorting for initial load
		return isReshuffled ? ads : sortAdsByTier(ads);
	}, [ads, isReshuffled]);

	// Memoize displayed ads to prevent unnecessary recalculations
	// Show 6 items for mobile (3x2 grid), 4 items for larger screens (2x2 grid)
	const displayedAds = useMemo(() => {
		const itemsToShow = isMobile ? 6 : 4;
		return sortedAds.slice(0, itemsToShow);
	}, [sortedAds, isMobile]);

	// Detect when ads have been reshuffled and trigger animation
	useEffect(() => {
		if (previousAds.length > 0 && displayedAds.length > 0) {
			const currentIds = displayedAds.map((ad) => ad.id).sort();
			const previousIds = previousAds.map((ad) => ad.id).sort();

			// Check if the order has changed
			const hasChanged =
				JSON.stringify(currentIds) !== JSON.stringify(previousIds);

			if (hasChanged) {
				setIsAnimating(true);
				// Reset animation after a short delay
				setTimeout(() => setIsAnimating(false), 1000);
			}
		}

		setPreviousAds(displayedAds);
	}, [displayedAds, previousAds]); // Include previousAds in dependency array as required by ESLint

	// Debug logging removed for cleaner console

	return (
		<Card
			className={`h-full bg-transparent rounded-lg flex flex-col transition-all duration-600 ease-out ${
				isAnimating
					? "ring-1 ring-blue-200 ring-opacity-50 shadow-sm bg-blue-50 bg-opacity-30"
					: ""
			}`}
		>
			<Card.Body className="p-0 flex-grow flex flex-col justify-between">
				{!isLoading && errorMessage && (
					<div className="mb-0.5 p-0.5 sm:p-0.5 md:p-1 bg-yellow-100 text-yellow-800 border border-yellow-200 flex items-center justify-between">
						<span className="text-[10px] sm:text-xs md:text-sm">
							{errorMessage}
						</span>
						{onRetry && (
							<button
								onClick={onRetry}
								className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-1 md:px-1.5 py-0.5 rounded bg-yellow-200 hover:bg-yellow-300"
							>
								Retry
							</button>
						)}
					</div>
				)}
				{/* Responsive grid: 3 columns for mobile (2 rows), 2 columns for larger screens (3 rows) */}
				<div
					className={`grid grid-cols-3 sm:grid-cols-2 gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 h-full p-0.5 sm:p-1 md:p-1.5 transition-all duration-400 ease-out ${
						isAnimating ? "opacity-95" : ""
					}`}
					style={{
						alignItems: "stretch",
						justifyItems: "stretch",
						minHeight: "20vh",
					}}
				>
					{Array.from({ length: displayedAds.length }).map((_, i) => {
						const ad = displayedAds[i];

						if (!isLoading && ad) {
							return (
								<div
									key={ad.id}
									className={`h-full w-full transition-all duration-400 ease-out`}
									style={{
										transitionDelay: isAnimating ? `${i * 50}ms` : "0ms",
										opacity: isAnimating ? 0.85 : 1,
										transform: isAnimating
											? "translateY(-2px)"
											: "translateY(0px)",
									}}
								>
									<AdCard
										ad={ad}
										onClick={() => onAdClick(ad.id)}
										size="small"
										variant="default"
										showTierBadge={true}
										showTierBorder={true}
										showRating={true}
										showPrice={true}
										showTitle={true}
										className="h-full"
									/>
								</div>
							);
						}

						// Empty slot that maintains consistent sizing
						return (
							<div
								key={`slot-${i}`}
								className="h-full w-full min-h-[8vh] sm:min-h-[10vh] md:min-h-[12vh] lg:min-h-[14vh]"
							>
								{/* Completely empty slot */}
							</div>
						);
					})}
				</div>
			</Card.Body>

			{/* Subcategory footer */}
			<Card.Footer className="flex justify-start border-t border-gray-200 bg-gray-50 px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-0.5 md:py-1 mt-auto">
				{isLoading ? (
					<div className="h-3 sm:h-4 md:h-5 w-16 sm:w-20 md:w-24 bg-gray-200 rounded animate-pulse" />
				) : (
					<h3
						className="m-0 cursor-pointer transition-all duration-300 hover:text-blue-600 hover:translate-x-1 font-semibold text-gray-800 text-[10px] sm:text-xs md:text-sm"
						onClick={() => onSubcategoryClick(subcategory, categoryId)}
					>
						{subcategory}
					</h3>
				)}
			</Card.Footer>
		</Card>
	);
};

export default SubcategorySection;
