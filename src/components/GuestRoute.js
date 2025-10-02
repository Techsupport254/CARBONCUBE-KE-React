import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * GuestRoute component - protects routes that should only be accessible to non-authenticated users
 * Redirects authenticated users to their appropriate dashboard
 */
const GuestRoute = ({ children, redirectTo = null }) => {
	const { isAuthenticated, userRole } = useAuth();

	// If user is not authenticated, allow access to the route
	if (!isAuthenticated) {
		return children;
	}

	// If user is authenticated, redirect them to appropriate dashboard
	// If no specific redirect is provided, use role-based redirect
	if (redirectTo) {
		return <Navigate to={redirectTo} replace />;
	}

	// Role-based redirects
	switch (userRole) {
		case "admin":
			return <Navigate to="/admin/analytics" replace />;
		case "seller":
			return <Navigate to="/seller/dashboard" replace />;
		case "buyer":
			return <Navigate to="/" replace />;
		case "sales":
			return <Navigate to="/sales/dashboard" replace />;
		default:
			return <Navigate to="/" replace />;
	}
};

export default GuestRoute;
