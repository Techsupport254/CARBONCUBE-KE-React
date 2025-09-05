import React, { useState, useEffect } from "react";
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Alert,
	ProgressBar,
} from "react-bootstrap";
import { Google, Facebook, Apple, Eye, EyeSlash } from "react-bootstrap-icons";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import TopNavbarMinimal from "../../components/TopNavBarMinimal";
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

	// SEO Implementation
	useSEO({
		title: "Buyer Sign Up - Carbon Cube Kenya",
		description:
			"Join Carbon Cube Kenya as a buyer. Create your account to start shopping from verified sellers on Kenya's trusted online marketplace.",
		keywords:
			"buyer signup, join Carbon Cube Kenya, create account, Kenya online shopping, marketplace registration",
		url: "https://carboncube-ke.com/buyer-signup",
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "Buyer Sign Up - Carbon Cube Kenya",
			description: "Create your buyer account on Carbon Cube Kenya",
			url: "https://carboncube-ke.com/buyer-signup",
			mainEntity: {
				"@type": "WebApplication",
				name: "Carbon Cube Kenya Buyer Registration",
				applicationCategory: "BusinessApplication",
				operatingSystem: "Web Browser",
			},
		},
	});

	const nextStep = () => {
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

	// Place this AFTER state declarations
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
			<TopNavbarMinimal />
			<Container fluid className="login-container">
				<Row
					className="justify-content-center align-items-center"
					style={{ minHeight: "100vh" }}
				>
					<Col xs={11} md={10} lg={6}>
						<div className="card border-0 shadow-lg overflow-hidden">
							<Row className="g-0">
								{/* Left Branding Section */}
								<Col lg={4} className="d-none d-lg-block">
									<div
										className="h-100 d-flex flex-column justify-content-between text-white p-4"
										style={{
											background:
												"linear-gradient(135deg, #000000 0%, #111111 50%, #1a1a1a 100%)",
										}}
									>
										<div className="pt-4">
											<h2 className="fw-bold">
												<span className="text-white me-2">Buyer</span>
												<span className="text-warning">Portal</span>
											</h2>
											<p className="text-light opacity-75 mt-3">
												Join to explore a world of eco-friendly products,
												curated just for you.
											</p>
										</div>

										<div className="px-2 py-4">
											<h5 className="text-warning mb-3">Why Shop with us?</h5>
											<ul className="list-unstyled">
												<li className="mb-2 d-flex align-items-center">
													<span className="me-2 text-warning">✓</span>
													<span className="small">
														Wide variety of carbon-conscious products
													</span>
												</li>
												<li className="mb-2 d-flex align-items-center">
													<span className="me-2 text-warning">✓</span>
													<span className="small">
														Verified and trusted local sellers
													</span>
												</li>
												<li className="mb-2 d-flex align-items-center">
													<span className="me-2 text-warning">✓</span>
													<span className="small">Secure and seamless</span>
												</li>
												<li className="mb-2 d-flex align-items-center">
													<span className="me-2 text-warning">✓</span>
													<span className="small">
														Support kenyan economy with every purchase
													</span>
												</li>
											</ul>
										</div>

										<div className="bg-dark bg-opacity-50 p-3 rounded-3 mt-2">
											<div className="d-flex align-items-center">
												{/* <div className="rounded-circle bg-warning" style={{ width: "30px", height: "30px" }}></div> */}
												<div className="ms-2">
													<small className="fw-bold">Vision:</small>
												</div>
											</div>
											<p className="fst-italic small mb-2">
												"To be Kenya’s most trusted and innovative online
												marketplace."
											</p>
										</div>
									</div>
								</Col>

								{/* Right Branding Section */}
								<Col lg={8}>
									<div
										className="card-body p-4 p-lg-5 h-100 d-flex flex-column justify-content-between"
										style={{ backgroundColor: "#e0e0e0" }}
									>
										<h3 className="fw-bold text-center mb-4">Buyer Sign Up</h3>
										<Form onSubmit={handleSubmit}>
											{errors.general && (
												<Alert variant="danger">{errors.general}</Alert>
											)}

											{step === 1 && (
												<>
													<Row>
														<Col md={6}>
															<Form.Group>
																<Form.Control
																	type="text"
																	placeholder="Full Name"
																	name="fullname"
																	className="mb-2 text-center rounded-pill"
																	value={formData.fullname}
																	onChange={handleChange}
																	isInvalid={!!errors.fullname}
																/>
																<Form.Control.Feedback type="invalid">
																	{errors.fullname}
																</Form.Control.Feedback>
															</Form.Group>
														</Col>
														<Col md={6}>
															<Form.Group>
																<Form.Control
																	type="text"
																	placeholder="Username"
																	name="username"
																	className="mb-2 text-center rounded-pill"
																	value={formData.username}
																	onChange={handleChange}
																	isInvalid={!!errors.username}
																/>
																<Form.Control.Feedback type="invalid">
																	{errors.username}
																</Form.Control.Feedback>
															</Form.Group>
														</Col>
													</Row>

													<Row>
														<Col md={12}>
															<Form.Group>
																<Form.Control
																	type="email"
																	placeholder="Email"
																	name="email"
																	className="mb-2 text-center rounded-pill"
																	value={formData.email}
																	onChange={handleChange}
																	isInvalid={!!errors.email}
																/>
																<Form.Control.Feedback type="invalid">
																	{errors.email}
																</Form.Control.Feedback>
															</Form.Group>
														</Col>
													</Row>

													<Row>
														<Col md={6}>
															<Form.Group>
																<Form.Control
																	type="text"
																	placeholder="Phone Number"
																	name="phone_number"
																	className="mb-2 text-center rounded-pill"
																	value={formData.phone_number}
																	onChange={handleChange}
																	isInvalid={!!errors.phone_number}
																/>
																<Form.Control.Feedback type="invalid">
																	{errors.phone_number}
																</Form.Control.Feedback>
															</Form.Group>
														</Col>
														<Col md={6}>
															<Form.Group>
																<Form.Control
																	type="text"
																	placeholder="City"
																	name="city"
																	className="mb-2 text-center rounded-pill"
																	value={formData.city}
																	onChange={handleChange}
																	isInvalid={!!errors.city}
																/>
																<Form.Control.Feedback type="invalid">
																	{errors.city}
																</Form.Control.Feedback>
															</Form.Group>
														</Col>
													</Row>

													<Row>
														<Col xs={6} md={6}>
															<Form.Group>
																<Form.Select
																	name="gender"
																	className="text-center rounded-pill mb-2 rounded-pill"
																	value={formData.gender}
																	onChange={handleChange}
																	isInvalid={!!errors.gender}
																>
																	<option value="" disabled hidden>
																		Gender
																	</option>
																	{["Male", "Female", "Other"].map((g) => (
																		<option key={g} value={g}>
																			{g}
																		</option>
																	))}
																</Form.Select>
																<Form.Control.Feedback type="invalid">
																	{errors.gender}
																</Form.Control.Feedback>
															</Form.Group>
														</Col>
														<Col xs={6} md={6}>
															<Form.Group>
																<Form.Select
																	name="age_group_id"
																	className="text-center rounded-pill mb-2 rounded-pill"
																	value={formData.age_group_id}
																	onChange={handleChange}
																	isInvalid={!!errors.age_group_id}
																>
																	<option value="" disabled hidden>
																		Age Group
																	</option>
																	{options.age_groups.map((group) => (
																		<option key={group.id} value={group.id}>
																			{group.name}
																		</option>
																	))}
																</Form.Select>
																<Form.Control.Feedback type="invalid">
																	{errors.age_group_id}
																</Form.Control.Feedback>
															</Form.Group>
														</Col>
													</Row>

													<div className="d-flex justify-content-center mt-3">
														<Button
														id="step1ContinueBtn"
															variant="dark"
															className="rounded-pill w-75"
															onClick={nextStep}
														>
															Continue
														</Button>
													</div>
												</>
											)}

											{step === 2 && (
												<>
													<Row>
														<Col md={12}>
															<Form.Group className="position-relative">
																<Form.Control
																	type={showPassword ? "text" : "password"}
																	placeholder="Password"
																	name="password"
																	className="mb-2 text-center rounded-pill"
																	value={formData.password}
																	onChange={handleChange}
																	isInvalid={!!errors.password}
																/>
																<Form.Control.Feedback type="invalid">
																	{errors.password}
																</Form.Control.Feedback>
																<div
																	onClick={() => setShowPassword(!showPassword)}
																	style={{
																		position: "absolute",
																		top: "50%",
																		right: "15px",
																		transform: "translateY(-50%)",
																		cursor: "pointer",
																		color: "#6c757d",
																	}}
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
																				<EyeSlash />
																			</motion.span>
																		) : (
																			<motion.span
																				key="showPwd"
																				initial={{ opacity: 0, scale: 0.8 }}
																				animate={{ opacity: 1, scale: 1 }}
																				exit={{ opacity: 0, scale: 0.8 }}
																				transition={{ duration: 0.2 }}
																			>
																				<Eye />
																			</motion.span>
																		)}
																	</AnimatePresence>
																</div>
															</Form.Group>
														</Col>
													</Row>

													<Row>
														<Col md={12}>
															<Form.Group className="position-relative">
																<Form.Control
																	type={
																		showConfirmPassword ? "text" : "password"
																	}
																	placeholder="Confirm Password"
																	name="password_confirmation"
																	className="mb-2 text-center rounded-pill"
																	value={formData.password_confirmation}
																	onChange={handleChange}
																	isInvalid={!!errors.password_confirmation}
																/>
																<Form.Control.Feedback type="invalid">
																	{errors.password_confirmation}
																</Form.Control.Feedback>
																<div
																	onClick={() =>
																		setShowConfirmPassword(!showConfirmPassword)
																	}
																	style={{
																		position: "absolute",
																		top: "50%",
																		right: "15px",
																		transform: "translateY(-50%)",
																		cursor: "pointer",
																		color: "#6c757d",
																	}}
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
																				<EyeSlash />
																			</motion.span>
																		) : (
																			<motion.span
																				key="showConfirm"
																				initial={{ opacity: 0, scale: 0.8 }}
																				animate={{ opacity: 1, scale: 1 }}
																				exit={{ opacity: 0, scale: 0.8 }}
																				transition={{ duration: 0.2 }}
																			>
																				<Eye />
																			</motion.span>
																		)}
																	</AnimatePresence>
																</div>
															</Form.Group>
														</Col>
													</Row>

													<Form.Group className="mb-2">
														<Form.Check
															type="checkbox"
															label="Agree to Terms and Conditions and receive SMS/emails."
															name="terms"
															checked={terms}
															onChange={(e) => setTerms(e.target.checked)}
														/>
														{errors.terms && (
															<div className="text-danger mt-1">
																{errors.terms}
															</div>
														)}
													</Form.Group>

													<Row className="mt-3">
														<Col className="d-flex justify-content-between">
															<Button
																variant="dark"
																className="rounded-pill w-25"
																onClick={prevStep}
															>
																Back
															</Button>
															<Button
																variant="warning"
																type="submit"
																className="rounded-pill w-25"
																disabled={!terms || submittingSignup}
															>
																{submittingSignup
																	? "Sending OTP..."
																	: "Request OTP"}
															</Button>
														</Col>
													</Row>
												</>
											)}

											{step === 3 && (
												<>
													<Form.Group>
														<Form.Control
															type="text"
															placeholder="Enter OTP sent to email"
															name="otp"
															className="mb-2 text-center rounded-pill"
															value={otpCode}
															onChange={(e) => setOtpCode(e.target.value)}
															isInvalid={!!errors.otp}
														/>
														<Form.Control.Feedback type="invalid">
															{errors.otp}
														</Form.Control.Feedback>
													</Form.Group>

													<Form.Group className="mb-2">
														<Form.Check
															type="checkbox"
															label="Agree to Terms and Conditions and receive SMS/emails."
															name="terms"
															checked={terms}
															onChange={(e) => setTerms(e.target.checked)}
														/>
														{errors.terms && (
															<div className="text-danger mt-1">
																{errors.terms}
															</div>
														)}
													</Form.Group>

													<Row className="mt-3">
														<Col className="d-flex justify-content-between">
															<Button
																variant="dark"
																className="rounded-pill w-25"
																onClick={prevStep}
															>
																Back
															</Button>

															<Button
															id="verifyOtpBtn"
																variant="warning"
																className="rounded-pill w-50"
																onClick={verifyOtpCode}
																disabled={
																	!terms ||
																	otpCode.trim().length === 0 ||
																	verifyingOtp
																}
															>
																{verifyingOtp
																	? "Verifying OTP..."
																	: "Verify & Finish Sign Up"}
															</Button>
														</Col>
													</Row>
												</>
											)}

											<div className="divider mt-4">
												<span>or continue with</span>
											</div>

											<div className="d-flex justify-content-around mb-3">
												<Button
													variant="warning rounded-pill"
													className="social-btn"
												>
													<Google size={20} />
												</Button>
												<Button
													variant="warning rounded-pill"
													className="social-btn"
												>
													<Facebook size={20} />
												</Button>
												<Button
													variant="warning rounded-pill"
													className="social-btn"
												>
													<Apple size={20} />
												</Button>
											</div>

											<div className="text-center mt-2">
												Already have an account?{" "}
												<a href="./login" className="login-link">
													Sign In
												</a>
											</div>
										</Form>

										<ProgressBar
											now={Math.round((step / 3) * 100)}
											className=" mt-3 rounded-pill"
											variant="warning"
											style={{ height: "8px" }}
										/>
									</div>
								</Col>
							</Row>
						</div>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default BuyerSignUpPage;
