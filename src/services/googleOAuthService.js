// services/googleOAuthService.js
import axios from "axios";

class GoogleOAuthService {
	constructor() {
		this.clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
		this.redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
		this.scope = "openid email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.addresses.read https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/user.organization.read";
		this.gsiClient = null;
		this.isGsiLoaded = false;

		// Debug environment variables
		console.log("🔧 GoogleOAuthService initialized");
		console.log("Client ID:", this.clientId ? "✅ Set" : "❌ Missing");
		console.log("Redirect URI:", this.redirectUri ? "✅ Set" : "❌ Missing");
		console.log(
			"Backend URL:",
			process.env.REACT_APP_BACKEND_URL ? "✅ Set" : "❌ Missing"
		);

		// Validate required environment variables
		if (!this.clientId) {
			console.error("❌ REACT_APP_GOOGLE_CLIENT_ID is not set");
		}
		if (!this.redirectUri) {
			console.error("❌ REACT_APP_GOOGLE_REDIRECT_URI is not set");
		}
	}

	// Initialize Google Identity Services
	async initializeGsi() {
		if (this.isGsiLoaded) return;

		return new Promise((resolve, reject) => {
			// Check if Google Identity Services is already loaded
			if (window.google && window.google.accounts) {
				this.isGsiLoaded = true;
				resolve();
				return;
			}

			// Load Google Identity Services script
			const script = document.createElement("script");
			script.src = "https://accounts.google.com/gsi/client";
			script.async = true;
			script.defer = true;
			script.onload = () => {
				this.isGsiLoaded = true;
				resolve();
			};
			script.onerror = () => {
				reject(new Error("Failed to load Google Identity Services"));
			};
			document.head.appendChild(script);
		});
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
				}/auth/google_oauth2/popup_callback`,
			response_type: "code",
			scope: this.scope,
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

	// Initiate Google OAuth flow with popup
	async initiateAuth(role = "buyer") {
		try {
			console.log("🚀 Starting Google OAuth authentication...");
			console.log("Client ID:", this.clientId);
			console.log("Role:", role);

			// Check if we have a valid client ID
			if (!this.clientId) {
				console.warn("⚠️ No client ID, falling back to redirect method");
				this.fallbackToRedirect(role);
				return;
			}

			// Use redirect method for reliable authentication
			console.log("🔄 Using redirect method for reliable authentication...");
			this.fallbackToRedirect(role);
		} catch (error) {
			console.error("❌ All popup methods failed:", error);
			console.log("🔄 Falling back to redirect method...");
			this.fallbackToRedirect(role);
		}
	}

	// Try GSI popup method
	async tryGsiPopup(role) {
		console.log("🔧 Trying GSI popup method...");

		// Initialize Google Identity Services
		await this.initializeGsi();
		console.log("✅ GSI initialized successfully");

		// Check if Google is available
		if (!window.google || !window.google.accounts) {
			throw new Error("Google Identity Services not loaded");
		}

		// Use OAuth2 flow instead of FedCM to avoid CORS issues
		console.log("🔧 Initializing GSI OAuth2 flow...");

		// Initialize GSI OAuth2 client for popup
		this.gsiClient = window.google.accounts.oauth2.initCodeClient({
			client_id: this.clientId,
			scope: this.scope,
			ux_mode: "popup",
			callback: (response) => this.handleGsiCallback(response, role),
		});

		console.log("✅ GSI OAuth2 client initialized");
		console.log("🎯 Requesting authorization code...");

		// Request authorization code (this should open the popup)
		this.gsiClient.requestCode();
	}

	// Try manual popup method
	async tryManualPopup(role) {
		console.log("🔧 Trying manual popup method...");

		const authUrl = this.getAuthUrl(role);
		console.log("🔗 Opening popup with URL:", authUrl);

		// Open popup window
		const popup = window.open(
			authUrl,
			"googleAuth",
			"width=500,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no"
		);

		if (!popup) {
			throw new Error("Popup blocked by browser");
		}

		// Focus the popup
		popup.focus();

		// Listen for popup messages
		const messageListener = (event) => {
			// Security check
			if (
				event.origin !== "https://accounts.google.com" &&
				!event.origin.includes(window.location.hostname)
			) {
				return;
			}

			if (event.data && event.data.type === "GOOGLE_AUTH_SUCCESS") {
				window.removeEventListener("message", messageListener);
				popup.close();
				this.handlePopupAuthSuccess(event.data.token, event.data.user);
			} else if (event.data && event.data.type === "GOOGLE_AUTH_ERROR") {
				window.removeEventListener("message", messageListener);
				popup.close();
				this.handlePopupAuthError(event.data.error);
			}
		};

		window.addEventListener("message", messageListener);

		// Check if popup was closed manually
		const checkClosed = setInterval(() => {
			if (popup.closed) {
				clearInterval(checkClosed);
				window.removeEventListener("message", messageListener);
			}
		}, 1000);

		// Store references for cleanup
		this.currentPopup = popup;
		this.currentMessageListener = messageListener;
	}

	// Handle successful popup authentication
	handlePopupAuthSuccess(token, user) {
		if (this.onSuccessCallback) {
			this.onSuccessCallback(token, user);
		}
	}

	// Handle popup authentication error
	handlePopupAuthError(error) {
		if (this.onErrorCallback) {
			this.onErrorCallback(error);
		}
	}

	// Fallback to redirect method if popup fails
	fallbackToRedirect(role = "buyer") {
		console.log("🔄 Using redirect fallback method");
		const authUrl = this.getAuthUrl(role);
		console.log("🔗 Redirecting to:", authUrl);
		window.location.href = authUrl;
	}

	// Handle GSI credential response (for popup mode)
	async handleGsiCredentialResponse(response, role) {
		console.log("📨 GSI credential response received:", response);

		if (response.error) {
			console.error("❌ Google OAuth error:", response.error);
			if (this.onErrorCallback) {
				this.onErrorCallback(response.error);
			}
			return;
		}

		if (response.credential) {
			console.log(
				"✅ JWT credential received:",
				response.credential.substring(0, 20) + "..."
			);
			try {
				console.log("🔄 Sending credential to backend...");
				// Send the JWT credential to backend
				const backendResponse = await axios.post(
					`${process.env.REACT_APP_BACKEND_URL}/auth/google`,
					{
						credential: response.credential,
						role: role,
					}
				);

				console.log("✅ Backend response:", backendResponse.data);

				if (backendResponse.data.token && backendResponse.data.user) {
					console.log("🎉 Authentication successful!");
					if (this.onSuccessCallback) {
						this.onSuccessCallback(
							backendResponse.data.token,
							backendResponse.data.user
						);
					}
				} else {
					console.error("❌ No token or user in response");
					console.error("❌ Backend response:", backendResponse.data);
					if (this.onErrorCallback) {
						this.onErrorCallback("Authentication failed");
					}
				}
			} catch (error) {
				console.error("❌ Backend authentication error:", error);
				console.error("❌ Error response:", error.response?.data);
				console.error("❌ Error status:", error.response?.status);
				console.error("❌ Error headers:", error.response?.headers);

				let errorMessage = "Authentication failed";
				if (error.response?.data?.errors?.[0]) {
					errorMessage = error.response.data.errors[0];
				} else if (error.response?.data?.error) {
					errorMessage = error.response.data.error;
				} else if (error.message) {
					errorMessage = error.message;
				}

				if (this.onErrorCallback) {
					this.onErrorCallback(errorMessage);
				}
			}
		} else {
			console.error("❌ No credential in response");
			if (this.onErrorCallback) {
				this.onErrorCallback("No credential received");
			}
		}
	}

	// Handle GSI callback
	async handleGsiCallback(response, role) {
		console.log("📨 GSI callback received:", response);

		if (response.error) {
			console.error("❌ Google OAuth error:", response.error);
			if (this.onErrorCallback) {
				this.onErrorCallback(response.error);
			}
			return;
		}

		if (response.code) {
			console.log(
				"✅ Authorization code received:",
				response.code.substring(0, 20) + "..."
			);
			try {
				console.log("🔄 Sending code to backend...");
				// Send the authorization code to backend
				const backendResponse = await axios.post(
					`${process.env.REACT_APP_BACKEND_URL}/auth/google`,
					{
						code: response.code,
						redirect_uri: "postmessage", // GSI uses 'postmessage' as redirect_uri
						role: role,
					}
				);

				console.log("✅ Backend response:", backendResponse.data);

				if (backendResponse.data.token && backendResponse.data.user) {
					console.log("🎉 Authentication successful!");
					if (this.onSuccessCallback) {
						this.onSuccessCallback(
							backendResponse.data.token,
							backendResponse.data.user
						);
					}
				} else {
					console.error("❌ No token or user in response");
					console.error("❌ Backend response:", backendResponse.data);
					if (this.onErrorCallback) {
						this.onErrorCallback("Authentication failed");
					}
				}
			} catch (error) {
				console.error("❌ Backend authentication error:", error);
				console.error("❌ Error response:", error.response?.data);
				console.error("❌ Error status:", error.response?.status);
				console.error("❌ Error headers:", error.response?.headers);

				let errorMessage = "Authentication failed";
				if (error.response?.data?.errors?.[0]) {
					errorMessage = error.response.data.errors[0];
				} else if (error.response?.data?.error) {
					errorMessage = error.response.data.error;
				} else if (error.message) {
					errorMessage = error.message;
				}

				if (this.onErrorCallback) {
					this.onErrorCallback(errorMessage);
				}
			}
		} else {
			console.error("❌ No authorization code in response");
			if (this.onErrorCallback) {
				this.onErrorCallback("No authorization code received");
			}
		}
	}

	// Set callbacks for authentication
	setCallbacks(onSuccess, onError) {
		this.onSuccessCallback = onSuccess;
		this.onErrorCallback = onError;
	}

	// Cleanup GSI client and popup
	cleanup() {
		if (this.gsiClient) {
			// GSI handles cleanup automatically
			this.gsiClient = null;
		}

		// Cleanup manual popup
		if (this.currentPopup && !this.currentPopup.closed) {
			this.currentPopup.close();
		}
		if (this.currentMessageListener) {
			window.removeEventListener("message", this.currentMessageListener);
		}
	}

	// Check if we're in a callback scenario
	isCallback() {
		const urlParams = new URLSearchParams(window.location.search);
		const hasCode = urlParams.has("code");
		const hasToken = urlParams.has("token");
		const hasUser = urlParams.has("user");
		const hasError = urlParams.has("error");
		const pathname = window.location.pathname;
		const isOAuth2Callback =
			hasCode && pathname.includes("/auth/google_oauth2/callback");
		const isOAuthCallback =
			(hasToken && hasUser && pathname.includes("/auth/google/callback")) ||
			(hasError && pathname.includes("/auth/google/callback"));

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
