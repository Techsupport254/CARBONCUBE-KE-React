/**
 * Debug script for WebSocket and token issues
 * Run this in the browser console to diagnose problems
 */

export const debugWebSocketAndTokens = () => {
	console.log("🔍 Debugging WebSocket and Token Issues...");

	// Check current token
	const token = localStorage.getItem("token");
	if (!token) {
		console.log("❌ No token found in localStorage");
		return;
	}

	console.log("📋 Current Token Analysis:");
	console.log(`Token: ${token.substring(0, 50)}...`);

	try {
		const parts = token.split(".");
		if (parts.length !== 3) {
			console.log("❌ Invalid token format");
			return;
		}

		const payload = JSON.parse(atob(parts[1]));
		console.log("Token Payload:", payload);

		// Check role consistency
		if (payload.seller_id && payload.role !== "seller") {
			console.log(
				"⚠️  INCONSISTENCY: Token has seller_id but role is not 'seller'"
			);
			console.log(`   Role: ${payload.role}, Seller ID: ${payload.seller_id}`);
		}

		if (payload.user_id && payload.role === "seller") {
			console.log("⚠️  INCONSISTENCY: Token has user_id but role is 'seller'");
			console.log(`   Role: ${payload.role}, User ID: ${payload.user_id}`);
		}

		// Check expiration
		const now = Math.floor(Date.now() / 1000);
		if (payload.exp && payload.exp < now) {
			console.log("❌ Token is expired");
		} else if (payload.exp) {
			const expiresAt = new Date(payload.exp * 1000);
			console.log(`✅ Token expires at: ${expiresAt.toLocaleString()}`);
		}
	} catch (error) {
		console.log("❌ Error decoding token:", error.message);
	}

	// Check WebSocket connection state
	console.log("\n🌐 WebSocket Connection State:");

	// Try to access the presence hook state (if available)
	if (typeof window !== "undefined" && window.React) {
		console.log(
			"React is available, but we can't directly access hook state from console"
		);
		// Check the browser's React DevTools for component state
	}

	// Check localStorage for user data
	console.log("\n👤 User Data in localStorage:");
	console.log("userRole:", localStorage.getItem("userRole"));
	console.log("userName:", localStorage.getItem("userName"));
	console.log("userEmail:", localStorage.getItem("userEmail"));
};

// Helper function to clear all auth data
export const clearAllAuthData = () => {
	console.log("🧹 Clearing all authentication data...");

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
			console.log(`✅ Removed ${key}`);
		}
	});

	console.log("🎉 All authentication data cleared!");
	console.log("Please refresh the page and log in again");
};

// Helper function to force logout
export const forceLogout = () => {
	console.log("🚪 Forcing logout...");
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

	console.log("🛠️  Debug functions available:");
	console.log(
		"  - debugWebSocketAndTokens() - Analyze current token and connection state"
	);
	console.log("  - clearAllAuthData() - Clear all auth data from localStorage");
	console.log("  - forceLogout() - Force logout and redirect to login");
}

export default { debugWebSocketAndTokens, clearAllAuthData, forceLogout };
