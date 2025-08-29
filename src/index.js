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

// Track the visit for analytics at the root level
(() => {
	const fingerprint = getDeviceFingerprint();
	if (isInternalUser(fingerprint)) {
		// Skip tracking for whitelisted/internal users
		return;
	}

	sourceTrackingService
		.trackVisit()
		.then((result) => {
			// Source tracking completed silently
		})
		.catch((error) => {
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
