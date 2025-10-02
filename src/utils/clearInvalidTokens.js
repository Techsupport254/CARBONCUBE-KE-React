/**
 * Utility to clear invalid tokens from localStorage
 * This can be run in the browser console to fix authentication issues
 */

export const clearInvalidTokens = () => {
	// List of known problematic emails that don't exist in database
	const problematicEmails = []; // Removed kiruivictor097@gmail.com as it's a valid buyer

	try {
		const token = localStorage.getItem("token");

		if (!token) {
			return;
		}

		// Try to decode the token
		const parts = token.split(".");
		if (parts.length !== 3) {
			localStorage.removeItem("token");
			localStorage.removeItem("userRole");
			localStorage.removeItem("userName");
			localStorage.removeItem("userUsername");
			localStorage.removeItem("userEmail");
			localStorage.removeItem("userProfilePicture");
			return;
		}

		try {
			const payload = JSON.parse(atob(parts[1]));

			// Check for problematic emails
			if (payload.email && problematicEmails.includes(payload.email)) {
				localStorage.removeItem("token");
				localStorage.removeItem("userRole");
				localStorage.removeItem("userName");
				localStorage.removeItem("userUsername");
				localStorage.removeItem("userEmail");
				localStorage.removeItem("userProfilePicture");
				return;
			}

			// Check if token is expired
			const now = Math.floor(Date.now() / 1000);
			if (payload.exp && payload.exp < now) {
				localStorage.removeItem("token");
				localStorage.removeItem("userRole");
				localStorage.removeItem("userName");
				localStorage.removeItem("userUsername");
				localStorage.removeItem("userEmail");
				localStorage.removeItem("userProfilePicture");
				return;
			}
		} catch (decodeError) {
			localStorage.removeItem("token");
			localStorage.removeItem("userRole");
			localStorage.removeItem("userName");
			localStorage.removeItem("userUsername");
			localStorage.removeItem("userEmail");
			localStorage.removeItem("userProfilePicture");
		}
	} catch (error) {
	}
};

// Make it available globally for console use
if (typeof window !== "undefined") {
	window.clearInvalidTokens = clearInvalidTokens;
}

export default clearInvalidTokens;
