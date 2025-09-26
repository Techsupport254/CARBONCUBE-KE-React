import React, { useState, useEffect } from "react";

const GoogleSignInPopup = ({
	onLogin,
	onError,
	isAuthenticated = false,
	userRole = null,
}) => {
	const [showPopup, setShowPopup] = useState(false);
	const [hasShownPopup, setHasShownPopup] = useState(false);

	useEffect(() => {
		// Only show popup for non-authenticated users
		if (isAuthenticated) {
			setShowPopup(false);
			return;
		}

		// Check if user has previously dismissed the popup
		const dismissedPopup = localStorage.getItem(
			"google_signin_popup_dismissed"
		);
		const dismissedTime = localStorage.getItem(
			"google_signin_popup_dismissed_time"
		);

		// If dismissed within last 24 hours, don't show again
		if (dismissedPopup && dismissedTime) {
			const dismissedDate = new Date(dismissedTime);
			const now = new Date();
			const hoursSinceDismissed = (now - dismissedDate) / (1000 * 60 * 60);

			if (hoursSinceDismissed < 24) {
				console.log("🚫 Google sign-in popup was dismissed recently");
				return;
			}
		}

		// Show popup after a short delay
		const timer = setTimeout(() => {
			if (!hasShownPopup) {
				setShowPopup(true);
				setHasShownPopup(true);
			}
		}, 2000); // Show after 2 seconds

		return () => clearTimeout(timer);
	}, [isAuthenticated, hasShownPopup]);

	const handleSuccess = (token, user) => {
		console.log("🎉 Google popup authentication successful!");
		setShowPopup(false);
		if (onLogin) {
			onLogin(token, user);
		}
	};

	const handleError = (error) => {
		console.error("❌ Google popup authentication failed:", error);
		setShowPopup(false);
		if (onError) {
			onError(error);
		}
	};

	const handleDismiss = () => {
		console.log("🚫 Google sign-in popup dismissed by user");
		setShowPopup(false);

		// Remember that user dismissed the popup
		localStorage.setItem("google_signin_popup_dismissed", "true");
		localStorage.setItem(
			"google_signin_popup_dismissed_time",
			new Date().toISOString()
		);
	};

	// Don't show popup if user is authenticated or if we've already shown it
	if (isAuthenticated || !showPopup) {
		return null;
	}

	return (
		<>
			{/* Custom popup overlay for better UX */}
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
				<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
					<div className="text-center">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Welcome to Carbon Cube
						</h3>
						<p className="text-gray-600 mb-4">
							Sign in with Google for a faster experience
						</p>

						<div className="mt-4 flex justify-center space-x-3">
							<button
								onClick={handleDismiss}
								className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
							>
								Maybe later
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default GoogleSignInPopup;
