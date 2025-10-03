import React, { useState, useEffect, useCallback } from "react";
// import { Google, Facebook, Apple, Eye, EyeSlash } from "react-bootstrap-icons";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OAuthCompletionModal from "./OAuthCompletionModal";
import MissingFieldsModal from "./MissingFieldsModal";
import LoadingModal from "./LoadingModal";
import {
	faEnvelope,
	faKey,
	faLeaf,
	faUsers,
	faChartLine,
	faRecycle,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import AlertModal from "../components/AlertModal"; // Import your modal
import GoogleSignInButton from "./GoogleSignInButton";
import Swal from "sweetalert2";
import "./LoginForm.css";
import useSEO from "../hooks/useSEO";
import tokenService from "../services/tokenService";
import googleOAuthService from "../services/googleOAuthService";

const LoginForm = ({ onLogin }) => {
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	// const [error, setError] = useState('');  // No longer need inline error state
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	// SEO Implementation
	useSEO({
		title: "Login - Carbon Cube Kenya",
		description:
			"Sign in to your Carbon Cube Kenya account. Access your buyer or seller dashboard on Kenya's trusted online marketplace.",
		keywords:
			"login Carbon Cube Kenya, sign in, marketplace login, Kenya online shopping, seller login",
		url: "https://carboncube-ke.com/login",
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "Login - Carbon Cube Kenya",
			description: "Sign in to your Carbon Cube Kenya account",
			url: "https://carboncube-ke.com/login",
			mainEntity: {
				"@type": "WebApplication",
				name: "Carbon Cube Kenya Login",
				applicationCategory: "BusinessApplication",
				operatingSystem: "Web Browser",
			},
		},
	});

	// AlertModal states
	const [showAlertModal, setShowAlertModal] = useState(false);
	const [alertModalMessage, setAlertModalMessage] = useState("");

	// Missing fields modal states
	const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
	const [missingFields, setMissingFields] = useState([]);
	const [userData, setUserData] = useState({});

	// OAuth completion modal state
	const [showCompletionModal, setShowCompletionModal] = useState(false);
	const [incompleteUser, setIncompleteUser] = useState(null);

	// Loading modal state
	const [showLoadingModal, setShowLoadingModal] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("Processing...");
	const [alertModalConfig, setAlertModalConfig] = useState({
		icon: "error",
		title: "Error",
		confirmText: "OK",
		cancelText: "",
		showCancel: false,
		onConfirm: () => setShowAlertModal(false),
	});

	const handleCloseAlertModal = () => {
		setShowAlertModal(false);
	};

	// Handle Google OAuth callback
	const handleGoogleCallback = useCallback(async () => {
		if (googleOAuthService.isCallback()) {
			const searchParams = new URLSearchParams(location.search);
			const token = searchParams.get("token");
			const userParam = searchParams.get("user");
			const success = searchParams.get("success");
			const error = searchParams.get("error");

			// Handle error cases
			if (error) {
				setLoading(false);
				// Redirect to dedicated error page instead of showing modal
				const errorMessage = decodeURIComponent(error);
				navigate(
					`/auth/google/error?error=${encodeURIComponent(errorMessage)}`
				);
				return;
			}

			// Handle success case with token and user data
			if (success === "true" && token && userParam) {
				setLoading(true);
				try {
					const user = JSON.parse(decodeURIComponent(userParam));

					// Call onLogin to handle authentication and storage (same as normal login)
					onLogin(token, user);

					// Show success message with SweetAlert
					Swal.fire({
						icon: "success",
						title: "Welcome!",
						text: `Successfully signed in with Google! Welcome back, ${
							user.name || user.fullname || "User"
						}!`,
						showConfirmButton: false,
						timer: 2000,
						timerProgressBar: true,
						allowOutsideClick: false,
						allowEscapeKey: false,
					}).then(() => {
						// Check for redirect parameter (same as normal login)
						const redirectUrl = searchParams.get("redirect");

						// If there's a redirect URL, use it for buyers (most common case)
						if (redirectUrl && user.role === "buyer") {
							navigate(redirectUrl);
							return;
						}

						// Navigate based on user role (same as normal login)
						switch (user.role) {
							case "buyer":
								navigate("/");
								break;
							case "seller":
								navigate("/seller/dashboard");
								break;
							case "admin":
								navigate("/admin/analytics");
								break;
							case "sales":
								navigate("/sales/dashboard");
								break;
							default:
								setAlertModalMessage("Unexpected user role.");
								setAlertModalConfig({
									icon: "error",
									title: "Error",
									confirmText: "OK",
									showCancel: false,
									onConfirm: () => setShowAlertModal(false),
								});
								setShowAlertModal(true);
						}
					});
				} catch (error) {
					console.error("Google OAuth callback error:", error);
					setAlertModalMessage(
						"Failed to process Google sign-in. Please try again."
					);
					setAlertModalConfig({
						icon: "error",
						title: "Google Sign-in Failed",
						confirmText: "OK",
						showCancel: false,
						onConfirm: () => setShowAlertModal(false),
					});
					setShowAlertModal(true);
				} finally {
					setLoading(false);
					googleOAuthService.clearUrlParams();
				}
			} else {
				// Fallback to old method for backward compatibility
				const code = googleOAuthService.getCodeFromUrl();
				if (code) {
					setLoading(true);
					try {
						const result = await googleOAuthService.handleCallback(code);

						if (result.success) {
							// Use tokenService to validate and store token
							if (!tokenService.setToken(result.token)) {
								throw new Error("Invalid token received from server");
							}

							onLogin(result.token, result.user);

							// Check for redirect parameter
							const redirectUrl = searchParams.get("redirect");

							// If there's a redirect URL, use it for buyers (most common case)
							if (redirectUrl && result.user.role === "buyer") {
								navigate(redirectUrl);
								return;
							}

							// Navigate based on user role
							switch (result.user.role) {
								case "buyer":
									navigate("/");
									break;
								case "seller":
									navigate("/seller/dashboard");
									break;
								case "admin":
									navigate("/admin/analytics");
									break;
								case "sales":
									navigate("/sales/dashboard");
									break;
								default:
									setAlertModalMessage("Unexpected user role.");
									setAlertModalConfig({
										icon: "error",
										title: "Error",
										confirmText: "OK",
										showCancel: false,
										onConfirm: () => setShowAlertModal(false),
									});
									setShowAlertModal(true);
							}
						} else {
							setAlertModalMessage(result.error);
							setAlertModalConfig({
								icon: "error",
								title: "Google Sign-in Failed",
								confirmText: "OK",
								showCancel: false,
								onConfirm: () => setShowAlertModal(false),
							});
							setShowAlertModal(true);
						}
					} catch (error) {
						console.error("Google OAuth error:", error);
						setAlertModalMessage("Google sign-in failed. Please try again.");
						setAlertModalConfig({
							icon: "error",
							title: "Google Sign-in Failed",
							confirmText: "OK",
							showCancel: false,
							onConfirm: () => setShowAlertModal(false),
						});
						setShowAlertModal(true);
					} finally {
						setLoading(false);
						googleOAuthService.clearUrlParams();
					}
				}
			}
		}
	}, [location.search, navigate, onLogin]);

	// Handle Google OAuth callback on component mount
	useEffect(() => {
		handleGoogleCallback();
	}, [handleGoogleCallback]);

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		// setError('');  // replaced by modal

		try {
			const loginUrl = `${process.env.REACT_APP_BACKEND_URL}/auth/login`;
			const response = await axios.post(loginUrl, {
				identifier,
				password,
				remember_me: rememberMe,
			});

			const { token, user } = response.data;

			// Use tokenService to validate and store token
			if (!tokenService.setToken(token)) {
				throw new Error("Invalid token received from server");
			}

			onLogin(token, user);

			// Check for redirect parameter
			const searchParams = new URLSearchParams(location.search);
			const redirectUrl = searchParams.get("redirect");

			// If there's a redirect URL, use it for buyers (most common case)
			if (redirectUrl && user.role === "buyer") {
				navigate(redirectUrl);
				return;
			}

			switch (user.role) {
				case "buyer":
					navigate("/");
					break;
				case "seller":
					navigate("/seller/dashboard");
					break;
				case "admin":
					navigate("/admin/analytics");
					break;
				case "sales":
					navigate("/sales/dashboard"); // Adjust this route as needed
					break;
				default:
					// Show modal for unexpected role
					setAlertModalMessage("Unexpected user role.");
					setAlertModalConfig({
						icon: "error",
						title: "Error",
						confirmText: "OK",
						showCancel: false,
						onConfirm: () => setShowAlertModal(false),
					});
					setShowAlertModal(true);
			}
		} catch (error) {
			console.error(error);
			let message = "Network error. Please try again later.";

			if (error.response) {
				const data = error.response.data;
				if (data.errors && Array.isArray(data.errors)) {
					message = data.errors[0];
				} else if (data.message) {
					message = data.message;
				} else {
					message = "Invalid identifier or password";
				}
			}

			// Show modal with error message
			setAlertModalMessage(message);
			setAlertModalConfig({
				icon: "error",
				title: "Login Failed",
				confirmText: "OK",
				showCancel: false,
				onConfirm: () => setShowAlertModal(false),
			});
			setShowAlertModal(true);
		} finally {
			setLoading(false);
		}
	};

	// Handle missing fields submission
	const handleMissingFieldsSubmit = async (formData) => {
		setLoading(true);
		setShowLoadingModal(true);
		setLoadingMessage("Completing your registration...");

		try {
			// Send the missing fields data to the backend
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/auth/complete_oauth_registration`,
				{
					...userData,
					...formData,
					missing_fields: missingFields,
				}
			);

			if (response.data.success) {
				// Store token and user data
				if (response.data.token) {
					tokenService.setToken(response.data.token);
				}

				// Update loading message
				setLoadingMessage("Signing you in...");

				// Call onLogin to handle authentication
				onLogin(response.data.token, response.data.user);

				// Close the modals
				setShowMissingFieldsModal(false);
				setShowLoadingModal(false);

				// Show success message with SweetAlert
				Swal.fire({
					icon: "success",
					title: "Welcome!",
					text: `Registration completed successfully! Welcome to Carbon Cube, ${
						response.data.user.name || response.data.user.fullname || "User"
					}!`,
					showConfirmButton: false,
					timer: 2000,
					timerProgressBar: true,
					allowOutsideClick: false,
					allowEscapeKey: false,
				}).then(() => {
					// Navigate based on user role
					switch (response.data.user.role) {
						case "buyer":
							navigate("/");
							break;
						case "seller":
							navigate("/seller/dashboard");
							break;
						case "admin":
							navigate("/admin/analytics");
							break;
						case "sales":
							navigate("/sales/dashboard");
							break;
						default:
							navigate("/");
					}
				});
			} else {
				setShowLoadingModal(false);
				setAlertModalMessage(
					response.data.error || "Failed to complete registration"
				);
				setAlertModalConfig({
					icon: "error",
					title: "Registration Error",
					confirmText: "OK",
					showCancel: false,
					onConfirm: () => setShowAlertModal(false),
				});
				setShowAlertModal(true);
			}
		} catch (error) {
			console.error("❌ Missing fields submission error:", error);
			setShowLoadingModal(false);

			let errorMessage = "Failed to complete registration";
			if (error.response?.data?.error) {
				errorMessage = error.response.data.error;
			} else if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			}

			setAlertModalMessage(errorMessage);
			setAlertModalConfig({
				icon: "error",
				title: "Registration Error",
				confirmText: "OK",
				showCancel: false,
				onConfirm: () => setShowAlertModal(false),
			});
			setShowAlertModal(true);
		} finally {
			setLoading(false);
		}
	};

	// Handle loading state changes from OAuth service
	const handleOAuthLoading = (isLoading, message = "Processing...") => {
		setShowLoadingModal(isLoading);
		setLoadingMessage(message);
	};

	return (
		<>
			<Navbar mode="minimal" showSearch={false} showCategories={false} />

			<div className="login-container min-h-screen flex items-center justify-center px-2 py-4 sm:px-4 sm:py-6">
				<div className="w-full max-w-4xl mx-auto">
					<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
						<div className="flex flex-col lg:flex-row min-h-[600px]">
							{/* Left Branding Section */}
							<div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 flex-col justify-between">
								{/* Header Section */}
								<div className="space-y-3 sm:space-y-4 lg:space-y-4">
									<div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 lg:mb-4">
										<img
											src="/logo.png"
											alt="CarbonCube Logo"
											className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 object-contain"
										/>
										<h2 className="text-lg sm:text-xl font-bold">
											<span className="text-white">arbon</span>
											<span className="text-yellow-400">Cube</span>
										</h2>
									</div>
									<p className="text-slate-300 text-xs sm:text-sm leading-relaxed ml-8 sm:ml-10 lg:ml-11">
										Welcome to CarbonCube - your trusted online marketplace for
										sustainable products and eco-conscious shopping.
									</p>
								</div>

								{/* Features Section */}
								<div className="space-y-5">
									<h5 className="text-yellow-400 text-sm font-medium">
										Why CarbonCube?
									</h5>
									<div className="space-y-3">
										<div className="flex items-center space-x-3">
											<div className="w-5 h-5 bg-yellow-400/20 rounded flex items-center justify-center">
												<FontAwesomeIcon
													icon={faLeaf}
													className="text-yellow-400 text-xs"
												/>
											</div>
											<span className="text-slate-300 text-sm">
												Manage carbon product listings
											</span>
										</div>
										<div className="flex items-center space-x-3">
											<div className="w-5 h-5 bg-yellow-400/20 rounded flex items-center justify-center">
												<FontAwesomeIcon
													icon={faUsers}
													className="text-yellow-400 text-xs"
												/>
											</div>
											<span className="text-slate-300 text-sm">
												Connect with local sellers
											</span>
										</div>
										<div className="flex items-center space-x-3">
											<div className="w-5 h-5 bg-yellow-400/20 rounded flex items-center justify-center">
												<FontAwesomeIcon
													icon={faChartLine}
													className="text-yellow-400 text-xs"
												/>
											</div>
											<span className="text-slate-300 text-sm">
												Real-time deal tracking
											</span>
										</div>
										<div className="flex items-center space-x-3">
											<div className="w-5 h-5 bg-yellow-400/20 rounded flex items-center justify-center">
												<FontAwesomeIcon
													icon={faRecycle}
													className="text-yellow-400 text-xs"
												/>
											</div>
											<span className="text-slate-300 text-sm">
												Eco-conscious marketplace
											</span>
										</div>
									</div>
								</div>

								{/* Vision Section */}
								<div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
									<h6 className="text-yellow-400 font-medium text-sm mb-2">
										Vision
									</h6>
									<p className="text-slate-300 text-xs leading-relaxed">
										"To be Kenya's most trusted and innovative online
										marketplace."
									</p>
								</div>
							</div>

							{/* Right Login Form Section */}
							<div className="w-full lg:w-3/5 bg-white p-6 sm:p-8 lg:p-10 flex items-center">
								<div className="w-full max-w-md mx-auto">
									{/* Header Section */}
									<div className="text-center mb-8">
										<h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
											Welcome Back
										</h3>
										<p className="text-gray-600 text-sm">
											Sign in to your account
										</p>
									</div>

									<form onSubmit={handleLogin} className="space-y-6">
										{/* Input Fields Section */}
										<div className="space-y-4">
											{/* Email/Phone Input */}
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Email
												</label>
												<div className="relative">
													<FontAwesomeIcon
														icon={faEnvelope}
														className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
													/>
													<input
														type="text"
														placeholder="Enter your email"
														className="w-full pl-10 pr-4 py-2.5 text-left rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
														value={identifier}
														onChange={(e) => setIdentifier(e.target.value)}
														required
													/>
												</div>
											</div>

											{/* Password Input */}
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Password
												</label>
												<div className="relative">
													<FontAwesomeIcon
														icon={faKey}
														className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
													/>
													<input
														type={showPassword ? "text" : "password"}
														placeholder="Enter your password"
														className="w-full pl-10 pr-10 py-2.5 text-left rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
														value={password}
														onChange={(e) => setPassword(e.target.value)}
														required
													/>
													<div
														onClick={() => setShowPassword(!showPassword)}
														className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200"
													>
														<AnimatePresence mode="wait" initial={false}>
															{showPassword ? (
																<motion.span
																	key="hide"
																	initial={{ opacity: 0, scale: 0.8 }}
																	animate={{ opacity: 1, scale: 1 }}
																	exit={{ opacity: 0, scale: 0.8 }}
																	transition={{ duration: 0.2 }}
																>
																	<EyeSlash size={16} />
																</motion.span>
															) : (
																<motion.span
																	key="show"
																	initial={{ opacity: 0, scale: 0.8 }}
																	animate={{ opacity: 1, scale: 1 }}
																	exit={{ opacity: 0, scale: 0.8 }}
																	transition={{ duration: 0.2 }}
																>
																	<Eye size={16} />
																</motion.span>
															)}
														</AnimatePresence>
													</div>
												</div>
											</div>

											{/* Remember Me and Forgot Password */}
											<div className="flex justify-between items-center pt-1">
												<label className="flex items-center text-sm text-gray-600 cursor-pointer">
													<input
														type="checkbox"
														checked={rememberMe}
														onChange={(e) => setRememberMe(e.target.checked)}
														className="mr-2 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400 focus:ring-2"
													/>
													Remember me
												</label>
												<Link
													to="/forgot-password"
													className="text-sm text-yellow-500 hover:text-yellow-600 transition-colors duration-200 font-medium"
												>
													Forgot Password?
												</Link>
											</div>
										</div>

										{/* Login Button */}
										<div className="pt-2">
											<button
												type="submit"
												disabled={loading}
												className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-yellow-300 disabled:to-yellow-400 text-black font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed text-sm shadow-md hover:shadow-lg"
											>
												{loading ? "Signing In..." : "Sign In"}
											</button>
										</div>

										<div className="relative my-6">
											<div className="absolute inset-0 flex items-center">
												<div className="w-full border-t border-gray-200"></div>
											</div>
											<div className="relative flex justify-center text-sm">
												<span className="px-4 bg-white text-gray-500">
													or continue with
												</span>
											</div>
										</div>

										{/* Google Sign-in Button */}
										<div className="mb-6">
											<GoogleSignInButton
												role="buyer"
												onSuccess={(token, user) => {
													// Call onLogin to handle authentication and storage (same as normal login)
													onLogin(token, user);

													// Show success message with SweetAlert
													Swal.fire({
														icon: "success",
														title: "Welcome!",
														text: `Successfully signed in with Google! Welcome back, ${
															user.name || user.fullname || "User"
														}!`,
														showConfirmButton: false,
														timer: 2000,
														timerProgressBar: true,
														allowOutsideClick: false,
														allowEscapeKey: false,
													});
												}}
												onCompletion={(user) => {
													setIncompleteUser(user);
													setShowCompletionModal(true);
												}}
												onMissingFields={(fields, userData) => {
													console.log("📝 Missing fields detected:", fields);
													console.log("📝 User data:", userData);

													// Store data in localStorage for the complete registration page
													localStorage.setItem(
														"registrationData",
														JSON.stringify({
															missingFields: fields,
															userData: userData,
														})
													);

													// Navigate to complete registration page
													navigate("/complete-registration", {
														state: {
															missingFields: fields,
															userData: userData,
														},
													});
												}}
												onLoading={handleOAuthLoading}
												onError={(error) => {
													console.error("❌ Google OAuth error:", error);
													setAlertModalMessage(error);
													setAlertModalConfig({
														icon: "error",
														title: "Authentication Error",
														confirmText: "OK",
														showCancel: false,
														onConfirm: () => setShowAlertModal(false),
													});
													setShowAlertModal(true);
												}}
												disabled={loading}
											/>
										</div>

										<div className="text-center">
											<p className="text-gray-600 mb-4 text-sm">
												Don't have an account?
											</p>
											<div className="flex flex-col sm:flex-row gap-3 justify-center">
												<button
													type="button"
													onClick={() => navigate("/buyer-signup")}
													className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-all duration-200 transform hover:scale-105 text-sm font-medium shadow-md hover:shadow-lg"
												>
													Buyer
												</button>
												<button
													type="button"
													onClick={() => navigate("/seller-signup")}
													className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-all duration-200 transform hover:scale-105 text-sm font-medium shadow-md hover:shadow-lg"
												>
													Seller
												</button>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* AlertModal usage */}
				<AlertModal
					isVisible={showAlertModal}
					message={alertModalMessage}
					onClose={handleCloseAlertModal}
					icon={alertModalConfig.icon}
					title={alertModalConfig.title}
					confirmText={alertModalConfig.confirmText}
					cancelText={alertModalConfig.cancelText}
					showCancel={alertModalConfig.showCancel}
					onConfirm={alertModalConfig.onConfirm}
				/>

				{/* Missing Fields Modal */}
				<MissingFieldsModal
					isOpen={showMissingFieldsModal}
					onClose={() => setShowMissingFieldsModal(false)}
					onSubmit={handleMissingFieldsSubmit}
					missingFields={missingFields}
					userData={userData}
					isLoading={loading}
				/>

				{/* OAuth Completion Modal */}
				<OAuthCompletionModal
					show={showCompletionModal}
					onHide={() => setShowCompletionModal(false)}
					userData={incompleteUser}
					onComplete={(token, user) => {
						onLogin(token, user);
						setShowCompletionModal(false);
						setIncompleteUser(null);

						// Show success message with SweetAlert
						Swal.fire({
							icon: "success",
							title: "Welcome!",
							text: `Registration completed successfully! Welcome to Carbon Cube, ${
								user.name || user.fullname || "User"
							}!`,
							showConfirmButton: false,
							timer: 2000,
							timerProgressBar: true,
							allowOutsideClick: false,
							allowEscapeKey: false,
						}).then(() => {
							// Navigate to home page
							navigate("/");
						});
					}}
					onCancel={() => {
						setShowCompletionModal(false);
						setIncompleteUser(null);
					}}
				/>

				{/* Loading Modal */}
				<LoadingModal
					isVisible={showLoadingModal}
					message={loadingMessage}
					type="loading"
				/>
			</div>
		</>
	);
};

export default LoginForm;
