import { useEffect, useRef } from "react";
import { createConsumer } from "@rails/actioncable";

// Global connection manager to prevent multiple connections
class WebSocketConnectionManager {
	constructor() {
		this.connections = new Map();
		this.subscriptions = new Map();
	}

	getConnectionKey(userType, userId) {
		return `${userType}_${userId}`;
	}

	getConnection(userType, userId) {
		const key = this.getConnectionKey(userType, userId);
		return this.connections.get(key);
	}

	createConnection(userType, userId, wsUrl, token) {
		const key = this.getConnectionKey(userType, userId);

		// Return existing connection if available
		if (this.connections.has(key)) {
			return this.connections.get(key);
		}

		// Create new connection with authentication
		const consumer = createConsumer(`${wsUrl}/cable`, {
			timeout: 30000,
			reconnect: false,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		this.connections.set(key, consumer);
		return consumer;
	}

	removeConnection(userType, userId) {
		const key = this.getConnectionKey(userType, userId);
		const consumer = this.connections.get(key);

		if (consumer) {
			try {
				consumer.disconnect();
			} catch (error) {
				// Silently handle disconnect errors
			}
			this.connections.delete(key);
		}
	}

	cleanup() {
		// Clean up all connections
		// eslint-disable-next-line no-unused-vars
		for (const [key, consumer] of this.connections) {
			try {
				consumer.disconnect();
			} catch (error) {
				// Silently handle disconnect errors
			}
		}
		this.connections.clear();
		this.subscriptions.clear();
	}
}

// Global instance
const connectionManager = new WebSocketConnectionManager();

const useNewMessageListener = (userType, userId, onNewMessage) => {
	const subscriptionRef = useRef(null);
	const reconnectTimeoutRef = useRef(null);
	const isConnectingRef = useRef(false);

	useEffect(() => {
		if (!userType || !userId || !onNewMessage) {
			return;
		}

		const connect = () => {
			// Prevent multiple simultaneous connection attempts
			if (isConnectingRef.current) {
				return;
			}

			isConnectingRef.current = true;

			try {
				// Clean up existing subscription first
				if (subscriptionRef.current) {
					try {
						subscriptionRef.current.unsubscribe();
					} catch (error) {
						// Silently handle unsubscribe errors
					}
					subscriptionRef.current = null;
				}

				// Get or create connection using the manager
				const wsUrl =
					process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:3001";

				// Get JWT token for authentication
				const token = sessionStorage.getItem("token");

				const consumer = connectionManager.createConnection(
					userType,
					userId,
					wsUrl,
					token
				);

				// Subscribe to conversations channel for new messages
				subscriptionRef.current = consumer.subscriptions.create(
					{
						channel: "ConversationsChannel",
						user_type: userType,
						user_id: userId,
					},
					{
						connected() {
							isConnectingRef.current = false;
							// Clear any pending reconnect timeout
							if (reconnectTimeoutRef.current) {
								clearTimeout(reconnectTimeoutRef.current);
								reconnectTimeoutRef.current = null;
							}
						},
						disconnected() {
							isConnectingRef.current = false;

							// Attempt to reconnect after a delay, but only if not already reconnecting
							if (!reconnectTimeoutRef.current) {
								reconnectTimeoutRef.current = setTimeout(() => {
									connect();
								}, 5000); // 5 second delay
							}
						},
						rejected() {
							isConnectingRef.current = false;

							// Attempt to reconnect after a longer delay for rejections
							if (!reconnectTimeoutRef.current) {
								reconnectTimeoutRef.current = setTimeout(() => {
									connect();
								}, 10000); // 10 second delay
							}
						},
						received(data) {
							try {
								if (data && data.type === "new_message") {
									// Only trigger if the message is not from the current user
									if (
										data.message &&
										!(
											data.message.sender_id === userId &&
											data.message.sender_type === userType
										)
									) {
										onNewMessage(data);
									}
								}
							} catch (error) {
								// Silently handle errors
							}
						},
					}
				);
			} catch (error) {
				isConnectingRef.current = false;

				// Attempt to reconnect after an error
				if (!reconnectTimeoutRef.current) {
					reconnectTimeoutRef.current = setTimeout(() => {
						connect();
					}, 15000); // 15 second delay
				}
			}
		};

		connect();

		// Cleanup on unmount
		return () => {
			// Clear any pending reconnect attempts
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
				reconnectTimeoutRef.current = null;
			}

			// Unsubscribe from the channel first
			if (subscriptionRef.current) {
				try {
					subscriptionRef.current.unsubscribe();
				} catch (error) {
					// Silently handle unsubscribe errors
				}
				subscriptionRef.current = null;
			}

			isConnectingRef.current = false;
		};
	}, [userType, userId, onNewMessage]);

	// Cleanup on component unmount
	useEffect(() => {
		return () => {
			// Only cleanup if this is the last component using this connection
			// This is a simple approach - in production you might want more sophisticated tracking
			setTimeout(() => {
				connectionManager.removeConnection(userType, userId);
			}, 1000); // Small delay to allow other components to reconnect
		};
	}, [userType, userId]);
};

export default useNewMessageListener;
