import React from "react";
import { Col, Card } from "react-bootstrap";
import { Pie, Bar } from "react-chartjs-2";

const DashboardCharts = ({ pieData, buyerAdClickBarData, analytics }) => {
	const barOptions = {
		responsive: true,
		plugins: {
			legend: { display: false },
		},
		scales: {
			y: {
				beginAtZero: true,
				max: 100,
				ticks: {
					callback: (value) => `${value}%`,
				},
			},
		},
	};

	const buyerAdClickBarOptions = {
		responsive: true,
		plugins: {
			legend: { display: false },
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					precision: 0,
				},
			},
		},
	};

	return (
		<>
			<Col xs={12} md={6} className="mb-4">
				<Card className="custom-card h-100">
					<Card.Header className="text-center fw-bold">
						Seller Subscription Status
					</Card.Header>
					<Card.Body className="d-flex justify-content-center align-items-center">
						<div style={{ width: "300px", height: "300px" }}>
							<Pie data={pieData} />
						</div>
					</Card.Body>
				</Card>
			</Col>

			<Col xs={12} md={6} className="mb-4">
				<Card className="custom-card h-100">
					<Card.Header className="text-center fw-bold">
						Buyer Ad Click Analytics
					</Card.Header>
					<Card.Body className="d-flex justify-content-center align-items-center">
						<div style={{ width: "100%", height: "300px" }}>
							<Bar
								data={buyerAdClickBarData}
								options={buyerAdClickBarOptions}
							/>
						</div>
					</Card.Body>
				</Card>
			</Col>
		</>
	);
};

export default DashboardCharts;
