import React from "react";
import { Container, OverlayTrigger, Tooltip } from "react-bootstrap";

const FeatureComparisonTable = () => {
	const features = [
		{
			name: "Dedicated technical support",
			free: true,
			basic: true,
			standard: true,
			premium: true,
		},
		{
			name: "Improved listing visibility",
			basic: true,
			standard: true,
			premium: true,
		},
		{
			name: "Marketplace analytics access",
			basic: true,
			standard: true,
			premium: true,
		},
		{
			name: "Ability to create discount offers",
			basic: "limited",
			standard: true,
			premium: true,
		},
		{
			name: "Priority listing in category searches",
			standard: true,
			premium: true,
		},
		{ name: "Featured listing options", premium: true },
		{ name: "Advanced promotional tools (e.g., banner ads)", premium: true },
		{ name: "Access to wishlist & competitor statistics", premium: true },
		{ name: "Ability to post product videos", premium: true },
		{ name: "Inclusive of physical verification", premium: true },
	];

	const renderIcon = (value) => {
		if (value === true)
			return (
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="currentColor"
					className="text-success"
				>
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
				</svg>
			);
		if (value === "limited")
			return (
				<OverlayTrigger
					placement="top"
					overlay={
						<Tooltip id="tooltip-limited">Limited access in Basic tier</Tooltip>
					}
				>
					<div style={{ cursor: "help" }}>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="text-warning"
						>
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
						</svg>
						<span className="text-warning ms-1">*</span>
					</div>
				</OverlayTrigger>
			);
		return (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="text-danger"
			>
				<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
			</svg>
		);
	};

	return (
		<section className="pricing-comparison my-5">
			<Container>
				<h2 className="text-center mb-4">Features Comparison</h2>
				<div className="table-responsive">
					<table className="table table-bordered comparison-table">
						<thead className="table-light text-center">
							<tr>
								<th>Feature</th>
								<th>Free</th>
								<th>Basic</th>
								<th>Standard</th>
								<th>Premium</th>
							</tr>
						</thead>
						<tbody>
							{features.map((feature, index) => (
								<tr key={index}>
									<td>{feature.name}</td>
									<td className="text-center">{renderIcon(feature.free)}</td>
									<td className="text-center">{renderIcon(feature.basic)}</td>
									<td className="text-center">
										{renderIcon(feature.standard)}
									</td>
									<td className="text-center">{renderIcon(feature.premium)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Container>
		</section>
	);
};

export default FeatureComparisonTable;
