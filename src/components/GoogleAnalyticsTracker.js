import React from "react";

export default function GoogleAnalyticsTracker() {
	React.useEffect(() => {
		// Google Analytics is already loaded in index.html
		// This component can be used for additional GA tracking if needed
		if (window.gtag) {
			// You can add custom events here
			window.gtag("config", "G-JCS1KWM0GH");
		}
	}, []);

	return null; // This component doesn't render anything
}
