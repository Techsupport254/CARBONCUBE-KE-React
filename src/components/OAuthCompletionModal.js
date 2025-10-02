import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const OAuthCompletionModal = ({
	show,
	onHide,
	userData,
	onComplete,
	onCancel,
}) => {
	const [formData, setFormData] = useState({
		phone_number: "",
		location: "",
		city: "",
		zipcode: "",
		gender: "",
		age_group_id: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [ageGroups, setAgeGroups] = useState([]);

	// Load age groups when modal opens
	React.useEffect(() => {
		if (show) {
			loadAgeGroups();
			// Pre-fill with any data we have from Google
			setFormData({
				phone_number: userData?.phone_number || "",
				location: userData?.location || "",
				city: userData?.city || "",
				zipcode: userData?.zipcode || "",
				gender: userData?.gender || "",
				age_group_id: userData?.age_group_id || "",
			});
		}
	}, [show, userData]);

	const loadAgeGroups = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_BACKEND_URL}/age_groups`
			);
			setAgeGroups(response.data);
		} catch (error) {
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/auth/complete_oauth_registration`,
				{
					user_id: userData.id,
					...formData,
				}
			);

			if (response.data.success) {
				onComplete(response.data.token, response.data.user);
			} else {
				setError(response.data.message || "Failed to complete registration");
			}
		} catch (error) {
			setError(
				error.response?.data?.message ||
					error.response?.data?.errors?.[0] ||
					"Failed to complete registration"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setFormData({
			phone_number: "",
			location: "",
			city: "",
			zipcode: "",
			gender: "",
			age_group_id: "",
		});
		setError("");
		onCancel();
	};

	return (
		<Modal
			show={show}
			onHide={handleCancel}
			centered
			size="lg"
			backdrop="static"
		>
			<Modal.Header closeButton>
				<Modal.Title>Complete Your Registration</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="text-center mb-4">
					<img
						src={userData?.profile_picture}
						alt="Profile"
						className="rounded-circle mb-3"
						style={{ width: "80px", height: "80px", objectFit: "cover" }}
					/>
					<h5>Welcome, {userData?.name}!</h5>
					<p className="text-muted">
						Please complete your profile with the required information to finish
						your registration.
					</p>
				</div>

				{error && (
					<Alert variant="danger" className="mb-3">
						{error}
					</Alert>
				)}

				<Form onSubmit={handleSubmit}>
					<div className="row">
						<div className="col-md-6 mb-3">
							<Form.Group>
								<Form.Label>Phone Number *</Form.Label>
								<Form.Control
									type="tel"
									name="phone_number"
									value={formData.phone_number}
									onChange={handleInputChange}
									placeholder="0712345678"
									required
									pattern="0[0-9]{9}"
									title="Enter a valid 10-digit phone number starting with 0"
								/>
								<Form.Text className="text-muted">Format: 0712345678</Form.Text>
							</Form.Group>
						</div>

						<div className="col-md-6 mb-3">
							<Form.Group>
								<Form.Label>Gender *</Form.Label>
								<Form.Select
									name="gender"
									value={formData.gender}
									onChange={handleInputChange}
									required
								>
									<option value="">Select Gender</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</Form.Select>
							</Form.Group>
						</div>
					</div>

					<div className="row">
						<div className="col-md-6 mb-3">
							<Form.Group>
								<Form.Label>Age Group *</Form.Label>
								<Form.Select
									name="age_group_id"
									value={formData.age_group_id}
									onChange={handleInputChange}
									required
								>
									<option value="">Select Age Group</option>
									{ageGroups.map((group) => (
										<option key={group.id} value={group.id}>
											{group.name}
										</option>
									))}
								</Form.Select>
							</Form.Group>
						</div>

						<div className="col-md-6 mb-3">
							<Form.Group>
								<Form.Label>Location</Form.Label>
								<Form.Control
									type="text"
									name="location"
									value={formData.location}
									onChange={handleInputChange}
									placeholder="e.g., Nairobi, Kenya"
								/>
							</Form.Group>
						</div>
					</div>

					<div className="row">
						<div className="col-md-6 mb-3">
							<Form.Group>
								<Form.Label>City</Form.Label>
								<Form.Control
									type="text"
									name="city"
									value={formData.city}
									onChange={handleInputChange}
									placeholder="e.g., Nairobi"
								/>
							</Form.Group>
						</div>

						<div className="col-md-6 mb-3">
							<Form.Group>
								<Form.Label>Zipcode</Form.Label>
								<Form.Control
									type="text"
									name="zipcode"
									value={formData.zipcode}
									onChange={handleInputChange}
									placeholder="e.g., 00100"
								/>
							</Form.Group>
						</div>
					</div>

					<div className="text-center mt-4">
						<Button
							variant="secondary"
							onClick={handleCancel}
							className="me-3"
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type="submit" variant="primary" disabled={loading}>
							{loading ? (
								<>
									<Spinner animation="border" size="sm" className="me-2" />
									Completing...
								</>
							) : (
								"Complete Registration"
							)}
						</Button>
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default OAuthCompletionModal;
