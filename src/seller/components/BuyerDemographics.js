import React from "react";
import BuyerClickEvents from "./BuyerClickEvents";
import BuyerWishlistStats from "./BuyerWishlistStats"; // Ensure both components are imported
import "./BuyerDemographics.css";
import Spinner from "react-spinkit";

const BuyerDemographics = ({ data }) => {
	const { clickEvents, wishlistStats } = data;

	if (!clickEvents || !wishlistStats) {
		return (
			<div className="centered-loader">
				<Spinner
					variant="warning"
					name="cube-grid"
					style={{ width: 40, height: 40 }}
				/>
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
