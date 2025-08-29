import React from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";
import {
	FaFacebook,
	FaInstagram,
	FaTwitter,
	FaLinkedin,
	FaYoutube,
	FaTiktok,
	FaSnapchat,
	FaPinterest,
	FaReddit,
	FaWhatsapp,
	FaTelegram,
	FaEnvelope,
	FaAd,
	FaChartLine,
	FaExternalLinkAlt,
	FaEye,
	FaUsers,
	FaBullhorn,
} from "react-icons/fa";
import { SiGoogle } from "react-icons/si";
import PropTypes from "prop-types";

const UTMCampaignTracking = ({
	utmData = {},
	className = "",
	showSourceDistribution = true,
	showMediumDistribution = true,
	showCampaignDistribution = true,
	showPerformanceTable = true,
}) => {
	// Function to get source icon
	const getSourceIcon = (source) => {
		switch (source?.toLowerCase()) {
			case "facebook":
				return <FaFacebook className="text-primary" />;
			case "instagram":
				return <FaInstagram className="text-danger" />;
			case "twitter":
				return <FaTwitter className="text-info" />;
			case "linkedin":
				return <FaLinkedin className="text-primary" />;
			case "youtube":
				return <FaYoutube className="text-danger" />;
			case "tiktok":
				return <FaTiktok className="text-dark" />;
			case "snapchat":
				return <FaSnapchat className="text-warning" />;
			case "pinterest":
				return <FaPinterest className="text-danger" />;
			case "reddit":
				return <FaReddit className="text-warning" />;
			case "whatsapp":
				return <FaWhatsapp className="text-success" />;
			case "telegram":
				return <FaTelegram className="text-info" />;
			case "google":
				return <SiGoogle className="text-success" />;
			case "email":
				return <FaEnvelope className="text-info" />;
			default:
				return <FaExternalLinkAlt className="text-muted" />;
		}
	};

	// Function to get source brand color
	const getSourceBrandColor = (source) => {
		switch (source?.toLowerCase()) {
			case "facebook":
				return "#1877F2";
			case "instagram":
				return "#E4405F";
			case "twitter":
				return "#1DA1F2";
			case "linkedin":
				return "#0A66C2";
			case "youtube":
				return "#FF0000";
			case "tiktok":
				return "#000000";
			case "snapchat":
				return "#FFFC00";
			case "pinterest":
				return "#BD081C";
			case "reddit":
				return "#FF4500";
			case "whatsapp":
				return "#25D366";
			case "telegram":
				return "#0088CC";
			case "google":
				return "#4285F4";
			case "email":
				return "#4285F4";
			default:
				return "#6B7280";
		}
	};

	// Function to get medium color
	const getMediumColor = (medium) => {
		switch (medium?.toLowerCase()) {
			case "social":
				return "#3B82F6";
			case "cpc":
				return "#10B981";
			case "email":
				return "#8B5CF6";
			case "display":
				return "#F59E0B";
			case "organic":
				return "#6B7280";
			case "referral":
				return "#EF4444";
			case "affiliate":
				return "#EC4899";
			case "video":
				return "#06B6D4";
			case "paid_social":
				return "#84CC16";
			case "sponsored":
				return "#F97316";
			default:
				return "#6B7280";
		}
	};

	// Calculate total visits for percentage calculations
	const totalVisits = Object.values(
		utmData.utm_campaign_distribution || {}
	).reduce((sum, count) => sum + count, 0);

	return (
		<div className={`utm-campaign-tracking ${className}`}>
			<Card className="shadow-sm border-0">
				<Card.Header className="bg-gradient-primary text-white text-center fw-bold py-3">
					<div className="d-flex align-items-center justify-content-center flex-wrap">
						<FaChartLine className="me-2 me-md-3 fs-5" />
						<div>
							<h5 className="mb-0 fs-6 fs-md-5">UTM Campaign Tracking</h5>
						</div>
					</div>
				</Card.Header>
				<Card.Body className="p-3 p-md-4">
					<Row className="g-3 g-md-4">
						{/* UTM Source Distribution */}
						{showSourceDistribution && utmData.utm_source_distribution && (
							<Col xs={12} md={4}>
								<Card className="h-100 border-0 bg-light shadow-sm">
									<Card.Body className="p-3 p-md-4">
										<div className="d-flex align-items-center mb-3">
											<div
												className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2 me-md-3"
												style={{
													width: "32px",
													height: "32px",
													minWidth: "32px",
												}}
											>
												<FaUsers className="text-white fs-6" />
											</div>
											<h6 className="fw-bold text-primary mb-0 fs-7 fs-md-6">
												UTM Source Distribution
											</h6>
										</div>
										{Object.keys(utmData.utm_source_distribution).length > 0 ? (
											<div>
												{Object.entries(utmData.utm_source_distribution)
													.sort(([, a], [, b]) => b - a)
													.slice(0, 5)
													.map(([source, count], index) => (
														<div
															key={index}
															className="d-flex justify-content-between align-items-center mb-2 p-2 bg-white rounded-3"
														>
															<div className="d-flex align-items-center">
																<div
																	className="me-2"
																	style={{ fontSize: "16px" }}
																>
																	{getSourceIcon(source)}
																</div>
																<span className="text-capitalize fw-medium fs-8 fs-md-7">
																	{source}
																</span>
															</div>
															<Badge
																bg="primary"
																className="fs-8 fs-md-7"
																style={{
																	backgroundColor: getSourceBrandColor(source),
																}}
															>
																{count}
															</Badge>
														</div>
													))}
											</div>
										) : (
											<p className="text-muted fs-8 fs-md-7 mb-0">
												No UTM source data available
											</p>
										)}
									</Card.Body>
								</Card>
							</Col>
						)}

						{/* UTM Medium Distribution */}
						{showMediumDistribution && utmData.utm_medium_distribution && (
							<Col xs={12} md={4}>
								<Card className="h-100 border-0 bg-light shadow-sm">
									<Card.Body className="p-3 p-md-4">
										<div className="d-flex align-items-center mb-3">
											<div
												className="bg-success rounded-circle d-flex align-items-center justify-content-center me-2 me-md-3"
												style={{
													width: "32px",
													height: "32px",
													minWidth: "32px",
												}}
											>
												<FaBullhorn className="text-white fs-6" />
											</div>
											<h6 className="fw-bold text-success mb-0 fs-7 fs-md-6">
												UTM Medium Distribution
											</h6>
										</div>
										{Object.keys(utmData.utm_medium_distribution).length > 0 ? (
											<div>
												{Object.entries(utmData.utm_medium_distribution)
													.sort(([, a], [, b]) => b - a)
													.slice(0, 5)
													.map(([medium, count], index) => (
														<div
															key={index}
															className="d-flex justify-content-between align-items-center mb-2 p-2 bg-white rounded-3"
														>
															<span className="text-capitalize fw-medium fs-8 fs-md-7">
																{medium}
															</span>
															<Badge
																bg="success"
																className="fs-8 fs-md-7"
																style={{
																	backgroundColor: getMediumColor(medium),
																}}
															>
																{count}
															</Badge>
														</div>
													))}
											</div>
										) : (
											<p className="text-muted fs-8 fs-md-7 mb-0">
												No UTM medium data available
											</p>
										)}
									</Card.Body>
								</Card>
							</Col>
						)}

						{/* UTM Campaign Distribution */}
						{showCampaignDistribution && utmData.utm_campaign_distribution && (
							<Col xs={12} md={4}>
								<Card className="h-100 border-0 bg-light shadow-sm">
									<Card.Body className="p-3 p-md-4">
										<div className="d-flex align-items-center mb-3">
											<div
												className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-2 me-md-3"
												style={{
													width: "32px",
													height: "32px",
													minWidth: "32px",
												}}
											>
												<FaEye className="text-white fs-6" />
											</div>
											<h6 className="fw-bold text-warning mb-0 fs-7 fs-md-6">
												UTM Campaign Distribution
											</h6>
										</div>
										{Object.keys(utmData.utm_campaign_distribution).length >
										0 ? (
											<div>
												{Object.entries(utmData.utm_campaign_distribution)
													.sort(([, a], [, b]) => b - a)
													.slice(0, 5)
													.map(([campaign, count], index) => (
														<div
															key={index}
															className="d-flex justify-content-between align-items-center mb-2 p-2 bg-white rounded-3"
														>
															<span className="text-capitalize fw-medium fs-8 fs-md-7">
																{campaign.replace(/_/g, " ")}
															</span>
															<Badge
																bg="warning"
																className="fs-8 fs-md-7 text-dark"
															>
																{count}
															</Badge>
														</div>
													))}
											</div>
										) : (
											<p className="text-muted fs-8 fs-md-7 mb-0">
												No UTM campaign data available
											</p>
										)}
									</Card.Body>
								</Card>
							</Col>
						)}
					</Row>

					{/* Campaign Performance Table */}
					{showPerformanceTable &&
						utmData.utm_campaign_distribution &&
						Object.keys(utmData.utm_campaign_distribution).length > 0 && (
							<div className="mt-4 mt-md-5">
								<div className="d-flex align-items-center mb-3">
									<div
										className="bg-info rounded-circle d-flex align-items-center justify-content-center me-2 me-md-3"
										style={{ width: "32px", height: "32px", minWidth: "32px" }}
									>
										<FaChartLine className="text-white fs-6" />
									</div>
									<h6 className="fw-bold text-info mb-0 fs-7 fs-md-6">
										Campaign Performance Overview
									</h6>
								</div>
								<div className="table-responsive">
									<table className="table table-sm table-hover bg-white rounded-3 shadow-sm">
										<thead className="table-light">
											<tr>
												<th className="fs-8 fs-md-7">Campaign</th>
												<th className="fs-8 fs-md-7">Source</th>
												<th className="fs-8 fs-md-7">Medium</th>
												<th className="fs-8 fs-md-7">Visits</th>
												<th className="fs-8 fs-md-7">Performance</th>
											</tr>
										</thead>
										<tbody>
											{Object.entries(utmData.utm_campaign_distribution)
												.sort(([, a], [, b]) => b - a)
												.map(([campaign, count], index) => {
													// Find corresponding source and medium for this campaign
													const campaignSource = utmData.utm_source_distribution
														? Object.keys(utmData.utm_source_distribution)[0]
														: "N/A";
													const campaignMedium = utmData.utm_medium_distribution
														? Object.keys(utmData.utm_medium_distribution)[0]
														: "N/A";

													const percentage =
														totalVisits > 0
															? Math.round((count / totalVisits) * 100)
															: 0;

													return (
														<tr key={index}>
															<td className="fs-8 fs-md-7">
																<span className="fw-medium text-capitalize">
																	{campaign.replace(/_/g, " ")}
																</span>
															</td>
															<td className="fs-8 fs-md-7">
																<div className="d-flex align-items-center">
																	{getSourceIcon(campaignSource)}
																	<span className="ms-2 text-capitalize">
																		{campaignSource}
																	</span>
																</div>
															</td>
															<td className="fs-8 fs-md-7">
																<Badge
																	bg="light"
																	className="text-dark text-capitalize fs-8 fs-md-7"
																	style={{
																		backgroundColor:
																			getMediumColor(campaignMedium) + "20",
																	}}
																>
																	{campaignMedium}
																</Badge>
															</td>
															<td className="fs-8 fs-md-7">
																<span className="fw-bold text-primary">
																	{count}
																</span>
															</td>
															<td className="fs-8 fs-md-7">
																<div className="d-flex align-items-center">
																	<div
																		className="me-2"
																		style={{
																			width: "60px",
																			height: "6px",
																			backgroundColor: "#e5e7eb",
																			borderRadius: "3px",
																			overflow: "hidden",
																		}}
																	>
																		<div
																			style={{
																				width: `${percentage}%`,
																				height: "100%",
																				backgroundColor: "#10b981",
																				borderRadius: "3px",
																			}}
																		/>
																	</div>
																	<span className="small text-muted fs-8 fs-md-7">
																		{percentage}%
																	</span>
																</div>
															</td>
														</tr>
													);
												})}
										</tbody>
									</table>
								</div>
							</div>
						)}
				</Card.Body>
			</Card>
		</div>
	);
};

// PropTypes for better documentation and type checking
UTMCampaignTracking.propTypes = {
	utmData: PropTypes.shape({
		utm_source_distribution: PropTypes.object,
		utm_medium_distribution: PropTypes.object,
		utm_campaign_distribution: PropTypes.object,
	}),
	className: PropTypes.string,
	showSourceDistribution: PropTypes.bool,
	showMediumDistribution: PropTypes.bool,
	showCampaignDistribution: PropTypes.bool,
	showPerformanceTable: PropTypes.bool,
};

export default UTMCampaignTracking;
