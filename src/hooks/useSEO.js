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
	alternateLanguages = [], // Array of {lang: 'en', url: '...'}
	customMetaTags = [], // Array of {name: '...', content: '...'} or {property: '...', content: '...'}
	viewport = "width=device-width, initial-scale=1.0",
	themeColor = "#FFD700",
	imageWidth = null,
	imageHeight = null,
	robots = "index, follow", // Default robots directive
	canonical = null, // Custom canonical URL
	sitemap = null, // Sitemap URL
	preload = [], // Array of resources to preload
	prefetch = [], // Array of resources to prefetch
	performance = true, // Enable performance optimizations
	// AI Search Optimization
	aiSearchOptimized = true, // Enable AI search optimization
	contentType = "article", // Content type for AI understanding
	expertiseLevel = "expert", // Expertise level (beginner, intermediate, expert)
	contentDepth = "comprehensive", // Content depth (basic, intermediate, comprehensive)
	aiFriendlyFormat = true, // Enable AI-friendly content formatting
	conversationalKeywords = [], // Keywords optimized for conversational search
	aiCitationOptimized = true, // Optimize for AI citations
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

		// Update viewport meta tag
		let viewportMeta = document.querySelector('meta[name="viewport"]');
		if (!viewportMeta) {
			viewportMeta = document.createElement("meta");
			viewportMeta.name = "viewport";
			document.head.appendChild(viewportMeta);
		}
		viewportMeta.content = viewport;

		// Update theme color meta tag
		let themeColorMeta = document.querySelector('meta[name="theme-color"]');
		if (!themeColorMeta) {
			themeColorMeta = document.createElement("meta");
			themeColorMeta.name = "theme-color";
			document.head.appendChild(themeColorMeta);
		}
		themeColorMeta.content = themeColor;

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
		updateMetaTag("robots", robots);
		updateMetaTag("language", "English");
		updateMetaTag("geo.region", "KE");
		updateMetaTag("geo.placename", "Kenya");
		updateMetaTag("geo.position", "-1.2921;36.8219");
		updateMetaTag("ICBM", "-1.2921, 36.8219");

		// Open Graph tags
		updatePropertyTag("og:type", type);
		updatePropertyTag("og:url", url || defaultUrl);
		updatePropertyTag("og:title", fullTitle);
		updatePropertyTag("og:description", description || defaultDescription);
		updatePropertyTag("og:image", image || defaultImage);
		updatePropertyTag("og:site_name", siteName);
		updatePropertyTag("og:locale", "en_US");

		// Add image dimensions if provided
		if (imageWidth) {
			updatePropertyTag("og:image:width", imageWidth.toString());
		}
		if (imageHeight) {
			updatePropertyTag("og:image:height", imageHeight.toString());
		}

		// Twitter Card tags
		updatePropertyTag("twitter:card", "summary_large_image");
		updatePropertyTag("twitter:site", "@carboncube_kenya");
		updatePropertyTag("twitter:title", fullTitle);
		updatePropertyTag("twitter:description", description || defaultDescription);
		updatePropertyTag("twitter:image", image || defaultImage);
		updatePropertyTag("twitter:image:alt", fullTitle);

		// Remove any existing twitter:* tags if present
		const twitterTags = document.querySelectorAll('meta[property^="twitter:"]');
		twitterTags.forEach((tag) => tag.remove());

		// Update canonical URL
		let canonicalLink = document.querySelector('link[rel="canonical"]');
		if (!canonicalLink) {
			canonicalLink = document.createElement("link");
			canonicalLink.rel = "canonical";
			document.head.appendChild(canonicalLink);
		}
		canonicalLink.href = canonical || url || defaultUrl;

		// Add sitemap link if provided
		if (sitemap) {
			let sitemapLink = document.querySelector('link[rel="sitemap"]');
			if (!sitemapLink) {
				sitemapLink = document.createElement("link");
				sitemapLink.rel = "sitemap";
				sitemapLink.type = "application/xml";
				document.head.appendChild(sitemapLink);
			}
			sitemapLink.href = sitemap;
		}

		// Add alternate language links
		if (alternateLanguages && alternateLanguages.length > 0) {
			// Remove existing alternate language links
			const existingAlternates = document.querySelectorAll(
				'link[rel="alternate"][hreflang]'
			);
			existingAlternates.forEach((link) => link.remove());

			// Add new alternate language links
			alternateLanguages.forEach(({ lang, url: altUrl }) => {
				const alternateLink = document.createElement("link");
				alternateLink.rel = "alternate";
				alternateLink.hreflang = lang;
				alternateLink.href = altUrl;
				document.head.appendChild(alternateLink);
			});
		}

		// Add custom meta tags
		if (customMetaTags && customMetaTags.length > 0) {
			customMetaTags.forEach(({ name, property, content }) => {
				if (name) {
					updateMetaTag(name, content);
				} else if (property) {
					updatePropertyTag(property, content);
				}
			});
		}

		// AI Search Optimization Meta Tags
		if (aiSearchOptimized) {
			// AI-specific meta tags
			updateMetaTag("ai:content_type", contentType);
			updateMetaTag("ai:expertise_level", expertiseLevel);
			updateMetaTag("ai:content_depth", contentDepth);
			updateMetaTag("ai:format_optimized", aiFriendlyFormat ? "true" : "false");
			updateMetaTag(
				"ai:citation_optimized",
				aiCitationOptimized ? "true" : "false"
			);

			// Conversational search optimization
			if (conversationalKeywords && conversationalKeywords.length > 0) {
				updateMetaTag(
					"ai:conversational_keywords",
					conversationalKeywords.join(", ")
				);
			}

			// E-E-A-T signals for AI search engines
			updateMetaTag("ai:experience", "verified");
			updateMetaTag("ai:expertise", "high");
			updateMetaTag("ai:authoritativeness", "established");
			updateMetaTag("ai:trustworthiness", "verified");

			// AI search engine specific tags
			updateMetaTag("google:ai_overviews", "optimized");
			updateMetaTag("bing:ai_chat", "optimized");
			updateMetaTag("openai:chatgpt", "optimized");

			// Content quality indicators
			updateMetaTag("ai:content_quality", "high");
			updateMetaTag("ai:factual_accuracy", "verified");
			updateMetaTag("ai:source_reliability", "high");
		}

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

		// Performance optimizations
		if (performance) {
			// Add preload links for critical resources
			if (preload && preload.length > 0) {
				preload.forEach((resource) => {
					const preloadLink = document.createElement("link");
					preloadLink.rel = "preload";
					preloadLink.href = resource.href;
					preloadLink.as = resource.as || "script";
					if (resource.crossorigin) {
						preloadLink.crossOrigin = resource.crossorigin;
					}
					document.head.appendChild(preloadLink);
				});
			}

			// Add prefetch links for non-critical resources
			if (prefetch && prefetch.length > 0) {
				prefetch.forEach((resource) => {
					const prefetchLink = document.createElement("link");
					prefetchLink.rel = "prefetch";
					prefetchLink.href = resource.href;
					if (resource.as) {
						prefetchLink.as = resource.as;
					}
					document.head.appendChild(prefetchLink);
				});
			}
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

			// Remove alternate language links
			const cleanupAlternates = document.querySelectorAll(
				'link[rel="alternate"][hreflang]'
			);
			cleanupAlternates.forEach((link) => link.remove());

			// Remove preload and prefetch links
			const cleanupPreloads = document.querySelectorAll(
				'link[rel="preload"], link[rel="prefetch"]'
			);
			cleanupPreloads.forEach((link) => link.remove());

			// Remove sitemap link
			const cleanupSitemap = document.querySelector('link[rel="sitemap"]');
			if (cleanupSitemap) {
				cleanupSitemap.remove();
			}
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
		alternateLanguages,
		customMetaTags,
		viewport,
		themeColor,
		imageWidth,
		imageHeight,
		robots,
		canonical,
		sitemap,
		preload,
		prefetch,
		performance,
		aiSearchOptimized,
		contentType,
		expertiseLevel,
		contentDepth,
		aiFriendlyFormat,
		conversationalKeywords,
		aiCitationOptimized,
	]);
};

export default useSEO;
