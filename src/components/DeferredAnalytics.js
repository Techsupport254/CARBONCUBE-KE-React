import { useEffect, useState } from "react";

// Deferred analytics loading to improve initial page load
const DeferredAnalytics = () => {
	const [analyticsLoaded, setAnalyticsLoaded] = useState(false);

	useEffect(() => {
		// Only load analytics after user interaction or after 3 seconds
		const loadAnalytics = () => {
			if (analyticsLoaded) return;

			// Skip analytics loading in development unless explicitly enabled
			if (
				process.env.NODE_ENV === "development" &&
				process.env.REACT_APP_ENABLE_ANALYTICS !== "true"
			) {
				return;
			}

			// Load Google Analytics
			if (typeof window !== "undefined" && !window.gtag) {
				const script = document.createElement("script");
				script.async = true;
				script.src = "https://www.googletagmanager.com/gtag/js?id=G-JCS1KWM0GH";
				script.onload = () => {
					window.dataLayer = window.dataLayer || [];
					function gtag() {
						window.dataLayer.push(arguments);
					}
					window.gtag = gtag;
					gtag("js", new Date());
					gtag("config", "G-JCS1KWM0GH");
				};
				script.onerror = () => {
					console.warn("Failed to load Google Analytics script");
				};
				document.head.appendChild(script);
			}

			// Load Matomo Analytics
			if (typeof window !== "undefined" && !window._mtm) {
				const _mtm = (window._mtm = window._mtm || []);
				_mtm.push({
					"mtm.startTime": new Date().getTime(),
					event: "mtm.Start",
				});

				const script = document.createElement("script");
				script.async = true;
				script.src =
					"https://cdn.matomo.cloud/carboncubeke.matomo.cloud/container_6Rza2oIF.js";
				script.onerror = () => {
					console.warn("Failed to load Matomo Analytics script");
				};
				document.head.appendChild(script);
			}

			setAnalyticsLoaded(true);
		};

		// Load analytics on user interaction
		const events = [
			"mousedown",
			"mousemove",
			"keypress",
			"scroll",
			"touchstart",
		];
		const loadOnInteraction = () => {
			loadAnalytics();
			events.forEach((event) => {
				document.removeEventListener(event, loadOnInteraction);
			});
		};

		// Add event listeners
		events.forEach((event) => {
			document.addEventListener(event, loadOnInteraction, { passive: true });
		});

		// Fallback: load after 3 seconds
		const timeout = setTimeout(loadAnalytics, 3000);

		return () => {
			clearTimeout(timeout);
			events.forEach((event) => {
				document.removeEventListener(event, loadOnInteraction);
			});
		};
	}, [analyticsLoaded]);

	return null; // This component doesn't render anything
};

export default DeferredAnalytics;
