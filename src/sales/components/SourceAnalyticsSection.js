import React from "react";
import { Row, Col } from "react-bootstrap";
import SourceTrackingCards from "./SourceTrackingCards";

const SourceAnalyticsSection = ({ sourceAnalytics, memoizedFilteredSourceData, onSourceCardClick }) => {
	return (
		<Row className="mt-4 g-4 mb-5">
			<Col xs={12}>
				<h3 className="pt-1 fw-bold pb-3">
					Source Tracking Analytics
				</h3>
			</Col>
			<SourceTrackingCards
				sourceAnalytics={sourceAnalytics}
				memoizedFilteredSourceData={memoizedFilteredSourceData}
				onSourceCardClick={onSourceCardClick}
			/>
		</Row>
	);
};

export default SourceAnalyticsSection;
