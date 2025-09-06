import React from "react";
import "./TopWishListedAds.css";

const TopWishListedAds = ({ data }) => {
	// Log the data to inspect

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2">
			{data.map((ad, index) => (
				<div
					key={ad.ad_id || `ad-${index}`}
					className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden"
				>
					<img
						className="w-full h-48 sm:h-52 object-contain bg-gray-50"
						src={
							ad.ad_media && ad.ad_media.length > 0
								? ad.ad_media[0]
								: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA0MEwxMDAgNjVMNzUgOTBINDBMNjUgNjVMNDAgNDBINzVaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9Ijc1IiB5PSIxMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY3NzQ4QiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=="
						}
						alt={ad.ad_title}
					/>
					<div className="p-1 sm:p-2">
						<h6 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base truncate">
							{ad.ad_title}
						</h6>
						<div className="flex items-center mb-2">
							<span className="text-green-600 text-xs sm:text-sm italic">
								Kshs:{" "}
							</span>
							<span className="text-red-600 font-bold text-base sm:text-lg">
								{ad.ad_price &&
									ad.ad_price.split(".").map((part, index) => (
										<React.Fragment key={index}>
											{index === 0 ? (
												<span className="analytics-price-integer">
													{parseInt(part, 10).toLocaleString()}{" "}
													{/* Format integer with commas */}
												</span>
											) : (
												<>
													<span className="text-xs">.</span>
													<span className="analytics-price-decimal">
														{(part || "00").padEnd(2, "0").slice(0, 2)}{" "}
														{/* Ensure two decimal points */}
													</span>
												</>
											)}
										</React.Fragment>
									))}
							</span>
						</div>
						<div className="flex items-center">
							<span className="font-semibold text-gray-700 text-xs sm:text-sm">
								Wishlisted:{" "}
							</span>
							<span className="text-blue-600 font-bold text-sm sm:text-base">
								{ad.wishlist_count}
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default TopWishListedAds;
