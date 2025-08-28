import React, { useState, useEffect } from "react";
import {
	Container,
	Row,
	Col,
	Card,
	Button,
	Form,
	Table,
	Alert,
	Modal,
	Badge,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlus,
	faEdit,
	faTrash,
	faEye,
	faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./InternalUserExclusions.css";

const InternalUserExclusions = () => {
	const [exclusions, setExclusions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editingExclusion, setEditingExclusion] = useState(null);
	const [showTestModal, setShowTestModal] = useState(false);
	const [testResult, setTestResult] = useState(null);
	const [stats, setStats] = useState(null);

	// Form state
	const [formData, setFormData] = useState({
		identifier_type: "user_agent",
		identifier_value: "",
		reason: "",
		active: true,
	});

	// Test form state
	const [testData, setTestData] = useState({
		device_hash: "",
		user_agent: "",
		ip_address: "",
		email: "",
	});

	useEffect(() => {
		fetchExclusions();
		fetchStats();
	}, []);

	const fetchExclusions = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/internal_user_exclusions`,
				{
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				setExclusions(data);
			}
		} catch (error) {
			console.error("Error fetching exclusions:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchStats = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/internal_user_exclusions/stats`,
				{
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				setStats(data);
			}
		} catch (error) {
			console.error("Error fetching stats:", error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const url = editingExclusion
				? `${process.env.REACT_APP_BACKEND_URL}/admin/internal_user_exclusions/${editingExclusion.id}`
				: `${process.env.REACT_APP_BACKEND_URL}/admin/internal_user_exclusions`;

			const method = editingExclusion ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + sessionStorage.getItem("token"),
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setShowModal(false);
				setEditingExclusion(null);
				resetForm();
				fetchExclusions();
				fetchStats();
			} else {
				const error = await response.json();
				alert("Error: " + (error.errors || "Unknown error"));
			}
		} catch (error) {
			console.error("Error saving exclusion:", error);
			alert("Error saving exclusion");
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this exclusion?")) {
			return;
		}

		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/internal_user_exclusions/${id}`,
				{
					method: "DELETE",
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			if (response.ok) {
				fetchExclusions();
				fetchStats();
			}
		} catch (error) {
			console.error("Error deleting exclusion:", error);
		}
	};

	const handleEdit = (exclusion) => {
		setEditingExclusion(exclusion);
		setFormData({
			identifier_type: exclusion.identifier_type,
			identifier_value: exclusion.identifier_value,
			reason: exclusion.reason,
			active: exclusion.active,
		});
		setShowModal(true);
	};

	const handleTest = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/internal_user_exclusions/test`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
					body: JSON.stringify(testData),
				}
			);

			if (response.ok) {
				const result = await response.json();
				setTestResult(result);
			}
		} catch (error) {
			console.error("Error testing exclusion:", error);
		}
	};

	const resetForm = () => {
		setFormData({
			identifier_type: "user_agent",
			identifier_value: "",
			reason: "",
			active: true,
		});
	};

	const openModal = () => {
		setEditingExclusion(null);
		resetForm();
		setShowModal(true);
	};

	const getIdentifierTypeLabel = (type) => {
		const labels = {
			device_hash: "Device Hash",
			user_agent: "User Agent",
			ip_range: "IP Range",
			email_domain: "Email Domain",
		};
		return labels[type] || type;
	};

	if (loading) {
		return <div className="text-center p-4">Loading...</div>;
	}

	return (
		<Container fluid>
			<Row className="mb-4">
				<Col>
					<h2>
						<FontAwesomeIcon icon={faShieldAlt} className="me-2" />
						Internal User Exclusions
					</h2>
					<p className="text-muted">
						Manage exclusions for internal users to prevent skewed analytics
					</p>
				</Col>
			</Row>

			{/* Stats Cards */}
			{stats && (
				<Row className="mb-4">
					<Col md={3}>
						<Card className="text-center">
							<Card.Body>
								<h4>{stats.total_exclusions}</h4>
								<p className="text-muted mb-0">Total Exclusions</p>
							</Card.Body>
						</Card>
					</Col>
					<Col md={3}>
						<Card className="text-center">
							<Card.Body>
								<h4>{stats.active_exclusions}</h4>
								<p className="text-muted mb-0">Active Exclusions</p>
							</Card.Body>
						</Card>
					</Col>
					<Col md={3}>
						<Card className="text-center">
							<Card.Body>
								<h4>{stats.recent_exclusions}</h4>
								<p className="text-muted mb-0">Added Last 30 Days</p>
							</Card.Body>
						</Card>
					</Col>
					<Col md={3}>
						<Card className="text-center">
							<Card.Body>
								<Button
									variant="outline-primary"
									onClick={() => setShowTestModal(true)}
								>
									<FontAwesomeIcon icon={faEye} className="me-2" />
									Test Exclusion
								</Button>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			)}

			{/* Actions */}
			<Row className="mb-3">
				<Col>
					<Button variant="primary" onClick={openModal}>
						<FontAwesomeIcon icon={faPlus} className="me-2" />
						Add Exclusion
					</Button>
				</Col>
			</Row>

			{/* Exclusions Table */}
			<Card>
				<Card.Body>
					<Table responsive striped hover>
						<thead>
							<tr>
								<th>Type</th>
								<th>Value</th>
								<th>Reason</th>
								<th>Status</th>
								<th>Created</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{exclusions.map((exclusion) => (
								<tr key={exclusion.id}>
									<td>
										<Badge bg="info">
											{getIdentifierTypeLabel(exclusion.identifier_type)}
										</Badge>
									</td>
									<td>
										<code className="small">
											{exclusion.identifier_value.length > 50
												? exclusion.identifier_value.substring(0, 50) + "..."
												: exclusion.identifier_value}
										</code>
									</td>
									<td>{exclusion.reason}</td>
									<td>
										<Badge bg={exclusion.active ? "success" : "secondary"}>
											{exclusion.active ? "Active" : "Inactive"}
										</Badge>
									</td>
									<td>{new Date(exclusion.created_at).toLocaleDateString()}</td>
									<td>
										<Button
											size="sm"
											variant="outline-primary"
											className="me-2"
											onClick={() => handleEdit(exclusion)}
										>
											<FontAwesomeIcon icon={faEdit} />
										</Button>
										<Button
											size="sm"
											variant="outline-danger"
											onClick={() => handleDelete(exclusion.id)}
										>
											<FontAwesomeIcon icon={faTrash} />
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Card.Body>
			</Card>

			{/* Add/Edit Modal */}
			<Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>
						{editingExclusion ? "Edit Exclusion" : "Add New Exclusion"}
					</Modal.Title>
				</Modal.Header>
				<Form onSubmit={handleSubmit}>
					<Modal.Body>
						<Row>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>Identifier Type</Form.Label>
									<Form.Select
										value={formData.identifier_type}
										onChange={(e) =>
											setFormData({
												...formData,
												identifier_type: e.target.value,
											})
										}
										required
									>
										<option value="user_agent">User Agent</option>
										<option value="device_hash">Device Hash</option>
										<option value="ip_range">IP Range</option>
										<option value="email_domain">Email Domain</option>
									</Form.Select>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>Status</Form.Label>
									<Form.Check
										type="switch"
										id="active-switch"
										label="Active"
										checked={formData.active}
										onChange={(e) =>
											setFormData({ ...formData, active: e.target.checked })
										}
									/>
								</Form.Group>
							</Col>
						</Row>
						<Form.Group className="mb-3">
							<Form.Label>Identifier Value</Form.Label>
							<Form.Control
								type="text"
								value={formData.identifier_value}
								onChange={(e) =>
									setFormData({ ...formData, identifier_value: e.target.value })
								}
								placeholder={
									formData.identifier_type === "ip_range"
										? "e.g., 192.168.1.0/24 or 127.0.0.1"
										: formData.identifier_type === "user_agent"
										? "e.g., Chrome.*Headless or Selenium"
										: "Enter value"
								}
								required
							/>
							<Form.Text className="text-muted">
								{formData.identifier_type === "user_agent" &&
									"Use regex patterns for matching"}
								{formData.identifier_type === "ip_range" &&
									"Use CIDR notation (e.g., 192.168.1.0/24) or exact IP"}
								{formData.identifier_type === "email_domain" &&
									"Enter domain (e.g., company.com)"}
								{formData.identifier_type === "device_hash" &&
									"Enter device hash value"}
							</Form.Text>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Reason</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								value={formData.reason}
								onChange={(e) =>
									setFormData({ ...formData, reason: e.target.value })
								}
								placeholder="Explain why this exclusion is needed"
								required
							/>
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={() => setShowModal(false)}>
							Cancel
						</Button>
						<Button variant="primary" type="submit">
							{editingExclusion ? "Update" : "Create"} Exclusion
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>

			{/* Test Modal */}
			<Modal
				show={showTestModal}
				onHide={() => setShowTestModal(false)}
				size="lg"
			>
				<Modal.Header closeButton>
					<Modal.Title>Test Exclusion</Modal.Title>
				</Modal.Header>
				<Form onSubmit={handleTest}>
					<Modal.Body>
						<Row>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>Device Hash</Form.Label>
									<Form.Control
										type="text"
										value={testData.device_hash}
										onChange={(e) =>
											setTestData({ ...testData, device_hash: e.target.value })
										}
										placeholder="Enter device hash"
									/>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>User Agent</Form.Label>
									<Form.Control
										type="text"
										value={testData.user_agent}
										onChange={(e) =>
											setTestData({ ...testData, user_agent: e.target.value })
										}
										placeholder="Enter user agent"
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>IP Address</Form.Label>
									<Form.Control
										type="text"
										value={testData.ip_address}
										onChange={(e) =>
											setTestData({ ...testData, ip_address: e.target.value })
										}
										placeholder="Enter IP address"
									/>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>Email</Form.Label>
									<Form.Control
										type="email"
										value={testData.email}
										onChange={(e) =>
											setTestData({ ...testData, email: e.target.value })
										}
										placeholder="Enter email address"
									/>
								</Form.Group>
							</Col>
						</Row>

						{testResult && (
							<Alert
								variant={testResult.is_excluded ? "warning" : "success"}
								className="mt-3"
							>
								<strong>Test Result:</strong>{" "}
								{testResult.is_excluded ? "EXCLUDED" : "NOT EXCLUDED"}
								<br />
								<small className="text-muted">
									Tested identifiers:{" "}
									{JSON.stringify(testResult.tested_identifiers, null, 2)}
								</small>
							</Alert>
						)}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={() => setShowTestModal(false)}>
							Close
						</Button>
						<Button variant="primary" type="submit">
							Test Exclusion
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</Container>
	);
};

export default InternalUserExclusions;
