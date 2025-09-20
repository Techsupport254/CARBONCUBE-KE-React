import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * HomepageSEO Component - Specialized SEO for the homepage
 * Provides comprehensive SEO metadata for the main homepage
 */
const HomepageSEO = ({ categories = [], customConfig = {} }) => {
	const siteConfig = {
		name: "Carbon Cube Kenya",
		url: "https://carboncube-ke.com",
		logo: "https://carboncube-ke.com/og-image.png",
		description:
			"Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.",
	};

	// Enhanced title with power words
	const title =
		"Carbon Cube Kenya - Kenya's #1 Online Marketplace | Trusted Sellers & Buyers";

	// Enhanced description with more compelling copy
	const description =
		"Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement. Discover thousands of products from verified sellers across Kenya with secure payment and fast delivery.";

	// Enhanced keywords
	const keywords = [
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
		"Kenya ecommerce",
		"online store Kenya",
		"marketplace Kenya",
		"buy online Kenya",
		"sell online Kenya",
	].join(", ");

	// Enhanced structured data for homepage
	const homepageStructuredData = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Carbon Cube Kenya",
		alternateName: "Carbon Cube KE",
		url: "https://carboncube-ke.com",
		description: description,
		publisher: {
			"@type": "Organization",
			name: "Carbon Cube Kenya",
			url: "https://carboncube-ke.com",
			logo: {
				"@type": "ImageObject",
				url: siteConfig.logo,
				width: 1200,
				height: 630,
			},
			contactPoint: {
				"@type": "ContactPoint",
				contactType: "customer service",
				availableLanguage: "English",
				areaServed: "KE",
				telephone: "+254 712 990 524",
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
			industry: "Internet Marketplace Platforms",
		},
		potentialAction: {
			"@type": "SearchAction",
			target: "https://carboncube-ke.com/search?q={search_term_string}",
			"query-input": "required name=search_term_string",
		},
		mainEntity: {
			"@type": "ItemList",
			name: "Featured Products",
			description: "Verified products from trusted sellers across Kenya",
			numberOfItems: categories.length,
		},
	};

	// LocalBusiness structured data
	const localBusinessStructuredData = {
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		name: "Carbon Cube Kenya",
		description: description,
		url: "https://carboncube-ke.com",
		telephone: "+254 712 990 524",
		email: "info@carboncube-ke.com",
		image: siteConfig.logo,
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
	};

	// Breadcrumb structured data
	const breadcrumbStructuredData = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: "https://carboncube-ke.com",
			},
		],
	};

	return (
		<Helmet>
			{/* Primary Meta Tags */}
			<title>{title}</title>
			<meta name="title" content={title} />
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />
			<meta name="author" content="Carbon Cube Kenya Team" />
			<meta
				name="robots"
				content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
			/>
			<meta name="language" content="English" />
			<meta name="geo.region" content="KE" />
			<meta name="geo.placename" content="Nairobi, Kenya" />
			<meta name="geo.position" content="-1.2921;36.8219" />
			<meta name="ICBM" content="-1.2921, 36.8219" />

			{/* Open Graph Tags */}
			<meta property="og:type" content="website" />
			<meta property="og:url" content="https://carboncube-ke.com/" />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={siteConfig.logo} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta
				property="og:image:alt"
				content="Carbon Cube Kenya - Kenya's #1 Online Marketplace"
			/>
			<meta property="og:site_name" content="Carbon Cube Kenya" />
			<meta property="og:locale" content="en_US" />
			<meta property="og:updated_time" content={new Date().toISOString()} />

			{/* Twitter Card Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@carboncube_kenya" />
			<meta name="twitter:creator" content="@carboncube_kenya" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={siteConfig.logo} />
			<meta
				name="twitter:image:alt"
				content="Carbon Cube Kenya - Kenya's #1 Online Marketplace"
			/>

			{/* Business-specific Open Graph tags */}
			<meta
				property="business:contact_data:street_address"
				content="9th Floor, CMS Africa, Kilimani"
			/>
			<meta property="business:contact_data:locality" content="Nairobi" />
			<meta property="business:contact_data:region" content="Nairobi" />
			<meta property="business:contact_data:postal_code" content="00100" />
			<meta property="business:contact_data:country_name" content="Kenya" />

			{/* AI Search Optimization Meta Tags */}
			<meta name="ai:content_type" content="marketplace" />
			<meta name="ai:expertise_level" content="expert" />
			<meta name="ai:content_depth" content="comprehensive" />
			<meta name="ai:format_optimized" content="true" />
			<meta name="ai:citation_optimized" content="true" />
			<meta name="ai:experience" content="verified" />
			<meta name="ai:expertise" content="high" />
			<meta name="ai:authoritativeness" content="established" />
			<meta name="ai:trustworthiness" content="verified" />
			<meta name="google:ai_overviews" content="optimized" />
			<meta name="bing:ai_chat" content="optimized" />
			<meta name="openai:chatgpt" content="optimized" />

			{/* Canonical URL */}
			<link rel="canonical" href="https://carboncube-ke.com/" />

			{/* Structured Data Scripts */}
			<script type="application/ld+json">
				{JSON.stringify(homepageStructuredData)}
			</script>
			<script type="application/ld+json">
				{JSON.stringify(localBusinessStructuredData)}
			</script>
			<script type="application/ld+json">
				{JSON.stringify(breadcrumbStructuredData)}
			</script>
		</Helmet>
	);
};

export default HomepageSEO;
