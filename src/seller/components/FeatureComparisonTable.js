import React, { useState } from "react";
import PropTypes from "prop-types";

// Reusable icon components
const CheckIcon = ({ className = "", size = "16" }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="currentColor"
		className={`mr-2 ${className}`}
	>
		<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
	</svg>
);

const XIcon = ({ className = "", size = "16" }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="currentColor"
		className={`mr-2 ${className}`}
	>
		<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
	</svg>
);

const FeatureComparisonTable = ({
	tiers = [
		{
			id: 1,
			name: "Free",
			price: "KES 0",
			ads: "10 Ads",
			description: "Perfect for new sellers getting started",
			pricingOptions: [
				{ duration: "Forever", price: "KES 0", monthlyPrice: "KES 0" },
			],
		},
		{
			id: 2,
			name: "Basic",
			price: "KES 3,000",
			ads: "100 Ads",
			description: "Great for growing businesses",
			pricingOptions: [
				{ duration: "1 Month", price: "KES 3,000", monthlyPrice: "KES 3,000" },
				{ duration: "3 Months", price: "KES 8,550", monthlyPrice: "KES 2,850" },
				{
					duration: "6 Months",
					price: "KES 16,200",
					monthlyPrice: "KES 2,700",
				},
				{
					duration: "12 Months",
					price: "KES 30,600",
					monthlyPrice: "KES 2,550",
				},
			],
		},
		{
			id: 3,
			name: "Standard",
			price: "KES 7,500",
			ads: "400 Ads",
			popular: true,
			description: "Ideal for established sellers - Most Popular Choice",
			pricingOptions: [
				{ duration: "1 Month", price: "KES 7,500", monthlyPrice: "KES 7,500" },
				{
					duration: "3 Months",
					price: "KES 21,375",
					monthlyPrice: "KES 7,125",
				},
				{
					duration: "6 Months",
					price: "KES 40,500",
					monthlyPrice: "KES 6,750",
				},
				{
					duration: "12 Months",
					price: "KES 76,500",
					monthlyPrice: "KES 6,375",
				},
			],
		},
		{
			id: 4,
			name: "Premium",
			price: "KES 15,000",
			ads: "2000 Ads",
			description: "Enterprise solution for large businesses",
			pricingOptions: [
				{
					duration: "1 Month",
					price: "KES 15,000",
					monthlyPrice: "KES 15,000",
				},
				{
					duration: "3 Months",
					price: "KES 42,750",
					monthlyPrice: "KES 14,250",
				},
				{
					duration: "6 Months",
					price: "KES 81,000",
					monthlyPrice: "KES 13,500",
				},
				{
					duration: "12 Months",
					price: "KES 153,000",
					monthlyPrice: "KES 12,750",
				},
			],
		},
	],
	features = [
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
	],
	title = "Features Comparison",
	subtitle = "Compare features across all our pricing tiers and choose the perfect plan for your business",
	showSelectionButtons = true,
	onTierSelect = null,
	className = "",
	...props
}) => {
	const [selectedTier, setSelectedTier] = useState(null);

	const renderIcon = (value) => {
		if (value === true)
			return <CheckIcon className="text-green-600 mx-auto" size="20" />;
		if (value === "limited")
			return (
				<div className="relative group">
					<div className="flex items-center justify-center cursor-help">
						<CheckIcon className="text-yellow-400" size="20" />
						<span className="text-yellow-400 ml-1 text-sm">*</span>
					</div>
					{/* Tooltip */}
					<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
						Limited access in Basic tier
						<div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
					</div>
				</div>
			);
		return <XIcon className="text-red-600 mx-auto" size="20" />;
	};

	const handleSelectTier = (tierId) => {
		setSelectedTier(tierId);
		if (onTierSelect) {
			onTierSelect(tierId);
		}
	};

	return (
		<section
			className={`py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 bg-gradient-to-br from-gray-50 to-white ${className}`}
			{...props}
		>
			<div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
				<div className="text-left mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16">
					<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6">
						{title}
					</h2>
					<p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 max-w-3xl leading-relaxed">
						{subtitle}
					</p>
				</div>

				<div className="overflow-x-auto">
					<div className="min-w-full">
						<table className="w-full border-collapse bg-white rounded-xl lg:rounded-2xl shadow-sm overflow-hidden border border-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-3 sm:px-4 lg:px-6 py-4 lg:py-6 text-left text-sm lg:text-base font-semibold text-gray-900 border-b border-gray-200">
										Feature
									</th>
									{tiers.map((tier) => (
										<th
											key={tier.id}
											className="px-2 sm:px-3 lg:px-4 py-4 lg:py-6 text-center border-b border-gray-200"
										>
											<div className="text-sm lg:text-base font-semibold text-gray-900">
												{tier.name}
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{features.map((feature, index) => (
									<tr
										key={index}
										className="hover:bg-gray-50 transition-colors duration-150"
									>
										<td className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base text-gray-900">
											{feature.name}
										</td>
										<td className="px-2 sm:px-3 lg:px-4 py-3 lg:py-4 text-center">
											{renderIcon(feature.free)}
										</td>
										<td className="px-2 sm:px-3 lg:px-4 py-3 lg:py-4 text-center">
											{renderIcon(feature.basic)}
										</td>
										<td className="px-2 sm:px-3 lg:px-4 py-3 lg:py-4 text-center">
											{renderIcon(feature.standard)}
										</td>
										<td className="px-2 sm:px-3 lg:px-4 py-3 lg:py-4 text-center">
											{renderIcon(feature.premium)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Selection Buttons */}
				{showSelectionButtons && (
					<div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-16">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
							{tiers.map((tier) => (
								<div
									key={tier.id}
									className={`relative bg-white rounded-xl lg:rounded-2xl border p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 transition-all duration-300 ${
										tier.popular
											? "border-yellow-400 ring-2 ring-yellow-400 lg:scale-105 lg:z-10"
											: "border-gray-200 hover:border-gray-300"
									} ${
										selectedTier === tier.id
											? "ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100"
											: ""
									}`}
								>
									{tier.popular && (
										<div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 z-20">
											<span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg">
												Most Popular
											</span>
										</div>
									)}

									<div className="text-center">
										<h3 className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold text-gray-900 mb-2">
											{tier.name}
										</h3>
										<div className="text-xs sm:text-sm md:text-base text-gray-500 mb-2 sm:mb-3">
											{tier.ads}
										</div>
										<div className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
											{tier.description}
										</div>

										{/* Pricing Options */}
										<div className="space-y-1 sm:space-y-2 mb-4 sm:mb-5 md:mb-6">
											{tier.pricingOptions.map((option, index) => (
												<div
													key={index}
													className="p-2 sm:p-2 md:p-3 lg:p-3 xl:p-4 rounded-lg lg:rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200"
												>
													<div className="text-xs sm:text-xs md:text-sm lg:text-sm font-semibold text-gray-600 mb-1">
														{option.duration}
													</div>
													<div className="text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl font-bold text-gray-900">
														{option.price}
													</div>
													{option.monthlyPrice !== option.price && (
														<div className="text-xs sm:text-xs md:text-sm text-gray-500">
															{option.monthlyPrice}/month
														</div>
													)}
												</div>
											))}
										</div>

										<button
											onClick={() => handleSelectTier(tier.id)}
											className={`w-full inline-flex items-center justify-center gap-2 rounded-lg lg:rounded-xl px-3 sm:px-4 md:px-5 lg:px-6 xl:px-7 py-2 sm:py-3 md:py-3 lg:py-4 xl:py-4 text-xs sm:text-sm md:text-base lg:text-base xl:text-lg font-semibold transition-all duration-200 ${
												selectedTier === tier.id
													? "bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-lg"
													: tier.popular
													? "bg-yellow-500 text-gray-900 hover:bg-yellow-600 shadow-md hover:shadow-lg"
													: "bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg"
											}`}
										>
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="currentColor"
												className="sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6"
											>
												<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
											</svg>
											Select {tier.name}
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Legend */}
				<div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-16 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
					{[
						{
							icon: <CheckIcon className="text-green-600" />,
							text: "Included",
						},
						{
							icon: <CheckIcon className="text-yellow-400" />,
							text: "Limited",
						},
						{
							icon: <XIcon className="text-red-600" />,
							text: "Not Included",
						},
					].map((item, index) => (
						<div key={index} className="flex items-center">
							{item.icon}
							<span className="text-xs sm:text-sm md:text-base lg:text-base xl:text-lg text-gray-600">
								{item.text}
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

// PropTypes for better documentation and type safety
FeatureComparisonTable.propTypes = {
	tiers: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			name: PropTypes.string.isRequired,
			price: PropTypes.string.isRequired,
			ads: PropTypes.string.isRequired,
			description: PropTypes.string,
			popular: PropTypes.bool,
			pricingOptions: PropTypes.arrayOf(
				PropTypes.shape({
					duration: PropTypes.string.isRequired,
					price: PropTypes.string.isRequired,
					monthlyPrice: PropTypes.string.isRequired,
				})
			),
		})
	),
	features: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			free: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
			basic: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
			standard: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
			premium: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
		})
	),
	title: PropTypes.string,
	subtitle: PropTypes.string,
	showSelectionButtons: PropTypes.bool,
	onTierSelect: PropTypes.func,
	className: PropTypes.string,
};

export default FeatureComparisonTable;
