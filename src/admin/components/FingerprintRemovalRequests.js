import React, { useState, useEffect } from "react";
import "./FingerprintRemovalRequests.css";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const FingerprintRemovalRequests = () => {
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState(null);
	const [filter, setFilter] = useState("all");
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [rejectionReason, setRejectionReason] = useState("");

	useEffect(() => {
		fetchRequests();
		fetchStats();
	}, [filter]);

	const fetchRequests = async () => {
		try {
			const url =
				filter === "all"
					? `${API_BASE_URL}/admin/fingerprint_removal_requests`
					: `${API_BASE_URL}/admin/fingerprint_removal_requests?status=${filter}`;

			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setRequests(data);
			} else {
				console.error("Failed to fetch requests");
			}
		} catch (error) {
			console.error("Error fetching requests:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchStats = async () => {
		try {
			const response = await fetch(
				`${API_BASE_URL}/admin/fingerprint_removal_requests/stats`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				setStats(data);
			}
		} catch (error) {
			console.error("Error fetching stats:", error);
		}
	};

	const handleApprove = async (requestId) => {
		try {
			const response = await fetch(
				`${API_BASE_URL}/admin/fingerprint_removal_requests/${requestId}/approve`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.ok) {
				alert("Request approved successfully!");
				fetchRequests();
				fetchStats();
			} else {
				const data = await response.json();
				alert(
					data.errors ? data.errors.join(", ") : "Failed to approve request"
				);
			}
		} catch (error) {
			console.error("Error approving request:", error);
			alert("Failed to approve request");
		}
	};

	const handleReject = async () => {
		if (!selectedRequest) return;

		try {
			const response = await fetch(
				`${API_BASE_URL}/admin/fingerprint_removal_requests/${selectedRequest.id}/reject`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						rejection_reason: rejectionReason,
					}),
				}
			);

			if (response.ok) {
				alert("Request rejected successfully!");
				setShowRejectModal(false);
				setRejectionReason("");
				setSelectedRequest(null);
				fetchRequests();
				fetchStats();
			} else {
				const data = await response.json();
				alert(
					data.errors ? data.errors.join(", ") : "Failed to reject request"
				);
			}
		} catch (error) {
			console.error("Error rejecting request:", error);
			alert("Failed to reject request");
		}
	};

	const getStatusBadge = (status) => {
		const statusClasses = {
			pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
			approved: "bg-green-100 text-green-800 border-green-200",
			rejected: "bg-red-100 text-red-800 border-red-200",
		};

		return (
			<span
				className={`px-2 py-1 text-xs font-medium rounded-full border ${
					statusClasses[status] || "bg-gray-100 text-gray-800 border-gray-200"
				}`}
			>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</span>
		);
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleString();
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading requests...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Fingerprint Removal Requests
					</h1>
					<p className="text-gray-600">
						Manage requests from users to be excluded from analytics tracking
					</p>
				</div>

				{/* Stats Cards */}
				{stats && (
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
						<div className="bg-white rounded-lg shadow p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
										<span className="text-white text-sm font-bold">
											{stats.total_requests}
										</span>
									</div>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-500">
										Total Requests
									</p>
									<p className="text-2xl font-semibold text-gray-900">
										{stats.total_requests}
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
										<span className="text-white text-sm font-bold">
											{stats.pending_requests}
										</span>
									</div>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-500">Pending</p>
									<p className="text-2xl font-semibold text-gray-900">
										{stats.pending_requests}
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
										<span className="text-white text-sm font-bold">
											{stats.approved_requests}
										</span>
									</div>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-500">Approved</p>
									<p className="text-2xl font-semibold text-gray-900">
										{stats.approved_requests}
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
										<span className="text-white text-sm font-bold">
											{stats.rejected_requests}
										</span>
									</div>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-500">Rejected</p>
									<p className="text-2xl font-semibold text-gray-900">
										{stats.rejected_requests}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Filter Controls */}
				<div className="bg-white rounded-lg shadow p-6 mb-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-lg font-semibold text-gray-900 mb-2">
								Filter Requests
							</h2>
							<div className="flex space-x-4">
								<button
									onClick={() => setFilter("all")}
									className={`px-4 py-2 rounded-md text-sm font-medium ${
										filter === "all"
											? "bg-blue-100 text-blue-700"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									All ({stats?.total_requests || 0})
								</button>
								<button
									onClick={() => setFilter("pending")}
									className={`px-4 py-2 rounded-md text-sm font-medium ${
										filter === "pending"
											? "bg-yellow-100 text-yellow-700"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									Pending ({stats?.pending_requests || 0})
								</button>
								<button
									onClick={() => setFilter("approved")}
									className={`px-4 py-2 rounded-md text-sm font-medium ${
										filter === "approved"
											? "bg-green-100 text-green-700"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									Approved ({stats?.approved_requests || 0})
								</button>
								<button
									onClick={() => setFilter("rejected")}
									className={`px-4 py-2 rounded-md text-sm font-medium ${
										filter === "rejected"
											? "bg-red-100 text-red-700"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									Rejected ({stats?.rejected_requests || 0})
								</button>
							</div>
						</div>
						<button
							onClick={() => fetchRequests()}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							Refresh
						</button>
					</div>
				</div>

				{/* Requests Table */}
				<div className="bg-white rounded-lg shadow overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h3 className="text-lg font-semibold text-gray-900">
							Requests ({requests.length})
						</h3>
					</div>

					{requests.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-500">No requests found.</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Requester
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Device
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Submitted
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{requests.map((request) => (
										<tr key={request.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div>
													<div className="text-sm font-medium text-gray-900">
														{request.requester_name}
													</div>
													{request.additional_info && (
														<div className="text-sm text-gray-500 truncate max-w-xs">
															{request.additional_info}
														</div>
													)}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div>
													<div className="text-sm text-gray-900">
														{request.device_description}
													</div>
													<div className="text-sm text-gray-500 font-mono">
														{request.device_hash.substring(0, 16)}...
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												{getStatusBadge(request.status)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{formatDate(request.created_at)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												{request.status === "pending" && (
													<div className="flex space-x-2">
														<button
															onClick={() => handleApprove(request.id)}
															className="text-green-600 hover:text-green-900"
														>
															Approve
														</button>
														<button
															onClick={() => {
																setSelectedRequest(request);
																setShowRejectModal(true);
															}}
															className="text-red-600 hover:text-red-900"
														>
															Reject
														</button>
													</div>
												)}
												{request.status === "rejected" &&
													request.rejection_reason && (
														<div className="text-sm text-gray-500">
															Reason: {request.rejection_reason}
														</div>
													)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>

			{/* Reject Modal */}
			{showRejectModal && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
					<div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
						<div className="mt-3">
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								Reject Request
							</h3>
							<p className="text-sm text-gray-500 mb-4">
								Please provide a reason for rejecting this request:
							</p>
							<textarea
								value={rejectionReason}
								onChange={(e) => setRejectionReason(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								rows={3}
								placeholder="Reason for rejection..."
							/>
							<div className="flex justify-end space-x-3 mt-4">
								<button
									onClick={() => {
										setShowRejectModal(false);
										setRejectionReason("");
										setSelectedRequest(null);
									}}
									className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
								>
									Cancel
								</button>
								<button
									onClick={handleReject}
									className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
								>
									Reject
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default FingerprintRemovalRequests;
