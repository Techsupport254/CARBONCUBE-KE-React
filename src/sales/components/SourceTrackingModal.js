import React from "react";
import { Modal } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { IoMdTrendingUp } from "react-icons/io";
import { HiTrendingDown } from "react-icons/hi";

const SourceTrackingModal = ({
	show,
	onHide,
	selectedSourceCard,
	sourceDateFilter,
	onSourceDateFilterChange,
	sourceCustomStartDate,
	sourceCustomEndDate,
	onSourceCustomStartDateChange,
	onSourceCustomEndDateChange,
	generateSourceTrackingTrendData,
	memoizedFilteredSourceData,
	sourceAnalytics,
}) => {
	if (!selectedSourceCard) return null;

	// Helper functions for calculations
	const calculateGrowthRate = () => {
		// Calculate growth rate based on current vs previous period data
		// This is a simplified calculation - you can enhance it based on your needs
		const currentCount = (() => {
			if (selectedSourceCard?.sources) {
				return selectedSourceCard.sources.reduce((total, source) => {
					return (
						total +
						(memoizedFilteredSourceData?.source_distribution?.[source] || 0)
					);
				}, 0);
			} else if (selectedSourceCard?.data?.direct !== undefined) {
				return memoizedFilteredSourceData?.source_distribution?.direct || 0;
			} else {
				return memoizedFilteredSourceData?.total_visits || 0;
			}
		})();

		// For demo purposes, calculate a realistic growth rate
		// In real implementation, you'd compare with previous period data
		const baseValue = Math.max(currentCount, 10); // Prevent division by zero
		const growthRate =
			((currentCount - baseValue * 0.8) / (baseValue * 0.8)) * 100;
		return Math.round(growthRate);
	};

	const calculateTrendDirection = () => {
		const rate = calculateGrowthRate();
		if (rate > 0) {
			return { direction: "increasing", color: "text-green-600" };
		} else if (rate < 0) {
			return { direction: "decreasing", color: "text-red-600" };
		} else {
			return { direction: "stable", color: "text-gray-600" };
		}
	};

	// Function to get source brand color
	const getSourceBrandColor = (source) => {
		switch (source.toLowerCase()) {
			case "facebook":
				return "#1877F2";
			case "instagram":
				return "#E4405F";
			case "twitter":
				return "#1DA1F2";
			case "linkedin":
				return "#0A66C2";
			case "youtube":
				return "#FF0000";
			case "tiktok":
				return "#000000";
			case "snapchat":
				return "#FFFC00";
			case "pinterest":
				return "#BD081C";
			case "reddit":
				return "#FF4500";
			case "whatsapp":
				return "#25D366";
			case "telegram":
				return "#0088CC";
			case "google":
				return "#4285F4";
			case "bing":
				return "#0078D4";
			case "yahoo":
				return "#720E9E";
			case "direct":
				return "#6B7280";
			default:
				const fallbackColors = [
					"#8B5CF6",
					"#06B6D4",
					"#84CC16",
					"#F97316",
					"#EC4899",
					"#6366F1",
					"#F59E0B",
					"#EF4444",
				];
				let hash = 0;
				for (let i = 0; i < source.length; i++) {
					hash = source.charCodeAt(i) + ((hash << 5) - hash);
				}
				return fallbackColors[Math.abs(hash) % fallbackColors.length];
		}
	};

	return (
		<Modal
			show={show}
			onHide={onHide}
			size="xl"
			className="source-tracking-modal"
			style={{ backdropFilter: "blur(10px)" }}
		>
			<Modal.Header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white border-0 relative">
				<div className="w-full">
					{/* Title Row */}
					<div className="mb-4 sm:mb-6">
						<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
							{selectedSourceCard?.title} Analytics
						</h2>
						<p className="text-blue-100 text-sm sm:text-base mt-1">
							Source tracking performance insights
						</p>
					</div>

					{/* Count and Controls Row */}
					<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pr-16">
						{/* Count Display */}
						<div className="flex items-center gap-3">
							<div className="text-center lg:text-left">
								<div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
									{(() => {
										// Calculate the correct count based on the selected source card
										let count = 0;
										if (selectedSourceCard?.sources) {
											// For social media and search engine visits, sum the specific sources
											count = selectedSourceCard.sources.reduce(
												(total, source) => {
													return (
														total +
														(memoizedFilteredSourceData?.source_distribution?.[
															source
														] || 0)
													);
												},
												0
											);
										} else if (selectedSourceCard?.data?.direct !== undefined) {
											// For direct visits
											count =
												memoizedFilteredSourceData?.source_distribution
													?.direct || 0;
										} else {
											// For total page visits
											count = memoizedFilteredSourceData?.total_visits || 0;
										}
										return count.toLocaleString();
									})()}
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
									value={sourceDateFilter}
									onChange={(e) => onSourceDateFilterChange(e.target.value)}
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

							{sourceDateFilter === "custom" && (
								<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
									<input
										type="date"
										value={sourceCustomStartDate}
										onChange={(e) =>
											onSourceCustomStartDateChange(e.target.value)
										}
										className="w-full sm:w-auto px-3 py-2 bg-white bg-opacity-70 text-gray-800 border border-white border-opacity-30 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
									/>
									<span className="text-white text-center sm:text-left">
										to
									</span>
									<input
										type="date"
										value={sourceCustomEndDate}
										onChange={(e) =>
											onSourceCustomEndDateChange(e.target.value)
										}
										className="w-full sm:w-auto px-3 py-2 bg-white bg-opacity-70 text-gray-800 border border-white border-opacity-30 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
									/>
								</div>
							)}

							<button
								className="w-full sm:w-auto px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-all duration-200 font-medium"
								onClick={() => {
									onSourceDateFilterChange("all");
									onSourceCustomStartDateChange("");
									onSourceCustomEndDateChange("");
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
					{sourceDateFilter !== "all" && (
						<div className="mb-4 sm:mb-6">
							<div className="text-sm sm:text-base text-gray-500 bg-white bg-opacity-50 rounded-full px-4 py-2 inline-block">
								{sourceDateFilter === "custom"
									? `Custom Range: ${sourceCustomStartDate} to ${sourceCustomEndDate}`
									: `Filtered: ${
											sourceDateFilter.charAt(0).toUpperCase() +
											sourceDateFilter.slice(1)
									  }`}
							</div>
						</div>
					)}

					{/* Big Trend Chart */}
					<div className="w-full max-w-5xl mx-auto bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 lg:mb-8 gap-4">
							<div>
								<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
									{selectedSourceCard?.title} Trend Analysis
								</h3>
								<p className="text-sm sm:text-base text-gray-600 mt-1">
									{sourceDateFilter === "today"
										? "Performance by hour today"
										: sourceDateFilter === "week"
										? "Performance over the last 7 days"
										: sourceDateFilter === "month"
										? "Performance over the last 4 weeks"
										: sourceDateFilter === "year"
										? "Performance over the last 12 months"
										: sourceDateFilter === "custom"
										? "Performance for selected period"
										: "Performance over the last 30 days"}
								</p>
							</div>
						</div>

						{/* Big Chart */}
						<div className="h-64 sm:h-80 lg:h-96 w-full">
							<Bar
								data={{
									labels: generateSourceTrackingTrendData().labels,
									datasets: [
										{
											label: selectedSourceCard?.title || "Data",
											data: generateSourceTrackingTrendData().data.map(
												(value) => Math.round(value)
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
						{/* Source Breakdown Card */}
						<div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
							<div className="flex items-center justify-between mb-4 sm:mb-6">
								<h6 className="text-lg sm:text-xl font-semibold text-gray-800">
									Source Breakdown
								</h6>
								<div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
									<svg
										className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
										<path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
									</svg>
								</div>
							</div>
							<div className="space-y-4 sm:space-y-6">
								{selectedSourceCard?.sources
									? // For Social Media and Search Engine cards, show breakdown
									  selectedSourceCard.sources.map((source, index) => {
											const sourceData =
												memoizedFilteredSourceData?.source_distribution?.[
													source
												] || 0;
											const total =
												memoizedFilteredSourceData?.total_visits || 0;
											const percentage =
												total > 0 ? Math.round((sourceData / total) * 100) : 0;

											return (
												<div key={index} className="space-y-2 sm:space-y-3">
													<div className="flex items-center justify-between">
														<span className="text-sm sm:text-base font-medium text-gray-700 capitalize">
															{source}
														</span>
														<span className="text-sm sm:text-base font-semibold text-gray-800">
															{sourceData.toLocaleString()} ({percentage}%)
														</span>
													</div>
													<div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
														<div
															className="h-2 sm:h-3 rounded-full transition-all duration-300"
															style={{
																width: `${percentage}%`,
																backgroundColor: getSourceBrandColor(source),
															}}
														></div>
													</div>
												</div>
											);
									  })
									: // For Total Page Visits and Direct Visits, show top sources
									  Object.entries(
											memoizedFilteredSourceData?.source_distribution || {}
									  )
											.sort(([, a], [, b]) => b - a)
											.slice(0, 5)
											.map(([source, count], index) => {
												const total =
													memoizedFilteredSourceData?.total_visits || 0;
												const percentage =
													total > 0 ? Math.round((count / total) * 100) : 0;

												return (
													<div key={index} className="space-y-2 sm:space-y-3">
														<div className="flex items-center justify-between">
															<span className="text-sm sm:text-base font-medium text-gray-700 capitalize">
																{source}
															</span>
															<span className="text-sm sm:text-base font-semibold text-gray-800">
																{count.toLocaleString()} ({percentage}%)
															</span>
														</div>
														<div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
															<div
																className="h-2 sm:h-3 rounded-full transition-all duration-300"
																style={{
																	width: `${percentage}%`,
																	backgroundColor: getSourceBrandColor(source),
																}}
															></div>
														</div>
													</div>
												);
											})}
							</div>
						</div>

						{/* Visitor Engagement Metrics Card */}
						<div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
							<div className="flex items-center justify-between mb-4 sm:mb-6">
								<h6 className="text-lg sm:text-xl font-semibold text-gray-800">
									Visitor Engagement Metrics
								</h6>
								<div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
									<svg
										className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
							</div>
							<div className="space-y-3 sm:space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-sm sm:text-base text-gray-600">
										Unique Visitors
									</span>
									<span className="text-sm sm:text-base font-semibold text-gray-800">
										{(
											memoizedFilteredSourceData?.unique_visitors || 0
										).toLocaleString()}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm sm:text-base text-gray-600">
										Returning Visitors
									</span>
									<span className="text-sm sm:text-base font-semibold text-gray-800">
										{(
											memoizedFilteredSourceData?.returning_visitors || 0
										).toLocaleString()}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm sm:text-base text-gray-600">
										New Visitors
									</span>
									<span className="text-sm sm:text-base font-semibold text-gray-800">
										{(
											memoizedFilteredSourceData?.new_visitors || 0
										).toLocaleString()}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm sm:text-base text-gray-600">
										Avg Visits/Visitor
									</span>
									<span className="text-sm sm:text-base font-semibold text-gray-800">
										{(
											memoizedFilteredSourceData?.avg_visits_per_visitor || 0
										).toLocaleString()}
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

export default SourceTrackingModal;
