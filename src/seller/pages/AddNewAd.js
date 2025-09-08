import React, { useState, useEffect, useCallback, useRef } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBox } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Spinner from "react-spinkit";
import Sidebar from "../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Cloudinary } from "cloudinary-core";
import "../css/SellerAds.css";
import Swal from "sweetalert2";
import AlertModal from "../../components/AlertModal";

const AddNewAd = () => {
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [categories, setCategories] = useState([]);
	const [subcategories, setSubcategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedSubcategory, setSelectedSubcategory] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [weightUnit, setWeightUnit] = useState("Grams");
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [alertVisible, setAlertVisible] = useState(false);
	const [editedImages, setEditedImages] = useState([]);
	const [selectedImages, setSelectedImages] = useState([]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [viewActiveIndex, setViewActiveIndex] = useState(0);
	const navigate = useNavigate();
	const [formErrors, setFormErrors] = useState({});

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
					setSelectedSubcategory(formValues.subcategory_id);
				} catch (error) {
					console.error("Error fetching subcategories:", error);
				}
			};

			fetchSubcategories();
		}
	}, [selectedCategory, formValues.subcategory_id]); // Dependency on both selectedCategory and formValues.subcategory_id

	// Load the NSFW model (lazy) when needed
	const loadNSFWModel = useCallback(async () => {
		if (!nsfwModelRef.current) {
			const [{ load }, { enableProdMode }] = await Promise.all([
				import("nsfwjs"),
				import("@tensorflow/tfjs"),
			]);
			enableProdMode?.();
			// Load default model from CDN
			nsfwModelRef.current = await load();
		}
	}, []);

	useEffect(() => {
		loadNSFWModel();
	}, [loadNSFWModel]);

	useEffect(() => {
		if (showAlertModal) {
			setWeightUnit("Grams"); // Default value on open
		}
	}, [showAlertModal]);

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
		setFormValues((prevState) => ({
			...prevState,
			category_id, // Use category_id to match the server expectation
			subcategory_id: "", // Clear subcategory_id
		}));
	};

	const handleSubcategoryChange = (event) => {
		const subcategory_id = event.target.value;
		setSelectedSubcategory(subcategory_id);
		setFormValues((prevState) => ({
			...prevState,
			subcategory_id, // Update subcategory_id
		}));
	};

	const handleWeightUnitChange = (unit) => {
		setFormValues((prev) => ({
			...prev,
			weight_unit: unit,
		}));
	};

	const handleAddWeightUnitChange = (unit) => {
		setWeightUnit((prevUnit) => (prevUnit === unit ? "Grams" : unit));
	};

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
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
			setAlertModalMessage("Please fill in all required fields.");
			setAlertModalConfig({
				icon: "warning",
				title: "Required Fields Missing",
				confirmText: "OK",
				cancelText: "",
				showCancel: false,
				onConfirm: () => setShowAlertModal(false),
			});
			setShowAlertModal(true);
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
				setAlertModalMessage(
					"All selected images were blocked. Please upload appropriate images."
				);
				setAlertModalConfig({
					icon: "warning",
					title: "Images Blocked",
					confirmText: "OK",
					cancelText: "",
					showCancel: false,
					onConfirm: () => setShowAlertModal(false),
				});
				setShowAlertModal(true);
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
			// Ensure weight_unit is always valid
			const validWeightUnit =
				weightUnit && ["Grams", "Kilograms"].includes(weightUnit)
					? weightUnit
					: "Grams";
			formData.append("ad[weight_unit]", validWeightUnit);

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
							setAlertModalMessage("Ad added successfully!");
							setAlertModalConfig({
								icon: "success",
								title: "Ad Added",
								confirmText: "OK",
								cancelText: "",
								showCancel: false,
								onConfirm: () => {
									setShowAlertModal(false);
									navigate("/seller/ads");
								},
							});
							setShowAlertModal(true);
							resolve(result);
						} else {
							// Handle validation errors
							if (response.errors && Array.isArray(response.errors)) {
								const errorMessage = response.errors.join(", ");
								setAlertModalMessage(`Error adding ad: ${errorMessage}`);
								setAlertModalConfig({
									icon: "error",
									title: "Add Ad Failed",
									confirmText: "OK",
									cancelText: "",
									showCancel: false,
									onConfirm: () => setShowAlertModal(false),
								});
								setShowAlertModal(true);
							} else if (response.error) {
								setAlertModalMessage(`Error adding ad: ${response.error}`);
								setAlertModalConfig({
									icon: "error",
									title: "Add Ad Failed",
									confirmText: "OK",
									cancelText: "",
									showCancel: false,
									onConfirm: () => setShowAlertModal(false),
								});
								setShowAlertModal(true);
							} else {
								setAlertModalMessage(`Error adding ad: ${xhr.responseText}`);
								setAlertModalConfig({
									icon: "error",
									title: "Add Ad Failed",
									confirmText: "OK",
									cancelText: "",
									showCancel: false,
									onConfirm: () => setShowAlertModal(false),
								});
								setShowAlertModal(true);
							}
							reject(new Error(`Upload failed with status: ${xhr.status}`));
						}
					} catch (err) {
						console.error("Failed to parse response:", err);
						reject(new Error("Invalid JSON response"));
					}
				};

				xhr.onerror = () => reject(new Error("Network error during upload"));
				xhr.send(formData);
			});

			await uploadPromise;

			if (skippedImages > 0) {
				setAlertModalMessage(
					`${skippedImages} image(s) were flagged as explicit and were not uploaded.`
				);
				setAlertModalConfig({
					icon: "warning",
					title: "Images Filtered",
					confirmText: "OK",
					cancelText: "",
					showCancel: false,
					onConfirm: () => setShowAlertModal(false),
				});
				setShowAlertModal(true);
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
		} catch (error) {
			console.error("Error adding ad:", error);
			if (error.message.includes("Upload failed")) {
				// Error message already shown in xhr.onload
				return;
			}
			setAlertModalMessage("Failed to add ad. Please try again.");
			setAlertModalConfig({
				icon: "error",
				title: "Add Ad Failed",
				confirmText: "OK",
				cancelText: "",
				showCancel: false,
				onConfirm: () => setShowAlertModal(false),
			});
			setShowAlertModal(true);
		} finally {
			setUploading(false);
			setUploadProgress(0);
		}
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

	return (
		<>
			<div className="min-h-screen bg-gray-50">
				<Navbar mode="seller" showSearch={false} showCategories={false} />
				<div className="flex">
					<Sidebar />
					<div className="flex-1">
						<div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6">
							{/* Header Section */}
							<div className="mb-4 sm:mb-6">
								<div className="flex items-center gap-4 mb-4">
									<Button
										variant="outline-secondary"
										onClick={() => navigate("/seller/ads")}
										className="flex items-center gap-2"
									>
										<FontAwesomeIcon icon={faArrowLeft} />
										Back to Ads
									</Button>
									<div>
										<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
											Add New Product
										</h1>
										<p className="text-sm sm:text-base text-gray-600 mt-1">
											Create a new product listing for your store
										</p>
									</div>
								</div>
							</div>

							{/* Form Section */}
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
								<Form>
									<Row>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Title *</Form.Label>
												<Form.Control
													type="text"
													name="title"
													value={formValues.title}
													onChange={handleFormChange}
													isInvalid={!!formErrors.title}
													placeholder="Enter product title"
												/>
												<Form.Control.Feedback type="invalid">
													{formErrors.title}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Brand *</Form.Label>
												<Form.Control
													type="text"
													name="brand"
													value={formValues.brand}
													onChange={handleFormChange}
													isInvalid={!!formErrors.brand}
													placeholder="Enter brand name"
												/>
												<Form.Control.Feedback type="invalid">
													{formErrors.brand}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
									</Row>

									<Form.Group className="mb-3">
										<Form.Label>Description *</Form.Label>
										<Form.Control
											as="textarea"
											rows={3}
											name="description"
											value={formValues.description}
											onChange={handleFormChange}
											isInvalid={!!formErrors.description}
											placeholder="Enter product description"
										/>
										<Form.Control.Feedback type="invalid">
											{formErrors.description}
										</Form.Control.Feedback>
									</Form.Group>

									<Row>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Price (Kshs) *</Form.Label>
												<Form.Control
													type="number"
													name="price"
													value={formValues.price}
													onChange={handleFormChange}
													isInvalid={!!formErrors.price}
													placeholder="Enter price"
												/>
												<Form.Control.Feedback type="invalid">
													{formErrors.price}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Quantity *</Form.Label>
												<Form.Control
													type="number"
													name="quantity"
													value={formValues.quantity}
													onChange={handleFormChange}
													isInvalid={!!formErrors.quantity}
													placeholder="Enter quantity"
												/>
												<Form.Control.Feedback type="invalid">
													{formErrors.quantity}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
									</Row>

									<Row>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Manufacturer *</Form.Label>
												<Form.Control
													type="text"
													name="manufacturer"
													value={formValues.manufacturer}
													onChange={handleFormChange}
													isInvalid={!!formErrors.manufacturer}
													placeholder="Enter manufacturer"
												/>
												<Form.Control.Feedback type="invalid">
													{formErrors.manufacturer}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Condition *</Form.Label>
												<Form.Select
													name="condition"
													value={formValues.condition}
													onChange={handleFormChange}
													isInvalid={!!formErrors.condition}
												>
													<option value="">Select condition</option>
													<option value="brand_new">Brand New</option>
													<option value="second_hand">Second Hand</option>
													<option value="refurbished">Refurbished</option>
												</Form.Select>
												<Form.Control.Feedback type="invalid">
													{formErrors.condition}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
									</Row>

									<Row>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Category *</Form.Label>
												<Form.Select
													value={selectedCategory}
													onChange={handleCategoryChange}
													isInvalid={!!formErrors.category}
												>
													<option value="">Select category</option>
													{categories.map((category) => (
														<option key={category.id} value={category.id}>
															{category.name}
														</option>
													))}
												</Form.Select>
												<Form.Control.Feedback type="invalid">
													{formErrors.category}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Subcategory *</Form.Label>
												<Form.Select
													value={selectedSubcategory}
													onChange={handleSubcategoryChange}
													isInvalid={!!formErrors.subcategory}
													disabled={!selectedCategory}
												>
													<option value="">Select subcategory</option>
													{subcategories.map((subcategory) => (
														<option key={subcategory.id} value={subcategory.id}>
															{subcategory.name}
														</option>
													))}
												</Form.Select>
												<Form.Control.Feedback type="invalid">
													{formErrors.subcategory}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
									</Row>

									<Row>
										<Col md={4}>
											<Form.Group className="mb-3">
												<Form.Label>Length (cm)</Form.Label>
												<Form.Control
													type="number"
													name="item_length"
													value={formValues.item_length}
													onChange={handleFormChange}
													placeholder="Length"
												/>
											</Form.Group>
										</Col>
										<Col md={4}>
											<Form.Group className="mb-3">
												<Form.Label>Width (cm)</Form.Label>
												<Form.Control
													type="number"
													name="item_width"
													value={formValues.item_width}
													onChange={handleFormChange}
													placeholder="Width"
												/>
											</Form.Group>
										</Col>
										<Col md={4}>
											<Form.Group className="mb-3">
												<Form.Label>Height (cm)</Form.Label>
												<Form.Control
													type="number"
													name="item_height"
													value={formValues.item_height}
													onChange={handleFormChange}
													placeholder="Height"
												/>
											</Form.Group>
										</Col>
									</Row>

									<Row>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Weight</Form.Label>
												<Form.Control
													type="number"
													name="item_weight"
													value={formValues.item_weight}
													onChange={handleFormChange}
													placeholder="Enter weight"
												/>
											</Form.Group>
										</Col>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Weight Unit</Form.Label>
												<div className="d-flex gap-2">
													<Button
														variant={
															weightUnit === "Grams"
																? "primary"
																: "outline-primary"
														}
														size="sm"
														onClick={() => handleAddWeightUnitChange("Grams")}
													>
														Grams
													</Button>
													<Button
														variant={
															weightUnit === "Kilograms"
																? "primary"
																: "outline-primary"
														}
														size="sm"
														onClick={() =>
															handleAddWeightUnitChange("Kilograms")
														}
													>
														Kilograms
													</Button>
												</div>
											</Form.Group>
										</Col>
									</Row>

									<Form.Group className="mb-4">
										<Form.Label>Product Images (Max 3)</Form.Label>
										<Form.Control
											type="file"
											multiple
											accept="image/*"
											onChange={(e) => handleFileSelect(e.target.files)}
										/>
										{selectedImages.length > 0 && (
											<div className="mt-2">
												<small className="text-muted">
													{selectedImages.length} image(s) selected
												</small>
											</div>
										)}
									</Form.Group>

									{uploading && (
										<div className="mb-3">
											<div className="text-center">
												<div className="text-sm text-gray-600 mb-2">
													Uploading... {uploadProgress}%
												</div>
												<div className="w-full bg-gray-200 rounded-full h-2.5">
													<div
														className="bg-blue-600 h-2.5 rounded-full"
														style={{ width: `${uploadProgress}%` }}
													></div>
												</div>
											</div>
										</div>
									)}

									<div className="flex gap-3 justify-end">
										<Button
											variant="secondary"
											onClick={() => navigate("/seller/ads")}
											disabled={uploading}
										>
											Cancel
										</Button>
										<Button
											variant="primary"
											onClick={handleAddNewAd}
											disabled={uploading}
											className="bg-yellow-500 hover:bg-yellow-600 border-yellow-500"
										>
											{uploading ? "Adding..." : "Add Product"}
										</Button>
									</div>
								</Form>
							</div>
						</div>
					</div>
				</div>
			</div>

			<AlertModal
				show={showAlertModal}
				onHide={() => setShowAlertModal(false)}
				message={alertModalMessage}
				config={alertModalConfig}
			/>
		</>
	);
};

export default AddNewAd;
