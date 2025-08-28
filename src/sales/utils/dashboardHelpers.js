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

// Calculate average of values (excluding the latest)
export const calculateAverage = (values) => {
	if (values.length <= 1) return 0;
	const sum = values.reduce((acc, val) => acc + val, 0);
	return sum / values.length;
};

// Universal growth rate calculation comparing latest vs historical average
export const calculateUniversalGrowthRate = (latest, historicalValues) => {
	// Calculate average of historical values (excluding latest)
	const average = calculateAverage(historicalValues);

	// Handle edge cases according to the universal logic
	if (average === 0) {
		if (latest === 0) {
			return { growthRate: "0.0", isInfinite: false, isNew: false };
		} else {
			return { growthRate: "∞", isInfinite: true, isNew: true };
		}
	} else if (latest === 0) {
		return { growthRate: "-100.0", isInfinite: false, isNew: false };
	} else {
		const rate = ((latest - average) / average) * 100;
		return {
			growthRate: rate.toFixed(1),
			isInfinite: false,
			isNew: false,
		};
	}
};

// Determine trend direction based on growth result
export const determineTrendDirection = (growthResult) => {
	if (growthResult.isInfinite) {
		return { direction: "increasing", icon: "↗", color: "text-green-600" };
	}

	const growthRate = parseFloat(growthResult.growthRate);

	if (growthRate > 1) {
		return { direction: "increasing", icon: "↗", color: "text-green-600" };
	} else if (growthRate < -1) {
		return { direction: "decreasing", icon: "↘", color: "text-red-600" };
	} else {
		return { direction: "stable", icon: "→", color: "text-gray-600" };
	}
};

// Calculate growth rate and trend direction with universal logic
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
	let latestPeriod = [];
	let historicalPeriods = [];

	// Determine comparison periods based on selected filter
	switch (dateFilter) {
		case "today":
			// Compare today vs average of all past days
			const todayStart = new Date(today);
			todayStart.setHours(0, 0, 0, 0);
			const todayEnd = new Date(today);
			todayEnd.setHours(23, 59, 59, 999);

			// Get today's data
			latestPeriod = timestamps.filter((timestamp) => {
				const ts = new Date(timestamp);
				return ts >= todayStart && ts <= todayEnd;
			});

			// Get historical daily data (last 30 days excluding today)
			for (let i = 1; i <= 30; i++) {
				const date = new Date(today);
				date.setDate(today.getDate() - i);
				date.setHours(0, 0, 0, 0);
				const nextDate = new Date(date);
				nextDate.setDate(date.getDate() + 1);

				const count = timestamps.filter((timestamp) => {
					const ts = new Date(timestamp);
					return ts >= date && ts < nextDate;
				}).length;
				historicalPeriods.push(count);
			}
			break;

		case "week":
			// Compare this week vs average of all past weeks
			const weekStart = new Date(today);
			const dayOfWeek = today.getDay();
			const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
			weekStart.setDate(today.getDate() - daysFromMonday);
			weekStart.setHours(0, 0, 0, 0);
			const weekEnd = new Date(weekStart);
			weekEnd.setDate(weekStart.getDate() + 6);
			weekEnd.setHours(23, 59, 59, 999);

			// Get current week's data
			latestPeriod = timestamps.filter((timestamp) => {
				const ts = new Date(timestamp);
				return ts >= weekStart && ts <= weekEnd;
			});

			// Get historical weekly data (last 12 weeks excluding current week)
			for (let i = 1; i <= 12; i++) {
				const weekStartDate = new Date(weekStart);
				weekStartDate.setDate(weekStart.getDate() - i * 7);
				const weekEndDate = new Date(weekStartDate);
				weekEndDate.setDate(weekStartDate.getDate() + 6);
				weekEndDate.setHours(23, 59, 59, 999);

				const count = timestamps.filter((timestamp) => {
					const ts = new Date(timestamp);
					return ts >= weekStartDate && ts <= weekEndDate;
				}).length;
				historicalPeriods.push(count);
			}
			break;

		case "month":
			// Compare this month vs average of all past months
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

			// Get current month's data
			latestPeriod = timestamps.filter((timestamp) => {
				const ts = new Date(timestamp);
				return ts >= monthStart && ts <= monthEnd;
			});

			// Get historical monthly data (last 12 months excluding current month)
			for (let i = 1; i <= 12; i++) {
				const monthStartDate = new Date(
					today.getFullYear(),
					today.getMonth() - i,
					1
				);
				const monthEndDate = new Date(
					today.getFullYear(),
					today.getMonth() - i + 1,
					0,
					23,
					59,
					59,
					999
				);

				const count = timestamps.filter((timestamp) => {
					const ts = new Date(timestamp);
					return ts >= monthStartDate && ts <= monthEndDate;
				}).length;
				historicalPeriods.push(count);
			}
			break;

		case "year":
			// Compare this year vs average of all past years
			const yearStart = new Date(today.getFullYear(), 0, 1);
			const yearEnd = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);

			// Get current year's data
			latestPeriod = timestamps.filter((timestamp) => {
				const ts = new Date(timestamp);
				return ts >= yearStart && ts <= yearEnd;
			});

			// Get historical yearly data (last 5 years excluding current year)
			for (let i = 1; i <= 5; i++) {
				const yearStartDate = new Date(today.getFullYear() - i, 0, 1);
				const yearEndDate = new Date(
					today.getFullYear() - i,
					11,
					31,
					23,
					59,
					59,
					999
				);

				const count = timestamps.filter((timestamp) => {
					const ts = new Date(timestamp);
					return ts >= yearStartDate && ts <= yearEndDate;
				}).length;
				historicalPeriods.push(count);
			}
			break;

		case "custom":
			// For custom dates, compare with average of similar periods
			if (customStartDate && customEndDate) {
				const customStart = new Date(customStartDate);
				const customEnd = new Date(customEndDate);
				customEnd.setHours(23, 59, 59, 999);

				// Get custom period data
				latestPeriod = timestamps.filter((timestamp) => {
					const ts = new Date(timestamp);
					return ts >= customStart && ts <= customEnd;
				});

				// Get historical data for similar periods (last 5 similar periods)
				const periodDays = Math.ceil(
					(customEnd - customStart) / (1000 * 60 * 60 * 24)
				);
				for (let i = 1; i <= 5; i++) {
					const periodStart = new Date(customStart);
					periodStart.setDate(customStart.getDate() - i * periodDays);
					const periodEnd = new Date(periodStart);
					periodEnd.setDate(periodStart.getDate() + periodDays - 1);
					periodEnd.setHours(23, 59, 59, 999);

					const count = timestamps.filter((timestamp) => {
						const ts = new Date(timestamp);
						return ts >= periodStart && ts <= periodEnd;
					}).length;
					historicalPeriods.push(count);
				}
			}
			break;

		default: // "all"
			// For "all", compare last 7 days vs average of all previous 7-day periods
			const last7Days = [];
			const historical7DayPeriods = [];

			// Get latest 7 days
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

			// Get historical 7-day periods (last 10 periods excluding latest)
			for (let i = 1; i <= 10; i++) {
				const periodTotal = [];
				for (let j = 0; j < 7; j++) {
					const date = new Date(today);
					date.setDate(today.getDate() - i * 7 - j);
					date.setHours(0, 0, 0, 0);
					const nextDate = new Date(date);
					nextDate.setDate(date.getDate() + 1);

					const count = timestamps.filter((timestamp) => {
						const ts = new Date(timestamp);
						return ts >= date && ts < nextDate;
					}).length;
					periodTotal.push(count);
				}
				historical7DayPeriods.push(
					periodTotal.reduce((sum, count) => sum + count, 0)
				);
			}

			const latestTotal = last7Days.reduce((sum, count) => sum + count, 0);
			const growthResult = calculateUniversalGrowthRate(
				latestTotal,
				historical7DayPeriods
			);
			const trend = determineTrendDirection(growthResult);
			return { growthRate: growthResult.growthRate, trend };
	}

	// Calculate growth rate for other filters (today, week, month, year, custom)
	const latestCount = latestPeriod.length;
	const growthResult = calculateUniversalGrowthRate(
		latestCount,
		historicalPeriods
	);
	const trend = determineTrendDirection(growthResult);

	return { growthRate: growthResult.growthRate, trend };
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
