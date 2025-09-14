import React from "react";
import Navbar from "../../components/Navbar";

const ErrorState = ({ onLogout }) => {
	return (
		<>
			<Navbar 
				mode="sales" 
				showSearch={false} 
				showCategories={false}
				onLogout={onLogout}
			/>
			<div
				className="d-flex justify-content-center align-items-center"
				style={{
					minHeight: "100vh",
					background: "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)",
					fontFamily: '"Fira Sans Extra Condensed", sans-serif',
				}}
			>
				<div
					className="text-center p-5"
					style={{
						background: "rgba(255, 255, 255, 0.9)",
						backdropFilter: "blur(10px)",
						borderRadius: "20px",
						border: "1px solid rgba(255, 255, 255, 0.2)",
						boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
						maxWidth: "500px",
						width: "90%",
					}}
				>
					<div className="mb-4">
						<div
							className="d-flex justify-content-center align-items-center mx-auto"
							style={{
								width: "80px",
								height: "80px",
								background: "linear-gradient(135deg, #ffc107, #ff9800)",
								borderRadius: "50%",
								boxShadow: "0 4px 15px rgba(255, 193, 7, 0.3)",
							}}
						>
							<svg
								width="40"
								height="40"
								fill="currentColor"
								viewBox="0 0 16 16"
								style={{ color: "#000" }}
							>
								<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
								<path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
							</svg>
						</div>
					</div>
					<h4 className="mb-3 fw-bold" style={{ color: "#333" }}>
						Failed to Load Analytics
					</h4>
					<p className="mb-4" style={{ color: "#666", fontSize: "1.1rem" }}>
						Unable to fetch dashboard data. Please try refreshing the page.
					</p>
					<button
						className="btn fw-bold px-4 py-2"
						style={{
							background: "linear-gradient(135deg, #ffc107, #ff9800)",
							border: "none",
							borderRadius: "25px",
							color: "#000",
							boxShadow: "0 4px 15px rgba(255, 193, 7, 0.3)",
							transition: "all 0.3s ease",
						}}
						onMouseEnter={(e) => {
							e.target.style.transform = "translateY(-2px)";
							e.target.style.boxShadow = "0 6px 20px rgba(255, 193, 7, 0.4)";
						}}
						onMouseLeave={(e) => {
							e.target.style.transform = "translateY(0)";
							e.target.style.boxShadow = "0 4px 15px rgba(255, 193, 7, 0.3)";
						}}
						onClick={() => window.location.reload()}
					>
						<svg
							width="16"
							height="16"
							fill="currentColor"
							viewBox="0 0 16 16"
							className="me-2"
						>
							<path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
							<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
						</svg>
						Refresh Page
					</button>
				</div>
			</div>
		</>
	);
};

export default ErrorState;
