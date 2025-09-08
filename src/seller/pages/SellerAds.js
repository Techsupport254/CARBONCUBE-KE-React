import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTrashCan,
	faStar,
	faPencilAlt,
	faRotateLeft,
	faBox,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Spinner from "react-spinkit";
import Navbar from "../../components/Navbar";
import useSEO from "../../hooks/useSEO";

const SellerAds = () => {
	const [ads, setAds] = useState({ active: [], deleted: [] });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filter, setFilter] = useState("active"); // "active", "all", "deleted"
	const navigate = useNavigate();

	const sellerId = sessionStorage.getItem("sellerId");

	// SEO Implementation - Private seller dashboard, should not be indexed
	useSEO({
		title: "Manage Your Ads - Seller Dashboard | Carbon Cube Kenya",
		description:
			"Manage your product listings and ads on Carbon Cube Kenya. Create, edit, and track your product advertisements from your seller dashboard.",
		keywords:
			"seller dashboard, manage ads, product listings, Carbon Cube Kenya, seller tools, ad management",
		url: `${window.location.origin}/seller/ads`,
		robots: "noindex, nofollow, noarchive, nosnippet",
		customMetaTags: [
			{ name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
			{ name: "googlebot", content: "noindex, nofollow" },
			{ name: "bingbot", content: "noindex, nofollow" },
			{ property: "og:robots", content: "noindex, nofollow" },
			{ name: "seller:dashboard_type", content: "ads_management" },
			{ name: "seller:page_function", content: "manage_product_listings" },
			{ name: "seller:privacy_level", content: "private" },
		],
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "Seller Ads Management - Carbon Cube Kenya",
			description:
				"Private seller dashboard for managing product listings and advertisements",
			url: `${window.location.origin}/seller/ads`,
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
		// Additional SEO features for seller dashboard
		section: "Seller Dashboard",
		tags: ["Seller Tools", "Ad Management", "Dashboard", "Private"],
		conversationalKeywords: [
			"how to manage my ads on Carbon Cube Kenya",
			"seller dashboard Carbon Cube Kenya",
			"manage product listings Kenya",
			"seller tools Carbon Cube",
			"ad management dashboard",
		],
	});

	useEffect(() => {
		const fetchAds = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/seller/ads?seller_id=${sellerId}`,
					{
						headers: {
							Authorization: "Bearer " + sessionStorage.getItem("token"),
						},
					}
				);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json();

				// Sort ads by creation date (newest first)
				const sortByNewest = (ads) => {
					return ads.sort((a, b) => {
						const dateA = new Date(a.created_at || a.createdAt || 0);
						const dateB = new Date(b.created_at || b.createdAt || 0);
						return dateB - dateA; // Newest first
					});
				};

				setAds({
					active: sortByNewest(data.active_ads || []),
					deleted: sortByNewest(data.deleted_ads || []),
				});
			} catch (error) {
				console.error("Error fetching ads:", error);
				setError("Error fetching ads");
			} finally {
				setLoading(false);
			}
		};

		fetchAds();
	}, [sellerId]);

	const handleViewDetailsClick = (ad) => {
		navigate(`/seller/ads/${ad.id}`);
	};

	const handleEditAd = (adId) => {
		// Prevent editing of deleted ads
		if (ads.deleted.some((p) => p.id === adId)) {
			alert("You cannot edit a deleted ad.");
			return;
		}

		// Navigate to edit page
		navigate(`/seller/ads/${adId}/edit`);
	};

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	// Get filtered ads based on current filter
	const getFilteredAds = () => {
		let adsToFilter = [];
		switch (filter) {
			case "active":
				adsToFilter = ads.active;
				break;
			case "deleted":
				adsToFilter = ads.deleted;
				break;
			case "all":
				adsToFilter = [...ads.active, ...ads.deleted];
				break;
			default:
				adsToFilter = ads.active;
		}

		return adsToFilter.filter((ad) =>
			ad.title.toLowerCase().includes(searchTerm.toLowerCase())
		);
	};

	const filteredAds = getFilteredAds();

	const handleRestoreAd = async (adId) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/seller/ads/${adId}/restore`,
				{
					method: "PUT", // or POST depending on your API
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			if (!response.ok) throw new Error("Failed to restore ad");

			const restoredAd = await response.json();

			setAds((prev) => ({
				active: [restoredAd, ...prev.active],
				deleted: prev.deleted.filter((a) => a.id !== adId),
			}));
		} catch (error) {
			console.error("Restore failed:", error);
			alert("Failed to restore ad.");
		}
	};

	const renderAdCard = (ad) => (
		<div key={ad.id} className="group h-full">
			<div
				className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col cursor-pointer"
				onClick={() => handleViewDetailsClick(ad)}
			>
				{/* Image Section */}
				<div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden flex-shrink-0">
					{ad.media && ad.media.length > 0 ? (
						<img
							src={ad.media[0]}
							alt={ad.title}
							className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
						/>
					) : (
						<div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-200">
							<div className="text-gray-400 group-hover:text-gray-500 transition-colors duration-200">
								<svg
									width="48"
									height="48"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="mb-2"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
									<circle cx="8.5" cy="8.5" r="1.5" />
									<polyline points="21,15 16,10 5,21" />
								</svg>
							</div>
							<div className="text-xs text-gray-500 font-medium text-center px-2">
								No Image
							</div>
						</div>
					)}

					{/* Condition Badge - Top Left */}
					{ad.condition && (
						<div className="absolute top-2 left-2">
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
									ad.condition === "brand_new"
										? "bg-green-100 text-green-800"
										: ad.condition === "second_hand"
										? "bg-red-100 text-red-800"
										: ad.condition === "refurbished"
										? "bg-blue-100 text-blue-800"
										: "bg-gray-100 text-gray-800"
								}`}
							>
								{ad.condition === "brand_new"
									? "Brand New"
									: ad.condition === "second_hand"
									? "Second Hand"
									: ad.condition === "refurbished"
									? "Refurbished"
									: ad.condition}
							</span>
						</div>
					)}

					{/* Average Rating Badge - Top Right */}
					{ad.mean_rating && ad.mean_rating > 0 && (
						<div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center gap-1">
							<FontAwesomeIcon
								icon={faStar}
								className="text-xs text-yellow-400"
							/>
							<span className="text-xs text-gray-600 font-medium">
								{ad.mean_rating.toFixed(1)}
							</span>
						</div>
					)}

					{/* Deleted Overlay */}
					{ads.deleted.some((p) => p.id === ad.id) && (
						<div className="absolute inset-0 bg-red-500 bg-opacity-80 flex items-center justify-center">
							<div className="text-white text-center">
								<FontAwesomeIcon icon={faTrashCan} className="text-3xl mb-2" />
								<div className="text-lg font-bold uppercase">Deleted</div>
							</div>
						</div>
					)}

					{/* Action Buttons Overlay */}
					<div
						className="absolute bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
						style={{ zIndex: 10 }}
					>
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleEditAd(ad.id);
							}}
							className="w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-sm transition-all duration-200"
							title="Edit Ad"
						>
							<FontAwesomeIcon
								icon={faPencilAlt}
								className="text-gray-600 text-sm"
							/>
						</button>
						{ads.deleted.some((p) => p.id === ad.id) ? (
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleRestoreAd(ad.id);
								}}
								className="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-sm transition-all duration-200"
								title="Restore Ad"
							>
								<FontAwesomeIcon
									icon={faRotateLeft}
									className="text-white text-sm"
								/>
							</button>
						) : (
							<button
								onClick={(e) => {
									e.stopPropagation();
									// TODO: Implement delete functionality
									alert("Delete functionality not implemented yet");
								}}
								className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-sm transition-all duration-200"
								title="Delete Ad"
							>
								<FontAwesomeIcon
									icon={faTrashCan}
									className="text-white text-sm"
								/>
							</button>
						)}
					</div>

					{/* Media Count Badge */}
					{ad.media && ad.media.length > 1 && (
						<div
							className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full"
							style={{ zIndex: 10 }}
						>
							{ad.media.length} photos
						</div>
					)}
				</div>

				{/* Content Section */}
				<div className="p-2 sm:p-3 flex flex-col flex-grow">
					{/* Title */}
					<h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2 group-hover:text-yellow-600 transition-colors duration-200 flex-grow">
						{ad.title}
					</h3>

					{/* Price */}
					<div className="flex items-center justify-between">
						<span className="text-sm sm:text-base font-bold text-green-600">
							Kshs {parseFloat(ad.price).toLocaleString()}
						</span>
						{ad.quantity && (
							<span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
								Qty: {ad.quantity}
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);

	if (loading) {
		return (
			<div className="centered-loader">
				<Spinner
					variant="warning"
					name="cube-grid"
					style={{ width: 100, height: 100 }}
				/>
			</div>
		);
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<>
			<div className="min-h-screen bg-gray-50">
				<Navbar mode="seller" showSearch={false} showCategories={false} />
				<div className="flex">
					<div className="flex-1">
						<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6">
							{/* Header Section */}
							<div className="mb-4 sm:mb-6">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
									<div>
										<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
											Manage Your Ads
										</h1>
										<p className="text-sm sm:text-base text-gray-600 mt-1">
											Create, edit, and manage your product listings
										</p>
									</div>
									<button
										onClick={() => navigate("/seller/add-ad")}
										className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
									>
										<FontAwesomeIcon icon={faPencilAlt} className="text-sm" />
										Add New Ad
									</button>
								</div>
							</div>

							{/* Search and Filter Section */}
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
								<div className="flex flex-col lg:flex-row gap-3">
									{/* Search Bar */}
									<div className="flex-1">
										<div className="relative">
											<input
												type="text"
												placeholder="Search your ads..."
												value={searchTerm}
												onChange={handleSearchChange}
												className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
											/>
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<FontAwesomeIcon
													icon={faPencilAlt}
													className="h-4 w-4 text-gray-400"
												/>
											</div>
										</div>
									</div>

									{/* Filter Buttons */}
									<div className="flex gap-2">
										<button
											onClick={() => setFilter("active")}
											className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
												filter === "active"
													? "bg-green-100 text-green-800 border border-green-300"
													: "bg-gray-100 text-gray-600 hover:bg-gray-200"
											}`}
										>
											Active ({ads.active.length})
										</button>
										<button
											onClick={() => setFilter("all")}
											className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
												filter === "all"
													? "bg-blue-100 text-blue-800 border border-blue-300"
													: "bg-gray-100 text-gray-600 hover:bg-gray-200"
											}`}
										>
											All ({ads.active.length + ads.deleted.length})
										</button>
										<button
											onClick={() => setFilter("deleted")}
											className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
												filter === "deleted"
													? "bg-red-100 text-red-800 border border-red-300"
													: "bg-gray-100 text-gray-600 hover:bg-gray-200"
											}`}
										>
											Deleted ({ads.deleted.length})
										</button>
									</div>
								</div>
							</div>

							{/* Ads Section */}
							<div className="mb-6">
								<div className="flex items-center justify-between mb-3">
									<h2 className="text-lg sm:text-xl font-semibold text-gray-900">
										{filter === "active" &&
											`Active Ads (${filteredAds.length})`}
										{filter === "deleted" &&
											`Deleted Ads (${filteredAds.length})`}
										{filter === "all" && `All Ads (${filteredAds.length})`}
									</h2>
									<div className="h-px bg-gray-200 flex-1 mx-3"></div>
								</div>

								{filteredAds.length > 0 ? (
									<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
										{filteredAds.map(renderAdCard)}
									</div>
								) : (
									<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
										<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
											<FontAwesomeIcon
												icon={faBox}
												className="text-2xl text-gray-400"
											/>
										</div>
										<h3 className="text-lg font-medium text-gray-900 mb-2">
											{filter === "active" && "No active ads found"}
											{filter === "deleted" && "No deleted ads found"}
											{filter === "all" && "No ads found"}
										</h3>
										<p className="text-gray-500 mb-4">
											{filter === "active" &&
												"Start by creating your first ad to showcase your products."}
											{filter === "deleted" &&
												"You haven't deleted any ads yet."}
											{filter === "all" && "You don't have any ads yet."}
										</p>
										{filter === "active" && (
											<button
												onClick={() => navigate("/seller/add-ad")}
												className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
											>
												<FontAwesomeIcon
													icon={faPencilAlt}
													className="text-sm"
												/>
												Create Your First Ad
											</button>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default SellerAds;
