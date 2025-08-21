# Analytics Setup Documentation

This document explains how analytics tracking is set up in the CarbonCube application.

## Overview

The application uses two analytics platforms:

1. **Google Analytics 4** (GA4) - for general web analytics
2. **Matomo** - for privacy-focused analytics

## Setup

### 1. Google Analytics

- **Tracking ID**: `G-JCS1KWM0GH`
- **Location**: `frontend/public/index.html`
- **Component**: `frontend/src/components/GoogleAnalyticsTracker.js`

### 2. Matomo

- **Container ID**: `6Rza2oIF`
- **Domain**: `carboncubeke.matomo.cloud`
- **Location**: `frontend/public/index.html`
- **Component**: `frontend/src/components/MatomoTracker.js`

## Implementation

### HTML Level (index.html)

Both tracking scripts are loaded in the `<head>` section of `index.html`:

```html
<!-- Google Analytics -->
<script
	async
	src="https://www.googletagmanager.com/gtag/js?id=G-JCS1KWM0GH"
></script>
<script>
	window.dataLayer = window.dataLayer || [];
	function gtag() {
		dataLayer.push(arguments);
	}
	gtag("js", new Date());
	gtag("config", "G-JCS1KWM0GH");
</script>

<!-- Matomo Analytics -->
<script>
	var _mtm = (window._mtm = window._mtm || []);
	_mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
	var d = document,
		g = d.createElement("script"),
		s = d.getElementsByTagName("script")[0];
	g.async = true;
	g.src =
		"https://cdn.matomo.cloud/carboncubeke.matomo.cloud/container_6Rza2oIF.js";
	s.parentNode.insertBefore(g, s);
</script>
```

### React Level (App.js)

Tracking components are included in the main App component:

```jsx
import MatomoTracker from "./components/MatomoTracker";
import GoogleAnalyticsTracker from "./components/GoogleAnalyticsTracker";

function App() {
	return (
		<Router>
			{/* Analytics Tracking Components */}
			<MatomoTracker />
			<GoogleAnalyticsTracker />

			<Routes>{/* Your routes */}</Routes>
		</Router>
	);
}
```

## Usage

### Basic Tracking

The analytics utilities are available in `frontend/src/utils/analytics.js`:

```javascript
import {
	trackGAEvent,
	trackMatomoEvent,
	trackPageView,
	trackUserInteraction,
	trackFormSubmission,
	trackButtonClick,
} from "../utils/analytics";

// Track a button click
trackButtonClick("login_button", "/login");

// Track a form submission
trackFormSubmission("user_signup", true);

// Track a page view
trackPageView("Home Page", "/home");

// Track custom events
trackUserInteraction("product_view", "product_id_123");
```

### Event Tracking Examples

#### Login Events

```javascript
// In LoginForm.js
import { trackFormSubmission } from "../utils/analytics";

const handleLogin = async () => {
	try {
		// Login logic
		trackFormSubmission("user_login", true);
	} catch (error) {
		trackFormSubmission("user_login", false);
	}
};
```

#### Product Interactions

```javascript
// In AdDetails.js
import { trackUserInteraction } from "../utils/analytics";

const handleAddToWishlist = () => {
	trackUserInteraction("add_to_wishlist", `ad_${adId}`);
};

const handleRevealSeller = () => {
	trackUserInteraction("reveal_seller", `ad_${adId}`);
};
```

#### Navigation Events

```javascript
// Track navigation between pages
import { trackPageView } from "../utils/analytics";

useEffect(() => {
	trackPageView(document.title, window.location.pathname);
}, []);
```

## Privacy Considerations

### Google Analytics

- Uses cookies for tracking
- Collects user behavior data
- Subject to GDPR compliance
- Consider adding cookie consent banner

### Matomo

- Privacy-focused analytics
- Can be configured for GDPR compliance
- Offers data ownership
- Less invasive than Google Analytics

## Testing

### Verify Installation

1. Open browser developer tools
2. Check Network tab for requests to:
   - `googletagmanager.com`
   - `matomo.cloud`
3. Check Console for any errors

### Test Events

1. Navigate through the application
2. Perform actions (login, button clicks, etc.)
3. Check analytics dashboards for data

## Troubleshooting

### Common Issues

1. **Analytics not loading**

   - Check network connectivity
   - Verify tracking IDs are correct
   - Check for ad blockers

2. **Events not tracking**

   - Ensure tracking functions are called
   - Check browser console for errors
   - Verify analytics objects exist (`window.gtag`, `window._mtm`)

3. **Duplicate tracking**
   - Ensure tracking components are only mounted once
   - Check for multiple script inclusions

### Debug Mode

Enable debug logging by adding this to your component:

```javascript
// Debug Google Analytics
if (window.gtag) {
	window.gtag("config", "G-JCS1KWM0GH", {
		debug_mode: true,
	});
}

// Debug Matomo
if (window._mtm) {
	window._mtm.push({
		event: "debug",
		message: "Debug message",
	});
}
```

## Maintenance

### Regular Tasks

1. Monitor analytics data quality
2. Update tracking IDs if needed
3. Review privacy compliance
4. Clean up unused tracking code

### Updates

- Keep tracking libraries updated
- Monitor for deprecation notices
- Test tracking after major updates
