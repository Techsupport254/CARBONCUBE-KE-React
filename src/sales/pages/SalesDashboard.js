import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import "./dashboard.css";

// Trending icons removed with visitor metrics
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

// Import new components
import {
	TopNavbar,
	Sidebar,
	CategoryClickEvents,
	DashboardCard,
	DashboardCharts,
	SourceTrackingCards,
	AnalyticsModal,
	SourceTrackingModal,
} from "../components";
import UTMCampaignURLGenerator from "../../components/UTMCampaignURLGenerator";
import UTMCampaignTracking from "../../components/UTMCampaignTracking";

// Import helper functions
// Removed unused dashboard helper imports

// Removed visitor analytics tracking utilities

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

	// Visitor metrics modal removed

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
			revealClicks: filterByDateRange(analytics.reveal_clicks_with_timestamps),
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
			total_reveal_clicks: filteredData.revealClicks.length,
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
			reveal_clicks_with_timestamps: filteredData.revealClicks,
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

		// Removed debug checks for visit source/referrer

		// Visitor tracking removed

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
			case "Total Click Reveals":
				return "total_reveal_clicks";
			default:
				return "total_sellers";
		}
	};

	// Industry-standard growth rate calculation
	const calculatePeriodGrowthRate = (currentValue, previousValue) => {
		if (previousValue === 0) {
			if (currentValue === 0) {
				return { growthRate: "0.0", isInfinite: false, isNew: false };
			} else {
				return { growthRate: "∞", isInfinite: true, isNew: true };
			}
		} else if (currentValue === 0) {
			return { growthRate: "-100.0", isInfinite: false, isNew: false };
		} else {
			const rate = ((currentValue - previousValue) / previousValue) * 100;
			return {
				growthRate: rate.toFixed(1),
				isInfinite: false,
				isNew: false,
			};
		}
	};

	// Get source trend based on industry-standard growth calculations
	const getSourceTrend = (source) => {
		if (!sourceAnalytics?.daily_visits) return "Active";

		const today = new Date();

		// Week-over-Week comparison for source trends
		const currentWeekStart = new Date(today);
		const dayOfWeek = today.getDay();
		const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
		currentWeekStart.setDate(today.getDate() - daysFromMonday);
		currentWeekStart.setHours(0, 0, 0, 0);
		const currentWeekEnd = new Date(currentWeekStart);
		currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
		currentWeekEnd.setHours(23, 59, 59, 999);

		const previousWeekStart = new Date(currentWeekStart);
		previousWeekStart.setDate(currentWeekStart.getDate() - 7);
		const previousWeekEnd = new Date(previousWeekStart);
		previousWeekEnd.setDate(previousWeekStart.getDate() + 6);
		previousWeekEnd.setHours(23, 59, 59, 999);

		// Calculate current week visits
		let currentWeekVisits = 0;
		let previousWeekVisits = 0;

		const currentDate = new Date(currentWeekStart);
		while (currentDate <= currentWeekEnd) {
			const dateStr = currentDate.toISOString().split("T")[0];
			currentWeekVisits += sourceAnalytics.daily_visits[dateStr] || 0;
			currentDate.setDate(currentDate.getDate() + 1);
		}

		const previousDate = new Date(previousWeekStart);
		while (previousDate <= previousWeekEnd) {
			const dateStr = previousDate.toISOString().split("T")[0];
			previousWeekVisits += sourceAnalytics.daily_visits[dateStr] || 0;
			previousDate.setDate(previousDate.getDate() + 1);
		}

		// Apply source-specific ratio
		const sourceRatio = sourceAnalytics.source_distribution?.[source] || 0;
		const totalVisits = sourceAnalytics.total_visits || 0;
		const sourcePercentage = totalVisits > 0 ? sourceRatio / totalVisits : 0;

		const currentSourceVisits = Math.round(
			currentWeekVisits * sourcePercentage
		);
		const previousSourceVisits = Math.round(
			previousWeekVisits * sourcePercentage
		);

		const growthResult = calculatePeriodGrowthRate(
			currentSourceVisits,
			previousSourceVisits
		);

		if (growthResult.isNew) return "New";

		const growthRate = parseFloat(growthResult.growthRate);
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
			case "Total Click Reveals":
				return dataSource.reveal_clicks_with_timestamps || [];
			default:
				return dataSource.sellers_with_timestamps || [];
		}
	};

	if (loading) {
		return (
			<>
				<TopNavbar />
				<div
					className="d-flex justify-content-center align-items-center"
					style={{
						minHeight: "100vh",
						background: "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)",
						fontFamily: '"Fira Sans Extra Condensed", sans-serif',
					}}
				>
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
				<div
					className="d-flex justify-content-center align-items-center"
					style={{
						minHeight: "100vh",
						background: "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)",
						fontFamily: '"Fira Sans Extra Condensed", sans-serif',
					}}
				>
					<div
						className="text-center p-5"
						style={{
							background: "rgba(255, 255, 255, 0.9)",
							backdropFilter: "blur(10px)",
							borderRadius: "20px",
							border: "1px solid rgba(255, 255, 255, 0.2)",
							boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
							maxWidth: "500px",
							width: "90%",
						}}
					>
						<div className="mb-4">
							<div
								className="d-flex justify-content-center align-items-center mx-auto"
								style={{
									width: "80px",
									height: "80px",
									background: "linear-gradient(135deg, #ffc107, #ff9800)",
									borderRadius: "50%",
									boxShadow: "0 4px 15px rgba(255, 193, 7, 0.3)",
								}}
							>
								<svg
									width="40"
									height="40"
									fill="currentColor"
									viewBox="0 0 16 16"
									style={{ color: "#000" }}
								>
									<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
									<path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
								</svg>
							</div>
						</div>
						<h4 className="mb-3 fw-bold" style={{ color: "#333" }}>
							Failed to Load Analytics
						</h4>
						<p className="mb-4" style={{ color: "#666", fontSize: "1.1rem" }}>
							Unable to fetch dashboard data. Please try refreshing the page.
						</p>
						<button
							className="btn fw-bold px-4 py-2"
							style={{
								background: "linear-gradient(135deg, #ffc107, #ff9800)",
								border: "none",
								borderRadius: "25px",
								color: "#000",
								boxShadow: "0 4px 15px rgba(255, 193, 7, 0.3)",
								transition: "all 0.3s ease",
							}}
							onMouseEnter={(e) => {
								e.target.style.transform = "translateY(-2px)";
								e.target.style.boxShadow = "0 6px 20px rgba(255, 193, 7, 0.4)";
							}}
							onMouseLeave={(e) => {
								e.target.style.transform = "translateY(0)";
								e.target.style.boxShadow = "0 4px 15px rgba(255, 193, 7, 0.3)";
							}}
							onClick={() => window.location.reload()}
						>
							<svg
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 16 16"
								className="me-2"
							>
								<path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
								<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
							</svg>
							Refresh Page
						</button>
					</div>
				</div>
			</>
		);
	}

	const { category_click_events } = analytics;

	// Use filtered data for renewal rate calculation if available
	const dataSource = memoizedFilteredData || analytics;
	// Removed unused renewalRate calculation

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

	// Removed unused barData config

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

	// Removed unused buyerAdClickBarOptions

	// Removed unused barOptions

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
									{
										title: "Total Click Reveals",
										value: dataSource.total_reveal_clicks || 0,
									},
								].map(({ title, value }, index) => (
									<DashboardCard
										key={index}
										title={title}
										value={value}
										onClick={() => {
											setSelectedCard({ title, value });
											setDateFilter("all");
											setCustomStartDate("");
											setCustomEndDate("");
											setShowModal(true);
										}}
									/>
								))}
							</Row>

							<Row className="g-6">
								<h3 className="pt-5 fw-bold">Seller related </h3>
								<DashboardCharts
									pieData={pieData}
									buyerAdClickBarData={buyerAdClickBarData}
									analytics={analytics}
								/>
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
								<SourceTrackingCards
									sourceAnalytics={sourceAnalytics}
									memoizedFilteredSourceData={memoizedFilteredSourceData}
									onSourceCardClick={(card) => {
										setSelectedSourceCard(card);
										setSourceDateFilter("all");
										setSourceCustomStartDate("");
										setSourceCustomEndDate("");
										setShowSourceModal(true);
									}}
								/>
							</Row>

							{/* Unique Visitor Metrics Row
							<Row className="mt-4 g-4 mb-5">
								<Col xs={12}>
									<h4 className="pt-1 fw-bold pb-3">
										Visitor Engagement Metrics
									</h4>
								</Col>
								<VisitorEngagementMetrics
									memoizedFilteredSourceData={memoizedFilteredSourceData}
									onVisitorMetricClick={(metric) => {
										setSelectedVisitorMetric(metric);
										setShowVisitorModal(true);
									}}
								/>
							</Row> */}

							{/* UTM Campaign Tracking */}
							{sourceAnalytics && (
								<Row className="mt-4 g-4 mb-5">
									<Col xs={12}>
										<UTMCampaignTracking
											utmData={sourceAnalytics}
											className="custom-card"
										/>
									</Col>
								</Row>
							)}

							{/* Detailed Source Analytics - Split into Left (Table) and Right (Pie Chart) */}
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
																			([source]) => getSourceBrandColor(source)
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

							{/* UTM URL Generator Section */}
							<Row className="mt-4 g-4 mb-5">
								<Col xs={12}>
									<UTMCampaignURLGenerator
										baseUrl={window.location.origin}
										onUrlGenerated={(url) => console.log("Generated URL:", url)}
									/>
								</Col>
							</Row>
						</div>
					</Col>
				</Row>
			</Container>

			{/* Analytics Detail Modal */}
			<AnalyticsModal
				show={showModal}
				onHide={() => setShowModal(false)}
				selectedCard={selectedCard}
				dateFilter={dateFilter}
				onDateFilterChange={setDateFilter}
				customStartDate={customStartDate}
				customEndDate={customEndDate}
				onCustomStartDateChange={setCustomStartDate}
				onCustomEndDateChange={setCustomEndDate}
				generateTrendData={generateTrendData}
				getFilterKey={getFilterKey}
				memoizedFilteredData={memoizedFilteredData}
				analytics={analytics}
			/>

			{/* Source Tracking Analytics Modal */}
			<SourceTrackingModal
				show={showSourceModal}
				onHide={() => setShowSourceModal(false)}
				selectedSourceCard={selectedSourceCard}
				sourceDateFilter={sourceDateFilter}
				onSourceDateFilterChange={setSourceDateFilter}
				sourceCustomStartDate={sourceCustomStartDate}
				sourceCustomEndDate={sourceCustomEndDate}
				onSourceCustomStartDateChange={setSourceCustomStartDate}
				onSourceCustomEndDateChange={setSourceCustomEndDate}
				generateSourceTrackingTrendData={generateSourceTrackingTrendData}
				memoizedFilteredSourceData={memoizedFilteredSourceData}
				sourceAnalytics={sourceAnalytics}
			/>

			{/* Visitor Metrics Modal removed */}
		</>
	);
}

export default SalesDashboard;
