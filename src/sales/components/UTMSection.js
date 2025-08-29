import React from "react";
import { Row, Col } from "react-bootstrap";
import UTMCampaignURLGenerator from "../../components/UTMCampaignURLGenerator";

const UTMSection = () => {
	return (
		<Row className="mt-4 g-4 mb-5">
			<Col xs={12}>
				<UTMCampaignURLGenerator
					baseUrl={window.location.origin}
					onUrlGenerated={(url) => {}}
				/>
			</Col>
		</Row>
	);
};

export default UTMSection;
