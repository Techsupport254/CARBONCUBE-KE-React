// src/cable.js
import { createConsumer } from "@rails/actioncable";

// Remove /api prefix if present since ActionCable is mounted at /cable
let baseUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
if (baseUrl.includes("/api")) {
	baseUrl = baseUrl.replace("/api", "");
}
const wsUrl = baseUrl.replace("https://", "wss://").replace("http://", "ws://");

const cable = createConsumer(`${wsUrl}/cable`, {
	timeout: 15000, // Increased timeout
	reconnect: false, // Disable automatic reconnection to prevent rapid reconnects
	maxReconnectAttempts: 3, // Reduced max attempts
	reconnectInterval: 10000, // Increased interval
});

export default cable;
