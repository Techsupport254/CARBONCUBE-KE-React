import React, { useState, useEffect, useRef } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "react-spinkit";

// Custom hook for click outside
const useClickOutside = (ref, handler, excludeRef = null) => {
	useEffect(() => {
		const listener = (event) => {
			if (!ref.current || ref.current.contains(event.target)) {
				return;
			}
			// Don't trigger if clicking on the excluded element
			if (
				excludeRef &&
				excludeRef.current &&
				excludeRef.current.contains(event.target)
			) {
				return;
			}
			handler(event);
		};

		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, handler, excludeRef]);
};

const TopNavbar = ({ searchQuery, setSearchQuery, handleSearch }) => {
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedSubcategory, setSelectedSubcategory] = useState("All");
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	// Refs for click outside functionality
	const dropdownRef = useRef(null);
	const mobileMenuRef = useRef(null);
	const mobileMenuButtonRef = useRef(null);

	// Click outside handlers
	useClickOutside(
		mobileMenuRef,
		() => {
			if (isMobileMenuOpen) {
				setIsMobileMenuOpen(false);
				setIsDropdownOpen(false); // Also close dropdown when mobile menu closes
			}
		},
		mobileMenuButtonRef
	);

	useEffect(() => {
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

		fetchCategories();

		const token = sessionStorage.getItem("token");
		setIsLoggedIn(!!token);
	}, []);

	// Auto-search when category/subcategory changes
	const handleCategorySelect = async (categoryId) => {
		setSelectedCategory(categoryId);
		setSelectedSubcategory("All");
		setIsSearchLoading(true);
		setIsDropdownOpen(false);
		try {
			await handleSearch({ preventDefault: () => {} }, categoryId, "All");
		} finally {
			setIsSearchLoading(false);
		}
	};

	const handleSubcategorySelect = async (subcategoryId) => {
		setSelectedSubcategory(subcategoryId);
		setIsSearchLoading(true);
		setIsDropdownOpen(false);
		try {
			await handleSearch(
				{ preventDefault: () => {} },
				selectedCategory,
				subcategoryId
			);
		} finally {
			setIsSearchLoading(false);
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setIsSearchLoading(true);
		try {
			await handleSearch(e, selectedCategory, selectedSubcategory);
		} finally {
			setIsSearchLoading(false);
		}
	};

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		setIsLoggedIn(false);
		window.location.href = "/login";
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	// Close dropdown when mobile menu closes
	useEffect(() => {
		if (!isMobileMenuOpen) {
			setIsDropdownOpen(false);
		}
	}, [isMobileMenuOpen]);

	return (
		<>
			<nav className="bg-gray-800 text-white sticky top-0 z-50 shadow-lg border-b border-gray-700 w-full">
				<div className="w-full px-2 sm:px-4 lg:px-8">
					<div className="flex items-center justify-between h-12 sm:h-16">
						{/* Logo and Brand */}
						<div className="flex items-center">
							<div
								className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200"
								onClick={() => (window.location.href = "/")}
								role="button"
								tabIndex={0}
								onKeyPress={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										window.location.href = "/";
									}
								}}
							>
								<img
									src={`${process.env.PUBLIC_URL}/logo.png`}
									alt="Carboncube Logo"
									className="h-6 w-6 sm:h-8 sm:w-8"
								/>
								<span className="font-bold text-lg sm:text-xl text-white">
									ARBONCUBE
								</span>
							</div>
						</div>

						{/* Desktop Search */}
						<div className="hidden md:flex items-center justify-center flex-1 mx-4 lg:mx-8">
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
											<div className="absolute top-full left-0 mt-1 w-64 sm:w-72 bg-gray-800 rounded-lg shadow-lg border border-gray-600 z-50 max-h-[50vh] overflow-y-auto">
												<div className="p-2">
													<button
														onClick={() => handleCategorySelect("All")}
														onKeyDown={(e) => {
															if (e.key === "Enter" || e.key === " ") {
																e.preventDefault();
																handleCategorySelect("All");
															}
														}}
														className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors duration-150 text-white focus:bg-gray-700 focus:outline-none"
														tabIndex={0}
													>
														All Categories
													</button>
													{categories.map((category) => (
														<div key={category.id}>
															<button
																onClick={() =>
																	handleCategorySelect(category.id)
																}
																onKeyDown={(e) => {
																	if (e.key === "Enter" || e.key === " ") {
																		e.preventDefault();
																		handleCategorySelect(category.id);
																	}
																}}
																className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors duration-150 font-medium text-white focus:bg-gray-700 focus:outline-none"
																tabIndex={0}
															>
																{category.name}
															</button>
															{category.subcategories.length > 0 && (
																<div className="ml-4">
																	{category.subcategories.map((subcategory) => (
																		<button
																			key={subcategory.id}
																			onClick={() =>
																				handleSubcategorySelect(subcategory.id)
																			}
																			onKeyDown={(e) => {
																				if (
																					e.key === "Enter" ||
																					e.key === " "
																				) {
																					e.preventDefault();
																					handleSubcategorySelect(
																						subcategory.id
																					);
																				}
																			}}
																			className="w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-gray-700 transition-colors duration-150 text-gray-300 focus:bg-gray-700 focus:outline-none"
																			tabIndex={0}
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
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										onFocus={() => setIsSearchFocused(true)}
										onBlur={() => setIsSearchFocused(false)}
										className={`flex-1 min-w-0 px-3 sm:px-4 pr-10 sm:pr-12 border-t border-b border-yellow-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 h-[36px] sm:h-[42px] text-sm ${
											isSearchFocused ? "shadow-lg" : ""
										}`}
									/>

									{/* Search Button */}
									<button
										type="submit"
										disabled={isSearchLoading}
										className="flex-shrink-0 h-[36px] sm:h-[42px] w-10 sm:w-12 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-r-full font-medium disabled:opacity-50 transition-colors duration-200 flex items-center justify-center"
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

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-2 lg:space-x-3">
							{!isLoggedIn && (
								<div className="flex items-center space-x-2 lg:space-x-3">
									<a
										href="/login"
										className="inline-flex items-center px-3 sm:px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md no-underline"
									>
										<FontAwesomeIcon icon={faStore} className="mr-1 sm:mr-2" />
										Seller
									</a>
									<a
										href="/login"
										className="inline-flex items-center px-3 sm:px-4 py-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900 text-sm font-medium rounded-lg transition-colors duration-200 no-underline"
									>
										<FontAwesomeIcon icon={faUser} className="mr-1 sm:mr-2" />
										Sign in
									</a>
								</div>
							)}
							{isLoggedIn && (
								<button
									onClick={handleLogout}
									className="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
								>
									<FontAwesomeIcon
										icon={faSignOutAlt}
										className="mr-1 sm:mr-2"
									/>
									Sign out
								</button>
							)}
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
								<div className="relative">
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
																{category.subcategories.length > 0 && (
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
																					className="w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-gray-700 transition-colors duration-150 text-gray-300 focus:bg-gray-700 focus:outline-none"
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
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											className="flex-1 min-w-0 px-3 pr-10 border-t border-b border-yellow-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 h-[36px] text-sm"
										/>

										{/* Mobile Search Button */}
										<button
											type="submit"
											disabled={isSearchLoading}
											className="flex-shrink-0 h-[36px] w-10 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-r-full font-medium disabled:opacity-50 transition-colors duration-200 flex items-center justify-center"
										>
											{isSearchLoading ? (
												<Spinner animation="border" size="sm" />
											) : (
												<FontAwesomeIcon icon={faSearch} className="text-sm" />
											)}
										</button>
									</form>
								</div>

								{/* Mobile Navigation */}
								<div className="space-y-2">
									{!isLoggedIn && (
										<div className="flex space-x-2">
											<a
												href="/login"
												className="flex-1 flex items-center justify-center px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-medium rounded-lg transition-colors duration-200 no-underline"
											>
												<FontAwesomeIcon icon={faStore} className="mr-2" />
												Seller
											</a>
											<a
												href="/login"
												className="flex-1 flex items-center justify-center px-3 py-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900 text-sm font-medium rounded-lg transition-colors duration-200 no-underline"
											>
												<FontAwesomeIcon icon={faUser} className="mr-2" />
												Sign in
											</a>
										</div>
									)}
									{isLoggedIn && (
										<button
											onClick={handleLogout}
											className="flex items-center justify-center w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
										>
											<FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
											Sign out
										</button>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</nav>
		</>
	);
};

export default TopNavbar;
