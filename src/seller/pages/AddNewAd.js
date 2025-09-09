import React, { useState, useEffect, useCallback, useRef } from "react";
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBox } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Spinner from "react-spinkit";
import Navbar from "../../components/Navbar";
import "../css/SellerAds.css";
import Swal from "sweetalert2";

const AddNewAd = () => {
	const [categories, setCategories] = useState([]);
	const [subcategories, setSubcategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedSubcategory, setSelectedSubcategory] = useState("");
	const [weightUnit, setWeightUnit] = useState("Grams");
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [selectedImages, setSelectedImages] = useState([]);
	const [editedImages, setEditedImages] = useState([]);
	const [loading] = useState(false);
	const [scanningImages, setScanningImages] = useState([]);
	const navigate = useNavigate();
	const [formErrors, setFormErrors] = useState({});

	const [formValues, setFormValues] = useState({
		title: "",
		description: "",
		price: "",
		brand: "",
		manufacturer: "",
		condition: "",
		item_length: "",
		item_width: "",
		item_height: "",
		weight_unit: "",
		item_weight: "",
	});

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
			try {
				// Add timeout for model loading
				const modelPromise = Promise.all([
					import("nsfwjs"),
					import("@tensorflow/tfjs"),
				]);

				const timeoutPromise = new Promise((_, reject) =>
					setTimeout(() => reject(new Error("Model loading timeout")), 30000)
				);

				const [{ load }, { enableProdMode }] = await Promise.race([
					modelPromise,
					timeoutPromise,
				]);

				enableProdMode?.();
				// Load default model from CDN
				nsfwModelRef.current = await load();
			} catch (error) {
				console.error("Failed to load NSFW model:", error);
				// Set a dummy model to prevent repeated loading attempts
				nsfwModelRef.current = { classify: () => Promise.resolve([]) };
			}
		}
		return nsfwModelRef.current;
	}, []);

	useEffect(() => {
		loadNSFWModel();
	}, [loadNSFWModel]);

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
			// Add timeout to prevent hanging
			const timeoutId = setTimeout(() => {
				console.warn("NSFW check timeout for image:", file.name);
				resolve(false); // Assume safe on timeout
			}, 15000); // 15 second timeout

			const reader = new FileReader();
			reader.onload = async (event) => {
				try {
					const img = new Image();
					img.src = event.target.result;
					img.onload = async () => {
						try {
							if (!nsfwModelRef.current) {
								console.error("NSFW model failed to load.");
								clearTimeout(timeoutId);
								resolve(false); // Assume safe if model fails
								return;
							}

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

							clearTimeout(timeoutId);
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
							clearTimeout(timeoutId);
							resolve(false); // Assume safe if classification fails
						}
					};
					img.onerror = () => {
						console.error("Error loading image for NSFW check");
						clearTimeout(timeoutId);
						resolve(false); // Assume safe on image load error
					};
				} catch (error) {
					console.error("Error in NSFW check:", error);
					clearTimeout(timeoutId);
					resolve(false); // Assume safe on error
				}
			};
			reader.onerror = () => {
				console.error("Error reading file for NSFW check");
				clearTimeout(timeoutId);
				resolve(false); // Assume safe on file read error
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
		if (!brand.trim()) newErrors.brand = "Brand is required";
		if (!manufacturer.trim())
			newErrors.manufacturer = "Manufacturer is required";
		if (!condition) newErrors.condition = "Condition is required";
		if (!selectedCategory) newErrors.category = "Category is required";
		if (!selectedSubcategory) newErrors.subcategory = "Subcategory is required";

		if (Object.keys(newErrors).length > 0) {
			setFormErrors(newErrors);
			Swal.fire({
				icon: "warning",
				title: "Missing Required Information",
				text: "Please complete all required fields to create your product listing.",
				confirmButtonText: "Complete Fields",
				confirmButtonColor: "#eab308",
			});
			return;
		}

		setUploading(true);
		setUploadProgress(0);
		setFormErrors({}); // clear previous

		try {
			let safeImages = [];
			let skippedImages = 0;

			if (selectedImages.length > 0) {
				try {
					await loadNSFWModel();

					// Process images with timeout
					const imageProcessingPromises = selectedImages.map(
						async (file, i) => {
							try {
								const isUnsafe = await checkImage(file);
								if (isUnsafe) {
									console.warn("Blocked unsafe image:", file.name);
									return { file, isUnsafe: true };
								}
								return { file, isUnsafe: false };
							} catch (error) {
								console.error("Error processing image:", file.name, error);
								// On error, assume safe to avoid blocking legitimate images
								return { file, isUnsafe: false };
							}
						}
					);

					const results = await Promise.all(imageProcessingPromises);

					results.forEach(({ file, isUnsafe }) => {
						if (isUnsafe) {
							skippedImages++;
						} else {
							safeImages.push(file);
						}
					});
				} catch (error) {
					console.error("Error during NSFW scanning:", error);
					// If NSFW scanning fails completely, use all images
					safeImages = [...selectedImages];
					skippedImages = 0;
				}
			}

			if (safeImages.length === 0) {
				Swal.fire({
					icon: "warning",
					title: "Images Not Suitable",
					text: "All selected images were flagged as inappropriate. Please upload suitable product images.",
					confirmButtonText: "Upload Different Images",
					confirmButtonColor: "#eab308",
				});
				setUploading(false);
				return;
			}

			const formData = new FormData();
			formData.append("ad[title]", title);
			formData.append("ad[description]", description);
			formData.append("ad[category_id]", selectedCategory);
			formData.append("ad[subcategory_id]", selectedSubcategory);
			formData.append("ad[price]", parseInt(price));
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
							Swal.fire({
								icon: "warning",
								title: "Ad Limit Reached",
								text: response.error,
								showCancelButton: true,
								confirmButtonText: "Upgrade Tier",
								cancelButtonText: "Close",
								confirmButtonColor: "#eab308",
								cancelButtonColor: "#6b7280",
							}).then((result) => {
								if (result.isConfirmed) {
									navigate("/seller/tiers");
								}
							});
							setUploading(false);
							return;
						}

						if (xhr.status >= 200 && xhr.status < 300) {
							const result = response;
							Swal.fire({
								icon: "success",
								title: "Product Created Successfully",
								text: `"${title}" has been successfully added to your store!`,
								confirmButtonText: "View Products",
								confirmButtonColor: "#eab308",
							}).then(() => {
								navigate("/seller/ads");
							});
							resolve(result);
						} else {
							// Handle validation errors
							if (response.errors && Array.isArray(response.errors)) {
								const errorMessage = response.errors.join(", ");
								Swal.fire({
									icon: "error",
									title: "Product Creation Failed",
									text: `Unable to create product: ${errorMessage}`,
									confirmButtonText: "Try Again",
									confirmButtonColor: "#eab308",
								});
							} else if (response.error) {
								Swal.fire({
									icon: "error",
									title: "Product Creation Failed",
									text: `Unable to create product: ${response.error}`,
									confirmButtonText: "Try Again",
									confirmButtonColor: "#eab308",
								});
							} else {
								Swal.fire({
									icon: "error",
									title: "Product Creation Failed",
									text: "Unable to create product. Please check your connection and try again.",
									confirmButtonText: "Try Again",
									confirmButtonColor: "#eab308",
								});
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
				Swal.fire({
					icon: "warning",
					title: "Some Images Filtered",
					text: `${skippedImages} image(s) were flagged as inappropriate and were not included in your product listing.`,
					confirmButtonText: "Continue",
					confirmButtonColor: "#eab308",
				});
			}

			// Reset
			setFormValues({
				title: "",
				description: "",
				price: "",
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
			Swal.fire({
				icon: "error",
				title: "Connection Error",
				text: "Unable to create product. Please check your internet connection and try again.",
				confirmButtonText: "Try Again",
				confirmButtonColor: "#eab308",
			});
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
				Swal.fire({
					icon: "warning",
					title: "Upload Limit Reached",
					text: `You can only upload up to ${MAX_IMAGES} images.`,
					confirmButtonText: "OK",
					confirmButtonColor: "#eab308",
				});
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

				Swal.fire({
					icon: "warning",
					title: "File Too Large",
					text: alertMessage,
					confirmButtonText: "OK",
					confirmButtonColor: "#eab308",
				}).then(() => {
					if (validFiles.length > 0) {
						// Add valid files to state immediately
						if (mode === "edit") {
							setEditedImages((prev) => [...prev, ...validFiles]);
						} else {
							setSelectedImages((prev) => [...prev, ...validFiles]);
						}

						// Mark images as scanning and check for NSFW content
						const fileIds = validFiles.map(
							(file, index) => `${file.name}-${index}`
						);
						setScanningImages((prev) => [...prev, ...fileIds]);

						// Check each file for NSFW content asynchronously with error handling
						validFiles.forEach(async (file, index) => {
							const fileId = `${file.name}-${index}`;
							try {
								const isNSFW = await checkImage(file);

								// Remove from scanning
								setScanningImages((prev) => prev.filter((id) => id !== fileId));

								if (isNSFW) {
									// Remove unsafe image from state
									if (mode === "edit") {
										setEditedImages((prev) =>
											prev.filter((img) => img !== file)
										);
									} else {
										setSelectedImages((prev) =>
											prev.filter((img) => img !== file)
										);
									}

									// Show error message
									Swal.fire({
										icon: "error",
										title: "Inappropriate Content Detected",
										text: `"${file.name}" contains inappropriate content and has been removed.`,
										confirmButtonText: "OK",
										confirmButtonColor: "#eab308",
									});
								}
							} catch (error) {
								console.error(
									"Error checking image for NSFW:",
									file.name,
									error
								);
								// Remove from scanning even on error
								setScanningImages((prev) => prev.filter((id) => id !== fileId));
								// Don't remove the image on error - assume it's safe
							}
						});
					}
				});
			} else {
				// All files are valid and within limit - add to state immediately
				if (mode === "edit") {
					setEditedImages((prev) => [...prev, ...validFiles]);
				} else {
					setSelectedImages((prev) => [...prev, ...validFiles]);
				}

				// Mark images as scanning and check for NSFW content
				const fileIds = validFiles.map(
					(file, index) => `${file.name}-${index}`
				);
				setScanningImages((prev) => [...prev, ...fileIds]);

				// Check each file for NSFW content asynchronously with error handling
				validFiles.forEach(async (file, index) => {
					const fileId = `${file.name}-${index}`;
					try {
						const isNSFW = await checkImage(file);

						// Remove from scanning
						setScanningImages((prev) => prev.filter((id) => id !== fileId));

						if (isNSFW) {
							// Remove unsafe image from state
							if (mode === "edit") {
								setEditedImages((prev) => prev.filter((img) => img !== file));
							} else {
								setSelectedImages((prev) => prev.filter((img) => img !== file));
							}

							// Show error message
							Swal.fire({
								icon: "error",
								title: "Inappropriate Content Detected",
								text: `"${file.name}" contains inappropriate content and has been removed.`,
								confirmButtonText: "OK",
								confirmButtonColor: "#eab308",
							});
						}
					} catch (error) {
						console.error("Error checking image for NSFW:", file.name, error);
						// Remove from scanning even on error
						setScanningImages((prev) => prev.filter((id) => id !== fileId));
						// Don't remove the image on error - assume it's safe
					}
				});
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
								<span className="hidden xs:inline">Back to Products</span>
								<span className="xs:hidden">Back</span>
							</button>

							<div className="mb-6">
								<h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 break-words leading-tight mb-2">
									Add New Product
								</h1>
								<p className="text-gray-600 text-xs sm:text-sm">
									Create a new product listing for your store
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
							{/* Main Content */}
							<div className="lg:col-span-3 space-y-3 sm:space-y-4 lg:space-y-6">
								<Form>
									{/* Basic Information Section */}
									<div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
										<h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
											Basic Information
										</h2>

										<div className="space-y-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Product Title *
												</label>
												<input
													type="text"
													name="title"
													value={formValues.title}
													onChange={handleFormChange}
													className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
														formErrors.title
															? "border-red-300"
															: "border-gray-300"
													}`}
													placeholder="Enter a descriptive product title"
												/>
												{formErrors.title && (
													<p className="text-red-600 text-sm mt-1">
														{formErrors.title}
													</p>
												)}
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Brand *
													</label>
													<input
														type="text"
														name="brand"
														value={formValues.brand}
														onChange={handleFormChange}
														className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
															formErrors.brand
																? "border-red-300"
																: "border-gray-300"
														}`}
														placeholder="Enter brand name"
													/>
													{formErrors.brand && (
														<p className="text-red-600 text-sm mt-1">
															{formErrors.brand}
														</p>
													)}
												</div>

												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Manufacturer *
													</label>
													<input
														type="text"
														name="manufacturer"
														value={formValues.manufacturer}
														onChange={handleFormChange}
														className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
															formErrors.manufacturer
																? "border-red-300"
																: "border-gray-300"
														}`}
														placeholder="Enter manufacturer name"
													/>
													{formErrors.manufacturer && (
														<p className="text-red-600 text-sm mt-1">
															{formErrors.manufacturer}
														</p>
													)}
												</div>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Product Description *
												</label>
												<textarea
													name="description"
													value={formValues.description}
													onChange={handleFormChange}
													rows={4}
													className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors resize-none ${
														formErrors.description
															? "border-red-300"
															: "border-gray-300"
													}`}
													placeholder="Describe your product in detail..."
												/>
												{formErrors.description && (
													<p className="text-red-600 text-sm mt-1">
														{formErrors.description}
													</p>
												)}
											</div>
										</div>
									</div>

									{/* Images Section */}
									<div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
										<div className="flex justify-between items-center mb-3 sm:mb-4">
											<h2 className="text-base sm:text-lg font-semibold text-gray-900">
												Product Images
											</h2>
											<div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
												<span>{selectedImages.length}/3</span>
											</div>
										</div>

										{/* Images Grid */}
										<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4">
											{/* Selected Images */}
											{selectedImages.map((image, index) => {
												const fileId = `${image.name}-${index}`;
												const isScanning = scanningImages.includes(fileId);

												return (
													<div
														key={index}
														className="relative bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-yellow-300"
													>
														<div className="relative bg-white aspect-square">
															<img
																src={URL.createObjectURL(image)}
																alt={`Preview ${index + 1}`}
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
																	onClick={() => removeImage(index)}
																	className="w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
																	title="Remove image"
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

											{/* Upload Area */}
											{selectedImages.length < 3 && (
												<div className="relative bg-gray-50 rounded-lg overflow-hidden">
													<input
														type="file"
														multiple
														accept="image/*"
														onChange={(e) => handleFileSelect(e.target.files)}
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
										{selectedImages.length === 0 && (
											<div className="text-center py-6 sm:py-8 text-gray-500">
												<FontAwesomeIcon
													icon={faBox}
													className="text-4xl sm:text-6xl mb-3 sm:mb-4 text-gray-300"
												/>
												<p className="text-sm sm:text-base text-gray-500 mb-4">
													No images selected
												</p>
												<label
													htmlFor="image-upload-input"
													className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600 transition-colors cursor-pointer"
												>
													<FontAwesomeIcon icon={faBox} className="mr-2" />
													Select Images
												</label>
											</div>
										)}
									</div>
								</Form>
							</div>

							{/* Sidebar */}
							<div className="lg:col-span-2 space-y-3 sm:space-y-4 lg:space-y-6">
								{/* Price & Inventory */}
								<div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
									<h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
										Pricing & Inventory
									</h2>
									<div className="space-y-3">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Price (Kshs) *
											</label>
											<div className="relative">
												<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
													Ksh
												</span>
												<input
													type="number"
													name="price"
													value={formValues.price}
													onChange={handleFormChange}
													className={`w-full pl-12 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
														formErrors.price
															? "border-red-300"
															: "border-gray-300"
													}`}
													placeholder="0.00"
												/>
											</div>
											{formErrors.price && (
												<p className="text-red-600 text-sm mt-1">
													{formErrors.price}
												</p>
											)}
										</div>
									</div>
								</div>

								{/* Product Details */}
								<div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
									<h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
										Product Details
									</h2>
									<div className="space-y-3">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Condition *
											</label>
											<select
												name="condition"
												value={formValues.condition}
												onChange={handleFormChange}
												className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white ${
													formErrors.condition
														? "border-red-300"
														: "border-gray-300"
												}`}
											>
												<option value="">Select condition</option>
												<option value="brand_new">Brand New</option>
												<option value="second_hand">Second Hand</option>
												<option value="refurbished">Refurbished</option>
											</select>
											{formErrors.condition && (
												<p className="text-red-600 text-sm mt-1">
													{formErrors.condition}
												</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Category *
											</label>
											<select
												value={selectedCategory}
												onChange={handleCategoryChange}
												className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white ${
													formErrors.category
														? "border-red-300"
														: "border-gray-300"
												}`}
											>
												<option value="">Select category</option>
												{categories.map((category) => (
													<option key={category.id} value={category.id}>
														{category.name}
													</option>
												))}
											</select>
											{formErrors.category && (
												<p className="text-red-600 text-sm mt-1">
													{formErrors.category}
												</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Subcategory *
											</label>
											<select
												value={selectedSubcategory}
												onChange={handleSubcategoryChange}
												disabled={!selectedCategory}
												className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white disabled:bg-gray-50 disabled:text-gray-400 ${
													formErrors.subcategory
														? "border-red-300"
														: "border-gray-300"
												}`}
											>
												<option value="">
													{!selectedCategory
														? "First select a category"
														: "Select subcategory"}
												</option>
												{subcategories.map((subcategory) => (
													<option key={subcategory.id} value={subcategory.id}>
														{subcategory.name}
													</option>
												))}
											</select>
											{formErrors.subcategory && (
												<p className="text-red-600 text-sm mt-1">
													{formErrors.subcategory}
												</p>
											)}
										</div>
									</div>
								</div>

								{/* Dimensions */}
								<div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
									<h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
										Dimensions
										<span className="text-sm text-gray-500 font-normal ml-2">
											(Optional)
										</span>
									</h2>
									<div className="space-y-3">
										<div className="grid grid-cols-3 gap-2">
											<div>
												<label className="block text-xs text-gray-600 mb-1">
													Length (cm)
												</label>
												<input
													type="number"
													name="item_length"
													value={formValues.item_length}
													onChange={handleFormChange}
													className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
													placeholder="L"
												/>
											</div>
											<div>
												<label className="block text-xs text-gray-600 mb-1">
													Width (cm)
												</label>
												<input
													type="number"
													name="item_width"
													value={formValues.item_width}
													onChange={handleFormChange}
													className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
													placeholder="W"
												/>
											</div>
											<div>
												<label className="block text-xs text-gray-600 mb-1">
													Height (cm)
												</label>
												<input
													type="number"
													name="item_height"
													value={formValues.item_height}
													onChange={handleFormChange}
													className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
													placeholder="H"
												/>
											</div>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Weight
											</label>
											<input
												type="number"
												name="item_weight"
												value={formValues.item_weight}
												onChange={handleFormChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
												placeholder="Enter weight"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Weight Unit
											</label>
											<div className="flex gap-2">
												<button
													type="button"
													onClick={() => handleAddWeightUnitChange("Grams")}
													className={`flex-1 py-2 px-3 text-sm border rounded-md font-medium transition-colors ${
														weightUnit === "Grams"
															? "bg-yellow-500 text-white border-yellow-500"
															: "bg-white text-gray-700 border-gray-300 hover:border-yellow-400"
													}`}
												>
													Grams
												</button>
												<button
													type="button"
													onClick={() => handleAddWeightUnitChange("Kilograms")}
													className={`flex-1 py-2 px-3 text-sm border rounded-md font-medium transition-colors ${
														weightUnit === "Kilograms"
															? "bg-yellow-500 text-white border-yellow-500"
															: "bg-white text-gray-700 border-gray-300 hover:border-yellow-400"
													}`}
												>
													Kilograms
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Upload Progress and Action Buttons */}
						<div className="lg:col-span-5 mt-6">
							{uploading && (
								<div className="bg-white rounded-lg shadow-sm p-4 mb-4">
									<div className="flex items-center justify-between mb-3">
										<h4 className="text-base font-semibold text-gray-900">
											Creating Product...
										</h4>
										<span className="text-gray-700 font-medium">
											{uploadProgress}%
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
											style={{ width: `${uploadProgress}%` }}
										/>
									</div>
									<p className="text-gray-600 text-sm mt-2">
										Please wait while we create your product listing...
									</p>
								</div>
							)}

							<div className="bg-white rounded-lg shadow-sm p-4">
								<div className="flex flex-col sm:flex-row gap-3 justify-end">
									<button
										type="button"
										onClick={() => navigate("/seller/ads")}
										disabled={uploading}
										className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Cancel
									</button>
									<button
										type="button"
										onClick={handleAddNewAd}
										disabled={uploading}
										className="px-6 py-2 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{uploading ? "Creating Product..." : "Create Product"}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AddNewAd;
