import React, { useState, useEffect } from "react";

const SellerInsights = () => {
	const [selectedMetric, setSelectedMetric] = useState("Rating");
	const [sellersData, setSellersData] = useState([]);
	const [loading, setLoading] = useState(false);

	const handleMetricChange = (event) => {
		const metric = event.target.value;
		setSelectedMetric(metric);
		fetchSellersData(metric);
	};

	const fetchSellersData = (metric) => {
		setLoading(true);
		fetch(
			`${process.env.REACT_APP_BACKEND_URL}/admin/analytics?metric=${metric}`,
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			}
		)
			.then((response) => response.json())
			.then((data) => {
				setSellersData(data.sellers_insights || []);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching seller insights:", error);
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchSellersData(selectedMetric);
	}, [selectedMetric]); // Initial fetch

	return (
		<div>
			{loading ? (
				<p className="text-center text-gray-600 py-4">Loading...</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full border border-gray-300 rounded-lg">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">No:</th>
								<th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Seller Name</th>
								<th className="px-4 py-2 text-center text-sm font-medium text-gray-700 border-b border-gray-300">
									<select
										className="rounded-full px-3 py-1 text-center font-bold text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
										value={selectedMetric}
										onChange={handleMetricChange}
									>
										<option>Rating</option>
										<option>Total Ads</option>
										<option>Reveal Clicks</option>
										<option>Ad Clicks</option>
									</select>
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{sellersData.map((seller, index) => (
								<tr key={seller.seller_id || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
									<td className="px-4 py-2 text-sm text-gray-900">{index + 1}</td>
									<td className="px-4 py-2 text-sm text-gray-900">{seller.fullname}</td>
									<td className="px-4 py-2 text-center">
										{selectedMetric === "Rating" && (
											<strong className="text-green-600 font-bold">
												{seller.mean_rating
													? parseFloat(seller.mean_rating).toFixed(2)
													: "0.00"}
											</strong>
										)}
										{selectedMetric === "Total Ads" && (
											<strong className="text-green-600 text-base">
												{seller.total_ads}
											</strong>
										)}
										{selectedMetric === "Reveal Clicks" && (
											<strong className="text-green-600 font-bold">
												{seller.reveal_clicks}
											</strong>
										)}
										{selectedMetric === "Ad Clicks" && (
											<strong className="text-green-600 font-bold">
												{seller.total_ad_clicks}
											</strong>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default SellerInsights;
