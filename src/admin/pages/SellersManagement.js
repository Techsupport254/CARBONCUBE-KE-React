import React, { useState, useEffect } from "react";
import {
	Modal,
	Button,
	Container,
	Row,
	Col,
	Tabs,
	Tab,
	Card,
	Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUserShield,
	faKey,
	faStar,
	faStarHalfAlt,
	faStar as faStarEmpty,
	faSearch,
	faFilter,
	faSort,
	faChevronLeft,
	faChevronRight,
	faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Bar, Doughnut } from "react-chartjs-2";

import Navbar from "../../components/Navbar";
import Spinner from "react-spinkit";

const SellersManagement = () => {
	const [showModal, setShowModal] = useState(false);
	const [selectedSeller, setSelectedSeller] = useState(null);
	const [sellers, setSellers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedTab, setSelectedTab] = useState("profile");
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState({});
	const [statusFilter, setStatusFilter] = useState("");
	const [sortBy, setSortBy] = useState("last_active_at");
	const [sortOrder, setSortOrder] = useState("desc");

	useEffect(() => {
		const fetchSellers = async () => {
			try {
				const params = new URLSearchParams({
					query: searchQuery,
					page: currentPage,
					per_page: 20,
					sort_by: sortBy,
					sort_order: sortOrder,
				});

				if (statusFilter) {
					params.append("status", statusFilter);
				}

				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/admin/sellers?${params}`,
					{
						headers: {
							Authorization: "Bearer " + localStorage.getItem("token"),
						},
					}
				);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json();
				setSellers(data.sellers || []);
				setPagination(data.pagination || {});
			} catch (error) {
				setError("Error fetching sellers");
			} finally {
				setLoading(false);
			}
		};

		fetchSellers();
	}, [searchQuery, currentPage, statusFilter, sortBy, sortOrder]);

	const handleSort = (column) => {
		if (sortBy === column) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(column);
			setSortOrder("asc");
		}
		setCurrentPage(1); // Reset to first page when sorting
	};

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
		setCurrentPage(1); // Reset to first page when searching
	};

	const handleStatusFilterChange = (e) => {
		setStatusFilter(e.target.value);
		setCurrentPage(1); // Reset to first page when filtering
	};

	const formatLastActive = (lastActiveAt) => {
		if (!lastActiveAt) return "Never";
		const date = new Date(lastActiveAt);
		const now = new Date();
		const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

		if (diffInDays === 0) return "Today";
		if (diffInDays === 1) return "Yesterday";
		if (diffInDays < 7) return `${diffInDays} days ago`;
		if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
		return `${Math.floor(diffInDays / 30)} months ago`;
	};

	const handleRowClick = async (sellerId) => {
		try {
			const [sellerResponse, adsResponse, reviewsResponse] = await Promise.all([
				fetch(
					`${process.env.REACT_APP_BACKEND_URL}/admin/sellers/${sellerId}`,
					{
						headers: {
							Authorization: "Bearer " + localStorage.getItem("token"),
						},
					}
				),
				fetch(
					`${process.env.REACT_APP_BACKEND_URL}/admin/sellers/${sellerId}/ads`,
					{
						headers: {
							Authorization: "Bearer " + localStorage.getItem("token"),
						},
					}
				),
				fetch(
					`${process.env.REACT_APP_BACKEND_URL}/admin/sellers/${sellerId}/reviews`,
					{
						headers: {
							Authorization: "Bearer " + localStorage.getItem("token"),
						},
					}
				),
			]);

			if (!sellerResponse.ok || !adsResponse.ok || !reviewsResponse.ok) {
				throw new Error("Network response was not ok");
			}

			const sellerData = await sellerResponse.json();
			const adsData = await adsResponse.json();
			const reviewsData = await reviewsResponse.json();
			const analytics = await fetchSellerAnalytics(sellerId);

			setSelectedSeller({
				...sellerData,
				ads: adsData,
				reviews: reviewsData,
				analytics,
			});
			setSelectedTab("profile");
			setShowModal(true);
		} catch (error) {
			// console.error('Error fetching seller details:', error);
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setSelectedSeller(null);
	};

	const handleUpdateStatus = async (sellerId, status) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/sellers/${sellerId}/${status}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + localStorage.getItem("token"),
					},
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				console.error("Error updating seller status:", errorData);
				return;
			}

			setSellers((prevSellers) =>
				prevSellers.map((seller) =>
					seller.id === sellerId
						? { ...seller, blocked: status === "block" }
						: seller
				)
			);

			if (selectedSeller && selectedSeller.id === sellerId) {
				setSelectedSeller((prevSeller) => ({
					...prevSeller,
					blocked: status === "block",
				}));
			}
		} catch (error) {
			// console.error('Error updating seller status:', error);
		}
	};

	const fetchSellerAnalytics = async (sellerId) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/sellers/${sellerId}/analytics`,
				{
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token"),
					},
				}
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			return await response.json();
		} catch (error) {
			// console.error('Error fetching seller analytics:', error);
			return {};
		}
	};

	const StarRating = ({ rating }) => {
		const fullStars = Math.floor(rating);
		const halfStar = rating % 1 >= 0.5;
		const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

		return (
			<span className="star-rating">
				{[...Array(fullStars)].map((_, index) => (
					<FontAwesomeIcon key={index} icon={faStar} className="star filled" />
				))}
				{halfStar && (
					<FontAwesomeIcon icon={faStarHalfAlt} className="star half-filled" />
				)}
				{[...Array(emptyStars)].map((_, index) => (
					<FontAwesomeIcon
						key={index}
						icon={faStarEmpty}
						className="star empty"
					/>
				))}
			</span>
		);
	};

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
			<Navbar mode="admin" showSearch={false} showCategories={false} />
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900">
							Sellers Management
						</h1>
						<p className="mt-2 text-gray-600">
							Manage and monitor seller accounts with advanced filtering and
							search
						</p>
					</div>

					{/* Filters and Search */}
					<div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{/* Search */}
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FontAwesomeIcon
										icon={faSearch}
										className="h-5 w-5 text-gray-400"
									/>
								</div>
								<input
									type="text"
									placeholder="Search sellers..."
									className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
									value={searchQuery}
									onChange={handleSearchChange}
								/>
							</div>

							{/* Status Filter */}
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FontAwesomeIcon
										icon={faFilter}
										className="h-5 w-5 text-gray-400"
									/>
								</div>
								<select
									className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
									value={statusFilter}
									onChange={handleStatusFilterChange}
								>
									<option value="">All Status</option>
									<option value="active">Active</option>
									<option value="blocked">Blocked</option>
								</select>
							</div>

							{/* Results Count */}
							<div className="flex items-center text-sm text-gray-500">
								{pagination.total_count ? (
									<span>
										Showing{" "}
										{(pagination.current_page - 1) * pagination.per_page + 1} to{" "}
										{Math.min(
											pagination.current_page * pagination.per_page,
											pagination.total_count
										)}{" "}
										of {pagination.total_count} results
									</span>
								) : (
									<span>No results</span>
								)}
							</div>
						</div>
					</div>

					{/* Table */}
					<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
											onClick={() => handleSort("id")}
										>
											<div className="flex items-center space-x-1">
												<span>ID</span>
												<FontAwesomeIcon
													icon={faSort}
													className={`h-3 w-3 ${
														sortBy === "id" ? "text-gray-900" : "text-gray-400"
													}`}
												/>
											</div>
										</th>
										<th
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
											onClick={() => handleSort("fullname")}
										>
											<div className="flex items-center space-x-1">
												<span>Name</span>
												<FontAwesomeIcon
													icon={faSort}
													className={`h-3 w-3 ${
														sortBy === "fullname"
															? "text-gray-900"
															: "text-gray-400"
													}`}
												/>
											</div>
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Contact
										</th>
										<th
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
											onClick={() => handleSort("email")}
										>
											<div className="flex items-center space-x-1">
												<span>Email</span>
												<FontAwesomeIcon
													icon={faSort}
													className={`h-3 w-3 ${
														sortBy === "email"
															? "text-gray-900"
															: "text-gray-400"
													}`}
												/>
											</div>
										</th>
										<th
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
											onClick={() => handleSort("enterprise_name")}
										>
											<div className="flex items-center space-x-1">
												<span>Enterprise</span>
												<FontAwesomeIcon
													icon={faSort}
													className={`h-3 w-3 ${
														sortBy === "enterprise_name"
															? "text-gray-900"
															: "text-gray-400"
													}`}
												/>
											</div>
										</th>
										<th
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
											onClick={() => handleSort("location")}
										>
											<div className="flex items-center space-x-1">
												<span>Location</span>
												<FontAwesomeIcon
													icon={faSort}
													className={`h-3 w-3 ${
														sortBy === "location"
															? "text-gray-900"
															: "text-gray-400"
													}`}
												/>
											</div>
										</th>
										<th
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
											onClick={() => handleSort("last_active_at")}
										>
											<div className="flex items-center space-x-1">
												<span>Last Active</span>
												<FontAwesomeIcon
													icon={faCalendarAlt}
													className={`h-3 w-3 ${
														sortBy === "last_active_at"
															? "text-gray-900"
															: "text-gray-400"
													}`}
												/>
											</div>
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{sellers.length > 0 ? (
										sellers.map((seller) => (
											<tr
												key={seller.id}
												onClick={() => handleRowClick(seller.id)}
												className={`hover:bg-gray-50 cursor-pointer ${
													seller.blocked ? "bg-red-50" : ""
												}`}
											>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
													{seller.id}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{seller.fullname}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{seller.phone_number}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{seller.email}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{seller.enterprise_name}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{seller.location}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{formatLastActive(seller.last_active_at)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<button
														onClick={(e) => {
															e.stopPropagation();
															handleUpdateStatus(
																seller.id,
																seller.blocked ? "unblock" : "block"
															);
														}}
														className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
															seller.blocked
																? "bg-red-100 text-red-800 hover:bg-red-200"
																: "bg-green-100 text-green-800 hover:bg-green-200"
														}`}
													>
														<FontAwesomeIcon
															icon={seller.blocked ? faKey : faUserShield}
															className="w-3 h-3 mr-1"
														/>
														{seller.blocked ? "Blocked" : "Active"}
													</button>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td
												colSpan="8"
												className="px-6 py-12 text-center text-sm text-gray-500"
											>
												No sellers found
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						{/* Pagination */}
						{pagination.total_pages > 1 && (
							<div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
								<div className="flex-1 flex justify-between sm:hidden">
									<button
										onClick={() => handlePageChange(currentPage - 1)}
										disabled={!pagination.has_prev_page}
										className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Previous
									</button>
									<button
										onClick={() => handlePageChange(currentPage + 1)}
										disabled={!pagination.has_next_page}
										className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Next
									</button>
								</div>
								<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
									<div>
										<p className="text-sm text-gray-700">
											Showing page{" "}
											<span className="font-medium">
												{pagination.current_page}
											</span>{" "}
											of{" "}
											<span className="font-medium">
												{pagination.total_pages}
											</span>
										</p>
									</div>
									<div>
										<nav
											className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
											aria-label="Pagination"
										>
											<button
												onClick={() => handlePageChange(currentPage - 1)}
												disabled={!pagination.has_prev_page}
												className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
											>
												<FontAwesomeIcon
													icon={faChevronLeft}
													className="h-5 w-5"
												/>
											</button>

											{/* Page numbers */}
											{Array.from(
												{ length: Math.min(5, pagination.total_pages) },
												(_, i) => {
													const pageNum =
														Math.max(
															1,
															Math.min(
																pagination.total_pages - 4,
																currentPage - 2
															)
														) + i;
													if (pageNum > pagination.total_pages) return null;

													return (
														<button
															key={pageNum}
															onClick={() => handlePageChange(pageNum)}
															className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
																pageNum === currentPage
																	? "z-10 bg-gray-50 border-gray-500 text-gray-600"
																	: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
															}`}
														>
															{pageNum}
														</button>
													);
												}
											)}

											<button
												onClick={() => handlePageChange(currentPage + 1)}
												disabled={!pagination.has_next_page}
												className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
											>
												<FontAwesomeIcon
													icon={faChevronRight}
													className="h-5 w-5"
												/>
											</button>
										</nav>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Seller Details Modal */}
			<Modal centered show={showModal} onHide={handleCloseModal} size="xl">
				<Modal.Header className="justify-content-center p-1 p-lg-1">
					<Modal.Title>Seller Info</Modal.Title>
				</Modal.Header>
				<Modal.Body className="m-0 p-1">
					{selectedSeller ? (
						<Tabs
							activeKey={selectedTab}
							onSelect={(key) => setSelectedTab(key)}
							id="seller-details-tabs"
							className="custom-tabs mb-0 mb-lg-2 mx-1 mx-lg-4 d-flex justify-content-between flex-row nav-justified mt-2"
							style={{ gap: "10px" }}
						>
							<Tab eventKey="profile" title="Profile">
								<Container className="profile-cards text-center">
									<Row>
										<Col xs={12} md={6} className="px-1 px-lg-2">
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Name
												</Card.Header>
												<Card.Body className="text-center">
													{selectedSeller.fullname}
												</Card.Body>
											</Card>
										</Col>
										<Col xs={12} md={6} className="px-1 px-lg-2">
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Email
												</Card.Header>
												<Card.Body className="text-center">
													{selectedSeller.email}
												</Card.Body>
											</Card>
										</Col>
									</Row>

									<Row>
										<Col xs={12} md={6} className="px-1 px-lg-2">
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Phone
												</Card.Header>
												<Card.Body className="text-center">
													{selectedSeller.phone_number}
												</Card.Body>
											</Card>
										</Col>
										<Col xs={12} md={6} className="px-1 px-lg-2">
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Enterprise
												</Card.Header>
												<Card.Body className="text-center">
													{selectedSeller.enterprise_name}
												</Card.Body>
											</Card>
										</Col>
									</Row>

									<Row>
										<Col xs={12} md={6} className="px-1 px-lg-2">
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Location
												</Card.Header>
												<Card.Body className="text-center">
													{selectedSeller.location}
												</Card.Body>
											</Card>
										</Col>
										<Col xs={12} md={6} className="px-1 px-lg-2">
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Status
												</Card.Header>
												<Card.Body className="text-center">
													<span
														className={
															selectedSeller.blocked
																? "text-danger"
																: "text-success"
														}
													>
														{selectedSeller.blocked ? "Blocked" : "Active"}
													</span>
												</Card.Body>
											</Card>
										</Col>
									</Row>

									<Row>
										<Col xs={12} className="px-1 px-lg-2">
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Categories
												</Card.Header>
												<Card.Body className="text-center">
													{selectedSeller.category_names
														? selectedSeller.category_names.join(", ")
														: "No categories available"}
												</Card.Body>
											</Card>
										</Col>
									</Row>
								</Container>
							</Tab>

							<Tab eventKey="analytics" title="Analytics">
								{selectedSeller.analytics ? (
									<Container className="profile-cards text-center">
										<Row>
											<Col xs={6} md={6} className="px-1 px-lg-2">
												<Card className="mb-2 custom-card">
													<Card.Header
														as="h6"
														className="justify-content-center"
													>
														Total Ads
													</Card.Header>
													<Card.Body className="text-center">
														{selectedSeller.analytics.total_ads}
													</Card.Body>
												</Card>
											</Col>
											<Col xs={6} md={6} className="px-1 px-lg-2">
												<Card className="mb-2 custom-card">
													<Card.Header
														as="h6"
														className="justify-content-center"
													>
														Total Ads Wishlisted
													</Card.Header>
													<Card.Body className="text-center">
														{selectedSeller.analytics.total_ads_wishlisted}
													</Card.Body>
												</Card>
											</Col>
										</Row>

										<Row>
											<Col xs={6} md={6} className="px-1 px-lg-2">
												<Card className="mb-2 custom-card">
													<Card.Header
														as="h6"
														className="justify-content-center"
													>
														Mean Rating
													</Card.Header>
													<Card.Body className="text-center">
														<StarRating
															rating={selectedSeller.analytics.mean_rating}
														/>
														<p className="m-0">
															{selectedSeller.analytics.mean_rating}/5
														</p>
													</Card.Body>
												</Card>
											</Col>
											<Col xs={6} md={6} className="px-1 px-lg-2">
												<Card className="mb-2 custom-card">
													<Card.Header
														as="h6"
														className="justify-content-center"
													>
														Total Reviews
													</Card.Header>
													<Card.Body className="text-center">
														{selectedSeller.analytics.total_reviews}
													</Card.Body>
												</Card>
											</Col>
										</Row>

										<Row>
											<Col xs={12} md={6} className="px-1 px-lg-2">
												<Card className="mb-2 custom-card">
													<Card.Header
														as="h6"
														className="justify-content-center"
													>
														Click Events Breakdown
													</Card.Header>
													<Card.Body className="text-center">
														<div
															style={{
																width: "200px",
																height: "200px",
																margin: "0 auto",
															}}
														>
															<Doughnut
																data={{
																	labels: [
																		"Ad Clicks",
																		"Add to Wish List",
																		"Reveal Seller Details",
																	],
																	datasets: [
																		{
																			label: "Click Events",
																			data: [
																				selectedSeller.analytics.ad_clicks,
																				selectedSeller.analytics
																					.add_to_wish_list,
																				selectedSeller.analytics
																					.reveal_seller_details,
																			],
																			backgroundColor: [
																				"#919191",
																				"#FF9800",
																				"#363636",
																			],
																		},
																	],
																}}
																options={{
																	cutout: "70%",
																	responsive: true,
																	maintainAspectRatio: false,
																	plugins: {
																		legend: { display: false },
																	},
																}}
															/>
														</div>
														<div
															style={{
																display: "flex",
																justifyContent: "center",
																gap: "15px",
																marginTop: "10px",
																whiteSpace: "nowrap",
															}}
														>
															<div
																style={{
																	display: "flex",
																	alignItems: "center",
																	gap: "5px",
																}}
															>
																<span
																	style={{
																		width: "12px",
																		height: "12px",
																		backgroundColor: "#919191",
																		borderRadius: "50%",
																	}}
																></span>
																<span>Ad Clicks</span>
															</div>
															<div
																style={{
																	display: "flex",
																	alignItems: "center",
																	gap: "5px",
																}}
															>
																<span
																	style={{
																		width: "12px",
																		height: "12px",
																		backgroundColor: "#FF9800",
																		borderRadius: "50%",
																	}}
																></span>
																<span>Add to Wish List</span>
															</div>
															<div
																style={{
																	display: "flex",
																	alignItems: "center",
																	gap: "5px",
																}}
															>
																<span
																	style={{
																		width: "12px",
																		height: "12px",
																		backgroundColor: "#363636",
																		borderRadius: "50%",
																	}}
																></span>
																<span>Reveal Seller Details</span>
															</div>
														</div>
													</Card.Body>
												</Card>
											</Col>

											<Col xs={12} md={6} className="px-1 px-lg-2">
												<Card className="mb-2 custom-card">
													<Card.Header
														as="h6"
														className="justify-content-center"
													>
														Rating Distribution
													</Card.Header>
													<Card.Body className="text-center">
														<Bar
															data={{
																labels: ["1★", "2★", "3★", "4★", "5★"],
																datasets: [
																	{
																		label: "No. of Ratings",
																		data: selectedSeller.analytics.rating_pie_chart.map(
																			(r) => r.count
																		),
																		backgroundColor: "#FF9800",
																	},
																],
															}}
															options={{
																responsive: true,
																scales: {
																	y: { beginAtZero: true },
																},
																plugins: {
																	legend: {
																		labels: {
																			usePointStyle: true,
																			pointStyle: "circle",
																		},
																	},
																},
															}}
														/>
													</Card.Body>
												</Card>
											</Col>
										</Row>

										<Row>
											<Col xs={12} md={6} className="px-1 px-lg-2">
												<Card className="mb-2 custom-card">
													<Card.Header
														as="h6"
														className="justify-content-center"
													>
														Most Clicked Ad
													</Card.Header>
													<Card.Body className="text-center">
														{selectedSeller.analytics.most_clicked_ad ? (
															<>
																<p className="m-0">
																	<strong>
																		{
																			selectedSeller.analytics.most_clicked_ad
																				.title
																		}
																	</strong>
																</p>
																<p className="text-muted">
																	Total Clicks:{" "}
																	{
																		selectedSeller.analytics.most_clicked_ad
																			.total_clicks
																	}
																</p>
															</>
														) : (
															<p>No Click Data Available</p>
														)}
													</Card.Body>
												</Card>
											</Col>

											<Col xs={12} md={6} className="px-1 px-lg-2">
												<Card className="mb-2 custom-card">
													<Card.Header
														as="h6"
														className="justify-content-center"
													>
														Seller Insights
													</Card.Header>
													<Card.Body className="text-center">
														<p className="m-0 font-weight-bold">
															Category:{" "}
															{selectedSeller.analytics.seller_category}
														</p>
														<p className="m-0 font-weight-bold">
															Last Ad Posted:{" "}
															{selectedSeller.analytics.last_ad_posted_at
																? new Date(
																		selectedSeller.analytics.last_ad_posted_at
																  ).toLocaleDateString()
																: "N/A"}
														</p>
														<p className="m-0 font-weight-bold">
															Account Age:{" "}
															{selectedSeller.analytics.account_age_days} days
														</p>
													</Card.Body>
												</Card>
											</Col>
										</Row>

										<Row>
											<Col xs={12} md={6} className="px-1 px-lg-2">
												<Card className="mb-2 custom-card">
													<Card.Header
														as="h6"
														className="justify-content-center"
													>
														Total Profile Views
													</Card.Header>
													<Card.Body className="text-center">
														{selectedSeller.analytics.total_profile_views}
													</Card.Body>
												</Card>
											</Col>
											<Col xs={12} md={6} className="px-1 px-lg-2">
												<Card className="mb-2 custom-card">
													<Card.Header
														as="h6"
														className="justify-content-center"
													>
														Seller Engagement Rank
													</Card.Header>
													<Card.Body className="text-center">
														{selectedSeller.analytics.ad_performance_rank ||
															"N/A"}
													</Card.Body>
												</Card>
											</Col>
										</Row>
									</Container>
								) : (
									<p>Loading analytics data...</p>
								)}
							</Tab>

							<Tab eventKey="ads" title="Ads">
								<div className="card-container">
									{selectedSeller.ads && selectedSeller.ads.length > 0 ? (
										<Row>
											{selectedSeller.ads.map((ad) => (
												<Col
													key={ad.id}
													xs={6}
													md={12}
													lg={3}
													className="mb-2 px-1"
												>
													<Card className="ad-card-seller">
														<Card.Img
															className="analytics-card-img-top ad-image"
															variant="top"
															src={
																ad.media_urls && ad.media_urls.length > 0
																	? ad.media_urls[0]
																	: "default-image-url"
															}
														/>
														<Card.Body className="p-2">
															<Card.Title
																className="mb-0 ad-title"
																style={{ fontSize: "18px" }}
															>
																{ad.title}
															</Card.Title>
															<Card.Text className="price-container">
																<span>
																	<em className="ad-price-label text-success">
																		Kshs:{" "}
																	</em>
																</span>
																<strong className="text-danger">
																	{ad.price
																		? parseFloat(ad.price)
																				.toFixed(2)
																				.split(".")
																				.map((part, index) => (
																					<React.Fragment key={index}>
																						{index === 0 ? (
																							<span className="price-integer">
																								{parseInt(
																									part,
																									10
																								).toLocaleString()}
																							</span>
																						) : (
																							<>
																								<span
																									style={{
																										fontSize: "16px",
																									}}
																								>
																									.
																								</span>
																								<span className="price-decimal">
																									{part}
																								</span>
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
											))}
										</Row>
									) : (
										<p className="text-center">No ads available</p>
									)}
								</div>
							</Tab>

							<Tab eventKey="reviews" title="Reviews">
								{selectedSeller.reviews && selectedSeller.reviews.length > 0 ? (
									<Row>
										{selectedSeller.reviews.map((review) => (
											<Col
												lg={6}
												key={review.id}
												className=" justify-content-center"
											>
												<div className="reviews-container text-center p-0 p-lg-2 ">
													<div className="review-card p-1">
														<p className="review-comment">
															<em>"{review.review}"</em>
														</p>
														<StarRating rating={review.rating} />
														<p className="review-ad">
															<strong>{review.ad_title}</strong>
														</p>
														<p className="reviewer-name">
															<strong>
																<em>{review.buyer_name}</em>
															</strong>
														</p>
													</div>
												</div>
											</Col>
										))}
									</Row>
								) : (
									<p className="text-center">No reviews available</p>
								)}
							</Tab>
						</Tabs>
					) : (
						<p>Loading...</p>
					)}
				</Modal.Body>
				<Modal.Footer className="p-1 p-lg-1">
					<Button variant="danger" id="button" onClick={handleCloseModal}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default SellersManagement;
