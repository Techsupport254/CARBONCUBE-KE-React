// services/googleOAuthService.js
import axios from "axios";

class GoogleOAuthService {
	constructor() {
		this.clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
		this.redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
		this.scope = "openid email profile";

		// Validate required environment variables
		if (!this.clientId) {
			console.error("REACT_APP_GOOGLE_CLIENT_ID is not set");
		}
		if (!this.redirectUri) {
			console.error("REACT_APP_GOOGLE_REDIRECT_URI is not set");
		}
	}

	// Generate Google OAuth URL using backend-initiated flow
	getAuthUrl(role = "buyer") {
		// Fallback: Use direct Google OAuth if backend route is not available
		if (!this.clientId) {
			// If no client_id available, use backend-initiated flow
			const backendUrl =
				process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
			return `${backendUrl}/auth/google_oauth2/initiate?role=${role}`;
		}

		// Direct Google OAuth as fallback
		const params = new URLSearchParams({
			client_id: this.clientId,
			redirect_uri:
				this.redirectUri ||
				`${
					process.env.REACT_APP_BACKEND_URL || "http://localhost:3001"
				}/auth/google_oauth2/callback`,
			response_type: "code",
			scope: "openid email profile",
			access_type: "offline",
			prompt: "consent",
			state: role,
		});

		return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
	}

	// Handle OAuth callback and exchange code for token
	async handleCallback(code) {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/auth/google`,
				{
					code: code,
					redirect_uri: this.redirectUri,
				}
			);

			return {
				success: true,
				token: response.data.token,
				user: response.data.user,
			};
		} catch (error) {
			console.error("Google OAuth error:", error);
			return {
				success: false,
				error: error.response?.data?.errors?.[0] || "Authentication failed",
			};
		}
	}

	// Initiate Google OAuth flow
	initiateAuth(role = "buyer") {
		window.location.href = this.getAuthUrl(role);
	}

	// Check if we're in a callback scenario
	isCallback() {
		const urlParams = new URLSearchParams(window.location.search);
		const hasCode = urlParams.has("code");
		const hasToken = urlParams.has("token");
		const hasUser = urlParams.has("user");
		const pathname = window.location.pathname;
		const isOAuth2Callback =
			hasCode && pathname.includes("/auth/google_oauth2/callback");
		const isOAuthCallback =
			hasToken && hasUser && pathname.includes("/auth/google/callback");

		return isOAuth2Callback || isOAuthCallback;
	}

	// Extract code from URL
	getCodeFromUrl() {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get("code");
	}

	// Clear URL parameters after processing
	clearUrlParams() {
		const url = new URL(window.location);
		url.searchParams.delete("code");
		url.searchParams.delete("state");
		window.history.replaceState({}, document.title, url.pathname);
	}
}

export default new GoogleOAuthService();
