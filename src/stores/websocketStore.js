import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

// WebSocket connection states
export const WS_STATES = {
	DISCONNECTED: "disconnected",
	CONNECTING: "connecting",
	CONNECTED: "connected",
	RECONNECTING: "reconnecting",
	ERROR: "error",
};

// Message types
export const MESSAGE_TYPES = {
	NEW_MESSAGE: "new_message",
	TYPING_STATUS: "typing_status",
	PRESENCE_UPDATE: "presence_update",
	MESSAGE_READ: "message_read",
	UNREAD_COUNT_UPDATE: "unread_count_update",
	MESSAGE_ERROR: "message_error",
};

// Modern WebSocket store using Zustand
export const useWebSocketStore = create(
	subscribeWithSelector((set, get) => ({
		// Connection state
		connectionState: WS_STATES.DISCONNECTED,
		connectionError: null,
		lastConnectedAt: null,
		reconnectAttempts: 0,
		maxReconnectAttempts: 5,

		// Active connections
		connections: new Map(),
		subscriptions: new Map(),

		// Message queues
		messageQueue: [],
		pendingMessages: new Map(),

		// Real-time data
		conversations: new Map(),
		unreadCounts: new Map(),
		typingUsers: new Map(),
		onlineUsers: new Set(),

		// Performance metrics
		messageLatency: [],
		connectionUptime: 0,
		totalMessagesReceived: 0,
		totalMessagesSent: 0,

		// Actions
		setConnectionState: (state, error = null) =>
			set(() => ({
				connectionState: state,
				connectionError: error,
				lastConnectedAt:
					state === WS_STATES.CONNECTED ? new Date() : get().lastConnectedAt,
			})),

		addConnection: (channelName, connection) =>
			set((state) => ({
				connections: new Map(state.connections).set(channelName, connection),
			})),

		removeConnection: (channelName) =>
			set((state) => {
				const newConnections = new Map(state.connections);
				newConnections.delete(channelName);
				return { connections: newConnections };
			}),

		addSubscription: (channelName, subscription) =>
			set((state) => ({
				subscriptions: new Map(state.subscriptions).set(
					channelName,
					subscription
				),
			})),

		removeSubscription: (channelName) =>
			set((state) => {
				const newSubscriptions = new Map(state.subscriptions);
				newSubscriptions.delete(channelName);
				return { subscriptions: newSubscriptions };
			}),

		// Message handling
		queueMessage: (message) =>
			set((state) => ({
				messageQueue: [
					...state.messageQueue,
					{
						...message,
						id: `temp_${Date.now()}_${Math.random()}`,
						timestamp: new Date().toISOString(),
						status: "queued",
					},
				],
			})),

		processMessageQueue: () => {
			const { messageQueue, connectionState } = get();

			if (
				connectionState !== WS_STATES.CONNECTED ||
				messageQueue.length === 0
			) {
				return;
			}

			// Process messages in batches
			const batchSize = 10;
			const batch = messageQueue.slice(0, batchSize);
			const remaining = messageQueue.slice(batchSize);

			set({ messageQueue: remaining });

			// Send each message in the batch
			batch.forEach((message) => {
				get().sendMessage(message);
			});
		},

		addPendingMessage: (tempId, messageData) =>
			set((state) => ({
				pendingMessages: new Map(state.pendingMessages).set(
					tempId,
					messageData
				),
			})),

		removePendingMessage: (tempId) =>
			set((state) => {
				const newPending = new Map(state.pendingMessages);
				newPending.delete(tempId);
				return { pendingMessages: newPending };
			}),

		// Real-time data updates
		updateConversation: (conversationId, messageData) =>
			set((state) => {
				const newConversations = new Map(state.conversations);
				const existing = newConversations.get(conversationId) || {
					messages: [],
					lastActivity: null,
				};

				newConversations.set(conversationId, {
					...existing,
					messages: [...existing.messages, messageData],
					lastActivity: new Date().toISOString(),
				});

				return {
					conversations: newConversations,
					totalMessagesReceived: state.totalMessagesReceived + 1,
				};
			}),

		updateTypingStatus: (conversationId, userId, isTyping) =>
			set((state) => {
				const newTypingUsers = new Map(state.typingUsers);
				const conversationTyping =
					newTypingUsers.get(conversationId) || new Set();

				if (isTyping) {
					conversationTyping.add(userId);
				} else {
					conversationTyping.delete(userId);
				}

				newTypingUsers.set(conversationId, conversationTyping);
				return { typingUsers: newTypingUsers };
			}),

		updatePresence: (userId, isOnline) =>
			set((state) => {
				const newOnlineUsers = new Set(state.onlineUsers);

				if (isOnline) {
					newOnlineUsers.add(userId);
				} else {
					newOnlineUsers.delete(userId);
				}

				return { onlineUsers: newOnlineUsers };
			}),

		updateUnreadCount: (conversationId, count) =>
			set((state) => ({
				unreadCounts: new Map(state.unreadCounts).set(conversationId, count),
			})),

		markMessageAsRead: (conversationId, messageId) =>
			set((state) => {
				const newConversations = new Map(state.conversations);
				const conversation = newConversations.get(conversationId);

				if (conversation) {
					const updatedMessages = conversation.messages.map((msg) =>
						msg.id === messageId ? { ...msg, status: "read" } : msg
					);

					newConversations.set(conversationId, {
						...conversation,
						messages: updatedMessages,
					});
				}

				return { conversations: newConversations };
			}),

		// Performance tracking
		trackMessageLatency: (latency) =>
			set((state) => {
				const newLatency = [...state.messageLatency, latency].slice(-100); // Keep last 100
				return { messageLatency: newLatency };
			}),

		incrementReconnectAttempts: () =>
			set((state) => ({
				reconnectAttempts: state.reconnectAttempts + 1,
			})),

		resetReconnectAttempts: () => set({ reconnectAttempts: 0 }),

		// Utility methods
		getAverageLatency: () => {
			const { messageLatency } = get();
			if (messageLatency.length === 0) return 0;
			return (
				messageLatency.reduce((sum, lat) => sum + lat, 0) /
				messageLatency.length
			);
		},

		getConnectionQuality: () => {
			const { connectionState, reconnectAttempts, messageLatency } = get();

			if (connectionState !== WS_STATES.CONNECTED) return "poor";
			if (reconnectAttempts > 2) return "fair";

			const avgLatency = get().getAverageLatency();
			if (avgLatency < 100) return "excellent";
			if (avgLatency < 300) return "good";
			if (avgLatency < 500) return "fair";
			return "poor";
		},

		getTotalUnreadCount: () => {
			const { unreadCounts } = get();
			return Array.from(unreadCounts.values()).reduce(
				(sum, count) => sum + count,
				0
			);
		},

		getConversationMessages: (conversationId) => {
			const { conversations } = get();
			return conversations.get(conversationId)?.messages || [];
		},

		isUserTyping: (conversationId, userId) => {
			const { typingUsers } = get();
			return typingUsers.get(conversationId)?.has(userId) || false;
		},

		isUserOnline: (userId) => {
			const { onlineUsers } = get();
			return onlineUsers.has(userId);
		},

		// Cleanup
		clearConversationData: (conversationId) =>
			set((state) => {
				const newConversations = new Map(state.conversations);
				const newUnreadCounts = new Map(state.unreadCounts);
				const newTypingUsers = new Map(state.typingUsers);

				newConversations.delete(conversationId);
				newUnreadCounts.delete(conversationId);
				newTypingUsers.delete(conversationId);

				return {
					conversations: newConversations,
					unreadCounts: newUnreadCounts,
					typingUsers: newTypingUsers,
				};
			}),

		reset: () =>
			set({
				connectionState: WS_STATES.DISCONNECTED,
				connectionError: null,
				lastConnectedAt: null,
				reconnectAttempts: 0,
				connections: new Map(),
				subscriptions: new Map(),
				messageQueue: [],
				pendingMessages: new Map(),
				conversations: new Map(),
				unreadCounts: new Map(),
				typingUsers: new Map(),
				onlineUsers: new Set(),
				messageLatency: [],
				connectionUptime: 0,
				totalMessagesReceived: 0,
				totalMessagesSent: 0,
			}),
	}))
);

// Selectors for performance optimization
export const selectConnectionState = (state) => state.connectionState;
export const selectConnectionError = (state) => state.connectionError;
export const selectMessageQueue = (state) => state.messageQueue;
export const selectConversations = (state) => state.conversations;
export const selectUnreadCounts = (state) => state.unreadCounts;
export const selectTypingUsers = (state) => state.typingUsers;
export const selectOnlineUsers = (state) => state.onlineUsers;
export const selectConnectionQuality = (state) => state.getConnectionQuality();
export const selectTotalUnreadCount = (state) => state.getTotalUnreadCount();
