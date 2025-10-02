/**
 * SEO Validation Script
 * Comprehensive validation of SEO implementation
 */

import {
	generatePageSEO,
	validateSEO,
	getCanonicalUrl,
	getHreflangLinks,
} from "./seoUtils";

/**
 * Test all SEO configurations
 */
export const runSEOValidation = () => {
	const tests = [
		{
			name: "Home Page SEO",
			pageType: "home",
			data: {},
			path: "",
		},
		{
			name: "Product Page SEO",
			pageType: "product",
			data: {
				title: "Test Product",
				price: "1000",
				id: "test-product-123",
			},
			path: "ads/test-product-123",
		},
		{
			name: "Shop Page SEO",
			pageType: "shop",
			data: {
				name: "Test Shop",
				id: "test-shop-456",
			},
			path: "shop/test-shop-456",
		},
		{
			name: "Category Page SEO",
			pageType: "category",
			data: {
				name: "Test Category",
				count: 50,
			},
			path: "categories/test-category",
		},
	];

	const results = {
		passed: 0,
		failed: 0,
		issues: [],
		warnings: [],
	};

	tests.forEach((test) => {
		try {
			// Generate SEO data
			const seoData = generatePageSEO(test.pageType, test.data, test.path);

			// Validate SEO
			const validation = validateSEO(seoData);

			// Check specific issues
			const testIssues = [];

			// Check canonical URL format
			if (!seoData.canonical.startsWith("https://carboncube-ke.com")) {
				testIssues.push("Canonical URL doesn't start with correct domain");
			}

			// Check for /home in canonical URL
			if (seoData.canonical.includes("/home")) {
				testIssues.push(
					"Canonical URL contains /home (duplicate content issue)"
				);
			}

			// Check hreflang format
			if (seoData.hreflang) {
				seoData.hreflang.forEach((link) => {
					if (link.hreflang && link.hreflang.includes("_")) {
						testIssues.push(
							`Invalid hreflang format: ${link.hreflang} (should use hyphens)`
						);
					}
				});
			}

			// Combine all issues
			const allIssues = [...validation.issues, ...testIssues];

			if (allIssues.length === 0) {
				results.passed++;
			} else {
				results.failed++;
				results.issues.push({
					test: test.name,
					issues: allIssues,
				});
			}

			// Display results

			if (seoData.hreflang) {
				seoData.hreflang.forEach((link) => {});
			}

			if (allIssues.length > 0) {
				allIssues.forEach((issue) => {});
			}
		} catch (error) {
			results.failed++;
			results.issues.push({
				test: test.name,
				issues: [`Error: ${error.message}`],
			});
		}
	});

	// Summary

	if (results.issues.length > 0) {
		results.issues.forEach((testResult) => {});
	}

	return results;
};

/**
 * Test specific SEO fixes
 */
export const testSEOFixes = () => {
	// Test 1: Hreflang format fix
	const hreflangLinks = getHreflangLinks("");
	const hasValidHreflang = hreflangLinks.every(
		(link) => !link.hreflang.includes("_") || link.hreflang === "x-default"
	);

	// Test 2: Canonical URL fix
	const homeCanonical = getCanonicalUrl("");
	const hasValidCanonical =
		homeCanonical === "https://carboncube-ke.com" &&
		!homeCanonical.includes("/home");

	// Test 3: Duplicate URL prevention
	const homeUrl = getCanonicalUrl("");
	const homeWithSlash = getCanonicalUrl("/");
	const homeWithHome = getCanonicalUrl("home");
	const noDuplicates = homeUrl === homeWithSlash && homeUrl === homeWithHome;

	return {
		hreflangValid: hasValidHreflang,
		canonicalValid: hasValidCanonical,
		noDuplicates: noDuplicates,
	};
};

/**
 * Generate SEO report for Lighthouse
 */
export const generateSEOReport = () => {
	const validation = runSEOValidation();
	const fixes = testSEOFixes();

	const report = {
		timestamp: new Date().toISOString(),
		validation,
		fixes,
		recommendations: [],
	};

	// Generate recommendations
	if (!fixes.hreflangValid) {
		report.recommendations.push(
			"Fix hreflang format - use hyphens instead of underscores"
		);
	}

	if (!fixes.canonicalValid) {
		report.recommendations.push(
			"Fix canonical URLs - ensure they point to correct domain without /home"
		);
	}

	if (!fixes.noDuplicates) {
		report.recommendations.push(
			"Prevent duplicate URLs by standardizing route handling"
		);
	}

	if (validation.failed > 0) {
		report.recommendations.push("Address failed SEO tests before deployment");
	}

	return report;
};

// Make functions available globally for console testing
if (typeof window !== "undefined") {
	window.runSEOValidation = runSEOValidation;
	window.testSEOFixes = testSEOFixes;
	window.generateSEOReport = generateSEOReport;
}

export default {
	runSEOValidation,
	testSEOFixes,
	generateSEOReport,
};
