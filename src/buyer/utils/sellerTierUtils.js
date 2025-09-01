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
		1: "#6B7280", // Free (Gray)
		2: "#3B82F6", // Basic (Blue)
		3: "#10B981", // Standard (Green)
		4: "#F59E0B", // Premium (Gold/Amber)
	};
	return tierColors[tierId] || "#6B7280"; // Default to gray for unknown tiers
};
