import { useState, useEffect, useCallback } from "react";
import tokenService from "../services/tokenService";

const useAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const [userName, setUserName] = useState("");
	const [userUsername, setUserUsername] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [userProfilePicture, setUserProfilePicture] = useState("");

	const logout = useCallback(() => {
		tokenService.clearAuthData();
		// Also clear localStorage user data
		localStorage.removeItem("userRole");
		localStorage.removeItem("userName");
		localStorage.removeItem("userUsername");
		localStorage.removeItem("userEmail");
		localStorage.removeItem("userProfilePicture");
		setIsAuthenticated(false);
		setUserRole(null);
		setUserName("");
		setUserUsername("");
		setUserEmail("");
		setUserProfilePicture("");
	}, []);

	const checkAuth = useCallback(() => {
		// Note: Removed automatic token clearing to prevent race conditions
		// Token validation happens in tokenService.getToken() if needed

		const token = tokenService.getToken();

		// Only log when there's a change in token status to reduce console spam
		if (!token && isAuthenticated) {
		}

		// If no token, user is not authenticated
		if (!token) {
			if (isAuthenticated) {
				setIsAuthenticated(false);
				setUserRole(null);
				setUserName("");
				setUserUsername("");
				setUserEmail("");
				setUserProfilePicture("");
			}
			return;
		}

		// Check if token is expired
		const isTokenExpired = tokenService.isTokenExpired();

		if (isTokenExpired) {
			// Token is expired, immediately log out user
			logout();
			return;
		}

		// Token is valid, get user info from localStorage (stored during login)
		const userRole = localStorage.getItem("userRole");
		const userName = localStorage.getItem("userName") || "";
		const userUsername = localStorage.getItem("userUsername") || "";
		const userEmail = localStorage.getItem("userEmail") || "";
		const userProfilePicture = localStorage.getItem("userProfilePicture") || "";

		if (userRole && !isAuthenticated) {
			setIsAuthenticated(true);
			setUserRole(userRole);
			setUserName(userName);
			setUserUsername(userUsername);
			setUserEmail(userEmail);
			setUserProfilePicture(userProfilePicture);
		} else if (!userRole && isAuthenticated) {
			// No user role found, log out
			logout();
		}
	}, [logout, isAuthenticated]);

	useEffect(() => {
		checkAuth();

		// Setup automatic token refresh
		tokenService.setupAutoRefresh();

		// Check auth periodically (every 2 minutes to reduce excessive calls)
		const interval = setInterval(checkAuth, 120000);

		// Listen for storage changes (logout from other tabs)
		const handleStorageChange = (e) => {
			if (e.key === "token" || e.key === "userRole") {
				checkAuth();
			}
		};

		window.addEventListener("storage", handleStorageChange);

		// Listen for custom logout events
		const handleLogout = () => {
			logout();
		};

		// Listen for force logout events from token service
		const handleForceLogout = () => {
			logout();
		};

		window.addEventListener("userLogout", handleLogout);
		window.addEventListener("forceLogout", handleForceLogout);

		return () => {
			clearInterval(interval);
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("userLogout", handleLogout);
			window.removeEventListener("forceLogout", handleForceLogout);
		};
	}, [checkAuth, logout]);

	return {
		isAuthenticated,
		userRole,
		userName,
		userUsername,
		userEmail,
		userProfilePicture,
		logout,
	};
};

export default useAuth;
