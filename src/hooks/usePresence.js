import { useEffect, useRef, useCallback } from "react";
import { createConsumer } from "@rails/actioncable";
import tokenService from "../services/tokenService";

const usePresence = (
	userType,
	userId,
	onOnlineStatusChange,
	onTypingStatusChange,
	onMessageStatusChange,
	currentConversationId = null
) => {
	const cableRef = useRef(null);
	const subscriptionRef = useRef(null);
	const typingTimeoutRef = useRef(null);
	const reconnectTimeoutRef = useRef(null);
	const isConnectingRef = useRef(false);
	const connectionAttemptsRef = useRef(0);
	const maxConnectionAttempts = 3; // Limit connection attempts

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
				console.debug(
					"PresenceChannel: Connection already in progress, skipping"
				);
				return;
			}

			// Check connection attempt limit
			if (connectionAttemptsRef.current >= maxConnectionAttempts) {
				console.warn(
					`PresenceChannel: Max connection attempts (${maxConnectionAttempts}) reached, stopping`
				);
				return;
			}

			connectionAttemptsRef.current++;
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
					process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:3001";

				// Get JWT token for authentication
				const token = localStorage.getItem("token");

				if (!token) {
					console.warn(
						"No authentication token found, WebSocket connection will likely fail"
					);
				}

				// Send token as query parameter since ActionCable doesn't pass headers
				const cableUrl = token
					? `${wsUrl}/cable?token=${encodeURIComponent(token)}`
					: `${wsUrl}/cable`;

				cableRef.current = createConsumer(cableUrl, {
					timeout: 30000,
					reconnect: false,
					// Add connection stability options
					pingInterval: 60000, // Ping every 60 seconds
					pingTimeout: 10000, // Wait 10 seconds for pong
					reconnectDelay: 5000, // Wait 5 seconds before reconnecting
					maxReconnectAttempts: 3, // Limit reconnection attempts
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
							connectionAttemptsRef.current = 0; // Reset attempts on successful connection
							// Clear any reconnect timeout
							if (reconnectTimeoutRef.current) {
								clearTimeout(reconnectTimeoutRef.current);
								reconnectTimeoutRef.current = null;
							}
							console.log("PresenceChannel: Successfully connected");
						},
						disconnected() {
							isConnectingRef.current = false;
							// Only attempt to reconnect if we haven't exceeded max attempts
							const token = localStorage.getItem("token");
							if (
								token &&
								!reconnectTimeoutRef.current &&
								connectionAttemptsRef.current < maxConnectionAttempts
							) {
								// Increase delay to prevent connection spam
								reconnectTimeoutRef.current = setTimeout(() => {
									connect();
								}, 10000); // Increased to 10 seconds
							} else if (!token) {
								console.warn(
									"PresenceChannel: No token available, not attempting to reconnect"
								);
							} else if (
								connectionAttemptsRef.current >= maxConnectionAttempts
							) {
								console.warn(
									"PresenceChannel: Max reconnection attempts reached"
								);
							}
						},
						rejected() {
							isConnectingRef.current = false;
							console.warn(
								"PresenceChannel subscription rejected - likely authentication issue"
							);
							// Don't attempt to reconnect on rejection to prevent spam
							// Authentication issues need to be resolved manually
							console.warn(
								"PresenceChannel: Subscription rejected, not attempting auto-reconnect"
							);
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
										case "heartbeat_response":
											// Connection is alive, update last heartbeat time
											console.debug(
												"PresenceChannel: Heartbeat response received"
											);
											break;
										case "ping":
											// Respond to ping from server
											if (subscriptionRef.current) {
												subscriptionRef.current.send({
													type: "pong",
													timestamp: new Date().toISOString(),
												});
											}
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
				// Only attempt to reconnect if we haven't exceeded max attempts
				const token = localStorage.getItem("token");
				if (
					token &&
					!reconnectTimeoutRef.current &&
					connectionAttemptsRef.current < maxConnectionAttempts
				) {
					// Increase delay to prevent connection spam
					reconnectTimeoutRef.current = setTimeout(() => {
						connect();
					}, 15000); // Increased to 15 seconds
				} else if (!token) {
					console.warn(
						"PresenceChannel: No token available, not attempting to reconnect"
					);
				} else if (connectionAttemptsRef.current >= maxConnectionAttempts) {
					console.warn(
						"PresenceChannel: Max connection attempts reached, stopping"
					);
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

	const isConnectionActive = () => {
		const hasSubscription = !!subscriptionRef.current;
		const hasCable = !!cableRef.current;
		const hasConnection = !!cableRef.current?.connection;
		const isOpen = cableRef.current?.connection?.isOpen();
		const subscriptionState = subscriptionRef.current?.state;
		const subscriptionReady = subscriptionRef.current?.ready;

		// Check if subscription is ready instead of relying on state
		const isActive =
			hasSubscription &&
			hasCable &&
			hasConnection &&
			isOpen &&
			(subscriptionState === "connected" || subscriptionReady === true);

		// Enhanced logging to debug connection issues
		if (!isActive && process.env.NODE_ENV === "development") {
			console.log("PresenceChannel: Connection not active", {
				hasSubscription,
				hasCable,
				hasConnection,
				isOpen,
				subscriptionState,
				subscriptionReady,
				cableState: cableRef.current?.connection?.readyState,
			});
		}

		return isActive;
	};

	const sendTypingStart = (conversationId) => {
		if (isConnectionActive()) {
			subscriptionRef.current.send({
				type: "typing_start",
				conversation_id: conversationId,
			});
		} else {
			// Reduce logging frequency for connection issues
			console.debug(
				"PresenceChannel: Connection not active, skipping typing_start"
			);
		}
	};

	const sendTypingStop = (conversationId) => {
		if (isConnectionActive()) {
			subscriptionRef.current.send({
				type: "typing_stop",
				conversation_id: conversationId,
			});
		} else {
			// Reduce logging frequency for connection issues
			console.debug(
				"PresenceChannel: Connection not active, skipping typing_stop"
			);
		}
	};

	const sendMessageRead = (messageId) => {
		if (!messageId) {
			console.warn("PresenceChannel: No message ID provided for message_read");
			return;
		}

		if (isConnectionActive()) {
			subscriptionRef.current.send({
				type: "message_read",
				message_id: messageId,
				conversation_id: currentConversationId,
			});
		} else {
			console.log(
				"PresenceChannel: Connection not active, falling back to API for message_read"
			);
			// Fallback to REST API for message status updates
			updateMessageStatusViaAPI(messageId, "read", currentConversationId);
		}
	};

	const sendMessageDelivered = (messageId) => {
		if (!messageId) {
			console.warn(
				"PresenceChannel: No message ID provided for message_delivered"
			);
			return;
		}

		if (isConnectionActive()) {
			subscriptionRef.current.send({
				type: "message_delivered",
				message_id: messageId,
				conversation_id: currentConversationId,
			});
		} else {
			console.log(
				"PresenceChannel: Connection not active, falling back to API for message_delivered"
			);
			// Fallback to REST API for message status updates
			updateMessageStatusViaAPI(messageId, "delivered", currentConversationId);
		}
	};

	// REST API fallback for message status updates
	const updateMessageStatusViaAPI = async (
		messageId,
		status,
		conversationId
	) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				console.warn("PresenceChannel: No token available for API call");
				return;
			}

			// Validate token for current user type
			const currentUserType = userType; // userType is passed to the hook

			if (!tokenService.validateTokenForUserType(currentUserType)) {
				console.warn(
					`PresenceChannel: Token validation failed for user type ${currentUserType}`
				);
				console.warn(
					"PresenceChannel: This usually means you're using the wrong token for the current page"
				);
				return;
			}

			if (!conversationId) {
				console.warn(
					"PresenceChannel: No conversation ID provided for API call"
				);
				return;
			}

			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/conversations/${conversationId}/messages/${messageId}/mark_as_${status}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				console.log(
					`PresenceChannel: Successfully updated message ${messageId} status to ${status} via API`
				);
			} else if (response.status === 404) {
				// Message doesn't exist - this is expected after clearing conversations
				console.log(
					`PresenceChannel: Message ${messageId} not found (likely deleted), ignoring status update`
				);
			} else {
				console.warn(
					`PresenceChannel: Failed to update message ${messageId} status to ${status} via API:`,
					response.status
				);
			}
		} catch (error) {
			console.error(
				`PresenceChannel: Error updating message ${messageId} status to ${status} via API:`,
				error
			);
		}
	};

	const sendHeartbeat = useCallback(() => {
		if (isConnectionActive()) {
			subscriptionRef.current.send({
				type: "heartbeat",
			});
		} else {
			console.warn(
				"PresenceChannel: Connection not active, cannot send heartbeat"
			);
		}
	}, []);

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

	// Set up heartbeat interval to keep user online
	useEffect(() => {
		if (subscriptionRef.current) {
			// Send initial heartbeat
			sendHeartbeat();

			// Set up interval to send heartbeat every 2 minutes
			const heartbeatInterval = setInterval(() => {
				if (isConnectionActive()) {
					sendHeartbeat();
				} else {
					console.warn(
						"PresenceChannel: Connection not active, skipping heartbeat"
					);
					// Clear the interval if connection is not active
					clearInterval(heartbeatInterval);
				}
			}, 120000); // 2 minutes

			return () => {
				clearInterval(heartbeatInterval);
			};
		}
	}, [sendHeartbeat]);

	return {
		sendTypingStart,
		sendTypingStop,
		sendMessageRead,
		sendMessageDelivered,
		handleTyping,
	};
};

export default usePresence;
