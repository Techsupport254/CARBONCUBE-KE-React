import React from "react";
import { Row } from "react-bootstrap";
import DashboardCard from "./DashboardCard";

const MetricsGrid = ({ analytics, onCardClick }) => {
	const metrics = [
		{ title: "Total Sellers", value: analytics.total_sellers },
		{ title: "Total Buyers", value: analytics.total_buyers },
		{ title: "Total Reviews", value: analytics.total_reviews },
		{ title: "Total Ads", value: analytics.total_ads },
		{ title: "Total Wishlists", value: analytics.total_ads_wish_listed },
		{ title: "Total Ads Clicks", value: analytics.total_ads_clicks },
		{ title: "Total Click Reveals", value: analytics.total_reveal_clicks || 0 },
	];

	return (
		<Row className="g-3">
			{metrics.map(({ title, value }, index) => (
				<DashboardCard
					key={index}
					title={title}
					value={value}
					onClick={() => onCardClick({ title, value })}
				/>
			))}
		</Row>
	);
};

export default MetricsGrid;
