import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	AlertCircle,
	Send,
	FileText,
	Bug,
	Lightbulb,
	Shield,
	Zap,
	Palette,
	HelpCircle,
	User,
	CheckCircle,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

const IssueSubmission = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		reporter_name: "",
		reporter_email: "",
		category: "bug",
		priority: "medium",
		status: "pending",
		device_uuid: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState({});
	const [success, setSuccess] = useState(false);
	const [user, setUser] = useState(null);

	const categories = [
		{ value: "bug", label: "Bug Report", icon: Bug, color: "text-red-600" },
		{
			value: "feature_request",
			label: "Feature Request",
			icon: Lightbulb,
			color: "text-green-600",
		},
		{
			value: "improvement",
			label: "Improvement",
			icon: Zap,
			color: "text-blue-600",
		},
		{
			value: "security",
			label: "Security Issue",
			icon: Shield,
			color: "text-purple-600",
		},
		{
			value: "performance",
			label: "Performance",
			icon: Zap,
			color: "text-yellow-600",
		},
		{ value: "ui_ux", label: "UI/UX", icon: Palette, color: "text-pink-600" },
		{
			value: "other",
			label: "Other",
			icon: HelpCircle,
			color: "text-gray-600",
		},
	];

	// Generate device UUID and check user authentication
	useEffect(() => {
		// Generate or retrieve device UUID
		let deviceUuid = localStorage.getItem("device_uuid");
		if (!deviceUuid) {
			deviceUuid =
				"device_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
			localStorage.setItem("device_uuid", deviceUuid);
		}
		setFormData((prev) => ({ ...prev, device_uuid: deviceUuid }));

		// Check if user is logged in
		const token = localStorage.getItem("token");
		const userData = localStorage.getItem("user");
		if (token && userData) {
			try {
				const user = JSON.parse(userData);
				setUser(user);
				// Pre-fill form with user data
				setFormData((prev) => ({
					...prev,
					reporter_name: user.fullname || user.name || "",
					reporter_email: user.email || "",
				}));
			} catch (error) {
				console.error("Error parsing user data:", error);
			}
		}
	}, []);

	const priorities = [
		{ value: "low", label: "Low", color: "bg-gray-100 text-gray-800" },
		{ value: "medium", label: "Medium", color: "bg-blue-100 text-blue-800" },
		{ value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
		{ value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
	];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.title.trim()) {
			newErrors.title = "Title is required";
		} else if (formData.title.trim().length < 5) {
			newErrors.title = "Title must be at least 5 characters";
		}

		if (!formData.description.trim()) {
			newErrors.description = "Description is required";
		} else if (formData.description.trim().length < 10) {
			newErrors.description = "Description must be at least 10 characters";
		}

		if (!formData.reporter_name.trim()) {
			newErrors.reporter_name = "Name is required";
		}

		if (!formData.reporter_email.trim()) {
			newErrors.reporter_email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.reporter_email)) {
			newErrors.reporter_email = "Please enter a valid email address";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);
		setErrors({});

		try {
			// Make actual API call to backend
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/issues`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ issue: formData }),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.errors?.join(", ") || "Failed to submit issue"
				);
			}

			const result = await response.json();
			console.log("Issue submitted successfully:", result);

			setSuccess(true);
			setFormData({
				title: "",
				description: "",
				reporter_name: "",
				reporter_email: "",
				category: "bug",
				priority: "medium",
				status: "pending",
			});
		} catch (error) {
			console.error("Error submitting issue:", error);
			setErrors({
				submit: error.message || "Network error. Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (success) {
		return (
			<>
				<Helmet>
					<title>Issue Submitted Successfully | Carbon Cube Kenya</title>
					<meta
						name="description"
						content="Your issue has been successfully submitted to Carbon Cube Kenya. We'll review it and get back to you soon. Thank you for helping us improve our platform."
					/>
					<meta
						name="keywords"
						content="issue submitted, Carbon Cube Kenya, support, feedback, bug report, feature request"
					/>
					<meta
						property="og:title"
						content="Issue Submitted Successfully | Carbon Cube Kenya"
					/>
					<meta
						property="og:description"
						content="Your issue has been successfully submitted to Carbon Cube Kenya. We'll review it and get back to you soon."
					/>
					<meta property="og:type" content="website" />
					<meta
						property="og:url"
						content={`${window.location.origin}/report-issue`}
					/>
					<script type="application/ld+json">
						{JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebPage",
							name: "Issue Submitted Successfully",
							description:
								"Issue submission confirmation page for Carbon Cube Kenya",
							url: `${window.location.origin}/report-issue`,
							mainEntity: {
								"@type": "Organization",
								name: "Carbon Cube Kenya",
								url: "https://carboncube-ke.com",
							},
						})}
					</script>
				</Helmet>
				<div className="min-h-screen bg-gray-50 flex flex-col">
					<Navbar
						mode="minimal"
						showSearch={false}
						showCategories={false}
						showUserMenu={false}
						showCart={false}
						showWishlist={false}
					/>

					<div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
						<div className="max-w-2xl mx-auto text-center">
							<div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
								<div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
									<CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
								</div>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
									Issue Submitted Successfully!
								</h2>
								<p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
									Thank you for reporting this issue. We've received your
									submission and will review it shortly. You should receive a
									confirmation email within a few minutes.
								</p>
								<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
									<button
										onClick={() => setSuccess(false)}
										className="px-4 py-2 sm:px-6 sm:py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm sm:text-base font-medium"
									>
										Submit Another Issue
									</button>
									<button
										onClick={() => navigate("/")}
										className="px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
									>
										Return to Homepage
									</button>
								</div>
							</div>
						</div>
					</div>

					<Footer />
				</div>
			</>
		);
	}

	return (
		<>
			<Helmet>
				<title>
					Report an Issue | Carbon Cube Kenya | Bug Reports & Feature Requests
				</title>
				<meta
					name="description"
					content="Report bugs, suggest features, or share feedback with Carbon Cube Kenya. Help us improve our platform by submitting detailed issue reports and feature requests."
				/>
				<meta
					name="keywords"
					content="report issue, bug report, feature request, Carbon Cube Kenya, support, feedback, help, technical support, user feedback"
				/>
				<meta
					property="og:title"
					content="Report an Issue | Carbon Cube Kenya"
				/>
				<meta
					property="og:description"
					content="Report bugs, suggest features, or share feedback with Carbon Cube Kenya. Help us improve our platform."
				/>
				<meta property="og:type" content="website" />
				<meta
					property="og:url"
					content={`${window.location.origin}/report-issue`}
				/>
				<meta property="og:site_name" content="Carbon Cube Kenya" />
				<script type="application/ld+json">
					{JSON.stringify({
						"@context": "https://schema.org",
						"@type": "WebPage",
						name: "Report an Issue - Carbon Cube Kenya",
						description:
							"Submit bug reports, feature requests, and feedback to Carbon Cube Kenya",
						url: `${window.location.origin}/report-issue`,
						mainEntity: {
							"@type": "Organization",
							name: "Carbon Cube Kenya",
							url: "https://carboncube-ke.com",
							contactPoint: {
								"@type": "ContactPoint",
								contactType: "Customer Service",
								email: "info@carboncube-ke.com",
							},
						},
						potentialAction: {
							"@type": "ReportAction",
							target: {
								"@type": "EntryPoint",
								urlTemplate: `${window.location.origin}/report-issue`,
							},
						},
					})}
				</script>
			</Helmet>
			<div className="min-h-screen bg-gray-50 flex flex-col">
				<Navbar
					mode="minimal"
					showSearch={false}
					showCategories={false}
					showUserMenu={false}
					showCart={false}
					showWishlist={false}
				/>

				{/* Hero Section */}
				<section
					className="py-8 sm:py-12 lg:py-16 text-dark position-relative overflow-hidden"
					style={{ backgroundColor: "#ffc107" }}
				>
					{/* Subtle background pattern */}
					<div className="position-absolute top-0 start-0 w-100 h-100 opacity-60">
						<div
							style={{
								background:
									"repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px)",
								width: "100%",
								height: "100%",
							}}
						></div>
					</div>
					<div className="container mx-auto px-2 sm:px-4 text-center position-relative max-w-6xl">
						<div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white rounded-full mx-auto mb-4 sm:mb-6 lg:mb-8 flex items-center justify-center border-2 sm:border-4 border-black shadow-sm">
							<FontAwesomeIcon
								icon={faBug}
								className="text-black text-2xl sm:text-3xl lg:text-4xl"
							/>
						</div>
						<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-3 sm:mb-4 lg:mb-6 leading-tight">
							Report an Issue
						</h1>
						<p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-black opacity-90 mb-4 sm:mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed">
							Help us improve Carbon Cube by reporting bugs, suggesting
							features, or sharing your feedback.
						</p>
						<div
							className="bg-black text-yellow-400 rounded-full px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 inline-flex items-center gap-2 sm:gap-3 hover:bg-gray-900 transition-colors duration-300"
							onClick={() => (window.location.href = "/issues")}
							style={{ cursor: "pointer" }}
						>
							<FontAwesomeIcon
								icon={faShieldAlt}
								className="text-yellow-400 text-sm sm:text-base lg:text-lg"
							/>
							<span className="text-yellow-400 font-semibold text-sm sm:text-base lg:text-lg">
								View All Issues
							</span>
						</div>
					</div>
				</section>

				<div className="flex-1 py-6 sm:py-8 lg:py-12">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
						{/* User Status */}
						{user && (
							<div className="text-center mb-6 sm:mb-8">
								<div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-green-100 text-green-800 rounded-lg">
									<User className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
									<span className="text-xs sm:text-sm font-medium">
										Logged in as {user.fullname || user.name} (
										{user.role || "User"})
									</span>
								</div>
							</div>
						)}

						{/* Form */}
						<div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
							<form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
								{/* Title */}
								<div>
									<label
										htmlFor="title"
										className="block text-sm font-medium text-gray-700 mb-2"
									>
										Issue Title *
									</label>
									<input
										type="text"
										id="title"
										name="title"
										value={formData.title}
										onChange={handleChange}
										className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base ${
											errors.title ? "border-red-300" : "border-gray-300"
										}`}
										placeholder="Brief description of the issue"
									/>
									{errors.title && (
										<p className="mt-1 text-sm text-red-600">{errors.title}</p>
									)}
								</div>

								{/* Category and Priority */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Category *
										</label>
										<select
											name="category"
											value={formData.category}
											onChange={handleChange}
											className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
										>
											{categories.map((category) => (
												<option key={category.value} value={category.value}>
													{category.label}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Priority *
										</label>
										<select
											name="priority"
											value={formData.priority}
											onChange={handleChange}
											className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
										>
											{priorities.map((priority) => (
												<option key={priority.value} value={priority.value}>
													{priority.label}
												</option>
											))}
										</select>
									</div>
								</div>

								{/* Description */}
								<div>
									<label
										htmlFor="description"
										className="block text-sm font-medium text-gray-700 mb-2"
									>
										Description *
									</label>
									<textarea
										id="description"
										name="description"
										rows={5}
										value={formData.description}
										onChange={handleChange}
										className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base ${
											errors.description ? "border-red-300" : "border-gray-300"
										}`}
										placeholder="Please provide detailed information about the issue. Include steps to reproduce if it's a bug, or explain your feature request in detail."
									/>
									{errors.description && (
										<p className="mt-1 text-sm text-red-600">
											{errors.description}
										</p>
									)}
								</div>

								{/* Reporter Information */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
									<div>
										<label
											htmlFor="reporter_name"
											className="block text-sm font-medium text-gray-700 mb-2"
										>
											Your Name *
										</label>
										<input
											type="text"
											id="reporter_name"
											name="reporter_name"
											value={formData.reporter_name}
											onChange={handleChange}
											disabled={user}
											className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base ${
												errors.reporter_name
													? "border-red-300"
													: user
													? "border-gray-200 bg-gray-50"
													: "border-gray-300"
											}`}
											placeholder="Your full name"
										/>
										{user && (
											<p className="mt-1 text-xs sm:text-sm text-gray-500">
												Pre-filled from your account
											</p>
										)}
										{errors.reporter_name && (
											<p className="mt-1 text-sm text-red-600">
												{errors.reporter_name}
											</p>
										)}
									</div>

									<div>
										<label
											htmlFor="reporter_email"
											className="block text-sm font-medium text-gray-700 mb-2"
										>
											Your Email *
										</label>
										<input
											type="email"
											id="reporter_email"
											name="reporter_email"
											value={formData.reporter_email}
											onChange={handleChange}
											disabled={user}
											className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base ${
												errors.reporter_email
													? "border-red-300"
													: user
													? "border-gray-200 bg-gray-50"
													: "border-gray-300"
											}`}
											placeholder="your.email@example.com"
										/>
										{user && (
											<p className="mt-1 text-xs sm:text-sm text-gray-500">
												Pre-filled from your account
											</p>
										)}
										{errors.reporter_email && (
											<p className="mt-1 text-sm text-red-600">
												{errors.reporter_email}
											</p>
										)}
									</div>
								</div>

								{/* Submit Error */}
								{errors.submit && (
									<div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
										<div className="flex">
											<AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 flex-shrink-0 mt-0.5" />
											<div className="ml-3">
												<p className="text-sm text-red-800">{errors.submit}</p>
											</div>
										</div>
									</div>
								)}

								{/* Submit Button */}
								<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
									<button
										type="submit"
										disabled={isSubmitting}
										className="flex-1 inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isSubmitting ? (
											<>
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
												Submitting...
											</>
										) : (
											<>
												<Send className="w-4 h-4 mr-2" />
												Submit Issue
											</>
										)}
									</button>
									<button
										type="button"
										onClick={() => navigate("/")}
										className="px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 text-sm sm:text-base font-medium"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>

				<Footer />
			</div>
		</>
	);
};

export default IssueSubmission;
