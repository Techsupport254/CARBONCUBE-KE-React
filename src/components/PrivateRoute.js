import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import tokenService from "../services/tokenService";

const PrivateRoute = ({ isAuthenticated, role, userRole }) => {
	const navigate = useNavigate();

	useEffect(() => {
		// Check if user is authenticated
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}

		// Check if user has the correct role
		if (userRole !== role) {
			navigate("/login");
			return;
		}

		// Check if token is expired
		const token = tokenService.getToken();
		if (token && tokenService.isTokenExpired()) {
			tokenService.clearAuthData();
			navigate("/login");
			return;
		}
	}, [isAuthenticated, role, userRole, navigate]);

	// Only render if all checks pass
	if (!isAuthenticated || userRole !== role) {
		return null;
	}

	// Check token one more time before rendering
	const token = tokenService.getToken();
	if (token && tokenService.isTokenExpired()) {
		tokenService.clearAuthData();
		navigate("/login");
		return null;
	}

	return <Outlet />;
};

export default PrivateRoute;
