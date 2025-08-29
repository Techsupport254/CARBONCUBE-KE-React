import React from "react";
import { Row, Col } from "react-bootstrap";
import UTMCampaignTracking from "../../components/UTMCampaignTracking";

const UTMCampaignTrackingSection = ({ sourceAnalytics }) => {
	if (!sourceAnalytics) {
		return null;
	}

	return (
		<Row className="mt-4 g-4 mb-5">
			<Col xs={12}>
				<UTMCampaignTracking
					utmData={sourceAnalytics}
					className="custom-card"
				/>
			</Col>
		</Row>
	);
};

export default UTMCampaignTrackingSection;
