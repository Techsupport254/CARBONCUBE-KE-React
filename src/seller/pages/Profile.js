import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEdit,
	faSave,
	faTimes,
	faEnvelope,
	faPhone,
	faMapMarkerAlt,
	faKey,
	faTrash,
	faCamera,
	faExclamationTriangle,
	faEye,
	faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import Navbar from "../../components/Navbar";
import Spinner from "react-spinkit";
import AlertModal from "../../components/AlertModal";
import useSEO from "../../hooks/useSEO";
import { getBorderColor } from "../../buyer/utils/sellerTierUtils";

const SellerProfile = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	// SEO Implementation - Private user data, should not be indexed
	useSEO({
		title: "Seller Profile - Carbon Cube Kenya",
		description:
			"Manage your seller profile and business information on Carbon Cube Kenya",
		keywords: "seller profile, business profile, Carbon Cube Kenya",
		url: `${window.location.origin}/seller/profile`,
		customMetaTags: [
			{ name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
			{ name: "googlebot", content: "noindex, nofollow" },
			{ name: "bingbot", content: "noindex, nofollow" },
			{ property: "og:robots", content: "noindex, nofollow" },
		],
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "Seller Profile - Carbon Cube Kenya",
			description: "Private seller profile page",
			url: `${window.location.origin}/seller/profile`,
			isPartOf: {
				"@type": "WebSite",
				name: "Carbon Cube Kenya",
				url: "https://carboncube.co.ke",
			},
		},
	});

	const [profile, setProfile] = useState({
		fullname: "",
		username: "",
		enterprise_name: "",
		description: "",
		business_registration_number: "",
		email: "",
		phone_number: "",
		zipcode: "",
		gender: "",
		location: "",
		city: "",
		profile_picture: "",
		county_id: "",
		sub_county_id: "",
		age_group_id: "",
		document_url: "",
		document_type_id: "",
		document_expiry_date: "",
		document_verified: false,
		ads_count: 0,
		blocked: false,
		tier: null,
	});

	const [originalProfile, setOriginalProfile] = useState(null);

	const [editMode, setEditMode] = useState(searchParams.get("edit") === "true");
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState(null);
	const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [passwordMatch, setPasswordMatch] = useState(true);
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

	const [imagePreview, setImagePreview] = useState(null);
	const [counties, setCounties] = useState([]);
	const [subCounties, setSubCounties] = useState([]);
	const [ageGroups, setAgeGroups] = useState([]);
	const [documentTypes, setDocumentTypes] = useState([]);
	const [sellerDocuments, setSellerDocuments] = useState([]);
	const [documentPreviews, setDocumentPreviews] = useState({}); // Store previews for each document type
	const [pendingDocuments, setPendingDocuments] = useState({}); // Store files for each document type
	const fileInputRef = useRef(null);

	// Password visibility states
	const [showPasswords, setShowPasswords] = useState({
		currentPassword: false,
		newPassword: false,
		confirmPassword: false,
		changePasswordCurrent: false,
		changePasswordNew: false,
		changePasswordConfirm: false,
	});

	const token = sessionStorage.getItem("token");

	// Helper function to get tier ID for styling
	const getTierId = (profile) => {
		// First try to get from tier_id
		if (profile.tier_id) {
			return profile.tier_id;
		}

		// Fallback to tier name mapping
		const tierNameToId = {
			Premium: 4,
			Standard: 3,
			Basic: 2,
			Free: 1,
		};

		if (profile.tier?.name) {
			return tierNameToId[profile.tier.name] || 1;
		}

		// Final fallback
		return 1; // Free
	};

	// Toggle password visibility
	const togglePasswordVisibility = (field) => {
		setShowPasswords((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const fetchCounties = useCallback(async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/counties`
			);
			if (response.ok) {
				const data = await response.json();
				setCounties(data);
			}
		} catch (error) {
			console.error("Error fetching counties:", error);
		}
	}, []);

	const fetchSubCounties = useCallback(async (countyId) => {
		if (!countyId) {
			setSubCounties([]);
			return;
		}
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/counties/${countyId}/sub_counties`
			);
			if (response.ok) {
				const data = await response.json();
				setSubCounties(data);
			}
		} catch (error) {
			console.error("Error fetching sub-counties:", error);
		}
	}, []);

	const fetchAgeGroups = useCallback(async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/age_groups`
			);
			if (response.ok) {
				const data = await response.json();
				setAgeGroups(data);
			}
		} catch (error) {
			console.error("Error fetching age groups:", error);
		}
	}, []);

	const fetchDocumentTypes = useCallback(async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/document_types`
			);
			if (response.ok) {
				const data = await response.json();
				setDocumentTypes(data);
			}
		} catch (error) {
			console.error("Error fetching document types:", error);
		}
	}, []);

	const fetchProfile = useCallback(async () => {
		if (!token) {
			setError("No authentication token found");
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/seller/profile`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch profile data");
			}

			const data = await response.json();
			setProfile(data);
			setOriginalProfile({ ...data });
			setSellerDocuments(data.seller_documents || []);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	}, [token]);

	useEffect(() => {
		fetchProfile();
		fetchCounties();
		fetchAgeGroups();
		fetchDocumentTypes();
	}, [fetchProfile, fetchCounties, fetchAgeGroups, fetchDocumentTypes]);

	// Fetch sub-counties when profile is loaded and has a county_id
	useEffect(() => {
		if (profile.county_id && counties.length > 0) {
			fetchSubCounties(profile.county_id);
		}
	}, [profile.county_id, counties, fetchSubCounties]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProfile((prev) => ({
			...prev,
			[name]: value,
		}));

		// If county changes, fetch sub-counties and reset sub-county selection
		if (name === "county_id") {
			fetchSubCounties(value);
			setProfile((prev) => ({
				...prev,
				sub_county_id: "",
			}));
		}
	};

	const handleEditClick = () => {
		const newEditMode = !editMode;
		setEditMode(newEditMode);

		// Update URL parameters
		if (newEditMode) {
			setSearchParams({ edit: "true" });
		} else {
			setSearchParams({});
		}

		if (editMode) {
			// Reset to original profile when canceling
			if (originalProfile) {
				setProfile({ ...originalProfile });
			}
			setImagePreview(null); // Clear any image preview when canceling
			setDocumentPreviews({}); // Clear document previews when canceling
			setPendingDocuments({}); // Clear pending documents when canceling
		}
	};

	const uploadPendingDocuments = async () => {
		try {
			for (const [documentTypeId, file] of Object.entries(pendingDocuments)) {
				// Upload document to Cloudinary
				const formData = new FormData();
				formData.append("document", file);

				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/seller/profile`,
					{
						method: "PATCH",
						headers: {
							Authorization: `Bearer ${token}`,
						},
						body: formData,
					}
				);

				if (!response.ok) {
					throw new Error("Failed to upload document");
				}

				const data = await response.json();
				const documentUrl = data.document_url;

				if (!documentUrl) {
					throw new Error("Document upload failed - no URL returned");
				}

				// Create or update seller document
				const existingDoc = sellerDocuments.find(
					(doc) =>
						doc.document_type_id === parseInt(documentTypeId) ||
						(doc.document_type &&
							doc.document_type.id === parseInt(documentTypeId))
				);

				const documentData = {
					document_type_id: parseInt(documentTypeId),
					document_url: documentUrl,
					document_expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
						.toISOString()
						.split("T")[0], // 1 year from now
				};

				let response2;
				if (existingDoc) {
					// Update existing document
					response2 = await fetch(
						`${process.env.REACT_APP_BACKEND_URL}/seller/seller_documents/${existingDoc.id}`,
						{
							method: "PATCH",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`,
							},
							body: JSON.stringify(documentData),
						}
					);
				} else {
					// Create new document
					response2 = await fetch(
						`${process.env.REACT_APP_BACKEND_URL}/seller/seller_documents`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`,
							},
							body: JSON.stringify(documentData),
						}
					);
				}

				if (!response2.ok) {
					const errorData = await response2.json();
					throw new Error(
						`Failed to save document: ${
							errorData.errors ? errorData.errors.join(", ") : "Unknown error"
						}`
					);
				}

				const savedDocument = await response2.json();

				// Update seller documents state
				setSellerDocuments((prev) => {
					if (existingDoc) {
						return prev.map((doc) =>
							doc.id === existingDoc.id ? savedDocument : doc
						);
					} else {
						return [...prev, savedDocument];
					}
				});
			}

			// Clear pending documents and previews after successful upload
			setPendingDocuments({});
			setDocumentPreviews({});
		} catch (error) {
			console.error("Document upload error:", error);
			setAlertModalMessage(`Failed to upload documents: ${error.message}`);
			setAlertModalConfig({
				icon: "error",
				title: "Upload Failed",
				confirmText: "OK",
				cancelText: "",
				showCancel: false,
				onConfirm: () => setShowAlertModal(false),
			});
			setShowAlertModal(true);
		}
	};

	const handleSaveClick = async () => {
		if (!token) {
			setError("No authentication token found");
			return;
		}

		try {
			setIsSaving(true);

			// Check if password change is requested
			if (
				passwordData.currentPassword &&
				passwordData.newPassword &&
				passwordData.confirmPassword
			) {
				if (passwordData.newPassword !== passwordData.confirmPassword) {
					setAlertModalMessage(
						"New password and confirm password do not match."
					);
					setAlertModalConfig({
						icon: "error",
						title: "Password Mismatch",
						confirmText: "OK",
						cancelText: "",
						showCancel: false,
						onConfirm: () => setShowAlertModal(false),
					});
					setShowAlertModal(true);
					setIsSaving(false);
					return;
				}

				// Handle password change
				const passwordResponse = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/seller/profile/change-password`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(passwordData),
					}
				);

				if (!passwordResponse.ok) {
					const errorData = await passwordResponse.json();
					throw new Error(errorData.error || "Failed to change password");
				}
			}

			let response;

			// Get only changed fields
			const changedFields = {};
			const allowedFields = [
				"fullname",
				"username",
				"enterprise_name",
				"description",
				"business_registration_number",
				"email",
				"phone_number",
				"zipcode",
				"gender",
				"location",
				"city",
				"county_id",
				"sub_county_id",
				"age_group_id",
				"document_url",
				"document_type_id",
				"document_expiry_date",
			];

			// Compare current profile with original to find changes
			allowedFields.forEach((key) => {
				if (originalProfile && profile[key] !== originalProfile[key]) {
					changedFields[key] = profile[key];
				}
			});

			// If there's a new image file or pending documents, use FormData for upload
			if (
				(profile.profile_picture_file &&
					profile.profile_picture_file instanceof File) ||
				Object.keys(pendingDocuments).length > 0
			) {
				const formData = new FormData();

				// Add profile picture file if present
				if (
					profile.profile_picture_file &&
					profile.profile_picture_file instanceof File
				) {
					formData.append(
						"profile_picture",
						profile.profile_picture_file,
						profile.profile_picture_file.name
					);
				}

				// Add only changed fields
				Object.keys(changedFields).forEach((key) => {
					if (
						changedFields[key] !== "" &&
						changedFields[key] !== null &&
						changedFields[key] !== undefined
					) {
						formData.append(key, changedFields[key]);
					}
				});

				response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/seller/profile`,
					{
						method: "PATCH",
						headers: {
							Authorization: `Bearer ${token}`,
						},
						body: formData,
					}
				);

				// Upload pending documents after profile update
				if (Object.keys(pendingDocuments).length > 0) {
					await uploadPendingDocuments();
				}
			} else {
				// Only send changed fields
				const updateData = { ...changedFields };

				// Remove empty values
				Object.keys(updateData).forEach((key) => {
					if (
						updateData[key] === "" ||
						updateData[key] === null ||
						updateData[key] === undefined
					) {
						delete updateData[key];
					}
				});

				response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/seller/profile`,
					{
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(updateData),
					}
				);
			}

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.errors
						? errorData.errors.join(", ")
						: "Failed to save profile data"
				);
			}

			const data = await response.json();
			setProfile(data);
			setOriginalProfile({ ...data });
			setEditMode(false);
			setImagePreview(null); // Clear preview after successful save

			// Clear password fields after successful save
			setPasswordData({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
			setPasswordMatch(true);

			// Clear URL parameters after successful save
			setSearchParams({});

			// Determine success message
			let successMessage = "Profile updated successfully!";
			if (Object.keys(pendingDocuments).length > 0) {
				successMessage = "Profile and documents updated successfully!";
			}
			if (
				passwordData.currentPassword &&
				passwordData.newPassword &&
				passwordData.confirmPassword
			) {
				successMessage = "Profile and password updated successfully!";
			}
			if (
				Object.keys(pendingDocuments).length > 0 &&
				passwordData.currentPassword &&
				passwordData.newPassword &&
				passwordData.confirmPassword
			) {
				successMessage =
					"Profile, documents, and password updated successfully!";
			}

			setAlertModalMessage(successMessage);
			setAlertModalConfig({
				icon: "success",
				title: "Success",
				confirmText: "OK",
				cancelText: "",
				showCancel: false,
				onConfirm: () => setShowAlertModal(false),
			});
			setShowAlertModal(true);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsSaving(false);
		}
	};

	const handleConfirmPasswordChange = (e) => {
		const { value } = e.target;
		setPasswordData((prev) => ({ ...prev, confirmPassword: value }));
		setPasswordMatch(passwordData.newPassword === value);
	};

	const handlePasswordChange = async () => {
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setAlertModalMessage("New password and confirm password do not match.");
			setAlertModalConfig({
				icon: "error",
				title: "Password Mismatch",
				confirmText: "OK",
				cancelText: "",
				showCancel: false,
				onConfirm: () => setShowAlertModal(false),
			});
			setShowAlertModal(true);
			return;
		}

		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/seller/profile/change-password`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(passwordData),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to change password");
			}

			setAlertModalMessage(
				"Password changed successfully. Please log in again."
			);
			setAlertModalConfig({
				icon: "success",
				title: "Password Changed",
				confirmText: "OK",
				cancelText: "",
				showCancel: false,
				onConfirm: () => {
					sessionStorage.removeItem("token");
					window.location.href = "/login";
				},
			});
			setShowAlertModal(true);
			setShowChangePasswordModal(false);
		} catch (err) {
			setAlertModalMessage(err.message);
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
					const response = await fetch(
						`${process.env.REACT_APP_BACKEND_URL}/seller/delete_account`,
						{
							method: "DELETE",
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);

					if (!response.ok) {
						throw new Error("Failed to delete account");
					}

					setAlertModalMessage("Your account has been deleted.");
					setAlertModalConfig({
						icon: "success",
						title: "Deleted",
						confirmText: "OK",
						cancelText: "",
						showCancel: false,
						onConfirm: () => {
							sessionStorage.removeItem("token");
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

	const handleImageChange = (e) => {
		const file = e.target.files[0];

		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				setAlertModalMessage("Please select a valid image file.");
				setAlertModalConfig({
					icon: "error",
					title: "Invalid File",
					confirmText: "OK",
					cancelText: "",
					showCancel: false,
					onConfirm: () => setShowAlertModal(false),
				});
				setShowAlertModal(true);
				return;
			}

			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				setAlertModalMessage("Image size must be less than 5MB.");
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

			// Create preview only - don't upload yet
			const reader = new FileReader();
			reader.onload = (e) => {
				setImagePreview(e.target.result);
			};
			reader.readAsDataURL(file);

			// Store the file for later upload
			setProfile((prev) => {
				const newProfile = {
					...prev,
					profile_picture_file: file,
				};
				return newProfile;
			});
		}
	};

	const handleImageClick = () => {
		if (editMode) {
			fileInputRef.current?.click();
		}
	};

	const handleDocumentUpload = (documentTypeId) => {
		// Create a file input for this specific document type
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".pdf,.jpg,.jpeg,.png";
		input.onchange = (e) => handleDocumentChange(e, documentTypeId);
		input.click();
	};

	const handleDocumentChange = (e, documentTypeId) => {
		const file = e.target.files[0];

		if (file) {
			// Validate file type
			const allowedTypes = [
				"application/pdf",
				"image/jpeg",
				"image/jpg",
				"image/png",
			];
			if (!allowedTypes.includes(file.type)) {
				setAlertModalMessage(
					"Please select a valid document file (PDF, JPEG, PNG)."
				);
				setAlertModalConfig({
					icon: "error",
					title: "Invalid File",
					confirmText: "OK",
					cancelText: "",
					showCancel: false,
					onConfirm: () => setShowAlertModal(false),
				});
				setShowAlertModal(true);
				return;
			}

			// Validate file size (max 10MB for documents)
			if (file.size > 10 * 1024 * 1024) {
				setAlertModalMessage("Document size must be less than 10MB.");
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

			// Store the file for later upload
			setPendingDocuments((prev) => ({
				...prev,
				[documentTypeId]: file,
			}));

			// Create preview for images
			if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onload = (e) => {
					setDocumentPreviews((prev) => ({
						...prev,
						[documentTypeId]: e.target.result,
					}));
				};
				reader.readAsDataURL(file);
			} else {
				// For PDFs, show a PDF icon
				setDocumentPreviews((prev) => ({
					...prev,
					[documentTypeId]: "pdf",
				}));
			}
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-white">
				<Navbar mode="seller" showSearch={false} showCategories={false} />
				<div className="flex">
					<Sidebar />
					<div className="flex-1 flex items-center justify-center">
						<div className="text-center">
							<Spinner
								variant="warning"
								name="cube-grid"
								style={{ width: 40, height: 40 }}
							/>
							<p className="mt-3 text-gray-500 text-sm">Loading...</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-white">
				<Navbar mode="seller" showSearch={false} showCategories={false} />
				<div className="flex">
					<Sidebar />
					<div className="flex-1 flex items-center justify-center">
						<div className="text-center">
							<h2 className="text-xl font-medium text-gray-900 mb-2">Error</h2>
							<p className="text-gray-500 mb-4">{error}</p>
							<button
								onClick={fetchProfile}
								className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors"
							>
								Try Again
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<Navbar mode="seller" showSearch={false} showCategories={false} />

			<div className="flex">
				<Sidebar />
				<div className="flex-1">
					<div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
						{/* Header */}
						<div className="flex flex-col gap-4 mb-6 sm:mb-8">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div>
									<h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
										Profile
									</h1>
									<p className="text-gray-500 text-xs sm:text-sm mt-1">
										Manage your account information
									</p>
								</div>
								<div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
									{!editMode && (
										<button
											onClick={handleEditClick}
											className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
										>
											<FontAwesomeIcon
												icon={faEdit}
												className="text-xs sm:text-sm"
											/>
											<span className="hidden xs:inline">Edit Profile</span>
											<span className="xs:hidden">Edit</span>
										</button>
									)}
									<button
										onClick={handleDeleteAccount}
										className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
									>
										<FontAwesomeIcon
											icon={faTrash}
											className="text-xs sm:text-sm"
										/>
										<span className="hidden xs:inline">Delete Account</span>
										<span className="xs:hidden">Delete</span>
									</button>
								</div>
							</div>
						</div>

						{/* Profile Card */}
						<div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
							<div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
								{/* Profile Picture */}
								<div className="flex-shrink-0">
									<div className="relative">
										<div
											className={`relative ${editMode ? "cursor-pointer" : ""}`}
											onClick={handleImageClick}
										>
											{imagePreview || profile.profile_picture ? (
												<img
													src={imagePreview || profile.profile_picture}
													alt="Profile"
													className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200"
												/>
											) : (
												<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-900 flex items-center justify-center border-2 border-gray-200">
													<span className="text-white text-lg sm:text-2xl font-bold">
														{profile.fullname
															? profile.fullname.charAt(0).toUpperCase()
															: profile.enterprise_name
															? profile.enterprise_name.charAt(0).toUpperCase()
															: "U"}
													</span>
												</div>
											)}
										</div>
										{editMode && (
											<button
												className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
												onClick={handleImageClick}
											>
												<FontAwesomeIcon icon={faCamera} className="text-xs" />
											</button>
										)}
									</div>
									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										className="hidden"
									/>
									{editMode && (
										<p className="text-xs text-gray-500 mt-2 text-center">
											Click to change photo
										</p>
									)}
								</div>

								{/* Profile Info */}
								<div className="flex-1 text-center sm:text-left">
									<h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
										{profile.fullname || "Your Name"}
									</h2>
									<p className="text-gray-600 mb-2 text-sm sm:text-base">
										@{profile.username || "username"}
									</p>
									<p className="text-gray-500 text-xs sm:text-sm mb-3">
										{profile.enterprise_name || "Enterprise Name"}
									</p>
									<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
										<span className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
											<FontAwesomeIcon
												icon={faEnvelope}
												className="text-gray-400 text-xs sm:text-sm"
											/>
											<span className="truncate">
												{profile.email || "Email"}
											</span>
										</span>
										<span className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
											<FontAwesomeIcon
												icon={faPhone}
												className="text-gray-400 text-xs sm:text-sm"
											/>
											{profile.phone_number || "Phone"}
										</span>
										<span className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
											<FontAwesomeIcon
												icon={faMapMarkerAlt}
												className="text-gray-400 text-xs sm:text-sm"
											/>
											<span className="truncate">
												{profile.location || "Location"}
											</span>
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Form */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
							{/* Personal Information */}
							<div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
								<h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">
									Personal Information
								</h3>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Full Name
										</label>
										<input
											type="text"
											name="fullname"
											value={profile.fullname || ""}
											onChange={handleChange}
											disabled={!editMode}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Username
										</label>
										<input
											type="text"
											name="username"
											value={profile.username || ""}
											onChange={handleChange}
											disabled={!editMode}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Age Group
										</label>
										<select
											name="age_group_id"
											value={String(profile.age_group_id || "")}
											onChange={handleChange}
											disabled={!editMode}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
										>
											<option value="">Select Age Group</option>
											{ageGroups.map((ageGroup) => (
												<option key={ageGroup.id} value={String(ageGroup.id)}>
													{ageGroup.name}
												</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											County
										</label>
										<select
											name="county_id"
											value={String(profile.county_id || "")}
											onChange={handleChange}
											disabled={!editMode}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
										>
											<option value="">Select County</option>
											{counties.map((county) => (
												<option key={county.id} value={String(county.id)}>
													{county.name}
												</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Sub-County
										</label>
										<select
											name="sub_county_id"
											value={String(profile.sub_county_id || "")}
											onChange={handleChange}
											disabled={!editMode || !profile.county_id}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
										>
											<option value="">Select Sub-County</option>
											{subCounties.map((subCounty) => (
												<option key={subCounty.id} value={String(subCounty.id)}>
													{subCounty.name}
												</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Gender
										</label>
										<select
											name="gender"
											value={profile.gender || ""}
											onChange={handleChange}
											disabled={!editMode}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
										>
											<option value="">Select Gender</option>
											<option value="Male">Male</option>
											<option value="Female">Female</option>
											<option value="Other">Other</option>
										</select>
									</div>
								</div>
							</div>

							{/* Business Information */}
							<div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
								<h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">
									Business Information
								</h3>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Enterprise Name
										</label>
										<input
											type="text"
											name="enterprise_name"
											value={profile.enterprise_name || ""}
											onChange={handleChange}
											disabled={!editMode}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Business Registration Number
										</label>
										<input
											type="text"
											name="business_registration_number"
											value={profile.business_registration_number || ""}
											onChange={handleChange}
											disabled={!editMode}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Description
										</label>
										<textarea
											name="description"
											value={profile.description || ""}
											onChange={handleChange}
											disabled={!editMode}
											rows={3}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none text-sm"
											placeholder="Tell customers about your business..."
										/>
									</div>
								</div>
							</div>

							{/* Contact Information */}
							<div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
								<h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">
									Contact Information
								</h3>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Email Address
										</label>
										<input
											type="email"
											name="email"
											value={profile.email || ""}
											onChange={handleChange}
											disabled={!editMode}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Phone Number
										</label>
										<input
											type="tel"
											name="phone_number"
											value={profile.phone_number || ""}
											onChange={handleChange}
											disabled={!editMode}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											City
										</label>
										<input
											type="text"
											name="city"
											value={profile.city || ""}
											onChange={handleChange}
											disabled={!editMode}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Zip Code
										</label>
										<input
											type="text"
											name="zipcode"
											value={profile.zipcode || ""}
											onChange={handleChange}
											disabled={!editMode}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Physical Address
										</label>
										<input
											type="text"
											name="location"
											value={profile.location || ""}
											onChange={handleChange}
											disabled={!editMode}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Document Management */}
						<div className="mt-4 sm:mt-6 bg-white border border-gray-200 rounded-lg p-4 sm:p-6 w-full">
							<h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">
								Document Management
							</h3>
							<div className="space-y-4 sm:space-y-6">
								{/* Document Types List */}
								<div>
									<h4 className="text-sm sm:text-base font-medium text-gray-800 mb-3 sm:mb-4">
										Your Documents
									</h4>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
										{documentTypes.map((docType) => {
											const existingDoc = sellerDocuments.find(
												(doc) =>
													doc.document_type_id === docType.id ||
													(doc.document_type &&
														doc.document_type.id === docType.id)
											);
											return (
												<div
													key={docType.id}
													className="border border-gray-200 rounded-lg p-4 w-full min-w-0"
												>
													<div className="flex items-start justify-between mb-4 gap-2">
														<h5 className="font-medium text-gray-900 text-base leading-tight">
															{docType.name}
														</h5>
														<span
															className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
																existingDoc?.document_verified
																	? "bg-green-100 text-green-800"
																	: existingDoc
																	? "bg-yellow-100 text-yellow-800"
																	: "bg-gray-100 text-gray-800"
															}`}
														>
															{existingDoc?.document_verified
																? "Verified"
																: existingDoc
																? "Pending"
																: "Not Uploaded"}
														</span>
													</div>
													{existingDoc ? (
														<div className="space-y-3">
															{/* Document Preview */}
															<div className="flex items-center gap-3 min-w-0">
																{existingDoc.document_url ? (
																	existingDoc.document_url
																		.toLowerCase()
																		.includes(".pdf") ? (
																		<div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
																			<svg
																				className="w-8 h-8 text-red-600"
																				fill="currentColor"
																				viewBox="0 0 20 20"
																			>
																				<path
																					fillRule="evenodd"
																					d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
																					clipRule="evenodd"
																				/>
																			</svg>
																		</div>
																	) : (
																		<img
																			src={existingDoc.document_url}
																			alt="Document preview"
																			className="w-16 h-16 object-cover rounded-lg border border-gray-200"
																			onError={(e) => {
																				e.target.style.display = "none";
																				e.target.nextSibling.style.display =
																					"flex";
																			}}
																		/>
																	)
																) : (
																	<div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
																		<svg
																			className="w-8 h-8 text-gray-400"
																			fill="none"
																			stroke="currentColor"
																			viewBox="0 0 24 24"
																		>
																			<path
																				strokeLinecap="round"
																				strokeLinejoin="round"
																				strokeWidth={2}
																				d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
																			/>
																		</svg>
																	</div>
																)}
																<div className="flex-1 min-w-0">
																	<p className="text-sm font-medium text-gray-900 truncate">
																		{docType.name}
																	</p>
																	<p className="text-xs text-gray-500 truncate">
																		Expires:{" "}
																		{new Date(
																			existingDoc.document_expiry_date
																		).toLocaleDateString()}
																	</p>
																</div>
															</div>

															{/* Action Buttons */}
															<div className="flex flex-col sm:flex-row gap-2">
																<button
																	onClick={() =>
																		window.open(
																			existingDoc.document_url,
																			"_blank"
																		)
																	}
																	className="text-xs px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors w-full sm:w-auto text-center"
																>
																	View Document
																</button>
																{editMode && (
																	<button
																		onClick={() =>
																			handleDocumentUpload(docType.id)
																		}
																		className="text-xs px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors w-full sm:w-auto text-center"
																	>
																		Update
																	</button>
																)}
															</div>
														</div>
													) : pendingDocuments[docType.id] ? (
														<div className="space-y-3">
															{/* Pending Document Preview */}
															<div className="flex items-center gap-3 min-w-0">
																{documentPreviews[docType.id] === "pdf" ? (
																	<div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
																		<svg
																			className="w-8 h-8 text-red-600"
																			fill="currentColor"
																			viewBox="0 0 20 20"
																		>
																			<path
																				fillRule="evenodd"
																				d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
																				clipRule="evenodd"
																			/>
																		</svg>
																	</div>
																) : (
																	<img
																		src={documentPreviews[docType.id]}
																		alt="Document preview"
																		className="w-16 h-16 object-cover rounded-lg border border-gray-200"
																	/>
																)}
																<div className="flex-1 min-w-0">
																	<p className="text-sm font-medium text-gray-900 truncate">
																		{pendingDocuments[docType.id].name}
																	</p>
																	<p className="text-xs text-gray-500 truncate">
																		{(
																			pendingDocuments[docType.id].size /
																			1024 /
																			1024
																		).toFixed(2)}{" "}
																		MB
																	</p>
																</div>
															</div>
															<p className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
																Ready to upload when you save
															</p>
														</div>
													) : (
														<div className="text-center py-6">
															<div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
																<svg
																	className="w-8 h-8 text-gray-400"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
																	/>
																</svg>
															</div>
															<p className="text-sm text-gray-500 mb-4">
																No document uploaded
															</p>
															{editMode && (
																<button
																	onClick={() =>
																		handleDocumentUpload(docType.id)
																	}
																	className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
																>
																	Upload Document
																</button>
															)}
														</div>
													)}
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</div>

						{/* Account Status */}
						<div className="mt-4 sm:mt-6 bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
							<h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">
								Account Status
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
								<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<span className="text-sm font-medium text-gray-700">
										Account Status
									</span>
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${
											profile.blocked
												? "bg-red-100 text-red-800"
												: "bg-green-100 text-green-800"
										}`}
									>
										{profile.blocked ? "Blocked" : "Active"}
									</span>
								</div>
								<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<span className="text-sm font-medium text-gray-700">
										Account Tier
									</span>
									<span
										className="px-2 py-1 rounded-full text-xs font-medium text-white"
										style={{
											backgroundColor: getBorderColor(getTierId(profile)),
										}}
									>
										{profile.tier?.name || "Free"}
									</span>
								</div>
								<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<span className="text-sm font-medium text-gray-700">
										Total Ads
									</span>
									<span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
										{profile.ads_count || 0}
									</span>
								</div>
								<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<span className="text-sm font-medium text-gray-700">
										Verification Status
									</span>
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${
											profile.document_verified
												? "bg-green-100 text-green-800"
												: "bg-yellow-100 text-yellow-800"
										}`}
									>
										{profile.document_verified ? "Verified" : "Pending"}
									</span>
								</div>
							</div>
						</div>

						{/* Security Settings */}
						<div className="mt-4 sm:mt-6 bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
							<h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">
								Security Settings
							</h3>
							{editMode ? (
								<div>
									<h4 className="text-sm font-medium text-gray-700 mb-4">
										Change Password
									</h4>
									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Current Password
											</label>
											<div className="relative">
												<input
													type={
														showPasswords.currentPassword ? "text" : "password"
													}
													value={passwordData.currentPassword}
													onChange={(e) =>
														setPasswordData((prev) => ({
															...prev,
															currentPassword: e.target.value,
														}))
													}
													className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
												/>
												<button
													type="button"
													onClick={() =>
														togglePasswordVisibility("currentPassword")
													}
													className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
												>
													<FontAwesomeIcon
														icon={
															showPasswords.currentPassword ? faEyeSlash : faEye
														}
														className="text-sm"
													/>
												</button>
											</div>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												New Password
											</label>
											<div className="relative">
												<input
													type={showPasswords.newPassword ? "text" : "password"}
													value={passwordData.newPassword}
													onChange={(e) =>
														setPasswordData((prev) => ({
															...prev,
															newPassword: e.target.value,
														}))
													}
													className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
												/>
												<button
													type="button"
													onClick={() =>
														togglePasswordVisibility("newPassword")
													}
													className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
												>
													<FontAwesomeIcon
														icon={
															showPasswords.newPassword ? faEyeSlash : faEye
														}
														className="text-sm"
													/>
												</button>
											</div>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Confirm New Password
											</label>
											<div className="relative">
												<input
													type={
														showPasswords.confirmPassword ? "text" : "password"
													}
													value={passwordData.confirmPassword}
													onChange={handleConfirmPasswordChange}
													className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm ${
														passwordData.confirmPassword && !passwordMatch
															? "border-red-500"
															: "border-gray-300"
													}`}
												/>
												<button
													type="button"
													onClick={() =>
														togglePasswordVisibility("confirmPassword")
													}
													className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
												>
													<FontAwesomeIcon
														icon={
															showPasswords.confirmPassword ? faEyeSlash : faEye
														}
														className="text-sm"
													/>
												</button>
											</div>
											{passwordData.confirmPassword && !passwordMatch && (
												<p className="text-red-500 text-sm mt-1 flex items-center gap-1">
													<FontAwesomeIcon
														icon={faExclamationTriangle}
														className="text-xs"
													/>
													Passwords do not match
												</p>
											)}
										</div>
									</div>
								</div>
							) : (
								<div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
									<div className="flex-1">
										<h4 className="text-sm font-medium text-gray-700 mb-1">
											Password
										</h4>
										<p className="text-xs sm:text-sm text-gray-500">
											Update your password to keep your account secure
										</p>
									</div>
									<button
										onClick={() => setShowChangePasswordModal(true)}
										className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors flex-shrink-0"
									>
										<FontAwesomeIcon
											icon={faKey}
											className="text-xs sm:text-sm"
										/>
										<span className="hidden xs:inline">Change Password</span>
										<span className="xs:hidden">Change</span>
									</button>
								</div>
							)}
						</div>

						{/* Edit Actions */}
						{editMode && (
							<div className="mt-4 sm:mt-6 bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
								<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
									<button
										onClick={handleEditClick}
										className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
									>
										<FontAwesomeIcon
											icon={faTimes}
											className="text-xs sm:text-sm"
										/>
										Cancel
									</button>
									<button
										onClick={handleSaveClick}
										disabled={isSaving}
										className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50"
									>
										{isSaving ? (
											<Spinner animation="border" size="sm" />
										) : (
											<FontAwesomeIcon
												icon={faSave}
												className="text-xs sm:text-sm"
											/>
										)}
										<span className="hidden xs:inline">
											{isSaving ? "Saving..." : "Save Changes"}
										</span>
										<span className="xs:hidden">
											{isSaving ? "Saving..." : "Save"}
										</span>
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Change Password Modal */}
			{showChangePasswordModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6">
						<div className="flex items-center justify-between mb-4 sm:mb-6">
							<h3 className="text-lg font-semibold text-gray-900">
								Change Password
							</h3>
							<button
								onClick={() => setShowChangePasswordModal(false)}
								className="text-gray-400 hover:text-gray-600 transition-colors"
							>
								<FontAwesomeIcon icon={faTimes} />
							</button>
						</div>

						<div className="space-y-4 sm:space-y-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Current Password
								</label>
								<div className="relative">
									<input
										type={
											showPasswords.changePasswordCurrent ? "text" : "password"
										}
										value={passwordData.currentPassword}
										onChange={(e) =>
											setPasswordData((prev) => ({
												...prev,
												currentPassword: e.target.value,
											}))
										}
										className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
									/>
									<button
										type="button"
										onClick={() =>
											togglePasswordVisibility("changePasswordCurrent")
										}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
									>
										<FontAwesomeIcon
											icon={
												showPasswords.changePasswordCurrent ? faEyeSlash : faEye
											}
											className="text-sm"
										/>
									</button>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									New Password
								</label>
								<div className="relative">
									<input
										type={showPasswords.changePasswordNew ? "text" : "password"}
										value={passwordData.newPassword}
										onChange={(e) =>
											setPasswordData((prev) => ({
												...prev,
												newPassword: e.target.value,
											}))
										}
										className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
									/>
									<button
										type="button"
										onClick={() =>
											togglePasswordVisibility("changePasswordNew")
										}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
									>
										<FontAwesomeIcon
											icon={
												showPasswords.changePasswordNew ? faEyeSlash : faEye
											}
											className="text-sm"
										/>
									</button>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Confirm New Password
								</label>
								<div className="relative">
									<input
										type={
											showPasswords.changePasswordConfirm ? "text" : "password"
										}
										value={passwordData.confirmPassword}
										onChange={handleConfirmPasswordChange}
										className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm ${
											passwordData.confirmPassword && !passwordMatch
												? "border-red-500"
												: "border-gray-300"
										}`}
									/>
									<button
										type="button"
										onClick={() =>
											togglePasswordVisibility("changePasswordConfirm")
										}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
									>
										<FontAwesomeIcon
											icon={
												showPasswords.changePasswordConfirm ? faEyeSlash : faEye
											}
											className="text-sm"
										/>
									</button>
								</div>
								{passwordData.confirmPassword && !passwordMatch && (
									<p className="text-red-500 text-sm mt-1 flex items-center gap-1">
										<FontAwesomeIcon
											icon={faExclamationTriangle}
											className="text-xs"
										/>
										Passwords do not match
									</p>
								)}
							</div>
						</div>

						<div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
							<button
								onClick={() => setShowChangePasswordModal(false)}
								className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handlePasswordChange}
								disabled={
									!passwordMatch ||
									!passwordData.currentPassword ||
									!passwordData.newPassword
								}
								className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Change Password
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Alert Modal */}
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
	);
};

export default SellerProfile;
