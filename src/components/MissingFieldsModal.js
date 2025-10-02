import React, { useState, useEffect } from "react";
import { X, Phone, MapPin, User, Calendar, AlertCircle } from "lucide-react";

const MissingFieldsModal = ({
	isOpen,
	onClose,
	onSubmit,
	missingFields = [],
	userData = {},
	isLoading = false,
}) => {
	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

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
		if (isOpen) {
			// Initialize form data with any available user data
			const initialData = {
				...userData,
				phone_number: userData.phone_number || "",
				location: userData.location || "",
				city: userData.city || "",
				fullname: userData.fullname || userData.name || "",
				birthday: formatDateForInput(userData.birthday) || "",
				age_group:
					userData.age_group || calculateAgeGroup(userData.birthday) || "",
				gender: userData.gender || "",
				email: userData.email || "",
				username: userData.username || "",
				profile_picture: userData.profile_picture || "",
			};

			setFormData(initialData);
			setErrors({});
		}
	}, [isOpen, userData]);

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
			// Submit all form data, not just missing fields
			await onSubmit(formData);
		} catch (error) {
		} finally {
			setIsSubmitting(false);
		}
	};

	const getFieldIcon = (field) => {
		switch (field) {
			case "phone_number":
				return <Phone className="w-5 h-5" />;
			case "location":
			case "city":
				return <MapPin className="w-5 h-5" />;
			case "fullname":
			case "name":
				return <User className="w-5 h-5" />;
			case "birthday":
				return <Calendar className="w-5 h-5" />;
			case "age_group":
				return <Calendar className="w-5 h-5" />;
			case "email":
				return <AlertCircle className="w-5 h-5" />;
			case "gender":
				return <User className="w-5 h-5" />;
			case "username":
				return <User className="w-5 h-5" />;
			default:
				return <AlertCircle className="w-5 h-5" />;
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

		// Add all available user data fields
		Object.keys(userData).forEach((field) => {
			if (userData[field] && userData[field].toString().trim()) {
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
		];
		commonFields.forEach((field) => allFields.add(field));

		return Array.from(allFields);
	};

	const isFieldRequired = (field) => {
		return missingFields.includes(field);
	};

	// Render field input based on field type
	const renderFieldInput = (field) => {
		const commonClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${
			errors[field]
				? "border-red-500 bg-red-50"
				: "border-gray-300 hover:border-slate-400"
		}`;

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

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
			style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
		>
			<div className="relative w-full max-w-2xl mx-auto transform scale-100 animate-in fade-in-0 zoom-in-95 duration-300">
				{/* Modal Content */}
				<div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
					{/* Header */}
					<div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
									<AlertCircle className="w-6 h-6 text-yellow-400" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-white">
										Complete Your Profile
									</h3>
									<p className="text-slate-300 text-sm">
										Review and complete your account information
									</p>
								</div>
							</div>
							<button
								onClick={onClose}
								className="text-slate-300 hover:text-white transition-colors"
								disabled={isSubmitting}
							>
								<X className="w-6 h-6" />
							</button>
						</div>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="p-6">
						{/* Personal Information Section */}
						<div className="mb-6">
							<h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
								<User className="w-4 h-4 mr-2" />
								Personal Information
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{getAllFields()
									.filter((field) =>
										["fullname", "email", "username"].includes(field)
									)
									.map((field) => (
										<div key={field} className="space-y-2">
											<label className="flex items-center space-x-2 text-sm font-medium text-gray-800">
												{getFieldIcon(field)}
												<span>{getFieldLabel(field)}</span>
												{isFieldRequired(field) && (
													<span className="text-red-500">*</span>
												)}
											</label>
											{renderFieldInput(field)}
											{errors[field] && (
												<p className="text-red-500 text-sm flex items-center space-x-1">
													<AlertCircle className="w-4 h-4" />
													<span>{errors[field]}</span>
												</p>
											)}
										</div>
									))}
							</div>
						</div>

						{/* Contact Information Section */}
						<div className="mb-6">
							<h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
								<Phone className="w-4 h-4 mr-2" />
								Contact Information
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{getAllFields()
									.filter((field) =>
										["phone_number", "location", "city"].includes(field)
									)
									.map((field) => (
										<div key={field} className="space-y-2">
											<label className="flex items-center space-x-2 text-sm font-medium text-gray-800">
												{getFieldIcon(field)}
												<span>{getFieldLabel(field)}</span>
												{isFieldRequired(field) && (
													<span className="text-red-500">*</span>
												)}
											</label>
											{renderFieldInput(field)}
											{errors[field] && (
												<p className="text-red-500 text-sm flex items-center space-x-1">
													<AlertCircle className="w-4 h-4" />
													<span>{errors[field]}</span>
												</p>
											)}
										</div>
									))}
							</div>
						</div>

						{/* Demographics Section */}
						<div className="mb-6">
							<h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
								<Calendar className="w-4 h-4 mr-2" />
								Demographics
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{getAllFields()
									.filter((field) =>
										["birthday", "age_group", "gender"].includes(field)
									)
									.map((field) => (
										<div key={field} className="space-y-2">
											<label className="flex items-center space-x-2 text-sm font-medium text-gray-800">
												{getFieldIcon(field)}
												<span>{getFieldLabel(field)}</span>
												{isFieldRequired(field) && (
													<span className="text-red-500">*</span>
												)}
											</label>
											{renderFieldInput(field)}
											{errors[field] && (
												<p className="text-red-500 text-sm flex items-center space-x-1">
													<AlertCircle className="w-4 h-4" />
													<span>{errors[field]}</span>
												</p>
											)}
										</div>
									))}
							</div>
						</div>

						{/* Submit Button */}
						<div className="pt-4">
							<button
								type="submit"
								disabled={isSubmitting || isLoading}
								className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-3 px-6 rounded-lg font-medium hover:from-slate-800 hover:to-slate-700 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
							>
								{isSubmitting || isLoading ? (
									<>
										<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										<span>Creating Account...</span>
									</>
								) : (
									<span>Complete Registration</span>
								)}
							</button>
						</div>
					</form>

					{/* Footer */}
					<div className="bg-slate-50 px-6 py-4">
						<p className="text-xs text-slate-600 text-center">
							Your information is secure and will only be used to create your
							account.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MissingFieldsModal;
