/**
 * Utility functions for handling logout cleanup
 */

/**
 * Global cleanup function for WebSocket connections and other services
 */
export const cleanupOnLogout = () => {
	try {
		// Clean up WebSocket connections from various connection managers
		if (window.connectionManager) {
			window.connectionManager.cleanup();
		}

		// Clean up ActionCable connections
		if (window.ActionCable && window.ActionCable.connection) {
			try {
				window.ActionCable.connection.disconnect();
			} catch (error) {
				// Silently handle disconnect errors
			}
		}

		// Clean up any global event listeners
		const eventsToClean = [
			"messageRead",
			"messageDelivered",
			"newMessage",
			"beforeunload",
		];

		eventsToClean.forEach((eventType) => {
			// Remove all listeners for each event type
			const newWindow = window.cloneNode ? window.cloneNode() : window;
			if (newWindow.removeEventListener) {
				// This is a workaround since we can't directly remove all listeners
				// The individual components should handle their own cleanup
			}
		});

		// Clear any global functions
		delete window.refreshUnreadCount;
		delete window.connectionManager;

		// Clear any pending timeouts/intervals
		// Note: This is a nuclear option - in production you might want to be more specific
		const highestTimeoutId = setTimeout(() => {}, 0);
		for (let i = 0; i < highestTimeoutId; i++) {
			clearTimeout(i);
		}

		// Clear any pending intervals
		const highestIntervalId = setInterval(() => {}, 0);
		for (let i = 0; i < highestIntervalId; i++) {
			clearInterval(i);
		}

		// Logout cleanup completed successfully
	} catch (error) {
		console.error("Error during logout cleanup:", error);
	}
};

/**
 * Clear all authentication-related data from storage
 */
export const clearAuthData = () => {
	try {
		// Clear localStorage
		localStorage.removeItem("token");
		localStorage.removeItem("userRole");
		localStorage.removeItem("userName");
		localStorage.removeItem("userUsername");
		localStorage.removeItem("userEmail");

		// Clear sessionStorage
		sessionStorage.removeItem("userRole");
		sessionStorage.removeItem("token");

		// Authentication data cleared successfully
	} catch (error) {
		console.error("Error clearing authentication data:", error);
	}
};

/**
 * Complete logout process with cleanup and navigation
 */
export const performLogout = (navigate) => {
	// Step 1: Clean up connections and services
	cleanupOnLogout();

	// Step 2: Clear authentication data
	clearAuthData();

	// Step 3: Dispatch custom logout event for other components
	window.dispatchEvent(new CustomEvent("userLogout"));

	// Step 4: Navigate to login page
	if (navigate) {
		navigate("/login", { replace: true });
	} else {
		// Fallback to window.location if navigate is not available
		window.location.href = "/login";
	}
};
