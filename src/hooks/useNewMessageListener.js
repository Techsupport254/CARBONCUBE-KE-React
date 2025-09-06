import { useEffect, useRef } from "react";
import { createConsumer } from "@rails/actioncable";

const useNewMessageListener = (userType, userId, onNewMessage) => {
	const cableRef = useRef(null);
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
				// Clean up existing connection first
				if (subscriptionRef.current) {
					try {
						subscriptionRef.current.unsubscribe();
					} catch (error) {
						// Silently handle unsubscribe errors
					}
					subscriptionRef.current = null;
				}
				if (cableRef.current) {
					try {
						cableRef.current.disconnect();
					} catch (error) {
						// Silently handle disconnect errors
					}
					cableRef.current = null;
				}

				// Create a dedicated consumer for this hook
				const wsUrl =
					process.env.REACT_APP_BACKEND_URL?.replace("http", "ws") ||
					"ws://localhost:3001";

				cableRef.current = createConsumer(`${wsUrl}/cable`, {
					timeout: 30000, // Increased timeout
					reconnect: false, // Disable automatic reconnection to prevent conflicts
				});

				// Subscribe to conversations channel for new messages
				subscriptionRef.current = cableRef.current.subscriptions.create(
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

			// Disconnect the cable connection
			if (cableRef.current) {
				try {
					cableRef.current.disconnect();
				} catch (error) {
					// Silently handle disconnect errors
				}
				cableRef.current = null;
			}

			isConnectingRef.current = false;
		};
	}, [userType, userId, onNewMessage]);
};

export default useNewMessageListener;
