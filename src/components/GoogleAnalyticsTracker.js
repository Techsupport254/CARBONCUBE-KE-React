import React from "react";

export default function GoogleAnalyticsTracker() {
	React.useEffect(() => {
		// Check if Google Analytics is available (not blocked by ad blocker)
		if (window.gtag) {
			try {
				// You can add custom events here
				window.gtag("config", "G-JCS1KWM0GH");
			} catch (error) {
				// Google Analytics tracking disabled (likely blocked by ad blocker)
			}
		} else {
			// Google Analytics not available (likely blocked by ad blocker)
		}
	}, []);

	return null; // This component doesn't render anything
}
