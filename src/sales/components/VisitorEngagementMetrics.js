import React from "react";
import { Col } from "react-bootstrap";
import { FaUsers, FaRedo, FaUserPlus, FaChartLine } from "react-icons/fa";

const VisitorEngagementMetrics = ({
	memoizedFilteredSourceData,
	onVisitorMetricClick,
}) => {
	const metrics = [
		{
			title: "Unique Visitors",
			value: memoizedFilteredSourceData?.unique_visitors || 0,
			icon: <FaUsers />,
			color: "text-success",
			description: "Individual users",
			clickable: true,
			key: "unique_visitors",
		},
		{
			title: "Returning Visitors",
			value: memoizedFilteredSourceData?.returning_visitors || 0,
			icon: <FaRedo />,
			color: "text-warning",
			description: "Repeat visitors",
			clickable: false,
			key: "returning_visitors",
		},
		{
			title: "New Visitors",
			value: memoizedFilteredSourceData?.new_visitors || 0,
			icon: <FaUserPlus />,
			color: "text-info",
			description: "First-time visitors",
			clickable: true,
			key: "new_visitors",
		},
		{
			title: "Avg Visits/Visitor",
			value: memoizedFilteredSourceData?.avg_visits_per_visitor || 0,
			icon: <FaChartLine />,
			color: "text-primary",
			description: "Engagement rate",
			clickable: false,
			key: "avg_visits_per_visitor",
		},
	];

	const handleCardClick = (metric) => {
		if (metric.clickable && onVisitorMetricClick) {
			onVisitorMetricClick(metric);
		}
	};

	return (
		<>
			{metrics.map((metric, index) => (
				<Col xs={12} sm={6} lg={3} key={index}>
					<div
						className={`stat-card p-3 rounded shadow-sm bg-white h-100 transition-all duration-300 ${
							metric.clickable
								? "cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-lg border-2 border-transparent hover:border-blue-200"
								: "cursor-default"
						}`}
						onClick={() => handleCardClick(metric)}
					>
						<div className="d-flex justify-content-between align-items-center mb-2">
							<h6 className="mb-0 fw-semibold text-muted">{metric.title}</h6>
							<div className={metric.color}>{metric.icon}</div>
						</div>
						<h3 className={`fw-bold ${metric.color}`}>
							{metric.value.toLocaleString()}
						</h3>
						<small className="text-muted">{metric.description}</small>
						{metric.clickable && (
							<div className="mt-2">
								<small className="text-primary fw-semibold">
									Click to view details →
								</small>
							</div>
						)}
					</div>
				</Col>
			))}
		</>
	);
};

export default VisitorEngagementMetrics;
