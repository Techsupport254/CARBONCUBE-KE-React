/**
 * SEO Test Component
 * Displays current SEO configuration for debugging
 */

import React from "react";
import { useLocation } from "react-router-dom";
import {
	generatePageSEO,
	getCurrentPath,
	validateSEO,
} from "../utils/seoUtils";

const SEOTest = () => {
	const location = useLocation();
	const currentPath = getCurrentPath();

	// Generate SEO data for current page
	const seoData = generatePageSEO("home", {}, currentPath);
	const validation = validateSEO(seoData);

	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-2xl font-bold mb-6">SEO Configuration Test</h1>

				{/* Current Path Info */}
				<div className="bg-white p-4 rounded-lg shadow mb-6">
					<h2 className="text-lg font-semibold mb-3">
						Current Path Information
					</h2>
					<div className="space-y-2">
						<p>
							<strong>Location Pathname:</strong> {location.pathname}
						</p>
						<p>
							<strong>Normalized Path:</strong> {currentPath || "(root)"}
						</p>
						<p>
							<strong>Current URL:</strong> {window.location.href}
						</p>
					</div>
				</div>

				{/* SEO Data */}
				<div className="bg-white p-4 rounded-lg shadow mb-6">
					<h2 className="text-lg font-semibold mb-3">Generated SEO Data</h2>
					<div className="space-y-2">
						<p>
							<strong>Title:</strong> {seoData.title}
						</p>
						<p>
							<strong>Description:</strong> {seoData.description}
						</p>
						<p>
							<strong>Canonical URL:</strong> {seoData.canonical}
						</p>
						<p>
							<strong>Page URL:</strong> {seoData.url}
						</p>
					</div>
				</div>

				{/* Hreflang Links */}
				<div className="bg-white p-4 rounded-lg shadow mb-6">
					<h2 className="text-lg font-semibold mb-3">Hreflang Links</h2>
					<div className="space-y-1">
						{seoData.hreflang &&
							seoData.hreflang.map((link, index) => (
								<p key={index}>
									<strong>{link.hreflang}:</strong> {link.href}
								</p>
							))}
					</div>
				</div>

				{/* Validation Results */}
				<div className="bg-white p-4 rounded-lg shadow mb-6">
					<h2 className="text-lg font-semibold mb-3">SEO Validation</h2>
					<div className="space-y-2">
						<p
							className={`font-semibold ${
								validation.isValid ? "text-green-600" : "text-red-600"
							}`}
						>
							Status: {validation.isValid ? "Valid" : "Issues Found"}
						</p>

						{validation.issues.length > 0 && (
							<div>
								<h3 className="font-semibold text-red-600 mb-2">Issues:</h3>
								<ul className="list-disc list-inside space-y-1">
									{validation.issues.map((issue, index) => (
										<li key={index} className="text-red-600">
											{issue}
										</li>
									))}
								</ul>
							</div>
						)}

						{Object.keys(validation.fixes).length > 0 && (
							<div>
								<h3 className="font-semibold text-blue-600 mb-2">
									Applied Fixes:
								</h3>
								<ul className="list-disc list-inside space-y-1">
									{Object.entries(validation.fixes).map(([key, value]) => (
										<li key={key} className="text-blue-600">
											<strong>{key}:</strong> {value}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>

				{/* Meta Tags Preview */}
				<div className="bg-white p-4 rounded-lg shadow">
					<h2 className="text-lg font-semibold mb-3">Meta Tags Preview</h2>
					<div className="bg-gray-50 p-3 rounded text-sm font-mono">
						<div>&lt;title&gt;{seoData.title}&lt;/title&gt;</div>
						<div>
							&lt;meta name="description" content="{seoData.description}" /&gt;
						</div>
						<div>&lt;link rel="canonical" href="{seoData.canonical}" /&gt;</div>
						{seoData.hreflang &&
							seoData.hreflang.map((link, index) => (
								<div key={index}>
									&lt;link rel="{link.rel}" hreflang="{link.hreflang}" href="
									{link.href}" /&gt;
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SEOTest;
