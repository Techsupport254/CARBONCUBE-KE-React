import React from "react";
import { Card } from "react-bootstrap";

const SourceAnalyticsTable = ({
	sourceAnalytics,
	getSourceIcon,
	getSourceTrend,
}) => {
	// Use source_distribution from original data
	const sourceData = sourceAnalytics.source_distribution || {};
	const totalVisits = sourceAnalytics.total_visits || 0;

	// Convert to array and sort by count descending
	const sortedSources = Object.entries(sourceData)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 10); // Keep top 10

	return (
		<Card className="p-3 shadow-sm custom-card h-100">
			<Card.Header className="text-center fw-bold">
				Source Analytics Table
			</Card.Header>
			<Card.Body>
				<div className="table-responsive">
					<table className="table table-hover">
						<thead className="table-light">
							<tr>
								<th>Source</th>
								<th>Visits</th>
								<th>Percentage</th>
							</tr>
						</thead>
						<tbody>
							{sortedSources.length > 0 ? (
								sortedSources.map(([source, count], index) => {
									const percentage =
										totalVisits > 0
											? ((count / totalVisits) * 100).toFixed(1)
											: 0;
									const isFacebook = source === "facebook";
									return (
										<tr key={index}>
											<td>
												<div className="d-flex align-items-center">
													<div className="me-2" style={{ fontSize: "18px" }}>
														{getSourceIcon(source)}
													</div>
													<span className="text-capitalize fw-medium">
														{source === "direct"
															? "Direct"
															: source === "facebook"
															? "Facebook"
															: source}
													</span>
												</div>
											</td>
											<td>
												<span className="fw-bold text-primary">
													{count.toLocaleString()}
												</span>
											</td>
											<td>
												<div className="d-flex align-items-center">
													<div
														className="progress me-2"
														style={{
															width: "60px",
															height: "6px",
														}}
													>
														<div
															className={`progress-bar ${
																isFacebook ? "bg-primary" : "bg-primary"
															}`}
															style={{
																width: `${percentage}%`,
															}}
														></div>
													</div>
													<span className="text-muted small">
														{percentage}%
													</span>
												</div>
											</td>
										</tr>
									);
								})
							) : (
								<tr>
									<td colSpan="3" className="text-center text-muted py-4">
										No source data available
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</Card.Body>
		</Card>
	);
};

export default SourceAnalyticsTable;
