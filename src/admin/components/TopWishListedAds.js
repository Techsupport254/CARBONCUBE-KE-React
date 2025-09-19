import React from "react";

const TopWishListedAds = ({ data }) => {
	if (!data || !Array.isArray(data)) {
		return <div className="text-center">No wishlisted ads data available</div>;
	}

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
			{data.map((ad) => (
				<div key={ad.ad_id} className="bg-white border border-gray-300 rounded-lg shadow-sm h-full">
					<img
						className="w-full h-32 object-cover rounded-t-lg"
						src={
							ad.media && ad.media.length > 0
								? ad.media[0]
								: "default-image-url"
						}
						alt={ad.ad_title}
					/>
					<div className="p-2">
						<h3 className="text-sm font-bold text-left truncate mb-1">
							{ad.ad_title}
						</h3>
						<div className="text-left mb-1">
							<span className="text-green-600 text-sm">
								<em>Kshs:&nbsp;</em>
							</span>
							<strong className="text-red-600 text-lg">
								{ad.ad_price.split(".").map((part, index) => (
									<React.Fragment key={index}>
										{index === 0 ? (
											<span>
												{parseInt(part, 10).toLocaleString()}{" "}
											</span>
										) : (
											<>
												<span className="text-xs">.</span>
												<span>
													{(part || "00").padEnd(2, "0").slice(0, 2)}{" "}
												</span>
											</>
										)}
									</React.Fragment>
								))}
							</strong>
						</div>
						<div className="text-left text-sm">
							<strong>Wishlisted:&nbsp;</strong> {ad.wishlist_count}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default TopWishListedAds;
