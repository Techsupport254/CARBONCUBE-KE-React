import { useEffect, useRef, useCallback, useMemo } from "react";
import {
	useWebSocketStore,
	WS_STATES,
	MESSAGE_TYPES,
} from "../stores/websocketStore";

/**
 * Modern WebSocket connection manager
 */
class WebSocketConnectionManager {
	constructor() {
		this.connections = new Map();
		this.reconnectTimeouts = new Map();
		this.heartbeatIntervals = new Map();
		this.messageHandlers = new Map();
		this.connectionPromises = new Map();
	}

	async connect(url, options = {}) {
		const {
			protocols = [],
			reconnectInterval = 1000,
			maxReconnectAttempts = 5,
			heartbeatInterval = 30000,
			timeout = 10000,
		} = options;

		// Return existing connection if available
		if (this.connections.has(url)) {
			const existingWs = this.connections.get(url);
			if (existingWs.readyState === WebSocket.OPEN) {
				return existingWs;
			}
		}

		// Return existing connection promise if connecting
		if (this.connectionPromises.has(url)) {
			return this.connectionPromises.get(url);
		}

		const connectionPromise = new Promise((resolve, reject) => {
			const ws = new WebSocket(url, protocols);
			let connectTimeout;
			let isResolved = false;

			const cleanup = () => {
				if (connectTimeout) clearTimeout(connectTimeout);
				this.connectionPromises.delete(url);
			};

			const resolveConnection = () => {
				if (!isResolved) {
					isResolved = true;
					cleanup();
					resolve(ws);
				}
			};

			const rejectConnection = (error) => {
				if (!isResolved) {
					isResolved = true;
					cleanup();
					reject(error);
				}
			};

			// Connection timeout
			connectTimeout = setTimeout(() => {
				rejectConnection(new Error("Connection timeout"));
				ws.close();
			}, timeout);

			ws.onopen = () => {
				this.connections.set(url, ws);
				this.setupHeartbeat(url, ws, heartbeatInterval);
				resolveConnection();
			};

			ws.onclose = (event) => {
				this.cleanup(url);

				if (!isResolved) {
					rejectConnection(new Error(`Connection closed: ${event.reason}`));
				} else {
					// Attempt reconnection if not manually closed
					if (event.code !== 1000 && options.autoReconnect !== false) {
						this.scheduleReconnect(url, options, 0);
					}
				}
			};

			ws.onerror = (error) => {
				if (!isResolved) {
					rejectConnection(error);
				}
			};

			ws.onmessage = (event) => {
				this.handleMessage(url, event);
			};
		});

		this.connectionPromises.set(url, connectionPromise);
		return connectionPromise;
	}

	scheduleReconnect(url, options, attempt) {
		const { maxReconnectAttempts = 5, reconnectInterval = 1000 } = options;

		if (attempt >= maxReconnectAttempts) {
				`Max reconnection attempts (${maxReconnectAttempts}) reached for ${url}`
			);
			return;
		}

		const delay = Math.min(reconnectInterval * Math.pow(2, attempt), 30000); // Exponential backoff, max 30s

		const timeout = setTimeout(() => {
			this.reconnectTimeouts.delete(url);
			this.connect(url, options).catch(() => {
				this.scheduleReconnect(url, options, attempt + 1);
			});
		}, delay);

		this.reconnectTimeouts.set(url, timeout);
	}

	setupHeartbeat(url, ws, interval) {
		const heartbeat = setInterval(() => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(JSON.stringify({ type: "ping", timestamp: Date.now() }));
			} else {
				clearInterval(heartbeat);
				this.heartbeatIntervals.delete(url);
			}
		}, interval);

		this.heartbeatIntervals.set(url, heartbeat);
	}

	handleMessage(url, event) {
		try {
			const data = JSON.parse(event.data);
			const handlers = this.messageHandlers.get(url) || [];

			// Track message latency if it's a pong response
			if (data.type === "pong" && data.timestamp) {
				const latency = Date.now() - data.timestamp;
				useWebSocketStore.getState().trackMessageLatency(latency);
			}

			handlers.forEach((handler) => {
				try {
					handler(data);
				} catch (error) {
				}
			});
		} catch (error) {
		}
	}

	addMessageHandler(url, handler) {
		const handlers = this.messageHandlers.get(url) || [];
		handlers.push(handler);
		this.messageHandlers.set(url, handlers);

		// Return cleanup function
		return () => {
			const currentHandlers = this.messageHandlers.get(url) || [];
			const index = currentHandlers.indexOf(handler);
			if (index > -1) {
				currentHandlers.splice(index, 1);
				this.messageHandlers.set(url, currentHandlers);
			}
		};
	}

	send(url, data) {
		const ws = this.connections.get(url);
		if (ws && ws.readyState === WebSocket.OPEN) {
			const message = typeof data === "string" ? data : JSON.stringify(data);
			ws.send(message);
			useWebSocketStore.getState().totalMessagesSent++;
			return true;
		}
		return false;
	}

	disconnect(url) {
		const ws = this.connections.get(url);
		if (ws) {
			ws.close(1000, "Manual disconnect");
		}
		this.cleanup(url);
	}

	cleanup(url) {
		this.connections.delete(url);
		this.connectionPromises.delete(url);

		const timeout = this.reconnectTimeouts.get(url);
		if (timeout) {
			clearTimeout(timeout);
			this.reconnectTimeouts.delete(url);
		}

		const heartbeat = this.heartbeatIntervals.get(url);
		if (heartbeat) {
			clearInterval(heartbeat);
			this.heartbeatIntervals.delete(url);
		}

		this.messageHandlers.delete(url);
	}

	disconnectAll() {
		for (const url of this.connections.keys()) {
			this.disconnect(url);
		}
	}
}

// Global connection manager instance
const connectionManager = new WebSocketConnectionManager();

/**
 * Modern useWebSocket hook with advanced features
 */
export const useWebSocket = (channelName, userType, userId, options = {}) => {
	const wsStore = useWebSocketStore();
	const handlerRef = useRef(null);
	const optionsRef = useRef(options);
	optionsRef.current = options;

	// Memoize WebSocket URL
	const wsUrl = useMemo(() => {
		const wsUrl = process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:3001";
		return `${wsUrl}/cable`;
	}, []);

	// Memoize authentication token
	const authToken = useMemo(() => {
		const token =
			localStorage.getItem("token") || localStorage.getItem("token");
		return token ? `Bearer ${token}` : null;
	}, []);

	// Connection setup
	const connect = useCallback(async () => {
		if (!channelName || !userType || !userId || !authToken) {
			return;
		}

		try {
			wsStore.setConnectionState(WS_STATES.CONNECTING);

			const fullUrl = `${wsUrl}?token=${encodeURIComponent(
				authToken.replace("Bearer ", "")
			)}`;

			const ws = await connectionManager.connect(fullUrl, {
				protocols: ["actioncable-v1-json"],
				autoReconnect: true,
				heartbeatInterval: 30000,
				maxReconnectAttempts: 5,
				timeout: 10000,
				...optionsRef.current,
			});

			// Subscribe to channel
			const subscriptionMessage = {
				command: "subscribe",
				identifier: JSON.stringify({
					channel: channelName,
					user_type: userType,
					user_id: userId,
				}),
			};

			ws.send(JSON.stringify(subscriptionMessage));

			wsStore.setConnectionState(WS_STATES.CONNECTED);
			wsStore.resetReconnectAttempts();
			wsStore.addConnection(channelName, ws);
		} catch (error) {
			wsStore.setConnectionState(WS_STATES.ERROR, error.message);
			wsStore.incrementReconnectAttempts();

			// Retry connection with exponential backoff
			const { reconnectAttempts, maxReconnectAttempts } = wsStore;
			if (reconnectAttempts < maxReconnectAttempts) {
				const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
				setTimeout(connect, delay);
			}
		}
	}, [wsUrl, channelName, userType, userId, authToken, wsStore]);

	// Message handler setup
	useEffect(() => {
		if (!wsUrl) return;

		const messageHandler = (data) => {
			const startTime = performance.now();

			try {
				// Handle different message types
				switch (data.type) {
					case MESSAGE_TYPES.NEW_MESSAGE:
						wsStore.updateConversation(data.conversation_id, data.message);
						break;

					case MESSAGE_TYPES.TYPING_STATUS:
						wsStore.updateTypingStatus(
							data.conversation_id,
							data.user_id,
							data.typing
						);
						break;

					case MESSAGE_TYPES.PRESENCE_UPDATE:
						wsStore.updatePresence(data.user_id, data.status === "online");
						break;

					case MESSAGE_TYPES.MESSAGE_READ:
						wsStore.markMessageAsRead(data.conversation_id, data.message_id);
						break;

					case MESSAGE_TYPES.UNREAD_COUNT_UPDATE:
						wsStore.updateUnreadCount(data.conversation_id, data.unread_count);
						break;

					case MESSAGE_TYPES.MESSAGE_ERROR:
						wsStore.setConnectionState(WS_STATES.ERROR, data.error);
						break;

					default:
						// Call custom message handler if provided
						if (optionsRef.current.onMessage) {
							optionsRef.current.onMessage(data);
						}
				}

				// Track processing time
				const processingTime = performance.now() - startTime;
				wsStore.trackMessageLatency(processingTime);
			} catch (error) {
			}
		};

		handlerRef.current = connectionManager.addMessageHandler(
			wsUrl,
			messageHandler
		);

		return () => {
			if (handlerRef.current) {
				handlerRef.current();
			}
		};
	}, [wsUrl, wsStore]);

	// Connection lifecycle
	useEffect(() => {
		connect();

		return () => {
			if (channelName) {
				wsStore.removeConnection(channelName);
				wsStore.removeSubscription(channelName);
			}
		};
	}, [connect, channelName, wsStore]);

	// Message queue processing
	useEffect(() => {
		const interval = setInterval(() => {
			wsStore.processMessageQueue();
		}, 100);

		return () => clearInterval(interval);
	}, [wsStore]);

	// Public API
	const sendMessage = useCallback(
		(messageData) => {
			const command = {
				command: "message",
				identifier: JSON.stringify({
					channel: channelName,
					user_type: userType,
					user_id: userId,
				}),
				data: JSON.stringify(messageData),
			};

			const success = connectionManager.send(wsUrl, command);

			if (!success) {
				// Queue message for later sending
				wsStore.queueMessage(messageData);
			}

			return success;
		},
		[wsUrl, channelName, userType, userId, wsStore]
	);

	const disconnect = useCallback(() => {
		connectionManager.disconnect(wsUrl);
		wsStore.setConnectionState(WS_STATES.DISCONNECTED);
	}, [wsUrl, wsStore]);

	return {
		connectionState: wsStore.connectionState,
		connectionError: wsStore.connectionError,
		connectionQuality: wsStore.getConnectionQuality(),
		sendMessage,
		disconnect,
		reconnect: connect,
		isConnected: wsStore.connectionState === WS_STATES.CONNECTED,
		isConnecting: wsStore.connectionState === WS_STATES.CONNECTING,
		messageQueue: wsStore.messageQueue,
		averageLatency: wsStore.getAverageLatency(),
	};
};

// Cleanup on app unmount
if (typeof window !== "undefined") {
	window.addEventListener("beforeunload", () => {
		connectionManager.disconnectAll();
	});
}

export default useWebSocket;
