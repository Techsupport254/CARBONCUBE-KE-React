import React from "react";

/**
 * LocalKeywords Component - Optimizes for local search keywords
 * Helps platform appear in searches like "air filters around me"
 */
const LocalKeywords = ({ location = "Kenya", category = "all" }) => {
	// Generate location-specific keywords for different categories
	const generateLocalKeywords = (location, category) => {
		const baseKeywords = {
			air_filters: [
				`air filters ${location}`,
				`air filters near me ${location}`,
				`air filters around me ${location}`,
				`automotive air filters ${location}`,
				`industrial air filters ${location}`,
				`HVAC air filters ${location}`,
				`air filter suppliers ${location}`,
				`air filter dealers ${location}`,
				`air filter stores ${location}`,
				`air filter shops ${location}`,
			],
			automotive: [
				`automotive parts ${location}`,
				`car parts ${location}`,
				`auto parts near me ${location}`,
				`automotive supplies ${location}`,
				`vehicle parts ${location}`,
				`car accessories ${location}`,
				`automotive equipment ${location}`,
				`auto repair parts ${location}`,
				`automotive tools ${location}`,
				`car maintenance supplies ${location}`,
			],
			electronics: [
				`electronics ${location}`,
				`electronic devices ${location}`,
				`electronic components ${location}`,
				`electronic equipment ${location}`,
				`electronic supplies ${location}`,
				`electronic accessories ${location}`,
				`electronic parts ${location}`,
				`electronic tools ${location}`,
				`electronic gadgets ${location}`,
				`electronic systems ${location}`,
			],
			office: [
				`office supplies ${location}`,
				`office equipment ${location}`,
				`office furniture ${location}`,
				`office stationery ${location}`,
				`office accessories ${location}`,
				`office materials ${location}`,
				`office products ${location}`,
				`office tools ${location}`,
				`office technology ${location}`,
				`office solutions ${location}`,
			],
			industrial: [
				`industrial equipment ${location}`,
				`industrial supplies ${location}`,
				`industrial machinery ${location}`,
				`industrial tools ${location}`,
				`industrial parts ${location}`,
				`industrial materials ${location}`,
				`industrial components ${location}`,
				`industrial systems ${location}`,
				`industrial solutions ${location}`,
				`industrial services ${location}`,
			],
			medical: [
				`medical equipment ${location}`,
				`medical supplies ${location}`,
				`medical devices ${location}`,
				`medical instruments ${location}`,
				`medical accessories ${location}`,
				`medical tools ${location}`,
				`medical products ${location}`,
				`medical materials ${location}`,
				`medical systems ${location}`,
				`medical solutions ${location}`,
			],
			agricultural: [
				`agricultural equipment ${location}`,
				`farm supplies ${location}`,
				`agricultural machinery ${location}`,
				`farm equipment ${location}`,
				`agricultural tools ${location}`,
				`farm tools ${location}`,
				`agricultural supplies ${location}`,
				`farm materials ${location}`,
				`agricultural products ${location}`,
				`farm products ${location}`,
			],
			construction: [
				`construction materials ${location}`,
				`construction equipment ${location}`,
				`construction supplies ${location}`,
				`construction tools ${location}`,
				`building materials ${location}`,
				`construction parts ${location}`,
				`construction accessories ${location}`,
				`construction systems ${location}`,
				`construction solutions ${location}`,
				`construction services ${location}`,
			],
		};

		// Generate conversational keywords
		const conversationalKeywords = [
			`where to buy ${category} in ${location}`,
			`${category} suppliers near me ${location}`,
			`${category} dealers ${location}`,
			`${category} stores ${location}`,
			`${category} shops ${location}`,
			`${category} around me ${location}`,
			`${category} near me ${location}`,
			`best ${category} ${location}`,
			`quality ${category} ${location}`,
			`affordable ${category} ${location}`,
			`cheap ${category} ${location}`,
			`${category} for sale ${location}`,
			`${category} marketplace ${location}`,
			`${category} online ${location}`,
			`${category} B2B ${location}`,
			`${category} wholesale ${location}`,
			`${category} bulk ${location}`,
			`${category} business ${location}`,
			`${category} commercial ${location}`,
			`${category} professional ${location}`,
		];

		// Generate "around me" variations
		const aroundMeKeywords = [
			`${category} around me`,
			`${category} near me`,
			`${category} close to me`,
			`${category} nearby`,
			`${category} local`,
			`${category} in my area`,
			`${category} in my city`,
			`${category} in my town`,
			`${category} in my neighborhood`,
			`${category} in my region`,
		];

		// Generate location-specific variations
		const locationVariations = [
			`${category} ${location}`,
			`${category} in ${location}`,
			`${category} at ${location}`,
			`${category} from ${location}`,
			`${category} ${location} suppliers`,
			`${category} ${location} dealers`,
			`${category} ${location} stores`,
			`${category} ${location} shops`,
			`${category} ${location} marketplace`,
			`${category} ${location} B2B`,
		];

		// Combine all keywords
		const allKeywords = [
			...(baseKeywords[category] || []),
			...conversationalKeywords,
			...aroundMeKeywords,
			...locationVariations,
		];

		return [...new Set(allKeywords)]; // Remove duplicates
	};

	// Generate keywords for the specified category
	const keywords = generateLocalKeywords(location, category);

	return (
		<div className="local-keywords-optimization">
			{/* Hidden meta tags for SEO */}
			<meta name="local-keywords" content={keywords.join(", ")} />
			<meta name="location-targeting" content={location} />
			<meta name="category-targeting" content={category} />

			{/* Structured data for local business */}
			<script type="application/ld+json">
				{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "LocalBusiness",
					name: "Carbon Cube Kenya",
					description: `Find ${category} suppliers and dealers in ${location}. Kenya's trusted B2B marketplace.`,
					url: "https://carboncube-ke.com",
					areaServed: {
						"@type": "City",
						name: location,
					},
					serviceType: `${category} marketplace`,
					keywords: keywords.slice(0, 20).join(", "),
					potentialAction: {
						"@type": "SearchAction",
						target: `https://carboncube-ke.com/search?q={search_term_string}&location=${location}&category=${category}`,
						"query-input": "required name=search_term_string",
					},
				})}
			</script>
		</div>
	);
};

export default LocalKeywords;
