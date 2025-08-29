import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Pie } from "react-chartjs-2";

const DeviceTypesCard = ({ deviceAnalytics, getDeviceIcon }) => {
	return (
		<Card className="p-3 shadow-sm custom-card h-100">
			<Card.Header className="text-center fw-bold">
				Device Types
			</Card.Header>
			<Card.Body>
				<Row>
					{/* Table */}
					<Col xs={12} md={6}>
						<div className="table-responsive">
							<table className="table table-sm">
								<thead>
									<tr>
										<th>Device</th>
										<th>Visits</th>
										<th>%</th>
									</tr>
								</thead>
								<tbody>
									{Object.entries(
										deviceAnalytics.device_types || {}
									).map(([device, count]) => {
										const percentage =
											deviceAnalytics.total_devices > 0
												? (
														(count /
															deviceAnalytics.total_devices) *
														100
												  ).toFixed(1)
												: 0;
										return (
											<tr key={device}>
												<td className="text-capitalize small">
													<div className="d-flex align-items-center">
														<div
															className="me-2"
															style={{ fontSize: "16px" }}
														>
															{getDeviceIcon(device)}
														</div>
														<span>{device}</span>
													</div>
												</td>
												<td className="fw-bold small">
													{count}
												</td>
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
						{Object.keys(
							deviceAnalytics.device_types || {}
						).length > 0 ? (
							<Pie
								data={{
									labels: Object.keys(
										deviceAnalytics.device_types || {}
									).map(
										(device) =>
											device.charAt(0).toUpperCase() +
											device.slice(1)
									),
									datasets: [
										{
											data: Object.values(
												deviceAnalytics.device_types || {}
											),
											backgroundColor: [
												"#3B82F6",
												"#10B981",
												"#F59E0B",
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
								No device data available
							</div>
						)}
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};

export default DeviceTypesCard;
