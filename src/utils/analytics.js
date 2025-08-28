// Analytics utility functions for tracking events

// Google Analytics tracking
export const trackGAEvent = (action, category, label, value) => {
	if (window.gtag) {
		window.gtag("event", action, {
			event_category: category,
			event_label: label,
			value: value,
		});
	}
};

// Matomo tracking
export const trackMatomoEvent = (category, action, name, value) => {
	if (window._mtm) {
		window._mtm.push({
			event: "custom",
			category: category,
			action: action,
			name: name,
			value: value,
		});
	}
};

// Track page views
export const trackPageView = (pageTitle, pageUrl) => {
	// Google Analytics page view
	if (window.gtag) {
		window.gtag("config", "G-JCS1KWM0GH", {
			page_title: pageTitle,
			page_location: pageUrl,
		});
	}

	// Matomo page view
	if (window._mtm) {
		window._mtm.push({
			event: "page_view",
			page_title: pageTitle,
			page_url: pageUrl,
		});
	}
};

// Track user interactions
export const trackUserInteraction = (interactionType, details) => {
	trackGAEvent(interactionType, "User Interaction", details);
	trackMatomoEvent("User Interaction", interactionType, details);
};

// Track form submissions
export const trackFormSubmission = (formName, success = true) => {
	const action = success ? "form_submit_success" : "form_submit_error";
	trackGAEvent(action, "Form", formName);
	trackMatomoEvent("Form", action, formName);
};

// Track button clicks
export const trackButtonClick = (buttonName, pageLocation) => {
	trackGAEvent("button_click", "Button", buttonName, 1);
	trackMatomoEvent("Button", "click", buttonName);
};
