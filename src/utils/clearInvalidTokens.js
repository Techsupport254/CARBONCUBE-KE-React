/**
 * Utility to clear invalid tokens from localStorage
 * This can be run in the browser console to fix authentication issues
 */

export const clearInvalidTokens = () => {
	console.log("🧹 Clearing invalid tokens from localStorage...");

	// List of known problematic emails that don't exist in database
	const problematicEmails = []; // Removed kiruivictor097@gmail.com as it's a valid buyer

	try {
		const token = localStorage.getItem("token");

		if (!token) {
			console.log("✅ No token found in localStorage");
			return;
		}

		// Try to decode the token
		const parts = token.split(".");
		if (parts.length !== 3) {
			console.log("❌ Invalid token format, clearing...");
			localStorage.removeItem("token");
			localStorage.removeItem("userRole");
			localStorage.removeItem("userName");
			localStorage.removeItem("userUsername");
			localStorage.removeItem("userEmail");
			localStorage.removeItem("userProfilePicture");
			console.log("✅ Cleared malformed token");
			return;
		}

		try {
			const payload = JSON.parse(atob(parts[1]));

			// Check for problematic emails
			if (payload.email && problematicEmails.includes(payload.email)) {
				console.log(`❌ Found token for non-existent user: ${payload.email}`);
				localStorage.removeItem("token");
				localStorage.removeItem("userRole");
				localStorage.removeItem("userName");
				localStorage.removeItem("userUsername");
				localStorage.removeItem("userEmail");
				localStorage.removeItem("userProfilePicture");
				console.log("✅ Cleared token for non-existent user");
				return;
			}

			// Check if token is expired
			const now = Math.floor(Date.now() / 1000);
			if (payload.exp && payload.exp < now) {
				console.log("❌ Found expired token, clearing...");
				localStorage.removeItem("token");
				localStorage.removeItem("userRole");
				localStorage.removeItem("userName");
				localStorage.removeItem("userUsername");
				localStorage.removeItem("userEmail");
				localStorage.removeItem("userProfilePicture");
				console.log("✅ Cleared expired token");
				return;
			}

			console.log("✅ Token appears to be valid");
			console.log(`   User ID: ${payload.user_id || payload.seller_id}`);
			console.log(`   Email: ${payload.email}`);
			console.log(`   Role: ${payload.role}`);
			console.log(
				`   Expires: ${new Date(payload.exp * 1000).toLocaleString()}`
			);
		} catch (decodeError) {
			console.log("❌ Token decode failed, clearing...");
			localStorage.removeItem("token");
			localStorage.removeItem("userRole");
			localStorage.removeItem("userName");
			localStorage.removeItem("userUsername");
			localStorage.removeItem("userEmail");
			localStorage.removeItem("userProfilePicture");
			console.log("✅ Cleared undecodable token");
		}
	} catch (error) {
		console.error("❌ Error clearing tokens:", error);
	}
};

// Make it available globally for console use
if (typeof window !== "undefined") {
	window.clearInvalidTokens = clearInvalidTokens;
}

export default clearInvalidTokens;
