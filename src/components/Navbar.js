import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useNewMessageListener from "../hooks/useNewMessageListener";
import {
	faSearch,
	faFilter,
	faBars,
	faTimes,
	faChevronDown,
	faUser,
	faSignOutAlt,
	faSignInAlt,
	faTachometerAlt,
	faHome,
	faHeart,
	faCog,
	faChartBar,
	faUsers,
	faBox,
	faEnvelope,
	faList,
	faPercent,
	faShieldAlt,
	faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { CircleLoader } from "react-spinners";
import apiService from "../services/apiService";
import useAuth from "../hooks/useAuth";
import { cleanupOnLogout, clearAuthData } from "../utils/logoutUtils";

// Custom hook for click outside
const useClickOutside = (ref, handler, excludeRefs = []) => {
	useEffect(() => {
		const listener = (event) => {
			// Check if click is inside the main ref
			if (!ref.current || ref.current.contains(event.target)) {
				return;
			}

			// Check if click is inside any of the exclude refs
			for (const excludeRef of excludeRefs) {
				if (
					excludeRef &&
					excludeRef.current &&
					excludeRef.current.contains(event.target)
				) {
					return;
				}
			}

			handler(event);
		};

		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, handler, excludeRefs]);
};

const Navbar = ({
	searchQuery,
	setSearchQuery,
	handleSearch,
	mode = "default", // "default", "minimal", "buyer", "seller", "admin", "rider", "sales"
	showSearch = true,
	showCategories = true,
	showUserMenu = true,
	showCart = true,
	showWishlist = true,
	isSearchLoading = false,
	selectedCategory = "All",
	selectedSubcategory = "All",
	onCategoryChange,
	onSubcategoryChange,
	onLogout,
}) => {
	const navigate = useNavigate();
	const [categories, setCategories] = useState([]);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [wishlistCount, setWishlistCount] = useState(0);
	const [unreadMessageCount, setUnreadMessageCount] = useState(0);

	// Authentication state using custom hook
	const { isAuthenticated, userRole, userName, userUsername, userEmail } =
		useAuth();

	// Ref to debounce dropdown selections
	const dropdownDebounceRef = useRef(null);
	const isDropdownProcessingRef = useRef(false);

	// Ref to debounce search input
	const searchDebounceRef = useRef(null);

	// Listen for new messages in real-time
	const handleNewMessage = useCallback((data) => {
		// Dispatch a custom event to refresh unread count
		window.dispatchEvent(new CustomEvent("newMessage"));
	}, []);

	// Get user ID from token for real-time messaging
	const getUserId = useCallback(() => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				// Check if token has the correct JWT format (3 parts separated by dots)
				const parts = token.split(".");
				if (parts.length !== 3) {
					// Silently handle invalid JWT token format
					return null;
				}

				const payload = JSON.parse(atob(parts[1]));
				const userId =
					payload.seller_id ||
					payload.buyer_id ||
					payload.user_id ||
					payload.id;
				return userId;
			} catch (error) {
				// Silently handle token decode errors
				return null;
			}
		}
		return null;
	}, []);

	// Use the new message listener hook
	useNewMessageListener(
		userRole,
		isAuthenticated ? getUserId() : null,
		handleNewMessage
	);

	// Refs for click outside functionality
	const dropdownRef = useRef(null);
	const mobileMenuRef = useRef(null);
	const mobileMenuButtonRef = useRef(null);
	const userMenuRef = useRef(null);
	const userDropdownRef = useRef(null);

	// Click outside handlers
	useClickOutside(
		mobileMenuRef,
		() => {
			if (isMobileMenuOpen) {
				setIsMobileMenuOpen(false);
				setIsDropdownOpen(false);
				setIsUserMenuOpen(false);
			}
		},
		[mobileMenuButtonRef]
	);

	useClickOutside(
		userMenuRef,
		() => {
			setIsUserMenuOpen(false);
		},
		[userDropdownRef]
	);

	// Authentication state is now managed by parent component via props

	// Fetch categories when mode or showCategories changes
	useEffect(() => {
		if ((mode === "buyer" || mode === "default") && showCategories) {
			fetchCategories();
		}
	}, [mode, showCategories]);

	const fetchWishlistCount = useCallback(async () => {
		if (!isAuthenticated || userRole !== "buyer") return;

		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/buyer/wish_lists/count`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				setWishlistCount(data.count || 0);
			}
		} catch (error) {
			// Silently handle wishlist count errors
		}
	}, [isAuthenticated, userRole]);

	const fetchUnreadMessageCount = useCallback(async () => {
		if (!isAuthenticated || !userRole) return;

		try {
			const token = localStorage.getItem("token");
			// Use unified endpoint instead of role-specific endpoints
			const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/conversations/unread_count`;

			const response = await fetch(apiUrl, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setUnreadMessageCount(data.count || 0);
			} else {
				// Silently handle unread count fetch errors
			}
		} catch (error) {
			// Silently handle unread message count errors
		}
	}, [isAuthenticated, userRole]);

	// Fetch wishlist count when user logs in
	useEffect(() => {
		if (isAuthenticated && userRole === "buyer") {
			fetchWishlistCount();
		} else {
			setWishlistCount(0);
		}
	}, [isAuthenticated, userRole, fetchWishlistCount]);

	// Function to refresh unread message count (can be called from other components)
	const refreshUnreadMessageCount = useCallback(() => {
		if (isAuthenticated && userRole) {
			fetchUnreadMessageCount();
		}
	}, [isAuthenticated, userRole, fetchUnreadMessageCount]);

	// Expose refresh function to window for debugging
	useEffect(() => {
		window.refreshUnreadCount = refreshUnreadMessageCount;
		return () => {
			delete window.refreshUnreadCount;
		};
	}, [refreshUnreadMessageCount]);

	// Fetch unread message count when user logs in
	useEffect(() => {
		if (isAuthenticated && userRole) {
			fetchUnreadMessageCount();
		} else {
			setUnreadMessageCount(0);
		}
	}, [isAuthenticated, userRole, fetchUnreadMessageCount]);

	// Cleanup effect to clear debounce timeouts on unmount
	useEffect(() => {
		return () => {
			if (dropdownDebounceRef.current) {
				clearTimeout(dropdownDebounceRef.current);
				dropdownDebounceRef.current = null;
			}
			if (searchDebounceRef.current) {
				clearTimeout(searchDebounceRef.current);
				searchDebounceRef.current = null;
			}
			isDropdownProcessingRef.current = false;
		};
	}, []);

	// Listen for message read events and new messages to refresh unread count
	useEffect(() => {
		const handleMessageRead = () => {
			refreshUnreadMessageCount();
		};

		const handleNewMessage = () => {
			refreshUnreadMessageCount();
		};

		// Listen for custom events when messages are read or new messages arrive
		window.addEventListener("messageRead", handleMessageRead);
		window.addEventListener("messageDelivered", handleMessageRead);
		window.addEventListener("newMessage", handleNewMessage);

		return () => {
			window.removeEventListener("messageRead", handleMessageRead);
			window.removeEventListener("messageDelivered", handleMessageRead);
			window.removeEventListener("newMessage", handleNewMessage);
		};
	}, [refreshUnreadMessageCount]);

	const fetchCategories = async () => {
		try {
			const [categoryData, subcategoryData] = await apiService.batchFetch([
				`${process.env.REACT_APP_BACKEND_URL}/buyer/categories`,
				`${process.env.REACT_APP_BACKEND_URL}/buyer/subcategories`,
			]);

			const categoriesWithSubcategories = categoryData.map((category) => ({
				...category,
				subcategories: subcategoryData.filter(
					(sub) => sub.category_id === category.id
				),
			}));

			setCategories(categoriesWithSubcategories);
		} catch (error) {
			// Silently handle categories fetch errors
		}
	};

	const handleCategorySelect = async (categoryId) => {
		// Prevent multiple simultaneous selections
		if (isDropdownProcessingRef.current) {
			return;
		}

		setIsDropdownOpen(false);
		isDropdownProcessingRef.current = true;

		// Clear any existing debounce
		if (dropdownDebounceRef.current) {
			clearTimeout(dropdownDebounceRef.current);
		}

		// Debounce the category selection to prevent rapid updates
		dropdownDebounceRef.current = setTimeout(() => {
			if (onCategoryChange) {
				onCategoryChange(categoryId);
			}
			// Trigger debounced search with current query and new category
			if (searchQuery?.trim()) {
				debouncedSearch(searchQuery, categoryId, selectedSubcategory);
			}
			isDropdownProcessingRef.current = false;
		}, 150); // Increased delay to prevent rapid-fire updates
	};

	const handleSubcategorySelect = async (subcategoryId) => {
		// Prevent multiple simultaneous selections
		if (isDropdownProcessingRef.current) {
			return;
		}

		setIsDropdownOpen(false);
		isDropdownProcessingRef.current = true;

		// Clear any existing debounce
		if (dropdownDebounceRef.current) {
			clearTimeout(dropdownDebounceRef.current);
		}

		// Debounce the subcategory selection to prevent rapid updates
		dropdownDebounceRef.current = setTimeout(() => {
			if (onSubcategoryChange) {
				onSubcategoryChange(subcategoryId);
			}
			// Trigger debounced search with current query and new subcategory
			if (searchQuery?.trim()) {
				debouncedSearch(searchQuery, selectedCategory, subcategoryId);
			}
			isDropdownProcessingRef.current = false;
		}, 150); // Increased delay to prevent rapid-fire updates
	};

	// Debounced search function
	const debouncedSearch = useCallback(
		(query, category, subcategory) => {
			// Clear existing timeout
			if (searchDebounceRef.current) {
				clearTimeout(searchDebounceRef.current);
			}

			// Set new timeout for search
			searchDebounceRef.current = setTimeout(() => {
				if (handleSearch) {
					handleSearch(query, category, subcategory);
				}
			}, 500); // 500ms delay after user stops typing
		},
		[handleSearch]
	);

	// Handle search input change with debouncing
	const handleSearchInputChange = useCallback(
		(value) => {
			// Update the search query immediately for UI responsiveness
			if (setSearchQuery) {
				setSearchQuery(value);
			}

			// Trigger debounced search
			debouncedSearch(value, selectedCategory, selectedSubcategory);
		},
		[setSearchQuery, debouncedSearch, selectedCategory, selectedSubcategory]
	);

	const onSubmit = async (e) => {
		e.preventDefault();
		// Clear any pending debounced search
		if (searchDebounceRef.current) {
			clearTimeout(searchDebounceRef.current);
		}
		// Only trigger search when form is submitted (Enter key or search button click)
		if (handleSearch && searchQuery?.trim()) {
			handleSearch(searchQuery, selectedCategory, selectedSubcategory);
		}
	};

	const handleLogout = () => {
		// Reset local state first
		setUnreadMessageCount(0);
		setWishlistCount(0);
		setIsUserMenuOpen(false);
		setIsMobileMenuOpen(false);
		setIsDropdownOpen(false);

		// Clean up any pending timeouts
		if (searchDebounceRef.current) {
			clearTimeout(searchDebounceRef.current);
			searchDebounceRef.current = null;
		}
		if (dropdownDebounceRef.current) {
			clearTimeout(dropdownDebounceRef.current);
			dropdownDebounceRef.current = null;
		}

		// Call parent logout handler if available
		if (onLogout) {
			onLogout();
		}

		// Perform comprehensive cleanup
		cleanupOnLogout();
		clearAuthData();

		// Dispatch custom logout event for other components
		window.dispatchEvent(new CustomEvent("userLogout"));

		// Use React Router navigate for better state management
		navigate("/login", { replace: true });
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const toggleUserMenu = () => {
		setIsUserMenuOpen(!isUserMenuOpen);
	};

	const handleNavigation = (href) => {
		// Preserve current query parameters when navigating
		const currentParams = new URLSearchParams(window.location.search);
		const currentQuery = currentParams.toString();

		// If the href already has query parameters, don't override them
		// Otherwise, preserve the current query parameters
		if (href.includes("?") || href === "/" || href === "/login") {
			navigate(href);
		} else {
			// For other pages, preserve query parameters
			const separator = href.includes("?") ? "&" : "?";
			navigate(`${href}${currentQuery ? `${separator}${currentQuery}` : ""}`);
		}

		setIsUserMenuOpen(false);
		setIsMobileMenuOpen(false);
		setIsDropdownOpen(false);
	};

	const getNavigationLinks = () => {
		// Role-specific navigation mirrored from Sidebars
		switch (userRole) {
			case "buyer":
				return [
					{ href: "/buyer/wish_lists", label: "Wishlist", icon: faHeart },
					{ href: "/buyer/messages", label: "Messages", icon: faEnvelope },
					{ href: "/buyer/profile", label: "Profile", icon: faCog },
				];
			case "seller":
				return [
					{
						href: "/seller/dashboard",
						label: "Dashboard",
						icon: faTachometerAlt,
					},
					{ href: "/seller/ads", label: "Ads", icon: faBox },
					{ href: "/seller/analytics", label: "Analytics", icon: faChartBar },
					{ href: "/seller/messages", label: "Messages", icon: faEnvelope },
					{ href: "/seller/tiers", label: "Tiers", icon: faList },
					{ href: "/seller/profile", label: "Profile", icon: faCog },
				];
			case "admin":
				return [
					{ href: "/admin/analytics", label: "Analytics", icon: faChartBar },
					{ href: "/admin/ads", label: "Ads", icon: faBox },
					{ href: "/admin/categories", label: "Categories", icon: faList },
					{ href: "/admin/tiers", label: "Tiers", icon: faList },
					{ href: "/admin/sellers", label: "Sellers", icon: faUsers },
					{ href: "/admin/buyers", label: "Buyers", icon: faUsers },
					{ href: "/admin/content", label: "CMS", icon: faFileAlt },
					{ href: "/admin/promotions", label: "Promotions", icon: faPercent },
					{ href: "/admin/messages", label: "Messages", icon: faEnvelope },
					{
						href: "/admin/fingerprint-requests",
						label: "WhiteList",
						icon: faShieldAlt,
					},
					{ href: "/admin/profile", label: "Profile", icon: faCog },
				];
			case "sales":
				return [
					{ href: "/sales/dashboard", label: "Dashboard", icon: faChartBar },
					{ href: "/sales/reviews", label: "Reviews", icon: faEnvelope },
					{ href: "/buyer/profile", label: "Wishlist", icon: faHeart },
				];
			case "rider":
				return [
					{ href: "/rider/dashboard", label: "Dashboard", icon: faHome },
					{ href: "/rider/analytics", label: "Analytics", icon: faChartBar },
					{ href: "/rider/profile", label: "Profile", icon: faCog },
				];
			default:
				return [];
		}
	};

	const getPublicLinks = () => {
		// Public links that appear in the navbar for non-logged in users or specific modes
		if (mode === "seller" || userRole === "seller") {
			return [{ href: "/seller/tiers", label: "Tiers & Pricing" }];
		}

		if (mode === "minimal") {
			return [
				{ href: "/seller/tiers", label: "Tiers & Pricing" },
				{ href: "/terms-and-conditions", label: "Terms & Conditions" },
				{ href: "/privacy", label: "Privacy Policy" },
				{ href: "/about-us", label: "About Us" },
				{ href: "/contact-us", label: "Contact Us" },
			];
		}

		return [];
	};

	const formatRole = (role) => {
		if (!role) return "Guest";
		return role.charAt(0).toUpperCase() + role.slice(1);
	};

	const getDisplayName = () => {
		if (!isAuthenticated) return "Guest";
		return userUsername || userName || "User";
	};

	const getFullDisplayName = () => {
		if (!isAuthenticated) return "Guest";
		return userName || userUsername || "User";
	};

	const getUserInitials = () => {
		if (!isAuthenticated) return "G";
		const displayName = userName || userUsername;
		if (!displayName) return "U";

		// If it's a full name, use first letters of first and last name
		if (userName) {
			const names = displayName.split(" ");
			if (names.length >= 2) {
				return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
			}
			return displayName[0].toUpperCase();
		}

		// If it's a username (single word), use first two characters
		return displayName.substring(0, 2).toUpperCase();
	};

	const renderSearchBar = () => {
		if (!showSearch || mode === "minimal") return null;

		return (
			<div className="hidden md:flex items-center justify-center flex-1 min-w-0 mx-4 lg:mx-8">
				<div className="relative w-full max-w-xl lg:max-w-2xl">
					<form onSubmit={onSubmit} className="relative flex">
						{/* Category Dropdown */}
						<div className="relative flex-shrink-0" ref={dropdownRef}>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									setIsDropdownOpen(!isDropdownOpen);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										setIsDropdownOpen(!isDropdownOpen);
									}
								}}
								className={`flex items-center px-3 sm:px-4 text-sm font-medium rounded-l-full border border-r-0 transition-all duration-200 h-[36px] sm:h-[42px] bg-yellow-500 text-gray-900 border-yellow-500 hover:bg-yellow-600 ${
									isDropdownOpen ? "bg-yellow-600" : ""
								}`}
								aria-haspopup="true"
								aria-expanded={isDropdownOpen}
								aria-label="Filter categories"
							>
								<FontAwesomeIcon
									icon={faFilter}
									className="mr-1 sm:mr-2 flex-shrink-0"
								/>
								<span className="truncate max-w-[120px] sm:max-w-[180px] lg:max-w-[220px]">
									{selectedCategory === "All" &&
									selectedSubcategory === "All" ? (
										"All"
									) : (
										<>
											{categories.find((c) => c.id === selectedCategory)
												?.name || "Select"}
											{selectedSubcategory !== "All" && (
												<>
													{" "}
													•
													{
														categories
															.find((c) => c.id === selectedCategory)
															?.subcategories.find(
																(sc) => sc.id === selectedSubcategory
															)?.name
													}
												</>
											)}
										</>
									)}
								</span>
								<FontAwesomeIcon
									icon={faChevronDown}
									className={`ml-1 sm:ml-2 transition-transform duration-200 flex-shrink-0 ${
										isDropdownOpen ? "rotate-180" : ""
									}`}
								/>
							</button>

							{isDropdownOpen && (
								<div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-600 z-[60] max-h-[50vh] overflow-y-auto">
									<div className="p-2">
										<button
											onClick={() => {
												handleCategorySelect("All");
												setIsDropdownOpen(false);
											}}
											className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors duration-150 text-white focus:bg-gray-700 focus:outline-none"
										>
											All Categories
										</button>
										{categories.map((category) => (
											<div key={category.id}>
												<button
													onClick={() => {
														handleCategorySelect(category.id);
														setIsDropdownOpen(false);
													}}
													className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors duration-150 font-medium text-white focus:bg-gray-700 focus:outline-none"
												>
													{category.name}
												</button>
												{category.subcategories &&
													category.subcategories.length > 0 && (
														<div className="ml-4">
															{category.subcategories.map((subcategory) => (
																<button
																	key={subcategory.id}
																	onClick={() => {
																		handleSubcategorySelect(subcategory.id);
																		setIsDropdownOpen(false);
																	}}
																	className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors duration-150 text-gray-300 focus:bg-gray-700 focus:outline-none"
																>
																	• {subcategory.name}
																</button>
															))}
														</div>
													)}
											</div>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Search Input */}
						<input
							type="text"
							placeholder="Search ads..."
							value={searchQuery ?? ""}
							onChange={(e) => handleSearchInputChange(e.target.value)}
							onFocus={() => setIsSearchFocused(true)}
							onBlur={() => setIsSearchFocused(false)}
							className={`flex-1 min-w-0 px-3 sm:px-4 pr-10 sm:pr-12 border-t border-b border-yellow-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 h-[36px] sm:h-[42px] text-sm ${
								isSearchFocused ? "shadow-lg" : ""
							}`}
						/>

						<button
							type="submit"
							disabled={isSearchLoading}
							className="flex-shrink-0 h-[36px] sm:h-[42px] w-10 sm:w-12 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-r-full font-medium disabled:opacity-50 transition-colors duration-200 flex items-center justify-center"
						>
							{isSearchLoading ? (
								<CircleLoader size={16} color="#1f2937" />
							) : (
								<FontAwesomeIcon icon={faSearch} className="text-sm" />
							)}
						</button>
					</form>
				</div>
			</div>
		);
	};

	const renderUserMenu = () => {
		if (!isAuthenticated) {
			return null;
		}

		return (
			<div className="relative" ref={userMenuRef}>
				<button
					onClick={toggleUserMenu}
					className="flex items-center space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 text-white hover:text-yellow-400 hover:bg-gray-700 rounded-lg transition-colors duration-200"
					aria-label="User menu"
				>
					{/* User Avatar */}
					<div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-semibold text-sm">
						{getUserInitials()}
					</div>
					<div className="hidden lg:block text-left">
						<div className="text-xs xl:text-sm font-medium leading-tight">
							{getDisplayName()}
						</div>
						<div className="text-xs text-gray-300 leading-tight">
							{formatRole(userRole)}
						</div>
					</div>
					<FontAwesomeIcon icon={faChevronDown} className="text-xs" />
				</button>

				{isUserMenuOpen && (
					<div
						ref={userDropdownRef}
						className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
					>
						{/* User Info Header - Only show for logged in users */}
						{isAuthenticated && (
							<div className="px-3 sm:px-4 py-3 border-b border-gray-200">
								<div className="flex items-center space-x-3">
									<div className="flex-shrink-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-semibold text-sm">
										{getUserInitials()}
									</div>
									<div className="flex-1 min-w-0">
										<div className="text-sm font-medium text-gray-900 truncate">
											{getFullDisplayName()}
										</div>
										<div className="text-xs text-gray-500">
											{formatRole(userRole)}
										</div>
										{userEmail && (
											<div className="text-xs text-gray-400 truncate">
												{userEmail}
											</div>
										)}
									</div>
								</div>
							</div>
						)}

						{getNavigationLinks().map((link) => (
							<button
								key={link.href}
								onClick={() => handleNavigation(link.href)}
								className="flex items-center w-full px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm text-left"
							>
								{link.icon && (
									<FontAwesomeIcon
										icon={link.icon}
										className="mr-2 w-3 h-3 sm:w-4 sm:h-4"
									/>
								)}
								{link.label}
								{/* Show wishlist count badge for wishlist link */}
								{link.href === "/buyer/wish_lists" && wishlistCount > 0 && (
									<span className="ml-auto bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
										{wishlistCount > 99 ? "99+" : wishlistCount}
									</span>
								)}
								{/* Show unread message count badge for messages link */}
								{(link.href === "/buyer/messages" ||
									link.href === "/seller/messages" ||
									link.href === "/admin/messages") &&
									unreadMessageCount > 0 && (
										<span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg">
											{unreadMessageCount > 99 ? "99+" : unreadMessageCount}
										</span>
									)}
							</button>
						))}

						{isAuthenticated && (
							<>
								<hr className="my-2 border-gray-200" />
								<button
									onClick={handleLogout}
									className="flex items-center w-full px-3 sm:px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 text-sm"
								>
									<FontAwesomeIcon
										icon={faSignOutAlt}
										className="mr-2 w-3 h-3 sm:w-4 sm:h-4 text-red-600"
									/>
									Sign Out
								</button>
							</>
						)}
					</div>
				)}
			</div>
		);
	};

	const renderActionButtons = () => {
		const buttons = [];

		// No wishlist button in action buttons - it's now only in the dropdown
		return buttons;
	};

	return (
		<nav className="bg-gray-800 text-white sticky top-0 z-50 shadow-lg border-b border-gray-700 w-full">
			<div className="w-full px-2 sm:px-4 lg:px-8">
				<div className="flex items-center justify-between h-12 sm:h-16">
					{/* Logo and Brand */}
					<div className="flex items-center flex-shrink-0">
						<div
							className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200"
							onClick={() => handleNavigation("/")}
							role="button"
							tabIndex={0}
							onKeyPress={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									handleNavigation("/");
								}
							}}
						>
							<img
								src={`${process.env.PUBLIC_URL}/favicon.svg`}
								alt="Carboncube Logo"
								className="h-6 w-6 sm:h-8 sm:w-8"
								width="32"
								height="32"
								loading="eager"
								decoding="sync"
							/>
							<span className="font-bold text-lg sm:text-xl text-white">
								ARBONCUBE
							</span>
						</div>
					</div>

					{/* Desktop Search */}
					{renderSearchBar()}

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
						{/* Action Buttons */}
						{renderActionButtons()}

						{/* Public Links */}
						{getPublicLinks().map((link) => (
							<button
								key={link.href}
								onClick={() => handleNavigation(link.href)}
								className="text-white hover:text-yellow-400 transition-colors duration-200 text-xs xl:text-sm font-medium px-2 xl:px-3 py-2 rounded-lg hover:bg-gray-700 whitespace-nowrap"
							>
								{link.label}
							</button>
						))}

						{/* Login/Signup buttons (for non-logged in users) */}
						{!isAuthenticated &&
							mode !== "minimal" &&
							getPublicLinks().length === 0 && (
								<div className="flex items-center space-x-2 lg:space-x-3">
									<button
										id="signInButton"
										onClick={() => handleNavigation("/login")}
										className="inline-flex items-center px-3 sm:px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
									>
										<FontAwesomeIcon icon={faUser} className="mr-1 sm:mr-2" />
										Sign in
									</button>
								</div>
							)}

						{/* User Menu - Always show for logged in users */}
						{isAuthenticated && renderUserMenu()}
					</div>

					{/* Mobile menu button and sign out */}
					<div
						className="md:hidden flex items-center space-x-2"
						ref={mobileMenuButtonRef}
					>
						{/* Sign out button for mobile - always visible when logged in */}
						{isAuthenticated && (
							<button
								onClick={handleLogout}
								className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900 transition-colors duration-200"
								aria-label="Sign out"
								title="Sign out"
							>
								<FontAwesomeIcon icon={faSignOutAlt} />
							</button>
						)}

						{/* Mobile menu toggle */}
						<button
							onClick={toggleMobileMenu}
							className="w-8 h-8 flex items-center justify-center rounded-lg text-yellow-400 hover:text-yellow-300 hover:bg-gray-700 transition-colors duration-200"
							aria-label="Toggle mobile menu"
						>
							<FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
						</button>
					</div>
				</div>

				{/* Mobile menu */}
				{isMobileMenuOpen && (
					<div className="md:hidden" ref={mobileMenuRef}>
						<div className="px-2 pt-2 pb-3 space-y-3 border-t border-gray-700">
							{/* Mobile Search */}
							{showSearch && mode !== "minimal" && (
								<div className="mb-4">
									<form onSubmit={onSubmit} className="relative flex">
										{/* Mobile Category Dropdown */}
										<div className="relative flex-shrink-0">
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													setIsDropdownOpen(!isDropdownOpen);
												}}
												className={`flex items-center px-3 text-sm font-medium rounded-l-full border border-r-0 transition-all duration-200 h-[36px] bg-yellow-500 text-gray-900 border-yellow-500 hover:bg-yellow-600 ${
													isDropdownOpen ? "bg-yellow-600" : ""
												}`}
											>
												<FontAwesomeIcon
													icon={faFilter}
													className="mr-1 flex-shrink-0"
												/>
												<span className="truncate max-w-[100px]">
													{selectedCategory === "All" &&
													selectedSubcategory === "All"
														? "All"
														: categories.find((c) => c.id === selectedCategory)
																?.name || "Select"}
												</span>
												<FontAwesomeIcon
													icon={faChevronDown}
													className={`ml-1 transition-transform duration-200 flex-shrink-0 ${
														isDropdownOpen ? "rotate-180" : ""
													}`}
												/>
											</button>

											{isDropdownOpen && (
												<div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-600 z-[60] max-h-[50vh] overflow-y-auto">
													<div className="p-2">
														<button
															onClick={() => {
																handleCategorySelect("All");
																setIsDropdownOpen(false);
															}}
															className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors duration-150 text-white focus:bg-gray-700 focus:outline-none"
														>
															All Categories
														</button>
														{categories.map((category) => (
															<div key={category.id}>
																<button
																	onClick={() => {
																		handleCategorySelect(category.id);
																		setIsDropdownOpen(false);
																	}}
																	className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors duration-150 font-medium text-white focus:bg-gray-700 focus:outline-none"
																>
																	{category.name}
																</button>
																{category.subcategories &&
																	category.subcategories.length > 0 && (
																		<div className="ml-4">
																			{category.subcategories.map(
																				(subcategory) => (
																					<button
																						key={subcategory.id}
																						onClick={() => {
																							handleSubcategorySelect(
																								subcategory.id
																							);
																							setIsDropdownOpen(false);
																						}}
																						className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors duration-150 text-gray-300 focus:bg-gray-700 focus:outline-none"
																					>
																						• {subcategory.name}
																					</button>
																				)
																			)}
																		</div>
																	)}
															</div>
														))}
													</div>
												</div>
											)}
										</div>

										{/* Mobile Search Input */}
										<input
											type="text"
											placeholder="Search ads..."
											value={searchQuery ?? ""}
											onChange={(e) => handleSearchInputChange(e.target.value)}
											className="flex-1 min-w-0 px-3 pr-10 border-t border-b border-yellow-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 h-[36px] text-sm"
										/>

										<button
											type="submit"
											disabled={isSearchLoading}
											className="flex-shrink-0 h-[36px] w-10 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-r-full font-medium disabled:opacity-50 transition-colors duration-200 flex items-center justify-center"
										>
											{isSearchLoading ? (
												<CircleLoader size={16} color="#1f2937" />
											) : (
												<FontAwesomeIcon icon={faSearch} className="text-sm" />
											)}
										</button>
									</form>
								</div>
							)}

							{/* Mobile Navigation */}
							<div className="space-y-2">
								{/* Action Buttons */}
								{renderActionButtons()}

								{/* Public Links */}
								{getPublicLinks().map((link) => (
									<button
										key={link.href}
										onClick={() => handleNavigation(link.href)}
										className="flex items-center w-full px-4 py-3 text-white hover:text-yellow-400 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-sm text-left"
									>
										{link.label}
									</button>
								))}

								{/* Navigation Links */}
								{getNavigationLinks().map((link) => (
									<button
										key={link.href}
										onClick={() => handleNavigation(link.href)}
										className="flex items-center w-full px-4 py-3 text-white hover:text-yellow-400 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-sm text-left"
									>
										{link.icon && (
											<FontAwesomeIcon
												icon={link.icon}
												className="mr-3 w-4 h-4"
											/>
										)}
										{link.label}
										{/* Show wishlist count badge for wishlist link */}
										{link.href === "/buyer/wish_lists" && wishlistCount > 0 && (
											<span className="ml-auto bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
												{wishlistCount > 99 ? "99+" : wishlistCount}
											</span>
										)}
										{/* Show unread message count badge for messages link */}
										{(link.href === "/buyer/messages" ||
											link.href === "/seller/messages" ||
											link.href === "/admin/messages") &&
											unreadMessageCount > 0 && (
												<span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg">
													{unreadMessageCount > 99 ? "99+" : unreadMessageCount}
												</span>
											)}
									</button>
								))}

								{/* Login/Signup for non-logged in users */}
								{!isAuthenticated &&
									mode !== "minimal" &&
									getPublicLinks().length === 0 && (
										<div className="flex space-x-2">
											<button
												id="signInButton"
												onClick={() => handleNavigation("/login")}
												className="inline-flex items-center px-3 sm:px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
											>
												<FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
												Sign in
											</button>
										</div>
									)}

								{/* Logout for logged-in users (mobile) */}
								{isAuthenticated && (
									<>
										<hr className="my-2 border-gray-700" />
										<button
											onClick={handleLogout}
											className="flex items-center w-full px-4 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 text-sm text-left"
										>
											<FontAwesomeIcon
												icon={faSignOutAlt}
												className="mr-3 w-4 h-4"
											/>
											Sign Out
										</button>
									</>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
