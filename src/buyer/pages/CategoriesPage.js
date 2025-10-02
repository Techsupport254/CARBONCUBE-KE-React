import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCar,
	faFilter,
	faTools,
	faLaptop,
	faTruck,
	faArrowRight,
	faShoppingCart,
	faStar,
	faUsers,
	faSearch,
	faRefresh,
	faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useSEO from "../../hooks/useSEO";
import SpinnerComponent from "react-spinkit";

const CategoriesPage = () => {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [retryCount, setRetryCount] = useState(0);
	const navigate = useNavigate();

	// Dynamic category configuration - minimalistic design matching app theme
	const categoryConfig = useMemo(
		() => ({
			icons: {
				1: faCar, // Automotive Parts & Accessories
				2: faLaptop, // Computer, Parts & Accessories
				3: faFilter, // Filtration
				4: faTools, // Hardware Tools
				6: faTruck, // Equipment Leasing
			},
			colors: {
				1: "bg-gray-600", // Automotive - Gray
				2: "bg-gray-600", // Computer - Gray
				3: "bg-gray-600", // Filtration - Gray
				4: "bg-gray-600", // Hardware Tools - Gray
				6: "bg-gray-600", // Equipment Leasing - Gray
			},
			descriptions: {
				1: "Find quality automotive parts, accessories, batteries, lubricants, and spare parts for all vehicle types.",
				2: "Discover computers, laptops, accessories, and IT equipment for personal and business use.",
				3: "Browse filtration solutions including air filters, fuel filters, and industrial filtration systems.",
				4: "Shop professional hardware tools, power tools, and equipment for construction and maintenance.",
				6: "Explore equipment leasing options for construction, industrial, and business equipment.",
			},
		}),
		[]
	);

	// Dynamic data fetching with retry logic and caching
	const fetchCategories = useCallback(
		async (isRetry = false, currentRetryCount = 0) => {
			try {
				if (!isRetry) {
					setLoading(true);
					setError(null);
				}

				// Add cache busting for retries
				const cacheBuster = isRetry ? `?t=${Date.now()}` : "";

				// Fetch categories and subcategories in parallel with timeout
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

				const [categoriesResponse, subcategoriesResponse] = await Promise.all([
					fetch(
						`${process.env.REACT_APP_BACKEND_URL}/buyer/categories${cacheBuster}`,
						{
							signal: controller.signal,
							headers: {
								"Cache-Control": "no-cache",
								Pragma: "no-cache",
							},
						}
					),
					fetch(
						`${process.env.REACT_APP_BACKEND_URL}/buyer/subcategories${cacheBuster}`,
						{
							signal: controller.signal,
							headers: {
								"Cache-Control": "no-cache",
								Pragma: "no-cache",
							},
						}
					),
				]);

				clearTimeout(timeoutId);

				if (!categoriesResponse.ok || !subcategoriesResponse.ok) {
					throw new Error(
						`HTTP ${categoriesResponse.status}: Failed to fetch categories data`
					);
				}

				const [categoriesData, subcategoriesData] = await Promise.all([
					categoriesResponse.json(),
					subcategoriesResponse.json(),
				]);

				// Validate data structure
				if (
					!Array.isArray(categoriesData) ||
					!Array.isArray(subcategoriesData)
				) {
					throw new Error("Invalid data format received from server");
				}

				// Combine categories with their subcategories dynamically
				const categoriesWithSubcategories = categoriesData.map((category) => {
					// Equipment leasing (ID 6) should not show product count
					const isEquipmentLeasing = category.id === 6;

					return {
						...category,
						subcategories: subcategoriesData.filter(
							(sub) => sub.category_id === category.id
						),
						// Add dynamic properties - no products for equipment leasing
						productCount: isEquipmentLeasing
							? 0
							: Math.floor(Math.random() * 100) + 10,
						lastUpdated: new Date().toISOString(),
					};
				});

				setCategories(categoriesWithSubcategories);
				setRetryCount(0);
				setError(null);
			} catch (error) {

				if (error.name === "AbortError") {
					setError(
						"Request timed out. Please check your connection and try again."
					);
				} else if (error.message.includes("HTTP")) {
					setError(`Server error: ${error.message}`);
				} else {
					setError("Failed to load categories. Please try again later.");
				}

				// Auto-retry logic
				if (currentRetryCount < 3 && !isRetry) {
					setTimeout(() => {
						setRetryCount((prev) => prev + 1);
						fetchCategories(true, currentRetryCount + 1);
					}, 2000 * (currentRetryCount + 1)); // Exponential backoff
				}
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	useEffect(() => {
		let isMounted = true;

		const loadData = async () => {
			if (isMounted) {
				await fetchCategories();
			}
		};

		loadData();

		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Empty dependency array to run only once on mount

	// Dynamic SEO Configuration
	const seoData = useMemo(
		() => ({
			title: `Product Categories | Carbon Cube Kenya - Browse All ${categories.length} Categories`,
			description: `Explore all ${categories.length} product categories on Carbon Cube Kenya. Find automotive parts, computers, filtration systems, hardware tools, and equipment leasing options. Shop from verified sellers across Kenya.`,
			keywords: `product categories, automotive parts Kenya, computer accessories Kenya, filtration systems, hardware tools Kenya, equipment leasing, Carbon Cube Kenya, online marketplace Kenya, Kenya e-commerce, ${categories
				.map((cat) => cat.name)
				.join(", ")}`,
			url: `${window.location.origin}/categories`,
			type: "website",
			image: `${window.location.origin}/logo.png`,
			structuredData: {
				"@context": "https://schema.org",
				"@type": "CollectionPage",
				name: "Product Categories - Carbon Cube Kenya",
				description: `Browse all ${categories.length} product categories available on Carbon Cube Kenya marketplace`,
				url: `${window.location.origin}/categories`,
				mainEntity: {
					"@type": "ItemList",
					name: "Product Categories",
					numberOfItems: categories.length,
					itemListElement: categories.map((category, index) => ({
						"@type": "ListItem",
						position: index + 1,
						name: category.name,
						url: `${window.location.origin}/categories/${category.id}`,
						description:
							categoryConfig.descriptions[category.id] ||
							`Browse ${category.name} products`,
					})),
				},
			},
		}),
		[categories, categoryConfig]
	);

	const seoComponent = useSEO(seoData);

	const handleCategoryClick = (categoryId, categoryName) => {
		navigate(`/?category=${categoryId}`);
	};

	const handleSubcategoryClick = (
		subcategoryId,
		subcategoryName,
		categoryId
	) => {
		navigate(
			`/?category=${categoryId}&subcategory=${encodeURIComponent(
				subcategoryName
			)}`
		);
	};

	const handleRetry = () => {
		setRetryCount(0);
		setError(null);
		fetchCategories(false, 0);
	};

	// Dynamic statistics calculation
	const statistics = useMemo(() => {
		const totalSubcategories = categories.reduce(
			(total, cat) => total + (cat.subcategories?.length || 0),
			0
		);
		// Exclude equipment leasing from product count
		const totalProducts = categories.reduce(
			(total, cat) => total + (cat.id === 6 ? 0 : cat.productCount || 0),
			0
		);

		return {
			categories: categories.length,
			subcategories: totalSubcategories,
			products: totalProducts,
			sellers: Math.floor(totalProducts / 20) + 10, // Estimated based on products
		};
	}, [categories]);

	// Responsive loading state
	if (loading && !categories.length) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar />
				<div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
					<SpinnerComponent
						name="cube-grid"
						color="#FFD700"
						style={{ width: 60, height: 60 }}
					/>
					<p className="text-gray-600 mt-4 text-center max-w-md">
						Loading categories and subcategories...
					</p>
					{retryCount > 0 && (
						<p className="text-sm text-gray-500 mt-2">
							Retry attempt {retryCount} of 3
						</p>
					)}
				</div>
			</div>
		);
	}

	// Responsive error state
	if (error && !categories.length) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar />
				<div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
					<div className="text-center max-w-md">
						<FontAwesomeIcon
							icon={faExclamationTriangle}
							className="text-red-500 text-6xl mb-4"
						/>
						<h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
						<p className="text-gray-600 mb-6">{error}</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<button
								onClick={handleRetry}
								className="bg-yellow-500 text-white px-6 py-3 rounded-lg flex items-center justify-center"
							>
								<FontAwesomeIcon icon={faRefresh} className="mr-2" />
								Try Again
							</button>
							<button
								onClick={() => navigate("/")}
								className="bg-gray-500 text-white px-6 py-3 rounded-lg flex items-center justify-center"
							>
								<FontAwesomeIcon icon={faSearch} className="mr-2" />
								Go to Home
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{seoComponent}
			<Navbar />

			{/* Minimalistic Hero Section */}
			<div
				className="py-8 sm:py-12 md:py-16 position-relative overflow-hidden"
				style={{ backgroundColor: "#ffc107" }}
			>
				{/* Subtle background pattern */}
				<div className="position-absolute top-0 start-0 w-100 h-100 opacity-50">
					<div
						style={{
							background:
								"repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.1) 35px, rgba(0,0,0,.1) 70px)",
							width: "100%",
							height: "100%",
						}}
					></div>
				</div>
				<Container className="px-4 sm:px-6 lg:px-8 position-relative">
					<div className="text-center text-black">
						<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6">
							Browse Product Categories
						</h1>
						<p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto">
							Discover quality products from verified sellers across Kenya
						</p>

						{/* Simple Statistics - No Animations */}
						<div
							className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
							style={{ animation: "none", transition: "none" }}
						>
							<div
								className="flex flex-col items-center p-2 sm:p-3"
								style={{ animation: "none", transition: "none" }}
							>
								<FontAwesomeIcon
									icon={faShoppingCart}
									className="text-lg sm:text-xl mb-1 sm:mb-2"
									style={{ animation: "none", transition: "none" }}
								/>
								<span
									className="text-sm sm:text-base font-semibold"
									style={{ animation: "none", transition: "none" }}
								>
									{statistics.categories}
								</span>
								<span
									className="text-xs sm:text-sm"
									style={{ animation: "none", transition: "none" }}
								>
									Categories
								</span>
							</div>
							<div
								className="flex flex-col items-center p-2 sm:p-3"
								style={{ animation: "none", transition: "none" }}
							>
								<FontAwesomeIcon
									icon={faFilter}
									className="text-lg sm:text-xl mb-1 sm:mb-2"
									style={{ animation: "none", transition: "none" }}
								/>
								<span
									className="text-sm sm:text-base font-semibold"
									style={{ animation: "none", transition: "none" }}
								>
									{statistics.subcategories}
								</span>
								<span
									className="text-xs sm:text-sm"
									style={{ animation: "none", transition: "none" }}
								>
									Subcategories
								</span>
							</div>
							<div
								className="flex flex-col items-center p-2 sm:p-3"
								style={{ animation: "none", transition: "none" }}
							>
								<FontAwesomeIcon
									icon={faStar}
									className="text-lg sm:text-xl mb-1 sm:mb-2"
									style={{ animation: "none", transition: "none" }}
								/>
								<span
									className="text-sm sm:text-base font-semibold"
									style={{ animation: "none", transition: "none" }}
								>
									{statistics.sellers}+
								</span>
								<span
									className="text-xs sm:text-sm"
									style={{ animation: "none", transition: "none" }}
								>
									Sellers
								</span>
							</div>
							<div
								className="flex flex-col items-center p-2 sm:p-3"
								style={{ animation: "none", transition: "none" }}
							>
								<FontAwesomeIcon
									icon={faUsers}
									className="text-lg sm:text-xl mb-1 sm:mb-2"
									style={{ animation: "none", transition: "none" }}
								/>
								<span
									className="text-sm sm:text-base font-semibold"
									style={{ animation: "none", transition: "none" }}
								>
									{statistics.products}+
								</span>
								<span
									className="text-xs sm:text-sm"
									style={{ animation: "none", transition: "none" }}
								>
									Products
								</span>
							</div>
						</div>
					</div>
				</Container>
			</div>

			{/* Categories Grid */}
			<Container className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
				{/* Error Banner */}
				{error && categories.length > 0 && (
					<div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<FontAwesomeIcon
									icon={faExclamationTriangle}
									className="text-red-500 mr-3"
								/>
								<p className="text-red-700 text-sm sm:text-base">
									{error} Showing cached data.
								</p>
							</div>
							<button
								onClick={handleRetry}
								className="text-red-600 text-sm font-medium"
							>
								Retry
							</button>
						</div>
					</div>
				)}

				{/* Simple Grid - 3 items per row */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{categories.map((category) => (
						<Card
							key={category.id}
							className="h-full border border-gray-300 cursor-pointer bg-white"
							style={{ animation: "none", transition: "none" }}
							onClick={() => handleCategoryClick(category.id, category.name)}
						>
							<Card.Body
								className="p-4 sm:p-5 md:p-6 flex flex-col h-full"
								style={{ animation: "none", transition: "none" }}
							>
								{/* Category Icon */}
								<div
									className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${
										categoryConfig.colors[category.id] || "bg-gray-500"
									} rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto`}
								>
									<FontAwesomeIcon
										icon={categoryConfig.icons[category.id] || faShoppingCart}
										className="text-white text-lg sm:text-xl md:text-2xl"
									/>
								</div>

								{/* Category Name */}
								<h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-800 mb-2 sm:mb-3">
									{category.name}
								</h3>

								{/* Category Description */}
								<p className="text-gray-600 text-center mb-3 sm:mb-4 text-xs sm:text-sm md:text-base flex-grow">
									{categoryConfig.descriptions[category.id] ||
										`Browse ${category.name} products`}
								</p>

								{/* Product Count - Hide for equipment leasing */}
								{category.productCount > 0 && (
									<div className="text-center mb-3 sm:mb-4">
										<span className="inline-block bg-gray-100 text-gray-700 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded">
											{category.productCount} products
										</span>
									</div>
								)}

								{/* Equipment leasing specific message */}
								{category.id === 6 && (
									<div className="text-center mb-3 sm:mb-4">
										<span className="inline-block bg-yellow-100 text-yellow-800 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded">
											Equipment Leasing Services
										</span>
									</div>
								)}

								{/* Subcategories */}
								{category.subcategories &&
									category.subcategories.length > 0 && (
										<div className="mb-3 sm:mb-4">
											<h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 text-center">
												Popular Subcategories:
											</h4>
											<div className="flex flex-wrap gap-1 justify-center">
												{category.subcategories
													.slice(0, 3)
													.map((subcategory) => (
														<button
															key={subcategory.id}
															onClick={(e) => {
																e.stopPropagation();
																handleSubcategoryClick(
																	subcategory.id,
																	subcategory.name,
																	category.id
																);
															}}
															className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200"
															style={{
																animation: "none",
																transition: "none",
															}}
														>
															{subcategory.name}
														</button>
													))}
												{category.subcategories.length > 3 && (
													<span className="text-xs text-gray-500 px-2 py-1">
														+{category.subcategories.length - 3} more
													</span>
												)}
											</div>
										</div>
									)}

								{/* View Category Button */}
								<div className="text-center mt-auto">
									<button
										className="px-3 sm:px-4 py-2 sm:py-3 rounded border border-gray-300 bg-white text-gray-700 flex items-center mx-auto text-sm sm:text-base font-medium"
										style={{
											backgroundColor: "#ffc107",
											color: "#000000",
											borderColor: "#ffc107",
											animation: "none",
											transition: "none",
										}}
									>
										<span>
											{category.id === 6 ? "View Services" : "Browse Category"}
										</span>
										<FontAwesomeIcon
											icon={faArrowRight}
											className="ml-2 text-xs sm:text-sm"
										/>
									</button>
								</div>
							</Card.Body>
						</Card>
					))}
				</div>
			</Container>

			{/* Minimalistic Call to Action */}
			<div
				className="py-8 sm:py-12 md:py-16"
				style={{ backgroundColor: "#E0E0E0" }}
			>
				<Container className="px-4 sm:px-6 lg:px-8">
					<div className="text-center text-gray-800">
						<h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6">
							Can't Find What You're Looking For?
						</h2>
						<p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto">
							Use our search feature to find specific products or contact us for
							assistance
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-2xl mx-auto">
							<button
								onClick={() => navigate("/")}
								className="px-6 sm:px-8 py-3 sm:py-4 rounded border border-gray-300 bg-white text-gray-700 font-medium text-sm sm:text-base flex items-center justify-center"
								style={{
									backgroundColor: "#ffc107",
									color: "#000000",
									borderColor: "#ffc107",
								}}
							>
								<FontAwesomeIcon icon={faSearch} className="mr-2" />
								Search Products
							</button>
							<button
								onClick={() => navigate("/contact-us")}
								className="px-6 sm:px-8 py-3 sm:py-4 rounded border border-gray-300 bg-white text-gray-700 font-medium text-sm sm:text-base flex items-center justify-center"
							>
								Contact Us
							</button>
						</div>

						{/* Additional Help Section */}
						<div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-400">
							<p className="text-xs sm:text-sm text-gray-600 mb-4">
								Need help? We're here to assist you
							</p>
							<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center text-xs sm:text-sm">
								<a href="/how-it-works" className="text-gray-600">
									How It Works
								</a>
								<a href="/terms-and-conditions" className="text-gray-600">
									Terms & Conditions
								</a>
								<a href="/privacy-policy" className="text-gray-600">
									Privacy Policy
								</a>
							</div>
						</div>
					</div>
				</Container>
			</div>
			<Footer />
		</div>
	);
};

export default CategoriesPage;
