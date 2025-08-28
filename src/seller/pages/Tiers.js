import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Row,
	Col,
	Button,
	Accordion,
	Container,
	Card,
	Modal,
} from "react-bootstrap";
import Spinner from "react-spinkit";
import { useNavigate } from "react-router-dom";
import MpesaPaymentGuide from "../components/MpesaPaymentGuide";
import FeatureComparisonTable from "../components/FeatureComparisonTable";
import TopNavBarMinimal from "../../components/TopNavBarMinimal"; // Adjust path if necessary
import "../css/Tiers.css";
import Footer from "../../components/Footer"; // Adjust path if necessary
import { jwtDecode } from "jwt-decode";

const TierPage = () => {
	const [tiers, setTiers] = useState([]);
	const [selectedTier, setSelectedTier] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const [isSellerLoggedIn, setIsSellerLoggedIn] = useState(false);

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_BACKEND_URL}/tiers`)
			.then((response) => {
				setTiers(response.data || []);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error fetching tier data:", err);
				setError("Failed to fetch tier data. Please try again later.");
				setLoading(false);
			});
	}, []);

	const handleSelectTier = async (tierId) => {
		const sellerId = getSellerIdFromToken();
		if (!sellerId) {
			console.error("Seller ID not found in session storage.");
			return;
		}

		try {
			const response = await fetch(
				`/${process.env.REACT_APP_BACKEND_URL}/seller/tiers/${tierId}/update_tier`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Send token
					},
				}
			);

			const data = await response.json();
			if (response.ok) {
				// Tier updated successfully
			} else {
				console.error("Failed to update tier:", data.error);
			}
		} catch (error) {
			console.error("Error updating tier:", error);
		}
	};

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (token) {
			try {
				const decoded = jwtDecode(token);
				if (decoded.seller_id) {
					setIsSellerLoggedIn(true);
				}
			} catch (error) {
				console.error("Invalid token:", error);
			}
		}
	}, []);

	function getSellerIdFromToken() {
		const token = sessionStorage.getItem("token"); // Adjust if stored differently
		if (!token) {
			console.error("Token not found in session storage");
			return null;
		}

		try {
			const decodedToken = jwtDecode(token);
			return decodedToken.seller_id; // Ensure this matches your token structure
		} catch (error) {
			console.error("Failed to decode token:", error);
			return null;
		}
	}

	if (loading) {
		return (
			<div className="centered-loader">
				<Spinner
					variant="warning"
					name="cube-grid"
					style={{ width: 100, height: 100 }}
				/>
				{/* <p className="mt-3">Loading tiers, please wait...</p> */}
			</div>
		);
	}

	if (error) {
		return (
			<Container className="text-center my-5">
				<h2 className="text-danger">Error</h2>
				<p>{error}</p>
			</Container>
		);
	}

	return (
		<div className="pricing-page px-0 py-0">
			{/* Top Navbar Minimal */}
			<TopNavBarMinimal />

			{/* Hero Section */}
			<section className="hero-section text-center mb-1 mb-lg-5 custom-card mt-3">
				<Container>
					<h1 className="display-4 fw-bold">
						Choose the Perfect Plan for Your Business
					</h1>
					<p className="lead">
						Whether you're just starting out or ready to scale, we have a plan
						that fits your needs. Explore our tiered options below.
					</p>

					{/* Show only if seller is logged in */}
					{isSellerLoggedIn && (
						<Button
							onClick={() => navigate("/seller/ads")}
							className="btn btn-dark mt-4 rounded-pill"
						>
							Back to Home
						</Button>
					)}
				</Container>
			</section>

			{/* Pricing Section */}
			<section className="pricing-section p-2">
				<Container>
					<Row className="mb-4">
						{tiers
							.slice() // Create a shallow copy of the array to avoid mutating the original state
							.sort((a, b) => a.id - b.id) // Sort tiers by ascending ID
							.map((tier) => (
								<Col
									lg={3}
									md={6}
									sm={12}
									key={tier.id}
									className="p-0 p-lg-2 mb-3"
								>
									<Card
										className={`tier-box h-100 d-flex flex-column ${
											selectedTier === tier.id ? "selected-tier" : ""
										}`}
									>
										<Card.Body className="flex-grow-1 d-flex flex-column justify-content-between">
											<div>
												<Card.Title className="tier-title text-secondary">
													{tier.name}
												</Card.Title>
												<Card.Subtitle className="tier-description mb-3">
													Ads:{" "}
													{tier.name === "Premium" ? (
														<span style={{ fontSize: "1.2rem" }}>∞</span>
													) : (
														tier.ads_limit
													)}
												</Card.Subtitle>
												<ul className="tier-features list-unstyled mb-3">
													{(tier.tier_features || []).map((feature) => (
														<li key={feature.id}>✔ {feature.feature_name}</li>
													))}
												</ul>
												<div className="pricing-details text-center">
													{tier.id !== 1 ? ( // Only render pricing if the tier is not the free tier
														(tier.tier_pricings || []).map((pricing) => (
															<div key={pricing.id} className="pricing-option">
																<span>
																	<strong>{pricing.duration_months}</strong>{" "}
																	months:
																	<em className="ad-price-label text-success">
																		{" "}
																		Kshs:{" "}
																	</em>
																	<strong
																		style={{ fontSize: "17px" }}
																		className="text-danger ms-1"
																	>
																		{pricing.price
																			? parseFloat(pricing.price)
																					.toFixed(2)
																					.split(".")
																					.map((part, index) => (
																						<React.Fragment key={index}>
																							{index === 0 ? (
																								<span>
																									{parseInt(
																										part,
																										10
																									).toLocaleString()}
																								</span> // Integer part with commas
																							) : (
																								<>
																									<span
																										style={{ fontSize: "16px" }}
																									>
																										.
																									</span>
																									<span className="price-decimal">
																										{part}
																									</span>
																								</>
																							)}
																						</React.Fragment>
																					))
																			: "N/A"}
																	</strong>
																</span>
															</div>
														))
													) : (
														<p className="text-center text-muted">Free Tier</p> // Message for the free tier
													)}
												</div>
											</div>
										</Card.Body>
									</Card>
								</Col>
							))}
					</Row>
					<MpesaPaymentGuide />
				</Container>
			</section>

			{/* Feature Breakdown */}
			<FeatureComparisonTable />

			{/* FAQs Section */}
			<section className="faqs my-5">
				<Container>
					<h2 className="text-center mb-4">Frequently Asked Questions</h2>
					<Accordion>
						<Accordion.Item eventKey="0">
							<Accordion.Header>
								What happens if I upgrade or downgrade my tier?
							</Accordion.Header>
							<Accordion.Body>
								When you upgrade or downgrade, your billing will be adjusted
								accordingly. Your features will change to match the selected
								tier.
							</Accordion.Body>
						</Accordion.Item>
						<Accordion.Item eventKey="1">
							<Accordion.Header>Can I change my tier anytime?</Accordion.Header>
							<Accordion.Body>
								Yes, you can change your tier anytime. We provide flexibility so
								you can choose what fits your evolving needs.
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				</Container>
			</section>

			{/* Call to Action */}
			<section className="cta text-center py-5">
				<Container>
					<h2>Ready to Get Started?</h2>
					<p>Choose your plan and start growing your business today!</p>
					<Button
						variant="secondary rounded-pill"
						size="lg"
						className="px-5"
						onClick={() => handleSelectTier(selectedTier)}
					>
						Select Your Plan
					</Button>
				</Container>
			</section>

			<Footer />
		</div>
	);
};

export default TierPage;
