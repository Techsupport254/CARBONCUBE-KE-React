import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import {
	FileText,
	Person,
	Lock,
	Eye,
	Check,
	Book,
	People,
	XCircle,
	Gear,
	Envelope,
	Phone,
	Clock,
} from "react-bootstrap-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Terms.css";
import useSEO from "../hooks/useSEO";
import useAuth from "../hooks/useAuth";

const DataDeletion = () => {
	// Get user authentication data
	const { isAuthenticated, userName, userEmail, userRole } = useAuth();

	// SEO Implementation
	useSEO({
		title: "Data Deletion Instructions - Carbon Cube Kenya",
		description:
			"Learn how to request deletion of your personal data from Carbon Cube Kenya. Follow our step-by-step guide for data deletion requests.",
		keywords:
			"data deletion, Carbon Cube Kenya data removal, GDPR data deletion, personal data deletion, user data removal",
		url: "https://carboncube-ke.com/data-deletion",
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "Data Deletion Instructions - Carbon Cube Kenya",
			description:
				"Instructions for requesting deletion of personal data from Carbon Cube Kenya marketplace",
			url: "https://carboncube-ke.com/data-deletion",
			dateModified: "2025-01-27",
			publisher: {
				"@type": "Organization",
				name: "Carbon Cube Kenya",
			},
		},
	});

	const handleEmailClick = () => {
		let emailBody =
			"Please include your account email and reason for data deletion request.";

		// If user is logged in, prefill their data
		if (isAuthenticated) {
			emailBody = `Dear Carbon Cube Kenya Team,

I would like to request deletion of my personal data from your platform.

Account Information:
- Full Name: ${userName || "Not provided"}
- Email: ${userEmail || "Not provided"}
- Account Type: ${
				userRole === "buyer"
					? "Buyer"
					: userRole === "seller"
					? "Seller"
					: "Not specified"
			}

Reason for Data Deletion Request:
[Please specify your reason here]

I understand that:
- Data deletion is permanent and irreversible
- I will not be able to recover my account or data after deletion
- Some data may be retained for legal compliance purposes

Please confirm receipt of this request and provide an estimated timeline for completion.

Thank you for your assistance.

Best regards,
${userName || "User"}`;
		}

		window.location.href = `mailto:info@carboncube-ke.com?subject=Data Deletion Request&body=${encodeURIComponent(
			emailBody
		)}`;
	};

	return (
		<>
			<Navbar mode="minimal" showSearch={false} showCategories={false} />

			<div className="terms-container">
				{/* Hero Section */}
				<section
					className="py-8 sm:py-12 lg:py-16 text-dark position-relative overflow-hidden"
					style={{ backgroundColor: "#ffc107" }}
				>
					{/* Subtle background pattern */}
					<div className="position-absolute top-0 start-0 w-100 h-100 opacity-60">
						<div
							style={{
								background:
									"repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px)",
								width: "100%",
								height: "100%",
							}}
						></div>
					</div>
					<div className="container mx-auto px-2 sm:px-4 text-center position-relative max-w-6xl">
						<div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-black rounded-full mx-auto mb-4 sm:mb-6 lg:mb-8 d-flex align-items-center justify-content-center border-2 sm:border-4 border-white">
							<FontAwesomeIcon
								icon={faTrashAlt}
								className="text-2xl sm:text-3xl lg:text-4xl text-white"
							/>
						</div>
						<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl fw-bold text-black mb-3 sm:mb-4 lg:mb-6">
							Data Deletion Instructions
						</h1>
						<p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-black opacity-90 mb-4 sm:mb-6 lg:mb-8 max-w-3xl mx-auto">
							CarbonCube Kenya - Request Data Deletion
						</p>
						<div
							className="bg-black text-warning rounded-full px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 d-inline-flex align-items-center gap-2 sm:gap-3 hover:bg-gray-900 transition-colors duration-300"
							onClick={handleEmailClick}
							style={{ cursor: "pointer" }}
						>
							<FontAwesomeIcon
								icon={faShieldAlt}
								className="text-warning text-sm sm:text-base lg:text-lg"
							/>
							<span className="text-warning fw-semibold text-sm sm:text-base lg:text-lg">
								Request Data Deletion
							</span>
						</div>
					</div>
				</section>

				{/* Main Content */}
				<section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
					<Container>
						<Row className="justify-content-center">
							<Col lg={10}>
								<Card className="border-0 rounded-4">
									<Card.Body className="p-4 p-lg-5">
										{/* Introduction */}
										<div className="mb-5">
											<p className="fs-6 text-muted mb-4">
												At CarbonCube Kenya, we respect your privacy and your
												right to control your personal data. This page explains
												how you can request the deletion of your personal data
												from our platform.
											</p>
											<p className="fs-6 text-muted">
												Under the Kenya Data Protection Act, 2019, you have the
												right to request deletion of your personal data, subject
												to certain legal and business obligations.
											</p>
										</div>

										{/* What Data Can Be Deleted */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Eye size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													1. What Data Can Be Deleted
												</h3>
											</div>
											<p className="fs-6 text-muted mb-3">
												You can request deletion of the following personal data:
											</p>

											<h5 className="fw-bold text-dark mb-2">For Buyers:</h5>
											<ul className="fs-6 text-muted mb-3">
												<li>
													Personal information (name, email, phone number)
												</li>
												<li>Account credentials and profile data</li>
												<li>Purchase history and transaction records</li>
												<li>Reviews and ratings you've submitted</li>
												<li>Communication history with sellers</li>
												<li>Browsing activity and preferences</li>
											</ul>

											<h5 className="fw-bold text-dark mb-2">For Sellers:</h5>
											<ul className="fs-6 text-muted mb-3">
												<li>Business information and verification documents</li>
												<li>Product listings and store information</li>
												<li>Seller performance data</li>
												<li>Communication with buyers</li>
											</ul>

											<div className="alert alert-warning" role="alert">
												<strong>Note:</strong> Some data may be retained for
												legal compliance, dispute resolution, or to prevent
												fraud, even after account deletion.
											</div>
										</div>

										{/* How to Request Data Deletion */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Gear size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													2. How to Request Data Deletion
												</h3>
											</div>

											<h5 className="fw-bold text-dark mb-2">
												Step 1: Contact Us
											</h5>
											<p className="fs-6 text-muted mb-3">
												Send an email to <strong>info@carboncube-ke.com</strong>{" "}
												with the subject line "Data Deletion Request".
											</p>

											<h5 className="fw-bold text-dark mb-2">
												Step 2: Provide Required Information
											</h5>
											<p className="fs-6 text-muted mb-2">
												Include the following in your email:
											</p>
											<ul className="fs-6 text-muted mb-3">
												<li>Your full name as registered on the platform</li>
												<li>Email address associated with your account</li>
												<li>Phone number (if different from account)</li>
												<li>Account type (Buyer/Seller)</li>
												<li>Reason for data deletion request</li>
												<li>
													Confirmation that you understand the consequences
												</li>
											</ul>

											<h5 className="fw-bold text-dark mb-2">
												Step 3: Verification Process
											</h5>
											<p className="fs-6 text-muted mb-2">We will:</p>
											<ul className="fs-6 text-muted mb-3">
												<li>
													Verify your identity to prevent unauthorized deletion
												</li>
												<li>
													Review your account for any pending transactions
												</li>
												<li>
													Check for any legal obligations that may prevent
													deletion
												</li>
												<li>Respond within 30 days of your request</li>
											</ul>

											<div className="text-center p-4 bg-light rounded-4">
												<Button
													variant="warning"
													size="lg"
													onClick={handleEmailClick}
													className="fw-bold text-dark"
												>
													<Envelope className="me-2" />
													Send Data Deletion Request
												</Button>
											</div>
										</div>

										{/* What Happens After Deletion */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Check size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													3. What Happens After Deletion
												</h3>
											</div>
											<ul className="fs-6 text-muted mb-3">
												<li>Your account will be permanently deactivated</li>
												<li>
													Personal data will be removed from our active systems
												</li>
												<li>
													You will no longer receive marketing communications
												</li>
												<li>
													Your listings (if you're a seller) will be removed
												</li>
												<li>
													You will not be able to recover your account or data
												</li>
											</ul>
											<div className="alert alert-info" role="alert">
												<strong>Important:</strong> Data deletion is permanent
												and irreversible. Make sure you have backed up any
												important information before requesting deletion.
											</div>
										</div>

										{/* Data Retention Exceptions */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Lock size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													4. Data Retention Exceptions
												</h3>
											</div>
											<p className="fs-6 text-muted mb-2">
												We may retain certain data even after deletion for:
											</p>
											<ul className="fs-6 text-muted mb-3">
												<li>Legal compliance and regulatory requirements</li>
												<li>Dispute resolution and fraud prevention</li>
												<li>Financial record keeping (transaction history)</li>
												<li>Security and audit purposes</li>
												<li>Anonymous analytics and aggregated data</li>
											</ul>
											<p className="fs-6 text-muted">
												This retained data will be anonymized where possible and
												used only for legitimate business purposes.
											</p>
										</div>

										{/* Processing Timeline */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Clock size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													5. Processing Timeline
												</h3>
											</div>
											<ul className="fs-6 text-muted mb-3">
												<li>
													<strong>Initial Response:</strong> Within 3 business
													days
												</li>
												<li>
													<strong>Identity Verification:</strong> Within 7
													business days
												</li>
												<li>
													<strong>Data Deletion:</strong> Within 30 days of
													verification
												</li>
												<li>
													<strong>Confirmation:</strong> Email confirmation once
													completed
												</li>
											</ul>
											<p className="fs-6 text-muted">
												Complex requests or accounts with pending transactions
												may take longer to process.
											</p>
										</div>

										{/* Alternative Options */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Person size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													6. Alternative Options
												</h3>
											</div>
											<p className="fs-6 text-muted mb-2">
												Before requesting complete data deletion, consider these
												alternatives:
											</p>
											<ul className="fs-6 text-muted mb-3">
												<li>
													<strong>Account Deactivation:</strong> Temporarily
													disable your account
												</li>
												<li>
													<strong>Data Correction:</strong> Update incorrect
													information
												</li>
												<li>
													<strong>Communication Preferences:</strong> Opt out of
													marketing emails
												</li>
												<li>
													<strong>Privacy Settings:</strong> Adjust your privacy
													and visibility settings
												</li>
											</ul>
											<p className="fs-6 text-muted">
												Contact us at <strong>info@carboncube-ke.com</strong> to
												discuss these options.
											</p>
										</div>

										{/* Contact Information */}
										<div className="text-center p-4 bg-light rounded-4">
											<h4 className="fw-bold text-dark mb-3">Need Help?</h4>
											<p className="fs-6 text-muted mb-3">
												If you have questions about data deletion or need
												assistance with your request:
											</p>
											<div className="d-flex justify-content-center gap-3 flex-wrap">
												<Badge bg="dark" className="px-3 py-2 mb-2">
													<Envelope className="me-1" />
													Email: info@carboncube-ke.com
												</Badge>
												<Badge bg="dark" className="px-3 py-2 mb-2">
													<Phone className="me-1" />
													Phone: +254 700 000 000
												</Badge>
												<Badge bg="dark" className="px-3 py-2 mb-2">
													Address: CarbonCube, CMS Africa Building, Nairobi,
													Kenya
												</Badge>
											</div>
										</div>

										{/* Final Note */}
										<div className="text-center mt-5 p-4 border-top">
											<p className="fs-6 text-muted fw-bold">
												We are committed to protecting your privacy and will
												handle your data deletion request with the utmost care
												and in accordance with applicable laws.
											</p>
										</div>
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</Container>
				</section>
			</div>

			<Footer />
		</>
	);
};

export default DataDeletion;
