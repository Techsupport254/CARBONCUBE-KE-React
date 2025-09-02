import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Shop } from "react-bootstrap-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./AboutUs.css"; // Assuming you have a CSS file for custom styles
import { Mail, MapPin, Phone } from "lucide-react";
import useSEO from "../hooks/useSEO";

const ContactUs = () => {
	// SEO Implementation
	useSEO({
		title: "Contact Us - Carbon Cube Kenya",
		description:
			"Get in touch with Carbon Cube Kenya. We're here to help with your online marketplace needs and seller verification questions.",
		keywords:
			"contact Carbon Cube Kenya, customer support, Kenya marketplace support, help desk",
		url: "https://carboncube-ke.com/contact-us",
		structuredData: {
			"@context": "https://schema.org",
			"@type": "ContactPage",
			name: "Contact Carbon Cube Kenya",
			description:
				"Get in touch with Carbon Cube Kenya for support and inquiries",
			url: "https://carboncube-ke.com/contact-us",
			mainEntity: {
				"@type": "Organization",
				name: "Carbon Cube Kenya",
				contactPoint: [
					{
						"@type": "ContactPoint",
						contactType: "customer service",
						telephone: "+254 712 990 524",
						availableLanguage: "English",
						areaServed: "KE",
						hoursAvailable: {
							"@type": "OpeningHoursSpecification",
							dayOfWeek: [
								"Monday",
								"Tuesday",
								"Wednesday",
								"Thursday",
								"Friday",
							],
							opens: "08:00",
							closes: "17:00",
						},
					},
					{
						"@type": "ContactPoint",
						contactType: "customer service",
						email: "info@carboncube-ke.com",
						availableLanguage: "English",
					},
				],
				address: {
					"@type": "PostalAddress",
					streetAddress: "9th Floor, CMS Africa, Kilimani",
					addressLocality: "Nairobi",
					addressRegion: "Nairobi",
					addressCountry: "KE",
					postalCode: "00100"
				},
			},
		},
	});

	return (
		<>
			<Navbar mode="minimal" showSearch={false} showCategories={false} />

			{/* Add padding-top to prevent navbar overlay */}

			<div className="aboutus-container">
				{/* Enhanced Hero Banner */}
				<section
					className="py-5 text-dark position-relative overflow-hidden"
					style={{ backgroundColor: "#ffc107" }}
				>
					{/* Subtle background pattern */}
					<div className="position-absolute top-0 start-0 w-100 h-100 opacity-50">
						<div
							style={{
								background:
									"repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.1) 35px, rgba(0,0,0,.1) 70px)",
								width: "100%",
								height: "100%",
							}}
						></div>
					</div>
					<Container className="text-center position-relative">
						<h1 className="display-4 fw-bold mb-3">Contact us</h1>
						<p className="lead mb-4 fs-5">Kenya's Trusted Online Marketplace</p>
						<p className="mb-4 fs-6 opacity-75">
							Connecting verified sellers with confident buyers across Kenya
						</p>
						<Button
							variant="dark"
							size="lg"
							className="rounded-pill px-4 py-2 shadow d-inline-flex align-items-center gap-2"
						>
							<Shop size={16} />
							<span>Explore Marketplace</span>
						</Button>
					</Container>
				</section>

				{/* Enhanced Why Choose Us */}
				<section className="py-5" style={{ backgroundColor: "#e9ecef" }}>
					<Container>
						<Row className="g-4 d-flex justify-content-center">
							<Col md={4} lg={3}>
								<Card className="text-center shadow-sm border-0 h-100 rounded-4 position-relative overflow-hidden hover-lift">
									<div className="position-absolute top-0 start-0 w-100 h-2 bg-warning"></div>
									<Card.Body className="p-4">
										<div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
											<MapPin size={32} className="text-warning" />
										</div>
										<h5 className="fw-bold mb-3">Visit Us</h5>
										<p className="text-muted small mb-0">
											9th Floor, CMS Africa, Kilimani, Nairobi <br /> Open: Mon
											- Fri, 9am to 5pm.
										</p>
									</Card.Body>
								</Card>
							</Col>
							<Col md={6} lg={3}>
								<Card className="text-center shadow-sm border-0 h-100 rounded-4 position-relative overflow-hidden hover-lift">
									<div className="position-absolute top-0 start-0 w-100 h-2 bg-warning"></div>
									<Card.Body className="p-4">
										<div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
											<Phone size={32} className="text-warning" />
										</div>
										<h5 className="fw-bold mb-3">Call Us</h5>
										<p className="text-muted small mb-0">
											+254 712 990 524 (Mon - Fri, 8am – 5pm). <br /> We’re
											happy to help with product inquiries and support.
										</p>
									</Card.Body>
								</Card>
							</Col>
							<Col md={6} lg={3}>
								<Card className="text-center shadow-sm border-0 h-100 rounded-4 position-relative overflow-hidden hover-lift">
									<div className="position-absolute top-0 start-0 w-100 h-2 bg-warning"></div>
									<Card.Body className="p-4">
										<div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
											<Mail size={32} className="text-warning" />
										</div>
										<h5 className="fw-bold mb-3">Contact Us</h5>
										<p className="text-muted small mb-0">
											Reach out via{" "}
											<span className="fw-bold">info@carboncube-ke.com</span>{" "}
											for partnerships, media, or technical support queries
										</p>
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</Container>
				</section>

				{/* Enhanced Commitment Section */}
				<section className="py-5">
					<Container>
						<Row
							className="mt-3 rounded-3 overflow-hidden"
							style={{ height: "560px", backgroundColor: "#e9ecef" }}
						>
							<iframe
								title="CMS Africa House, Kilimani"
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7995958858055!2d36.787293276026126!3d-1.294788035637667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10969d1409f1%3A0x9cb370689cc9135e!2sCMS-Africa!5e0!3m2!1sen!2ske!4v1754370979247!5m2!1sen!2ske"
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowFullScreen=""
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
							></iframe>
						</Row>
					</Container>
				</section>

				{/* New Stats Section */}
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

export default ContactUs;
