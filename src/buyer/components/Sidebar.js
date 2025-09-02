import React from "react";
import { Nav, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import {
	BookmarkDash,
	PersonCheck,
	XCircle,
	ArrowRight,
	ChatSquareText,
} from "react-bootstrap-icons";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onToggle }) => {
	const location = useLocation();
	const navigate = useNavigate();

	const toggleSidebar = () => {
		if (onToggle) {
			onToggle();
		}
	};

	const handleProtectedClick = (e, path) => {
		const token = sessionStorage.getItem("token");
		if (!token) {
			e.preventDefault();

			// Create a reference to the Swal instance
			const swalInstance = Swal.fire({
				icon: "warning",
				title: "Login Required",
				text: "You must be Signed In to continue.",
				confirmButtonText: "Go to Login",
				cancelButtonText: "Close",
				showCancelButton: true,
				customClass: {
					popup: "futuristic-swal rounded-4 glass-bg",
					title: "fw-semibold text-white",
					htmlContainer: "text-light",
					actions: "futuristic-actions",
					confirmButton: "btn rounded-pill futuristic-confirm",
					cancelButton: "btn rounded-pill futuristic-cancel",
				},
				backdrop: "rgba(0, 0, 0, 0.6)",
				buttonsStyling: false,
				allowOutsideClick: true, // Allow clicking outside to dismiss
				showClass: {
					popup: "swal2-show",
					backdrop: "swal2-backdrop-show",
				},
				hideClass: {
					popup: "swal2-hide",
					backdrop: "swal2-backdrop-hide",
				},
			});

			// Handle the modal result for all cases
			swalInstance.then((result) => {
				// Clean up regardless of how the modal was dismissed
				const cleanupModal = () => {
					// Force all SweetAlert2 modals to close
					Swal.close();

					// Remove any lingering modals and backdrops from the DOM
					document
						.querySelectorAll(
							".swal2-container, .swal2-backdrop, .futuristic-swal"
						)
						.forEach((element) => element.remove());

					// Clear any body modifications SweetAlert might have added
					document.body.classList.remove("swal2-shown", "swal2-height-auto");
					document.body.style.paddingRight = "";
					document.body.style.overflow = "";
				};

				// Handle navigation only if confirmed
				if (result.isConfirmed) {
					cleanupModal();
					setTimeout(() => {
						navigate("/login");
					}, 100);
				} else {
					// This will run when Cancel button is clicked or dismissed
					cleanupModal();
				}
			});
		}
	};

	return (
		<>
			<Button
				variant="warning"
				className={`toggle-button ${isOpen ? "open" : "collapsed"}`}
				onClick={toggleSidebar}
				id="button"
				aria-label="Toggle Sidebar"
			>
				{isOpen ? <XCircle size={15} /> : <ArrowRight size={15} />}
			</Button>

			<div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
				<Nav className="flex-column">
					<Nav.Link
						href="/buyer/wish_lists"
						onClick={(e) => handleProtectedClick(e, "/buyer/wish_lists")}
						className={
							location.pathname === "/buyer/wish_lists" ? "active" : ""
						}
					>
						<BookmarkDash className="icon" /> {isOpen && "Wish List"}
					</Nav.Link>
					<Nav.Link
						href="/buyer/messages"
						onClick={(e) => handleProtectedClick(e, "/buyer/messages")}
						className={location.pathname === "/buyer/messages" ? "active" : ""}
					>
						<ChatSquareText className="icon" /> {isOpen && "Messages"}
					</Nav.Link>
					<Nav.Link
						href="/buyer/profile"
						onClick={(e) => handleProtectedClick(e, "/buyer/profile")}
						className={location.pathname === "/buyer/profile" ? "active" : ""}
					>
						<PersonCheck className="icon" /> {isOpen && "Profile"}
					</Nav.Link>
				</Nav>
			</div>
		</>
	);
};

export default Sidebar;
