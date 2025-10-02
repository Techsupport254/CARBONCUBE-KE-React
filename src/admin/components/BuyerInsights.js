import React, { useState, useEffect } from "react";

const BuyerInsights = () => {
	const [selectedMetric, setSelectedMetric] = useState("Total Wishlists");
	const [buyersData, setBuyersData] = useState([]);
	const [loading, setLoading] = useState(false);

	const handleMetricChange = (event) => {
		const metric = event.target.value;
		setSelectedMetric(metric);
		fetchBuyersData(metric);
	};

	const fetchBuyersData = (metric) => {
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
				setBuyersData(data.buyers_insights || []);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchBuyersData(selectedMetric);
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
								<th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Buyer Name</th>
								<th className="px-4 py-2 text-center text-sm font-medium text-gray-700 border-b border-gray-300">
									<select
										className="rounded-full px-3 py-1 text-center font-bold text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
										value={selectedMetric}
										onChange={handleMetricChange}
									>
										<option>Total Wishlists</option>
										<option>Total Click Events</option>
									</select>
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{buyersData.map((buyer, index) => (
								<tr key={buyer.buyer_id || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
									<td className="px-4 py-2 text-sm text-gray-900">{index + 1}</td>
									<td className="px-4 py-2 text-sm text-gray-900">{buyer.fullname}</td>
									<td className="px-4 py-2 text-center">
										{selectedMetric === "Total Wishlists" && (
											<strong className="text-green-600 font-bold">
												{buyer.total_wishlists}
											</strong>
										)}
										{selectedMetric === "Total Click Events" && (
											<strong className="text-green-600 text-base">
												{buyer.total_clicks || 0}
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

export default BuyerInsights;
