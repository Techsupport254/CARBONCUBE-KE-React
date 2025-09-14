import { useState, useEffect } from "react";

const useAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const [userName, setUserName] = useState("");
	const [userUsername, setUserUsername] = useState("");
	const [userEmail, setUserEmail] = useState("");

	useEffect(() => {
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
