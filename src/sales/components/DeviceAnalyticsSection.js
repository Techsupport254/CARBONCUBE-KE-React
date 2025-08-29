import React from "react";
import { Row, Col } from "react-bootstrap";
import DeviceTypesCard from "./DeviceTypesCard";
import BrowserAnalyticsCard from "./BrowserAnalyticsCard";
import OperatingSystemsCard from "./OperatingSystemsCard";

const DeviceAnalyticsSection = ({ analytics, getDeviceIcon, getBrowserIcon, getOSIcon }) => {
	if (!analytics?.device_analytics) {
		return null;
	}

	return (
		<Row className="mt-4 g-4">
			<Col xs={12}>
				<h3 className="pt-1 fw-bold pb-3">
					Device & Browser Analytics
				</h3>
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
			<Col xs={12} lg={6}>
				<OperatingSystemsCard 
					deviceAnalytics={analytics.device_analytics} 
					getOSIcon={getOSIcon} 
				/>
			</Col>
		</Row>
	);
};

export default DeviceAnalyticsSection;
