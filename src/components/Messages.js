import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSearch,
	faEnvelopeOpenText,
	faArrowLeft,
	faImage,
	faPaperPlane,
	faClock,
	faTimes,
	faEye,
} from "@fortawesome/free-solid-svg-icons";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";
import Spinner from "react-spinkit";
import useActionCable from "../hooks/useActionCable";
import usePresence from "../hooks/usePresence";
import { getAdImageUrl } from "../utils/imageUtils";

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
				online: false, // Will be overridden by getParticipantInfoWithOnlineStatus
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
				online: false, // Will be overridden by getParticipantInfoWithOnlineStatus
			};
		}
	} else if (userType === "seller") {
		// For sellers, determine who the other participant is
		const currentSellerId = parseInt(currentUser?.id);

		if (conversation.seller_id === currentSellerId) {
			// Current seller is the ad owner, show the inquirer
			if (conversation.buyer) {
				return {
					name:
						conversation.buyer.fullname ||
						conversation.buyer.username ||
						"Buyer",
					avatar: conversation.buyer.profile_picture,
					type: "buyer",
					online: false, // Will be overridden by getParticipantInfoWithOnlineStatus
				};
			}
			if (conversation.inquirer_seller) {
				return {
					name:
						conversation.inquirer_seller.enterprise_name ||
						conversation.inquirer_seller.fullname ||
						"Seller",
					avatar: conversation.inquirer_seller.profile_picture,
					type: "seller",
					online: false, // Will be overridden by getParticipantInfoWithOnlineStatus
				};
			}
		} else {
			// Current seller is the inquirer, show the ad owner
			if (conversation.seller) {
				return {
					name:
						conversation.seller.enterprise_name ||
						conversation.seller.fullname ||
						"Seller",
					avatar: conversation.seller.profile_picture,
					type: "seller",
					online: false, // Will be overridden by getParticipantInfoWithOnlineStatus
				};
			}
		}

		if (conversation.admin) {
			return {
				name:
					conversation.admin.fullname || conversation.admin.username || "Admin",
				avatar: conversation.admin.profile_picture,
				type: "admin",
				online: false, // Will be overridden by getParticipantInfoWithOnlineStatus
			};
		}

		// Fallback if no participant found
		return {
			name: "Unknown User",
			avatar: null,
			type: "unknown",
			online: false,
		};
	} else if (userType === "admin") {
		if (conversation.buyer) {
			return {
				name:
					conversation.buyer.fullname || conversation.buyer.username || "Buyer",
				avatar: conversation.buyer.profile_picture,
				type: "buyer",
				online: false, // Will be overridden by getParticipantInfoWithOnlineStatus
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
				online: false, // Will be overridden by getParticipantInfoWithOnlineStatus
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

const getMessageStatusIcon = (
	messageId,
	messageStatuses,
	messageStatus = null
) => {
	// First check if we have a real-time status update
	const realtimeStatus = messageStatuses[messageId];

	// Use real-time status if available, otherwise fall back to message's own status
	const status = realtimeStatus?.status || messageStatus || "sent";

	switch (status) {
		case "sending":
			return (
				<FontAwesomeIcon
					icon={faClock}
					className="w-3.5 h-3.5 text-gray-400 animate-pulse"
					title="Sending..."
				/>
			);
		case "read":
			return (
				<IoCheckmarkDone className="w-3.5 h-3.5 text-green-500" title="Read" />
			);
		case "delivered":
			return (
				<IoCheckmarkDone
					className="w-3.5 h-3.5 text-gray-400"
					title="Delivered"
				/>
			);
		case "sent":
		default:
			return <IoCheckmark className="w-3.5 h-3.5 text-gray-400" title="Sent" />;
	}
};

const getParticipantInfoWithOnlineStatus = (
	conversation,
	currentUser,
	userType,
	onlineUsers
) => {
	const baseInfo = getParticipantInfo(conversation, currentUser, userType);

	// Create consistent user ID format for online status tracking
	let userId;
	if (baseInfo.type === "buyer" && conversation.buyer) {
		userId = `buyer_${conversation.buyer.id}`;
	} else if (baseInfo.type === "seller" && conversation.seller) {
		userId = `seller_${conversation.seller.id}`;
	} else if (baseInfo.type === "admin" && conversation.admin) {
		userId = `admin_${conversation.admin.id}`;
	} else {
		userId = `${baseInfo.type}_${conversation[baseInfo.type]?.id}`;
	}

	const isOnline = onlineUsers.has(userId);

	return {
		...baseInfo,
		online: isOnline,
	};
};

const Messages = ({
	userType = "buyer", // 'buyer', 'seller', 'admin'
	apiBaseUrl = "/conversations",
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
	// Router hooks
	const { conversationId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	// State
	const [conversations, setConversations] = useState([]);
	const [selectedConversation, setSelectedConversation] = useState(null);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [typingTimeout, setTypingTimeout] = useState(null);
	const [connectionStatus, setConnectionStatus] = useState("connecting"); // Start as connecting
	const [onlineUsers, setOnlineUsers] = useState(new Set());
	const [typingUsers, setTypingUsers] = useState(new Set());
	const [messageStatuses, setMessageStatuses] = useState({});
	const [unreadCounts, setUnreadCounts] = useState({}); // Per-conversation unread counts
	const [conversationsWithUnread, setConversationsWithUnread] = useState(0); // Number of conversations with unread messages
	const [selectedProduct, setSelectedProduct] = useState(null); // For product popup
	const messagesEndRef = useRef(null);
	const processedMessagesRef = useRef(new Set()); // Track processed messages to prevent duplicates

	// Simplified responsive state using Tailwind breakpoints
	const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
	const isConversationSelected = Boolean(conversationId);

	// Show/hide panels based on Tailwind md: breakpoint (768px)
	const showConversationsList = !isMobileView || !isConversationSelected;
	const showMessagesArea = !isMobileView || isConversationSelected;

	// Handle window resize with Tailwind breakpoints
	useEffect(() => {
		let timeoutId = null;

		const handleResize = () => {
			if (timeoutId) clearTimeout(timeoutId);

			timeoutId = setTimeout(() => {
				setIsMobileView(window.innerWidth < 768); // Tailwind md: breakpoint
			}, 100);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		window.addEventListener("orientationchange", handleResize);

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("orientationchange", handleResize);
		};
	}, []);

	// ActionCable for real-time messaging
	const { sendMessage: sendRealtimeMessage } = useActionCable(
		currentUser?.type?.toLowerCase(),
		currentUser?.id,
		useCallback(
			(data) => {
				// Handle incoming real-time messages
				if (data.type === "new_message") {
					// Only add to message list if it's for the currently selected conversation
					if (data.conversation_id === selectedConversation?.id) {
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
					}

					// Always update conversation list for any new message
					setConversations((prevConversations) => {
						return prevConversations.map((conv) => {
							if (conv.id === data.conversation_id) {
								return {
									...conv,
									last_message: {
										id: data.message.id,
										content: data.message.content,
										created_at: data.message.created_at,
										sender_type: data.message.sender_type,
										sender_id: data.message.sender_id,
										status: data.message.status || "sent",
									},
								};
							}
							return conv;
						});
					});

					// Update unread count for the conversation (if not currently selected and message is not from current user)
					if (
						data.conversation_id !== selectedConversation?.id &&
						data.message.sender_id !== currentUser?.id
					) {
						setUnreadCounts((prev) => ({
							...prev,
							[data.conversation_id]: (prev[data.conversation_id] || 0) + 1,
						}));
					}

					// Trigger global event for unread count updates
					window.dispatchEvent(
						new CustomEvent("newMessage", {
							detail: {
								conversation_id: data.conversation_id,
								message: data.message,
							},
						})
					);
				}
			},
			[selectedConversation?.id, currentUser?.id]
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
			// Messages component received online status
			const userId = `${data.user_type}_${data.user_id}`;
			// User ID for online status

			if (data.online) {
				// Adding user to online set
				setOnlineUsers((prev) => {
					const newSet = new Set([...prev, userId]);
					// Updated online users
					return newSet;
				});
			} else {
				// Removing user from online set
				setOnlineUsers((prev) => {
					const newSet = new Set(prev);
					newSet.delete(userId);
					// Updated online users
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
			// Message status update received
			setMessageStatuses((prev) => ({
				...prev,
				[data.message_id]: {
					status: data.type === "message_read" ? "read" : "delivered",
					timestamp:
						data.type === "message_read" ? data.read_at : data.delivered_at,
				},
			}));

			// Update the message in the messages array to reflect the new status
			setMessages((prevMessages) => {
				return prevMessages.map((message) => {
					if (message.id === data.message_id) {
						return {
							...message,
							status: data.type === "message_read" ? "read" : "delivered",
							read_at:
								data.type === "message_read" ? data.read_at : message.read_at,
							delivered_at:
								data.type === "message_delivered"
									? data.delivered_at
									: message.delivered_at,
						};
					}
					return message;
				});
			});

			// Update conversation list to reflect the new status
			setConversations((prevConversations) => {
				return prevConversations.map((conversation) => {
					if (
						conversation.id === data.conversation_id &&
						conversation.last_message?.id === data.message_id
					) {
						return {
							...conversation,
							last_message: {
								...conversation.last_message,
								status: data.type === "message_read" ? "read" : "delivered",
							},
						};
					}
					return conversation;
				});
			});
		}, []),
		selectedConversation?.id // Pass the current conversation ID
	);

	// Fetch per-conversation unread counts
	const fetchUnreadCounts = useCallback(async () => {
		if (!currentUser || !userType) return;

		try {
			const token = localStorage.getItem("token");
			// Use per-conversation endpoint to get individual counts
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/conversations/unread_counts`,
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
				setConversationsWithUnread(data.conversations_with_unread || 0);
			} else {
				console.error(
					"Messages: Failed to fetch unread counts:",
					response.status,
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error fetching unread counts:", error);
		}
	}, [currentUser, userType]);

	// Handle conversation selection from URL
	useEffect(() => {
		if (conversationId && conversations.length > 0) {
			const conversation = conversations.find(
				(c) => c.id.toString() === conversationId
			);
			if (conversation) {
				setSelectedConversation(conversation);
				fetchMessages(conversation.id);
				// Refresh unread counts when selecting a conversation
				fetchUnreadCounts();
				if (onConversationSelect) {
					onConversationSelect(conversation);
				}
			}
		} else if (!conversationId) {
			setSelectedConversation(null);
			setMessages([]);
		}
	}, [conversationId, conversations, onConversationSelect, fetchUnreadCounts]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			const payload = JSON.parse(atob(token.split(".")[1]));
			const userId =
				payload.seller_id || payload.buyer_id || payload.user_id || payload.id;
			const userTypeFromToken = payload.role || payload.type || userType;
			setCurrentUser({ id: userId, type: userTypeFromToken });
		}
	}, [userType]);

	// Request initial online status for conversation participants
	const requestInitialOnlineStatus = useCallback(
		async (conversationsList) => {
			if (!currentUser || !userType) return;

			try {
				// Extract unique participant IDs from conversations
				const participantIds = new Set();
				conversationsList.forEach((conversation) => {
					const participantInfo = getParticipantInfo(
						conversation,
						currentUser,
						userType
					);
					if (participantInfo.type === "buyer" && conversation.buyer) {
						participantIds.add(`buyer_${conversation.buyer.id}`);
					} else if (participantInfo.type === "seller" && conversation.seller) {
						participantIds.add(`seller_${conversation.seller.id}`);
					} else if (participantInfo.type === "admin" && conversation.admin) {
						participantIds.add(`admin_${conversation.admin.id}`);
					}
				});

				// Request online status for all participants
				if (participantIds.size > 0) {
					const token = localStorage.getItem("token");
					const response = await fetch(
						`${process.env.REACT_APP_BACKEND_URL}/conversations/online_status`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`,
							},
							body: JSON.stringify({
								participant_ids: Array.from(participantIds),
							}),
						}
					);

					if (response.ok) {
						const data = await response.json();
						// Initial online status response
						// The response should contain online status for each participant
						if (data.online_status) {
							const onlineSet = new Set();
							Object.entries(data.online_status).forEach(
								([userId, isOnline]) => {
									// User online status
									if (isOnline) {
										onlineSet.add(userId);
									}
								}
							);
							// Setting initial online users
							setOnlineUsers(onlineSet);
						}
					} else {
						console.error(
							"Failed to fetch online status:",
							response.status,
							response.statusText
						);
					}
				}
			} catch (error) {
				console.error("Error fetching initial online status:", error);
			}
		},
		[currentUser, userType]
	);

	useEffect(() => {
		const fetchConversations = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/conversations`,
					{
						headers: {
							Authorization: "Bearer " + localStorage.getItem("token"),
						},
					}
				);
				if (!response.ok) throw new Error("Network response was not ok");
				const data = await response.json();

				// Handle grouped conversations format from unified API
				let conversationsList = [];
				if (Array.isArray(data)) {
					// Legacy flat array format
					conversationsList = data;
				} else if (data && typeof data === "object") {
					// New grouped format: flatten all conversation groups into a single array
					conversationsList = Object.values(data).flat();
				}

				setConversations(conversationsList);

				// Request initial online status for all participants
				if (conversationsList.length > 0) {
					requestInitialOnlineStatus(conversationsList);
				}
			} catch (error) {
				console.error("Error fetching conversations:", error);
			} finally {
				setLoadingConversations(false);
			}
		};

		fetchConversations();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [apiBaseUrl]); // requestInitialOnlineStatus intentionally excluded to prevent loops

	// Fetch unread counts when conversations are loaded
	useEffect(() => {
		if (conversations.length > 0 && currentUser) {
			console.log(
				"Messages: Conversations loaded, fetching unread counts. Current user:",
				currentUser
			);
			fetchUnreadCounts();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [conversations.length, currentUser]); // fetchUnreadCounts intentionally excluded to prevent loops

	const fetchMessages = async (conversationId) => {
		setLoadingMessages(true);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/conversations/${conversationId}/messages`,
				{
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token"),
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

	// Handle ESC key to close product popup
	useEffect(() => {
		const handleEscKey = (event) => {
			if (event.key === "Escape" && selectedProduct) {
				setSelectedProduct(null);
			}
		};

		document.addEventListener("keydown", handleEscKey);
		return () => {
			document.removeEventListener("keydown", handleEscKey);
		};
	}, [selectedProduct]);

	// Clear typing indicators when conversation changes
	useEffect(() => {
		setTypingUsers(new Set());
	}, [selectedConversation?.id]);

	// Listen for unread count updates from WebSocket and navbar
	useEffect(() => {
		const handleUnreadCountUpdate = (event) => {
			// Messages: Received unread count update
			// Trigger a refresh of the unread counts
			fetchUnreadCounts();
		};

		const handleNewMessage = () => {
			// Refresh unread counts when new messages arrive
			fetchUnreadCounts();
		};

		window.addEventListener("unreadCountUpdate", handleUnreadCountUpdate);
		window.addEventListener("newMessage", handleNewMessage);

		return () => {
			window.removeEventListener("unreadCountUpdate", handleUnreadCountUpdate);
			window.removeEventListener("newMessage", handleNewMessage);
		};
	}, [fetchUnreadCounts]);

	const handleConversationClick = (conversation) => {
		// Navigate to the conversation URL
		const basePath = location.pathname.replace(/\/\d+$/, ""); // Remove existing conversation ID if any
		// Ensure no double slashes by using proper path joining
		const newPath = basePath.endsWith("/")
			? `${basePath}${conversation.id}`
			: `${basePath}/${conversation.id}`;
		navigate(newPath);
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
			const unreadMessages = messages.filter((message) => {
				const isUnread =
					!isMessageSentByCurrentUser(message) &&
					(message.status === "sent" ||
						message.status === null ||
						message.status === undefined);
				return isUnread;
			});

			// Only process messages that haven't been marked as delivered yet
			const messagesToDeliver = unreadMessages.filter(
				(message) =>
					!messageStatuses[message.id] ||
					messageStatuses[message.id].status !== "delivered"
			);

			messagesToDeliver.forEach((message) => {
				const deliveryKey = `delivered_${message.id}`;
				if (!processedMessagesRef.current.has(deliveryKey)) {
					// Marking message as delivered
					sendMessageDelivered(message.id);
					processedMessagesRef.current.add(deliveryKey);
					// Update local status immediately for better UX
					setMessageStatuses((prev) => ({
						...prev,
						[message.id]: {
							status: "delivered",
							timestamp: new Date().toISOString(),
						},
					}));
				}
			});

			if (messagesToDeliver.length > 0) {
				// Note: Removed event dispatch to prevent feedback loop
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		selectedConversation?.id, // Only depend on conversation ID, not the whole object
		messages.length, // Only depend on messages length, not the whole array
		sendMessageDelivered,
		isMessageSentByCurrentUser,
		// Remove messageStatuses from dependencies to prevent infinite loops
	]);

	// Mark messages as read when they are viewed
	useEffect(() => {
		if (selectedConversation && messages.length > 0) {
			// Mark unread messages as read after a short delay
			const timer = setTimeout(() => {
				const unreadMessages = messages.filter((message) => {
					const isUnread =
						!isMessageSentByCurrentUser(message) &&
						(message.status === "sent" ||
							message.status === "delivered" ||
							message.status === null ||
							message.status === undefined);
					return isUnread;
				});

				// Only process messages that haven't been marked as read yet
				const messagesToRead = unreadMessages.filter(
					(message) =>
						!messageStatuses[message.id] ||
						messageStatuses[message.id].status !== "read"
				);

				messagesToRead.forEach((message) => {
					const readKey = `read_${message.id}`;
					if (!processedMessagesRef.current.has(readKey)) {
						// Marking message as read
						sendMessageRead(message.id);
						processedMessagesRef.current.add(readKey);
						// Update local status immediately for better UX
						setMessageStatuses((prev) => ({
							...prev,
							[message.id]: {
								status: "read",
								timestamp: new Date().toISOString(),
							},
						}));
					}
				});

				if (messagesToRead.length > 0) {
					// Note: Removed event dispatch to prevent feedback loop
				}
			}, 1000); // 1 second delay

			return () => clearTimeout(timer);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		selectedConversation?.id, // Only depend on conversation ID, not the whole object
		messages.length, // Only depend on messages length, not the whole array
		sendMessageRead,
		isMessageSentByCurrentUser,
		// Remove messageStatuses from dependencies to prevent infinite loops
	]);

	// Update unread counts when messages are read
	useEffect(() => {
		if (selectedConversation && messages.length > 0) {
			// Only clear unread count after messages have been processed for read status
			const hasUnreadMessages = messages.some((message) => {
				return (
					!isMessageSentByCurrentUser(message) &&
					(message.status === "sent" ||
						message.status === "delivered" ||
						message.status === null ||
						message.status === undefined)
				);
			});

			// If no unread messages, clear the count
			if (!hasUnreadMessages) {
				setUnreadCounts((prev) => ({
					...prev,
					[selectedConversation.id]: 0,
				}));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedConversation?.id, messages.length, isMessageSentByCurrentUser]);

	// Clear processed messages when conversation changes
	useEffect(() => {
		processedMessagesRef.current.clear();
	}, [selectedConversation?.id]);

	// Listen for new messages to update unread counts
	useEffect(() => {
		const handleNewMessage = () => {
			fetchUnreadCounts();
		};

		window.addEventListener("newMessage", handleNewMessage);

		return () => {
			window.removeEventListener("newMessage", handleNewMessage);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // fetchUnreadCounts intentionally excluded to prevent loops

	const handleBackToConversations = () => {
		// Navigate back to conversations list
		const basePath = location.pathname.replace(/\/\d+$/, ""); // Remove conversation ID
		navigate(basePath);
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
			const messagePayload = {
				message: {
					content: newMessage,
				},
			};

			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/conversations/${selectedConversation.id}/messages`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + localStorage.getItem("token"),
					},
					body: JSON.stringify(messagePayload),
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
				last_message: {
					id: message.id,
					content: newMessage,
					created_at: message.created_at,
					sender_type: currentUser.type,
					sender_id: currentUser.id,
					status: message.status || "sent",
				},
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
		const participantInfo = getParticipantInfoWithOnlineStatus(
			conversation,
			currentUser,
			userType,
			onlineUsers
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
			<div className="bg-gray-50 flex flex-col h-[100vh] md:h-[95vh] overflow-hidden">
				<div className="flex flex-1 h-full overflow-hidden">
					<div className={`flex-1 ${containerClassName}`}>
						<div className="max-w-7xl mx-auto h-full flex flex-col">
							<div className="bg-white overflow-hidden h-full flex">
								{/* Conversations List */}
								{showConversationsList && (
									<div className="w-full md:w-80 lg:w-80 xl:w-96 2xl:w-96 md:border-r border-gray-200 flex flex-col bg-white md:bg-gray-50 h-full overflow-hidden flex-shrink-0">
										{/* Header */}
										<div className="bg-white flex-shrink-0 p-3 sm:p-4 border-b border-gray-200">
											<div className="flex items-center justify-between mb-2 sm:mb-3">
												<h2 className="text-base sm:text-lg font-bold text-gray-900 text-left">
													{title}
												</h2>
												<div className="bg-yellow-500 text-white text-xs font-semibold rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
													{conversationsWithUnread}
												</div>
											</div>
											{showSearch && (
												<div className="relative">
													<FontAwesomeIcon
														icon={faSearch}
														className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 text-sm"
													/>
													<input
														type="text"
														placeholder="Search conversations..."
														value={searchQuery}
														onChange={(e) => setSearchQuery(e.target.value)}
														className="w-full pl-10 pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
													/>
												</div>
											)}
										</div>

										{/* Conversations */}
										<div className="flex-1 overflow-y-auto scroll-smooth messages-scrollbar webkit-scrolling-touch bg-white md:bg-gray-50 ">
											{loadingConversations ? (
												<div className="flex items-center justify-center h-32">
													<Spinner name="cube-grid" color="#ffc107" />
												</div>
											) : filteredConversations.length === 0 ? (
												<div className="flex flex-col items-center justify-center h-32 text-gray-500">
													<div className="bg-white rounded-full shadow-sm">
														<FontAwesomeIcon
															icon={faEnvelopeOpenText}
															className="text-3xl text-gray-300"
														/>
													</div>
													<p className="text-sm font-medium text-gray-700">
														No conversations found
													</p>
													<p className="text-xs text-gray-500 text-center">
														Start messaging to see your conversations here
													</p>
												</div>
											) : (
												<div>
													{filteredConversations
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
															const participantInfo =
																getParticipantInfoWithOnlineStatus(
																	conversation,
																	currentUser,
																	userType,
																	onlineUsers
																);
															const lastMessage =
																conversation.last_message?.content;
															const isActive =
																selectedConversation?.id === conversation.id;

															// Check if current user sent the last message
															const isMyMessage =
																conversation.last_message?.sender_id ===
																currentUser?.id;

															// Get message status from backend
															const messageStatus = isMyMessage
																? conversation.last_message?.status || "sent"
																: null;

															return (
																<div
																	key={conversation.id}
																	onClick={() =>
																		handleConversationClick(conversation)
																	}
																	className={`cursor-pointer conversation-item touch-manipulation transition-all duration-200 p-4 border-b border-gray-100 ${
																		isActive
																			? "bg-yellow-50 border-l-4 border-l-yellow-500"
																			: "bg-white hover:bg-gray-50 active:bg-gray-100"
																	}`}
																>
																	<div className="flex items-center space-x-3">
																		{/* Avatar */}
																		<div className="flex-shrink-0 relative">
																			{participantInfo.avatar ? (
																				<img
																					src={participantInfo.avatar}
																					alt={participantInfo.name}
																					className="w-10 h-10 rounded-full object-cover border border-gray-200"
																				/>
																			) : (
																				<div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
																					{participantInfo.name
																						.charAt(0)
																						.toUpperCase()}
																				</div>
																			)}
																			{/* Online indicator */}
																			{showOnlineStatus &&
																				participantInfo.online && (
																					<div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
																				)}
																		</div>

																		{/* Content */}
																		<div className="flex-1 min-w-0">
																			{/* Top row: Name and Time */}
																			<div className="flex items-center justify-between mb-1">
																				<h3
																					className={`text-sm font-semibold truncate ${
																						isActive
																							? "text-gray-900"
																							: "text-gray-900"
																					}`}
																					title={participantInfo.name}
																				>
																					{participantInfo.name}
																				</h3>
																				<div className="flex items-center space-x-2">
																					<span className="text-xs text-gray-500 whitespace-nowrap">
																						{formatTime(
																							conversation.last_message
																								?.created_at ||
																								conversation.updated_at
																						)}
																					</span>
																					{/* Unread count badge */}
																					{unreadCounts[conversation.id] >
																						0 && (
																						<span className="bg-yellow-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold text-center leading-none flex-shrink-0">
																							{unreadCounts[conversation.id] >
																							99
																								? "99+"
																								: unreadCounts[conversation.id]}
																						</span>
																					)}
																				</div>
																			</div>

																			{/* Bottom row: Message preview with status */}
																			{lastMessage && (
																				<div className="flex items-center justify-between">
																					{/* Message status indicators (only for messages I sent) */}
																					<div className="flex items-center space-x-1 min-w-0 flex-1">
																						{isMyMessage && messageStatus && (
																							<div className="flex items-center flex-shrink-0">
																								{getMessageStatusIcon(
																									conversation.last_message?.id,
																									messageStatuses,
																									messageStatus
																								)}
																							</div>
																						)}

																						<p
																							className={`text-xs truncate ${
																								unreadCounts[conversation.id] >
																									0 && !isMyMessage
																									? "text-gray-700 font-medium"
																									: "text-gray-500"
																							}`}
																							title={lastMessage}
																						>
																							{lastMessage}
																						</p>
																					</div>
																				</div>
																			)}
																		</div>
																	</div>
																</div>
															);
														})}
												</div>
											)}
										</div>
									</div>
								)}

								{/* Messages Area */}
								{showMessagesArea && (
									<div className="w-full md:flex-1 flex flex-col h-full overflow-hidden">
										{selectedConversation ? (
											<div className="flex flex-col h-full">
												{/* Header */}
												<div className="flex items-center justify-between bg-white flex-shrink-0 p-3 sm:p-4 border-b border-gray-200">
													<div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
														<button
															onClick={handleBackToConversations}
															className="md:hidden hover:bg-gray-100 rounded-full p-2 transition-colors min-h-touch min-w-touch flex items-center justify-center touch-manipulation flex-shrink-0"
															title="Back to conversations"
														>
															<FontAwesomeIcon
																icon={faArrowLeft}
																className="text-gray-600 w-4 h-4"
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
															return (
																<div className="relative flex-shrink-0">
																	{participantInfo.avatar ? (
																		<img
																			src={participantInfo.avatar}
																			alt={participantInfo.name}
																			className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover border border-gray-200"
																		/>
																	) : (
																		<div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg">
																			{participantInfo.name
																				.charAt(0)
																				.toUpperCase()}
																		</div>
																	)}
																	{/* Online indicator */}
																	{showOnlineStatus &&
																		participantInfo.online && (
																			<div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
																		)}
																</div>
															);
														})()}

														<div className="flex flex-col min-w-0">
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
																	selectedConversation[participantInfo.type]?.id
																}`;
																const isOtherUserTyping =
																	typingUsers.has(userId);

																return (
																	<>
																		<h3 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl text-left truncate">
																			{participantInfo.name}
																		</h3>
																		<div className="flex items-center text-xs sm:text-sm">
																			{isOtherUserTyping ? (
																				<span className="text-yellow-600 font-medium">
																					typing...
																				</span>
																			) : connectionStatus !== "connected" ? (
																				<span
																					className={`flex items-center space-x-1 ${
																						connectionStatus === "connecting"
																							? "text-yellow-600"
																							: "text-red-600"
																					}`}
																				>
																					<div
																						className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
																							connectionStatus === "connecting"
																								? "bg-yellow-500"
																								: "bg-red-500"
																						}`}
																					></div>
																					<span>
																						{connectionStatus === "connecting"
																							? "Connecting..."
																							: "Offline"}
																					</span>
																				</span>
																			) : showOnlineStatus ? (
																				<span
																					className={`flex items-center space-x-1 ${
																						participantInfo.online
																							? "text-green-600"
																							: "text-gray-500"
																					}`}
																				>
																					<div
																						className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
																							participantInfo.online
																								? "bg-green-500"
																								: "bg-gray-400"
																						}`}
																					></div>
																					<span>
																						{participantInfo.online
																							? "Online"
																							: "Last seen recently"}
																					</span>
																				</span>
																			) : null}
																		</div>
																	</>
																);
															})()}
														</div>
													</div>
												</div>

												{/* Messages */}
												<div className="flex-1 overflow-y-auto bg-gray-50 scroll-smooth messages-scrollbar webkit-scrolling-touch">
													{loadingMessages ? (
														<div className="flex items-center justify-center h-32">
															<Spinner name="cube-grid" color="#ffc107" />
														</div>
													) : messages.length === 0 ? (
														<div className="flex flex-col items-center justify-center h-full text-gray-500">
															<div className="bg-white rounded-full shadow-sm">
																<FontAwesomeIcon
																	icon={faEnvelopeOpenText}
																	className="text-4xl text-gray-400"
																/>
															</div>
															<p className="text-lg font-semibold text-gray-700">
																No messages yet
															</p>
															<p className="text-sm text-gray-500">
																Start the conversation!
															</p>
														</div>
													) : (
														<div className="p-4 space-y-4">
															{messages.map((message) => {
																const isSent =
																	isMessageSentByCurrentUser(message);
																const messageAdInfo =
																	showProductContext && message.ad
																		? {
																				title: message.ad.title,
																				price: message.ad.price,
																				image: getAdImageUrl(message.ad),
																				category: message.ad.category,
																				description: message.ad.description,
																				location: message.ad.location,
																				condition: message.ad.condition,
																				brand: message.ad.brand,
																		  }
																		: null;

																return (
																	<div
																		key={message.id}
																		className={`flex ${
																			isSent ? "justify-end" : "justify-start"
																		} group`}
																	>
																		<div
																			className={`max-w-[85%] sm:max-w-sm md:max-w-md lg:max-w-lg rounded-2xl transition-all duration-200 ease-in-out shadow-sm ${
																				isSent
																					? "bg-yellow-500 text-white rounded-br-sm"
																					: "bg-white text-gray-900 rounded-bl-sm border border-gray-200"
																			}`}
																		>
																			<div className="p-3">
																				{/* Product Context */}
																				{messageAdInfo && (
																					<div
																						className={`rounded-xl border mb-3 p-3 ${
																							isSent
																								? "bg-yellow-600/20 border-yellow-400/30"
																								: "bg-gray-50 border-gray-200"
																						}`}
																					>
																						<div className="flex items-center space-x-3">
																							<div
																								className="w-16 h-16 bg-white border border-gray-200 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-200 relative group"
																								onClick={() =>
																									setSelectedProduct(
																										messageAdInfo
																									)
																								}
																							>
																								{messageAdInfo.image ? (
																									<>
																										{/* Loading placeholder */}
																										<div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center absolute inset-0">
																											<div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
																										</div>
																										<img
																											src={messageAdInfo.image}
																											alt={messageAdInfo.title}
																											className="w-full h-full object-contain bg-white relative z-10"
																											onLoad={(e) => {
																												e.target.style.display =
																													"block";
																												e.target.previousSibling.style.display =
																													"none";
																											}}
																											onError={(e) => {
																												console.error(
																													"Image failed to load:",
																													messageAdInfo.image
																												);
																												e.target.style.display =
																													"none";
																												e.target.previousSibling.style.display =
																													"none";
																												e.target.nextSibling.style.display =
																													"flex";
																											}}
																										/>
																									</>
																								) : null}
																								<div
																									className={`w-full h-full bg-gray-100 flex flex-col items-center justify-center ${
																										messageAdInfo.image
																											? "hidden"
																											: ""
																									}`}
																								>
																									<FontAwesomeIcon
																										icon={faImage}
																										className="text-gray-500 text-lg mb-1"
																									/>
																									<span className="text-xs text-gray-400 text-center px-1">
																										{messageAdInfo
																											? "No Image"
																											: "No Product"}
																									</span>
																								</div>
																								{/* Hover overlay */}
																								<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
																									<FontAwesomeIcon
																										icon={faEye}
																										className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm"
																									/>
																								</div>
																							</div>
																							<div className="flex-1 min-w-0">
																								<p
																									className={`text-sm font-semibold truncate ${
																										isSent
																											? "text-yellow-100"
																											: "text-gray-800"
																									}`}
																								>
																									{messageAdInfo.title}
																								</p>
																								{messageAdInfo.category && (
																									<p
																										className={`text-xs truncate ${
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
																				<p className="text-sm leading-relaxed break-words mb-2">
																					{message.content}
																				</p>

																				{/* Message Time and Status */}
																				<div
																					className={`flex items-center justify-between text-xs ${
																						isSent
																							? "text-yellow-100"
																							: "text-gray-500"
																					}`}
																				>
																					<span className="font-medium">
																						{formatTime(message.created_at)}
																					</span>
																					{isSent && (
																						<div className="flex items-center">
																							<div className="opacity-80">
																								{getMessageStatusIcon(
																									message.id,
																									messageStatuses,
																									message.status
																								)}
																							</div>
																						</div>
																					)}
																				</div>
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
												<div className="bg-white flex-shrink-0 p-4 border-t border-gray-200">
													<form
														onSubmit={handleSendMessage}
														className="flex items-center space-x-3"
													>
														<div className="flex-1 relative">
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
																		handleTyping(
																			false,
																			selectedConversation?.id
																		);
																	}, 2000);
																	setTypingTimeout(timeout);
																}}
																placeholder="Type your message..."
																className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
																maxLength={1000}
															/>
															<div className="hidden sm:block absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 font-medium">
																{newMessage.length}/1000
															</div>
														</div>
														<button
															type="submit"
															disabled={!newMessage.trim()}
															className="bg-yellow-500 text-white rounded-full hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 p-3 flex items-center justify-center touch-manipulation hover:scale-105"
														>
															<FontAwesomeIcon
																icon={faPaperPlane}
																className="w-4 h-4"
															/>
														</button>
													</form>
												</div>
											</div>
										) : (
											<div className="flex items-center justify-center h-full bg-gray-50">
												<div className="text-center">
													<div className="rounded-full w-fit mx-auto mb-6 p-4">
														<FontAwesomeIcon
															icon={faEnvelopeOpenText}
															className="text-5xl text-gray-400"
														/>
													</div>
													<h3 className="text-2xl font-bold text-gray-900 mb-4">
														Welcome to Messages
													</h3>
													<p className="text-base text-gray-600 max-w-md mx-auto">
														Select a conversation from the sidebar to start
														messaging with your customers or partners
													</p>
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Product Popup Modal */}
			{selectedProduct && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
						{/* Header */}
						<div className="flex items-center justify-between p-4 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-900">
								Product Details
							</h3>
							<button
								onClick={() => setSelectedProduct(null)}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
							>
								<FontAwesomeIcon
									icon={faTimes}
									className="w-5 h-5 text-gray-500"
								/>
							</button>
						</div>

						{/* Content */}
						<div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
							<div className="space-y-6">
								{/* Large Image */}
								<div className="flex justify-center">
									<div className="w-full max-w-md h-64 bg-gray-200 rounded-lg overflow-hidden">
										{selectedProduct.image &&
										selectedProduct.image.trim() !== "" ? (
											<img
												src={selectedProduct.image}
												alt={selectedProduct.title}
												className="w-full h-full object-cover"
												onError={(e) => {
													e.target.style.display = "none";
													e.target.nextSibling.style.display = "flex";
												}}
											/>
										) : null}
										<div
											className={`w-full h-full bg-gray-300 flex items-center justify-center ${
												selectedProduct.image &&
												selectedProduct.image.trim() !== ""
													? "hidden"
													: ""
											}`}
										>
											<FontAwesomeIcon
												icon={faImage}
												className="text-gray-500 text-4xl"
											/>
										</div>
									</div>
								</div>

								{/* Product Information */}
								<div className="space-y-4">
									<div>
										<h4 className="text-xl font-bold text-gray-900 mb-2">
											{selectedProduct.title}
										</h4>
										{selectedProduct.category && (
											<p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block">
												{selectedProduct.category}
											</p>
										)}
									</div>

									{selectedProduct.price && (
										<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium text-gray-700">
													Price:
												</span>
												<span className="text-lg font-bold text-yellow-600">
													KSh {selectedProduct.price.toLocaleString()}
												</span>
											</div>
										</div>
									)}

									{/* Additional Details */}
									<div className="space-y-3">
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											{selectedProduct.description && (
												<div>
													<h5 className="text-sm font-semibold text-gray-700 mb-1">
														Description
													</h5>
													<p className="text-sm text-gray-600">
														{selectedProduct.description}
													</p>
												</div>
											)}
											{selectedProduct.location && (
												<div>
													<h5 className="text-sm font-semibold text-gray-700 mb-1">
														Location
													</h5>
													<p className="text-sm text-gray-600">
														{selectedProduct.location}
													</p>
												</div>
											)}
											{selectedProduct.condition && (
												<div>
													<h5 className="text-sm font-semibold text-gray-700 mb-1">
														Condition
													</h5>
													<p className="text-sm text-gray-600">
														{selectedProduct.condition}
													</p>
												</div>
											)}
											{selectedProduct.brand && (
												<div>
													<h5 className="text-sm font-semibold text-gray-700 mb-1">
														Brand
													</h5>
													<p className="text-sm text-gray-600">
														{selectedProduct.brand}
													</p>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Messages;
