import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import sourceTrackingService from "./utils/sourceTracking";
import {
	getDeviceFingerprint,
	isInternalUser,
} from "./utils/deviceFingerprint";

// Track the visit for analytics at the root level (respect backend exclusion)
(async () => {
	const fingerprint = getDeviceFingerprint();
	const API_URL = process.env.REACT_APP_BACKEND_URL || "/api";

	// Only rely on backend exclusion for visit tracking
	let isExcluded = false;
	try {
		const deviceId = fingerprint.hash;
		const resp = await fetch(
			`${API_URL}/internal_user_exclusions/check/${deviceId}`
		);
		if (resp.ok) {
			const data = await resp.json();
			if ((data && data.status === "approved") || data?.is_excluded === true) {
				isExcluded = true;
			}
		}
	} catch (e) {
		// Ignore network errors and proceed with tracking by default
	}

	if (isExcluded) {
		return;
	}

	sourceTrackingService.trackVisit().catch((error) => {
		console.error("Source tracking failed:", error);
	});
})();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
