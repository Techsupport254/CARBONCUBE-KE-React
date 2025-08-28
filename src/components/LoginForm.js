import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Google, Facebook, Apple, Eye, EyeSlash } from "react-bootstrap-icons";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TopNavBarMinimal from "./TopNavBarMinimal";
import AlertModal from "../components/AlertModal"; // Import your modal
import "./LoginForm.css";
import useSEO from '../hooks/useSEO';

const LoginForm = ({ onLogin }) => {
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	// const [error, setError] = useState('');  // No longer need inline error state
	const [loading, setLoading] = useState(false);

	// SEO Implementation
	useSEO({
		title: "Login - Carbon Cube Kenya",
		description: "Sign in to your Carbon Cube Kenya account. Access your buyer or seller dashboard on Kenya's trusted online marketplace.",
		keywords: "login Carbon Cube Kenya, sign in, marketplace login, Kenya online shopping, seller login",
		url: "https://carboncube-ke.com/login",
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "Login - Carbon Cube Kenya",
			"description": "Sign in to your Carbon Cube Kenya account",
			"url": "https://carboncube-ke.com/login",
			"mainEntity": {
				"@type": "WebApplication",
				"name": "Carbon Cube Kenya Login",
				"applicationCategory": "BusinessApplication",
				"operatingSystem": "Web Browser"
			}
		}
	});

	// AlertModal states
	const [showAlertModal, setShowAlertModal] = useState(false);
	const [alertModalMessage, setAlertModalMessage] = useState("");
	const [alertModalConfig, setAlertModalConfig] = useState({
		icon: "error",
		title: "Error",
		confirmText: "OK",
		cancelText: "",
		showCancel: false,
		onConfirm: () => setShowAlertModal(false),
	});

	const navigate = useNavigate();

	const handleCloseAlertModal = () => {
		setShowAlertModal(false);
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		// setError('');  // replaced by modal

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/auth/login`,
				{
					identifier,
					password,
				}
			);

			const { token, user } = response.data;
			localStorage.setItem("token", token);
			onLogin(token, user);

			switch (user.role) {
				case "buyer":
					navigate("/buyer/home");
					break;
				case "seller":
					navigate("/seller/ads");
					break;
				case "admin":
					navigate("/admin/analytics");
					break;
				case "sales":
					navigate("/sales/dashboard"); // Adjust this route as needed
					break;
				default:
					// Show modal for unexpected role
					setAlertModalMessage("Unexpected user role.");
					setAlertModalConfig({
						icon: "error",
						title: "Error",
						confirmText: "OK",
						showCancel: false,
						onConfirm: () => setShowAlertModal(false),
					});
					setShowAlertModal(true);
			}
		} catch (error) {
			console.error(error);
			let message = "Network error. Please try again later.";

			if (error.response) {
				const data = error.response.data;
				if (data.errors && Array.isArray(data.errors)) {
					message = data.errors[0];
				} else if (data.message) {
					message = data.message;
				} else {
					message = "Invalid identifier or password";
				}
			}

			// Show modal with error message
			setAlertModalMessage(message);
			setAlertModalConfig({
				icon: "error",
				title: "Login Failed",
				confirmText: "OK",
				showCancel: false,
				onConfirm: () => setShowAlertModal(false),
			});
			setShowAlertModal(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<TopNavBarMinimal />

			<Container fluid className="login-container">
				<Row
					className="justify-content-center align-items-center"
					style={{ minHeight: "100vh" }}
				>
					<Col xs={11} md={10} lg={6} className="mb-4">
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
												Welcome to CarbonCube - your trusted online marketplace.
											</p>
										</div>

										<div className="px-2 py-4">
											<h5 className="text-warning mb-3">Why CarbonCube?</h5>
											<ul className="list-unstyled">
												<li className="mb-2 d-flex align-items-center">
													<span className="me-2 text-warning">✓</span>
													<span className="small">
														Manage carbon product listings
													</span>
												</li>
												<li className="mb-2 d-flex align-items-center">
													<span className="me-2 text-warning">✓</span>
													<span className="small">
														Connect with local sellers
													</span>
												</li>
												<li className="mb-2 d-flex align-items-center">
													<span className="me-2 text-warning">✓</span>
													<span className="small">Real-time deal tracking</span>
												</li>
												<li className="mb-2 d-flex align-items-center">
													<span className="me-2 text-warning">✓</span>
													<span className="small">
														Eco-conscious marketplace
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

								{/* Right Login Form Section */}
								<Col lg={8}>
									<div
										className="card-body p-4 p-lg-5"
										style={{ backgroundColor: "#e0e0e0" }}
									>
										<h3 className="fw-bold text-center mb-4">Sign In</h3>

										<Form onSubmit={handleLogin}>
											<Form.Group controlId="formIdentifier" className="mb-3">
												<Form.Control
													type="text"
													placeholder="Email or Phone Number"
													className="text-center rounded-pill"
													value={identifier}
													onChange={(e) => setIdentifier(e.target.value)}
												/>
											</Form.Group>

											<Form.Group
												controlId="formPassword"
												className="mb-3 position-relative"
											>
												<Form.Control
													type={showPassword ? "text" : "password"}
													placeholder="Password"
													className="text-center rounded-pill"
													value={password}
													onChange={(e) => setPassword(e.target.value)}
												/>
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
																key="hide"
																initial={{ opacity: 0, scale: 0.8 }}
																animate={{ opacity: 1, scale: 1 }}
																exit={{ opacity: 0, scale: 0.8 }}
																transition={{ duration: 0.2 }}
															>
																<EyeSlash />
															</motion.span>
														) : (
															<motion.span
																key="show"
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

											<Row className="mb-3">
												<Col xs="6">
													<Form.Check
														type="checkbox"
														id="rememberMeSwitch"
														label="Remember me"
													/>
												</Col>
												<Col xs="6" className="text-end">
													<Link
														to="/forgot-password"
														className="text-muted"
														style={{ cursor: "pointer" }}
													>
														Forgot Password?
													</Link>
												</Col>
											</Row>

											<Button
												variant="warning"
												type="submit"
												className="w-100 rounded-pill mb-3"
												disabled={loading}
											>
												{loading ? "Signing In..." : "Sign In"}
											</Button>

											<div className="separator my-4 text-center">
												or continue with
											</div>

											<Row className="justify-content-center mb-3">
												<Col xs="auto">
													<Button
														variant="warning"
														className="social-btn rounded-pill"
													>
														<Google size={20} />
													</Button>
												</Col>
												<Col xs="auto">
													<Button
														variant="warning"
														className="social-btn rounded-pill"
													>
														<Facebook size={20} />
													</Button>
												</Col>
												<Col xs="auto">
													<Button
														variant="warning"
														className="social-btn rounded-pill"
													>
														<Apple size={20} />
													</Button>
												</Col>
											</Row>

											<p className="text-center mt-3 mb-2">
												Don't have an account?
											</p>
											<Row className="justify-content-center">
												<Col xs={5} sm={4}>
													<Button
														variant="secondary"
														className="w-100 signup-btn rounded-pill"
														onClick={() => navigate("/buyer-signup")}
													>
														Buyer
													</Button>
												</Col>
												<Col xs={5} sm={4}>
													<Button
														variant="secondary"
														className="w-100 signup-btn rounded-pill"
														onClick={() => navigate("/seller-signup")}
													>
														Seller
													</Button>
												</Col>
											</Row>
										</Form>
									</div>
								</Col>
							</Row>
						</div>
					</Col>
				</Row>

				{/* AlertModal usage */}
				<AlertModal
					isVisible={showAlertModal}
					message={alertModalMessage}
					onClose={handleCloseAlertModal}
					icon={alertModalConfig.icon}
					title={alertModalConfig.title}
					confirmText={alertModalConfig.confirmText}
					cancelText={alertModalConfig.cancelText}
					showCancel={alertModalConfig.showCancel}
					onConfirm={alertModalConfig.onConfirm}
				/>
			</Container>
		</>
	);
};

export default LoginForm;
