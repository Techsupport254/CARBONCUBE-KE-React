import React, { useState, useEffect, useCallback, useRef } from "react";
import {
	Container,
	Row,
	Col,
	Card,
	Button,
	Modal,
	Carousel,
	FormControl,
	Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTrashCan,
	faStar,
	faStarHalfAlt,
	faStar as faStarEmpty,
	faPencilAlt,
	faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import Spinner from "react-spinkit";
import TopNavbar from "../components/TopNavbar";
// import { Cloudinary } from 'cloudinary-core';
// Lazy-load heavy libs instead of bundling upfront
import "../css/SellerAds.css";
import Swal from "sweetalert2";
import AlertModal from "../../components/AlertModal";

const SellerAds = () => {
	const [ads, setAds] = useState({ active: [], deleted: [] });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedAd, setSelectedAd] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [showAddModal, setShowAddModal] = useState(false);
	const [categories, setCategories] = useState([]);
	const [subcategories, setSubcategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedSubcategory, setSelectedSubcategory] = useState("");
	// const [ setNewImageUrl] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const [weightUnit, setWeightUnit] = useState("Grams");
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [alertVisible, setAlertVisible] = useState(false);
	const [adToDelete, setAdToDelete] = useState(null);
	const [editedImages, setEditedImages] = useState([]);
	const [selectedImages, setSelectedImages] = useState([]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [viewActiveIndex, setViewActiveIndex] = useState(0);
	// const [alertMessage, setAlertMessage] = useState('');
	const navigate = useNavigate();
	const [formErrors, setFormErrors] = useState({});
	const [hoveredAdId, setHoveredAdId] = useState(null);

	// const [files, setFiles] = useState([]);
	const [editedAd, setEditedAd] = useState({
		item_length: "",
		item_width: "",
		item_height: "",
		item_weight: "",
		weight_unit: "Grams", // Default weight unit
		media: [], // Assuming 'images' holds the URLs of the ad images
	});

	const [formValues, setFormValues] = useState({
		title: "",
		description: "",
		price: "",
		quantity: "",
		brand: "",
		manufacturer: "",
		condition: "",
		item_length: "",
		item_width: "",
		item_height: "",
		weight_unit: "",
		item_weight: "",
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

	const sellerId = sessionStorage.getItem("sellerId");

	const nsfwModelRef = useRef(null);

	const removeImage = (index) => {
		setSelectedImages((prev) => prev.filter((_, i) => i !== index));
	};

	useEffect(() => {
		const fetchAds = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/seller/ads?seller_id=${sellerId}`,
					{
						headers: {
							Authorization: "Bearer " + sessionStorage.getItem("token"),
						},
					}
				);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json();
				setAds({
					active: data.active_ads || [],
					deleted: data.deleted_ads || [],
				});
			} catch (error) {
				console.error("Error fetching ads:", error);
				setError("Error fetching ads");
			} finally {
				setLoading(false);
			}
		};

		fetchAds();
	}, [sellerId]);

	useEffect(() => {
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
	}, []);

	useEffect(() => {
		if (selectedCategory) {
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

					// Set the selected subcategory to the one stored in the ad data
					setSelectedSubcategory(editedAd.subcategory_id);
				} catch (error) {
					console.error("Error fetching subcategories:", error);
				}
			};

			fetchSubcategories();
		}
	}, [selectedCategory, editedAd.subcategory_id]); // Dependency on both selectedCategory and editedAd.subcategory_id

	// Load the NSFW model (lazy) when needed
	const loadNSFWModel = useCallback(async () => {
		if (!nsfwModelRef.current) {
			const [{ load }, { enableProdMode }] = await Promise.all([
				import("nsfwjs"),
				import("@tensorflow/tfjs"),
			]);
			enableProdMode?.();
			nsfwModelRef.current = await load();
		}
	}, []);

	useEffect(() => {
		loadNSFWModel();
	}, [loadNSFWModel]);

	useEffect(() => {
		if (showAddModal) {
			setWeightUnit("Grams"); // Default value on open
		}
	}, [showAddModal]);

	useEffect(() => {
		const firstErrorKey = Object.keys(formErrors)[0];
		if (firstErrorKey) {
			const el = document.querySelector(`[name="${firstErrorKey}"]`);
			if (el && el.scrollIntoView) {
				el.scrollIntoView({ behavior: "smooth", block: "center" });
				el.focus();
			}
		}
	}, [formErrors]);

	const handleCategoryChange = (event) => {
		const category_id = event.target.value;
		setSelectedCategory(category_id);
		setSelectedSubcategory(""); // Reset subcategory when a new category is selected
		setEditedAd((prevState) => ({
			...prevState,
			category_id, // Use category_id to match the server expectation
			subcategory_id: "", // Clear subcategory_id
		}));
	};

	const handleSubcategoryChange = (event) => {
		const subcategory_id = event.target.value;
		setSelectedSubcategory(subcategory_id);
		setEditedAd((prevState) => ({
			...prevState,
			subcategory_id, // Update subcategory_id
		}));
	};

	const handleWeightUnitChange = (unit) => {
		setEditedAd((prev) => ({
			...prev,
			weight_unit: unit,
		}));
	};

	const handleAddWeightUnitChange = (unit) => {
		setWeightUnit((prevUnit) => (prevUnit === unit ? "" : unit));
	};

	const handleFormChange = (e) => {
		const { id, value } = e.target;
		setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
	};

	// Function to check if an image is NSFW
	const checkImage = async (file) => {
		if (!nsfwModelRef.current) {
			console.warn("NSFW model is not loaded yet. Loading now...");
			await loadNSFWModel(); // Ensure model is loaded
		}

		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = async (event) => {
				const img = new Image();
				img.src = event.target.result;
				img.onload = async () => {
					if (!nsfwModelRef.current) {
						console.error("NSFW model failed to load.");
						resolve(false); // Assume safe if model fails
						return;
					}

					try {
						const predictions = await nsfwModelRef.current.classify(img);
						// Build a map for easier thresholding
						const predictionMap = {};
						predictions.forEach(({ className, probability }) => {
							predictionMap[className] = probability;
						});

						// Calibrated thresholds to reduce false positives
						const pornProb = predictionMap["Porn"] || 0;
						const hentaiProb = predictionMap["Hentai"] || 0;
						const sexyProb = predictionMap["Sexy"] || 0;
						const neutralProb = predictionMap["Neutral"] || 0;
						const drawingProb = predictionMap["Drawing"] || 0;

						// Unsafe if explicit categories are very confident
						const isExplicit =
							pornProb >= 0.7 || hentaiProb >= 0.7 || sexyProb >= 0.8;
						// Strongly safe if neutral/drawing dominate
						const isClearlySafe =
							neutralProb + drawingProb >= 0.6 &&
							sexyProb < 0.6 &&
							pornProb < 0.6 &&
							hentaiProb < 0.6;

						if (isExplicit) {
							resolve(true);
						} else if (isClearlySafe) {
							resolve(false);
						} else {
							// For ambiguous cases, default to safe to avoid over-blocking
							resolve(false);
						}
					} catch (error) {
						console.error("Error classifying image:", error);
						resolve(false); // Assume safe if classification fails
					}
				};
			};
			reader.readAsDataURL(file);
		});
	};

	const handleAddNewAd = async (e) => {
		if (e && e.preventDefault) e.preventDefault();

		const {
			title,
			description,
			price,
			quantity,
			brand,
			manufacturer,
			item_length,
			item_width,
			item_height,
			item_weight,
			condition,
		} = formValues;

		const newErrors = {};

		if (!title.trim()) newErrors.title = "Title is required";
		if (!description.trim()) newErrors.description = "Description is required";
		if (!price) newErrors.price = "Price is required";
		if (!quantity) newErrors.quantity = "Quantity is required";
		if (!brand.trim()) newErrors.brand = "Brand is required";
		if (!manufacturer.trim())
			newErrors.manufacturer = "Manufacturer is required";
		if (!condition) newErrors.condition = "Condition is required";
		if (!selectedCategory) newErrors.category = "Category is required";
		if (!selectedSubcategory) newErrors.subcategory = "Subcategory is required";

		if (Object.keys(newErrors).length > 0) {
			setFormErrors(newErrors);
			alert("Please fill in all required fields.");
			return;
		}

		setUploading(true);
		setUploadProgress(0);
		setFormErrors({}); // clear previous

		try {
			let safeImages = [];
			let skippedImages = 0;

			if (selectedImages.length > 0) {
				await loadNSFWModel();

				for (let i = 0; i < selectedImages.length; i++) {
					const file = selectedImages[i];
					const isUnsafe = await checkImage(file);
					if (isUnsafe) {
						console.warn("Blocked unsafe image:", file.name);
						skippedImages++;
						continue;
					}
					safeImages.push(file);
				}
			}

			if (safeImages.length === 0) {
				alert(
					"All selected images were blocked. Please upload appropriate images."
				);
				setUploading(false);
				return;
			}

			const formData = new FormData();
			formData.append("ad[title]", title);
			formData.append("ad[description]", description);
			formData.append("ad[category_id]", selectedCategory);
			formData.append("ad[subcategory_id]", selectedSubcategory);
			formData.append("ad[price]", parseInt(price));
			formData.append("ad[quantity]", parseInt(quantity));
			formData.append("ad[brand]", brand);
			formData.append("ad[manufacturer]", manufacturer);
			formData.append("ad[condition]", condition);
			if (item_length)
				formData.append("ad[item_length]", parseFloat(item_length));
			if (item_width) formData.append("ad[item_width]", parseFloat(item_width));
			if (item_height)
				formData.append("ad[item_height]", parseFloat(item_height));
			if (item_weight)
				formData.append("ad[item_weight]", parseFloat(item_weight));
			formData.append("ad[weight_unit]", weightUnit);

			safeImages.forEach((file) => {
				formData.append("ad[media][]", file);
			});

			const uploadPromise = new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open("POST", `${process.env.REACT_APP_BACKEND_URL}/seller/ads`);
				xhr.setRequestHeader(
					"Authorization",
					"Bearer " + sessionStorage.getItem("token")
				);

				xhr.upload.onprogress = (event) => {
					if (event.lengthComputable) {
						const percentCompleted = Math.round(
							(event.loaded / event.total) * 100
						);
						setUploadProgress(percentCompleted);
					}
				};

				xhr.onload = () => {
					try {
						const response = JSON.parse(xhr.responseText);

						if (
							xhr.status === 403 &&
							response.error?.includes("Ad creation limit")
						) {
							setAlertModalMessage(response.error);
							setAlertModalConfig({
								icon: "warning",
								title: "Ad Limit Reached",
								confirmText: "Upgrade Tier",
								cancelText: "Close",
								showCancel: true,
								onConfirm: () => {
									setShowAlertModal(false);
									navigate("/seller/tiers");
								},
							});
							setShowAlertModal(true);
							setUploading(false);
							return;
						}

						if (xhr.status >= 200 && xhr.status < 300) {
							const result = response;
							setAds((prevAds) => ({
								...prevAds,
								active: [...prevAds.active, result],
							}));

							resolve(result);
						} else {
							reject(new Error(`Upload failed with status: ${xhr.status}`));
						}
					} catch (err) {
						console.error("❌ Failed to parse response:", err);
						reject(new Error("Invalid JSON response"));
					}
				};

				xhr.onerror = () => reject(new Error("Network error during upload"));
				xhr.send(formData);
			});

			await uploadPromise;

			if (skippedImages > 0) {
				alert(
					`${skippedImages} image(s) were flagged as explicit and were not uploaded.`
				);
			}

			// Reset
			setFormValues({
				title: "",
				description: "",
				price: "",
				quantity: "",
				brand: "",
				manufacturer: "",
				condition: "",
				item_length: "",
				item_width: "",
				item_height: "",
				item_weight: "",
			});
			setSelectedCategory("");
			setSelectedSubcategory("");
			setWeightUnit("Grams");
			setSelectedImages([]);
			setShowAddModal(false);
		} catch (error) {
			console.error("Error adding ad:", error);
			alert("Failed to add ad. Please try again.");
		} finally {
			setUploading(false);
			setUploadProgress(0);
		}
	};

	const handleViewDetailsClick = (ad) => {
		setSelectedAd(ad);
		setShowDetailsModal(true);
	};

	const handleEditAd = (adId) => {
		// Prevent editing of deleted ads
		if (ads.deleted.some((p) => p.id === adId)) {
			alert("❌ You cannot edit a deleted ad.");
			return;
		}

		// Find ad in active list
		const ad = ads.active.find((p) => p.id === adId);

		if (!ad) {
			console.error("Ad not found in active ads");
			return;
		}

		setSelectedAd(ad);
		setEditedAd({ ...ad });
		setSelectedCategory(ad.category_id);
		setSelectedSubcategory(ad.subcategory_id);
		setShowEditModal(true);
	};

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const filteredActiveAds = ads.active.filter((ad) =>
		ad.title.toLowerCase().includes(searchTerm.toLowerCase())
	);
	const filteredDeletedAds = ads.deleted.filter((ad) =>
		ad.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const resetForm = () => {
		setFormValues({
			title: "",
			description: "",
			price: "",
			quantity: "",
			brand: "",
			manufacturer: "",
			condition: "",
			item_length: "",
			item_width: "",
			item_height: "",
			item_weight: "",
		});
		setSelectedCategory("");
		setSelectedSubcategory("");
		setWeightUnit("Grams");
		setSelectedImages([]);
		setUploadProgress(0);
		setUploading(false);
	};

	const handleModalClose = () => {
		setShowDetailsModal(false);
		setShowEditModal(false);
		setShowAddModal(false);
		resetForm(); // 👈 clear form values when modal closes
		setEditedImages([]); // reset new image files
	};

	const handleSaveEdit = async () => {
		setIsSaving(true);

		try {
			const formData = new FormData();

			// Helper function: Append only if value is non-empty
			const appendIfValid = (key) => {
				const value = editedAd[key];
				if (value !== "" && value !== null && value !== undefined) {
					formData.append(`ad[${key}]`, value);
				}
			};

			// Append basic fields
			appendIfValid("title");
			appendIfValid("description");
			appendIfValid("category_id");
			appendIfValid("subcategory_id");
			appendIfValid("price");
			appendIfValid("quantity");
			appendIfValid("brand");
			appendIfValid("manufacturer");
			appendIfValid("condition");

			// Append dimensions and weight fields only if valid
			appendIfValid("item_length");
			appendIfValid("item_width");
			appendIfValid("item_height");
			appendIfValid("item_weight");

			// Weight unit - append always, defaulting to 'Grams' if empty or missing
			formData.append(
				"ad[weight_unit]",
				editedAd.weight_unit && editedAd.weight_unit !== ""
					? editedAd.weight_unit
					: "Grams"
			);

			// NSFW image filtering if images exist
			if (editedImages && editedImages.length > 0) {
				await loadNSFWModel();

				const safeImages = [];

				for (let file of editedImages) {
					const isUnsafe = await checkImage(file);
					if (!isUnsafe) {
						safeImages.push(file);
					} else {
						console.warn("Unsafe image blocked:", file.name);
					}
				}

				if (safeImages.length === 0) {
					alert("All selected images were flagged and blocked.");
					setIsSaving(false);
					return;
				}

				safeImages.forEach((file) => {
					formData.append("ad[media][]", file);
				});
			}

			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/seller/ads/${editedAd.id}`,
				{
					method: "PUT",
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
						// Do NOT set Content-Type here! Let fetch set it for FormData.
					},
					body: formData,
				}
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const updatedAd = await response.json();
			setAds((prev) => ({
				...prev,
				active: prev.active.map((p) => (p.id === updatedAd.id ? updatedAd : p)),
			}));

			setShowEditModal(false);
			setEditedImages([]); // Reset after successful update
		} catch (error) {
			console.error("Error saving changes:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditedAd((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const MAX_IMAGES = 3;

	const handleFileSelect = async (files, mode = "add") => {
		if (!files || files.length === 0) return;

		try {
			const fileArray = Array.from(files);
			const maxSize = 5 * 1024 * 1024;

			// Determine current image count based on mode
			const currentCount =
				mode === "edit" ? editedImages.length : selectedImages.length;

			// Limit number of images allowed
			const allowableSlots = MAX_IMAGES - currentCount;
			if (allowableSlots <= 0) {
				setAlertModalMessage(`You can only upload up to ${MAX_IMAGES} images.`);
				setAlertModalConfig({
					icon: "warning",
					title: "Upload Limit Reached",
					confirmText: "OK",
					cancelText: "",
					showCancel: false,
					onConfirm: () => setShowAlertModal(false),
				});
				setShowAlertModal(true);
				return;
			}

			const filesWithinLimit = fileArray.slice(0, allowableSlots);

			const validFiles = filesWithinLimit.filter(
				(file) => file.size <= maxSize
			);
			const invalidFiles = filesWithinLimit.filter(
				(file) => file.size > maxSize
			);

			if (invalidFiles.length > 0) {
				const invalidNames = invalidFiles
					.map((file) => `"${file.name}"`)
					.join(", ");
				const alertMessage = `${invalidNames} ${
					invalidFiles.length === 1 ? "exceeds" : "exceed"
				} 5MB. Please select smaller image${
					invalidFiles.length === 1 ? "" : "s"
				}.`;

				setAlertModalMessage(alertMessage);
				setAlertModalConfig({
					icon: "warning",
					title: "File Too Large",
					confirmText: "OK",
					cancelText: "",
					showCancel: false,
					onConfirm: () => {
						setShowAlertModal(false);
						if (validFiles.length > 0) {
							if (mode === "edit") {
								setEditedImages((prev) => [...prev, ...validFiles]);
							} else {
								setSelectedImages((prev) => [...prev, ...validFiles]);
							}
						}
					},
				});
				setShowAlertModal(true);
			} else {
				// All files are valid and within limit
				if (mode === "edit") {
					setEditedImages((prev) => [...prev, ...validFiles]);
				} else {
					setSelectedImages((prev) => [...prev, ...validFiles]);
				}

				// Images added successfully
			}
		} catch (error) {
			console.error("Error processing selected images:", error);
		}
	};

	const handleDeleteImage = async (index) => {
		try {
			const updatedMedia = [...editedAd.media];
			updatedMedia.splice(index, 1); // remove image by index

			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/seller/ads/${editedAd.id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
					body: JSON.stringify({ ad: { media: updatedMedia } }),
				}
			);

			if (!response.ok) throw new Error("Failed to update ad");

			const updatedAd = await response.json();

			setEditedAd(updatedAd);
			setAds((prevAds) => ({
				...prevAds,
				active: prevAds.active.map((p) =>
					p.id === updatedAd.id ? updatedAd : p
				),
			}));

			// ✅ Trigger AlertModal
			setAlertModalMessage("Image has been deleted successfully.");
			setAlertModalConfig({
				icon: "success",
				title: "Image Deleted",
				confirmText: "OK",
				showCancel: false,
			});
			setShowAlertModal(true);

			// Image deleted successfully
		} catch (error) {
			console.error("Error deleting image:", error);

			// Optional: Show error in AlertModal
			setAlertModalMessage("Failed to delete image. Please try again.");
			setAlertModalConfig({
				icon: "error",
				title: "Error",
				confirmText: "OK",
				showCancel: false,
			});
			setShowAlertModal(true);
		}
	};

	const handleRestoreAd = async (adId) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/seller/ads/${adId}/restore`,
				{
					method: "PUT", // or POST depending on your API
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			if (!response.ok) throw new Error("Failed to restore ad");

			const restoredAd = await response.json();

			setAds((prev) => ({
				active: [restoredAd, ...prev.active],
				deleted: prev.deleted.filter((a) => a.id !== adId),
			}));
		} catch (error) {
			console.error("Restore failed:", error);
			alert("Failed to restore ad.");
		}
	};

	const renderAdCard = (ad) => (
		<Col xs={6} md={6} lg={3} key={ad.id} className="mb-3 px-2 px-md-2">
			<Card className="h-100">
				<div style={{ position: "relative" }}>
					<Card.Img
						variant="top"
						className="ad-image"
						style={{ cursor: "pointer" }}
						onClick={() => handleViewDetailsClick(ad)}
						src={
							ad.media && ad.media.length > 0
								? ad.media[0]
								: "default-image-url"
						}
					/>
					{ads.deleted.some((p) => p.id === ad.id) && (
						<div
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								backgroundColor: "rgba(255, 0, 0, 0.6)",
								color: "white",
								width: "100%",
								height: "100%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: "1.5rem",
								fontWeight: "bold",
								textTransform: "uppercase",
							}}
						>
							Deleted
						</div>
					)}
				</div>

				<Card.Body className="px-2 py-2 bookmark-body d-flex flex-column justify-content-center">
					<div className="d-flex justify-content-between align-items-center h-100 w-100">
						{/* Title + Price */}
						<div className="flex-grow-1" style={{ minWidth: 0 }}>
							<Card.Title
								className="mb-1 ad-title text-truncate"
								style={{
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
								}}
							>
								{ad.title}
							</Card.Title>

							<Card.Text className="mb-0">
								<span className="text-success" style={{ fontSize: "15px" }}>
									Kshs:{" "}
								</span>
								<strong style={{ fontSize: "20px" }} className="text-danger">
									{ad.price
										? Number(ad.price)
												.toFixed(2)
												.split(".")
												.map((part, index) => (
													<React.Fragment key={index}>
														{index === 0 ? (
															<span className="price-integer">
																{parseInt(part, 10).toLocaleString()}
															</span>
														) : (
															<>
																<span style={{ fontSize: "16px" }}>.</span>
																<span className="price-decimal">{part}</span>
															</>
														)}
													</React.Fragment>
												))
										: "N/A"}
								</strong>
							</Card.Text>
						</div>

						{/* Edit/Delete Icons */}
						{ads.deleted.some((p) => p.id === ad.id) ? (
							<div
								className="restore-button-wrapper"
								style={{ position: "relative", display: "inline-block" }}
							>
								<span
									onClick={() => handleRestoreAd(ad.id)}
									onMouseEnter={() => setHoveredAdId(ad.id)}
									onMouseLeave={() => setHoveredAdId(null)}
									style={{
										cursor: "pointer",
										color: "green",
										fontSize: "1.2rem",
									}}
								>
									<FontAwesomeIcon icon={faRotateLeft} />
								</span>

								{hoveredAdId === ad.id && (
									<div
										style={{
											position: "absolute",
											bottom: "110%",
											left: "50%",
											transform: "translateX(-50%)",
											backgroundColor: "rgba(0, 0, 0, 0.75)",
											color: "#fff",
											padding: "2px 6px",
											borderRadius: "4px",
											fontSize: "12px",
											whiteSpace: "nowrap",
											zIndex: 1000,
											pointerEvents: "none",
										}}
									>
										Restore
									</div>
								)}
							</div>
						) : (
							<div className="d-flex flex-column align-items-center">
								<span
									onClick={() => handleEditAd(ad.id)}
									className="mb-2 text-secondary icon-button"
									title="Edit Ad"
									style={{ cursor: "pointer" }}
								>
									<FontAwesomeIcon
										icon={faPencilAlt}
										className="edit-icon"
										size="lg"
									/>
								</span>
								<span
									onClick={() => {
										setAdToDelete(ad.id);
										setAlertVisible(true);
									}}
									className="text-danger icon-button"
									title="Delete Ad"
									style={{ cursor: "pointer" }}
								>
									<FontAwesomeIcon
										icon={faTrashCan}
										className="edit-icon"
										size="lg"
									/>
								</span>
							</div>
						)}
					</div>
				</Card.Body>
			</Card>
		</Col>
	);

	const renderRatingStars = (rating) => {
		if (typeof rating !== "number" || rating < 0) {
			console.error("Invalid rating value:", rating);
			return <div className="rating-stars">Invalid rating</div>;
		}

		const fullStars = Math.floor(Math.max(0, Math.min(rating, 5)));
		const halfStar = rating % 1 >= 0.5;
		const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

		return (
			<div className="rating-stars">
				{[...Array(fullStars)].map((_, index) => (
					<FontAwesomeIcon
						key={index}
						icon={faStar}
						className="rating-star filled"
					/>
				))}
				{halfStar && (
					<FontAwesomeIcon
						icon={faStarHalfAlt}
						className="rating-star half-filled"
					/>
				)}
				{[...Array(emptyStars)].map((_, index) => (
					<FontAwesomeIcon
						key={index}
						icon={faStarEmpty}
						className="rating-star empty"
					/>
				))}
			</div>
		);
	};

	const StarRating = ({ rating }) => {
		const fullStars = Math.floor(rating);
		const halfStar = rating % 1 >= 0.5;
		const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

		return (
			<span className="star-rating">
				{[...Array(fullStars)].map((_, index) => (
					<FontAwesomeIcon key={index} icon={faStar} className="star filled" />
				))}
				{halfStar && (
					<FontAwesomeIcon icon={faStarHalfAlt} className="star half-filled" />
				)}
				{[...Array(emptyStars)].map((_, index) => (
					<FontAwesomeIcon
						key={index}
						icon={faStarEmpty}
						className="star empty"
					/>
				))}
			</span>
		);
	};

	if (loading) {
		return (
			<div className="centered-loader">
				<Spinner
					variant="warning"
					name="cube-grid"
					style={{ width: 100, height: 100 }}
				/>
			</div>
		);
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<>
			<TopNavbar />
			<div className="ads-management-page">
				<Container fluid className="p-0">
					<Row>
						<Col xs={12} md={2} className="p-0">
							<Sidebar />
						</Col>
						<Col xs={12} md={9} lg={9} className="p-2">
							<Row className="justify-content-center d-flex align-items-center">
								<Col
									xs={7}
									md={8}
									lg={6}
									className="mb-1 mb-md-3 pt-2 pt-md-3 justify-content-end"
								>
									<div className="search-container d-flex align-items-center">
										<FormControl
											placeholder="Search ads..."
											aria-label="Search ads"
											aria-describedby="search-icon"
											value={searchTerm}
											onChange={handleSearchChange}
											className="search-input text-center"
										/>
									</div>
								</Col>
								<Col
									xs={5}
									md={4}
									lg={3}
									className="mb-1 mb-md-3 pt-2 pt-md-3 d-flex justify-content-start"
								>
									<Button
										id="button"
										variant="warning"
										onClick={() => setShowAddModal(true)}
									>
										Add New Ad
									</Button>
								</Col>
							</Row>

							{/* Active Ads Section */}
							<h5 className="mt-3">Active Ads</h5>
							<Row>
								{filteredActiveAds.length > 0 ? (
									filteredActiveAds.map(renderAdCard)
								) : (
									<Col>
										<p className="text-muted">No active ads found.</p>
									</Col>
								)}
							</Row>

							{/* Deleted Ads Section */}
							<h5 className="mt-4">Deleted Ads</h5>
							<Row>
								{filteredDeletedAds.length > 0 ? (
									filteredDeletedAds.map(renderAdCard)
								) : (
									<Col>
										<p className="text-muted">No deleted ads.</p>
									</Col>
								)}
							</Row>
						</Col>
					</Row>
				</Container>

				{/* ============================================================ START AD DETAILS MODAL ==================================================================================*/}

				<Modal
					centered
					show={showDetailsModal}
					onHide={handleModalClose}
					size="xl"
				>
					<Modal.Header className="justify-content-center p-1 p-lg-2">
						<Modal.Title>{selectedAd?.title || "Ad Details"}</Modal.Title>
					</Modal.Header>
					<Modal.Body className="p-0 p-lg-2">
						{selectedAd && (
							<>
								<div className="position-relative">
									<Carousel
										className="mb-4 custom-carousel"
										activeIndex={viewActiveIndex}
										onSelect={(selectedIndex) =>
											setViewActiveIndex(selectedIndex)
										}
										controls={selectedAd.media && selectedAd.media.length > 1}
										indicators={false}
									>
										{selectedAd.media && selectedAd.media.length > 0 ? (
											selectedAd.media.map((image, index) => (
												<Carousel.Item key={index}>
													<img
														className="d-block w-100 ad-image"
														src={image}
														alt={`Ad ${selectedAd.title} - view ${index + 1}`}
														style={{ height: "300px", objectFit: "contain" }}
													/>
												</Carousel.Item>
											))
										) : (
											<Carousel.Item>
												<p className="text-center">No images available</p>
											</Carousel.Item>
										)}
									</Carousel>

									{/* 🔢 Fixed Image number overlay - outside carousel */}
									{selectedAd.media && selectedAd.media.length > 1 && (
										<div
											className="position-absolute bottom-0 start-0 m-3 px-3 py-1 text-dark animate__animated animate__fadeIn"
											style={{
												fontSize: "0.9rem",
												zIndex: 1050,
												textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
											}}
										>
											{viewActiveIndex + 1} / {selectedAd.media.length}
										</div>
									)}

									{/* 🖼️ Image Thumbnails Preview - only show if more than 1 image */}
									{selectedAd.media && selectedAd.media.length > 1 && (
										<div
											className="position-absolute bottom-0 end-0 m-3"
											style={{ zIndex: 1050 }}
										>
											<div className="d-flex gap-2">
												{selectedAd.media.map((image, index) => (
													<div
														key={index}
														className={`thumbnail-preview ${
															index === viewActiveIndex ? "active" : ""
														}`}
														onClick={() => setViewActiveIndex(index)}
														style={{
															width: "40px",
															height: "40px",
															cursor: "pointer",
															border:
																index === viewActiveIndex
																	? "2px solid #ffc107"
																	: "2px solid rgba(255,255,255,0.5)",
															borderRadius: "8px",
															overflow: "hidden",
															opacity: index === viewActiveIndex ? 1 : 0.7,
															transition: "all 0.3s ease",
															backgroundColor: "rgba(0,0,0,0.1)",
														}}
														onMouseEnter={(e) => {
															if (index !== viewActiveIndex) {
																e.target.style.opacity = "0.9";
																e.target.style.transform = "scale(1.05)";
															}
														}}
														onMouseLeave={(e) => {
															if (index !== viewActiveIndex) {
																e.target.style.opacity = "0.7";
																e.target.style.transform = "scale(1)";
															}
														}}
													>
														<img
															src={image}
															alt={`Thumbnail ${index + 1}`}
															style={{
																width: "100%",
																height: "100%",
																objectFit: "cover",
																pointerEvents: "none",
															}}
														/>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
								<Container className="ad-details mb-4 p-1 p-lg-2">
									<Row>
										<Col xs={6} md={6}>
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Price
												</Card.Header>
												<Card.Body className="text-center">
													<em className="ad-price-label">Kshs: </em>
													<strong className="text-success">
														{selectedAd.price
															? (() => {
																	const formattedPrice = parseFloat(
																		selectedAd.price
																	).toFixed(2);
																	const [integerPart, decimalPart] =
																		formattedPrice.split(".");
																	return (
																		<>
																			<span className="price-integer">
																				{parseInt(
																					integerPart,
																					10
																				).toLocaleString()}
																			</span>
																			<span style={{ fontSize: "16px" }}>
																				.
																			</span>
																			<span className="price-decimal">
																				{decimalPart}
																			</span>
																		</>
																	);
															  })()
															: "N/A"}
													</strong>
												</Card.Body>
											</Card>
										</Col>
										<Col xs={6} md={6}>
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Category
												</Card.Header>
												<Card.Body className="text-center">
													{selectedAd.category?.name || "N/A"}
												</Card.Body>
											</Card>
										</Col>
									</Row>

									<Row>
										<Col xs={6} md={6}>
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Quantity Sold
												</Card.Header>
												<Card.Body className="text-center">
													{selectedAd.quantity_sold || 0}
												</Card.Body>
											</Card>
										</Col>
										<Col xs={6} md={6}>
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Sold Out
												</Card.Header>
												<Card.Body className="text-center">
													{selectedAd.sold_out ? "Yes" : "No"}
												</Card.Body>
											</Card>
										</Col>
									</Row>

									<Row>
										<Col xs={12}>
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Description
												</Card.Header>
												<Card.Body className="text-center">
													{selectedAd.description}
												</Card.Body>
											</Card>
										</Col>
									</Row>

									<Row>
										<Col xs={12} md={6}>
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Condition
												</Card.Header>
												<Card.Body className="text-center">
													<p className="mb-0">
														{selectedAd.condition === "brand_new" && (
															<span
																style={{
																	backgroundColor: "green",
																	color: "white",
																	padding: "4px 12px",
																	borderRadius: "20px",
																	fontWeight: "bold",
																	fontSize: "0.95rem",
																}}
															>
																Brand New
															</span>
														)}
														{selectedAd.condition === "second_hand" && (
															<span
																style={{
																	backgroundColor: "orange",
																	color: "white",
																	padding: "4px 12px",
																	borderRadius: "20px",
																	fontWeight: "bold",
																	fontSize: "0.95rem",
																}}
															>
																Second Hand
															</span>
														)}
														{!selectedAd.condition && (
															<span className="text-muted">Not specified</span>
														)}
													</p>
												</Card.Body>
											</Card>
										</Col>
										<Col xs={12} md={6}>
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Rating
												</Card.Header>
												<Card.Body className="text-center">
													<span className="star-rating">
														{renderRatingStars(selectedAd.mean_rating || 0)}
													</span>
												</Card.Body>
											</Card>
										</Col>
									</Row>

									<Row>
										<Col xs={12}>
											<Card className="mb-2 custom-card">
												<Card.Header as="h6" className="justify-content-center">
													Dimensions
												</Card.Header>
												<Card.Body className="text-center">
													<Row>
														<Col xs={6} md={6}>
															<p>
																<strong>Height:</strong>{" "}
																{selectedAd.item_height} cm
															</p>
															<p>
																<strong>Width:</strong> {selectedAd.item_width}{" "}
																cm
															</p>
														</Col>
														<Col xs={6} md={6}>
															<p>
																<strong>Length:</strong>{" "}
																{selectedAd.item_length} cm
															</p>
															<p>
																<strong>Weight:</strong>{" "}
																{selectedAd.item_weight}{" "}
																{selectedAd.weight_unit}
															</p>
														</Col>
													</Row>
												</Card.Body>
											</Card>
										</Col>
									</Row>
								</Container>
								<h5 className="text-center" id="reviews">
									Reviews
								</h5>
								{selectedAd.reviews && selectedAd.reviews.length > 0 ? (
									<div className="reviews-container text-center p-1 p-lg-2">
										{selectedAd.reviews.map((review, index) => (
											<div className="custom-card p-2" key={index}>
												<p className="review-comment">
													<em>"{review.review}"</em>
												</p>
												<StarRating rating={review.rating} />
											</div>
										))}
									</div>
								) : (
									<p className="text-center">No reviews yet</p>
								)}
							</>
						)}
					</Modal.Body>
					<Modal.Footer className=" p-0 p-lg-1">
						<Button variant="danger" onClick={handleModalClose}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>

				{/* ============================================================ START EDIT AD MODAL ==================================================================================*/}

				<Modal
					centered
					show={showEditModal}
					onHide={handleModalClose}
					size="xl"
				>
					<Modal.Header className="justify-content-center p-1 p-lg-2">
						<Modal.Title>
							{selectedAd ? `Edit ${selectedAd.title}` : "Edit Ad"}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body className="p-1 p-lg-2">
						<Form>
							<Form.Group className="mb-3 position-relative">
								{editedAd.media && editedAd.media.length > 0 ? (
									<>
										<Carousel
											activeIndex={activeIndex}
											onSelect={(selectedIndex) =>
												setActiveIndex(selectedIndex)
											}
											className="custom-carousel"
											controls={editedAd.media.length > 1}
											indicators={false}
										>
											{editedAd.media.map((image, index) => (
												<Carousel.Item key={index}>
													<img
														className="d-block w-100"
														src={image}
														alt={`Ad - view ${index + 1}`}
														style={{ height: "300px", objectFit: "contain" }}
													/>
												</Carousel.Item>
											))}
										</Carousel>

										{/* 🔢 Fixed Image number (bottom-left) - outside carousel */}
										{editedAd.media.length > 1 && (
											<div
												className="position-absolute bottom-0 start-0 m-3 px-3 py-1 text-dark animate__animated animate__fadeIn"
												style={{
													fontSize: "0.9rem",
													zIndex: 1050,
													textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
												}}
											>
												{activeIndex + 1} / {editedAd.media.length}
											</div>
										)}

										{/* 🖼️ Image Thumbnails Preview - only show if more than 1 image */}
										{editedAd.media.length > 1 && (
											<div
												className="position-absolute bottom-0 end-0 m-3"
												style={{ zIndex: 1040 }} // Lower than delete button
											>
												<div className="d-flex gap-2">
													{editedAd.media.map((image, index) => (
														<div
															key={index}
															className={`thumbnail-preview ${
																index === activeIndex ? "active" : ""
															}`}
															onClick={() => setActiveIndex(index)}
															style={{
																width: "40px",
																height: "40px",
																cursor: "pointer",
																border:
																	index === activeIndex
																		? "2px solid #ffc107"
																		: "2px solid rgba(255,255,255,0.5)",
																borderRadius: "8px",
																overflow: "hidden",
																opacity: index === activeIndex ? 1 : 0.7,
																transition: "all 0.3s ease",
																backgroundColor: "rgba(0,0,0,0.1)",
															}}
															onMouseEnter={(e) => {
																if (index !== activeIndex) {
																	e.target.style.opacity = "0.9";
																	e.target.style.transform = "scale(1.05)";
																}
															}}
															onMouseLeave={(e) => {
																if (index !== activeIndex) {
																	e.target.style.opacity = "0.7";
																	e.target.style.transform = "scale(1)";
																}
															}}
														>
															<img
																src={image}
																alt={`Thumbnail ${index + 1}`}
																style={{
																	width: "100%",
																	height: "100%",
																	objectFit: "cover",
																	pointerEvents: "none",
																}}
															/>
														</div>
													))}
												</div>
											</div>
										)}

										{/* 🗑️ Delete button (top-right) for current image */}
										<Button
											variant="link"
											onClick={() => handleDeleteImage(activeIndex)}
											className="position-absolute top-0 end-0 m-2 text-danger"
											style={{
												fontSize: "1.2rem",
												zIndex: 1050,
												pointerEvents: "auto",
											}}
										>
											<FontAwesomeIcon icon={faTrashCan} />
										</Button>
									</>
								) : (
									<p>No images available</p>
								)}
							</Form.Group>

							<Row className="mb-1 mb-lg-3">
								<Col xs={12}>
									<Form.Group className="d-flex flex-column align-items-center">
										<Form.Label className="text-center mb-0 fw-bold">
											Title
										</Form.Label>
										<Form.Control
											type="text"
											placeholder="Enter ad title"
											name="title"
											id="button"
											value={editedAd.title || ""}
											onChange={handleInputChange}
										/>
									</Form.Group>
								</Col>
							</Row>

							<Row className="mb-1 mb-lg-3">
								<Col xs={6} md={6}>
									<Form.Group className="d-flex flex-column align-items-center">
										<Form.Label className="text-center mb-0 fw-bold">
											Category
										</Form.Label>
										<Form.Control
											as="select"
											name="category_id"
											id="button"
											value={selectedCategory}
											onChange={handleCategoryChange}
										>
											<option value="">Select Category</option>
											{categories.map((cat) => (
												<option key={cat.id} value={cat.id}>
													{cat.name}
												</option>
											))}
										</Form.Control>
									</Form.Group>
								</Col>
								<Col xs={6} md={6}>
									<Form.Group className="d-flex flex-column align-items-center">
										<Form.Label className="text-center mb-0 fw-bold">
											Subcategory
										</Form.Label>
										<Form.Control
											as="select"
											name="subcategory_id"
											id="button"
											value={selectedSubcategory}
											onChange={handleSubcategoryChange}
										>
											<option value="">Select Subcategory</option>
											{subcategories.map((subcat) => (
												<option key={subcat.id} value={subcat.id}>
													{subcat.name}
												</option>
											))}
										</Form.Control>
									</Form.Group>
								</Col>
							</Row>

							<Row className="mb-1 mb-lg-3">
								<Col xs={6} md={6}>
									<Form.Group className="d-flex flex-column align-items-center">
										<Form.Label className="text-center mb-0 fw-bold">
											Price
										</Form.Label>
										<Form.Control
											type="number"
											placeholder="Enter ad price"
											name="price"
											id="button"
											value={editedAd.price || ""}
											onChange={handleInputChange}
										/>
									</Form.Group>
								</Col>
								<Col xs={6} md={6}>
									<Form.Group className="d-flex flex-column align-items-center">
										<Form.Label className="text-center mb-0 fw-bold">
											Quantity in Stock
										</Form.Label>
										<Form.Control
											type="number"
											placeholder="Enter quantity in stock"
											name="quantity"
											id="button"
											value={editedAd.quantity || ""}
											onChange={handleInputChange}
										/>
									</Form.Group>
								</Col>
							</Row>

							<Row className="mb-1 mb-lg-3">
								<Col xs={12} md={6}>
									<Form.Group className="d-flex flex-column align-items-center">
										<Form.Label className=" text-center mb-0 fw-bold">
											Brand
										</Form.Label>
										<Form.Control
											type="text"
											placeholder="Enter ad brand"
											name="brand"
											id="button"
											value={editedAd.brand || ""}
											onChange={handleInputChange}
										/>
									</Form.Group>
								</Col>
								<Col xs={12} md={6}>
									<Form.Group className="d-flex flex-column align-items-center">
										<Form.Label className="text-center mb-0 fw-bold">
											Manufacturer
										</Form.Label>
										<Form.Control
											type="text"
											placeholder="Enter ad manufacturer"
											name="manufacturer"
											id="button"
											value={editedAd.manufacturer || ""}
											onChange={handleInputChange}
										/>
									</Form.Group>
								</Col>
							</Row>

							<Form.Group className="d-flex flex-column align-items-center mb-1 mb-lg-3">
								<Form.Label className="text-center mb-0 fw-bold">
									Add Images
								</Form.Label>
								<Form.Control
									type="file"
									id="button"
									accept="image/*"
									multiple
									onChange={(e) => handleFileSelect(e.target.files, "edit")}
								/>

								{editedImages.length > 0 && (
									<div className="image-preview d-flex flex-wrap justify-content-center mt-3">
										{editedImages.map((file, index) => (
											<div key={index} className="m-1 position-relative">
												<button
													type="button"
													className="btn btn-danger btn-sm position-absolute"
													style={{
														top: 0,
														right: 0,
														borderRadius: "50%",
														padding: "0 6px",
														lineHeight: "1",
														fontSize: "14px",
													}}
													onClick={() =>
														setEditedImages((prev) =>
															prev.filter((_, i) => i !== index)
														)
													}
												>
													&times;
												</button>
												<img
													src={URL.createObjectURL(file)}
													alt={`new-img-${index}`}
													style={{
														width: "80px",
														height: "80px",
														objectFit: "cover",
														borderRadius: "5px",
														border: "1px solid #ccc",
													}}
												/>
											</div>
										))}
									</div>
								)}
							</Form.Group>

							<Form.Group className="d-flex flex-column align-items-center">
								<Form.Label className="text-center mb-0 fw-bold">
									Description
								</Form.Label>
								<Form.Control
									as="textarea"
									rows={3}
									placeholder="Enter ad description"
									name="description"
									value={editedAd.description || ""}
									onChange={handleInputChange}
								/>
							</Form.Group>

							<Form.Group className="mb-2 w-100">
								<Form.Label className="text-center mb-0 fw-bold w-100">
									Condition
								</Form.Label>
								<Form.Control
									as="select"
									id="edit-condition"
									className="mb-1 rounded-pill"
									style={{ maxWidth: "100%" }}
									value={editedAd.condition || ""}
									onChange={(e) =>
										setEditedAd({ ...editedAd, condition: e.target.value })
									}
									required
								>
									<option value="">Select Condition</option>
									<option value="brand_new">Brand New</option>
									<option value="second_hand">Second Hand</option>
								</Form.Control>
							</Form.Group>

							<Card className="custom-card-seller">
								<Card.Header className="justify-content-center fw-bold">
									Dimensions
								</Card.Header>
								<Card.Body>
									<Row className="mb-1 -mb-lg-3">
										<Col xs={6} md={6}>
											<Form.Group className="d-flex flex-column align-items-center">
												<Form.Label className="text-center mb-0 fw-bold">
													Length
												</Form.Label>
												<Form.Control
													type="number"
													placeholder="Enter ad length"
													name="item_length"
													value={editedAd.item_length || ""}
													onChange={handleInputChange}
												/>
											</Form.Group>
										</Col>
										<Col xs={6} md={6}>
											<Form.Group className="d-flex flex-column align-items-center">
												<Form.Label className="text-center mb-0 fw-bold">
													Width
												</Form.Label>
												<Form.Control
													type="number"
													placeholder="Enter ad width"
													name="item_width"
													value={editedAd.item_width || ""}
													onChange={handleInputChange}
												/>
											</Form.Group>
										</Col>
									</Row>

									<Row className="mb-1 mb-lg-3">
										<Col xs={6} md={6}>
											<Form.Group className="d-flex flex-column align-items-center">
												<Form.Label className="text-center mb-0 fw-bold">
													Height
												</Form.Label>
												<Form.Control
													type="number"
													placeholder="Enter ad height"
													name="item_height"
													value={editedAd.item_height || ""}
													onChange={handleInputChange}
												/>
											</Form.Group>
										</Col>
										<Col xs={6} md={6}>
											<Form.Group className="d-flex flex-column align-items-center">
												<Form.Label className="text-center mb-0 fw-bold">
													Weight
												</Form.Label>
												<Form.Control
													type="number"
													placeholder="Enter ad weight"
													name="item_weight"
													value={editedAd.item_weight || ""}
													onChange={handleInputChange}
												/>
											</Form.Group>
										</Col>
									</Row>

									<Row className="mb-3">
										<Form.Group>
											<Form.Label>Weight Unit</Form.Label>
											<Row className="mb-3">
												<Col xs={6} md={6}>
													<Form.Check
														type="checkbox"
														name="weight_unit"
														label="Grams"
														checked={editedAd.weight_unit === "Grams"}
														onChange={() => handleWeightUnitChange("Grams")}
													/>
												</Col>
												<Col xs={6} md={6}>
													<Form.Check
														type="checkbox"
														name="weight_unit"
														label="Kilograms"
														checked={editedAd.weight_unit === "Kilograms"}
														onChange={() => handleWeightUnitChange("Kilograms")}
													/>
												</Col>
											</Row>
										</Form.Group>
									</Row>
								</Card.Body>
							</Card>
						</Form>
					</Modal.Body>
					<Modal.Footer className="p-0 p-lg-1">
						<Button
							variant="warning"
							onClick={handleSaveEdit}
							disabled={isSaving}
						>
							{isSaving ? "Saving..." : "Save Changes"}
						</Button>
						<Button variant="danger" onClick={handleModalClose}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>

				{/* ============================================================  START ADD AD MODAL ==================================================================================*/}

				<Modal
					show={showAddModal}
					onHide={() => setShowAddModal(false)}
					size="xl"
					centered
					className="custom-modal"
				>
					<Modal.Header className="custom-modal-header justify-content-center p-1 p-lg-2">
						<Modal.Title>Add Ad</Modal.Title>
					</Modal.Header>
					<Modal.Body className="custom-modal-body">
						<Form>
							<Row>
								<Col md={8}>
									<Form.Group className="mb-2">
										<Form.Label className="text-center mb-0 fw-bold">
											Title
										</Form.Label>
										<Form.Control
											id="title"
											name="title"
											type="text"
											placeholder="Enter ad title"
											value={formValues.title}
											onChange={handleFormChange}
											className="custom-input mb-1 rounded-pill"
											isInvalid={!!formErrors.title}
										/>
										<Form.Control.Feedback type="invalid">
											{formErrors.title}
										</Form.Control.Feedback>
									</Form.Group>

									<Form.Group className="mb-2">
										<Form.Label className="text-center mb-0 fw-bold">
											Description
										</Form.Label>
										<Form.Control
											id="description"
											name="description"
											as="textarea"
											rows={10}
											placeholder="Enter ad description"
											value={formValues.description}
											onChange={handleFormChange}
											className="custom-input mb-1"
											isInvalid={!!formErrors.description}
										/>
										<Form.Control.Feedback type="invalid">
											{formErrors.description}
										</Form.Control.Feedback>
									</Form.Group>

									{/* Inside your modal */}
									<Form.Group className="mb-2">
										<Form.Label className="text-center mb-0 fw-bold">
											Media
										</Form.Label>
										<div className="upload-section position-relative">
											<div className="upload-icon">&#8689;</div>
											<div className="d-flex flex-column align-items-center">
												<Button
													variant="warning"
													className="custom-upload-btn position-relative rounded-pill mb-1"
													disabled={selectedImages.length >= 3}
												>
													{selectedImages.length < 3
														? "Upload Images"
														: "Maximum Reached (3)"}
													<input
														type="file"
														accept="image/*"
														multiple
														onChange={(e) =>
															handleFileSelect(e.target.files, "add")
														}
														style={{
															position: "absolute",
															top: 0,
															left: 0,
															width: "100%",
															height: "100%",
															opacity: 0,
															cursor: "pointer",
														}}
													/>
												</Button>

												<small className="text-muted">
													{selectedImages.length} of 3 images uploaded
												</small>
											</div>
											<div className="upload-instructions">
												Drag and Drop files Here
											</div>
											<div
												className="image-preview mt-2"
												style={{
													display: "flex",
													flexDirection: "row",
													overflowX: "auto",
													gap: "10px",
													padding: "10px 0",
												}}
											>
												{selectedImages.map((imageUrl, index) => (
													<div
														key={index}
														className="image-container position-relative"
														style={{ flexShrink: 0 }}
													>
														<button
															type="button"
															className="btn btn-danger btn-image position-absolute d-flex justify-content-center align-items-center"
															onClick={() => removeImage(index)}
															style={{
																right: "-8px",
																top: "-8px",
																borderRadius: "50%",
																padding: 0,
																zIndex: 1,
																height: "22px",
																width: "22px",
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
																fontSize: "14px",
																lineHeight: 1,
																border: "none",
															}}
														>
															&times;
														</button>
														<img
															src={
																typeof imageUrl === "string"
																	? imageUrl
																	: URL.createObjectURL(imageUrl)
															}
															alt={`preview ${index + 1}`}
															className="img-thumbnail"
															style={{
																width: "80px",
																height: "80px",
																objectFit: "cover",
																margin: 0,
															}}
														/>
													</div>
												))}
											</div>
										</div>

										{/* Preview Uploaded Images in a row at bottom */}
									</Form.Group>
									<Form.Group className="mb-2 w-100">
										<Form.Label className="text-center mb-0 fw-bold w-100">
											Condition
										</Form.Label>
										<Form.Control
											as="select"
											id="condition"
											name="condition"
											className="mb-1 rounded-pill"
											style={{ maxWidth: "100%" }}
											value={formValues.condition || ""}
											onChange={(e) =>
												setFormValues({
													...formValues,
													condition: e.target.value,
												})
											}
											isInvalid={!!formErrors.condition}
										>
											<option value="">Select Condition</option>
											<option value="brand_new">Brand New</option>
											<option value="second_hand">Second Hand</option>
											<option value="refurbished">Refurbished</option>
										</Form.Control>
										<Form.Control.Feedback type="invalid">
											{formErrors.condition}
										</Form.Control.Feedback>
									</Form.Group>
								</Col>

								<Col md={4}>
									<Form.Group
										xs={6}
										className="d-flex flex-column align-items-center mb-2"
									>
										<Form.Label className="text-center mb-0 fw-bold">
											Category
										</Form.Label>
										<Form.Control
											id="category_id"
											name="category"
											as="select"
											className="custom-input mb-1 rounded-pill"
											value={selectedCategory}
											onChange={(e) => setSelectedCategory(e.target.value)}
											isInvalid={!!formErrors.category}
										>
											<option value="">Select Category</option>
											{categories.map((category) => (
												<option key={category.id} value={category.id}>
													{category.name}
												</option>
											))}
										</Form.Control>
										<Form.Control.Feedback type="invalid">
											{formErrors.category}
										</Form.Control.Feedback>
									</Form.Group>

									<Form.Group
										xs={6}
										className="d-flex flex-column align-items-center mb-2"
									>
										<Form.Label className="text-center mb-0 fw-bold">
											Sub-Category
										</Form.Label>
										<Form.Control
											id="subcategory_id"
											name="subcategory"
											as="select"
											className="custom-input mb-1 rounded-pill"
											value={selectedSubcategory}
											onChange={(e) => setSelectedSubcategory(e.target.value)}
											isInvalid={!!formErrors.subcategory}
										>
											<option value="">Select Sub-Category</option>
											{subcategories.map((subcategory) => (
												<option key={subcategory.id} value={subcategory.id}>
													{subcategory.name}
												</option>
											))}
										</Form.Control>
										<Form.Control.Feedback type="invalid">
											{formErrors.subcategory}
										</Form.Control.Feedback>
									</Form.Group>

									<Form.Group className="d-flex flex-column align-items-center mb-2">
										<Form.Label className="text-center mb-0 fw-bold">
											Price
										</Form.Label>
										<Form.Control
											id="price"
											name="price"
											type="text"
											placeholder="Enter ad price"
											value={formValues.price}
											onChange={handleFormChange}
											className="custom-input mb-1 rounded-pill"
											isInvalid={!!formErrors.price}
										/>
										<Form.Control.Feedback type="invalid">
											{formErrors.price}
										</Form.Control.Feedback>
									</Form.Group>

									<Form.Group className="d-flex flex-column align-items-center mb-2">
										<Form.Label className="text-center mb-0 fw-bold">
											Quantity
										</Form.Label>
										<Form.Control
											id="quantity"
											name="quantity"
											type="text"
											placeholder="Enter quantity"
											value={formValues.quantity}
											onChange={handleFormChange}
											className="custom-input mb-1 rounded-pill"
											isInvalid={!!formErrors.quantity}
										/>
										<Form.Control.Feedback type="invalid">
											{formErrors.quantity}
										</Form.Control.Feedback>
									</Form.Group>

									<Form.Group className="d-flex flex-column align-items-center mb-2">
										<Form.Label className="text-center mb-0 fw-bold">
											Brand
										</Form.Label>
										<Form.Control
											id="brand"
											name="brand"
											type="text"
											placeholder="Enter brand"
											value={formValues.brand}
											onChange={handleFormChange}
											className="custom-input mb-1 rounded-pill"
											isInvalid={!!formErrors.brand}
										/>
										<Form.Control.Feedback type="invalid">
											{formErrors.brand}
										</Form.Control.Feedback>
									</Form.Group>

									<Form.Group className="d-flex flex-column align-items-center mb-2">
										<Form.Label className="text-center mb-0 fw-bold">
											Manufacturer
										</Form.Label>
										<Form.Control
											id="manufacturer"
											name="manufacturer"
											type="text"
											placeholder="Enter manufacturer"
											value={formValues.manufacturer}
											onChange={handleFormChange}
											className="custom-input mb-1 rounded-pill"
											isInvalid={!!formErrors.brand}
										/>
										<Form.Control.Feedback type="invalid">
											{formErrors.manufacturer}
										</Form.Control.Feedback>
									</Form.Group>

									<Container className="p-0">
										<Form.Group className="d-flex flex-column align-items-center mb-2">
											<Form.Label className="text-center mb-0 fw-bold">
												Item Dimensions
											</Form.Label>
											<Row>
												<Col xs={6} lg={12}>
													<Form.Control
														id="item_length"
														name="item_length"
														type="text"
														placeholder="Length"
														value={formValues.item_length}
														onChange={handleFormChange}
														className="custom-input mb-2 rounded-pill"
													/>
												</Col>
												<Col xs={6} lg={12}>
													<Form.Control
														id="item_width"
														name="item_width"
														type="text"
														placeholder="Width"
														value={formValues.item_width}
														onChange={handleFormChange}
														className="custom-input mb-2 rounded-pill"
													/>
												</Col>
											</Row>

											<Row>
												<Col xs={6} lg={12}>
													<Form.Control
														id="item_height"
														name="item_height"
														type="text"
														placeholder="Height"
														value={formValues.item_height}
														onChange={handleFormChange}
														className="custom-input rounded-pill"
													/>
												</Col>
												<Col xs={6} lg={12}>
													<Form.Control
														id="item_weight"
														name="item_weight"
														type="text"
														placeholder="Weight"
														value={formValues.item_weight}
														onChange={handleFormChange}
														className="custom-input mb-1 rounded-pill"
													/>
												</Col>
											</Row>
										</Form.Group>
										<Row>
											<Form.Group className="d-flex flex-column align-items-center mb-2">
												<Form.Label className="text-center fw-bold">
													Weight Unit
												</Form.Label>
												<Row>
													<Col
														xs={6}
														md={6}
														className="d-flex justify-content-center"
													>
														<Form.Check
															type="checkbox"
															label="Grams"
															checked={weightUnit === "Grams"}
															onChange={() =>
																handleAddWeightUnitChange("Grams")
															}
														/>
													</Col>
													<Col
														xs={6}
														md={6}
														className="d-flex justify-content-center"
													>
														<Form.Check
															type="checkbox"
															label="Kilograms"
															checked={weightUnit === "Kilograms"}
															onChange={() =>
																handleAddWeightUnitChange("Kilograms")
															}
														/>
													</Col>
												</Row>
											</Form.Group>
										</Row>
									</Container>
								</Col>
							</Row>
						</Form>
					</Modal.Body>
					<Modal.Footer className="p-0 p-lg-1">
						{/* Progress Bar */}
						{uploading && (
							<div className="progress mt-2 w-100">
								<div
									className="progress-bar progress-bar-striped progress-bar-animated bg-success"
									role="progressbar"
									style={{
										width: `${uploadProgress}%`,
										transition: "width 0.3s ease-in-out",
									}}
									aria-valuenow={uploadProgress}
									aria-valuemin="0"
									aria-valuemax="100"
								>
									{uploadProgress}%
								</div>
							</div>
						)}

						{/* Buttons */}
						<Button
							type="button"
							variant="warning"
							onClick={handleAddNewAd}
							disabled={uploading}
						>
							{uploading ? "Uploading..." : "Add Ad"}
						</Button>

						<Button
							variant="danger"
							onClick={() => setShowAddModal(false)}
							disabled={uploading}
						>
							Close
						</Button>
					</Modal.Footer>
				</Modal>
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

			<AlertModal
				isVisible={alertVisible}
				title="Delete Confirmation"
				message="Are you sure you want to delete this ad? This action is permanent."
				confirmText="Yes, delete it"
				cancelText="Cancel"
				icon="warning"
				onConfirm={async () => {
					try {
						const response = await fetch(
							`${process.env.REACT_APP_BACKEND_URL}/seller/ads/${adToDelete}`,
							{
								method: "DELETE",
								headers: {
									Authorization: "Bearer " + sessionStorage.getItem("token"),
								},
							}
						);

						if (!response.ok) {
							throw new Error("Failed to delete the ad.");
						}

						setAds((prevAds) => {
							const deletedAd = prevAds.active.find(
								(ad) => ad.id === adToDelete
							);
							return {
								active: prevAds.active.filter((ad) => ad.id !== adToDelete),
								deleted: [...prevAds.deleted, deletedAd],
							};
						});

						Swal.fire({
							title: "Deleted!",
							text: "Your ad has been successfully deleted.",
							icon: "success",
							showConfirmButton: false,
							timer: 2000,
							customClass: {
								popup: "futuristic-swal rounded-4 glass-bg",
								title: "fw-semibold text-white",
								htmlContainer: "text-light",
							},
							backdrop: "rgba(0, 0, 0, 0.6)",
						});
					} catch (error) {
						console.error("Delete failed:", error);
						Swal.fire({
							title: "Error!",
							text: "There was a problem deleting the ad.",
							icon: "error",
							confirmButtonText: "OK",
							customClass: {
								popup: "futuristic-swal rounded-4 glass-bg",
								title: "fw-semibold text-white",
								htmlContainer: "text-light",
								confirmButton: "btn rounded-pill futuristic-confirm",
							},
							backdrop: "rgba(0, 0, 0, 0.6)",
							buttonsStyling: false,
						});
					} finally {
						setAlertVisible(false);
						setAdToDelete(null);
					}
				}}
				onClose={() => setAlertVisible(false)}
			/>
		</>
	);
};

export default SellerAds;
