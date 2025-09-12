/**
 * Ad Reshuffling Utilities
 * Provides intelligent reshuffling of ads while maintaining business logic
 */

// Helper function to get tier priority (higher number = higher priority)
const getTierPriority = (ad) => {
	const tier = ad.seller_tier || 1; // Default to Free (1) if no tier
	// Premium = 4, Standard = 3, Basic = 2, Free = 1
	return tier;
};

// Helper function to get tier name from priority
const getTierName = (tierPriority) => {
	const tierMap = {
		4: "Premium",
		3: "Standard",
		2: "Basic",
		1: "Free",
	};
	return tierMap[tierPriority] || "Free";
};

/**
 * Shuffles ads within each tier while maintaining tier priority
 * @param {Array} ads - Array of ads to shuffle
 * @param {Object} options - Shuffling options
 * @returns {Array} Shuffled ads array
 */
export const shuffleAdsByTier = (ads, options = {}) => {
	const {
		shuffleWithinTier = true,
		considerRecency = true,
		considerPopularity = true,
		randomSeed = null,
	} = options;

	if (!Array.isArray(ads) || ads.length === 0) {
		return [];
	}

	// Group ads by tier
	const adsByTier = {};
	ads.forEach((ad) => {
		const tier = getTierPriority(ad);
		if (!adsByTier[tier]) {
			adsByTier[tier] = [];
		}
		adsByTier[tier].push(ad);
	});

	// Sort tiers in descending order (Premium first)
	const sortedTiers = Object.keys(adsByTier)
		.map(Number)
		.sort((a, b) => b - a);

	const shuffledAds = [];

	sortedTiers.forEach((tier) => {
		let tierAds = [...adsByTier[tier]];

		if (shuffleWithinTier) {
			// Apply intelligent shuffling within tier
			tierAds = intelligentShuffle(tierAds, {
				considerRecency,
				considerPopularity,
				randomSeed: randomSeed ? randomSeed + tier : null,
			});
		}

		shuffledAds.push(...tierAds);
	});

	return shuffledAds;
};

/**
 * Intelligent shuffling algorithm that considers multiple factors
 * @param {Array} ads - Ads to shuffle
 * @param {Object} options - Shuffling options
 * @returns {Array} Intelligently shuffled ads
 */
const intelligentShuffle = (ads, options = {}) => {
	const {
		considerRecency = true,
		considerPopularity = true,
		randomSeed = null,
	} = options;

	if (ads.length <= 1) return ads;

	// Create a seeded random number generator
	const seededRandom = randomSeed
		? createSeededRandom(randomSeed)
		: Math.random;

	// Calculate scores for each ad
	const adsWithScores = ads.map((ad) => {
		let score = 0;

		// Recency factor (newer ads get higher scores)
		if (considerRecency && ad.created_at) {
			const daysSinceCreation =
				(Date.now() - new Date(ad.created_at)) / (1000 * 60 * 60 * 24);
			score += Math.max(0, 30 - daysSinceCreation) * 0.1; // Decay over 30 days
		}

		// Popularity factor (higher ratings/reviews get higher scores)
		if (considerPopularity) {
			const rating = ad.rating || ad.mean_rating || ad.average_rating || 0;
			const reviewCount =
				ad.review_count || ad.reviews_count || ad.total_reviews || 0;
			score += rating * 0.2; // Rating weight
			score += Math.min(reviewCount, 50) * 0.01; // Review count weight (capped at 50)
		}

		// Add random factor to prevent deterministic ordering
		score += seededRandom() * 0.5;

		return { ad, score };
	});

	// Sort by score (higher scores first)
	adsWithScores.sort((a, b) => b.score - a.score);

	// Apply additional randomization to top performers
	const topPerformers = adsWithScores.slice(
		0,
		Math.min(4, adsWithScores.length)
	);
	const remainingAds = adsWithScores.slice(topPerformers.length);

	// Shuffle top performers slightly
	const shuffledTopPerformers = fisherYatesShuffle(
		[...topPerformers],
		seededRandom
	);

	// Combine shuffled top performers with remaining ads
	return [...shuffledTopPerformers, ...remainingAds].map((item) => item.ad);
};

/**
 * Fisher-Yates shuffle algorithm with seeded random
 * @param {Array} array - Array to shuffle
 * @param {Function} randomFn - Random number generator function
 * @returns {Array} Shuffled array
 */
const fisherYatesShuffle = (array, randomFn = Math.random) => {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(randomFn() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
};

/**
 * Creates a seeded random number generator
 * @param {number} seed - Seed value
 * @returns {Function} Seeded random function
 */
const createSeededRandom = (seed) => {
	let currentSeed = seed;
	return () => {
		currentSeed = (currentSeed * 9301 + 49297) % 233280;
		return currentSeed / 233280;
	};
};

/**
 * Reshuffles ads in organized structure by subcategory
 * @param {Object} organizedAds - Ads organized by subcategory ID
 * @param {Object} options - Reshuffling options
 * @returns {Object} Reshuffled organized ads
 */
export const reshuffleOrganizedAds = (organizedAds, options = {}) => {
	const reshuffledAds = {};
	const randomSeed = options.randomSeed || Date.now();

	Object.keys(organizedAds).forEach((subcategoryId) => {
		const subcategoryAds = organizedAds[subcategoryId];
		if (Array.isArray(subcategoryAds) && subcategoryAds.length > 0) {
			reshuffledAds[subcategoryId] = shuffleAdsByTier(subcategoryAds, {
				...options,
				randomSeed: randomSeed + parseInt(subcategoryId),
			});
		}
	});

	return reshuffledAds;
};

/**
 * Creates a reshuffle trigger with debouncing
 * @param {Function} reshuffleFunction - Function to call for reshuffling
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced reshuffle function
 */
export const createDebouncedReshuffle = (reshuffleFunction, delay = 1000) => {
	let timeoutId;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			reshuffleFunction(...args);
		}, delay);
	};
};

/**
 * Smart reshuffle that considers user behavior
 * @param {Object} organizedAds - Current organized ads
 * @param {Object} userBehavior - User behavior data
 * @param {Object} options - Reshuffling options
 * @returns {Object} Smart reshuffled ads
 */
export const smartReshuffle = (
	organizedAds,
	userBehavior = {},
	options = {}
) => {
	const {
		preferredCategories = [],
		clickedAds = [],
		avoidedAds = [],
		timeOnPage = 0,
	} = userBehavior;

	// Adjust shuffling strategy based on user behavior
	const shuffleOptions = {
		...options,
		considerRecency: timeOnPage > 30000, // Consider recency if user spent > 30s
		considerPopularity: clickedAds.length > 0, // Consider popularity if user clicked ads
		randomSeed: Date.now(),
	};

	// Boost ads from preferred categories
	const boostedAds = {};
	Object.keys(organizedAds).forEach((subcategoryId) => {
		const ads = organizedAds[subcategoryId];
		if (Array.isArray(ads)) {
			boostedAds[subcategoryId] = ads.map((ad) => {
				const isPreferred = preferredCategories.includes(ad.category_name);
				const isClicked = clickedAds.includes(ad.id);
				const isAvoided = avoidedAds.includes(ad.id);

				return {
					...ad,
					_boostScore:
						(isPreferred ? 0.3 : 0) +
						(isClicked ? 0.2 : 0) -
						(isAvoided ? 0.5 : 0),
				};
			});
		}
	});

	return reshuffleOrganizedAds(boostedAds, shuffleOptions);
};

/**
 * Get reshuffle statistics for debugging
 * @param {Object} originalAds - Original organized ads
 * @param {Object} reshuffledAds - Reshuffled organized ads
 * @returns {Object} Reshuffle statistics
 */
export const getReshuffleStats = (originalAds, reshuffledAds) => {
	const stats = {
		totalSubcategories: 0,
		totalAds: 0,
		shuffledSubcategories: 0,
		tierDistribution: {},
		changes: [],
	};

	Object.keys(reshuffledAds).forEach((subcategoryId) => {
		stats.totalSubcategories++;
		const ads = reshuffledAds[subcategoryId];
		stats.totalAds += ads.length;

		// Check if order changed
		const originalSubcategoryAds = originalAds[subcategoryId] || [];
		const orderChanged =
			JSON.stringify(originalSubcategoryAds.map((a) => a.id)) !==
			JSON.stringify(ads.map((a) => a.id));

		if (orderChanged) {
			stats.shuffledSubcategories++;
		}

		// Track tier distribution
		ads.forEach((ad) => {
			const tier = getTierName(getTierPriority(ad));
			stats.tierDistribution[tier] = (stats.tierDistribution[tier] || 0) + 1;
		});

		if (orderChanged) {
			stats.changes.push({
				subcategoryId,
				originalOrder: originalSubcategoryAds.map((a) => a.id),
				newOrder: ads.map((a) => a.id),
			});
		}
	});

	return stats;
};
