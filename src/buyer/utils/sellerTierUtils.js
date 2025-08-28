/**
 * Utility functions for seller tier styling
 */

/**
 * Get border color based on seller tier ID
 * @param {number} tierId - The seller tier ID
 * @returns {string} - The border color hex code
 */
export const getBorderColor = (tierId) => {
	const tierColors = {
		1: "#F0FFF0", // Free (Blue)
		2: "#FF5733", // Basic (Red-Orange)
		3: "#28A745", // Standard (Bright Green)
		4: "#FFC107", // Premium (Gold-like yellow)
	};
	return tierColors[tierId] || "transparent"; // No border color for Free tier
};
