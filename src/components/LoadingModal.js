import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const LoadingModal = ({
	isVisible,
	message = "Processing...",
	type = "loading",
}) => {
	if (!isVisible) return null;

	const getIcon = () => {
		switch (type) {
			case "success":
				return <CheckCircle className="w-8 h-8 text-green-500" />;
			case "error":
				return <AlertCircle className="w-8 h-8 text-red-500" />;
			default:
				return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />;
		}
	};

	const getBackgroundColor = () => {
		switch (type) {
			case "success":
				return "bg-green-50";
			case "error":
				return "bg-red-50";
			default:
				return "bg-blue-50";
		}
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
					style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
				>
					<motion.div
						initial={{ scale: 0.8, y: 20 }}
						animate={{ scale: 1, y: 0 }}
						exit={{ scale: 0.8, y: 20 }}
						transition={{ type: "spring", duration: 0.3 }}
						className="relative w-full max-w-sm mx-auto px-4"
						style={{ maxWidth: "400px", width: "90%" }}
					>
						<div
							className={`${getBackgroundColor()} rounded-2xl shadow-2xl overflow-hidden`}
						>
							{/* Content */}
							<div className="p-8 text-center">
								{/* Icon */}
								<div className="flex justify-center mb-4">{getIcon()}</div>

								{/* Message */}
								<h3 className="text-lg font-semibold text-gray-800 mb-2">
									{type === "success"
										? "Success!"
										: type === "error"
										? "Error"
										: "Please Wait"}
								</h3>
								<p className="text-gray-600 text-sm">{message}</p>

								{/* Progress indicator for loading */}
								{type === "loading" && (
									<div className="mt-4">
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className="bg-blue-500 h-2 rounded-full animate-pulse"
												style={{ width: "60%" }}
											></div>
										</div>
									</div>
								)}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default LoadingModal;
