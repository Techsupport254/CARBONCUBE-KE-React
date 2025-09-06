import React, { useState } from "react";
import { Google, Facebook, Apple, Eye, EyeSlash } from "react-bootstrap-icons";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import AlertModal from "../components/AlertModal"; // Import your modal
import "./LoginForm.css";
import useSEO from "../hooks/useSEO";

const LoginForm = ({ onLogin }) => {
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	// const [error, setError] = useState('');  // No longer need inline error state
	const [loading, setLoading] = useState(false);

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
	const [alertModalConfig, setAlertModalConfig] = useState({
		icon: "error",
		title: "Error",
		confirmText: "OK",
		cancelText: "",
		showCancel: false,
		onConfirm: () => setShowAlertModal(false),
	});

	const navigate = useNavigate();

	const handleCloseAlertModal = () => {
		setShowAlertModal(false);
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		// setError('');  // replaced by modal

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/auth/login`,
				{
					identifier,
					password,
				}
			);

			const { token, user } = response.data;
			localStorage.setItem("token", token);
			onLogin(token, user);

			switch (user.role) {
				case "buyer":
					navigate("/buyer/home");
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

	return (
		<>
			<Navbar mode="minimal" showSearch={false} showCategories={false} />

			<div className="login-container min-h-screen flex items-center justify-center px-0 py-6 sm:px-4">
				<div className="w-full max-w-4xl">
					<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
						<div className="flex flex-col lg:flex-row min-h-[600px]">
							{/* Left Branding Section */}
							<div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 flex-col justify-between">
								<div className="pt-2">
									<h2 className="text-2xl font-bold mb-3">
										<span className="text-white">Carbon</span>
										<span className="text-yellow-400">Cube</span>
									</h2>
									<p className="text-gray-300 opacity-90 text-xs leading-relaxed">
										Welcome to CarbonCube - your trusted online marketplace for
										sustainable products and eco-conscious shopping.
									</p>
								</div>

								<div className="px-1 py-4">
									<h5 className="text-yellow-400 mb-3 text-sm font-semibold">
										Why CarbonCube?
									</h5>
									<ul className="space-y-2">
										<li className="flex items-center">
											<span className="mr-2 text-yellow-400 text-xs">✓</span>
											<span className="text-xs text-gray-300">
												Manage carbon product listings
											</span>
										</li>
										<li className="flex items-center">
											<span className="mr-3 text-yellow-400 text-sm">✓</span>
											<span className="text-sm text-gray-300">
												Connect with local sellers
											</span>
										</li>
										<li className="flex items-center">
											<span className="mr-3 text-yellow-400 text-sm">✓</span>
											<span className="text-sm text-gray-300">
												Real-time deal tracking
											</span>
										</li>
										<li className="flex items-center">
											<span className="mr-3 text-yellow-400 text-sm">✓</span>
											<span className="text-sm text-gray-300">
												Eco-conscious marketplace
											</span>
										</li>
									</ul>
								</div>

								<div className="bg-black bg-opacity-50 p-3 rounded-lg mt-2">
									<div className="flex items-center mb-1">
										<div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2"></div>
										<small className="font-semibold text-xs">Vision:</small>
									</div>
									<p className="italic text-xs text-gray-300">
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
										<h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
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
													Email or Phone Number
												</label>
												<div className="relative">
													<FontAwesomeIcon
														icon={faEnvelope}
														className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
													/>
													<input
														type="text"
														placeholder="Enter your email or phone number"
														className="w-full pl-10 pr-4 py-3 text-left rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
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
														className="w-full pl-10 pr-10 py-3 text-left rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
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
												className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-yellow-300 disabled:to-yellow-400 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed text-sm shadow-md hover:shadow-lg"
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

										<div className="flex justify-center space-x-3 mb-6">
											<button
												type="button"
												className="w-12 h-12 bg-white hover:bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md border border-gray-200"
											>
												<Google size={18} />
											</button>
											<button
												type="button"
												className="w-12 h-12 bg-white hover:bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md border border-gray-200"
											>
												<Facebook size={18} />
											</button>
											<button
												type="button"
												className="w-12 h-12 bg-white hover:bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md border border-gray-200"
											>
												<Apple size={18} />
											</button>
										</div>

										<div className="text-center">
											<p className="text-gray-600 mb-4 text-sm">
												Don't have an account?
											</p>
											<div className="flex flex-col sm:flex-row gap-3 justify-center">
												<button
													type="button"
													onClick={() => navigate("/buyer-signup")}
													className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-all duration-200 transform hover:scale-105 text-sm font-medium shadow-md hover:shadow-lg"
												>
													Buyer
												</button>
												<button
													type="button"
													onClick={() => navigate("/seller-signup")}
													className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-all duration-200 transform hover:scale-105 text-sm font-medium shadow-md hover:shadow-lg"
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
			</div>
		</>
	);
};

export default LoginForm;
