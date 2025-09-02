import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Google, Facebook, Apple } from "react-bootstrap-icons";
import axios from "axios";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
// import './SellerSignUpPage.css';

function RiderSignUpPage({ onSignup }) {
	const [formData, setFormData] = useState({
		full_name: "",
		phone_number: "",
		date_of_birth: "",
		email: "",
		id_number: "",
		driving_license: "",
		vehicle_type: "",
		license_plate: "",
		physical_address: "",
		gender: "",
		kin_full_name: "",
		kin_relationship: "",
		kin_phone_number: "",
		password: "",
		password_confirmation: "",
	});

	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
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
		if (!validateForm()) {
			return;
		}

		if (!validatePassword()) {
			return;
		}

		try {
			// Form submitted successfully
		} catch (error) {
			// console.error("Error during submission:", error);
		}

		const payload = {
			rider: {
				...formData,
			},
		};

		// Form Data before submission

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/rider/signup`,
				payload,
				{
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				}
			);
			if (response.status === 201) {
				onSignup();
				navigate("/login");
			}
		} catch (err) {
			if (err.response && err.response.data && err.response.data.errors) {
				const serverErrors = {};
				err.response.data.errors.forEach((error) => {
					const [field, message] = error.split(": ");
					serverErrors[field.toLowerCase()] = message;
				});
				setErrors(serverErrors);
			} else {
				setErrors({ general: "Signup failed. Please try again." });
			}
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.terms) {
			newErrors.terms = "You must agree to the terms and conditions.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0; // Return true if no errors
	};

	let datepickerRef;

	return (
		<Container fluid className="p-0 vendor-signup-page">
			<Row className="m-0">
				<Col className="warehouse-bg">
					<Col className="form-container align-items-center center">
						<Container className="d-flex justify-content-center">
							<Col xs={12} sm={10} md={12} lg={10}>
								<h2 className="form-title text-center mb-2">Rider Sign Up</h2>
								<Form onSubmit={handleSubmit}>
									{errors.general && (
										<Alert variant="danger">{errors.general}</Alert>
									)}

									<Row>
										<Col md={12}>
											<Form.Group className="mb-2">
												<Form.Control
													type="text"
													placeholder="Full Name"
													name="full_name"
													className="text-center rounded-pill mb-0"
													value={formData.full_name}
													onChange={handleChange}
													isInvalid={!!errors.full_name}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.full_name}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
									</Row>

									<Row>
										<Col xs={6} md={6}>
											<Form.Group className="mb-2">
												<Form.Control
													type="text"
													placeholder="Phone Number"
													name="phone_number"
													className="text-center rounded-pill mb-0"
													value={formData.phone_number}
													onChange={handleChange}
													isInvalid={!!errors.phone_number}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.phone_number}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
										<Col xs={6} md={6}>
											<Form.Group className="mb-2">
												<div className="position-relative">
													<ReactDatePicker
														ref={(el) => (datepickerRef = el)}
														selected={
															formData.date_of_birth
																? new Date(formData.date_of_birth)
																: null
														}
														onChange={(date) =>
															handleChange({
																target: {
																	name: "date_of_birth",
																	value: date
																		? date.toISOString().split("T")[0]
																		: "",
																},
															})
														}
														className="form-control text-center rounded-pill mb-0 pr-5"
														placeholderText="Date of Birth"
														dateFormat="MM/dd/yyyy"
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
													{errors.date_of_birth && (
														<div className="invalid-feedback">
															{errors.date_of_birth}
														</div>
													)}
												</div>
											</Form.Group>
										</Col>
									</Row>

									<Row>
										<Col md={12}>
											<Form.Group className="mb-2">
												<Form.Control
													type="email"
													placeholder="Email"
													name="email"
													className="text-center rounded-pill mb-0"
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
											<Form.Group className="mb-2">
												<Form.Control
													type="text"
													placeholder="ID Number"
													name="id_number"
													className="text-center rounded-pill mb-0"
													value={formData.id_number}
													onChange={handleChange}
													isInvalid={!!errors.id_number}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.id_number}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
										<Col xs={6} md={6}>
											<Form.Group className="mb-2">
												<Form.Control
													type="text"
													placeholder="Driving License"
													name="driving_license"
													className="text-center rounded-pill mb-0"
													value={formData.driving_license}
													onChange={handleChange}
													isInvalid={!!errors.driving_license}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.driving_license}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
									</Row>

									<Row>
										<Col xs={6} md={6}>
											<Form.Group className="mb-2">
												<Form.Control
													type="text"
													placeholder="Physical Address"
													name="physical_address"
													className="text-center rounded-pill mb-0"
													value={formData.physical_address}
													onChange={handleChange}
													isInvalid={!!errors.physical_address}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.physical_address}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
										<Col xs={6} md={6}>
											<Form.Group className="mb-2">
												<div className="dropdown-container">
													<Form.Control
														as="select"
														name="gender"
														className="text-center rounded-pill mb-0"
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
													</Form.Control>
												</div>
												<Form.Control.Feedback type="invalid">
													{errors.gender}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
									</Row>

									<Row>
										<Col xs={6} md={6}>
											<Form.Group className="mb-2">
												<Form.Control
													type="password"
													placeholder="Password"
													name="password"
													className="text-center rounded-pill mb-0"
													value={formData.password}
													onChange={handleChange}
													isInvalid={!!errors.password}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.password}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
										<Col xs={6} md={6}>
											<Form.Group className="mb-2">
												<Form.Control
													type="password"
													placeholder="Confirm Password"
													name="password_confirmation"
													className="text-center rounded-pill mb-0"
													value={formData.password_confirmation}
													onChange={handleChange}
													isInvalid={!!errors.password_confirmation}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.password_confirmation}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
									</Row>

									<Row className="justify-content-center mb-0">
										<Col md="auto">
											<h5 className="text-center">Vehicle Information</h5>
										</Col>
									</Row>
									<Row>
										<Col xs={6} md={6}>
											<Form.Group className="mb-2">
												<div className="dropdown-container">
													<Form.Control
														as="select"
														name="vehicle_type"
														className="text-center rounded-pill mb-0"
														value={formData.vehicle_type}
														onChange={handleChange}
														isInvalid={!!errors.vehicle_type}
													>
														<option value="" disabled hidden>
															Vehicle Type
														</option>
														{[
															"Motorbike",
															"Tuk-Tuk",
															"Car",
															"Pick-Up",
															"Van",
														].map((type) => (
															<option key={type} value={type}>
																{type}
															</option>
														))}
													</Form.Control>
												</div>
												<Form.Control.Feedback type="invalid">
													{errors.vehicle_type}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
										<Col xs={6} md={6}>
											<Form.Group className="mb-2">
												<Form.Control
													type="text"
													placeholder="License Plate"
													name="license_plate"
													className="text-center rounded-pill mb-0"
													value={formData.license_plate}
													onChange={handleChange}
													isInvalid={!!errors.license_plate}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.license_plate}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
									</Row>

									<Row className="justify-content-center mb-0">
										<Col md="auto">
											<h5 className="text-center">Next of Kin</h5>
										</Col>
									</Row>

									<Row>
										<Col md={12}>
											<Form.Group className="mb-2">
												<Form.Control
													type="text"
													placeholder="Full Name"
													name="kin_full_name"
													className="text-center rounded-pill mb-0"
													value={formData.kin_full_name}
													onChange={handleChange}
													isInvalid={!!errors.kin_full_name}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.kin_full_name}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
									</Row>

									<Row>
										<Col xs={6} md={6}>
											<Form.Group className="mb-2">
												<Form.Control
													type="text"
													placeholder="Phone Number"
													name="kin_phone_number"
													className="text-center rounded-pill mb-0"
													value={formData.kin_phone_number}
													onChange={handleChange}
													isInvalid={!!errors.kin_phone_number}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.kin_phone_number}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
										<Col xs={6} md={6}>
											<Form.Group className="mb-2">
												<div className="dropdown-container">
													<Form.Control
														as="select"
														placeholder="Relationship"
														name="kin_relationship"
														className="text-center rounded-pill mb-0"
														value={formData.kin_relationship}
														onChange={handleChange}
														isInvalid={!!errors.kin_relationship}
													>
														<option value="" disabled hidden>
															Relationship
														</option>
														{[
															"Parent",
															"Sibling",
															"Spouse",
															"Child",
															"Cousin",
															"Uncle",
															"Aunt",
															"Grandparent",
															"Friend",
															"Guardian",
															"Colleague",
														].map((relation) => (
															<option key={relation} value={relation}>
																{relation}
															</option>
														))}
													</Form.Control>
												</div>
												<Form.Control.Feedback type="invalid">
													{errors.kin_relationship}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
									</Row>

									<Form.Group className="mb-2">
										<Form.Switch
											type="checkbox"
											label="Agree to Terms and Conditions and receiving of SMS, emails and promotion notifications."
											name="terms"
											checked={formData.terms || false} // Bind the checkbox to formData
											onChange={(e) =>
												handleChange({
													target: { name: "terms", value: e.target.checked },
												})
											}
											isInvalid={!!errors.terms}
										/>
										<Form.Control.Feedback type="invalid">
											{errors.terms}
										</Form.Control.Feedback>
									</Form.Group>

									<Button
										variant="warning"
										type="submit"
										className="w-100 mb-0 rounded-pill"
										disabled={!formData.terms} // Disable the button until terms are agreed to
									>
										Sign Up
									</Button>

									<div className="divider my-1">
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
							</Col>
						</Container>
					</Col>
				</Col>
			</Row>
		</Container>
	);
}

export default RiderSignUpPage;
