import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
// Bootstrap CSS removed - using Tailwind CSS instead

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

// Import new components
import Navbar from "../../components/Navbar";
import {
	Sidebar,
	CategoryPerformanceTable,
	AnalyticsModal,
	SourceTrackingModal,
} from "../components";

// Import newly created components
import DashboardHeader from "../components/DashboardHeader";
import MetricsGrid from "../components/MetricsGrid";
import SellerAnalyticsSection from "../components/SellerAnalyticsSection";
import SourceAnalyticsSection from "../components/SourceAnalyticsSection";
import SourceAnalyticsRow from "../components/SourceAnalyticsRow";
import DeviceAnalyticsSection from "../components/DeviceAnalyticsSection";
import UTMSection from "../components/UTMSection";
import UTMCampaignTrackingSection from "../components/UTMCampaignTrackingSection";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";

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
	const [dateFilter, setDateFilter] = useState("week");
	const [customStartDate, setCustomStartDate] = useState("");
	const [customEndDate, setCustomEndDate] = useState("");
	const [sourceAnalytics, setSourceAnalytics] = useState({
		source_distribution: {},
		utm_source_distribution: {},
		utm_medium_distribution: {},
		utm_campaign_distribution: {},
		referrer_distribution: {},
		visitor_metrics: {},
		unique_visitors_by_source: {},
		visits_by_source: {},
		total_visits: 0,
		daily_visits: {},
		visit_timestamps: [],
		daily_unique_visitors: {},
		returning_visitors_count: 0,
		new_visitors_count: 0,
	});
	// eslint-disable-next-line no-unused-vars
	const [sourceAnalyticsLoading, setSourceAnalyticsLoading] = useState(false);
	const [categories, setCategories] = useState([]);
	const [categoryAnalytics, setCategoryAnalytics] = useState([]);

	// Separate state for source tracking modal
	const [showSourceModal, setShowSourceModal] = useState(false);
	const [selectedSourceCard, setSelectedSourceCard] = useState(null);
	const [sourceDateFilter, setSourceDateFilter] = useState("week");
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
			const now = new Date(); // Use actual current date
			const today = new Date(now);
			today.setHours(0, 0, 0, 0); // Start of today (midnight)
			const endOfToday = new Date(today);
			endOfToday.setHours(23, 59, 59, 999); // End of today

			switch (filter) {
				case "today":
					const todayResult = { start: today, end: endOfToday };
					return todayResult;
				case "week":
					const weekAgo = new Date(today);
					weekAgo.setDate(today.getDate() - 7);
					const weekResult = { start: weekAgo, end: endOfToday };
					return weekResult;
				case "month":
					const monthAgo = new Date(today);
					monthAgo.setMonth(today.getMonth() - 1);
					const monthResult = { start: monthAgo, end: endOfToday };
					return monthResult;
				case "year":
					const yearAgo = new Date(today);
					yearAgo.setFullYear(today.getFullYear() - 1);
					const yearResult = { start: yearAgo, end: endOfToday };
					return yearResult;
				case "custom":
					if (sourceCustomStartDate && sourceCustomEndDate) {
						const startDate = new Date(sourceCustomStartDate);
						const endDate = new Date(sourceCustomEndDate);
						// Set time to beginning and end of day
						startDate.setHours(0, 0, 0, 0);
						endDate.setHours(23, 59, 59, 999);
						const customResult = { start: startDate, end: endDate };
						return customResult;
					}
					const defaultResult = { start: today, end: endOfToday };
					return defaultResult;
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
	}, [dateFilter, analytics, getDateRange]);

	// Memoized filtered source data for source tracking modal
	const memoizedFilteredSourceData = useMemo(() => {
		if (!sourceAnalytics || !sourceAnalytics.visit_timestamps) {
			return sourceAnalytics;
		}

		// If no date filter, return all data
		if (!sourceDateFilter || sourceDateFilter === "all") {
			return sourceAnalytics;
		}

		// Get date range for filtering
		const dateRange = getSourceDateRange(sourceDateFilter);
		if (!dateRange) {
			return sourceAnalytics;
		}

		// Filter timestamps by date range
		const startTime = dateRange.start.getTime();
		const endTime = dateRange.end.getTime();

		const filteredTimestamps = sourceAnalytics.visit_timestamps.filter(
			(timestamp) => {
				const time = new Date(timestamp).getTime();
				return time >= startTime && time <= endTime;
			}
		);

		// Calculate filtered total visits
		const filteredTotalVisits = filteredTimestamps.length;

		// For today filter, we need to ensure the hourly data matches the total
		// Calculate the actual ratio based on filtered timestamps
		const totalVisits = sourceAnalytics.total_visits;
		const filterRatio = filteredTotalVisits / totalVisits;

		// Scale all distributions proportionally and ensure they add up correctly
		const scaleDistribution = (distribution) => {
			// If distribution is empty or null, return empty object
			if (!distribution || Object.keys(distribution).length === 0) {
				return {};
			}

			const scaled = {};
			let totalScaled = 0;

			// First pass: scale all values
			Object.entries(distribution).forEach(([key, count]) => {
				const scaledCount = Math.round(count * filterRatio);
				scaled[key] = scaledCount;
				totalScaled += scaledCount;
			});

			// Second pass: adjust to ensure total matches filteredTotalVisits
			if (
				totalScaled !== filteredTotalVisits &&
				Object.keys(scaled).length > 0
			) {
				const adjustment = filteredTotalVisits - totalScaled;
				// Find the largest source and adjust it
				const largestSource = Object.entries(scaled).reduce((a, b) =>
					scaled[a[0]] > scaled[b[0]] ? a : b
				)[0];
				scaled[largestSource] += adjustment;
			}

			return scaled;
		};

		// Return filtered data
		return {
			...sourceAnalytics,
			total_visits: filteredTotalVisits,
			source_distribution: scaleDistribution(
				sourceAnalytics.source_distribution
			),
			utm_source_distribution: scaleDistribution(
				sourceAnalytics.utm_source_distribution
			),
			utm_medium_distribution: scaleDistribution(
				sourceAnalytics.utm_medium_distribution
			),
			utm_campaign_distribution: scaleDistribution(
				sourceAnalytics.utm_campaign_distribution
			),
			referrer_distribution: scaleDistribution(
				sourceAnalytics.referrer_distribution
			),
			visit_timestamps: filteredTimestamps,
			// Filter daily visits to only include dates in range
			daily_visits: Object.fromEntries(
				Object.entries(sourceAnalytics.daily_visits).filter(([date]) => {
					const dateTime = new Date(date).getTime();
					return dateTime >= startTime && dateTime <= endTime;
				})
			),
		};
	}, [sourceAnalytics, sourceDateFilter, getSourceDateRange]);

	// Memoize fetch functions to prevent unnecessary re-renders
	const fetchCategories = useCallback(async () => {
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_BACKEND_URL}/buyer/categories`
			);
			setCategories(res.data);
		} catch (err) {
			console.error("Failed to fetch categories:", err);
		}
	}, []);

	const fetchCategoryAnalytics = useCallback(async () => {
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_BACKEND_URL}/buyer/categories/analytics`
			);
			setCategoryAnalytics(res.data);
		} catch (err) {
			console.error("Failed to fetch category analytics:", err);
		}
	}, []);

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

				// Set source analytics from the main response
				if (res.data.source_analytics) {
					setSourceAnalytics(res.data.source_analytics);
				}

				// Don't set source analytics here - let the useEffect handle it
				// This prevents the all-time data from overriding filtered data
			} catch (err) {
				console.error("Failed to fetch analytics:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchAnalytics();
		fetchCategories();
		fetchCategoryAnalytics();
	}, [fetchCategories, fetchCategoryAnalytics]);

	// Combine categories with analytics data
	const getCategoriesWithAnalytics = useMemo(() => {
		if (!categories || !categoryAnalytics) {
			return categories || [];
		}

		// Create a map of analytics data by category name
		const analyticsMap = {};
		categoryAnalytics.forEach((item) => {
			analyticsMap[item.category_name] = {
				ad_clicks: item.ad_clicks || 0,
				ad_click_reveals: item.reveal_clicks || 0,
				// Use only actual wishlist totals
				wishlist_count: item.total_wishlists || 0,
			};
		});

		// Combine categories with their analytics data
		return categories.map((category) => {
			const categoryAnalytics = analyticsMap[category.name] || {};
			return {
				...category,
				ads_count: category.ads_count || 0,
				ad_clicks: categoryAnalytics.ad_clicks || 0,
				ad_click_reveals: categoryAnalytics.ad_click_reveals || 0,
				wishlist_count: categoryAnalytics.wishlist_count || 0,
			};
		});
	}, [categories, categoryAnalytics]);

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
		if (!analytics) {
			return { data: [0, 0, 0, 0, 0, 0, 0], labels: [] };
		}

		const timestamps = getTimestampsForCard();
		const totalCount = selectedCard ? getTotalCountForCard() : 0;

		// If no timestamps available, generate synthetic data based on total count
		if (!timestamps || timestamps.length === 0) {
			return generateSyntheticTrendData(totalCount);
		}

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
				// Show daily data for last 30 days for better granularity
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
				// Show data across the entire time range where data exists
				if (timestamps && timestamps.length > 0) {
					// Find the date range of the actual data
					const sortedTimestamps = timestamps
						.map((ts) => new Date(ts))
						.sort((a, b) => a - b);

					const earliestDate = sortedTimestamps[0];
					const latestDate = sortedTimestamps[sortedTimestamps.length - 1];

					// Calculate the total time span
					const totalDays = Math.ceil(
						(latestDate - earliestDate) / (1000 * 60 * 60 * 24)
					);

					// If data spans more than 30 days, group by weeks or months
					if (totalDays > 30) {
						// Group by months for better visualization
						let currentDate = new Date(earliestDate);
						currentDate.setDate(1); // Start of month

						while (currentDate <= latestDate) {
							const monthStart = new Date(currentDate);
							const monthEnd = new Date(currentDate);
							monthEnd.setMonth(monthEnd.getMonth() + 1);

							const count = timestamps.filter((timestamp) => {
								const ts = new Date(timestamp);
								return ts >= monthStart && ts < monthEnd;
							}).length;

							if (count > 0) {
								// Only show months with data
								data.push(count);
								labels.push(
									monthStart.toLocaleDateString("en-US", {
										month: "short",
										year: "numeric",
									})
								);
							}

							currentDate.setMonth(currentDate.getMonth() + 1);
						}
					} else {
						// Show daily data for shorter spans
						for (let i = 0; i <= totalDays; i++) {
							const date = new Date(earliestDate);
							date.setDate(earliestDate.getDate() + i);
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
					}
				} else {
					// Fallback to last 30 days if no timestamps
					for (let i = 29; i >= 0; i--) {
						const date = new Date(today);
						date.setDate(today.getDate() - i);
						date.setHours(0, 0, 0, 0);
						const nextDate = new Date(date);
						nextDate.setDate(date.getDate() + 1);

						data.push(0);
						labels.push(
							date.toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
							})
						);
					}
				}
				break;
		}

		// Normalize the data to ensure it sums up to the total count
		const dataSum = data.reduce((sum, value) => sum + value, 0);
		if (dataSum > 0 && Math.abs(dataSum - totalCount) > 0) {
			// Scale the data proportionally to match the total count
			const scaleFactor = totalCount / dataSum;
			data = data.map((value) => Math.round(value * scaleFactor));

			// Ensure the sum is exactly equal to totalCount by adjusting the largest value
			const newSum = data.reduce((sum, value) => sum + value, 0);
			if (newSum !== totalCount) {
				const difference = totalCount - newSum;
				const maxIndex = data.indexOf(Math.max(...data));
				data[maxIndex] += difference;
			}
		}

		// Return both data and labels for the chart
		return { data, labels };
	};

	// Get total count for the selected card
	const getTotalCountForCard = () => {
		// Use filtered data if available, otherwise use original analytics
		const dataSource = memoizedFilteredData || analytics;
		if (!dataSource) {
			return 0;
		}

		let count = 0;
		switch (selectedCard?.title) {
			case "Total Sellers":
				count = dataSource.total_sellers || 0;
				break;
			case "Total Buyers":
				count = dataSource.total_buyers || 0;
				break;
			case "Total Reviews":
				count = dataSource.total_reviews || 0;
				break;
			case "Total Ads":
				count = dataSource.total_ads || 0;
				break;
			case "Total Wishlists":
				count = dataSource.total_ads_wish_listed || 0;
				break;
			case "Total Ads Clicks":
				count = dataSource.total_ads_clicks || 0;
				break;
			case "Total Click Reveals":
				count = dataSource.total_reveal_clicks || 0;
				break;
			default:
				count = dataSource.total_sellers || 0;
				break;
		}
		return count;
	};

	// Generate synthetic trend data when timestamps are not available
	const generateSyntheticTrendData = (totalCount) => {
		const today = new Date();
		let data = [];
		let labels = [];

		switch (dateFilter) {
			case "today":
				// Distribute total count across 24 hours with some variation
				for (let i = 23; i >= 0; i--) {
					const hour = new Date(today);
					hour.setHours(today.getHours() - i, 0, 0, 0);

					// Create realistic hourly distribution (more activity during business hours)
					let hourlyCount = 0;
					const hourOfDay = hour.getHours();
					if (hourOfDay >= 9 && hourOfDay <= 17) {
						// Business hours: higher activity
						hourlyCount = Math.round((totalCount * 0.15) / 9);
					} else if (hourOfDay >= 18 && hourOfDay <= 22) {
						// Evening: moderate activity
						hourlyCount = Math.round((totalCount * 0.1) / 5);
					} else {
						// Night/early morning: lower activity
						hourlyCount = Math.round((totalCount * 0.05) / 10);
					}

					data.push(hourlyCount);
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
				// Distribute total count across 7 days with realistic variation
				for (let i = 6; i >= 0; i--) {
					const date = new Date(today);
					date.setDate(today.getDate() - i);

					// Weekend vs weekday variation
					const dayOfWeek = date.getDay();
					let dailyCount = 0;
					if (dayOfWeek === 0 || dayOfWeek === 6) {
						// Weekend: lower activity
						dailyCount = Math.round((totalCount * 0.1) / 2);
					} else {
						// Weekday: higher activity
						dailyCount = Math.round((totalCount * 0.9) / 5);
					}

					data.push(dailyCount);
					labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
				}
				break;

			case "month":
				// Distribute total count across 4 weeks
				for (let i = 3; i >= 0; i--) {
					const weekStart = new Date(today);
					weekStart.setDate(today.getDate() - i * 7);

					// Even distribution across weeks
					const weeklyCount = Math.round(totalCount / 4);
					data.push(weeklyCount);
					labels.push(`Week ${4 - i}`);
				}
				break;

			case "year":
				// Distribute total count across 12 months
				for (let i = 11; i >= 0; i--) {
					const monthStart = new Date(
						today.getFullYear(),
						today.getMonth() - i,
						1
					);

					// Even distribution across months
					const monthlyCount = Math.round(totalCount / 12);
					data.push(monthlyCount);
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

							const dailyCount = Math.round(totalCount / (daysDiff + 1));
							data.push(dailyCount);
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
							const weeklyCount = Math.round(totalCount / weeks);
							data.push(weeklyCount);
							labels.push(`Week ${i + 1}`);
						}
					}
				} else {
					// Fallback to last 7 days
					for (let i = 6; i >= 0; i--) {
						const date = new Date(today);
						date.setDate(today.getDate() - i);

						const dailyCount = Math.round(totalCount / 7);
						data.push(dailyCount);
						labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
					}
				}
				break;

			default: // "all"
				// Show last 30 days as default
				for (let i = 29; i >= 0; i--) {
					const date = new Date(today);
					date.setDate(today.getDate() - i);

					const dailyCount = Math.round(totalCount / 30);
					data.push(dailyCount);
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

	// Generate source tracking trend data
	const generateSourceTrackingTrendData = useCallback(() => {
		// Use the filtered data instead of the original sourceAnalytics
		const filteredData = memoizedFilteredSourceData;
		if (!filteredData) return { data: [0, 0, 0, 0, 0, 0, 0], labels: [] };

		const dailyVisits = filteredData.daily_visits || {};
		const today = new Date();
		let data = [];
		let labels = [];

		// Calculate the source-specific data based on card type
		const getSourceSpecificData = () => {
			if (!selectedSourceCard)
				return { visits: dailyVisits, total: filteredData.total_visits || 0 };

			if (selectedSourceCard?.title === "Total Page Visits") {
				// For total page visits, use all visits
				return { visits: dailyVisits, total: filteredData.total_visits || 0 };
			} else if (selectedSourceCard?.title === "External Sources") {
				// For external sources, calculate non-direct visits
				const directVisits = filteredData.source_distribution?.direct || 0;
				const totalVisits = filteredData.total_visits || 0;
				const externalRatio =
					totalVisits > 0 ? (totalVisits - directVisits) / totalVisits : 0;

				// Scale daily visits by external ratio
				const externalVisits = {};
				Object.keys(dailyVisits).forEach((date) => {
					externalVisits[date] = Math.round(dailyVisits[date] * externalRatio);
				});

				return {
					visits: externalVisits,
					total: Math.max(0, totalVisits - directVisits),
				};
			} else if (selectedSourceCard?.title === "Direct Visits") {
				// For direct visits, calculate direct-only visits
				const directVisits = filteredData.source_distribution?.direct || 0;
				const totalVisits = filteredData.total_visits || 0;
				const directRatio = totalVisits > 0 ? directVisits / totalVisits : 0;

				// Scale daily visits by direct ratio
				const directOnlyVisits = {};
				Object.keys(dailyVisits).forEach((date) => {
					directOnlyVisits[date] = Math.round(dailyVisits[date] * directRatio);
				});

				return { visits: directOnlyVisits, total: directVisits };
			} else if (selectedSourceCard?.title === "Top Source") {
				// For top source, get the top performing source
				const allSources = Object.keys(filteredData.source_distribution || {});
				if (allSources.length === 0) {
					return { visits: {}, total: 0 };
				}

				const topSource = allSources.reduce((top, source) => {
					const currentCount = filteredData.source_distribution?.[source] || 0;
					const topCount = filteredData.source_distribution?.[top] || 0;
					return currentCount > topCount ? source : top;
				}, allSources[0]);

				const topSourceVisits =
					filteredData.source_distribution?.[topSource] || 0;
				const totalVisits = filteredData.total_visits || 0;
				const topSourceRatio =
					totalVisits > 0 ? topSourceVisits / totalVisits : 0;

				// Scale daily visits by top source ratio
				const topSourceOnlyVisits = {};
				Object.keys(dailyVisits).forEach((date) => {
					topSourceOnlyVisits[date] = Math.round(
						dailyVisits[date] * topSourceRatio
					);
				});

				return { visits: topSourceOnlyVisits, total: topSourceVisits };
			}

			// Default fallback
			return { visits: dailyVisits, total: filteredData.total_visits || 0 };
		};

		const { visits: sourceSpecificVisits, total: sourceTotal } =
			getSourceSpecificData();

		switch (sourceDateFilter) {
			case "today":
				// Use the filtered timestamps for today
				const visitTimestamps = filteredData?.visit_timestamps || [];

				// Group visits by hour
				const hourlyVisits = {};
				visitTimestamps.forEach((timestamp) => {
					const hour = new Date(timestamp).getHours();
					hourlyVisits[hour] = (hourlyVisits[hour] || 0) + 1;
				});

				// Show hourly data for the last 24 hours using actual data
				for (let i = 23; i >= 0; i--) {
					const hour = new Date(today);
					hour.setHours(today.getHours() - i, 0, 0, 0);
					const hourOfDay = hour.getHours();

					// Get actual visits for this hour (no source ratio needed)
					const actualVisits = hourlyVisits[hourOfDay] || 0;
					data.push(actualVisits);

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

					const visits = sourceSpecificVisits[dateStr] || 0;
					data.push(visits);
					labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
				}
				break;

			case "month":
				// Show daily data for last 30 days for better granularity
				for (let i = 29; i >= 0; i--) {
					const date = new Date(today);
					date.setDate(today.getDate() - i);
					const dateStr = date.toISOString().split("T")[0];

					const visits = sourceSpecificVisits[dateStr] || 0;
					data.push(visits);
					// Show date for better context
					labels.push(
						date.toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
						})
					);
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
						monthVisits += sourceSpecificVisits[dateStr] || 0;
						currentDate.setDate(currentDate.getDate() + 1);
					}

					data.push(monthVisits);
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

							const visits = sourceSpecificVisits[dateStr] || 0;
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
								weekVisits += sourceSpecificVisits[dateStr] || 0;
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

						const visits = sourceSpecificVisits[dateStr] || 0;
						data.push(visits);
						labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
					}
				}
				break;

			default: // "all"
				// Show data across the entire time range where data exists
				const availableDates = Object.keys(sourceSpecificVisits).sort();

				if (availableDates.length > 0) {
					// Find the date range of the actual data
					const earliestDate = new Date(availableDates[0]);
					const latestDate = new Date(
						availableDates[availableDates.length - 1]
					);

					// Calculate the total time span
					const totalDays = Math.ceil(
						(latestDate - earliestDate) / (1000 * 60 * 60 * 24)
					);

					// If data spans more than 30 days, group by months
					if (totalDays > 30) {
						// Group by months for better visualization
						let currentDate = new Date(earliestDate);
						currentDate.setDate(1); // Start of month

						while (currentDate <= latestDate) {
							const monthStart = new Date(currentDate);
							const monthEnd = new Date(currentDate);
							monthEnd.setMonth(monthEnd.getMonth() + 1);

							let monthVisits = 0;
							const currentDateForLoop = new Date(monthStart);
							while (currentDateForLoop < monthEnd) {
								const dateStr = currentDateForLoop.toISOString().split("T")[0];
								monthVisits += sourceSpecificVisits[dateStr] || 0;
								currentDateForLoop.setDate(currentDateForLoop.getDate() + 1);
							}

							if (monthVisits > 0) {
								// Only show months with data
								data.push(monthVisits);
								labels.push(
									currentDate.toLocaleDateString("en-US", {
										month: "short",
										year: "numeric",
									})
								);
							}

							currentDate.setMonth(currentDate.getMonth() + 1);
						}
					} else {
						// Show daily data for shorter spans
						for (let i = 0; i <= totalDays; i++) {
							const date = new Date(earliestDate);
							date.setDate(earliestDate.getDate() + i);
							const dateStr = date.toISOString().split("T")[0];

							const visits = sourceSpecificVisits[dateStr] || 0;
							data.push(visits);
							labels.push(
								date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								})
							);
						}
					}
				} else {
					// Fallback to last 30 days if no data available
					for (let i = 29; i >= 0; i--) {
						const date = new Date(today);
						date.setDate(today.getDate() - i);
						const dateStr = date.toISOString().split("T")[0];

						const visits = sourceSpecificVisits[dateStr] || 0;
						data.push(visits);
						labels.push(
							date.toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
							})
						);
					}
				}
				break;
		}

		// Normalize the data to ensure it sums up to the total count
		const dataSum = data.reduce((sum, value) => sum + value, 0);
		if (dataSum > 0 && Math.abs(dataSum - sourceTotal) > 0) {
			// Scale the data proportionally to match the total count
			const scaleFactor = sourceTotal / dataSum;
			data = data.map((value) => Math.round(value * scaleFactor));

			// Ensure the sum is exactly equal to sourceTotal by adjusting the largest value
			const newSum = data.reduce((sum, value) => sum + value, 0);
			if (newSum !== sourceTotal) {
				const difference = sourceTotal - newSum;
				const maxIndex = data.indexOf(Math.max(...data));
				data[maxIndex] += difference;
			}
		}

		return { data, labels };
	}, [
		memoizedFilteredSourceData,
		sourceDateFilter,
		selectedSourceCard,
		sourceCustomStartDate,
		sourceCustomEndDate,
	]);

	// Get timestamps for the selected card
	const getTimestampsForCard = () => {
		// Use filtered data if available, otherwise use original analytics
		const dataSource = memoizedFilteredData || analytics;

		if (!dataSource) {
			return [];
		}

		let timestamps = [];
		switch (selectedCard?.title) {
			case "Total Sellers":
				timestamps = dataSource.sellers_with_timestamps || [];
				break;
			case "Total Buyers":
				timestamps = dataSource.buyers_with_timestamps || [];
				break;
			case "Total Reviews":
				timestamps = dataSource.reviews_with_timestamps || [];
				break;
			case "Total Ads":
				timestamps = dataSource.ads_with_timestamps || [];
				break;
			case "Total Wishlists":
				timestamps = dataSource.wishlists_with_timestamps || [];
				break;
			case "Total Ads Clicks":
				timestamps = dataSource.ad_clicks_with_timestamps || [];
				break;
			case "Total Click Reveals":
				timestamps = dataSource.reveal_clicks_with_timestamps || [];
				break;
			default:
				timestamps = dataSource.sellers_with_timestamps || [];
				break;
		}

		return timestamps;
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	if (!analytics) {
		return <ErrorState />;
	}

	return (
		<>
			<Navbar mode="sales" showSearch={false} showCategories={false} />

			<div className="min-h-screen bg-gray-50 ">
				<div className="flex flex-col xl:flex-row">
					{/* Sidebar - Full width on mobile, fixed width on larger screens */}
					<Sidebar />

					{/* Main Content Area - Responsive padding and width with max-width constraint */}
					<div className="flex-1 min-w-0">
						<div className="max-w-7xl mx-auto p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6">
							<DashboardHeader />
							<MetricsGrid
								analytics={analytics}
								onCardClick={({ title, value }) => {
									setSelectedCard({ title, value });
									setDateFilter("week");
									setCustomStartDate("");
									setCustomEndDate("");
									setShowModal(true);
								}}
							/>
							<SellerAnalyticsSection analytics={analytics} />
							<CategoryPerformanceTable
								categories={getCategoriesWithAnalytics}
							/>
							<SourceAnalyticsSection
								sourceAnalytics={sourceAnalytics}
								memoizedFilteredSourceData={memoizedFilteredSourceData}
								onSourceCardClick={(card) => {
									setSelectedSourceCard(card);
									setSourceDateFilter("week");
									setSourceCustomStartDate("");
									setSourceCustomEndDate("");
									setShowSourceModal(true);
								}}
							/>
							{/* UTM Campaign Tracking */}
							<UTMCampaignTrackingSection sourceAnalytics={sourceAnalytics} />
							{/* Detailed Source Analytics - Split into Left (Table) and Right (Pie Chart) */}
							<SourceAnalyticsRow
								sourceAnalytics={sourceAnalytics}
								getSourceIcon={getSourceIcon}
								getSourceTrend={getSourceTrend}
								getSourceBrandColor={getSourceBrandColor}
							/>
							{/* Device Analytics Section */}
							<DeviceAnalyticsSection
								analytics={analytics}
								getDeviceIcon={getDeviceIcon}
								getBrowserIcon={getBrowserIcon}
								getOSIcon={getOSIcon}
							/>
							{/* UTM URL Generator Section */}
							<UTMSection />
						</div>
					</div>
				</div>
			</div>

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
				loading={sourceAnalyticsLoading}
			/>

			{/* Visitor Metrics Modal removed */}
		</>
	);
}

export default SalesDashboard;
