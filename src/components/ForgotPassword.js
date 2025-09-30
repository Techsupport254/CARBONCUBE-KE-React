import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEnvelope,
	faKey,
	faCheckCircle,
	faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import Navbar from "./Navbar";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import axios from "axios";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [resendLoading, setResendLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [message, setMessage] = useState("");
	const [resendCooldown, setResendCooldown] = useState(0);

	const handleRequestOtp = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErrors({});
		setMessage("");

		// Basic validation
		if (!email.trim()) {
			setErrors({ email: "Email is required" });
			setLoading(false);
			return;
		}

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/password_resets/request_otp`,
				{
					email: email.trim(),
				}
			);
			setMessage(response.data.message || "OTP sent. Please check your email.");
			setStep(2);
		} catch (err) {
			if (err.response?.data?.error) {
				setErrors({ email: err.response.data.error });
			} else {
				setErrors({ general: "Failed to send OTP. Please try again." });
			}
		} finally {
			setLoading(false);
		}
	};

	const handleResendOtp = async () => {
		setResendLoading(true);
		setErrors({});
		setMessage("");

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/password_resets/request_otp`,
				{
					email: email.trim(),
				}
			);
			setMessage(
				response.data.message || "OTP resent. Please check your email."
			);

			// Start cooldown timer (60 seconds)
			setResendCooldown(60);
			const timer = setInterval(() => {
				setResendCooldown((prev) => {
					if (prev <= 1) {
						clearInterval(timer);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		} catch (err) {
			if (err.response?.data?.error) {
				setErrors({ general: err.response.data.error });
			} else {
				setErrors({ general: "Failed to resend OTP. Please try again." });
			}
		} finally {
			setResendLoading(false);
		}
	};

	const handleVerifyOtp = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErrors({});
		setMessage("");

		// Basic validation
		const newErrors = {};
		if (!otp.trim()) {
			newErrors.otp = "OTP is required";
		}
		if (!newPassword.trim()) {
			newErrors.password = "New password is required";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			setLoading(false);
			return;
		}

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/password_resets/verify_otp`,
				{
					email: email.trim(),
					otp: otp.trim(),
					new_password: newPassword,
				}
			);
			setMessage(
				response.data.message || "Password reset successful. You can now login."
			);
			setStep(3);
		} catch (err) {
			if (err.response?.data?.errors) {
				// Handle multiple validation errors
				const serverErrors = {};
				err.response.data.errors.forEach((error) => {
					if (error.includes("OTP")) {
						serverErrors.otp = error;
					} else if (error.includes("password")) {
						serverErrors.password = error;
					} else {
						serverErrors.general = error;
					}
				});
				setErrors(serverErrors);
			} else if (err.response?.data?.error) {
				setErrors({ general: err.response.data.error });
			} else {
				setErrors({ general: "Invalid OTP or password reset failed." });
			}
		} finally {
			setLoading(false);
		}
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
		// Clear email error when user starts typing
		if (errors.email) {
			setErrors({ ...errors, email: null });
		}
	};

	const handleOtpChange = (e) => {
		setOtp(e.target.value);
		// Clear OTP error when user starts typing
		if (errors.otp) {
			setErrors({ ...errors, otp: null });
		}
	};

	const handlePasswordChange = (e) => {
		setNewPassword(e.target.value);
		// Clear password error when user starts typing
		if (errors.password) {
			setErrors({ ...errors, password: null });
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
							<div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 flex-col justify-between">
								<div className="space-y-3 sm:space-y-4 lg:space-y-4">
									<div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 lg:mb-4">
										<img
											src="/logo.png"
											alt="CarbonCube Logo"
											className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 object-contain"
										/>
										<h2 className="text-lg sm:text-xl font-bold">
											<span className="text-white">Carbon</span>
											<span className="text-yellow-400">Cube</span>
										</h2>
									</div>
									<p className="text-slate-300 text-xs sm:text-sm leading-relaxed ml-8 sm:ml-10 lg:ml-11">
										Reset your password and get back to trading on the Carbon
										marketplace.
									</p>
								</div>

								{/* Features Section */}
								<div className="space-y-5">
									<h5 className="text-yellow-400 text-sm font-medium">
										Secure Password Reset
									</h5>
									<div className="space-y-3">
										<div className="flex items-center space-x-3">
											<div className="w-5 h-5 bg-yellow-400/20 rounded flex items-center justify-center">
												<span className="text-yellow-400 text-xs">✓</span>
											</div>
											<span className="text-slate-300 text-sm">
												OTP-based password reset
											</span>
										</div>
										<div className="flex items-center space-x-3">
											<div className="w-5 h-5 bg-yellow-400/20 rounded flex items-center justify-center">
												<span className="text-yellow-400 text-xs">✓</span>
											</div>
											<span className="text-slate-300 text-sm">
												Fast recovery process
											</span>
										</div>
										<div className="flex items-center space-x-3">
											<div className="w-5 h-5 bg-yellow-400/20 rounded flex items-center justify-center">
												<span className="text-yellow-400 text-xs">✓</span>
											</div>
											<span className="text-slate-300 text-sm">
												Email verification
											</span>
										</div>
										<div className="flex items-center space-x-3">
											<div className="w-5 h-5 bg-yellow-400/20 rounded flex items-center justify-center">
												<span className="text-yellow-400 text-xs">✓</span>
											</div>
											<span className="text-slate-300 text-sm">
												Secure password strength
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

							{/* Right Form Section */}
							<div className="w-full lg:w-3/5 bg-white p-6 sm:p-8 lg:p-10 flex items-center">
								<div className="w-full max-w-md mx-auto">
									{/* Header Section */}
									<div className="text-center mb-8">
										<h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
											Reset Password
										</h3>
										<p className="text-gray-600 text-sm">
											Enter your email to receive reset instructions
										</p>
									</div>

									{step === 1 && (
										<form onSubmit={handleRequestOtp} className="space-y-6">
											{errors.general && (
												<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
													{errors.general}
												</div>
											)}

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Email Address
												</label>
												<div className="relative">
													<FontAwesomeIcon
														icon={faEnvelope}
														className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
													/>
													<input
														type="email"
														placeholder="Enter your email address"
														className="w-full pl-10 pr-4 py-3 text-left rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
														value={email}
														onChange={(e) => setEmail(e.target.value)}
														required
													/>
												</div>
												{errors.email && (
													<div className="text-red-500 text-xs mt-1">
														{errors.email}
													</div>
												)}
											</div>

											<div className="pt-2">
												<button
													type="submit"
													disabled={loading}
													className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-yellow-300 disabled:to-yellow-400 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed text-sm shadow-md hover:shadow-lg"
												>
													{loading ? "Sending..." : "Send Reset Code"}
												</button>
											</div>
										</form>
									)}

									{step === 2 && (
										<form onSubmit={handleVerifyOtp} className="space-y-6">
											{message && (
												<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
													{message}
												</div>
											)}

											{errors.general && (
												<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
													{errors.general}
												</div>
											)}

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Verification Code
												</label>
												<div className="relative">
													<FontAwesomeIcon
														icon={faKey}
														className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
													/>
													<input
														type="text"
														placeholder="Enter verification code"
														className="w-full pl-10 pr-4 py-3 text-left rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
														value={otp}
														onChange={(e) => setOtp(e.target.value)}
														required
													/>
												</div>
												{errors.otp && (
													<div className="text-red-500 text-xs mt-1">
														{errors.otp}
													</div>
												)}
											</div>

											{/* Resend Email Section */}
											<div className="text-center">
												<p className="text-sm text-gray-600 mb-2">
													Code sent to{" "}
													<span className="font-medium text-gray-800">
														{email}
													</span>
												</p>
												<p className="text-sm text-gray-600 mb-3">
													Didn't receive the code?{" "}
													{resendCooldown > 0 ? (
														<span className="text-gray-500">
															Resend in {resendCooldown}s
														</span>
													) : (
														<button
															type="button"
															onClick={handleResendOtp}
															disabled={resendLoading}
															className="text-yellow-600 hover:text-yellow-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
														>
															{resendLoading ? "Resending..." : "Resend Email"}
														</button>
													)}
												</p>
											</div>

											<div className="pt-2">
												<button
													type="submit"
													disabled={loading}
													className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-yellow-300 disabled:to-yellow-400 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed text-sm shadow-md hover:shadow-lg"
												>
													{loading ? "Verifying..." : "Verify Code"}
												</button>
											</div>
										</form>
									)}

									{step === 3 && (
										<form onSubmit={handlePasswordChange} className="space-y-6">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													New Password
												</label>
												<div className="relative">
													<input
														type={showNewPassword ? "text" : "password"}
														placeholder="Enter new password"
														className="w-full px-4 py-3 text-left rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
														value={newPassword}
														onChange={(e) => setNewPassword(e.target.value)}
														required
													/>
													<button
														type="button"
														className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
														onClick={() => setShowNewPassword(!showNewPassword)}
													>
														{showNewPassword ? (
															<EyeSlash size={16} />
														) : (
															<Eye size={16} />
														)}
													</button>
												</div>
												{errors.password && (
													<div className="text-red-500 text-xs mt-1">
														{errors.password}
													</div>
												)}
												{newPassword && (
													<PasswordStrengthIndicator password={newPassword} />
												)}
											</div>

											<div className="pt-2">
												<button
													type="submit"
													disabled={loading}
													className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-yellow-300 disabled:to-yellow-400 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed text-sm shadow-md hover:shadow-lg"
												>
													{loading ? "Updating..." : "Update Password"}
												</button>
											</div>
										</form>
									)}

									{/* Login Link */}
									<div className="mt-6 text-center">
										<p className="text-sm text-gray-600">
											Remember your password?{" "}
											<a
												href="/login"
												className="text-yellow-600 hover:text-yellow-700 font-medium"
											>
												Sign in
											</a>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ForgotPassword;
