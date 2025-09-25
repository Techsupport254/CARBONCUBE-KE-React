import React, { useState, useEffect } from "react";
import { Facebook, Apple, Eye, EyeSlash } from "react-bootstrap-icons";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faEnvelope,
	faPhone,
	faMapMarkerAlt,
	faLeaf,
	faUsers,
	faChartLine,
	faRecycle,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";
import PasswordStrengthIndicator from "../../components/PasswordStrengthIndicator";
import "../css/BuyerSignUpPage.css";
import useSEO from "../../hooks/useSEO";

function BuyerSignUpPage({ onSignup }) {
	const [formData, setFormData] = useState({
		fullname: "",
		username: "",
		phone_number: "",
		email: "",
		password: "",
		password_confirmation: "",
		age_group_id: "",
		gender: "",
	});
	const [errors, setErrors] = useState({});
	const [successMessage, setSuccessMessage] = useState("");
	const [options, setOptions] = useState({ age_groups: [] });
	const navigate = useNavigate();
	const [terms, setTerms] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [otpCode, setOtpCode] = useState("");
	const [submittingSignup, setSubmittingSignup] = useState(false);
	const [verifyingOtp, setVerifyingOtp] = useState(false);
	const [otpRequested, setOtpRequested] = useState(false);
	const [requestingOtp, setRequestingOtp] = useState(false);
	const [validatingField, setValidatingField] = useState(null);

	// Enhanced SEO Implementation
	useSEO({
		title: "Join Carbon Cube Kenya - Buyer Registration | Free Sign Up",
		description:
			"Join Carbon Cube Kenya as a buyer and start shopping from verified sellers. Create your free account today and enjoy secure online shopping in Kenya's most trusted marketplace with buyer protection.",
		keywords: [
			"buyer registration Kenya",
			"free buyer account",
			"online shopping Kenya",
			"secure buyer signup",
			"Carbon Cube buyer",
			"Kenya marketplace buyer",
			"buyer protection",
			"verified sellers",
			"start shopping online Kenya",
		],
		aiCitationOptimized: true,
	});

	useEffect(() => {
		const fetchAgeGroups = async () => {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_BACKEND_URL}/age_groups`
				);
				setOptions({ age_groups: response.data });
			} catch (error) {
				console.error("Failed to fetch age groups:", error);
			}
		};

		fetchAgeGroups();
	}, []);

	// Debounced validation for unique fields
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (formData.email && formData.email.includes("@")) {
				validateFieldUniqueness("email", formData.email);
			}
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, [formData.email]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (formData.username && formData.username.length >= 3) {
				validateFieldUniqueness("username", formData.username);
			}
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, [formData.username]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (formData.phone_number && formData.phone_number.length === 10) {
				validateFieldUniqueness("phone_number", formData.phone_number);
			}
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, [formData.phone_number]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const handleEmailChange = (e) => {
		const { value } = e.target;
		setFormData((prev) => ({
			...prev,
			email: value,
		}));

		// Clear email error when user starts typing
		if (errors.email) {
			setErrors((prev) => ({
				...prev,
				email: "",
			}));
		}
	};

	const handleUsernameChange = (e) => {
		const { value } = e.target;
		setFormData((prev) => ({
			...prev,
			username: value,
		}));

		// Clear username error when user starts typing
		if (errors.username) {
			setErrors((prev) => ({
				...prev,
				username: "",
			}));
		}
	};

	const handlePhoneChange = (e) => {
		const { value } = e.target;
		// Only allow numbers and limit to 10 digits
		const numericValue = value.replace(/\D/g, "").slice(0, 10);
		setFormData((prev) => ({
			...prev,
			phone_number: numericValue,
		}));

		// Clear phone error when user starts typing
		if (errors.phone_number) {
			setErrors((prev) => ({
				...prev,
				phone_number: "",
			}));
		}
	};

	const validatePassword = () => {
		const newErrors = {};

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters long";
		}

		if (!formData.password_confirmation) {
			newErrors.password_confirmation = "Please confirm your password";
		} else if (formData.password !== formData.password_confirmation) {
			newErrors.password_confirmation = "Passwords do not match";
		}

		setErrors({ ...errors, ...newErrors });
		return Object.keys(newErrors).length === 0;
	};

	const validateUniqueness = async () => {
		const validationErrors = {};

		try {
			// Check email uniqueness
			if (formData.email) {
				try {
					const response = await axios.post(
						`${process.env.REACT_APP_BACKEND_URL}/email/exists`,
						{
							email: formData.email,
						}
					);
					if (response.data.exists) {
						validationErrors.email = "Email is already registered";
					}
				} catch (error) {
					console.error("Error checking email:", error);
				}
			}

			// Check username uniqueness
			if (formData.username) {
				try {
					const response = await axios.post(
						`${process.env.REACT_APP_BACKEND_URL}/username/exists`,
						{
							username: formData.username,
						}
					);
					if (response.data.exists) {
						validationErrors.username = "Username is already taken";
					}
				} catch (error) {
					console.error("Error checking username:", error);
				}
			}

			// Check phone number uniqueness
			if (formData.phone_number) {
				try {
					const response = await axios.post(
						`${process.env.REACT_APP_BACKEND_URL}/phone/exists`,
						{
							phone_number: formData.phone_number,
						}
					);
					if (response.data.exists) {
						validationErrors.phone_number =
							"Phone number is already registered";
					}
				} catch (error) {
					console.error("Error checking phone number:", error);
				}
			}

			return validationErrors;
		} catch (error) {
			console.error("Validation error:", error);
			return { general: "Unable to validate information. Please try again." };
		}
	};

	const validateFieldUniqueness = async (fieldName, value) => {
		if (!value || value.length < 3) return;

		setValidatingField(fieldName);

		try {
			let endpoint = "";
			let payload = {};

			switch (fieldName) {
				case "email":
					endpoint = "/email/exists";
					payload = { email: value };
					break;
				case "username":
					endpoint = "/username/exists";
					payload = { username: value };
					break;
				case "phone_number":
					endpoint = "/phone/exists";
					payload = { phone_number: value };
					break;
				default:
					return;
			}

			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}${endpoint}`,
				payload,
				{
					headers: {
						"Content-Type": "application/json",
					},
					timeout: 5000, // 5 second timeout for lightweight check
				}
			);

			// Check if the field exists
			if (response.data.exists) {
				let errorMessage = "";
				switch (fieldName) {
					case "email":
						errorMessage = "Email is already registered";
						break;
					case "username":
						errorMessage = "Username is already taken";
						break;
					case "phone_number":
						errorMessage = "Phone number is already registered";
						break;
				}
				setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
			} else {
				// Clear any existing error for this field
				if (errors[fieldName]) {
					setErrors((prev) => ({ ...prev, [fieldName]: "" }));
				}
			}
		} catch (error) {
			console.error(`Error checking ${fieldName}:`, error);
			// If API fails, don't block user - let server validation handle it
		} finally {
			setValidatingField(null);
		}
	};

	const handleRequestOtp = async () => {
		// Basic validation for email and fullname before requesting OTP
		if (!formData.email || !formData.fullname) {
			setSuccessMessage(""); // Clear success message
			setErrors({ general: "Please fill in your email and full name first." });
			return;
		}

		if (!/\S+@\S+\.\S+/.test(formData.email)) {
			setSuccessMessage(""); // Clear success message
			setErrors({ email: "Please enter a valid email address" });
			return;
		}

		try {
			setRequestingOtp(true);
			setErrors({});

			// First validate uniqueness
			const uniquenessErrors = await validateUniqueness();
			if (Object.keys(uniquenessErrors).length > 0) {
				setErrors(uniquenessErrors);
				return;
			}

			await axios.post(`${process.env.REACT_APP_BACKEND_URL}/email_otps`, {
				email: formData.email,
				fullname: formData.fullname,
			});

			setOtpRequested(true);
			setSuccessMessage("OTP sent successfully! Please check your email.");
			setErrors({});
		} catch (error) {
			console.error("OTP request error:", error);
			setSuccessMessage(""); // Clear success message on error
			if (error.response?.data?.errors) {
				const serverErrors = {};
				error.response.data.errors.forEach((err) => {
					if (err.includes("Email has already been taken")) {
						serverErrors.email = "Email has already been taken";
					} else {
						serverErrors.general = err;
					}
				});
				setErrors(serverErrors);
			} else {
				setErrors({ general: "Failed to send OTP. Please try again." });
			}
		} finally {
			setRequestingOtp(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;
		if (!validatePassword()) return;

		if (!otpRequested) {
			setErrors({
				general: "Please request OTP first by clicking 'Send OTP' button.",
			});
			return;
		}

		try {
			setSubmittingSignup(true);

			// Verify OTP and create account
			const otpResponse = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/email_otps/verify`,
				{
					email: formData.email,
					otp: otpCode,
				}
			);

			if (otpResponse.data.verified) {
				const cleanedData = Object.fromEntries(
					Object.entries(formData).map(([key, value]) => [
						key,
						value === "" ? null : value,
					])
				);

				const payload = { buyer: cleanedData };
				const response = await axios.post(
					`${process.env.REACT_APP_BACKEND_URL}/buyer/signup`,
					payload
				);

				if (response.status === 201) {
					// Auto-authenticate user after successful signup
					const { token, buyer } = response.data;

					// Store token and user data
					localStorage.setItem("token", token);
					localStorage.setItem("userRole", "buyer");
					localStorage.setItem("userName", buyer.fullname);
					localStorage.setItem("userUsername", buyer.username);
					localStorage.setItem("userEmail", buyer.email);

					// Trigger authentication update
					window.dispatchEvent(
						new StorageEvent("storage", {
							key: "token",
							newValue: token,
						})
					);

					// Navigate to home page
					navigate("/");
				}
			} else {
				setErrors({ otp: "Invalid or expired OTP." });
			}
		} catch (error) {
			const serverErrors = {};
			if (error.response?.data?.errors) {
				error.response.data.errors.forEach((err) => {
					if (err.includes("Email has already been taken")) {
						serverErrors.email = "Email has already been taken";
					} else if (err.includes("Username has already been taken")) {
						serverErrors.username = "Username has already been taken";
					} else if (err.includes("Invalid or expired OTP")) {
						serverErrors.otp = "Invalid or expired OTP";
					} else {
						serverErrors.general = err;
					}
				});
			} else {
				serverErrors.general = "An error occurred. Please try again.";
			}
			setErrors(serverErrors);
		} finally {
			setSubmittingSignup(false);
		}
	};

	const validateForm = () => {
		const newErrors = {};

		const requiredFields = [
			"fullname",
			"username",
			"email",
			"phone_number",
			"gender",
			"age_group_id",
		];

		requiredFields.forEach((field) => {
			if (!formData[field]) {
				newErrors[field] = "This field is required";
			}
		});

		// Email validation
		if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		// Phone validation
		if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number)) {
			newErrors.phone_number = "Phone number must be exactly 10 digits";
		}

		// Username validation
		if (formData.username && formData.username.length < 3) {
			newErrors.username = "Username must be at least 3 characters long";
		}

		// Full name validation
		if (formData.fullname && formData.fullname.length < 2) {
			newErrors.fullname = "Full name must be at least 2 characters long";
		}

		// OTP validation - only check if OTP has been requested
		if (otpRequested && !otpCode.trim()) {
			newErrors.otp = "OTP is required";
		}

		// Terms validation
		if (!terms) {
			newErrors.terms = "You must agree to the terms and conditions.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	return (
		<>
			<Navbar mode="minimal" showSearch={false} showCategories={false} />
			<div className="login-container min-h-screen flex items-center justify-center px-0 py-6 sm:px-4">
				<div className="w-4/5 max-w-6xl">
					<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
						<div className="flex flex-col lg:flex-row min-h-[600px]">
							{/* Left Branding Section */}
							<div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-10 flex-col justify-center">
								{/* Header Section */}
								<div className="space-y-6">
									<div className="flex items-center space-x-3 mb-6">
										<img
											src="/logo.png"
											alt="CarbonCube Logo"
											className="w-8 h-8 object-contain"
										/>
										<h2 className="text-xl font-bold">
											<span className="text-white">Carbon</span>
											<span className="text-yellow-400">Cube</span>
										</h2>
									</div>
									<div>
										<h3 className="text-3xl font-bold text-white mb-3">
											Join Carbon Cube
										</h3>
										<p className="text-slate-300 text-lg mb-6">
											Create your buyer account
										</p>
									</div>
									<p className="text-slate-300 text-sm leading-relaxed mb-8">
										Welcome to CarbonCube - your trusted online marketplace for
										sustainable products and eco-conscious shopping.
									</p>
								</div>

								{/* Features Section */}
								<div className="space-y-8 mt-12">
									<h5 className="text-yellow-400 text-lg font-bold mb-8">
										Why CarbonCube?
									</h5>
									<div className="space-y-6">
										<div className="flex items-start space-x-4">
											<div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
												<FontAwesomeIcon
													icon={faLeaf}
													className="text-yellow-400 text-base"
												/>
											</div>
											<div>
												<span className="text-slate-300 text-base font-medium block">
													Manage carbon product listings
												</span>
												<span className="text-slate-400 text-sm">
													Track and manage your carbon footprint
												</span>
											</div>
										</div>
										<div className="flex items-start space-x-4">
											<div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
												<FontAwesomeIcon
													icon={faUsers}
													className="text-yellow-400 text-base"
												/>
											</div>
											<div>
												<span className="text-slate-300 text-base font-medium block">
													Connect with local sellers
												</span>
												<span className="text-slate-400 text-sm">
													Find trusted sellers in your area
												</span>
											</div>
										</div>
										<div className="flex items-start space-x-4">
											<div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
												<FontAwesomeIcon
													icon={faChartLine}
													className="text-yellow-400 text-base"
												/>
											</div>
											<div>
												<span className="text-slate-300 text-base font-medium block">
													Real-time deal tracking
												</span>
												<span className="text-slate-400 text-sm">
													Monitor your transactions live
												</span>
											</div>
										</div>
										<div className="flex items-start space-x-4">
											<div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
												<FontAwesomeIcon
													icon={faRecycle}
													className="text-yellow-400 text-base"
												/>
											</div>
											<div>
												<span className="text-slate-300 text-base font-medium block">
													Eco-conscious marketplace
												</span>
												<span className="text-slate-400 text-sm">
													Supporting sustainable practices
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Vision Section */}
								<div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50 mt-8">
									<h6 className="text-yellow-400 font-semibold text-sm mb-3">
										Vision
									</h6>
									<p className="text-slate-300 text-sm leading-relaxed">
										"To be Kenya's most trusted and innovative online
										marketplace."
									</p>
								</div>
							</div>

							{/* Right Login Form Section */}
							<div className="w-full lg:w-3/5 bg-white p-6 lg:p-8 flex items-center">
								<div className="w-full max-w-2xl mx-auto">
									<form onSubmit={handleSubmit} className="space-y-4">
										{successMessage && (
											<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
												{successMessage}
											</div>
										)}
										{errors.general && (
											<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
												{errors.general}
											</div>
										)}

										{/* Personal Information Section */}
										<div className="space-y-3">
											{/* Full Name */}
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Full Name
												</label>
												<div className="relative">
													<FontAwesomeIcon
														icon={faUser}
														className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
													/>
													<input
														type="text"
														placeholder="Enter your full name"
														name="fullname"
														className={`w-full pl-10 pr-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
															errors.fullname
																? "border-red-500 focus:ring-red-400"
																: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
														} focus:outline-none`}
														value={formData.fullname}
														onChange={handleChange}
													/>
												</div>
												{errors.fullname && (
													<div className="text-red-500 text-xs mt-1">
														{errors.fullname}
													</div>
												)}
											</div>

											{/* Username and Phone - Same Row */}
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Username
													</label>
													<div className="relative">
														<FontAwesomeIcon
															icon={faUser}
															className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
														/>
														<input
															type="text"
															placeholder="Enter username"
															name="username"
															className={`w-full pl-10 pr-10 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
																errors.username
																	? "border-red-500 focus:ring-red-400"
																	: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
															} focus:outline-none`}
															value={formData.username}
															onChange={handleUsernameChange}
														/>
														{validatingField === "username" && (
															<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
																<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
															</div>
														)}
													</div>
													{errors.username && (
														<div className="text-red-500 text-xs mt-1">
															{errors.username}
														</div>
													)}
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Phone Number
													</label>
													<div className="relative">
														<FontAwesomeIcon
															icon={faPhone}
															className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
														/>
														<input
															type="text"
															placeholder="Enter phone number"
															name="phone_number"
															className={`w-full pl-10 pr-10 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
																errors.phone_number
																	? "border-red-500 focus:ring-red-400"
																	: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
															} focus:outline-none`}
															value={formData.phone_number}
															onChange={handlePhoneChange}
														/>
														{validatingField === "phone_number" && (
															<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
																<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
															</div>
														)}
													</div>
													{errors.phone_number && (
														<div className="text-red-500 text-xs mt-1">
															{errors.phone_number}
														</div>
													)}
												</div>
											</div>

											{/* Email */}
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
														name="email"
														className={`w-full pl-10 pr-10 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
															errors.email
																? "border-red-500 focus:ring-red-400"
																: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
														} focus:outline-none`}
														value={formData.email}
														onChange={handleEmailChange}
													/>
													{validatingField === "email" && (
														<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
															<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
														</div>
													)}
												</div>
												{errors.email && (
													<div className="text-red-500 text-xs mt-1">
														{errors.email}
													</div>
												)}
											</div>

											{/* Gender and Age Group - Same Row */}
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Gender
													</label>
													<select
														name="gender"
														className={`w-full px-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
															errors.gender
																? "border-red-500 focus:ring-red-400"
																: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
														} focus:outline-none`}
														value={formData.gender}
														onChange={handleChange}
													>
														<option value="" disabled hidden>
															Select gender
														</option>
														{["Male", "Female", "Other"].map((g) => (
															<option key={g} value={g}>
																{g}
															</option>
														))}
													</select>
													{errors.gender && (
														<div className="text-red-500 text-xs mt-1">
															{errors.gender}
														</div>
													)}
												</div>

												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Age Group
													</label>
													<select
														name="age_group_id"
														className={`w-full px-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
															errors.age_group_id
																? "border-red-500 focus:ring-red-400"
																: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
														} focus:outline-none`}
														value={formData.age_group_id}
														onChange={handleChange}
													>
														<option value="" disabled hidden>
															Select age group
														</option>
														{options.age_groups.map((group) => (
															<option key={group.id} value={group.id}>
																{group.name}
															</option>
														))}
													</select>
													{errors.age_group_id && (
														<div className="text-red-500 text-xs mt-1">
															{errors.age_group_id}
														</div>
													)}
												</div>
											</div>
										</div>

										{/* Account Security Section */}
										<div className="space-y-3">
											{/* Password Fields */}
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Password
													</label>
													<div className="relative">
														<input
															type={showPassword ? "text" : "password"}
															placeholder="Enter password"
															name="password"
															className={`w-full px-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
																errors.password
																	? "border-red-500 focus:ring-red-400"
																	: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
															} focus:outline-none`}
															value={formData.password}
															onChange={handleChange}
														/>
														<button
															type="button"
															className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
															onClick={() => setShowPassword(!showPassword)}
														>
															{showPassword ? (
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
													{formData.password && (
														<PasswordStrengthIndicator
															password={formData.password}
														/>
													)}
												</div>

												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Confirm Password
													</label>
													<div className="relative">
														<input
															type={showConfirmPassword ? "text" : "password"}
															placeholder="Confirm password"
															name="password_confirmation"
															className={`w-full px-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
																errors.password_confirmation
																	? "border-red-500 focus:ring-red-400"
																	: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
															} focus:outline-none`}
															value={formData.password_confirmation}
															onChange={handleChange}
														/>
														<button
															type="button"
															className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
															onClick={() =>
																setShowConfirmPassword(!showConfirmPassword)
															}
														>
															{showConfirmPassword ? (
																<EyeSlash size={16} />
															) : (
																<Eye size={16} />
															)}
														</button>
													</div>
													{errors.password_confirmation && (
														<div className="text-red-500 text-xs mt-1">
															{errors.password_confirmation}
														</div>
													)}
												</div>
											</div>
										</div>

										{/* Email Verification Section */}
										<div className="space-y-3">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Email Verification
												</label>
												<div className="flex gap-2">
													<input
														type="text"
														placeholder="Enter OTP code"
														className={`flex-1 px-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
															errors.otp
																? "border-red-500 focus:ring-red-400"
																: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
														} focus:outline-none`}
														value={otpCode}
														onChange={(e) => setOtpCode(e.target.value)}
														disabled={!otpRequested}
													/>
													<button
														type="button"
														onClick={handleRequestOtp}
														disabled={
															requestingOtp ||
															!formData.email ||
															!formData.fullname ||
															errors.email ||
															errors.username ||
															errors.phone_number ||
															validatingField
														}
														className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
															requestingOtp ||
															!formData.email ||
															!formData.fullname ||
															errors.email ||
															errors.username ||
															errors.phone_number ||
															validatingField
																? "bg-gray-300 text-gray-500 cursor-not-allowed"
																: "bg-yellow-500 hover:bg-yellow-600 text-black hover:scale-105"
														}`}
													>
														{requestingOtp
															? "Sending..."
															: otpRequested
															? "Resend OTP"
															: "Send OTP"}
													</button>
												</div>
												{errors.otp && (
													<div className="text-red-500 text-xs mt-1">
														{errors.otp}
													</div>
												)}
												<p className="text-xs text-gray-500 mt-1">
													{otpRequested
														? "OTP sent! Please check your email and enter the code above."
														: "Click 'Send OTP' to receive a verification code at your email address."}
												</p>
											</div>
										</div>

										{/* Terms and Conditions */}
										<div className="flex items-start space-x-3 mt-4">
											<input
												type="checkbox"
												id="terms"
												checked={terms}
												onChange={(e) => setTerms(e.target.checked)}
												className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
											/>
											<label htmlFor="terms" className="text-sm text-gray-600">
												I agree to the{" "}
												<a
													href="/terms-and-conditions"
													target="_blank"
													rel="noopener noreferrer"
													className="text-yellow-600 hover:text-yellow-700 underline"
												>
													Terms and Conditions
												</a>{" "}
												and{" "}
												<a
													href="/privacy"
													target="_blank"
													rel="noopener noreferrer"
													className="text-yellow-600 hover:text-yellow-700 underline"
												>
													Privacy Policy
												</a>
											</label>
										</div>
										{errors.terms && (
											<div className="text-red-500 text-xs mt-1">
												{errors.terms}
											</div>
										)}

										{/* Submit Button */}
										<div className="pt-4">
											<button
												type="submit"
												disabled={
													errors.fullname ||
													errors.username ||
													errors.email ||
													errors.phone_number ||
													errors.gender ||
													errors.age_group_id ||
													errors.password ||
													errors.password_confirmation ||
													errors.otp ||
													errors.terms ||
													submittingSignup ||
													!otpRequested ||
													!terms
												}
												className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform text-sm shadow-md ${
													errors.fullname ||
													errors.username ||
													errors.email ||
													errors.phone_number ||
													errors.gender ||
													errors.age_group_id ||
													errors.password ||
													errors.password_confirmation ||
													errors.otp ||
													errors.terms ||
													submittingSignup ||
													!otpRequested ||
													!terms
														? "bg-gray-300 text-gray-500 cursor-not-allowed"
														: "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black hover:scale-[1.02] hover:shadow-lg"
												}`}
											>
												{submittingSignup
													? "Creating Account..."
													: !otpRequested
													? "Request OTP First"
													: !terms
													? "Accept Terms to Continue"
													: "Create Account"}
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default BuyerSignUpPage;
