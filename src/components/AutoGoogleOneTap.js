import React, { useEffect, useRef, useState } from "react";

const AutoGoogleOneTap = ({
	onSuccess,
	onError,
	onClose,
	isVisible = true,
}) => {
	const isInitialized = useRef(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showFallback, setShowFallback] = useState(false);
	const googleButtonRef = useRef(null);

	useEffect(() => {
		console.log("🔵 ===== COMPONENT LIFECYCLE DEBUG =====");
		console.log("🔵 AutoGoogleOneTap useEffect triggered");
		console.log("🔵 isVisible:", isVisible);
		console.log("🔵 isInitialized:", isInitialized.current);
		console.log("🔵 isLoading:", isLoading);

		if (!isVisible) {
			console.log("🔵 Component not visible, skipping initialization");
			return;
		}

		console.log("🔵 Component is visible, proceeding with initialization");
		// Load Google Identity Services script
		const loadGoogleScript = () => {
			console.log("🔵 ===== SCRIPT LOADING DEBUG =====");
			console.log("🔵 Component isVisible:", isVisible);
			console.log("🔵 Google already loaded:", !!window.google);
			console.log("🔵 Google accounts available:", !!window.google?.accounts);

			if (window.google) {
				console.log("🔵 Google already available, initializing directly");
				initializeGoogleOneTap();
				return;
			}

			console.log("🔵 Loading Google Identity Services script...");
			const script = document.createElement("script");
			script.src = "https://accounts.google.com/gsi/client";
			script.async = true;
			script.defer = true;
			script.onload = () => {
				console.log("🔵 Google script loaded successfully");
				initializeGoogleOneTap();
			};
			script.onerror = (error) => {
				console.error("🔴 Failed to load Google script:", error);
			};
			document.head.appendChild(script);
			console.log("🔵 Script element added to head");
		};

		const initializeGoogleOneTap = () => {
			if (isInitialized.current || !window.google) {
				console.log(
					"🔵 Skipping initialization - already initialized or Google not loaded"
				);
				return;
			}

			try {
				const clientId =
					process.env.REACT_APP_GOOGLE_CLIENT_ID ||
					"810251363291-gk0b9ddj0b7ij75rpkkgiigfhdmq7q8e.apps.googleusercontent.com";

				console.log("🔵 ===== GOOGLE ONE TAP DEBUG START =====");
				console.log("🔵 Client ID:", clientId);
				console.log("🔵 Current domain:", window.location.hostname);
				console.log("🔵 Current origin:", window.location.origin);
				console.log("🔵 User agent:", navigator.userAgent);
				console.log("🔵 Is HTTPS:", window.location.protocol === "https:");
				console.log("🔵 Google object available:", !!window.google);
				console.log("🔵 Google accounts available:", !!window.google?.accounts);
				console.log(
					"🔵 Google accounts id available:",
					!!window.google?.accounts?.id
				);
				console.log("🔵 FedCM support:", "fedcm" in navigator.credentials);
				console.log(
					"🔵 Browser supports FedCM:",
					typeof navigator.credentials !== "undefined"
				);

				console.log(
					"🔵 Initializing Google One Tap with callback:",
					handleCredentialResponse
				);

				// Use the most reliable approach for localhost development
				// For localhost, use the traditional popup approach which is more stable
				const isLocalhost =
					window.location.hostname.includes("localhost") ||
					window.location.hostname.includes("127.0.0.1") ||
					window.location.protocol === "http:";

				console.log("🔵 Environment check:");
				console.log("🔵 - Is localhost/HTTP:", isLocalhost);
				console.log("🔵 - Current origin:", window.location.origin);
				console.log("🔵 - Client ID:", clientId);
				console.log("🔵 - Expected origins for OAuth:");
				console.log("🔵   - http://localhost:3000");
				console.log("🔵   - http://127.0.0.1:3000");
				console.log(
					"🔵   - Make sure these are in Google Cloud Console OAuth settings"
				);

				// Use the same approach as the working login page
				window.google.accounts.id.initialize({
					client_id: clientId,
					callback: handleCredentialResponse,
					auto_select: false,
					cancel_on_tap_outside: true,
					ux_mode: "popup", // Same as login page
					itp_support: true,
				});
				console.log("🔵 Google One Tap initialized (same as login page)");

				// Show the account selection popup directly (like clicking "Continue with Google")
				setTimeout(() => {
					console.log("🔵 Opening Google account selection popup directly...");

					// Trigger the same popup that "Continue with Google" button shows
					// Use simple prompt without deprecated notification methods
					window.google.accounts.id.prompt();

					// Set a timeout to check if we need fallback
					setTimeout(() => {
						console.log("🔵 Checking if prompt was successful...");
						// If no response after 2 seconds, show fallback button
						if (!isLoading) {
							console.log("🔵 No response received, showing fallback button");
							setShowFallback(true);
						}
					}, 2000);
				}, 500);

				isInitialized.current = true;
			} catch (error) {
				console.error("🔴 Error initializing Google One Tap:", error);
				console.error("🔴 Error stack:", error.stack);
			}
		};

		const handleCredentialResponse = async (response) => {
			console.log("🔵 ===== CREDENTIAL RESPONSE DEBUG START =====");
			console.log("🔵 AutoGoogleOneTap: handleCredentialResponse called");
			console.log("🔵 Response received:", response);
			console.log("🔵 Response type:", typeof response);
			console.log(
				"🔵 Response keys:",
				response ? Object.keys(response) : "null"
			);
			console.log(
				"🔵 Credential present:",
				!!(response && response.credential)
			);
			console.log("🔵 Credential length:", response?.credential?.length || 0);

			// Set loading to true to prevent fallback from showing
			setIsLoading(true);
			try {
				console.log("🔵 Google One Tap response:", response);

				// Validate response
				if (!response || !response.credential) {
					console.error("🔴 Invalid Google credential response:", response);
					console.error("🔴 Response is null:", response === null);
					console.error("🔴 Response is undefined:", response === undefined);
					console.error(
						"🔴 Response has no credential:",
						!response?.credential
					);
					throw new Error("Invalid Google credential response");
				}

				console.log("🔵 Credential validation passed");
				console.log("🔵 Backend URL:", process.env.REACT_APP_BACKEND_URL);
				console.log("🔵 Sending credential to backend...");

				// Send the credential to your backend
				const backendResponse = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/auth/google_one_tap`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							credential: response.credential,
						}),
					}
				);

				console.log("🔵 Backend response status:", backendResponse.status);
				console.log(
					"🔵 Backend response headers:",
					Object.fromEntries(backendResponse.headers.entries())
				);

				if (!backendResponse.ok) {
					const errorText = await backendResponse.text();
					console.error("🔴 Backend error:", errorText);
					console.error("🔴 Backend status:", backendResponse.status);
					console.error("🔴 Backend status text:", backendResponse.statusText);
					throw new Error(
						`Backend error: ${backendResponse.status} - ${errorText}`
					);
				}

				const result = await backendResponse.json();
				console.log("🔵 Backend result:", result);
				console.log("🔵 Backend success:", result.success);
				console.log("🔵 Backend token present:", !!result.token);
				console.log("🔵 Backend user present:", !!result.user);

				if (result.success) {
					console.log("✅ Authentication successful, calling onSuccess");
					console.log("✅ Token:", result.token);
					console.log("✅ User:", result.user);
					onSuccess(result.token, result.user);
				} else {
					console.error("🔴 Backend authentication failed:", result);
					console.error("🔴 Error message:", result.error);
					onError(result.error || "Authentication failed");
				}
			} catch (error) {
				console.error("🔴 Google One Tap error:", error);
				console.error("🔴 Error message:", error.message);
				console.error("🔴 Error stack:", error.stack);
				onError(`Authentication failed: ${error.message}`);
			} finally {
				setIsLoading(false);
				console.log("🔵 ===== CREDENTIAL RESPONSE DEBUG END =====");
			}
		};

		loadGoogleScript();

		return () => {
			console.log("🔵 ===== COMPONENT CLEANUP DEBUG =====");
			console.log("🔵 AutoGoogleOneTap cleanup triggered");
			console.log("🔵 Google available for cleanup:", !!window.google);
			console.log(
				"🔵 Google accounts available for cleanup:",
				!!window.google?.accounts
			);

			// Cleanup
			if (window.google && window.google.accounts) {
				console.log("🔵 Cancelling Google One Tap");
				window.google.accounts.id.cancel();
			} else {
				console.log("🔵 No Google cleanup needed");
			}
		};
	}, [isVisible, onSuccess, onError]);

	// Effect to render Google Sign-In button when fallback is shown
	useEffect(() => {
		if (showFallback && googleButtonRef.current && window.google) {
			console.log("🔵 Rendering fallback Google Sign-In button");
			googleButtonRef.current.innerHTML = "";

			window.google.accounts.id.renderButton(googleButtonRef.current, {
				theme: "outline",
				size: "large",
				type: "standard",
				text: "continue_with",
				shape: "rectangular",
				logo_alignment: "left",
				width: "100%", // Same as login page
			});
		}
	}, [showFallback]);

	if (!isVisible) return null;

	// If fallback is needed, show a Google Sign-In button
	if (showFallback) {
		return (
			<div className="fixed top-4 right-4 z-50">
				<div className="bg-white rounded-lg shadow-lg p-4 max-w-xs">
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-sm font-medium text-gray-900">Sign In</h3>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
							disabled={isLoading}
						>
							×
						</button>
					</div>
					<div ref={googleButtonRef} className="google-signin-button-container">
						{/* Google Sign-In button will be rendered here */}
					</div>
					{isLoading && (
						<div className="text-center py-2">
							<div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
							<p className="text-gray-600 mt-1 text-xs">Signing in...</p>
						</div>
					)}
				</div>

				<style>{`
					.google-signin-button-container {
						width: 100%;
						display: flex;
						justify-content: center;
					}

					.g_id_signin {
						width: 100% !important;
						display: flex !important;
						justify-content: center !important;
					}

					.g_id_signin iframe {
						width: 100% !important;
						min-height: 40px !important;
						border-radius: 4px !important;
					}
				`}</style>
			</div>
		);
	}

	// Native Google One Tap handles the account selection UI directly
	return null;
};

export default AutoGoogleOneTap;
