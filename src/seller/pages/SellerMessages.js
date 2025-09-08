import React from "react";
import Messages from "../../components/Messages";
import Navbar from "../../components/Navbar";
import Sidebar from "../components/Sidebar";
import useSEO from "../../hooks/useSEO";

const SellerMessages = () => {
	// SEO Implementation - Private seller messages, should not be indexed
	useSEO({
		title: "Messages - Seller Communication | Carbon Cube Kenya",
		description:
			"Manage your customer communications and messages on Carbon Cube Kenya. Respond to inquiries, handle customer support, and maintain relationships with buyers.",
		keywords:
			"seller messages, customer communication, Carbon Cube Kenya, seller support, buyer inquiries",
		url: `${window.location.origin}/seller/messages`,
		robots: "noindex, nofollow, noarchive, nosnippet",
		customMetaTags: [
			{ name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
			{ name: "googlebot", content: "noindex, nofollow" },
			{ name: "bingbot", content: "noindex, nofollow" },
			{ property: "og:robots", content: "noindex, nofollow" },
			{ name: "seller:dashboard_type", content: "messages" },
			{ name: "seller:page_function", content: "customer_communication" },
			{ name: "seller:privacy_level", content: "private" },
		],
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "Seller Messages - Carbon Cube Kenya",
			description: "Private messaging system for seller-buyer communication",
			url: `${window.location.origin}/seller/messages`,
			isPartOf: {
				"@type": "WebSite",
				name: "Carbon Cube Kenya",
				url: "https://carboncube.co.ke",
			},
			audience: {
				"@type": "Audience",
				audienceType: "Sellers",
			},
			accessMode: "private",
			accessModeSufficient: "seller_authentication",
		},
		section: "Seller Dashboard",
		tags: ["Messages", "Communication", "Dashboard", "Private"],
		conversationalKeywords: [
			"how to manage customer messages Carbon Cube Kenya",
			"seller communication tools Kenya",
			"customer support Carbon Cube",
			"seller messaging system",
			"buyer inquiry management",
		],
	});

	return (
		<Messages
			userType="seller"
			apiBaseUrl="/seller/conversations"
			navbarComponent={
				<Navbar mode="seller" showSearch={true} showCategories={true} />
			}
			sidebarComponent={<Sidebar />}
			title="Messages"
			showProductContext={true}
			showOnlineStatus={true}
			showSearch={true}
		/>
	);
};

export default SellerMessages;
