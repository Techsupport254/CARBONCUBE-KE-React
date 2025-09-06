import React from "react";

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
					className="text-green-600 mx-auto"
				>
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
				</svg>
			);
		if (value === "limited")
			return (
				<div className="relative group">
					<div className="flex items-center justify-center cursor-help">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="text-yellow-400"
						>
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
						</svg>
						<span className="text-yellow-400 ml-1 text-sm">*</span>
					</div>
					{/* Tooltip */}
					<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
						Limited access in Basic tier
						<div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
					</div>
				</div>
			);
		return (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="text-red-600 mx-auto"
			>
				<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
			</svg>
		);
	};

	return (
		<section className="py-6 sm:py-8 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-6 sm:mb-8">
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
						Features Comparison
					</h2>
					<p className="text-gray-600 text-sm sm:text-base">
						Compare features across all our pricing tiers
					</p>
				</div>

				<div className="overflow-x-auto">
					<div className="min-w-full">
						<table className="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 border-b border-gray-200">
										Feature
									</th>
									<th className="px-2 sm:px-3 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-900 border-b border-gray-200">
										Free
									</th>
									<th className="px-2 sm:px-3 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-900 border-b border-gray-200">
										Basic
									</th>
									<th className="px-2 sm:px-3 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-900 border-b border-gray-200">
										Standard
									</th>
									<th className="px-2 sm:px-3 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-900 border-b border-gray-200">
										Premium
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{features.map((feature, index) => (
									<tr
										key={index}
										className="hover:bg-gray-50 transition-colors duration-150"
									>
										<td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
											{feature.name}
										</td>
										<td className="px-2 sm:px-3 py-3 sm:py-4 text-center">
											{renderIcon(feature.free)}
										</td>
										<td className="px-2 sm:px-3 py-3 sm:py-4 text-center">
											{renderIcon(feature.basic)}
										</td>
										<td className="px-2 sm:px-3 py-3 sm:py-4 text-center">
											{renderIcon(feature.standard)}
										</td>
										<td className="px-2 sm:px-3 py-3 sm:py-4 text-center">
											{renderIcon(feature.premium)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Legend */}
				<div className="mt-6 flex flex-wrap justify-center gap-4 sm:gap-6">
					<div className="flex items-center">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="text-green-600 mr-2"
						>
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
						</svg>
						<span className="text-sm text-gray-600">Included</span>
					</div>
					<div className="flex items-center">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="text-yellow-400 mr-2"
						>
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
						</svg>
						<span className="text-sm text-gray-600">Limited</span>
					</div>
					<div className="flex items-center">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="text-red-600 mr-2"
						>
							<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
						</svg>
						<span className="text-sm text-gray-600">Not Included</span>
					</div>
				</div>
			</div>
		</section>
	);
};

export default FeatureComparisonTable;
