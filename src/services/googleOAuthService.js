// services/googleOAuthService.js
import axios from "axios";

class GoogleOAuthService {
	constructor() {
		this.clientId =
			process.env.REACT_APP_GOOGLE_CLIENT_ID ||
			"810251363291-gk0b9ddj0b7ij75rpkkgiigfhdmq7q8e.apps.googleusercontent.com";
		this.redirectUri =
			process.env.REACT_APP_GOOGLE_REDIRECT_URI ||
			`http://localhost:3001/auth/google_oauth2/callback`;
		this.scope = "openid email profile";

		// Debug logging
		console.log("=== GOOGLE OAUTH DEBUG ===");
		console.log("Google OAuth Service initialized:");
		console.log("Client ID:", this.clientId);
		console.log("Redirect URI:", this.redirectUri);
		console.log(
			"REACT_APP_GOOGLE_CLIENT_ID from env:",
			process.env.REACT_APP_GOOGLE_CLIENT_ID
		);
		console.log(
			"REACT_APP_GOOGLE_REDIRECT_URI from env:",
			process.env.REACT_APP_GOOGLE_REDIRECT_URI
		);
		console.log("Window location origin:", window.location.origin);
		console.log("=== END DEBUG ===");
	}

	// Generate Google OAuth URL
	getAuthUrl() {
		const params = new URLSearchParams({
			client_id: this.clientId,
			redirect_uri: this.redirectUri,
			response_type: "code",
			scope: this.scope,
			access_type: "offline",
			prompt: "consent",
		});

		const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

		// Debug logging
		console.log("=== OAUTH URL DEBUG ===");
		console.log("Generated OAuth URL:", authUrl);
		console.log("Redirect URI being sent:", this.redirectUri);
		console.log("=== END OAUTH URL DEBUG ===");

		return authUrl;
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
	initiateAuth() {
		// Final debug check before redirect
		console.log("=== FINAL OAUTH CHECK ===");
		console.log("About to redirect to Google OAuth with:");
		console.log("Redirect URI:", this.redirectUri);
		console.log("Full OAuth URL:", this.getAuthUrl());
		console.log("=== END FINAL CHECK ===");

		window.location.href = this.getAuthUrl();
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
