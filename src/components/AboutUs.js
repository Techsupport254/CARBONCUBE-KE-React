import React from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import {
	Lock,
	Robot,
	CheckCircle,
	Shop,
	Award,
	Person,
	GraphUp,
	Shield,
} from "react-bootstrap-icons";
import TopNavBarMinimal from "./TopNavBarMinimal";
import Footer from "./Footer";
import AboutUsImage from "./assets/about-us.jpg";
import "./AboutUs.css"; // Assuming you have a CSS file for custom styles
import useSEO from "../hooks/useSEO";

const AboutUs = () => {
	// SEO Implementation
	useSEO({
		title: "About Us - Carbon Cube Kenya",
		description:
			"Learn about Carbon Cube Kenya, Kenya's trusted digital marketplace. Discover our mission to connect verified sellers with buyers through secure, AI-powered tools.",
		keywords:
			"about Carbon Cube Kenya, Kenya marketplace, digital procurement, verified sellers, AI-powered marketplace",
		url: "https://carboncube-ke.com/about-us",
		structuredData: {
			"@context": "https://schema.org",
			"@type": "Organization",
			name: "Carbon Cube Kenya",
			description:
				"Kenya's trusted digital marketplace connecting verified sellers with buyers",
			url: "https://carboncube-ke.com",
			logo: "https://carboncube-ke.com/logo.png",
			sameAs: [
				"https://www.linkedin.com/company/carbon-cube-kenya/?viewAsMember=true",
				"https://www.facebook.com/profile.php?id=61574066312678",
				"https://www.instagram.com/carboncube_kenya/",
			],
			contactPoint: {
				"@type": "ContactPoint",
				contactType: "customer service",
				availableLanguage: "English",
				areaServed: "KE",
			},
			address: {
				"@type": "PostalAddress",
				addressCountry: "KE",
			},
		},
	});

	return (
		<>
			<TopNavBarMinimal />

			{/* Add padding-top to prevent navbar overlay */}

			<div style={{ paddingTop: "68px" }} className="aboutus-container">
				{/* Enhanced Hero Banner */}
				<section
					className="py-5 text-dark position-relative overflow-hidden"
					style={{ backgroundColor: "#ffc107" }}
				>
					<div className="position-absolute top-0 start-0 w-100 h-100 opacity-10">
						<div
							style={{
								background:
									"repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)",
								width: "100%",
								height: "100%",
							}}
						></div>
					</div>
					<Container className="text-center position-relative">
						<h1 className="display-4 fw-bold mb-3">
							Welcome to CarbonCube Kenya
						</h1>
						<p className="lead mb-4 fs-5">Kenya's Trusted Online Marketplace</p>
						<p className="mb-4 fs-6 opacity-75">
							Connecting verified sellers with confident buyers across Kenya
						</p>
						<Button
							variant="dark"
							size="lg"
							className="rounded-pill px-4 py-2 shadow"
						>
							<Shop className="me-2" size={16} />
							Explore Marketplace
						</Button>
					</Container>
				</section>

				{/* Enhanced Vision & Mission */}
				<section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
					<Container>
						<div className="text-center mb-5">
							<h2 className="fw-bold text-dark mb-3">Our Foundation</h2>
							<p className="text-muted fs-5">
								Built on trust, powered by innovation
							</p>
						</div>
						<Row className="g-4">
							<Col md={6}>
								<Card className="border-0 shadow-sm rounded-4 h-100 position-relative overflow-hidden">
									<div className="position-absolute top-0 end-0 p-3">
										<GraphUp size={24} className="text-warning opacity-50" />
									</div>
									<Card.Body className="p-4">
										<div className="d-flex align-items-center mb-3">
											<div className="bg-warning rounded-circle p-2 me-3">
												<Award size={20} className="text-dark" />
											</div>
											<h4 className="fw-bold text-warning mb-0">Our Vision</h4>
										</div>
										<p className="mb-0 fs-6 text-muted">
											To be Kenya's most trusted and innovative online
											marketplace, setting the standard for digital commerce
											across East Africa.
										</p>
									</Card.Body>
								</Card>
							</Col>
							<Col md={6}>
								<Card className="border-0 shadow-sm rounded-4 h-100 position-relative overflow-hidden">
									<div className="position-absolute top-0 end-0 p-3">
										<Person size={24} className="text-warning opacity-50" />
									</div>
									<Card.Body className="p-4">
										<div className="d-flex align-items-center mb-3">
											<div className="bg-warning rounded-circle p-2 me-3">
												<CheckCircle size={20} className="text-dark" />
											</div>
											<h4 className="fw-bold text-warning mb-0">Our Mission</h4>
										</div>
										<p className="mb-0 fs-6 text-muted">
											To build Kenya's most secure and intelligent digital
											marketplace by leveraging AI and strict verification
											systems to connect trusted, independent sellers with
											buyers.
										</p>
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</Container>
				</section>

				{/* Enhanced Why Choose Us */}
				<section className="py-5" style={{ backgroundColor: "#e9ecef" }}>
					<Container>
						<div className="text-center mb-5">
							<h2 className="fw-bold text-dark mb-3">Why Choose CarbonCube?</h2>
							<p className="text-muted fs-5 mb-4">
								Experience the future of online shopping in Kenya
							</p>
							<div className="row justify-content-center">
								<div className="col-md-8">
									<hr
										className="border-warning border-2 opacity-75"
										style={{ width: "60px", margin: "0 auto" }}
									/>
								</div>
							</div>
						</div>
						<Row className="g-4">
							<Col md={6} lg={3}>
								<Card className="text-center shadow-sm border-0 h-100 rounded-4 position-relative overflow-hidden hover-lift">
									<div className="position-absolute top-0 start-0 w-100 h-2 bg-warning"></div>
									<Card.Body className="p-4">
										<div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
											<Shop size={32} className="text-warning" />
										</div>
										<h5 className="fw-bold mb-3">Trusted Marketplace</h5>
										<p className="text-muted small mb-0">
											Discover reliable, verified products from a wide community
											of independent Kenyan sellers with guaranteed
											authenticity.
										</p>
									</Card.Body>
								</Card>
							</Col>
							<Col md={6} lg={3}>
								<Card className="text-center shadow-sm border-0 h-100 rounded-4 position-relative overflow-hidden hover-lift">
									<div className="position-absolute top-0 start-0 w-100 h-2 bg-warning"></div>
									<Card.Body className="p-4">
										<div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
											<Robot size={32} className="text-warning" />
										</div>
										<h5 className="fw-bold mb-3">Best Experience</h5>
										<p className="text-muted small mb-0">
											Smart recommendations, fraud detection, and personalized
											shopping — all powered by cutting-edge solutions.
										</p>
									</Card.Body>
								</Card>
							</Col>
							<Col md={6} lg={3}>
								<Card className="text-center shadow-sm border-0 h-100 rounded-4 position-relative overflow-hidden hover-lift">
									<div className="position-absolute top-0 start-0 w-100 h-2 bg-warning"></div>
									<Card.Body className="p-4">
										<div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
											<CheckCircle size={32} className="text-warning" />
										</div>
										<h5 className="fw-bold mb-3">Verified Sellers</h5>
										<p className="text-muted small mb-0">
											Shop confidently through our robust seller verification
											system that promotes safety, quality, and trust in every
											transaction.
										</p>
									</Card.Body>
								</Card>
							</Col>
							<Col md={6} lg={3}>
								<Card className="text-center shadow-sm border-0 h-100 rounded-4 position-relative overflow-hidden hover-lift">
									<div className="position-absolute top-0 start-0 w-100 h-2 bg-warning"></div>
									<Card.Body className="p-4">
										<div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
											<Lock size={32} className="text-warning" />
										</div>
										<h5 className="fw-bold mb-3">Secure Transactions</h5>
										<p className="text-muted small mb-0">
											Your payments and personal data are protected using
											bank-grade, encrypted security technology you can trust.
										</p>
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</Container>
				</section>

				{/* Enhanced Commitment Section */}
				<section className="py-5 bg-white">
					<Container>
						<Row className="align-items-center g-5">
							<Col md={6}>
								<div className="pe-md-4">
									<Badge
										bg="warning"
										text="dark"
										className="mb-3 px-3 py-2 rounded-pill"
									>
										<Shield className="me-2" size={14} />
										Our Promise
									</Badge>
									<h2 className="fw-bold text-dark mb-4">
										Our Commitment to You
									</h2>
									<p className="text-muted mb-4 fs-6 lh-lg">
										We're building a safe, future-ready marketplace where
										Kenyans can buy and sell with complete confidence. Whether
										you're a buyer seeking reliable products or a seller ready
										to grow your business, CarbonCube Kenya is designed with
										your success as our priority.
									</p>
									<p className="text-muted mb-4 fs-6 lh-lg">
										We're constantly evolving — guided by AI innovation,
										valuable user feedback, and rigorous quality assurance — to
										deliver a marketplace built on trust, transparency, and
										unlimited opportunity.
									</p>
									<div className="d-flex flex-column flex-sm-row gap-3">
										<Button
											variant="warning"
											size="lg"
											className="rounded-pill px-4 py-2 shadow-sm"
										>
											Join the Marketplace
										</Button>
										<Button
											variant="outline-secondary"
											size="lg"
											className="rounded-pill px-4 py-2"
										>
											Learn More
										</Button>
									</div>
								</div>
							</Col>
							<Col md={6}>
								<img
									src={AboutUsImage}
									alt="Marketplace Illustration"
									className="img-fluid rounded-4 shadow-sm"
								/>
							</Col>
						</Row>
					</Container>
				</section>

				{/* New Stats Section */}
				<section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
					<Container>
						<Row className="text-center g-4">
							<Col md={3} sm={6}>
								<div className="p-3">
									<h3 className="fw-bold text-warning display-6 mb-2">15+</h3>
									<p className="text-muted mb-0">Verified Sellers</p>
								</div>
							</Col>
							{/* <Col md={4} sm={6}>
                    <div className="p-3">
                    <h3 className="fw-bold text-warning display-6 mb-2">50K+</h3>
                    <p className="text-muted mb-0">Happy Customers</p>
                    </div>
                </Col> */}
							<Col md={4} sm={6}>
								<div className="p-3">
									<h3 className="fw-bold text-warning display-6 mb-2">700+</h3>
									<p className="text-muted mb-0">Products Listed</p>
								</div>
							</Col>
							<Col md={4} sm={6}>
								<div className="p-3">
									<h3 className="fw-bold text-warning display-6 mb-2">99.9%</h3>
									<p className="text-muted mb-0">Uptime Guarantee</p>
								</div>
							</Col>
						</Row>
					</Container>
				</section>
			</div>

			<Footer />

			<style jsx>{`
				.hover-lift {
					transition: transform 0.3s ease, box-shadow 0.3s ease;
				}
				.hover-lift:hover {
					transform: translateY(-5px);
					box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
				}
			`}</style>
		</>
	);
};

export default AboutUs;
