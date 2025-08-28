import React from "react";
import { Card, Button } from "react-bootstrap";
import { getBorderColor } from "../utils/sellerTierUtils";

const SearchResultSection = ({
	results,
	getHeaderTitle,
	handleAdClick,
	handleClearSearch,
	hasMore,
	onLoadMore,
	isLoading = false,
}) => {
	return (
		<div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
			<Card className="mb-4 mt-2 mx-0">
				<Card.Header className="flex justify-between items-center px-3 py-2">
					<h3 className="mb-0 text-sm sm:text-base md:text-lg">
						{getHeaderTitle()}
					</h3>
					<Button
						variant="outline-secondary bg-warning rounded-pill text-dark"
						size="sm"
						onClick={handleClearSearch}
						className="flex items-center gap-2 text-xs sm:text-sm"
					>
						Back to Home
					</Button>
				</Card.Header>
				<Card.Body className="p-2">
					{isLoading ? (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3 lg:gap-4">
							{Array.from({ length: 12 }).map((_, i) => (
								<div key={i} className="h-full min-w-0">
									<Card className="mb-2 h-full">
										<div className="text-dark px-1 py-0.5 text-xs bg-gray-200 animate-pulse" />
										<div className="w-full aspect-square bg-gray-200 animate-pulse" />
										<Card.Body className="px-1 py-1">
											<div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse" />
											<div className="mt-2 h-3 bg-gray-200 rounded w-2/5 animate-pulse" />
										</Card.Body>
									</Card>
								</div>
							))}
						</div>
					) : results.length === 0 ? (
						<div className="text-center py-4">
							<h5 className="text-muted text-sm sm:text-base">
								No products found
							</h5>
							<p className="text-muted text-xs sm:text-sm">
								Try adjusting your search or browse other categories
							</p>
						</div>
					) : (
						<>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3 lg:gap-4">
								{results.map((ad) => {
									const borderColor = getBorderColor(ad.seller_tier);
									return (
										<div key={ad.id} className="h-full min-w-0">
											<Card
												className="mb-2 h-full"
												style={{
													border: `2px solid ${borderColor}`,
												}}
											>
												<div>
													{/* Tier label */}
													<div
														className="text-dark px-1 py-0.5 text-xs"
														style={{
															backgroundColor: borderColor,
															borderTopLeftRadius: "0px",
															borderTopRightRadius: "4px",
															borderBottomRightRadius: "0px",
															borderBottomLeftRadius: "6px",
														}}
													>
														{ad.tier_name || "Free"}
													</div>

													<Card.Img
														variant="top"
														src={
															ad.first_media_url
																? ad.first_media_url.replace(/\n/g, "").trim()
																: ad.media_urls &&
																  Array.isArray(ad.media_urls) &&
																  ad.media_urls.length > 0
																? ad.media_urls[0].replace(/\n/g, "").trim()
																: ad.media &&
																  Array.isArray(ad.media) &&
																  ad.media.length > 0
																? ad.media[0].replace(/\n/g, "").trim()
																: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTgwIDEwNUwxNTAgMTM1TDEyMCAxMDVMMTUwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+"
														}
														alt={ad.title}
														className="cursor-pointer aspect-square object-contain"
														onClick={() => handleAdClick(ad.id)}
														onLoad={(e) => {
															e.target.style.opacity = "1";
														}}
														onError={(e) => {
															// Use a data URI as fallback to prevent infinite loops
															e.target.src =
																"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTgwIDEwNUwxNTAgMTM1TDEyMCAxMDVMMTUwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
															e.target.style.opacity = "1";
														}}
													/>
												</div>
												<Card.Body className="px-1 py-1">
													<Card.Title className="mb-0 text-xs sm:text-sm">
														{ad.title}
													</Card.Title>
													<Card.Text className="text-xs">
														<span>
															<em className="text-success">Kshs: </em>
														</span>
														<strong className="text-danger">
															{ad.price
																? parseFloat(ad.price)
																		.toFixed(2)
																		.split(".")
																		.map((part, index) => (
																			<React.Fragment key={index}>
																				{index === 0 ? (
																					<span>
																						{parseInt(
																							part,
																							10
																						).toLocaleString()}
																					</span>
																				) : (
																					<>
																						<span style={{ fontSize: "12px" }}>
																							.
																						</span>
																						<span>{part}</span>
																					</>
																				)}
																			</React.Fragment>
																		))
																: "N/A"}
														</strong>
													</Card.Text>
												</Card.Body>
											</Card>
										</div>
									);
								})}
							</div>
							{hasMore && (
								<div className="text-center mt-4">
									<Button
										variant="warning"
										onClick={onLoadMore}
										className="px-6 py-2 rounded-pill"
									>
										Show More
									</Button>
								</div>
							)}
						</>
					)}
				</Card.Body>
			</Card>
		</div>
	);
};

export default SearchResultSection;
