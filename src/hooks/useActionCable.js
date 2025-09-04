import { useEffect, useRef } from "react";

const useActionCable = (
	userType,
	userId,
	onMessageReceived,
	onConnectionStatus
) => {
	const cableRef = useRef(null);
	const subscriptionRef = useRef(null);
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

				// Subscribe to conversations channel
				subscriptionRef.current = cableRef.current.subscriptions.create(
					{
						channel: "ConversationsChannel",
						user_type: userType,
						user_id: userId,
					},
					{
						connected() {
							isConnectingRef.current = false;
							if (onConnectionStatus) {
								onConnectionStatus("connected");
							}
							// Clear any reconnect timeout
							if (reconnectTimeoutRef.current) {
								clearTimeout(reconnectTimeoutRef.current);
								reconnectTimeoutRef.current = null;
							}
						},
						disconnected() {
							isConnectingRef.current = false;
							if (onConnectionStatus) {
								onConnectionStatus("disconnected");
							}
							// Attempt to reconnect after 5 seconds (increased delay)
							if (!reconnectTimeoutRef.current) {
								reconnectTimeoutRef.current = setTimeout(() => {
									connect();
								}, 5000);
							}
						},
						rejected() {
							isConnectingRef.current = false;
							if (onConnectionStatus) {
								onConnectionStatus("rejected");
							}
							// Attempt to reconnect after 10 seconds (increased delay)
							if (!reconnectTimeoutRef.current) {
								reconnectTimeoutRef.current = setTimeout(() => {
									connect();
								}, 10000);
							}
						},
						received(data) {
							if (data.type === "new_message") {
								onMessageReceived(data);
							}
						},
					}
				);
			} catch (error) {
				console.error("Error connecting to ConversationsChannel:", error);
				isConnectingRef.current = false;
				if (onConnectionStatus) {
					onConnectionStatus("error");
				}
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

	return {
		sendMessage: (conversationId, content, senderType, senderId) => {
			if (subscriptionRef.current) {
				subscriptionRef.current.send({
					conversation_id: conversationId,
					content: content,
					sender_type: senderType,
					sender_id: senderId,
				});
			}
		},
	};
};

export default useActionCable;
