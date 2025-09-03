import React from "react";
import { Card } from "react-bootstrap";
import { Pie } from "react-chartjs-2";

const SourceDistributionChart = ({ sourceAnalytics, getSourceBrandColor }) => {
	// Use source_distribution from original data
	const sourceData = sourceAnalytics.source_distribution || {};

	// Convert to array and sort by count descending, take top 10
	const sortedSources = Object.entries(sourceData)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 10);

	return (
		<Card className="p-3 shadow-sm custom-card h-100">
			<Card.Header className="text-center fw-bold">
				Source Distribution Chart
			</Card.Header>
			<Card.Body>
				{sortedSources.length > 0 ? (
					<div className="d-flex justify-content-center">
						<Pie
							data={{
								labels: sortedSources.map(([source]) =>
									source === "direct"
										? "Direct"
										: source === "facebook"
										? "Facebook"
										: source.charAt(0).toUpperCase() + source.slice(1)
								),
								datasets: [
									{
										data: sortedSources.map(([, count]) => count),
										backgroundColor: sortedSources.map(([source]) =>
											getSourceBrandColor(source)
										),
										borderColor: "#fff",
										borderWidth: 2,
									},
								],
							}}
							options={{
								responsive: true,
								maintainAspectRatio: false,
								plugins: {
									legend: {
										position: "bottom",
										labels: {
											padding: 20,
											usePointStyle: true,
										},
									},
								},
							}}
							height={300}
						/>
					</div>
				) : (
					<div className="text-center text-muted py-5">
						No source data available
					</div>
				)}
			</Card.Body>
		</Card>
	);
};

export default SourceDistributionChart;
