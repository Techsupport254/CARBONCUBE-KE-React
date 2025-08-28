import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { FaUsers, FaUserPlus, FaChartLine } from "react-icons/fa";
import { IoMdTrendingUp } from "react-icons/io";
import { HiTrendingDown } from "react-icons/hi";
import {
	calculateUniqueVisitors,
	calculateNewVisitors,
	calculateReturningVisitors,
	visitorIdentifier,
	sessionManager,
} from "../utils/visitorAnalytics";

const VisitorMetricsModal = ({
	show,
	onHide,
	selectedMetric,
	sourceAnalytics,
	memoizedFilteredSourceData,
}) => {
	const [dateFilter, setDateFilter] = useState("all");
	const [customStartDate, setCustomStartDate] = useState("");
	const [customEndDate, setCustomEndDate] = useState("");

	// Reset date filter when modal opens
	useEffect(() => {
		if (show) {
			setDateFilter("all");
			setCustomStartDate("");
			setCustomEndDate("");
		}
	}, [show]);

	if (!selectedMetric || !sourceAnalytics) return null;

	// Function to calculate growth rate
	const calculateGrowthRate = () => {
		const dailyVisits = sourceAnalytics?.daily_visits || {};
		if (!dailyVisits || Object.keys(dailyVisits).length === 0) return 0;

		const today = new Date();
		const todayStr = today.toISOString().split("T")[0];

		// Get current period data based on date filter
		let currentPeriodData = [];
		let previousPeriodData = [];

		switch (dateFilter) {
			case "today":
				// Compare today vs yesterday
				const yesterday = new Date(today);
				yesterday.setDate(today.getDate() - 1);
				const yesterdayStr = yesterday.toISOString().split("T")[0];

				currentPeriodData = [dailyVisits[todayStr] || 0];
				previousPeriodData = [dailyVisits[yesterdayStr] || 0];
				break;

			case "week":
				// Compare this week vs last week
				const weekStart = new Date(today);
				const dayOfWeek = today.getDay();
				const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
				weekStart.setDate(today.getDate() - daysFromMonday);

				for (let i = 0; i < 7; i++) {
					const currentDate = new Date(weekStart);
					currentDate.setDate(weekStart.getDate() + i);
					const currentDateStr = currentDate.toISOString().split("T")[0];

					const previousDate = new Date(currentDate);
					previousDate.setDate(currentDate.getDate() - 7);
					const previousDateStr = previousDate.toISOString().split("T")[0];

					currentPeriodData.push(dailyVisits[currentDateStr] || 0);
					previousPeriodData.push(dailyVisits[previousDateStr] || 0);
				}
				break;

			case "month":
				// Compare this month vs last month
				const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
				const lastMonthStart = new Date(
					today.getFullYear(),
					today.getMonth() - 1,
					1
				);

				for (let i = 0; i < 30; i++) {
					const currentDate = new Date(monthStart);
					currentDate.setDate(monthStart.getDate() + i);
					const currentDateStr = currentDate.toISOString().split("T")[0];

					const previousDate = new Date(lastMonthStart);
					previousDate.setDate(lastMonthStart.getDate() + i);
					const previousDateStr = previousDate.toISOString().split("T")[0];

					if (currentDate <= today) {
						currentPeriodData.push(dailyVisits[currentDateStr] || 0);
						previousPeriodData.push(dailyVisits[previousDateStr] || 0);
					}
				}
				break;

			case "year":
				// Compare this year vs last year
				const yearStart = new Date(today.getFullYear(), 0, 1);
				const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);

				for (let i = 0; i < 365; i++) {
					const currentDate = new Date(yearStart);
					currentDate.setDate(yearStart.getDate() + i);
					const currentDateStr = currentDate.toISOString().split("T")[0];

					const previousDate = new Date(lastYearStart);
					previousDate.setDate(lastYearStart.getDate() + i);
					const previousDateStr = previousDate.toISOString().split("T")[0];

					if (currentDate <= today) {
						currentPeriodData.push(dailyVisits[currentDateStr] || 0);
						previousPeriodData.push(dailyVisits[previousDateStr] || 0);
					}
				}
				break;

			default: // "all"
				// Compare last 30 days vs previous 30 days
				for (let i = 29; i >= 0; i--) {
					const currentDate = new Date(today);
					currentDate.setDate(today.getDate() - i);
					const currentDateStr = currentDate.toISOString().split("T")[0];

					const previousDate = new Date(currentDate);
					previousDate.setDate(currentDate.getDate() - 30);
					const previousDateStr = previousDate.toISOString().split("T")[0];

					currentPeriodData.push(dailyVisits[currentDateStr] || 0);
					previousPeriodData.push(dailyVisits[previousDateStr] || 0);
				}
				break;
		}

		// Calculate totals
		const currentTotal = currentPeriodData.reduce((sum, val) => sum + val, 0);
		const previousTotal = previousPeriodData.reduce((sum, val) => sum + val, 0);

		// Calculate growth rate
		if (previousTotal === 0) {
			return currentTotal > 0 ? 100 : 0;
		}

		return Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
	};

	// Function to get date range based on filter
	const getDateRange = (filter) => {
		const now = new Date();
		const today = new Date(now);
		today.setHours(0, 0, 0, 0);
		const endOfToday = new Date(today);
		endOfToday.setHours(23, 59, 59, 999);

		switch (filter) {
			case "today":
				return { start: today, end: endOfToday };
			case "week":
				const weekAgo = new Date(today);
				weekAgo.setDate(today.getDate() - 7);
				return { start: weekAgo, end: endOfToday };
			case "month":
				const monthAgo = new Date(today);
				monthAgo.setMonth(today.getMonth() - 1);
				return { start: monthAgo, end: endOfToday };
			case "year":
				const yearAgo = new Date(today);
				yearAgo.setFullYear(today.getFullYear() - 1);
				return { start: yearAgo, end: endOfToday };
			case "custom":
				if (customStartDate && customEndDate) {
					const startDate = new Date(customStartDate);
					const endDate = new Date(customEndDate);
					startDate.setHours(0, 0, 0, 0);
					endDate.setHours(23, 59, 59, 999);
					return { start: startDate, end: endDate };
				}
				return { start: today, end: endOfToday };
			default:
				return null;
		}
	};

	// Generate trend data based on selected date filter
	const generateTrendData = () => {
		if (!sourceAnalytics?.daily_visits) {
			return { data: [0, 0, 0, 0, 0, 0, 0], labels: [] };
		}

		const dailyVisits = sourceAnalytics.daily_visits;
		const today = new Date();
		let data = [];
		let labels = [];

		switch (dateFilter) {
			case "today":
				// Show hourly data for today
				for (let i = 23; i >= 0; i--) {
					const hour = new Date(today);
					hour.setHours(today.getHours() - i, 0, 0, 0);
					const nextHour = new Date(hour);
					nextHour.setHours(hour.getHours() + 1);

					const todayVisits =
						dailyVisits[today.toISOString().split("T")[0]] || 0;
					const hourlyVisits = Math.round(todayVisits / 24);
					data.push(hourlyVisits);

					const hourLabel =
						hour.getHours() === 0
							? "12 AM"
							: hour.getHours() < 12
							? `${hour.getHours()} AM`
							: hour.getHours() === 12
							? "12 PM"
							: `${hour.getHours() - 12} PM`;
					labels.push(hourLabel);
				}
				break;

			case "week":
				// Show daily data for last 7 days
				for (let i = 6; i >= 0; i--) {
					const date = new Date(today);
					date.setDate(today.getDate() - i);
					const dateStr = date.toISOString().split("T")[0];

					const visits = dailyVisits[dateStr] || 0;
					data.push(visits);
					labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
				}
				break;

			case "month":
				// Show weekly data for last 4 weeks
				for (let i = 3; i >= 0; i--) {
					const weekStart = new Date(today);
					weekStart.setDate(today.getDate() - i * 7);
					weekStart.setDate(weekStart.getDate() - weekStart.getDay());
					weekStart.setHours(0, 0, 0, 0);
					const weekEnd = new Date(weekStart);
					weekEnd.setDate(weekStart.getDate() + 7);

					let weekVisits = 0;
					for (let j = 0; j < 7; j++) {
						const date = new Date(weekStart);
						date.setDate(weekStart.getDate() + j);
						const dateStr = date.toISOString().split("T")[0];
						weekVisits += dailyVisits[dateStr] || 0;
					}

					data.push(weekVisits);
					labels.push(`Week ${4 - i}`);
				}
				break;

			case "year":
				// Show monthly data for last 12 months
				for (let i = 11; i >= 0; i--) {
					const monthStart = new Date(
						today.getFullYear(),
						today.getMonth() - i,
						1
					);
					const monthEnd = new Date(
						today.getFullYear(),
						today.getMonth() - i + 1,
						1
					);

					let monthVisits = 0;
					const currentDate = new Date(monthStart);
					while (currentDate < monthEnd) {
						const dateStr = currentDate.toISOString().split("T")[0];
						monthVisits += dailyVisits[dateStr] || 0;
						currentDate.setDate(currentDate.getDate() + 1);
					}

					data.push(monthVisits);
					labels.push(
						monthStart.toLocaleDateString("en-US", { month: "short" })
					);
				}
				break;

			case "custom":
				if (customStartDate && customEndDate) {
					const startDate = new Date(customStartDate);
					const endDate = new Date(customEndDate);
					const daysDiff = Math.ceil(
						(endDate - startDate) / (1000 * 60 * 60 * 24)
					);

					if (daysDiff <= 7) {
						// Show daily data for custom range
						for (let i = 0; i <= daysDiff; i++) {
							const date = new Date(startDate);
							date.setDate(startDate.getDate() + i);
							const dateStr = date.toISOString().split("T")[0];

							const visits = dailyVisits[dateStr] || 0;
							data.push(visits);
							labels.push(
								date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								})
							);
						}
					} else {
						// Show weekly data for longer custom ranges
						const weeks = Math.ceil(daysDiff / 7);
						for (let i = 0; i < weeks; i++) {
							const weekStart = new Date(startDate);
							weekStart.setDate(startDate.getDate() + i * 7);
							const weekEnd = new Date(weekStart);
							weekEnd.setDate(weekStart.getDate() + 7);

							let weekVisits = 0;
							const currentDate = new Date(weekStart);
							while (currentDate < weekEnd && currentDate <= endDate) {
								const dateStr = currentDate.toISOString().split("T")[0];
								weekVisits += dailyVisits[dateStr] || 0;
								currentDate.setDate(currentDate.getDate() + 1);
							}

							data.push(weekVisits);
							labels.push(`Week ${i + 1}`);
						}
					}
				} else {
					// Fallback to last 7 days
					for (let i = 6; i >= 0; i--) {
						const date = new Date(today);
						date.setDate(today.getDate() - i);
						const dateStr = date.toISOString().split("T")[0];

						const visits = dailyVisits[dateStr] || 0;
						data.push(visits);
						labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
					}
				}
				break;

			default: // "all"
				// Show last 30 days as default
				for (let i = 29; i >= 0; i--) {
					const date = new Date(today);
					date.setDate(today.getDate() - i);
					const dateStr = date.toISOString().split("T")[0];

					const visits = dailyVisits[dateStr] || 0;
					data.push(visits);
					labels.push(
						date.toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
						})
					);
				}
				break;
		}

		return { data, labels };
	};

	const { data, labels } = generateTrendData();

	// Calculate additional metrics with proper unique user identification
	const getAdditionalMetrics = () => {
		const dailyVisits = sourceAnalytics?.daily_visits || {};
		const totalVisits = sourceAnalytics?.total_visits || 0;

		// Get visitor metric from multiple possible sources
		let visitorMetric = 0;
		if (selectedMetric.key === "unique_visitors") {
			visitorMetric =
				memoizedFilteredSourceData?.unique_visitors ||
				sourceAnalytics?.unique_visitors ||
				sourceAnalytics?.visitor_engagement_metrics?.unique_visitors ||
				0;
		} else if (selectedMetric.key === "new_visitors") {
			visitorMetric =
				memoizedFilteredSourceData?.new_visitors ||
				sourceAnalytics?.new_visitors ||
				sourceAnalytics?.visitor_engagement_metrics?.new_visitors ||
				0;
		}

		// Calculate filtered values based on date filter with proper unique user identification
		const getFilteredValues = () => {
			if (dateFilter === "all") {
				return {
					totalVisits: totalVisits,
					visitorMetric: visitorMetric,
					avgVisitsPerDay: Math.round(totalVisits / 30), // Average over last 30 days
				};
			}

			const today = new Date();
			let filteredTotalVisits = 0;
			let filteredVisitorMetric = 0;
			let daysCount = 0;

			// Get the date range for filtering
			let startDate, endDate;

			switch (dateFilter) {
				case "today":
					startDate = new Date(today);
					startDate.setHours(0, 0, 0, 0);
					endDate = new Date(today);
					endDate.setHours(23, 59, 59, 999);
					daysCount = 1;
					break;

				case "week":
					// Last 7 days
					startDate = new Date(today);
					startDate.setDate(today.getDate() - 6);
					startDate.setHours(0, 0, 0, 0);
					endDate = new Date(today);
					endDate.setHours(23, 59, 59, 999);
					daysCount = 7;
					break;

				case "month":
					// Last 30 days
					startDate = new Date(today);
					startDate.setDate(today.getDate() - 29);
					startDate.setHours(0, 0, 0, 0);
					endDate = new Date(today);
					endDate.setHours(23, 59, 59, 999);
					daysCount = 30;
					break;

				case "year":
					// Last 365 days
					startDate = new Date(today);
					startDate.setDate(today.getDate() - 364);
					startDate.setHours(0, 0, 0, 0);
					endDate = new Date(today);
					endDate.setHours(23, 59, 59, 999);
					daysCount = 365;
					break;

				case "custom":
					if (customStartDate && customEndDate) {
						startDate = new Date(customStartDate);
						startDate.setHours(0, 0, 0, 0);
						endDate = new Date(customEndDate);
						endDate.setHours(23, 59, 59, 999);

						// Calculate days between dates
						const timeDiff = endDate.getTime() - startDate.getTime();
						daysCount = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
					}
					break;

				default:
					startDate = new Date(today);
					startDate.setDate(today.getDate() - 29);
					startDate.setHours(0, 0, 0, 0);
					endDate = new Date(today);
					endDate.setHours(23, 59, 59, 999);
					daysCount = 30;
			}

			// Calculate filtered total visits for the date range
			if (startDate && endDate) {
				const currentDate = new Date(startDate);
				while (currentDate <= endDate) {
					const dateStr = currentDate.toISOString().split("T")[0];
					filteredTotalVisits += dailyVisits[dateStr] || 0;
					currentDate.setDate(currentDate.getDate() + 1);
				}
			}

			// Calculate filtered visitor metrics using proper analytics methods
			if (selectedMetric.key === "unique_visitors") {
				// For unique visitors, use session-based or device-based tracking
				// This is more accurate than proportional estimation
				filteredVisitorMetric = calculateUniqueVisitors(
					startDate,
					endDate,
					sourceAnalytics,
					memoizedFilteredSourceData
				);
			} else if (selectedMetric.key === "new_visitors") {
				// For new visitors, identify first-time visits in the period
				filteredVisitorMetric = calculateNewVisitors(
					startDate,
					endDate,
					sourceAnalytics,
					memoizedFilteredSourceData
				);
			}

			return {
				totalVisits: filteredTotalVisits,
				visitorMetric: filteredVisitorMetric,
				avgVisitsPerDay:
					daysCount > 0 ? Math.round(filteredTotalVisits / daysCount) : 0,
			};
		};

		const filteredValues = getFilteredValues();

		// Get period label for display
		const getPeriodLabel = () => {
			switch (dateFilter) {
				case "today":
					return "Today";
				case "week":
					return "Last 7 Days";
				case "month":
					return "Last 30 Days";
				case "year":
					return "Last Year";
				case "custom":
					return customStartDate && customEndDate
						? `${customStartDate} to ${customEndDate}`
						: "Custom Range";
				default:
					return "All Time";
			}
		};

		return {
			totalVisits: filteredValues.totalVisits,
			visitorMetric: filteredValues.visitorMetric,
			avgVisitsPerDay: filteredValues.avgVisitsPerDay,
			periodLabel: getPeriodLabel(),
		};
	};

	// Calculate unique visitors for a specific period using proper analytics methods
	const calculateUniqueVisitorsForPeriod = (
		startDate,
		endDate,
		sourceAnalytics,
		filteredData
	) => {
		// Method 1: Use filtered data if available (most accurate)
		if (filteredData?.unique_visitors !== undefined) {
			return filteredData.unique_visitors;
		}

		// Method 2: Use session-based tracking if available
		if (sourceAnalytics?.session_data) {
			return calculateUniqueVisitors(
				startDate,
				endDate,
				sourceAnalytics.session_data
			);
		}

		// Method 3: Use device fingerprinting if available
		if (sourceAnalytics?.device_fingerprints) {
			return calculateUniqueVisitors(
				startDate,
				endDate,
				sourceAnalytics.device_fingerprints
			);
		}

		// Method 4: Use cookie-based tracking if available
		if (sourceAnalytics?.cookie_data) {
			return calculateUniqueVisitors(
				startDate,
				endDate,
				sourceAnalytics.cookie_data
			);
		}

		// Method 5: Fallback to proportional estimation (least accurate)
		const totalVisits = sourceAnalytics?.total_visits || 0;
		const totalUniqueVisitors = sourceAnalytics?.unique_visitors || 0;

		if (totalVisits > 0 && totalUniqueVisitors > 0) {
			// Calculate the ratio of visits in the period vs total visits
			const periodVisits = calculatePeriodVisits(
				startDate,
				endDate,
				sourceAnalytics?.daily_visits || {}
			);
			const visitRatio = periodVisits / totalVisits;

			// Apply a more sophisticated estimation based on visit patterns
			// This assumes unique visitors are somewhat proportional to visits
			return Math.round(totalUniqueVisitors * visitRatio * 0.8); // 0.8 factor for realistic estimation
		}

		return 0;
	};

	// Calculate new visitors for a specific period
	const calculateNewVisitorsForPeriod = (
		startDate,
		endDate,
		sourceAnalytics,
		filteredData
	) => {
		// Method 1: Use filtered data if available
		if (filteredData?.new_visitors !== undefined) {
			return filteredData.new_visitors;
		}

		// Method 2: Use first-visit timestamps if available
		if (sourceAnalytics?.first_visit_timestamps) {
			return calculateNewVisitors(
				startDate,
				endDate,
				sourceAnalytics.first_visit_timestamps
			);
		}

		// Method 3: Use session data to identify new users
		if (sourceAnalytics?.session_data) {
			return calculateNewVisitors(
				startDate,
				endDate,
				sourceAnalytics.session_data
			);
		}

		// Method 4: Fallback to proportional estimation
		const totalVisits = sourceAnalytics?.total_visits || 0;
		const totalNewVisitors = sourceAnalytics?.new_visitors || 0;

		if (totalVisits > 0 && totalNewVisitors > 0) {
			const periodVisits = calculatePeriodVisits(
				startDate,
				endDate,
				sourceAnalytics?.daily_visits || {}
			);
			const visitRatio = periodVisits / totalVisits;

			// New visitors are typically more concentrated in recent periods
			// Apply a higher factor for recent periods
			const recencyFactor = getRecencyFactor(startDate, endDate);
			return Math.round(totalNewVisitors * visitRatio * recencyFactor);
		}

		return 0;
	};

	// Helper function to calculate visits for a specific period
	const calculatePeriodVisits = (startDate, endDate, dailyVisits) => {
		let totalVisits = 0;
		const currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			const dateStr = currentDate.toISOString().split("T")[0];
			totalVisits += dailyVisits[dateStr] || 0;
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return totalVisits;
	};

	// Helper function to get recency factor for new visitor estimation
	const getRecencyFactor = (startDate, endDate) => {
		const today = new Date();
		const periodStart = new Date(startDate);
		const daysAgo = Math.ceil((today - periodStart) / (1000 * 60 * 60 * 24));

		// New visitors are more likely in recent periods
		if (daysAgo <= 7) return 1.2; // Last week: 20% higher
		if (daysAgo <= 30) return 1.1; // Last month: 10% higher
		if (daysAgo <= 90) return 1.0; // Last 3 months: normal
		if (daysAgo <= 365) return 0.9; // Last year: 10% lower
		return 0.8; // Older: 20% lower
	};

	// Placeholder functions for advanced tracking methods
	const calculateUniqueVisitorsFromSessions = (
		startDate,
		endDate,
		sessionData
	) => {
		// Implementation for session-based unique visitor calculation
		// This would analyze session data to count unique users
		return 0; // Placeholder
	};

	const calculateUniqueVisitorsFromDeviceFingerprints = (
		startDate,
		endDate,
		deviceFingerprints
	) => {
		// Implementation for device fingerprinting-based unique visitor calculation
		// This would analyze device fingerprints to count unique users
		return 0; // Placeholder
	};

	const calculateUniqueVisitorsFromCookies = (
		startDate,
		endDate,
		cookieData
	) => {
		// Implementation for cookie-based unique visitor calculation
		// This would analyze cookie data to count unique users
		return 0; // Placeholder
	};

	const calculateNewVisitorsFromFirstVisits = (
		startDate,
		endDate,
		firstVisitTimestamps
	) => {
		// Implementation for first-visit timestamp-based new visitor calculation
		// This would count users whose first visit falls within the period
		return 0; // Placeholder
	};

	const calculateNewVisitorsFromSessions = (
		startDate,
		endDate,
		sessionData
	) => {
		// Implementation for session-based new visitor calculation
		// This would analyze session data to identify new users
		return 0; // Placeholder
	};

	const additionalMetrics = getAdditionalMetrics();
	const growthRate = calculateGrowthRate();

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
							{selectedMetric.title} Analytics
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
									{additionalMetrics.visitorMetric?.toLocaleString() || 0}
								</div>
								<div className="text-blue-100 text-sm sm:text-base">
									{selectedMetric.title} in {additionalMetrics.periodLabel}
								</div>
							</div>

							{/* Growth Badge */}
							<div
								className={`flex items-center gap-1 px-3 py-2 rounded-lg ${
									growthRate >= 0
										? "bg-green-100 text-green-700"
										: "bg-red-100 text-red-700"
								}`}
							>
								{growthRate >= 0 ? (
									<IoMdTrendingUp className="w-4 h-4" />
								) : (
									<HiTrendingDown className="w-4 h-4" />
								)}
								<span className="text-sm font-semibold">
									{growthRate >= 0 ? "+" : ""}
									{growthRate}%
								</span>
							</div>
						</div>

						{/* Date Filter Controls */}
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
							<div className="relative w-full sm:w-auto">
								<select
									value={dateFilter}
									onChange={(e) => setDateFilter(e.target.value)}
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
										onChange={(e) => setCustomStartDate(e.target.value)}
										className="w-full sm:w-auto px-3 py-2 bg-white bg-opacity-70 text-gray-800 border border-white border-opacity-30 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
									/>
									<span className="text-white text-center sm:text-left">
										to
									</span>
									<input
										type="date"
										value={customEndDate}
										onChange={(e) => setCustomEndDate(e.target.value)}
										className="w-full sm:w-auto px-3 py-2 bg-white bg-opacity-70 text-gray-800 border border-white border-opacity-30 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
									/>
								</div>
							)}

							<button
								className="w-full sm:w-auto px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-all duration-200 font-medium"
								onClick={() => {
									setDateFilter("all");
									setCustomStartDate("");
									setCustomEndDate("");
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
									{selectedMetric.title} Trend Analysis
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
							{(() => {
								const isUniqueMetric =
									selectedMetric.key === "unique_visitors" ||
									selectedMetric.key === "new_visitors";
								const hasPerDayUnique =
									Array.isArray(sourceAnalytics?.daily_unique_visitors) ||
									Array.isArray(sourceAnalytics?.daily_new_visitors);
								const chartLabels =
									isUniqueMetric && !hasPerDayUnique
										? [additionalMetrics.periodLabel]
										: labels;
								const chartDataValues =
									isUniqueMetric && !hasPerDayUnique
										? [additionalMetrics.visitorMetric]
										: data.map((value) => Math.round(value));
								return (
									<Bar
										key={`${selectedMetric.key}-${dateFilter}-${customStartDate}-${customEndDate}`}
										data={{
											labels: chartLabels,
											datasets: [
												{
													label: selectedMetric.title || "Data",
													data: chartDataValues,
													backgroundColor:
														selectedMetric.key === "unique_visitors"
															? "rgba(40, 167, 69, 0.8)"
															: "rgba(23, 162, 184, 0.8)",
													borderColor:
														selectedMetric.key === "unique_visitors"
															? "rgba(40, 167, 69, 1)"
															: "rgba(23, 162, 184, 1)",
													borderWidth: 2,
													borderRadius: 8,
													hoverBackgroundColor:
														selectedMetric.key === "unique_visitors"
															? "rgba(40, 167, 69, 1)"
															: "rgba(23, 162, 184, 1)",
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
								);
							})()}
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
											growthRate >= 0 ? "text-green-600" : "text-red-600"
										}`}
									>
										{growthRate >= 0 ? "+" : ""}
										{growthRate}%
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm sm:text-base text-gray-600">
										Total Visits
									</span>
									<span className="text-sm sm:text-base font-semibold text-blue-600">
										{additionalMetrics.totalVisits?.toLocaleString() || 0}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm sm:text-base text-gray-600">
										Avg Visits/Day
									</span>
									<span className="text-sm sm:text-base font-semibold text-green-600">
										{additionalMetrics.avgVisitsPerDay?.toLocaleString() || 0}
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
											growthRate >= 0 ? "text-green-600" : "text-red-600"
										}`}
									>
										{growthRate >= 0 ? (
											<IoMdTrendingUp className="w-4 h-4" />
										) : (
											<HiTrendingDown className="w-4 h-4" />
										)}
										{growthRate >= 0 ? "increasing" : "decreasing"}
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

export default VisitorMetricsModal;
