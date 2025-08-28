import React from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import {
	Shield,
	FileText,
	Person,
	ExclamationTriangle,
	Check,
	Book,
	CreditCard,
	People,
	Eye,
	XCircle,
	Gear,
} from "react-bootstrap-icons";
import "./Terms.css";
import TopNavBarMinimal from "./TopNavBarMinimal";
import Footer from "./Footer";
import useSEO from '../hooks/useSEO';

const Terms = () => {
	// SEO Implementation
	useSEO({
		title: "Terms & Conditions - Carbon Cube Kenya",
		description: "Read Carbon Cube Kenya's terms and conditions. Understand the legal agreement governing your use of Kenya's trusted online marketplace platform.",
		keywords: "terms and conditions, Carbon Cube Kenya legal, Kenya marketplace terms, user agreement, platform terms",
		url: "https://carboncube-ke.com/terms-and-conditions",
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "Terms & Conditions - Carbon Cube Kenya",
			"description": "Legal terms and conditions for using Carbon Cube Kenya marketplace",
			"url": "https://carboncube-ke.com/terms-and-conditions",
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
								<FileText size={32} className="text-warning" />
							</div>
						</div>
						<h1 className="display-4 fw-bold mb-3">Terms & Conditions</h1>
						<p className="lead mb-4 fs-5">CarbonCube Kenya - Legal Agreement</p>
						<p className="mb-4 fs-6 opacity-75">Last Updated: 25 July 2025</p>
						<Button
							variant="dark"
							size="lg"
							href="https://t9014769862.p.clickup-attachments.com/t9014769862/dff490a5-61d4-4306-ad6e-3088913b328b/CarbonCube%20Terms%20and%20Conditions.docx?view=open"
							className="rounded-pill px-4 py-2 shadow"
						>
							<Shield className="me-2" size={16} />
							Legal Document
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
												Welcome to CarbonCube ("CarbonCube," "we," "us," or
												"our"). These Terms and Conditions ("Terms") govern your
												access to and use of our online marketplace platform,
												website, mobile applications, and related services
												(collectively, the "Platform").
											</p>
											<p className="fs-6 text-muted">
												By accessing or using the Platform, you agree to comply
												with these Terms. If you do not agree, you must not use
												the Platform.
											</p>
										</div>

										{/* Definitions */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Book size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													1. Definitions
												</h3>
											</div>
											<ul className="fs-6 text-muted">
												<li>
													<strong>"Buyer"</strong> – A registered user
													purchasing goods or services on CarbonCube.
												</li>
												<li>
													<strong>"Seller"</strong> – A verified independent
													seller offering goods or services on CarbonCube.
												</li>
												<li>
													<strong>"User"</strong> – Any person (Buyer or Seller)
													accessing the Platform.
												</li>
												<li>
													<strong>"Content"</strong> – Any text, images,
													reviews, listings, or data uploaded by Users.
												</li>
												<li>
													<strong>"Transaction"</strong> – An agreement between
													Buyer and Seller facilitated via CarbonCube.
												</li>
											</ul>
										</div>

										{/* Account Registration & Security */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<CreditCard size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													2. Account Registration & Security
												</h3>
											</div>

											<h5 className="fw-bold text-dark mb-2">
												2.1 Eligibility
											</h5>
											<ul className="fs-6 text-muted mb-3">
												<li>
													You must be 18 years or older to use the Platform.
												</li>
												<li>
													Businesses must provide valid documents of
													registration for verification.
												</li>
											</ul>
											<h5 className="fw-bold text-dark mb-2">
												2.2 Account Responsibility
											</h5>
											<ul className="fs-6 text-muted mb-3">
												<li>
													You are responsible for maintaining the
													confidentiality of your login credentials.
												</li>
												<li>
													You must immediately notify us of any unauthorized use
													of your account.
												</li>
												<li>
													You are fully liable for all activities that occur
													under your account.
												</li>
											</ul>
											<h5 className="fw-bold text-dark mb-2">
												2.3 Verification
											</h5>
											<ul className="fs-6 text-muted">
												<li>
													Sellers undergo strict verification including ID and
													business documentation.
												</li>
												<li>
													CarbonCube reserves the right to suspend or remove
													unverified or non-compliant accounts.
												</li>
											</ul>
										</div>

										{/* User Obligations */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Person size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													3. User Obligations
												</h3>
											</div>

											<h5 className="fw-bold text-dark mb-2">
												3.1 Prohibited Conduct
											</h5>
											<p className="fs-6 text-muted mb-2">Users must not:</p>
											<ul className="fs-6 text-muted mb-3">
												<li>
													List illegal, counterfeit, stolen, or restricted
													items.
												</li>
												<li>Provide false or misleading information.</li>
												<li>Harass, threaten, or defraud other Users.</li>
												<li>
													Violate another party's intellectual property rights.
												</li>
												<li>
													Use bots, scrapers, or automated tools on the
													Platform.
												</li>
											</ul>
											<h5 className="fw-bold text-dark mb-2">
												3.2 Content Standards
											</h5>
											<ul className="fs-6 text-muted mb-3">
												<li>Be truthful and clear in product descriptions.</li>
												<li>
													Avoid uploading any content that is fraudulent,
													misleading, or harmful.
												</li>
												<li>
													Do not post content that is offensive, obscene, or
													violates any applicable law.
												</li>
											</ul>
											<h5 className="fw-bold text-dark mb-2">
												3.3 Listings Guidelines
											</h5>
											<ul className="fs-6 text-muted">
												<li>
													Items and services listed must comply with Kenyan law
													and CarbonCube's category policies.
												</li>
												<li>
													CarbonCube reserves the right to remove listings that
													are inappropriate, illegal, or violate these Terms.
												</li>
											</ul>
										</div>

										{/* Transactions, Payments & Delivery */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Check size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													4. Transactions, Payments & Delivery
												</h3>
											</div>

											<h5 className="fw-bold text-dark mb-2">
												4.1 Buyer-Seller Agreement
											</h5>
											<ul className="fs-6 text-muted mb-3">
												<li>
													CarbonCube is a neutral facilitator and does not
													stock, own, or ship any products.
												</li>
												<li>
													Buyers pay Sellers directly using approved payment
													methods listed on the Platform.
												</li>
												<li>
													CarbonCube does not act as a party to the sale and
													does not guarantee successful Transactions.
												</li>
												<li>
													CarbonCube does not hold funds. All payments are
													processed through third-party providers subject to
													their own terms.
												</li>
											</ul>
											<h5 className="fw-bold text-dark mb-2">
												4.2 Refunds & Returns
											</h5>
											<ul className="fs-6 text-muted mb-3">
												<li>
													Refunds, exchanges, or return requests must be
													resolved directly between the Buyer and the Seller.
												</li>
												<li>
													CarbonCube does not engage in any dispute resolution
													and does not assume liability between the buyer and
													seller.
												</li>
											</ul>
											<h5 className="fw-bold text-dark mb-2">4.3 Fees</h5>
											<ul className="fs-6 text-muted mb-3">
												<li>
													Sellers will be charged listing or transaction fees as
													communicated on the Platform.
												</li>
												<li>Buyers pay the price displayed on each listing.</li>
											</ul>
											<h5 className="fw-bold text-dark mb-2">
												4.4 Shipping & Delivery
											</h5>
											<ul className="fs-6 text-muted">
												<li>
													Sellers are solely responsible for coordinating
													shipping, delivery, or pickup with Buyers.
												</li>
												<li>
													CarbonCube does not provide logistics or
													transportation services and is not liable for delivery
													delays, lost items, or shipping errors.
												</li>
											</ul>
										</div>

										{/* Intellectual Property */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Eye size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													5. Intellectual Property
												</h3>
											</div>
											<ul className="fs-6 text-muted">
												<li>
													CarbonCube retains all intellectual property rights in
													the Platform, including but not limited to logos,
													design, branding, and software.
												</li>
												<li>
													Users retain ownership of their uploaded content but
													grant CarbonCube a non-exclusive, royalty-free license
													to use, display, and promote the content on the
													Platform.
												</li>
												<li>
													Suspected IP violations may be reported to:
													info@carboncube-ke.com
												</li>
											</ul>
										</div>

										{/* Privacy & Data Protection */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<XCircle size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													6. Privacy & Data Protection
												</h3>
											</div>
											<ul className="fs-6 text-muted">
												<li>
													Your use of the Platform is subject to our Privacy
													Policy, which outlines how we collect, use, and store
													your data.
												</li>
												<li>
													By using the Platform, you consent to data processing
													for the purposes of fraud prevention, service
													optimization, and analytics.
												</li>
												<li>
													We use cookies and similar technologies to improve
													your browsing experience.
												</li>
											</ul>
										</div>

										{/* Disclaimers & Limitation of Liability */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<ExclamationTriangle
														size={20}
														className="text-dark"
													/>
												</div>
												<h3 className="fw-bold text-warning mb-0">
													7. Disclaimers & Limitation of Liability
												</h3>
											</div>

											<h5 className="fw-bold text-dark mb-2">
												7.1 Disclaimer of Warranties
											</h5>
											<ul className="fs-6 text-muted mb-3">
												<li>
													The Platform is provided "as is" and "as available"
													without warranties of any kind.
												</li>
												<li>
													We do not warrant that the Platform will be
													uninterrupted, error-free, or secure.
												</li>
											</ul>
											<h5 className="fw-bold text-dark mb-2">
												7.2 Indemnification
											</h5>
											<p className="fs-6 text-muted mb-3">
												You agree to indemnify and hold harmless CarbonCube, its
												affiliates, employees, and agents from any claims,
												damages, or losses arising out of your use of the
												Platform, violation of these Terms, or infringement of
												third-party rights.
											</p>
											<h5 className="fw-bold text-dark mb-2">
												7.3 Limited Liability
											</h5>
											<p className="fs-6 text-muted mb-2">
												CarbonCube shall not be liable for:
											</p>
											<ul className="fs-6 text-muted">
												<li>
													Product quality, safety, authenticity, or compliance.
												</li>
												<li>Failed, delayed, or misdirected deliveries.</li>
												<li>User behavior or performance.</li>
												<li>
													Any indirect or consequential damages, including loss
													of data or profits.
												</li>
												<li>
													Third-party services or external websites accessed via
													CarbonCube.
												</li>
											</ul>
										</div>

										{/* Termination & Suspension */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<People size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													8. Termination & Suspension
												</h3>
											</div>
											<p className="fs-6 text-muted mb-2">
												CarbonCube reserves the right to suspend or terminate
												your access to the Platform for:
											</p>
											<ul className="fs-6 text-muted mb-3">
												<li>Breach of these Terms</li>
												<li>Fraudulent or suspicious activity</li>
												<li>Non-compliance with laws or regulations</li>
											</ul>
											<p className="fs-6 text-muted">
												Suspended Users may contact info@carboncube-ke.com to
												appeal the decision. Reinstatement is at CarbonCube's
												sole discretion.
											</p>
										</div>

										{/* Dispute Resolution */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<FileText size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													9. Dispute Resolution
												</h3>
											</div>
											<ul className="fs-6 text-muted">
												<li>These Terms are governed by the laws of Kenya.</li>
												<li>
													In the event of a dispute between Carbon Cube Kenya
													and any seller, the parties shall first make every
													effort to resolve the matter amicably through direct
													communication, initiated via email to
													info@carboncube-ke.com.
												</li>
												<li>
													If the dispute remains unresolved, it shall be
													referred to mediation in accordance with the
													applicable laws of Kenya.
												</li>
												<li>
													Should mediation fail to resolve the dispute, either
													party may submit the matter to the competent courts of
													Nairobi, Kenya, which shall have exclusive
													jurisdiction.
												</li>
											</ul>
										</div>

										{/* Changes to Terms */}
										<div className="mb-5">
											<div className="d-flex align-items-center mb-3">
												<div
													className="bg-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
													style={{ width: "40px", height: "40px" }}
												>
													<Gear size={20} className="text-dark" />
												</div>
												<h3 className="fw-bold text-warning mb-0">
													10. Changes to Terms
												</h3>
											</div>
											<ul className="fs-6 text-muted">
												<li>
													We may update these Terms at any time. Changes will be
													posted on the Platform.
												</li>
												<li>
													Continued use of the Platform following any changes
													constitutes your acceptance of the revised Terms.
												</li>
											</ul>
										</div>

										{/* Contact Information */}
										<div className="text-center p-4 bg-light rounded-4">
											<h4 className="fw-bold text-dark mb-3">11. Contact Us</h4>
											<p className="fs-6 text-muted mb-3">
												If you have any questions or concerns regarding these
												Terms, please contact us:
											</p>
											<div className="d-flex justify-content-center gap-3 flex-wrap">
												<Badge bg="dark" className="px-3 py-2 mb-2">
													Email: info@carboncube-ke.com
												</Badge>
												<Badge bg="dark" className="px-3 py-2 mb-2">
													Address: CarbonCube, CMS building 9th Floor, Nairobi,
													Kenya
												</Badge>
											</div>
										</div>

										{/* Final Agreement */}
										<div className="text-center mt-5 p-4 border-top">
											<p className="fs-6 text-muted fw-bold">
												By using CarbonCube, you acknowledge that you have read,
												understood, and agreed to these Terms and Conditions.
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

export default Terms;
