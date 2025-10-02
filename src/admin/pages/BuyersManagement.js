import React, { useState, useEffect } from "react";
import {
	Table,
	Modal,
	Button,
	Container,
	Row,
	Col,
	Card,
	Form,
} from "react-bootstrap";

import Navbar from "../../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserShield, faKey } from "@fortawesome/free-solid-svg-icons";
import Spinner from "react-spinkit";
import "../css/BuyersManagement.css"; // Custom CSS

const BuyersManagement = () => {
	const [showModal, setShowModal] = useState(false);
	const [selectedBuyer, setSelectedBuyer] = useState(null);
	const [buyers, setBuyers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const fetchBuyers = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/admin/buyers?search_query=${searchQuery}`,
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
				setBuyers(data);
			} catch (error) {
				setError("Error fetching buyers");
			} finally {
				setLoading(false);
			}
		};

		fetchBuyers();
	}, [searchQuery]);

	const handleRowClick = async (buyerId) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/buyers/${buyerId}`,
				{
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token"), // Add token if required
					},
				}
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const data = await response.json();
			setSelectedBuyer(data);
			setShowModal(true);
		} catch (error) {
		}
	};

	const handleUpdateStatus = async (buyerId, status) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/buyers/${buyerId}/${status}`,
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
				window.alert("Error updating buyer status:", errorData);
				return;
			}

			setBuyers((prevBuyers) =>
				prevBuyers.map((buyer) =>
					buyer.id === buyerId
						? { ...buyer, blocked: status === "block" }
						: buyer
				)
			);

			if (selectedBuyer && selectedBuyer.id === buyerId) {
				setSelectedBuyer((prevBuyer) => ({
					...prevBuyer,
					blocked: status === "block",
				}));
			}
		} catch (error) {
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setSelectedBuyer(null);
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
			<div className="buyers-management-page">
				<Container fluid className="p-0">
					<Row>
						<Col xs={12} md={10} lg={9} className="p-0 p-lg-2">
							<Card className="section">
								<Card.Header className="text-center orders-header p-1 p-lg-2">
									<Container fluid>
										<Row className="d-flex flex-row flex-md-row justify-content-between align-items-center">
											<Col
												xs="auto"
												className="d-flex align-items-center mb-0 mb-md-0 text-center ms-3 ps-3"
											>
												<h4 className="mb-0 align-self-center">Buyers</h4>
											</Col>
											<Col xs="auto" className="d-flex align-items-center">
												<div className="search-container d-flex align-items-center">
													<Form>
														<Form.Group controlId="searchPhoneNumberOrID">
															<Form.Control
																type="text"
																placeholder="Search (Seller ID)"
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
								<Card.Body className="p-0 m-0 table-container">
									<div className="table-responsive orders-table-container">
										<Table hover className="orders-table text-center">
											<thead className="table-header">
												<tr>
													<th>Buyer ID</th>
													<th>Name</th>
													<th>Contact</th>
													<th>Email</th>
													<th>Address</th>
													<th>Status</th>
												</tr>
											</thead>
											<tbody>
												{buyers.length > 0 ? (
													buyers
														.sort((a, b) => a.id - b.id) // Sort buyers by ID in ascending order
														.map((buyer) => (
															<tr
																key={buyer.id}
																onClick={() => handleRowClick(buyer.id)}
																style={{ cursor: "pointer" }}
															>
																<td>{buyer.id}</td>
																<td>{buyer.fullname}</td>
																<td>{buyer.phone_number}</td>
																<td>{buyer.email}</td>
																<td>{buyer.location}</td>
																<td>
																	<Button
																		variant={
																			buyer.blocked ? "danger" : "warning"
																		}
																		id="button"
																		onClick={(e) => {
																			e.stopPropagation();
																			handleUpdateStatus(
																				buyer.id,
																				buyer.blocked ? "unblock" : "block"
																			);
																		}}
																	>
																		<FontAwesomeIcon
																			icon={
																				buyer.blocked ? faKey : faUserShield
																			}
																		/>
																		{/* {buyer.blocked ? ' Unblock' : ' Block'} */}
																	</Button>
																</td>
															</tr>
														))
												) : (
													<tr>
														<td colSpan="6">No data available</td>
													</tr>
												)}
											</tbody>
										</Table>
									</div>
								</Card.Body>
								<Card.Footer className="text-center"></Card.Footer>
							</Card>

							<Modal
								centered
								show={showModal}
								onHide={handleCloseModal}
								size="xl"
							>
								<Modal.Header className="justify-content-center p-1 p-lg-2">
									<Modal.Title>Buyer Details</Modal.Title>
								</Modal.Header>
								<Modal.Body className=" m-0 p-1 p-lg-3">
									{selectedBuyer ? (
										<div>
											<div className="buyer-details mb-4  text-center">
												<Row>
													<Col xs={12} md={12}>
														<Card className="mb-2 custom-card">
															<Card.Header
																as="h6"
																className="justify-content-center"
															>
																Name
															</Card.Header>
															<Card.Body className="text-center">
																{selectedBuyer.fullname}
															</Card.Body>
														</Card>
													</Col>
												</Row>
												<Row>
													<Col xs={6} md={6}>
														<Card className="mb-2 custom-card">
															<Card.Header
																as="h6"
																className="justify-content-center"
															>
																Buyer ID
															</Card.Header>
															<Card.Body className="text-center">
																{selectedBuyer.id}
															</Card.Body>
														</Card>
													</Col>
													<Col xs={6} md={6}>
														<Card className="mb-2 custom-card">
															<Card.Header
																as="h6"
																className="justify-content-center"
															>
																Contact
															</Card.Header>
															<Card.Body className="text-center">
																{selectedBuyer.phone_number}
															</Card.Body>
														</Card>
													</Col>
												</Row>

												<Row>
													<Col xs={12}>
														<Card className="mb-2 custom-card">
															<Card.Header
																as="h6"
																className="justify-content-center"
															>
																Email
															</Card.Header>
															<Card.Body className="text-center">
																{selectedBuyer.email}
															</Card.Body>
														</Card>
													</Col>
												</Row>

												<Row>
													<Col xs={12} md={12}>
														<Card className="mb-2 custom-card">
															<Card.Header
																as="h6"
																className="justify-content-center"
															>
																Address
															</Card.Header>
															<Card.Body className="text-center">
																{selectedBuyer.location}
															</Card.Body>
														</Card>
													</Col>
												</Row>
											</div>
										</div>
									) : (
										<p>No details available</p>
									)}
								</Modal.Body>
								<Modal.Footer className="p-1 p-lg-2">
									<Button
										variant="danger"
										onClick={handleCloseModal}
										id="button"
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

export default BuyersManagement;
