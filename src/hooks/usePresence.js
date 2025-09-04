import { useEffect, useRef } from "react";

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

				// Create ActionCable connection
				const ActionCable = require("actioncable");

				// Convert HTTP URL to WebSocket URL
				const wsUrl =
					process.env.REACT_APP_BACKEND_URL?.replace(
						"https://",
						"wss://"
					)?.replace("http://", "ws://") || "ws://localhost:3001";

				cableRef.current = ActionCable.createConsumer(`${wsUrl}/cable`);

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
							switch (data.type) {
								case "online_status":
									onOnlineStatusChange(data);
									break;
								case "typing_status":
									onTypingStatusChange(data);
									break;
								case "message_read":
								case "message_delivered":
									onMessageStatusChange(data);
									break;
								default:
									break;
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
				subscriptionRef.current.unsubscribe();
				subscriptionRef.current = null;
			}
			if (cableRef.current) {
				cableRef.current.disconnect();
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
