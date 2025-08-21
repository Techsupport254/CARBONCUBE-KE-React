import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import TopNavbar from "../components/TopNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Sidebar";
import { Container, Row, Col, Card, Modal } from "react-bootstrap";
import { Pie, Bar } from "react-chartjs-2";
import "./dashboard.css";
import CategoryClickEvents from "../components/CategoryClickEvents";
import ShareableUrlGenerator from "../../components/ShareableUrlGenerator";
import { IoMdTrendingUp } from "react-icons/io";
import { HiTrendingDown } from "react-icons/hi";
import {
	FaFacebook,
	FaInstagram,
	FaTwitter,
	FaLinkedin,
	FaYoutube,
	FaTiktok,
	FaSnapchat,
	FaPinterest,
	FaReddit,
	FaWhatsapp,
	FaTelegram,
	FaDesktop,
	FaMobile,
	FaTablet,
	FaChrome,
	FaFirefox,
	FaSafari,
	FaEdge,
	FaOpera,
	FaApple,
	FaLinux,
	FaWindows,
	FaAndroid,
} from "react-icons/fa";
import { SiGoogle, SiBrave } from "react-icons/si";
import { MdSearch, MdLink } from "react-icons/md";
import Spinner from "react-spinkit";

import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
} from "chart.js";
ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement
);

function SalesDashboard() {
	const [analytics, setAnalytics] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [selectedCard, setSelectedCard] = useState(null);
	const [dateFilter, setDateFilter] = useState("all");
	const [customStartDate, setCustomStartDate] = useState("");
	const [customEndDate, setCustomEndDate] = useState("");
	const [sourceAnalytics, setSourceAnalytics] = useState(null);

	// Separate state for source tracking modal
	const [showSourceModal, setShowSourceModal] = useState(false);
	const [selectedSourceCard, setSelectedSourceCard] = useState(null);
	const [sourceDateFilter, setSourceDateFilter] = useState("all");
	const [sourceCustomStartDate, setSourceCustomStartDate] = useState("");
	const [sourceCustomEndDate, setSourceCustomEndDate] = useState("");

	// Function to get source icon
	const getSourceIcon = (source) => {
		switch (source.toLowerCase()) {
			case "facebook":
				return <FaFacebook className="text-primary" />;
			case "instagram":
				return <FaInstagram className="text-danger" />;
			case "twitter":
				return <FaTwitter className="text-info" />;
			case "linkedin":
				return <FaLinkedin className="text-primary" />;
			case "youtube":
				return <FaYoutube className="text-danger" />;
			case "tiktok":
				return <FaTiktok className="text-dark" />;
			case "snapchat":
				return <FaSnapchat className="text-warning" />;
			case "pinterest":
				return <FaPinterest className="text-danger" />;
			case "reddit":
				return <FaReddit className="text-warning" />;
			case "whatsapp":
				return <FaWhatsapp className="text-success" />;
			case "telegram":
				return <FaTelegram className="text-info" />;
			case "google":
				return <SiGoogle className="text-success" />;
			case "bing":
				return <MdSearch className="text-primary" />;
			case "yahoo":
				return <MdSearch className="text-purple" />;
			case "direct":
				return <MdLink className="text-secondary" />;
			default:
				return <MdSearch className="text-muted" />;
		}
	};

	// Function to get source brand color
	const getSourceBrandColor = (source) => {
		switch (source.toLowerCase()) {
			case "facebook":
				return "#1877F2"; // Facebook Blue
			case "instagram":
				return "#E4405F"; // Instagram Pink/Red
			case "twitter":
				return "#1DA1F2"; // Twitter Blue
			case "linkedin":
				return "#0A66C2"; // LinkedIn Blue
			case "youtube":
				return "#FF0000"; // YouTube Red
			case "tiktok":
				return "#000000"; // TikTok Black
			case "snapchat":
				return "#FFFC00"; // Snapchat Yellow
			case "pinterest":
				return "#BD081C"; // Pinterest Red
			case "reddit":
				return "#FF4500"; // Reddit Orange
			case "whatsapp":
				return "#25D366"; // WhatsApp Green
			case "telegram":
				return "#0088CC"; // Telegram Blue
			case "google":
				return "#4285F4"; // Google Blue
			case "bing":
				return "#0078D4"; // Bing Blue
			case "yahoo":
				return "#720E9E"; // Yahoo Purple
			case "direct":
				return "#6B7280"; // Direct Gray
			case "other":
				return "#10B981"; // Other Green (different from Facebook blue)
			default:
				// For unknown sources, use a different color palette to avoid conflicts
				const fallbackColors = [
					"#8B5CF6", // Purple
					"#06B6D4", // Cyan
					"#84CC16", // Lime
					"#F97316", // Orange
					"#EC4899", // Pink
					"#6366F1", // Indigo
					"#F59E0B", // Amber
					"#EF4444", // Red
				];
				// Use a simple hash to get consistent colors for unknown sources
				let hash = 0;
				for (let i = 0; i < source.length; i++) {
					hash = source.charCodeAt(i) + ((hash << 5) - hash);
				}
				return fallbackColors[Math.abs(hash) % fallbackColors.length];
		}
	};

	// Function to get device icon
	const getDeviceIcon = (device) => {
		switch (device.toLowerCase()) {
			case "desktop":
				return <FaDesktop className="text-primary" />;
			case "mobile":
				return <FaMobile className="text-success" />;
			case "tablet":
				return <FaTablet className="text-warning" />;
			default:
				return <FaDesktop className="text-muted" />;
		}
	};

	// Function to get browser icon
	const getBrowserIcon = (browser) => {
		switch (browser.toLowerCase()) {
			case "chrome":
				return <FaChrome className="text-success" />;
			case "firefox":
				return <FaFirefox className="text-warning" />;
			case "safari":
				return <FaSafari className="text-info" />;
			case "edge":
				return <FaEdge className="text-primary" />;
			case "opera":
				return <FaOpera className="text-danger" />;
			case "brave":
				return <SiBrave className="text-warning" />;
			default:
				return <FaChrome className="text-muted" />;
		}
	};

	// Function to get operating system icon
	const getOSIcon = (os) => {
		switch (os.toLowerCase()) {
			case "macos":
			case "mac":
				return <FaApple className="text-dark" />;
			case "linux":
				return <FaLinux className="text-warning" />;
			case "windows":
			case "win":
				return <FaWindows className="text-primary" />;
			case "android":
				return <FaAndroid className="text-success" />;
			case "ios":
				return <FaApple className="text-dark" />;
			default:
				return <FaDesktop className="text-muted" />;
		}
	};

	// Function to get date range based on filter with improved performance
	const getDateRange = useCallback(
		(filter) => {
			const now = new Date();
			const today = new Date(now);
			today.setHours(0, 0, 0, 0); // Start of today (midnight)
			const endOfToday = new Date(today);
			endOfToday.setHours(23, 59, 59, 999); // End of today

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
						// Set time to beginning and end of day
						startDate.setHours(0, 0, 0, 0);
						endDate.setHours(23, 59, 59, 999);
						return { start: startDate, end: endDate };
					}
					return { start: today, end: endOfToday };
				default:
					return null;
			}
		},
		[customStartDate, customEndDate]
	);

	// Function to get source tracking date range
	const getSourceDateRange = useCallback(
		(filter) => {
			const now = new Date();
			const today = new Date(now);
			today.setHours(0, 0, 0, 0); // Start of today (midnight)
			const endOfToday = new Date(today);
			endOfToday.setHours(23, 59, 59, 999); // End of today

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
					if (sourceCustomStartDate && sourceCustomEndDate) {
						const startDate = new Date(sourceCustomStartDate);
						const endDate = new Date(sourceCustomEndDate);
						// Set time to beginning and end of day
						startDate.setHours(0, 0, 0, 0);
						endDate.setHours(23, 59, 59, 999);
						return { start: startDate, end: endDate };
					}
					return { start: today, end: endOfToday };
				default:
					return null;
			}
		},
		[sourceCustomStartDate, sourceCustomEndDate]
	);

	// Memoized filtered data for instant updates
	const memoizedFilteredData = useMemo(() => {
		if (dateFilter === "all" || !analytics) {
			return analytics;
		}

		const dateRange = getDateRange(dateFilter);
		if (!dateRange) {
			return analytics;
		}

		// Pre-calculate time boundaries for performance
		const startTime = dateRange.start.getTime();
		const endTime = dateRange.end.getTime();

		// Ultra-optimized filtering function using native Array.filter
		const filterByDateRange = (timestamps) => {
			if (!timestamps || timestamps.length === 0) return [];

			// Use native Array.filter for maximum performance
			return timestamps.filter((timestamp) => {
				const time = new Date(timestamp).getTime();
				return time >= startTime && time <= endTime;
			});
		};

		// Batch filter all timestamp arrays for better performance
		const filteredData = {
			sellers: filterByDateRange(analytics.sellers_with_timestamps),
			buyers: filterByDateRange(analytics.buyers_with_timestamps),
			ads: filterByDateRange(analytics.ads_with_timestamps),
			reviews: filterByDateRange(analytics.reviews_with_timestamps),
			wishlists: filterByDateRange(analytics.wishlists_with_timestamps),
			paidTiers: filterByDateRange(analytics.paid_seller_tiers_with_timestamps),
			unpaidTiers: filterByDateRange(
				analytics.unpaid_seller_tiers_with_timestamps
			),
			adClicks: filterByDateRange(analytics.ad_clicks_with_timestamps),
			buyerAdClicks: filterByDateRange(
				analytics.buyer_ad_clicks_with_timestamps
			),
		};

		// Create filtered analytics object
		return {
			...analytics,
			total_sellers: filteredData.sellers.length,
			total_buyers: filteredData.buyers.length,
			total_ads: filteredData.ads.length,
			total_reviews: filteredData.reviews.length,
			total_ads_wish_listed: filteredData.wishlists.length,
			subscription_countdowns: filteredData.paidTiers.length,
			without_subscription: filteredData.unpaidTiers.length,
			total_ads_clicks: filteredData.adClicks.length,
			buyer_ad_clicks: filteredData.buyerAdClicks.length,
			// Include filtered timestamp arrays for trend calculations
			sellers_with_timestamps: filteredData.sellers,
			buyers_with_timestamps: filteredData.buyers,
			ads_with_timestamps: filteredData.ads,
			reviews_with_timestamps: filteredData.reviews,
			wishlists_with_timestamps: filteredData.wishlists,
			paid_seller_tiers_with_timestamps: filteredData.paidTiers,
			unpaid_seller_tiers_with_timestamps: filteredData.unpaidTiers,
			ad_clicks_with_timestamps: filteredData.adClicks,
			buyer_ad_clicks_with_timestamps: filteredData.buyerAdClicks,
			category_click_events: analytics.category_click_events || [], // Keep original for now
		};
	}, [dateFilter, customStartDate, customEndDate, analytics, getDateRange]);

	// Memoized filtered source data for source tracking modal
	const memoizedFilteredSourceData = useMemo(() => {
		if (sourceDateFilter === "all" || !sourceAnalytics) {
			return sourceAnalytics;
		}

		const dateRange = getSourceDateRange(sourceDateFilter);
		if (!dateRange) {
			return sourceAnalytics;
		}

		// Filter daily visits based on date range
		const filteredDailyVisits = {};
		const startTime = dateRange.start.getTime();
		const endTime = dateRange.end.getTime();

		Object.entries(sourceAnalytics.daily_visits || {}).forEach(
			([date, visits]) => {
				const dateTime = new Date(date).getTime();
				if (dateTime >= startTime && dateTime <= endTime) {
					filteredDailyVisits[date] = visits;
				}
			}
		);

		// Calculate filtered totals
		const totalVisits = Object.values(filteredDailyVisits).reduce(
			(sum, visits) => sum + visits,
			0
		);

		// For source distribution, we need to be more careful about proportional calculations
		// Only apply proportional filtering if we have actual daily data for sources
		const originalTotalVisits = sourceAnalytics.total_visits || 0;
		const filterRatio =
			originalTotalVisits > 0 ? totalVisits / originalTotalVisits : 0;

		// Only apply proportional filtering if the ratio is reasonable (not too skewed)
		const shouldApplyProportionalFilter = filterRatio > 0.1 && filterRatio < 10;

		const filteredSourceDistribution = {};
		if (shouldApplyProportionalFilter) {
			Object.entries(sourceAnalytics.source_distribution || {}).forEach(
				([source, count]) => {
					filteredSourceDistribution[source] = Math.round(count * filterRatio);
				}
			);
		} else {
			// If the ratio is too skewed, keep original distribution but adjust total
			Object.entries(sourceAnalytics.source_distribution || {}).forEach(
				([source, count]) => {
					filteredSourceDistribution[source] = count;
				}
			);
		}

		// For visitor engagement metrics, use more conservative proportional filtering
		const engagementFilterRatio = shouldApplyProportionalFilter
			? filterRatio
			: 1;

		const filteredUniqueVisitors = Math.round(
			(sourceAnalytics.unique_visitors || 0) * engagementFilterRatio
		);
		const filteredReturningVisitors = Math.round(
			(sourceAnalytics.returning_visitors || 0) * engagementFilterRatio
		);
		const filteredNewVisitors = Math.round(
			(sourceAnalytics.new_visitors || 0) * engagementFilterRatio
		);

		// Calculate average visits per visitor more accurately
		const filteredAvgVisitsPerVisitor =
			filteredUniqueVisitors > 0
				? Math.round(totalVisits / filteredUniqueVisitors)
				: 0;

		return {
			...sourceAnalytics,
			daily_visits: filteredDailyVisits,
			total_visits: totalVisits,
			source_distribution: filteredSourceDistribution,
			unique_visitors: filteredUniqueVisitors,
			returning_visitors: filteredReturningVisitors,
			new_visitors: filteredNewVisitors,
			avg_visits_per_visitor: filteredAvgVisitsPerVisitor,
		};
	}, [
		sourceDateFilter,
		sourceCustomStartDate,
		sourceCustomEndDate,
		sourceAnalytics,
		getSourceDateRange,
	]);

	useEffect(() => {
		const token = localStorage.getItem("token");

		// Debug: Check current source from localStorage
		const currentSource = localStorage.getItem("visit_source");
		const currentReferrer = localStorage.getItem("visit_referrer");
		// Current visit source and referrer retrieved silently

		const API_URL = `${process.env.REACT_APP_BACKEND_URL}/sales/analytics`;

		const fetchAnalytics = async () => {
			try {
				const res = await axios.get(`${API_URL}?t=${Date.now()}`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				// API response received successfully
				setAnalytics(res.data);

				// Set source analytics if available
				if (res.data.source_analytics) {
					// Source analytics data retrieved successfully
					setSourceAnalytics(res.data.source_analytics);
				} else {
					// No source analytics data available
				}
			} catch (err) {
				console.error("Failed to fetch analytics:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchAnalytics();
	}, []);

	// Function to get the correct key for the selected card
	const getFilterKey = (title) => {
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
				return "total_ads_clicks"; // Fixed: was returning "buyer_ad_clicks"
			default:
				return "total_sellers";
		}
	};

	// Calculate growth rate and trend direction with precise logic
	const calculateGrowthAndTrend = () => {
		if (!analytics)
			return {
				growthRate: "0.0",
				trend: { direction: "stable", icon: "→", color: "text-gray-600" },
			};

		const timestamps = getTimestampsForCard();
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
				const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, so convert to Monday = 0
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

	// Calculate growth rate (for backward compatibility)
	const calculateGrowthRate = () => {
		return calculateGrowthAndTrend().growthRate;
	};

	// Get source trend based on recent activity
	const getSourceTrend = (source) => {
		if (!sourceAnalytics?.daily_visits) return "Active";

		// Get recent 7 days vs previous 7 days for this source
		const today = new Date();
		const recent7Days = [];
		const previous7Days = [];

		// Calculate visits for recent 7 days
		for (let i = 6; i >= 0; i--) {
			const date = new Date(today);
			date.setDate(today.getDate() - i);
			const dateStr = date.toISOString().split("T")[0];
			recent7Days.push(sourceAnalytics.daily_visits[dateStr] || 0);
		}

		// Calculate visits for previous 7 days
		for (let i = 13; i >= 7; i--) {
			const date = new Date(today);
			date.setDate(today.getDate() - i);
			const dateStr = date.toISOString().split("T")[0];
			previous7Days.push(sourceAnalytics.daily_visits[dateStr] || 0);
		}

		const recentTotal = recent7Days.reduce((sum, count) => sum + count, 0);
		const previousTotal = previous7Days.reduce((sum, count) => sum + count, 0);

		if (previousTotal === 0) return "New";

		const growthRate = ((recentTotal - previousTotal) / previousTotal) * 100;

		if (growthRate > 10) return "Growing";
		if (growthRate < -10) return "Declining";
		return "Active";
	};

	// Generate trend data based on selected date filter
	const generateTrendData = () => {
		if (!analytics) return { data: [0, 0, 0, 0, 0, 0, 0], labels: [] };

		const timestamps = getTimestampsForCard();
		if (!timestamps || timestamps.length === 0)
			return { data: [0, 0, 0, 0, 0, 0, 0], labels: [] };

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

					const count = timestamps.filter((timestamp) => {
						const ts = new Date(timestamp);
						return ts >= hour && ts < nextHour;
					}).length;

					data.push(count);
					// Format hour labels more clearly
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
					date.setHours(0, 0, 0, 0);
					const nextDate = new Date(date);
					nextDate.setDate(date.getDate() + 1);

					const count = timestamps.filter((timestamp) => {
						const ts = new Date(timestamp);
						return ts >= date && ts < nextDate;
					}).length;

					data.push(count);
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

					const count = timestamps.filter((timestamp) => {
						const ts = new Date(timestamp);
						return ts >= weekStart && ts < weekEnd;
					}).length;

					data.push(count);
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

					const count = timestamps.filter((timestamp) => {
						const ts = new Date(timestamp);
						return ts >= monthStart && ts < monthEnd;
					}).length;

					data.push(count);
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
							date.setHours(0, 0, 0, 0);
							const nextDate = new Date(date);
							nextDate.setDate(date.getDate() + 1);

							const count = timestamps.filter((timestamp) => {
								const ts = new Date(timestamp);
								return ts >= date && ts < nextDate;
							}).length;

							data.push(count);
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

							const count = timestamps.filter((timestamp) => {
								const ts = new Date(timestamp);
								return ts >= weekStart && ts < weekEnd;
							}).length;

							data.push(count);
							labels.push(`Week ${i + 1}`);
						}
					}
				} else {
					// Fallback to last 7 days
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

						data.push(count);
						labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
					}
				}
				break;

			default: // "all"
				// Show last 30 days as default for better context
				for (let i = 29; i >= 0; i--) {
					const date = new Date(today);
					date.setDate(today.getDate() - i);
					date.setHours(0, 0, 0, 0);
					const nextDate = new Date(date);
					nextDate.setDate(date.getDate() + 1);

					const count = timestamps.filter((timestamp) => {
						const ts = new Date(timestamp);
						return ts >= date && ts < nextDate;
					}).length;

					data.push(count);
					// Show date for better context
					labels.push(
						date.toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
						})
					);
				}
				break;
		}

		// Return both data and labels for the chart
		return { data, labels };
	};

	// Calculate trend direction (for backward compatibility)
	const calculateTrendDirection = () => {
		return calculateGrowthAndTrend().trend;
	};

	// Generate source tracking trend data
	const generateSourceTrackingTrendData = () => {
		if (!sourceAnalytics) return { data: [0, 0, 0, 0, 0, 0, 0], labels: [] };

		const dailyVisits = sourceAnalytics.daily_visits || {};
		const today = new Date();
		let data = [];
		let labels = [];

		// For very low traffic scenarios, use actual daily data instead of proportional calculations
		const totalVisits = sourceAnalytics.total_visits || 0;
		const useActualData = totalVisits < 50; // If total visits is less than 50, use actual data

		// Calculate the source-specific ratio for proportional data
		const getSourceSpecificRatio = () => {
			if (!selectedSourceCard) return 1;

			if (selectedSourceCard?.sources) {
				// For social media and search engine visits, calculate the ratio
				const totalSourceVisits = selectedSourceCard.sources.reduce(
					(total, source) => {
						return total + (sourceAnalytics.source_distribution?.[source] || 0);
					},
					0
				);
				const totalVisits = sourceAnalytics.total_visits || 0;
				return totalVisits > 0 ? totalSourceVisits / totalVisits : 0;
			} else if (selectedSourceCard?.data?.direct !== undefined) {
				// For direct visits
				const directVisits = sourceAnalytics.source_distribution?.direct || 0;
				const totalVisits = sourceAnalytics.total_visits || 0;
				return totalVisits > 0 ? directVisits / totalVisits : 0;
			}
			return 1; // For total page visits, use full data
		};

		const sourceRatio = getSourceSpecificRatio();
		const safeSourceRatio = Math.max(0, Math.min(1, sourceRatio));

		switch (sourceDateFilter) {
			case "today":
				// Show hourly data for today
				for (let i = 23; i >= 0; i--) {
					const hour = new Date(today);
					hour.setHours(today.getHours() - i, 0, 0, 0);
					const nextHour = new Date(hour);
					nextHour.setHours(hour.getHours() + 1);

					// For today, we'll show the source-specific visits for today divided by hours
					const todayVisits =
						dailyVisits[today.toISOString().split("T")[0]] || 0;
					const sourceSpecificVisits = useActualData
						? Math.round(todayVisits * safeSourceRatio)
						: Math.round(todayVisits * safeSourceRatio);
					const hourlyVisits = Math.round(sourceSpecificVisits / 24);
					data.push(hourlyVisits);
					// Format hour labels more clearly
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
					const sourceSpecificVisits = Math.round(visits * safeSourceRatio);
					data.push(sourceSpecificVisits);
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

					const sourceSpecificWeekVisits = Math.round(
						weekVisits * safeSourceRatio
					);
					data.push(sourceSpecificWeekVisits);
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

					const sourceSpecificMonthVisits = Math.round(
						monthVisits * safeSourceRatio
					);
					data.push(sourceSpecificMonthVisits);
					labels.push(
						monthStart.toLocaleDateString("en-US", { month: "short" })
					);
				}
				break;

			case "custom":
				if (sourceCustomStartDate && sourceCustomEndDate) {
					const startDate = new Date(sourceCustomStartDate);
					const endDate = new Date(sourceCustomEndDate);
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
							const sourceSpecificVisits = Math.round(visits * safeSourceRatio);
							data.push(sourceSpecificVisits);
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

							const sourceSpecificWeekVisits = Math.round(
								weekVisits * safeSourceRatio
							);
							data.push(sourceSpecificWeekVisits);
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
						const sourceSpecificVisits = Math.round(visits * sourceRatio);
						data.push(sourceSpecificVisits);
						labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
					}
				}
				break;

			default: // "all"
				// Show last 30 days as default for better context
				for (let i = 29; i >= 0; i--) {
					const date = new Date(today);
					date.setDate(today.getDate() - i);
					const dateStr = date.toISOString().split("T")[0];

					const visits = dailyVisits[dateStr] || 0;
					const sourceSpecificVisits = Math.round(visits * safeSourceRatio);
					data.push(sourceSpecificVisits);
					// Show date for better context
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

	// Get timestamps for the selected card
	const getTimestampsForCard = () => {
		// Use filtered data if available, otherwise use original analytics
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

	// Calculate conversion rate (buyers / ad clicks)
	const calculateConversionRate = () => {
		// Use filtered data if available, otherwise use original analytics
		const dataSource = memoizedFilteredData || analytics;
		if (!dataSource) return 0;

		const totalBuyers = dataSource.total_buyers || 0;
		const totalClicks = dataSource.total_ads_clicks || 0;

		if (totalClicks === 0) return 0;

		return ((totalBuyers / totalClicks) * 100).toFixed(1);
	};

	// Get category distribution for ads
	const getCategoryDistribution = () => {
		if (!analytics || !analytics.category_click_events) {
			return [];
		}

		const categoryData = analytics.category_click_events;

		// Check if categoryData is an array and has items
		if (!Array.isArray(categoryData) || categoryData.length === 0) {
			return [];
		}

		// Use ad_clicks as the count (based on backend structure)
		const total = categoryData.reduce((sum, item) => {
			const count = item.ad_clicks || 0;
			return sum + count;
		}, 0);

		return categoryData.slice(0, 3).map((item) => {
			const count = item.ad_clicks || 0;
			const name = item.category_name || "Unknown";

			return {
				name: name,
				percentage: total > 0 ? Math.round((count / total) * 100) : 0,
				count: count,
			};
		});
	};

	if (loading) {
		return (
			<>
				<TopNavbar />
				<div className="flex justify-center items-center h-screen w-full">
					<Spinner
						variant="warning"
						name="cube-grid"
						style={{ width: 100, height: 100 }}
					/>
				</div>
			</>
		);
	}

	if (!analytics) {
		return (
			<>
				<TopNavbar />
				<div className="flex justify-center items-center h-screen w-full">
					<div className="text-center">
						<div className="mb-3">
							<svg
								className="text-danger"
								width="48"
								height="48"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
								<path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
							</svg>
						</div>
						<h5 className="text-danger mb-2">Failed to Load Analytics</h5>
						<p className="text-muted">
							Unable to fetch dashboard data. Please try refreshing the page.
						</p>
						<button
							className="btn btn-primary mt-3"
							onClick={() => window.location.reload()}
						>
							Refresh Page
						</button>
					</div>
				</div>
			</>
		);
	}

	const {
		total_sellers,
		subscription_countdowns,
		without_subscription,
		total_ads_clicks,
		category_click_events,
		buyer_ad_clicks,
	} = analytics;

	// Use filtered data for renewal rate calculation if available
	const dataSource = memoizedFilteredData || analytics;
	let renewalRate =
		dataSource.total_sellers > 0
			? (
					(dataSource.subscription_countdowns / dataSource.total_sellers) *
					100
			  ).toFixed(2)
			: 0;

	const pieData = {
		labels: ["Active Subscriptions", "Inactive Subscriptions"],
		datasets: [
			{
				label: "Sellers",
				data: [
					dataSource.subscription_countdowns,
					dataSource.without_subscription,
				],
				backgroundColor: ["#4caf50", "#f44336"],
				borderColor: ["#fff", "#fff"],
				borderWidth: 2,
			},
		],
	};

	const barData = {
		labels: ["Renewal Rate"],
		datasets: [
			{
				label: "Renewal %",
				data: [parseFloat(renewalRate)],
				backgroundColor: "#4caf50",
			},
		],
	};

	const buyerAdClickBarData = {
		labels: ["Cummulative Ad Clicks"],
		datasets: [
			{
				label: "Total Ad Clicks",
				data: [dataSource.buyer_ad_clicks],
				backgroundColor: "rgba(54, 162, 235, 0.6)",
				borderColor: "rgba(54, 162, 235, 1)",
				borderWidth: 1,
			},
		],
	};

	const buyerAdClickBarOptions = {
		responsive: true,
		plugins: {
			legend: { display: false },
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

	const barOptions = {
		responsive: true,
		plugins: {
			legend: { display: false },
		},
		scales: {
			y: {
				beginAtZero: true,
				max: 100,
				ticks: {
					callback: (value) => `${value}%`,
				},
			},
		},
	};

	return (
		<>
			<TopNavbar />

			<Container fluid className="analytics-reporting-page">
				<Row className="g-0">
					<Col xs={12} md={2} className="pe-3">
						<Sidebar />
					</Col>

					<Col xs={12} md={10}>
						<div className="content-area">
							<div className="d-flex justify-content-between align-items-center mb-4 bg-secondary p-3 text-white rounded">
								<h2 className="mb-0">Overview</h2>
								<span className="fw-semibold">Hello, Sales Team</span>
							</div>
							<Row className="g-3">
								{[
									{ title: "Total Sellers", value: dataSource.total_sellers },
									{ title: "Total Buyers", value: dataSource.total_buyers },
									{ title: "Total Reviews", value: dataSource.total_reviews },
									{ title: "Total Ads", value: dataSource.total_ads },
									{
										title: "Total Wishlists",
										value: dataSource.total_ads_wish_listed,
									},
									{
										title: "Total Ads Clicks",
										value: dataSource.total_ads_clicks,
									},
								].map(({ title, value }, index) => (
									<Col xs={12} sm={6} lg={4} xl={3} key={index}>
										<div
											className="stat-card p-3 rounded shadow-sm bg-white h-100"
											style={{
												cursor: "pointer",
											}}
											onClick={() => {
												setSelectedCard({ title, value });
												setDateFilter("all");
												setCustomStartDate("");
												setCustomEndDate("");
												setShowModal(true);
											}}
										>
											<div className="d-flex justify-content-between align-items-center mb-2">
												<h6 className="mb-0 fw-semibold text-muted">{title}</h6>
												<div className="dots">⋯</div>
											</div>
											<h3 className="fw-bold">
												{(value || 0).toLocaleString()}
											</h3>
										</div>
									</Col>
								))}
							</Row>

							<Row className="g-6">
								<h3 className="pt-5 fw-bold">Seller related </h3>

								<Col xs={12} sm={6} md={4} className="text-center mt-4 ">
									<Card className="p-3 shadow-sm custom-card">
										<Card.Header className="text-center fw-bold">
											Subscription Distribution
										</Card.Header>
										<Card.Body className="">
											<Pie data={pieData} className="" />
										</Card.Body>
									</Card>
								</Col>

								<Col xs={12} sm={6} md={4} className="text-center mt-4 ">
									<Card className="p-3 shadow-sm custom-card h-100">
										<Card.Header className="text-center fw-bold">
											Renewal Rate {renewalRate} (%)
										</Card.Header>
										<Card.Body>
											<Bar
												data={barData}
												options={barOptions}
												className="h-100"
											/>
										</Card.Body>
									</Card>
								</Col>

								<Col
									xs={12}
									sm={6}
									md={4}
									className="text-center mt-4 "
									onClick={() => {
										// Handle click event
									}}
								>
									<Card className="p-3 shadow-sm custom-card h-100">
										<Card.Header className="text-center fw-bold">
											Total Ad Clicks
										</Card.Header>
										<Card.Body style={{ height: "250px" }}>
											<Bar
												data={buyerAdClickBarData}
												options={buyerAdClickBarOptions}
												className="h-100"
											/>
										</Card.Body>
									</Card>
								</Col>
							</Row>
							<Row className="mt-4 g-4">
								<h3 className="pt-1 fw-bold pb-3">Buyer related </h3>

								<Col xs={12} md={12} className="pt-4">
									<Card className="mb-4 custom-card">
										<Card.Header className="justify-content-center">
											Category Click Events
										</Card.Header>
										<Card.Body>
											<CategoryClickEvents data={category_click_events} />
										</Card.Body>
									</Card>
								</Col>
							</Row>

							<Row className="mt-4 g-4 mb-5">
								<Col xs={12}>
									<h3 className="pt-1 fw-bold pb-3">
										Source Tracking Analytics
									</h3>
								</Col>

								{/* Key Metrics Cards */}
								<Col xs={12} sm={6} lg={3}>
									<div
										className="stat-card p-3 rounded shadow-sm bg-white h-100"
										style={{ cursor: "pointer" }}
										onClick={() => {
											setSelectedSourceCard({
												title: "Total Page Visits",
												value: sourceAnalytics?.total_visits || 0,
												data: sourceAnalytics?.daily_visits || {},
											});
											setSourceDateFilter("all");
											setSourceCustomStartDate("");
											setSourceCustomEndDate("");
											setShowSourceModal(true);
										}}
									>
										<div className="d-flex justify-content-between align-items-center mb-2">
											<h6 className="mb-0 fw-semibold text-muted">
												Total Page Visits
											</h6>
											<div className="text-success">
												<svg
													className="w-4 h-4"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
												</svg>
											</div>
										</div>
										<h3 className="fw-bold text-primary">
											{(sourceAnalytics?.total_visits || 0).toLocaleString()}
										</h3>
										<small className="text-muted">Last 30 days</small>
									</div>
								</Col>

								<Col xs={12} sm={6} lg={3}>
									<div
										className="stat-card p-3 rounded shadow-sm bg-white h-100"
										style={{ cursor: "pointer" }}
										onClick={() => {
											const socialSources = [
												"facebook",
												"whatsapp",
												"telegram",
												"twitter",
												"instagram",
												"linkedin",
												"youtube",
												"tiktok",
												"snapchat",
												"pinterest",
												"reddit",
											];
											const socialVisits = socialSources.reduce(
												(total, source) => {
													return (
														total +
														(sourceAnalytics?.source_distribution?.[source] ||
															0)
													);
												},
												0
											);

											setSelectedSourceCard({
												title: "Social Media Visits",
												value: socialVisits,
												data: sourceAnalytics?.source_distribution || {},
												sources: socialSources,
											});
											setSourceDateFilter("all");
											setSourceCustomStartDate("");
											setSourceCustomEndDate("");
											setShowSourceModal(true);
										}}
									>
										<div className="d-flex justify-content-between align-items-center mb-2">
											<h6 className="mb-0 fw-semibold text-muted">
												Social Media Visits
											</h6>
											<div className="text-info">
												<svg
													className="w-4 h-4"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
													<path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
												</svg>
											</div>
										</div>
										<h3 className="fw-bold text-info">
											{(() => {
												const socialSources = [
													"facebook",
													"whatsapp",
													"telegram",
													"twitter",
													"instagram",
													"linkedin",
													"youtube",
													"tiktok",
													"snapchat",
													"pinterest",
													"reddit",
												];
												const total = socialSources.reduce((total, source) => {
													return (
														total +
														(sourceAnalytics?.source_distribution?.[source] ||
															0)
													);
												}, 0);
												return total.toLocaleString();
											})()}
										</h3>
										<small className="text-muted">
											Combined social traffic
										</small>
									</div>
								</Col>

								<Col xs={12} sm={6} lg={3}>
									<div
										className="stat-card p-3 rounded shadow-sm bg-white h-100"
										style={{ cursor: "pointer" }}
										onClick={() => {
											setSelectedSourceCard({
												title: "Direct Visits",
												value:
													sourceAnalytics?.source_distribution?.direct || 0,
												data: {
													direct:
														sourceAnalytics?.source_distribution?.direct || 0,
												},
											});
											setSourceDateFilter("all");
											setSourceCustomStartDate("");
											setSourceCustomEndDate("");
											setShowSourceModal(true);
										}}
									>
										<div className="d-flex justify-content-between align-items-center mb-2">
											<h6 className="mb-0 fw-semibold text-muted">
												Direct Visits
											</h6>
											<div className="text-warning">
												<svg
													className="w-4 h-4"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
														clipRule="evenodd"
													/>
												</svg>
											</div>
										</div>
										<h3 className="fw-bold text-warning">
											{(
												sourceAnalytics?.source_distribution?.direct || 0
											).toLocaleString()}
										</h3>
										<small className="text-muted">Direct traffic</small>
									</div>
								</Col>

								<Col xs={12} sm={6} lg={3}>
									<div
										className="stat-card p-3 rounded shadow-sm bg-white h-100"
										style={{ cursor: "pointer" }}
										onClick={() => {
											const searchSources = ["google", "bing", "yahoo"];
											const searchVisits = searchSources.reduce(
												(total, source) => {
													return (
														total +
														(sourceAnalytics?.source_distribution?.[source] ||
															0)
													);
												},
												0
											);

											setSelectedSourceCard({
												title: "Search Engine Visits",
												value: searchVisits,
												data: sourceAnalytics?.source_distribution || {},
												sources: searchSources,
											});
											setSourceDateFilter("all");
											setSourceCustomStartDate("");
											setSourceCustomEndDate("");
											setShowSourceModal(true);
										}}
									>
										<div className="d-flex justify-content-between align-items-center mb-2">
											<h6 className="mb-0 fw-semibold text-muted">
												Search Engine Visits
											</h6>
											<div className="text-success">
												<svg
													className="w-4 h-4"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
														clipRule="evenodd"
													/>
												</svg>
											</div>
										</div>
										<h3 className="fw-bold text-success">
											{(() => {
												const searchSources = ["google", "bing", "yahoo"];
												const total = searchSources.reduce((total, source) => {
													return (
														total +
														(sourceAnalytics?.source_distribution?.[source] ||
															0)
													);
												}, 0);
												return total.toLocaleString();
											})()}
										</h3>
										<small className="text-muted">Organic search</small>
									</div>
								</Col>
							</Row>

							{/* Unique Visitor Metrics Row */}
							<Row className="mt-4 g-4 mb-5">
								<Col xs={12}>
									<h4 className="pt-1 fw-bold pb-3">
										Visitor Engagement Metrics
									</h4>
								</Col>

								<Col xs={12} sm={6} lg={3}>
									<div className="stat-card p-3 rounded shadow-sm bg-white h-100">
										<div className="d-flex justify-content-between align-items-center mb-2">
											<h6 className="mb-0 fw-semibold text-muted">
												Unique Visitors
											</h6>
											<div className="text-success">
												<svg
													className="w-4 h-4"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
											</div>
										</div>
										<h3 className="fw-bold text-success">
											{(sourceAnalytics?.unique_visitors || 0).toLocaleString()}
										</h3>
										<small className="text-muted">Individual users</small>
									</div>
								</Col>

								<Col xs={12} sm={6} lg={3}>
									<div className="stat-card p-3 rounded shadow-sm bg-white h-100">
										<div className="d-flex justify-content-between align-items-center mb-2">
											<h6 className="mb-0 fw-semibold text-muted">
												Returning Visitors
											</h6>
											<div className="text-warning">
												<svg
													className="w-4 h-4"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
												</svg>
											</div>
										</div>
										<h3 className="fw-bold text-warning">
											{(
												sourceAnalytics?.returning_visitors || 0
											).toLocaleString()}
										</h3>
										<small className="text-muted">Repeat visitors</small>
									</div>
								</Col>

								<Col xs={12} sm={6} lg={3}>
									<div className="stat-card p-3 rounded shadow-sm bg-white h-100">
										<div className="d-flex justify-content-between align-items-center mb-2">
											<h6 className="mb-0 fw-semibold text-muted">
												New Visitors
											</h6>
											<div className="text-info">
												<svg
													className="w-4 h-4"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
												</svg>
											</div>
										</div>
										<h3 className="fw-bold text-info">
											{(sourceAnalytics?.new_visitors || 0).toLocaleString()}
										</h3>
										<small className="text-muted">First-time visitors</small>
									</div>
								</Col>

								<Col xs={12} sm={6} lg={3}>
									<div className="stat-card p-3 rounded shadow-sm bg-white h-100">
										<div className="d-flex justify-content-between align-items-center mb-2">
											<h6 className="mb-0 fw-semibold text-muted">
												Avg Visits/Visitor
											</h6>
											<div className="text-primary">
												<svg
													className="w-4 h-4"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
													<path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
												</svg>
											</div>
										</div>
										<h3 className="fw-bold text-primary">
											{(
												sourceAnalytics?.avg_visits_per_visitor || 0
											).toLocaleString()}
										</h3>
										<small className="text-muted">Engagement rate</small>
									</div>
								</Col>
							</Row>

							{/* Source Distribution Charts and Tables */}
							{sourceAnalytics && (
								<Row className="mt-4 g-4 mb-5">
									{/* Detailed Source Analytics - Split into Left (Table) and Right (Pie Chart) */}
									<Col xs={12} lg={6}>
										<Card className="p-3 shadow-sm custom-card h-100">
											<Card.Header className="text-center fw-bold">
												Source Analytics Table
											</Card.Header>
											<Card.Body>
												<div className="table-responsive">
													<table className="table table-hover">
														<thead className="table-light">
															<tr>
																<th>Source</th>
																<th>Visits</th>
																<th>Percentage</th>
																<th>Trend</th>
															</tr>
														</thead>
														<tbody>
															{sourceAnalytics.top_sources &&
															sourceAnalytics.top_sources.length > 0 ? (
																sourceAnalytics.top_sources.map(
																	([source, count], index) => {
																		const percentage =
																			sourceAnalytics.total_visits > 0
																				? (
																						(count /
																							sourceAnalytics.total_visits) *
																						100
																				  ).toFixed(1)
																				: 0;
																		const isFacebook = source === "facebook";
																		return (
																			<tr key={index}>
																				<td>
																					<div className="d-flex align-items-center">
																						<div
																							className="me-2"
																							style={{ fontSize: "18px" }}
																						>
																							{getSourceIcon(source)}
																						</div>
																						<span className="text-capitalize fw-medium">
																							{source === "direct"
																								? "Direct"
																								: source === "facebook"
																								? "Facebook"
																								: source}
																						</span>
																					</div>
																				</td>
																				<td>
																					<span className="fw-bold text-primary">
																						{count.toLocaleString()}
																					</span>
																				</td>
																				<td>
																					<div className="d-flex align-items-center">
																						<div
																							className="progress me-2"
																							style={{
																								width: "60px",
																								height: "6px",
																							}}
																						>
																							<div
																								className={`progress-bar ${
																									isFacebook
																										? "bg-primary"
																										: "bg-primary"
																								}`}
																								style={{
																									width: `${percentage}%`,
																								}}
																							></div>
																						</div>
																						<span className="text-muted small">
																							{percentage}%
																						</span>
																					</div>
																				</td>
																				<td>
																					<span className="badge bg-success">
																						{getSourceTrend(source)}
																					</span>
																				</td>
																			</tr>
																		);
																	}
																)
															) : (
																<tr>
																	<td
																		colSpan="4"
																		className="text-center text-muted py-4"
																	>
																		No source data available
																	</td>
																</tr>
															)}
														</tbody>
													</table>
												</div>
											</Card.Body>
										</Card>
									</Col>

									{/* Right Column - Pie Chart */}
									<Col xs={12} lg={6}>
										<Card className="p-3 shadow-sm custom-card h-100">
											<Card.Header className="text-center fw-bold">
												Source Distribution Chart
											</Card.Header>
											<Card.Body>
												{sourceAnalytics.top_sources &&
												sourceAnalytics.top_sources.length > 0 ? (
													<div className="d-flex justify-content-center">
														<Pie
															data={{
																labels: sourceAnalytics.top_sources.map(
																	([source]) =>
																		source === "direct"
																			? "Direct"
																			: source === "facebook"
																			? "Facebook"
																			: source.charAt(0).toUpperCase() +
																			  source.slice(1)
																),
																datasets: [
																	{
																		data: sourceAnalytics.top_sources.map(
																			([, count]) => count
																		),
																		backgroundColor:
																			sourceAnalytics.top_sources.map(
																				([source]) => {
																					// Use distinct brand colors for each source
																					switch (source.toLowerCase()) {
																						case "facebook":
																							return "#1877F2"; // Facebook Blue
																						case "instagram":
																							return "#E4405F"; // Instagram Pink/Red
																						case "twitter":
																							return "#1DA1F2"; // Twitter Blue
																						case "linkedin":
																							return "#0A66C2"; // LinkedIn Blue
																						case "youtube":
																							return "#FF0000"; // YouTube Red
																						case "tiktok":
																							return "#000000"; // TikTok Black
																						case "snapchat":
																							return "#FFFC00"; // Snapchat Yellow
																						case "pinterest":
																							return "#BD081C"; // Pinterest Red
																						case "reddit":
																							return "#FF4500"; // Reddit Orange
																						case "whatsapp":
																							return "#25D366"; // WhatsApp Green
																						case "telegram":
																							return "#0088CC"; // Telegram Blue
																						case "google":
																							return "#4285F4"; // Google Blue
																						case "bing":
																							return "#0078D4"; // Bing Blue
																						case "yahoo":
																							return "#720E9E"; // Yahoo Purple
																						case "direct":
																							return "#6B7280"; // Direct Gray
																						default:
																							// Fallback colors for unknown sources
																							const fallbackColors = [
																								"#3B82F6", // Blue
																								"#10B981", // Green
																								"#F59E0B", // Yellow
																								"#EF4444", // Red
																								"#8B5CF6", // Purple
																								"#06B6D4", // Cyan
																								"#84CC16", // Lime
																								"#F97316", // Orange
																								"#EC4899", // Pink
																								"#6366F1", // Indigo
																							];
																							return fallbackColors[
																								sourceAnalytics.top_sources.findIndex(
																									([s]) => s === source
																								) % fallbackColors.length
																							];
																					}
																				}
																			),
																		borderColor: "#fff",
																		borderWidth: 2,
																	},
																],
															}}
															options={{
																responsive: true,
																maintainAspectRatio: false,
																plugins: {
																	legend: {
																		position: "bottom",
																		labels: {
																			padding: 20,
																			usePointStyle: true,
																		},
																	},
																},
															}}
															height={300}
														/>
													</div>
												) : (
													<div className="text-center text-muted py-5">
														No source data available
													</div>
												)}
											</Card.Body>
										</Card>
									</Col>
								</Row>
							)}

							{/* Device Analytics Section */}
							{analytics?.device_analytics && (
								<Row className="mt-4 g-4">
									<Col xs={12}>
										<h3 className="pt-1 fw-bold pb-3">
											Device & Browser Analytics
										</h3>
									</Col>

									{/* Device Types - Table and Chart */}
									<Col xs={12} lg={6}>
										<Card className="p-3 shadow-sm custom-card h-100">
											<Card.Header className="text-center fw-bold">
												Device Types
											</Card.Header>
											<Card.Body>
												<Row>
													{/* Table */}
													<Col xs={12} md={6}>
														<div className="table-responsive">
															<table className="table table-sm">
																<thead>
																	<tr>
																		<th>Device</th>
																		<th>Visits</th>
																		<th>%</th>
																	</tr>
																</thead>
																<tbody>
																	{Object.entries(
																		analytics.device_analytics.device_types ||
																			{}
																	).map(([device, count]) => {
																		const percentage =
																			analytics.device_analytics.total_devices >
																			0
																				? (
																						(count /
																							analytics.device_analytics
																								.total_devices) *
																						100
																				  ).toFixed(1)
																				: 0;
																		return (
																			<tr key={device}>
																				<td className="text-capitalize small">
																					<div className="d-flex align-items-center">
																						<div
																							className="me-2"
																							style={{ fontSize: "16px" }}
																						>
																							{getDeviceIcon(device)}
																						</div>
																						<span>{device}</span>
																					</div>
																				</td>
																				<td className="fw-bold small">
																					{count}
																				</td>
																				<td className="small">{percentage}%</td>
																			</tr>
																		);
																	})}
																</tbody>
															</table>
														</div>
													</Col>

													{/* Pie Chart */}
													<Col xs={12} md={6}>
														{Object.keys(
															analytics.device_analytics.device_types || {}
														).length > 0 ? (
															<Pie
																data={{
																	labels: Object.keys(
																		analytics.device_analytics.device_types ||
																			{}
																	).map(
																		(device) =>
																			device.charAt(0).toUpperCase() +
																			device.slice(1)
																	),
																	datasets: [
																		{
																			data: Object.values(
																				analytics.device_analytics
																					.device_types || {}
																			),
																			backgroundColor: [
																				"#3B82F6",
																				"#10B981",
																				"#F59E0B",
																				"#EF4444",
																				"#8B5CF6",
																			],
																			borderColor: "#fff",
																			borderWidth: 2,
																		},
																	],
																}}
																options={{
																	responsive: true,
																	maintainAspectRatio: false,
																	plugins: {
																		legend: {
																			position: "bottom",
																			labels: {
																				padding: 10,
																				usePointStyle: true,
																				font: { size: 10 },
																			},
																		},
																	},
																}}
																height={200}
															/>
														) : (
															<div className="text-center text-muted py-4">
																No device data available
															</div>
														)}
													</Col>
												</Row>
											</Card.Body>
										</Card>
									</Col>

									{/* Top Browsers - Table and Chart */}
									<Col xs={12} lg={6}>
										<Card className="p-3 shadow-sm custom-card h-100">
											<Card.Header className="text-center fw-bold">
												Top Browsers
											</Card.Header>
											<Card.Body>
												<Row>
													{/* Table */}
													<Col xs={12} md={6}>
														<div className="table-responsive">
															<table className="table table-sm">
																<thead>
																	<tr>
																		<th>Browser</th>
																		<th>Visits</th>
																		<th>%</th>
																	</tr>
																</thead>
																<tbody>
																	{Object.entries(
																		analytics.device_analytics.browsers || {}
																	)
																		.sort(([, a], [, b]) => b - a)
																		.slice(0, 5)
																		.map(([browser, count]) => {
																			const percentage =
																				analytics.device_analytics
																					.total_devices > 0
																					? (
																							(count /
																								analytics.device_analytics
																									.total_devices) *
																							100
																					  ).toFixed(1)
																					: 0;
																			return (
																				<tr key={browser}>
																					<td className="small">
																						<div className="d-flex align-items-center">
																							<div
																								className="me-2"
																								style={{ fontSize: "16px" }}
																							>
																								{getBrowserIcon(browser)}
																							</div>
																							<span>{browser}</span>
																						</div>
																					</td>
																					<td className="fw-bold small">
																						{count}
																					</td>
																					<td className="small">
																						{percentage}%
																					</td>
																				</tr>
																			);
																		})}
																</tbody>
															</table>
														</div>
													</Col>

													{/* Pie Chart */}
													<Col xs={12} md={6}>
														{Object.keys(
															analytics.device_analytics.browsers || {}
														).length > 0 ? (
															<Pie
																data={{
																	labels: Object.entries(
																		analytics.device_analytics.browsers || {}
																	)
																		.sort(([, a], [, b]) => b - a)
																		.slice(0, 5)
																		.map(([browser]) => browser),
																	datasets: [
																		{
																			data: Object.entries(
																				analytics.device_analytics.browsers ||
																					{}
																			)
																				.sort(([, a], [, b]) => b - a)
																				.slice(0, 5)
																				.map(([, count]) => count),
																			backgroundColor: [
																				"#10B981",
																				"#3B82F6",
																				"#F59E0B",
																				"#EF4444",
																				"#8B5CF6",
																			],
																			borderColor: "#fff",
																			borderWidth: 2,
																		},
																	],
																}}
																options={{
																	responsive: true,
																	maintainAspectRatio: false,
																	plugins: {
																		legend: {
																			position: "bottom",
																			labels: {
																				padding: 10,
																				usePointStyle: true,
																				font: { size: 10 },
																			},
																		},
																	},
																}}
																height={200}
															/>
														) : (
															<div className="text-center text-muted py-4">
																No browser data available
															</div>
														)}
													</Col>
												</Row>
											</Card.Body>
										</Card>
									</Col>

									{/* Operating Systems - Table and Chart */}
									<Col xs={12} lg={6}>
										<Card className="p-3 shadow-sm custom-card h-100">
											<Card.Header className="text-center fw-bold">
												Operating Systems
											</Card.Header>
											<Card.Body>
												<Row>
													{/* Table */}
													<Col xs={12} md={6}>
														<div className="table-responsive">
															<table className="table table-sm">
																<thead>
																	<tr>
																		<th>OS</th>
																		<th>Visits</th>
																		<th>%</th>
																	</tr>
																</thead>
																<tbody>
																	{Object.entries(
																		analytics.device_analytics
																			.operating_systems || {}
																	)
																		.sort(([, a], [, b]) => b - a)
																		.slice(0, 5)
																		.map(([os, count]) => {
																			const percentage =
																				analytics.device_analytics
																					.total_devices > 0
																					? (
																							(count /
																								analytics.device_analytics
																									.total_devices) *
																							100
																					  ).toFixed(1)
																					: 0;
																			return (
																				<tr key={os}>
																					<td className="small">
																						<div className="d-flex align-items-center">
																							<div
																								className="me-2"
																								style={{ fontSize: "16px" }}
																							>
																								{getOSIcon(os)}
																							</div>
																							<span>{os}</span>
																						</div>
																					</td>
																					<td className="fw-bold small">
																						{count}
																					</td>
																					<td className="small">
																						{percentage}%
																					</td>
																				</tr>
																			);
																		})}
																</tbody>
															</table>
														</div>
													</Col>

													{/* Pie Chart */}
													<Col xs={12} md={6}>
														{Object.keys(
															analytics.device_analytics.operating_systems || {}
														).length > 0 ? (
															<Pie
																data={{
																	labels: Object.entries(
																		analytics.device_analytics
																			.operating_systems || {}
																	)
																		.sort(([, a], [, b]) => b - a)
																		.slice(0, 5)
																		.map(([os]) => os),
																	datasets: [
																		{
																			data: Object.entries(
																				analytics.device_analytics
																					.operating_systems || {}
																			)
																				.sort(([, a], [, b]) => b - a)
																				.slice(0, 5)
																				.map(([, count]) => count),
																			backgroundColor: [
																				"#F59E0B",
																				"#3B82F6",
																				"#10B981",
																				"#EF4444",
																				"#8B5CF6",
																			],
																			borderColor: "#fff",
																			borderWidth: 2,
																		},
																	],
																}}
																options={{
																	responsive: true,
																	maintainAspectRatio: false,
																	plugins: {
																		legend: {
																			position: "bottom",
																			labels: {
																				padding: 10,
																				usePointStyle: true,
																				font: { size: 10 },
																			},
																		},
																	},
																}}
																height={200}
															/>
														) : (
															<div className="text-center text-muted py-4">
																No OS data available
															</div>
														)}
													</Col>
												</Row>
											</Card.Body>
										</Card>
									</Col>
								</Row>
							)}

							{/* URL Generator Section */}
							<Row className="mt-4 g-4 mb-5">
								<Col xs={12}>
									<Card className="p-3 shadow-sm custom-card">
										<Card.Header className="text-center fw-bold">
											Generate Shareable URLs with Source Tracking
										</Card.Header>
										<Card.Body>
											<ShareableUrlGenerator
												baseUrl={window.location.origin}
												title="CarbonCube - Your Trusted Marketplace"
												description="Discover amazing products from verified sellers on CarbonCube"
											/>
										</Card.Body>
									</Card>
								</Col>
							</Row>
						</div>
					</Col>
				</Row>
			</Container>

			{/* Analytics Detail Modal */}
			<Modal
				show={showModal}
				onHide={() => setShowModal(false)}
				centered
				size="xl"
				className="modern-modal"
			>
				<Modal.Header className="bg-secondary p-3 text-white border-0">
					<div className="flex flex-col gap-3 pr-12">
						{/* Title Row */}
						<div className="flex items-center justify-center sm:justify-between mb-4">
							<Modal.Title className="fw-bold text-lg lg:text-xl">
								{selectedCard?.title} Analytics
							</Modal.Title>
						</div>

						{/* Count and Controls Row */}
						<div className="flex flex-col sm:flex-row items-center justify-between gap-3 pr-16">
							{/* Main Metric Display */}
							<div className="flex items-center gap-3">
								<div className="text-center">
									<div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
										{(memoizedFilteredData
											? memoizedFilteredData[
													getFilterKey(selectedCard?.title)
											  ] || 0
											: selectedCard?.value || 0
										).toLocaleString()}
									</div>
									<div className="text-sm text-white text-opacity-80">
										{selectedCard?.title}
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

							{/* Filter Controls */}
							<div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
								<div className="relative w-full sm:w-auto">
									<select
										className="w-full sm:w-auto px-3 py-2 pr-8 border border-white border-opacity-30 rounded-md text-sm bg-white bg-opacity-70 text-gray-800 focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
										value={dateFilter}
										onChange={(e) => {
											setDateFilter(e.target.value);
										}}
									>
										<option value="all" className="text-gray-800">
											All Time
										</option>
										<option value="today" className="text-gray-800">
											Today
										</option>
										<option value="week" className="text-gray-800">
											Last 7 Days
										</option>
										<option value="month" className="text-gray-800">
											Last 30 Days
										</option>
										<option value="year" className="text-gray-800">
											Last Year
										</option>
										<option value="custom" className="text-gray-800">
											Custom Range
										</option>
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
									<div className="flex items-center gap-2 w-full sm:w-auto">
										<input
											type="date"
											className="flex-1 sm:w-auto px-3 py-2 border border-white border-opacity-30 rounded-md text-sm bg-white bg-opacity-70 text-gray-800 focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
											value={customStartDate}
											onChange={(e) => {
												setCustomStartDate(e.target.value);
											}}
										/>
										<span className="text-white text-sm font-medium whitespace-nowrap">
											to
										</span>
										<input
											type="date"
											className="flex-1 sm:w-auto px-3 py-2 border border-white border-opacity-30 rounded-md text-sm bg-white bg-opacity-70 text-gray-800 focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
											value={customEndDate}
											onChange={(e) => {
												setCustomEndDate(e.target.value);
											}}
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

					{/* Close Button - Always at the end */}
					<button
						onClick={() => setShowModal(false)}
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
					<div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-center">
						{memoizedFilteredData && dateFilter !== "all" && (
							<div className="mb-4">
								<div className="text-sm text-gray-500 bg-white bg-opacity-50 rounded-full px-4 py-1 inline-block">
									{dateFilter === "custom"
										? `Custom Range: ${customStartDate} to ${customEndDate}`
										: `Filtered: ${
												dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1)
										  }`}
								</div>
							</div>
						)}

						{/* Big Trend Chart */}
						<div className="w-full max-w-4xl mx-auto bg-white rounded-xl p-4 sm:p-6 shadow-lg">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
								<div>
									<h3 className="text-lg sm:text-xl font-bold text-gray-800">
										{selectedCard?.title} Trend Analysis
									</h3>
									<p className="text-sm text-gray-600 mt-1">
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
								<div className="flex items-center justify-between w-full sm:w-auto">
									<div className="text-center sm:text-left">
										<div className="text-xl sm:text-2xl font-bold text-gray-800">
											{selectedCard?.type === "source_tracking"
												? selectedCard?.value || 0
												: memoizedFilteredData
												? memoizedFilteredData[
														getFilterKey(selectedCard?.title)
												  ] || 0
												: selectedCard?.value || 0}
										</div>
										<div className="text-sm text-gray-600">Total Count</div>
									</div>
									<div
										className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
											calculateGrowthRate() >= 0
												? "bg-green-100 text-green-700"
												: "bg-red-100 text-red-700"
										}`}
									>
										{calculateGrowthRate() >= 0 ? (
											<IoMdTrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
										) : (
											<HiTrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
										)}
										<span className="font-semibold text-sm sm:text-base">
											{calculateGrowthRate() >= 0 ? "+" : ""}
											{calculateGrowthRate()}%
										</span>
									</div>
								</div>
							</div>

							{/* Big Chart */}
							<div className="h-64 sm:h-80 w-full">
								<Bar
									data={{
										labels:
											selectedCard?.type === "source_tracking"
												? generateSourceTrackingTrendData().labels
												: generateTrendData().labels,
										datasets: [
											{
												label: selectedCard?.title || "Data",
												data: (selectedCard?.type === "source_tracking"
													? generateSourceTrackingTrendData().data
													: generateTrendData().data
												).map((value) => Math.round(value)),
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

							{/* Chart Stats */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
								<div className="flex items-center justify-between">
									<div className="text-2xl font-bold text-green-600">
										{(() => {
											const trendData =
												selectedCard?.type === "source_tracking"
													? generateSourceTrackingTrendData().data
													: generateTrendData().data;
											const average =
												trendData.length > 0
													? Math.round(
															trendData.reduce((sum, val) => sum + val, 0) /
																trendData.length
													  )
													: 0;
											return average.toLocaleString();
										})()}
									</div>
									<div className="text-sm text-gray-600">Average</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="text-2xl font-bold text-purple-600">
										{(() => {
											const trendData =
												selectedCard?.type === "source_tracking"
													? generateSourceTrackingTrendData().data
													: generateTrendData().data;
											const activeDays = trendData.filter(
												(val) => val > 0
											).length;
											return activeDays.toLocaleString();
										})()}
									</div>
									<div className="text-sm text-gray-600">Active Days</div>
								</div>
							</div>
						</div>
					</div>

					{/* Analytics Grid */}
					<div className="p-4 sm:p-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
							{/* Key Metrics Card */}
							<div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
								<div className="flex items-center justify-between mb-4">
									<h6 className="text-lg font-semibold text-gray-800">
										Key Metrics
									</h6>
									<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
										<svg
											className="w-5 h-5 text-blue-600"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
										</svg>
									</div>
								</div>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600">Growth Rate</span>
										<span
											className={`text-sm font-semibold ${
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
										<span className="text-sm text-gray-600">Conversion</span>
										<span className="text-sm font-semibold text-blue-600">
											{calculateConversionRate()}%
										</span>
									</div>
								</div>
							</div>

							{/* Status Card */}
							<div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
								<div className="flex items-center justify-between mb-4">
									<h6 className="text-lg font-semibold text-gray-800">
										Status
									</h6>
									<div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
										<svg
											className="w-5 h-5 text-purple-600"
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
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600">Status</span>
										<span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
											Active
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600">Last Updated</span>
										<span className="text-sm font-semibold text-gray-800">
											{new Date().toLocaleDateString()}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600">Trend</span>
										<span
											className={`text-sm font-semibold flex items-center gap-1 ${
												calculateTrendDirection().color
											}`}
										>
											{calculateTrendDirection().direction === "increasing" ? (
												<IoMdTrendingUp className="w-4 h-4" />
											) : calculateTrendDirection().direction ===
											  "decreasing" ? (
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

			{/* Source Tracking Analytics Modal */}
			<Modal
				show={showSourceModal}
				onHide={() => setShowSourceModal(false)}
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
															(memoizedFilteredSourceData
																?.source_distribution?.[source] || 0)
														);
													},
													0
												);
											} else if (
												selectedSourceCard?.data?.direct !== undefined
											) {
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
							</div>

							{/* Date Filter Controls */}
							<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
								<div className="relative w-full sm:w-auto">
									<select
										value={sourceDateFilter}
										onChange={(e) => setSourceDateFilter(e.target.value)}
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
											onChange={(e) => setSourceCustomStartDate(e.target.value)}
											className="w-full sm:w-auto px-3 py-2 bg-white bg-opacity-70 text-gray-800 border border-white border-opacity-30 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
										/>
										<span className="text-white text-center sm:text-left">
											to
										</span>
										<input
											type="date"
											value={sourceCustomEndDate}
											onChange={(e) => setSourceCustomEndDate(e.target.value)}
											className="w-full sm:w-auto px-3 py-2 bg-white bg-opacity-70 text-gray-800 border border-white border-opacity-30 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
										/>
									</div>
								)}

								<button
									className="w-full sm:w-auto px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-all duration-200 font-medium"
									onClick={() => {
										setSourceDateFilter("all");
										setSourceCustomStartDate("");
										setSourceCustomEndDate("");
									}}
								>
									Reset
								</button>
							</div>
						</div>
					</div>

					{/* Close Button */}
					<button
						onClick={() => setShowSourceModal(false)}
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

							{/* Chart Stats */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
									<div className="text-2xl sm:text-3xl font-bold text-green-600">
										{(() => {
											const trendData = generateSourceTrackingTrendData().data;
											const average =
												trendData.length > 0
													? Math.round(
															trendData.reduce((sum, val) => sum + val, 0) /
																trendData.length
													  )
													: 0;
											return average.toLocaleString();
										})()}
									</div>
									<div className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-0">
										Average
									</div>
								</div>
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
									<div className="text-2xl sm:text-3xl font-bold text-purple-600">
										{(() => {
											const trendData = generateSourceTrackingTrendData().data;
											const activeDays = trendData.filter(
												(val) => val > 0
											).length;
											return activeDays.toLocaleString();
										})()}
									</div>
									<div className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-0">
										Active Days
									</div>
								</div>
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
																		backgroundColor:
																			getSourceBrandColor(source),
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
		</>
	);
}

export default SalesDashboard;
