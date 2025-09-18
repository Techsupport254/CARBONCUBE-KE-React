// src/cable.js
import { createConsumer } from "@rails/actioncable";

// Use the dedicated WebSocket URL instead of the backend API URL
const wsUrl = process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:3001";

// Get JWT token from localStorage with validation
const getToken = () => {
	const token = localStorage.getItem("token");

	// Validate token format (should have 3 parts separated by dots)
	if (!token || typeof token !== "string") {
		return null;
	}

	const parts = token.split(".");
	if (parts.length !== 3 || !parts.every((part) => part.length > 0)) {
		console.warn("Invalid token format for WebSocket connection");
		// Clear invalid token
		localStorage.removeItem("token");
		return null;
	}

	// Try to decode the token to verify it's valid
	try {
		const payload = JSON.parse(atob(parts[1]));
		if (!payload.user_id && !payload.seller_id) {
			console.warn("Invalid token payload for WebSocket connection");
			localStorage.removeItem("token");
			return null;
		}
	} catch (error) {
		console.warn("Token decode error for WebSocket connection:", error.message);
		localStorage.removeItem("token");
		return null;
	}

	return token;
};

// Create consumer with conditional authentication
const createAuthenticatedConsumer = () => {
	const token = getToken();

	const config = {
		timeout: 15000,
		reconnect: false,
		maxReconnectAttempts: 3,
		reconnectInterval: 10000,
	};

	// Only add Authorization header if we have a valid token
	if (token) {
		config.headers = {
			Authorization: `Bearer ${token}`,
		};
	}

	return createConsumer(`${wsUrl}/cable`, config);
};

const cable = createAuthenticatedConsumer();

export default cable;
