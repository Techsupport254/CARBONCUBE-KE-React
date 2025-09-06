import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import Navbar from "../../components/Navbar";
import ClickEventsStats from "../components/ClickEventsStats";
import TopWishListedAds from "../components/TopWishListedAds";
import WishListStats from "../components/WishListStats";
import CompetitorStats from "../components/CompetitorStats";
import CountDownDisplay from "../components/CountDownDisplay";
import BuyerDemographics from "../components/BuyerDemographics";
import Spinner from "react-spinkit";
import { format, isToday } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPencilAlt,
	faExclamationTriangle,
	faChartBar,
	faClipboardList,
	faComments,
	faCrown,
	faStar,
	faGem,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import "../css/SellerAnalytics.css";

const SellerAnalytics = () => {
	const [analyticsData, setAnalyticsData] = useState(null);
	const [tierId, setTierId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showReviewsModal, setShowReviewsModal] = useState(false);
	const [reviews, setReviews] = useState([]);
	const [loadingReviews, setLoadingReviews] = useState(false);
	const [editingReplyId, setEditingReplyId] = useState(null);
	const [replyDraft, setReplyDraft] = useState("");

	// Helper function to get tier icon and color
	const getTierInfo = (tierId) => {
		switch (tierId) {
			case 1:
				return { icon: faUser, color: "text-gray-500", name: "Free Tier" };
			case 2:
				return { icon: faStar, color: "text-blue-500", name: "Basic Tier" };
			case 3:
				return { icon: faGem, color: "text-purple-500", name: "Standard Tier" };
			case 4:
				return {
					icon: faCrown,
					color: "text-yellow-500",
					name: "Premium Tier",
				};
			default:
				return { icon: faUser, color: "text-gray-500", name: "Free Tier" };
		}
	};

	useEffect(() => {
		const fetchAnalytics = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/seller/analytics`,
					{
						headers: {
							Authorization: "Bearer " + sessionStorage.getItem("token"),
						},
					}
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				// API Response data

				const validatedAnalytics = {
					tier_id: data.tier_id || 1,
					total_ads: data.total_ads || 0,
					total_reviews: data.total_reviews || 0,
					average_rating: data.average_rating || 0.0,
					top_wishlisted_ads: Array.isArray(
						data.basic_wishlist_stats?.top_wishlisted_ads
					)
						? data.basic_wishlist_stats.top_wishlisted_ads
						: [], // Ensure it's always an array
					click_events_stats: data.click_events_stats || {
						age_groups: [],
						income_ranges: [],
						education_levels: [],
						employment_statuses: [],
						sectors: [],
					},
					basic_click_event_stats: data.basic_click_event_stats || {
						click_event_trends: [],
					},
					wishlist_stats: data.wishlist_stats || {
						top_age_groups: [],
						top_income_ranges: [],
						top_education_levels: [],
						top_employment_statuses: [],
						top_by_sectors: [],
					},
					basic_wishlist_stats: data.basic_wishlist_stats || {
						wishlist_trends: [],
					},
					competitor_stats: data.competitor_stats || {
						revenue_share: {
							seller_revenue: 0,
							total_category_revenue: 0,
							revenue_share: 0,
						},
						top_competitor_ads: [],
						competitor_average_price: 0,
					},
				};

				// Validated Analytics data

				setTierId(validatedAnalytics.tier_id);
				setAnalyticsData(validatedAnalytics);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching analytics data:", err.message);
				setError(err.message);
				setLoading(false);
			}
		};

		fetchAnalytics();
	}, []);

	const handleReplyClick = (review) => {
		setEditingReplyId(review.id);
		setReplyDraft(review.seller_reply || "");
	};

	const handleReplySave = async (reviewId) => {
		if (!reviewId || !replyDraft.trim()) return;

		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/seller/reviews/${reviewId}/reply`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
					body: JSON.stringify({ seller_reply: replyDraft }),
				}
			);

			if (!response.ok) throw new Error("Failed to submit reply");

			// Refresh reviews list and reset state
			await fetchReviews();
			setEditingReplyId(null);
			setReplyDraft("");
		} catch (err) {
			console.error(err);
			alert("Failed to submit reply. Please try again.");
		}
	};

	const fetchReviews = async () => {
		setLoadingReviews(true);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/seller/reviews`,
				{
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			if (!response.ok)
				throw new Error(`HTTP error! status: ${response.status}`);

			const data = await response.json();
			setReviews(data);
		} catch (err) {
			console.error("Error fetching reviews:", err.message);
		} finally {
			setLoadingReviews(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<Spinner
						variant="warning"
						name="cube-grid"
						style={{ width: 100, height: 100 }}
					/>
					<p className="mt-4 text-gray-600 text-lg">
						Loading analytics data...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="max-w-7xl mx-auto text-center">
					<div className="bg-white rounded-lg shadow-lg p-8">
						<div className="text-red-500 text-6xl mb-4">
							<FontAwesomeIcon icon={faExclamationTriangle} />
						</div>
						<h4 className="text-xl font-semibold text-gray-800 mb-2">
							Error Loading Data
						</h4>
						<p className="text-gray-600">{error}</p>
						<button
							onClick={() => window.location.reload()}
							className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (!analyticsData) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="max-w-7xl mx-auto text-center">
					<div className="bg-white rounded-lg shadow-lg p-8">
						<div className="text-blue-500 text-6xl mb-4">
							<FontAwesomeIcon icon={faChartBar} />
						</div>
						<h4 className="text-xl font-semibold text-gray-800 mb-2">
							No Analytics Data Available
						</h4>
						<p className="text-gray-600 mb-4">
							Upgrade your package to access analytics data.
						</p>
						<a
							href="/tiers"
							className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105"
						>
							View Packages
						</a>
					</div>
				</div>
			</div>
		);
	}

	const { average_rating, total_ads, total_reviews, top_wishlisted_ads } =
		analyticsData;

	return (
		<>
			<Navbar mode="seller" showSearch={false} showCategories={false} />
			<div className="min-h-screen bg-gray-50">
				<div className="flex">
					{/* Sidebar */}
					<Sidebar />

					{/* Main Content */}
					<div className="flex-1 p-2 sm:p-4 lg:p-6">
						<div className="max-w-7xl mx-auto">
							{/* Subscription Countdown */}
							<div className="mb-4 sm:mb-6">
								<div className="bg-white rounded-xl shadow-lg border border-gray-100">
									<div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
										<h3 className="text-base sm:text-lg font-semibold text-gray-800">
											Subscription Countdown
										</h3>
									</div>
									<div className="p-3 sm:p-6">
										<CountDownDisplay />
									</div>
								</div>
							</div>

							{/* Analytics Cards */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
								{/* Total Ads Card */}
								<div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
									<div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
										<h3 className="text-base sm:text-lg font-semibold text-gray-800">
											Total Ads
										</h3>
									</div>
									<div className="p-3 sm:p-6">
										{tierId >= 2 ? (
											<div className="text-center">
												<div className="text-3xl font-bold text-blue-600">
													{total_ads.toLocaleString()}
												</div>
												<p className="text-sm text-gray-500 mt-2">
													Active advertisements
												</p>
											</div>
										) : (
											<div className="text-center">
												<div
													className={`text-2xl mb-2 ${getTierInfo(2).color}`}
												>
													<FontAwesomeIcon icon={getTierInfo(2).icon} />
												</div>
												<p className="text-gray-500 text-sm">
													Upgrade to {getTierInfo(2).name}
												</p>
												<a
													href="/tiers"
													className="text-blue-500 hover:text-blue-600 text-sm font-medium"
												>
													View Packages →
												</a>
											</div>
										)}
									</div>
								</div>

								{/* Total Reviews Card */}
								<div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
									<div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
										<h3 className="text-base sm:text-lg font-semibold text-gray-800">
											Total Reviews
										</h3>
									</div>
									<div className="p-3 sm:p-6">
										{tierId >= 3 ? (
											<div className="text-center">
												<button
													onClick={() => {
														setShowReviewsModal(true);
														fetchReviews();
													}}
													className="text-3xl font-bold text-purple-600 hover:text-purple-700 transition-colors cursor-pointer"
												>
													{total_reviews.toLocaleString()}
												</button>
												<p className="text-sm text-gray-500 mt-2">
													Customer feedback
												</p>
											</div>
										) : (
											<div className="text-center">
												<div
													className={`text-2xl mb-2 ${getTierInfo(3).color}`}
												>
													<FontAwesomeIcon icon={getTierInfo(3).icon} />
												</div>
												<p className="text-gray-500 text-sm">
													Upgrade to {getTierInfo(3).name}
												</p>
												<a
													href="/tiers"
													className="text-blue-500 hover:text-blue-600 text-sm font-medium"
												>
													View Packages →
												</a>
											</div>
										)}
									</div>
								</div>

								{/* Average Rating Card */}
								<div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
									<div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
										<h3 className="text-base sm:text-lg font-semibold text-gray-800">
											Average Rating
										</h3>
									</div>
									<div className="p-3 sm:p-6">
										<div className="text-center">
											<div className="text-3xl font-bold text-yellow-500">
												{average_rating.toFixed(1)}
											</div>
											<div className="flex justify-center mt-2">
												{[...Array(5)].map((_, i) => (
													<span
														key={i}
														className={`text-lg ${
															i < Math.floor(average_rating)
																? "text-yellow-400"
																: "text-gray-300"
														}`}
													>
														★
													</span>
												))}
											</div>
											<p className="text-sm text-gray-500 mt-2">
												Out of 5 stars
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Charts Section */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
								{/* Top Wishlisted Ads */}
								<div className="bg-white rounded-xl shadow-lg border border-gray-100">
									<div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
										<h3 className="text-base sm:text-lg font-semibold text-gray-800">
											Top Wishlisted Ads
										</h3>
									</div>
									<div className="p-3 sm:p-6">
										{top_wishlisted_ads.length > 0 ? (
											<TopWishListedAds data={top_wishlisted_ads} />
										) : (
											<div className="text-center py-8">
												<div className="text-gray-400 text-4xl mb-3">
													<FontAwesomeIcon icon={faClipboardList} />
												</div>
												<p className="text-gray-500">No wishlisted ads found</p>
												<p className="text-sm text-gray-400 mt-1">
													Make sure your ads are added to wishlists by users
												</p>
											</div>
										)}
									</div>
								</div>

								{/* Competitor Stats */}
								<div className="bg-white rounded-xl shadow-lg border border-gray-100">
									<div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
										<h3 className="text-base sm:text-lg font-semibold text-gray-800">
											Competitor Stats
										</h3>
									</div>
									<div className="p-3 sm:p-6">
										{tierId >= 3 ? (
											<CompetitorStats data={analyticsData.competitor_stats} />
										) : (
											<div className="text-center py-8">
												<div
													className={`text-4xl mb-3 ${getTierInfo(3).color}`}
												>
													<FontAwesomeIcon icon={getTierInfo(3).icon} />
												</div>
												<p className="text-gray-500">
													Upgrade to {getTierInfo(3).name}
												</p>
												<a
													href="/tiers"
													className="text-blue-500 hover:text-blue-600 text-sm font-medium"
												>
													View Packages →
												</a>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* More Charts Section */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
								{/* Click Events Stats */}
								<div className="bg-white rounded-xl shadow-lg border border-gray-100">
									<div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
										<h3 className="text-base sm:text-lg font-semibold text-gray-800">
											Click Events Stats
										</h3>
									</div>
									<div className="p-3 sm:p-6">
										{tierId >= 2 ? (
											<ClickEventsStats
												data={
													analyticsData.basic_click_event_stats
														.click_event_trends
												}
											/>
										) : (
											<div className="text-center py-8">
												<div
													className={`text-4xl mb-3 ${getTierInfo(2).color}`}
												>
													<FontAwesomeIcon icon={getTierInfo(2).icon} />
												</div>
												<p className="text-gray-500">
													Upgrade to {getTierInfo(2).name}
												</p>
												<a
													href="/tiers"
													className="text-blue-500 hover:text-blue-600 text-sm font-medium"
												>
													View Packages →
												</a>
											</div>
										)}
									</div>
								</div>

								{/* Wish List Stats */}
								<div className="bg-white rounded-xl shadow-lg border border-gray-100">
									<div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
										<h3 className="text-base sm:text-lg font-semibold text-gray-800">
											Wish List Stats
										</h3>
									</div>
									<div className="p-3 sm:p-6">
										{tierId >= 3 ? (
											<WishListStats
												data={analyticsData.basic_wishlist_stats}
											/>
										) : (
											<div className="text-center py-8">
												<div
													className={`text-4xl mb-3 ${getTierInfo(3).color}`}
												>
													<FontAwesomeIcon icon={getTierInfo(3).icon} />
												</div>
												<p className="text-gray-500">
													Upgrade to {getTierInfo(3).name}
												</p>
												<a
													href="/tiers"
													className="text-blue-500 hover:text-blue-600 text-sm font-medium"
												>
													View Packages →
												</a>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Buyer Demographics */}
							<div className="mb-4 sm:mb-6">
								<div className="bg-white rounded-xl shadow-lg border border-gray-100">
									<div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
										<h3 className="text-base sm:text-lg font-semibold text-gray-800">
											Buyer Demographics
										</h3>
									</div>
									<div className="p-3 sm:p-6">
										{tierId >= 3 ? (
											<BuyerDemographics
												data={{
													clickEvents: analyticsData.click_events_stats,
													wishlistStats: analyticsData.wishlist_stats,
												}}
											/>
										) : (
											<div className="text-center py-8">
												<div
													className={`text-4xl mb-3 ${getTierInfo(3).color}`}
												>
													<FontAwesomeIcon icon={getTierInfo(3).icon} />
												</div>
												<p className="text-gray-500">
													Upgrade to {getTierInfo(3).name}
												</p>
												<a
													href="/tiers"
													className="text-blue-500 hover:text-blue-600 text-sm font-medium"
												>
													View Packages →
												</a>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Reviews Modal */}
				<Modal
					show={showReviewsModal}
					onHide={() => setShowReviewsModal(false)}
					centered
					size="xl"
					backdrop="static"
					keyboard={false}
					dialogClassName="glass-modal"
					className="modal-responsive"
				>
					<Modal.Header className="text-white py-2 justify-content-center">
						<Modal.Title className="fw-bold">
							<i className="bi bi-star-half me-2"></i> Buyer Reviews
						</Modal.Title>
					</Modal.Header>

					<Modal.Body
						style={{ maxHeight: "60vh", overflowY: "auto" }}
						className="p-2 sm:p-4"
					>
						{loadingReviews ? (
							<div className="text-center py-3 sm:py-5">
								<Spinner animation="border" variant="primary" />
								<p className="mt-3 text-muted text-sm sm:text-base">
									Loading reviews...
								</p>
							</div>
						) : reviews.length > 0 ? (
							reviews.map((review, idx) => (
								<div
									key={review.id || idx}
									className="bg-white rounded-lg shadow-sm border border-gray-100 mb-3 sm:mb-4 p-3 sm:p-4"
								>
									<div className="flex items-start space-x-2 sm:space-x-4">
										<img
											src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
												review.buyer_name
											)}&background=random`}
											className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
											alt="Avatar"
										/>
										<div className="flex-1 min-w-0">
											<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
												<div className="flex items-center space-x-2">
													<h6 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
														{review.buyer_name || `Buyer #${review.buyer_id}`}
													</h6>
													<div className="flex text-yellow-400">
														{[...Array(5)].map((_, i) => (
															<span
																key={i}
																className={`text-xs sm:text-sm ${
																	i < review.rating
																		? "text-yellow-400"
																		: "text-gray-300"
																}`}
															>
																★
															</span>
														))}
														<span className="text-gray-500 text-xs sm:text-sm ml-1">
															({review.rating}/5)
														</span>
													</div>
												</div>
												<span className="text-gray-500 text-xs sm:text-sm">
													{review.updated_at
														? isToday(new Date(review.updated_at))
															? `Today at ${format(
																	new Date(review.updated_at),
																	"HH:mm"
															  )}`
															: format(new Date(review.updated_at), "PP HH:mm")
														: "No date"}
												</span>
											</div>

											<p className="text-gray-600 italic mb-3 text-sm sm:text-base">
												{review.review || "No review provided."}
											</p>

											{editingReplyId === review.id ? (
												<div className="bg-gray-50 p-3 sm:p-4 rounded-lg border-l-4 border-green-500 ml-2 sm:ml-6">
													<Form.Group controlId={`replyText-${review.id}`}>
														<Form.Label className="text-green-600 font-medium mb-2 block text-sm sm:text-base">
															Your Reply:
														</Form.Label>
														<Form.Control
															as="textarea"
															rows={3}
															value={replyDraft}
															onChange={(e) => setReplyDraft(e.target.value)}
															className="border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm sm:text-base"
														/>
													</Form.Group>
													<div className="text-right mt-3">
														<Button
															variant="success"
															className="rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm"
															onClick={() => handleReplySave(review.id)}
														>
															<i className="bi bi-check-circle mr-1"></i> Save
														</Button>
													</div>
												</div>
											) : review.seller_reply ? (
												<div className="bg-gray-50 p-3 sm:p-4 rounded-lg border-l-4 border-green-500 ml-2 sm:ml-6 relative">
													<strong className="text-green-600 block mb-2 text-sm sm:text-base">
														Your Reply:
													</strong>
													<p className="italic text-gray-700 pr-6 sm:pr-8 text-sm sm:text-base">
														{review.seller_reply}
													</p>
													<button
														className="absolute top-2 right-2 p-1 text-green-600 hover:text-green-700 transition-colors"
														onClick={() => handleReplyClick(review)}
													>
														<FontAwesomeIcon
															icon={faPencilAlt}
															className="text-xs sm:text-sm"
														/>
													</button>
												</div>
											) : (
												<button
													className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm transition-colors"
													onClick={() => handleReplyClick(review)}
												>
													Reply
												</button>
											)}
										</div>
									</div>
								</div>
							))
						) : (
							<div className="text-center text-gray-500 py-6 sm:py-8">
								<div className="text-3xl sm:text-4xl mb-3">
									<FontAwesomeIcon icon={faComments} />
								</div>
								<p className="text-sm sm:text-base">
									No reviews have been submitted yet.
								</p>
							</div>
						)}
					</Modal.Body>

					<Modal.Footer className="py-2 px-2 sm:px-4">
						<Button
							variant="danger"
							onClick={() => setShowReviewsModal(false)}
							className="text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2"
						>
							<i className="bi bi-x-circle mr-1"></i> Close
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		</>
	);
};

export default SellerAnalytics;
