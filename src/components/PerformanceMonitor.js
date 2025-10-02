import { useEffect } from "react";
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

// Performance monitoring component
const PerformanceMonitor = () => {
	useEffect(() => {
		// Monitor Core Web Vitals
		const sendToAnalytics = (metric) => {
			// Send to Google Analytics if available
			if (typeof window !== "undefined" && window.gtag) {
				window.gtag("event", metric.name, {
					event_category: "Web Vitals",
					event_label: metric.id,
					value: Math.round(
						metric.name === "CLS" ? metric.value * 1000 : metric.value
					),
					non_interaction: true,
				});
			}

			// Send to Matomo if available
			if (typeof window !== "undefined" && window._mtm) {
				window._mtm.push({
					event: "web-vitals",
					"web-vitals-name": metric.name,
					"web-vitals-value": metric.value,
					"web-vitals-delta": metric.delta,
					"web-vitals-id": metric.id,
				});
			}

		};

		// Measure Core Web Vitals
		getCLS(sendToAnalytics);
		getFID(sendToAnalytics);
		getFCP(sendToAnalytics);
		getLCP(sendToAnalytics);
		getTTFB(sendToAnalytics);

		// Monitor long tasks (only in production or when explicitly enabled)
		if (
			"PerformanceObserver" in window &&
			(process.env.NODE_ENV === "production" ||
				process.env.REACT_APP_ENABLE_PERFORMANCE_DEBUG === "true")
		) {
			try {
				const longTaskObserver = new PerformanceObserver((list) => {
					for (const entry of list.getEntries()) {
						if (entry.duration > 50) {
							// Tasks longer than 50ms
							if (process.env.NODE_ENV === "development") {
							}

							// Send to analytics
							if (window.gtag) {
								window.gtag("event", "long_task", {
									event_category: "Performance",
									value: Math.round(entry.duration),
								});
							}
						}
					}
				});

				longTaskObserver.observe({ entryTypes: ["longtask"] });
			} catch (error) {
			}
		}

		// Monitor memory usage (if available)
		if ("memory" in performance) {
			const logMemoryUsage = () => {
				const memory = performance.memory;
				// Memory usage logging removed for production
			};

			// Log memory usage every 30 seconds
			const memoryInterval = setInterval(logMemoryUsage, 30000);

			return () => clearInterval(memoryInterval);
		}
	}, []);

	return null; // This component doesn't render anything
};

export default PerformanceMonitor;
