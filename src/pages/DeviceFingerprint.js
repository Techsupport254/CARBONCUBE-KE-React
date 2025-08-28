import React, { useState, useEffect } from "react";
import {
	initializeDeviceFingerprinting,
	getDeviceInfo,
} from "../utils/clickEventLogger";
import TopNavBarMinimal from "../components/TopNavBarMinimal";
import Footer from "../components/Footer";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "/api";

const DeviceFingerprint = () => {
	const [deviceInfo, setDeviceInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [copied, setCopied] = useState("");
	const [showRequestForm, setShowRequestForm] = useState(false);
	const [showWhitelistModal, setShowWhitelistModal] = useState(false);
	const [requestStatus, setRequestStatus] = useState(null);
	const [requestForm, setRequestForm] = useState({
		requesterName: "",
		deviceDescription: "",
		additionalInfo: "",
	});
	const [whitelistForm, setWhitelistForm] = useState({
		name: "",
		device: "",
	});
	const [submitting, setSubmitting] = useState(false);
	const [submittingWhitelist, setSubmittingWhitelist] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		const initializeFingerprint = async () => {
			try {
				// Test API connection
				try {
					await fetch(`${API_BASE_URL}/internal_user_exclusions/check/test`);
				} catch (apiError) {
					console.error("API connection failed:", apiError);
				}

				// Initialize device fingerprinting
				const { fingerprint, isInternal } = initializeDeviceFingerprinting();
				const info = getDeviceInfo();

				setDeviceInfo({
					...info,
					fingerprint: fingerprint,
					isInternal: isInternal,
				});

				// Check if there's already a request for this device
				await checkExistingRequest(info.hash);
			} catch (error) {
				console.error("Error initializing fingerprint:", error);
			} finally {
				setLoading(false);
			}
		};

		initializeFingerprint();
	}, []);

	const checkExistingRequest = async (deviceHash) => {
		try {
			setRefreshing(true);

			const response = await fetch(
				`${API_BASE_URL}/internal_user_exclusions/check/${deviceHash}`
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setRequestStatus(data);
		} catch (error) {
			console.error("Error checking request status:", error);
			setRequestStatus(null);
		} finally {
			setRefreshing(false);
		}
	};

	const handleSubmitRequest = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		// Validate required fields
		if (!deviceInfo?.hash) {
			setErrorMessage(
				"Device hash is missing. Please refresh the page and try again."
			);
			setShowErrorModal(true);
			setSubmitting(false);
			return;
		}

		if (!deviceInfo?.userAgent) {
			setErrorMessage(
				"User agent is missing. Please refresh the page and try again."
			);
			setShowErrorModal(true);
			setSubmitting(false);
			return;
		}

		const requestBody = {
			requester_name: requestForm.requesterName,
			device_description: requestForm.deviceDescription,
			device_hash: deviceInfo.hash,
			user_agent: deviceInfo.userAgent,
		};

		try {
			const response = await fetch(`${API_BASE_URL}/internal_user_exclusions`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(requestBody),
			});

			const data = await response.json();

			if (response.ok) {
				setRequestStatus(data);
				setShowRequestForm(false);
				setRequestForm({
					requesterName: "",
					deviceDescription: "",
				});
			} else {
				setErrorMessage(
					data.errors ? data.errors.join(", ") : "Failed to submit request"
				);
				setShowErrorModal(true);
			}
		} catch (error) {
			console.error("Error submitting request:", error);
			console.error("Error details:", {
				name: error.name,
				message: error.message,
				stack: error.stack,
			});
			setErrorMessage(`Failed to submit request: ${error.message}`);
			setShowErrorModal(true);
		} finally {
			setSubmitting(false);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setRequestForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleWhitelistInputChange = (e) => {
		const { name, value } = e.target;
		setWhitelistForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleWhitelistSubmit = async (e) => {
		e.preventDefault();
		setSubmittingWhitelist(true);

		try {
			// This would typically send to your backend
			// console.log("Whitelist request submitted:", {
			// 	...whitelistForm,
			// 	deviceHash: deviceInfo.hash,
			// 	userAgent: deviceInfo.userAgent,
			// });

			// For now, just show success message
			setSuccessMessage("Whitelist request submitted successfully!");
			setShowSuccessModal(true);
			setShowWhitelistModal(false);
			setWhitelistForm({
				name: "",
				device: "",
			});
		} catch (error) {
			console.error("Error submitting whitelist request:", error);
			setErrorMessage("Failed to submit whitelist request. Please try again.");
			setShowErrorModal(true);
		} finally {
			setSubmittingWhitelist(false);
		}
	};

	const copyToClipboard = async (text, field) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(field);
			setTimeout(() => setCopied(""), 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};

	const getStatusColor = (isInternal) => {
		return isInternal
			? "bg-red-100 text-red-800 border-red-200"
			: "bg-green-100 text-green-800 border-green-200";
	};

	const getStatusText = (isInternal) => {
		return isInternal ? "Internal User (Excluded)" : "External User (Tracked)";
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
					<p className="mt-4 text-gray-500 text-sm">
						Loading device information...
					</p>
				</div>
			</div>
		);
	}

	if (!deviceInfo) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-4xl mb-4">⚠️</div>
					<h2 className="text-xl font-semibold text-gray-800 mb-2">
						Device Information Unavailable
					</h2>
					<p className="text-gray-500 text-sm">
						Unable to retrieve device fingerprint information.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white flex flex-col">
			{/* Header */}
			<TopNavBarMinimal />

			{/* Main Content */}
			<div className="flex-grow py-12">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Page Header */}
					<div className="text-center mb-12">
						<h1 className="text-2xl font-semibold text-gray-900 mb-3">
							Device Fingerprint
						</h1>
						<p className="text-gray-500 text-sm max-w-md mx-auto">
							Your device's unique identifier and tracking status
						</p>
					</div>

					{/* Main Status Card */}
					<div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 mb-8">
						<div className="flex items-center justify-between mb-6">
							<div>
								<h2 className="text-lg font-medium text-gray-900 mb-1">
									Tracking Status
								</h2>
								<p className="text-gray-500 text-sm">
									Current analytics tracking status
								</p>
							</div>
							<div
								className={`px-4 py-2 rounded-full border text-sm font-medium ${getStatusColor(
									deviceInfo.isInternal
								)}`}
							>
								{getStatusText(deviceInfo.isInternal)}
							</div>
						</div>

						{/* Request Status */}
						{requestStatus && requestStatus.status !== "none" ? (
							<div className="bg-white rounded-xl p-4 border border-gray-200">
								<div className="flex items-center justify-between mb-3">
									<span className="text-sm font-medium text-gray-700">
										Request Status
									</span>
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium ${
											requestStatus.status === "approved"
												? "bg-green-100 text-green-700"
												: requestStatus.status === "pending"
												? "bg-yellow-100 text-yellow-700"
												: requestStatus.status === "rejected"
												? "bg-red-100 text-red-700"
												: "bg-gray-100 text-gray-700"
										}`}
									>
										{requestStatus.status.charAt(0).toUpperCase() +
											requestStatus.status.slice(1)}
									</span>
								</div>
								<p className="text-sm text-gray-600">{requestStatus.message}</p>
								{requestStatus.created_at && (
									<p className="text-xs text-gray-500 mt-2">
										Submitted:{" "}
										{new Date(requestStatus.created_at).toLocaleDateString()}
									</p>
								)}
							</div>
						) : (
							<div className="bg-white rounded-xl p-4 border border-gray-200">
								<p className="text-sm text-gray-600">
									No exclusion request submitted
								</p>
							</div>
						)}
					</div>

					{/* Request Form */}
					{(!requestStatus || requestStatus.status === "none") && (
						<div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8 mb-8">
							<div className="text-center mb-6">
								<div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
									<svg
										className="w-6 h-6 text-yellow-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/>
									</svg>
								</div>
								<h2 className="text-lg font-medium text-gray-900 mb-2">
									Request Device Exclusion
								</h2>
								<p className="text-gray-600 text-sm">
									Are you an internal user? Request to be excluded from
									analytics tracking.
								</p>
							</div>

							{!showRequestForm ? (
								<div className="text-center">
									<button
										onClick={() => setShowRequestForm(true)}
										className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200"
									>
										<svg
											className="h-4 w-4 mr-2"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 6v6m0 0v6m0-6h6m-6 0H6"
											/>
										</svg>
										Request Exclusion
									</button>
								</div>
							) : (
								<form onSubmit={handleSubmitRequest} className="space-y-4">
									<div>
										<label
											htmlFor="requesterName"
											className="block text-sm font-medium text-gray-700 mb-2"
										>
											Full Name *
										</label>
										<input
											type="text"
											id="requesterName"
											name="requesterName"
											value={requestForm.requesterName}
											onChange={handleInputChange}
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
											placeholder="e.g., Victor Kirui"
										/>
									</div>

									<div>
										<label
											htmlFor="deviceDescription"
											className="block text-sm font-medium text-gray-700 mb-2"
										>
											Device Description *
										</label>
										<input
											type="text"
											id="deviceDescription"
											name="deviceDescription"
											value={requestForm.deviceDescription}
											onChange={handleInputChange}
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
											placeholder="e.g., Company Laptop, iPhone 12"
										/>
									</div>

									<div className="flex justify-end space-x-3 pt-4">
										<button
											type="button"
											onClick={() => setShowRequestForm(false)}
											className="px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
										>
											Cancel
										</button>
										<button
											type="submit"
											disabled={submitting}
											className="px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
										>
											{submitting ? "Submitting..." : "Submit Request"}
										</button>
									</div>
								</form>
							)}
						</div>
					)}

					{/* Device Information */}
					<div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8">
						<h2 className="text-lg font-medium text-gray-900 mb-6">
							Device Information
						</h2>

						<div className="overflow-x-auto">
							<table className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
											Property
										</th>
										<th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
											Value
										</th>
										<th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200 w-20">
											Action
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									<tr>
										<td className="px-6 py-4 text-sm font-medium text-gray-700">
											Device Hash
										</td>
										<td className="px-6 py-4">
											<code className="text-xs text-gray-800 break-all font-mono bg-gray-50 px-2 py-1 rounded">
												{deviceInfo.hash}
											</code>
										</td>
										<td className="px-6 py-4">
											<button
												onClick={() => copyToClipboard(deviceInfo.hash, "hash")}
												className="text-yellow-600 hover:text-yellow-700 text-xs font-medium"
											>
												{copied === "hash" ? "Copied!" : "Copy"}
											</button>
										</td>
									</tr>
									<tr>
										<td className="px-6 py-4 text-sm font-medium text-gray-700">
											User Agent
										</td>
										<td className="px-6 py-4">
											<code className="text-xs text-gray-800 break-all font-mono bg-gray-50 px-2 py-1 rounded">
												{deviceInfo.userAgent}
											</code>
										</td>
										<td className="px-6 py-4">
											<button
												onClick={() =>
													copyToClipboard(deviceInfo.userAgent, "userAgent")
												}
												className="text-yellow-600 hover:text-yellow-700 text-xs font-medium"
											>
												{copied === "userAgent" ? "Copied!" : "Copy"}
											</button>
										</td>
									</tr>
									<tr>
										<td className="px-6 py-4 text-sm font-medium text-gray-700">
											Screen Resolution
										</td>
										<td className="px-6 py-4 text-sm text-gray-900">
											{deviceInfo.screenResolution}
										</td>
										<td className="px-6 py-4">
											<span className="text-xs text-gray-500">-</span>
										</td>
									</tr>
									<tr>
										<td className="px-6 py-4 text-sm font-medium text-gray-700">
											Platform
										</td>
										<td className="px-6 py-4 text-sm text-gray-900">
											{deviceInfo.platform}
										</td>
										<td className="px-6 py-4">
											<span className="text-xs text-gray-500">-</span>
										</td>
									</tr>
									<tr>
										<td className="px-6 py-4 text-sm font-medium text-gray-700">
											Language
										</td>
										<td className="px-6 py-4 text-sm text-gray-900">
											{deviceInfo.language}
										</td>
										<td className="px-6 py-4">
											<span className="text-xs text-gray-500">-</span>
										</td>
									</tr>
									<tr>
										<td className="px-6 py-4 text-sm font-medium text-gray-700">
											Timezone
										</td>
										<td className="px-6 py-4 text-sm text-gray-900">
											{deviceInfo.timezone}
										</td>
										<td className="px-6 py-4">
											<span className="text-xs text-gray-500">-</span>
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						{/* Action Buttons */}
						<div className="flex justify-center space-x-4 mt-8 pt-6 border-t border-gray-200">
							<button
								onClick={() => {
									if (deviceInfo?.hash) {
										checkExistingRequest(deviceInfo.hash);
									}
								}}
								disabled={refreshing}
								className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<svg
									className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									/>
								</svg>
								{refreshing ? "Refreshing..." : "Refresh"}
							</button>
							<button
								onClick={() =>
									copyToClipboard(JSON.stringify(deviceInfo, null, 2), "all")
								}
								className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
							>
								<svg
									className="h-4 w-4 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
									/>
								</svg>
								{copied === "all" ? "Copied!" : "Copy All Data"}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<Footer />

			{/* Whitelist Request Modal */}
			{showWhitelistModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
					<div className="relative w-full max-w-md transform transition-all">
						<div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
							{/* Header */}
							<div className="bg-gradient-to-r from-gray-800 to-black px-6 py-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<div className="flex-shrink-0">
											<svg
												className="h-8 w-8 text-yellow-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</div>
										<div className="ml-3">
											<h3 className="text-lg font-semibold text-white">
												Request Device Whitelist
											</h3>
											<p className="text-gray-300 text-sm">
												Exclude your device from tracking
											</p>
										</div>
									</div>
									<button
										onClick={() => setShowWhitelistModal(false)}
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
								<form onSubmit={handleWhitelistSubmit} className="space-y-6">
									<div>
										<label
											htmlFor="name"
											className="block text-sm font-semibold text-gray-700 mb-2"
										>
											Full Name *
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<svg
													className="h-5 w-5 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
													/>
												</svg>
											</div>
											<input
												type="text"
												id="name"
												name="name"
												value={whitelistForm.name}
												onChange={handleWhitelistInputChange}
												required
												className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
												placeholder="e.g., Victor Kirui"
											/>
										</div>
									</div>

									<div>
										<label
											htmlFor="device"
											className="block text-sm font-semibold text-gray-700 mb-2"
										>
											Device Type *
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<svg
													className="h-5 w-5 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
													/>
												</svg>
											</div>
											<select
												id="device"
												name="device"
												value={whitelistForm.device}
												onChange={handleWhitelistInputChange}
												required
												className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 appearance-none bg-white"
											>
												<option value="">Select device type</option>
												<option value="Laptop">Laptop</option>
												<option value="Desktop">Desktop</option>
												<option value="Phone">Phone</option>
												<option value="Tablet">Tablet</option>
												<option value="Workstation">Workstation</option>
												<option value="Server">Server</option>
												<option value="Other">Other</option>
											</select>
											<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
												<svg
													className="h-5 w-5 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</div>
										</div>
									</div>

									<div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
										<div className="flex items-start">
											<div className="flex-shrink-0">
												<svg
													className="h-5 w-5 text-yellow-600"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
											</div>
											<div className="ml-3">
												<p className="text-sm font-medium text-yellow-800">
													Device Hash
												</p>
												<p className="text-xs text-yellow-600 mt-1 break-all">
													{deviceInfo?.hash}
												</p>
												<p className="text-xs text-yellow-600 mt-1">
													This will be automatically included with your request.
												</p>
											</div>
										</div>
									</div>

									<div className="flex justify-end space-x-3 pt-4">
										<button
											type="button"
											onClick={() => setShowWhitelistModal(false)}
											className="px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
										>
											Cancel
										</button>
										<button
											type="submit"
											disabled={submittingWhitelist}
											className="px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
										>
											{submittingWhitelist ? (
												<div className="flex items-center">
													<svg
														className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
													>
														<circle
															className="opacity-25"
															cx="12"
															cy="12"
															r="10"
															stroke="currentColor"
															strokeWidth="4"
														></circle>
														<path
															className="opacity-75"
															fill="currentColor"
															d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
														></path>
													</svg>
													Submitting...
												</div>
											) : (
												"Submit Request"
											)}
										</button>
									</div>
								</form>
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
							<div className="bg-gradient-to-r from-gray-800 to-black px-6 py-6 text-center">
								<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-400 bg-opacity-20 mb-4">
									<svg
										className="h-8 w-8 text-yellow-400"
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
								<p className="text-gray-300 mt-1">
									Your request has been submitted
								</p>
							</div>

							{/* Content */}
							<div className="px-6 py-6 text-center">
								<div className="mb-6">
									<p className="text-gray-600">{successMessage}</p>
								</div>
								<button
									onClick={() => setShowSuccessModal(false)}
									className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-base font-semibold rounded-xl shadow-lg hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 transform transition-all duration-200 hover:scale-105"
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
							<div className="bg-gradient-to-r from-gray-800 to-black px-6 py-6 text-center">
								<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500 bg-opacity-20 mb-4">
									<svg
										className="h-8 w-8 text-red-500"
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
								<h3 className="text-xl font-bold text-white">Oops!</h3>
								<p className="text-gray-300 mt-1">Something went wrong</p>
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

export default DeviceFingerprint;
