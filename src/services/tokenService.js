/**
 * Token Service for Carbon Cube Frontend
 * Handles JWT token management, expiration checking, and refresh logic
 */

class TokenService {
	constructor() {
		this.refreshPromise = null;
		this.API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
		this.isSettingToken = false;
	}

	/**
	 * Clear all authentication data (for debugging)
	 */
	clearAllAuthData() {
		this.removeToken();
		localStorage.removeItem("userRole");
		localStorage.removeItem("userName");
		localStorage.removeItem("userUsername");
		localStorage.removeItem("userEmail");
		localStorage.removeItem("userProfilePicture");
		sessionStorage.removeItem("userRole");
		sessionStorage.removeItem("token");
	}

	/**
	 * Force clear all authentication data and trigger logout
	 */
	forceLogout() {
		this.clearAllAuthData();

		// Dispatch custom event to trigger logout in all components
		window.dispatchEvent(new CustomEvent("forceLogout"));

		// Redirect to login page
		if (
			typeof window !== "undefined" &&
			window.location.pathname !== "/login"
		) {
			window.location.href = "/login";
		}
	}

	/**
	 * Debug token information
	 */
	debugToken() {
		const token = localStorage.getItem("token");
		if (!token) {
			return;
		}
	}

	/**
	 * Clear any malformed tokens from storage
	 */
	clearMalformedTokens() {
		const token = localStorage.getItem("token");
		if (token && !this.isValidTokenFormat(token)) {
			this.removeToken();
			return true;
		}
		return false;
	}

	/**
	 * Clear tokens that fail signature verification
	 */
	clearInvalidTokens() {
		const token = localStorage.getItem("token");
		if (!token) return false;

		try {
			// Try to decode the token to check if it's valid
			const payload = this.decodeToken(token);
			if (!payload) {
				this.removeToken();
				return true;
			}

			// Check if token has required fields - at least one ID field should be present
			const hasValidId =
				payload.user_id ||
				payload.seller_id ||
				payload.admin_id ||
				payload.sales_id;
			if (!hasValidId) {
				console.log(
					"Token missing required ID field (user_id, seller_id, admin_id, or sales_id), clearing token"
				);
				this.removeToken();
				return true;
			}

			// Check if token is expired
			const now = Math.floor(Date.now() / 1000);
			if (payload.exp && payload.exp < now) {
				this.removeToken();
				return true;
			}

			// Check if token has valid email format
			if (payload.email && !payload.email.includes("@")) {
				this.removeToken();
				return true;
			}

			// Check for known problematic emails that don't exist in database
			const problematicEmails = []; // Removed kiruivictor097@gmail.com as it's a valid buyer
			if (payload.email && problematicEmails.includes(payload.email)) {
				this.forceLogout();
				return true;
			}

			// Check for role consistency - each ID field should match its expected role
			if (payload.seller_id && payload.role && payload.role !== "seller") {
				console.log(
					"Token has seller_id but role is not seller, clearing token"
				);
				this.removeToken();
				return true;
			}

			if (payload.admin_id && payload.role && payload.role !== "admin") {
				console.log("Token has admin_id but role is not admin, clearing token");
				this.removeToken();
				return true;
			}

			if (payload.sales_id && payload.role && payload.role !== "sales") {
				console.log("Token has sales_id but role is not sales, clearing token");
				this.removeToken();
				return true;
			}

			// Check for role consistency - if user has user_id, role should be buyer
			if (payload.user_id && payload.role && payload.role !== "buyer") {
				console.log("Token has user_id but role is not buyer, clearing token");
				this.removeToken();
				return true;
			}

			return false;
		} catch (error) {
			this.removeToken();
			return true;
		}
	}

	/**
	 * Get token from localStorage
	 */
	getToken() {
		// First check if there's a malformed token and clear it
		this.clearMalformedTokens();

		const token = localStorage.getItem("token");

		// Validate token format before returning
		if (token && !this.isValidTokenFormat(token)) {
			this.removeToken();
			return null;
		}

		// Only check for invalid tokens if we have a token and it's not being set
		// This prevents clearing tokens during the login process
		if (token && !this.isSettingToken) {
			const wasCleared = this.clearInvalidTokens();
			if (wasCleared) {
				return null;
			}
		}

		return token;
	}

	/**
	 * Validate JWT token format (should have 3 parts separated by dots)
	 */
	isValidTokenFormat(token) {
		if (!token || typeof token !== "string") {
			return false;
		}

		const parts = token.split(".");
		return parts.length === 3 && parts.every((part) => part.length > 0);
	}

	/**
	 * Set token in localStorage
	 */
	setToken(token) {
		// Set flag to prevent clearing during token setting
		this.isSettingToken = true;

		// Validate token format before storing
		if (!this.isValidTokenFormat(token)) {
			this.isSettingToken = false;
			return false;
		}

		localStorage.setItem("token", token);

		// Reset flag after a longer delay to allow the token to be fully processed
		setTimeout(() => {
			this.isSettingToken = false;
		}, 1000);

		return true;
	}

	/**
	 * Remove token from localStorage
	 */
	removeToken() {
		localStorage.removeItem("token");
	}

	/**
	 * Clear all auth-related data
	 */
	clearAuthData() {
		const keysToRemove = [
			"token",
			"userRole",
			"userName",
			"userUsername",
			"userEmail",
			"userData",
		];

		keysToRemove.forEach((key) => localStorage.removeItem(key));
	}

	/**
	 * Decode JWT token payload
	 */
	decodeToken(token) {
		try {
			const parts = token.split(".");
			if (parts.length !== 3) return null;

			const payload = JSON.parse(atob(parts[1]));
			return payload;
		} catch (error) {
			return null;
		}
	}

	/**
	 * Validate token and check expiration
	 */
	validateToken(token) {
		const tokenToValidate = token || this.getToken();

		if (!tokenToValidate) {
			return {
				isValid: false,
				isExpired: false,
				payload: null,
			};
		}

		const payload = this.decodeToken(tokenToValidate);
		if (!payload) {
			return {
				isValid: false,
				isExpired: false,
				payload: null,
			};
		}

		const now = Math.floor(Date.now() / 1000);
		const isExpired = payload.exp ? payload.exp < now : false;
		const timeUntilExpiry = payload.exp ? payload.exp - now : 0;

		return {
			isValid: true,
			isExpired,
			payload,
			timeUntilExpiry: timeUntilExpiry > 0 ? timeUntilExpiry : 0,
		};
	}

	/**
	 * Check if token is expired
	 */
	isTokenExpired(token) {
		const validation = this.validateToken(token);
		return validation.isExpired;
	}

	/**
	 * Get time until token expires (in seconds)
	 */
	getTimeUntilExpiry(token) {
		const validation = this.validateToken(token);
		return validation.timeUntilExpiry || 0;
	}

	/**
	 * Check if token will expire soon (within 5 minutes)
	 */
	isTokenExpiringSoon(token) {
		const timeUntilExpiry = this.getTimeUntilExpiry(token);
		return timeUntilExpiry > 0 && timeUntilExpiry < 300; // 5 minutes
	}

	/**
	 * Check if token refresh is allowed (remember_me must be true)
	 */
	isRefreshAllowed(token) {
		const validation = this.validateToken(token);
		return validation.isValid && validation.payload?.remember_me === true;
	}

	/**
	 * Check if the current token matches the expected user type
	 */
	validateTokenForUserType(expectedUserType) {
		const token = this.getToken();
		if (!token) return false;

		try {
			const payload = this.decodeToken(token);
			if (!payload) return false;

			const tokenRole = payload.role;
			const expectedRole = expectedUserType.toLowerCase();

			// Check if the token role matches the expected role
			if (tokenRole !== expectedRole) {
				return false;
			}

			// Additional validation based on user type
			if (expectedRole === "seller") {
				// For sellers, should have seller_id
				if (!payload.seller_id) {
					return false;
				}
			} else {
				// For buyers, admins, sales, should have user_id
				if (!payload.user_id) {
					return false;
				}
			}

			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Refresh expired token (only if remember_me is true)
	 */
	async refreshToken() {
		// Check if refresh is allowed
		if (!this.isRefreshAllowed()) {
			throw new Error(
				"Token refresh not allowed - remember me was not enabled"
			);
		}

		// Prevent multiple simultaneous refresh requests
		if (this.refreshPromise) {
			return this.refreshPromise;
		}

		const token = this.getToken();
		if (!token) {
			throw new Error("No token to refresh");
		}

		this.refreshPromise = this._performRefresh(token);

		try {
			const newToken = await this.refreshPromise;
			return newToken;
		} finally {
			this.refreshPromise = null;
		}
	}

	/**
	 * Perform actual token refresh request
	 */
	async _performRefresh(token) {
		try {
			const response = await fetch(`${this.API_BASE_URL}/auth/refresh`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.error || "Token refresh failed");
			}

			const data = await response.json();

			// Update token in localStorage
			if (!this.setToken(data.token)) {
				throw new Error("Failed to store new token");
			}

			return data.token;
		} catch (error) {
			// If refresh fails, clear auth data
			this.clearAuthData();
			throw error;
		}
	}

	/**
	 * Handle API response for token expiration
	 */
	async handleTokenExpiration() {
		try {
			await this.refreshToken();
			return true;
		} catch (error) {
			this.clearAuthData();

			// Redirect to login page
			window.location.href = "/login";

			return false;
		}
	}

	/**
	 * Extract user information from token
	 */
	getUserFromToken(token) {
		const validation = this.validateToken(token);

		if (!validation.isValid || !validation.payload) {
			return null;
		}

		const payload = validation.payload;

		return {
			id: payload.seller_id || payload.user_id || "",
			name: payload.name || payload.user_name,
			username: payload.username || payload.user_username,
			email: payload.email || payload.user_email,
			role: payload.role || payload.user_role || "unknown",
		};
	}

	/**
	 * Setup automatic token refresh
	 */
	setupAutoRefresh() {
		const checkAndRefresh = async () => {
			const token = this.getToken();
			if (!token) return;

			// Check if token is expired
			if (this.isTokenExpired()) {
				this.clearAuthData();
				return;
			}

			// Check if token is expiring soon and refresh is allowed
			if (this.isTokenExpiringSoon() && this.isRefreshAllowed()) {
				try {
					await this.refreshToken();
				} catch (error) {
					this.clearAuthData();
				}
			}
		};

		// Check every 30 seconds for more responsive logout
		setInterval(checkAndRefresh, 30000);

		// Also check immediately
		checkAndRefresh();
	}
}

// Create singleton instance
const tokenService = new TokenService();

export default tokenService;
