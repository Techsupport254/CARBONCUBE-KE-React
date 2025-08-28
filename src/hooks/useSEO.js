import { useEffect } from "react";

const useSEO = ({
	title,
	description,
	keywords,
	image,
	url,
	type = "website",
	author = "Carbon Cube Kenya Team",
	structuredData = null,
	additionalStructuredData = [], // Array for multiple structured data objects
}) => {
	useEffect(() => {
		const siteName = "Carbon Cube Kenya";
		const fullTitle = title ? `${title} | ${siteName}` : siteName;
		const defaultDescription =
			"Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.";
		const defaultImage = "https://carboncube-ke.com/logo.png";
		const defaultUrl = "https://carboncube-ke.com";

		// Update document title
		document.title = fullTitle;

		// Update meta tags
		const updateMetaTag = (name, content) => {
			let meta = document.querySelector(`meta[name="${name}"]`);
			if (!meta) {
				meta = document.createElement("meta");
				meta.name = name;
				document.head.appendChild(meta);
			}
			meta.content = content;
		};

		const updatePropertyTag = (property, content) => {
			let meta = document.querySelector(`meta[property="${property}"]`);
			if (!meta) {
				meta = document.createElement("meta");
				meta.setAttribute("property", property);
				document.head.appendChild(meta);
			}
			meta.content = content;
		};

		// Primary meta tags
		updateMetaTag("title", fullTitle);
		updateMetaTag("description", description || defaultDescription);
		updateMetaTag("keywords", keywords);
		updateMetaTag("author", author);

		// Open Graph tags
		updatePropertyTag("og:type", type);
		updatePropertyTag("og:url", url || defaultUrl);
		updatePropertyTag("og:title", fullTitle);
		updatePropertyTag("og:description", description || defaultDescription);
		updatePropertyTag("og:image", image || defaultImage);
		updatePropertyTag("og:site_name", siteName);

		// Remove any existing twitter:* tags if present
		const twitterTags = document.querySelectorAll('meta[property^="twitter:"]');
		twitterTags.forEach((tag) => tag.remove());

		// Update canonical URL
		let canonical = document.querySelector('link[rel="canonical"]');
		if (!canonical) {
			canonical = document.createElement("link");
			canonical.rel = "canonical";
			document.head.appendChild(canonical);
		}
		canonical.href = url || defaultUrl;

		// Handle structured data
		const addStructuredData = (data) => {
			const script = document.createElement("script");
			script.type = "application/ld+json";
			script.textContent = JSON.stringify(data);
			document.head.appendChild(script);
			return script;
		};

		// Remove existing structured data scripts
		const existingScripts = document.querySelectorAll(
			'script[type="application/ld+json"]'
		);
		existingScripts.forEach((script) => script.remove());

		// Add new structured data
		if (structuredData) {
			addStructuredData(structuredData);
		}

		// Add additional structured data
		if (additionalStructuredData && additionalStructuredData.length > 0) {
			additionalStructuredData.forEach((data) => {
				addStructuredData(data);
			});
		}

		// Cleanup function
		return () => {
			// Reset to default SEO when component unmounts
			document.title = siteName;
			updateMetaTag("description", defaultDescription);
			updateMetaTag(
				"keywords",
				"Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce"
			);
			updatePropertyTag("og:title", siteName);
			updatePropertyTag("og:description", defaultDescription);

			// Remove structured data scripts
			const scripts = document.querySelectorAll(
				'script[type="application/ld+json"]'
			);
			scripts.forEach((script) => script.remove());

			// Remove twitter tags on cleanup
			const cleanupTwitterTags = document.querySelectorAll(
				'meta[property^="twitter:"]'
			);
			cleanupTwitterTags.forEach((tag) => tag.remove());
		};
	}, [
		title,
		description,
		keywords,
		image,
		url,
		type,
		author,
		structuredData,
		additionalStructuredData,
	]);
};

export default useSEO;
