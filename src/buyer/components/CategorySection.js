import React from "react";
import { Card } from "react-bootstrap";
import SubcategorySection from "./SubcategorySection";

const CategorySection = ({
	title,
	randomizedSubcategories,
	ads,
	handleAdClick,
	handleSubcategoryClick,
	isLoading = false,
	errorMessage,
	onRetry,
}) => {
	// Ensure we always have exactly 4 subcategory slots to maintain grid structure
	const subcategoriesToDisplay = isLoading
		? Array.from({ length: 4 }).map((_, idx) => ({
				id: `loading-${idx}`,
				name: "",
				isPlaceholder: true,
		  }))
		: randomizedSubcategories && randomizedSubcategories.length > 0
		? randomizedSubcategories.slice(0, 4) // Limit to exactly 4 subcategories
		: Array.from({ length: 4 }).map((_, idx) => ({
				id: `empty-${idx}`,
				name: "",
				isEmpty: true,
		  }));

	return (
		<Card className="mx-0 shadow-xl rounded-lg border-0 relative z-10">
			<Card.Header
				className="bg-secondary text-white rounded-t-lg flex justify-between items-center shadow-md cursor-pointer hover:bg-yellow-600 transition-colors duration-200 px-2 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-3 md:py-4"
				onClick={() =>
					handleSubcategoryClick && handleSubcategoryClick("All", title)
				}
				title={`View all ${title} subcategories`}
			>
				<h4 className="m-0 font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
					{title}
				</h4>
				<div className="text-xs sm:text-sm md:text-base opacity-75 hover:opacity-100">
					View All →
				</div>
			</Card.Header>
			<Card.Body className="bg-transparent p-0 min-h-[30vh]">
				{!isLoading && errorMessage && (
					<div className="p-1.5 sm:p-2 md:p-3 bg-yellow-100 text-yellow-800 border border-yellow-200 flex items-center justify-between">
						<span className="text-xs sm:text-sm md:text-base">
							{errorMessage}
						</span>
						{onRetry && (
							<button
								onClick={onRetry}
								className="text-xs sm:text-sm md:text-base px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded bg-yellow-200 hover:bg-yellow-300"
							>
								Retry
							</button>
						)}
					</div>
				)}
				<div
					className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 p-0 h-full"
					style={{
						alignItems: "stretch",
						justifyItems: "stretch",
						minHeight: "30vh",
					}}
				>
					{subcategoriesToDisplay.map((subcategory) => (
						<div
							key={subcategory.id}
							className="h-full p-0 flex flex-1 min-w-0 gap-0"
						>
							{isLoading ? (
								<div className="h-full w-full rounded-lg bg-white/90">
									<div className="h-full w-full animate-pulse rounded-lg border border-gray-200">
										<div className="grid grid-cols-2 grid-rows-2 gap-0.5 sm:gap-1 md:gap-1.5 p-0.5 sm:p-1 md:p-1.5 h-full">
											{Array.from({ length: 4 }).map((__, i) => (
												<div key={i} className="h-full w-full">
													<div className="w-full h-full bg-gray-200 rounded" />
												</div>
											))}
										</div>
									</div>
								</div>
							) : subcategory.isEmpty ? (
								// Empty state placeholder that maintains size
								<div className="h-full w-full">
									{/* Empty slot - completely invisible, just maintains layout */}
								</div>
							) : (
								<SubcategorySection
									subcategory={subcategory.name}
									categoryName={title}
									ads={ads[subcategory.id] || []}
									onAdClick={handleAdClick}
									onSubcategoryClick={handleSubcategoryClick}
								/>
							)}
						</div>
					))}
				</div>
			</Card.Body>
		</Card>
	);
};

export default CategorySection;
