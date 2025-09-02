import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import "./TopWishListedAds.css";

const TopWishListedAds = ({ data }) => {
	// Log the data to inspect

	return (
		<Row>
			{data.map((ad) => (
				<Col xs={12} md={6} lg={4} key={ad.ad_id} className="mb-1 mb-lg-2">
					<Card className="h-100">
						<Card.Img
							className="ad-image"
							variant="top"
							src={
								ad.ad_media && ad.ad_media.length > 0
									? ad.ad_media[0]
									: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA0MEwxMDAgNjVMNzUgOTBINDBMNjUgNjVMNDAgNDBINzVaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9Ijc1IiB5PSIxMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY3NzQ4QiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=="
							}
							alt={ad.ad_title}
						/>
						<Card.Body className="analytics-card-body p-0 mx-2">
							<Card.Title
								className="d-flex justify-content-start mb-0"
								style={{ fontSize: "17px" }}
							>
								{ad.ad_title}
							</Card.Title>
							<Card.Text className="analytics-price-container justify-content-start mt-0">
								<em className="text-success" style={{ fontSize: "12px" }}>
									Kshs:{" "}
								</em>
								<strong style={{ fontSize: "18px" }} className="text-danger">
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
														<span style={{ fontSize: "10px" }}>.</span>
														<span className="analytics-price-decimal">
															{(part || "00").padEnd(2, "0").slice(0, 2)}{" "}
															{/* Ensure two decimal points */}
														</span>
													</>
												)}
											</React.Fragment>
										))}
								</strong>
							</Card.Text>
							<Card.Text className="d-flex justify-content-start">
								<strong>Wishlisted:&nbsp;</strong> {ad.wishlist_count}
							</Card.Text>
						</Card.Body>
					</Card>
				</Col>
			))}
		</Row>
	);
};

export default TopWishListedAds;
