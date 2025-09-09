import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../../components/Navbar";
import AlertModal from "../../components/AlertModal";

const AdminProfilePage = () => {
	const [profile, setProfile] = useState({
		fullname: "",
		username: "",
		email: "",
	});

	const [editMode, setEditMode] = useState(false);
	const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [showAlertModal, setShowAlertModal] = useState(false);
	const [alertModalMessage, setAlertModalMessage] = useState("");
	const [alertModalConfig, setAlertModalConfig] = useState({
		icon: "",
		title: "",
		confirmText: "",
		cancelText: "",
		showCancel: false,
		onConfirm: () => {},
	});

	const [passwordMatch, setPasswordMatch] = useState(true);
	const [loading, setLoading] = useState(false);

	// Retrieve token from sessionStorage
	const token = sessionStorage.getItem("token");

	// Fetch profile data from the backend API
	useEffect(() => {
		if (!token) {
			console.error("No auth token found");
			return;
		}

		axios
			.get(`${process.env.REACT_APP_BACKEND_URL}/admin/profile`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setProfile(response.data);
			})
			.catch((error) => {
				console.error("Error fetching profile data:", error);
				if (error.response?.status === 401) {
					console.error("Unauthorized access. Please login again.");
				}
			});
	}, [token]);

	// Handle input change for editing the profile
	const handleChange = (e) => {
		const { name, value } = e.target;
		setProfile((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Handle profile update
	const handleUpdateProfile = async () => {
		setLoading(true);
		try {
			await axios.put(
				`${process.env.REACT_APP_BACKEND_URL}/admin/profile`,
				profile,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setAlertModalMessage("Profile updated successfully!");
			setAlertModalConfig({
				icon: "success",
				title: "Success",
				confirmText: "OK",
				showCancel: false,
				onConfirm: () => setShowAlertModal(false),
			});
			setShowAlertModal(true);
			setEditMode(false);
		} catch (error) {
			setAlertModalMessage(
				error.response?.data?.errors?.join(", ") || "Error updating profile"
			);
			setAlertModalConfig({
				icon: "error",
				title: "Error",
				confirmText: "OK",
				showCancel: false,
				onConfirm: () => setShowAlertModal(false),
			});
			setShowAlertModal(true);
		} finally {
			setLoading(false);
		}
	};

	// Toggle change password modal
	const toggleChangePasswordModal = () => {
		setShowChangePasswordModal(!showChangePasswordModal);
		setPasswordData({
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		});
		setPasswordMatch(true);
	};

	// Handle confirm password change
	const handleConfirmPasswordChange = (e) => {
		const confirmPassword = e.target.value;
		setPasswordData((prev) => ({
			...prev,
			confirmPassword,
		}));

		if (passwordData.newPassword !== confirmPassword) {
			setPasswordMatch(false);
		} else {
			setPasswordMatch(true);
		}
	};

	// Handle Change Password
	const handlePasswordChange = async () => {
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setAlertModalMessage("New password and confirm password do not match.");
			setAlertModalConfig({
				icon: "error",
				title: "Error",
				confirmText: "OK",
				showCancel: false,
				onConfirm: () => setShowAlertModal(false),
			});
			setShowAlertModal(true);
			return;
		}

		setLoading(true);
		try {
			await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/admin/profile/change-password`,
				{
					currentPassword: passwordData.currentPassword,
					newPassword: passwordData.newPassword,
					confirmPassword: passwordData.confirmPassword,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setAlertModalMessage(
				"Password changed successfully. Please log in again."
			);
			setAlertModalConfig({
				icon: "success",
				title: "Success",
				confirmText: "OK",
				showCancel: false,
				onConfirm: () => {
					setShowAlertModal(false);
					toggleChangePasswordModal();
					sessionStorage.removeItem("token");
					window.location.href = "/login";
				},
			});
			setShowAlertModal(true);
		} catch (error) {
			const errorMessage =
				error.response?.status === 401
					? "Current password is incorrect."
					: error.response?.data?.error || "Error changing password.";
			setAlertModalMessage(errorMessage);
			setAlertModalConfig({
				icon: "error",
				title: "Error",
				confirmText: "OK",
				showCancel: false,
				onConfirm: () => setShowAlertModal(false),
			});
			setShowAlertModal(true);
		} finally {
			setLoading(false);
		}
	};

	const handleCloseAlertModal = () => {
		setShowAlertModal(false);
	};

	return (
		<>
			<div className="flex">
				<div className="flex-grow">
					<Navbar />
					<div className="mt-4 max-w-7xl mx-auto px-4">
						<div className="w-full">
							<div className="bg-white shadow-lg rounded-lg overflow-hidden">
								<div className="bg-yellow-500 text-gray-900 px-6 py-4">
									<h4 className="mb-0 font-bold text-lg">Admin Profile</h4>
								</div>
								<div className="p-6">
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
										<div>
											<form>
												<div className="mb-4">
													<label className="block font-semibold text-gray-700 mb-2">
														Full Name
													</label>
													<input
														type="text"
														name="fullname"
														value={profile.fullname}
														onChange={handleChange}
														disabled={!editMode}
														className={`w-full border rounded-lg px-3 py-2 ${
															!editMode ? "bg-gray-100" : "bg-white"
														}`}
													/>
												</div>

												<div className="mb-4">
													<label className="block font-semibold text-gray-700 mb-2">
														Username
													</label>
													<input
														type="text"
														name="username"
														value={profile.username}
														onChange={handleChange}
														disabled={!editMode}
														className={`w-full border rounded-lg px-3 py-2 ${
															!editMode ? "bg-gray-100" : "bg-white"
														}`}
													/>
												</div>

												<div className="mb-4">
													<label className="block font-semibold text-gray-700 mb-2">
														Email
													</label>
													<input
														type="email"
														name="email"
														value={profile.email}
														onChange={handleChange}
														disabled={!editMode}
														className={`w-full border rounded-lg px-3 py-2 ${
															!editMode ? "bg-gray-100" : "bg-white"
														}`}
													/>
												</div>

												{editMode ? (
													<div className="flex gap-3">
														<button
															type="button"
															onClick={handleUpdateProfile}
															disabled={loading}
															className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
														>
															{loading ? "Saving..." : "Save Changes"}
														</button>
														<button
															type="button"
															onClick={() => setEditMode(false)}
															className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
														>
															Cancel
														</button>
													</div>
												) : (
													<button
														type="button"
														onClick={() => setEditMode(true)}
														className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium"
													>
														Edit Profile
													</button>
												)}
											</form>
										</div>

										<div>
											<div className="bg-gray-50 border-0 shadow-sm rounded-lg">
												<div className="p-6">
													<h5 className="font-bold text-gray-800 mb-3">
														Security
													</h5>
													<p className="text-gray-600 mb-4">
														Keep your account secure by regularly updating your
														password.
													</p>
													<button
														type="button"
														onClick={toggleChangePasswordModal}
														className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white px-6 py-2 rounded-lg font-medium transition-colors"
													>
														Change Password
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Change Password Modal */}
					{showChangePasswordModal && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
							<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
								<div className="bg-gray-50 border-b px-6 py-4">
									<h3 className="font-bold text-gray-800 text-lg">
										Change Password
									</h3>
								</div>
								<div className="p-6">
									<form>
										<div className="mb-4">
											<label className="block font-semibold text-gray-700 mb-2">
												Current Password
											</label>
											<input
												type="password"
												name="currentPassword"
												value={passwordData.currentPassword}
												onChange={(e) =>
													setPasswordData({
														...passwordData,
														currentPassword: e.target.value,
													})
												}
												className="w-full border rounded-lg px-3 py-2"
											/>
										</div>
										<div className="mb-4">
											<label className="block font-semibold text-gray-700 mb-2">
												New Password
											</label>
											<input
												type="password"
												name="newPassword"
												value={passwordData.newPassword}
												onChange={(e) =>
													setPasswordData({
														...passwordData,
														newPassword: e.target.value,
													})
												}
												className="w-full border rounded-lg px-3 py-2"
											/>
										</div>
										<div className="mb-4">
											<label className="block font-semibold text-gray-700 mb-2">
												Confirm New Password
											</label>
											<input
												type="password"
												name="confirmPassword"
												value={passwordData.confirmPassword}
												onChange={handleConfirmPasswordChange}
												className="w-full border rounded-lg px-3 py-2"
											/>
											{!passwordMatch && (
												<p className="text-red-500 text-sm mt-1">
													New password and confirm password do not match.
												</p>
											)}
										</div>
									</form>
								</div>
								<div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
									<button
										type="button"
										onClick={toggleChangePasswordModal}
										className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
									>
										Close
									</button>
									<button
										type="button"
										onClick={handlePasswordChange}
										disabled={!passwordMatch || loading}
										className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
									>
										{loading ? "Changing..." : "Save Password"}
									</button>
								</div>
							</div>
						</div>
					)}

					{/* Alert Modal */}
					<AlertModal
						show={showAlertModal}
						onHide={handleCloseAlertModal}
						message={alertModalMessage}
						config={alertModalConfig}
					/>
				</div>
			</div>
		</>
	);
};

export default AdminProfilePage;
