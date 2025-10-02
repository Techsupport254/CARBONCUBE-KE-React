import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, Mail, Phone } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const GoogleOAuthError = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState("");
	const [errorType, setErrorType] = useState("");

	useEffect(() => {
		// Get error from URL parameters
		const searchParams = new URLSearchParams(location.search);
		const error = searchParams.get("error");

		if (error) {
			const decodedError = decodeURIComponent(error);
			setErrorMessage(decodedError);

			// Determine error type based on message content
			if (decodedError.toLowerCase().includes("deleted")) {
				setErrorType("account_deleted");
			} else if (
				decodedError.toLowerCase().includes("blocked") ||
				decodedError.toLowerCase().includes("suspended")
			) {
				setErrorType("account_blocked");
			} else if (
				decodedError.toLowerCase().includes("invalid") ||
				decodedError.toLowerCase().includes("expired")
			) {
				setErrorType("invalid_credentials");
			} else {
				setErrorType("general_error");
			}
		} else {
			// Default error if no error parameter
			setErrorMessage("An error occurred during Google sign-in");
			setErrorType("general_error");
		}
	}, [location.search]);

	const getErrorIcon = () => {
		switch (errorType) {
			case "account_deleted":
				return <AlertCircle className="w-16 h-16 text-red-500" />;
			case "account_blocked":
				return <AlertCircle className="w-16 h-16 text-orange-500" />;
			case "invalid_credentials":
				return <AlertCircle className="w-16 h-16 text-yellow-500" />;
			default:
				return <AlertCircle className="w-16 h-16 text-red-500" />;
		}
	};

	const getErrorTitle = () => {
		switch (errorType) {
			case "account_deleted":
				return "Account Deleted";
			case "account_blocked":
				return "Account Blocked";
			case "invalid_credentials":
				return "Invalid Credentials";
			default:
				return "Sign-in Error";
		}
	};

	const getErrorDescription = () => {
		switch (errorType) {
			case "account_deleted":
				return "Your account has been deleted. If you believe this is an error, please contact our support team.";
			case "account_blocked":
				return "Your account has been temporarily blocked. Please contact support for assistance.";
			case "invalid_credentials":
				return "The provided credentials are invalid or have expired. Please try again.";
			default:
				return "We encountered an issue while processing your sign-in request.";
		}
	};

	const getErrorActions = () => {
		switch (errorType) {
			case "account_deleted":
				return (
					<div className="space-y-3 sm:space-y-4">
						<p className="text-sm sm:text-base text-gray-600">
							If you believe your account was deleted in error, our support team
							can help restore it.
						</p>
						<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
							<a
								href="mailto:info@carboncube-ke.com"
								className="inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 shadow-sm no-underline"
							>
								<Mail className="w-4 h-4 mr-1.5 sm:mr-2" />
								Email Support
							</a>
							<a
								href="tel:+254712990524"
								className="inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 shadow-sm no-underline"
							>
								<Phone className="w-4 h-4 mr-1.5 sm:mr-2" />
								Call Support
							</a>
						</div>
					</div>
				);
			case "account_blocked":
				return (
					<div className="space-y-3 sm:space-y-4">
						<p className="text-sm sm:text-base text-gray-600">
							Your account has been temporarily blocked. Contact support to
							resolve this issue.
						</p>
						<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
							<a
								href="mailto:info@carboncube-ke.com"
								className="inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 shadow-sm no-underline"
							>
								<Mail className="w-4 h-4 mr-1.5 sm:mr-2" />
								Contact Support
							</a>
						</div>
					</div>
				);
			case "invalid_credentials":
				return (
					<div className="space-y-3 sm:space-y-4">
						<p className="text-sm sm:text-base text-gray-600">
							Please try signing in again with your Google account.
						</p>
						<button
							onClick={() => navigate("/login")}
							className="inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 shadow-sm"
						>
							Try Again
						</button>
					</div>
				);
			default:
				return (
					<div className="space-y-3 sm:space-y-4">
						<p className="text-sm sm:text-base text-gray-600">
							Please try signing in again or contact support if the problem
							persists.
						</p>
						<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
							<button
								onClick={() => navigate("/login")}
								className="inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 shadow-sm"
							>
								Try Again
							</button>
							<a
								href="mailto:info@carboncube-ke.com"
								className="inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 shadow-sm no-underline"
							>
								<Mail className="w-4 h-4 mr-1.5 sm:mr-2" />
								Contact Support
							</a>
						</div>
					</div>
				);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
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
			<div className="flex-1 flex items-center justify-center px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-16 min-h-screen">
				<div className="max-w-7xl mx-auto w-full">
					<div className="max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto">
						<div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
							<div className="text-center">
								{getErrorIcon()}
								<h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
									{getErrorTitle()}
								</h2>
								<p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
									{getErrorDescription()}
								</p>
							</div>

							<div className="mt-6 sm:mt-8">
								<div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
									<div className="flex">
										<div className="flex-shrink-0">
											<AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
										</div>
										<div className="ml-2 sm:ml-3">
											<h3 className="text-xs sm:text-sm font-medium text-red-800">
												Error Details
											</h3>
											<div className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-700">
												<p>{errorMessage}</p>
											</div>
										</div>
									</div>
								</div>

								{getErrorActions()}

								<div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
									<button
										onClick={() => navigate("/")}
										className="inline-flex items-center text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
									>
										<ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
										Return to Homepage
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<Footer />
		</div>
	);
};

export default GoogleOAuthError;
