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
	// Ensure we always have 4 subcategory slots to maintain grid structure
	const subcategoriesToDisplay = isLoading
		? Array.from({ length: 4 }).map((_, idx) => ({
				id: `loading-${idx}`,
				name: "",
				isPlaceholder: true,
		  }))
		: randomizedSubcategories && randomizedSubcategories.length > 0
		? randomizedSubcategories
		: Array.from({ length: 4 }).map((_, idx) => ({
				id: `empty-${idx}`,
				name: "",
				isEmpty: true,
		  }));

	return (
		<Card className="mb-4 mx-0 shadow-xl rounded-lg ">
			<Card.Header className="bg-secondary text-white rounded-t-lg flex justify-start shadow-md">
				<h4 className="m-0 font-bold text-sm sm:text-base md:text-lg">
					{title}
				</h4>
			</Card.Header>
			<Card.Body className="bg-transparent p-0 min-h-[30vh]">
				{!isLoading && errorMessage && (
					<div className="p-2 bg-yellow-100 text-yellow-800 border border-yellow-200 flex items-center justify-between">
						<span className="text-xs sm:text-sm">{errorMessage}</span>
						{onRetry && (
							<button
								onClick={onRetry}
								className="text-xs px-2 py-1 rounded bg-yellow-200 hover:bg-yellow-300"
							>
								Retry
							</button>
						)}
					</div>
				)}
				<div
					className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 h-full"
					style={{
						alignItems: "stretch",
						justifyItems: "stretch",
						minHeight: "30vh",
						gridTemplateRows: "1fr",
					}}
				>
					{subcategoriesToDisplay.map((subcategory) => (
						<div
							key={subcategory.id}
							className="h-full p-0.5 flex flex-1 min-w-0"
						>
							{isLoading ? (
								<div className="h-full w-full rounded-lg bg-white/90">
									<div className="h-full w-full animate-pulse rounded-lg border border-gray-200">
										<div className="grid grid-cols-2 grid-rows-2 gap-1 p-1 h-full">
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
								<div className="h-full w-full rounded-lg bg-white/90 border-2 border-dashed border-gray-200 flex items-center justify-center">
									<div className="text-center text-gray-400">
										<div className="text-xs sm:text-sm font-medium">
											No items
										</div>
										<div className="text-[10px] sm:text-xs">available</div>
									</div>
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
				{!isLoading &&
					(!randomizedSubcategories || randomizedSubcategories.length === 0) &&
					!errorMessage && (
						<div className="p-3 text-center text-gray-500 text-xs sm:text-sm">
							No items available in this category yet.
						</div>
					)}
			</Card.Body>
		</Card>
	);
};

export default CategorySection;
