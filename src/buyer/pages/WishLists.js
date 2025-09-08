import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../../components/Navbar";
import useSEO from "../../hooks/useSEO";

const WishList = () => {
	const [wish_lists, setWishLists] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();

	// SEO Implementation - Private user data, should not be indexed
	useSEO({
		title: "My Wishlist - Carbon Cube Kenya",
		description: "View and manage your saved products on Carbon Cube Kenya",
		keywords: "wishlist, saved products, Carbon Cube Kenya",
		url: `${window.location.origin}/wishlist`,
		customMetaTags: [
			{ name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
			{ name: "googlebot", content: "noindex, nofollow" },
			{ name: "bingbot", content: "noindex, nofollow" },
			{ property: "og:robots", content: "noindex, nofollow" },
		],
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "My Wishlist - Carbon Cube Kenya",
			description: "Private user wishlist page",
			url: `${window.location.origin}/wishlist`,
			isPartOf: {
				"@type": "WebSite",
				name: "Carbon Cube Kenya",
				url: "https://carboncube.co.ke",
			},
		},
	});

	const handleSearch = async (e, category = "All", subcategory = "All") => {
		e.preventDefault();
		// For now, just navigate to the main search page with the query
		// You can implement actual search filtering here if needed
		navigate(
			`/?search=${encodeURIComponent(
				searchQuery
			)}&category=${category}&subcategory=${subcategory}`
		);
	};

	useEffect(() => {
		const fetchWishLists = async () => {
			try {
				const token = sessionStorage.getItem("token");
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/buyer/wish_lists`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const data = await response.json();
				// Log the response data
				if (data && Array.isArray(data)) {
					setWishLists(data);
				} else {
					// console.error("Invalid data format:", data);
				}
			} catch (error) {
				// console.error("Error fetching wish_lists:", error);
			}
		};

		fetchWishLists();
	}, []);

	const handleDeleteWishList = async (adId) => {
		try {
			await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/buyer/wish_lists/${adId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem("token")}`,
						"Content-Type": "application/json",
					},
				}
			);
			setWishLists(wish_lists.filter((wish_list) => wish_list.ad.id !== adId));
		} catch (error) {
			// console.error("Error deleting wish_list:", error);
		}
	};

	const handleAdClick = async (adId) => {
		if (!adId) {
			console.error("Invalid adId");
			return;
		}

		try {
			await logClickEvent(adId, "Ad-Click");
			navigate(`/ads/${adId}`);
		} catch (error) {
			console.error("Error logging ad click:", error);
			navigate(`/ads/${adId}`); // Fallback navigation
		}
	};

	// Function to log a click event
	const logClickEvent = async (adId, eventType) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/click_events`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
					body: JSON.stringify({
						ad_id: adId,
						event_type: eventType, // e.g., 'Ad-Click'
					}),
				}
			);

			if (!response.ok) {
				console.warn("Failed to log click event");
			}
		} catch (error) {
			console.error("Error logging click event:", error);
		}
	};

	return (
		<>
			<Navbar
				mode="buyer"
				showSearch={true}
				showCategories={true}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				handleSearch={handleSearch}
			/>
			<div className="min-h-screen bg-gray-50">
				<div className="flex">
					{/* Sidebar */}
					<Sidebar />

					{/* Main Content */}
					<div className="flex-1 p-6">
						<div className="max-w-7xl mx-auto">
							<h2 className="text-2xl font-bold text-gray-800 mb-6">
								Wishlist Ads
							</h2>

							{wish_lists.length === 0 ? (
								<div className="text-center py-12">
									<p className="text-gray-500 text-lg">
										No wishlist ads found.
									</p>
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
									{wish_lists.map((wish_list) => (
										<div
											key={wish_list.ad.id}
											className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-md transition-shadow duration-200"
										>
											<div
												className="relative cursor-pointer"
												onClick={() => handleAdClick(wish_list.ad.id)}
											>
												<img
													src={wish_list.ad.first_media_url}
													alt={wish_list.ad.title}
													className="w-full h-48 object-cover"
												/>
											</div>

											<div className="p-4">
												<div className="flex justify-between items-start">
													<div className="flex-1">
														<h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
															{wish_list.ad.title}
														</h3>
														<div className="flex items-baseline">
															<span className="text-sm text-gray-600 mr-1">
																Kshs:
															</span>
															<span className="text-lg font-bold text-red-600">
																{wish_list.ad.price
																	? parseFloat(wish_list.ad.price)
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
																						</span>
																					) : (
																						<>
																							<span className="text-base">
																								.
																							</span>
																							<span>{part}</span>
																						</>
																					)}
																				</React.Fragment>
																			))
																	: "N/A"}
															</span>
														</div>
													</div>

													<button
														onClick={() =>
															handleDeleteWishList(wish_list.ad.id)
														}
														className="ml-3 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
														aria-label="Delete from wishlist"
													>
														<svg
															className="w-5 h-5"
															fill="currentColor"
															viewBox="0 0 20 20"
														>
															<path
																fillRule="evenodd"
																d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
																clipRule="evenodd"
															/>
														</svg>
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default WishList;
