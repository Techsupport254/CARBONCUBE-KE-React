import React from "react";
import { Modal } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
// Trending icons removed

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
	// Growth rate calculation removed

	const getSourceBrandColor = (source) => {
		switch ((source || "").toLowerCase()) {
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
				return "#6366F1";
		}
	};

	const trendData = generateSourceTrackingTrendData();

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
					<div className="mb-4 sm:mb-6">
						<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
							{selectedSourceCard?.title} Analytics
						</h2>
						<p className="text-blue-100 text-sm sm:text-base mt-1">
							Source tracking performance insights
						</p>
					</div>

					<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full lg:w-auto mt-3">
						<div className="flex items-center justify-between gap-4 pr-16">
							<div>
								<div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
									{(() => {
										let count = 0;
										if (selectedSourceCard?.sources) {
											count = selectedSourceCard.sources.reduce(
												(total, source) =>
													total +
													(memoizedFilteredSourceData?.source_distribution?.[
														source
													] || 0),
												0
											);
										} else if (selectedSourceCard?.data?.direct !== undefined) {
											count =
												memoizedFilteredSourceData?.source_distribution
													?.direct || 0;
										} else {
											count = memoizedFilteredSourceData?.total_visits || 0;
										}
										return count.toLocaleString();
									})()}
								</div>
								<div className="text-blue-100 text-sm sm:text-base">
									Total Count
								</div>
							</div>
							{/* Growth stats removed */}
						</div>
						<div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
							<div className="relative">
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
								<div className="flex flex-row items-center gap-2 w-full sm:w-auto">
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
					<div className="h-64 sm:h-80 lg:h-96 w-full">
						<Bar
							data={{
								labels: trendData.labels,
								datasets: [
									{
										label: selectedSourceCard?.title || "Data",
										data: trendData.data.map((v) => Math.round(v)),
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
									legend: { display: false },
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
										grid: { color: "rgba(0, 0, 0, 0.1)" },
										ticks: {
											color: "rgba(0, 0, 0, 0.6)",
											font: { size: 12 },
										},
									},
									x: {
										grid: { display: false },
										ticks: {
											color: "rgba(0, 0, 0, 0.6)",
											font: { size: 12 },
										},
									},
								},
							}}
						/>
					</div>
				</div>

				<div className="w-full max-w-5xl mx-auto mt-10">
					<div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
						<div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 w-full lg:w-2/5">
							<div className="flex items-center justify-between mb-4 sm:mb-6">
								<h6 className="text-lg sm:text-xl font-semibold text-gray-800">
									{selectedSourceCard?.type === "utm_source"
										? "UTM Source Breakdown"
										: selectedSourceCard?.type === "utm_medium"
										? "UTM Medium Breakdown"
										: selectedSourceCard?.type === "utm_campaign"
										? "UTM Campaign Breakdown"
										: "Source Breakdown"}
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
								{(() => {
									if (selectedSourceCard?.type === "utm_source") {
										const utmData =
											memoizedFilteredSourceData?.utm_source_distribution || {};
										return Object.entries(utmData)
											.sort(([, a], [, b]) => b - a)
											.slice(0, 5)
											.map(([source, count], index) => {
												const total = Object.values(utmData).reduce(
													(sum, v) => sum + v,
													0
												);
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
											});
									} else if (selectedSourceCard?.type === "utm_medium") {
										const utmData =
											memoizedFilteredSourceData?.utm_medium_distribution || {};
										return Object.entries(utmData)
											.sort(([, a], [, b]) => b - a)
											.slice(0, 5)
											.map(([medium, count], index) => {
												const total = Object.values(utmData).reduce(
													(sum, v) => sum + v,
													0
												);
												const percentage =
													total > 0 ? Math.round((count / total) * 100) : 0;
												return (
													<div key={index} className="space-y-2 sm:space-y-3">
														<div className="flex items-center justify-between">
															<span className="text-sm sm:text-base font-medium text-gray-700 capitalize">
																{medium}
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
																	backgroundColor: "#10B981",
																}}
															></div>
														</div>
													</div>
												);
											});
									} else if (selectedSourceCard?.type === "utm_campaign") {
										const utmData =
											memoizedFilteredSourceData?.utm_campaign_distribution ||
											{};
										return Object.entries(utmData)
											.sort(([, a], [, b]) => b - a)
											.slice(0, 5)
											.map(([campaign, count], index) => {
												const total = Object.values(utmData).reduce(
													(sum, v) => sum + v,
													0
												);
												const percentage =
													total > 0 ? Math.round((count / total) * 100) : 0;
												return (
													<div key={index} className="space-y-2 sm:space-y-3">
														<div className="flex items-center justify-between">
															<span className="text-sm sm:text-base font-medium text-gray-700 capitalize">
																{campaign.replace(/_/g, " ")}
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
																	backgroundColor: "#F59E0B",
																}}
															></div>
														</div>
													</div>
												);
											});
									} else if (selectedSourceCard?.sources) {
										return selectedSourceCard.sources
											.filter(
												(source) =>
													(memoizedFilteredSourceData?.source_distribution?.[
														source
													] || 0) > 0
											)
											.map((source, index) => {
												const sourceData =
													memoizedFilteredSourceData?.source_distribution?.[
														source
													] || 0;
												const total =
													memoizedFilteredSourceData?.total_visits || 0;
												const percentage =
													total > 0
														? Math.round((sourceData / total) * 100)
														: 0;
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
											});
									} else {
										return Object.entries(
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
											});
									}
								})()}
							</div>
						</div>

						<div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 w-full lg:w-3/5">
							<div className="flex items-center justify-between mb-4 sm:mb-6">
								<h6 className="text-lg sm:text-xl font-semibold text-gray-800">
									UTM Insights
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
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
								<div>
									<h5 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">
										Top UTM Sources
									</h5>
									<div className="space-y-3">
										{Object.entries(
											memoizedFilteredSourceData?.utm_source_distribution || {}
										)
											.sort(([, a], [, b]) => b - a)
											.slice(0, 5)
											.map(([source, count], index) => {
												const total = Object.values(
													memoizedFilteredSourceData?.utm_source_distribution ||
														{}
												).reduce((sum, v) => sum + v, 0);
												const percentage =
													total > 0 ? Math.round((count / total) * 100) : 0;
												return (
													<div key={index} className="space-y-1">
														<div className="flex items-center justify-between">
															<span className="text-sm capitalize text-gray-700">
																{source}
															</span>
															<span className="text-sm font-semibold text-gray-800">
																{count.toLocaleString()} ({percentage}%)
															</span>
														</div>
														<div className="w-full bg-gray-200 rounded-full h-2">
															<div
																className="h-2 rounded-full bg-blue-500"
																style={{ width: `${percentage}%` }}
															></div>
														</div>
													</div>
												);
											})}
									</div>
								</div>

								<div>
									<h5 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">
										Top UTM Mediums
									</h5>
									<div className="space-y-3">
										{Object.entries(
											memoizedFilteredSourceData?.utm_medium_distribution || {}
										)
											.sort(([, a], [, b]) => b - a)
											.slice(0, 5)
											.map(([medium, count], index) => {
												const total = Object.values(
													memoizedFilteredSourceData?.utm_medium_distribution ||
														{}
												).reduce((sum, v) => sum + v, 0);
												const percentage =
													total > 0 ? Math.round((count / total) * 100) : 0;
												return (
													<div key={index} className="space-y-1">
														<div className="flex items-center justify-between">
															<span className="text-sm capitalize text-gray-700">
																{medium}
															</span>
															<span className="text-sm font-semibold text-gray-800">
																{count.toLocaleString()} ({percentage}%)
															</span>
														</div>
														<div className="w-full bg-gray-200 rounded-full h-2">
															<div
																className="h-2 rounded-full bg-emerald-500"
																style={{ width: `${percentage}%` }}
															></div>
														</div>
													</div>
												);
											})}
									</div>
								</div>

								<div>
									<h5 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">
										Top UTM Campaigns
									</h5>
									<div className="space-y-3">
										{Object.entries(
											memoizedFilteredSourceData?.utm_campaign_distribution ||
												{}
										)
											.sort(([, a], [, b]) => b - a)
											.slice(0, 5)
											.map(([campaign, count], index) => {
												const total = Object.values(
													memoizedFilteredSourceData?.utm_campaign_distribution ||
														{}
												).reduce((sum, v) => sum + v, 0);
												const percentage =
													total > 0 ? Math.round((count / total) * 100) : 0;
												return (
													<div key={index} className="space-y-1">
														<div className="flex items-center justify-between">
															<span className="text-sm capitalize text-gray-700">
																{campaign.replace(/_/g, " ")}
															</span>
															<span className="text-sm font-semibold text-gray-800">
																{count.toLocaleString()} ({percentage}%)
															</span>
														</div>
														<div className="w-full bg-gray-200 rounded-full h-2">
															<div
																className="h-2 rounded-full bg-amber-500"
																style={{ width: `${percentage}%` }}
															></div>
														</div>
													</div>
												);
											})}
									</div>
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
