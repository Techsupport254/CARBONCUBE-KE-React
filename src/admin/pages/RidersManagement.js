import React, { useState, useEffect } from "react";
import {
	Table,
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
import { faUserShield, faKey } from "@fortawesome/free-solid-svg-icons";
// faStar, faStarHalfAlt, faStar as faStarEmpty
import Sidebar from "../components/Sidebar";
import Navbar from "../../components/Navbar";
import Spinner from "react-spinkit";
import "../css/SellersManagement.css"; // Custom CSS

const RidersManagement = () => {
	const [showModal, setShowModal] = useState(false);
	const [selectedRider, setSelectedRider] = useState(null);
	const [riders, setRiders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedTab, setSelectedTab] = useState("profile");
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const fetchRiders = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/admin/riders?search_query=${searchQuery}`,
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
				// console.log('Fetched riders:', data); // Add this line
				data.sort((a, b) => a.id - b.id);
				setRiders(data);
			} catch (error) {
				// console.error('Error fetching riders:', error);
				setError("Error fetching riders");
			} finally {
				setLoading(false);
			}
		};

		fetchRiders();
	}, [searchQuery]); // Depend on searchQuery so it refetches when the query changes

	const handleRowClick = async (riderId) => {
		try {
			const [riderResponse] = await Promise.all([
				fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/riders/${riderId}`, {
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}),
			]);

			if (!riderResponse.ok) {
				throw new Error("Network response was not ok");
			}

			const riderData = await riderResponse.json();
			// const analytics = await fetchRiderAnalytics(riderId);

			setSelectedRider({ ...riderData });
			setSelectedTab("profile");
			setShowModal(true);
		} catch (error) {
			// console.error('Error fetching rider details:', error);
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setSelectedRider(null);
	};

	const handleUpdateStatus = async (riderId, status) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/riders/${riderId}/${status}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				console.error("Error updating rider status:", errorData);
				return;
			}

			setRiders((prevRiders) =>
				prevRiders.map((rider) =>
					rider.id === riderId
						? { ...rider, blocked: status === "block" }
						: rider
				)
			);

			if (selectedRider && selectedRider.id === riderId) {
				setSelectedRider((prevRider) => ({
					...prevRider,
					blocked: status === "block",
				}));
			}
		} catch (error) {
			// console.error('Error updating rider status:', error);
		}
	};

	// const StarRating = ({ rating }) => {
	//     const fullStars = Math.floor(rating);
	//     const halfStar = rating % 1 >= 0.5;
	//     const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

	//     return (
	//         <span className="star-rating">
	//             {[...Array(fullStars)].map((_, index) => (
	//                 <FontAwesomeIcon key={index} icon={faStar} className="star filled" />
	//             ))}
	//             {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} className="star half-filled" />}
	//             {[...Array(emptyStars)].map((_, index) => (
	//                 <FontAwesomeIcon key={index} icon={faStarEmpty} className="star empty" />
	//             ))}
	//         </span>
	//     );
	// };

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
			<div className="sellers-management-page">
				<Container fluid className="p-0">
					<Row>
						<Col xs={12} md={2} className="p-0">
							<Sidebar />
						</Col>
						<Col xs={12} md={10} lg={9} className="p-0">
							{/* <h2 className="mb-4 text-center">Riders Management</h2> */}
							<Card className="section">
								<Card.Header className="text-center orders-header p-1 p-lg-2">
									<Container fluid>
										<Row className="d-flex flex-row flex-md-row justify-content-between align-items-center">
											<Col
												xs="auto"
												className="d-flex align-items-center mb-0 mb-md-0 text-center ms-3 ps-4"
											>
												<h4 className="mb-0 align-self-center">Riders</h4>
											</Col>
											<Col xs="auto" className="d-flex align-items-center">
												<div className="search-container d-flex align-items-center">
													<Form>
														<Form.Group controlId="searchPhoneNumberOrID">
															<Form.Control
																type="text"
																placeholder="Search (Rider ID)"
																className="form-control"
																value={searchQuery}
																onChange={(e) => setSearchQuery(e.target.value)}
															/>
														</Form.Group>
													</Form>
												</div>
											</Col>
										</Row>
									</Container>
								</Card.Header>
								<Card.Body className="p-2 table-container">
									<div className="table-responsive orders-table-container">
										<Table hover className="orders-table text-center">
											<thead>
												<tr>
													<th>Rider ID</th>
													<th>Name</th>
													<th>Phone Number</th>
													<th>Number Plate</th>
													<th>Email</th>
													<th>Physical Address</th>
													<th>Status</th>
												</tr>
											</thead>
											<tbody>
												{riders.length > 0 ? (
													riders.map((rider) => (
														<tr
															key={rider.id}
															onClick={() => handleRowClick(rider.id)}
															className={`rider-row ${
																rider.blocked ? "blocked" : ""
															}`}
															style={{ cursor: "pointer" }}
														>
															<td>{rider.id}</td>
															<td>{rider.full_name}</td>
															<td>{rider.phone_number}</td>
															<td>{rider.license_plate}</td>
															<td>{rider.email}</td>
															<td>{rider.physical_address}</td>
															<td>
																<Button
																	variant={rider.blocked ? "danger" : "warning"}
																	id="button"
																	onClick={(e) => {
																		e.stopPropagation();
																		handleUpdateStatus(
																			rider.id,
																			rider.blocked ? "unblock" : "block"
																		);
																	}}
																>
																	<FontAwesomeIcon
																		icon={rider.blocked ? faKey : faUserShield}
																	/>
																</Button>
															</td>
														</tr>
													))
												) : (
													<tr>
														<td colSpan="7">No data available</td>
													</tr>
												)}
											</tbody>
										</Table>
									</div>
								</Card.Body>
								<Card.Footer></Card.Footer>
							</Card>

							<Modal
								centered
								show={showModal}
								onHide={handleCloseModal}
								size="xl"
							>
								<Modal.Header className="justify-content-center p-1 p-lg-1">
									<Modal.Title>Rider Info</Modal.Title>
								</Modal.Header>
								<Modal.Body className="m-0 p-1">
									{selectedRider ? (
										<Tabs
											activeKey={selectedTab}
											onSelect={(key) => setSelectedTab(key)}
											id="seller-details-tabs"
											className="custom-tabs mb-0 mb-lg-2 mx-1 mx-lg-4 d-flex justify-content-between flex-row nav-justified mt-2"
											style={{ gap: "10px" }}
										>
											<Tab eventKey="profile" title="Profile">
												{/* <h5 className="text-center">Profile</h5> */}
												<Container className="profile-cards text-center">
													<Row>
														<Col xs={12} md={6} className="px-1 px-lg-2">
															<Card className="mb-2 custom-card">
																<Card.Header
																	as="h6"
																	className="justify-content-center"
																>
																	Name
																</Card.Header>
																<Card.Body className="text-center">
																	{selectedRider.full_name}
																</Card.Body>
															</Card>
														</Col>
														<Col xs={12} md={6} className="px-1 px-lg-2">
															<Card className="mb-2 custom-card">
																<Card.Header
																	as="h6"
																	className="justify-content-center"
																>
																	Email
																</Card.Header>
																<Card.Body className="text-center">
																	{selectedRider.email}
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
																	Phone
																</Card.Header>
																<Card.Body className="text-center">
																	{selectedRider.phone_number}
																</Card.Body>
															</Card>
														</Col>
														<Col xs={6} md={6} className="px-1 px-lg-2">
															<Card className="mb-2 custom-card">
																<Card.Header
																	as="h6"
																	className="justify-content-center"
																>
																	ID Number
																</Card.Header>
																<Card.Body className="text-center">
																	{selectedRider.id_number}
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
																	Gender
																</Card.Header>
																<Card.Body className="text-center">
																	{selectedRider.gender}
																</Card.Body>
															</Card>
														</Col>
														<Col xs={6} md={6} className="px-1 px-lg-2">
															<Card className="mb-2 custom-card">
																<Card.Header
																	as="h6"
																	className="justify-content-center"
																>
																	Date of Birth
																</Card.Header>
																<Card.Body className="text-center">
																	{selectedRider.date_of_birth}
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
																	Driving License
																</Card.Header>
																<Card.Body className="text-center">
																	{selectedRider.driving_license}
																</Card.Body>
															</Card>
														</Col>
														<Col xs={6} md={6} className="px-1 px-lg-2">
															<Card className="mb-2 custom-card">
																<Card.Header
																	as="h6"
																	className="justify-content-center"
																>
																	Status
																</Card.Header>
																<Card.Body className="text-center">
																	<span
																		className={
																			selectedRider.blocked
																				? "text-danger"
																				: "text-success"
																		}
																	>
																		{selectedRider.blocked
																			? "Blocked"
																			: "Active"}
																	</span>
																</Card.Body>
															</Card>
														</Col>
													</Row>

													<Row>
														<Col xs={12} md={12} className="px-1 px-lg-2">
															<Card className="mb-2 custom-card">
																<Card.Header
																	as="h6"
																	className="justify-content-center"
																>
																	Physical Address
																</Card.Header>
																<Card.Body className="text-center">
																	{selectedRider.physical_address}
																</Card.Body>
															</Card>
														</Col>
													</Row>

													<Row>
														<h4>Next of Kin</h4>
													</Row>

													<Row>
														<Col xs={12} md={12} className="px-1 px-lg-2">
															<Card className="mb-2 custom-card">
																<Card.Header
																	as="h6"
																	className="justify-content-center"
																>
																	Name
																</Card.Header>
																<Card.Body className="text-center">
																	{selectedRider.kin_full_name}
																</Card.Body>
															</Card>
														</Col>
														<Col xs={6} md={6} className="px-1 px-lg-2">
															<Card className="mb-2 custom-card">
																<Card.Header
																	as="h6"
																	className="justify-content-center"
																>
																	Phone Number
																</Card.Header>
																<Card.Body className="text-center">
																	{selectedRider.kin_phone_number}
																</Card.Body>
															</Card>
														</Col>
														<Col xs={6} md={6} className="px-1 px-lg-2">
															<Card className="mb-2 custom-card">
																<Card.Header
																	as="h6"
																	className="justify-content-center"
																>
																	Relationship
																</Card.Header>
																<Card.Body className="text-center">
																	{selectedRider.kin_relationship}
																</Card.Body>
															</Card>
														</Col>
													</Row>
												</Container>
											</Tab>

											<Tab eventKey="vehicleinfo" title="Vehicle Info">
												{/* <h5 className="text-center">Profile</h5> */}
												<Container className="profile-cards text-center">
													<Row>
														<Col xs={12} md={6} className="px-1 px-lg-2">
															<Card className="mb-2 custom-card">
																<Card.Header
																	as="h6"
																	className="justify-content-center"
																>
																	Vehicle Type
																</Card.Header>
																<Card.Body className="text-center">
																	{selectedRider.vehicle_type}
																</Card.Body>
															</Card>
														</Col>
														<Col xs={12} md={6} className="px-1 px-lg-2">
															<Card className="mb-2 custom-card">
																<Card.Header
																	as="h6"
																	className="justify-content-center"
																>
																	Number Plate
																</Card.Header>
																<Card.Body className="text-center">
																	{selectedRider.license_plate}
																</Card.Body>
															</Card>
														</Col>
													</Row>
												</Container>
											</Tab>

											{/* <Tab eventKey="analytics" title="Analytics">
                                                {selectedRider.analytics ? (
                                                    <Container className="profile-cards text-center">
                                                        <Row>
                                                            <Col xs={6} md={6} className="px-1 px-lg-2">
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Total Orders</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        {selectedRider.analytics.total_orders}
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                            <Col xs={6} md={6} className="px-1 px-lg-2">
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Total Ads Sold</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        {selectedRider.analytics.total_ads_sold}
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col xs={6} md={6} className="px-1 px-lg-2">
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Total Revenue</Card.Header>
                                                                    <Card.Body className="text-center price-container">
                                                                        <Card.Text className="total-revenue m-0 text-center">
                                                                            <span><em className='ad-price-label text-success'>Kshs: </em></span>
                                                                            <strong className="price text-danger">
                                                                            {selectedRider.analytics.total_revenue ? parseFloat(selectedRider.analytics.total_revenue).toFixed(2).split('.').map((part, index) => (
                                                                                <React.Fragment key={index}>
                                                                                {index === 0 ? (
                                                                                    <span className="price-integer">
                                                                                    {parseInt(part, 10).toLocaleString()} 
                                                                                    </span>
                                                                                ) : (
                                                                                    <>
                                                                                    <span style={{ fontSize: '16px' }}>.</span>
                                                                                    <span className="price-decimal">{part}</span>
                                                                                    </>
                                                                                )}
                                                                                </React.Fragment>
                                                                            )) : 'N/A'}
                                                                            </strong>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                            <Col xs={6} md={6} className="px-1 px-lg-2">
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Total Reviews</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        {selectedRider.analytics.total_reviews}
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col xs={12} className="px-1 px-lg-2">
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Mean Rating</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        <StarRating rating={selectedRider.analytics.mean_rating} />
                                                                        <p className='m-0'>{selectedRider.analytics.mean_rating}/5</p>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                    </Container>
                                                ) : (
                                                    <p>Loading analytics data...</p>
                                                )}
                                            </Tab> */}
											{/* <Tab eventKey="orders" title="Orders">
                                                
                                                <div className='section mt-1 custom-card'>
                                                    <div className='table-container'>
                                                        <div className="table-responsive orders-table-container">
                                                            <Table hover className="orders-table text-center transparent-table transparent-table-striped">
                                                                <thead className='table-head'>
                                                                    <tr>
                                                                        <th>Order ID</th>
                                                                        <th>Buyer</th>
                                                                        <th>Ad</th>
                                                                        <th>Quantity</th>
                                                                        <th>Status</th>
                                                                        <th>Total <em className='ad-price-label' style={{ fontSize: '13px' }}>(Kshs:) </em></th>
                                                                        <th>Date Ordered</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {selectedRider && selectedRider.orders && selectedRider.orders.length > 0 ? (
                                                                        selectedRider.orders.map((order) => (
                                                                            order.order_items.map((item) => (
                                                                                <tr key={`${order.id}-${item.ad.id}`}>
                                                                                    <td>{order.id}</td>
                                                                                    <td>{order.buyer.fullname}</td>
                                                                                    <td>{item.ad.title}</td>
                                                                                    <td>{item.quantity}</td>
                                                                                    <td onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
                                                                                        <Form.Control
                                                                                            className="form-select-admin text-center" // Custom class for removing arrow
                                                                                            as="select"
                                                                                            value={order.status}
                                                                                            id="button"
                                                                                            disabled
                                                                                            style={{
                                                                                                verticalAlign: 'middle',
                                                                                                display: 'inline-block',
                                                                                                width: '60%',
                                                                                                height: '40px', // Adjust the height to your preference
                                                                                                backgroundColor: 
                                                                                                    order.status === 'Cancelled' ? '#FF0000' :  // Red
                                                                                                    order.status === 'Dispatched' ? '#007BFF' : // Blue
                                                                                                    order.status === 'In-Transit' ? '#80CED7' : // Light Blue
                                                                                                    order.status === 'Returned' ? '#6C757D' :  // Grey
                                                                                                    order.status === 'Processing' ? '#FFC107' : // Yellow
                                                                                                    order.status === 'Delivered' ? '#008000' : '', // Green
                                                                                                color: ['Delivered', 'Returned', 'Dispatched', 'Cancelled'].includes(order.status) 
                                                                                                    ? 'white' : 'black', // White text for specific statuses
                                                                                                
                                                                                            }}
                                                                                        >
                                                                                            <option value={order.status}>{order.status}</option>
                                                                                        </Form.Control>
                                                                                    </td>
                                                                                    <td className="price-container">
                                                                                        <strong className="text-success">
                                                                                            {((item.quantity * item.ad.price).toFixed(2)).split('.').map((part, index) => (
                                                                                                <React.Fragment key={index}>
                                                                                                    {index === 0 ? (
                                                                                                        <span className="price-integer">
                                                                                                            {parseInt(part, 10).toLocaleString()} 
                                                                                                        </span>
                                                                                                    ) : (
                                                                                                        <>
                                                                                                            <span style={{ fontSize: '16px' }}>.</span>
                                                                                                            <span className="price-decimal">{part}</span>
                                                                                                        </>
                                                                                                    )}
                                                                                                </React.Fragment>
                                                                                            ))}
                                                                                        </strong>
                                                                                    </td>
                                                                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                                                                </tr>
                                                                            ))
                                                                        ))
                                                                    ) : (
                                                                        <tr>
                                                                            <td colSpan="6">No orders available</td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab>                                            */}

											{/* <Tab eventKey="ads" title="Ads">
                                                <div className="card-container">
                                                    {selectedRider.ads && selectedRider.ads.length > 0 ? (
                                                        selectedRider.ads.map((ad) => (
                                                            <Col key={ad.id} xs={12} md={12} lg={12} className="mb-1">
                                                                <Card className="ad-card-seller">
                                                                    <Card.Img
                                                                        className="analytics-card-img-top ad-image"
                                                                        variant="top"
                                                                        src={ad.media_urls && ad.media_urls.length > 0 ? ad.media_urls[0] : 'default-image-url'}
                                                                    />
                                                                    <Card.Body className='p-2'>
                                                                        <Card.Title className="mb-0" style={{ fontSize: '18px' }}>{ad.title}</Card.Title>
                                                                        <Card.Text className="price-container">
                                                                            <span><em className='ad-price-label text-success'>Kshs: </em></span>
                                                                            <strong className='text-danger'>
                                                                                {ad.price ? parseFloat(ad.price).toFixed(2).split('.').map((part, index) => (
                                                                                <React.Fragment key={index}>
                                                                                    {index === 0 ? (
                                                                                    <span className="price-integer">
                                                                                        {parseInt(part, 10).toLocaleString()} 
                                                                                    </span>
                                                                                    ) : (
                                                                                    <>
                                                                                        <span style={{ fontSize: '16px' }}>.</span>
                                                                                        <span className="price-decimal">{part}</span>
                                                                                    </>
                                                                                    )}
                                                                                </React.Fragment>
                                                                                )) : 'N/A'}
                                                                            </strong>                                                                                
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        ))
                                                    ) : (
                                                        <p className="text-center">No ads available</p>
                                                    )}
                                                </div>
                                            </Tab> */}

											{/* <Tab eventKey="reviews" title="Reviews">
                                                
                                                {selectedRider.reviews && selectedRider.reviews.length > 0 ? (
                                                    <Row>
                                                    {selectedRider.reviews.map((review) => (
                                                        <Col lg={6} key={review.id} className=" justify-content-center">
                                                        <div className="reviews-container text-center p-0 p-lg-2 ">
                                                            <div className="review-card p-1">
                                                            <p className="review-comment"><em>"{review.review}"</em></p>
                                                            <StarRating rating={review.rating} /> 
                                                            <p className="review-ad"><strong>{review.ad_title}</strong></p>
                                                            <p className="reviewer-name"><strong><em>{review.buyer_name}</em></strong></p>
                                                            </div>
                                                        </div>
                                                        </Col>
                                                    ))}
                                                    </Row>
                                                ) : (
                                                    <p className="text-center">No reviews available</p>
                                                )}
                                            </Tab> */}
										</Tabs>
									) : (
										<p>Loading...</p>
									)}
								</Modal.Body>
								<Modal.Footer className="p-1 p-lg-1">
									<Button
										variant="danger"
										id="button"
										onClick={handleCloseModal}
									>
										Close
									</Button>
								</Modal.Footer>
							</Modal>
						</Col>
					</Row>
				</Container>
			</div>
		</>
	);
};

export default RidersManagement;
