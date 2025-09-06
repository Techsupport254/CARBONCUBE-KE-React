import { useState, useEffect } from "react";
import { Google, Facebook, Apple, Eye, EyeSlash } from "react-bootstrap-icons";
import { motion, AnimatePresence } from "framer-motion";
import AlertModal from "../../components/AlertModal";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faEnvelope,
	faPhone,
	faMapMarkerAlt,
	faBuilding,
	faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../css/SellerSignUpPage.css";
import useSEO from "../../hooks/useSEO";

function SellerSignUpPage({ onSignup }) {
	const [formData, setFormData] = useState({
		fullname: "",
		username: "",
		phone_number: "",
		email: "",
		location: "",
		business_registration_number: "",
		enterprise_name: "",
		password: "",
		password_confirmation: "",
		age_group_id: "",
		gender: "",
		city: "",
		zipcode: "",
		county_id: "",
		sub_county_id: "",
		document_url: null,
		profile_picture: null,
		document_type_id: "",
		document_expiry_date: "",
	});

	const [errors, setErrors] = useState({});
	const [previewURL, setPreviewURL] = useState(null);
	const [profilePreviewURL, setProfilePreviewURL] = useState(null);
	const navigate = useNavigate();
	const [subCounties, setSubCounties] = useState([]);
	const [options, setOptions] = useState({ age_groups: [], counties: [] });
	const [terms, setTerms] = useState(false);
	const [step, setStep] = useState(1);

	// Enhanced SEO Implementation
	useSEO({
		title: "Become a Seller - Carbon Cube Kenya | Start Selling Today",
		description:
			"Join Carbon Cube Kenya as a verified seller and start selling to customers across Kenya. Register your business today and enjoy our secure marketplace platform with seller protection and growth tools.",
		keywords:
			"seller signup, become a seller, Carbon Cube Kenya seller registration, Kenya marketplace seller, online selling, seller registration, verified seller, business registration Kenya",
		url: `${window.location.origin}/seller-signup`,
		type: "website",
		image: "https://carboncube-ke.com/logo.png",
		author: "Carbon Cube Kenya Team",
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "Seller Sign Up - Carbon Cube Kenya",
			description: "Create your seller account on Carbon Cube Kenya",
			url: `${window.location.origin}/seller-signup`,
			mainEntity: {
				"@type": "WebApplication",
				name: "Carbon Cube Kenya Seller Registration",
				applicationCategory: "BusinessApplication",
				operatingSystem: "Web Browser",
				offers: {
					"@type": "Offer",
					price: "0",
					priceCurrency: "KES",
					description: "Free seller registration with verification",
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
						name: "Is seller registration free on Carbon Cube Kenya?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "Yes, creating a seller account on Carbon Cube Kenya is free. We only charge a small commission on successful sales.",
						},
					},
					{
						"@type": "Question",
						name: "What documents do I need to become a seller?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "You need business registration documents, ID, and proof of address. We verify all sellers to ensure quality for buyers.",
						},
					},
					{
						"@type": "Question",
						name: "How long does seller verification take?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "Seller verification typically takes 1-3 business days after submitting all required documents.",
						},
					},
				],
			},
		],
		alternateLanguages: [
			{ lang: "en", url: `${window.location.origin}/seller-signup` },
			{ lang: "sw", url: `${window.location.origin}/sw/seller-signup` },
		],
		customMetaTags: [
			{ name: "signup:type", content: "seller" },
			{ name: "signup:cost", content: "free" },
			{ name: "signup:verification", content: "required" },
			{ name: "signup:commission", content: "small commission on sales" },
			{ property: "og:signup:type", content: "seller" },
			{ property: "og:signup:cost", content: "free" },
			{ property: "og:signup:verification", content: "required" },
			{
				property: "og:signup:commission",
				content: "small commission on sales",
			},
		],
		imageWidth: 1200,
		imageHeight: 630,
		themeColor: "#FFD700",
		viewport:
			"width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes",
		// AI Search Optimization
		aiSearchOptimized: true,
		contentType: "business_registration",
		expertiseLevel: "expert",
		contentDepth: "comprehensive",
		aiFriendlyFormat: true,
		conversationalKeywords: [
			"how to become a seller Carbon Cube Kenya",
			"start selling online Kenya",
			"register business marketplace Kenya",
			"become verified seller Kenya",
			"join Carbon Cube as seller",
			"online selling platform Kenya",
			"business registration marketplace Kenya",
			"start e-commerce business Kenya",
		],
		aiCitationOptimized: true,
	});

	// Pilot phase configuration - can be disabled in production
	const PILOT_PHASE_ENABLED =
		process.env.REACT_APP_PILOT_PHASE_ENABLED !== "false";

	const nextStep = async () => {
		const newErrors = {};

		if (step === 1) {
			const requiredFields = [
				"fullname",
				"username",
				"phone_number",
				"email",
				"gender",
				"age_group_id",
				"enterprise_name",
				// 'business_registration_number',
				"location",
			];

			requiredFields.forEach((field) => {
				if (!formData[field] || formData[field].toString().trim() === "") {
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
		}

		if (step === 2) {
			const requiredFields = [
				"city",
				"zipcode",
				"county_id",
				"sub_county_id",
				// 'document_url',
				// 'profile_picture',
				// 'document_type_id',
				// 'document_expiry_date',
				"password",
				"password_confirmation",
			];

			requiredFields.forEach((field) => {
				if (!formData[field] || formData[field].toString().trim() === "") {
					newErrors[field] = "This field is required";
				}
			});

			if (formData.password && formData.password.length < 8) {
				newErrors.password = "Password must be at least 8 characters long";
			}

			if (formData.password !== formData.password_confirmation) {
				newErrors.password_confirmation = "Passwords do not match";
			}

			if (!terms) {
				newErrors.terms = "You must agree to the terms and conditions.";
			}
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setErrors({});
		setStep((prev) => Math.min(prev + 1, 3));
	};

	const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
	const [showAlertModal, setShowAlertModal] = useState(false);
	const [alertModalMessage, setAlertModalMessage] = useState("");
	const [alertModalConfig, setAlertModalConfig] = useState({
		icon: "info",
		title: "Alert",
		confirmText: "OK",
		cancelText: "Close",
		showCancel: false,
		onConfirm: null,
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [otpCode, setOtpCode] = useState("");
	const [submittingSignup, setSubmittingSignup] = useState(false);
	const [verifyingOtp, setVerifyingOtp] = useState(false);

	const [emailCheckTimeout, setEmailCheckTimeout] = useState(null);
	const [usernameCheckTimeout, setUsernameCheckTimeout] = useState(null);

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

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
		setErrors({
			...errors,
			[name]: null,
		});
	};

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
				const [countiesRes, age_groupRes, documentTypesRes] = await Promise.all(
					[
						axios.get(`${process.env.REACT_APP_BACKEND_URL}/counties`),
						axios.get(`${process.env.REACT_APP_BACKEND_URL}/age_groups`),
						axios.get(`${process.env.REACT_APP_BACKEND_URL}/document_types`), // new
					]
				);

				setOptions({
					age_groups: age_groupRes.data,
					counties: countiesRes.data,
					document_types: documentTypesRes.data, // new
				});
			} catch (error) {
				console.error("Error fetching dropdown options:", error);
			}
		};

		fetchOptions();
	}, []);

	useEffect(() => {
		const fetchSubCounties = async () => {
			if (formData.county_id) {
				try {
					const res = await fetch(
						`${process.env.REACT_APP_BACKEND_URL}/counties/${formData.county_id}/sub_counties`
					);
					const data = await res.json();
					setSubCounties(data);
				} catch (err) {
					console.error("Failed to fetch sub-counties", err);
				}
			} else {
				setSubCounties([]);
			}
		};
		fetchSubCounties();
	}, [formData.county_id]);

	const validatePassword = () => {
		let isValid = true;
		const newErrors = {};

		if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters long";
			isValid = false;
		}

		if (formData.password !== formData.password_confirmation) {
			newErrors.password_confirmation = "Passwords do not match";
			isValid = false;
		}

		setErrors({ ...errors, ...newErrors });
		return isValid;
	};

	// Step 2 submit: send OTP after validating form and password
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		if (step === 2) {
			if (!validatePassword()) return;

			try {
				setSubmittingSignup(true);

				// Send OTP to seller email
				await axios.post(`${process.env.REACT_APP_BACKEND_URL}/email_otps`, {
					email: formData.email,
					fullname: formData.fullname,
				});

				// Note: OTP sent state removed as it was unused
				nextStep(); // go to step 3 (OTP verification)
			} catch (error) {
				setErrors({ email: "Failed to send OTP. Try again later." });
			} finally {
				setSubmittingSignup(false);
			}
			return;
		}

		// Do nothing if step not handled here
	};

	// Verify OTP and finalize seller signup
	const verifyOtpCode = async () => {
		try {
			setVerifyingOtp(true);

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

				const formDataToSend = new FormData();

				Object.entries(formData).forEach(([key, value]) => {
					// Skip empty strings and null values
					if (value === "" || value === null || value === undefined) return;

					// Handle file fields specially
					if (key === "document_url" || key === "profile_picture") {
						// Only append if it's actually a File object
						if (value instanceof File) {
							formDataToSend.append(`seller[${key}]`, value);
						}
						return;
					}

					// Handle optional date fields
					if (key === "document_expiry_date") {
						// Only append if date is actually selected
						if (value && value.trim() !== "") {
							formDataToSend.append(`seller[${key}]`, value);
						}
						return;
					}

					// Handle optional text fields
					if (
						key === "business_registration_number" ||
						key === "document_type_id"
					) {
						// Only append if field has actual content
						if (value && value.toString().trim() !== "") {
							formDataToSend.append(`seller[${key}]`, value);
						}
						return;
					}

					// For all other required fields, append normally
					formDataToSend.append(`seller[${key}]`, value);
					// 👈 nest under 'seller'
				});

				setSubmittingSignup(true);

				const response = await axios.post(
					`${process.env.REACT_APP_BACKEND_URL}/seller/signup`,
					formDataToSend,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);

				if (response.status === 201) {
					const selectedCounty = options.counties.find(
						(county) => String(county.id) === formData.county_id
					);

					const isNairobi = selectedCounty?.county_code === 47;

					// Only show pilot phase notice if pilot phase is enabled and user is not from Nairobi
					if (PILOT_PHASE_ENABLED && !isNairobi) {
						setAlertModalMessage(
							`Thank you for signing up! Carbon Cube Kenya is currently in its pilot phase and only available to sellers based in Nairobi County.<br/><br/>
              You won’t be able to log in just yet, but your account is saved. Once we go public, you’ll be able to log in without registering again.`
						);

						setAlertModalConfig({
							icon: "info",
							title: "Notice",
							confirmText: "OK",
							cancelText: "",
							showCancel: false,
							onConfirm: () => {
								// Note: Pilot notice state removed as it was unused
								navigate("/");
							},
						});
						setShowAlertModal(true);
					} else {
						setAlertModalMessage(
							"Signup successful! You can now log in to your account."
						);
						setAlertModalConfig({
							icon: "success",
							title: "Success",
							confirmText: "Go to Login",
							cancelText: "",
							showCancel: false,
							onConfirm: () => {
								onSignup();
								navigate("/login");
							},
						});
						setShowAlertModal(true);
					}
				}
			} else {
				setErrors({ otp: "Invalid or expired OTP." });
			}
		} catch (err) {
			console.error("Signup error:", err.response?.data || err.message);

			const serverErrors = {};

			if (err.response?.data?.errors) {
				// Rails model validation errors (e.g. { email: ["has already been taken"] })
				Object.entries(err.response.data.errors).forEach(
					([field, messages]) => {
						serverErrors[field] = Array.isArray(messages)
							? messages.join(", ")
							: messages;
					}
				);
			} else if (err.response?.data?.error) {
				// Single string error (e.g. from image or document upload)
				serverErrors.general = err.response.data.error;
			} else if (err.response?.data?.message) {
				// Alternative error message format
				serverErrors.general = err.response.data.message;
			} else {
				serverErrors.general = "An unknown error occurred. Please try again.";
			}

			// Log detailed error for debugging
			console.error("Processed errors:", serverErrors);

			setErrors(serverErrors);
		} finally {
			setVerifyingOtp(false);
			setSubmittingSignup(false);
		}
	};

	const checkEmailExists = async (email) => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/api/email/exists`,
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
				`${process.env.REACT_APP_BACKEND_URL}/api/username/exists`,
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

	const validateForm = () => {
		const newErrors = {};

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
				<div className="w-full max-w-4xl">
					<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
						<div className="flex flex-col lg:flex-row min-h-[600px]">
							{/* Left Branding Section */}
							<div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 flex-col justify-between">
								<div className="pt-2">
									<h2 className="text-2xl font-bold mb-3">
										<span className="text-white">Seller</span>
										<span className="text-yellow-400">Portal</span>
									</h2>
									<p className="text-gray-300 opacity-90 text-xs leading-relaxed">
										Join our growing network of Kenyan businesses and take your
										brand online.
									</p>
								</div>

								<div className="px-1 py-4">
									<h5 className="text-yellow-400 mb-3 text-sm font-semibold">
										Why Sell with us?
									</h5>
									<ul className="space-y-2">
										<li className="flex items-center">
											<span className="mr-2 text-yellow-400 text-xs">✓</span>
											<span className="text-xs text-gray-300">
												Reach thousands of potential customers
											</span>
										</li>
										<li className="flex items-center">
											<span className="mr-3 text-yellow-400 text-sm">✓</span>
											<span className="text-sm text-gray-300">
												Boost your business visibility online
											</span>
										</li>
										<li className="flex items-center">
											<span className="mr-3 text-yellow-400 text-sm">✓</span>
											<span className="text-sm text-gray-300">
												Easy-to-use tools to manage your listings
											</span>
										</li>
										<li className="flex items-center">
											<span className="mr-3 text-yellow-400 text-sm">✓</span>
											<span className="text-sm text-gray-300">
												Support and resources for business growth
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
											Seller Sign Up
										</h3>
										<p className="text-gray-600 text-sm">
											Create your seller account
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
												{(errors.fullname ||
													errors.username ||
													errors.phone ||
													errors.email ||
													errors.enterprise_name ||
													errors.permit_number ||
													errors.address) && (
													<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
														<div className="font-semibold mb-2">
															Please fix the following errors:
														</div>
														<ul className="list-disc list-inside space-y-1">
															{errors.fullname && (
																<li>Full Name: {errors.fullname}</li>
															)}
															{errors.username && (
																<li>Username: {errors.username}</li>
															)}
															{errors.phone && <li>Phone: {errors.phone}</li>}
															{errors.email && <li>Email: {errors.email}</li>}
															{errors.enterprise_name && (
																<li>
																	Enterprise Name: {errors.enterprise_name}
																</li>
															)}
															{errors.permit_number && (
																<li>Permit Number: {errors.permit_number}</li>
															)}
															{errors.address && (
																<li>Address: {errors.address}</li>
															)}
														</ul>
													</div>
												)}
												{/* Personal Information Section */}
												<div className="space-y-6">
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
																className={`w-full pl-10 pr-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
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
																	className={`w-full pl-10 pr-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
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
																	className={`w-full pl-10 pr-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
																		errors.phone_number
																			? "border-red-500 focus:ring-red-400"
																			: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																	} focus:outline-none`}
																	value={formData.phone_number}
																	onChange={handleChange}
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
																className={`w-full pl-10 pr-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
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

													{/* Gender and Age Group - Same Row */}
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Gender
															</label>
															<select
																name="gender"
																className={`w-full px-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
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
																{["Male", "Female", "Other"].map((gender) => (
																	<option key={gender} value={gender}>
																		{gender}
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
																className={`w-full px-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
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

												{/* Business Information Section */}
												<div className="space-y-6">
													{/* Enterprise Name and Business Permit - Same Row */}
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Enterprise Name
															</label>
															<div className="relative">
																<FontAwesomeIcon
																	icon={faBuilding}
																	className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
																/>
																<input
																	type="text"
																	placeholder="Enter enterprise name"
																	name="enterprise_name"
																	className={`w-full pl-10 pr-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
																		errors.enterprise_name
																			? "border-red-500 focus:ring-red-400"
																			: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																	} focus:outline-none`}
																	value={formData.enterprise_name}
																	onChange={handleChange}
																/>
															</div>
															{errors.enterprise_name && (
																<div className="text-red-500 text-xs mt-1">
																	{errors.enterprise_name}
																</div>
															)}
														</div>
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Business Permit Number (optional)
															</label>
															<div className="relative">
																<FontAwesomeIcon
																	icon={faFileAlt}
																	className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
																/>
																<input
																	type="text"
																	placeholder="Enter business permit number"
																	name="business_registration_number"
																	className={`w-full pl-10 pr-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
																		errors.business_registration_number
																			? "border-red-500 focus:ring-red-400"
																			: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																	} focus:outline-none`}
																	value={formData.business_registration_number}
																	onChange={handleChange}
																/>
															</div>
															{errors.business_registration_number && (
																<div className="text-red-500 text-xs mt-1">
																	{errors.business_registration_number}
																</div>
															)}
														</div>
													</div>

													{/* Physical Address */}
													<div>
														<label className="block text-sm font-medium text-gray-700 mb-2">
															Physical Address
														</label>
														<div className="relative">
															<FontAwesomeIcon
																icon={faMapMarkerAlt}
																className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
															/>
															<input
																type="text"
																placeholder="Enter physical address"
																name="location"
																className={`w-full pl-10 pr-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
																	errors.location
																		? "border-red-500 focus:ring-red-400"
																		: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																} focus:outline-none`}
																value={formData.location}
																onChange={handleChange}
															/>
														</div>
														{errors.location && (
															<div className="text-red-500 text-xs mt-1">
																{errors.location}
															</div>
														)}
													</div>
												</div>

												<div className="pt-4">
													<button
														type="button"
														className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] text-sm shadow-md hover:shadow-lg"
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
												{(errors.county ||
													errors.document_type ||
													errors.document_expiry_date ||
													errors.document_url ||
													errors.profile_picture ||
													errors.password ||
													errors.password_confirmation ||
													errors.terms) && (
													<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
														<div className="font-semibold mb-2">
															Please fix the following errors:
														</div>
														<ul className="list-disc list-inside space-y-1">
															{errors.county && (
																<li>County: {errors.county}</li>
															)}
															{errors.document_type && (
																<li>Document Type: {errors.document_type}</li>
															)}
															{errors.document_expiry_date && (
																<li>
																	Document Expiry Date:{" "}
																	{errors.document_expiry_date}
																</li>
															)}
															{errors.document_url && (
																<li>Document Upload: {errors.document_url}</li>
															)}
															{errors.profile_picture && (
																<li>
																	Profile Picture: {errors.profile_picture}
																</li>
															)}
															{errors.password && (
																<li>Password: {errors.password}</li>
															)}
															{errors.password_confirmation && (
																<li>
																	Password Confirmation:{" "}
																	{errors.password_confirmation}
																</li>
															)}
															{errors.terms && <li>Terms: {errors.terms}</li>}
														</ul>
													</div>
												)}
												{/* Location Information Section */}
												<div className="space-y-6">
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																City
															</label>
															<input
																type="text"
																placeholder="Enter your city"
																name="city"
																className={`w-full px-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
																	errors.city
																		? "border-red-500 focus:ring-red-400"
																		: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																} focus:outline-none`}
																value={formData.city}
																onChange={handleChange}
															/>
															{errors.city && (
																<div className="text-red-500 text-xs mt-1">
																	{errors.city}
																</div>
															)}
														</div>
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Zip Code
															</label>
															<input
																type="text"
																placeholder="Enter zip code"
																name="zipcode"
																className={`w-full px-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
																	errors.zipcode
																		? "border-red-500 focus:ring-red-400"
																		: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																} focus:outline-none`}
																value={formData.zipcode}
																onChange={handleChange}
															/>
															{errors.zipcode && (
																<div className="text-red-500 text-xs mt-1">
																	{errors.zipcode}
																</div>
															)}
														</div>
													</div>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																County
															</label>
															<select
																name="county_id"
																className={`w-full px-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
																	errors.county_id
																		? "border-red-500 focus:ring-red-400"
																		: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																} focus:outline-none`}
																value={formData.county_id}
																onChange={handleChange}
															>
																<option value="">Select County</option>
																{options.counties.map((county) => (
																	<option key={county.id} value={county.id}>
																		{county.name}
																	</option>
																))}
															</select>
															{errors.county_id && (
																<div className="text-red-500 text-xs mt-1">
																	{errors.county_id}
																</div>
															)}
														</div>
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Sub-County
															</label>
															<select
																name="sub_county_id"
																className={`w-full px-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
																	errors.sub_county_id
																		? "border-red-500 focus:ring-red-400"
																		: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																} focus:outline-none`}
																value={formData.sub_county_id}
																onChange={handleChange}
																disabled={!formData.county_id}
															>
																<option value="">Select Sub-County</option>
																{subCounties.map((sub) => (
																	<option key={sub.id} value={sub.id}>
																		{sub.name}
																	</option>
																))}
															</select>
															{errors.sub_county_id && (
																<div className="text-red-500 text-xs mt-1">
																	{errors.sub_county_id}
																</div>
															)}
														</div>
													</div>
												</div>

												{/* Document Information Section */}
												<div className="space-y-6">
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Document Type (optional)
															</label>
															<select
																name="document_type_id"
																className={`w-full px-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
																	errors.document_type_id
																		? "border-red-500 focus:ring-red-400"
																		: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																} focus:outline-none`}
																value={formData.document_type_id}
																onChange={handleChange}
															>
																<option value="">
																	Select Document Type (optional)
																</option>
																{options.document_types.map((document_type) => (
																	<option
																		key={document_type.id}
																		value={document_type.id}
																	>
																		{document_type.name}
																	</option>
																))}
															</select>
														</div>
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Document Expiry Date (optional)
															</label>
															<input
																type="date"
																name="document_expiry_date"
																className={`w-full px-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
																	errors.document_expiry_date
																		? "border-red-500 focus:ring-red-400"
																		: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																} focus:outline-none`}
																value={formData.document_expiry_date}
																onChange={handleChange}
															/>
														</div>
													</div>
												</div>

												{/* File Upload Section */}
												<div className="space-y-6">
													{/* Document Upload */}
													<div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
														<label className="block text-sm font-semibold text-gray-700 mb-3">
															Upload Document (optional)
														</label>
														<input
															type="file"
															accept=".pdf, image/jpeg, image/jpg, image/png"
															id="documentUpload"
															onChange={(e) => {
																const file = e.target.files[0];
																if (file) {
																	if (file.size > 5 * 1024 * 1024) {
																		setAlertModalMessage(
																			"The document must be 5MB or smaller."
																		);
																		setAlertModalConfig({
																			icon: "error",
																			title: "Upload Error",
																			confirmText: "OK",
																			showCancel: false,
																			onConfirm: () => setShowAlertModal(false),
																		});
																		setShowAlertModal(true);
																		return;
																	}
																	setFormData({
																		...formData,
																		document_url: file,
																	});
																	const fileURL = URL.createObjectURL(file);
																	setPreviewURL(fileURL);
																}
															}}
															className="hidden"
														/>
														<div className="flex items-center justify-center">
															<label
																htmlFor="documentUpload"
																className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 rounded-xl cursor-pointer transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
															>
																<svg
																	className="w-5 h-5 mr-2"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
																	/>
																</svg>
																Choose Document
															</label>
														</div>

														{formData.document_url && (
															<div className="mt-4 text-center">
																<div className="relative inline-block">
																	<button
																		className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full shadow-lg text-white transition-colors duration-200 text-sm flex items-center justify-center"
																		onClick={() => {
																			setFormData({
																				...formData,
																				document_url: null,
																			});
																			setPreviewURL(null);
																		}}
																	>
																		×
																	</button>

																	{previewURL &&
																	formData.document_url.type.startsWith(
																		"image/"
																	) ? (
																		<img
																			src={previewURL}
																			alt="Document Preview"
																			className="max-w-[200px] rounded-lg border-2 border-gray-300 shadow-md"
																		/>
																	) : (
																		<div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md">
																			<svg
																				className="w-12 h-12 mx-auto text-gray-400 mb-2"
																				fill="none"
																				stroke="currentColor"
																				viewBox="0 0 24 24"
																			>
																				<path
																					strokeLinecap="round"
																					strokeLinejoin="round"
																					strokeWidth={2}
																					d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
																				/>
																			</svg>
																			<a
																				href={previewURL}
																				target="_blank"
																				rel="noopener noreferrer"
																				className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
																			>
																				📄 Preview Document
																			</a>
																		</div>
																	)}
																</div>
															</div>
														)}
													</div>

													{/* Profile Picture Upload */}
													<div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
														<label className="block text-sm font-semibold text-gray-700 mb-3">
															Profile Picture (optional)
														</label>
														<input
															type="file"
															accept="image/jpeg, image/jpg, image/png, image/webp"
															id="profilePictureUpload"
															onChange={(e) => {
																const file = e.target.files[0];
																if (file) {
																	if (file.size > 5 * 1024 * 1024) {
																		setAlertModalMessage(
																			"The profile picture must be 5MB or smaller."
																		);
																		setAlertModalConfig({
																			icon: "error",
																			title: "Upload Error",
																			confirmText: "OK",
																			showCancel: false,
																			onConfirm: () => setShowAlertModal(false),
																		});
																		setShowAlertModal(true);
																		return;
																	}
																	setFormData({
																		...formData,
																		profile_picture: file,
																	});
																	const fileURL = URL.createObjectURL(file);
																	setProfilePreviewURL(fileURL);
																}
															}}
															className="hidden"
														/>
														<div className="flex items-center justify-center">
															<label
																htmlFor="profilePictureUpload"
																className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 rounded-xl cursor-pointer transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
															>
																<svg
																	className="w-5 h-5 mr-2"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
																	/>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
																	/>
																</svg>
																Choose Profile Picture
															</label>
														</div>

														{formData.profile_picture && (
															<div className="mt-4 text-center">
																<div className="relative inline-block">
																	<button
																		className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full shadow-lg text-white transition-colors duration-200 text-sm flex items-center justify-center"
																		onClick={() => {
																			setFormData({
																				...formData,
																				profile_picture: null,
																			});
																			setProfilePreviewURL(null);
																		}}
																	>
																		×
																	</button>

																	<img
																		src={profilePreviewURL}
																		alt="Profile Preview"
																		className="max-w-[200px] rounded-lg border-2 border-gray-300 shadow-md"
																	/>
																</div>
															</div>
														)}
													</div>
												</div>

												{/* Password Fields */}
												<div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
													<h4 className="text-sm font-semibold text-gray-700 mb-4">
														Account Security
													</h4>
													<div className="space-y-6">
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
																				key="hide1"
																				initial={{ opacity: 0, scale: 0.8 }}
																				animate={{ opacity: 1, scale: 1 }}
																				exit={{ opacity: 0, scale: 0.8 }}
																				transition={{ duration: 0.2 }}
																			>
																				<EyeSlash size={16} />
																			</motion.span>
																		) : (
																			<motion.span
																				key="show1"
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
																				key="hide2"
																				initial={{ opacity: 0, scale: 0.8 }}
																				animate={{ opacity: 1, scale: 1 }}
																				exit={{ opacity: 0, scale: 0.8 }}
																				transition={{ duration: 0.2 }}
																			>
																				<EyeSlash size={16} />
																			</motion.span>
																		) : (
																			<motion.span
																				key="show2"
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
												</div>

												{/* Terms and Conditions */}
												<div className="flex items-center pt-1">
													<input
														type="checkbox"
														id="terms2"
														className="mr-2 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400 focus:ring-2"
														checked={terms}
														onChange={(e) => setTerms(e.target.checked)}
													/>
													<label
														htmlFor="terms2"
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

												<div className="flex justify-between gap-4 pt-4">
													<button
														type="button"
														className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
														onClick={prevStep}
													>
														Back
													</button>
													<button
														type="submit"
														disabled={!terms || submittingSignup}
														className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-yellow-300 disabled:to-yellow-400 text-black font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed text-sm shadow-md hover:shadow-lg"
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
												{(errors.otp || errors.terms) && (
													<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
														<div className="font-semibold mb-2">
															Please fix the following errors:
														</div>
														<ul className="list-disc list-inside space-y-1">
															{errors.otp && <li>OTP Code: {errors.otp}</li>}
															{errors.terms && <li>Terms: {errors.terms}</li>}
														</ul>
													</div>
												)}
												{/* OTP Verification Section */}
												<div className="space-y-6">
													<div>
														<label className="block text-sm font-medium text-gray-700 mb-2">
															OTP Code
														</label>
														<input
															type="text"
															placeholder="Enter OTP sent to your email"
															name="otp"
															className={`w-full px-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
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

												<div className="flex justify-between gap-4 pt-4">
													<button
														type="button"
														className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
														onClick={prevStep}
													>
														Back
													</button>

													<button
														type="button"
														className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-yellow-300 disabled:to-yellow-400 text-black font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed text-sm shadow-md hover:shadow-lg"
														onClick={verifyOtpCode}
														disabled={
															!terms ||
															otpCode.trim().length === 0 ||
															verifyingOtp
														}
													>
														{verifyingOtp
															? "Verifying OTP..."
															: "Complete Sign Up"}
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
												className="w-11 h-11 bg-white hover:bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md border border-gray-200"
											>
												<Google size={16} />
											</button>
											<button
												type="button"
												className="w-11 h-11 bg-white hover:bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md border border-gray-200"
											>
												<Facebook size={16} />
											</button>
											<button
												type="button"
												className="w-11 h-11 bg-white hover:bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md border border-gray-200"
											>
												<Apple size={16} />
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

				<AlertModal
					isVisible={showAlertModal}
					message={alertModalMessage}
					onClose={() => setShowAlertModal(false)}
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
}

export default SellerSignUpPage;
