/**
 * Debug script for WebSocket and token issues
 * Run this in the browser console to diagnose problems
 */

export const debugWebSocketAndTokens = () => {
	// Check current token
	const token = localStorage.getItem("token");
	if (!token) {
		return;
	}

	try {
		const parts = token.split(".");
		if (parts.length !== 3) {
			return;
		}

		const payload = JSON.parse(atob(parts[1]));

		// Check role consistency
		if (payload.seller_id && payload.role !== "seller") {
		}

		if (payload.user_id && payload.role === "seller") {
		}

		// Check expiration
		const now = Math.floor(Date.now() / 1000);
		if (payload.exp && payload.exp < now) {
		} else if (payload.exp) {
			const expiresAt = new Date(payload.exp * 1000);
		}
	} catch (error) {}

	// Check WebSocket connection state

	// Try to access the presence hook state (if available)
	if (typeof window !== "undefined" && window.React) {
		// Check the browser's React DevTools for component state
	}

	// Check localStorage for user data
};

// Helper function to clear all auth data
export const clearAllAuthData = () => {
	const keysToRemove = [
		"token",
		"userRole",
		"userName",
		"userUsername",
		"userEmail",
		"userProfilePicture",
		"userData",
	];

	keysToRemove.forEach((key) => {
		if (localStorage.getItem(key)) {
			localStorage.removeItem(key);
		}
	});
};

// Helper function to force logout
export const forceLogout = () => {
	clearAllAuthData();

	// Dispatch logout event
	if (typeof window !== "undefined") {
		window.dispatchEvent(new CustomEvent("forceLogout"));
		window.location.href = "/login";
	}
};

// Make functions available globally
if (typeof window !== "undefined") {
	window.debugWebSocketAndTokens = debugWebSocketAndTokens;
	window.clearAllAuthData = clearAllAuthData;
	window.forceLogout = forceLogout;
}

export default { debugWebSocketAndTokens, clearAllAuthData, forceLogout };
