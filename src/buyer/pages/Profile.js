import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import LocationSelector from "../../components/LocationSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faEnvelope,
	faPhone,
	faMapMarkerAlt,
	faCalendarAlt,
	faEdit,
	faSave,
	faTimes,
	faKey,
	faTrash,
	faCamera,
} from "@fortawesome/free-solid-svg-icons";

import AlertModal from "../../components/AlertModal";
import useSEO from "../../hooks/useSEO";

const ProfilePage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [profile, setProfile] = useState({
		fullname: "",
		username: "",
		email: "",
		phone_number: "",
		zipcode: "",
		gender: "",
		location: "",
		city: "",
		county_id: "",
		sub_county_id: "",
		age_group_id: "",
		income_id: "",
		employment_id: "",
		education_id: "",
		sector_id: "",
		created_at: null,
		updated_at: null,
	});

	const [editMode, setEditMode] = useState(searchParams.get("edit") === "true");
	const [showChangePasswordModal, setShowChangePasswordModal] = useState(false); // State for modal visibility
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
	const [uploadingImage, setUploadingImage] = useState(false);
	const [ageGroups, setAgeGroups] = useState([]);
	const [incomes, setIncomes] = useState([]);
	const [employments, setEmployments] = useState([]);
	const [educations, setEducations] = useState([]);
	const [sectors, setSectors] = useState([]);
	const [counties, setCounties] = useState([]);
	const [subCounties, setSubCounties] = useState([]);
	const [originalProfile, setOriginalProfile] = useState({});

	// Profile completion percentage comes from backend
	const profileCompletion = profile.profile_completion_percentage || 0;

	// Retrieve token from sessionStorage
	const token = localStorage.getItem("token"); // Adjust the key to match your app

	// SEO Implementation - Private user data, should not be indexed
	useSEO({
		title: "My Profile Dashboard - Manage Account Settings | Carbon Cube Kenya",
		description:
			"Access and manage your personal profile information, account settings, and preferences on Carbon Cube Kenya. Update your contact details, shipping address, and account security settings in your secure buyer dashboard.",
		keywords: "profile, account settings, Carbon Cube Kenya",
		url: `${window.location.origin}/profile`,
		customMetaTags: [
			{ name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
			{ name: "googlebot", content: "noindex, nofollow" },
			{ name: "bingbot", content: "noindex, nofollow" },
			{ property: "og:robots", content: "noindex, nofollow" },
		],
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "My Profile - Carbon Cube Kenya",
			description: "Private user profile page",
			url: `${window.location.origin}/profile`,
			isPartOf: {
				"@type": "WebSite",
				name: "Carbon Cube Kenya",
				url: "https://carboncube.co.ke",
			},
		},
	});

	// Fetch all optional data
	useEffect(() => {
		const fetchOptionalData = async () => {
			try {
				const [
					ageGroupsRes,
					incomesRes,
					employmentsRes,
					educationsRes,
					sectorsRes,
					countiesRes,
				] = await Promise.all([
					axios.get(`${process.env.REACT_APP_BACKEND_URL}/age_groups`),
					axios.get(`${process.env.REACT_APP_BACKEND_URL}/incomes`),
					axios.get(`${process.env.REACT_APP_BACKEND_URL}/employments`),
					axios.get(`${process.env.REACT_APP_BACKEND_URL}/educations`),
					axios.get(`${process.env.REACT_APP_BACKEND_URL}/sectors`),
					axios.get(`${process.env.REACT_APP_BACKEND_URL}/counties`),
				]);

				setAgeGroups(ageGroupsRes.data);
				setIncomes(incomesRes.data);
				setEmployments(employmentsRes.data);
				setEducations(educationsRes.data);
				setSectors(sectorsRes.data);
				setCounties(countiesRes.data);
			} catch (error) {
			}
		};

		fetchOptionalData();
	}, []);

	// Fetch profile data from the backend API
	useEffect(() => {
		if (!token) {
			return;
		}

		axios
			.get(`${process.env.REACT_APP_BACKEND_URL}/buyer/profile`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setProfile(response.data);
				setOriginalProfile({ ...response.data });
			})
			.catch((error) => {
				if (error.response.status === 401) {
				}
			});
	}, [token]);

	// Fetch sub-counties when county changes
	useEffect(() => {
		const fetchSubCounties = async () => {
			if (profile.county_id) {
				try {
					const response = await axios.get(
						`${process.env.REACT_APP_BACKEND_URL}/counties/${profile.county_id}/sub_counties`
					);
					setSubCounties(response.data);
				} catch (error) {
					setSubCounties([]);
				}
			} else {
				setSubCounties([]);
			}
		};

		fetchSubCounties();
	}, [profile.county_id]);

	// Handle input change for editing the profile
	const handleChange = (e) => {
		const { name, value } = e.target;
		setProfile({
			...profile,
			[name]: value,
		});

		// Reset sub-county when county changes
		if (name === "county_id") {
			setProfile((prev) => ({
				...prev,
				sub_county_id: "",
			}));
		}
	};

	// Toggle edit mode
	const handleEditClick = () => {
		const newEditMode = !editMode;
		setEditMode(newEditMode);

		// Update URL parameters
		if (newEditMode) {
			setSearchParams({ edit: "true" });
		} else {
			setSearchParams({});
		}
	};

	// Handle form submission to save updated profile
	const handleSaveClick = () => {
		if (!token) {
			return;
		}

		// Only send changed fields
		const changedFields = {};
		Object.keys(profile).forEach((key) => {
			if (profile[key] !== originalProfile[key]) {
				changedFields[key] = profile[key];
			}
		});

		// Don't send if no changes
		if (Object.keys(changedFields).length === 0) {
			setEditMode(false);
			setSearchParams({});
			return;
		}

		axios
			.patch(
				`${process.env.REACT_APP_BACKEND_URL}/buyer/profile`,
				changedFields,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				setProfile(response.data);
				setOriginalProfile({ ...response.data });
				setEditMode(false);
				setSearchParams({}); // Remove edit parameter from URL
				// Show success message using AlertModal
				setAlertModalMessage("Profile updated successfully!");
				setAlertModalConfig({
					icon: "success",
					title: "Success",
					confirmText: "OK",
					cancelText: "",
					showCancel: false,
					onConfirm: () => setShowAlertModal(false),
				});
				setShowAlertModal(true);
			})
			.catch((error) => {
				if (error.response) {
					// Server responded with error status
					setAlertModalMessage(
						`Error: ${error.response.data.error || "Failed to update profile"}`
					);
				} else {
					// Network or other error
					setAlertModalMessage(
						"Network error. Please check your connection and try again."
					);
				}
				setAlertModalConfig({
					icon: "error",
					title: "Error",
					confirmText: "OK",
					cancelText: "",
					showCancel: false,
					onConfirm: () => setShowAlertModal(false),
				});
				setShowAlertModal(true);
			});
	};

	const handleConfirmPasswordChange = (e) => {
		const { value } = e.target;
		setPasswordData({ ...passwordData, confirmPassword: value });

		// Check if newPassword matches confirmPassword in real time
		if (passwordData.newPassword !== value) {
			setPasswordMatch(false);
		} else {
			setPasswordMatch(true);
		}
	};

	// Handle Change Password
	const handlePasswordChange = () => {
		// Check if the new password matches the confirm password
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			alert("New password and confirm password do not match.");
			return;
		}

		// Proceed with the rest of the password change logic
		axios
			.post(
				`${process.env.REACT_APP_BACKEND_URL}/buyer/profile/change-password`,
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
			)
			.then((response) => {
				alert("Password changed successfully. Please log in again.");
				toggleChangePasswordModal();
				localStorage.removeItem("token"); // Clear token to force login
				window.location.href = "/login"; // Redirect to login page
			})
			.catch((error) => {
				if (error.response && error.response.status === 401) {
					alert("Current password is incorrect.");
				} else {
					alert("Error changing password.");
				}
			});
	};

	const handleDeleteAccount = () => {
		setAlertModalMessage(
			"Are you sure you want to delete your account? This action cannot be undone."
		);

		setAlertModalConfig({
			icon: "warning",
			title: "Delete Account",
			confirmText: "Yes, Delete",
			cancelText: "Cancel",
			showCancel: true,
			onConfirm: async () => {
				try {
					await axios.delete(
						`${process.env.REACT_APP_BACKEND_URL}/buyer/delete_account`,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);

					setAlertModalMessage("Your account has been deleted.");
					setAlertModalConfig({
						icon: "success",
						title: "Deleted",
						confirmText: "OK",
						cancelText: "",
						showCancel: false,
						onConfirm: () => {
							localStorage.removeItem("token");
							window.location.href = "/login";
						},
					});
					setShowAlertModal(true);
				} catch (error) {
					setAlertModalMessage(
						"Failed to delete your account. Please try again."
					);
					setAlertModalConfig({
						icon: "error",
						title: "Error",
						confirmText: "OK",
						cancelText: "",
						showCancel: false,
						onConfirm: () => setShowAlertModal(false),
					});
					setShowAlertModal(true);
				}
			},
		});

		setShowAlertModal(true);
	};

	// Handle profile picture upload
	const handleImageUpload = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		// Validate file type
		const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
		if (!allowedTypes.includes(file.type)) {
			setAlertModalMessage(
				"Please select a valid image file (JPEG, PNG, or WebP)."
			);
			setAlertModalConfig({
				icon: "error",
				title: "Invalid File Type",
				confirmText: "OK",
				cancelText: "",
				showCancel: false,
				onConfirm: () => setShowAlertModal(false),
			});
			setShowAlertModal(true);
			return;
		}

		// Validate file size (2MB max)
		if (file.size > 2 * 1024 * 1024) {
			setAlertModalMessage("Image size must be less than 2MB.");
			setAlertModalConfig({
				icon: "error",
				title: "File Too Large",
				confirmText: "OK",
				cancelText: "",
				showCancel: false,
				onConfirm: () => setShowAlertModal(false),
			});
			setShowAlertModal(true);
			return;
		}

		setUploadingImage(true);

		try {
			const formData = new FormData();
			formData.append("profile_picture", file);

			const response = await axios.patch(
				`${process.env.REACT_APP_BACKEND_URL}/buyer/profile`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			setProfile(response.data);
			setOriginalProfile({ ...response.data });
			setAlertModalMessage("Profile picture updated successfully!");
			setAlertModalConfig({
				icon: "success",
				title: "Success",
				confirmText: "OK",
				cancelText: "",
				showCancel: false,
				onConfirm: () => setShowAlertModal(false),
			});
			setShowAlertModal(true);
		} catch (error) {
			setAlertModalMessage(
				error.response?.data?.error ||
					"Failed to upload profile picture. Please try again."
			);
			setAlertModalConfig({
				icon: "error",
				title: "Upload Failed",
				confirmText: "OK",
				cancelText: "",
				showCancel: false,
				onConfirm: () => setShowAlertModal(false),
			});
			setShowAlertModal(true);
		} finally {
			setUploadingImage(false);
		}
	};

	// Toggle Modal
	const toggleChangePasswordModal = () =>
		setShowChangePasswordModal(!showChangePasswordModal);

	return (
		<>
			<Navbar mode="buyer" showSearch={false} showCategories={false} />
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
					{/* Header Section */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
							<div className="flex items-center space-x-4 mb-4 sm:mb-0">
								<div className="relative">
									{profile.profile_picture ? (
										<>
											<img
												src={profile.profile_picture}
												alt="Profile"
												className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200"
												onError={(e) => {
													// Hide image and show fallback
													e.target.style.display = "none";
													const fallback = e.target.nextElementSibling;
													if (fallback) {
														fallback.style.display = "flex";
													}
												}}
											/>
											<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-300 border-2 border-gray-200 items-center justify-center hidden">
												<span className="text-gray-600 font-semibold text-lg sm:text-xl">
													{profile.fullname
														? profile.fullname
																.split(" ")
																.map((n) => n[0])
																.join("")
																.toUpperCase()
														: "U"}
												</span>
											</div>
										</>
									) : (
										<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center">
											<span className="text-gray-600 font-semibold text-lg sm:text-xl">
												{profile.fullname
													? profile.fullname
															.split(" ")
															.map((n) => n[0])
															.join("")
															.toUpperCase()
															.slice(0, 2)
													: profile.username
													? profile.username.slice(0, 2).toUpperCase()
													: "U"}
											</span>
										</div>
									)}
									<label className="absolute -bottom-0.5 -right-0.5 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-yellow-600 transition-colors shadow-sm border-2 border-white cursor-pointer">
										<FontAwesomeIcon icon={faCamera} className="w-2.5 h-2.5" />
										<input
											type="file"
											accept="image/*"
											onChange={handleImageUpload}
											className="hidden"
											disabled={uploadingImage}
										/>
									</label>
								</div>
								<div>
									<h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
										Welcome, {profile.fullname || "User"}
									</h1>
									<p className="text-sm text-gray-500">@{profile.username}</p>
									<p className="text-xs text-gray-400">
										{new Date().toLocaleDateString()}
									</p>
								</div>
							</div>
							<div className="flex space-x-2">
								<button
									onClick={handleEditClick}
									className={`px-4 py-2 rounded-lg font-medium transition-colors ${
										editMode
											? "bg-gray-500 text-white hover:bg-gray-600"
											: "bg-yellow-500 text-black hover:bg-yellow-600"
									}`}
								>
									<FontAwesomeIcon
										icon={editMode ? faTimes : faEdit}
										className="mr-2"
									/>
									{editMode ? "Cancel" : "Edit Profile"}
								</button>
								{editMode && (
									<button
										onClick={handleSaveClick}
										className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
									>
										<FontAwesomeIcon icon={faSave} className="mr-2" />
										Save Changes
									</button>
								)}
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Personal Information */}
						<div className="lg:col-span-2">
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
								<div className="flex items-center mb-4">
									<FontAwesomeIcon
										icon={faUser}
										className="w-5 h-5 text-gray-500 mr-2"
									/>
									<h2 className="text-lg font-semibold text-gray-900">
										Personal Information
									</h2>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Full Name
										</label>
										<input
											type="text"
											name="fullname"
											value={profile.fullname}
											onChange={handleChange}
											disabled={!editMode}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Username
										</label>
										<input
											type="text"
											name="username"
											value={profile.username}
											onChange={handleChange}
											disabled={!editMode}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Gender
										</label>
										{editMode ? (
											<select
												name="gender"
												value={profile.gender}
												onChange={handleChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
											>
												<option value="">Select Gender</option>
												<option value="Male">Male</option>
												<option value="Female">Female</option>
												<option value="Other">Other</option>
											</select>
										) : (
											<div className="w-full px-3 py-2 bg-gray-100 text-gray-500 rounded-lg">
												{profile.gender || "Not provided"}
											</div>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Age Group (Optional)
										</label>
										{editMode ? (
											<select
												name="age_group_id"
												value={profile.age_group_id}
												onChange={handleChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
											>
												<option value="">Select Age Group</option>
												{ageGroups.map((group) => (
													<option key={group.id} value={group.id}>
														{group.name}
													</option>
												))}
											</select>
										) : (
											<div className="w-full px-3 py-2 bg-gray-100 text-gray-500 rounded-lg">
												{profile.age_group_id
													? ageGroups.find((g) => g.id === profile.age_group_id)
															?.name || "Not provided"
													: "Not provided"}
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Contact Information */}
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<div className="flex items-center mb-4">
									<FontAwesomeIcon
										icon={faEnvelope}
										className="w-5 h-5 text-gray-500 mr-2"
									/>
									<h2 className="text-lg font-semibold text-gray-900">
										Contact Information
									</h2>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Email Address
										</label>
										<input
											type="email"
											name="email"
											value={profile.email}
											onChange={handleChange}
											disabled={!editMode}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Phone Number
										</label>
										<input
											type="tel"
											name="phone_number"
											value={profile.phone_number}
											onChange={handleChange}
											disabled={!editMode}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											County (Optional)
										</label>
										{editMode ? (
											<select
												name="county_id"
												value={profile.county_id || ""}
												onChange={handleChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
											>
												<option value="">Select County</option>
												{counties.map((county) => (
													<option key={county.id} value={county.id}>
														{county.name}
													</option>
												))}
											</select>
										) : (
											<div className="w-full px-3 py-2 bg-gray-100 text-gray-500 rounded-lg">
												{profile.county_id
													? counties.find((c) => c.id === profile.county_id)
															?.name || "Not provided"
													: "Not provided"}
											</div>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Sub-County (Optional)
										</label>
										{editMode ? (
											<select
												name="sub_county_id"
												value={profile.sub_county_id || ""}
												onChange={handleChange}
												disabled={!profile.county_id}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100"
											>
												<option value="">
													{!profile.county_id
														? "Select County First"
														: "Select Sub-County"}
												</option>
												{subCounties.map((subCounty) => (
													<option key={subCounty.id} value={subCounty.id}>
														{subCounty.name}
													</option>
												))}
											</select>
										) : (
											<div className="w-full px-3 py-2 bg-gray-100 text-gray-500 rounded-lg">
												{profile.sub_county_id
													? subCounties.find(
															(sc) => sc.id === profile.sub_county_id
													  )?.name || "Not provided"
													: "Not provided"}
											</div>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Physical Address
										</label>
										{editMode ? (
											<input
												type="text"
												name="location"
												value={profile.location || ""}
												onChange={handleChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
											/>
										) : (
											<div className="w-full px-3 py-2 bg-gray-100 text-gray-500 rounded-lg">
												{profile.location || "Not provided"}
											</div>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											City
										</label>
										{editMode ? (
											<input
												type="text"
												name="city"
												value={profile.city || ""}
												onChange={handleChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
											/>
										) : (
											<div className="w-full px-3 py-2 bg-gray-100 text-gray-500 rounded-lg">
												{profile.city || "Not provided"}
											</div>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Zip Code (Optional)
										</label>
										{editMode ? (
											<input
												type="text"
												name="zipcode"
												value={profile.zipcode || ""}
												onChange={handleChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
											/>
										) : (
											<div className="w-full px-3 py-2 bg-gray-100 text-gray-500 rounded-lg">
												{profile.zipcode || "Not provided"}
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Optional Information */}
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<div className="flex items-center mb-4">
									<FontAwesomeIcon
										icon={faUser}
										className="w-5 h-5 text-gray-500 mr-2"
									/>
									<h2 className="text-lg font-semibold text-gray-900">
										Optional Information
									</h2>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Income Range (Optional)
										</label>
										{editMode ? (
											<select
												name="income_id"
												value={profile.income_id}
												onChange={handleChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
											>
												<option value="">Select Income Range</option>
												{incomes.map((income) => (
													<option key={income.id} value={income.id}>
														{income.range}
													</option>
												))}
											</select>
										) : (
											<div className="w-full px-3 py-2 bg-gray-100 text-gray-500 rounded-lg">
												{profile.income_id
													? incomes.find((i) => i.id === profile.income_id)
															?.range || "Not provided"
													: "Not provided"}
											</div>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Employment Status (Optional)
										</label>
										{editMode ? (
											<select
												name="employment_id"
												value={profile.employment_id}
												onChange={handleChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
											>
												<option value="">Select Employment Status</option>
												{employments.map((employment) => (
													<option key={employment.id} value={employment.id}>
														{employment.status}
													</option>
												))}
											</select>
										) : (
											<div className="w-full px-3 py-2 bg-gray-100 text-gray-500 rounded-lg">
												{profile.employment_id
													? employments.find(
															(e) => e.id === profile.employment_id
													  )?.status || "Not provided"
													: "Not provided"}
											</div>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Education Level (Optional)
										</label>
										{editMode ? (
											<select
												name="education_id"
												value={profile.education_id}
												onChange={handleChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
											>
												<option value="">Select Education Level</option>
												{educations.map((education) => (
													<option key={education.id} value={education.id}>
														{education.level}
													</option>
												))}
											</select>
										) : (
											<div className="w-full px-3 py-2 bg-gray-100 text-gray-500 rounded-lg">
												{profile.education_id
													? educations.find(
															(e) => e.id === profile.education_id
													  )?.level || "Not provided"
													: "Not provided"}
											</div>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Business Sector (Optional)
										</label>
										{editMode ? (
											<select
												name="sector_id"
												value={profile.sector_id}
												onChange={handleChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
											>
												<option value="">Select Business Sector</option>
												{sectors.map((sector) => (
													<option key={sector.id} value={sector.id}>
														{sector.name}
													</option>
												))}
											</select>
										) : (
											<div className="w-full px-3 py-2 bg-gray-100 text-gray-500 rounded-lg">
												{profile.sector_id
													? sectors.find((s) => s.id === profile.sector_id)
															?.name || "Not provided"
													: "Not provided"}
											</div>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* Account Actions */}
						<div className="lg:col-span-1">
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
								<h2 className="text-lg font-semibold text-gray-900 mb-4">
									Account Actions
								</h2>
								<div className="space-y-3">
									<button
										onClick={toggleChangePasswordModal}
										className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
									>
										<FontAwesomeIcon icon={faKey} className="mr-2" />
										Change Password
									</button>
									<button
										onClick={handleDeleteAccount}
										className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
									>
										<FontAwesomeIcon icon={faTrash} className="mr-2" />
										Delete Account
									</button>
								</div>
							</div>

							{/* Account Stats */}
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<h2 className="text-lg font-semibold text-gray-900 mb-4">
									Account Statistics
								</h2>

								{/* Profile Completion */}
								<div className="mb-4">
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm text-gray-600">
											Profile Completion
										</span>
										<span className="text-sm font-medium text-gray-900">
											{profileCompletion}%
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className={`h-2 rounded-full transition-all duration-300 ${
												profileCompletion >= 80
													? "bg-green-500"
													: profileCompletion >= 60
													? "bg-yellow-500"
													: "bg-red-500"
											}`}
											style={{ width: `${profileCompletion}%` }}
										></div>
									</div>
								</div>

								<div className="space-y-3">
									<div className="flex justify-between items-center">
										<span className="text-sm text-gray-600">Member Since</span>
										<span className="text-sm font-medium text-gray-900">
											{profile.created_at
												? new Date(profile.created_at)
														.toLocaleDateString("en-GB", {
															day: "numeric",
															month: "long",
															year: "numeric",
														})
														.replace(/(\d+)/, (match) => {
															const day = parseInt(match);
															const suffix =
																day === 1 || day === 21 || day === 31
																	? "st"
																	: day === 2 || day === 22
																	? "nd"
																	: day === 3 || day === 23
																	? "rd"
																	: "th";
															return day + suffix;
														})
												: "N/A"}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-sm text-gray-600">Last Updated</span>
										<span className="text-sm font-medium text-gray-900">
											{profile.updated_at
												? new Date(profile.updated_at)
														.toLocaleDateString("en-GB", {
															day: "numeric",
															month: "long",
															year: "numeric",
														})
														.replace(/(\d+)/, (match) => {
															const day = parseInt(match);
															const suffix =
																day === 1 || day === 21 || day === 31
																	? "st"
																	: day === 2 || day === 22
																	? "nd"
																	: day === 3 || day === 23
																	? "rd"
																	: "th";
															return day + suffix;
														})
												: "N/A"}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-sm text-gray-600">
											Profile Status
										</span>
										<span className="text-sm font-medium text-green-600">
											Active
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-sm text-gray-600">Account Type</span>
										<span className="text-sm font-medium text-gray-900">
											Buyer
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<AlertModal
						isVisible={showAlertModal}
						message={alertModalMessage}
						onClose={() => setShowAlertModal(false)}
						icon={alertModalConfig.icon}
						title={alertModalConfig.title}
						confirmText={alertModalConfig.confirmText}
						cancelText={alertModalConfig.cancelText}
						showCancel={alertModalConfig.showCancel}
						onConfirm={alertModalConfig.onConfirm}
					/>
				</div>

				{/* Change Password Modal */}
				{showChangePasswordModal && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
						<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">
									Change Password
								</h3>
								<button
									onClick={toggleChangePasswordModal}
									className="text-gray-400 hover:text-gray-600"
								>
									<FontAwesomeIcon icon={faTimes} />
								</button>
							</div>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
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
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
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
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Confirm New Password
									</label>
									<input
										type="password"
										name="confirmPassword"
										value={passwordData.confirmPassword}
										onChange={handleConfirmPasswordChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
									/>
									{!passwordMatch && (
										<p className="text-red-500 text-sm mt-1">
											New password and confirm password do not match.
										</p>
									)}
								</div>
							</div>
							<div className="flex space-x-3 mt-6">
								<button
									onClick={toggleChangePasswordModal}
									className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
								>
									Cancel
								</button>
								<button
									onClick={handlePasswordChange}
									disabled={!passwordMatch}
									className="flex-1 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
								>
									Save Password
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default ProfilePage;
