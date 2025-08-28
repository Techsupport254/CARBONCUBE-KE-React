import React from "react";
import { Col, Card } from "react-bootstrap";

const DashboardCard = ({ title, value, onClick }) => {
	return (
		<Col xs={12} sm={6} md={4} lg={3} className="mb-3">
			<Card
				className="custom-card h-100 cursor-pointer"
				onClick={onClick}
				style={{ cursor: "pointer" }}
			>
				<Card.Body className="text-center">
					<h6 className="card-title text-muted mb-2">{title}</h6>
					<h3 className="fw-bold text-primary mb-0">
						{(value || 0).toLocaleString()}
					</h3>
				</Card.Body>
			</Card>
		</Col>
	);
};

export default DashboardCard;
