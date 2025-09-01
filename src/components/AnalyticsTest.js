import React, { useState } from "react";
import {
	trackGAEvent,
	trackMatomoEvent,
	trackPageView,
	trackUserInteraction,
	trackFormSubmission,
	trackButtonClick,
} from "../utils/analytics";

export default function AnalyticsTest() {
	const [testResults, setTestResults] = useState([]);
	const [formData, setFormData] = useState({ name: "", email: "" });

	const addTestResult = (test, status, details = "") => {
		const result = {
			id: Date.now(),
			test,
			status,
			details,
			timestamp: new Date().toLocaleTimeString(),
		};
		setTestResults((prev) => [result, ...prev]);
	};

	const testGoogleAnalytics = () => {
		try {
			if (window.gtag) {
				trackGAEvent("test_event", "Analytics Test", "GA Test Button", 1);
				addTestResult("Google Analytics", "SUCCESS", "Event sent to GA");
			} else {
				addTestResult("Google Analytics", "❌ FAILED", "gtag not found");
			}
		} catch (error) {
			addTestResult("Google Analytics", "❌ ERROR", error.message);
		}
	};

	const testMatomo = () => {
		try {
			if (window._mtm) {
				trackMatomoEvent(
					"Analytics Test",
					"test_event",
					"Matomo Test Button",
					1
				);
				addTestResult("Matomo", "SUCCESS", "Event sent to Matomo");
			} else {
				addTestResult("Matomo", "❌ FAILED", "_mtm not found");
			}
		} catch (error) {
			addTestResult("Matomo", "❌ ERROR", error.message);
		}
	};

	const testPageView = () => {
		try {
			trackPageView("Analytics Test Page", "/analytics-test");
			addTestResult("Page View", "SUCCESS", "Page view tracked");
		} catch (error) {
			addTestResult("Page View", "❌ ERROR", error.message);
		}
	};

	const testUserInteraction = () => {
		try {
			trackUserInteraction(
				"test_interaction",
				"Test interaction from test component"
			);
			addTestResult("User Interaction", "SUCCESS", "Interaction tracked");
		} catch (error) {
			addTestResult("User Interaction", "❌ ERROR", error.message);
		}
	};

	const testButtonClick = () => {
		try {
			trackButtonClick("test_button", "/analytics-test");
			addTestResult("Button Click", "SUCCESS", "Button click tracked");
		} catch (error) {
			addTestResult("Button Click", "❌ ERROR", error.message);
		}
	};

	const testFormSubmission = () => {
		try {
			trackFormSubmission("test_form", true);
			addTestResult("Form Submission", "SUCCESS", "Form submission tracked");
		} catch (error) {
			addTestResult("Form Submission", "❌ ERROR", error.message);
		}
	};

	const testAll = () => {
		testGoogleAnalytics();
		setTimeout(() => testMatomo(), 500);
		setTimeout(() => testPageView(), 1000);
		setTimeout(() => testUserInteraction(), 1500);
		setTimeout(() => testButtonClick(), 2000);
		setTimeout(() => testFormSubmission(), 2500);
	};

	const clearResults = () => {
		setTestResults([]);
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		testFormSubmission();
		setFormData({ name: "", email: "" });
	};

	return (
		<div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
			<h1>Analytics Tracking Test</h1>

			<div style={{ marginBottom: "20px" }}>
				<h3>Test Controls</h3>
				<div
					style={{
						display: "flex",
						gap: "10px",
						flexWrap: "wrap",
						marginBottom: "20px",
					}}
				>
					<button
						onClick={testGoogleAnalytics}
						style={{
							padding: "10px",
							backgroundColor: "#4285f4",
							color: "white",
							border: "none",
							borderRadius: "5px",
						}}
					>
						Test Google Analytics
					</button>
					<button
						onClick={testMatomo}
						style={{
							padding: "10px",
							backgroundColor: "#ff6b35",
							color: "white",
							border: "none",
							borderRadius: "5px",
						}}
					>
						Test Matomo
					</button>
					<button
						onClick={testPageView}
						style={{
							padding: "10px",
							backgroundColor: "#34a853",
							color: "white",
							border: "none",
							borderRadius: "5px",
						}}
					>
						Test Page View
					</button>
					<button
						onClick={testUserInteraction}
						style={{
							padding: "10px",
							backgroundColor: "#ea4335",
							color: "white",
							border: "none",
							borderRadius: "5px",
						}}
					>
						Test User Interaction
					</button>
					<button
						onClick={testButtonClick}
						style={{
							padding: "10px",
							backgroundColor: "#fbbc04",
							color: "white",
							border: "none",
							borderRadius: "5px",
						}}
					>
						Test Button Click
					</button>
					<button
						onClick={testFormSubmission}
						style={{
							padding: "10px",
							backgroundColor: "#9c27b0",
							color: "white",
							border: "none",
							borderRadius: "5px",
						}}
					>
						Test Form Submission
					</button>
					<button
						onClick={testAll}
						style={{
							padding: "10px",
							backgroundColor: "#000",
							color: "white",
							border: "none",
							borderRadius: "5px",
						}}
					>
						Test All
					</button>
					<button
						onClick={clearResults}
						style={{
							padding: "10px",
							backgroundColor: "#666",
							color: "white",
							border: "none",
							borderRadius: "5px",
						}}
					>
						Clear Results
					</button>
				</div>
			</div>

			<div style={{ marginBottom: "20px" }}>
				<h3>Test Form</h3>
				<form
					onSubmit={handleFormSubmit}
					style={{ display: "flex", gap: "10px", alignItems: "center" }}
				>
					<input
						type="text"
						placeholder="Name"
						value={formData.name}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, name: e.target.value }))
						}
						style={{
							padding: "8px",
							border: "1px solid #ccc",
							borderRadius: "4px",
						}}
					/>
					<input
						type="email"
						placeholder="Email"
						value={formData.email}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, email: e.target.value }))
						}
						style={{
							padding: "8px",
							border: "1px solid #ccc",
							borderRadius: "4px",
						}}
					/>
					<button
						type="submit"
						style={{
							padding: "8px 16px",
							backgroundColor: "#007bff",
							color: "white",
							border: "none",
							borderRadius: "4px",
						}}
					>
						Submit Form
					</button>
				</form>
			</div>

			<div style={{ marginBottom: "20px" }}>
				<h3>Analytics Status</h3>
				<div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
					<div>
						<strong>Google Analytics:</strong>
						<span
							style={{
								color: window.gtag ? "green" : "red",
								marginLeft: "5px",
							}}
						>
							{window.gtag ? "Loaded" : "❌ Not Loaded"}
						</span>
					</div>
					<div>
						<strong>Matomo:</strong>
						<span
							style={{
								color: window._mtm ? "green" : "red",
								marginLeft: "5px",
							}}
						>
							{window._mtm ? "Loaded" : "❌ Not Loaded"}
						</span>
					</div>
				</div>
			</div>

			<div>
				<h3>Test Results</h3>
				<div
					style={{
						maxHeight: "400px",
						overflowY: "auto",
						border: "1px solid #ccc",
						padding: "10px",
						borderRadius: "5px",
					}}
				>
					{testResults.length === 0 ? (
						<p style={{ color: "#666", fontStyle: "italic" }}>
							No test results yet. Click a test button above.
						</p>
					) : (
						testResults.map((result) => (
							<div
								key={result.id}
								style={{
									padding: "8px",
									marginBottom: "5px",
									backgroundColor: result.status.includes("SUCCESS")
										? "#d4edda"
										: "#f8d7da",
									border: `1px solid ${
										result.status.includes("SUCCESS") ? "#c3e6cb" : "#f5c6cb"
									}`,
									borderRadius: "4px",
								}}
							>
								<div style={{ fontWeight: "bold" }}>{result.test}</div>
								<div
									style={{
										color: result.status.includes("SUCCESS")
											? "#155724"
											: "#721c24",
									}}
								>
									{result.status} - {result.details}
								</div>
								<div style={{ fontSize: "12px", color: "#666" }}>
									{result.timestamp}
								</div>
							</div>
						))
					)}
				</div>
			</div>

			<div
				style={{
					marginTop: "20px",
					padding: "15px",
					backgroundColor: "#f8f9fa",
					borderRadius: "5px",
				}}
			>
				<h4>How to Verify Tracking:</h4>
				<ol>
					<li>
						<strong>Google Analytics:</strong> Go to GA4 dashboard → Reports →
						Realtime → Events
					</li>
					<li>
						<strong>Matomo:</strong> Go to Matomo dashboard → Real-time → Live
					</li>
					<li>
						<strong>Browser Console:</strong> Open DevTools → Console to see any
						errors
					</li>
					<li>
						<strong>Network Tab:</strong> Check for requests to
						googletagmanager.com and matomo.cloud
					</li>
				</ol>
			</div>
		</div>
	);
}
