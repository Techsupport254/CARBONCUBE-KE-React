const fs = require("fs");
const path = require("path");

// SEO Configuration
const SEO_CONFIG = {
	siteName: "Carbon Cube Kenya",
	siteUrl: "https://carboncube-ke.com",
	description:
		"Carbon Cube Kenya is a smart, AI-powered marketplace built to connect credible sellers with serious buyers. Designed for trust, simplicity, and growth, our platform empowers businesses to showcase their products, gain visibility, and thrive in today's digital economy.",
	keywords: [
		"Carbon Cube Kenya",
		"online marketplace Kenya",
		"trusted sellers",
		"secure ecommerce",
		"AI-powered marketplace",
		"digital procurement Kenya",
		"seller verification",
		"sustainable sourcing Kenya",
		"online shopping Kenya",
		"B2B marketplace",
		"auto parts Kenya",
		"industrial supplies",
		"hardware suppliers",
		"verified suppliers",
		"business growth Kenya",
	],
	socialMedia: {
		linkedin: "https://www.linkedin.com/company/carbon-cube-kenya/",
		facebook: "https://www.facebook.com/profile.php?id=61574066312678",
		instagram: "https://www.instagram.com/carboncube_kenya/",
		whatsapp: "https://wa.me/254712990524",
	},
	contact: {
		phone: "+254713270764",
		email: "info@carboncube-ke.com",
		address: "Nairobi, Kenya",
	},
};

// Generate meta tags for different pages
function generateMetaTags(pageType = "home", customData = {}) {
	const baseMeta = {
		title: `${SEO_CONFIG.siteName} | Kenya's Trusted Digital Marketplace`,
		description: SEO_CONFIG.description,
		keywords: SEO_CONFIG.keywords.join(", "),
		ogTitle: `${SEO_CONFIG.siteName} | Kenya's Trusted Digital Marketplace`,
		ogDescription: SEO_CONFIG.description,
		ogImage: `${SEO_CONFIG.siteUrl}/logo.png`,
	};

	const pageSpecificMeta = {
		home: {
			title: `${SEO_CONFIG.siteName} | Kenya's Trusted Digital Marketplace`,
			description: SEO_CONFIG.description,
			keywords: SEO_CONFIG.keywords.join(", "),
		},
		about: {
			title: `About ${SEO_CONFIG.siteName} | Kenya's Leading Digital Marketplace`,
			description: `Learn about ${SEO_CONFIG.siteName}, Kenya's smart, AI-powered marketplace connecting credible sellers with serious buyers. Discover our mission, values, and commitment to trust and growth.`,
			keywords: `${SEO_CONFIG.keywords.join(
				", "
			)}, about us, company information, Kenya marketplace`,
		},
		contact: {
			title: `Contact ${SEO_CONFIG.siteName} | Get in Touch`,
			description: `Contact ${SEO_CONFIG.siteName} for support, partnerships, or inquiries. Reach our team via phone, email, or social media. We're here to help with your marketplace needs.`,
			keywords: `${SEO_CONFIG.keywords.join(
				", "
			)}, contact us, customer support, Kenya marketplace support`,
		},
		ads: {
			title: `Browse Products | ${SEO_CONFIG.siteName}`,
			description: `Browse thousands of verified products on ${SEO_CONFIG.siteName}. Find auto parts, industrial supplies, hardware, and more from trusted sellers across Kenya.`,
			keywords: `${SEO_CONFIG.keywords.join(
				", "
			)}, browse products, online shopping, verified products`,
		},
		seller: {
			title: `Become a Seller | ${SEO_CONFIG.siteName}`,
			description: `Join ${SEO_CONFIG.siteName} as a seller and grow your business. Access verified buyers, showcase your products, and increase your sales with our AI-powered marketplace.`,
			keywords: `${SEO_CONFIG.keywords.join(
				", "
			)}, become a seller, seller registration, business growth`,
		},
	};

	const meta = { ...baseMeta, ...pageSpecificMeta[pageType], ...customData };

	return `
<!-- Primary Meta Tags -->
<title>${meta.title}</title>
<meta name="title" content="${meta.title}" />
<meta name="description" content="${meta.description}" />
<meta name="keywords" content="${meta.keywords}" />
<meta name="author" content="${SEO_CONFIG.siteName} Team" />
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
<meta name="language" content="English" />
<meta name="revisit-after" content="7 days" />
<meta name="distribution" content="global" />
<meta name="rating" content="general" />
<meta name="geo.region" content="KE" />
<meta name="geo.placename" content="Nairobi, Kenya" />
<meta name="geo.position" content="-1.2921;36.8219" />
<meta name="ICBM" content="-1.2921, 36.8219" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${SEO_CONFIG.siteUrl}/" />
<meta property="og:site_name" content="${SEO_CONFIG.siteName}" />
<meta property="og:title" content="${meta.ogTitle}" />
<meta property="og:description" content="${meta.ogDescription}" />
<meta property="og:image" content="${meta.ogImage}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="en_US" />
<meta property="og:image:alt" content="${meta.ogTitle}" />

<!-- Canonical URL -->
<link rel="canonical" href="${SEO_CONFIG.siteUrl}/" />
    `.trim();
}

// Generate structured data
function generateStructuredData(pageType = "home") {
	const baseStructuredData = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: SEO_CONFIG.siteName,
		description: SEO_CONFIG.description,
		url: SEO_CONFIG.siteUrl,
		logo: `${SEO_CONFIG.siteUrl}/logo.png`,
		sameAs: [
			SEO_CONFIG.socialMedia.linkedin,
			SEO_CONFIG.socialMedia.facebook,
			SEO_CONFIG.socialMedia.instagram,
		],
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "customer service",
			availableLanguage: "English",
			areaServed: "KE",
			telephone: SEO_CONFIG.contact.phone,
			email: SEO_CONFIG.contact.email,
		},
		address: {
			"@type": "PostalAddress",
			addressCountry: "KE",
			addressLocality: "Nairobi",
			addressRegion: "Nairobi",
		},
		foundingDate: "2023",
		numberOfEmployees: "2-10",
		industry: "Internet Marketplace Platforms",
	};

	const pageSpecificData = {
		home: {
			"@type": "WebSite",
			url: SEO_CONFIG.siteUrl,
			name: SEO_CONFIG.siteName,
			description: SEO_CONFIG.description,
			potentialAction: {
				"@type": "SearchAction",
				target: `${SEO_CONFIG.siteUrl}/search?q={search_term_string}`,
				"query-input": "required name=search_term_string",
			},
		},
		about: {
			"@type": "AboutPage",
			url: `${SEO_CONFIG.siteUrl}/about-us`,
			name: `About ${SEO_CONFIG.siteName}`,
			description: `Learn about ${SEO_CONFIG.siteName}, Kenya's smart, AI-powered marketplace.`,
		},
		contact: {
			"@type": "ContactPage",
			url: `${SEO_CONFIG.siteUrl}/contact-us`,
			name: `Contact ${SEO_CONFIG.siteName}`,
			description: `Contact ${SEO_CONFIG.siteName} for support and inquiries.`,
		},
	};

	const structuredData = pageSpecificData[pageType] || baseStructuredData;

	return `<script type="application/ld+json">
${JSON.stringify(structuredData, null, 2)}
</script>`;
}

// Generate social media links HTML
function generateSocialMediaLinks() {
	return `
<div class="social-media-links">
    <a href="${SEO_CONFIG.socialMedia.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="Follow us on LinkedIn">
        <i class="fab fa-linkedin"></i>
    </a>
    <a href="${SEO_CONFIG.socialMedia.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook">
        <i class="fab fa-facebook"></i>
    </a>
    <a href="${SEO_CONFIG.socialMedia.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
        <i class="fab fa-instagram"></i>
    </a>
    <a href="${SEO_CONFIG.socialMedia.whatsapp}" target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp">
        <i class="fab fa-whatsapp"></i>
    </a>
</div>`;
}

// Generate SEO report
function generateSEOReport() {
	const report = {
		timestamp: new Date().toISOString(),
		siteInfo: {
			name: SEO_CONFIG.siteName,
			url: SEO_CONFIG.siteUrl,
			description: SEO_CONFIG.description,
		},
		socialMedia: SEO_CONFIG.socialMedia,
		contact: SEO_CONFIG.contact,
		keywords: SEO_CONFIG.keywords,
		recommendations: [
			"Ensure all images have alt text",
			"Use descriptive URLs for all pages",
			"Implement breadcrumbs navigation",
			"Add schema markup for products",
			"Optimize page loading speed",
			"Create quality, relevant content regularly",
			"Build quality backlinks from relevant sites",
			"Monitor and fix broken links",
			"Use internal linking to improve site structure",
			"Regularly update content to keep it fresh",
		],
	};

	return report;
}

// Export functions
module.exports = {
	SEO_CONFIG,
	generateMetaTags,
	generateStructuredData,
	generateSocialMediaLinks,
	generateSEOReport,
};

// CLI usage
if (require.main === module) {
	const command = process.argv[2];

	switch (command) {
		case "meta":
			const pageType = process.argv[3] || "home";
			console.log(generateMetaTags(pageType));
			break;
		case "structured":
			const dataType = process.argv[3] || "home";
			console.log(generateStructuredData(dataType));
			break;
		case "social":
			console.log(generateSocialMediaLinks());
			break;
		case "report":
			console.log(JSON.stringify(generateSEOReport(), null, 2));
			break;
		default:
			console.log(`
SEO Optimizer - Usage:
  node seo-optimizer.js meta [pageType]     - Generate meta tags
  node seo-optimizer.js structured [type]   - Generate structured data
  node seo-optimizer.js social              - Generate social media links
  node seo-optimizer.js report              - Generate SEO report

Page types: home, about, contact, ads, seller
Data types: home, about, contact
            `);
	}
}
