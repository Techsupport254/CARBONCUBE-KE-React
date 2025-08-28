import React from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import {
	Shield,
	FileText,
	Person,
	Lock,
	Eye,
	Check,
	Book,
	People,
	XCircle,
	Gear,
} from "react-bootstrap-icons";
import TopNavBarMinimal from "./TopNavBarMinimal";
import Footer from "./Footer";
import "./Terms.css";
import useSEO from '../hooks/useSEO';

const Privacy = () => {
	// SEO Implementation
	useSEO({
		title: "Privacy Policy - Carbon Cube Kenya",
		description: "Read Carbon Cube Kenya's privacy policy. Learn how we protect your data and ensure your privacy while using Kenya's trusted online marketplace.",
		keywords: "privacy policy, Carbon Cube Kenya data protection, Kenya marketplace privacy, user data protection, GDPR compliance",
		url: "https://carboncube-ke.com/privacy",
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "Privacy Policy - Carbon Cube Kenya",
			"description": "Privacy policy and data protection information for Carbon Cube Kenya marketplace",
			"url": "https://carboncube-ke.com/privacy",
			"dateModified": "2025-07-25",
			"publisher": {
				"@type": "Organization",
				"name": "Carbon Cube Kenya"
			}
		}
	});

	return (
		<>
			<TopNavBarMinimal />

			<div style={{ paddingTop: "68px" }} className="terms-container">
				{/* Hero Section */}
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
						<div className="d-flex justify-content-center mb-3">
							<div className="bg-dark rounded-circle p-3">
								<Shield size={32} className="text-warning" />
							</div>
						</div>
						<h1 className="display-4 fw-bold mb-3">Privacy Policy</h1>
						<p className="lead mb-4 fs-5">CarbonCube Kenya - Data Protection</p>
						<p className="mb-4 fs-6 opacity-75">Effective Date: 25 July 2025</p>
						<Button
							variant="dark"
							size="lg"
							href="https://t9014769862.p.clickup-attachments.com/t9014769862/81a1cbcb-4e4f-4263-8713-4c4dc681b06c/Privacy%20Policy%20for%20CarbonCube.docx?view=open"
							className="rounded-pill px-4 py-2 shadow"
						>
							<Lock className="me-2" size={16} />
							Data Protection
						</Button>
					</Container>
				</section>

				{/* Main Content */}
				<section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
					<Container>
						<Row className="justify-content-center">
							<Col lg={10}>
								<Card className="border-0 shadow-sm rounded-4">
									<Card.Body className="p-4 p-lg-5">
										{/* Introduction */}
										<div className="mb-5">
											<p className="fs-6 text-muted mb-4">
												CarbonCube ("CarbonCube," "we," "us," or "our") is
												committed to protecting your privacy. This Privacy
												Policy outlines how we collect, use, disclose, and
												protect personal information from both Buyers and
												Sellers when using our online marketplace through our
												website, mobile applications, and related services
												(collectively, the "Platform").
											</p>
											<p className="fs-6 text-muted">
												By accessing or using the Platform, you consent to the
												practices described in this Privacy Policy. If you do
												not agree, please do not use our services.
											</p>
										</div>

										{/* Information We Collect */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Eye size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													1. Information We Collect
												</h3>
											</div>
											<p className="fs-6 text-muted mb-3">
												We collect different types of information depending on
												whether you are a Buyer, Seller, or both.
											</p>

											<h5 className="fw-bold text-dark mb-2">
												a) Information from Buyers
											</h5>
											<p className="fs-6 text-muted mb-2">
												We collect the following from Buyers:
											</p>
											<ul className="fs-6 text-muted mb-3">
												<li>Full name, phone number, and email address</li>
												<li>Account credentials (username and password)</li>
												<li>
													Purchase history, favorites, wishlist, and
													communication with Sellers
												</li>
												<li>Reviews and ratings submitted on the Platform</li>
												<li>
													Browsing activity, preferences, and interaction data
												</li>
												<li>
													Technical data (IP address, browser type, device
													model)*
												</li>
											</ul>

											<h5 className="fw-bold text-dark mb-2">
												b) Information from Sellers
											</h5>
											<p className="fs-6 text-muted mb-2">
												In addition to Buyer information, we collect:
											</p>
											<ul className="fs-6 text-muted mb-3">
												<li>Business name, registration number, and KRA PIN</li>
												<li>
													Store name, product listings, pricing, and uploaded
													media
												</li>
												<li>
													Business location and public contact information
													(e.g., phone or email visible to Buyers)
												</li>
												<li>Seller performance and account activity logs</li>
											</ul>

											<h5 className="fw-bold text-dark mb-2">
												c) Automatically Collected Data (All Users)
											</h5>
											<p className="fs-6 text-muted mb-2">
												From all users, we collect:
											</p>
											<ul className="fs-6 text-muted">
												<li>
													IP address, device information, operating system
												</li>
												<li>
													Pages visited, referral URLs, and click behavior
												</li>
												<li>Cookies and similar tracking technologies</li>
											</ul>
										</div>

										{/* How We Use Your Information */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Gear size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													2. How We Use Your Information
												</h3>
											</div>

											<h5 className="fw-bold text-dark mb-2">a) For Buyers:</h5>
											<p className="fs-6 text-muted mb-2">
												We use Buyer information to:
											</p>
											<ul className="fs-6 text-muted mb-3">
												<li>Create and manage your user account</li>
												<li>Facilitate interactions with Sellers</li>
												<li>
													Send updates on orders, promotions, and Platform
													changes
												</li>
												<li>
													Improve customer support and personalize your
													experience
												</li>
												<li>
													Detect fraudulent activity and enforce Platform
													policies
												</li>
											</ul>

											<h5 className="fw-bold text-dark mb-2">
												b) For Sellers:
											</h5>
											<p className="fs-6 text-muted mb-2">
												We use Seller information to:
											</p>
											<ul className="fs-6 text-muted mb-3">
												<li>Verify business legitimacy and identity</li>
												<li>
													Enable product listings, visibility, and searchability
													on the Platform
												</li>
												<li>Allow communication with potential Buyers</li>
												<li>
													Manage Seller dashboards, performance, and listing
													status
												</li>
												<li>Process and record transactions</li>
												<li>
													Resolve disputes, comply with legal requirements, and
													support investigations
												</li>
											</ul>
											<p className="fs-6 text-muted">
												<strong>Note:</strong> Seller names, store names,
												business details, and selected contact information may
												be displayed publicly as part of listings. Sensitive
												data like payment details are not publicly visible.
											</p>
										</div>

										{/* Sharing of Information */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<People size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													3. Sharing of Information
												</h3>
											</div>
											<p className="fs-6 text-muted mb-2">
												We only share data under specific circumstances:
											</p>
											<ul className="fs-6 text-muted mb-3">
												<li>
													<strong>With Service Providers:</strong> Such as
													hosting providers, payment processors, and analytics
													platforms that support our operations.
												</li>
												<li>
													<strong>With Other Users:</strong>
													<ul className="mt-2">
														<li>
															Buyers can view Seller business names, public
															contact info, and product listings.
														</li>
														<li>
															Sellers may view Buyer details when responding to
															messages or processing orders.
														</li>
													</ul>
												</li>
												<li>
													<strong>For Legal Reasons:</strong> If required by
													law, regulation, or to protect the rights, safety, or
													integrity of CarbonCube or our users.
												</li>
												<li>
													<strong>Not Sold:</strong> We do not sell or rent your
													personal data to third parties.
												</li>
											</ul>
										</div>

										{/* Cookies and Tracking Technologies */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<FileText size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													4. Cookies and Tracking Technologies
												</h3>
											</div>
											<p className="fs-6 text-muted mb-2">We use cookies to:</p>
											<ul className="fs-6 text-muted mb-3">
												<li>Maintain your session and preferences</li>
												<li>Monitor usage patterns and improve performance</li>
												<li>
													Enhance user experience with personalized content
												</li>
											</ul>
											<p className="fs-6 text-muted">
												You may manage cookies via your browser settings, but
												disabling them may limit functionality.
											</p>
										</div>

										{/* Data Retention */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Book size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													5. Data Retention
												</h3>
											</div>
											<ul className="fs-6 text-muted">
												<li>
													Buyer and Seller data is retained for as long as your
													account is active or as required for legal or business
													purposes.
												</li>
												<li>
													Upon request, you may delete your account, subject to
													any pending transactions or legal obligations.
												</li>
												<li>
													Some Seller data may be retained after deactivation
													for audit, dispute resolution, or compliance purposes.
												</li>
											</ul>
										</div>

										{/* Your Rights Under Kenyan Law */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Check size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													6. Your Rights Under Kenyan Law
												</h3>
											</div>
											<p className="fs-6 text-muted mb-2">
												In accordance with the Kenya Data Protection Act, 2019,
												you have the right to:
											</p>
											<ul className="fs-6 text-muted mb-3">
												<li>
													Request access to personal data we hold about you
												</li>
												<li>Correct inaccurate or incomplete personal data</li>
												<li>
													Request deletion or restriction of processing (subject
													to any ongoing obligations)
												</li>
												<li>
													Object to direct marketing or certain types of
													automated processing
												</li>
												<li>Withdraw consent at any time</li>
											</ul>
											<p className="fs-6 text-muted">
												To exercise these rights, contact us at
												info@carboncube-ke.com.
											</p>
										</div>

										{/* Data Security */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Lock size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													7. Data Security
												</h3>
											</div>
											<p className="fs-6 text-muted mb-2">
												We implement technical, administrative, and physical
												safeguards to protect your data. These include:
											</p>
											<ul className="fs-6 text-muted mb-3">
												<li>Secure servers and encrypted communications</li>
												<li>
													Restricted access to sensitive documents (e.g., Seller
													verification files)
												</li>
												<li>
													Regular monitoring for suspicious or unauthorized
													activity
												</li>
											</ul>
											<p className="fs-6 text-muted">
												While we strive to protect your data, no online system
												is completely secure.
											</p>
										</div>

										{/* International Data Transfers */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Person size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													8. International Data Transfers
												</h3>
											</div>
											<p className="fs-6 text-muted">
												Some of our service providers may store or process data
												outside of Kenya. By using our Platform, you consent to
												such cross-border data transfers in compliance with
												applicable laws.
											</p>
										</div>

										{/* Children's Privacy */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<XCircle size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													9. Children's Privacy
												</h3>
											</div>
											<p className="fs-6 text-muted">
												CarbonCube does not knowingly collect personal
												information from children under the age of 18 without
												parental consent. If we discover such data has been
												collected without proper authorization, it will be
												deleted.
											</p>
										</div>

										{/* Changes to this Privacy Policy */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Gear size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													10. Changes to this Privacy Policy
												</h3>
											</div>
											<p className="fs-6 text-muted">
												We may update this Privacy Policy from time to time. Any
												changes will be posted here with an updated effective
												date. Continued use of the Platform after changes means
												you accept the revised terms.
											</p>
										</div>

										{/* Contact Information */}
										<div className="text-center p-4 bg-light rounded-4">
											<h4 className="fw-bold text-dark mb-3">11. Contact Us</h4>
											<p className="fs-6 text-muted mb-3">
												If you have any questions or requests regarding this
												Privacy Policy or your personal data, contact:
											</p>
											<div className="d-flex justify-content-center gap-3 flex-wrap">
												<Badge bg="dark" className="px-3 py-2 mb-2">
													Email: info@carboncube-ke.com
												</Badge>
												<Badge bg="dark" className="px-3 py-2 mb-2">
													Address: CarbonCube, CMS Africa Building, Nairobi,
													Kenya
												</Badge>
											</div>
										</div>

										{/* Final Agreement */}
										<div className="text-center mt-5 p-4 border-top">
											<p className="fs-6 text-muted fw-bold">
												By using CarbonCube, you acknowledge that you have read,
												understood, and agreed to this Privacy Policy.
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

export default Privacy;
