import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSearch,
	faFilter,
	faBars,
	faTimes,
	faChevronDown,
	faUser,
	faSignOutAlt,
	faStore,
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
import Spinner from "react-spinkit";

// Custom hook for debouncing search inputs
const useDebounce = (value, delay) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};

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
	onSidebarToggle,
	showSearch = true,
	showCategories = true,
	showUserMenu = true,
	showCart = true,
	showWishlist = true,
}) => {
	const navigate = useNavigate();
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedSubcategory, setSelectedSubcategory] = useState("All");
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [wishlistCount, setWishlistCount] = useState(0);
	const debouncedSearchQuery = useDebounce(searchQuery, 500);

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

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		const role = sessionStorage.getItem("userRole");
		const name = sessionStorage.getItem("userName");
		const email = sessionStorage.getItem("userEmail");

		setIsLoggedIn(!!token);
		setUserRole(role);
		setUserName(name || "");
		setUserEmail(email || "");

		// Fetch categories only for buyer mode or when search is enabled
		if ((mode === "buyer" || mode === "default") && showCategories) {
			fetchCategories();
		}
	}, [mode, showCategories]);

	const fetchWishlistCount = useCallback(async () => {
		if (!isLoggedIn || userRole !== "buyer") return;

		try {
			const token = sessionStorage.getItem("token");
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/buyer/wishlist/count`,
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
			console.error("Error fetching wishlist count:", error);
		}
	}, [isLoggedIn, userRole]);

	// Fetch wishlist count when user logs in
	useEffect(() => {
		if (isLoggedIn && userRole === "buyer") {
			fetchWishlistCount();
		} else {
			setWishlistCount(0);
		}
	}, [isLoggedIn, userRole, fetchWishlistCount]);

	const fetchCategories = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/buyer/categories`
			);
			if (!response.ok) throw new Error("Failed to fetch categories");

			const categoryData = await response.json();

			const subcategoryResponse = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/buyer/subcategories`
			);
			if (!subcategoryResponse.ok)
				throw new Error("Failed to fetch subcategories");

			const subcategoryData = await subcategoryResponse.json();

			const categoriesWithSubcategories = categoryData.map((category) => ({
				...category,
				subcategories: subcategoryData.filter(
					(sub) => sub.category_id === category.id
				),
			}));

			setCategories(categoriesWithSubcategories);
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	};

	const handleCategorySelect = async (categoryId) => {
		setSelectedCategory(categoryId);
		setSelectedSubcategory("All");
		setIsSearchLoading(true);
		setIsDropdownOpen(false);
		try {
			if (handleSearch) {
				await handleSearch({ preventDefault: () => {} }, categoryId, "All");
			}
		} finally {
			setIsSearchLoading(false);
		}
	};

	const handleSubcategorySelect = async (subcategoryId) => {
		setSelectedSubcategory(subcategoryId);
		setIsSearchLoading(true);
		setIsDropdownOpen(false);
		try {
			if (handleSearch) {
				await handleSearch(
					{ preventDefault: () => {} },
					selectedCategory,
					subcategoryId
				);
			}
		} finally {
			setIsSearchLoading(false);
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setIsSearchLoading(true);
		try {
			if (handleSearch) {
				await handleSearch(e, selectedCategory, selectedSubcategory);
			}
		} finally {
			setIsSearchLoading(false);
		}
	};

	// Auto-search when search term changes (debounced)
	useEffect(() => {
		if (debouncedSearchQuery !== searchQuery && handleSearch) {
			const autoSearch = async () => {
				setIsSearchLoading(true);
				try {
					await handleSearch(
						{ preventDefault: () => {} },
						selectedCategory,
						selectedSubcategory
					);
				} finally {
					setIsSearchLoading(false);
				}
			};

			if (
				debouncedSearchQuery.length > 2 ||
				debouncedSearchQuery.length === 0
			) {
				autoSearch();
			}
		}
	}, [
		debouncedSearchQuery,
		handleSearch,
		searchQuery,
		selectedCategory,
		selectedSubcategory,
	]);

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("userRole");
		sessionStorage.removeItem("userName");
		sessionStorage.removeItem("userEmail");
		setIsLoggedIn(false);
		setUserRole(null);
		setUserName("");
		setUserEmail("");
		window.location.href = "/login";
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const toggleUserMenu = () => {
		setIsUserMenuOpen(!isUserMenuOpen);
	};

	const handleNavigation = (href) => {
		navigate(href);
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
					{ href: "/admin/sellers", label: "Sellers", icon: faStore },
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
		if (!isLoggedIn) return "Guest";
		return userName || "User";
	};

	const getUserInitials = () => {
		if (!isLoggedIn || !userName) return "G";
		const names = userName.split(" ");
		if (names.length >= 2) {
			return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
		}
		return userName[0].toUpperCase();
	};

	const renderSearchBar = () => {
		if (!showSearch || mode === "minimal") return null;

		return (
			<div className="hidden md:flex items-center justify-center flex-1 min-w-0 mx-4 lg:mx-8">
				<div className="relative w-full max-w-xl lg:max-w-2xl">
					<form onSubmit={onSubmit} className="relative">
						{/* Category Dropdown */}
						<div className="absolute left-0 top-0 z-10" ref={dropdownRef}>
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
								className={`flex items-center px-3 sm:px-4 text-sm font-medium rounded-l-full border border-r-0 transition-all duration-200 h-[36px] sm:h-[42px] ${
									isDropdownOpen
										? "bg-yellow-500 text-gray-900 border-yellow-500"
										: "bg-yellow-500 text-gray-900 border-yellow-500 hover:bg-yellow-600"
								}`}
								aria-haspopup="true"
								aria-expanded={isDropdownOpen}
								aria-label="Filter categories"
							>
								<FontAwesomeIcon icon={faFilter} className="mr-1 sm:mr-2" />
								{selectedCategory === "All" && selectedSubcategory === "All" ? (
									"All"
								) : (
									<>
										{categories.find((c) => c.id === selectedCategory)?.name ||
											"Select"}
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
								<FontAwesomeIcon
									icon={faChevronDown}
									className={`ml-1 sm:ml-2 transition-transform duration-200 ${
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
							value={searchQuery || ""}
							onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
							onFocus={() => setIsSearchFocused(true)}
							onBlur={() => setIsSearchFocused(false)}
							className={`w-full pl-28 sm:pl-32 pr-10 sm:pr-12 border border-yellow-500 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 h-[36px] sm:h-[42px] text-sm ${
								isSearchFocused ? "shadow-lg" : ""
							}`}
						/>

						<button
							type="submit"
							disabled={isSearchLoading}
							className="absolute right-0 top-0 h-[36px] sm:h-[42px] w-10 sm:w-12 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-r-full font-medium disabled:opacity-50 transition-colors duration-200 flex items-center justify-center"
						>
							{isSearchLoading ? (
								<Spinner animation="border" size="sm" />
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
		if (!showUserMenu) return null;

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
						{isLoggedIn && (
							<div className="px-3 sm:px-4 py-3 border-b border-gray-200">
								<div className="flex items-center space-x-3">
									<div className="flex-shrink-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-semibold text-sm">
										{getUserInitials()}
									</div>
									<div className="flex-1 min-w-0">
										<div className="text-sm font-medium text-gray-900 truncate">
											{getDisplayName()}
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
							</button>
						))}

						{isLoggedIn && mode !== "minimal" && (
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

		// Wishlist button (for buyers)
		if (showWishlist && userRole === "buyer") {
			buttons.push(
				<button
					key="wishlist"
					onClick={() => handleNavigation("/buyer/wish_lists")}
					className="relative p-1.5 sm:p-2 text-white hover:text-yellow-400 transition-colors duration-200 rounded-lg hover:bg-gray-700"
					aria-label="Wishlist"
				>
					<FontAwesomeIcon icon={faHeart} className="text-sm sm:text-base" />
					{wishlistCount > 0 && (
						<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
							{wishlistCount > 99 ? "99+" : wishlistCount}
						</span>
					)}
				</button>
			);
		}

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
						{!isLoggedIn &&
							mode !== "minimal" &&
							getPublicLinks().length === 0 && (
								<div className="flex items-center space-x-2 lg:space-x-3">
									<button
										onClick={() => handleNavigation("/login")}
										className="inline-flex items-center px-3 sm:px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
									>
										<FontAwesomeIcon icon={faUser} className="mr-1 sm:mr-2" />
										Sign in
									</button>
								</div>
							)}

						{/* User Menu - Only show for logged in users */}
						{isLoggedIn && renderUserMenu()}
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden" ref={mobileMenuButtonRef}>
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
									<form onSubmit={onSubmit} className="relative">
										{/* Mobile Category Dropdown */}
										<div className="absolute left-0 top-0 z-10">
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													setIsDropdownOpen(!isDropdownOpen);
												}}
												className={`flex items-center px-3 text-sm font-medium rounded-l-full border border-r-0 transition-all duration-200 h-[36px] ${
													isDropdownOpen
														? "bg-yellow-500 text-gray-900 border-yellow-500"
														: "bg-yellow-500 text-gray-900 border-yellow-500 hover:bg-yellow-600"
												}`}
											>
												<FontAwesomeIcon icon={faFilter} className="mr-1" />
												{selectedCategory === "All" &&
												selectedSubcategory === "All"
													? "All"
													: categories.find((c) => c.id === selectedCategory)
															?.name || "Select"}
												<FontAwesomeIcon
													icon={faChevronDown}
													className={`ml-1 transition-transform duration-200 ${
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
											value={searchQuery || ""}
											onChange={(e) =>
												setSearchQuery && setSearchQuery(e.target.value)
											}
											className="w-full pl-24 pr-10 border border-yellow-500 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 h-[36px] text-sm"
										/>

										<button
											type="submit"
											disabled={isSearchLoading}
											className="absolute right-0 top-0 h-[36px] w-10 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-r-full font-medium disabled:opacity-50 transition-colors duration-200 flex items-center justify-center"
										>
											{isSearchLoading ? (
												<Spinner animation="border" size="sm" />
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
									</button>
								))}

								{/* Login/Signup for non-logged in users */}
								{!isLoggedIn &&
									mode !== "minimal" &&
									getPublicLinks().length === 0 && (
										<div className="flex space-x-2">
											<button
												onClick={() => handleNavigation("/login")}
												className="inline-flex items-center px-3 sm:px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
											>
												<FontAwesomeIcon icon={faStore} className="mr-2" />
												Sign in
											</button>
										</div>
									)}

								{/* Logout for logged-in users (mobile) */}
								{isLoggedIn && mode !== "minimal" && (
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
