import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCheck,
	faTimes,
	faEye,
	faRefresh,
	faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

const FingerprintRemovalRequests = () => {
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState(null);
	const [filter, setFilter] = useState("all");
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [rejectionReason, setRejectionReason] = useState("");
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "/api";

	useEffect(() => {
		fetchRequests();
		fetchStats();
	}, [filter]);

	const fetchRequests = async () => {
		try {
			const url =
				filter === "all"
					? `${API_BASE_URL}/admin/internal_user_exclusions?type=removal_requests`
					: `${API_BASE_URL}/admin/internal_user_exclusions?type=removal_requests&status=${filter}`;

			const response = await fetch(url, {
				headers: {
					Authorization: "Bearer " + sessionStorage.getItem("token"),
				},
			});

			if (response.ok) {
				const data = await response.json();
				setRequests(data);
			} else {
				const errorData = await response.json();
				console.error("Failed to fetch requests:", errorData);
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
				`${API_BASE_URL}/admin/internal_user_exclusions/stats`,
				{
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
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
				`${API_BASE_URL}/admin/internal_user_exclusions/${requestId}/approve`,
				{
					method: "POST",
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
						"Content-Type": "application/json",
					},
				}
			);

			if (response.ok) {
				setSuccessMessage("Request approved successfully!");
				setShowSuccessModal(true);
				fetchRequests();
				fetchStats();
			} else {
				const data = await response.json();
				setErrorMessage(
					data.errors ? data.errors.join(", ") : "Failed to approve request"
				);
				setShowErrorModal(true);
			}
		} catch (error) {
			console.error("Error approving request:", error);
			setErrorMessage("Failed to approve request");
			setShowErrorModal(true);
		}
	};

	const handleReject = async () => {
		if (!selectedRequest) return;

		try {
			const response = await fetch(
				`${API_BASE_URL}/admin/internal_user_exclusions/${selectedRequest.id}/reject`,
				{
					method: "POST",
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						rejection_reason: rejectionReason,
					}),
				}
			);

			if (response.ok) {
				setSuccessMessage("Request rejected successfully!");
				setShowSuccessModal(true);
				setShowRejectModal(false);
				setRejectionReason("");
				setSelectedRequest(null);
				fetchRequests();
				fetchStats();
			} else {
				const data = await response.json();
				setErrorMessage(
					data.errors ? data.errors.join(", ") : "Failed to reject request"
				);
				setShowErrorModal(true);
			}
		} catch (error) {
			console.error("Error rejecting request:", error);
			setErrorMessage("Failed to reject request");
			setShowErrorModal(true);
		}
	};

	const getStatusBadge = (status) => {
		const variants = {
			pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
			approved: "bg-green-100 text-green-800 border-green-200",
			rejected: "bg-red-100 text-red-800 border-red-200",
		};

		return (
			<span
				className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
					variants[status] || "bg-gray-100 text-gray-800 border-gray-200"
				}`}
			>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</span>
		);
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleString();
	};

	const showRequestDetails = (request) => {
		setSelectedRequest(request);
		setShowDetailsModal(true);
	};

	if (loading) {
		return (
			<div className="d-flex">
				<Sidebar />
				<div className="flex-grow-1">
					<TopNavbar />
					<div className="flex justify-center items-center h-screen">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="d-flex">
			<Sidebar />
			<div className="flex-grow-1">
				<TopNavbar />
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Header */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
						<div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
							<h1 className="text-2xl font-bold text-gray-900">
								Fingerprint Removal Requests
							</h1>
							<button
								onClick={() => {
									fetchRequests();
									fetchStats();
								}}
								className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
							>
								<FontAwesomeIcon icon={faRefresh} className="mr-2" />
								Refresh
							</button>
						</div>

						{/* Stats Cards */}
						{stats && (
							<div className="px-6 py-6">
								<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
									<div className="bg-gradient-to-r from-gray-800 to-black rounded-lg p-6 text-white">
										<div className="text-3xl font-bold">
											{stats.total_removal_requests}
										</div>
										<div className="text-gray-300">Total Requests</div>
									</div>
									<div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-6 text-white">
										<div className="text-3xl font-bold">
											{stats.pending_requests}
										</div>
										<div className="text-yellow-100">Pending</div>
									</div>
									<div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
										<div className="text-3xl font-bold">
											{stats.approved_requests}
										</div>
										<div className="text-green-100">Approved</div>
									</div>
									<div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
										<div className="text-3xl font-bold">
											{stats.rejected_requests}
										</div>
										<div className="text-red-100">Rejected</div>
									</div>
								</div>
							</div>
						)}

						{/* Filter Buttons */}
						<div className="px-6 py-4 border-t border-gray-200">
							<div className="flex flex-wrap gap-2">
								<button
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
										filter === "all"
											? "bg-gray-800 text-white"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
									onClick={() => setFilter("all")}
								>
									All ({stats?.total_removal_requests || 0})
								</button>
								<button
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
										filter === "pending"
											? "bg-yellow-500 text-gray-900"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
									onClick={() => setFilter("pending")}
								>
									Pending ({stats?.pending_requests || 0})
								</button>
								<button
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
										filter === "approved"
											? "bg-green-600 text-white"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
									onClick={() => setFilter("approved")}
								>
									Approved ({stats?.approved_requests || 0})
								</button>
								<button
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
										filter === "rejected"
											? "bg-red-600 text-white"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
									onClick={() => setFilter("rejected")}
								>
									Rejected ({stats?.rejected_requests || 0})
								</button>
							</div>
						</div>
					</div>

					{/* Requests Table */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200">
						{requests.length === 0 ? (
							<div className="text-center py-12">
								<div className="flex justify-center mb-4">
									<FontAwesomeIcon
										icon={faClipboardList}
										className="text-gray-400 text-6xl"
									/>
								</div>
								<p className="text-gray-500 text-lg">No requests found.</p>
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
											<tr
												key={request.id}
												className="hover:bg-gray-50 transition-colors duration-200"
											>
												<td className="px-6 py-4 whitespace-nowrap">
													<div>
														<div className="text-sm font-medium text-gray-900">
															{request.requester_name}
														</div>
														{request.additional_info && (
															<div className="text-sm text-gray-500 truncate max-w-xs">
																{request.additional_info.substring(0, 50)}...
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
															{request.identifier_value.substring(0, 16)}...
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
													<div className="flex space-x-2">
														<button
															onClick={() => showRequestDetails(request)}
															className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
														>
															<FontAwesomeIcon icon={faEye} className="mr-1" />
															View
														</button>
														{request.status === "pending" && (
															<>
																<button
																	onClick={() => handleApprove(request.id)}
																	className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
																>
																	<FontAwesomeIcon
																		icon={faCheck}
																		className="mr-1"
																	/>
																	Approve
																</button>
																<button
																	onClick={() => {
																		setSelectedRequest(request);
																		setShowRejectModal(true);
																	}}
																	className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
																>
																	<FontAwesomeIcon
																		icon={faTimes}
																		className="mr-1"
																	/>
																	Reject
																</button>
															</>
														)}
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Reject Modal */}
			{showRejectModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
					<div className="relative w-full max-w-md transform transition-all">
						<div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
							{/* Header */}
							<div className="bg-gradient-to-r from-gray-800 to-black px-6 py-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<div className="flex-shrink-0">
											<FontAwesomeIcon
												icon={faTimes}
												className="h-6 w-6 text-red-500"
											/>
										</div>
										<div className="ml-3">
											<h3 className="text-lg font-semibold text-white">
												Reject Request
											</h3>
											<p className="text-gray-300 text-sm">
												Provide a reason for rejection
											</p>
										</div>
									</div>
									<button
										onClick={() => setShowRejectModal(false)}
										className="text-gray-300 hover:text-white transition-colors duration-200"
									>
										<svg
											className="h-6 w-6"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>
							</div>

							{/* Content */}
							<div className="px-6 py-6">
								<p className="text-sm text-gray-600 mb-4">
									Please provide a reason for rejecting this request:
								</p>
								<textarea
									value={rejectionReason}
									onChange={(e) => setRejectionReason(e.target.value)}
									placeholder="Reason for rejection..."
									className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
									rows={3}
								/>
								<div className="flex justify-end space-x-3 mt-6">
									<button
										onClick={() => setShowRejectModal(false)}
										className="px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
									>
										Cancel
									</button>
									<button
										onClick={handleReject}
										className="px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
									>
										Reject
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Details Modal */}
			{showDetailsModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
					<div className="relative w-full max-w-4xl transform transition-all">
						<div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
							{/* Header */}
							<div className="bg-gradient-to-r from-gray-800 to-black px-6 py-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<div className="flex-shrink-0">
											<FontAwesomeIcon
												icon={faEye}
												className="h-6 w-6 text-yellow-400"
											/>
										</div>
										<div className="ml-3">
											<h3 className="text-lg font-semibold text-white">
												Request Details
											</h3>
											<p className="text-gray-300 text-sm">
												View complete request information
											</p>
										</div>
									</div>
									<button
										onClick={() => setShowDetailsModal(false)}
										className="text-gray-300 hover:text-white transition-colors duration-200"
									>
										<svg
											className="h-6 w-6"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>
							</div>

							{/* Content */}
							<div className="px-6 py-6">
								{selectedRequest && (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<h4 className="text-md font-medium text-gray-900 mb-3">
												Requester Information
											</h4>
											<div className="space-y-2">
												<p>
													<span className="font-medium">Name:</span>{" "}
													{selectedRequest.requester_name}
												</p>
												<p>
													<span className="font-medium">Device:</span>{" "}
													{selectedRequest.device_description}
												</p>
												<p>
													<span className="font-medium">Status:</span>{" "}
													{getStatusBadge(selectedRequest.status)}
												</p>
												<p>
													<span className="font-medium">Submitted:</span>{" "}
													{formatDate(selectedRequest.created_at)}
												</p>
											</div>
										</div>
										<div>
											<h4 className="text-md font-medium text-gray-900 mb-3">
												Technical Information
											</h4>
											<div className="space-y-2">
												<p>
													<span className="font-medium">Device Hash:</span>
												</p>
												<code className="block text-sm bg-gray-100 p-3 rounded-xl break-all">
													{selectedRequest.identifier_value}
												</code>
												<p className="mt-2">
													<span className="font-medium">User Agent:</span>
												</p>
												<code className="block text-sm bg-gray-100 p-3 rounded-xl break-all">
													{selectedRequest.user_agent}
												</code>
											</div>
										</div>
										{selectedRequest.additional_info && (
											<div className="md:col-span-2">
												<h4 className="text-md font-medium text-gray-900 mb-3">
													Additional Information
												</h4>
												<p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-200">
													{selectedRequest.additional_info}
												</p>
											</div>
										)}
										{selectedRequest.rejection_reason && (
											<div className="md:col-span-2">
												<h4 className="text-md font-medium text-gray-900 mb-3">
													Rejection Reason
												</h4>
												<p className="text-red-700 bg-red-50 p-4 rounded-xl border border-red-200">
													{selectedRequest.rejection_reason}
												</p>
											</div>
										)}
									</div>
								)}
								<div className="flex justify-end mt-6">
									<button
										onClick={() => setShowDetailsModal(false)}
										className="px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
									>
										Close
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Success Modal */}
			{showSuccessModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
					<div className="relative w-full max-w-sm transform transition-all">
						<div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
							{/* Header */}
							<div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6 text-center">
								<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 bg-opacity-20 mb-4">
									<svg
										className="h-8 w-8 text-green-100"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-bold text-white">Success!</h3>
								<p className="text-green-100 mt-1">Operation completed</p>
							</div>

							{/* Content */}
							<div className="px-6 py-6 text-center">
								<div className="mb-6">
									<p className="text-gray-600">{successMessage}</p>
								</div>
								<button
									onClick={() => setShowSuccessModal(false)}
									className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-base font-semibold rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transform transition-all duration-200 hover:scale-105"
								>
									Continue
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Error Modal */}
			{showErrorModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
					<div className="relative w-full max-w-sm transform transition-all">
						<div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
							{/* Header */}
							<div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-6 text-center">
								<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 bg-opacity-20 mb-4">
									<svg
										className="h-8 w-8 text-red-100"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-bold text-white">Error</h3>
								<p className="text-red-100 mt-1">Something went wrong</p>
							</div>

							{/* Content */}
							<div className="px-6 py-6 text-center">
								<div className="mb-6">
									<p className="text-gray-600">{errorMessage}</p>
								</div>
								<button
									onClick={() => setShowErrorModal(false)}
									className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-base font-semibold rounded-xl shadow-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transform transition-all duration-200 hover:scale-105"
								>
									Try Again
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
