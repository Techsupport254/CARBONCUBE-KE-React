import React from "react";
import { Row, Col } from "react-bootstrap";
import SourceAnalyticsTable from "./SourceAnalyticsTable";
import SourceDistributionChart from "./SourceDistributionChart";

const SourceAnalyticsRow = ({ sourceAnalytics, getSourceIcon, getSourceTrend, getSourceBrandColor }) => {
	return (
		<Row className="mt-4 g-4 mb-5">
			{/* Detailed Source Analytics - Split into Left (Table) and Right (Pie Chart) */}
			<Col xs={12} lg={6}>
				<SourceAnalyticsTable 
					sourceAnalytics={sourceAnalytics} 
					getSourceIcon={getSourceIcon} 
					getSourceTrend={getSourceTrend} 
				/>
			</Col>

			{/* Right Column - Pie Chart */}
			<Col xs={12} lg={6}>
				<SourceDistributionChart 
					sourceAnalytics={sourceAnalytics} 
					getSourceBrandColor={getSourceBrandColor} 
				/>
			</Col>
		</Row>
	);
};

export default SourceAnalyticsRow;
