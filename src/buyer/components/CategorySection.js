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
}) => {
	return (
		<Card className="mb-4 mx-0 shadow-xl rounded-lg">
			<Card.Header className="bg-secondary text-white rounded-t-lg flex justify-start shadow-md">
				<h4 className="m-0 font-bold text-sm sm:text-base md:text-lg">
					{title}
				</h4>
			</Card.Header>
			<Card.Body className="bg-transparent p-0">
				<div
					className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 h-full"
					style={{ alignItems: "stretch", justifyItems: "stretch" }}
				>
					{(isLoading
						? Array.from({ length: 4 }).map((_, idx) => ({
								id: `loading-${idx}`,
								name: "",
								isPlaceholder: true,
						  }))
						: randomizedSubcategories
					).map((subcategory) => (
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
