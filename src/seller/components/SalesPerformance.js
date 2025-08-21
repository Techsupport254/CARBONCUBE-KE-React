import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const SalesPerformance = ({ data, totalRevenue }) => {
	// Sales performance data processed successfully

	// Ensure totalRevenue is valid
	const totalRevenueValue = parseFloat(totalRevenue) || 0;

	// Sort months chronologically
	const months = Object.keys(data)
		.slice(-3)
		.sort((a, b) => new Date(a) - new Date(b));

	const createChartData = (month) => {
		const monthRevenue = parseFloat(data[month]) || 0;
		const percentage =
			totalRevenueValue > 0 ? (monthRevenue / totalRevenueValue) * 100 : 0;

		// Monthly revenue calculated successfully

		return {
			labels: [month, "Other"],
			datasets: [
				{
					data: [percentage, 100 - percentage],
					backgroundColor: ["#FFC107", "#E0E0E0"],
					hoverBackgroundColor: ["#0019FF", "#EEEEEE"],
				},
			],
		};
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		cutout: "75%",
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				callbacks: {
					label: (context) => {
						const label = context.label;
						const value = context.raw.toFixed(2);
						return `${label}: ${value}%`;
					},
				},
			},
		},
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-around",
				alignItems: "center",
				height: "auto",
			}}
		>
			{months.map((month) => (
				<div
					key={month}
					style={{ width: "30%", height: "100%", textAlign: "center" }}
				>
					<div>
						<Doughnut
							key={`${month}-chart`}
							data={createChartData(month)}
							options={chartOptions}
						/>
					</div>
					<p style={{ marginTop: "10px" }}>{month}</p>
					<p style={{ fontWeight: "bold" }}>
						<em className="analytics-ad-price-label text-success">Kshs: </em>
						<strong style={{ fontSize: "18px" }} className="text-danger">
							{data[month]
								.toString()
								.split(".")
								.map((part, index) => (
									<React.Fragment key={index}>
										{index === 0 ? (
											<span className="analytics-price-integer">
												{parseInt(part, 10).toLocaleString()}{" "}
												{/* Add commas to the integer part */}
											</span>
										) : (
											<>
												<span style={{ fontSize: "10px" }}>.</span>
												<span className="analytics-price-decimal">
													{(part || "00").padEnd(2, "0").slice(0, 2)}{" "}
													{/* Ensure two decimal points */}
												</span>
											</>
										)}
									</React.Fragment>
								))}
						</strong>
					</p>
				</div>
			))}
		</div>
	);
};

export default SalesPerformance;
