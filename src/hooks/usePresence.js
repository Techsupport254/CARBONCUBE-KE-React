import { useEffect, useRef } from "react";
import { createConsumer } from "@rails/actioncable";

const usePresence = (
	userType,
	userId,
	onOnlineStatusChange,
	onTypingStatusChange,
	onMessageStatusChange
) => {
	const cableRef = useRef(null);
	const subscriptionRef = useRef(null);
	const typingTimeoutRef = useRef(null);
	const reconnectTimeoutRef = useRef(null);
	const isConnectingRef = useRef(false);

	// Store callback refs to avoid dependency issues
	const onOnlineStatusChangeRef = useRef(onOnlineStatusChange);
	const onTypingStatusChangeRef = useRef(onTypingStatusChange);
	const onMessageStatusChangeRef = useRef(onMessageStatusChange);

	// Update refs when callbacks change
	useEffect(() => {
		onOnlineStatusChangeRef.current = onOnlineStatusChange;
	}, [onOnlineStatusChange]);

	useEffect(() => {
		onTypingStatusChangeRef.current = onTypingStatusChange;
	}, [onTypingStatusChange]);

	useEffect(() => {
		onMessageStatusChangeRef.current = onMessageStatusChange;
	}, [onMessageStatusChange]);

	useEffect(() => {
		if (!userType || !userId) {
			return;
		}

		const connect = () => {
			// Prevent multiple simultaneous connection attempts
			if (isConnectingRef.current) {
				return;
			}

			isConnectingRef.current = true;

			try {
				// Clean up existing connection first
				if (subscriptionRef.current) {
					subscriptionRef.current.unsubscribe();
					subscriptionRef.current = null;
				}
				if (cableRef.current) {
					cableRef.current.disconnect();
					cableRef.current = null;
				}

				// Use the new WebSocket URL
				const wsUrl =
					process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:8080";

				// Get JWT token for authentication
				const token = localStorage.getItem("token");

				cableRef.current = createConsumer(`${wsUrl}/cable`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				// Subscribe to presence channel
				subscriptionRef.current = cableRef.current.subscriptions.create(
					{
						channel: "PresenceChannel",
						user_type: userType,
						user_id: userId,
					},
					{
						connected() {
							isConnectingRef.current = false;
							// Clear any reconnect timeout
							if (reconnectTimeoutRef.current) {
								clearTimeout(reconnectTimeoutRef.current);
								reconnectTimeoutRef.current = null;
							}
						},
						disconnected() {
							isConnectingRef.current = false;
							// Attempt to reconnect after 5 seconds (increased delay)
							if (!reconnectTimeoutRef.current) {
								reconnectTimeoutRef.current = setTimeout(() => {
									connect();
								}, 5000);
							}
						},
						rejected() {
							isConnectingRef.current = false;
							// Attempt to reconnect after 10 seconds (increased delay)
							if (!reconnectTimeoutRef.current) {
								reconnectTimeoutRef.current = setTimeout(() => {
									connect();
								}, 10000);
							}
						},
						received(data) {
							try {
								if (data) {
									switch (data.type) {
										case "online_status":
											onOnlineStatusChangeRef.current?.(data);
											break;
										case "typing_status":
											onTypingStatusChangeRef.current?.(data);
											break;
										case "message_read":
										case "message_delivered":
											onMessageStatusChangeRef.current?.(data);
											break;
										default:
											break;
									}
								}
							} catch (error) {
								console.error("Error handling received presence data:", error);
							}
						},
					}
				);
			} catch (error) {
				console.error("Error connecting to PresenceChannel:", error);
				isConnectingRef.current = false;
				// Attempt to reconnect after 10 seconds (increased delay)
				if (!reconnectTimeoutRef.current) {
					reconnectTimeoutRef.current = setTimeout(() => {
						connect();
					}, 10000);
				}
			}
		};

		connect();

		// Cleanup on unmount
		return () => {
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
				reconnectTimeoutRef.current = null;
			}
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
				typingTimeoutRef.current = null;
			}
			if (subscriptionRef.current) {
				try {
					subscriptionRef.current.unsubscribe();
				} catch (error) {
					console.error("Error unsubscribing from presence:", error);
				}
				subscriptionRef.current = null;
			}
			if (cableRef.current) {
				try {
					cableRef.current.disconnect();
				} catch (error) {
					console.error("Error disconnecting presence cable:", error);
				}
				cableRef.current = null;
			}
			isConnectingRef.current = false;
		};
	}, [userType, userId]); // Only re-run when userType or userId changes

	const sendTypingStart = (conversationId) => {
		if (subscriptionRef.current) {
			subscriptionRef.current.send({
				type: "typing_start",
				conversation_id: conversationId,
			});
		}
	};

	const sendTypingStop = (conversationId) => {
		if (subscriptionRef.current) {
			subscriptionRef.current.send({
				type: "typing_stop",
				conversation_id: conversationId,
			});
		}
	};

	const sendMessageRead = (messageId) => {
		if (subscriptionRef.current) {
			subscriptionRef.current.send({
				type: "message_read",
				message_id: messageId,
			});
		}
	};

	const sendMessageDelivered = (messageId) => {
		if (subscriptionRef.current) {
			subscriptionRef.current.send({
				type: "message_delivered",
				message_id: messageId,
			});
		}
	};

	const handleTyping = (isTyping, conversationId) => {
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		if (isTyping) {
			sendTypingStart(conversationId);
			// Stop typing after 3 seconds of inactivity
			typingTimeoutRef.current = setTimeout(() => {
				sendTypingStop(conversationId);
			}, 3000);
		} else {
			sendTypingStop(conversationId);
		}
	};

	return {
		sendTypingStart,
		sendTypingStop,
		sendMessageRead,
		sendMessageDelivered,
		handleTyping,
	};
};

export default usePresence;
