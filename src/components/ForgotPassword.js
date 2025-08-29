import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Navbar from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCheckCircle,
	faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { motion, AnimatePresence } from "framer-motion";
import "./LoginForm.css"; // reuse styles from login
import axios from "axios";

const ForgotPassword = () => {
	const [emailOrPhone, setEmailOrPhone] = useState("");
	const [otp, setOtp] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	const handleRequestOtp = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setMessage("");
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/password_resets/request_otp`,
				{
					email: emailOrPhone.trim(),
				}
			);
			setMessage(response.data.message || "OTP sent. Please check your email.");
			setStep(2);
		} catch (err) {
			setError(err.response?.data?.error || "Failed to send OTP.");
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOtp = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setMessage("");
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/password_resets/verify_otp`,
				{
					email: emailOrPhone.trim(),
					otp: otp.trim(),
					new_password: newPassword,
				}
			);
			setMessage(
				response.data.message || "Password reset successful. You can now login."
			);
			setStep(3);
		} catch (err) {
			setError(
				err.response?.data?.error || "Invalid OTP or password reset failed."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Navbar mode="minimal" showSearch={false} showCategories={false} />
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
												<span className="text-white">Carbon</span>
												<span className="text-warning">Cube</span>
											</h2>
											<p className="text-light opacity-75 mt-3">
												Reset your password and get back to trading on the
												Carbon marketplace.
											</p>
										</div>

										<div className="px-2 py-4">
											<h5 className="text-warning mb-3">Secure and Simple</h5>
											<ul className="list-unstyled">
												<li className="mb-2 d-flex align-items-center">
													<span className="me-2 text-warning">✓</span>
													<span className="small">
														OTP-based password reset
													</span>
												</li>
												<li className="mb-2 d-flex align-items-center">
													<span className="me-2 text-warning">✓</span>
													<span className="small">Fast recovery process</span>
												</li>
												<li className="mb-2 d-flex align-items-center">
													<span className="me-2 text-warning">✓</span>
													<span className="small">
														Email or phone verification
													</span>
												</li>
											</ul>
										</div>

										<div className="bg-dark bg-opacity-50 p-3 rounded-3 mt-2">
											<div className="d-flex align-items-center">
												<div className="ms-2">
													<small className="fw-bold">Need Help?</small>
												</div>
											</div>
											<p className="fst-italic small mb-2">
												Contact support@carboncube-ke.com for assistance.
											</p>
										</div>
									</div>
								</Col>

								{/* Right Form Section */}
								<Col lg={8}>
									<div
										className="card-body p-4 p-lg-5 d-flex flex-column justify-content-center"
										style={{ backgroundColor: "#e0e0e0", height: "100%" }}
									>
										<h3 className="fw-bold text-center mb-4">
											Forgot Password
										</h3>

										{error && <Alert variant="danger">{error}</Alert>}
										{message && <Alert variant="success">{message}</Alert>}

										{step === 1 && (
											<Form onSubmit={handleRequestOtp}>
												<Form.Group controlId="emailOrPhone" className="mb-3">
													<Form.Control
														type="text"
														placeholder="Email"
														className="text-center rounded-pill"
														value={emailOrPhone}
														onChange={(e) => setEmailOrPhone(e.target.value)}
														required
													/>
												</Form.Group>
												<Button
													type="submit"
													disabled={loading}
													className="w-100 rounded-pill"
													variant="warning"
												>
													{loading ? "Sending OTP..." : "Send OTP"}
												</Button>
											</Form>
										)}

										{step === 2 && (
											<Form onSubmit={handleVerifyOtp}>
												<Form.Group controlId="otp" className="mb-3">
													<Form.Control
														type="text"
														placeholder="Enter OTP"
														className="text-center rounded-pill"
														value={otp}
														onChange={(e) => setOtp(e.target.value)}
														required
													/>
												</Form.Group>

												<Form.Group
													controlId="newPassword"
													className="mb-3 position-relative"
												>
													<Form.Control
														type={showNewPassword ? "text" : "password"}
														placeholder="New Password"
														className="text-center rounded-pill"
														value={newPassword}
														onChange={(e) => setNewPassword(e.target.value)}
														required
													/>
													<div
														onClick={() => setShowNewPassword(!showNewPassword)}
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
															{showNewPassword ? (
																<motion.span
																	key="hideNew"
																	initial={{ opacity: 0, scale: 0.8 }}
																	animate={{ opacity: 1, scale: 1 }}
																	exit={{ opacity: 0, scale: 0.8 }}
																	transition={{ duration: 0.2 }}
																>
																	<EyeSlash />
																</motion.span>
															) : (
																<motion.span
																	key="showNew"
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
												<Button
													type="submit"
													disabled={loading}
													className="w-100 rounded-pill"
													variant="warning"
												>
													{loading ? "Resetting Password..." : "Reset Password"}
												</Button>
											</Form>
										)}

										{step === 3 && (
											<div className="text-center mt-5">
												<div className="d-inline-block bg-success bg-opacity-10 p-4 rounded-circle shadow-sm">
													<FontAwesomeIcon
														icon={faCheckCircle}
														className="text-success"
														style={{ fontSize: "3rem" }}
													/>
												</div>
												<div className="mt-4">
													<a
														href="/login"
														className="btn btn-warning rounded-pill px-4 shadow-sm "
													>
														<FontAwesomeIcon
															icon={faRightToBracket}
															className="me-2"
														/>{" "}
														Return to Login
													</a>
												</div>
											</div>
										)}
									</div>
								</Col>
							</Row>
						</div>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default ForgotPassword;
