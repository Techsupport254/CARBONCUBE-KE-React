import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const GoogleOneTap = ({
	onSuccess,
	onError,
	className = "",
	disabled = false,
}) => {
	const googleButtonRef = useRef(null);
	const isInitialized = useRef(false);

	useEffect(() => {
		// Load Google Identity Services script
		const loadGoogleScript = () => {
			if (window.google) {
				initializeGoogleOneTap();
				return;
			}

			const script = document.createElement("script");
			script.src = "https://accounts.google.com/gsi/client";
			script.async = true;
			script.defer = true;
			script.onload = initializeGoogleOneTap;
			document.head.appendChild(script);
		};

		const initializeGoogleOneTap = () => {
			if (isInitialized.current || !window.google) return;

			try {
				window.google.accounts.id.initialize({
					client_id:
						process.env.REACT_APP_GOOGLE_CLIENT_ID ||
						"810251363291-gk0b9ddj0b7ij75rpkkgiigfhdmq7q8e.apps.googleusercontent.com",
					callback: handleCredentialResponse,
					auto_select: false,
					cancel_on_tap_outside: true,
					// Make it less intrusive
					ux_mode: "popup",
					itp_support: true,
				});

				// Don't automatically show the prompt - let user click the button
				// This prevents blocking the page interaction
				renderFallbackButton();

				isInitialized.current = true;
			} catch (error) {
				console.error("Error initializing Google One Tap:", error);
				renderFallbackButton();
			}
		};

		const handleCredentialResponse = async (response) => {
			try {
				console.log("Google One Tap response:", response);

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

				const result = await backendResponse.json();

				if (result.success) {
					onSuccess(result.token, result.user);
				} else {
					onError(result.error || "Authentication failed");
				}
			} catch (error) {
				console.error("Google One Tap error:", error);
				onError("Authentication failed");
			}
		};

		const renderFallbackButton = () => {
			if (googleButtonRef.current && window.google) {
				// Clear any existing content
				googleButtonRef.current.innerHTML = "";

				window.google.accounts.id.renderButton(googleButtonRef.current, {
					theme: "outline",
					size: "large",
					type: "standard",
					text: "continue_with",
					shape: "rectangular",
					logo_alignment: "left",
					width: "100%",
				});
			}
		};

		loadGoogleScript();

		return () => {
			// Cleanup
			if (window.google && window.google.accounts) {
				window.google.accounts.id.cancel();
			}
		};
	}, [onSuccess, onError]);

	const handleFallbackClick = () => {
		if (disabled) return;

		// Trigger the popup manually when user clicks
		if (window.google && window.google.accounts) {
			window.google.accounts.id.prompt((notification) => {
				console.log("Google One Tap prompt notification:", notification);
				// If the prompt is not displayed, fall back to the button
				if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
					console.log("One Tap not displayed, using fallback button");
				}
			});
		}
	};

	return (
		<div className={`google-one-tap-container ${className}`}>
			{/* One Tap will render automatically */}
			<div ref={googleButtonRef} className="google-signin-button-container">
				{/* Google's button will be rendered here */}
			</div>

			<style jsx>{`
				.google-one-tap-container {
					width: 100%;
				}

				.google-signin-button-container {
					width: 100%;
					display: flex;
					justify-content: center;
				}

				/* Google One Tap styling */
				:global(.g_id_signin) {
					width: 100% !important;
					display: flex !important;
					justify-content: center !important;
				}

				:global(.g_id_signin iframe) {
					width: 100% !important;
					min-height: 48px !important;
					border-radius: 8px !important;
				}
			`}</style>
		</div>
	);
};

export default GoogleOneTap;
