import React, { useState, useEffect } from "react";
import { Google, Facebook, Apple, Eye, EyeSlash } from "react-bootstrap-icons";
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
		location: "",
		password: "",
		password_confirmation: "",
		age_group_id: "",
		gender: "",
		city: "",
		zipcode: "",
		income_id: "",
		sector_id: "",
		education_id: "",
		employment_id: "",
		county_id: "", // Add this
		sub_county_id: "",
	});
	const [errors, setErrors] = useState({});
	const [options, setOptions] = useState({ age_groups: [] });
	const navigate = useNavigate();
	const [terms, setTerms] = useState(false);
	const [step, setStep] = useState(1);

	// Enhanced SEO Implementation
	useSEO({
		title: "Join Carbon Cube Kenya - Buyer Registration | Free Sign Up",
		description:
			"Join Carbon Cube Kenya as a buyer and start shopping from verified sellers. Create your free account today and enjoy secure online shopping in Kenya's most trusted marketplace with buyer protection.",
		keywords:
			"buyer signup, join Carbon Cube Kenya, create account, Kenya online shopping, marketplace registration, buyer registration, free signup, verified sellers, secure shopping Kenya",
		url: `${window.location.origin}/buyer-signup`,
		type: "website",
		image: "https://carboncube-ke.com/logo.png",
		author: "Carbon Cube Kenya Team",
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "Buyer Sign Up - Carbon Cube Kenya",
			description: "Create your buyer account on Carbon Cube Kenya",
			url: `${window.location.origin}/buyer-signup`,
			mainEntity: {
				"@type": "WebApplication",
				name: "Carbon Cube Kenya Buyer Registration",
				applicationCategory: "BusinessApplication",
				operatingSystem: "Web Browser",
				offers: {
					"@type": "Offer",
					price: "0",
					priceCurrency: "KES",
					description: "Free buyer registration",
				},
			},
		},
		additionalStructuredData: [
			{
				"@context": "https://schema.org",
				"@type": "FAQPage",
				mainEntity: [
					{
						"@type": "Question",
						name: "Is buyer registration free on Carbon Cube Kenya?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "Yes, creating a buyer account on Carbon Cube Kenya is completely free. You only pay for the products you purchase.",
						},
					},
					{
						"@type": "Question",
						name: "What information do I need to sign up as a buyer?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "You need basic information like your name, email, phone number, and location. We also collect optional demographic information to improve your shopping experience.",
						},
					},
					{
						"@type": "Question",
						name: "Are all sellers verified on Carbon Cube Kenya?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "Yes, all sellers on Carbon Cube Kenya go through a verification process to ensure quality and reliability for buyers.",
						},
					},
				],
			},
		],
		alternateLanguages: [
			{ lang: "en", url: `${window.location.origin}/buyer-signup` },
			{ lang: "sw", url: `${window.location.origin}/sw/buyer-signup` },
		],
		customMetaTags: [
			{ name: "signup:type", content: "buyer" },
			{ name: "signup:cost", content: "free" },
			{ name: "signup:verification", content: "required" },
			{ property: "og:signup:type", content: "buyer" },
			{ property: "og:signup:cost", content: "free" },
			{ property: "og:signup:verification", content: "required" },
		],
		imageWidth: 1200,
		imageHeight: 630,
		themeColor: "#FFD700",
		viewport:
			"width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes",
		// AI Search Optimization
		aiSearchOptimized: true,
		contentType: "registration",
		expertiseLevel: "expert",
		contentDepth: "comprehensive",
		aiFriendlyFormat: true,
		conversationalKeywords: [
			"how to join Carbon Cube Kenya",
			"create buyer account Kenya",
			"sign up for online shopping Kenya",
			"join marketplace Kenya",
			"become a buyer Carbon Cube",
			"register for online shopping Kenya",
			"free buyer registration Kenya",
			"start shopping online Kenya",
		],
		aiCitationOptimized: true,
	});

	const nextStep = async () => {
		const requiredFields = [
			"fullname",
			"username",
			"email",
			"phone_number",
			"city",
			"gender",
			"age_group_id",
		];
		const newErrors = {};

		requiredFields.forEach((field) => {
			if (!formData[field] || formData[field].trim() === "") {
				newErrors[field] = "This field is required";
			}
		});

		// Check if email already exists
		if (formData.email && !newErrors.email) {
			const emailExists = await checkEmailExists(formData.email);
			if (emailExists) {
				newErrors.email =
					"This email is already registered. Please use a different email address.";
			}
		}

		// Check if username already exists
		if (formData.username && !newErrors.username) {
			const usernameExists = await checkUsernameExists(formData.username);
			if (usernameExists) {
				newErrors.username =
					"This username is already taken. Please choose a different username.";
			}
		}

		// Check if phone number already exists
		if (formData.phone_number && !newErrors.phone_number) {
			const phoneExists = await checkPhoneExists(formData.phone_number);
			if (phoneExists) {
				newErrors.phone_number =
					"This phone number is already registered. Please use a different phone number.";
			}
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return; // Stop from going to next step
		}

		setErrors({});
		setStep((prev) => Math.min(prev + 1, 3));
	};

	const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [otpCode, setOtpCode] = useState("");
	const [submittingSignup, setSubmittingSignup] = useState(false);
	const [verifyingOtp, setVerifyingOtp] = useState(false);
	const [emailCheckTimeout, setEmailCheckTimeout] = useState(null);
	const [usernameCheckTimeout, setUsernameCheckTimeout] = useState(null);
	const [phoneCheckTimeout, setPhoneCheckTimeout] = useState(null);

	const checkEmailExists = async (email) => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/email/exists`,
				{ email: email.toLowerCase().trim() },
				{
					headers: {
						"Content-Type": "application/json",
					},
					timeout: 5000, // 5 second timeout for lightweight check
				}
			);
			return response.data.exists;
		} catch (error) {
			console.error("Error checking email:", error);
			// If API fails, don't block user - let server validation handle it
			return false;
		}
	};

	const checkUsernameExists = async (username) => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/username/exists`,
				{ username: username.trim() },
				{
					headers: {
						"Content-Type": "application/json",
					},
					timeout: 5000, // 5 second timeout for lightweight check
				}
			);
			return response.data.exists;
		} catch (error) {
			console.error("Error checking username:", error);
			// If API fails, don't block user - let server validation handle it
			return false;
		}
	};

	const checkPhoneExists = async (phone_number) => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/phone/exists`,
				{ phone_number: phone_number.trim() },
				{
					headers: {
						"Content-Type": "application/json",
					},
					timeout: 5000, // 5 second timeout for lightweight check
				}
			);
			return response.data.exists;
		} catch (error) {
			console.error("Error checking phone number:", error);
			// If API fails, don't block user - let server validation handle it
			return false;
		}
	};

	const handleEmailChange = async (e) => {
		const email = e.target.value;
		handleChange(e);

		// Clear previous email error
		if (errors.email) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors.email;
				return newErrors;
			});
		}

		// Validate email format immediately
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (email && !emailRegex.test(email)) {
			setErrors((prev) => ({
				...prev,
				email: "Please enter a valid email address",
			}));
			return;
		}

		// Clear any existing timeout
		if (emailCheckTimeout) {
			clearTimeout(emailCheckTimeout);
		}

		// Check if email exists only when user stops typing (debounced)
		if (email && emailRegex.test(email) && email.length > 5) {
			const timeoutId = setTimeout(async () => {
				const emailExists = await checkEmailExists(email);
				if (emailExists) {
					setErrors((prev) => ({
						...prev,
						email:
							"This email is already registered. Please use a different email address.",
					}));
				}
			}, 1000); // 1 second after user stops typing

			setEmailCheckTimeout(timeoutId);
		}
	};

	const handleUsernameChange = async (e) => {
		const username = e.target.value;
		handleChange(e);

		// Clear previous username error
		if (errors.username) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors.username;
				return newErrors;
			});
		}

		// Validate username format immediately
		const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
		if (username && !usernameRegex.test(username)) {
			setErrors((prev) => ({
				...prev,
				username:
					"Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens",
			}));
			return;
		}

		// Clear any existing timeout
		if (usernameCheckTimeout) {
			clearTimeout(usernameCheckTimeout);
		}

		// Check if username exists only when user stops typing (debounced)
		if (username && usernameRegex.test(username) && username.length >= 3) {
			const timeoutId = setTimeout(async () => {
				const usernameExists = await checkUsernameExists(username);
				if (usernameExists) {
					setErrors((prev) => ({
						...prev,
						username:
							"This username is already taken. Please choose a different username.",
					}));
				}
			}, 1000); // 1 second after user stops typing

			setUsernameCheckTimeout(timeoutId);
		}
	};

	const handlePhoneChange = async (e) => {
		const phone_number = e.target.value;
		handleChange(e);

		// Clear previous phone number error
		if (errors.phone_number) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors.phone_number;
				return newErrors;
			});
		}

		// Validate phone number format immediately
		const phoneRegex = /^\d{10}$/;
		if (phone_number && !phoneRegex.test(phone_number)) {
			setErrors((prev) => ({
				...prev,
				phone_number: "Phone number must be exactly 10 digits",
			}));
			return;
		}

		// Clear any existing timeout
		if (phoneCheckTimeout) {
			clearTimeout(phoneCheckTimeout);
		}

		// Check if phone number exists only when user stops typing (debounced)
		if (
			phone_number &&
			phoneRegex.test(phone_number) &&
			phone_number.length === 10
		) {
			const timeoutId = setTimeout(async () => {
				const phoneExists = await checkPhoneExists(phone_number);
				if (phoneExists) {
					setErrors((prev) => ({
						...prev,
						phone_number:
							"This phone number is already registered. Please use a different phone number.",
					}));
				}
			}, 1000); // 1 second after user stops typing

			setPhoneCheckTimeout(timeoutId);
		}
	};

	const hasFocusedError = React.useRef(false);

	useEffect(() => {
		if (hasFocusedError.current) return;

		const firstErrorKey = Object.keys(errors)[0];
		if (firstErrorKey) {
			const el = document.querySelector(`[name="${firstErrorKey}"]`);
			if (el && el.scrollIntoView) {
				el.scrollIntoView({ behavior: "smooth", block: "center" });
				el.focus();
				hasFocusedError.current = true; // prevent repeated focusing
			}
		}
	}, [errors]);

	// Reset the focus tracker when form is resubmitted
	useEffect(() => {
		hasFocusedError.current = false;
	}, [step]);

	// Cleanup email and username check timeouts on unmount
	useEffect(() => {
		return () => {
			if (emailCheckTimeout) {
				clearTimeout(emailCheckTimeout);
			}
			if (usernameCheckTimeout) {
				clearTimeout(usernameCheckTimeout);
			}
		};
	}, [emailCheckTimeout, usernameCheckTimeout]);

	useEffect(() => {
		// Fetch options for dropdowns from the API
		const fetchOptions = async () => {
			try {
				const [age_groupRes] = await Promise.all([
					axios.get(`${process.env.REACT_APP_BACKEND_URL}/age_groups`),
				]);
				setOptions({
					age_groups: age_groupRes.data,
				});
			} catch (error) {
				console.error("Error fetching dropdown options:", error);
			}
		};

		fetchOptions();
	}, []);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		// Clear the error for this field when the user starts typing
		setErrors({
			...errors,
			[e.target.name]: null,
		});
	};

	const validatePassword = () => {
		let isValid = true;
		const newErrors = {};

		if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters long";
			isValid = false;
		}

		// Check for common passwords
		const commonPasswords = [
			"password",
			"123456",
			"123456789",
			"qwerty",
			"abc123",
			"password123",
			"admin",
			"12345678",
			"letmein",
			"welcome",
			"monkey",
			"dragon",
			"master",
			"hello",
			"login",
			"passw0rd",
			"123123",
			"welcome123",
			"1234567",
			"12345",
			"1234",
			"111111",
			"000000",
			"1234567890",
		];

		if (commonPasswords.includes(formData.password.toLowerCase())) {
			newErrors.password =
				"This password is too common. Please choose a more unique password.";
			isValid = false;
		}

		// Check for repeated characters
		if (/(.)\1{3,}/.test(formData.password)) {
			newErrors.password = "Password contains too many repeated characters.";
			isValid = false;
		}

		// Check for sequential characters
		if (
			/(0123456789|abcdefghijklmnopqrstuvwxyz|qwertyuiopasdfghjklzxcvbnm)/i.test(
				formData.password
			)
		) {
			newErrors.password =
				"Password contains sequential characters which are easy to guess.";
			isValid = false;
		}

		// Check if password contains email or username
		if (
			formData.email &&
			formData.password
				.toLowerCase()
				.includes(formData.email.split("@")[0].toLowerCase())
		) {
			newErrors.password = "Password should not contain your email address.";
			isValid = false;
		}

		if (
			formData.username &&
			formData.password.toLowerCase().includes(formData.username.toLowerCase())
		) {
			newErrors.password = "Password should not contain your username.";
			isValid = false;
		}

		if (formData.password !== formData.password_confirmation) {
			newErrors.password_confirmation = "Passwords do not match";
			isValid = false;
		}

		setErrors({ ...errors, ...newErrors });
		return isValid;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		if (step === 2) {
			if (!validatePassword()) return;

			try {
				setSubmittingSignup(true); // Start loader

				await axios.post(`${process.env.REACT_APP_BACKEND_URL}/email_otps`, {
					email: formData.email,
					fullname: formData.fullname,
				});

				// Note: OTP sent state removed as it was unused
				nextStep(); // move to step 3
			} catch (error) {
				const serverErrors = {};
				if (error.response?.data?.errors) {
					error.response.data.errors.forEach((err) => {
						if (err.includes("Email has already been taken")) {
							serverErrors.email = "Email has already been taken";
						} else if (err.includes("not found")) {
							serverErrors.email = "Email not found";
						} else {
							serverErrors.email = err;
						}
					});
				} else {
					serverErrors.email = "Failed to send OTP. Try again later.";
				}
				setErrors(serverErrors);
			} finally {
				setSubmittingSignup(false); // Reset loader in both success/failure
			}

			return;
		}
		// If step is not handled, do nothing.
	};

	const verifyOtpCode = async () => {
		try {
			setVerifyingOtp(true); // start loading

			const res = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/email_otps/verify`,
				{
					email: formData.email,
					otp: otpCode,
				}
			);

			if (res.data.verified) {
				// Note: Email verified state removed as it was unused
				setErrors({});

				const cleanedData = Object.fromEntries(
					Object.entries(formData).map(([key, value]) => [
						key,
						value === "" ? null : value,
					])
				);

				const payload = { buyer: cleanedData };
				setSubmittingSignup(true);

				const response = await axios.post(
					`${process.env.REACT_APP_BACKEND_URL}/buyer/signup`,
					payload
				);
				if (response.status === 201) {
					onSignup();
					navigate("/login");
				}
			} else {
				setErrors({ otp: "Invalid or expired OTP." });
			}
		} catch (err) {
			const serverErrors = {};
			if (err.response?.data?.errors) {
				err.response.data.errors.forEach((error) => {
					// Handle different error formats
					if (error.includes("Email has already been taken")) {
						serverErrors.email = "Email has already been taken";
					} else if (error.includes("Username has already been taken")) {
						serverErrors.username = "Username has already been taken";
					} else if (error.includes("Invalid or expired OTP")) {
						serverErrors.otp = "Invalid or expired OTP";
					} else {
						// For other errors, try to extract field and message
						const [field, message] = error.includes(": ")
							? error.split(": ")
							: ["general", error];
						serverErrors[field.toLowerCase()] = message;
					}
				});
			}

			// If we're on step 3, show errors in a general alert since form fields aren't visible
			if (step === 3) {
				if (Object.keys(serverErrors).length === 0) {
					setErrors({
						general: "An error occurred during signup. Please try again.",
					});
				} else {
					// Convert field-specific errors to general error message
					const errorMessages = Object.values(serverErrors).join(", ");
					setErrors({ general: errorMessages });
				}
			} else {
				// For other steps, show field-specific errors
				if (Object.keys(serverErrors).length === 0) {
					setErrors({
						general: "An error occurred during signup. Please try again.",
					});
				} else {
					setErrors(serverErrors);
				}
			}
		} finally {
			setVerifyingOtp(false); // stop loading
			setSubmittingSignup(false);
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (step === 1) {
			const requiredFields = [
				"fullname",
				"username",
				"email",
				"phone_number",
				"city",
				"gender",
				"age_group_id",
			];
			requiredFields.forEach((field) => {
				if (!formData[field]) {
					newErrors[field] = "This field is required";
				}
			});
		}

		if (step === 2) {
			if (!formData.password) {
				newErrors.password = "Password is required";
			}
			if (!formData.password_confirmation) {
				newErrors.password_confirmation = "Please confirm your password";
			}
			if (!terms) {
				newErrors.terms = "You must agree to the terms and conditions.";
			}
		}

		if (step === 3) {
			if (!otpCode.trim()) {
				newErrors.otp = "OTP is required";
			}
			if (!terms) {
				newErrors.terms = "You must agree to the terms and conditions.";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
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
										<span className="text-white">Buyer</span>
										<span className="text-yellow-400">Portal</span>
									</h2>
									<p className="text-gray-300 opacity-90 text-xs leading-relaxed">
										Join to explore a world of eco-friendly products, curated
										just for you.
									</p>
								</div>

								<div className="px-1 py-4">
									<h5 className="text-yellow-400 mb-3 text-sm font-semibold">
										Why Shop with us?
									</h5>
									<ul className="space-y-2">
										<li className="flex items-center">
											<span className="mr-2 text-yellow-400 text-xs">✓</span>
											<span className="text-xs text-gray-300">
												Wide variety of carbon-conscious products
											</span>
										</li>
										<li className="flex items-center">
											<span className="mr-3 text-yellow-400 text-sm">✓</span>
											<span className="text-sm text-gray-300">
												Verified and trusted local sellers
											</span>
										</li>
										<li className="flex items-center">
											<span className="mr-3 text-yellow-400 text-sm">✓</span>
											<span className="text-sm text-gray-300">
												Secure and seamless
											</span>
										</li>
										<li className="flex items-center">
											<span className="mr-3 text-yellow-400 text-sm">✓</span>
											<span className="text-sm text-gray-300">
												Support kenyan economy with every purchase
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

							{/* Right Form Section */}
							<div className="w-full lg:w-3/5 bg-white p-6 sm:p-8 lg:p-10 flex items-center">
								<div className="w-full max-w-md mx-auto">
									{/* Header Section */}
									<div className="text-center mb-8">
										<h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
											Buyer Sign Up
										</h3>
										<p className="text-gray-600 text-sm">
											Create your buyer account
										</p>
									</div>

									<form onSubmit={handleSubmit} className="space-y-6">
										{errors.general && (
											<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
												{errors.general}
											</div>
										)}

										{step === 1 && (
											<>
												{/* Step 1 Errors */}
												{/* Personal Information Section */}
												<div className="space-y-4">
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
																	className={`w-full pl-10 pr-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
																		errors.username
																			? "border-red-500 focus:ring-red-400"
																			: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																	} focus:outline-none`}
																	value={formData.username}
																	onChange={handleUsernameChange}
																/>
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
																	className={`w-full pl-10 pr-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
																		errors.phone_number
																			? "border-red-500 focus:ring-red-400"
																			: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																	} focus:outline-none`}
																	value={formData.phone_number}
																	onChange={handlePhoneChange}
																/>
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
																className={`w-full pl-10 pr-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
																	errors.email
																		? "border-red-500 focus:ring-red-400"
																		: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																} focus:outline-none`}
																value={formData.email}
																onChange={handleEmailChange}
															/>
														</div>
														{errors.email && (
															<div className="text-red-500 text-xs mt-1">
																{errors.email}
															</div>
														)}
													</div>

													{/* City and Gender - Same Row */}
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																City
															</label>
															<div className="relative">
																<FontAwesomeIcon
																	icon={faMapMarkerAlt}
																	className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
																/>
																<input
																	type="text"
																	placeholder="Enter your city"
																	name="city"
																	className={`w-full pl-10 pr-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
																		errors.city
																			? "border-red-500 focus:ring-red-400"
																			: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																	} focus:outline-none`}
																	value={formData.city}
																	onChange={handleChange}
																/>
															</div>
															{errors.city && (
																<div className="text-red-500 text-xs mt-1">
																	{errors.city}
																</div>
															)}
														</div>
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
													</div>

													{/* Age Group */}
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

												<div className="pt-2">
													<button
														id="step1ContinueBtn"
														type="button"
														disabled={
															errors.fullname ||
															errors.username ||
															errors.email ||
															errors.phone_number ||
															errors.city ||
															errors.gender ||
															errors.age_group_id
														}
														className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform text-sm shadow-md ${
															errors.fullname ||
															errors.username ||
															errors.email ||
															errors.phone_number ||
															errors.city ||
															errors.gender ||
															errors.age_group_id
																? "bg-gray-300 text-gray-500 cursor-not-allowed"
																: "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black hover:scale-[1.02] hover:shadow-lg"
														}`}
														onClick={nextStep}
													>
														Continue
													</button>
												</div>
											</>
										)}

										{step === 2 && (
											<>
												{/* Step 2 Errors */}
												{/* Account Security Section */}
												<div className="space-y-4">
													{/* Password Fields */}
													<div className="space-y-4">
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Password
															</label>
															<div className="relative">
																<input
																	type={showPassword ? "text" : "password"}
																	placeholder="Enter your password"
																	name="password"
																	className={`w-full px-4 py-3 text-left rounded-lg border transition-all duration-200 pr-10 text-sm ${
																		errors.password
																			? "border-red-500 focus:ring-red-400"
																			: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																	} focus:outline-none`}
																	value={formData.password}
																	onChange={handleChange}
																/>
																<div
																	onClick={() => setShowPassword(!showPassword)}
																	className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200"
																>
																	<AnimatePresence mode="wait" initial={false}>
																		{showPassword ? (
																			<motion.span
																				key="hidePwd"
																				initial={{ opacity: 0, scale: 0.8 }}
																				animate={{ opacity: 1, scale: 1 }}
																				exit={{ opacity: 0, scale: 0.8 }}
																				transition={{ duration: 0.2 }}
																			>
																				<EyeSlash size={16} />
																			</motion.span>
																		) : (
																			<motion.span
																				key="showPwd"
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
																password={formData.password}
																email={formData.email}
																username={formData.username}
															/>
														</div>

														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Confirm Password
															</label>
															<div className="relative">
																<input
																	type={
																		showConfirmPassword ? "text" : "password"
																	}
																	placeholder="Confirm your password"
																	name="password_confirmation"
																	className={`w-full px-4 py-3 text-left rounded-lg border transition-all duration-200 pr-10 text-sm ${
																		errors.password_confirmation
																			? "border-red-500 focus:ring-red-400"
																			: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																	} focus:outline-none`}
																	value={formData.password_confirmation}
																	onChange={handleChange}
																/>
																<div
																	onClick={() =>
																		setShowConfirmPassword(!showConfirmPassword)
																	}
																	className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200"
																>
																	<AnimatePresence mode="wait" initial={false}>
																		{showConfirmPassword ? (
																			<motion.span
																				key="hideConfirm"
																				initial={{ opacity: 0, scale: 0.8 }}
																				animate={{ opacity: 1, scale: 1 }}
																				exit={{ opacity: 0, scale: 0.8 }}
																				transition={{ duration: 0.2 }}
																			>
																				<EyeSlash size={16} />
																			</motion.span>
																		) : (
																			<motion.span
																				key="showConfirm"
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
															{errors.password_confirmation && (
																<div className="text-red-500 text-xs mt-1">
																	{errors.password_confirmation}
																</div>
															)}
														</div>
													</div>

													{/* Terms and Conditions */}
													<div className="pt-1">
														<div className="flex items-center">
															<input
																type="checkbox"
																id="terms"
																className="mr-2 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400 focus:ring-2"
																checked={terms}
																onChange={(e) => setTerms(e.target.checked)}
															/>
															<label
																htmlFor="terms"
																className="text-sm text-gray-600 cursor-pointer"
															>
																Agree to Terms and Conditions and receive
																SMS/emails.
															</label>
														</div>
														{errors.terms && (
															<div className="text-red-500 text-xs mt-1">
																{errors.terms}
															</div>
														)}
													</div>
												</div>

												<div className="flex justify-between gap-4 pt-2">
													<button
														type="button"
														className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
														onClick={prevStep}
													>
														Back
													</button>
													<button
														type="submit"
														disabled={
															!terms ||
															submittingSignup ||
															errors.password ||
															errors.password_confirmation
														}
														className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform text-sm shadow-md ${
															!terms ||
															submittingSignup ||
															errors.password ||
															errors.password_confirmation
																? "bg-gradient-to-r from-yellow-300 to-yellow-400 text-black scale-100 cursor-not-allowed"
																: "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black hover:scale-[1.02] hover:shadow-lg"
														}`}
													>
														{submittingSignup
															? "Sending OTP..."
															: "Request OTP"}
													</button>
												</div>
											</>
										)}

										{step === 3 && (
											<>
												{/* Step 3 Errors */}
												{/* Email Verification Section */}
												<div className="space-y-4">
													<div>
														<label className="block text-sm font-medium text-gray-700 mb-2">
															OTP Code
														</label>
														<input
															type="text"
															placeholder="Enter OTP sent to your email"
															name="otp"
															className={`w-full px-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
																errors.otp
																	? "border-red-500 focus:ring-red-400"
																	: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
															} focus:outline-none`}
															value={otpCode}
															onChange={(e) => setOtpCode(e.target.value)}
														/>
														{errors.otp && (
															<div className="text-red-500 text-xs mt-1">
																{errors.otp}
															</div>
														)}
													</div>

													<div className="flex items-center pt-1">
														<input
															type="checkbox"
															id="terms3"
															className="mr-2 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400 focus:ring-2"
															checked={terms}
															onChange={(e) => setTerms(e.target.checked)}
														/>
														<label
															htmlFor="terms3"
															className="text-sm text-gray-600 cursor-pointer"
														>
															Agree to Terms and Conditions and receive
															SMS/emails.
														</label>
													</div>
													{errors.terms && (
														<div className="text-red-500 text-xs mt-1">
															{errors.terms}
														</div>
													)}
												</div>

												<div className="flex justify-between gap-4 pt-2">
													<button
														type="button"
														className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
														onClick={prevStep}
													>
														Back
													</button>

													<button
														id="verifyOtpBtn"
														type="button"
														className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform text-sm shadow-md ${
															!terms ||
															otpCode.trim().length === 0 ||
															verifyingOtp ||
															errors.otp
																? "bg-gradient-to-r from-yellow-300 to-yellow-400 text-black scale-100 cursor-not-allowed"
																: "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black hover:scale-[1.02] hover:shadow-lg"
														}`}
														onClick={verifyOtpCode}
														disabled={
															!terms ||
															otpCode.trim().length === 0 ||
															verifyingOtp ||
															errors.otp
														}
													>
														{verifyingOtp
															? "Verifying OTP..."
															: "Verify & Finish Sign Up"}
													</button>
												</div>
											</>
										)}

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
												Already have an account?
											</p>
											<a
												href="./login"
												className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200 text-sm font-medium"
											>
												Sign In
											</a>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-4">
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
							style={{ width: `${Math.round((step / 3) * 100)}%` }}
						></div>
					</div>
				</div>
			</div>
		</>
	);
}

export default BuyerSignUpPage;
