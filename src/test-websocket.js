// Simple WebSocket test for local development
// Run this in browser console to test WebSocket connection

const testWebSocketConnection = () => {
	const wsUrl = "ws://localhost:3001/cable";
	const ws = new WebSocket(wsUrl);

	ws.onopen = () => {
		// Test subscription
		const subscribeMessage = {
			command: "subscribe",
			identifier: JSON.stringify({
				channel: "ConversationsChannel",
				user_type: "buyer",
				user_id: 1,
			}),
		};

		ws.send(JSON.stringify(subscribeMessage));
	};

	ws.onmessage = (event) => {};

	ws.onerror = (error) => {
	};

	ws.onclose = (event) => {};

	// Close after 5 seconds
	setTimeout(() => {
		ws.close();
	}, 5000);
};

// Export for use in console
if (typeof window !== "undefined") {
	window.testWebSocketConnection = testWebSocketConnection;
}

export default testWebSocketConnection;
