import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBuilding,
	faShieldAlt,
	faCheckCircle,
	faLock,
	faRobot,
	faStore,
	faHandshake,
	faGlobe,
	faHeart,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import StaticPageSEO from "./StaticPageSEO";

// Using public path for image
const AboutUsImage = "/assets/about-us.jpg";

const AboutUs = () => {
	// Prepare page data for SEO
	const pageData = {
		title: "About Us - Carbon Cube Kenya | Kenya's Trusted Marketplace",
		description:
			"Learn about Carbon Cube Kenya, Kenya's trusted digital marketplace. Discover our mission to connect verified sellers with buyers through secure, AI-powered tools.",
		keywords: [
			"about Carbon Cube Kenya",
			"Kenya marketplace",
			"digital procurement",
			"verified sellers",
			"AI-powered marketplace",
			"online shopping Kenya",
			"Nairobi marketplace",
			"Kenyan e-commerce",
			"trusted sellers Kenya",
			"digital marketplace Kenya",
			"Carbon Cube company",
			"Kenya online shopping platform",
		],
		image: AboutUsImage,
		url: `${window.location.origin}/about-us`,
		section: "About",
		tags: ["About", "Company", "Team", "Mission"],
	};

	return (
		<>
			<StaticPageSEO pageType="about" pageData={pageData} />
			<Navbar mode="minimal" showSearch={false} showCategories={false} />

			{/* 1. Hero Section - Introduction */}
			<section
				className="py-8 sm:py-12 lg:py-16 text-dark position-relative overflow-hidden"
				style={{ backgroundColor: "#ffc107" }}
			>
				<div className="container-fluid">
					<div className="row align-items-center">
						<div className="col-lg-6 mb-6 mb-lg-0">
							<h1 className="display-4 fw-bold mb-4">
								Welcome to Carbon Cube Kenya
							</h1>
							<p className="lead mb-4 text-dark">
								Kenya's trusted digital marketplace connecting verified sellers
								with serious buyers through AI-powered tools and seamless
								procurement.
							</p>
						</div>
						<div className="col-lg-6">
							<img
								src={AboutUsImage}
								alt="About Carbon Cube Kenya"
								className="img-fluid rounded-4 shadow-lg"
								style={{ maxHeight: "400px", objectFit: "cover" }}
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Company Info sections continue here... */}
			<Footer />
		</>
	);
};

export default AboutUs;
