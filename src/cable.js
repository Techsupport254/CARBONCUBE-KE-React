// src/cable.js
import { createConsumer } from "@rails/actioncable";

// For production, WebSocket connections should use the base domain (not /api)
const getWebSocketUrl = () => {
	if (process.env.REACT_APP_BACKEND_URL?.includes("/api")) {
		// Remove /api suffix for WebSocket connections
		return (
			process.env.REACT_APP_BACKEND_URL.replace("/api", "").replace(
				"http",
				"ws"
			) + "/cable"
		);
	}
	return `${
		process.env.REACT_APP_BACKEND_URL?.replace("http", "ws") ||
		"ws://localhost:3001"
	}/cable`;
};

const cable = createConsumer(
	`${
		process.env.REACT_APP_BACKEND_URL?.replace("https://", "wss://").replace(
			"http://",
			"ws://"
		) || "ws://localhost:3001"
	}/cable`,
	{
		timeout: 15000, // Increased timeout
		reconnect: false, // Disable automatic reconnection to prevent rapid reconnects
		maxReconnectAttempts: 3, // Reduced max attempts
		reconnectInterval: 10000, // Increased interval
	}
);

export default cable;
