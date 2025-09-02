#!/usr/bin/env node

/**
 * Structured Data Validation Script
 * Validates that all required and optional fields are present in the structured data
 */

const fs = require("fs");
const path = require("path");

// Test structured data objects
const testStructuredData = {
	// LocalBusiness test data
	localBusiness: {
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		name: "Carbon Cube Kenya",
		description:
			"Smart, AI-powered marketplace connecting credible sellers with serious buyers in Kenya",
		url: "https://carboncube-ke.com",
		telephone: "+254713270764",
		email: "info@carboncube-ke.com",
		image: "https://carboncube-ke.com/logo.png",
		address: {
			"@type": "PostalAddress",
			streetAddress: "9th Floor, CMS Africa, Kilimani",
			addressLocality: "Nairobi",
			addressRegion: "Nairobi",
			addressCountry: "KE",
			postalCode: "00100",
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: -1.2921,
			longitude: 36.8219,
		},
		openingHours: "Mo-Su 00:00-23:59",
		priceRange: "$$",
		currenciesAccepted: "KES",
		paymentAccepted: "Cash, Credit Card, Mobile Money",
		areaServed: "KE",
		serviceType: "Online Marketplace",
	},

	// Organization test data
	organization: {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Carbon Cube Kenya",
		description:
			"Kenya's trusted digital marketplace connecting verified sellers with buyers",
		url: "https://carboncube-ke.com",
		logo: "https://carboncube-ke.com/logo.png",
		sameAs: [
			"https://www.linkedin.com/company/carbon-cube-kenya/",
			"https://www.facebook.com/profile.php?id=61574066312678",
			"https://www.instagram.com/carboncube_kenya/",
		],
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "customer service",
			availableLanguage: "English",
			areaServed: "KE",
			telephone: "+254713270764",
			email: "info@carboncube-ke.com",
		},
		address: {
			"@type": "PostalAddress",
			streetAddress: "9th Floor, CMS Africa, Kilimani",
			addressLocality: "Nairobi",
			addressRegion: "Nairobi",
			addressCountry: "KE",
			postalCode: "00100",
		},
		foundingDate: "2023",
		numberOfEmployees: {
			"@type": "QuantitativeValue",
			minValue: 2,
			maxValue: 10,
		},
		industry: "Internet Marketplace Platforms",
	},
};

// Validation functions
function validateLocalBusiness(data) {
	const required = ["name", "url", "address"];
	const optional = ["telephone", "priceRange", "image"];
	const missing = [];
	const present = [];

	// Check required fields
	required.forEach((field) => {
		if (!data[field]) {
			missing.push(`Required: ${field}`);
		} else {
			present.push(`Required: ${field} ✓`);
		}
	});

	// Check optional fields
	optional.forEach((field) => {
		if (data[field]) {
			present.push(`Optional: ${field} ✓`);
		} else {
			missing.push(`Optional: ${field} (missing)`);
		}
	});

	// Check address fields
	if (data.address) {
		const addressFields = [
			"streetAddress",
			"addressLocality",
			"addressRegion",
			"addressCountry",
			"postalCode",
		];
		addressFields.forEach((field) => {
			if (data.address[field]) {
				present.push(`Address: ${field} ✓`);
			} else {
				missing.push(`Address: ${field} (missing)`);
			}
		});
	}

	return { missing, present };
}

function validateOrganization(data) {
	const required = ["name", "url"];
	const optional = ["logo", "sameAs", "contactPoint", "address"];
	const missing = [];
	const present = [];

	// Check required fields
	required.forEach((field) => {
		if (!data[field]) {
			missing.push(`Required: ${field}`);
		} else {
			present.push(`Required: ${field} ✓`);
		}
	});

	// Check optional fields
	optional.forEach((field) => {
		if (data[field]) {
			present.push(`Optional: ${field} ✓`);
		} else {
			missing.push(`Optional: ${field} (missing)`);
		}
	});

	// Check address fields
	if (data.address) {
		const addressFields = [
			"streetAddress",
			"addressLocality",
			"addressRegion",
			"addressCountry",
			"postalCode",
		];
		addressFields.forEach((field) => {
			if (data.address[field]) {
				present.push(`Address: ${field} ✓`);
			} else {
				missing.push(`Address: ${field} (missing)`);
			}
		});
	}

	return { missing, present };
}

// Main validation
function main() {
	console.log("🔍 Validating Structured Data for Carbon Cube Kenya\n");

	// Validate LocalBusiness
	console.log(" LocalBusiness Validation:");
	const localBusinessValidation = validateLocalBusiness(
		testStructuredData.localBusiness
	);
	console.log("✅ Present fields:");
	localBusinessValidation.present.forEach((field) => console.log(`  ${field}`));

	if (localBusinessValidation.missing.length > 0) {
		console.log("❌ Missing fields:");
		localBusinessValidation.missing.forEach((field) =>
			console.log(`  ${field}`)
		);
	} else {
		console.log("🎉 All fields present!");
	}

	console.log("\n" + "=".repeat(50) + "\n");

	// Validate Organization
	console.log("🏢 Organization Validation:");
	const organizationValidation = validateOrganization(
		testStructuredData.organization
	);
	console.log("✅ Present fields:");
	organizationValidation.present.forEach((field) => console.log(`  ${field}`));

	if (organizationValidation.missing.length > 0) {
		console.log("❌ Missing fields:");
		organizationValidation.missing.forEach((field) =>
			console.log(`  ${field}`)
		);
	} else {
		console.log("🎉 All fields present!");
	}

	console.log("\n" + "=".repeat(50) + "\n");

	// Generate test JSON-LD
	console.log("📄 Generated JSON-LD for testing:");
	console.log("\nLocalBusiness:");
	console.log(JSON.stringify(testStructuredData.localBusiness, null, 2));

	console.log("\nOrganization:");
	console.log(JSON.stringify(testStructuredData.organization, null, 2));

	console.log(
		"\n✅ Validation complete! Copy the JSON-LD above to test in Google Rich Results Test."
	);
}

// Run validation
if (require.main === module) {
	main();
}

module.exports = {
	testStructuredData,
	validateLocalBusiness,
	validateOrganization,
};
