import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";

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
