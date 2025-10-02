import React, { useState, useEffect } from "react";
import googleOAuthService from "../services/googleOAuthService";

const GoogleAuthTest = () => {
	const [authStatus, setAuthStatus] = useState("Not started");
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);

	useEffect(() => {
		// Check if we're returning from Google OAuth
		const urlParams = new URLSearchParams(window.location.search);
		const hasCode = urlParams.has("code");
		const hasToken = urlParams.has("token");
		const hasUser = urlParams.has("user");
		const success = urlParams.get("success");

		if (hasCode) {
			setAuthStatus("Returned from Google with code");
		} else if (hasToken && hasUser && success === "true") {
			setAuthStatus("Authentication successful!");
			setToken(urlParams.get("token"));
			setUser(JSON.parse(decodeURIComponent(urlParams.get("user"))));
		} else if (urlParams.has("error")) {
			setAuthStatus("Authentication failed: " + urlParams.get("error"));
		}
	}, []);

	const testGoogleAuth = () => {
		setAuthStatus("Starting Google authentication...");

		// Set up callbacks
		googleOAuthService.setCallbacks(
			(token, user) => {
				setAuthStatus("Authentication successful!");
				setToken(token);
				setUser(user);
			},
			(error) => {
				setAuthStatus("Authentication failed: " + error);
			}
		);

		// Start authentication
		googleOAuthService.initiateAuth("buyer");
	};

	const clearAuth = () => {
		setAuthStatus("Not started");
		setUser(null);
		setToken(null);
		googleOAuthService.clearUrlParams();
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h2 className="text-2xl font-bold mb-4">
				Google OAuth Authentication Test
			</h2>

			<div className="space-y-4">
				<div className="p-4 bg-gray-100 rounded">
					<h3 className="font-semibold mb-2">Current Status:</h3>
					<p className="text-sm">{authStatus}</p>
				</div>

				{user && (
					<div className="p-4 bg-green-100 rounded">
						<h3 className="font-semibold mb-2">User Information:</h3>
						<pre className="text-sm overflow-auto">
							{JSON.stringify(user, null, 2)}
						</pre>
					</div>
				)}

				{token && (
					<div className="p-4 bg-blue-100 rounded">
						<h3 className="font-semibold mb-2">Token:</h3>
						<p className="text-sm break-all">{token.substring(0, 50)}...</p>
					</div>
				)}

				<div className="flex space-x-4">
					<button
						onClick={testGoogleAuth}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Test Google Authentication
					</button>

					<button
						onClick={clearAuth}
						className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
					>
						Clear
					</button>
				</div>

				<div className="p-4 bg-yellow-100 rounded">
					<h3 className="font-semibold mb-2">Instructions:</h3>
					<ol className="text-sm list-decimal list-inside space-y-1">
						<li>Click "Test Google Authentication"</li>
						<li>You should be redirected to Google's OAuth page</li>
						<li>Sign in with your Google account</li>
						<li>You should be redirected back with authentication data</li>
						<li>Check the status and user information above</li>
					</ol>
				</div>
			</div>
		</div>
	);
};

export default GoogleAuthTest;
