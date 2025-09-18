import React, {
	useEffect,
	useState,
	useRef,
	useCallback,
	useMemo,
} from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useWebSocketStore, WS_STATES } from "../stores/websocketStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPaperPlane,
	faCircle,
	faWifi,
	faWifiSlash,
	faExclamationTriangle,
	faEllipsisH,
	faCheck,
	faCheckDouble,
	faClock,
} from "@fortawesome/free-solid-svg-icons";

const ModernMessages = ({
	userType,
	userId,
	conversationId,
	onMessageSent,
	className = "",
}) => {
	// WebSocket connection
	const {
		connectionState,
		connectionError,
		connectionQuality,
		sendMessage,
		isConnected,
		isConnecting,
		averageLatency,
	} = useWebSocket("ConversationsChannel", userType, userId);

	// WebSocket store state
	const wsStore = useWebSocketStore();
	const messages = wsStore.getConversationMessages(conversationId);
	const unreadCount = wsStore.unreadCounts.get(conversationId) || 0;
	const typingUsers = Array.from(wsStore.typingUsers.get(conversationId) || []);
	const onlineUsers = wsStore.onlineUsers;

	// Component state
	const [messageText, setMessageText] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [showConnectionInfo, setShowConnectionInfo] = useState(false);

	// Refs
	const messagesEndRef = useRef(null);
	const typingTimeoutRef = useRef(null);
	const messageInputRef = useRef(null);

	// Scroll to bottom when new messages arrive
	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	// Handle typing indicators
	const handleTypingStart = useCallback(() => {
		if (!isTyping && isConnected) {
			setIsTyping(true);
			sendMessage({
				action: "typing",
				conversation_id: conversationId,
				typing: true,
			});
		}

		// Clear existing timeout
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		// Set timeout to stop typing indicator
		typingTimeoutRef.current = setTimeout(() => {
			if (isTyping) {
				setIsTyping(false);
				sendMessage({
					action: "typing",
					conversation_id: conversationId,
					typing: false,
				});
			}
		}, 3000);
	}, [isTyping, isConnected, sendMessage, conversationId]);

	const handleTypingStop = useCallback(() => {
		if (isTyping) {
			setIsTyping(false);
			sendMessage({
				action: "typing",
				conversation_id: conversationId,
				typing: false,
			});
		}

		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}
	}, [isTyping, sendMessage, conversationId]);

	// Handle message input
	const handleInputChange = useCallback(
		(e) => {
			setMessageText(e.target.value);

			if (e.target.value.trim() && !isTyping) {
				handleTypingStart();
			} else if (!e.target.value.trim() && isTyping) {
				handleTypingStop();
			}
		},
		[isTyping, handleTypingStart, handleTypingStop]
	);

	// Send message
	const handleSendMessage = useCallback(
		async (e) => {
			e.preventDefault();

			const trimmedMessage = messageText.trim();
			if (!trimmedMessage || !isConnected) return;

			const messageData = {
				conversation_id: conversationId,
				content: trimmedMessage,
				sender_type: userType,
				sender_id: userId,
				message_type: "text",
			};

			// Optimistic update - add message to local state immediately
			const tempMessage = {
				id: `temp_${Date.now()}`,
				...messageData,
				created_at: new Date().toISOString(),
				status: "sending",
			};

			wsStore.updateConversation(conversationId, tempMessage);

			// Send via WebSocket
			const success = sendMessage(messageData);

			if (success) {
				setMessageText("");
				handleTypingStop();
				onMessageSent?.(messageData);
			} else {
				// Update status to failed
				wsStore.updateConversation(conversationId, {
					...tempMessage,
					status: "failed",
				});
			}
		},
		[
			messageText,
			isConnected,
			conversationId,
			userType,
			userId,
			sendMessage,
			wsStore,
			handleTypingStop,
			onMessageSent,
		]
	);

	// Mark message as read
	const markAsRead = useCallback(
		(messageId) => {
			if (isConnected) {
				sendMessage({
					action: "mark_read",
					message_id: messageId,
				});
			}
		},
		[isConnected, sendMessage]
	);

	// Connection status indicator
	const connectionStatus = useMemo(() => {
		switch (connectionState) {
			case WS_STATES.CONNECTED:
				return {
					icon: faWifi,
					color: "text-green-500",
					text: `Connected (${connectionQuality})`,
					details: `Latency: ${Math.round(averageLatency)}ms`,
				};
			case WS_STATES.CONNECTING:
			case WS_STATES.RECONNECTING:
				return {
					icon: faWifi,
					color: "text-yellow-500",
					text: "Connecting...",
					details: "Establishing connection",
				};
			case WS_STATES.ERROR:
				return {
					icon: faWifiSlash,
					color: "text-red-500",
					text: "Connection Error",
					details: connectionError || "Unknown error",
				};
			default:
				return {
					icon: faWifiSlash,
					color: "text-gray-500",
					text: "Disconnected",
					details: "No connection",
				};
		}
	}, [connectionState, connectionQuality, averageLatency, connectionError]);

	// Format message timestamp
	const formatTimestamp = useCallback((timestamp) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInHours = (now - date) / (1000 * 60 * 60);

		if (diffInHours < 1) {
			return date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		} else if (diffInHours < 24) {
			return date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		} else {
			return date.toLocaleDateString([], { month: "short", day: "numeric" });
		}
	}, []);

	// Get user online status
	const isUserOnline = useCallback(
		(userId) => {
			return onlineUsers.has(userId);
		},
		[onlineUsers]
	);

	return (
		<div
			className={`flex flex-col h-full bg-white border border-gray-200 rounded-lg ${className}`}
		>
			{/* Header with connection status */}
			<div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
				<div className="flex items-center space-x-2">
					<h3 className="font-medium text-gray-900">Messages</h3>
					{unreadCount > 0 && (
						<span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
							{unreadCount}
						</span>
					)}
				</div>

				<div
					className="flex items-center space-x-2 cursor-pointer"
					onClick={() => setShowConnectionInfo(!showConnectionInfo)}
				>
					<FontAwesomeIcon
						icon={connectionStatus.icon}
						className={`w-4 h-4 ${connectionStatus.color}`}
					/>
					<span className={`text-sm ${connectionStatus.color}`}>
						{connectionStatus.text}
					</span>
				</div>
			</div>

			{/* Connection details (expandable) */}
			{showConnectionInfo && (
				<div className="p-3 bg-gray-100 border-b border-gray-200 text-sm text-gray-600">
					<div className="flex justify-between">
						<span>Status:</span>
						<span className={connectionStatus.color}>
							{connectionStatus.details}
						</span>
					</div>
					{isConnected && (
						<div className="flex justify-between mt-1">
							<span>Quality:</span>
							<span className="capitalize">{connectionQuality}</span>
						</div>
					)}
				</div>
			)}

			{/* Messages area */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.length === 0 ? (
					<div className="text-center text-gray-500 py-8">
						<p>No messages yet. Start the conversation!</p>
					</div>
				) : (
					messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${
								message.sender_id === userId ? "justify-end" : "justify-start"
							}`}
							onClick={() => markAsRead(message.id)}
						>
							<div
								className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
									message.sender_id === userId
										? "bg-blue-500 text-white"
										: "bg-gray-200 text-gray-900"
								}`}
							>
								<p className="text-sm">{message.content}</p>
								<div className="flex items-center justify-between mt-1">
									<span className="text-xs opacity-75">
										{formatTimestamp(message.created_at)}
									</span>
									{message.sender_id === userId && (
										<div className="flex items-center space-x-1">
											{message.status === "sending" && (
												<FontAwesomeIcon
													icon={faClock}
													className="w-3 h-3 text-gray-400 animate-pulse"
													title="Sending..."
												/>
											)}
											{message.status === "sent" && (
												<FontAwesomeIcon
													icon={faCheck}
													className="w-3 h-3 text-gray-400"
													title="Sent"
												/>
											)}
											{message.status === "delivered" && (
												<FontAwesomeIcon
													icon={faCheckDouble}
													className="w-3 h-3 text-gray-400"
													title="Delivered"
												/>
											)}
											{message.status === "read" && (
												<FontAwesomeIcon
													icon={faCheckDouble}
													className="w-3 h-3 text-yellow-500"
													title="Read"
												/>
											)}
											{message.status === "failed" && (
												<FontAwesomeIcon
													icon={faExclamationTriangle}
													className="w-3 h-3 text-red-500"
													title="Failed"
												/>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					))
				)}

				{/* Typing indicators */}
				{typingUsers.length > 0 && (
					<div className="flex justify-start">
						<div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg">
							<div className="flex items-center space-x-1">
								<FontAwesomeIcon
									icon={faEllipsisH}
									className="w-4 h-4 animate-pulse"
								/>
								<span className="text-xs">
									{typingUsers.length === 1
										? "Someone is typing..."
										: `${typingUsers.length} people are typing...`}
								</span>
							</div>
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			{/* Message input */}
			<form
				onSubmit={handleSendMessage}
				className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg"
			>
				<div className="flex space-x-2">
					<input
						ref={messageInputRef}
						type="text"
						value={messageText}
						onChange={handleInputChange}
						placeholder={isConnected ? "Type a message..." : "Connecting..."}
						disabled={!isConnected}
						className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						maxLength={5000}
					/>
					<button
						type="submit"
						disabled={!messageText.trim() || !isConnected}
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
					>
						<FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
					</button>
				</div>

				{/* Character count */}
				<div className="flex justify-between items-center mt-2 text-xs text-gray-500">
					<span>
						{isConnected ? "Connected" : "Disconnected"} • {messages.length}{" "}
						messages
					</span>
					<span>{messageText.length}/5000</span>
				</div>
			</form>
		</div>
	);
};

export default ModernMessages;
