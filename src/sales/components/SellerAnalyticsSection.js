import React from "react";
import { Row } from "react-bootstrap";
import DashboardCharts from "./DashboardCharts";

const SellerAnalyticsSection = ({ analytics }) => {
	return (
		<Row className="g-6">
			<h3 className="pt-5 fw-bold">Seller related </h3>
			<DashboardCharts
				pieData={{
					labels: ["Active Subscriptions", "Inactive Subscriptions"],
					datasets: [
						{
							label: "Sellers",
							data: [
								analytics.subscription_countdowns,
								analytics.without_subscription,
							],
							backgroundColor: ["#4caf50", "#f44336"],
							borderColor: ["#fff", "#fff"],
							borderWidth: 2,
						},
					],
				}}
				buyerAdClickBarData={{
					labels: ["Cummulative Ad Clicks"],
					datasets: [
						{
							label: "Total Ad Clicks",
							data: [analytics.buyer_ad_clicks],
							backgroundColor: "rgba(54, 162, 235, 0.6)",
							borderColor: "rgba(54, 162, 235, 1)",
							borderWidth: 1,
						},
					],
				}}
				analytics={analytics}
			/>
		</Row>
	);
};

export default SellerAnalyticsSection;
