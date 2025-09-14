// src/cable.js
import { createConsumer } from "@rails/actioncable";

// Use the dedicated WebSocket URL instead of the backend API URL
const wsUrl = process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:8080";

// Get JWT token from sessionStorage
const getToken = () => {
	return localStorage.getItem("token");
};

const cable = createConsumer(`${wsUrl}/cable`, {
	timeout: 15000, // Increased timeout
	reconnect: false, // Disable automatic reconnection to prevent rapid reconnects
	maxReconnectAttempts: 3, // Reduced max attempts
	reconnectInterval: 10000, // Increased interval
	// Add authentication headers
	headers: {
		Authorization: `Bearer ${getToken()}`,
	},
});

export default cable;
