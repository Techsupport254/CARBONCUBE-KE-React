import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faStar,
	faGem,
	faCrown,
} from "@fortawesome/free-solid-svg-icons";

const CountDownDisplay = () => {
	const [daysLeft, setDaysLeft] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentTier, setCurrentTier] = useState(1);
	const [countdownSeconds, setCountdownSeconds] = useState(0);
	const [expiryDate, setExpiryDate] = useState(null);

	// Helper function to format countdown display
	const formatCountdown = (seconds) => {
		if (seconds <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

		const days = Math.floor(seconds / (24 * 60 * 60));
		const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
		const minutes = Math.floor((seconds % (60 * 60)) / 60);
		const remainingSeconds = seconds % 60;

		return { days, hours, minutes, seconds: remainingSeconds };
	};

	// Helper function to format expiry date
	const formatExpiryDate = (dateString) => {
		if (!dateString) return null;
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		} catch (error) {
			console.error("Error formatting expiry date:", error);
			return null;
		}
	};

	// Helper function to get tier icon and color
	const getTierInfo = (tierId) => {
		switch (tierId) {
			case 1:
				return { icon: faUser, color: "text-gray-500", name: "Free Tier" };
			case 2:
				return { icon: faStar, color: "text-blue-500", name: "Basic Tier" };
			case 3:
				return { icon: faGem, color: "text-purple-500", name: "Standard Tier" };
			case 4:
				return {
					icon: faCrown,
					color: "text-yellow-500",
					name: "Premium Tier",
				};
			default:
				return { icon: faUser, color: "text-gray-500", name: "Free Tier" };
		}
	};

	useEffect(() => {
		const fetchCountdown = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					throw new Error("No authentication token found");
				}

				const decodedToken = JSON.parse(atob(token.split(".")[1]));
				const sellerId =
					decodedToken.seller_id || decodedToken.user_id || decodedToken.id;

				if (!sellerId) {
					console.error("Token payload:", decodedToken);
					throw new Error("User ID not found in token");
				}

				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/seller/seller_tiers/${sellerId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!response.ok) {
					const errorText = await response.text();
					console.error("API Error:", response.status, errorText);
					throw new Error(
						`Failed to fetch countdown: ${response.status} ${response.statusText}`
					);
				}

				const data = await response.json();

				// API Response data
				if (data.tier_id) {
					setCurrentTier(data.tier_id);
				} else if (data.tier && data.tier.id) {
					setCurrentTier(data.tier.id);
				}

				// Set expiry date if available - check multiple possible field names
				let foundExpiryDate = null;
				if (data.subscription_expiry_date) {
					foundExpiryDate = data.subscription_expiry_date;
				} else if (data.expiry_date) {
					foundExpiryDate = data.expiry_date;
				} else if (data.expires_at) {
					foundExpiryDate = data.expires_at;
				} else if (data.end_date) {
					foundExpiryDate = data.end_date;
				} else if (data.subscription_end_date) {
					foundExpiryDate = data.subscription_end_date;
				} else if (data.tier && data.tier.expiry_date) {
					foundExpiryDate = data.tier.expiry_date;
				} else if (data.tier && data.tier.expires_at) {
					foundExpiryDate = data.tier.expires_at;
				}

				if (data.subscription_countdown) {
					// Check if subscription has expired
					if (data.subscription_countdown.expired) {
						setDaysLeft(0);
						setCountdownSeconds(0);
						// Set expiry date if available for expired subscriptions
						if (foundExpiryDate) {
							setExpiryDate(foundExpiryDate);
						}
					} else if (data.subscription_countdown.never_expires) {
						// Free tier never expires
						setDaysLeft(null); // Use null to indicate no countdown needed
						setCountdownSeconds(0);
						// Set expiry date if available, even for never-expiring subscriptions
						if (foundExpiryDate) {
							setExpiryDate(foundExpiryDate);
						}
					} else {
						// Calculate total seconds from the countdown data
						const {
							months = 0,
							weeks = 0,
							days = 0,
							hours = 0,
							minutes = 0,
							seconds = 0,
						} = data.subscription_countdown;

						// Convert to total seconds
						const totalSeconds =
							months * 30 * 24 * 60 * 60 +
							weeks * 7 * 24 * 60 * 60 +
							days * 24 * 60 * 60 +
							hours * 60 * 60 +
							minutes * 60 +
							seconds;

						setCountdownSeconds(totalSeconds);
						setDaysLeft(days + weeks * 7 + months * 30);

						// If no explicit expiry date was found, calculate it from countdown
						if (!foundExpiryDate) {
							const now = new Date();
							const expiry = new Date(now.getTime() + totalSeconds * 1000);
							foundExpiryDate = expiry.toISOString();
						}

						// Set the expiry date
						setExpiryDate(foundExpiryDate);
					}
				} else {
					// If no countdown data but we have an expiry date, set it
					if (foundExpiryDate) {
						setExpiryDate(foundExpiryDate);
					}
					throw new Error("No countdown data available");
				}
			} catch (err) {
				console.error("CountDownDisplay error:", err);
				setError(err.message);
				// Set default values to prevent UI breaking
				setCurrentTier(1);
				setDaysLeft(null);
				setCountdownSeconds(0);
				setExpiryDate(null);
			} finally {
				setLoading(false);
			}
		};

		fetchCountdown();
	}, []);

	// Countdown timer effect
	useEffect(() => {
		if (countdownSeconds <= 0) return;

		const timer = setInterval(() => {
			setCountdownSeconds((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					setDaysLeft(0);
					return 0;
				}
				return prev - 1;
			});

			// Update days display
			setDaysLeft(Math.ceil(countdownSeconds / (24 * 60 * 60)));
		}, 1000);

		return () => clearInterval(timer);
	}, [countdownSeconds]);

	// Remove the old countdown effect since we now use real-time calculation

	if (loading) {
		return (
			<div className="flex justify-center items-center py-2 sm:py-4">
				<div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-100 border border-red-400 text-red-700 px-2 sm:px-4 py-2 sm:py-3 rounded text-xs sm:text-sm">
				{error}
			</div>
		);
	}

	if (daysLeft === null) {
		const tierInfo = getTierInfo(currentTier);
		return (
			<div className="text-center">
				<div className="flex justify-center mb-2 sm:mb-3">
					<FontAwesomeIcon
						icon={tierInfo.icon}
						className={`w-8 h-8 sm:w-12 sm:h-12 ${tierInfo.color}`}
					/>
				</div>
				<div
					className={`text-lg sm:text-2xl font-bold ${tierInfo.color} mb-1 sm:mb-2`}
				>
					{tierInfo.name}
				</div>
				<div className="text-xs sm:text-sm text-gray-600">No Expiry</div>
				{expiryDate && (
					<div className="text-xs text-gray-500 mt-1">
						Expires: {formatExpiryDate(expiryDate)}
					</div>
				)}
				{/* Debug info - remove in production */}
				<div className="text-xs text-gray-400 mt-1">
					Debug: {expiryDate ? `Date: ${expiryDate}` : "No date found"}
				</div>
			</div>
		);
	}

	if (daysLeft <= 0) {
		const tierInfo = getTierInfo(currentTier);
		return (
			<div className="text-center">
				<div className="flex justify-center mb-2 sm:mb-3">
					<FontAwesomeIcon
						icon={tierInfo.icon}
						className="w-8 h-8 sm:w-12 sm:h-12 text-red-500"
					/>
				</div>
				<div className="text-lg sm:text-xl font-bold text-red-500 mb-1 sm:mb-2">
					{tierInfo.name}
				</div>
				<div className="text-xs sm:text-sm text-gray-600">
					Subscription Expired
				</div>
				{expiryDate && (
					<div className="text-xs text-gray-500 mt-1">
						Expired: {formatExpiryDate(expiryDate)}
					</div>
				)}
				{/* Debug info - remove in production */}
				<div className="text-xs text-gray-400 mt-1">
					Debug: {expiryDate ? `Date: ${expiryDate}` : "No date found"}
				</div>
			</div>
		);
	}

	const tierInfo = getTierInfo(currentTier);

	const countdown = formatCountdown(countdownSeconds);

	return (
		<div className="flex items-center justify-between p-4">
			{/* Left side - Tier info */}
			<div className="flex items-center space-x-3">
				<FontAwesomeIcon
					icon={tierInfo.icon}
					className={`w-8 h-8 ${tierInfo.color}`}
				/>
				<div>
					<div className={`text-sm font-semibold ${tierInfo.color}`}>
						{tierInfo.name}
					</div>
					{expiryDate && (
						<div className="text-xs text-gray-500">
							Expires: {formatExpiryDate(expiryDate)}
						</div>
					)}
				</div>
			</div>

			{/* Right side - Countdown */}
			<div className="text-right">
				<div className={`text-2xl font-bold ${tierInfo.color}`}>
					{countdown.days}
				</div>
				<div className="text-xs text-gray-600 mb-1">Days Left</div>
				<div className="text-xs text-gray-500">
					{countdown.hours.toString().padStart(2, "0")}:
					{countdown.minutes.toString().padStart(2, "0")}:
					{countdown.seconds.toString().padStart(2, "0")}
				</div>
			</div>
		</div>
	);
};

export default CountDownDisplay;
