import React from "react";
import BuyerClickEvents from "./BuyerClickEvents";
import BuyerWishlistStats from "./BuyerWishlistStats"; // Ensure both components are imported
import "./BuyerDemographics.css";

const BuyerDemographics = ({ data }) => {
	const { clickEvents, wishlistStats } = data;

	if (!clickEvents || !wishlistStats) {
		return (
			<div className="flex justify-center items-center py-4 sm:py-8">
				<div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
				<span className="ml-2 sm:ml-3 text-gray-600 text-sm sm:text-base">
					Loading demographics...
				</span>
			</div>
		);
	}

	return (
		<div className="buyer-stats">
			{/* Pass both clickEvents and wishlistStats to the relevant components */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
				<div className="mb-2 sm:mb-4">
					<BuyerClickEvents data={clickEvents} />
				</div>
				<div className="mb-2 sm:mb-4">
					<BuyerWishlistStats data={wishlistStats} />
				</div>
			</div>
		</div>
	);
};

export default BuyerDemographics;
