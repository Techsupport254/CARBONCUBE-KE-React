import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
	Chart as ChartJS,
	BarElement,
	ArcElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	BarElement,
	ArcElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend
);

// Age Group Chart
const BuyerAgeGroupChart = ({ data }) => {
	if (!data || typeof data !== "object") {
		return <div className="text-center">No age group data available</div>;
	}

	const chartData = {
		labels: Object.keys(data),
		datasets: [
			{
				label: "Buyers",
				data: Object.values(data),
				backgroundColor: "#FF9800",
			},
		],
	};

	const chartOptions = {
		responsive: true,
		scales: {
			y: { beginAtZero: true },
		},
		plugins: {
			legend: {
				labels: {
					usePointStyle: true, // Enables circular markers
					pointStyle: "circle", // Ensures markers are displayed as circles
					padding: 10, // Adjust padding between the label and the chart
					generateLabels: function (chart) {
						const original =
							ChartJS.defaults.plugins.legend.labels.generateLabels;
						const labels = original.call(this, chart);

						// Make the color boxes circular
						labels.forEach((label) => {
							label.pointStyle = "circle";
							label.radius = 10; // Adjust the size of the circle
						});

						return labels;
					},
				},
			},
		},
	};

	return <Bar data={chartData} options={chartOptions} />;
};

// Gender Distribution Chart
const GenderDistributionChart = ({ data }) => {
	if (!data || typeof data !== "object") {
		return (
			<div className="text-center">No gender distribution data available</div>
		);
	}

	const chartData = {
		labels: Object.keys(data),
		datasets: [
			{
				data: Object.values(data),
				backgroundColor: ["#FF6384", "#36A2EB"],
			},
		],
	};

	const chartOptions = {
		cutout: "70%", // Adjust the size of the hole in the middle
		plugins: {
			legend: {
				display: false, // Hide default legend
			},
		},
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				height: "100%",
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Doughnut
					data={chartData}
					options={chartOptions}
					style={{ width: "200px", height: "200px" }}
				/>
			</div>

			{/* Custom Legend */}
			<div
				className="mt-4"
				style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
			>
				{Object.keys(data).map((gender, index) => (
					<div
						key={index}
						style={{ display: "flex", alignItems: "center", margin: "0 10px" }}
					>
						<div
							style={{
								width: "15px",
								height: "15px",
								backgroundColor: chartData.datasets[0].backgroundColor[index],
								marginRight: "5px",
								borderRadius: "50%", // Makes it a circle
							}}
						/>
						<span style={{ fontSize: "12px" }}>{gender}</span>
					</div>
				))}
			</div>
		</div>
	);
};

// Employment Chart
const EmploymentChart = ({ data }) => {
	if (!data || !Array.isArray(data)) {
		return <div className="text-center">No employment data available</div>;
	}

	const chartData = {
		labels: data.map((item) => Object.keys(item)[0]),
		datasets: [
			{
				label: "Buyers",
				data: data.map((item) => Object.values(item)[0]),
				backgroundColor: "#FF9800",
			},
		],
	};

	const chartOptions = {
		responsive: true,
		scales: {
			y: { beginAtZero: true },
		},
		plugins: {
			legend: {
				labels: {
					usePointStyle: true, // Enables circular markers
					pointStyle: "circle", // Ensures markers are displayed as circles
					padding: 10, // Adjusts spacing between legend items
					generateLabels: function (chart) {
						const original =
							ChartJS.defaults.plugins.legend.labels.generateLabels;
						const labels = original.call(this, chart);

						labels.forEach((label) => {
							label.pointStyle = "circle"; // Forces all labels to be circular
						});

						return labels;
					},
				},
			},
		},
	};

	return <Bar data={chartData} options={chartOptions} />;
};

// Income Chart
const IncomeChart = ({ data }) => {
	if (!data || !Array.isArray(data)) {
		return <div className="text-center">No income data available</div>;
	}

	const chartData = {
		labels: data.map((i) => Object.keys(i)[0]),
		datasets: [
			{
				label: "Buyers",
				data: data.map((i) => Object.values(i)[0]),
				backgroundColor: "#FF9800",
			},
		],
	};

	const chartOptions = {
		responsive: true,
		scales: {
			y: { beginAtZero: true },
		},
		plugins: {
			legend: {
				labels: {
					usePointStyle: true, // Enables circular markers
					pointStyle: "circle", // Ensures markers are displayed as circles
					padding: 10, // Adjust padding between the label and the chart
					generateLabels: function (chart) {
						const original =
							ChartJS.defaults.plugins.legend.labels.generateLabels;
						const labels = original.call(this, chart);

						// Make the color boxes circular
						labels.forEach((label) => {
							label.pointStyle = "circle";
							label.radius = 10; // Adjust the size of the circle
						});

						return labels;
					},
				},
			},
		},
	};

	return <Bar data={chartData} options={chartOptions} />;
};

// Education Chart
const EducationChart = ({ data }) => {
	if (!data || !Array.isArray(data)) {
		return <div className="text-center">No education data available</div>;
	}

	const chartData = {
		labels: data.map((e) => Object.keys(e)[0]),
		datasets: [
			{
				data: data.map((e) => Object.values(e)[0]),
				backgroundColor: ["#3F51B5", "#919191", "#FF9800", "#363636"],
			},
		],
	};

	const chartOptions = {
		cutout: "70%", // Adjust the size of the hole in the middle (e.g., 70% of the radius)
		plugins: {
			legend: {
				display: false,
				labels: { usePointStyle: true },
				// Hide the default legend
			},
		},
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				height: "100%",
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Doughnut
					data={chartData}
					options={chartOptions}
					style={{ width: "200px", height: "200px" }}
				/>
			</div>

			{/* Custom Legend */}
			<div
				className="mt-4"
				style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
			>
				{data.map((item, index) => (
					<div
						key={index}
						style={{ display: "flex", alignItems: "center", margin: "0 10px" }}
					>
						<div
							style={{
								width: "15px",
								height: "15px",
								backgroundColor: chartData.datasets[0].backgroundColor[index],
								marginRight: "5px",
								borderRadius: "50%", // Makes it a circle
							}}
						/>
						<span style={{ fontSize: "12px" }}>{Object.keys(item)[0]}</span>
					</div>
				))}
			</div>
		</div>
	);
};

// Sector Chart
const SectorChart = ({ data }) => {
	if (!data || !Array.isArray(data)) {
		return <div className="text-center">No sector data available</div>;
	}

	const chartData = {
		labels: data.map((s) => Object.entries(s)[0][0]),
		datasets: [
			{
				label: "Buyers",
				data: data.map((s) => Object.entries(s)[0][1]),
				backgroundColor: "#FF9800",
			},
		],
	};

	const chartOptions = {
		responsive: true,
		scales: {
			y: { beginAtZero: true },
		},
		plugins: {
			legend: {
				labels: {
					usePointStyle: true, // Enables circular markers
					pointStyle: "circle", // Ensures markers are displayed as circles
					padding: 10, // Adjust padding between the label and the chart
					generateLabels: function (chart) {
						const original =
							ChartJS.defaults.plugins.legend.labels.generateLabels;
						const labels = original.call(this, chart);

						// Make the color boxes circular
						labels.forEach((label) => {
							label.pointStyle = "circle";
							label.radius = 10; // Adjust the size of the circle
						});

						return labels;
					},
				},
			},
		},
	};

	return <Bar data={chartData} options={chartOptions} />;
};

export {
	BuyerAgeGroupChart,
	GenderDistributionChart,
	EmploymentChart,
	IncomeChart,
	EducationChart,
	SectorChart,
};
