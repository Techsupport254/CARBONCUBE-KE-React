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

/**
 * Get tier name from tier_priority (backend tier priority system)
 * @param {number} tierPriority - The tier priority from backend (1=Premium, 2=Standard, 3=Basic, 4=Free)
 * @returns {string} - The tier name
 */
export const getTierNameFromPriority = (tierPriority) => {
	const tierNames = {
		1: "Premium",
		2: "Standard", 
		3: "Basic",
		4: "Free"
	};
	return tierNames[tierPriority] || "Free";
};

/**
 * Get tier ID from tier_priority (backend tier priority system)
 * @param {number} tierPriority - The tier priority from backend (1=Premium, 2=Standard, 3=Basic, 4=Free)
 * @returns {number} - The tier ID for styling (4=Premium, 3=Standard, 2=Basic, 1=Free)
 */
export const getTierIdFromPriority = (tierPriority) => {
	const tierIds = {
		1: 4, // Premium
		2: 3, // Standard
		3: 2, // Basic
		4: 1  // Free
	};
	return tierIds[tierPriority] || 1;
};

/**
 * Get tier name with fallback to tier_priority
 * @param {Object} ad - The ad object
 * @returns {string} - The tier name
 */
export const getTierName = (ad) => {
	// First try to get from seller_tier_name
	if (ad.seller_tier_name && ad.seller_tier_name !== "N/A") {
		return ad.seller_tier_name;
	}
	
	// Fallback to tier_priority
	if (ad.tier_priority) {
		return getTierNameFromPriority(ad.tier_priority);
	}
	
	// Final fallback
	return "Free";
};

/**
 * Get tier ID with fallback to tier_priority
 * @param {Object} ad - The ad object
 * @returns {number} - The tier ID for styling
 */
export const getTierId = (ad) => {
	// First try to get from seller_tier
	if (ad.seller_tier && ad.seller_tier !== "N/A") {
		return ad.seller_tier;
	}
	
	// Fallback to tier_priority
	if (ad.tier_priority) {
		return getTierIdFromPriority(ad.tier_priority);
	}
	
	// Final fallback
	return 1; // Free
};
