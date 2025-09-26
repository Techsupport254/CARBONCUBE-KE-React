// Simple WebSocket test for local development
// Run this in browser console to test WebSocket connection

const testWebSocketConnection = () => {
	console.log("🧪 Testing WebSocket connection...");

	const wsUrl = "ws://localhost:3001/cable";
	const ws = new WebSocket(wsUrl);

	ws.onopen = () => {
		console.log("✅ WebSocket connection opened");

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
		console.log("📤 Sent subscription message");
	};

	ws.onmessage = (event) => {
		console.log("📥 Received message:", event.data);
	};

	ws.onerror = (error) => {
		console.error("❌ WebSocket error:", error);
	};

	ws.onclose = (event) => {
		console.log("🔌 WebSocket closed:", event.code, event.reason);
	};

	// Close after 5 seconds
	setTimeout(() => {
		ws.close();
		console.log("🔚 Test completed");
	}, 5000);
};

// Export for use in console
if (typeof window !== "undefined") {
	window.testWebSocketConnection = testWebSocketConnection;
	console.log("💡 Run testWebSocketConnection() in console to test WebSocket");
}

export default testWebSocketConnection;
