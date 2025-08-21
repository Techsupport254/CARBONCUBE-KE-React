import React from "react";
import { Modal } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { IoMdTrendingUp } from "react-icons/io";
import { HiTrendingDown } from "react-icons/hi";
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
	const { growthRate, trend } = calculateGrowthAndTrend(
		analytics,
		timestamps,
		dateFilter,
		customStartDate,
		customEndDate
	);

	// Helper functions for calculations
	const calculateGrowthRate = () => {
		return parseFloat(growthRate) || 0;
	};

	const calculateConversionRate = () => {
		// This would need to be implemented based on your business logic
		return Math.round(Math.random() * 100);
	};

	const calculateTrendDirection = () => {
		return trend;
	};

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

							{/* Growth Badge */}
							<div
								className={`flex items-center gap-1 px-3 py-2 rounded-lg ${
									calculateGrowthRate() >= 0
										? "bg-green-100 text-green-700"
										: "bg-red-100 text-red-700"
								}`}
							>
								{calculateGrowthRate() >= 0 ? (
									<IoMdTrendingUp className="w-4 h-4" />
								) : (
									<HiTrendingDown className="w-4 h-4" />
								)}
								<span className="text-sm font-semibold">
									{calculateGrowthRate() >= 0 ? "+" : ""}
									{calculateGrowthRate()}%
								</span>
							</div>
						</div>

						{/* Date Filter Controls */}
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
							<div className="relative w-full sm:w-auto">
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
								<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
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
			<Modal.Body className="p-0 bg-gray-50">
				{/* Hero Section */}
				<div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 text-center">
					{dateFilter !== "all" && (
						<div className="mb-4 sm:mb-6">
							<div className="text-sm sm:text-base text-gray-500 bg-white bg-opacity-50 rounded-full px-4 py-2 inline-block">
								{dateFilter === "custom"
									? `Custom Range: ${customStartDate} to ${customEndDate}`
									: `Filtered: ${
											dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1)
									  }`}
							</div>
						</div>
					)}

					{/* Big Trend Chart */}
					<div className="w-full max-w-5xl mx-auto bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
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
				</div>

				{/* Analytics Grid */}
				<div className="p-4 sm:p-6 lg:p-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
						{/* Key Metrics Card */}
						<div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
							<div className="flex items-center justify-between mb-4 sm:mb-6">
								<h6 className="text-lg sm:text-xl font-semibold text-gray-800">
									Key Metrics
								</h6>
								<div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
									<svg
										className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
									</svg>
								</div>
							</div>
							<div className="space-y-3 sm:space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-sm sm:text-base text-gray-600">
										Growth Rate
									</span>
									<span
										className={`text-sm sm:text-base font-semibold ${
											calculateGrowthRate() >= 0
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										{calculateGrowthRate() >= 0 ? "+" : ""}
										{calculateGrowthRate()}%
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm sm:text-base text-gray-600">
										Conversion
									</span>
									<span className="text-sm sm:text-base font-semibold text-blue-600">
										{calculateConversionRate()}%
									</span>
								</div>
							</div>
						</div>

						{/* Status Card */}
						<div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
							<div className="flex items-center justify-between mb-4 sm:mb-6">
								<h6 className="text-lg sm:text-xl font-semibold text-gray-800">
									Status
								</h6>
								<div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
									<svg
										className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
							</div>
							<div className="space-y-3 sm:space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-sm sm:text-base text-gray-600">
										Status
									</span>
									<span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
										Active
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm sm:text-base text-gray-600">
										Last Updated
									</span>
									<span className="text-sm sm:text-base font-semibold text-gray-800">
										{new Date().toLocaleDateString()}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm sm:text-base text-gray-600">
										Trend
									</span>
									<span
										className={`text-sm sm:text-base font-semibold flex items-center gap-1 ${
											calculateTrendDirection().color
										}`}
									>
										{calculateTrendDirection().direction === "increasing" ? (
											<IoMdTrendingUp className="w-4 h-4" />
										) : calculateTrendDirection().direction === "decreasing" ? (
											<HiTrendingDown className="w-4 h-4" />
										) : (
											<svg
												className="w-4 h-4"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
													clipRule="evenodd"
												/>
											</svg>
										)}
										{calculateTrendDirection().direction}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default AnalyticsModal;
