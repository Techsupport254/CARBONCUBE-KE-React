import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import tokenService from "../services/tokenService";

const useAutoGoogleOneTap = (isAuthenticated, onLogin) => {
	const [showOneTap, setShowOneTap] = useState(false);
	const [hasShownOneTap, setHasShownOneTap] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		// Only show One Tap if user is not authenticated and we haven't shown it yet
		if (!isAuthenticated && !hasShownOneTap) {
			// Don't show on login page or signup pages
			const excludedPaths = [
				"/login",
				"/buyer-signup",
				"/seller-signup",
				"/forgot-password",
			];
			const currentPath = location.pathname;

			if (!excludedPaths.includes(currentPath)) {
				// Small delay to ensure page is loaded
				const timer = setTimeout(() => {
					setShowOneTap(true);
					setHasShownOneTap(true);
				}, 1000);

				return () => clearTimeout(timer);
			}
		}
	}, [isAuthenticated, hasShownOneTap, location.pathname]);

	const handleOneTapSuccess = (token, user) => {
		// Call onLogin to handle authentication and storage (same as normal login)
		onLogin(token, user);

		// Check for redirect parameter (same as normal login)
		const searchParams = new URLSearchParams(location.search);
		const redirectUrl = searchParams.get("redirect");

		// If there's a redirect URL, use it for buyers (most common case)
		if (redirectUrl && user.role === "buyer") {
			navigate(redirectUrl);
			return;
		}

		// Navigate based on user role (same as normal login)
		switch (user.role) {
			case "buyer":
				navigate("/");
				break;
			case "seller":
				navigate("/seller/dashboard");
				break;
			case "admin":
				navigate("/admin/analytics");
				break;
			case "sales":
				navigate("/sales/dashboard");
				break;
			default:
				console.error("Unexpected user role:", user.role);
		}

		// Close the One Tap modal
		setShowOneTap(false);
	};

	const handleOneTapError = (error) => {
		console.error("Google One Tap error:", error);
		// Close the One Tap modal on error
		setShowOneTap(false);
	};

	const handleCloseOneTap = () => {
		setShowOneTap(false);
	};

	// Reset hasShownOneTap when user logs out
	useEffect(() => {
		if (isAuthenticated) {
			setHasShownOneTap(false);
		}
	}, [isAuthenticated]);

	return {
		showOneTap,
		handleOneTapSuccess,
		handleOneTapError,
		handleCloseOneTap,
	};
};

export default useAutoGoogleOneTap;
