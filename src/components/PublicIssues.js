import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
	Bug,
	Lightbulb,
	Shield,
	Zap,
	Palette,
	HelpCircle,
	Clock,
	User,
	MessageSquare,
	Search,
	AlertCircle,
	CheckCircle,
	XCircle,
	Play,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PublicIssues = () => {
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filters, setFilters] = useState({
		status: "",
		category: "",
		priority: "",
		search: "",
	});

	const statusIcons = {
		pending: { icon: Clock, color: "text-yellow-600" },
		in_progress: { icon: Play, color: "text-blue-600" },
		completed: { icon: CheckCircle, color: "text-green-600" },
		closed: { icon: XCircle, color: "text-gray-600" },
		rejected: { icon: AlertCircle, color: "text-red-600" },
		urgent: { icon: AlertCircle, color: "text-red-600" },
	};

	const categoryIcons = {
		bug: { icon: Bug, color: "text-red-600" },
		feature_request: { icon: Lightbulb, color: "text-green-600" },
		improvement: { icon: Zap, color: "text-blue-600" },
		security: { icon: Shield, color: "text-purple-600" },
		performance: { icon: Zap, color: "text-yellow-600" },
		ui_ux: { icon: Palette, color: "text-pink-600" },
		other: { icon: HelpCircle, color: "text-gray-600" },
	};

	const statusLabels = {
		pending: "Pending",
		in_progress: "In Progress",
		completed: "Completed",
		closed: "Closed",
		rejected: "Rejected",
		urgent: "Urgent",
	};

	const categoryLabels = {
		bug: "Bug Report",
		feature_request: "Feature Request",
		improvement: "Improvement",
		security: "Security",
		performance: "Performance",
		ui_ux: "UI/UX",
		other: "Other",
	};

	const priorityLabels = {
		low: "Low",
		medium: "Medium",
		high: "High",
		urgent: "Urgent",
	};

	const fetchIssues = useCallback(async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams();
			if (filters.status) params.append("status", filters.status);
			if (filters.category) params.append("category", filters.category);
			if (filters.priority) params.append("priority", filters.priority);
			if (filters.search) params.append("search", filters.search);

			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/issues?${params.toString()}`
			);

			if (!response.ok) {
				throw new Error("Failed to fetch issues");
			}

			const data = await response.json();
			setIssues(data.issues || []);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [filters]);

	useEffect(() => {
		fetchIssues();
	}, [fetchIssues]);

	const handleFilterChange = (key, value) => {
		setFilters((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const getStatusIcon = (status) => {
		const { icon: Icon, color } = statusIcons[status] || statusIcons.pending;
		return <Icon className={`w-4 h-4 ${color}`} />;
	};

	const getCategoryIcon = (category) => {
		const { icon: Icon, color } =
			categoryIcons[category] || categoryIcons.other;
		return <Icon className={`w-4 h-4 ${color}`} />;
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex flex-col">
				<Navbar
					mode="minimal"
					showSearch={false}
					showCategories={false}
					showUserMenu={false}
					showCart={false}
					showWishlist={false}
				/>
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Loading issues...</p>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex flex-col">
				<Navbar
					mode="minimal"
					showSearch={false}
					showCategories={false}
					showUserMenu={false}
					showCart={false}
					showWishlist={false}
				/>
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
						<h2 className="text-xl font-semibold text-gray-900 mb-2">
							Error Loading Issues
						</h2>
						<p className="text-gray-600 mb-4">{error}</p>
						<button
							onClick={() => fetchIssues()}
							className="px-4 py-2 sm:px-6 sm:py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm sm:text-base font-medium"
						>
							Try Again
						</button>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	return (
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
						Issues & Support
					</h1>
					<p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-black opacity-90 mb-4 sm:mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed">
						Track the status of reported issues and see what we're working on.
					</p>
					<div
						className="bg-black text-yellow-400 rounded-full px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 inline-flex items-center gap-2 sm:gap-3 hover:bg-gray-900 transition-colors duration-300"
						onClick={() => (window.location.href = "/report-issue")}
						style={{ cursor: "pointer" }}
					>
						<FontAwesomeIcon
							icon={faShieldAlt}
							className="text-yellow-400 text-sm sm:text-base lg:text-lg"
						/>
						<span className="text-yellow-400 font-semibold text-sm sm:text-base lg:text-lg">
							Report New Issue
						</span>
					</div>
				</div>
			</section>

			<div className="flex-1 py-6 sm:py-8 lg:py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Action Buttons */}
					<div className="text-center mb-6 sm:mb-8">
						<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
							<Link
								to="/report-issue"
								className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm text-sm sm:text-base font-medium no-underline"
							>
								<Bug className="w-4 h-4 mr-2" />
								Report New Issue
							</Link>
							<button
								onClick={() => fetchIssues()}
								className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
							>
								<Search className="w-4 h-4 mr-2" />
								Refresh Issues
							</button>
						</div>
					</div>

					{/* Filters */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
							{/* Search */}
							<div className="lg:col-span-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
									<input
										type="text"
										placeholder="Search issues..."
										value={filters.search}
										onChange={(e) =>
											handleFilterChange("search", e.target.value)
										}
										className="w-full pl-10 pr-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
									/>
								</div>
							</div>

							{/* Status Filter */}
							<div>
								<select
									value={filters.status}
									onChange={(e) => handleFilterChange("status", e.target.value)}
									className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
								>
									<option value="">All Statuses</option>
									{Object.entries(statusLabels).map(([value, label]) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</select>
							</div>

							{/* Category Filter */}
							<div>
								<select
									value={filters.category}
									onChange={(e) =>
										handleFilterChange("category", e.target.value)
									}
									className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
								>
									<option value="">All Categories</option>
									{Object.entries(categoryLabels).map(([value, label]) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</select>
							</div>

							{/* Priority Filter */}
							<div>
								<select
									value={filters.priority}
									onChange={(e) =>
										handleFilterChange("priority", e.target.value)
									}
									className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
								>
									<option value="">All Priorities</option>
									{Object.entries(priorityLabels).map(([value, label]) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>

					{/* Issues List */}
					<div className="space-y-3 sm:space-y-4">
						{issues.length === 0 ? (
							<div className="text-center py-8 sm:py-12">
								<AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
								<h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
									No Issues Found
								</h3>
								<p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
									No issues match your current filters. Try adjusting your
									search criteria.
								</p>
								<Link
									to="/report-issue"
									className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm sm:text-base font-medium no-underline"
								>
									<Bug className="w-4 h-4 mr-2" />
									Report an Issue
								</Link>
							</div>
						) : (
							issues.map((issue) => (
								<Link
									key={issue.id}
									to={`/issues/${issue.id}`}
									className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer no-underline"
								>
									<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
										<div className="flex-1">
											<div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
												<div className="flex-shrink-0">
													{getCategoryIcon(issue.category)}
												</div>
												<div className="flex-1 min-w-0">
													<h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
														{issue.title}
													</h3>
													<p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
														{issue.description}
													</p>
												</div>
											</div>

											<div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
												<div className="flex items-center gap-1">
													<User className="w-3 h-3 sm:w-4 sm:h-4" />
													<span className="truncate">
														{issue.reporter_name}
													</span>
												</div>
												<div className="flex items-center gap-1">
													<Clock className="w-3 h-3 sm:w-4 sm:h-4" />
													<span>{issue.time_since_created} ago</span>
												</div>
												{issue.comments && issue.comments.length > 0 && (
													<div className="flex items-center gap-1">
														<MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
														<span>{issue.comments.length} comments</span>
													</div>
												)}
											</div>
										</div>

										<div className="flex flex-col sm:items-end gap-2 sm:gap-3">
											<div className="flex flex-wrap gap-1 sm:gap-2">
												<span
													className={`inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${issue.status_badge_color}`}
												>
													{getStatusIcon(issue.status)}
													<span className="ml-1 hidden sm:inline">
														{statusLabels[issue.status] || "Unknown"}
													</span>
												</span>
												<span
													className={`inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${issue.priority_badge_color}`}
												>
													<span className="hidden sm:inline">
														{priorityLabels[issue.priority] || "Unknown"}
													</span>
													<span className="sm:hidden">
														{(priorityLabels[issue.priority] || "U").charAt(0)}
													</span>
												</span>
												<span
													className={`inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${issue.category_badge_color}`}
												>
													{getCategoryIcon(issue.category)}
													<span className="ml-1 hidden sm:inline">
														{categoryLabels[issue.category] || "Unknown"}
													</span>
												</span>
											</div>

											<div className="text-xs sm:text-sm text-gray-500">
												#{issue.issue_number}
											</div>
										</div>
									</div>
								</Link>
							))
						)}
					</div>

					{/* Report Issue CTA */}
					<div className="mt-6 sm:mt-8 text-center">
						<div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
							<h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
								Need Help?
							</h3>
							<p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
								Can't find what you're looking for? Report a new issue or
								contact our support team.
							</p>
							<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
								<Link
									to="/report-issue"
									className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm sm:text-base font-medium no-underline"
								>
									<Bug className="w-4 h-4 mr-2" />
									Report New Issue
								</Link>
								<a
									href="mailto:info@carboncube-ke.com"
									className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium no-underline"
								>
									<MessageSquare className="w-4 h-4 mr-2" />
									Contact Support
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default PublicIssues;
