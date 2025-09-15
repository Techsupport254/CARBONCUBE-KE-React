import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SEOValidationTest = () => {
	const location = useLocation();
	const [seoData, setSeoData] = useState(null);
	const [validationResults, setValidationResults] = useState(null);
	const [metaTags, setMetaTags] = useState([]);

	useEffect(() => {
		// Extract SEO data from the current page
		const extractSEOData = () => {
			const title = document.title;
			const description =
				document.querySelector('meta[name="description"]')?.content || "";
			const keywords =
				document.querySelector('meta[name="keywords"]')?.content || "";
			const canonical =
				document.querySelector('link[rel="canonical"]')?.href || "";
			const ogTitle =
				document.querySelector('meta[property="og:title"]')?.content || "";
			const ogDescription =
				document.querySelector('meta[property="og:description"]')?.content ||
				"";
			const ogImage =
				document.querySelector('meta[property="og:image"]')?.content || "";
			const ogUrl =
				document.querySelector('meta[property="og:url"]')?.content || "";
			const twitterCard =
				document.querySelector('meta[name="twitter:card"]')?.content || "";
			const twitterTitle =
				document.querySelector('meta[name="twitter:title"]')?.content || "";
			const twitterDescription =
				document.querySelector('meta[name="twitter:description"]')?.content ||
				"";
			const twitterImage =
				document.querySelector('meta[name="twitter:image"]')?.content || "";

			// Extract hreflang links
			const hreflangLinks = Array.from(
				document.querySelectorAll("link[hreflang]")
			).map((link) => ({
				hreflang: link.getAttribute("hreflang"),
				href: link.getAttribute("href"),
			}));

			// Extract structured data
			const structuredDataScripts = Array.from(
				document.querySelectorAll('script[type="application/ld+json"]')
			);
			const structuredData = structuredDataScripts
				.map((script) => {
					try {
						return JSON.parse(script.textContent);
					} catch (e) {
						return null;
					}
				})
				.filter(Boolean);

			// Extract all meta tags
			const allMetaTags = Array.from(document.querySelectorAll("meta")).map(
				(meta) => ({
					name: meta.getAttribute("name") || meta.getAttribute("property"),
					content: meta.getAttribute("content"),
					httpEquiv: meta.getAttribute("http-equiv"),
				})
			);

			return {
				title,
				description,
				keywords,
				canonical,
				ogTitle,
				ogDescription,
				ogImage,
				ogUrl,
				twitterCard,
				twitterTitle,
				twitterDescription,
				twitterImage,
				hreflangLinks,
				structuredData,
				allMetaTags,
				currentUrl: window.location.href,
				pathname: location.pathname,
			};
		};

		const data = extractSEOData();
		setSeoData(data);
		setMetaTags(data.allMetaTags);

		// Validate SEO data
		const validateSEO = (data) => {
			const issues = [];
			const warnings = [];
			const recommendations = [];

			// Title validation
			if (!data.title) {
				issues.push("Missing page title");
			} else if (data.title.length < 30) {
				warnings.push(
					`Title too short (${data.title.length} chars, recommended: 30-60)`
				);
			} else if (data.title.length > 60) {
				warnings.push(
					`Title too long (${data.title.length} chars, recommended: 30-60)`
				);
			}

			// Description validation
			if (!data.description) {
				issues.push("Missing meta description");
			} else if (data.description.length < 120) {
				warnings.push(
					`Description too short (${data.description.length} chars, recommended: 120-160)`
				);
			} else if (data.description.length > 160) {
				warnings.push(
					`Description too long (${data.description.length} chars, recommended: 120-160)`
				);
			}

			// Canonical URL validation
			if (!data.canonical) {
				issues.push("Missing canonical URL");
			} else if (!data.canonical.startsWith("https://carboncube-ke.com")) {
				issues.push("Canonical URL doesn't match domain");
			}

			// Open Graph validation
			if (!data.ogTitle) warnings.push("Missing Open Graph title");
			if (!data.ogDescription) warnings.push("Missing Open Graph description");
			if (!data.ogImage) warnings.push("Missing Open Graph image");
			if (!data.ogUrl) warnings.push("Missing Open Graph URL");

			// Twitter Card validation
			if (!data.twitterCard) warnings.push("Missing Twitter Card type");
			if (!data.twitterTitle) warnings.push("Missing Twitter title");
			if (!data.twitterDescription)
				warnings.push("Missing Twitter description");
			if (!data.twitterImage) warnings.push("Missing Twitter image");

			// Hreflang validation
			if (data.hreflangLinks.length === 0) {
				warnings.push("No hreflang links found");
			} else {
				const hasDefault = data.hreflangLinks.some(
					(link) => link.hreflang === "x-default"
				);
				if (!hasDefault) {
					recommendations.push("Consider adding x-default hreflang");
				}
			}

			// Structured data validation
			if (data.structuredData.length === 0) {
				warnings.push("No structured data found");
			} else {
				const hasOrganization = data.structuredData.some(
					(data) => data["@type"] === "Organization"
				);
				if (!hasOrganization) {
					recommendations.push("Consider adding Organization structured data");
				}
			}

			// Keywords validation
			if (!data.keywords) {
				warnings.push("No keywords meta tag");
			}

			return {
				issues,
				warnings,
				recommendations,
				score: Math.max(
					0,
					100 -
						issues.length * 20 -
						warnings.length * 5 -
						recommendations.length * 2
				),
			};
		};

		const validation = validateSEO(data);
		setValidationResults(validation);
	}, [location]);

	const getScoreColor = (score) => {
		if (score >= 90) return "text-green-600";
		if (score >= 70) return "text-yellow-600";
		return "text-red-600";
	};

	const getScoreBgColor = (score) => {
		if (score >= 90) return "bg-green-100";
		if (score >= 70) return "bg-yellow-100";
		return "bg-red-100";
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<Helmet>
				<title>SEO Validation Test | Carbon Cube Kenya</title>
				<meta
					name="description"
					content="Test and validate SEO implementation for Carbon Cube Kenya"
				/>
				<meta name="robots" content="noindex, nofollow" />
			</Helmet>

			<div className="max-w-6xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						SEO Validation Test
					</h1>
					<p className="text-gray-600">
						Comprehensive SEO analysis for Carbon Cube Kenya
					</p>

					{validationResults && (
						<div
							className={`mt-4 p-4 rounded-lg ${getScoreBgColor(
								validationResults.score
							)}`}
						>
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">SEO Score</h2>
								<span
									className={`text-3xl font-bold ${getScoreColor(
										validationResults.score
									)}`}
								>
									{validationResults.score}/100
								</span>
							</div>
						</div>
					)}
				</div>

				{seoData && (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Basic SEO Data */}
						<div className="bg-white rounded-lg shadow p-6">
							<h2 className="text-xl font-semibold mb-4">Basic SEO Data</h2>
							<div className="space-y-3">
								<div>
									<strong>Title:</strong>
									<p className="text-sm text-gray-600 break-words">
										{seoData.title}
									</p>
									<p className="text-xs text-gray-500">
										Length: {seoData.title?.length || 0} characters
									</p>
								</div>
								<div>
									<strong>Description:</strong>
									<p className="text-sm text-gray-600 break-words">
										{seoData.description}
									</p>
									<p className="text-xs text-gray-500">
										Length: {seoData.description?.length || 0} characters
									</p>
								</div>
								<div>
									<strong>Keywords:</strong>
									<p className="text-sm text-gray-600 break-words">
										{seoData.keywords}
									</p>
								</div>
								<div>
									<strong>Canonical URL:</strong>
									<p className="text-sm text-gray-600 break-words">
										{seoData.canonical}
									</p>
								</div>
								<div>
									<strong>Current URL:</strong>
									<p className="text-sm text-gray-600 break-words">
										{seoData.currentUrl}
									</p>
								</div>
							</div>
						</div>

						{/* Social Media Meta Tags */}
						<div className="bg-white rounded-lg shadow p-6">
							<h2 className="text-xl font-semibold mb-4">
								Social Media Meta Tags
							</h2>
							<div className="space-y-3">
								<div>
									<strong>Open Graph Title:</strong>
									<p className="text-sm text-gray-600 break-words">
										{seoData.ogTitle}
									</p>
								</div>
								<div>
									<strong>Open Graph Description:</strong>
									<p className="text-sm text-gray-600 break-words">
										{seoData.ogDescription}
									</p>
								</div>
								<div>
									<strong>Open Graph Image:</strong>
									<p className="text-sm text-gray-600 break-words">
										{seoData.ogImage}
									</p>
								</div>
								<div>
									<strong>Open Graph URL:</strong>
									<p className="text-sm text-gray-600 break-words">
										{seoData.ogUrl}
									</p>
								</div>
								<div>
									<strong>Twitter Card:</strong>
									<p className="text-sm text-gray-600">{seoData.twitterCard}</p>
								</div>
							</div>
						</div>

						{/* Hreflang Links */}
						<div className="bg-white rounded-lg shadow p-6">
							<h2 className="text-xl font-semibold mb-4">Hreflang Links</h2>
							{seoData.hreflangLinks.length > 0 ? (
								<div className="space-y-2">
									{seoData.hreflangLinks.map((link, index) => (
										<div
											key={index}
											className="flex justify-between items-center p-2 bg-gray-50 rounded"
										>
											<span className="font-medium">{link.hreflang}</span>
											<span className="text-sm text-gray-600 break-words">
												{link.href}
											</span>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-500">No hreflang links found</p>
							)}
						</div>

						{/* Structured Data */}
						<div className="bg-white rounded-lg shadow p-6">
							<h2 className="text-xl font-semibold mb-4">Structured Data</h2>
							{seoData.structuredData.length > 0 ? (
								<div className="space-y-3">
									{seoData.structuredData.map((data, index) => (
										<div key={index} className="p-3 bg-gray-50 rounded">
											<strong>Type:</strong> {data["@type"]}
											{data.name && (
												<div>
													<strong>Name:</strong> {data.name}
												</div>
											)}
											{data.description && (
												<div>
													<strong>Description:</strong> {data.description}
												</div>
											)}
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-500">No structured data found</p>
							)}
						</div>
					</div>
				)}

				{/* Validation Results */}
				{validationResults && (
					<div className="mt-6 bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">Validation Results</h2>

						{validationResults.issues.length > 0 && (
							<div className="mb-4">
								<h3 className="text-lg font-medium text-red-600 mb-2">
									Issues ({validationResults.issues.length})
								</h3>
								<ul className="list-disc list-inside space-y-1">
									{validationResults.issues.map((issue, index) => (
										<li key={index} className="text-red-600">
											{issue}
										</li>
									))}
								</ul>
							</div>
						)}

						{validationResults.warnings.length > 0 && (
							<div className="mb-4">
								<h3 className="text-lg font-medium text-yellow-600 mb-2">
									Warnings ({validationResults.warnings.length})
								</h3>
								<ul className="list-disc list-inside space-y-1">
									{validationResults.warnings.map((warning, index) => (
										<li key={index} className="text-yellow-600">
											{warning}
										</li>
									))}
								</ul>
							</div>
						)}

						{validationResults.recommendations.length > 0 && (
							<div className="mb-4">
								<h3 className="text-lg font-medium text-blue-600 mb-2">
									Recommendations ({validationResults.recommendations.length})
								</h3>
								<ul className="list-disc list-inside space-y-1">
									{validationResults.recommendations.map((rec, index) => (
										<li key={index} className="text-blue-600">
											{rec}
										</li>
									))}
								</ul>
							</div>
						)}

						{validationResults.issues.length === 0 &&
							validationResults.warnings.length === 0 &&
							validationResults.recommendations.length === 0 && (
								<div className="text-green-600 font-medium">
									✅ All SEO checks passed! Your page is well optimized.
								</div>
							)}
					</div>
				)}

				{/* All Meta Tags */}
				<div className="mt-6 bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-semibold mb-4">
						All Meta Tags ({metaTags.length})
					</h2>
					<div className="max-h-96 overflow-y-auto">
						<div className="space-y-2">
							{metaTags.map((tag, index) => (
								<div
									key={index}
									className="flex justify-between items-start p-2 bg-gray-50 rounded text-sm"
								>
									<div className="flex-1">
										<strong>{tag.name || tag.httpEquiv}:</strong>
									</div>
									<div className="flex-2 text-gray-600 break-words ml-2">
										{tag.content}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SEOValidationTest;
