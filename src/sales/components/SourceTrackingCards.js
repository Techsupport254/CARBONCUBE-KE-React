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
		memoizedFilteredSourceData?.source_distribution || {}
	);

	// Filter out 'direct' as it's handled separately
	const nonDirectSources = allAvailableSources.filter(
		(source) => source !== "direct"
	);

	// Calculate total visits for all non-direct sources
	const totalNonDirectVisits = nonDirectSources.reduce((total, source) => {
		return (
			total + (memoizedFilteredSourceData?.source_distribution?.[source] || 0)
		);
	}, 0);

	// Get the top performing source
	const getTopSource = () => {
		if (nonDirectSources.length === 0) return { name: "", count: 0 };

		const topSource = nonDirectSources.reduce((top, source) => {
			const currentCount =
				memoizedFilteredSourceData?.source_distribution?.[source] || 0;
			const topCount =
				memoizedFilteredSourceData?.source_distribution?.[top] || 0;
			return currentCount > topCount ? source : top;
		}, nonDirectSources[0]);

		return {
			name: topSource,
			count: memoizedFilteredSourceData?.source_distribution?.[topSource] || 0,
		};
	};

	const topSource = getTopSource();

	const cards = [
		{
			title: "Total Page Visits",
			value: memoizedFilteredSourceData?.total_visits || 0,
			data: memoizedFilteredSourceData?.daily_visits || {},
			icon: <FaChartBar />,
			color: "text-primary",
		},
		{
			title: "External Sources",
			value: totalNonDirectVisits,
			data: memoizedFilteredSourceData?.source_distribution || {},
			sources: nonDirectSources,
			icon: <FaFacebook />,
			color: "text-info",
		},
		{
			title: "Direct Visits",
			value: memoizedFilteredSourceData?.source_distribution?.direct || 0,
			data: {
				direct: memoizedFilteredSourceData?.source_distribution?.direct || 0,
			},
			icon: <FaLink />,
			color: "text-warning",
		},
		{
			title: "Top Source",
			value: topSource.count,
			data: memoizedFilteredSourceData?.source_distribution || {},
			sources: nonDirectSources.length > 0 ? [topSource.name] : [],
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
								? nonDirectSources.length > 0
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
