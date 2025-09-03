import React from "react";
import { Row, Col } from "react-bootstrap";
import DeviceTypesCard from "./DeviceTypesCard";
import BrowserAnalyticsCard from "./BrowserAnalyticsCard";
import OperatingSystemsCard from "./OperatingSystemsCard";

const DeviceAnalyticsSection = ({
	analytics,
	getDeviceIcon,
	getBrowserIcon,
	getOSIcon,
}) => {
	if (!analytics?.device_analytics) {
		return null;
	}

	return (
		<Row className="mt-4 g-4">
			<Col xs={12}>
				<div className="bg-secondary text-white p-3 rounded">
					<h3 className="fw-bold mb-0 text-center">
						Device & Browser Analytics
					</h3>
				</div>
			</Col>

			{/* Device Types - Table and Chart */}
			<Col xs={12} lg={6}>
				<DeviceTypesCard
					deviceAnalytics={analytics.device_analytics}
					getDeviceIcon={getDeviceIcon}
				/>
			</Col>

			{/* Top Browsers - Table and Chart */}
			<Col xs={12} lg={6}>
				<BrowserAnalyticsCard
					deviceAnalytics={analytics.device_analytics}
					getBrowserIcon={getBrowserIcon}
				/>
			</Col>

			{/* Operating Systems - Table and Chart */}
			{/* <Col xs={12} lg={6}>
				<OperatingSystemsCard
					deviceAnalytics={analytics.device_analytics}
					getOSIcon={getOSIcon}
				/>
			</Col> */}
		</Row>
	);
};

export default DeviceAnalyticsSection;
