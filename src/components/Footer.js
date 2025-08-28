import React from "react";
import { Container, Row, Col, Badge, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faLinkedinIn,
	faWhatsapp,
	faInstagram,
	faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import "./Footer.css"; // Assuming you have a CSS file for additional styles

const Footer = () => (
	<footer
		className="text-white position-relative overflow-hidden footer-container"
		style={{ backgroundColor: "#000000" }}
	>
		{/* Subtle background pattern */}
		<div className="position-absolute top-0 start-0 w-100 h-100 opacity-30">
			<div
				style={{
					background:
						"repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,193,7,.5) 35px, rgba(255,193,7,.5) 70px)",
					width: "100%",
					height: "100%",
				}}
			></div>
		</div>

		<div className="position-relative">
			{/* Main Footer Content */}
			<div className="pt-5 pb-4">
				<Container>
					{/* Footer Header */}

					<Row className="g-4 mb-4">
						{/* Shopping Guide */}
						<Col xs={12} md={6} lg={3}>
							<div className="footer-section">
								<div className="d-flex align-items-center mb-3">
									<div
										className="bg-warning rounded-circle p-1 me-2"
										style={{ width: "8px", height: "8px" }}
									></div>
									<h5
										className="text-uppercase fw-bold mb-0"
										style={{ color: "#ffc107", fontSize: "0.95rem" }}
									>
										Shopping Guide
									</h5>
								</div>
								<ul className="list-unstyled footer-links">
									<li className="mb-2">
										<a
											href="/how-to-pay"
											className="text-white text-decoration-none hover-link"
										>
											How Do I Pay?
										</a>
									</li>
									<li className="mb-2">
										<a
											href="/how-to-shop"
											className="text-white text-decoration-none hover-link"
										>
											How Do I Shop?
										</a>
									</li>
									<li className="mb-2">
										<a
											href="/flash-sales"
											className="text-white text-decoration-none hover-link"
										>
											<Badge bg="warning" text="dark" className="me-2 small">
												Hot
											</Badge>
											Flash Sales / Deals
										</a>
									</li>
									<li className="mb-2">
										<a
											href="/about-us"
											className="text-white text-decoration-none hover-link"
										>
											About Us
										</a>
									</li>
								</ul>
							</div>
						</Col>

						{/* Customer Help Center */}
						<Col xs={12} md={6} lg={3}>
							<div className="footer-section">
								<div className="d-flex align-items-center mb-3">
									<div
										className="bg-warning rounded-circle p-1 me-2"
										style={{ width: "8px", height: "8px" }}
									></div>
									<h5
										className="text-uppercase fw-bold mb-0"
										style={{ color: "#ffc107", fontSize: "0.95rem" }}
									>
										Customer Help
									</h5>
								</div>
								<ul className="list-unstyled footer-links">
									<li className="mb-2">
										<a
											href="/dispute-resolution"
											className="text-white text-decoration-none hover-link"
										>
											Dispute Resolution
										</a>
									</li>
									<li className="mb-2">
										<a
											href="/terms-and-conditions"
											className="text-white text-decoration-none hover-link"
										>
											Terms & Conditions
										</a>
									</li>
									{/* <li className="mb-2">
										<a
											href="/faqs"
											className="text-white text-decoration-none hover-link"
										>
											FAQs Center
										</a>
									</li> */}
								</ul>
							</div>
						</Col>

						{/* Business */}
						<Col xs={12} md={6} lg={3}>
							<div className="footer-section">
								<div className="d-flex align-items-center mb-3">
									<div
										className="bg-warning rounded-circle p-1 me-2"
										style={{ width: "8px", height: "8px" }}
									></div>
									<h5
										className="text-uppercase fw-bold mb-0"
										style={{ color: "#ffc107", fontSize: "0.95rem" }}
									>
										Business
									</h5>
								</div>
								<ul className="list-unstyled footer-links">
									<li className="mb-2">
										<a
											href="/become-a-vendor"
											className="text-white text-decoration-none hover-link"
										>
											<Badge bg="success" className="me-2 small">
												New
											</Badge>
											Become a Seller
										</a>
									</li>
									<li className="mb-2">
										<a
											href="/vendor-help"
											className="text-white text-decoration-none hover-link"
										>
											Seller Help Center
										</a>
									</li>
									{/* <li className="mb-2">
										<a
											href="/faqs"
											className="text-white text-decoration-none hover-link"
										>
											Business FAQs
										</a>
									</li> */}
								</ul>
							</div>
						</Col>

						{/* Let's Connect */}
						<Col xs={12} md={6} lg={3}>
							<div className="footer-section">
								<div className="d-flex align-items-center mb-3">
									<div
										className="bg-warning rounded-circle p-1 me-2"
										style={{ width: "8px", height: "8px" }}
									></div>
									<h5
										className="text-uppercase fw-bold mb-0"
										style={{ color: "#ffc107", fontSize: "0.95rem" }}
									>
										Let's Connect
									</h5>
								</div>
								<p className="text-white-50 small mb-3">
									Follow us for updates, deals, and marketplace news
								</p>
								<div className="d-flex flex-wrap gap-2 mb-3">
									<a
										href="https://www.linkedin.com/company/carbon-cube-kenya/?viewAsMember=true"
										target="_blank"
										rel="noopener noreferrer"
										className="social-link bg-primary bg-opacity-20 text-white rounded-circle d-flex align-items-center justify-content-center"
										style={{ width: "40px", height: "40px" }}
									>
										<FontAwesomeIcon icon={faLinkedinIn} size="sm" />
									</a>
									<a
										href="https://wa.me/254712990524"
										target="_blank"
										rel="noopener noreferrer"
										className="social-link bg-success bg-opacity-20 text-white rounded-circle d-flex align-items-center justify-content-center"
										style={{ width: "40px", height: "40px" }}
									>
										<FontAwesomeIcon icon={faWhatsapp} size="sm" />
									</a>
									<a
										href="https://www.instagram.com/carboncube_kenya/"
										target="_blank"
										rel="noopener noreferrer"
										className="social-link bg-danger bg-opacity-20 text-white rounded-circle d-flex align-items-center justify-content-center"
										style={{ width: "40px", height: "40px" }}
									>
										<FontAwesomeIcon icon={faInstagram} size="sm" />
									</a>
									<a
										href="https://www.facebook.com/profile.php?id=61574066312678"
										target="_blank"
										rel="noopener noreferrer"
										className="social-link bg-info bg-opacity-20 text-white rounded-circle d-flex align-items-center justify-content-center"
										style={{ width: "40px", height: "40px" }}
									>
										<FontAwesomeIcon icon={faFacebook} size="sm" />
									</a>
								</div>
								<Button
									variant="outline-warning"
									size="sm"
									className="rounded-pill px-3"
								>
									Newsletter
								</Button>
							</div>
						</Col>
					</Row>

					{/* Newsletter Section */}
					<div className="bg-dark bg-opacity-50 rounded-4 p-4 mb-4">
						<Row className="align-items-center">
							<Col md={8}>
								<h6 className="fw-bold text-warning mb-2">Stay Updated</h6>
								<p className="text-white-50 mb-0 small">
									Get the latest deals, new arrivals, and marketplace updates
									delivered to your inbox
								</p>
							</Col>
							<Col md={4} className="text-md-end mt-3 mt-md-0">
								<Button variant="warning" className="rounded-pill px-4">
									Subscribe Now
								</Button>
							</Col>
						</Row>
					</div>
				</Container>
			</div>

			{/* Footer Bottom */}
			<div className="border-top border-secondary border-opacity-25 py-3">
				<Container>
					<Row className="align-items-center">
						<Col md={6}>
							<div className="text-white small">
								&copy; {new Date().getFullYear()}{" "}
								<span className="text-warning fw-bold">CarbonCube Kenya</span>.
								All rights reserved.
							</div>
						</Col>
						<Col md={6} className="text-md-end mt-2 mt-md-0">
							<div className="d-flex flex-wrap justify-content-md-end gap-3">
								<a
									href="/privacy"
									className="text-white small text-decoration-none hover-link"
								>
									Privacy Policy
								</a>
								<a
									href="/cookies"
									className="text-white small text-decoration-none hover-link"
								>
									Cookies
								</a>
								<a
									href="/sitemap"
									className="text-white small text-decoration-none hover-link"
								>
									Sitemap
								</a>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</div>

		<style>{`
			.hover-link {
				transition: color 0.3s ease, transform 0.2s ease;
			}
			.hover-link:hover {
				color: #ffc107 !important;
				transform: translateX(5px);
			}
			.social-link {
				transition: all 0.3s ease;
				border: 1px solid rgba(255, 255, 255, 0.1);
			}
			.social-link:hover {
				transform: translateY(-2px);
				box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
				border-color: #ffc107;
			}
			.footer-section {
				padding: 1rem;
				border-radius: 8px;
				transition: background-color 0.3s ease;
			}
			.footer-section:hover {
				background-color: rgba(255, 255, 255, 0.02);
			}
		`}</style>
	</footer>
);

export default Footer;
