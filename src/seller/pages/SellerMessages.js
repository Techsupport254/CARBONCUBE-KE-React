import React from "react";
import Messages from "../../components/Messages";
import Navbar from "../../components/Navbar";

import useSEO from "../../hooks/useSEO";

const SellerMessages = () => {
	// SEO Implementation - Private seller messages, should not be indexed
	useSEO({
		title: "Messages - Seller Communication | Carbon Cube Kenya",
		description:
			"Manage your customer communications and messages on Carbon Cube Kenya",
		keywords: "seller messages, customer communication, Carbon Cube Kenya",
		url: `${window.location.origin}/seller/messages`,
		customMetaTags: [
			{ name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
			{ name: "googlebot", content: "noindex, nofollow" },
			{ name: "bingbot", content: "noindex, nofollow" },
			{ property: "og:robots", content: "noindex, nofollow" },
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
		},
	});

	return (
		<Messages
			userType="seller"
			apiBaseUrl="/conversations"
			navbarComponent={
				<Navbar mode="seller" showSearch={true} showCategories={true} />
			}
			title="Messages"
			showProductContext={true}
			showOnlineStatus={true}
			showSearch={true}
		/>
	);
};

export default SellerMessages;
