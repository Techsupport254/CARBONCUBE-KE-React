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
	const [errors, setErrors] = useState({});
	const [message, setMessage] = useState("");

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
							<div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 flex-col justify-between">
								<div className="pt-2">
									<h2 className="text-2xl font-bold mb-3">
										<span className="text-white">Carbon</span>
										<span className="text-yellow-400">Cube</span>
									</h2>
									<p className="text-gray-300 opacity-90 text-xs leading-relaxed">
										Reset your password and get back to trading on the Carbon
										marketplace.
									</p>
								</div>

								<div className="px-1 py-4">
									<h5 className="text-yellow-400 mb-3 text-sm font-semibold">
										Secure Password Reset
									</h5>
									<ul className="space-y-2">
										<li className="flex items-center">
											<span className="mr-2 text-yellow-400 text-xs">✓</span>
											<span className="text-xs text-gray-300">
												OTP-based password reset
											</span>
										</li>
										<li className="flex items-center">
											<span className="mr-3 text-yellow-400 text-sm">✓</span>
											<span className="text-sm text-gray-300">
												Fast recovery process
											</span>
										</li>
										<li className="flex items-center">
											<span className="mr-3 text-yellow-400 text-sm">✓</span>
											<span className="text-sm text-gray-300">
												Email verification
											</span>
										</li>
										<li className="flex items-center">
											<span className="mr-3 text-yellow-400 text-sm">✓</span>
											<span className="text-sm text-gray-300">
												Secure password strength
											</span>
										</li>
									</ul>
								</div>

								<div className="bg-black bg-opacity-50 p-3 rounded-lg mt-2">
									<div className="flex items-center mb-1">
										<div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2"></div>
										<small className="font-semibold text-xs">Need Help?</small>
									</div>
									<p className="italic text-xs text-gray-300">
										Contact support@carboncube-ke.com for assistance.
									</p>
								</div>
							</div>

							{/* Right Form Section */}
							<div className="w-full lg:w-3/5 bg-white p-6 sm:p-8 lg:p-10 flex items-center">
								<div className="w-full max-w-md mx-auto">
									{/* Header Section */}
									<div className="text-center mb-8">
										<h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
											Forgot Password
										</h3>
										<p className="text-gray-600 text-sm">
											Reset your password to get back to your account
										</p>
									</div>

									{/* Progress Indicator */}
									<div className="w-full bg-gray-200 rounded-full h-2 mb-6">
										<div
											className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
											style={{ width: `${Math.round((step / 3) * 100)}%` }}
										></div>
									</div>

									{/* Success Message */}
									{message && (
										<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
											{message}
										</div>
									)}

									{/* General Error Message */}
									{errors.general && (
										<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
											{errors.general}
										</div>
									)}

									<form
										onSubmit={step === 1 ? handleRequestOtp : handleVerifyOtp}
										className="space-y-6"
									>
										{step === 1 && (
											<>
												{/* Step 1: Email Input */}
												<div className="space-y-4">
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
																className={`w-full pl-10 pr-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
																	errors.email
																		? "border-red-500 focus:ring-red-400"
																		: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																} focus:outline-none`}
																value={email}
																onChange={handleEmailChange}
																required
															/>
														</div>
														{errors.email && (
															<div className="text-red-500 text-xs mt-1">
																{errors.email}
															</div>
														)}
													</div>
												</div>

												<div className="pt-2">
													<button
														type="submit"
														disabled={loading || !email.trim()}
														className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform text-sm shadow-md ${
															loading || !email.trim()
																? "bg-gray-300 text-gray-500 cursor-not-allowed"
																: "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black hover:scale-[1.02] hover:shadow-lg"
														}`}
													>
														{loading ? "Sending OTP..." : "Send OTP"}
													</button>
												</div>
											</>
										)}

										{step === 2 && (
											<>
												{/* Step 2: OTP and New Password */}
												<div className="space-y-4">
													<div>
														<label className="block text-sm font-medium text-gray-700 mb-2">
															OTP Code
														</label>
														<input
															type="text"
															placeholder="Enter OTP sent to your email"
															className={`w-full px-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
																errors.otp
																	? "border-red-500 focus:ring-red-400"
																	: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
															} focus:outline-none`}
															value={otp}
															onChange={handleOtpChange}
															required
														/>
														{errors.otp && (
															<div className="text-red-500 text-xs mt-1">
																{errors.otp}
															</div>
														)}
													</div>

													<div>
														<label className="block text-sm font-medium text-gray-700 mb-2">
															New Password
														</label>
														<div className="relative">
															<FontAwesomeIcon
																icon={faKey}
																className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
															/>
															<input
																type={showNewPassword ? "text" : "password"}
																placeholder="Enter your new password"
																className={`w-full pl-10 pr-12 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
																	errors.password
																		? "border-red-500 focus:ring-red-400"
																		: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																} focus:outline-none`}
																value={newPassword}
																onChange={handlePasswordChange}
																required
															/>
															<div
																onClick={() =>
																	setShowNewPassword(!showNewPassword)
																}
																className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200"
															>
																<AnimatePresence mode="wait" initial={false}>
																	{showNewPassword ? (
																		<motion.span
																			key="hideNew"
																			initial={{ opacity: 0, scale: 0.8 }}
																			animate={{ opacity: 1, scale: 1 }}
																			exit={{ opacity: 0, scale: 0.8 }}
																			transition={{ duration: 0.2 }}
																		>
																			<EyeSlash size={16} />
																		</motion.span>
																	) : (
																		<motion.span
																			key="showNew"
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
														{errors.password && (
															<div className="text-red-500 text-xs mt-1">
																{errors.password}
															</div>
														)}
														<PasswordStrengthIndicator
															password={newPassword}
															email={email}
															username=""
														/>
													</div>
												</div>

												<div className="flex justify-between gap-4 pt-2">
													<button
														type="button"
														className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
														onClick={() => setStep(1)}
													>
														Back
													</button>
													<button
														type="submit"
														disabled={
															loading ||
															!otp.trim() ||
															!newPassword.trim() ||
															errors.password ||
															errors.otp
														}
														className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform text-sm shadow-md ${
															loading ||
															!otp.trim() ||
															!newPassword.trim() ||
															errors.password ||
															errors.otp
																? "bg-gray-300 text-gray-500 cursor-not-allowed"
																: "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black hover:scale-[1.02] hover:shadow-lg"
														}`}
													>
														{loading
															? "Resetting Password..."
															: "Reset Password"}
													</button>
												</div>
											</>
										)}

										{step === 3 && (
											<>
												{/* Step 3: Success */}
												<div className="text-center">
													<div className="inline-block bg-green-100 p-4 rounded-full shadow-sm">
														<FontAwesomeIcon
															icon={faCheckCircle}
															className="text-green-500"
															style={{ fontSize: "3rem" }}
														/>
													</div>
													<h3 className="mt-4 text-lg font-semibold text-gray-900">
														Password Reset Successful!
													</h3>
													<p className="mt-2 text-sm text-gray-600">
														Your password has been successfully reset. You can
														now sign in with your new password.
													</p>
													<div className="mt-6">
														<a
															href="/login"
															className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] text-sm shadow-md hover:shadow-lg"
														>
															<FontAwesomeIcon
																icon={faRightToBracket}
																className="mr-2"
															/>
															Return to Login
														</a>
													</div>
												</div>
											</>
										)}
									</form>

									{/* Back to Login Link */}
									<div className="text-center mt-6">
										<p className="text-gray-600 text-sm">
											Remember your password?{" "}
											<a
												href="/login"
												className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200 font-medium"
											>
												Sign In
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
