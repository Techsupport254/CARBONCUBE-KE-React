import React, { useState, useEffect } from "react";
import {
	Table,
	Modal,
	Button,
	Container,
	Row,
	Col,
	Form,
	Card,
} from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import Sidebar from "../components/Sidebar";
import Navbar from "../../components/Navbar";
import Spinner from "react-spinkit";
import "../css/OrdersManagement.css"; // Custom CSS

const OrdersManagement = () => {
	const [showModal, setShowModal] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/admin/orders?search_query=${searchQuery}`,
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
				data.sort((a, b) => a.id - b.id);
				setOrders(data);
			} catch (error) {
				// console.error('Error fetching orders:', error);
				setError("Error fetching orders");
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [searchQuery]);

	const handleRowClick = async (orderId) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/orders/${orderId}`,
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
			setSelectedOrder(data);
			setShowModal(true);
		} catch (error) {
			// console.error('Error fetching order details:', error);
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setSelectedOrder(null);
	};

	const handleUpdateStatus = async (orderId, status) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/orders/${orderId}/update-status`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
					body: JSON.stringify({ status }),
				}
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const updatedOrder = await response.json();
			setOrders((prevOrders) =>
				prevOrders.map((order) => (order.id === orderId ? updatedOrder : order))
			);
		} catch (error) {
			// console.error('Error updating order status:', error);
		}
	};

	const handleDeleteOrder = async (orderId) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/orders/${orderId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			setOrders((prevOrders) =>
				prevOrders.filter((order) => order.id !== orderId)
			);
		} catch (error) {
			// console.error('Error deleting order:', error);
		}
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
			<div className="orders-management-page">
				<Container fluid className="p-0">
					<Row>
						<Col xs={12} md={2} className="p-0">
							<Container fluid>
								<Sidebar />
							</Container>
						</Col>

						<Col xs={12} md={10} lg={9} className="p-0">
							<Card className="section">
								<Card.Header className="text-center orders-header p-1 p-lg-2">
									<Container fluid>
										<Row className="d-flex flex-row flex-md-row justify-content-between align-items-center">
											<Col
												xs="auto"
												className="d-flex align-items-center mb-0 mb-md-0 text-center ms-3 ps-3"
											>
												<h4 className="mb-0 align-self-center">Orders</h4>
											</Col>
											<Col xs="auto" className="d-flex align-items-center">
												<div className="search-container d-flex align-items-center">
													<Form>
														<Form.Group controlId="searchPhoneNumberOrID">
															<Form.Control
																type="text"
																placeholder="Search (Order ID)"
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

								<Card.Body className="p-0 table-container">
									<div className="table-responsive orders-table-container">
										<Table hover className="orders-table text-center">
											<thead className="table-header">
												<tr>
													<th>Order ID</th>
													<th>Buyer</th>
													<th>Ads</th>
													<th>Quantity</th>
													<th>
														Total&nbsp;
														<em
															className="ad-price-label"
															style={{ fontSize: "13px" }}
														>
															(Kshs:)
														</em>
													</th>
													<th>Date Ordered</th>
													<th>Status</th>
													<th>Action</th>
												</tr>
											</thead>
											<tbody>
												{orders.length > 0 ? (
													orders.map((order) => (
														<tr
															key={order.id}
															onClick={(e) => {
																if (
																	e.target.tagName === "SELECT" ||
																	e.target.tagName === "BUTTON"
																)
																	return; // Prevent modal opening on status change or delete button click
																handleRowClick(order.id);
															}}
															style={{ cursor: "pointer" }}
														>
															<td>{order.id}</td>
															<td>{order.buyer?.fullname || "Unknown"}</td>
															<td>
																{order.order_items
																	.slice(0, 3) // Limit to the first 3 ads
																	.map((item, index, array) => {
																		const title = item.ad?.title || "Unknown";
																		// Limit the title to 3 words
																		const truncatedTitle = title
																			.split(" ")
																			.slice(0, 3)
																			.join(" ");
																		// Add a comma after each item except the last one
																		return `${truncatedTitle}${
																			index < array.length - 1 ? "," : ""
																		}`;
																	})
																	.join(" ")}
																{order.order_items.length > 3 && ", ..."}{" "}
																{/* Add ellipsis if more than 3 ads */}
															</td>

															<td>
																{order.order_items
																	.map((item) => item.quantity || 0)
																	.reduce((a, b) => a + b, 0)}
															</td>
															<td className="price-container text-success">
																<strong>
																	{order.total_amount
																		? parseFloat(order.total_amount)
																				.toFixed(2)
																				.split(".")
																				.map((part, index) => (
																					<React.Fragment key={index}>
																						{index === 0 ? (
																							<span className="price-integer">
																								{parseInt(
																									part,
																									10
																								).toLocaleString()}{" "}
																								{/* Format the integer part with commas */}
																							</span>
																						) : (
																							<>
																								<span
																									style={{ fontSize: "16px" }}
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
															</td>
															<td>{order.order_date || "N/A"}</td>
															<td>
																<Form.Control
																	className="form-select-admin align-middle"
																	as="select"
																	value={order.status}
																	onChange={(e) =>
																		handleUpdateStatus(order.id, e.target.value)
																	}
																	id="button"
																	style={{
																		verticalAlign: "middle",
																		display: "inline-block",
																		width: "60%",
																		height: "40px",
																		backgroundColor:
																			order.status === "Cancelled"
																				? "#FF0000" // Red
																				: order.status === "Dispatched"
																				? "#007BFF" // Blue
																				: order.status === "In-Transit"
																				? "#80CED7" // Orange
																				: order.status === "Returned"
																				? "#6C757D" // Grey
																				: order.status === "Processing"
																				? "#FFC107" // Yellow
																				: order.status === "Delivered"
																				? "#008000"
																				: "", // Green
																		color: [
																			"Delivered",
																			"Returned",
																			"Dispatched",
																			"Cancelled",
																		].includes(order.status)
																			? "white"
																			: "black", // White text for specific statuses
																	}}
																>
																	<option
																		className="text-center mb-1"
																		value="Processing"
																	>
																		Processing
																	</option>
																	<option
																		className="text-center mb-1"
																		value="Dispatched"
																	>
																		Dispatched
																	</option>
																	<option
																		className="text-center mb-1"
																		value="In-Transit"
																	>
																		In-Transit
																	</option>
																	<option
																		className="text-center mb-1"
																		value="Delivered"
																	>
																		Delivered
																	</option>
																	<option
																		className="text-center mb-1"
																		value="Cancelled"
																	>
																		Cancelled
																	</option>
																	<option
																		className="text-center mb-1"
																		value="Returned"
																	>
																		Returned
																	</option>
																</Form.Control>
															</td>
															<td>
																<button
																	className="btn btn-link p-0"
																	onClick={(e) => {
																		e.stopPropagation();
																		handleDeleteOrder(order.id);
																	}}
																	title="Delete Order"
																>
																	<Trash className="text-danger" />
																</button>
															</td>
														</tr>
													))
												) : (
													<tr>
														<td colSpan="8">No data available</td>
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
								<Modal.Header className="justify-content-center p-1 p-lg-2">
									<Modal.Title>Order Details</Modal.Title>
								</Modal.Header>
								<Modal.Body className="p-1 p-lg-3">
									{selectedOrder ? (
										<>
											<Row>
												<Col xs={6} md={6} lg={6}>
													<Card className="mb-2 custom-card">
														<Card.Header
															as="h6"
															className="justify-content-center"
														>
															Order ID
														</Card.Header>
														<Card.Body className="text-center p-2 p-lg-3">
															{selectedOrder.id}
														</Card.Body>
													</Card>
												</Col>
												<Col xs={6} md={6} lg={6}>
													<Card className="mb-2 custom-card">
														<Card.Header
															as="h6"
															className="justify-content-center"
														>
															Buyer
														</Card.Header>
														<Card.Body className="text-center p-2 p-lg-3">
															{selectedOrder.buyer?.fullname || "Unknown"}
														</Card.Body>
													</Card>
												</Col>
											</Row>

											<Row>
												<Col xs={6} md={6} lg={6}>
													<Card className="mb-2 custom-card">
														<Card.Header
															as="h6"
															className="justify-content-center"
														>
															Date Ordered
														</Card.Header>
														<Card.Body className="text-center p-2 p-lg-3">
															{selectedOrder.order_date || "N/A"}
														</Card.Body>
													</Card>
												</Col>
												<Col xs={6} md={6} lg={6}>
													<Card className="mb-2 custom-card">
														<Card.Header
															as="h6"
															className="justify-content-center"
														>
															Total Price
														</Card.Header>
														<Card.Body className="price-container text-center p-2 p-lg-3">
															<span>
																<em className="text-success">Kshs: </em>
															</span>
															<strong className="text-success">
																<span className="price">
																	{selectedOrder.total_amount
																		? parseFloat(selectedOrder.total_amount)
																				.toFixed(2)
																				.split(".")
																				.map((part, index) => (
																					<React.Fragment key={index}>
																						{index === 0 ? (
																							<span className="price-integer">
																								{parseInt(
																									part,
																									10
																								).toLocaleString()}{" "}
																								{/* Add commas to the integer part */}
																							</span>
																						) : (
																							<>
																								<span
																									style={{ fontSize: "16px" }}
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
																		: "0.00"}
																</span>
															</strong>
														</Card.Body>
													</Card>
												</Col>
											</Row>

											<Card className="mt-2 mt-lg-4 custom-card">
												<Card.Header className="justify-content-center text-center pb-1">
													<h4 className="mb-0">Ads</h4>
												</Card.Header>
												<Card.Body>
													<div className="ad-container text-center">
														<div className="table-responsive p-1">
															<Table
																bordered
																hover
																className="transparent-table transparent-table-striped"
															>
																<thead>
																	<tr>
																		<th>Ad Name</th>
																		<th>Seller</th>
																		<th>Quantity</th>
																		<th>
																			Price{" "}
																			<em style={{ fontSize: "12px" }}>
																				(Kshs)
																			</em>
																		</th>
																	</tr>
																</thead>
																<tbody>
																	{selectedOrder.order_items &&
																	selectedOrder.order_items.length > 0 ? (
																		selectedOrder.order_items.map((item) => (
																			<tr key={item.ad?.id || "unknown"}>
																				<td className="text-start">
																					{item.ad?.title || "Unknown"}
																				</td>
																				<td>
																					{item.ad?.seller?.fullname ||
																						"Unknown"}
																				</td>
																				<td>{item.quantity || "0"}</td>
																				<td className="price-container">
																					{/* <em className="ad-price-label">Kshs: </em> */}
																					<strong>
																						<span className="price text-success">
																							{item.ad?.price && item.quantity
																								? (
																										item.ad.price *
																										item.quantity
																								  )
																										.toFixed(2)
																										.split(".")
																										.map((part, index) => (
																											<React.Fragment
																												key={index}
																											>
																												{index === 0 ? (
																													<span className="price-integer">
																														{parseInt(
																															part,
																															10
																														).toLocaleString()}{" "}
																														{/* Add commas to the integer part */}
																													</span>
																												) : (
																													<>
																														<span
																															style={{
																																fontSize:
																																	"16px",
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
																								: "0.00"}
																						</span>
																					</strong>
																				</td>
																			</tr>
																		))
																	) : (
																		<tr>
																			<td colSpan="4">No ads available</td>
																		</tr>
																	)}
																	<tr>
																		<td colSpan="3" className="text-start">
																			<strong>Processing Fee:</strong>
																		</td>
																		<td className="text-success">
																			<strong>
																				{selectedOrder.processing_fee
																					? parseFloat(
																							selectedOrder.processing_fee
																					  )
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
																		</td>
																	</tr>
																	{/* Delivery Fee Row */}
																	<tr>
																		<td colSpan="3" className="text-start">
																			<strong>Delivery Fee:</strong>
																		</td>
																		<td className="text-success">
																			<strong>
																				{selectedOrder.delivery_fee
																					? parseFloat(
																							selectedOrder.delivery_fee
																					  )
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
																		</td>
																	</tr>
																</tbody>
															</Table>
														</div>
													</div>
												</Card.Body>
											</Card>
										</>
									) : (
										<p>No details available</p>
									)}
								</Modal.Body>
								<Modal.Footer className="p-0 p-lg-1">
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

export default OrdersManagement;
