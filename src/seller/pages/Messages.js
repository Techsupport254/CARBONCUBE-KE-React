import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPaperPlane,
	faUser,
	faEnvelopeOpenText,
	faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import Navbar from "../../components/Navbar";
import Spinner from "react-spinkit";
import "../css/Messages.css"; // Custom CSS

const Messages = () => {
	const [conversations, setConversations] = useState([]);
	const [selectedConversation, setSelectedConversation] = useState(null);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [showMobileMessages, setShowMobileMessages] = useState(false);
	const messagesEndRef = useRef(null);

	useEffect(() => {
		// Prevent accidental exit on mobile if first time
		window.history.replaceState({ view: "list" }, "", "");
	}, []);

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (token) {
			const payload = JSON.parse(atob(token.split(".")[1]));
			// console.log('JWT Payload:', payload); // Debug log

			// Try different ID fields based on your JWT structure
			const userId = payload.seller_id || payload.user_id || payload.id;
			const userType = payload.role || payload.type || "seller";

			setCurrentUser({ id: userId, type: userType });
		}
	}, []);

	useEffect(() => {
		const fetchConversations = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/seller/conversations`,
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
				// console.error('Error fetching conversations:', error);
			} finally {
				setLoadingConversations(false);
			}
		};

		fetchConversations();
	}, []);

	const fetchMessages = async (conversationId) => {
		setLoadingMessages(true);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/seller/conversations/${conversationId}/messages`,
				{
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
				}
			);
			if (!response.ok) throw new Error("Network response was not ok");
			const data = await response.json();

			const sortedMessages = Array.isArray(data)
				? data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
				: [];
			setMessages(sortedMessages);
		} catch (error) {
			// console.error('Error fetching messages:', error);
		} finally {
			setLoadingMessages(false);
		}
	};

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const handleConversationClick = (conversation) => {
		setSelectedConversation(conversation);
		setShowMobileMessages(true);
		fetchMessages(conversation.id);

		// Push new state to history so browser back button works as expected
		window.history.pushState({ view: "conversation" }, "", "");
	};

	const handleBackToConversations = () => {
		setShowMobileMessages(false);
		setSelectedConversation(null);
	};

	const isMessageSentByCurrentUser = (message) => {
		// More flexible comparison
		const messageSenderType = message.sender_type?.toLowerCase().trim();
		const currentUserType = currentUser?.type?.toLowerCase().trim();

		return (
			messageSenderType === currentUserType &&
			String(message.sender_id) === String(currentUser.id) // Convert both to strings
		);
	};

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!newMessage.trim()) return;

		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/seller/conversations/${selectedConversation.id}/messages`,
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

			setMessages((prevMessages) => {
				const updatedMessages = [...prevMessages, message].sort(
					(a, b) => new Date(a.created_at) - new Date(b.created_at)
				);
				return updatedMessages;
			});

			const updatedConversation = {
				...selectedConversation,
				messages: [...messages, message],
				pullOver: true,
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
		} catch (error) {
			// console.error('Error sending message:', error);
		}
	};

	useEffect(() => {
		const handlePopState = (event) => {
			// Only handle if a conversation was selected
			if (selectedConversation && showMobileMessages) {
				handleBackToConversations();
			}
		};

		window.addEventListener("popstate", handlePopState);

		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, [selectedConversation, showMobileMessages]);

	if (!currentUser) return <div>Loading...</div>;

	return (
		<>
			<Navbar mode="seller" showSearch={false} showCategories={false} />
			<div className="messages-page">
				<Container fluid className="p-0">
					<Row>
						<Col xs={12} md={2} className="p-0">
							<Sidebar />
						</Col>

						{/* Main Messages Container: flex row, full height */}
						<Col xs={12} md={10} lg={9} className="p-0 p-lg-2 mt-1 mt-lg-2">
							<div
								className="messages-main-container d-flex"
								style={{ height: "90vh" }}
							>
								{/* Conversations List */}
								<div
									className={`conversations-list-container ${
										showMobileMessages ? "mobile-hidden" : ""
									}`}
								>
									<Card className="conversations-list h-100 d-flex flex-column">
										<Card.Header className="conversations-header text-center justify-content-center">
											<strong>Conversations</strong>
										</Card.Header>
										<Card.Body className="conversations-scroll flex-grow-1">
											{loadingConversations ? (
												<div className="centered-loader">
													<Spinner
														variant="warning"
														name="cube-grid"
														style={{ width: 50, height: 50 }}
													/>
												</div>
											) : (
												conversations
													.sort((a, b) => {
														const messagesA = Array.isArray(a.messages)
															? a.messages
															: [];
														const messagesB = Array.isArray(b.messages)
															? b.messages
															: [];

														const lastMessageA =
															messagesA[messagesA.length - 1];
														const lastMessageB =
															messagesB[messagesB.length - 1];

														const dateA = lastMessageA
															? new Date(lastMessageA.created_at)
															: 0;
														const dateB = lastMessageB
															? new Date(lastMessageB.created_at)
															: 0;

														return dateB - dateA;
													})
													.map((conversation) => {
														const participant =
															conversation.buyer ||
															conversation.seller ||
															conversation.admin;
														const participantType = conversation.admin
															? "admin"
															: conversation.buyer
															? "buyer"
															: "seller";
														const pullOverClass = conversation.pullOver
															? "conversation-pull-over"
															: "";
														return (
															<Card
																key={conversation.id}
																id="button-admin"
																className={`conversation-card ${participantType} ${
																	selectedConversation?.id === conversation.id
																		? "active"
																		: ""
																} ${pullOverClass}`}
																onClick={() =>
																	handleConversationClick(conversation)
																}
															>
																<Card.Body className="text-center p-3">
																	<FontAwesomeIcon icon={faEnvelopeOpenText} />{" "}
																	{participant?.fullname || "Unknown"}
																</Card.Body>
															</Card>
														);
													})
											)}
										</Card.Body>
									</Card>
								</div>

								{/* Messages List */}
								<div
									className={`messages-list-container ${
										showMobileMessages ? "mobile-overlay" : ""
									}`}
								>
									{selectedConversation ? (
										<Card className="message-container h-100 d-flex flex-column">
											<Card.Header className="messages-header d-flex align-items-center justify-content-center gap-2">
												<Button
													className="mobile-back-btn d-md-none"
													variant="link"
													onClick={handleBackToConversations}
													style={{
														position: "absolute",
														left: "10px",
														padding: "0",
														color: "#666",
													}}
												>
													<FontAwesomeIcon icon={faArrowLeft} size="lg" />
												</Button>
												<FontAwesomeIcon icon={faUser} size="lg" />
												<span>
													{selectedConversation.admin?.fullname ||
														selectedConversation.buyer?.fullname ||
														selectedConversation.seller?.fullname ||
														"Unknown"}
												</span>
											</Card.Header>
											<Card.Body className="messages-scroll flex-grow-1">
												{loadingMessages ? (
													<div className="centered-loader">
														<Spinner
															variant="warning"
															name="cube-grid"
															style={{ width: 50, height: 50 }}
														/>
													</div>
												) : (
													<>
														{messages.map((message) => {
															const isSent =
																isMessageSentByCurrentUser(message);
															return (
																<div
																	key={message.id}
																	className={`message ${
																		isSent ? "sent" : "received"
																	} py-1 px-1`}
																>
																	<div className="message-content">
																		<p>{message.content}</p>
																		<div className="message-footer">
																			{!isSent && (
																				<span className="message-sender">
																					<em>
																						{message.sender?.fullname ||
																							message.sender_type}
																					</em>
																				</span>
																			)}
																			<span className="message-timestamp">
																				{new Date(
																					message.created_at
																				).toLocaleTimeString()}
																			</span>
																		</div>
																	</div>
																</div>
															);
														})}
														<div ref={messagesEndRef} />
													</>
												)}
											</Card.Body>
											<Card.Footer className="messages-footer">
												<Form
													className="message-form"
													onSubmit={handleSendMessage}
												>
													<Form.Control
														className="message-input"
														type="text"
														value={newMessage}
														placeholder="Write your message..."
														onChange={(e) => setNewMessage(e.target.value)}
													/>
													<Button
														className="message-send-btn"
														variant="warning"
														type="submit"
													>
														<FontAwesomeIcon icon={faPaperPlane} />
													</Button>
												</Form>
											</Card.Footer>
										</Card>
									) : (
										<div
											className="d-flex flex-column justify-content-center align-items-center"
											style={{ height: "20vh" }}
										>
											<Card className="select-conversation-card text-center">
												<Card.Body>
													<div className="select-conversation-text">
														💬 Start chatting with your sellers or buyers
													</div>
												</Card.Body>
											</Card>
										</div>
									)}
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</>
	);
};

export default Messages;
