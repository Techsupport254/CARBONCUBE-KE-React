import React, { useState, useEffect } from "react";
import {
	Card,
	Button,
	Container,
	Row,
	Col,
	FormControl,
	Modal,
	Form,
	Carousel,
	Dropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTrashCan,
	faTrashRestore,
	faStar,
	faStarHalfAlt,
	faStar as faStarEmpty,
	faFilter,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import Navbar from "../../components/Navbar";
import Spinner from "react-spinkit";
import "../css/AdsManagement.css";

const AdsManagement = () => {
	const [flaggedAds, setFlaggedAds] = useState([]);
	const [nonFlaggedAds, setNonFlaggedAds] = useState([]);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedSubcategory, setSelectedSubcategory] = useState("All");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [showNotifySellerModal, setShowNotifySellerModal] = useState(false);
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [selectedAd, setSelectedAd] = useState(null);
	const [notificationOptions, setNotificationOptions] = useState([]);
	const [notes, setNotes] = useState("");

	const fetchAds = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/ads`,
				{
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			if (!response.ok) {
				throw new Error(
					`Network response was not ok. Status: ${response.status}`
				);
			}

			const data = await response.json();
			const { flagged = [], non_flagged = [] } = data;
			setFlaggedAds(flagged);
			setNonFlaggedAds(non_flagged);
		} catch (error) {
			// console.error('Error fetching ads:', error);
			setError(`Error fetching ads: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/categories`,
				{
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			if (!response.ok) {
				throw new Error(
					`Network response was not ok. Status: ${response.status}`
				);
			}

			const data = await response.json();
			// Assuming subcategories are included with categories in the response
			setCategories(data || []);
		} catch (error) {
			// console.error('Error fetching categories:', error);
		}
	};

	useEffect(() => {
		fetchAds();
		fetchCategories();
	}, []);

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleCategorySelect = (categoryId) => {
		setSelectedCategory(categoryId);
		setSelectedSubcategory("All");
	};

	const handleSubcategorySelect = (subcategoryId) => {
		setSelectedSubcategory(subcategoryId);
	};

	const searchTerms = searchTerm
		.toLowerCase()
		.split(" ")
		.filter((term) => term.length > 0);

	const filteredNonFlaggedAds = nonFlaggedAds
		.filter(
			(ad) => selectedCategory === "All" || ad.category_id === selectedCategory
		)
		.filter(
			(ad) =>
				selectedSubcategory === "All" ||
				ad.subcategory_id === selectedSubcategory
		)
		.filter((ad) => {
			const titleMatches = searchTerms.every((term) =>
				ad.title.toLowerCase().includes(term)
			);
			const descriptionMatches = searchTerms.every((term) =>
				ad.description.toLowerCase().includes(term)
			);
			return titleMatches || descriptionMatches;
		})
		.sort((a, b) => a.price - b.price); // Sort by price in ascending order

	const handleNotifyClick = (ad) => {
		setSelectedAd(ad);
		setNotificationOptions([]);
		setNotes("");
		setShowNotifySellerModal(true);
	};

	const handleViewDetailsClick = async (ad) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/ads/${ad.id}`,
				{
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			if (!response.ok) {
				throw new Error(
					`Network response was not ok. Status: ${response.status}`
				);
			}

			const data = await response.json();
			setSelectedAd(data);
			setShowDetailsModal(true);
		} catch (error) {
			// console.error('Error fetching ad details:', error);
		}
	};

	const handleModalClose = () => {
		setShowNotifySellerModal(false);
		setShowDetailsModal(false);
	};

	const handleSendNotification = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/ads/${selectedAd.id}/notify`,
				{
					method: "POST",
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						options: notificationOptions,
						notes: notes,
					}),
				}
			);

			if (!response.ok) {
				throw new Error(
					`Network response was not ok. Status: ${response.status}`
				);
			}

			handleModalClose();
			await fetchAds(); // Refresh ad list
		} catch (error) {
			// console.error('Error sending notification:', error);
		}
	};

	const handleNotificationOptionChange = (e) => {
		const { value, checked } = e.target;
		setNotificationOptions(
			(prevOptions) =>
				checked
					? [...prevOptions, value] // Add the option if checked
					: prevOptions.filter((option) => option !== value) // Remove the option if unchecked
		);
	};

	const handleFlagAd = async (id) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/ads/${id}/flag`,
				{
					method: "PATCH",
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			if (!response.ok) {
				throw new Error(
					`Network response was not ok. Status: ${response.status}`
				);
			}

			await fetchAds(); // Refresh ad list
		} catch (error) {
			// console.error('Error flagging ad:', error);
		}
	};

	const handleRestoreAd = async (id) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/ads/${id}/restore`,
				{
					method: "PATCH",
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			if (!response.ok) {
				throw new Error(
					`Network response was not ok. Status: ${response.status}`
				);
			}

			await fetchAds(); // Refresh ad list
		} catch (error) {
			// console.error('Error restoring ad:', error);
		}
	};

	const renderRatingStars = (rating) => {
		if (typeof rating !== "number" || rating < 0) {
			// console.error('Invalid rating value:', rating);
			return <div className="rating-stars">Invalid rating</div>;
		}

		const fullStars = Math.floor(Math.max(0, Math.min(rating, 5)));
		const halfStar = rating % 1 >= 0.5;
		const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

		return (
			<div className="rating-stars">
				{[...Array(fullStars)].map((_, index) => (
					<FontAwesomeIcon
						key={index}
						icon={faStar}
						className="rating-star filled"
					/>
				))}
				{halfStar && (
					<FontAwesomeIcon
						icon={faStarHalfAlt}
						className="rating-star half-filled"
					/>
				)}
				{[...Array(emptyStars)].map((_, index) => (
					<FontAwesomeIcon
						key={index}
						icon={faStarEmpty}
						className="rating-star empty"
					/>
				))}
			</div>
		);
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
			<div className="ads-management-page">
				<Container fluid className="p-0">
					<Row>
						<Col xs={12} md={2} className="p-0">
							<Sidebar />
						</Col>
						<Col xs={12} md={10} lg={9} className="p-2">
							<Row className="justify-content-center d-flex">
								<Col xs={12} md={8} lg={6} className="mb-3 pt-2">
									<div className="search-container d-flex align-items-center">
										<Dropdown className="dropdown-filter me-2 mt-3">
											<Dropdown.Toggle
												variant="secondary"
												id="button"
												className={`filter-toggle ${
													selectedCategory === "All" &&
													selectedSubcategory === "All"
														? "filter-icon"
														: "active-category"
												}`}
											>
												{selectedCategory === "All" &&
												selectedSubcategory === "All" ? (
													<FontAwesomeIcon icon={faFilter} />
												) : (
													<>
														{categories.find((c) => c.id === selectedCategory)
															?.name || "Select Category"}
														{selectedSubcategory !== "All" &&
															` > ${
																categories
																	.find((c) => c.id === selectedCategory)
																	?.subcategories.find(
																		(sc) => sc.id === selectedSubcategory
																	)?.name
															}`}
													</>
												)}
											</Dropdown.Toggle>
											<Dropdown.Menu className="dropdown-menu">
												<Dropdown.Item
													id="button"
													onClick={() => handleCategorySelect("All")}
												>
													<FontAwesomeIcon icon={faFilter} /> All Categories
												</Dropdown.Item>
												{categories.map((category) => (
													<Dropdown.Item
														key={category.id}
														id="button"
														onClick={() => {
															handleCategorySelect(category.id);
															setSelectedSubcategory("All");
														}}
													>
														{category.name}
														{category.subcategories.length > 0 && (
															<div className="dropdown-submenu">
																{category.subcategories.map((subcategory) => (
																	<Dropdown.Item
																		key={subcategory.id}
																		id="button"
																		onClick={(e) => {
																			e.stopPropagation();
																			handleSubcategorySelect(subcategory.id);
																		}}
																	>
																		* {subcategory.name}
																	</Dropdown.Item>
																))}
															</div>
														)}
													</Dropdown.Item>
												))}
											</Dropdown.Menu>
										</Dropdown>
										<FormControl
											placeholder="Search ads..."
											aria-label="Search ads"
											aria-describedby="search-icon"
											id="button"
											value={searchTerm}
											onChange={handleSearchChange}
											className="search-input"
										/>
									</div>
								</Col>
							</Row>

							<Row>
								{filteredNonFlaggedAds.length > 0 ? (
									filteredNonFlaggedAds.map((ad) => (
										<Col
											key={ad.id}
											xs={6}
											md={6}
											lg={3}
											className="mb-2 mb-lg-4 px-2"
										>
											<Card className="h-100">
												{/* Clickable image */}
												<div
													role="button"
													tabIndex={0}
													onClick={() => handleViewDetailsClick(ad)}
													onKeyPress={(e) => {
														if (e.key === "Enter" || e.key === " ")
															handleViewDetailsClick(ad);
													}}
													style={{ cursor: "pointer", outline: "none" }}
												>
													<Card.Img
														variant="top"
														className="ad-image"
														src={
															ad.media && ad.media.length > 0
																? ad.media[0]
																: "default-image-url"
														}
														alt={ad.title}
														style={{
															width: "100%",
															height: "auto",
															objectFit: "contain",
															border: "none",
														}}
													/>
												</div>

												<Card.Body
													className="py-0 py-lg-1 px-2 chill-body d-flex flex-column"
													style={{ position: "relative" }}
												>
													<Card.Title
														className="d-flex justify-content-start mb-0 ad-title"
														style={{ fontSize: "18px", fontWeight: "600" }}
													>
														{ad.title}
													</Card.Title>

													<Card.Text
														className="price-container d-flex justify-content-start"
														style={{ fontSize: "18px" }}
													>
														<span>
															<em
																className="ad-price-label text-success"
																style={{ fontSize: "13px" }}
															>
																Kshs:&nbsp;
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
																						<span style={{ fontSize: "16px" }}>
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

													{/* Delete icon absolute bottom right */}
													<div
														style={{
															position: "absolute",
															bottom: "8px",
															right: "8px",
															cursor: "pointer",
															color: "#dc3545", // Bootstrap danger red
														}}
														onClick={() => handleFlagAd(ad.id)}
														title="Flag Ad"
													>
														<FontAwesomeIcon icon={faTrashCan} size="lg" />
													</div>
												</Card.Body>
											</Card>
										</Col>
									))
								) : (
									<Col>
										<p>No non-flagged ads found</p>
									</Col>
								)}
							</Row>

							<Row>
								<h3 className="mb-4 text-center">Flagged Ads</h3>
								{flaggedAds.length > 0 ? (
									flaggedAds.map((ad) => (
										<Col key={ad.id} xs={6} md={6} lg={3} className="mb-4">
											<Card>
												<Card.Img
													variant="top"
													className="ad-image"
													src={
														ad.media && ad.media.length > 0
															? ad.media[0]
															: "default-image-url"
													}
												/>
												<Card.Body className="py-1 px-2 chill-body">
													<Card.Title
														className="d-flex justify-content-start ad-title mb-0"
														style={{ fontSize: "18px" }}
													>
														{ad.title}
													</Card.Title>

													<Card.Text className="price-container d-flex justify-content-start">
														<span>
															<em className="ad-price-label text-success">
																Kshs:{" "}
															</em>
														</span>
														<strong
															style={{ fontSize: "18px" }}
															className="text-danger"
														>
															{ad.price
																? parseFloat(ad.price)
																		.toFixed(2)
																		.split(".")
																		.map((part, index) => (
																			<React.Fragment key={index}>
																				{index === 0 ? (
																					<span>{part}</span> // Integer part
																				) : (
																					<>
																						<span style={{ fontSize: "16px" }}>
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

													<Row className="align-middle">
														<Col xs={9} md={6} lg={6}>
															<Button
																variant="warning"
																id="button"
																onClick={() => handleNotifyClick(ad)}
																className="py-1"
															>
																Notify Seller
															</Button>
														</Col>
														<Col xs={3} md={6} lg={6}>
															<FontAwesomeIcon
																icon={faTrashRestore}
																className="restore-icon"
																onClick={() => handleRestoreAd(ad.id)}
																title="Restore Ad"
															/>
														</Col>
													</Row>
												</Card.Body>
											</Card>
										</Col>
									))
								) : (
									<Col>
										<p>No flagged ads found</p>
									</Col>
								)}
							</Row>
						</Col>
					</Row>
				</Container>

				<Modal
					centered
					show={showDetailsModal}
					onHide={handleModalClose}
					size="xl"
				>
					<Modal.Header className="justify-content-center">
						<Modal.Title>{selectedAd?.title || "Ad Details"}</Modal.Title>
					</Modal.Header>
					<Modal.Body className="px-1 py-1">
						{selectedAd && (
							<>
								<Carousel className="mb-4">
									{selectedAd.media && selectedAd.media.length > 0 ? (
										selectedAd.media.map((image, index) => (
											<Carousel.Item key={index} className="position-relative">
												<img
													className="d-block w-100 ad-image"
													src={image}
													alt={`Ad ${selectedAd.title} - view ${index + 1}`} // Updated alt text
													style={{ height: "300px", objectFit: "contain" }} // Adjust the height as needed
												/>
											</Carousel.Item>
										))
									) : (
										<Carousel.Item>
											<p className="text-center">No images available</p>
										</Carousel.Item>
									)}
								</Carousel>
								<Container className="ad-details mb-4">
									<Row>
										<Col xs={12} md={6}>
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Price
												</Card.Header>
												<Card.Body className="text-center">
													<em className="ad-price-label">Kshs: </em>
													<strong className="text-success">
														{selectedAd.price
															? parseFloat(selectedAd.price)
																	.toFixed(2)
																	.split(".")
																	.map((part, index) => (
																		<React.Fragment key={index}>
																			{index === 0 ? (
																				<span className="price-integer">
																					{parseInt(part, 10).toLocaleString()}{" "}
																					{/* Add commas to the integer part */}
																				</span>
																			) : (
																				<>
																					<span style={{ fontSize: "16px" }}>
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
												</Card.Body>
											</Card>
										</Col>
										<Col xs={12} md={6}>
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Seller
												</Card.Header>
												<Card.Body className="text-center">
													{selectedAd.seller?.fullname || "Unknown"}
												</Card.Body>
											</Card>
										</Col>
									</Row>

									<Row>
										<Col xs={12} md={6}>
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Category
												</Card.Header>
												<Card.Body className="text-center">
													{selectedAd.category?.name || "N/A"}
												</Card.Body>
											</Card>
										</Col>
										<Col xs={12} md={6}>
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Sold Out
												</Card.Header>
												<Card.Body className="text-center">
													{selectedAd.sold_out ? "Yes" : "No"}
												</Card.Body>
											</Card>
										</Col>
									</Row>

									<Row>
										<Col xs={6} md={6}>
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Quantity Sold
												</Card.Header>
												<Card.Body className="text-center">
													{selectedAd.quantity_sold || 0}
												</Card.Body>
											</Card>
										</Col>
										<Col xs={6} md={6}>
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Rating
												</Card.Header>
												<Card.Body className="text-center">
													<span className="star-rating">
														{renderRatingStars(selectedAd.mean_rating)}
													</span>
												</Card.Body>
											</Card>
										</Col>
									</Row>

									<Row>
										<Col xs={12}>
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Description
												</Card.Header>
												<Card.Body className="text-center">
													{selectedAd.description}
												</Card.Body>
											</Card>
										</Col>
									</Row>
								</Container>
								<h5 className="text-center" id="reviews">
									Reviews
								</h5>
								{selectedAd &&
								selectedAd.reviews &&
								selectedAd.reviews.length > 0 ? (
									<div className="reviews-container text-center px-0 px-lg-1 py-0">
										{selectedAd.reviews.map((review, index) => (
											<div className="review-card py-2 px-2" key={index}>
												<p className="review-comment">
													<em>"{review.review}"</em>
												</p>
												<StarRating rating={review.rating} />
												<p className="reviewer-name">
													<strong>{review.buyer.fullname}</strong>
												</p>
											</div>
										))}
									</div>
								) : (
									<p className="text-center">No reviews yet</p>
								)}
							</>
						)}
					</Modal.Body>
					<Modal.Footer className="p-0 p-lg-1">
						<Button variant="danger" id="button" onClick={handleModalClose}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>

				<Modal
					centered
					show={showNotifySellerModal}
					onHide={handleModalClose}
					size="xl"
				>
					<Modal.Header>
						<Modal.Title>Notify Seller</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group controlId="notificationOptions">
								<Form.Label>Select Notification Reasons:</Form.Label>
								<div>
									<Form.Check
										type="checkbox"
										label="Low-Quality Images"
										value="Low-Quality Images"
										onChange={handleNotificationOptionChange}
									/>
									<Form.Check
										type="checkbox"
										label="Wrong Pricing"
										value="Wrong Pricing"
										onChange={handleNotificationOptionChange}
									/>
									<Form.Check
										type="checkbox"
										label="Insufficient Description"
										value="Insufficient Description"
										onChange={handleNotificationOptionChange}
									/>
									{/* Add more options here if needed */}
								</div>
							</Form.Group>
							<Form.Group controlId="notes">
								<Form.Label>Notes:</Form.Label>
								<Form.Control
									as="textarea"
									rows={3}
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
								/>
							</Form.Group>
						</Form>
					</Modal.Body>
					<Modal.Footer className="p-0 p-lg-1">
						<Button
							variant="danger"
							id="button"
							className="mx-2"
							onClick={handleModalClose}
						>
							Close
						</Button>
						<Button
							variant="warning"
							id="button"
							onClick={handleSendNotification}
						>
							Send Notification
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		</>
	);
};

export default AdsManagement;
