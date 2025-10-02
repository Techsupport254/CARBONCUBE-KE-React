import { useState, useEffect } from "react";
// import { Google, Facebook, Apple, Eye, EyeSlash } from "react-bootstrap-icons";
import { Eye, EyeSlash } from "react-bootstrap-icons";
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
	faUsers,
	faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import PasswordStrengthIndicator from "../../components/PasswordStrengthIndicator";
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
	const [options, setOptions] = useState({
		age_groups: [],
		counties: [],
		sub_counties: [],
	});
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

			// Check if phone number already exists
			if (formData.phone_number && !newErrors.phone_number) {
				const phoneExists = await checkPhoneExists(formData.phone_number);
				if (phoneExists) {
					newErrors.phone_number =
						"This phone number is already registered. Please use a different phone number.";
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

			if (
				formData.password &&
				commonPasswords.includes(formData.password.toLowerCase())
			) {
				newErrors.password =
					"This password is too common. Please choose a more unique password.";
			}

			// Check for repeated characters
			if (formData.password && /(.)\1{3,}/.test(formData.password)) {
				newErrors.password = "Password contains too many repeated characters.";
			}

			// Check for sequential characters
			if (
				formData.password &&
				/(0123456789|abcdefghijklmnopqrstuvwxyz|qwertyuiopasdfghjklzxcvbnm)/i.test(
					formData.password
				)
			) {
				newErrors.password =
					"Password contains sequential characters which are easy to guess.";
			}

			// Check if password contains email or username
			if (
				formData.password &&
				formData.email &&
				formData.password
					.toLowerCase()
					.includes(formData.email.split("@")[0].toLowerCase())
			) {
				newErrors.password = "Password should not contain your email address.";
			}

			if (
				formData.password &&
				formData.username &&
				formData.password
					.toLowerCase()
					.includes(formData.username.toLowerCase())
			) {
				newErrors.password = "Password should not contain your username.";
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
	const [phoneCheckTimeout, setPhoneCheckTimeout] = useState(null);
	const [businessNameCheckTimeout, setBusinessNameCheckTimeout] =
		useState(null);
	const [businessNumberCheckTimeout, setBusinessNumberCheckTimeout] =
		useState(null);

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
		const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
		if (username && !usernameRegex.test(username)) {
			setErrors((prev) => ({
				...prev,
				username:
					"Username must be 3-20 characters and contain only letters, numbers, and underscores (no spaces or hyphens)",
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

	const handleEnterpriseNameChange = async (e) => {
		const enterprise_name = e.target.value;
		handleChange(e);

		// Clear previous enterprise name error
		if (errors.enterprise_name) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors.enterprise_name;
				return newErrors;
			});
		}

		// Clear any existing timeout
		if (businessNameCheckTimeout) {
			clearTimeout(businessNameCheckTimeout);
		}

		// Check if enterprise name exists only when user stops typing (debounced)
		if (enterprise_name && enterprise_name.trim().length >= 2) {
			const timeoutId = setTimeout(async () => {
				const businessNameExists = await checkBusinessNameExists(
					enterprise_name
				);
				if (businessNameExists) {
					setErrors((prev) => ({
						...prev,
						enterprise_name:
							"This business name is already registered. Please choose a different name.",
					}));
				}
			}, 1000); // 1 second after user stops typing

			setBusinessNameCheckTimeout(timeoutId);
		}
	};

	const handleBusinessNumberChange = async (e) => {
		const business_number = e.target.value;
		handleChange(e);

		// Clear previous business number error
		if (errors.business_registration_number) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors.business_registration_number;
				return newErrors;
			});
		}

		// Clear any existing timeout
		if (businessNumberCheckTimeout) {
			clearTimeout(businessNumberCheckTimeout);
		}

		// Check if business number exists only when user stops typing (debounced)
		if (business_number && business_number.trim().length >= 3) {
			const timeoutId = setTimeout(async () => {
				const businessNumberExists = await checkBusinessNumberExists(
					business_number
				);
				if (businessNumberExists) {
					setErrors((prev) => ({
						...prev,
						business_registration_number:
							"This business registration number is already registered. Please use a different number.",
					}));
				}
			}, 1000); // 1 second after user stops typing

			setBusinessNumberCheckTimeout(timeoutId);
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

	// Handle county change - reset sub-county when county changes
	const handleCountyChange = (e) => {
		handleChange(e);
		// Reset sub-county when county changes
		setFormData((prev) => ({
			...prev,
			sub_county_id: "",
		}));
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
			if (phoneCheckTimeout) {
				clearTimeout(phoneCheckTimeout);
			}
			if (businessNameCheckTimeout) {
				clearTimeout(businessNameCheckTimeout);
			}
			if (businessNumberCheckTimeout) {
				clearTimeout(businessNumberCheckTimeout);
			}
		};
	}, [
		emailCheckTimeout,
		usernameCheckTimeout,
		phoneCheckTimeout,
		businessNameCheckTimeout,
		businessNumberCheckTimeout,
	]);

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
					sub_counties: [],
					document_types: documentTypesRes.data, // new
				});
			} catch (error) {
			}
		};

		fetchOptions();
	}, []);

	// Fetch sub-counties when county changes
	useEffect(() => {
		const fetchSubCounties = async () => {
			if (formData.county_id) {
				try {
					const response = await axios.get(
						`${process.env.REACT_APP_BACKEND_URL}/counties/${formData.county_id}/sub_counties`
					);
					setOptions((prev) => ({
						...prev,
						sub_counties: response.data,
					}));
				} catch (error) {
					setOptions((prev) => ({
						...prev,
						sub_counties: [],
					}));
				}
			} else {
				setOptions((prev) => ({
					...prev,
					sub_counties: [],
				}));
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

				// Validate business name and business number uniqueness
				const validationErrors = {};

				// Check business name uniqueness
				if (formData.enterprise_name) {
					const businessNameExists = await checkBusinessNameExists(
						formData.enterprise_name
					);
					if (businessNameExists) {
						validationErrors.enterprise_name =
							"Business name is already registered";
					}
				}

				// Check business registration number uniqueness
				if (formData.business_registration_number) {
					const businessNumberExists = await checkBusinessNumberExists(
						formData.business_registration_number
					);
					if (businessNumberExists) {
						validationErrors.business_registration_number =
							"Business registration number is already registered";
					}
				}

				// If there are validation errors, show them and stop
				if (Object.keys(validationErrors).length > 0) {
					setErrors(validationErrors);
					return;
				}

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
						// Auto-authenticate user after successful signup
						const { token, seller } = response.data;

						// Store token and user data
						localStorage.setItem("token", token);
						localStorage.setItem("userRole", "seller");
						localStorage.setItem("userName", seller.fullname);
						localStorage.setItem("userUsername", seller.username);
						localStorage.setItem("userEmail", seller.email);

						// Trigger authentication update
						window.dispatchEvent(
							new StorageEvent("storage", {
								key: "token",
								newValue: token,
							})
						);

						setAlertModalMessage(
							"Signup successful! You are now logged in to your account."
						);
						setAlertModalConfig({
							icon: "success",
							title: "Success",
							confirmText: "Go to Dashboard",
							cancelText: "",
							showCancel: false,
							onConfirm: () => {
								navigate("/seller/dashboard");
							},
						});
						setShowAlertModal(true);
					}
				}
			} else {
				setErrors({ otp: "Invalid or expired OTP." });
			}
		} catch (err) {

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

			setErrors(serverErrors);
		} finally {
			setVerifyingOtp(false);
			setSubmittingSignup(false);
		}
	};

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
			// If API fails, don't block user - let server validation handle it
			return false;
		}
	};

	const checkBusinessNameExists = async (business_name) => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/business_name/exists`,
				{ business_name: business_name.trim() },
				{
					headers: {
						"Content-Type": "application/json",
					},
					timeout: 5000, // 5 second timeout for lightweight check
				}
			);
			return response.data.exists;
		} catch (error) {
			// If API fails, don't block user - let server validation handle it
			return false;
		}
	};

	const checkBusinessNumberExists = async (business_number) => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/business_number/exists`,
				{ business_number: business_number.trim() },
				{
					headers: {
						"Content-Type": "application/json",
					},
					timeout: 5000, // 5 second timeout for lightweight check
				}
			);
			return response.data.exists;
		} catch (error) {
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
			<div className="login-container min-h-screen flex items-center justify-center px-4 py-8 sm:px-6">
				<div className="w-full max-w-6xl">
					<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
						<div className="flex flex-col lg:flex-row min-h-[700px]">
							{/* Left Branding Section */}
							<div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 flex-col justify-center">
								{/* Header Section */}
								<div className="space-y-3 sm:space-y-4 lg:space-y-4">
									<div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 lg:mb-4">
										<img
											src="/logo.png"
											alt="CarbonCube Logo"
											className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 object-contain"
										/>
										<h2 className="text-lg sm:text-xl font-bold">
											<span className="text-white">arbonCube Seller </span>
											<span className="text-yellow-400">Portal</span>
										</h2>
									</div>
									<p className="text-slate-300 text-sm leading-relaxed mb-8">
										Welcome to CarbonCube - your trusted online marketplace for
										sustainable products and eco-conscious shopping.
									</p>
								</div>

								{/* Features Section */}
								<div className="space-y-8 mt-12">
									<h5 className="text-yellow-400 text-lg font-bold mb-8">
										Why Sell with us?
									</h5>
									<div className="space-y-6">
										<div className="flex items-start space-x-4">
											<div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
												<FontAwesomeIcon
													icon={faUsers}
													className="text-yellow-400 text-base"
												/>
											</div>
											<div>
												<span className="text-slate-300 text-base font-medium block">
													Reach thousands of potential customers
												</span>
												<span className="text-slate-400 text-sm">
													Connect with buyers across Kenya
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
													Boost your business visibility online
												</span>
												<span className="text-slate-400 text-sm">
													Increase your market reach and sales
												</span>
											</div>
										</div>
										<div className="flex items-start space-x-4">
											<div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
												<FontAwesomeIcon
													icon={faFileAlt}
													className="text-yellow-400 text-base"
												/>
											</div>
											<div>
												<span className="text-slate-300 text-base font-medium block">
													Easy-to-use tools to manage your listings
												</span>
												<span className="text-slate-400 text-sm">
													Simple dashboard for product management
												</span>
											</div>
										</div>
										<div className="flex items-start space-x-4">
											<div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
												<FontAwesomeIcon
													icon={faBuilding}
													className="text-yellow-400 text-base"
												/>
											</div>
											<div>
												<span className="text-slate-300 text-base font-medium block">
													Support and resources for business growth
												</span>
												<span className="text-slate-400 text-sm">
													Get help growing your online business
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

							{/* Right Form Section */}
							<div className="w-full lg:w-3/5 bg-white p-8 sm:p-10 lg:p-12 flex items-center">
								<div className="w-full max-w-2xl mx-auto">
									{/* Header Section */}
									<div className="text-center mb-10">
										<h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
											Seller Sign Up
										</h3>
										<p className="text-gray-600 text-base sm:text-lg">
											Create your seller account
										</p>
									</div>

									<form onSubmit={handleSubmit} className="space-y-8">
										{errors.general && (
											<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
												{errors.general}
											</div>
										)}

										{step === 1 && (
											<>
												{/* Step 1 Errors */}
												{/* Personal Information Section */}
												<div className="space-y-8">
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
													<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

													{/* Gender and Age Group - Same Row */}
													<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

												{/* Business Information Section */}
												<div className="space-y-6">
													{/* Enterprise Name and Business Permit - Same Row */}
													<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
																	className={`w-full pl-10 pr-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
																		errors.enterprise_name
																			? "border-red-500 focus:ring-red-400"
																			: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																	} focus:outline-none`}
																	value={formData.enterprise_name}
																	onChange={handleEnterpriseNameChange}
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
																	className={`w-full pl-10 pr-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
																		errors.business_registration_number
																			? "border-red-500 focus:ring-red-400"
																			: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																	} focus:outline-none`}
																	value={formData.business_registration_number}
																	onChange={handleBusinessNumberChange}
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
																className={`w-full pl-10 pr-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
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
														disabled={
															errors.fullname ||
															errors.username ||
															errors.phone_number ||
															errors.email ||
															errors.enterprise_name ||
															errors.location
														}
														className={`w-full font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform text-base shadow-lg ${
															errors.fullname ||
															errors.username ||
															errors.phone_number ||
															errors.email ||
															errors.enterprise_name ||
															errors.location
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
												{/* Location Information Section */}
												<div className="space-y-8">
													{/* County and Sub-County - Same Row */}
													<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																County
															</label>
															<select
																name="county_id"
																className={`w-full px-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
																	errors.county_id
																		? "border-red-500 focus:ring-red-400"
																		: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																} focus:outline-none`}
																value={formData.county_id}
																onChange={handleCountyChange}
															>
																<option value="" disabled hidden>
																	Select County
																</option>
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
																className={`w-full px-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
																	errors.sub_county_id
																		? "border-red-500 focus:ring-red-400"
																		: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
																} focus:outline-none`}
																value={formData.sub_county_id}
																onChange={handleChange}
																disabled={!formData.county_id}
															>
																<option value="" disabled hidden>
																	{!formData.county_id
																		? "Select County First"
																		: "Select Sub-County"}
																</option>
																{options.sub_counties.map((subCounty) => (
																	<option
																		key={subCounty.id}
																		value={subCounty.id}
																	>
																		{subCounty.name}
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

													{/* City and Zip Code - Same Row */}
													<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																City
															</label>
															<input
																type="text"
																placeholder="Enter your city"
																name="city"
																className={`w-full px-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
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
																className={`w-full px-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
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
												</div>

												{/* Document Information Section */}
												<div className="space-y-8">
													<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Document Type (optional)
															</label>
															<select
																name="document_type_id"
																className={`w-full px-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
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
																className={`w-full px-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
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
												<div className="space-y-8">
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
																className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 rounded-xl cursor-pointer transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
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
																className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 rounded-xl cursor-pointer transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
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
													<div className="space-y-8">
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
														</a>{" "}
														and receive SMS/emails.
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
															</a>{" "}
															and receive SMS/emails.
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
														className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
														onClick={prevStep}
													>
														Back
													</button>

													<button
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
															: "Complete Sign Up"}
													</button>
												</div>
											</>
										)}

										{/* <div className="relative my-6">
											<div className="absolute inset-0 flex items-center">
												<div className="w-full border-t border-gray-200"></div>
											</div>
											<div className="relative flex justify-center text-sm">
												<span className="px-4 bg-white text-gray-500">
													or continue with
												</span>
											</div>
										</div> */}

										{/* <div className="flex justify-center space-x-3 mb-6">
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
										</div> */}

										<div className="text-center">
											<p className="text-gray-600 mb-4 text-sm">
												Already have an account?
											</p>
											<Link
												to="/login"
												className="text-yellow-600 hover:text-yellow-700 font-medium text-sm underline transition-colors duration-200"
											>
												Sign in to your account
											</Link>
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
