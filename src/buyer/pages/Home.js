import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import Banner from "../components/Banner";
import Spinner from "react-spinkit";
// import AdDetailsModal from '../components/AdDetailsModal';
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faLinkedinIn,
	faFacebook,
	faInstagram,
	faWhatsapp,
	faBox,
} from "@fortawesome/free-solid-svg-icons";
import {
	faLinkedinIn as faLinkedinInBrand,
	faFacebook as faFacebookBrand,
	faInstagram as faInstagramBrand,
	faWhatsapp as faWhatsappBrand,
} from "@fortawesome/free-brands-svg-icons";
// import "../css/Home.css"; // Removed CSS import
import Footer from "../../components/Footer";

const Home = () => {
	const [categories, setCategories] = useState([]);
	const [ads, setAds] = useState({});
	// const [allAds, setAllAds] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const [searchAttempted, setSearchAttempted] = useState(false);
	const [currentSearchType, setCurrentSearchType] = useState(""); // Track if it's a subcategory search
	const [displayedResults, setDisplayedResults] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const RESULTS_PER_PAGE = 18; // Show 18 items per page (3 rows of 6 items)
	const navigate = useNavigate(); // Initialize useNavigate
	const [isComponentMounted, setIsComponentMounted] = useState(false);

	useEffect(() => {
		const fetchCategoriesAndAds = async () => {
			try {
				// Fetch categories and subcategories without authentication
				const [categoryResponse, subcategoryResponse] = await Promise.all([
					fetch(`${process.env.REACT_APP_BACKEND_URL}/buyer/categories`),
					fetch(`${process.env.REACT_APP_BACKEND_URL}/buyer/subcategories`),
				]);

				if (!categoryResponse.ok || !subcategoryResponse.ok)
					throw new Error("Failed to fetch categories/subcategories");

				const [categoryData, subcategoryData] = await Promise.all([
					categoryResponse.json(),
					subcategoryResponse.json(),
				]);

				// Structure categories with subcategories
				const categoriesWithSubcategories = categoryData.map((category) => ({
					...category,
					subcategories: subcategoryData.filter(
						(sub) => sub.category_id === category.id
					),
				}));

				setCategories(categoriesWithSubcategories);

				// ✅ Fetch all ads with pagination
				const adResponse = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/buyer/ads?per_page=500`,
					{
						headers: {
							Authorization: `Bearer ${sessionStorage.getItem("token")}`,
						},
					}
				);

				if (!adResponse.ok) throw new Error("Failed to fetch ads");

				const adData = await adResponse.json();

				// ✅ Ensure ads are grouped correctly
				setAds(adData);
			} catch (error) {
				console.error("Fetch Error:", error);
				setError("Error fetching data");
			} finally {
				setLoading(false);
			}
		};

		fetchCategoriesAndAds();
	}, []);

	const location = useLocation();

	// Update the useEffect that handles location search to better manage state
	useEffect(() => {
		setIsComponentMounted(true);
		return () => setIsComponentMounted(false);
	}, [isComponentMounted]);

	// Update the search results useEffect to only run when component is mounted
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const query = params.get("query");
		const category = params.get("category");
		const subcategory = params.get("subcategory");

		// Only trigger search if we have actual search parameters
		// Ignore other parameters like 'from', 'utm_source', etc.
		const hasSearchParams =
			query ||
			(category && category !== "All") ||
			(subcategory && subcategory !== "All");

		if (!hasSearchParams) {
			setSearchResults([]);
			setCurrentSearchType("");
			setIsSearching(false);
			return;
		}

		const fetchSearchResults = async () => {
			setIsSearching(true);
			setSearchAttempted(false);
			try {
				const searchQuery = query || "";
				const searchCategory = category || "All";
				const searchSubcategory = subcategory || "All";

				const response = await fetch(
					`${
						process.env.REACT_APP_BACKEND_URL
					}/buyer/ads/search?query=${encodeURIComponent(
						searchQuery
					)}&category=${encodeURIComponent(
						searchCategory
					)}&subcategory=${encodeURIComponent(
						searchSubcategory
					)}&page=1&per_page=20`,
					{
						headers: {
							Authorization: "Bearer " + sessionStorage.getItem("token"),
						},
					}
				);

				if (!response.ok) throw new Error("Failed to fetch search results");

				const results = await response.json();
				if (!results || results.length === 0) {
					setSearchResults([]);
					setDisplayedResults([]);
				} else {
					setSearchResults(results);
					initializeDisplayedResults(results);
				}

				if (searchQuery.trim()) {
					setCurrentSearchType("search");
				} else if (searchSubcategory !== "All") {
					setCurrentSearchType(`subcategory-${searchSubcategory}`);
				} else {
					setCurrentSearchType("category");
				}

				await logAdSearch(searchQuery, searchCategory, searchSubcategory);
			} catch (error) {
				console.error(error);
				setError("Error searching ads");
				setSearchResults([]);
				setSearchAttempted(true);
			} finally {
				setIsSearching(false);
			}
		};

		fetchSearchResults();
	}, [location.search]);

	const handleSidebarToggle = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const handleAdClick = async (adId) => {
		if (!adId) {
			console.error("Invalid adId");
			return;
		}

		try {
			// Log the 'Ad-Click' event before navigating
			await logClickEvent(adId, "Ad-Click");

			// Navigate to the ad details page without replacing current history entry
			// This preserves the back button functionality
			navigate(`/ads/${adId}`);
		} catch (error) {
			console.error("Error logging ad click:", error);

			// Proceed with navigation even if logging fails
			navigate(`/ads/${adId}`);
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

	const handleSearch = (e, category = "All", subcategory = "All") => {
		e.preventDefault();

		// Don't search if query is empty and no category/subcategory filters
		if (!searchQuery.trim() && category === "All" && subcategory === "All") {
			return;
		}

		// Build search URL with proper parameters
		const params = new URLSearchParams();
		if (searchQuery.trim()) {
			params.set("query", searchQuery.trim());
		}
		if (category !== "All") {
			params.set("category", category);
		}
		if (subcategory !== "All") {
			params.set("subcategory", subcategory);
		}

		// Navigate to search results
		navigate(`/?${params.toString()}`);
	};

	// Update handleSubcategoryClick to use URL navigation and handle the search properly
	const handleSubcategoryClick = async (subcategoryName, categoryName) => {
		// Navigate to URL with subcategory parameters
		navigate(
			`/?query=&category=${encodeURIComponent(
				categoryName
			)}&subcategory=${encodeURIComponent(subcategoryName)}`
		);

		// Log the subcategory click
		await logSubcategoryClick(subcategoryName, categoryName);
	};

	// Function to log subcategory clicks
	const logSubcategoryClick = async (subcategory, category) => {
		try {
			const logResponse = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/subcategory_clicks`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
					body: JSON.stringify({
						subcategory: subcategory,
						category: category,
					}),
				}
			);

			if (!logResponse.ok) {
				console.warn("Failed to log subcategory click");
			}
		} catch (logError) {
			console.error("Error logging subcategory click:", logError);
		}
	};

	// Function to clear search results and return to home view
	const handleClearSearch = () => {
		// Use replace to avoid adding to history stack
		navigate("/", { replace: true });
		setSearchResults([]);
		setSearchQuery("");
		setCurrentSearchType("");
		setIsSearching(false);
		setDisplayedResults([]);
		setCurrentPage(1);
		setHasMore(true);
	};

	// Function to load more results
	const handleLoadMore = () => {
		const nextPage = currentPage + 1;
		const startIndex = (nextPage - 1) * RESULTS_PER_PAGE;
		const endIndex = startIndex + RESULTS_PER_PAGE;
		const newResults = searchResults.slice(startIndex, endIndex);

		setDisplayedResults((prev) => [...prev, ...newResults]);
		setCurrentPage(nextPage);
		setHasMore(endIndex < searchResults.length);
	};

	// Function to initialize displayed results when search results change
	const initializeDisplayedResults = (results) => {
		const initialResults = results.slice(0, RESULTS_PER_PAGE);
		setDisplayedResults(initialResults);
		setCurrentPage(1);
		setHasMore(results.length > RESULTS_PER_PAGE);
	};

	// Function to log the ad search
	const logAdSearch = async (query, category, subcategory) => {
		try {
			const logResponse = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/ad_searches`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
					body: JSON.stringify({
						search_term: query,
						category: category,
						subcategory: subcategory,
					}),
				}
			);

			if (!logResponse.ok) {
				console.warn("Failed to log ad search");
			}
		} catch (logError) {
			console.error("Error logging ad search:", logError);
		}
	};

	const getBorderColor = (tierId) => {
		const tierColors = {
			1: "#F0FFF0", // Free (Blue)
			2: "#FF5733", // Basic (Red-Orange)
			3: "#28A745", // Standard (Bright Green)
			4: "#FFC107", // Premium (Gold-like yellow)
		};
		return tierColors[tierId] || "transparent"; // No border color for Free tier
	};

	const CategorySection = ({ title, subcategories }) => {
		// Function to shuffle an array
		const shuffleArray = (array) => {
			return array
				.map((value) => ({ value, sort: Math.random() }))
				.sort((a, b) => a.sort - b.sort)
				.map(({ value }) => value);
		};

		// Shuffle the subcategories before slicing
		const randomizedSubcategories = shuffleArray(subcategories).slice(0, 4);

		return (
			<Card className="bg-white/95 mb-4 mx-0 shadow-xl border-0">
				<Card.Header className="bg-secondary text-white px-3 py-2 rounded-t-lg flex justify-start shadow-md">
					<h4 className="m-0 font-bold text-sm sm:text-base">{title}</h4>
				</Card.Header>
				<Card.Body className="bg-transparent p-2">
					<Row className="g-2">
						{randomizedSubcategories.map((subcategory) => (
							<Col xs={6} sm={6} md={3} key={subcategory.id}>
								<SubcategorySection
									subcategory={subcategory.name}
									categoryName={title}
									ads={ads[subcategory.id] || []}
									onAdClick={handleAdClick}
									onSubcategoryClick={handleSubcategoryClick}
								/>
							</Col>
						))}
					</Row>
				</Card.Body>
			</Card>
		);
	};

	const SubcategorySection = ({
		subcategory,
		categoryName,
		ads,
		onAdClick,
		onSubcategoryClick,
	}) => {
		const displayedAds = ads.slice(0, 4);
		const hasAds = displayedAds && displayedAds.length > 0;

		return (
			<Card
				className="h-full bg-white/90 rounded-lg flex flex-col"
				style={{ minHeight: "200px" }}
			>
				<Card.Body className="p-1 flex-grow flex flex-col justify-between">
					{hasAds ? (
						<Row className="g-1">
							{displayedAds.map((ad) => {
								const borderColor = getBorderColor(ad.seller_tier);
								return (
									<Col xs={6} key={ad.id}>
										<Card
											className="h-full bg-white rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
											style={{
												border: `2px solid ${borderColor}`,
											}}
										>
											<div>
												{/* Tier label */}
												<div
													className="text-dark px-1 text-xs rounded"
													style={{
														backgroundColor: borderColor,
													}}
												>
													{ad.tier_name}
												</div>

												<Card.Img
													variant="top"
													loading="lazy"
													src={
														ad.media && ad.media.length > 0
															? ad.media[0]
															: "default-image-url"
													}
													alt={ad.title}
													className="object-contain w-full h-auto aspect-square rounded-lg shadow-lg cursor-pointer transition-opacity duration-300 ease-in-out"
													onClick={() => onAdClick(ad.id)}
													onLoad={(e) => {
														e.target.style.opacity = "1";
													}}
													onError={(e) => {
														e.target.src = "default-image-url";
														e.target.style.opacity = "1";
													}}
													style={{ opacity: 0 }}
												/>
											</div>
										</Card>
									</Col>
								);
							})}
						</Row>
					) : (
						<div className="flex items-center justify-center h-full w-full absolute inset-0">
							<div className="text-center text-gray-500">
								<div className="text-2xl mb-1 text-gray-400">
									<FontAwesomeIcon icon={faBox} />
								</div>
								<p className="text-xs">No items available</p>
							</div>
						</div>
					)}
				</Card.Body>
				<Card.Footer className="flex justify-start border-t border-gray-200 bg-gray-50 px-2 py-1 mt-auto">
					<h6
						className="m-0 cursor-pointer transition-all duration-300 hover:text-blue-600 hover:translate-x-1 font-semibold text-gray-800 text-xs sm:text-sm"
						onClick={() => onSubcategoryClick(subcategory, categoryName)}
					>
						{subcategory}
					</h6>
				</Card.Footer>
			</Card>
		);
	};

	const PopularAdsSection = ({ ads, onAdClick }) => (
		<Card className="bg-white/95 mb-4 mx-0 shadow-xl border-0">
			<Card.Header className="flex justify-start bg-secondary text-white px-3 py-2 rounded-t-lg shadow-md">
				<h3 className="mb-0 font-bold text-sm sm:text-base">Best Sellers</h3>
			</Card.Header>
			<Card.Body className="p-2">
				<Row className="g-2">
					{ads.slice(0, 8).map((ad) => {
						const borderColor = getBorderColor(ad.seller_tier);

						return (
							<Col xs={6} sm={6} md={4} lg={3} key={ad.id}>
								<Card
									className="h-full bg-white rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
									style={{
										border: `2px solid ${borderColor}`,
									}}
								>
									<div>
										{/* Tier label */}
										<div
											className="text-dark px-1 text-xs rounded"
											style={{
												backgroundColor: borderColor,
											}}
										>
											{ad.tier_name}
										</div>

										<Card.Img
											variant="top"
											src={
												ad.media && ad.media.length > 0
													? ad.media[0]
													: "default-image-url"
											}
											alt={ad.title}
											className="object-contain w-full h-auto aspect-square rounded-lg shadow-lg cursor-pointer transition-opacity duration-300 ease-in-out"
											onClick={() => onAdClick(ad.id)}
											onLoad={(e) => {
												e.target.style.opacity = "1";
											}}
											onError={(e) => {
												e.target.src = "default-image-url";
												e.target.style.opacity = "1";
											}}
											style={{ opacity: 0 }}
										/>
									</div>
								</Card>
							</Col>
						);
					})}
				</Row>
			</Card.Body>
		</Card>
	);

	const SearchResultSection = ({
		results,
		searchType,
		onLoadMore,
		hasMore,
	}) => {
		const getHeaderTitle = () => {
			if (
				typeof searchType === "string" &&
				searchType.startsWith("subcategory-")
			) {
				const rawName = searchType.replace("subcategory-", "");
				const formatted = rawName
					.replace(/-/g, " ")
					.replace(/\b\w/g, (c) => c.toUpperCase());
				return `${formatted} Products`;
			}
			return "Search Results";
		};

		return (
			<div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
				<Card className="mb-4 mt-2 mx-0">
					<Card.Header className="flex justify-between items-center px-3 py-2">
						<h3 className="mb-0 text-sm sm:text-base">{getHeaderTitle()}</h3>
						<Button
							variant="outline-secondary bg-warning rounded-pill text-dark"
							size="sm"
							onClick={handleClearSearch}
							className="flex items-center gap-2 text-xs sm:text-sm"
						>
							Back to Home
						</Button>
					</Card.Header>
					<Card.Body className="p-2">
						{results.length === 0 ? (
							<div className="text-center py-4">
								<h5 className="text-muted text-sm sm:text-base">
									No products found
								</h5>
								<p className="text-muted text-xs sm:text-sm">
									Try adjusting your search or browse other categories
								</p>
							</div>
						) : (
							<>
								<Row className="g-2">
									{results.map((ad) => {
										const borderColor = getBorderColor(ad.seller_tier);
										return (
											<Col xs={6} sm={4} md={3} lg={2} key={ad.id}>
												<Card
													className="mb-2"
													style={{
														border: `2px solid ${borderColor}`,
													}}
												>
													<div>
														{/* Tier label */}
														<div
															className="text-dark px-1 py-0.5 text-xs"
															style={{
																backgroundColor: borderColor,
																borderTopLeftRadius: "0px",
																borderTopRightRadius: "4px",
																borderBottomRightRadius: "0px",
																borderBottomLeftRadius: "6px",
															}}
														>
															{ad.tier_name || "Free"}
														</div>

														<Card.Img
															variant="top"
															src={
																ad.media_urls && ad.media_urls.length > 0
																	? ad.media_urls[0]
																	: "default-image-url"
															}
															alt={ad.title}
															className="cursor-pointer aspect-square object-contain"
															onClick={() => handleAdClick(ad.id)}
														/>
													</div>
													<Card.Body className="px-1 py-1">
														<Card.Title className="mb-0 text-xs sm:text-sm">
															{ad.title}
														</Card.Title>
														<Card.Text className="text-xs">
															<span>
																<em className="text-success">Kshs: </em>
															</span>
															<strong className="text-danger">
																{ad.price
																	? parseFloat(ad.price)
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
																							<span
																								style={{ fontSize: "12px" }}
																							>
																								.
																							</span>
																							<span>{part}</span>
																						</>
																					)}
																				</React.Fragment>
																			))
																	: "N/A"}
															</strong>
														</Card.Text>
													</Card.Body>
												</Card>
											</Col>
										);
									})}
								</Row>
								{hasMore && (
									<div className="text-center mt-4">
										<Button
											variant="warning"
											onClick={onLoadMore}
											className="px-6 py-2 rounded-pill"
										>
											Show More
										</Button>
									</div>
								)}
							</>
						)}
					</Card.Body>
				</Card>
			</div>
		);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen w-full">
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
			<TopNavbar
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				handleSearch={handleSearch}
			/>
			<div className="flex">
				<Sidebar isOpen={sidebarOpen} onToggle={handleSidebarToggle} />
				<div className="flex-1 bg-gray-300 font-['Fira_Sans_Extra_Condensed'] font-normal transition-all duration-300 ease-in-out">
					<div className="w-full">
						{!isSearching && searchResults.length === 0 && <Banner />}
						<Container fluid className="px-0">
							{isSearching ? (
								<div className="flex justify-center items-center h-screen w-full">
									<Spinner
										variant="warning"
										name="cube-grid"
										style={{ width: 50, height: 50 }}
									/>
								</div>
							) : searchResults.length > 0 ? (
								<SearchResultSection
									results={displayedResults}
									searchType={currentSearchType}
									onLoadMore={handleLoadMore}
									hasMore={hasMore}
								/>
							) : (
								<div className="mb-8 relative z-10 -mt-0 sm:-mt-[10vh] md:-mt-[5vh] lg:-mt-[20vh] xl:-mt-[25vh]">
									<div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
										{categories.map((category) => (
											<CategorySection
												key={category.id}
												title={category.name}
												subcategories={category.subcategories}
											/>
										))}
										<PopularAdsSection
											ads={Object.values(ads).flat()}
											onAdClick={handleAdClick}
										/>
									</div>
								</div>
							)}
						</Container>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default Home;
