import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	Phone,
	MapPin,
	User,
	Calendar,
	AlertCircle,
	ArrowLeft,
} from "lucide-react";
import Navbar from "../components/Navbar";
import LocationSelector from "../components/LocationSelector";
import locationService from "../services/locationService";
import axios from "axios";
import Swal from "sweetalert2";
import "../components/LoginForm.css";

const CompleteRegistrationPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [missingFields, setMissingFields] = useState([]);
	const [userData, setUserData] = useState({});
	const [isDetectingLocation, setIsDetectingLocation] = useState(false);
	const [locationDetected, setLocationDetected] = useState(false);

	// Format date to YYYY-MM-DD format for HTML date inputs
	const formatDateForInput = (dateString) => {
		if (!dateString) return "";

		try {
			// Handle different date formats
			let date;

			// If it's already in YYYY-M-D format, parse it directly
			if (dateString.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
				const [year, month, day] = dateString.split("-");
				date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
			} else {
				// Try parsing as a regular date
				date = new Date(dateString);
			}

			if (isNaN(date.getTime())) return "";

			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");

			return `${year}-${month}-${day}`;
		} catch (error) {
			console.error("Error formatting date:", error);
			return "";
		}
	};

	// Calculate age group from birthday
	const calculateAgeGroup = (birthday) => {
		if (!birthday) return "";

		try {
			const birthDate = new Date(birthday);
			const today = new Date();
			const age = today.getFullYear() - birthDate.getFullYear();
			const monthDiff = today.getMonth() - birthDate.getMonth();

			// Adjust age if birthday hasn't occurred this year
			const actualAge =
				monthDiff < 0 ||
				(monthDiff === 0 && today.getDate() < birthDate.getDate())
					? age - 1
					: age;

			// Map age to age group
			if (actualAge >= 18 && actualAge <= 25) return "18-25";
			if (actualAge >= 26 && actualAge <= 35) return "26-35";
			if (actualAge >= 36 && actualAge <= 45) return "36-45";
			if (actualAge >= 46 && actualAge <= 55) return "46-55";
			if (actualAge >= 56 && actualAge <= 65) return "56-65";
			if (actualAge > 65) return "65+";

			return ""; // Invalid age
		} catch (error) {
			console.error("Error calculating age group:", error);
			return "";
		}
	};

	useEffect(() => {
		// Get data from location state or localStorage
		const stateData = location.state;
		const storedData = localStorage.getItem("registrationData");

		let currentUserData = {};
		let currentMissingFields = [];

		if (stateData) {
			currentMissingFields = stateData.missingFields || [];
			currentUserData = stateData.userData || {};
			setMissingFields(currentMissingFields);
			setUserData(currentUserData);
		} else if (storedData) {
			const parsedData = JSON.parse(storedData);
			currentMissingFields = parsedData.missingFields || [];
			currentUserData = parsedData.userData || {};
			setMissingFields(currentMissingFields);
			setUserData(currentUserData);
		} else {
			// If no data, redirect back to login
			navigate("/login");
			return;
		}

		// Initialize form data with any available user data
		const initialData = {
			...currentUserData,
			phone_number: currentUserData.phone_number || "",
			location: currentUserData.location || "",
			city: currentUserData.city || "",
			fullname: currentUserData.fullname || currentUserData.name || "",
			birthday: formatDateForInput(currentUserData.birthday) || "",
			age_group:
				currentUserData.age_group ||
				calculateAgeGroup(currentUserData.birthday) ||
				"",
			gender: currentUserData.gender || "",
			email: currentUserData.email || "",
			username: currentUserData.username || "",
			profile_picture: currentUserData.profile_picture || "",
		};

		setFormData(initialData);
		setErrors({});
	}, [location.state, navigate]);

	// Detect location when component mounts and location fields are needed
	useEffect(() => {
		const needsLocationFields =
			getAllFields().includes("county_id") ||
			getAllFields().includes("sub_county_id") ||
			getAllFields().includes("city") ||
			getAllFields().includes("location");

		if (needsLocationFields && !locationDetected) {
			detectUserLocation();
		}
	}, [missingFields, userData, locationDetected]);

	const handleInputChange = (field, value) => {
		setFormData((prev) => {
			const newData = {
				...prev,
				[field]: value,
			};

			// If birthday changes, automatically calculate age group
			if (field === "birthday" && value) {
				const calculatedAgeGroup = calculateAgeGroup(value);
				if (calculatedAgeGroup) {
					newData.age_group = calculatedAgeGroup;
				}
			}

			return newData;
		});

		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({
				...prev,
				[field]: "",
			}));
		}
	};

	const validateField = (field, value) => {
		switch (field) {
			case "phone_number":
				if (!value.trim()) return "Phone number is required";
				if (!/^[0-9]{10}$/.test(value.replace(/\D/g, ""))) {
					return "Phone number must be exactly 10 digits";
				}
				return "";

			case "location":
				if (!value.trim()) return "Location is required";
				return "";

			case "city":
				if (!value.trim()) return "City is required";
				return "";

			case "fullname":
				if (!value.trim()) return "Full name is required";
				if (value.trim().length < 2)
					return "Full name must be at least 2 characters";
				return "";

			case "age_group":
				if (!value.trim()) return "Age group is required";
				return "";

			default:
				return "";
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate only required fields (missing fields)
		const newErrors = {};
		let hasErrors = false;

		missingFields.forEach((field) => {
			const value = formData[field] || "";
			const error = validateField(field, value);
			if (error) {
				newErrors[field] = error;
				hasErrors = true;
			}
		});

		if (hasErrors) {
			setErrors(newErrors);
			return;
		}

		setIsSubmitting(true);
		try {
			// Submit the form data to complete registration
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/auth/complete_registration`,
				formData
			);

			if (response.data.success) {
				// Clear stored data
				localStorage.removeItem("registrationData");

				// Store token and user data in the correct format for authentication system
				localStorage.setItem("token", response.data.token);
				localStorage.setItem("userRole", response.data.user.role);
				localStorage.setItem(
					"userName",
					response.data.user.fullname || response.data.user.name || ""
				);
				localStorage.setItem("userUsername", response.data.user.username || "");
				localStorage.setItem("userEmail", response.data.user.email || "");
				localStorage.setItem(
					"userProfilePicture",
					response.data.user.profile_picture || ""
				);

				// Trigger authentication update
				window.dispatchEvent(
					new StorageEvent("storage", {
						key: "token",
						newValue: response.data.token,
					})
				);

				// Show success message with SweetAlert
				Swal.fire({
					icon: "success",
					title: "Success!",
					text: response.data.message || "Registration completed successfully!",
					showConfirmButton: false,
					timer: 2000,
					timerProgressBar: true,
					allowOutsideClick: false,
					allowEscapeKey: false,
				}).then(() => {
					// Navigate to appropriate dashboard
					if (response.data.user.role === "buyer") {
						navigate("/");
					} else if (response.data.user.role === "seller") {
						navigate("/seller/dashboard");
					} else {
						navigate("/");
					}
				});
			}
		} catch (error) {
			console.error("Error completing registration:", error);
			if (error.response?.data?.error) {
				setErrors({ general: error.response.data.error });
			} else {
				setErrors({ general: "Registration failed. Please try again." });
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const getFieldLabel = (field) => {
		switch (field) {
			case "phone_number":
				return "Phone Number";
			case "location":
				return "Location";
			case "city":
				return "City";
			case "county_id":
				return "County";
			case "sub_county_id":
				return "Sub-County";
			case "fullname":
			case "name":
				return "Full Name";
			case "birthday":
				return "Birthday";
			case "age_group":
				return "Age Group";
			case "email":
				return "Email";
			case "gender":
				return "Gender";
			case "username":
				return "Username";
			default:
				return field
					.replace(/_/g, " ")
					.replace(/\b\w/g, (l) => l.toUpperCase());
		}
	};

	const getFieldPlaceholder = (field) => {
		switch (field) {
			case "phone_number":
				return "Enter your 10-digit phone number";
			case "location":
				return "Enter your location";
			case "city":
				return "Enter your city";
			case "county_id":
				return "Select your county";
			case "sub_county_id":
				return "Select your sub-county";
			case "fullname":
			case "name":
				return "Enter your full name";
			case "birthday":
				return "YYYY-MM-DD";
			case "age_group":
				return "Select your age group";
			case "email":
				return "Enter your email address";
			case "gender":
				return "Select your gender";
			case "username":
				return "Enter your username";
			default:
				return `Enter your ${field.replace(/_/g, " ")}`;
		}
	};

	const formatPhoneNumber = (value) => {
		// Remove all non-digits
		const digits = value.replace(/\D/g, "");
		// Limit to 10 digits
		return digits.slice(0, 10);
	};

	// Get all fields to display (both missing and prefilled)
	const getAllFields = () => {
		const allFields = new Set();

		// Add missing fields
		missingFields.forEach((field) => allFields.add(field));

		// Add all available user data fields (excluding profile_picture)
		Object.keys(userData).forEach((field) => {
			if (
				userData[field] &&
				userData[field].toString().trim() &&
				field !== "profile_picture"
			) {
				allFields.add(field);
			}
		});

		// Add common fields that should always be shown
		const commonFields = [
			"fullname",
			"email",
			"phone_number",
			"birthday",
			"age_group",
			"gender",
			"location",
			"city",
			"username",
			"county_id",
			"sub_county_id",
		];
		commonFields.forEach((field) => allFields.add(field));

		// Filter out profile_picture from final result
		return Array.from(allFields).filter((field) => field !== "profile_picture");
	};

	const isFieldRequired = (field) => {
		return missingFields.includes(field);
	};

	// Detect user location and map to county/sub-county
	const detectUserLocation = async () => {
		if (locationDetected) return;

		setIsDetectingLocation(true);
		try {
			// Get location data from multiple sources
			const locationData = await locationService.getAllLocationData();

			if (locationData && locationData.data) {
				// Try to get city from different sources
				let detectedCity = null;
				let detectedRegion = null;

				// Try browser location first
				if (locationData.data.browser_location) {
					detectedCity = locationData.data.browser_location.city;
					detectedRegion = locationData.data.browser_location.region;
				}

				// Try IP location as fallback
				if (!detectedCity && locationData.data.ip_location) {
					detectedCity = locationData.data.ip_location.city;
					detectedRegion = locationData.data.ip_location.regionName;
				}

				// Try address from coordinates
				if (!detectedCity && locationData.data.address_from_coordinates) {
					detectedCity = locationData.data.address_from_coordinates.city;
					detectedRegion = locationData.data.address_from_coordinates.region;
				}

				if (detectedCity) {
					// Map city to county and sub-county
					const mappingResult = await mapCityToCounty(
						detectedCity,
						detectedRegion
					);

					if (mappingResult) {
						// Update form data with detected location
						setFormData((prev) => ({
							...prev,
							city: detectedCity,
							location: `${detectedCity}, ${detectedRegion || "Kenya"}`,
							county_id: mappingResult.county_id,
							sub_county_id: mappingResult.sub_county_id,
						}));

						setLocationDetected(true);
					}
				}
			}
		} catch (error) {
			console.error("Location detection failed:", error);
		} finally {
			setIsDetectingLocation(false);
		}
	};

	// Map city name to county and sub-county
	const mapCityToCounty = async (city, region) => {
		try {
			// Get all counties
			const countiesResponse = await axios.get(
				`${process.env.REACT_APP_BACKEND_URL}/counties`
			);
			const counties = countiesResponse.data;

			// Normalize city name for matching
			const normalizedCity = city.toLowerCase().trim();

			// City to county mapping (similar to backend)
			const cityCountyMapping = {
				nairobi: "Nairobi",
				mombasa: "Mombasa",
				kisumu: "Kisumu",
				nakuru: "Nakuru",
				eldoret: "Uasin Gishu",
				thika: "Kiambu",
				malindi: "Kilifi",
				kitale: "Trans Nzoia",
				garissa: "Garissa",
				kakamega: "Kakamega",
				meru: "Meru",
				kisii: "Kisii",
				nyeri: "Nyeri",
				machakos: "Machakos",
				kericho: "Kericho",
				lamu: "Lamu",
				bomet: "Bomet",
				vihiga: "Vihiga",
				baringo: "Baringo",
				bungoma: "Bungoma",
				busia: "Busia",
				embu: "Embu",
				"homa bay": "Homa Bay",
				isiolo: "Isiolo",
				kajiado: "Kajiado",
				kilifi: "Kilifi",
				kirinyaga: "Kirinyaga",
				kitui: "Kitui",
				kwale: "Kwale",
				laikipia: "Laikipia",
				makueni: "Makueni",
				mandera: "Mandera",
				marsabit: "Marsabit",
				"murang'a": "Murang'a",
				muranga: "Murang'a",
				nyamira: "Nyamira",
				nyandarua: "Nyandarua",
				samburu: "Samburu",
				siaya: "Siaya",
				"taita taveta": "Taita Taveta",
				"tana river": "Tana River",
				"tharaka nithi": "Tharaka Nithi",
				"trans nzoia": "Trans Nzoia",
				turkana: "Turkana",
				"uasin gishu": "Uasin Gishu",
				wajir: "Wajir",
				"west pokot": "West Pokot",
			};

			// Try to find county by city name
			let countyName = cityCountyMapping[normalizedCity];

			// If not found, try partial matching
			if (!countyName) {
				for (const [key, value] of Object.entries(cityCountyMapping)) {
					if (normalizedCity.includes(key) || key.includes(normalizedCity)) {
						countyName = value;
						break;
					}
				}
			}

			if (countyName) {
				// Find the county in the list
				const county = counties.find((c) => c.name === countyName);
				if (county) {
					// Get sub-counties for this county
					const subCountiesResponse = await axios.get(
						`${process.env.REACT_APP_BACKEND_URL}/counties/${county.id}/sub_counties`
					);
					const subCounties = subCountiesResponse.data;

					// Use the first sub-county (or implement more sophisticated logic)
					const subCounty = subCounties[0];

					return {
						county_id: county.id,
						sub_county_id: subCounty?.id || null,
					};
				}
			}

			// Default to Nairobi if no mapping found
			const nairobiCounty = counties.find((c) => c.name === "Nairobi");
			if (nairobiCounty) {
				const subCountiesResponse = await axios.get(
					`${process.env.REACT_APP_BACKEND_URL}/counties/${nairobiCounty.id}/sub_counties`
				);
				const subCounties = subCountiesResponse.data;
				const nairobiSubCounty = subCounties[0];

				return {
					county_id: nairobiCounty.id,
					sub_county_id: nairobiSubCounty?.id || null,
				};
			}
		} catch (error) {
			console.error("County mapping failed:", error);
		}

		return null;
	};

	// Render field input based on field type
	const renderFieldInput = (field) => {
		const commonClasses = `w-full px-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
			errors[field]
				? "border-red-500 focus:ring-red-400"
				: "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
		} focus:outline-none`;

		switch (field) {
			case "phone_number":
				return (
					<input
						type="tel"
						value={formData[field] || ""}
						onChange={(e) =>
							handleInputChange(field, formatPhoneNumber(e.target.value))
						}
						placeholder={getFieldPlaceholder(field)}
						className={commonClasses}
						maxLength={10}
						disabled={isSubmitting}
					/>
				);

			case "birthday":
				return (
					<input
						type="date"
						value={formData[field] || ""}
						onChange={(e) => handleInputChange(field, e.target.value)}
						className={commonClasses}
						disabled={isSubmitting}
					/>
				);

			case "email":
				return (
					<input
						type="email"
						value={formData[field] || ""}
						onChange={(e) => handleInputChange(field, e.target.value)}
						placeholder={getFieldPlaceholder(field)}
						className={commonClasses}
						disabled={isSubmitting}
					/>
				);

			case "gender":
				return (
					<select
						value={formData[field] || ""}
						onChange={(e) => handleInputChange(field, e.target.value)}
						className={commonClasses}
						disabled={isSubmitting}
					>
						<option value="">Select your gender</option>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
						<option value="Other">Other</option>
					</select>
				);

			case "age_group":
				return (
					<select
						value={formData[field] || ""}
						onChange={(e) => handleInputChange(field, e.target.value)}
						className={commonClasses}
						disabled={isSubmitting}
					>
						<option value="">Select your age group</option>
						<option value="18-25">18-25</option>
						<option value="26-35">26-35</option>
						<option value="36-45">36-45</option>
						<option value="46-55">46-55</option>
						<option value="56-65">56-65</option>
						<option value="65+">65+</option>
					</select>
				);

			default:
				return (
					<input
						type="text"
						value={formData[field] || ""}
						onChange={(e) => handleInputChange(field, e.target.value)}
						placeholder={getFieldPlaceholder(field)}
						className={commonClasses}
						disabled={isSubmitting}
					/>
				);
		}
	};

	return (
		<>
			<Navbar mode="minimal" showSearch={false} showCategories={false} />

			<div className="login-container min-h-screen flex items-center justify-center px-2 py-4 sm:px-4 sm:py-6">
				<div className="w-full max-w-6xl xl:w-[70%] mx-auto">
					<div className="bg-white rounded-2xl overflow-hidden">
						<div className="flex flex-col lg:flex-row min-h-[600px]">
							{/* Left Branding Section */}
							<div className="hidden lg:flex lg:w-2/5 xl:w-2/5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 lg:p-6 xl:p-8 flex-col justify-between">
								{/* Header Section */}
								<div className="space-y-3 sm:space-y-4 lg:space-y-4">
									<div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 lg:mb-4">
										<img
											src="/logo.png"
											alt="CarbonCube Logo"
											className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 object-contain"
										/>
										<h2 className="text-lg sm:text-xl font-bold">
											<span className="text-white">arbon</span>
											<span className="text-yellow-400">Cube</span>
										</h2>
									</div>
									<p className="text-slate-300 text-xs sm:text-sm leading-relaxed ml-8 sm:ml-10 lg:ml-11">
										Complete your profile to access all features of CarbonCube -
										your trusted online marketplace.
									</p>
								</div>

								{/* Features Section */}
								<div className="space-y-5">
									<h5 className="text-yellow-400 text-sm font-medium">
										Why Complete Your Profile?
									</h5>
									<div className="space-y-3">
										<div className="flex items-center space-x-3">
											<div className="w-5 h-5 bg-yellow-400/20 rounded flex items-center justify-center">
												<User className="text-yellow-400 text-xs" />
											</div>
											<span className="text-slate-300 text-sm">
												Personalized shopping experience
											</span>
										</div>
										<div className="flex items-center space-x-3">
											<div className="w-5 h-5 bg-yellow-400/20 rounded flex items-center justify-center">
												<Phone className="text-yellow-400 text-xs" />
											</div>
											<span className="text-slate-300 text-sm">
												Secure account verification
											</span>
										</div>
										<div className="flex items-center space-x-3">
											<div className="w-5 h-5 bg-yellow-400/20 rounded flex items-center justify-center">
												<MapPin className="text-yellow-400 text-xs" />
											</div>
											<span className="text-slate-300 text-sm">
												Local delivery options
											</span>
										</div>
										<div className="flex items-center space-x-3">
											<div className="w-5 h-5 bg-yellow-400/20 rounded flex items-center justify-center">
												<Calendar className="text-yellow-400 text-xs" />
											</div>
											<span className="text-slate-300 text-sm">
												Age-appropriate recommendations
											</span>
										</div>
									</div>
								</div>

								{/* Vision Section */}
								<div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
									<h6 className="text-yellow-400 font-medium text-sm mb-2">
										Security
									</h6>
									<p className="text-slate-300 text-xs leading-relaxed">
										"Your information is encrypted and secure. We never share
										your personal data."
									</p>
								</div>
							</div>

							{/* Right Form Section */}
							<div className="w-full lg:w-3/5 xl:w-3/5 bg-white p-4 sm:p-6 lg:p-8 xl:p-10 flex items-center">
								<div className="w-full max-w-2xl mx-auto">
									{/* Header Section */}
									<div className="text-center mb-4 sm:mb-6">
										<button
											onClick={() => navigate("/login")}
											className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4 text-sm"
										>
											<ArrowLeft className="w-4 h-4" />
											<span>Back to Login</span>
										</button>

										<div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
											<AlertCircle className="w-8 h-8 text-white" />
										</div>
										<h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
											Complete Your Profile
										</h3>
										<p className="text-gray-600 text-sm">
											Review and complete your account information
										</p>
									</div>

									<form onSubmit={handleSubmit} className="space-y-6">
										{/* General Error */}
										{errors.general && (
											<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
												<p className="text-red-600 flex items-center space-x-2">
													<AlertCircle className="w-5 h-5 flex-shrink-0" />
													<span>{errors.general}</span>
												</p>
											</div>
										)}

										{/* Form Fields */}
										<div className="space-y-6">
											{/* Regular Fields */}
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
												{getAllFields()
													.filter(
														(field) =>
															field !== "county_id" && field !== "sub_county_id"
													)
													.map((field) => {
														return (
															<div key={field}>
																<label className="block text-sm font-medium text-gray-700 mb-2">
																	{getFieldLabel(field)}
																	{isFieldRequired(field) && (
																		<span className="text-red-500 ml-1">*</span>
																	)}
																</label>
																{renderFieldInput(field)}
																{errors[field] && (
																	<p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
																		<AlertCircle className="w-4 h-4 flex-shrink-0" />
																		<span>{errors[field]}</span>
																	</p>
																)}
															</div>
														);
													})}
											</div>

											{/* County and Sub-County Fields */}
											{(getAllFields().includes("county_id") ||
												getAllFields().includes("sub_county_id")) && (
												<div className="space-y-4">
													<div className="flex items-center justify-between">
														<h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
															<MapPin className="w-5 h-5 text-yellow-500" />
															<span>Location Details</span>
														</h4>
														{isDetectingLocation && (
															<div className="flex items-center space-x-2 text-sm text-blue-600">
																<div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
																<span>Detecting location...</span>
															</div>
														)}
														{locationDetected && !isDetectingLocation && (
															<div className="flex items-center space-x-2 text-sm text-green-600">
																<MapPin className="w-4 h-4" />
																<span>Location detected</span>
															</div>
														)}
													</div>
													<LocationSelector
														formData={formData}
														handleChange={(e) =>
															handleInputChange(e.target.name, e.target.value)
														}
														errors={errors}
														showCityInput={getAllFields().includes("city")}
														showLocationInput={getAllFields().includes(
															"location"
														)}
														optional={!isFieldRequired("county_id")}
														className=""
													/>
												</div>
											)}
										</div>

										{/* Submit Button */}
										<button
											type="submit"
											disabled={isSubmitting}
											className={`w-full font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 transform text-sm ${
												isSubmitting
													? "bg-gradient-to-r from-yellow-300 to-yellow-400 text-black scale-100 cursor-not-allowed"
													: "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black hover:scale-[1.02]"
											}`}
										>
											{isSubmitting ? (
												<>
													<div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
													Creating Account...
												</>
											) : (
												"Complete Registration"
											)}
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CompleteRegistrationPage;
