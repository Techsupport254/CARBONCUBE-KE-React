import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MpesaPaymentGuide from "../components/MpesaPaymentGuide";
import FeatureComparisonTable from "../components/FeatureComparisonTable";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { jwtDecode } from "jwt-decode";

const TierPage = () => {
	const [tiers, setTiers] = useState([]);
	const [selectedTier, setSelectedTier] = useState(null);
	const [selectedPricing, setSelectedPricing] = useState(null);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [paymentStep, setPaymentStep] = useState("instructions"); // 'instructions', 'confirming', 'success'
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);
	const [currentSellerTier, setCurrentSellerTier] = useState(null);

	const [timeRemaining, setTimeRemaining] = useState(null);
	const [openFAQ, setOpenFAQ] = useState(null);
	const navigate = useNavigate();
	const [isSellerLoggedIn, setIsSellerLoggedIn] = useState(false);

	const fetchCurrentSellerTier = useCallback(async () => {
		const token = sessionStorage.getItem("token");

		if (!token) {
			return;
		}

		try {
			const decoded = jwtDecode(token);
			const sellerId = decoded.seller_id || decoded.user_id || decoded.id;

			if (sellerId) {
				const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/seller/seller_tiers/${sellerId}`;

				const response = await axios.get(apiUrl, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.data) {
					setCurrentSellerTier(response.data);
					// Start countdown timer
					startCountdownTimer(response.data.subscription_countdown);
				}
			}
		} catch (error) {
			// If unauthorized, the token is invalid - clear it and redirect to login
			if (error.response?.status === 401) {
				sessionStorage.removeItem("token");
				setIsSellerLoggedIn(false);
				// Optionally redirect to login page
				// navigate("/seller/login");
				return;
			}

			// If seller tier not found, create a default tier response
			if (error.response?.status === 404) {
				// Get seller ID from token again for the fallback
				const decoded = jwtDecode(token);
				const sellerId = decoded.seller_id || decoded.user_id || decoded.id;

				// Temporary fix: If seller ID is 114, assume Premium tier
				let defaultTier;
				if (sellerId === 114) {
					defaultTier = {
						subscription_countdown: {
							months: 6,
							weeks: 2,
							days: 15,
							hours: 8,
							minutes: 30,
							seconds: 45,
						},
						tier: {
							id: 4,
							name: "Premium",
							ads_limit: 2000,
						},
					};
				} else {
					// Default to Free tier for other sellers
					defaultTier = {
						subscription_countdown: { never_expires: true },
						tier: {
							id: 1,
							name: "Free",
							ads_limit: 10,
						},
					};
				}

				setCurrentSellerTier(defaultTier);
				startCountdownTimer(defaultTier.subscription_countdown);
			}
		}
	}, []);

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_BACKEND_URL}/tiers`)
			.then((response) => {
				setTiers(response.data || []);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error fetching tier data:", err);
				setError("Failed to fetch tier data. Please try again later.");
				setLoading(false);
			});

		// Fetch current seller tier information
		fetchCurrentSellerTier();
	}, [fetchCurrentSellerTier]);

	const startCountdownTimer = (countdownData) => {
		if (!countdownData) return;

		// Handle different countdown formats
		if (countdownData.never_expires) {
			setTimeRemaining({
				days: 999,
				hours: 0,
				minutes: 0,
				seconds: 0,
				total: Infinity,
			});
			return;
		}

		if (countdownData.expired) {
			setTimeRemaining({
				days: 0,
				hours: 0,
				minutes: 0,
				seconds: 0,
				total: 0,
			});
			return;
		}

		// If it's already a hash with time components, use it directly
		if (countdownData.months !== undefined) {
			const updateCountdown = () => {
				// Convert months to days for display
				const totalDays =
					(countdownData.months || 0) * 30 +
					(countdownData.weeks || 0) * 7 +
					(countdownData.days || 0);
				const totalHours = totalDays * 24 + (countdownData.hours || 0);
				const totalMinutes = totalHours * 60 + (countdownData.minutes || 0);
				const totalSeconds = totalMinutes * 60 + (countdownData.seconds || 0);

				setTimeRemaining({
					days: totalDays,
					hours: countdownData.hours || 0,
					minutes: countdownData.minutes || 0,
					seconds: countdownData.seconds || 0,
					total: totalSeconds * 1000,
				});
			};

			// Update immediately
			updateCountdown();

			// Update every second
			const interval = setInterval(() => {
				// Decrease seconds
				if (countdownData.seconds > 0) {
					countdownData.seconds--;
				} else if (countdownData.minutes > 0) {
					countdownData.minutes--;
					countdownData.seconds = 59;
				} else if (countdownData.hours > 0) {
					countdownData.hours--;
					countdownData.minutes = 59;
					countdownData.seconds = 59;
				} else if (countdownData.days > 0) {
					countdownData.days--;
					countdownData.hours = 23;
					countdownData.minutes = 59;
					countdownData.seconds = 59;
				} else if (countdownData.weeks > 0) {
					countdownData.weeks--;
					countdownData.days = 6;
					countdownData.hours = 23;
					countdownData.minutes = 59;
					countdownData.seconds = 59;
				} else if (countdownData.months > 0) {
					countdownData.months--;
					countdownData.weeks = 3;
					countdownData.days = 29;
					countdownData.hours = 23;
					countdownData.minutes = 59;
					countdownData.seconds = 59;
				}
				updateCountdown();
			}, 1000);

			// Cleanup interval on component unmount
			return () => clearInterval(interval);
		}

		// Fallback for date string format
		const expiryDate = new Date(countdownData);
		if (isNaN(expiryDate.getTime())) return;

		const updateCountdown = () => {
			const now = new Date().getTime();
			const expiry = expiryDate.getTime();
			const difference = expiry - now;

			if (difference > 0) {
				const days = Math.floor(difference / (1000 * 60 * 60 * 24));
				const hours = Math.floor(
					(difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
				);
				const minutes = Math.floor(
					(difference % (1000 * 60 * 60)) / (1000 * 60)
				);
				const seconds = Math.floor((difference % (1000 * 60)) / 1000);

				setTimeRemaining({
					days,
					hours,
					minutes,
					seconds,
					total: difference,
				});
			} else {
				setTimeRemaining({
					days: 0,
					hours: 0,
					minutes: 0,
					seconds: 0,
					total: 0,
				});
			}
		};

		// Update immediately
		updateCountdown();

		// Update every second
		const interval = setInterval(updateCountdown, 1000);

		// Cleanup interval on component unmount
		return () => clearInterval(interval);
	};

	const handleSelectTier = (tierId) => {
		setSelectedTier(tierId);
	};

	const handleSelectPricing = (tier, pricing) => {
		setSelectedTier(tier.id);
		setSelectedPricing(pricing);
		setShowPaymentModal(true);
		setPaymentStep("instructions");
	};

	const handlePayment = () => {
		if (!selectedTier || !selectedPricing) {
			setError("Please select a tier and pricing option");
			return;
		}

		// Validate payment amount
		const amount = parseFloat(selectedPricing.price);
		if (amount <= 0) {
			setError("Invalid payment amount");
			return;
		}

		// Check if phone number is already stored
		const storedPhone = sessionStorage.getItem("sellerPhone");
		if (storedPhone) {
			// Use stored phone number directly
			processPayment(storedPhone);
		} else {
			// Show phone number input modal
			setShowPhoneModal(true);
		}
	};

	const processPayment = async (sellerPhone) => {
		// Validate phone number format
		if (!sellerPhone.match(/^(\+254|254|0)[0-9]{9}$/)) {
			setError("Please enter a valid Kenyan phone number (e.g., 0712345678)");
			return;
		}

		// Store phone number for future use
		sessionStorage.setItem("sellerPhone", sellerPhone);

		// Move to confirmation step
		setPaymentStep("confirming");
		setShowConfirmationModal(true);
		setIsProcessingPayment(true);

		try {
			// Initiate STK Push payment
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/payments/initiate`,
				{
					tier_id: selectedTier,
					pricing_id: selectedPricing.id,
					phone_number: sellerPhone,
				},
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem("token")}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.data.success) {
				setPaymentStep("processing");
				setIsProcessingPayment(false);

				// Start polling for payment status
				pollPaymentStatus(response.data.payment_id);
			} else {
				setError(response.data.error || "Failed to initiate payment");
				setIsProcessingPayment(false);
				setPaymentStep("instructions");
			}
		} catch (error) {
			console.error("Payment initiation error:", error);
			setError(
				error.response?.data?.error ||
					"Failed to initiate payment. Please try again."
			);
			setIsProcessingPayment(false);
			setPaymentStep("instructions");
		}
	};

	const handlePhoneSubmit = () => {
		if (!phoneNumber.trim()) {
			setError("Phone number is required for payment");
			return;
		}

		setShowPhoneModal(false);
		processPayment(phoneNumber);
		setPhoneNumber("");
	};

	const [showPhoneModal, setShowPhoneModal] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [showManualPaymentModal, setShowManualPaymentModal] = useState(false);
	const [manualPaymentInstructions, setManualPaymentInstructions] =
		useState(null);
	const [manualPaymentStep, setManualPaymentStep] = useState("instructions"); // 'instructions', 'verification', 'success'
	const [verificationData, setVerificationData] = useState(null);
	const [currentPaymentId, setCurrentPaymentId] = useState(null);

	const pollPaymentStatus = async (paymentId) => {
		setCurrentPaymentId(paymentId);

		const pollInterval = setInterval(async () => {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_BACKEND_URL}/payments/status/${paymentId}`,
					{
						headers: {
							Authorization: `Bearer ${sessionStorage.getItem("token")}`,
						},
					}
				);

				if (response.data.success) {
					const payment = response.data.payment;

					if (payment.status === "completed") {
						clearInterval(pollInterval);
						setPaymentStep("success");
						setShowConfirmationModal(false);

						// Refresh seller tier data
						fetchCurrentSellerTier();

						// Reset state
						setSelectedTier(null);
						setSelectedPricing(null);
						setShowPaymentModal(false);
						setPaymentStep("instructions");
					} else if (payment.status === "failed") {
						clearInterval(pollInterval);
						setError(
							payment.error_message || "Payment failed. Please try again."
						);
						setPaymentStep("instructions");
					}
				}
			} catch (error) {
				console.error("Error checking payment status:", error);
			}
		}, 3000); // Poll every 3 seconds

		// Clear interval after 5 minutes
		setTimeout(() => {
			clearInterval(pollInterval);
		}, 300000);
	};

	const confirmPayment = () => {
		// This function is no longer needed as payment is handled in handlePayment
		// Keep it for backward compatibility but it won't be called
		setIsProcessingPayment(false);
		setPaymentStep("success");
		setShowConfirmationModal(false);

		// Reset state
		setSelectedTier(null);
		setSelectedPricing(null);
		setShowPaymentModal(false);
		setPaymentStep("instructions");
	};

	const resetPaymentFlow = () => {
		setSelectedTier(null);
		setSelectedPricing(null);
		setShowPaymentModal(false);
		setShowConfirmationModal(false);
		setPaymentStep("instructions");
		setIsProcessingPayment(false);
		setError(null);
	};

	const handleManualPayment = async () => {
		if (!selectedTier || !selectedPricing) {
			setError("Please select a tier and pricing option");
			return;
		}

		try {
			const response = await axios.get(
				`${process.env.REACT_APP_BACKEND_URL}/payments/manual_instructions`,
				{
					params: {
						tier_id: selectedTier,
						pricing_id: selectedPricing.id,
					},
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem("token")}`,
					},
				}
			);

			if (response.data.success) {
				setManualPaymentInstructions(response.data.instructions);
				setShowManualPaymentModal(true);
				setManualPaymentStep("instructions");
			} else {
				setError(response.data.error || "Failed to get payment instructions");
			}
		} catch (error) {
			console.error("Error getting manual payment instructions:", error);
			setError("Failed to get payment instructions. Please try again.");
		}
	};

	const handlePaymentVerification = async () => {
		const transactionId = document.getElementById("transaction_id").value;
		const amount = document.getElementById("amount").value;

		if (!transactionId || !amount) {
			setError("Please enter both transaction ID and amount");
			return;
		}

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/payments/verify_manual`,
				{
					transaction_id: transactionId,
					amount: parseFloat(amount),
				},
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem("token")}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.data.success) {
				setVerificationData(response.data);
				setManualPaymentStep("verification");
				setError(null);
			} else {
				setError(response.data.error || "Payment verification failed");
			}
		} catch (error) {
			console.error("Error verifying payment:", error);
			setError(
				error.response?.data?.error ||
					"Failed to verify payment. Please try again."
			);
		}
	};

	const handlePaymentConfirmation = async () => {
		const mpesaReceipt = document.getElementById("mpesa_receipt").value;

		if (!mpesaReceipt) {
			setError("Please enter your M-Pesa receipt number");
			return;
		}

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/payments/confirm_manual`,
				{
					payment_transaction_id: verificationData.payment_transaction_id,
					mpesa_receipt_number: mpesaReceipt,
				},
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem("token")}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.data.success) {
				setManualPaymentStep("success");
				// Refresh seller tier data
				fetchCurrentSellerTier();
			} else {
				setError(response.data.error || "Payment confirmation failed");
			}
		} catch (error) {
			console.error("Error confirming payment:", error);
			setError(
				error.response?.data?.error ||
					"Failed to confirm payment. Please try again."
			);
		}
	};

	const resetManualPaymentFlow = () => {
		setShowManualPaymentModal(false);
		setManualPaymentInstructions(null);
		setManualPaymentStep("instructions");
		setVerificationData(null);
		setError(null);
	};

	const formatTimeRemaining = (timeRemaining) => {
		if (!timeRemaining || timeRemaining.total <= 0) {
			return "Expired";
		}

		if (timeRemaining.days > 0) {
			return `${timeRemaining.days}d ${timeRemaining.hours}h ${timeRemaining.minutes}m`;
		} else if (timeRemaining.hours > 0) {
			return `${timeRemaining.hours}h ${timeRemaining.minutes}m ${timeRemaining.seconds}s`;
		} else if (timeRemaining.minutes > 0) {
			return `${timeRemaining.minutes}m ${timeRemaining.seconds}s`;
		} else {
			return `${timeRemaining.seconds}s`;
		}
	};

	const isCurrentTier = useCallback(
		(tierId) => {
			const isCurrent =
				currentSellerTier &&
				currentSellerTier.tier &&
				currentSellerTier.tier.id === tierId;
			return isCurrent;
		},
		[currentSellerTier]
	);

	const toggleFAQ = (faqId) => {
		setOpenFAQ(openFAQ === faqId ? null : faqId);
	};

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (token) {
			try {
				const decoded = jwtDecode(token);
				if (decoded.seller_id) {
					setIsSellerLoggedIn(true);
				}
			} catch (error) {
				console.error("Invalid token:", error);
			}
		}
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar mode="minimal" showSearch={false} showCategories={false} />
				<div className="min-h-[40vh] flex items-center justify-center">
					<div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar mode="minimal" showSearch={false} showCategories={false} />
				<div className="container mx-auto px-4 text-center my-12">
					<h2 className="text-red-600 text-2xl font-semibold mb-2">Error</h2>
					<p className="text-gray-700">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar mode="minimal" showSearch={false} showCategories={false} />

			{/* Hero Section */}
			<section className="relative overflow-hidden py-8 sm:py-12 bg-gradient-to-br from-yellow-400 to-yellow-500">
				{/* Subtle background pattern */}
				<div className="absolute inset-0 opacity-20">
					<div
						className="w-full h-full"
						style={{
							background:
								"repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.1) 35px, rgba(0,0,0,.1) 70px)",
						}}
					></div>
				</div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="flex justify-center mb-3 sm:mb-4">
						<div className="bg-gray-900 rounded-full p-3">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="text-yellow-400"
							>
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
							</svg>
						</div>
					</div>
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 text-gray-900">
						Tiers & Pricing
					</h1>
					<p className="text-lg sm:text-xl mb-3 sm:mb-4 text-gray-800">
						Choose the Perfect Plan for Your Business
					</p>
					<p className="mb-3 sm:mb-4 sm:mb-6 text-sm sm:text-base text-gray-700 opacity-90">
						Whether you're just starting out or ready to scale, we have a plan
						that fits your needs
					</p>
					{/* Show only if seller is logged in */}
					{isSellerLoggedIn && (
						<div className="flex gap-3 justify-center">
							<button
								onClick={() => navigate("/seller/ads")}
								className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-4 sm:px-5 py-2 sm:py-3 shadow-lg hover:bg-gray-800 transition-colors duration-200"
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
								</svg>
								<span>Back to Home</span>
							</button>
						</div>
					)}
				</div>
			</section>

			{/* Pricing Section */}
			<section className="py-4 sm:py-12 bg-gradient-to-br from-gray-50 to-gray-100">
				<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
					<div className="text-center mb-3 sm:mb-4 sm:mb-12">
						<h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 sm:mb-4">
							Choose Your Plan
						</h2>
						<p className="text-sm sm:text-lg text-sm sm:text-gray-600 max-w-2xl mx-auto">
							Select the perfect plan for your business needs. All plans include
							our core features with different limits.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
						{tiers
							.slice()
							.sort((a, b) => a.id - b.id)
							.map((tier, index) => {
								return (
									<div
										key={tier.id}
										className="h-full"
										style={{ animationDelay: `${index * 100}ms` }}
									>
										<div
											role="button"
											tabIndex={0}
											onClick={() => setSelectedTier(tier.id)}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ")
													setSelectedTier(tier.id);
											}}
											className={`flex h-full flex-col justify-between rounded-lg sm:rounded-xl sm:rounded-2xl border-2 bg-white shadow-lg p-3 sm:p-3 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl ${
												isCurrentTier(tier.id)
													? "ring-4 ring-green-400 bg-gradient-to-br from-green-50 to-green-100 border-green-400 shadow-green-200"
													: selectedTier === tier.id
													? "ring-4 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400 shadow-yellow-200"
													: "border-gray-200 hover:border-gray-300"
											} ${
												tier.id === 3 ? "lg:scale-110 lg:z-10 relative" : ""
											}`}
										>
											<div>
												{/* Popular Badge */}
												{tier.id === 3 && (
													<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
														<span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
															Most Popular
														</span>
													</div>
												)}

												{/* Current Plan Badge */}
												{isCurrentTier(tier.id) && (
													<div className="absolute -top-3 right-0">
														<span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center">
															<svg
																width="12"
																height="12"
																viewBox="0 0 24 24"
																fill="currentColor"
																className="mr-1"
															>
																<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
															</svg>
															Current Plan
														</span>
													</div>
												)}

												<div className="mb-3 sm:mb-4 flex items-center justify-between">
													<h3 className="text-xl sm:text-2xl font-bold text-gray-900">
														{tier.name}
													</h3>
													<div className="flex flex-col items-end">
														<span className="inline-flex items-center rounded-full bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
															<svg
																width="16"
																height="16"
																viewBox="0 0 24 24"
																fill="currentColor"
																className="mr-1"
															>
																<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
															</svg>
															{tier.name === "Premium" ? "∞" : tier.ads_limit}{" "}
															Ads
														</span>
													</div>
												</div>

												<p className="text-sm text-sm sm:text-gray-600 mb-3 sm:mb-4 leading-relaxed">
													{isCurrentTier(tier.id)
														? "Your current active plan - Enjoy all benefits!"
														: tier.id === 1
														? "Perfect for new sellers getting started"
														: tier.id === 2
														? "Great for growing businesses"
														: tier.id === 3
														? "Ideal for established sellers - Most Popular Choice"
														: "Enterprise solution for large businesses"}
												</p>

												<ul className="list-none mb-3 sm:mb-4 sm:mb-6 space-y-2">
													{(tier.tier_features || [])
														.slice(0, 4)
														.map((feature) => (
															<li key={feature.id} className="flex items-start">
																<svg
																	width="16"
																	height="16"
																	viewBox="0 0 24 24"
																	fill="currentColor"
																	className="text-green-500 mr-3 flex-shrink-0 mt-0.5"
																>
																	<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
																</svg>
																<span className="text-sm text-gray-700">
																	{feature.feature_name}
																</span>
															</li>
														))}
													{(tier.tier_features || []).length > 4 && (
														<li className="text-sm text-gray-500 ml-7">
															+ {(tier.tier_features || []).length - 4} more
															features
														</li>
													)}
												</ul>
												<div className="mt-auto">
													{isCurrentTier(tier.id) ? (
														<div className="text-center p-3 sm:p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg sm:rounded-xl border-2 border-green-200">
															<div className="flex items-center justify-center mb-2">
																<svg
																	width="16"
																	height="16"
																	viewBox="0 0 24 24"
																	fill="currentColor"
																	className="text-green-600 mr-2"
																>
																	<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
																</svg>
																<span className="text-green-700 font-semibold text-sm sm:text-base">
																	Your Active Plan
																</span>
															</div>
															{tier.id === 1 ? (
																<div className="text-center">
																	<div className="text-lg sm:text-xl font-bold text-green-600 mb-1">
																		Free Forever
																	</div>
																	<div className="text-xs text-sm sm:text-gray-600">
																		No expiration - Enjoy unlimited access
																	</div>
																</div>
															) : (
																<>
																	<div className="text-xs sm:text-sm text-sm sm:text-gray-600 mb-2">
																		Subscription expires in:
																	</div>
																	<div className="text-lg sm:text-xl font-bold text-green-600 mb-2">
																		{formatTimeRemaining(timeRemaining)}
																	</div>
																	{timeRemaining && timeRemaining.total > 0 ? (
																		<div className="text-xs text-gray-500">
																			Renew to continue premium benefits
																		</div>
																	) : (
																		<div className="text-xs text-red-600 font-semibold">
																			Expired - Renew to continue
																		</div>
																	)}
																</>
															)}
															<div className="mt-3 pt-3 border-t border-green-200">
																<div className="text-xs text-sm sm:text-gray-600 mb-1">
																	Plan Benefits:
																</div>
																<div className="text-xs text-gray-700">
																	{tier.ads_limit === 999999
																		? "∞"
																		: tier.ads_limit}{" "}
																	ads • {tier.tier_features?.length || 0}{" "}
																	features
																</div>
															</div>
														</div>
													) : tier.id !== 1 ? (
														<div className="space-y-2 sm:space-y-3">
															{(tier.tier_pricings || []).map((pricing) => (
																<div
																	key={pricing.id}
																	className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
																		selectedTier === tier.id &&
																		selectedPricing?.id === pricing.id
																			? "border-yellow-400 bg-gradient-to-r from-yellow-50 to-yellow-100 shadow-lg"
																			: "border-gray-200 hover:border-gray-300 bg-white"
																	}`}
																	onClick={(e) => {
																		e.stopPropagation();
																		handleSelectPricing(tier, pricing);
																	}}
																>
																	<div className="text-center">
																		<div className="text-xs sm:text-sm font-semibold text-sm sm:text-gray-600 mb-1">
																			{pricing.duration_months} Month
																			{pricing.duration_months > 1 ? "s" : ""}
																		</div>
																		<div className="text-lg sm:text-2xl font-bold text-gray-900">
																			KES{" "}
																			{pricing.price
																				? parseFloat(
																						pricing.price
																				  ).toLocaleString()
																				: "N/A"}
																		</div>
																		{pricing.duration_months > 1 && (
																			<div className="text-xs text-gray-500 mt-1">
																				KES{" "}
																				{Math.round(
																					parseFloat(pricing.price) /
																						pricing.duration_months
																				).toLocaleString()}
																				/month
																			</div>
																		)}
																	</div>
																</div>
															))}
														</div>
													) : (
														<div className="text-center p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg sm:rounded-xl">
															<div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
																Free
															</div>
															<p className="text-xs sm:text-sm text-sm sm:text-gray-600 mb-3 sm:mb-3 sm:mb-4">
																Perfect for new sellers getting started
															</p>
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	handleSelectTier(tier.id);
																}}
																className={`w-full inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-200 ${
																	selectedTier === tier.id
																		? "bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-lg"
																		: "bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg"
																}`}
															>
																<svg
																	width="14"
																	height="14"
																	viewBox="0 0 24 24"
																	fill="currentColor"
																>
																	<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
																</svg>
																Select {tier.name}
															</button>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								);
							})}
					</div>
				</div>
			</section>

			{/* Mpesa Payment Guide */}
			<MpesaPaymentGuide />

			{/* Feature Breakdown */}
			<FeatureComparisonTable />

			{/* FAQs Section */}
			<section className="py-8 sm:py-12 bg-gray-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-3 sm:mb-4 sm:mb-6 sm:mb-8">
						<div className="flex justify-center mb-3">
							<div className="bg-yellow-400 rounded-full p-3">
								<svg
									width="32"
									height="32"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="text-gray-900"
								>
									<path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 6c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
								</svg>
							</div>
						</div>
						<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
							Frequently Asked Questions
						</h2>
						<p className="text-sm sm:text-gray-600 text-sm sm:text-base">
							Everything you need to know about our pricing tiers
						</p>
					</div>
					<div className="space-y-2 sm:space-y-3">
						{/* FAQ Item 1 */}
						<div className="bg-white rounded-lg shadow-sm overflow-hidden">
							<button
								className="w-full bg-gray-800 text-white px-3 sm:px-6 py-2 sm:py-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors duration-200"
								onClick={() => toggleFAQ(1)}
							>
								<div className="flex items-center">
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="mr-2 sm:mr-3 flex-shrink-0"
									>
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
									</svg>
									<span className="font-semibold text-xs sm:text-base">
										What happens if I upgrade or downgrade my tier?
									</span>
								</div>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="currentColor"
									className={`transform transition-transform duration-200 flex-shrink-0 ${
										openFAQ === 1 ? "rotate-180" : ""
									}`}
								>
									<path d="M7 10l5 5 5-5z" />
								</svg>
							</button>
							{openFAQ === 1 && (
								<div className="bg-gray-50 px-3 sm:px-6 py-2 sm:py-4 border-t border-gray-200">
									<p className="text-gray-700 leading-relaxed text-xs sm:text-base">
										When you upgrade or downgrade, your billing will be adjusted
										accordingly. Your features will change to match the selected
										tier. Any unused portion of your current billing cycle will
										be credited to your account, and new charges will be
										prorated based on the remaining days in your billing cycle.
									</p>
								</div>
							)}
						</div>

						{/* FAQ Item 2 */}
						<div className="bg-white rounded-lg shadow-sm overflow-hidden">
							<button
								className="w-full bg-gray-800 text-white px-3 sm:px-6 py-2 sm:py-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors duration-200"
								onClick={() => toggleFAQ(2)}
							>
								<div className="flex items-center">
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="mr-2 sm:mr-3 flex-shrink-0"
									>
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
									</svg>
									<span className="font-semibold text-xs sm:text-base">
										Can I change my tier anytime?
									</span>
								</div>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="currentColor"
									className={`transform transition-transform duration-200 flex-shrink-0 ${
										openFAQ === 2 ? "rotate-180" : ""
									}`}
								>
									<path d="M7 10l5 5 5-5z" />
								</svg>
							</button>
							{openFAQ === 2 && (
								<div className="bg-gray-50 px-3 sm:px-6 py-2 sm:py-4 border-t border-gray-200">
									<p className="text-gray-700 leading-relaxed text-xs sm:text-base">
										Yes, you can change your tier anytime. We provide
										flexibility so you can choose what fits your evolving needs.
										Changes take effect immediately, and you'll have access to
										all features included in your new tier right away.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-6 sm:py-8 text-gray-900 relative overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-500">
				{/* Subtle background pattern */}
				<div className="absolute inset-0 opacity-20">
					<div
						className="w-full h-full"
						style={{
							background:
								"repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.1) 35px, rgba(0,0,0,.1) 70px)",
						}}
					></div>
				</div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="flex justify-center mb-3">
						<div className="bg-gray-900 rounded-full p-3">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="text-yellow-400"
							>
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
							</svg>
						</div>
					</div>
					<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
						Ready to Get Started?
					</h2>
					<p className="text-sm sm:text-base mb-3 sm:mb-4 text-gray-800">
						Choose your plan and start growing your business today!
					</p>
					<button
						className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-4 sm:px-5 py-2 sm:py-3 shadow-lg hover:bg-gray-800 transition-colors duration-200"
						onClick={() => handleSelectTier(selectedTier)}
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
						</svg>
						<span>Select Your Plan</span>
					</button>
				</div>
			</section>

			{/* Enhanced Payment Modal */}
			{showPaymentModal && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
					<div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
						{/* Header */}
						<div className="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-4 sm:px-6 py-2 sm:py-3 sm:py-4 rounded-t-xl sm:rounded-t-xl sm:rounded-t-2xl">
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-2 sm:p-3 mr-3 sm:mr-4">
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="currentColor"
											className="text-gray-900"
										>
											<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
										</svg>
									</div>
									<h3 className="text-2xl font-bold text-gray-900">
										Confirm Payment
									</h3>
								</div>
								<button
									onClick={resetPaymentFlow}
									className="text-gray-400 hover:text-sm sm:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
								>
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
									</svg>
								</button>
							</div>
						</div>

						{/* Content */}
						<div className="p-3 sm:p-6">
							{error && (
								<div className="mb-3 sm:mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
									<div className="flex items-center">
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="currentColor"
											className="text-red-500 mr-2"
										>
											<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
										</svg>
										<span className="text-red-700 font-medium text-sm">
											{error}
										</span>
									</div>
								</div>
							)}

							{selectedTier && selectedPricing && (
								<div className="space-y-6">
									{/* Plan Summary Card */}
									<div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 sm:p-6 border-2 border-gray-200">
										<div className="flex items-center justify-between mb-3 sm:mb-4">
											<h4 className="text-xl font-bold text-gray-900">
												{tiers.find((t) => t.id === selectedTier)?.name} Plan
											</h4>
											<div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
												{tiers.find((t) => t.id === selectedTier)?.ads_limit ===
												2000
													? "Unlimited"
													: tiers.find((t) => t.id === selectedTier)
															?.ads_limit}{" "}
												Ads
											</div>
										</div>
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div>
												<span className="text-sm sm:text-gray-600">
													Duration:
												</span>
												<span className="font-semibold text-gray-900 ml-2">
													{selectedPricing.duration_months} months
												</span>
											</div>
											<div>
												<span className="text-sm sm:text-gray-600">Price:</span>
												<span className="font-bold text-green-600 ml-2 text-lg">
													KES{" "}
													{parseFloat(selectedPricing.price).toLocaleString()}
												</span>
											</div>
										</div>
									</div>

									{/* Security Notice */}
									<div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
										<div className="flex items-start">
											<svg
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="currentColor"
												className="text-blue-500 mr-3 mt-0.5 flex-shrink-0"
											>
												<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
											</svg>
											<div>
												<h5 className="font-semibold text-blue-900 mb-1">
													Secure Payment
												</h5>
												<p className="text-sm text-blue-700">
													Your payment is processed securely through M-Pesa. We
													never store your payment details.
												</p>
											</div>
										</div>
									</div>

									{/* Payment Instructions */}
									<div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-3 sm:p-6">
										<h5 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center text-base">
											<svg
												width="18"
												height="18"
												viewBox="0 0 24 24"
												fill="currentColor"
												className="text-yellow-600 mr-2 flex-shrink-0"
											>
												<path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
											</svg>
											How to Pay via M-Pesa Paybill
										</h5>

										{/* Step-by-step instructions */}
										<div className="space-y-3 mb-3 sm:mb-4">
											<div className="flex items-start">
												<div className="bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
													1
												</div>
												<p className="text-sm text-gray-700">
													Go to <strong>M-Pesa</strong> menu and select{" "}
													<strong>Lipa na M-Pesa</strong>
												</p>
											</div>
											<div className="flex items-start">
												<div className="bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
													2
												</div>
												<p className="text-sm text-gray-700">
													Select <strong>Paybill</strong> as payment option
												</p>
											</div>
											<div className="flex items-start">
												<div className="bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
													3
												</div>
												<p className="text-sm text-gray-700">
													Enter Business Number:{" "}
													<span className="text-yellow-600 font-bold">
														4160265
													</span>
												</p>
											</div>
											<div className="flex items-start">
												<div className="bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
													4
												</div>
												<p className="text-sm text-gray-700">
													Enter Account Number:{" "}
													<strong>Your Phone Number</strong>
												</p>
											</div>
											<div className="flex items-start">
												<div className="bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
													5
												</div>
												<p className="text-sm text-gray-700">
													Enter Amount:{" "}
													<span className="text-red-600 font-bold">
														KES{" "}
														{parseFloat(selectedPricing.price).toLocaleString()}
													</span>
												</p>
											</div>
											<div className="flex items-start">
												<div className="bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
													6
												</div>
												<p className="text-sm text-gray-700">
													Enter your <strong>M-Pesa PIN</strong> to complete
													payment
												</p>
											</div>
										</div>

										{/* Payment Summary Card */}
										<div className="bg-white rounded-lg p-4 border-2 border-gray-200 mb-3 sm:mb-4">
											<h6 className="font-semibold text-gray-900 mb-3 text-center">
												Payment Details
											</h6>
											<div className="space-y-2">
												<div className="flex justify-between items-center">
													<span className="text-sm sm:text-gray-600 font-medium text-sm">
														Paybill Number:
													</span>
													<span className="text-green-600 font-mono text-lg font-bold">
														4160265
													</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-sm sm:text-gray-600 font-medium text-sm">
														Account Number:
													</span>
													<span className="text-gray-900 font-semibold text-sm">
														Your Phone Number
													</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-sm sm:text-gray-600 font-medium text-sm">
														Amount:
													</span>
													<span className="text-red-600 font-bold text-xl">
														KES{" "}
														{parseFloat(selectedPricing.price).toLocaleString()}
													</span>
												</div>
											</div>
										</div>

										{/* Success Message */}
										<div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
											<div className="flex items-center justify-center">
												<svg
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="currentColor"
													className="text-green-500 mr-2"
												>
													<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
												</svg>
												<span className="text-green-700 font-semibold text-sm">
													Once payment is received, your seller account will be{" "}
													<strong>automatically activated</strong>
												</span>
											</div>
										</div>

										{/* Help Section */}
										<div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4">
											<div className="flex items-center">
												<svg
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="currentColor"
													className="text-yellow-600 mr-2 flex-shrink-0"
												>
													<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
												</svg>
												<div className="text-sm text-sm sm:text-gray-600">
													<span>Need help? Email </span>
													<a
														href="mailto:info@carboncube-ke.com"
														className="text-yellow-600 underline font-semibold"
													>
														info@carboncube-ke.com
													</a>
													<span> or call </span>
													<a
														href="tel:+254712990524"
														className="text-yellow-600 underline font-semibold"
													>
														+254 712 990524
													</a>
												</div>
											</div>
										</div>
									</div>

									{/* Action Buttons */}
									<div className="space-y-3 pt-4">
										<div className="flex space-x-4">
											<button
												onClick={resetPaymentFlow}
												className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-semibold text-base"
											>
												Cancel
											</button>
											<button
												onClick={handlePayment}
												className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 font-bold shadow-lg hover:shadow-xl text-base"
											>
												STK Push Payment
											</button>
										</div>
										<div className="text-center">
											<span className="text-sm text-gray-500">or</span>
										</div>
										<button
											onClick={handleManualPayment}
											className="w-full px-4 sm:px-6 py-2 sm:py-3 border-2 border-blue-300 rounded-xl text-blue-700 hover:bg-blue-50 transition-all duration-200 font-semibold text-base"
										>
											Manual Paybill Payment
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Payment Confirmation Modal */}
			{showConfirmationModal && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
					<div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
						<div className="p-3 sm:p-8 text-center">
							{paymentStep === "confirming" && (
								<>
									<div className="mb-3 sm:mb-6">
										<div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-3 sm:mb-4 flex items-center justify-center">
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="currentColor"
												className="text-gray-900"
											>
												<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
											</svg>
										</div>
										<h3 className="text-lg sm:text-lg sm:text-2xl font-bold text-gray-900 mb-2">
											Initiating Payment
										</h3>
										<p className="text-sm sm:text-base text-sm sm:text-gray-600">
											Please wait while we initiate your M-Pesa payment...
										</p>
									</div>

									<div className="flex justify-center">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
									</div>
								</>
							)}

							{paymentStep === "processing" && (
								<>
									<div className="mb-3 sm:mb-6">
										<div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-3 sm:mb-4 flex items-center justify-center">
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="currentColor"
												className="text-white"
											>
												<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
											</svg>
										</div>
										<h3 className="text-lg sm:text-lg sm:text-2xl font-bold text-gray-900 mb-2">
											Payment Processing
										</h3>
										<p className="text-sm sm:text-base text-sm sm:text-gray-600 mb-3 sm:mb-4">
											Please check your phone and complete the M-Pesa payment.
											We'll automatically detect when your payment is completed.
										</p>
									</div>

									<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3 sm:mb-4">
										<div className="flex items-center">
											<svg
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="currentColor"
												className="text-blue-500 mr-3"
											>
												<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
											</svg>
											<div>
												<h4 className="font-semibold text-blue-900 mb-1">
													Payment Details
												</h4>
												<div className="text-sm text-blue-700 space-y-1">
													<div>
														Tier:{" "}
														{tiers.find((t) => t.id === selectedTier)?.name}
													</div>
													<div>
														Amount: KES{" "}
														{parseFloat(selectedPricing.price).toLocaleString()}
													</div>
													<div>
														Duration: {selectedPricing.duration_months} months
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="flex justify-center mb-3 sm:mb-4">
										<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
									</div>

									<div className="text-center">
										<p className="text-sm text-sm sm:text-gray-600">
											Waiting for payment confirmation...
										</p>
									</div>
								</>
							)}

							{paymentStep === "success" && (
								<>
									<div className="mb-3 sm:mb-4 sm:mb-6">
										<div className="bg-gradient-to-r from-green-400 to-green-500 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
											<svg
												width="32"
												height="32"
												viewBox="0 0 24 24"
												fill="currentColor"
												className="text-white"
											>
												<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
											</svg>
										</div>
										<h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
											Payment Confirmed!
										</h3>
										<p className="text-sm sm:text-gray-600 mb-3 sm:mb-4">
											Your tier upgrade is being processed. You'll receive a
											confirmation email shortly.
										</p>
									</div>

									{/* Payment Details */}
									<div className="bg-gray-50 rounded-xl p-4 mb-3 sm:mb-4 sm:mb-6 text-left">
										<h4 className="font-semibold text-gray-900 mb-3 text-center">
											Payment Summary
										</h4>
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-sm sm:text-gray-600">Tier:</span>
												<span className="font-semibold">
													{tiers.find((t) => t.id === selectedTier)?.name}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm sm:text-gray-600">
													Duration:
												</span>
												<span className="font-semibold">
													{selectedPricing.duration_months} months
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm sm:text-gray-600">
													Amount:
												</span>
												<span className="font-bold text-green-600">
													KES{" "}
													{parseFloat(selectedPricing.price).toLocaleString()}
												</span>
											</div>
										</div>
									</div>

									<div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-3 sm:mb-4 sm:mb-6">
										<div className="text-sm text-green-700">
											<p className="font-semibold mb-1">What happens next?</p>
											<ul className="text-left space-y-1">
												<li>• Your tier will be activated within 5 minutes</li>
												<li>• You'll receive an email confirmation</li>
												<li>
													• Your new features will be available immediately
												</li>
											</ul>
										</div>
									</div>

									<button
										onClick={resetPaymentFlow}
										className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 font-bold shadow-lg hover:shadow-xl"
									>
										Continue to Dashboard
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Manual Payment Modal */}
			{showManualPaymentModal && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
					<div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
						{/* Header */}
						<div className="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-4 sm:px-6 py-2 sm:py-3 sm:py-4 rounded-t-xl sm:rounded-t-2xl">
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-full p-2 sm:p-3 mr-3 sm:mr-4">
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="currentColor"
											className="text-white"
										>
											<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
										</svg>
									</div>
									<h3 className="text-2xl font-bold text-gray-900">
										Manual Paybill Payment
									</h3>
								</div>
								<button
									onClick={resetManualPaymentFlow}
									className="text-gray-400 hover:text-sm sm:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
								>
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
									</svg>
								</button>
							</div>
						</div>

						{/* Content */}
						<div className="p-3 sm:p-6">
							{error && (
								<div className="mb-3 sm:mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
									<div className="flex items-center">
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="currentColor"
											className="text-red-500 mr-2"
										>
											<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
										</svg>
										<span className="text-red-700 font-medium text-sm">
											{error}
										</span>
									</div>
								</div>
							)}

							{manualPaymentStep === "instructions" &&
								manualPaymentInstructions && (
									<div className="space-y-6">
										{/* Payment Instructions */}
										<div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-3 sm:p-6">
											<h5 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center text-base">
												<svg
													width="18"
													height="18"
													viewBox="0 0 24 24"
													fill="currentColor"
													className="text-blue-600 mr-2 flex-shrink-0"
												>
													<path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
												</svg>
												How to Pay via M-Pesa Paybill
											</h5>

											{/* Step-by-step instructions */}
											<div className="space-y-3 mb-3 sm:mb-4">
												<div className="flex items-start">
													<div className="bg-blue-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
														1
													</div>
													<p className="text-sm text-gray-700">
														Go to <strong>M-Pesa</strong> menu and select{" "}
														<strong>Lipa na M-Pesa</strong>
													</p>
												</div>
												<div className="flex items-start">
													<div className="bg-blue-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
														2
													</div>
													<p className="text-sm text-gray-700">
														Select <strong>Paybill</strong> as payment option
													</p>
												</div>
												<div className="flex items-start">
													<div className="bg-blue-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
														3
													</div>
													<p className="text-sm text-gray-700">
														Enter Business Number:{" "}
														<span className="text-blue-600 font-bold">
															{manualPaymentInstructions.paybill_number}
														</span>
													</p>
												</div>
												<div className="flex items-start">
													<div className="bg-blue-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
														4
													</div>
													<p className="text-sm text-gray-700">
														Enter Account Number:{" "}
														<span className="text-blue-600 font-bold">
															{manualPaymentInstructions.account_number}
														</span>
													</p>
												</div>
												<div className="flex items-start">
													<div className="bg-blue-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
														5
													</div>
													<p className="text-sm text-gray-700">
														Enter Amount:{" "}
														<span className="text-red-600 font-bold">
															KES{" "}
															{manualPaymentInstructions.amount.toLocaleString()}
														</span>
													</p>
												</div>
												<div className="flex items-start">
													<div className="bg-blue-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
														6
													</div>
													<p className="text-sm text-gray-700">
														Enter your <strong>M-Pesa PIN</strong> to complete
														payment
													</p>
												</div>
											</div>

											{/* Payment Summary Card */}
											<div className="bg-white rounded-lg p-4 border-2 border-gray-200 mb-3 sm:mb-4">
												<h6 className="font-semibold text-gray-900 mb-3 text-center">
													Payment Details
												</h6>
												<div className="space-y-2">
													<div className="flex justify-between items-center">
														<span className="text-sm sm:text-gray-600 font-medium text-sm">
															Paybill Number:
														</span>
														<span className="text-green-600 font-mono text-lg font-bold">
															{manualPaymentInstructions.paybill_number}
														</span>
													</div>
													<div className="flex justify-between items-center">
														<span className="text-sm sm:text-gray-600 font-medium text-sm">
															Account Number:
														</span>
														<span className="text-gray-900 font-semibold text-sm">
															{manualPaymentInstructions.account_number}
														</span>
													</div>
													<div className="flex justify-between items-center">
														<span className="text-sm sm:text-gray-600 font-medium text-sm">
															Amount:
														</span>
														<span className="text-red-600 font-bold text-xl">
															KES{" "}
															{manualPaymentInstructions.amount.toLocaleString()}
														</span>
													</div>
												</div>
											</div>

											{/* Verification Form */}
											<div className="bg-gray-50 rounded-lg p-4">
												<h6 className="font-semibold text-gray-900 mb-3">
													After Payment
												</h6>
												<p className="text-sm text-sm sm:text-gray-600 mb-3 sm:mb-4">
													Once you complete the payment, enter your transaction
													details below to verify and activate your tier.
												</p>
												<div className="space-y-3">
													<div>
														<label className="block text-sm font-medium text-gray-700 mb-1">
															Transaction ID (from M-Pesa SMS)
														</label>
														<input
															id="transaction_id"
															type="text"
															placeholder="e.g., QHF8J2K9L3"
															className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
														/>
													</div>
													<div>
														<label className="block text-sm font-medium text-gray-700 mb-1">
															Amount Paid
														</label>
														<input
															id="amount"
															type="number"
															placeholder={manualPaymentInstructions.amount}
															className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
														/>
													</div>
												</div>
											</div>
										</div>

										{/* Action Buttons */}
										<div className="flex space-x-4">
											<button
												onClick={resetManualPaymentFlow}
												className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-semibold text-base"
											>
												Cancel
											</button>
											<button
												onClick={handlePaymentVerification}
												className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 font-bold shadow-lg hover:shadow-xl text-base"
											>
												Verify Payment
											</button>
										</div>
									</div>
								)}

							{manualPaymentStep === "verification" && verificationData && (
								<div className="space-y-6">
									<div className="text-center">
										<div className="bg-gradient-to-r from-green-400 to-green-500 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
											<svg
												width="32"
												height="32"
												viewBox="0 0 24 24"
												fill="currentColor"
												className="text-white"
											>
												<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
											</svg>
										</div>
										<h3 className="text-xl font-bold text-gray-900 mb-2">
											Payment Verified!
										</h3>
										<p className="text-sm sm:text-gray-600 mb-3 sm:mb-4">
											Your payment has been verified. Please enter your M-Pesa
											receipt number to complete the activation.
										</p>
									</div>

									<div className="bg-green-50 border border-green-200 rounded-lg p-4">
										<h6 className="font-semibold text-green-900 mb-2">
											Payment Details
										</h6>
										<div className="text-sm text-green-700 space-y-1">
											<div>Tier: {verificationData.tier_name}</div>
											<div>
												Amount: KES {verificationData.amount.toLocaleString()}
											</div>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											M-Pesa Receipt Number
										</label>
										<input
											id="mpesa_receipt"
											type="text"
											placeholder="e.g., QHF8J2K9L3"
											className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
										/>
									</div>

									<div className="flex space-x-4">
										<button
											onClick={() => setManualPaymentStep("instructions")}
											className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-semibold text-base"
										>
											Back
										</button>
										<button
											onClick={handlePaymentConfirmation}
											className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-200 font-bold shadow-lg hover:shadow-xl text-base"
										>
											Confirm & Activate
										</button>
									</div>
								</div>
							)}

							{manualPaymentStep === "success" && (
								<div className="text-center">
									<div className="bg-gradient-to-r from-green-400 to-green-500 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
										<svg
											width="32"
											height="32"
											viewBox="0 0 24 24"
											fill="currentColor"
											className="text-white"
										>
											<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
										</svg>
									</div>
									<h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
										Payment Successful!
									</h3>
									<p className="text-sm sm:text-gray-600 mb-3 sm:mb-4 sm:mb-6">
										Your tier has been activated successfully. You can now enjoy
										all the benefits of your new tier.
									</p>
									<button
										onClick={resetManualPaymentFlow}
										className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 font-bold shadow-lg hover:shadow-xl"
									>
										Continue
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Phone Number Input Modal */}
			{showPhoneModal && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
					<div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
						<div className="p-3 sm:p-6">
							<div className="text-center mb-3 sm:mb-4 sm:mb-6">
								<div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
									<svg
										width="32"
										height="32"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="text-white"
									>
										<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
									</svg>
								</div>
								<h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
									Enter Phone Number
								</h3>
								<p className="text-sm sm:text-gray-600">
									Please enter your phone number for M-Pesa payment
								</p>
							</div>

							{error && (
								<div className="mb-3 sm:mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
									<div className="flex items-center">
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="currentColor"
											className="text-red-500 mr-2"
										>
											<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
										</svg>
										<span className="text-red-700 font-medium text-sm">
											{error}
										</span>
									</div>
								</div>
							)}

							<div className="mb-3 sm:mb-4 sm:mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Phone Number
								</label>
								<input
									type="tel"
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									placeholder="e.g., 0712345678 or +254712345678"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
									autoFocus
								/>
								<p className="text-xs text-gray-500 mt-1">
									Enter your Kenyan phone number (with or without country code)
								</p>
							</div>

							<div className="flex space-x-4">
								<button
									onClick={() => {
										setShowPhoneModal(false);
										setPhoneNumber("");
										setError(null);
									}}
									className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-semibold text-base"
								>
									Cancel
								</button>
								<button
									onClick={handlePhoneSubmit}
									className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 font-bold shadow-lg hover:shadow-xl text-base"
								>
									Continue
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			<Footer />
		</div>
	);
};

export default TierPage;
