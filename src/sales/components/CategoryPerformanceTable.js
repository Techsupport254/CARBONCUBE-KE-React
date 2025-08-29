import React from "react";

const CategoryPerformanceTable = ({ categories }) => {
	// Calculate totals across all categories
	const totals = categories
		? categories.reduce(
				(acc, category) => ({
					ads_count: acc.ads_count + (category.ads_count || 0),
					ad_clicks: acc.ad_clicks + (category.ad_clicks || 0),
					ad_click_reveals:
						acc.ad_click_reveals + (category.ad_click_reveals || 0),
					wishlist_count: acc.wishlist_count + (category.wishlist_count || 0),
				}),
				{ ads_count: 0, ad_clicks: 0, ad_click_reveals: 0, wishlist_count: 0 }
		  )
		: { ads_count: 0, ad_clicks: 0, ad_click_reveals: 0, wishlist_count: 0 };

	return (
		<div className="mt-4 px-2 sm:px-4 lg:px-6">
			<h3 className="text-xl font-bold text-gray-900 mb-3">Buyer Related</h3>

			<div className="bg-white rounded-lg shadow-lg overflow-hidden">
				<div className="px-3 py-3 sm:px-4 bg-secondary text-white ">
					<h3 className="text-base font-medium text-white text-center">
						Category Performance Analytics
					</h3>
				</div>

				<div className="overflow-x-auto">
					<div className="inline-block min-w-full align-middle">
						<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
							<table className="min-w-full divide-y divide-gray-300">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-3">
											Category
										</th>
										<th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-3">
											Ads Number
										</th>
										<th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-3">
											Ad Clicks
										</th>
										<th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-3">
											Ad Click Reveals
										</th>
										<th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-3">
											Wishlist
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{categories && categories.length > 0 ? (
										categories.map((category, index) => (
											<tr
												key={index}
												className="hover:bg-gray-50 transition-colors duration-150"
											>
												<td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900 capitalize sm:px-3">
													{category.name || "Unknown Category"}
												</td>
												<td className="whitespace-nowrap px-2 py-2 text-sm font-bold text-blue-600 sm:px-3">
													{category.ads_count || 0}
												</td>
												<td className="whitespace-nowrap px-2 py-2 text-sm font-bold text-green-600 sm:px-3">
													{category.ad_clicks || 0}
												</td>
												<td className="whitespace-nowrap px-2 py-2 text-sm font-bold text-cyan-600 sm:px-3">
													{category.ad_click_reveals || 0}
												</td>
												<td className="whitespace-nowrap px-2 py-2 text-sm font-bold text-amber-600 sm:px-3">
													{category.wishlist_count || 0}
												</td>
											</tr>
										))
									) : (
										<tr>
											<td
												colSpan="5"
												className="px-2 py-4 text-sm text-center text-gray-500 sm:px-3"
											>
												No category data available
											</td>
										</tr>
									)}
								</tbody>
								<tfoot className="bg-gray-100">
									<tr>
										<td className="whitespace-nowrap px-2 py-2 text-sm font-bold text-gray-900 sm:px-3">
											Total Across All Categories
										</td>
										<td className="whitespace-nowrap px-2 py-2 text-sm font-bold text-blue-600 sm:px-3">
											{totals.ads_count}
										</td>
										<td className="whitespace-nowrap px-2 py-2 text-sm font-bold text-green-600 sm:px-3">
											{totals.ad_clicks}
										</td>
										<td className="whitespace-nowrap px-2 py-2 text-sm font-bold text-cyan-600 sm:px-3">
											{totals.ad_click_reveals}
										</td>
										<td className="whitespace-nowrap px-2 py-2 text-sm font-bold text-amber-600 sm:px-3">
											{totals.wishlist_count}
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CategoryPerformanceTable;
