import React, { useState, useEffect } from "react";
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Modal,
	Table,
	Card,
} from "react-bootstrap";
import { Trash, Pencil, PlusCircle } from "react-bootstrap-icons";
import Sidebar from "../components/Sidebar";
import Navbar from "../../components/Navbar";
import Spinner from "react-spinkit";
import "../css/ContentManagement.css"; // Custom CSS

const ContentManagement = () => {
	const [aboutData, setAboutData] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [faqsData, setFaqsData] = useState([]);
	const [banners, setBanners] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [currentEdit, setCurrentEdit] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [file, setFile] = useState(null);

	// const cloudinary = new Cloudinary({ cloud_name: 'dyyu5fwcz', secure: true });

	useEffect(() => {
		const fetchData = async () => {
			try {
				const aboutResponse = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/admin/abouts`,
					{
						headers: {
							Authorization: "Bearer " + sessionStorage.getItem("token"),
						},
					}
				);
				const faqsResponse = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/admin/faqs`,
					{
						headers: {
							Authorization: "Bearer " + sessionStorage.getItem("token"),
						},
					}
				);
				const bannersResponse = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/admin/banners`,
					{
						headers: {
							Authorization: "Bearer " + sessionStorage.getItem("token"),
						},
					}
				);

				if (!aboutResponse.ok || !faqsResponse.ok || !bannersResponse.ok) {
					throw new Error("Network response was not ok");
				}

				const about = await aboutResponse.json();
				const faqs = await faqsResponse.json();
				const banners = await bannersResponse.json();

				setAboutData(about);
				setFaqsData(faqs);
				setBanners(banners);
			} catch (error) {
				// console.error('Error fetching data:', error);
				setError("Error fetching data");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleEditClick = (dataType, data) => {
		setCurrentEdit({ type: dataType, data });
		setEditMode(true);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCurrentEdit((prev) => ({
			...prev,
			data: {
				...prev.data,
				[name]: value,
			},
		}));
	};

	const handleSaveChanges = async () => {
		try {
			const { type, data } = currentEdit;
			const url = `${process.env.REACT_APP_BACKEND_URL}/admin/${type}/${data.id}`;
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + sessionStorage.getItem("token"),
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			if (type === "abouts") {
				setAboutData([data]); // Ensure aboutData remains an array
			} else if (type === "faqs") {
				setFaqsData((prevFaqs) =>
					prevFaqs.map((faq) => (faq.id === data.id ? data : faq))
				);
			}

			setEditMode(false);
			setCurrentEdit(null);
		} catch (error) {
			// console.error('Error saving changes:', error);
			setError("Error saving changes");
		}
	};

	const handleDeleteFaq = async (faqId) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/faqs/${faqId}`,
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

			setFaqsData((prevFaqs) => prevFaqs.filter((faq) => faq.id !== faqId));
		} catch (error) {
			// console.error('Error deleting FAQ:', error);
			setError("Error deleting FAQ");
		}
	};

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleUploadBanner = async () => {
		if (!file) return;

		setIsUploading(true);

		const formData = new FormData();
		formData.append("banner[image]", file);

		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/banners`,
				{
					method: "POST",
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
					body: formData,
				}
			);

			const responseData = await response.json(); // Get JSON response

			if (!response.ok) {
				console.error("Backend Error:", responseData);
				throw new Error(responseData.error || "Failed to upload banner");
			}

			setBanners([...banners, responseData]);
			setShowModal(false);
			setFile(null);
		} catch (error) {
			console.error("Upload Error:", error.message);
			setError(error.message); // Show actual error
		} finally {
			setIsUploading(false);
		}
	};

	const handleDeleteBanner = async (id) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/banners/${id}`,
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

			setBanners(banners.filter((banner) => banner.id !== id));
		} catch (error) {
			// console.error('Error deleting banner:', error);
			setError("Error deleting banner");
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

	const about = aboutData && aboutData.length > 0 ? aboutData[0] : null;

	return (
		<>
			<Navbar mode="admin" showSearch={false} showCategories={false} />
			<div className="content-management-page">
				<Container fluid className="p-0">
					<Row>
						<Col xs={12} md={2} className="p-0">
							<Sidebar />
						</Col>
						<Col xs={12} md={10} lg={9} className="p-0 p-lg-2">
							{/* About Us Section */}
							<div>
								<Card className="section">
									<Card.Header className="text-center justify-content-center orders-header p-0 p-lg-1">
										ABOUT US
									</Card.Header>
									<Card.Body>
										<Form>
											<Form.Group
												controlId="formDescription"
												className="text-start mb-2"
											>
												<Form.Label
													style={{ fontWeight: "bold" }}
													className="mb-0"
												>
													Description
												</Form.Label>
												<Form.Control
													type="text"
													name="description"
													id="button"
													value={about?.description || ""}
													disabled
												/>
											</Form.Group>
											<Form.Group
												controlId="formMission"
												className="text-start mb-2"
											>
												<Form.Label
													style={{ fontWeight: "bold" }}
													className="mb-0"
												>
													Mission
												</Form.Label>
												<Form.Control
													type="text"
													name="mission"
													id="button"
													value={about?.mission || ""}
													disabled
												/>
											</Form.Group>
											<Form.Group
												controlId="formVision"
												className="text-start mb-2"
											>
												<Form.Label
													style={{ fontWeight: "bold" }}
													className="mb-0"
												>
													Vision
												</Form.Label>
												<Form.Control
													type="text"
													name="vision"
													id="button"
													value={about?.vision || ""}
													disabled
												/>
											</Form.Group>
											<Form.Group
												controlId="formValues"
												className="text-start mb-2"
											>
												<Form.Label
													style={{ fontWeight: "bold" }}
													className="mb-0"
												>
													Values
												</Form.Label>
												<Form.Control
													type="text"
													name="values"
													id="button"
													value={
														(Array.isArray(about?.values)
															? about.values.join(", ")
															: "") || ""
													}
													disabled
												/>
											</Form.Group>
											<Form.Group
												controlId="formWhyChooseUs"
												className="text-start mb-2"
											>
												<Form.Label
													style={{ fontWeight: "bold" }}
													className="mb-0"
												>
													Why Choose Us
												</Form.Label>
												<Form.Control
													type="text"
													name="why_choose_us"
													id="button"
													value={about?.why_choose_us || ""}
													disabled
												/>
											</Form.Group>
											{/* <Form.Group controlId="formImageUrl" className="text-center">
                                                <Form.Label style={{ fontWeight: 'bold' }}>Image URL</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="image_url"
                                                    id="button"
                                                    value={about?.image_url || ''}
                                                    disabled
                                                />
                                            </Form.Group> */}
										</Form>
									</Card.Body>
									<Card.Footer className="text-center p-1 p-lg-2">
										<Button
											variant="warning"
											onClick={() => handleEditClick("abouts", about)}
											id="button"
											disabled={!about}
										>
											<Pencil /> Edit
										</Button>
									</Card.Footer>
								</Card>
							</div>

							{/* FAQs Section */}
							<div>
								<Card className="section mt-3">
									<Card.Header className="text-center justify-content-center orders-header p-0 p-lg-1">
										FAQs
									</Card.Header>
									<Card.Body className="p-0 table-container">
										<div className="table-responsive orders-table-container">
											<Table hover className="orders-table text-center ">
												<thead>
													<tr>
														<th>ID</th>
														<th>Question</th>
														<th>Answer</th>
														<th>Edit</th>
														<th>Delete</th>
													</tr>
												</thead>
												<tbody>
													{faqsData.length > 0 ? (
														faqsData.map((faq) => (
															<tr key={faq.id}>
																<td>{faq.id}</td>
																<td>{faq.question}</td>
																<td>{faq.answer}</td>
																<td>
																	<Button
																		variant="warning"
																		onClick={() => handleEditClick("faqs", faq)}
																		id="button"
																	>
																		<Pencil />
																	</Button>
																</td>
																<td>
																	<Button
																		variant="danger"
																		onClick={() => handleDeleteFaq(faq.id)}
																		id="button"
																	>
																		<Trash />
																	</Button>
																</td>
															</tr>
														))
													) : (
														<tr>
															<td colSpan="4">No data available</td>
														</tr>
													)}
												</tbody>
											</Table>
										</div>
									</Card.Body>
									<Card.Footer className="text-center p-0 p-lg-1"></Card.Footer>
								</Card>
							</div>

							{/* Banner Section */}
							<div>
								<Card className="section mt-3">
									<Card.Header className="text-center justify-content-center orders-header p-0 p-lg-1">
										BANNERS
									</Card.Header>
									<Card.Body>
										<Row>
											{banners.map((banner) => (
												<Col
													xs={12}
													md={4}
													lg={3}
													key={banner.id}
													className="mb-4"
												>
													<Card>
														<Card.Img variant="top" src={banner.image_url} />
														<Card.Body className="banner-body py-2 px-2">
															<Button
																variant="danger"
																className="float-end"
																id="button"
																onClick={() => handleDeleteBanner(banner.id)}
															>
																<Trash />
															</Button>
															<Card.Title className="text-center mt-2">
																Banner {banner.id}
															</Card.Title>
														</Card.Body>
													</Card>
												</Col>
											))}
										</Row>
									</Card.Body>
									<Card.Footer className="text-center p-1 p-lg-2">
										<Button
											variant="warning"
											onClick={() => setShowModal(true)}
											id="button"
										>
											<PlusCircle /> Add New Banner
										</Button>
									</Card.Footer>
								</Card>
							</div>
						</Col>
					</Row>
				</Container>

				{/* Add Banner Modal */}
				<Modal
					centered
					show={showModal}
					onHide={() => setShowModal(false)}
					size="xl"
				>
					<Modal.Header className="justify-content-center p-1 p-lg-2">
						<Modal.Title>Upload New Banner</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group className="mb-2">
								<Form.Label className="text-center mb-0 fw-bold">
									Media
								</Form.Label>
								<div className="upload-section">
									<div className="upload-icon">&#8689;</div>
									<Button variant="light" className="custom-upload-btn">
										<input
											type="file"
											accept="image/*"
											onChange={handleFileChange}
										/>
									</Button>
									<div className="upload-instructions">
										or Drag and Drop files Here
									</div>
								</div>
							</Form.Group>
						</Form>
					</Modal.Body>
					<Modal.Footer className="p-0 p-lg-1">
						<Button
							variant="danger"
							className="me-3"
							onClick={() => setShowModal(false)}
						>
							Close
						</Button>
						<Button
							variant="warning"
							onClick={handleUploadBanner}
							disabled={isUploading} // Disable the button during upload
						>
							{isUploading ? "Uploading..." : "Upload"}
						</Button>
					</Modal.Footer>
				</Modal>

				{/* Edit Modal */}
				{editMode && currentEdit && (
					<Modal
						centered
						show={editMode}
						onHide={() => setEditMode(false)}
						size="xl"
					>
						<Modal.Header className="justify-content-center p-1 p-lg-2">
							<Modal.Title>
								Edit {currentEdit.type === "abouts" ? "About Us" : "FAQ"}
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form>
								{currentEdit.type === "abouts" ? (
									<>
										<Form.Group controlId="formDescription">
											<Form.Label>
												<strong>Description</strong>
											</Form.Label>
											<Form.Control
												type="text"
												name="description"
												value={currentEdit.data.description}
												onChange={handleInputChange}
											/>
										</Form.Group>
										<Form.Group controlId="formMission">
											<Form.Label>
												<strong>Mission</strong>
											</Form.Label>
											<Form.Control
												type="text"
												name="mission"
												value={currentEdit.data.mission}
												onChange={handleInputChange}
											/>
										</Form.Group>
										<Form.Group controlId="formVision">
											<Form.Label>
												<strong>Vision</strong>
											</Form.Label>
											<Form.Control
												type="text"
												name="vision"
												value={currentEdit.data.vision}
												onChange={handleInputChange}
											/>
										</Form.Group>
										<Form.Group controlId="formValues">
											<Form.Label>
												<strong>Values</strong>
											</Form.Label>
											<Form.Control
												type="text"
												name="values"
												value={
													Array.isArray(currentEdit.data.values)
														? currentEdit.data.values.join(", ")
														: ""
												}
												onChange={handleInputChange}
											/>
										</Form.Group>
										<Form.Group controlId="formWhyChooseUs">
											<Form.Label>
												<strong>Why Choose Us</strong>
											</Form.Label>
											<Form.Control
												type="text"
												name="why_choose_us"
												value={currentEdit.data.why_choose_us}
												onChange={handleInputChange}
											/>
										</Form.Group>
										{/* <Form.Group controlId="formImageUrl">
                                            <Form.Label>Image URL</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="image_url"
                                                value={currentEdit.data.image_url}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group> */}
									</>
								) : (
									<>
										<Form.Group controlId="formQuestion">
											<Form.Label>
												<strong>Question</strong>
											</Form.Label>
											<Form.Control
												type="text"
												name="question"
												value={currentEdit.data.question}
												onChange={handleInputChange}
											/>
										</Form.Group>
										<Form.Group controlId="formAnswer">
											<Form.Label>
												<strong>Answer</strong>
											</Form.Label>
											<Form.Control
												type="text"
												name="answer"
												value={currentEdit.data.answer}
												onChange={handleInputChange}
											/>
										</Form.Group>
									</>
								)}
							</Form>
						</Modal.Body>
						<Modal.Footer className="p-0 p-lg-1">
							<Button variant="danger" onClick={() => setEditMode(false)}>
								Close
							</Button>
							<Button variant="warning" onClick={handleSaveChanges}>
								Save Changes
							</Button>
						</Modal.Footer>
					</Modal>
				)}
			</div>
		</>
	);
};

export default ContentManagement;
