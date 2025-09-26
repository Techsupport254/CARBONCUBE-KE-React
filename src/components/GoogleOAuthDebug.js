import React, { useState } from "react";
import googleOAuthService from "../services/googleOAuthService";

const GoogleOAuthDebug = () => {
	const [debugInfo, setDebugInfo] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const addDebugInfo = (message) => {
		setDebugInfo(
			(prev) => prev + "\n" + new Date().toLocaleTimeString() + ": " + message
		);
	};

	const testGoogleOAuth = async () => {
		setIsLoading(true);
		setDebugInfo("Starting Google OAuth test...");

		try {
			// Test environment variables
			addDebugInfo("Environment Variables:");
			addDebugInfo(
				`REACT_APP_GOOGLE_CLIENT_ID: ${
					process.env.REACT_APP_GOOGLE_CLIENT_ID ? "Set" : "Missing"
				}`
			);
			addDebugInfo(
				`REACT_APP_BACKEND_URL: ${
					process.env.REACT_APP_BACKEND_URL ? "Set" : "Missing"
				}`
			);
			addDebugInfo(
				`REACT_APP_GOOGLE_REDIRECT_URI: ${
					process.env.REACT_APP_GOOGLE_REDIRECT_URI ? "Set" : "Missing"
				}`
			);

			// Test GSI loading
			addDebugInfo("Testing GSI loading...");
			await googleOAuthService.initializeGsi();
			addDebugInfo("GSI loaded successfully");

			// Test Google object
			if (window.google && window.google.accounts) {
				addDebugInfo("Google Identity Services is available");
			} else {
				addDebugInfo("❌ Google Identity Services not available");
			}

			// Test popup blocker
			const testPopup = window.open("", "test", "width=100,height=100");
			if (testPopup) {
				addDebugInfo("✅ Popup allowed by browser");
				testPopup.close();
			} else {
				addDebugInfo("❌ Popup blocked by browser");
			}
		} catch (error) {
			addDebugInfo(`❌ Error: ${error.message}`);
		} finally {
			setIsLoading(false);
		}
	};

	const testGoogleSignIn = async () => {
		setIsLoading(true);
		addDebugInfo("Testing Google Sign-In...");

		googleOAuthService.setCallbacks(
			(token, user) => {
				addDebugInfo("✅ Sign-in successful!");
				addDebugInfo(`Token: ${token.substring(0, 20)}...`);
				addDebugInfo(`User: ${JSON.stringify(user)}`);
				setIsLoading(false);
			},
			(error) => {
				addDebugInfo(`❌ Sign-in failed: ${error}`);
				setIsLoading(false);
			}
		);

		try {
			await googleOAuthService.initiateAuth("buyer");
		} catch (error) {
			addDebugInfo(`❌ Initiate auth failed: ${error.message}`);
			setIsLoading(false);
		}
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h2 className="text-2xl font-bold mb-4">Google OAuth Debug</h2>

			<div className="space-y-4">
				<button
					onClick={testGoogleOAuth}
					disabled={isLoading}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
				>
					Test Environment & GSI
				</button>

				<button
					onClick={testGoogleSignIn}
					disabled={isLoading}
					className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
				>
					Test Google Sign-In
				</button>

				<button
					onClick={() => setDebugInfo("")}
					className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
				>
					Clear Log
				</button>
			</div>

			<div className="mt-6">
				<h3 className="text-lg font-semibold mb-2">Debug Log:</h3>
				<pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96 whitespace-pre-wrap">
					{debugInfo || "No debug information yet..."}
				</pre>
			</div>
		</div>
	);
};

export default GoogleOAuthDebug;
