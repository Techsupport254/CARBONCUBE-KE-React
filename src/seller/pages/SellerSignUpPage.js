import { useState, useEffect } from "react";
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
import AlertModal from "../../components/AlertModal";
import axios from "axios";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import TopNavbarMinimal from "../../components/TopNavBarMinimal";
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

	// SEO Implementation
	useSEO({
		title: "Seller Sign Up - Carbon Cube Kenya",
		description:
			"Join Carbon Cube Kenya as a seller. Start selling your products on Kenya's trusted online marketplace with verified buyer protection.",
		keywords:
			"seller signup, become a seller, Carbon Cube Kenya seller registration, Kenya marketplace seller, online selling",
		url: "https://carboncube-ke.com/seller-signup",
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "Seller Sign Up - Carbon Cube Kenya",
			description: "Create your seller account on Carbon Cube Kenya",
			url: "https://carboncube-ke.com/seller-signup",
			mainEntity: {
				"@type": "WebApplication",
				name: "Carbon Cube Kenya Seller Registration",
				applicationCategory: "BusinessApplication",
				operatingSystem: "Web Browser",
			},
		},
	});

	// Pilot phase configuration - can be disabled in production
	const PILOT_PHASE_ENABLED =
		process.env.REACT_APP_PILOT_PHASE_ENABLED !== "false";

	const nextStep = () => {
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
			} else {
				serverErrors.general = "An unknown error occurred. Please try again.";
			}

			setErrors(serverErrors);
		} finally {
			setVerifyingOtp(false);
			setSubmittingSignup(false);
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

	let datepickerRef;

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
											<h2 className="fw-bold d-flex align-items-center">
												<span className="text-white me-2">Seller</span>
												<span className="text-warning">Portal</span>
											</h2>
											<p className="text-light opacity-75 mt-3">
												Join our growing network of Kenyan businesses and take
												your brand online.
											</p>
										</div>

										<div className="px-2 py-4">
											<h5 className="text-warning mb-3">Why Sell with us?</h5>
											<ul className="list-unstyled">
												<li className="mb-2 d-flex align-items-center">
													<span className="me-2 text-warning">✓</span>
													<span className="small">
														Reach thousands of potential customers
													</span>
												</li>
												<li className="mb-2 d-flex align-items-center">
													<span className="me-2 text-warning">✓</span>
													<span className="small">
														Boost your business visibility online
													</span>
												</li>
												<li className="mb-2 d-flex align-items-center">
													<span className="me-2 text-warning">✓</span>
													<span className="small">
														Easy-to-use tools to manage your listings
													</span>
												</li>
												<li className="mb-2 d-flex align-items-center">
													<span className="me-2 text-warning">✓</span>
													<span className="small">
														Support and resources for business growth
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
										<h3 className="fw-bold text-center mb-4">Seller Sign Up</h3>
										<Form onSubmit={handleSubmit}>
											{errors.general && (
												<Alert variant="danger">{errors.general}</Alert>
											)}

											{step === 1 && (
												<>
													<Row>
														<Col xs={6} md={6}>
															<Form.Group>
																<Form.Control
																	type="text"
																	placeholder="Full Name"
																	name="fullname"
																	id="button"
																	className="mb-2 text-center"
																	value={formData.fullname}
																	onChange={handleChange}
																	isInvalid={!!errors.fullname}
																/>
																<Form.Control.Feedback type="invalid">
																	{errors.fullname}
																</Form.Control.Feedback>
															</Form.Group>
														</Col>
														<Col xs={6} md={6}>
															<Form.Group>
																<Form.Control
																	type="text"
																	placeholder="Username"
																	name="username"
																	id="button"
																	className="mb-2 text-center"
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
														<Col md={6}>
															<Form.Group>
																<Form.Control
																	type="text"
																	placeholder="Phone Number"
																	name="phone_number"
																	id="button"
																	className="mb-2 text-center"
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
																	type="email"
																	placeholder="Email"
																	name="email"
																	id="button"
																	className="mb-2 text-center"
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
														<Col xs={6} md={6}>
															<Form.Group>
																<Form.Select
																	as="select"
																	name="gender"
																	className="text-center rounded-pill mb-2"
																	value={formData.gender}
																	onChange={handleChange}
																	isInvalid={!!errors.gender}
																>
																	<option value="" disabled hidden>
																		Gender
																	</option>
																	{["Male", "Female", "Other"].map((gender) => (
																		<option key={gender} value={gender}>
																			{gender}
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

													<Row>
														<Col xs={12} md={12}>
															<Form.Group>
																<Form.Control
																	type="text"
																	placeholder="Enterprise Name"
																	name="enterprise_name"
																	id="button"
																	className="mb-2 text-center"
																	value={formData.enterprise_name}
																	onChange={handleChange}
																	//isInvalid={!!errors.enterprise_name}
																/>
																<Form.Control.Feedback type="invalid">
																	{errors.enterprise_name}
																</Form.Control.Feedback>
															</Form.Group>
														</Col>
														<Col xs={12} md={12}>
															<Form.Group>
																<Form.Control
																	type="text"
																	placeholder="Business Permit Number (optional)"
																	name="business_registration_number"
																	id="button"
																	className="mb-2 text-center"
																	value={formData.business_registration_number}
																	onChange={handleChange}
																	//isInvalid={!!errors.business_registration_number}
																/>
																<Form.Control.Feedback type="invalid">
																	{errors.business_registration_number}
																</Form.Control.Feedback>
															</Form.Group>
														</Col>
													</Row>

													<Row>
														<Col md={12}>
															<Form.Group>
																<Form.Control
																	type="text"
																	placeholder="Physical Address"
																	name="location"
																	id="button"
																	className="mb-2 text-center"
																	value={formData.location}
																	onChange={handleChange}
																	isInvalid={!!errors.location}
																/>
																<Form.Control.Feedback type="invalid">
																	{errors.location}
																</Form.Control.Feedback>
															</Form.Group>
														</Col>
													</Row>

													<div className="d-flex justify-content-center mt-3">
														<Button
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
														<Col xs={6} md={6}>
															<Form.Group>
																<Form.Control
																	type="text"
																	placeholder="City"
																	name="city"
																	id="button"
																	className="mb-2 text-center"
																	value={formData.city}
																	onChange={handleChange}
																	isInvalid={!!errors.city}
																/>
																<Form.Control.Feedback type="invalid">
																	{errors.city}
																</Form.Control.Feedback>
															</Form.Group>
														</Col>
														<Col xs={6} md={6}>
															<Form.Group>
																<Form.Control
																	type="text"
																	placeholder="Zip Code"
																	name="zipcode"
																	id="button"
																	className="mb-2 text-center"
																	value={formData.zipcode}
																	onChange={handleChange}
																	isInvalid={!!errors.zipcode}
																/>
																<Form.Control.Feedback type="invalid">
																	{errors.zipcode}
																</Form.Control.Feedback>
															</Form.Group>
														</Col>
													</Row>

													<Row>
														<Col xs={6}>
															<Form.Group>
																<Form.Select
																	name="county_id"
																	value={formData.county_id}
																	id="button"
																	onChange={handleChange}
																	className="mb-2 text-center"
																	isInvalid={!!errors.county_id}
																>
																	<option value="">Select County</option>
																	{options.counties.map((county) => (
																		<option key={county.id} value={county.id}>
																			{county.name}
																		</option>
																	))}
																</Form.Select>
																<Form.Control.Feedback type="invalid">
																	{errors.county_id}
																</Form.Control.Feedback>
															</Form.Group>
														</Col>
														<Col xs={6}>
															<Form.Group>
																<Form.Select
																	name="sub_county_id"
																	value={formData.sub_county_id}
																	onChange={handleChange}
																	className="mb-2 text-center"
																	id="button"
																	isInvalid={!!errors.sub_county_id}
																	disabled={!formData.county_id}
																>
																	<option value="">Select Sub-County</option>
																	{subCounties.map((sub) => (
																		<option key={sub.id} value={sub.id}>
																			{sub.name}
																		</option>
																	))}
																</Form.Select>
																<Form.Control.Feedback type="invalid">
																	{errors.sub_county_id}
																</Form.Control.Feedback>
															</Form.Group>
														</Col>
													</Row>

													<Row>
														<Col xs={6}>
															<Form.Group>
																<Form.Select
																	name="document_type_id"
																	value={formData.document_type_id}
																	id="button"
																	onChange={handleChange}
																	className="mb-2 text-center"
																	isInvalid={!!errors.document_type_id}
																>
																	<option value="">
																		Select Document Type (optional)
																	</option>
																	{options.document_types.map(
																		(document_type) => (
																			<option
																				key={document_type.id}
																				value={document_type.id}
																			>
																				{document_type.name}
																			</option>
																		)
																	)}
																</Form.Select>
																{/* <Form.Control.Feedback type="invalid">{errors.document_type_id}</Form.Control.Feedback> */}
															</Form.Group>
														</Col>

														<Col xs={6} md={6}>
															<Form.Group className="mb-2">
																<div className="position-relative">
																	<ReactDatePicker
																		ref={(el) => (datepickerRef = el)}
																		selected={
																			formData.document_expiry_date
																				? new Date(
																						formData.document_expiry_date
																				  )
																				: null
																		}
																		onChange={(date) =>
																			handleChange({
																				target: {
																					name: "document_expiry_date",
																					value: date
																						? date.toISOString().split("T")[0]
																						: "",
																				},
																			})
																		}
																		className="form-control text-center rounded-pill mb-0 pr-5"
																		placeholderText="Document Expiry Date"
																		dateFormat="yyyy/MM/dd"
																		showMonthDropdown
																		showYearDropdown
																		dropdownMode="select"
																	/>
																	<div
																		onClick={() => datepickerRef.setOpen(true)}
																		style={{
																			position: "absolute",
																			top: "50%",
																			right: "10px",
																			transform: "translateY(-50%)",
																			cursor: "pointer",
																		}}
																	>
																		<FontAwesomeIcon
																			icon={faCalendarAlt}
																			style={{
																				color: "#aaa",
																			}}
																		/>
																	</div>
																	{/* {errors.document_expiry_date && (
                                    <div className="invalid-feedback">{errors.document_expiry_date}</div>
                                  )} */}
																</div>
															</Form.Group>
														</Col>
													</Row>

													<Row className="mb-2">
														{/* Document Upload */}
														<Col md={6}>
															<motion.div
																initial={{ opacity: 0, y: 20 }}
																animate={{ opacity: 1, y: 0 }}
																transition={{ duration: 0.5, ease: "easeOut" }}
															>
																<Form.Group controlId="businessPermit">
																	<Form.Label className="fw-bold text-center d-block">
																		Upload Document (optional)
																	</Form.Label>

																	<Form.Control
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
																						onConfirm: () =>
																							setShowAlertModal(false),
																					});
																					setShowAlertModal(true);
																					return;
																				}
																				setFormData({
																					...formData,
																					document_url: file,
																				});
																				const fileURL =
																					URL.createObjectURL(file);
																				setPreviewURL(fileURL);
																			}
																		}}
																		style={{ display: "none" }}
																		//isInvalid={!!errors.document_url}
																	/>
																	<Form.Control.Feedback type="invalid">
																		{errors.document_url}
																	</Form.Control.Feedback>

																	<div className="text-center">
																		<label
																			htmlFor="documentUpload"
																			className="btn btn-warning rounded-pill px-4"
																		>
																			📎 Choose Document
																		</label>
																	</div>

																	{formData.document_url && (
																		<div className="text-center mt-1">
																			<div className="position-relative d-inline-block">
																				<Button
																					variant="white"
																					size="sm"
																					className="position-absolute top-0 start-0 m-1 p-1 rounded-circle shadow-sm"
																					style={{
																						zIndex: 2,
																						width: "22px",
																						height: "22px",
																						fontSize: "12px",
																						lineHeight: "1",
																					}}
																					onClick={() => {
																						setFormData({
																							...formData,
																							document_url: null,
																						});
																						setPreviewURL(null);
																					}}
																				>
																					❌
																				</Button>

																				{previewURL &&
																				formData.document_url.type.startsWith(
																					"image/"
																				) ? (
																					<img
																						src={previewURL}
																						alt="Document Preview"
																						style={{
																							maxWidth: "150px",
																							borderRadius: "8px",
																							border: "1px solid #ccc",
																						}}
																					/>
																				) : (
																					<a
																						href={previewURL}
																						target="_blank"
																						rel="noopener noreferrer"
																						className="text-primary d-inline-block"
																					>
																						📄 Preview Document
																					</a>
																				)}
																			</div>
																		</div>
																	)}
																</Form.Group>
															</motion.div>
														</Col>

														{/* Profile Picture Upload */}
														<Col md={6}>
															<motion.div
																initial={{ opacity: 0, y: 20 }}
																animate={{ opacity: 1, y: 0 }}
																transition={{ duration: 0.5, ease: "easeOut" }}
															>
																<Form.Group controlId="profilePicture">
																	<Form.Label className="fw-bold text-center d-block">
																		Profile Picture (optional)
																	</Form.Label>

																	<Form.Control
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
																						onConfirm: () =>
																							setShowAlertModal(false),
																					});
																					setShowAlertModal(true);
																					return;
																				}
																				setFormData({
																					...formData,
																					profile_picture: file,
																				});
																				const fileURL =
																					URL.createObjectURL(file);
																				setProfilePreviewURL(fileURL);
																			}
																		}}
																		style={{ display: "none" }}
																		//isInvalid={!!errors.profile_picture}
																	/>
																	<Form.Control.Feedback type="invalid">
																		{errors.profile_picture}
																	</Form.Control.Feedback>

																	<div className="text-center">
																		<label
																			htmlFor="profilePictureUpload"
																			className="btn btn-warning rounded-pill px-4"
																		>
																			📷 Choose Profile Picture
																		</label>
																	</div>

																	{formData.profile_picture && (
																		<div className="text-center mt-1 ">
																			<div className="position-relative d-inline-block">
																				<Button
																					variant="white"
																					size="sm"
																					className="position-absolute top-0 start-0 m-1 p-1 rounded-circle shadow-sm"
																					style={{
																						zIndex: 2,
																						width: "22px",
																						height: "22px",
																						fontSize: "12px",
																						lineHeight: "1",
																					}}
																					onClick={() => {
																						setFormData({
																							...formData,
																							profile_picture: null,
																						});
																						setProfilePreviewURL(null);
																					}}
																				>
																					❌
																				</Button>

																				<img
																					src={profilePreviewURL}
																					alt="Profile Preview"
																					style={{
																						maxWidth: "150px",
																						borderRadius: "8px",
																						border: "1px solid #ccc",
																					}}
																				/>
																			</div>
																		</div>
																	)}
																</Form.Group>
															</motion.div>
														</Col>
													</Row>

													<Row>
														<Col md={6}>
															<Form.Group className="position-relative">
																<Form.Control
																	type={showPassword ? "text" : "password"}
																	placeholder="Password"
																	name="password"
																	id="button"
																	className=" text-center rounded-pill mb-2"
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
																				key="hide1"
																				initial={{ opacity: 0, scale: 0.8 }}
																				animate={{ opacity: 1, scale: 1 }}
																				exit={{ opacity: 0, scale: 0.8 }}
																				transition={{ duration: 0.2 }}
																			>
																				<EyeSlash />
																			</motion.span>
																		) : (
																			<motion.span
																				key="show1"
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

														<Col md={6}>
															<Form.Group className="position-relative">
																<Form.Control
																	type={
																		showConfirmPassword ? "text" : "password"
																	}
																	placeholder="Confirm Password"
																	name="password_confirmation"
																	id="button"
																	className="mb-2 text-center"
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
																				key="hide2"
																				initial={{ opacity: 0, scale: 0.8 }}
																				animate={{ opacity: 1, scale: 1 }}
																				exit={{ opacity: 0, scale: 0.8 }}
																				transition={{ duration: 0.2 }}
																			>
																				<EyeSlash />
																			</motion.span>
																		) : (
																			<motion.span
																				key="show2"
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

											<div className="divider">
												<span>or continue with</span>
											</div>

											<div className="d-flex justify-content-around">
												<Button
													variant="warning rounded-pill"
													className="social-btn"
												>
													<Google size={25} />
												</Button>
												<Button
													variant="warning rounded-pill"
													className="social-btn"
												>
													<Facebook size={25} />
												</Button>
												<Button
													variant="warning rounded-pill"
													className="social-btn"
												>
													<Apple size={25} />
												</Button>
											</div>

											<div className="text-center mt-2">
												Already have an account?{" "}
												<a href="./login" className="login-link">
													Sign In
												</a>
											</div>
										</Form>

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

export default SellerSignUpPage;
