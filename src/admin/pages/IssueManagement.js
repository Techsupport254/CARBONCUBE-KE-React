import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
	Filter,
	Search,
	Plus,
	AlertCircle,
	CheckCircle,
	XCircle,
	Pause,
	Play,
	UserPlus,
	Edit,
} from "lucide-react";
import Navbar from "../../components/Navbar";

const IssueManagement = ({ onLogout }) => {
	const navigate = useNavigate();
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filters, setFilters] = useState({
		status: "",
		category: "",
		priority: "",
		assigned_to: "",
		search: "",
	});
	const [meta, setMeta] = useState({});

	const statusIcons = {
		pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
		in_progress: { icon: Play, color: "text-blue-600", bg: "bg-blue-100" },
		completed: {
			icon: CheckCircle,
			color: "text-green-600",
			bg: "bg-green-100",
		},
		closed: { icon: XCircle, color: "text-gray-600", bg: "bg-gray-100" },
		rejected: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" },
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

	useEffect(() => {
		fetchIssues();
	}, [filters]);

	const fetchIssues = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams();
			if (filters.status) params.append("status", filters.status);
			if (filters.category) params.append("category", filters.category);
			if (filters.priority) params.append("priority", filters.priority);
			if (filters.assigned_to)
				params.append("assigned_to", filters.assigned_to);
			if (filters.search) params.append("search", filters.search);

			const token = localStorage.getItem("token");
			const response = await fetch(
				`${
					process.env.REACT_APP_BACKEND_URL
				}/admin/issues?${params.toString()}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch issues");
			}

			const data = await response.json();
			setIssues(data.issues);
			setMeta(data.meta);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

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
			<div className="min-h-screen bg-gray-50">
				<Navbar
					mode="admin"
					showSearch={false}
					showCategories={false}
					onLogout={onLogout}
				/>
				<div className="flex-1 flex items-center justify-center py-12">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Loading issues...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar
				mode="admin"
				showSearch={false}
				showCategories={false}
				onLogout={onLogout}
			/>

			<div className="py-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Header */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Issue Management
							</h1>
							<p className="text-gray-600 mt-2">
								Manage and track reported issues
							</p>
						</div>
						<div className="mt-4 sm:mt-0">
							<button
								onClick={() => navigate("/report-issue")}
								className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
							>
								<Plus className="w-4 h-4 mr-2" />
								New Issue
							</button>
						</div>
					</div>

					{/* Statistics Cards */}
					{meta.status_counts && (
						<div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
							{Object.entries(meta.status_counts).map(([status, count]) => (
								<div
									key={status}
									className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
								>
									<div className="flex items-center">
										<div
											className={`p-2 rounded-lg ${
												statusIcons[status]?.bg || "bg-gray-100"
											}`}
										>
											{getStatusIcon(status)}
										</div>
										<div className="ml-3">
											<p className="text-sm font-medium text-gray-600">
												{statusLabels[status]}
											</p>
											<p className="text-2xl font-bold text-gray-900">
												{count}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Filters */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
										className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
									/>
								</div>
							</div>

							{/* Status Filter */}
							<div>
								<select
									value={filters.status}
									onChange={(e) => handleFilterChange("status", e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
								>
									<option value="">All Priorities</option>
									{Object.entries(priorityLabels).map(([value, label]) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</select>
							</div>

							{/* Assigned Filter */}
							<div>
								<select
									value={filters.assigned_to}
									onChange={(e) =>
										handleFilterChange("assigned_to", e.target.value)
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
								>
									<option value="">All Assignees</option>
									<option value="unassigned">Unassigned</option>
									{/* Add admin options here */}
								</select>
							</div>
						</div>
					</div>

					{/* Issues List */}
					<div className="space-y-4">
						{issues.length === 0 ? (
							<div className="text-center py-12">
								<AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									No Issues Found
								</h3>
								<p className="text-gray-600">
									No issues match your current filters.
								</p>
							</div>
						) : (
							issues.map((issue) => (
								<div
									key={issue.id}
									onClick={() => navigate(`/admin/issues/${issue.id}`)}
									className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
								>
									<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
										<div className="flex-1">
											<div className="flex items-start gap-3 mb-3">
												<div className="flex-shrink-0">
													{getCategoryIcon(issue.category)}
												</div>
												<div className="flex-1 min-w-0">
													<h3 className="text-lg font-semibold text-gray-900 mb-2">
														{issue.title}
													</h3>
													<p className="text-gray-600 text-sm line-clamp-2">
														{issue.description}
													</p>
												</div>
											</div>

											<div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
												<div className="flex items-center gap-1">
													<User className="w-4 h-4" />
													<span>{issue.reporter_name}</span>
												</div>
												<div className="flex items-center gap-1">
													<Clock className="w-4 h-4" />
													<span>{issue.time_since_created} ago</span>
												</div>
												{issue.comments && issue.comments.length > 0 && (
													<div className="flex items-center gap-1">
														<MessageSquare className="w-4 h-4" />
														<span>{issue.comments.length} comments</span>
													</div>
												)}
												{issue.assigned_to && (
													<div className="flex items-center gap-1">
														<UserPlus className="w-4 h-4" />
														<span>Assigned to {issue.assigned_to.name}</span>
													</div>
												)}
											</div>
										</div>

										<div className="flex flex-col sm:items-end gap-3">
											<div className="flex flex-wrap gap-2">
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${issue.status_badge_color}`}
												>
													{getStatusIcon(issue.status)}
													<span className="ml-1">
														{statusLabels[issue.status]}
													</span>
												</span>
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${issue.priority_badge_color}`}
												>
													{priorityLabels[issue.priority]}
												</span>
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${issue.category_badge_color}`}
												>
													{getCategoryIcon(issue.category)}
													<span className="ml-1">
														{categoryLabels[issue.category]}
													</span>
												</span>
											</div>

											<div className="flex items-center gap-2">
												<div className="text-sm text-gray-500">
													#{issue.issue_number}
												</div>
												<button
													onClick={(e) => {
														e.stopPropagation();
														navigate(`/admin/issues/${issue.id}`);
													}}
													className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
												>
													<Edit className="w-4 h-4" />
												</button>
											</div>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default IssueManagement;
