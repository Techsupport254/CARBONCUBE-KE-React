import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * Simple SEO Head Component for React Helmet
 *
 * This component provides a clean interface for managing SEO meta tags
 * using React Helmet Async. It's designed to be simple and reusable.
 *
 * Usage:
 * <SEOHead
 *   title="Page Title"
 *   description="Page description"
 *   keywords="keyword1, keyword2"
 *   image="https://example.com/image.jpg"
 *   url="https://example.com/page"
 * />
 */
const SEOHead = ({
	title,
	description,
	keywords,
	image = "https://carboncube-ke.com/logo.png",
	url = "https://carboncube-ke.com",
	type = "website",
	structuredData = null,
	canonical = null,
}) => {
	const siteName = "Carbon Cube Kenya";
	const fullTitle = title ? `${title} | ${siteName}` : siteName;
	const defaultDescription =
		"Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.";

	return (
		<Helmet>
			{/* Primary Meta Tags */}
			<title>{fullTitle}</title>
			<meta name="title" content={fullTitle} />
			<meta name="description" content={description || defaultDescription} />
			{keywords && <meta name="keywords" content={keywords} />}
			<meta name="author" content="Carbon Cube Kenya Team" />
			<meta name="robots" content="index, follow" />
			<meta name="language" content="English" />
			<meta name="geo.region" content="KE" />
			<meta name="geo.placename" content="Nairobi, Kenya" />
			<meta name="geo.position" content="-1.2921;36.8219" />
			<meta name="ICBM" content="-1.2921, 36.8219" />

			{/* Open Graph / Facebook */}
			<meta property="og:type" content={type} />
			<meta property="og:url" content={url} />
			<meta property="og:site_name" content={siteName} />
			<meta property="og:title" content={fullTitle} />
			<meta
				property="og:description"
				content={description || defaultDescription}
			/>
			<meta property="og:image" content={image} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:locale" content="en_US" />
			<meta property="og:image:alt" content={fullTitle} />

			{/* Twitter Card */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@carboncube_kenya" />
			<meta name="twitter:creator" content="@carboncube_kenya" />
			<meta name="twitter:title" content={fullTitle} />
			<meta
				name="twitter:description"
				content={description || defaultDescription}
			/>
			<meta name="twitter:image" content={image} />
			<meta name="twitter:image:alt" content={fullTitle} />

			{/* Canonical URL */}
			<link rel="canonical" href={canonical || url} />

			{/* Facebook Domain Verification */}
			<meta
				name="facebook-domain-verification"
				content="rbz3s6fs7rgfzogbpirpgo2249io0s"
			/>

			{/* Structured Data */}
			{structuredData && (
				<script type="application/ld+json">
					{JSON.stringify(structuredData)}
				</script>
			)}
		</Helmet>
	);
};

export default SEOHead;
