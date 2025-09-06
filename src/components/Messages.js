import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSearch,
	faEnvelopeOpenText,
	faArrowLeft,
	faImage,
	faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "react-spinkit";
import useActionCable from "../hooks/useActionCable";
import usePresence from "../hooks/usePresence";

const getParticipantInfo = (conversation, currentUser, userType) => {
	// For buyer conversations, show the OTHER participant (not the current buyer)
	// For seller conversations, show the buyer
	// For admin conversations, show the other participant

	if (userType === "buyer") {
		if (conversation.admin) {
			return {
				name:
					conversation.admin.fullname || conversation.admin.username || "Admin",
				avatar: conversation.admin.profile_picture,
				type: "admin",
				online: true,
			};
		}
		if (conversation.seller) {
			return {
				name:
					conversation.seller.fullname ||
					conversation.seller.username ||
					"Seller",
				avatar: conversation.seller.profile_picture,
				type: "seller",
				online: true,
			};
		}
	} else if (userType === "seller") {
		if (conversation.buyer) {
			return {
				name:
					conversation.buyer.fullname || conversation.buyer.username || "Buyer",
				avatar: conversation.buyer.profile_picture,
				type: "buyer",
				online: true,
			};
		}
		if (conversation.admin) {
			return {
				name:
					conversation.admin.fullname || conversation.admin.username || "Admin",
				avatar: conversation.admin.profile_picture,
				type: "admin",
				online: true,
			};
		}
	} else if (userType === "admin") {
		if (conversation.buyer) {
			return {
				name:
					conversation.buyer.fullname || conversation.buyer.username || "Buyer",
				avatar: conversation.buyer.profile_picture,
				type: "buyer",
				online: true,
			};
		}
		if (conversation.seller) {
			return {
				name:
					conversation.seller.fullname ||
					conversation.seller.username ||
					"Seller",
				avatar: conversation.seller.profile_picture,
				type: "seller",
				online: true,
			};
		}
	}

	return { name: "Unknown User", avatar: null, type: "unknown", online: false };
};

const formatTime = (timestamp) => {
	const date = new Date(timestamp);
	const now = new Date();
	const diffInHours = (now - date) / (1000 * 60 * 60);

	if (diffInHours < 24) {
		return date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	} else if (diffInHours < 48) {
		return "Yesterday";
	} else {
		return date.toLocaleDateString();
	}
};

const getMessageStatusIcon = (messageId, messageStatuses) => {
	const status = messageStatuses[messageId];
	if (!status) return "✓"; // Sent

	switch (status.status) {
		case "read":
			return "✓✓"; // Double check for read
		case "delivered":
			return "✓"; // Single check for delivered
		default:
			return "✓"; // Single check for sent
	}
};

const getParticipantInfoWithOnlineStatus = (
	conversation,
	currentUser,
	userType,
	onlineUsers
) => {
	const baseInfo = getParticipantInfo(conversation, currentUser, userType);
	const userId = `${baseInfo.type}_${conversation[baseInfo.type]?.id}`;
	const isOnline = onlineUsers.has(userId);

	return {
		...baseInfo,
		online: isOnline,
	};
};

const Messages = ({
	userType = "buyer", // 'buyer', 'seller', 'admin'
	apiBaseUrl = "/buyer/conversations",
	showSidebar = true,
	sidebarComponent = null,
	navbarComponent = null,
	title = "Messages",
	containerClassName = "",
	onConversationSelect = null,
	onMessageSend = null,
	showProductContext = true,
	showOnlineStatus = true,
	showSearch = true,
	maxWidth = "max-w-7xl",
}) => {
	const [conversations, setConversations] = useState([]);
	const [selectedConversation, setSelectedConversation] = useState(null);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [showMobileMessages, setShowMobileMessages] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [typingTimeout, setTypingTimeout] = useState(null);
	const [connectionStatus, setConnectionStatus] = useState("connecting"); // Start as connecting
	const [onlineUsers, setOnlineUsers] = useState(new Set());
	const [typingUsers, setTypingUsers] = useState(new Set());
	const [messageStatuses, setMessageStatuses] = useState({});
	const [unreadCounts, setUnreadCounts] = useState({}); // Per-conversation unread counts
	const messagesEndRef = useRef(null);

	// ActionCable for real-time messaging
	const { sendMessage: sendRealtimeMessage } = useActionCable(
		currentUser?.type?.toLowerCase(),
		currentUser?.id,
		useCallback(
			(data) => {
				// Handle incoming real-time messages
				if (
					data.type === "new_message" &&
					data.conversation_id === selectedConversation?.id
				) {
					// Add the new message to the current conversation
					setMessages((prevMessages) => {
						const newMessage = data.message;
						// Check if message already exists to avoid duplicates
						if (prevMessages.find((msg) => msg.id === newMessage.id)) {
							return prevMessages;
						}
						return [...prevMessages, newMessage].sort(
							(a, b) => new Date(a.created_at) - new Date(b.created_at)
						);
					});

					// Update conversation list with new last message
					setConversations((prevConversations) => {
						return prevConversations.map((conv) => {
							if (conv.id === data.conversation_id) {
								return {
									...conv,
									last_message: data.message.content,
									last_message_time: data.message.created_at,
								};
							}
							return conv;
						});
					});
				}
			},
			[selectedConversation?.id]
		),
		useCallback((status) => {
			setConnectionStatus(status);
		}, [])
	);

	// Presence for online status, typing, and message status
	const { handleTyping, sendMessageRead, sendMessageDelivered } = usePresence(
		currentUser?.type?.toLowerCase(),
		currentUser?.id,
		useCallback((data) => {
			// Handle online status changes
			const userId = `${data.user_type}_${data.user_id}`;
			if (data.online) {
				setOnlineUsers((prev) => new Set([...prev, userId]));
			} else {
				setOnlineUsers((prev) => {
					const newSet = new Set(prev);
					newSet.delete(userId);
					return newSet;
				});
			}
		}, []),
		useCallback(
			(data) => {
				// Handle typing status changes
				const userId = `${data.user_type}_${data.user_id}`;

				// Only process typing events for the current conversation
				if (data.conversation_id === selectedConversation?.id) {
					if (data.typing) {
						setTypingUsers((prev) => new Set([...prev, userId]));
					} else {
						setTypingUsers((prev) => {
							const newSet = new Set(prev);
							newSet.delete(userId);
							return newSet;
						});
					}
				}
			},
			[selectedConversation?.id]
		),
		useCallback((data) => {
			// Handle message status changes (read/delivered)
			setMessageStatuses((prev) => ({
				...prev,
				[data.message_id]: {
					status: data.type === "message_read" ? "read" : "delivered",
					timestamp:
						data.type === "message_read" ? data.read_at : data.delivered_at,
				},
			}));
		}, [])
	);

	useEffect(() => {
		window.history.replaceState({ view: "list" }, "", "");
	}, []);

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (token) {
			const payload = JSON.parse(atob(token.split(".")[1]));
			const userId =
				payload.seller_id || payload.buyer_id || payload.user_id || payload.id;
			const userTypeFromToken = payload.role || payload.type || userType;
			setCurrentUser({ id: userId, type: userTypeFromToken });
		}
	}, [userType]);

	useEffect(() => {
		const fetchConversations = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}${apiBaseUrl}`,
					{
						headers: {
							Authorization: "Bearer " + sessionStorage.getItem("token"),
						},
					}
				);
				if (!response.ok) throw new Error("Network response was not ok");
				const data = await response.json();
				setConversations(Array.isArray(data) ? data : []);
			} catch (error) {
				console.error("Error fetching conversations:", error);
			} finally {
				setLoadingConversations(false);
			}
		};

		fetchConversations();
	}, [apiBaseUrl]);

	// Fetch per-conversation unread counts
	const fetchUnreadCounts = useCallback(async () => {
		if (!currentUser || !userType) return;

		try {
			const token = sessionStorage.getItem("token");
			const response = await fetch(
				`${
					process.env.REACT_APP_BACKEND_URL
				}/${userType.toLowerCase()}/conversations/unread_counts`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				const countsMap = {};
				data.unread_counts.forEach((item) => {
					countsMap[item.conversation_id] = item.unread_count;
				});
				setUnreadCounts(countsMap);
			}
		} catch (error) {
			console.error("Error fetching unread counts:", error);
		}
	}, [currentUser, userType]);

	// Fetch unread counts when conversations are loaded
	useEffect(() => {
		if (conversations.length > 0) {
			fetchUnreadCounts();
		}
	}, [conversations, fetchUnreadCounts]);

	const fetchMessages = async (conversationId) => {
		setLoadingMessages(true);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}${apiBaseUrl}/${conversationId}/messages`,
				{
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);
			if (!response.ok) throw new Error("Network response was not ok");
			const data = await response.json();

			const messagesArray = data.messages || data;
			const sortedMessages = Array.isArray(messagesArray)
				? messagesArray.sort(
						(a, b) => new Date(a.created_at) - new Date(b.created_at)
				  )
				: [];
			setMessages(sortedMessages);
		} catch (error) {
			console.error("Error fetching messages:", error);
		} finally {
			setLoadingMessages(false);
		}
	};

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	// Cleanup typing timeout on unmount
	useEffect(() => {
		return () => {
			if (typingTimeout) {
				clearTimeout(typingTimeout);
			}
		};
	}, [typingTimeout]);

	// Clear typing indicators when conversation changes
	useEffect(() => {
		setTypingUsers(new Set());
	}, [selectedConversation?.id]);

	const handleConversationClick = (conversation) => {
		setSelectedConversation(conversation);
		setShowMobileMessages(true);
		fetchMessages(conversation.id);
		window.history.pushState({ view: "conversation" }, "", "");

		if (onConversationSelect) {
			onConversationSelect(conversation);
		}
	};

	const isMessageSentByCurrentUser = useCallback(
		(message) => {
			const messageSenderType = message.sender_type?.toLowerCase().trim();
			const currentUserType = currentUser?.type?.toLowerCase().trim();
			return (
				messageSenderType === currentUserType &&
				String(message.sender_id) === String(currentUser.id)
			);
		},
		[currentUser]
	);

	// Mark messages as delivered when conversation is viewed
	useEffect(() => {
		if (selectedConversation && messages.length > 0) {
			// Mark unread messages as delivered
			messages.forEach((message) => {
				if (
					!isMessageSentByCurrentUser(message) &&
					!messageStatuses[message.id]
				) {
					sendMessageDelivered(message.id);
					// Dispatch custom event to notify Navbar to refresh unread count
					window.dispatchEvent(new CustomEvent("messageDelivered"));
				}
			});
		}
	}, [
		selectedConversation,
		messages,
		messageStatuses,
		sendMessageDelivered,
		isMessageSentByCurrentUser,
	]);

	// Mark messages as read when they are viewed
	useEffect(() => {
		if (selectedConversation && messages.length > 0) {
			// Mark unread messages as read after a short delay
			const timer = setTimeout(() => {
				messages.forEach((message) => {
					if (
						!isMessageSentByCurrentUser(message) &&
						!messageStatuses[message.id]
					) {
						sendMessageRead(message.id);
						// Dispatch custom event to notify Navbar to refresh unread count
						window.dispatchEvent(new CustomEvent("messageRead"));
					}
				});
			}, 1000); // 1 second delay

			return () => clearTimeout(timer);
		}
	}, [
		selectedConversation,
		messages,
		messageStatuses,
		sendMessageRead,
		isMessageSentByCurrentUser,
	]);

	// Update unread counts when messages are read
	useEffect(() => {
		if (selectedConversation && messages.length > 0) {
			// Clear unread count for current conversation when messages are viewed
			setUnreadCounts((prev) => ({
				...prev,
				[selectedConversation.id]: 0,
			}));
		}
	}, [selectedConversation, messages]);

	// Listen for new messages to update unread counts
	useEffect(() => {
		const handleNewMessage = () => {
			fetchUnreadCounts();
		};

		window.addEventListener("newMessage", handleNewMessage);
		return () => {
			window.removeEventListener("newMessage", handleNewMessage);
		};
	}, [fetchUnreadCounts]);

	const handleBackToConversations = () => {
		setShowMobileMessages(false);
		setSelectedConversation(null);
	};

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!newMessage.trim()) return;

		try {
			// Send message via ActionCable for real-time delivery
			sendRealtimeMessage(
				selectedConversation.id,
				newMessage,
				currentUser.type,
				currentUser.id
			);

			// Also send via REST API for persistence
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}${apiBaseUrl}/${selectedConversation.id}/messages`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
					body: JSON.stringify({
						content: newMessage,
						sender_id: currentUser.id,
						sender_type: currentUser.type,
					}),
				}
			);

			if (!response.ok) throw new Error("Network response was not ok");
			const message = await response.json();

			// Add message to local state immediately for instant feedback
			setMessages((prevMessages) => {
				const updatedMessages = [...prevMessages, message].sort(
					(a, b) => new Date(a.created_at) - new Date(b.created_at)
				);
				return updatedMessages;
			});

			// Update conversation list
			const updatedConversation = {
				...selectedConversation,
				last_message: newMessage,
				last_message_time: new Date().toISOString(),
			};
			const updatedConversations = conversations
				.filter((convo) => convo.id !== selectedConversation.id)
				.map((convo) => ({ ...convo, pullOver: false }));

			setConversations([updatedConversation, ...updatedConversations]);

			setTimeout(() => {
				setConversations((prevConversations) =>
					prevConversations.map((convo) => {
						if (convo.id === updatedConversation.id) {
							return { ...convo, pullOver: false };
						}
						return convo;
					})
				);
			}, 500);

			setNewMessage("");

			if (onMessageSend) {
				onMessageSend(message, selectedConversation);
			}
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	const filteredConversations = conversations.filter((conversation) => {
		const participantInfo = getParticipantInfo(
			conversation,
			currentUser,
			userType
		);
		return participantInfo.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
	});

	if (!currentUser) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<Spinner name="cube-grid" color="#ffc107" />
			</div>
		);
	}

	return (
		<>
			{navbarComponent}
			<div className="h-[95vh] bg-gray-50 flex flex-col">
				<div className="flex flex-1 overflow-hidden">
					{showSidebar && sidebarComponent}

					<div className={`flex-1 ${containerClassName}`}>
						<div className={`${maxWidth} mx-auto h-full`}>
							<div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
								<div className="flex h-full">
									{/* Conversations List */}
									<div
										className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${
											showMobileMessages ? "hidden md:flex" : "flex"
										}`}
									>
										{/* Header */}
										<div className="p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
											<h2 className="text-lg font-semibold text-gray-800 mb-3">
												{title} ({filteredConversations.length})
											</h2>
											{showSearch && (
												<div className="relative">
													<FontAwesomeIcon
														icon={faSearch}
														className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
													/>
													<input
														type="text"
														placeholder="Search conversations..."
														value={searchQuery}
														onChange={(e) => setSearchQuery(e.target.value)}
														className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
													/>
												</div>
											)}
										</div>

										{/* Conversations */}
										<div className="flex-1 overflow-y-auto">
											{loadingConversations ? (
												<div className="flex items-center justify-center h-32">
													<Spinner name="cube-grid" color="#ffc107" />
												</div>
											) : filteredConversations.length === 0 ? (
												<div className="flex flex-col items-center justify-center h-32 text-gray-500">
													<FontAwesomeIcon
														icon={faEnvelopeOpenText}
														className="text-3xl mb-2"
													/>
													<p className="text-sm">No conversations found</p>
												</div>
											) : (
												filteredConversations
													.sort((a, b) => {
														const dateA = new Date(
															a.last_message_time || a.updated_at
														);
														const dateB = new Date(
															b.last_message_time || b.updated_at
														);
														return dateB - dateA;
													})
													.map((conversation) => {
														const participantInfo = getParticipantInfo(
															conversation,
															currentUser,
															userType
														);
														const lastMessage = conversation.last_message;
														const isActive =
															selectedConversation?.id === conversation.id;

														return (
															<div
																key={conversation.id}
																onClick={() =>
																	handleConversationClick(conversation)
																}
																className={`p-2 border-b border-gray-100 cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${
																	isActive
																		? "bg-yellow-50 border-l-4 border-l-yellow-500"
																		: ""
																}`}
															>
																<div className="flex items-start space-x-2">
																	{/* Avatar */}
																	<div className="flex-shrink-0">
																		{participantInfo.avatar ? (
																			<img
																				src={participantInfo.avatar}
																				alt={participantInfo.name}
																				className="w-8 h-8 rounded-full object-cover"
																			/>
																		) : (
																			<div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
																				{participantInfo.name
																					.charAt(0)
																					.toUpperCase()}
																			</div>
																		)}
																	</div>

																	{/* Info */}
																	<div className="flex-1 min-w-0">
																		<div className="flex items-center justify-between">
																			<h3
																				className={`text-sm font-medium truncate ${
																					isActive
																						? "text-yellow-700"
																						: "text-gray-900"
																				}`}
																			>
																				{participantInfo.name}
																			</h3>
																			<div className="flex items-center space-x-1">
																				{/* Unread count badge */}
																				{unreadCounts[conversation.id] > 0 && (
																					<span className="bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold">
																						{unreadCounts[conversation.id] > 99
																							? "99+"
																							: unreadCounts[conversation.id]}
																					</span>
																				)}
																				{lastMessage && (
																					<span className="text-xs text-gray-500">
																						{formatTime(
																							conversation.last_message_time ||
																								conversation.updated_at
																						)}
																					</span>
																				)}
																			</div>
																		</div>
																		{lastMessage && (
																			<p className="text-xs text-gray-600 truncate">
																				{lastMessage}
																			</p>
																		)}
																	</div>
																</div>
															</div>
														);
													})
											)}
										</div>
									</div>

									{/* Messages Area */}
									<div
										className={`flex-1 flex flex-col ${
											showMobileMessages ? "block" : "hidden md:flex"
										}`}
									>
										{selectedConversation ? (
											<div className="flex flex-col h-full">
												{/* Header */}
												<div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white flex-shrink-0">
													<div className="flex items-center space-x-2">
														<button
															onClick={handleBackToConversations}
															className="p-1 hover:bg-gray-100 rounded transition-colors"
															title="Back to conversations"
														>
															<FontAwesomeIcon
																icon={faArrowLeft}
																className="text-gray-600"
															/>
														</button>

														{(() => {
															const participantInfo =
																getParticipantInfoWithOnlineStatus(
																	selectedConversation,
																	currentUser,
																	userType,
																	onlineUsers
																);
															return participantInfo.avatar ? (
																<img
																	src={participantInfo.avatar}
																	alt={participantInfo.name}
																	className="w-8 h-8 rounded-full object-cover"
																/>
															) : (
																<div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
																	{participantInfo.name.charAt(0).toUpperCase()}
																</div>
															);
														})()}

														{(() => {
															const participantInfo =
																getParticipantInfoWithOnlineStatus(
																	selectedConversation,
																	currentUser,
																	userType,
																	onlineUsers
																);
															return (
																<>
																	<h3 className="font-medium text-gray-900">
																		{participantInfo.name}
																	</h3>
																	{showOnlineStatus && (
																		<span
																			className={`text-xs ${
																				participantInfo.online
																					? "text-green-500"
																					: "text-gray-500"
																			}`}
																		>
																			{participantInfo.online
																				? "● Online"
																				: "○ Offline"}
																		</span>
																	)}
																	{(() => {
																		const participantInfo =
																			getParticipantInfoWithOnlineStatus(
																				selectedConversation,
																				currentUser,
																				userType,
																				onlineUsers
																			);
																		// Create the correct user ID for typing status
																		const userId = `${participantInfo.type}_${
																			selectedConversation[participantInfo.type]
																				?.id
																		}`;
																		const isOtherUserTyping =
																			typingUsers.has(userId);

																		return isOtherUserTyping ? (
																			<span className="text-xs text-blue-500 ml-2">
																				{participantInfo.name} is typing...
																			</span>
																		) : null;
																	})()}
																	{connectionStatus !== "connected" && (
																		<span
																			className={`text-xs ml-2 ${
																				connectionStatus === "connecting"
																					? "text-yellow-500"
																					: "text-red-500"
																			}`}
																		>
																			{connectionStatus === "connecting"
																				? "connecting..."
																				: "offline"}
																		</span>
																	)}
																</>
															);
														})()}
													</div>

													<button
														onClick={handleBackToConversations}
														className="p-1 hover:bg-gray-100 rounded transition-colors"
														title="Back to conversations"
													>
														<FontAwesomeIcon
															icon={faArrowLeft}
															className="text-gray-600"
														/>
													</button>
												</div>

												{/* Messages */}
												<div className="flex-1 overflow-y-auto p-3 bg-gray-50">
													{loadingMessages ? (
														<div className="flex items-center justify-center h-32">
															<Spinner name="cube-grid" color="#ffc107" />
														</div>
													) : messages.length === 0 ? (
														<div className="flex flex-col items-center justify-center h-32 text-gray-500">
															<FontAwesomeIcon
																icon={faEnvelopeOpenText}
																className="text-3xl mb-2"
															/>
															<p className="text-sm">No messages yet</p>
															<p className="text-xs">Start the conversation!</p>
														</div>
													) : (
														<div className="space-y-2">
															{messages.map((message) => {
																const isSent =
																	isMessageSentByCurrentUser(message);
																const messageAdInfo =
																	showProductContext && message.ad
																		? {
																				title: message.ad.title,
																				price: message.ad.price,
																				image: message.ad.first_media_url,
																				category: message.ad.category,
																		  }
																		: null;

																return (
																	<div
																		key={message.id}
																		className={`flex ${
																			isSent ? "justify-end" : "justify-start"
																		}`}
																	>
																		<div
																			className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
																				isSent
																					? "bg-yellow-500 text-white"
																					: "bg-white text-gray-900 shadow-sm border border-gray-100"
																			}`}
																		>
																			{/* Product Context */}
																			{messageAdInfo && (
																				<div
																					className={`mb-1 p-2 rounded ${
																						isSent
																							? "bg-yellow-600"
																							: "bg-gray-50"
																					}`}
																				>
																					<div className="flex items-center space-x-2">
																						<div className="w-40 h-40 bg-gray-200 rounded overflow-hidden flex-shrink-0">
																							{messageAdInfo.image ? (
																								<img
																									src={messageAdInfo.image}
																									alt={messageAdInfo.title}
																									className="w-full h-full object-cover"
																								/>
																							) : (
																								<div className="w-full h-full bg-gray-300 flex items-center justify-center">
																									<FontAwesomeIcon
																										icon={faImage}
																										className="text-gray-500 text-xs"
																									/>
																								</div>
																							)}
																						</div>
																						<div className="flex-1 min-w-0">
																							<p
																								className={`text-xs font-medium truncate ${
																									isSent
																										? "text-yellow-100"
																										: "text-gray-800"
																								}`}
																							>
																								{messageAdInfo.title}
																							</p>
																							{messageAdInfo.category && (
																								<p
																									className={`text-xs truncate -mt-0.5 ${
																										isSent
																											? "text-yellow-200"
																											: "text-gray-500"
																									}`}
																								>
																									{messageAdInfo.category}
																								</p>
																							)}
																						</div>
																					</div>
																				</div>
																			)}

																			{/* Message Content */}
																			<p className="text-sm">
																				{message.content}
																			</p>

																			{/* Message Time */}
																			<div
																				className={`text-xs mt-1 ${
																					isSent
																						? "text-yellow-100"
																						: "text-gray-500"
																				}`}
																			>
																				{formatTime(message.created_at)}
																				{isSent && (
																					<span className="ml-1">
																						{getMessageStatusIcon(
																							message.id,
																							messageStatuses
																						)}
																					</span>
																				)}
																			</div>
																		</div>
																	</div>
																);
															})}
															<div ref={messagesEndRef} />
														</div>
													)}
												</div>

												{/* Message Input */}
												<div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
													<form
														onSubmit={handleSendMessage}
														className="flex items-center space-x-2"
													>
														<button
															type="button"
															className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
														>
															<FontAwesomeIcon icon={faImage} />
														</button>
														<input
															type="text"
															value={newMessage}
															onChange={(e) => {
																setNewMessage(e.target.value);
																// Handle typing indicator
																if (typingTimeout) {
																	clearTimeout(typingTimeout);
																}
																handleTyping(true, selectedConversation?.id);
																const timeout = setTimeout(() => {
																	handleTyping(false, selectedConversation?.id);
																}, 2000);
																setTypingTimeout(timeout);
															}}
															placeholder="Type your message..."
															className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
														/>
														<button
															type="submit"
															disabled={!newMessage.trim()}
															className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
														>
															<FontAwesomeIcon icon={faPaperPlane} />
														</button>
													</form>
												</div>
											</div>
										) : (
											<div className="flex items-center justify-center h-full text-gray-500">
												<div className="text-center">
													<FontAwesomeIcon
														icon={faEnvelopeOpenText}
														className="text-4xl mb-2"
													/>
													<p className="text-sm">
														Select a conversation to start messaging
													</p>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Messages;
