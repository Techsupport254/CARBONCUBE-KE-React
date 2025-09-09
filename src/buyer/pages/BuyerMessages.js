import React from "react";
import Messages from "../../components/Messages";
import Navbar from "../../components/Navbar";
import Sidebar from "../components/Sidebar";
import useSEO from "../../hooks/useSEO";

const BuyerMessages = () => {
	// SEO Implementation - Private user data, should not be indexed
	useSEO({
		title: "My Messages - Carbon Cube Kenya",
		description: "View and manage your messages on Carbon Cube Kenya",
		keywords: "messages, conversations, Carbon Cube Kenya",
		url: `${window.location.origin}/messages`,
		customMetaTags: [
			{ name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
			{ name: "googlebot", content: "noindex, nofollow" },
			{ name: "bingbot", content: "noindex, nofollow" },
			{ property: "og:robots", content: "noindex, nofollow" },
		],
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "My Messages - Carbon Cube Kenya",
			description: "Private user messages page",
			url: `${window.location.origin}/messages`,
			isPartOf: {
				"@type": "WebSite",
				name: "Carbon Cube Kenya",
				url: "https://carboncube.co.ke",
			},
		},
	});

	return (
		<Messages
			userType="buyer"
			apiBaseUrl="/buyer/conversations"
			navbarComponent={
				<Navbar mode="buyer" showSearch={true} showCategories={true} />
			}
			title="Messages"
			showProductContext={true}
			showOnlineStatus={true}
			showSearch={true}
		/>
	);
};

export default BuyerMessages;
