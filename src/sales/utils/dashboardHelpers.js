// Helper function to get the correct key for the selected card
export const getFilterKey = (title) => {
	switch (title) {
		case "Total Sellers":
			return "total_sellers";
		case "Total Buyers":
			return "total_buyers";
		case "Total Reviews":
			return "total_reviews";
		case "Total Ads":
			return "total_ads";
		case "Total Wishlists":
			return "total_ads_wish_listed";
		case "Total Ads Clicks":
			return "total_ads_clicks";
		default:
			return "total_sellers";
	}
};

// Calculate growth rate and trend direction
export const calculateGrowthAndTrend = (
	analytics,
	timestamps,
	dateFilter,
	customStartDate,
	customEndDate
) => {
	if (!analytics) {
		return {
			growthRate: "0.0",
			trend: { direction: "stable", icon: "→", color: "text-gray-600" },
		};
	}

	if (!timestamps || timestamps.length === 0) {
		return {
			growthRate: "0.0",
			trend: { direction: "stable", icon: "→", color: "text-gray-600" },
		};
	}

	const today = new Date();
	let currentPeriod = [];
	let previousPeriod = [];

	// Determine comparison periods based on selected filter
	switch (dateFilter) {
		case "today":
			// Compare today vs yesterday
			const todayStart = new Date(today);
			todayStart.setHours(0, 0, 0, 0);
			const todayEnd = new Date(today);
			todayEnd.setHours(23, 59, 59, 999);

			const yesterdayStart = new Date(today);
			yesterdayStart.setDate(today.getDate() - 1);
			yesterdayStart.setHours(0, 0, 0, 0);
			const yesterdayEnd = new Date(yesterdayStart);
			yesterdayEnd.setHours(23, 59, 59, 999);

			currentPeriod = timestamps.filter((timestamp) => {
				const ts = new Date(timestamp);
				return ts >= todayStart && ts <= todayEnd;
			});
			previousPeriod = timestamps.filter((timestamp) => {
				const ts = new Date(timestamp);
				return ts >= yesterdayStart && ts <= yesterdayEnd;
			});
			break;

		case "week":
			// Compare this week (Mon-Sun) vs last week
			const weekStart = new Date(today);
			const dayOfWeek = today.getDay();
			const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
			weekStart.setDate(today.getDate() - daysFromMonday);
			weekStart.setHours(0, 0, 0, 0);
			const weekEnd = new Date(weekStart);
			weekEnd.setDate(weekStart.getDate() + 6);
			weekEnd.setHours(23, 59, 59, 999);

			const lastWeekStart = new Date(weekStart);
			lastWeekStart.setDate(weekStart.getDate() - 7);
			const lastWeekEnd = new Date(lastWeekStart);
			lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
			lastWeekEnd.setHours(23, 59, 59, 999);

			currentPeriod = timestamps.filter((timestamp) => {
				const ts = new Date(timestamp);
				return ts >= weekStart && ts <= weekEnd;
			});
			previousPeriod = timestamps.filter((timestamp) => {
				const ts = new Date(timestamp);
				return ts >= lastWeekStart && ts <= lastWeekEnd;
			});
			break;

		case "month":
			// Compare this month vs last month
			const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
			const monthEnd = new Date(
				today.getFullYear(),
				today.getMonth() + 1,
				0,
				23,
				59,
				59,
				999
			);

			const lastMonthStart = new Date(
				today.getFullYear(),
				today.getMonth() - 1,
				1
			);
			const lastMonthEnd = new Date(
				today.getFullYear(),
				today.getMonth(),
				0,
				23,
				59,
				59,
				999
			);

			currentPeriod = timestamps.filter((timestamp) => {
				const ts = new Date(timestamp);
				return ts >= monthStart && ts <= monthEnd;
			});
			previousPeriod = timestamps.filter((timestamp) => {
				const ts = new Date(timestamp);
				return ts >= lastMonthStart && ts <= lastMonthEnd;
			});
			break;

		case "year":
			// Compare this year vs last year
			const yearStart = new Date(today.getFullYear(), 0, 1);
			const yearEnd = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);

			const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
			const lastYearEnd = new Date(
				today.getFullYear() - 1,
				11,
				31,
				23,
				59,
				59,
				999
			);

			currentPeriod = timestamps.filter((timestamp) => {
				const ts = new Date(timestamp);
				return ts >= yearStart && ts <= yearEnd;
			});
			previousPeriod = timestamps.filter((timestamp) => {
				const ts = new Date(timestamp);
				return ts >= lastYearStart && ts <= lastYearEnd;
			});
			break;

		case "custom":
			// For custom dates, compare with same period before
			if (customStartDate && customEndDate) {
				const customStart = new Date(customStartDate);
				const customEnd = new Date(customEndDate);
				customEnd.setHours(23, 59, 59, 999);

				const periodDays = Math.ceil(
					(customEnd - customStart) / (1000 * 60 * 60 * 24)
				);
				const previousStart = new Date(customStart);
				previousStart.setDate(customStart.getDate() - periodDays);
				const previousEnd = new Date(customStart);
				previousEnd.setDate(customStart.getDate() - 1);
				previousEnd.setHours(23, 59, 59, 999);

				currentPeriod = timestamps.filter((timestamp) => {
					const ts = new Date(timestamp);
					return ts >= customStart && ts <= customEnd;
				});
				previousPeriod = timestamps.filter((timestamp) => {
					const ts = new Date(timestamp);
					return ts >= previousStart && ts <= previousEnd;
				});
			}
			break;

		default: // "all"
			// For "all", compare last 7 days vs previous 7 days
			const last7Days = [];
			const previous7Days = [];

			for (let i = 6; i >= 0; i--) {
				const date = new Date(today);
				date.setDate(today.getDate() - i);
				date.setHours(0, 0, 0, 0);
				const nextDate = new Date(date);
				nextDate.setDate(date.getDate() + 1);

				const count = timestamps.filter((timestamp) => {
					const ts = new Date(timestamp);
					return ts >= date && ts < nextDate;
				}).length;
				last7Days.push(count);
			}

			for (let i = 13; i >= 7; i--) {
				const date = new Date(today);
				date.setDate(today.getDate() - i);
				date.setHours(0, 0, 0, 0);
				const nextDate = new Date(date);
				nextDate.setDate(date.getDate() + 1);

				const count = timestamps.filter((timestamp) => {
					const ts = new Date(timestamp);
					return ts >= date && ts < nextDate;
				}).length;
				previous7Days.push(count);
			}

			const recentTotal = last7Days.reduce((sum, count) => sum + count, 0);
			const previousTotal = previous7Days.reduce(
				(sum, count) => sum + count,
				0
			);

			const growthRate =
				previousTotal > 0
					? ((recentTotal - previousTotal) / previousTotal) * 100
					: 0;
			const trend =
				growthRate > 1
					? { direction: "increasing", icon: "↗", color: "text-green-600" }
					: growthRate < -1
					? { direction: "decreasing", icon: "↘", color: "text-red-600" }
					: { direction: "stable", icon: "→", color: "text-gray-600" };

			return { growthRate: growthRate.toFixed(1), trend };
	}

	// Calculate growth rate for other filters (today, week, month, year, custom)
	const currentCount = currentPeriod.length;
	const previousCount = previousPeriod.length;

	const growthRate =
		previousCount > 0
			? ((currentCount - previousCount) / previousCount) * 100
			: 0;

	// Determine trend direction with consistent thresholds
	let trend;
	if (growthRate > 1) {
		trend = { direction: "increasing", icon: "↗", color: "text-green-600" };
	} else if (growthRate < -1) {
		trend = { direction: "decreasing", icon: "↘", color: "text-red-600" };
	} else {
		trend = { direction: "stable", icon: "→", color: "text-gray-600" };
	}

	return { growthRate: growthRate.toFixed(1), trend };
};

// Format chart data for display
export const formatChartData = (data, labels) => {
	return {
		labels: labels,
		datasets: [
			{
				label: "Data",
				data: data,
				backgroundColor: "rgba(54, 162, 235, 0.6)",
				borderColor: "rgba(54, 162, 235, 1)",
				borderWidth: 1,
			},
		],
	};
};

// Get chart options for consistent styling
export const getChartOptions = (title = "Chart") => {
	return {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: true,
				text: title,
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					precision: 0,
				},
			},
		},
	};
};
