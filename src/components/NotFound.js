import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faSearch,
	faArrowLeft,
	faShoppingCart,
	faStore,
	faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";

const NotFound = () => {
	const navigate = useNavigate();
	const [mounted, setMounted] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleGoHome = () => {
		navigate("/");
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	const handleSearch = () => {
		// Navigate to home page with empty search to show all products
		navigate("/");
	};

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			// Use the same search logic as the home page
			const params = new URLSearchParams();
			params.set("query", searchQuery.trim());
			params.set("page", "1");

			// Navigate to home page with search parameters
			navigate(`/?${params.toString()}`);
		}
	};

	return (
		<>
			<Helmet>
				<title>Page Not Found - Carbon Cube Kenya</title>
				<meta
					name="description"
					content="The page you're looking for doesn't exist. Return to Carbon Cube Kenya's homepage to continue shopping."
				/>
				<meta name="robots" content="noindex, nofollow" />
			</Helmet>

			<div className="bg-gray-50 flex flex-col">
				{/* Header */}
				<Navbar
					mode="minimal"
					showSearch={false}
					showCategories={false}
					showUserMenu={false}
					showCart={false}
					showWishlist={false}
				/>

				{/* Main Content */}
				<div className="flex-1 flex items-center justify-center px-4 py-20 min-h-screen">
					<div className="max-w-7xl mx-auto w-full">
						<div
							className={`max-w-4xl mx-auto text-center transition-all duration-700 ${
								mounted
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-8"
							}`}
						>
							{/* 404 Number */}
							<div className="mb-12">
								<div className="text-6xl md:text-7xl font-bold text-gray-300 mb-4">
									404
								</div>
								<div className="w-16 h-1 bg-yellow-500 mx-auto rounded-full"></div>
							</div>

							{/* Main Message */}
							<div className="mb-12">
								<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
									Page Not Found
								</h1>
								<p className="text-base text-gray-600 mb-8 max-w-xl mx-auto">
									The page you're looking for doesn't exist or has been moved.
									Let's get you back on track.
								</p>

								{/* Search Bar */}
								<form
									onSubmit={handleSearchSubmit}
									className="max-w-sm mx-auto mb-10"
								>
									<div className="relative">
										<input
											type="text"
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											placeholder="Search for products..."
											className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 text-sm"
										/>
										<button
											type="submit"
											className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors"
										>
											<FontAwesomeIcon icon={faSearch} className="text-sm" />
										</button>
									</div>
								</form>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
								<button
									onClick={handleGoHome}
									className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md text-sm"
								>
									<FontAwesomeIcon icon={faHome} className="mr-2 text-xs" />
									Go Home
								</button>
								<button
									onClick={handleSearch}
									className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md text-sm"
								>
									<FontAwesomeIcon icon={faSearch} className="mr-2 text-xs" />
									Browse Products
								</button>
								<button
									onClick={handleGoBack}
									className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md text-sm"
								>
									<FontAwesomeIcon
										icon={faArrowLeft}
										className="mr-2 text-xs"
									/>
									Go Back
								</button>
							</div>

							{/* Quick Links */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
								<button
									onClick={() => navigate("/")}
									className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-yellow-300 transition-all duration-200 text-left group"
								>
									<div className="text-3xl mb-3 text-gray-400 group-hover:text-yellow-500 transition-colors">
										<FontAwesomeIcon icon={faShoppingCart} />
									</div>
									<h3 className="font-medium text-gray-900 mb-2 text-sm">
										Browse Products
									</h3>
									<p className="text-gray-600 text-xs">
										Discover amazing products across all categories
									</p>
								</button>
								<button
									onClick={() => navigate("/seller-signup")}
									className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-400 transition-all duration-200 text-left group"
								>
									<div className="text-3xl mb-3 text-gray-400 group-hover:text-gray-600 transition-colors">
										<FontAwesomeIcon icon={faStore} />
									</div>
									<h3 className="font-medium text-gray-900 mb-2 text-sm">
										Start Selling
									</h3>
									<p className="text-gray-600 text-xs">
										Join our marketplace and start your business
									</p>
								</button>
								<button
									onClick={() => navigate("/faqs")}
									className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-400 transition-all duration-200 text-left group"
								>
									<div className="text-3xl mb-3 text-gray-400 group-hover:text-gray-600 transition-colors">
										<FontAwesomeIcon icon={faQuestionCircle} />
									</div>
									<h3 className="font-medium text-gray-900 mb-2 text-sm">
										Get Help
									</h3>
									<p className="text-gray-600 text-xs">
										Find answers to common questions
									</p>
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<Footer />
			</div>
		</>
	);
};

export default NotFound;
