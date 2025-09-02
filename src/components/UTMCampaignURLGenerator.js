import React, { useState } from "react";
import { Card, Row, Col, Button, Toast, ToastContainer } from "react-bootstrap";
import { FaWrench, FaCopy, FaExternalLinkAlt } from "react-icons/fa";
import PropTypes from "prop-types";

const UTMCampaignURLGenerator = ({
	baseUrl = window.location.origin,
	onUrlGenerated,
	className = "",
	showTemplates = true,
	showBuilder = true,
	showDocumentation = true,
}) => {
	// UTM URL Generator state
	const [utmBaseUrl, setUtmBaseUrl] = useState(`${baseUrl}/`);
	const [utmSource, setUtmSource] = useState("facebook");
	const [utmMedium, setUtmMedium] = useState("social");
	const [utmCampaign, setUtmCampaign] = useState("");
	const [customCampaign, setCustomCampaign] = useState("");
	const [generatedUrl, setGeneratedUrl] = useState("");
	const [showToast, setShowToast] = useState(false);

	// Function to generate UTM URL
	const generateUtmUrl = () => {
		let campaignValue = "";

		if (utmCampaign === "custom") {
			campaignValue = customCampaign.trim();
		} else {
			campaignValue = utmCampaign.trim();
		}

		if (campaignValue) {
			const url = `${utmBaseUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${campaignValue}`;
			setGeneratedUrl(url);

			// Call the callback function if provided
			if (onUrlGenerated) {
				onUrlGenerated(url);
			}
		}
	};

	// Function to copy URL to clipboard
	const copyToClipboard = () => {
		if (generatedUrl) {
			navigator.clipboard.writeText(generatedUrl);
			setShowToast(true);
		}
	};

	return (
		<div className={`utm-campaign-generator ${className}`}>
			<Card className="shadow-sm border-0">
				<Card.Header className="bg-gradient-primary text-white text-center fw-bold py-3">
					<div className="d-flex align-items-center justify-content-center flex-wrap">
						<FaExternalLinkAlt className="me-2 me-md-3 fs-5" />
						<div>
							<h5 className="mb-0 fs-6 fs-md-5">UTM Campaign URL Generator</h5>
						</div>
					</div>
				</Card.Header>
				<Card.Body className="p-3 p-md-4">
					{/* Custom UTM Builder */}
					{showBuilder && (
						<div className={showTemplates ? "border-top pt-4 pt-md-5" : ""}>
							<div className="d-flex align-items-center mb-3">
								<div
									className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-2 me-md-3"
									style={{ width: "32px", height: "32px", minWidth: "32px" }}
								>
									<FaWrench className="text-white fs-6" />
								</div>
								<h6 className="fw-bold text-secondary mb-0 fs-7 fs-md-6">
									Custom UTM Builder
								</h6>
							</div>
							<Row className="g-3 g-md-4">
								<Col xs={12} md={6}>
									<div className="form-group">
										<label className="form-label fw-semibold text-muted mb-2 fs-7 fs-md-6">
											Base URL
										</label>
										<input
											type="text"
											className="form-control border-2 rounded-3 fs-7 fs-md-6"
											value={utmBaseUrl}
											onChange={(e) => setUtmBaseUrl(e.target.value)}
										/>
									</div>
								</Col>
								<Col xs={12} md={6}>
									<div className="form-group">
										<label className="form-label fw-semibold text-muted mb-2 fs-7 fs-md-6">
											UTM Source
										</label>
										<select
											className="form-select border-2 rounded-3 fs-7 fs-md-6"
											value={utmSource}
											onChange={(e) => setUtmSource(e.target.value)}
										>
											<option value="facebook">Facebook</option>
											<option value="instagram">Instagram</option>
											<option value="twitter">Twitter</option>
											<option value="linkedin">LinkedIn</option>
											<option value="youtube">YouTube</option>
											<option value="tiktok">TikTok</option>
											<option value="google">Google</option>
											<option value="email">Email</option>
											<option value="whatsapp">WhatsApp</option>
											<option value="telegram">Telegram</option>
										</select>
									</div>
								</Col>
								<Col xs={12} md={6}>
									<div className="form-group">
										<label className="form-label fw-semibold text-muted mb-2 fs-7 fs-md-6">
											UTM Medium
										</label>
										<select
											className="form-select border-2 rounded-3 fs-7 fs-md-6"
											value={utmMedium}
											onChange={(e) => setUtmMedium(e.target.value)}
										>
											<option value="social">
												Social (Unpaid Social Media)
											</option>
											<option value="paid_social">
												Paid Social (Social Ads)
											</option>
											<option value="cpc">CPC (Paid Search)</option>
											<option value="email">
												Email (Campaigns & Newsletters)
											</option>
											<option value="referral">
												Referral (Other Websites)
											</option>
											<option value="affiliate">
												Affiliate (Partnership Marketing)
											</option>
											<option value="display">
												Display (Banner & Programmatic Ads)
											</option>
											<option value="organic">Organic (Unpaid Search)</option>
										</select>
									</div>
								</Col>
								<Col xs={12} md={6}>
									<div className="form-group">
										<label className="form-label fw-semibold text-muted mb-2 fs-7 fs-md-6">
											UTM Campaign
										</label>
										<select
											className="form-select border-2 rounded-3 fs-7 fs-md-6"
											value={utmCampaign}
											onChange={(e) => setUtmCampaign(e.target.value)}
										>
											<option value="">
												Select a campaign or type custom...
											</option>
											<option value="summer_sale">Summer Sale</option>
											<option value="black_friday">Black Friday</option>
											<option value="new_product_launch">
												New Product Launch
											</option>
											<option value="holiday_promo">Holiday Promotion</option>
											<option value="webinar_series">Webinar Series</option>
											<option value="buyer_signup">Buyer Signup</option>
											<option value="brand_awareness">Brand Awareness</option>
											<option value="lead_generation">Lead Generation</option>
											<option value="seasonal_campaign">
												Seasonal Campaign
											</option>
											<option value="newsletter_signup">
												Newsletter Signup
											</option>
											<option value="product_launch">Product Launch</option>
											<option value="discount_offer">Discount Offer</option>
											<option value="referral_program">Referral Program</option>
											<option value="social_media_campaign">
												Social Media Campaign
											</option>
											<option value="email_campaign">Email Campaign</option>
											<option value="affiliate_campaign">
												Affiliate Campaign
											</option>
											<option value="influencer_campaign">
												Influencer Campaign
											</option>
											<option value="retargeting_campaign">
												Retargeting Campaign
											</option>
											<option value="custom">
												Custom Campaign (Type Below)
											</option>
										</select>
									</div>
								</Col>

								{utmCampaign === "custom" && (
									<Col xs={12}>
										<div className="form-group">
											<label className="form-label fw-semibold text-muted mb-2 fs-7 fs-md-6">
												Custom Campaign Name
											</label>
											<input
												type="text"
												className="form-control border-2 rounded-3 fs-7 fs-md-6"
												placeholder="e.g., my_custom_campaign"
												value={customCampaign}
												onChange={(e) => setCustomCampaign(e.target.value)}
											/>
											<div className="form-text text-muted mt-2 fs-8 fs-md-7">
												Use lowercase letters and underscores instead of spaces
											</div>
										</div>
									</Col>
								)}

								<Col xs={12}>
									<div className="d-flex gap-2 gap-md-3 justify-content-center flex-wrap">
										<Button
											variant="primary"
											className="px-3 px-md-4 py-2 rounded-3 fs-7 fs-md-6"
											onClick={generateUtmUrl}
										>
											Generate URL
										</Button>
										<Button
											variant="outline-secondary"
											className="px-3 px-md-4 py-2 rounded-3 fs-7 fs-md-6"
											onClick={copyToClipboard}
											disabled={!generatedUrl}
										>
											Copy URL
										</Button>
									</div>
								</Col>

								<Col xs={12}>
									<div className="form-group">
										<label className="form-label fw-semibold text-muted mb-2 fs-7 fs-md-6">
											Generated URL
										</label>
										<div className="input-group">
											<input
												type="text"
												className="form-control border-2 rounded-start-3 fs-7 fs-md-6"
												value={generatedUrl}
												placeholder="Click Generate to create URL"
												readOnly
											/>
											<Button
												variant="outline-primary"
												className="rounded-end-3 fs-7 fs-md-6"
												onClick={copyToClipboard}
												disabled={!generatedUrl}
											>
												<FaCopy />
											</Button>
										</div>
									</div>
								</Col>
							</Row>
						</div>
					)}
				</Card.Body>
			</Card>

			{/* Toast Notification */}
			<ToastContainer position="top-end" className="p-3">
				<Toast
					show={showToast}
					onClose={() => setShowToast(false)}
					delay={3000}
					autohide
					className="bg-success text-white"
				>
					<Toast.Header className="bg-success text-white">
						<FaCopy className="me-2" />
						<strong className="me-auto">Success</strong>
					</Toast.Header>
					<Toast.Body>URL copied to clipboard!</Toast.Body>
				</Toast>
			</ToastContainer>
		</div>
	);
};

// PropTypes for better documentation and type checking
UTMCampaignURLGenerator.propTypes = {
	baseUrl: PropTypes.string,
	onUrlGenerated: PropTypes.func,
	className: PropTypes.string,
	showTemplates: PropTypes.bool,
	showBuilder: PropTypes.bool,
	showDocumentation: PropTypes.bool,
};

export default UTMCampaignURLGenerator;
