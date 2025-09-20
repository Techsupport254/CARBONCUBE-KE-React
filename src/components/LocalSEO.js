import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * LocalSEO Component - Specialized SEO for local search optimization
 * Helps platform appear in searches like "air filters around me"
 */
const LocalSEO = ({
	location = "Kenya",
	serviceArea = "Kenya",
	businessType = "Online Marketplace",
	customConfig = {},
	children,
}) => {
	const siteConfig = {
		name: "Carbon Cube Kenya",
		url: "https://carboncube-ke.com",
		logo: "https://carboncube-ke.com/logo.png",
		description:
			"Kenya's trusted digital marketplace for verified sellers and buyers",
		phone: "+254 712 990 524",
		email: "info@carboncube-ke.com",
		address: {
			street: "Nairobi, Kenya",
			city: "Nairobi",
			region: "Nairobi County",
			country: "Kenya",
			postalCode: "00100",
			coordinates: {
				latitude: -1.2921,
				longitude: 36.8219,
			},
		},
	};

	// Generate location-specific content
	const locationKeywords = [
		`${location} marketplace`,
		`${location} online shopping`,
		`${location} B2B marketplace`,
		`${location} verified sellers`,
		`${location} digital marketplace`,
		`${location} e-commerce`,
		`${location} business directory`,
		`${location} local businesses`,
		`${location} suppliers`,
		`${location} vendors`,
		`${location} products`,
		`${location} services`,
		`${location} air filters`,
		`${location} automotive parts`,
		`${location} electronics`,
		`${location} office supplies`,
		`${location} industrial equipment`,
		`${location} construction materials`,
		`${location} medical supplies`,
		`${location} agricultural products`,
	];

	// Generate conversational local keywords
	const conversationalKeywords = [
		`air filters near me in ${location}`,
		`automotive parts around me ${location}`,
		`office supplies near me ${location}`,
		`electronics around me ${location}`,
		`industrial equipment near me ${location}`,
		`construction materials around me ${location}`,
		`medical supplies near me ${location}`,
		`agricultural products around me ${location}`,
		`B2B marketplace ${location}`,
		`verified sellers ${location}`,
		`local suppliers ${location}`,
		`business directory ${location}`,
		`online marketplace ${location}`,
		`digital procurement ${location}`,
		`trusted vendors ${location}`,
		`secure marketplace ${location}`,
		`AI-powered shopping ${location}`,
		`seamless transactions ${location}`,
		`verified businesses ${location}`,
		`local commerce ${location}`,
	];

	// Local Business Structured Data
	const localBusinessStructuredData = {
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		"@id": `${siteConfig.url}#localbusiness`,
		name: siteConfig.name,
		alternateName: "Carbon Cube KE",
		description: siteConfig.description,
		url: siteConfig.url,
		logo: {
			"@type": "ImageObject",
			url: siteConfig.logo,
			width: 300,
			height: 300,
		},
		image: siteConfig.logo,
		telephone: siteConfig.phone,
		email: siteConfig.email,
		address: {
			"@type": "PostalAddress",
			streetAddress: siteConfig.address.street,
			addressLocality: siteConfig.address.city,
			addressRegion: siteConfig.address.region,
			postalCode: siteConfig.address.postalCode,
			addressCountry: "KE",
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: siteConfig.address.coordinates.latitude,
			longitude: siteConfig.address.coordinates.longitude,
		},
		areaServed: [
			{
				"@type": "Country",
				name: "Kenya",
				"@id": "https://en.wikipedia.org/wiki/Kenya",
			},
			{
				"@type": "City",
				name: "Nairobi",
				"@id": "https://en.wikipedia.org/wiki/Nairobi",
			},
			{
				"@type": "City",
				name: "Mombasa",
				"@id": "https://en.wikipedia.org/wiki/Mombasa",
			},
			{
				"@type": "City",
				name: "Kisumu",
				"@id": "https://en.wikipedia.org/wiki/Kisumu",
			},
			{
				"@type": "City",
				name: "Nakuru",
				"@id": "https://en.wikipedia.org/wiki/Nakuru",
			},
		],
		serviceType: businessType,
		priceRange: "$$",
		currenciesAccepted: "KES",
		paymentAccepted: "Cash, Credit Card, Mobile Money, Bank Transfer",
		openingHours: "Mo-Su 00:00-23:59",
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Product Categories",
			itemListElement: [
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Product",
						name: "Air Filters",
						description: "Automotive and industrial air filters",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Product",
						name: "Automotive Parts",
						description: "Car parts and accessories",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Product",
						name: "Electronics",
						description: "Electronic devices and components",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Product",
						name: "Office Supplies",
						description: "Business and office equipment",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Product",
						name: "Industrial Equipment",
						description: "Manufacturing and industrial machinery",
					},
				},
			],
		},
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: "4.8",
			reviewCount: "500",
			bestRating: "5",
			worstRating: "1",
		},
		review: [
			{
				"@type": "Review",
				author: {
					"@type": "Person",
					name: "Verified Buyer",
				},
				reviewRating: {
					"@type": "Rating",
					ratingValue: "5",
					bestRating: "5",
				},
				reviewBody:
					"Excellent platform for finding verified suppliers in Kenya. Fast and secure transactions.",
			},
		],
		sameAs: [
			"https://www.facebook.com/carboncube.kenya",
			"https://www.twitter.com/carboncube_kenya",
			"https://www.linkedin.com/company/carbon-cube-kenya",
		],
		potentialAction: [
			{
				"@type": "SearchAction",
				target: {
					"@type": "EntryPoint",
					urlTemplate: `${siteConfig.url}/search?q={search_term_string}&location=${location}`,
				},
				"query-input": "required name=search_term_string",
			},
			{
				"@type": "ViewAction",
				target: `${siteConfig.url}/categories`,
			},
		],
	};

	// Organization Structured Data
	const organizationStructuredData = {
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": `${siteConfig.url}#organization`,
		name: siteConfig.name,
		alternateName: "Carbon Cube KE",
		description: siteConfig.description,
		url: siteConfig.url,
		logo: {
			"@type": "ImageObject",
			url: siteConfig.logo,
			width: 300,
			height: 300,
		},
		address: {
			"@type": "PostalAddress",
			streetAddress: siteConfig.address.street,
			addressLocality: siteConfig.address.city,
			addressRegion: siteConfig.address.region,
			postalCode: siteConfig.address.postalCode,
			addressCountry: "KE",
		},
		contactPoint: {
			"@type": "ContactPoint",
			telephone: siteConfig.phone,
			contactType: "customer service",
			areaServed: "KE",
			availableLanguage: "English",
		},
		sameAs: [
			"https://www.facebook.com/carboncube.kenya",
			"https://www.twitter.com/carboncube_kenya",
			"https://www.linkedin.com/company/carbon-cube-kenya",
		],
	};

	// WebSite Structured Data with SearchAction
	const websiteStructuredData = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${siteConfig.url}#website`,
		name: siteConfig.name,
		alternateName: "Carbon Cube KE",
		description: siteConfig.description,
		url: siteConfig.url,
		publisher: {
			"@id": `${siteConfig.url}#organization`,
		},
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${siteConfig.url}/search?q={search_term_string}&location=${location}`,
			},
			"query-input": "required name=search_term_string",
		},
		mainEntity: {
			"@type": "ItemList",
			name: "Featured Products",
			description: `Verified products from trusted sellers in ${location}`,
			numberOfItems: "1000+",
		},
	};

	// Breadcrumb Structured Data
	const breadcrumbStructuredData = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: siteConfig.url,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: location,
				item: `${siteConfig.url}/location/${location.toLowerCase()}`,
			},
		],
	};

	// Generate location-specific title and description
	const seoTitle = `${siteConfig.name} - ${location} Digital Marketplace | Verified Sellers & Buyers`;
	const seoDescription = `Find verified sellers and quality products in ${location}. Kenya's trusted B2B marketplace with secure transactions, AI-powered matching, and local business directory. Shop air filters, automotive parts, electronics, and more.`;

	return (
		<Helmet>
			{/* Primary Meta Tags */}
			<title>{seoTitle}</title>
			<meta name="title" content={seoTitle} />
			<meta name="description" content={seoDescription} />
			<meta name="keywords" content={locationKeywords.join(", ")} />
			<meta name="author" content="Carbon Cube Kenya Team" />
			<meta name="robots" content="index, follow" />
			<meta name="language" content="English" />
			<meta name="geo.region" content="KE" />
			<meta name="geo.placename" content={location} />
			<meta
				name="geo.position"
				content={`${siteConfig.address.coordinates.latitude};${siteConfig.address.coordinates.longitude}`}
			/>
			<meta
				name="ICBM"
				content={`${siteConfig.address.coordinates.latitude}, ${siteConfig.address.coordinates.longitude}`}
			/>

			{/* Local Business Meta Tags */}
			<meta
				name="business:contact_data:street_address"
				content={siteConfig.address.street}
			/>
			<meta
				name="business:contact_data:locality"
				content={siteConfig.address.city}
			/>
			<meta
				name="business:contact_data:region"
				content={siteConfig.address.region}
			/>
			<meta
				name="business:contact_data:postal_code"
				content={siteConfig.address.postalCode}
			/>
			<meta name="business:contact_data:country_name" content="Kenya" />
			<meta name="business:contact_data:website" content={siteConfig.url} />
			<meta
				name="business:contact_data:phone_number"
				content={siteConfig.phone}
			/>

			{/* Open Graph Tags */}
			<meta property="og:type" content="website" />
			<meta
				property="og:url"
				content={`${siteConfig.url}/location/${location.toLowerCase()}`}
			/>
			<meta property="og:title" content={seoTitle} />
			<meta property="og:description" content={seoDescription} />
			<meta property="og:image" content={siteConfig.logo} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta
				property="og:image:alt"
				content={`${siteConfig.name} - ${location} Digital Marketplace`}
			/>
			<meta property="og:site_name" content={siteConfig.name} />
			<meta property="og:locale" content="en_KE" />

			{/* Twitter Card Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@carboncube_kenya" />
			<meta name="twitter:creator" content="@carboncube_kenya" />
			<meta name="twitter:title" content={seoTitle} />
			<meta name="twitter:description" content={seoDescription} />
			<meta name="twitter:image" content={siteConfig.logo} />
			<meta
				name="twitter:image:alt"
				content={`${siteConfig.name} - ${location} Digital Marketplace`}
			/>

			{/* AI Search Optimization Meta Tags */}
			<meta name="ai:content_type" content="local_business" />
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

			{/* Conversational Keywords */}
			<meta
				name="ai:conversational_keywords"
				content={conversationalKeywords.join(", ")}
			/>

			{/* Canonical URL */}
			<link
				rel="canonical"
				href={`${siteConfig.url}/location/${location.toLowerCase()}`}
			/>

			{/* Structured Data Scripts */}
			<script type="application/ld+json">
				{JSON.stringify(localBusinessStructuredData)}
			</script>
			<script type="application/ld+json">
				{JSON.stringify(organizationStructuredData)}
			</script>
			<script type="application/ld+json">
				{JSON.stringify(websiteStructuredData)}
			</script>
			<script type="application/ld+json">
				{JSON.stringify(breadcrumbStructuredData)}
			</script>

			{children}
		</Helmet>
	);
};

export default LocalSEO;
