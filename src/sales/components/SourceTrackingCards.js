import React from "react";
import { Col } from "react-bootstrap";
import { FaChartBar, FaFacebook, FaLink, FaSearch } from "react-icons/fa";

const SourceTrackingCards = ({
	sourceAnalytics,
	memoizedFilteredSourceData,
	onSourceCardClick,
}) => {
	if (!sourceAnalytics) {
		return <div className="text-center">Loading source analytics...</div>;
	}

	// Dynamically get all available sources from the data
	const allAvailableSources = Object.keys(
		sourceAnalytics?.source_distribution || {}
	);

	// Filter out 'direct' as it's handled separately
	const nonDirectSources = allAvailableSources.filter(
		(source) => source !== "direct"
	);

	// Calculate External as Total - Direct to ensure exact add-up
	const totalVisits = sourceAnalytics?.total_visits || 0;
	const directVisits = sourceAnalytics?.source_distribution?.direct || 0;
	const totalNonDirectVisits = Math.max(0, totalVisits - directVisits);

	// Get the top performing source (including direct)
	const getTopSource = () => {
		if (allAvailableSources.length === 0) return { name: "", count: 0 };

		const topSource = allAvailableSources.reduce((top, source) => {
			const currentCount = sourceAnalytics?.source_distribution?.[source] || 0;
			const topCount = sourceAnalytics?.source_distribution?.[top] || 0;
			return currentCount > topCount ? source : top;
		}, allAvailableSources[0]);

		return {
			name: topSource,
			count: sourceAnalytics?.source_distribution?.[topSource] || 0,
		};
	};

	const topSource = getTopSource();

	const cards = [
		{
			title: "Total Page Visits",
			value: sourceAnalytics?.total_visits || 0,
			data: sourceAnalytics?.daily_visits || {},
			icon: <FaChartBar />,
			color: "text-primary",
		},
		{
			title: "External Sources",
			value: totalNonDirectVisits,
			data: sourceAnalytics?.source_distribution || {},
			sources: nonDirectSources,
			icon: <FaFacebook />,
			color: "text-info",
		},
		{
			title: "Direct Visits",
			value: sourceAnalytics?.source_distribution?.direct || 0,
			data: {
				direct: sourceAnalytics?.source_distribution?.direct || 0,
			},
			icon: <FaLink />,
			color: "text-warning",
		},
		{
			title: "Top Source",
			value: topSource.count,
			data: sourceAnalytics?.source_distribution || {},
			sources: allAvailableSources.length > 0 ? [topSource.name] : [],
			icon: <FaSearch />,
			color: "text-success",
		},
	];

	return (
		<>
			{cards.map((card, index) => (
				<Col xs={12} sm={6} lg={3} key={index}>
					<div
						className="stat-card p-3 rounded shadow-sm bg-white h-100"
						style={{ cursor: "pointer" }}
						onClick={() => onSourceCardClick(card)}
					>
						<div className="d-flex justify-content-between align-items-center mb-2">
							<h6 className="mb-0 fw-semibold text-muted">{card.title}</h6>
							<div className={card.color}>{card.icon}</div>
						</div>
						<h3 className={`fw-bold ${card.color}`}>
							{card.value.toLocaleString()}
						</h3>
						<small className="text-muted">
							{card.title === "Total Page Visits"
								? "Filtered by time period"
								: card.title === "External Sources"
								? `Combined traffic from ${nonDirectSources.length} sources`
								: card.title === "Direct Visits"
								? "Direct traffic"
								: card.title === "Top Source"
								? allAvailableSources.length > 0
									? `Most popular: ${topSource.name}`
									: "No external sources"
								: "Analytics"}
						</small>
					</div>
				</Col>
			))}
		</>
	);
};

export default SourceTrackingCards;
