import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar,
	faStarHalfAlt,
	faStar as faStarEmpty,
	faEdit,
	faTrashCan,
	faRotateLeft,
	faArrowLeft,
	faCalendarAlt,
	faBox,
	faRuler,
	faWeightHanging,
	faComments,
	faCheck,
	faExclamationTriangle,
	faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";
import Spinner from "react-spinkit";
import Swal from "sweetalert2";
import { Toast, ToastContainer } from "react-bootstrap";

const SellerAdDetails = () => {
	const { adId } = useParams();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [ad, setAd] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [reviews, setReviews] = useState([]);
	const [loadingReviews, setLoadingReviews] = useState(false);
	const [buyerDetails, setBuyerDetails] = useState(null);
	const [loadingBuyerDetails, setLoadingBuyerDetails] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState("success");
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const [previewTitle, setPreviewTitle] = useState("");

	// Edit mode state
	const isEditMode = searchParams.get("edit") === "true";
	const [isSaving, setIsSaving] = useState(false);
	const [categories, setCategories] = useState([]);
	const [subcategories, setSubcategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");

	// Inline editing state
	const [editValues, setEditValues] = useState({});
	const [imagesToRemove, setImagesToRemove] = useState([]);
	const [newImages, setNewImages] = useState([]);
	const [scanningImages, setScanningImages] = useState([]);

	// Refs to maintain focus
	const nsfwModelRef = useRef(null);

	useEffect(() => {
		const fetchAdDetails = async () => {
			try {
				const token = sessionStorage.getItem("token");

				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/seller/ads/${adId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch ad details");
				}

				const data = await response.json();
				setAd(data);
			} catch (error) {
				console.error("Error fetching ad details:", error);
				setError("Failed to load ad details");
			} finally {
				setLoading(false);
			}
		};

		fetchAdDetails();
	}, [adId]);

	useEffect(() => {
		if (ad) {
			// Reviews and buyer details are now included in the main ad response
			if (ad.reviews) {
				setReviews(ad.reviews);
			}
			if (ad.buyer_details) {
				setBuyerDetails(ad.buyer_details);
			}
			setLoadingReviews(false);
			setLoadingBuyerDetails(false);

			// Initialize form data when in edit mode
			if (isEditMode) {
				setSelectedCategory(ad.category_id);
				// Don't pre-populate editValues - let them be set only when user actually changes something
			}
		}
	}, [ad, isEditMode]);

	// Fetch categories for edit mode
	useEffect(() => {
		if (isEditMode) {
			const fetchCategories = async () => {
				try {
					const response = await fetch(
						`${process.env.REACT_APP_BACKEND_URL}/seller/categories`
					);
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					const data = await response.json();
					setCategories(data);
				} catch (error) {
					console.error("Error fetching categories:", error);
				}
			};
			fetchCategories();
		}
	}, [isEditMode]);

	// Fetch subcategories when category changes
	useEffect(() => {
		if (selectedCategory && isEditMode) {
			const fetchSubcategories = async () => {
				try {
					const response = await fetch(
						`${process.env.REACT_APP_BACKEND_URL}/seller/subcategories?category_id=${selectedCategory}`
					);
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					const data = await response.json();
					setSubcategories(data);
				} catch (error) {
					console.error("Error fetching subcategories:", error);
				}
			};
			fetchSubcategories();
		}
	}, [selectedCategory, isEditMode]);

	// Load the NSFW model (lazy) when needed
	const loadNSFWModel = useCallback(async () => {
		if (!nsfwModelRef.current) {
			const [{ load }, { enableProdMode }] = await Promise.all([
				import("nsfwjs"),
				import("@tensorflow/tfjs"),
			]);
			enableProdMode();
			nsfwModelRef.current = await load();
		}
		return nsfwModelRef.current;
	}, []);

	// Load NSFW model when component mounts
	useEffect(() => {
		loadNSFWModel();
	}, [loadNSFWModel]);

	// NSFW checking function
	const checkImage = useCallback(
		async (file) => {
			try {
				const model = await loadNSFWModel();
				const imageElement = await new Promise((resolve, reject) => {
					const img = new Image();
					img.crossOrigin = "anonymous";
					img.onload = () => resolve(img);
					img.onerror = reject;
					img.src = URL.createObjectURL(file);
				});

				const predictions = await model.classify(imageElement);
				const nsfwPrediction = predictions.find((p) => p.className === "Porn");
				return nsfwPrediction && nsfwPrediction.probability > 0.5;
			} catch (error) {
				console.error("Error checking image for NSFW content:", error);
				return false; // Default to safe if check fails
			}
		},
		[loadNSFWModel]
	);

	const renderRatingStars = (rating) => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			if (i <= Math.floor(rating)) {
				stars.push(
					<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />
				);
			} else if (i === Math.ceil(rating) && rating % 1 !== 0) {
				stars.push(
					<FontAwesomeIcon
						key={i}
						icon={faStarHalfAlt}
						className="text-yellow-400"
					/>
				);
			} else {
				stars.push(
					<FontAwesomeIcon
						key={i}
						icon={faStarEmpty}
						className="text-gray-300"
					/>
				);
			}
		}
		return stars;
	};

	const getBuyerDetailsForReview = (review) => {
		if (!buyerDetails?.reviewers) {
			return null;
		}

		const buyerInfo = buyerDetails.reviewers.find(
			(r) => r.review_id === review.id
		);
		return buyerInfo;
	};

	const formatDateWithTime = (dateString) => {
		if (!dateString) return "N/A";

		const date = new Date(dateString);
		if (isNaN(date.getTime())) return "Invalid Date";

		const day = date.getDate();
		const month = date.toLocaleDateString("en-US", { month: "long" });
		const year = date.getFullYear();
		const time = date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});

		// Add ordinal suffix to day
		const getOrdinalSuffix = (day) => {
			if (day >= 11 && day <= 13) return "th";
			switch (day % 10) {
				case 1:
					return "st";
				case 2:
					return "nd";
				case 3:
					return "rd";
				default:
					return "th";
			}
		};

		return `${day}${getOrdinalSuffix(day)} ${month}, ${year} at ${time}`;
	};

	const handleEditAd = () => {
		if (!ad) return;

		// Enter edit mode by adding ?edit=true parameter
		navigate(`/seller/ads/${adId}?edit=true`);
	};

	const handleCancelEdit = () => {
		// Reset edit state
		setEditValues({});
		setImagesToRemove([]);
		setNewImages([]);
		// Exit edit mode by removing the edit parameter
		navigate(`/seller/ads/${adId}`);
	};

	const handleSaveEdit = async () => {
		try {
			setIsSaving(true);
			const token = sessionStorage.getItem("token");

			// Check if we have any actual changes to save
			const hasFieldChanges = Object.keys(editValues).some((field) => {
				const newValue = editValues[field];
				const originalValue = ad[field];
				// Normalize values for comparison (treat null and empty string as equivalent)
				const normalizedNew = newValue === "" ? null : newValue;
				const normalizedOriginal = originalValue === "" ? null : originalValue;
				return newValue !== undefined && normalizedNew !== normalizedOriginal;
			});
			const hasImageChanges = imagesToRemove.length > 0 || newImages.length > 0;

			if (!hasFieldChanges && !hasImageChanges) {
				// No changes made, just exit edit mode
				navigate(`/seller/ads/${adId}`);
				return;
			}

			// Prepare form data for multipart request (needed for images)
			const formData = new FormData();

			// Add only truly changed fields (not just initialized ones)
			const changedFields = {};
			Object.keys(editValues).forEach((field) => {
				const newValue = editValues[field];
				const originalValue = ad[field];

				// Normalize values for comparison (treat null and empty string as equivalent)
				const normalizedNew = newValue === "" ? null : newValue;
				const normalizedOriginal = originalValue === "" ? null : originalValue;

				// Only include if the value has actually changed from the original
				if (newValue !== undefined && normalizedNew !== normalizedOriginal) {
					changedFields[field] = normalizedNew;
					formData.append(`ad[${field}]`, normalizedNew);
				}
			});

			// Handle image operations
			if (hasImageChanges) {
				// Calculate final media array
				let finalMedia = [...(ad.media || [])];

				// Remove images marked for deletion
				finalMedia = finalMedia.filter((url) => !imagesToRemove.includes(url));

				// Add new images to form data
				newImages.forEach((file) => {
					formData.append("ad[media][]", file);
				});

				// Update media URLs in the request (existing ones)
				finalMedia.forEach((url) => {
					formData.append("ad[existing_media][]", url);
				});
			}

			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/seller/ads/${adId}`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${token}`,
						// Don't set Content-Type for FormData
					},
					body: formData,
				}
			);

			if (!response.ok) {
				throw new Error("Failed to update ad");
			}

			const updatedAd = await response.json();
			setAd(updatedAd);

			// Reset edit state
			setEditValues({});
			setImagesToRemove([]);
			setNewImages([]);

			showToastNotification("Ad updated successfully!", "success");

			// Exit edit mode
			navigate(`/seller/ads/${adId}`);
		} catch (error) {
			console.error("Error updating ad:", error);
			showToastNotification("Failed to update ad. Please try again.", "error");
		} finally {
			setIsSaving(false);
		}
	};

	const showToastNotification = (message, type = "success") => {
		setToastMessage(message);
		setToastType(type);
		setShowToast(true);
	};

	const handlePreview = (imageUrl, title) => {
		setPreviewImage(imageUrl);
		setPreviewVisible(true);
		setPreviewTitle(title);
	};

	const handleCancelPreview = () => {
		setPreviewVisible(false);
		setPreviewImage("");
		setPreviewTitle("");
	};

	// Image editing functions
	const handleRemoveExistingImage = (imageUrl) => {
		setImagesToRemove((prev) => [...prev, imageUrl]);
	};

	const handleRestoreImage = (imageUrl) => {
		setImagesToRemove((prev) => prev.filter((url) => url !== imageUrl));
	};

	const handleAddNewImages = async (files) => {
		if (!files || files.length === 0) return;

		const fileArray = Array.from(files);
		const maxSize = 5 * 1024 * 1024; // 5MB

		// Calculate current total images (existing - removed + new)
		const currentExistingCount =
			(ad.media || []).length - imagesToRemove.length;
		const currentTotalCount = currentExistingCount + newImages.length;
		const remainingSlots = 3 - currentTotalCount;

		if (remainingSlots <= 0) {
			setToastMessage("You can only have up to 3 images total");
			setToastType("error");
			setShowToast(true);
			return;
		}

		const filesWithinLimit = fileArray.slice(0, remainingSlots);
		const validFiles = filesWithinLimit.filter((file) => {
			if (file.size > maxSize) {
				setToastMessage(`${file.name} exceeds 5MB limit`);
				setToastType("error");
				setShowToast(true);
				return false;
			}
			return true;
		});

		if (validFiles.length === 0) {
			return;
		}

		// Add valid files to state immediately
		setNewImages((prev) => [...prev, ...validFiles]);

		// Mark images as scanning and check for NSFW content
		const fileIds = validFiles.map((file, index) => `${file.name}-${index}`);
		setScanningImages((prev) => [...prev, ...fileIds]);

		// Check each file for NSFW content asynchronously
		validFiles.forEach(async (file, index) => {
			const fileId = `${file.name}-${index}`;
			const isNSFW = await checkImage(file);

			// Remove from scanning
			setScanningImages((prev) => prev.filter((id) => id !== fileId));

			if (isNSFW) {
				// Remove unsafe image from state
				setNewImages((prev) => prev.filter((img) => img !== file));

				// Show error message
				Swal.fire({
					icon: "error",
					title: "Inappropriate Content Detected",
					text: `"${file.name}" contains inappropriate content and has been removed.`,
					confirmButtonText: "OK",
					confirmButtonColor: "#eab308",
				});
			}
		});
	};

	const handleRemoveNewImage = (index) => {
		setNewImages((prev) => prev.filter((_, i) => i !== index));
	};

	// Memoized onChange handlers to prevent re-renders
	const handleFieldChange = useCallback((field, newValue) => {
		const activeElement = document.activeElement;
		const activeId = activeElement?.id;
		const selectionStart = activeElement?.selectionStart;
		const selectionEnd = activeElement?.selectionEnd;
		const inputType = activeElement?.type;

		setEditValues((prev) => ({ ...prev, [field]: newValue }));

		// Restore focus after state update
		if (activeId) {
			setTimeout(() => {
				const element = document.getElementById(activeId);
				if (element && element !== document.activeElement) {
					element.focus();
					// Restore cursor position only for text inputs (not number inputs)
					if (
						element.setSelectionRange &&
						selectionStart !== undefined &&
						inputType !== "number" &&
						inputType !== "email" &&
						inputType !== "url" &&
						inputType !== "tel"
					) {
						try {
							element.setSelectionRange(selectionStart, selectionEnd);
						} catch (e) {
							// Silently ignore if setSelectionRange fails
						}
					}
				}
			}, 0);
		}
	}, []);

	// Inline edit component
	const InlineEditField = React.memo(
		({ field, value, label, type = "text", options = null }) => {
			const isEditing = isEditMode; // Always edit when in edit mode

			const currentValue =
				editValues[field] !== undefined ? editValues[field] : value || "";

			// Function to get display value for select fields
			const getDisplayValue = () => {
				if (type === "select" && options && value) {
					const option = options.find((opt) => opt.value === value);
					return option ? option.label : value;
				}
				return value || "N/A";
			};

			if (isEditing) {
				return (
					<div className="flex items-center gap-2">
						{type === "select" && options ? (
							<select
								value={currentValue}
								onChange={(e) => handleFieldChange(field, e.target.value)}
								className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								{options.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						) : (
							<input
								id={`${field}-input`}
								type={type}
								value={currentValue}
								onChange={(e) => handleFieldChange(field, e.target.value)}
								className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder={`Enter ${label.toLowerCase()}`}
							/>
						)}
					</div>
				);
			}

			return (
				<span className="font-semibold text-xs sm:text-sm text-right max-w-[60%] break-words">
					{getDisplayValue()}
				</span>
			);
		}
	);

	const handleDeleteAd = async () => {
		const result = await Swal.fire({
			title: "Delete Ad",
			text: "Are you sure you want to delete this ad? This action cannot be undone.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#dc3545",
			cancelButtonColor: "#6c757d",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "Cancel",
		});

		if (!result.isConfirmed) {
			return;
		}

		try {
			const token = sessionStorage.getItem("token");
			if (!token) {
				showToastNotification("No authentication token found", "error");
				return;
			}

			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/seller/ads/${adId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.ok) {
				showToastNotification("Ad deleted successfully!", "success");
				// Redirect to ads list after a short delay
				setTimeout(() => {
					navigate("/seller/ads");
				}, 1500);
			} else {
				const errorData = await response.json();
				console.error("Error deleting ad:", errorData);
				showToastNotification(
					"Failed to delete ad. Please try again.",
					"error"
				);
			}
		} catch (error) {
			console.error("Error deleting ad:", error);
			showToastNotification(
				"An error occurred while deleting the ad. Please try again.",
				"error"
			);
		}
	};

	const handleRestoreAd = async () => {
		const result = await Swal.fire({
			title: "Restore Ad",
			text: "Are you sure you want to restore this ad?",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#28a745",
			cancelButtonColor: "#6c757d",
			confirmButtonText: "Yes, restore it!",
			cancelButtonText: "Cancel",
		});

		if (!result.isConfirmed) {
			return;
		}

		try {
			const token = sessionStorage.getItem("token");
			if (!token) {
				showToastNotification("No authentication token found", "error");
				return;
			}

			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/seller/ads/${adId}/restore`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.ok) {
				showToastNotification("Ad restored successfully!", "success");
				// Refresh the page to show updated status
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			} else {
				const errorData = await response.json();
				console.error("Error restoring ad:", errorData);
				showToastNotification(
					"Failed to restore ad. Please try again.",
					"error"
				);
			}
		} catch (error) {
			console.error("Error restoring ad:", error);
			showToastNotification(
				"An error occurred while restoring the ad. Please try again.",
				"error"
			);
		}
	};

	const formatPrice = (price) => {
		if (!price) return "N/A";
		const formattedPrice = parseFloat(price).toFixed(2);
		const [integerPart, decimalPart] = formattedPrice.split(".");
		return (
			<>
				{integerPart}
				{decimalPart !== "00" && (
					<>
						.<span className="text-gray-500">{decimalPart}</span>
					</>
				)}
			</>
		);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<Spinner name="circle" color="#3B82F6" />
			</div>
		);
	}

	if (error || !ad) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-xl mb-4">
						<FontAwesomeIcon icon={faBox} className="text-4xl" />
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Ad Not Found
					</h2>
					<p className="text-gray-600 mb-4">
						{error || "This ad could not be found."}
					</p>
					<button
						onClick={() => navigate("/seller/ads")}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Back to Ads
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar mode="seller" showSearch={false} showCategories={false} />
			<div className="flex">
				<div className="flex-1 p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto w-full">
					{/* Header */}
					<div className="mb-4 sm:mb-6">
						<button
							onClick={() => navigate("/seller/ads")}
							className="flex items-center text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
						>
							<FontAwesomeIcon
								icon={faArrowLeft}
								className="mr-2 text-xs sm:text-sm"
							/>
							<span className="hidden xs:inline">Back to Ads</span>
							<span className="xs:hidden">Back</span>
						</button>

						{/* Title and Action Buttons Row */}
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
							<div className="flex-1">
								{isEditMode ? (
									<input
										id="title-input"
										type="text"
										value={
											editValues.title !== undefined
												? editValues.title
												: ad.title || ""
										}
										onChange={(e) => handleFieldChange("title", e.target.value)}
										className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 break-words leading-tight mb-2 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
										placeholder="Enter ad title"
									/>
								) : (
									<h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 break-words leading-tight mb-2">
										{ad.title}
									</h1>
								)}
								<p className="text-gray-600 text-xs sm:text-sm">
									Ad ID: {ad.id}
								</p>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-row gap-2">
								{isEditMode ? (
									<>
										<button
											onClick={handleSaveEdit}
											disabled={isSaving}
											className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<FontAwesomeIcon icon={faCheck} className="text-xs" />
											<span className="hidden xs:inline">
												{isSaving ? "Saving..." : "Save Changes"}
											</span>
											<span className="xs:hidden">
												{isSaving ? "Saving..." : "Save"}
											</span>
										</button>
										<button
											onClick={handleCancelEdit}
											className="px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-1.5 text-sm font-medium"
										>
											<FontAwesomeIcon icon={faTimes} className="text-xs" />
											<span className="hidden xs:inline">Cancel</span>
											<span className="xs:hidden">Cancel</span>
										</button>
									</>
								) : (
									<>
										<button
											onClick={handleEditAd}
											className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 text-sm font-medium"
										>
											<FontAwesomeIcon icon={faEdit} className="text-xs" />
											<span className="hidden xs:inline">Edit Ad</span>
											<span className="xs:hidden">Edit</span>
										</button>
										{ad.deleted ? (
											<button
												onClick={handleRestoreAd}
												className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5 text-sm font-medium"
											>
												<FontAwesomeIcon
													icon={faRotateLeft}
													className="text-xs"
												/>
												<span className="hidden xs:inline">Restore</span>
												<span className="xs:hidden">Restore</span>
											</button>
										) : (
											<button
												onClick={handleDeleteAd}
												className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 text-sm font-medium"
											>
												<FontAwesomeIcon
													icon={faTrashCan}
													className="text-xs"
												/>
												<span className="hidden xs:inline">Delete</span>
												<span className="xs:hidden">Delete</span>
											</button>
										)}
									</>
								)}
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
						{/* Main Content */}
						<div className="lg:col-span-3 space-y-3 sm:space-y-4 lg:space-y-6">
							{/* Images */}
							<div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
								<div className="flex justify-between items-center mb-3 sm:mb-4">
									<h2 className="text-base sm:text-lg font-semibold text-gray-900">
										Images
									</h2>
									{isEditMode && (
										<div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
											<span>
												{(ad.media || []).length -
													imagesToRemove.length +
													newImages.length}
												/3
											</span>
										</div>
									)}
								</div>

								{/* Images Grid */}
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4">
									{/* Existing Images */}
									{ad.media &&
										ad.media.map((image, index) => {
											const isMarkedForRemoval = imagesToRemove.includes(image);
											return (
												<div
													key={index}
													className={`relative bg-gray-50 rounded-lg overflow-hidden transition-all duration-200 ${
														isMarkedForRemoval
															? "opacity-50 ring-2 ring-red-500"
															: isEditMode
															? "hover:shadow-md cursor-default"
															: "cursor-pointer hover:shadow-md"
													}`}
													onClick={() =>
														!isEditMode &&
														handlePreview(image, `${ad.title} - ${index + 1}`)
													}
												>
													<div className="relative bg-white aspect-square">
														<img
															src={image}
															alt={`${ad.title} view ${index + 1}`}
															className="w-full h-full object-contain"
															style={{ backgroundColor: "#f9fafb" }}
														/>
														{/* Image counter overlay for carousel */}
														{!isEditMode && ad.media.length > 1 && (
															<div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
																{index + 1}/{ad.media.length}
															</div>
														)}
														{/* Edit mode controls */}
														{isEditMode && (
															<div className="absolute top-2 right-2 z-20">
																{isMarkedForRemoval ? (
																	<button
																		onClick={() => handleRestoreImage(image)}
																		className="w-6 h-6 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
																		title="Restore image"
																	>
																		<FontAwesomeIcon
																			icon={faRotateLeft}
																			className="text-xs"
																		/>
																	</button>
																) : (
																	<button
																		onClick={() =>
																			handleRemoveExistingImage(image)
																		}
																		className="w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
																		title="Remove image"
																	>
																		×
																	</button>
																)}
															</div>
														)}
														{/* Removal overlay */}
														{isMarkedForRemoval && (
															<div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center z-10">
																<span className="text-red-700 font-medium text-sm">
																	Will be removed
																</span>
															</div>
														)}
													</div>
												</div>
											);
										})}

									{/* New Images */}
									{newImages.map((file, index) => {
										const fileId = `${file.name}-${index}`;
										const isScanning = scanningImages.includes(fileId);

										return (
											<div
												key={`new-${index}`}
												className="relative bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-yellow-300"
											>
												<div className="relative bg-white aspect-square">
													<img
														src={URL.createObjectURL(file)}
														alt={`New upload ${index + 1}`}
														className="w-full h-full object-contain"
														style={{ backgroundColor: "#f9fafb" }}
													/>
													{/* Scanning overlay */}
													{isScanning && (
														<div className="absolute inset-0 bg-yellow-500 bg-opacity-20 flex items-center justify-center">
															<div className="bg-white rounded-lg px-3 py-2 shadow-lg">
																<div className="flex items-center gap-2">
																	<div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
																	<span className="text-yellow-700 font-medium text-sm">
																		Scanning...
																	</span>
																</div>
															</div>
														</div>
													)}
													<div className="absolute top-2 right-2">
														<button
															onClick={() => handleRemoveNewImage(index)}
															className="w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
															title="Remove new image"
														>
															×
														</button>
													</div>
													<div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
														{index + 1}
													</div>
												</div>
											</div>
										);
									})}

									{/* Upload Area - positioned based on current image count */}
									{isEditMode &&
										(ad.media || []).length -
											imagesToRemove.length +
											newImages.length <
											3 && (
											<div className="relative bg-gray-50 rounded-lg overflow-hidden">
												<input
													type="file"
													multiple
													accept="image/*"
													onChange={(e) => handleAddNewImages(e.target.files)}
													className="hidden"
													id="image-upload-input"
												/>
												<label
													htmlFor="image-upload-input"
													className="relative bg-white aspect-square border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer flex flex-col items-center justify-center text-gray-600 hover:text-gray-800"
												>
													<FontAwesomeIcon
														icon={faBox}
														className="text-xl mb-2"
													/>
													<span className="text-xs font-medium text-center px-2">
														Add Image
													</span>
												</label>
											</div>
										)}
								</div>

								{/* No Images State */}
								{(!ad.media || ad.media.length === 0) &&
									newImages.length === 0 &&
									!isEditMode && (
										<div className="text-center py-6 sm:py-8 text-gray-500">
											<FontAwesomeIcon
												icon={faBox}
												className="text-4xl sm:text-6xl mb-3 sm:mb-4 text-gray-300"
											/>
											<p className="text-sm sm:text-base text-gray-500">
												No images available
											</p>
										</div>
									)}
							</div>

							{/* Custom Image Preview Modal */}
							{previewVisible && (
								<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
									<div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
										{/* Close button */}
										<button
											onClick={handleCancelPreview}
											className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all duration-200"
										>
											<FontAwesomeIcon icon={faTimes} className="text-lg" />
										</button>

										{/* Modal title */}
										<div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md">
											<h3 className="text-sm font-medium">{previewTitle}</h3>
										</div>

										{/* Image container */}
										<div className="bg-white rounded-lg overflow-hidden">
											<img
												src={previewImage}
												alt={previewTitle}
												className="w-full h-auto max-h-[80vh] object-contain"
											/>
										</div>
									</div>
								</div>
							)}

							{/* Description */}
							<div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
								<div className="flex justify-between items-center mb-3 sm:mb-4">
									<h2 className="text-base sm:text-lg font-semibold text-gray-900">
										Description
									</h2>
								</div>
								{isEditMode ? (
									<div className="space-y-2">
										<textarea
											id="description-textarea"
											value={
												editValues.description !== undefined
													? editValues.description
													: ad.description || ""
											}
											onChange={(e) =>
												handleFieldChange("description", e.target.value)
											}
											className="w-full text-sm sm:text-base border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
											rows={6}
											placeholder="Enter description"
										/>
									</div>
								) : (
									<p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
										{ad.description}
									</p>
								)}
							</div>

							{/* Reviews */}
							<div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
								{/* Header */}
								<div className="border-b border-gray-100 pb-3 sm:pb-4">
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
										<h2 className="text-base sm:text-lg font-semibold text-gray-900">
											Reviews
										</h2>
										<div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 text-xs sm:text-sm text-gray-600">
											<div className="flex items-center gap-1">
												<div className="flex">
													{renderRatingStars(
														ad.average_rating || ad.mean_rating || 0
													)}
												</div>
												<span className="font-medium text-sm">
													{(ad.average_rating || ad.mean_rating || 0).toFixed(
														1
													)}
												</span>
											</div>
											<div className="flex items-center gap-1 xs:gap-2">
												<span className="text-gray-400 hidden xs:inline">
													•
												</span>
												<span>
													{reviews.length} review
													{reviews.length !== 1 ? "s" : ""}
												</span>
												{buyerDetails && (
													<>
														<span className="text-gray-400 hidden xs:inline">
															•
														</span>
														<span>
															{buyerDetails.unique_reviewers} reviewer
															{buyerDetails.unique_reviewers !== 1 ? "s" : ""}
														</span>
													</>
												)}
											</div>
										</div>
									</div>
								</div>

								{loadingReviews || loadingBuyerDetails ? (
									<div className="text-center py-6 sm:py-8">
										<Spinner name="circle" color="#3B82F6" />
										<p className="text-gray-600 mt-2 text-sm">
											Loading reviews and buyer details...
										</p>
									</div>
								) : reviews.length > 0 ? (
									<div className="space-y-3 sm:space-y-4">
										{reviews.map((review, index) => {
											const buyerInfo = getBuyerDetailsForReview(review);
											return (
												<div
													key={index}
													className="border-b border-gray-50 last:border-b-0 pb-3 sm:pb-4 last:pb-0"
												>
													<div className="flex items-start gap-2 sm:gap-3">
														{/* Avatar */}
														<div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
															<span className="text-xs font-medium text-gray-600">
																{(
																	buyerInfo?.full_name ||
																	review.buyer_name ||
																	"A"
																)
																	.charAt(0)
																	.toUpperCase()}
															</span>
														</div>

														{/* Content */}
														<div className="flex-1 min-w-0">
															<div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-2">
																<span className="font-medium text-gray-900 text-xs sm:text-sm">
																	{buyerInfo?.full_name ||
																		review.buyer_name ||
																		"Anonymous"}
																</span>
																<div className="flex items-center gap-2">
																	<div className="flex">
																		{renderRatingStars(review.rating)}
																	</div>
																	<span className="text-xs text-gray-500">
																		{review.created_at &&
																		!isNaN(
																			new Date(review.created_at).getTime()
																		)
																			? new Date(
																					review.created_at
																			  ).toLocaleDateString("en-US", {
																					month: "short",
																					day: "numeric",
																					year: "numeric",
																			  })
																			: "Recently"}
																	</span>
																</div>
															</div>

															{/* Enhanced buyer info */}
															{buyerInfo && (
																<div className="mb-2 flex flex-wrap gap-1 sm:gap-2 text-xs text-gray-500">
																	{buyerInfo.city && buyerInfo.county && (
																		<span className="bg-gray-100 px-2 py-1 rounded text-xs">
																			{buyerInfo.city}, {buyerInfo.county}
																		</span>
																	)}
																	{buyerInfo.age_group && (
																		<span className="bg-gray-100 px-2 py-1 rounded text-xs">
																			{buyerInfo.age_group}
																		</span>
																	)}
																	{buyerInfo.gender && (
																		<span className="bg-gray-100 px-2 py-1 rounded text-xs">
																			{buyerInfo.gender}
																		</span>
																	)}
																	{buyerInfo.is_deleted && (
																		<span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">
																			Account Deleted
																		</span>
																	)}
																</div>
															)}

															<p className="text-gray-700 text-xs sm:text-sm leading-relaxed m-0">
																{review.review}
															</p>
															{review.helpful_count > 0 && (
																<div className="mt-2 text-xs text-gray-500">
																	{review.helpful_count} found helpful
																</div>
															)}
														</div>
													</div>
												</div>
											);
										})}
									</div>
								) : (
									<div className="text-center py-6 sm:py-8">
										<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
											<FontAwesomeIcon
												icon={faComments}
												className="text-sm sm:text-lg text-gray-400"
											/>
										</div>
										<p className="text-gray-500 text-xs sm:text-sm">
											No reviews yet
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Sidebar */}
						<div className="lg:col-span-2 space-y-3 sm:space-y-4 lg:space-y-6">
							{/* Price & Status */}
							<div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
								<h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
									Price & Status
								</h2>
								<div className="space-y-2 sm:space-y-3">
									<div className="flex justify-between items-center">
										<span className="text-gray-600 text-xs sm:text-sm">
											Price:
										</span>
										{isEditMode ? (
											<div className="flex items-center gap-2">
												<input
													id="price-input"
													type="number"
													value={
														editValues.price !== undefined
															? editValues.price
															: ad.price || ""
													}
													onChange={(e) =>
														handleFieldChange("price", e.target.value)
													}
													className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
													placeholder="Price"
												/>
												<span className="text-xs text-gray-500">Kshs</span>
											</div>
										) : (
											<span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-green-600">
												Kshs {formatPrice(ad.price)}
											</span>
										)}
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 text-xs sm:text-sm">
											Quantity:
										</span>
										<InlineEditField
											field="quantity"
											value={ad.quantity}
											label="Quantity"
											type="number"
										/>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 text-xs sm:text-sm">
											Sold:
										</span>
										<span className="font-semibold text-sm sm:text-base">
											{ad.quantity_sold || 0}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 text-xs sm:text-sm">
											Status:
										</span>
										{ad.deleted ? (
											<span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
												Deleted
											</span>
										) : ad.sold_out ? (
											<span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
												Sold Out
											</span>
										) : (
											<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
												Active
											</span>
										)}
									</div>
								</div>
							</div>

							{/* Product Details */}
							<div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
								<h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
									Product Details
								</h2>
								<div className="space-y-2 sm:space-y-3">
									<div className="flex justify-between items-center">
										<span className="text-gray-600 text-xs sm:text-sm">
											Category:
										</span>
										{isEditMode ? (
											<select
												key="category-select"
												value={
													editValues.category_id !== undefined
														? editValues.category_id
														: ad.category_id || ""
												}
												onChange={(e) => {
													const categoryId = e.target.value;
													handleFieldChange("category_id", categoryId);
													// Also reset subcategory when category changes
													handleFieldChange("subcategory_id", "");
													setSelectedCategory(categoryId);
												}}
												className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
											>
												<option value="">Select Category</option>
												{categories.map((category) => (
													<option key={category.id} value={category.id}>
														{category.name}
													</option>
												))}
											</select>
										) : (
											<span className="font-semibold text-xs sm:text-sm text-right max-w-[60%] break-words">
												{ad.category?.name || "N/A"}
											</span>
										)}
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 text-xs sm:text-sm">
											Subcategory:
										</span>
										{isEditMode ? (
											<select
												key="subcategory-select"
												value={
													editValues.subcategory_id !== undefined
														? editValues.subcategory_id
														: ad.subcategory_id || ""
												}
												onChange={(e) => {
													const subcategoryId = e.target.value;
													handleFieldChange("subcategory_id", subcategoryId);
												}}
												className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
												disabled={!selectedCategory}
											>
												<option value="">Select Subcategory</option>
												{subcategories.map((subcategory) => (
													<option key={subcategory.id} value={subcategory.id}>
														{subcategory.name}
													</option>
												))}
											</select>
										) : (
											<span className="font-semibold text-xs sm:text-sm text-right max-w-[60%] break-words">
												{ad.subcategory?.name || "N/A"}
											</span>
										)}
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 text-xs sm:text-sm">
											Brand:
										</span>
										<InlineEditField
											field="brand"
											value={ad.brand}
											label="Brand"
										/>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 text-xs sm:text-sm">
											Manufacturer:
										</span>
										<InlineEditField
											field="manufacturer"
											value={ad.manufacturer}
											label="Manufacturer"
										/>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 text-xs sm:text-sm">
											Condition:
										</span>
										<InlineEditField
											field="condition"
											value={ad.condition}
											label="Condition"
											type="select"
											options={[
												{ value: "brand_new", label: "Brand New" },
												{ value: "second_hand", label: "Second Hand" },
												{ value: "refurbished", label: "Refurbished" },
											]}
										/>
									</div>
								</div>
							</div>

							{/* Dimensions */}
							{(isEditMode ||
								ad.item_length ||
								ad.item_width ||
								ad.item_height ||
								ad.item_weight) && (
								<div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
									<h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
										Dimensions
									</h2>
									<div className="space-y-2 sm:space-y-3">
										<div className="flex justify-between items-center">
											<span className="text-gray-600 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
												<FontAwesomeIcon
													icon={faRuler}
													className="text-xs sm:text-sm"
												/>
												Length (cm):
											</span>
											<InlineEditField
												field="item_length"
												value={ad.item_length}
												label="Length"
												type="number"
											/>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-gray-600 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
												<FontAwesomeIcon
													icon={faRuler}
													className="text-xs sm:text-sm"
												/>
												Width (cm):
											</span>
											<InlineEditField
												field="item_width"
												value={ad.item_width}
												label="Width"
												type="number"
											/>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-gray-600 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
												<FontAwesomeIcon
													icon={faRuler}
													className="text-xs sm:text-sm"
												/>
												Height (cm):
											</span>
											<InlineEditField
												field="item_height"
												value={ad.item_height}
												label="Height"
												type="number"
											/>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-gray-600 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
												<FontAwesomeIcon
													icon={faWeightHanging}
													className="text-xs sm:text-sm"
												/>
												Weight:
											</span>
											<InlineEditField
												field="item_weight"
												value={ad.item_weight}
												label="Weight"
												type="number"
											/>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-gray-600 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
												<FontAwesomeIcon
													icon={faWeightHanging}
													className="text-xs sm:text-sm"
												/>
												Weight Unit:
											</span>
											<InlineEditField
												field="weight_unit"
												value={ad.weight_unit || "Grams"}
												label="Weight Unit"
												type="select"
												options={[
													{ value: "Grams", label: "Grams" },
													{ value: "Kilograms", label: "Kilograms" },
												]}
											/>
										</div>
									</div>
								</div>
							)}

							{/* Created Date */}
							<div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
								<h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
									Timeline
								</h2>
								<div className="space-y-2 sm:space-y-3">
									<div className="flex justify-between items-center">
										<span className="text-gray-600 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
											<FontAwesomeIcon
												icon={faCalendarAlt}
												className="text-xs sm:text-sm"
											/>
											Created:
										</span>
										<span className="font-semibold text-xs sm:text-sm text-right max-w-[60%] break-words">
											{formatDateWithTime(ad.created_at)}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
											<FontAwesomeIcon
												icon={faCalendarAlt}
												className="text-xs sm:text-sm"
											/>
											Updated:
										</span>
										<span className="font-semibold text-xs sm:text-sm text-right max-w-[60%] break-words">
											{formatDateWithTime(ad.updated_at)}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Toast Container */}
			<ToastContainer
				position="bottom-end"
				className="p-4"
				style={{ zIndex: 9999 }}
			>
				<Toast
					show={showToast}
					onClose={() => setShowToast(false)}
					delay={4000}
					autohide
					bg={toastType === "success" ? "success" : "danger"}
				>
					<Toast.Header closeButton>
						<strong className="me-auto">
							{toastType === "success" ? "Success" : "Error"}
						</strong>
					</Toast.Header>
					<Toast.Body className="text-white">
						<FontAwesomeIcon
							icon={toastType === "success" ? faCheck : faExclamationTriangle}
							className="mr-2"
						/>
						{toastMessage}
					</Toast.Body>
				</Toast>
			</ToastContainer>
		</div>
	);
};

export default SellerAdDetails;
