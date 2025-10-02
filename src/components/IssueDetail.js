import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
	CheckCircle,
	Edit,
	ArrowLeft,
	XCircle,
	AlertCircle,
	Play,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const IssueDetail = ({ isAdmin = false, onLogout }) => {
	const { issueId } = useParams();
	const navigate = useNavigate();
	const [issue, setIssue] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [newComment, setNewComment] = useState("");

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

	const fetchIssue = useCallback(async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");
			const headers = {
				"Content-Type": "application/json",
			};

			if (isAdmin && token) {
				headers.Authorization = `Bearer ${token}`;
			}

			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}${
					isAdmin ? "/admin" : ""
				}/issues/${issueId}`,
				{
					headers,
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch issue");
			}

			const data = await response.json();
			setIssue(data.issue || data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [issueId, isAdmin]);

	useEffect(() => {
		fetchIssue();
	}, [fetchIssue]);

	const handleStatusUpdate = async (newStatus) => {
		if (!isAdmin) return;

		try {
			const token = localStorage.getItem("token");
			const oldStatus = issue.status;

			// Update the issue status
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/issues/${issueId}`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						issue: { status: newStatus },
					}),
				}
			);

			if (response.ok) {
				// Add a comment about the status change
				if (oldStatus && oldStatus !== newStatus) {
					const statusComment = `Status changed from ${statusLabels[oldStatus]} to ${statusLabels[newStatus]}`;

					await fetch(
						`${process.env.REACT_APP_BACKEND_URL}/admin/issues/${issueId}/add_comment`,
						{
							method: "POST",
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								comment: { content: statusComment },
							}),
						}
					);
				}

				// Refresh the issue data
				fetchIssue();
			}
		} catch (err) {
		}
	};

	const handleAddComment = async () => {
		if (!newComment.trim()) return;

		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}${
					isAdmin ? "/admin" : ""
				}/issues/${issueId}/add_comment`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						comment: { content: newComment },
					}),
				}
			);

			if (response.ok) {
				setNewComment("");
				fetchIssue();
			}
		} catch (err) {
		}
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
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading issue...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Error Loading Issue
					</h2>
					<p className="text-gray-600 mb-4">{error}</p>
					<button
						onClick={() => navigate(-1)}
						className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
					>
						Go Back
					</button>
				</div>
			</div>
		);
	}

	if (!issue) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Issue Not Found
					</h2>
					<p className="text-gray-600 mb-4">
						The issue you're looking for doesn't exist.
					</p>
					<button
						onClick={() => navigate(-1)}
						className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
					>
						Go Back
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* Navigation */}
			{isAdmin ? (
				<Navbar
					onLogout={onLogout}
					showSearch={false}
					showCategories={false}
					showUserMenu={false}
					showCart={false}
					showWishlist={false}
				/>
			) : (
				<Navbar
					showSearch={false}
					showCategories={false}
					showUserMenu={false}
					showCart={false}
					showWishlist={false}
				/>
			)}

			<div className="flex-1">
				{/* Header */}
				<div className="bg-white border-b border-gray-200">
					<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
						<div className="flex items-center justify-between py-2 sm:py-4">
							<div className="flex items-center gap-4">
								<button
									onClick={() => navigate(-1)}
									className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
								>
									<ArrowLeft className="w-5 h-5" />
								</button>
								<div>
									<h1 className="text-2xl font-bold text-gray-900">
										Issue #{issue.issue_number}
									</h1>
									<p className="text-gray-600">{issue.title}</p>
								</div>
							</div>
							{isAdmin && (
								<div className="flex items-center gap-2">
									<span
										className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${issue.status_badge_color}`}
									>
										{getStatusIcon(issue.status)}
										<span className="ml-1">{statusLabels[issue.status]}</span>
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
						{/* Issue Details */}
						<div className="lg:col-span-2">
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4 lg:p-6 mb-4 sm:mb-6">
								<div className="flex items-start gap-2 sm:gap-4 mb-4 sm:mb-6">
									<div className="flex-shrink-0">
										{getCategoryIcon(issue.category)}
									</div>
									<div className="flex-1">
										<h2 className="text-xl font-semibold text-gray-900 mb-2">
											{issue.title}
										</h2>
										<div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
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
										</div>
									</div>
								</div>

								<div className="prose max-w-none">
									<p className="text-gray-700 leading-relaxed">
										{issue.description}
									</p>
								</div>
							</div>

							{/* Timeline Stepper */}
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4 lg:p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
									Issue Timeline
								</h3>
								<div className="space-y-2 sm:space-y-4">
									{(() => {
										// Create timeline events array
										const timelineEvents = [];

										// Add issue creation event
										timelineEvents.push({
											type: "created",
											title: "Issue Created",
											description: `Issue #${issue.issue_number} was created by ${issue.reporter_name}`,
											time: issue.time_since_created,
											icon: CheckCircle,
											iconColor: "text-green-600",
											bgColor: "bg-green-100",
											date: issue.created_at,
										});

										// Add status change events from comments
										issue.comments
											?.filter((comment) =>
												comment.content.includes("Status changed")
											)
											.forEach((comment) => {
												timelineEvents.push({
													type: "status_change",
													title: "Status Updated",
													description: comment.content,
													time: comment.time_ago,
													icon: Edit,
													iconColor: "text-blue-600",
													bgColor: "bg-blue-100",
													date: comment.created_at,
												});
											});

										// Add regular comments
										issue.comments
											?.filter(
												(comment) => !comment.content.includes("Status changed")
											)
											.forEach((comment) => {
												timelineEvents.push({
													type: "comment",
													title: `${
														comment.commenter_name || comment.author_name
													} commented`,
													description: comment.content,
													time: comment.time_ago,
													icon: MessageSquare,
													iconColor: "text-gray-600",
													bgColor: "bg-gray-100",
													date: comment.created_at,
													author: comment.commenter_name || comment.author_name,
													authorRole:
														comment.commenter_type || comment.author_role,
												});
											});

										// Sort by date (oldest first)
										timelineEvents.sort(
											(a, b) => new Date(a.date) - new Date(b.date)
										);

										return timelineEvents.map((event, index) => {
											const Icon = event.icon;
											const isLast = index === timelineEvents.length - 1;

											return (
												<div key={index} className="relative">
													<div className="flex items-start gap-4">
														{/* Timeline connector line */}
														{!isLast && (
															<div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-200"></div>
														)}

														{/* Timeline icon */}
														<div
															className={`flex-shrink-0 w-8 h-8 ${event.bgColor} rounded-full flex items-center justify-center relative z-10`}
														>
															<Icon className={`w-4 h-4 ${event.iconColor}`} />
														</div>

														{/* Timeline content */}
														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-2 mb-1">
																<span className="font-medium text-gray-900">
																	{event.title}
																</span>
																<span className="text-sm text-gray-500">
																	{event.time}
																</span>
															</div>
															<p className="text-sm text-gray-600 mb-1">
																{event.description}
															</p>
															{event.author && (
																<p className="text-xs text-gray-500">
																	by {event.author} ({event.authorRole})
																</p>
															)}
														</div>
													</div>
												</div>
											);
										});
									})()}
								</div>
							</div>
						</div>

						{/* Sidebar */}
						<div className="lg:col-span-1">
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4 lg:p-6 mb-4 sm:mb-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Issue Details
								</h3>
								<div className="space-y-4">
									<div>
										<label className="text-sm font-medium text-gray-500">
											Status
										</label>
										{isAdmin ? (
											<select
												value={issue.status}
												onChange={(e) => handleStatusUpdate(e.target.value)}
												className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
											>
												{Object.entries(statusLabels).map(([value, label]) => (
													<option key={value} value={value}>
														{label}
													</option>
												))}
											</select>
										) : (
											<div className="mt-1">
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${issue.status_badge_color}`}
												>
													{getStatusIcon(issue.status)}
													<span className="ml-1">
														{statusLabels[issue.status]}
													</span>
												</span>
											</div>
										)}
									</div>

									<div>
										<label className="text-sm font-medium text-gray-500">
											Priority
										</label>
										<div className="mt-1">
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${issue.priority_badge_color}`}
											>
												{priorityLabels[issue.priority]}
											</span>
										</div>
									</div>

									<div>
										<label className="text-sm font-medium text-gray-500">
											Category
										</label>
										<div className="mt-1">
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${issue.category_badge_color}`}
											>
												{getCategoryIcon(issue.category)}
												<span className="ml-1">
													{categoryLabels[issue.category]}
												</span>
											</span>
										</div>
									</div>

									<div>
										<label className="text-sm font-medium text-gray-500">
											Reporter
										</label>
										<p className="mt-1 text-sm text-gray-900">
											{issue.reporter_name}
										</p>
									</div>

									<div>
										<label className="text-sm font-medium text-gray-500">
											Created
										</label>
										<p className="mt-1 text-sm text-gray-900">
											{issue.time_since_created} ago
										</p>
									</div>

									{issue.updated_at !== issue.created_at && (
										<div>
											<label className="text-sm font-medium text-gray-500">
												Last Updated
											</label>
											<p className="mt-1 text-sm text-gray-900">
												{issue.time_since_updated} ago
											</p>
										</div>
									)}
								</div>
							</div>

							{/* Status Timeline */}
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4 lg:p-6 mb-4 sm:mb-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
									Status History
								</h3>
								<div className="space-y-2 sm:space-y-3">
									{(() => {
										// Create status timeline events
										const statusEvents = [];

										// Add initial creation status
										statusEvents.push({
											status: "created",
											label: "Created",
											time: issue.time_since_created,
											date: issue.created_at,
											isCurrent: false,
											icon: CheckCircle,
											color: "text-green-600",
											bgColor: "bg-green-100",
										});

										// Add current status
										const currentStatusIcon =
											statusIcons[issue.status]?.icon || CheckCircle;
										statusEvents.push({
											status: issue.status,
											label: statusLabels[issue.status] || issue.status,
											time:
												issue.time_since_updated || issue.time_since_created,
											date: issue.updated_at || issue.created_at,
											isCurrent: true,
											icon: currentStatusIcon,
											color: issue.status_badge_color?.includes("green")
												? "text-green-600"
												: issue.status_badge_color?.includes("blue")
												? "text-blue-600"
												: issue.status_badge_color?.includes("red")
												? "text-red-600"
												: issue.status_badge_color?.includes("yellow")
												? "text-yellow-600"
												: "text-gray-600",
											bgColor: issue.status_badge_color?.includes("green")
												? "bg-green-100"
												: issue.status_badge_color?.includes("blue")
												? "bg-blue-100"
												: issue.status_badge_color?.includes("red")
												? "bg-red-100"
												: issue.status_badge_color?.includes("yellow")
												? "bg-yellow-100"
												: "bg-gray-100",
										});

										// Add status changes from comments
										issue.comments
											?.filter((comment) =>
												comment.content.includes("Status changed")
											)
											.forEach((comment) => {
												// Extract status from comment content
												const statusMatch = comment.content.match(
													/Status changed from \w+ to (\w+)/
												);
												if (statusMatch) {
													const status = statusMatch[1];
													const statusIcon = statusIcons[status]?.icon || Edit;
													statusEvents.push({
														status: status,
														label: statusLabels[status] || status,
														time: comment.time_ago,
														date: comment.created_at,
														isCurrent: false,
														icon: statusIcon,
														color: "text-blue-600",
														bgColor: "bg-blue-100",
													});
												}
											});

										// Sort by date (oldest first)
										statusEvents.sort(
											(a, b) => new Date(a.date) - new Date(b.date)
										);

										return statusEvents.map((event, index) => {
											const Icon = event.icon;
											const isLast = index === statusEvents.length - 1;

											return (
												<div key={index} className="relative">
													<div className="flex items-center gap-3">
														{/* Status icon */}
														<div
															className={`flex-shrink-0 w-6 h-6 ${event.bgColor} rounded-full flex items-center justify-center relative z-10`}
														>
															<Icon className={`w-3 h-3 ${event.color}`} />
														</div>

														{/* Status content */}
														<div className="flex-1 min-w-0">
															<div className="flex items-center justify-between">
																<span
																	className={`text-sm font-medium ${
																		event.isCurrent
																			? "text-gray-900"
																			: "text-gray-600"
																	}`}
																>
																	{event.label}
																</span>
																<span className="text-xs text-gray-500">
																	{event.time}
																</span>
															</div>
														</div>
													</div>

													{/* Connector line */}
													{!isLast && (
														<div className="absolute left-3 top-6 w-0.5 h-4 bg-gray-200"></div>
													)}
												</div>
											);
										});
									})()}
								</div>
							</div>

							{/* Add Comment */}
							{isAdmin && (
								<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4 lg:p-6">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">
										Add Comment
									</h3>
									<div>
										<textarea
											value={newComment}
											onChange={(e) => setNewComment(e.target.value)}
											placeholder="Add a comment..."
											rows={4}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
										/>
										<button
											onClick={handleAddComment}
											disabled={!newComment.trim()}
											className="mt-3 w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										>
											Add Comment
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Footer for non-admin users */}
			{!isAdmin && <Footer />}
		</div>
	);
};

export default IssueDetail;
