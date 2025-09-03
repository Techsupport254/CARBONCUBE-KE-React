import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Pie } from "react-chartjs-2";

const OperatingSystemsCard = ({ deviceAnalytics, getOSIcon }) => {
	return (
		<Card className="p-3 shadow-sm custom-card h-100">
			<Card.Header className="bg-secondary text-white text-center fw-bold">
				Operating Systems
			</Card.Header>
			<Card.Body>
				<Row>
					{/* Table */}
					<Col xs={12} md={6}>
						<div className="table-responsive">
							<table className="table table-sm">
								<thead>
									<tr>
										<th>OS</th>
										<th>Visits</th>
										<th>%</th>
									</tr>
								</thead>
								<tbody>
									{Object.entries(deviceAnalytics.operating_systems || {})
										.sort(([, a], [, b]) => b - a)
										.slice(0, 5)
										.map(([os, count]) => {
											const percentage =
												deviceAnalytics.total_devices > 0
													? (
															(count / deviceAnalytics.total_devices) *
															100
													  ).toFixed(1)
													: 0;
											return (
												<tr key={os}>
													<td className="small">
														<div className="d-flex align-items-center">
															<div
																className="me-2"
																style={{ fontSize: "16px" }}
															>
																{getOSIcon(os)}
															</div>
															<span>{os}</span>
														</div>
													</td>
													<td className="fw-bold small">{count}</td>
													<td className="small">{percentage}%</td>
												</tr>
											);
										})}
								</tbody>
							</table>
						</div>
					</Col>

					{/* Pie Chart */}
					<Col xs={12} md={6}>
						{Object.keys(deviceAnalytics.operating_systems || {}).length > 0 ? (
							<Pie
								data={{
									labels: Object.entries(
										deviceAnalytics.operating_systems || {}
									)
										.sort(([, a], [, b]) => b - a)
										.slice(0, 5)
										.map(([os]) => os),
									datasets: [
										{
											data: Object.entries(
												deviceAnalytics.operating_systems || {}
											)
												.sort(([, a], [, b]) => b - a)
												.slice(0, 5)
												.map(([, count]) => count),
											backgroundColor: [
												"#F59E0B",
												"#3B82F6",
												"#10B981",
												"#EF4444",
												"#8B5CF6",
											],
											borderColor: "#fff",
											borderWidth: 2,
										},
									],
								}}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: {
											position: "bottom",
											labels: {
												padding: 10,
												usePointStyle: true,
												font: { size: 10 },
											},
										},
									},
								}}
								height={200}
							/>
						) : (
							<div className="text-center text-muted py-4">
								No OS data available
							</div>
						)}
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};

export default OperatingSystemsCard;
