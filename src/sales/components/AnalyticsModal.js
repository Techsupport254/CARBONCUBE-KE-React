import React from "react";
import { Modal } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
// Removed unused trending icons
import { calculateGrowthAndTrend } from "../utils/dashboardHelpers";

const AnalyticsModal = ({
	show,
	onHide,
	selectedCard,
	dateFilter,
	onDateFilterChange,
	customStartDate,
	customEndDate,
	onCustomStartDateChange,
	onCustomEndDateChange,
	generateTrendData,
	getFilterKey,
	memoizedFilteredData,
	analytics,
}) => {
	if (!selectedCard) return null;

	// Get timestamps for the selected card
	const getTimestampsForCard = () => {
		const dataSource = memoizedFilteredData || analytics;
		if (!dataSource) return [];

		switch (selectedCard?.title) {
			case "Total Sellers":
				return dataSource.sellers_with_timestamps || [];
			case "Total Buyers":
				return dataSource.buyers_with_timestamps || [];
			case "Total Reviews":
				return dataSource.reviews_with_timestamps || [];
			case "Total Ads":
				return dataSource.ads_with_timestamps || [];
			case "Total Wishlists":
				return dataSource.wishlists_with_timestamps || [];
			case "Total Ads Clicks":
				return dataSource.ad_clicks_with_timestamps || [];
			default:
				return dataSource.sellers_with_timestamps || [];
		}
	};

	const timestamps = getTimestampsForCard();
	// Calculate growth/trend for potential future display
	const { growthRate, trend } = calculateGrowthAndTrend(
		analytics,
		timestamps,
		dateFilter,
		customStartDate,
		customEndDate
	);

	// No direct render usage currently; keep computed values for debugging hooks
	void growthRate; // linter: acknowledge variable
	void trend; // linter: acknowledge variable

	// Removed unused helper functions

	return (
		<Modal
			show={show}
			onHide={onHide}
			size="xl"
			className="analytics-modal"
			style={{ backdropFilter: "blur(10px)" }}
		>
			<Modal.Header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white border-0 relative">
				<div className="w-full">
					{/* Title Row */}
					<div className="mb-4 sm:mb-6">
						<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
							{selectedCard?.title} Analytics
						</h2>
						<p className="text-blue-100 text-sm sm:text-base mt-1">
							Performance insights and trend analysis
						</p>
					</div>

					{/* Count and Controls Row */}
					<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pr-16">
						{/* Count Display */}
						<div className="flex items-center gap-3">
							<div className="text-center lg:text-left">
								<div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
									{(memoizedFilteredData
										? memoizedFilteredData[getFilterKey(selectedCard?.title)] ||
										  0
										: selectedCard?.value || 0
									).toLocaleString()}
								</div>
								<div className="text-blue-100 text-sm sm:text-base">
									Total Count
								</div>
							</div>
						</div>

						{/* Date Filter Controls */}
						<div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
							<div className="relative">
								<select
									value={dateFilter}
									onChange={(e) => onDateFilterChange(e.target.value)}
									className="w-full sm:w-auto px-3 py-2 pr-8 bg-white bg-opacity-30 text-gray-800 border border-white border-opacity-30 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 appearance-none cursor-pointer"
								>
									<option value="all">All Time</option>
									<option value="today">Today</option>
									<option value="week">Last 7 Days</option>
									<option value="month">Last 30 Days</option>
									<option value="year">Last Year</option>
									<option value="custom">Custom Range</option>
								</select>
								{/* Custom dropdown arrow */}
								<div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
									<svg
										className="w-4 h-4 text-gray-800"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</div>

							{dateFilter === "custom" && (
								<div className="flex flex-row items-center gap-2 w-full sm:w-auto">
									<input
										type="date"
										value={customStartDate}
										onChange={(e) => onCustomStartDateChange(e.target.value)}
										className="w-full sm:w-auto px-3 py-2 bg-white bg-opacity-70 text-gray-800 border border-white border-opacity-30 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
									/>
									<span className="text-white text-center sm:text-left">
										to
									</span>
									<input
										type="date"
										value={customEndDate}
										onChange={(e) => onCustomEndDateChange(e.target.value)}
										className="w-full sm:w-auto px-3 py-2 bg-white bg-opacity-70 text-gray-800 border border-white border-opacity-30 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
									/>
								</div>
							)}

							<button
								className="w-full sm:w-auto px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-all duration-200 font-medium"
								onClick={() => {
									onDateFilterChange("all");
									onCustomStartDateChange("");
									onCustomEndDateChange("");
								}}
							>
								Reset
							</button>
						</div>
					</div>
				</div>

				{/* Close Button */}
				<button
					onClick={onHide}
					className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 p-2 z-20"
					aria-label="Close modal"
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</Modal.Header>
			<Modal.Body className="p-2 bg-gray-50 w-full">
				{/* Big Trend Chart */}
				<div className="w-full mx-auto bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 lg:mb-8 gap-4">
						<div>
							<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
								{selectedCard?.title} Trend Analysis
							</h3>
							<p className="text-sm sm:text-base text-gray-600 mt-1">
								{dateFilter === "today"
									? "Performance by hour today"
									: dateFilter === "week"
									? "Performance over the last 7 days"
									: dateFilter === "month"
									? "Performance over the last 4 weeks"
									: dateFilter === "year"
									? "Performance over the last 12 months"
									: dateFilter === "custom"
									? "Performance for selected period"
									: "Performance over the last 30 days"}
							</p>
						</div>
					</div>

					{/* Big Chart */}
					<div className="h-64 sm:h-80 lg:h-96 w-full">
						<Bar
							data={{
								labels: generateTrendData().labels,
								datasets: [
									{
										label: selectedCard?.title || "Data",
										data: generateTrendData().data.map((value) =>
											Math.round(value)
										),
										backgroundColor: "rgba(59, 130, 246, 0.8)",
										borderColor: "rgba(59, 130, 246, 1)",
										borderWidth: 2,
										borderRadius: 8,
										hoverBackgroundColor: "rgba(59, 130, 246, 1)",
									},
								],
							}}
							options={{
								responsive: true,
								maintainAspectRatio: false,
								plugins: {
									legend: {
										display: false,
									},
									tooltip: {
										backgroundColor: "rgba(0, 0, 0, 0.8)",
										titleColor: "white",
										bodyColor: "white",
										borderRadius: 8,
										displayColors: false,
									},
								},
								scales: {
									y: {
										beginAtZero: true,
										grid: {
											color: "rgba(0, 0, 0, 0.1)",
										},
										ticks: {
											color: "rgba(0, 0, 0, 0.6)",
											font: {
												size: 12,
											},
										},
									},
									x: {
										grid: {
											display: false,
										},
										ticks: {
											color: "rgba(0, 0, 0, 0.6)",
											font: {
												size: 12,
											},
										},
									},
								},
							}}
						/>
					</div>
				</div>
				{/* Source Breakdown (when available) */}
				{(() => {
					const dataSource = memoizedFilteredData || analytics;
					const dist = dataSource?.source_distribution;
					const total = dataSource?.total_visits || 0;
					if (!dist || total === 0) return null;

					const entries = Object.entries(dist).sort((a, b) => b[1] - a[1]);

					const formatLabel = (source) => {
						if (source === "direct") return "Direct";
						if (source === "facebook") return "Facebook";
						return source;
					};

					return (
						<div className="w-full mx-auto bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg mt-4">
							<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4">
								Source Breakdown
							</h3>
							<div className="space-y-3">
								{entries.map(([source, count], index) => {
									const pct = Math.round((count / total) * 100);
									return (
										<div key={index} className="space-y-1">
											<div className="flex items-center justify-between">
												<span className="text-sm sm:text-base font-medium text-gray-700 capitalize">
													{formatLabel(source)}
												</span>
												<span className="text-sm sm:text-base font-semibold text-gray-800">
													{count.toLocaleString()} ({pct}%)
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
												<div
													className="h-2 sm:h-3 rounded-full transition-all duration-300 bg-blue-500"
													style={{ width: `${pct}%` }}
												></div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					);
				})()}
			</Modal.Body>
		</Modal>
	);
};

export default AnalyticsModal;
