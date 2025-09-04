import React, { useState, useEffect } from "react";
import { createSlug } from "../../utils/slugUtils";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { getAdImageUrl, getFallbackImage } from "../../utils/imageUtils";
import {
	getBorderColor,
	getTierName,
	getTierId,
} from "../utils/sellerTierUtils";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useSEO from "../../hooks/useSEO";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";

const ShopPage = () => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const [shop, setShop] = useState(null);
	const [ads, setAds] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [showShareSuccess, setShowShareSuccess] = useState(false);

	const handleShareShop = async () => {
		if (!shop) {
			// Don't share if shop data isn't loaded yet
			return;
		}

		const shopUrl = `${window.location.origin}/shop/${slug}`;
		const shopTitle = `${shop.enterprise_name} - Shop on CarbonCube Kenya`;
		const shopDescription = `Check out ${shop.enterprise_name} on CarbonCube Kenya! Browse ${shop.product_count} products.`;

		try {
			if (navigator.share) {
				// Use native sharing if available (mobile)
				await navigator.share({
					title: shopTitle,
					text: shopDescription,
					url: shopUrl,
				});
			} else {
				// Fallback to clipboard copy
				await navigator.clipboard.writeText(shopUrl);
				setShowShareSuccess(true);
				setTimeout(() => setShowShareSuccess(false), 2000);
			}
		} catch (error) {
			console.error("Error sharing:", error);
			// Fallback to clipboard copy
			try {
				await navigator.clipboard.writeText(shopUrl);
				setShowShareSuccess(true);
				setTimeout(() => setShowShareSuccess(false), 2000);
			} catch (clipboardError) {
				console.error("Error copying to clipboard:", clipboardError);
			}
		}
	};

	// SEO Implementation
	useSEO({
		title: shop
			? `${shop.enterprise_name} - Shop on CarbonCube Kenya`
			: "Shop - CarbonCube Kenya",
		description: shop
			? `Browse ${shop.product_count} products from ${shop.enterprise_name}. ${
					shop.description ||
					`Discover quality items from ${shop.enterprise_name} on CarbonCube Kenya's marketplace.`
			  }`
			: "Browse shops and products on CarbonCube Kenya's marketplace",
		keywords: shop
			? `${shop.enterprise_name}, online shop, marketplace, CarbonCube Kenya, ${shop.tier} seller, ${shop.product_count} products`
			: "online marketplace Kenya, trusted sellers, secure ecommerce",
		image: shop?.profile_picture
			? shop.profile_picture.startsWith("http")
				? shop.profile_picture
				: `https://carboncube-ke.com${shop.profile_picture}`
			: "https://carboncube-ke.com/logo.png",
		url: `https://carboncube-ke.com/shop/${slug}`,
		type: "website",
		structuredData: shop
			? {
					"@context": "https://schema.org",
					"@type": "Store",
					name: shop.enterprise_name,
					description:
						shop.description || `Online shop on CarbonCube Kenya marketplace`,
					url: `https://carboncube-ke.com/shop/${slug}`,
					image: shop.profile_picture
						? shop.profile_picture.startsWith("http")
							? shop.profile_picture
							: `https://carboncube-ke.com${shop.profile_picture}`
						: "https://carboncube-ke.com/logo.png",
					address: shop.address
						? {
								"@type": "PostalAddress",
								addressLocality: "Kenya",
								addressCountry: "KE",
						  }
						: undefined,
					numberOfItems: shop.product_count,
					priceRange: "$$",
					aggregateRating: {
						"@type": "AggregateRating",
						ratingValue: "4.5",
						reviewCount: "100+",
					},
					sameAs: [
						"https://www.linkedin.com/company/carbon-cube-kenya/",
						"https://www.facebook.com/profile.php?id=61574066312678",
						"https://www.instagram.com/carboncube_kenya/",
					],
			  }
			: null,
		additionalStructuredData: shop
			? [
					{
						"@context": "https://schema.org",
						"@type": "BreadcrumbList",
						itemListElement: [
							{
								"@type": "ListItem",
								position: 1,
								name: "Home",
								item: "https://carboncube-ke.com",
							},
							{
								"@type": "ListItem",
								position: 2,
								name: "Shops",
								item: "https://carboncube-ke.com/shops",
							},
							{
								"@type": "ListItem",
								position: 3,
								name: shop.enterprise_name,
								item: `https://carboncube-ke.com/shop/${slug}`,
							},
						],
					},
			  ]
			: [],
	});

	useEffect(() => {
		const fetchShopData = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/shop/${slug}?page=${currentPage}&per_page=20`,
					{
						headers: {
							Authorization: "Bearer " + sessionStorage.getItem("token"),
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch shop data");
				}

				const data = await response.json();
				setShop(data.shop);
				setAds(data.ads);
				setHasMore(data.pagination.current_page < data.pagination.total_pages);
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchShopData();
	}, [slug, currentPage]);

	const handleAdClick = (adId) => {
		navigate(`/ads/${adId}`);
	};

	const handleLoadMore = () => {
		setCurrentPage((prev) => prev + 1);
	};

	const handleBackToSearch = () => {
		navigate(-1);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
						<p className="text-gray-600 mb-4">{error}</p>
						<Button onClick={handleBackToSearch} variant="warning">
							← Back to Search
						</Button>
					</div>
				</div>
			</div>
		);
	}

	if (!shop) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-900 mb-4">
							Shop Not Found
						</h1>
						<Button onClick={handleBackToSearch} variant="warning">
							← Back to Search
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar
				mode="buyer"
				showSearch={true}
				showCategories={true}
				showUserMenu={true}
				showCart={true}
				showWishlist={true}
			/>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					{/* Breadcrumb */}
					<nav className="text-sm text-gray-500 mb-4">
						<span
							onClick={() => navigate("/")}
							className="cursor-pointer hover:text-yellow-600 transition-colors"
						>
							Home
						</span>
						<span className="mx-2">›</span>
						<span className="text-gray-700 font-medium">
							{shop.enterprise_name}
						</span>
					</nav>

					{/* Shop Info */}
					<div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
						<div className="flex items-center mb-4">
							{shop.profile_picture ? (
								<img
									src={shop.profile_picture}
									alt={shop.enterprise_name}
									className="w-16 h-16 rounded-full object-cover mr-4"
									onError={(e) => {
										e.target.style.display = "none";
									}}
								/>
							) : (
								<div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
									<svg
										className="w-8 h-8 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
										/>
									</svg>
								</div>
							)}
							<div className="flex-1">
								<h1 className="text-2xl font-bold text-gray-900 mb-2">
									{shop.enterprise_name}
								</h1>
								<div className="flex items-center gap-2">
									<span
										className={`text-sm px-3 py-1 rounded-full font-medium ${
											shop.tier_id === 4
												? "bg-purple-100 text-purple-800"
												: shop.tier_id === 3
												? "bg-blue-100 text-blue-800"
												: shop.tier_id === 2
												? "bg-green-100 text-green-800"
												: "bg-gray-100 text-gray-800"
										}`}
									>
										{shop.tier}
									</span>
									<span className="text-sm text-gray-500">
										{shop.product_count} products
									</span>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={handleShareShop}
									disabled={!shop}
									className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
								>
									{showShareSuccess ? (
										<>
											<FontAwesomeIcon
												icon={faCheck}
												className="text-green-400"
											/>
											<span>Copied!</span>
										</>
									) : (
										<>
											<FontAwesomeIcon icon={faShare} />
											<span>Share Shop</span>
										</>
									)}
								</button>
							</div>
						</div>

						{shop.description && (
							<p className="text-gray-600 mb-4">{shop.description}</p>
						)}

						{shop.address && (
							<div className="text-sm text-gray-500">📍 {shop.address}</div>
						)}
					</div>

					{/* Products */}
					<div className="mb-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							Products ({shop.product_count})
						</h2>

						{ads.length === 0 ? (
							<div className="text-center py-8">
								<div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
									<svg
										className="w-8 h-8 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
										/>
									</svg>
								</div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									No Products Available
								</h3>
								<p className="text-gray-500">
									This shop doesn't have any products listed yet.
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
								{ads.map((ad) => (
									<div
										key={ad.id}
										className="group cursor-pointer transition-transform hover:scale-105 h-full"
										onClick={() => handleAdClick(ad.id)}
									>
										<div className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-200 hover:border-yellow-300 h-full flex flex-col">
											{/* Product Image */}
											<div className="relative flex-shrink-0">
												<img
													src={
														ad.first_media_url
															? ad.first_media_url.replace(/\n/g, "").trim()
															: ad.media_urls &&
															  Array.isArray(ad.media_urls) &&
															  ad.media_urls.length > 0
															? ad.media_urls[0].replace(/\n/g, "").trim()
															: ad.media &&
															  Array.isArray(ad.media) &&
															  ad.media.length > 0
															? ad.media[0].replace(/\n/g, "").trim()
															: getFallbackImage()
													}
													alt={ad.title}
													className="w-full aspect-square object-contain rounded-t-lg"
													loading="lazy"
													onError={(e) => {
														e.target.src = getFallbackImage();
													}}
												/>
												{/* Tier Badge */}
												<div className="absolute top-2 right-2">
													<span
														className={`text-xs px-2 py-1 rounded-full font-medium ${
															getTierId(ad) === 4
																? "bg-purple-100 text-purple-800"
																: getTierId(ad) === 3
																? "bg-blue-100 text-blue-800"
																: getTierId(ad) === 2
																? "bg-green-100 text-green-800"
																: "bg-gray-100 text-gray-800"
														}`}
													>
														{getTierName(ad)}
													</span>
												</div>
											</div>

											{/* Product Info */}
											<div className="p-3 flex-1 flex flex-col">
												<h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
													{ad.title}
												</h3>
												<p className="text-lg font-bold text-yellow-600 mb-2">
													KSh {ad.price?.toLocaleString() || "N/A"}
												</p>
												<div className="mt-auto">
													<p className="text-xs text-gray-500">
														{ad.category_name} › {ad.subcategory_name}
													</p>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						{/* Load More Button */}
						{hasMore && ads.length > 0 && (
							<div className="text-center mt-8">
								<Button
									variant="outline-warning"
									onClick={handleLoadMore}
									className="px-6 py-2"
								>
									Load More Products
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default ShopPage;
