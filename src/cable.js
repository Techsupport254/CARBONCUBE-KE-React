// src/cable.js
import { createConsumer } from "@rails/actioncable";

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
