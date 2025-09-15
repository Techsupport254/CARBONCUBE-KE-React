import { useState, useEffect } from "react";

const useAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const [userName, setUserName] = useState("");
	const [userUsername, setUserUsername] = useState("");
	const [userEmail, setUserEmail] = useState("");

	useEffect(() => {
		const updateAuthState = () => {
			const token = localStorage.getItem("token");
			const role = localStorage.getItem("userRole");
			const name = localStorage.getItem("userName");
			const username = localStorage.getItem("userUsername");
			const email = localStorage.getItem("userEmail");

			setIsAuthenticated(!!token);
			setUserRole(role);
			setUserName(name || "");
			setUserUsername(username || "");
			setUserEmail(email || "");
		};

		// Initial state update
		updateAuthState();

		// Listen for storage changes (logout from other tabs)
		const handleStorageChange = (e) => {
			if (e.key === "token" || e.key === "userRole") {
				updateAuthState();
			}
		};

		window.addEventListener("storage", handleStorageChange);

		// Listen for custom logout events
		const handleLogout = () => {
			setIsAuthenticated(false);
			setUserRole(null);
			setUserName("");
			setUserUsername("");
			setUserEmail("");
		};

		window.addEventListener("userLogout", handleLogout);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("userLogout", handleLogout);
		};
	}, []);

	return {
		isAuthenticated,
		userRole,
		userName,
		userUsername,
		userEmail,
	};
};

export default useAuth;
