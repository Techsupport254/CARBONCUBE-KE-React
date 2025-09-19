import React from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

const CategoryClickEvents = ({ data = [] }) => {
	if (!Array.isArray(data) || data.length === 0) {
		return <div className="text-center">Loading category analytics...</div>;
	}

	// Helper to calculate total clicks per category
	const totalClicks = (category) =>
		(category.ad_clicks || 0) +
		(category.wish_list_clicks || 0) +
		(category.reveal_clicks || 0);

	// Prepare chart data for each category
	const getChartData = (category) => {
		const total = totalClicks(category);
		return {
			labels: [],
			datasets: [
				{
					data: [
						total > 0 ? ((category.ad_clicks / total) * 100).toFixed(2) : 0,
						total > 0
							? ((category.wish_list_clicks / total) * 100).toFixed(2)
							: 0,
						total > 0 ? ((category.reveal_clicks / total) * 100).toFixed(2) : 0,
					],
					backgroundColor: ["#919191", "#FF9800", "#363636"],
				},
			],
		};
	};

	// Chart config
	const chartOptions = (category) => {
		const total = totalClicks(category);
		return {
			cutout: "70%",
			plugins: {
				legend: { display: false },
				tooltip: {
					callbacks: {
						label: (context) => {
							const index = context.dataIndex;
							const labels = ["Ad Clicks", "Wish List Clicks", "Reveal Clicks"];
							const values = [
								category.ad_clicks || 0,
								category.wish_list_clicks || 0,
								category.reveal_clicks || 0,
							];
							const percentages = values.map((v) =>
								total > 0 ? ((v / total) * 100).toFixed(2) : 0
							);

							return `${labels[index]}: ${values[index]} (${percentages[index]}%)`;
						},
					},
				},
			},
		};
	};

	// Optional: Total reveal clicks across all categories
	const totalRevealClicks = data.reduce(
		(sum, category) => sum + (category.reveal_clicks || 0),
		0
	);

	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{data.map((category, index) => (
					<div key={index} className="text-center">
						<div className="h-24 w-24 mx-auto mb-2">
							<Doughnut
								data={getChartData(category)}
								options={chartOptions(category)}
							/>
						</div>
						<div className="mt-2">
							<p className="font-bold text-sm">{category.category_name}</p>
						</div>
					</div>
				))}
			</div>

			{/* Shared Legend */}
			<div className="flex justify-center gap-6 mt-6 mb-4">
				<div className="flex items-center gap-2">
					<div
						className="w-4 h-4 rounded-full"
						style={{ backgroundColor: "#919191" }}
					></div>
					<div className="text-sm font-medium">Ad Click</div>
				</div>
				<div className="flex items-center gap-2">
					<div
						className="w-4 h-4 rounded-full"
						style={{ backgroundColor: "#FF9800" }}
					></div>
					<div className="text-sm font-medium">Wish List</div>
				</div>
				<div className="flex items-center gap-2">
					<div
						className="w-4 h-4 rounded-full"
						style={{ backgroundColor: "#363636" }}
					></div>
					<div className="text-sm font-medium">Reveal Click</div>
				</div>
			</div>

			{/* Optional: Display total reveal clicks */}
			<div className="text-center mt-3">
				<strong className="text-gray-700">
					Total Reveal Clicks Across All Categories: {totalRevealClicks}
				</strong>
			</div>
		</div>
	);
};

export default CategoryClickEvents;
