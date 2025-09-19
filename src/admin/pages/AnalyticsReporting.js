import React, { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import CategoryClickEvents from "../components/CategoryClickEvents";
import TopWishListedAds from "../components/TopWishListedAds";
import BuyerInsights from "../components/BuyerInsights";
import SellerInsights from "../components/SellerInsights";
import CategoryAnalytics from "../components/CategoryAnalytics";
import CategoryWishlists from "../components/CategoryWishlists";
import {
	BuyerAgeGroupChart,
	GenderDistributionChart,
	EmploymentChart,
	IncomeChart,
	EducationChart,
	SectorChart,
} from "../components/BuyerDemographics";
import {
	SellerAgeGroupChart,
	SellerGenderDistributionChart,
	SellerCategoryChart,
	SellerTierChart,
} from "../components/SellerDemographics";
import Spinner from "react-spinkit";

const AnalyticsReporting = ({ onLogout }) => {
	const [analyticsData, setAnalyticsData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/analytics`, {
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
		})
			.then((response) => response.json())
			.then((data) => {
				setAnalyticsData(data);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div className="flex">
				<div className="flex-grow">
					<Navbar
						mode="admin"
						showSearch={false}
						showCategories={false}
						onLogout={onLogout}
					/>
					<div className="flex justify-center items-center h-screen">
						<Spinner
							variant="warning"
							name="cube-grid"
							style={{ width: 100, height: 100 }}
						/>
					</div>
				</div>
			</div>
		);
	}

	if (!analyticsData) {
		return (
			<div className="flex">
				<div className="flex-grow">
					<Navbar
						mode="admin"
						showSearch={false}
						showCategories={false}
						onLogout={onLogout}
					/>
					<div className="text-center text-red-600 p-8">Error loading data</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex">
			<div className="flex-grow">
				<Navbar
					mode="admin"
					showSearch={false}
					showCategories={false}
					onLogout={onLogout}
				/>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Header */}
					<div className="flex justify-between items-center mb-6 bg-gray-800 p-4 text-white rounded-lg">
						<h2 className="text-2xl font-bold">Analytics Dashboard</h2>
						<span className="font-semibold">Hello, Admin Team</span>
					</div>

					{/* Statistics Cards */}
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
						{[
							{ title: "Total Sellers", value: analyticsData.total_sellers },
							{ title: "Total Buyers", value: analyticsData.total_buyers },
							{ title: "Total Reviews", value: analyticsData.total_reviews },
							{ title: "Total Ads", value: analyticsData.total_ads },
							{
								title: "Total Wishlists",
								value: analyticsData.total_ads_wish_listed,
							},
							{
								title: "Total Ads Clicks",
								value: analyticsData.total_ads_clicks,
							},
							{
								title: "Total Click Reveals",
								value: analyticsData.total_reveal_clicks || 0,
							},
						].map(({ title, value }, index) => (
							<div
								key={index}
								className="bg-white border border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:shadow-md transition-shadow duration-200"
								onClick={() => console.log("Card clicked:", { title, value })}
							>
								<h6 className="text-sm text-gray-600 mb-2">{title}</h6>
								<h3 className="text-2xl font-bold text-blue-600">
									{(value || 0).toLocaleString()}
								</h3>
							</div>
						))}
					</div>

					{/* Analytics Sections */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
						<div className="bg-white border border-gray-200 rounded-lg shadow-sm">
							<div className="bg-gray-800 text-white p-4 rounded-t-lg text-center">
								<h3 className="text-lg font-bold">Category Ads Analytics</h3>
							</div>
							<div className="p-6">
								<CategoryAnalytics data={analyticsData.ads_per_category} />
							</div>
						</div>

						<div className="bg-white border border-gray-200 rounded-lg shadow-sm">
							<div className="bg-gray-800 text-white p-4 rounded-t-lg text-center">
								<h3 className="text-lg font-bold">Category WishListed Ads</h3>
							</div>
							<div className="p-6">
								<CategoryWishlists
									data={analyticsData.category_wishlist_data}
								/>
							</div>
						</div>
					</div>

					{/* Category Click Events */}
					<div className="mb-8">
						<div className="bg-white border border-gray-200 rounded-lg shadow-sm">
							<div className="bg-gray-800 text-white p-4 rounded-t-lg text-center">
								<h3 className="text-lg font-bold">Category Click Events</h3>
							</div>
							<div className="p-6">
								<CategoryClickEvents
									data={analyticsData.category_click_events}
								/>
							</div>
						</div>
					</div>

					{/* Top Wishlisted Ads */}
					<div className="mb-8">
						<div className="bg-white border border-gray-200 rounded-lg shadow-sm">
							<div className="bg-gray-800 text-white p-4 rounded-t-lg text-center">
								<h3 className="text-lg font-bold">Top Wishlisted Ads</h3>
							</div>
							<div className="p-6">
								<TopWishListedAds data={analyticsData.top_wishlisted_ads} />
							</div>
						</div>
					</div>

					{/* Buyer and Seller Insights */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
						<div className="bg-white border border-gray-200 rounded-lg shadow-sm">
							<div className="bg-gray-800 text-white p-4 rounded-t-lg text-center">
								<h3 className="text-lg font-bold">Buyer Insights</h3>
							</div>
							<div className="p-6">
								<BuyerInsights data={analyticsData.buyers_insights} />
							</div>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg shadow-sm">
							<div className="bg-gray-800 text-white p-4 rounded-t-lg text-center">
								<h3 className="text-lg font-bold">Seller Insights</h3>
							</div>
							<div className="p-6">
								<SellerInsights data={analyticsData.sellers_insights} />
							</div>
						</div>
					</div>

					{/* Buyer Demographics Charts Section */}
					<div className="mb-8">
						<div className="bg-gray-800 text-white p-4 rounded-lg text-center mb-6">
							<h3 className="text-xl font-bold">Buyer Demographics</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full">
								<div className="bg-gray-800 text-white p-4 rounded-t-lg text-center">
									<h4 className="text-lg font-bold">Age Group Distribution</h4>
								</div>
								<div className="p-6 flex justify-center items-center">
									<BuyerAgeGroupChart data={analyticsData.buyer_age_groups} />
								</div>
							</div>
							<div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full">
								<div className="bg-gray-800 text-white p-4 rounded-t-lg text-center">
									<h4 className="text-lg font-bold">Employment Status</h4>
								</div>
								<div className="p-6 flex justify-center items-center">
									<EmploymentChart data={analyticsData.employment_data} />
								</div>
							</div>
							<div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full">
								<div className="bg-gray-800 text-white p-4 rounded-t-lg text-center">
									<h4 className="text-lg font-bold">Income Distribution</h4>
								</div>
								<div className="p-6 flex justify-center items-center">
									<IncomeChart data={analyticsData.income_data} />
								</div>
							</div>
							<div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full">
								<div className="bg-gray-800 text-white p-4 rounded-t-lg text-center">
									<h4 className="text-lg font-bold">Sector Distribution</h4>
								</div>
								<div className="p-6 flex justify-center items-center">
									<SectorChart data={analyticsData.sector_data} />
								</div>
							</div>
							<div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full">
								<div className="bg-gray-800 text-white p-4 rounded-t-lg text-center">
									<h4 className="text-lg font-bold">Gender Distribution</h4>
								</div>
								<div className="p-6 flex justify-center items-center">
									<GenderDistributionChart
										data={analyticsData.gender_distribution}
									/>
								</div>
							</div>
							<div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full">
								<div className="bg-gray-800 text-white p-4 rounded-t-lg text-center">
									<h4 className="text-lg font-bold">Education Level</h4>
								</div>
								<div className="p-6 flex justify-center items-center">
									<EducationChart data={analyticsData.education_data} />
								</div>
							</div>
						</div>
					</div>

					{/* Seller Demographics Charts Section */}
					<div className="mb-8">
						<div className="bg-gray-800 text-white p-4 rounded-lg text-center mb-6">
							<h3 className="text-xl font-bold">Seller Demographics</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full">
								<div className="bg-gray-800 text-white p-4 rounded-t-lg text-center">
									<h4 className="text-lg font-bold">Age Group Distribution</h4>
								</div>
								<div className="p-6 flex justify-center items-center">
									<SellerAgeGroupChart data={analyticsData.seller_age_groups} />
								</div>
							</div>
							<div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full">
								<div className="bg-gray-800 text-white p-4 rounded-t-lg text-center">
									<h4 className="text-lg font-bold">Category Distribution</h4>
								</div>
								<div className="p-6 flex justify-center items-center">
									<SellerCategoryChart data={analyticsData.category_data} />
								</div>
							</div>
							<div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full">
								<div className="bg-gray-800 text-white p-4 rounded-t-lg text-center">
									<h4 className="text-lg font-bold">Gender Distribution</h4>
								</div>
								<div className="p-6 flex justify-center items-center">
									<SellerGenderDistributionChart
										data={analyticsData.seller_gender_distribution}
									/>
								</div>
							</div>
							<div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full">
								<div className="bg-gray-800 text-white p-4 rounded-t-lg text-center">
									<h4 className="text-lg font-bold">Tier Distribution</h4>
								</div>
								<div className="p-6 flex justify-center items-center">
									<SellerTierChart data={analyticsData.tier_data} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AnalyticsReporting;
