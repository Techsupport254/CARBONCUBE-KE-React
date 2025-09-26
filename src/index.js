import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";

// Suppress React DevTools warning in development
if (process.env.NODE_ENV === "development") {
	const originalConsoleWarn = console.warn;
	console.warn = (...args) => {
		if (
			args[0] &&
			args[0].includes &&
			args[0].includes("Download the React DevTools")
		) {
			return;
		}
		originalConsoleWarn.apply(console, args);
	};
}

// Performance monitoring
const reportWebVitalsWithDetails = (metric) => {
	// Send to analytics if metric is defined
	if (metric) {
		reportWebVitals(metric);
	}
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// Performance monitoring with detailed reporting
reportWebVitalsWithDetails();
