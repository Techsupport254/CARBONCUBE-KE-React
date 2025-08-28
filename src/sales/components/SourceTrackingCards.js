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

	const socialSources = [
		"facebook",
		"whatsapp",
		"telegram",
		"twitter",
		"instagram",
		"linkedin",
		"youtube",
		"tiktok",
		"snapchat",
		"pinterest",
		"reddit",
	];

	const socialVisits = socialSources.reduce((total, source) => {
		return total + (sourceAnalytics?.source_distribution?.[source] || 0);
	}, 0);

	const searchEngineSources = ["google", "bing", "yahoo"];
	const searchEngineVisits = searchEngineSources.reduce((total, source) => {
		return total + (sourceAnalytics?.source_distribution?.[source] || 0);
	}, 0);

	const cards = [
		{
			title: "Total Page Visits",
			value: sourceAnalytics?.total_visits || 0,
			data: sourceAnalytics?.daily_visits || {},
			icon: <FaChartBar />,
			color: "text-primary",
		},
		{
			title: "Social Media Visits",
			value: socialVisits,
			data: sourceAnalytics?.source_distribution || {},
			sources: socialSources,
			icon: <FaFacebook />,
			color: "text-info",
		},
		{
			title: "Direct Visits",
			value: sourceAnalytics?.source_distribution?.direct || 0,
			data: { direct: sourceAnalytics?.source_distribution?.direct || 0 },
			icon: <FaLink />,
			color: "text-warning",
		},
		{
			title: "Search Engine Visits",
			value: searchEngineVisits,
			data: sourceAnalytics?.source_distribution || {},
			sources: searchEngineSources,
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
								? "All time"
								: card.title === "Social Media Visits"
								? "Combined social traffic"
								: card.title === "Direct Visits"
								? "Direct traffic"
								: card.title === "Search Engine Visits"
								? "Organic search"
								: "Analytics"}
						</small>
					</div>
				</Col>
			))}
		</>
	);
};

export default SourceTrackingCards;
