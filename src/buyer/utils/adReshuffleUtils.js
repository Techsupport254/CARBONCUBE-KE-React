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
 * Intelligent auto-reshuffle manager that adapts to user behavior
 */
export class AutoReshuffleManager {
	constructor() {
		this.intervals = [];
		this.timeouts = [];
		this.isActive = false;
		this.lastActivity = Date.now();
		this.reshuffleCount = 0;
		this.sessionStartTime = Date.now();

		// Configuration based on industry best practices
		this.config = {
			// Initial reshuffle after page load
			initialDelay: 300000, // 5 minutes

			// Progressive intervals (get longer over time)
			progressiveIntervals: [
				{ duration: 600000, maxReshuffles: 3 }, // 10 minutes for first 3 reshuffles
				{ duration: 1200000, maxReshuffles: 5 }, // 20 minutes for next 5
				{ duration: 1800000, maxReshuffles: 10 }, // 30 minutes for remaining
			],

			// User activity thresholds
			inactivityThreshold: 300000, // 5 minutes of inactivity
			scrollThreshold: 100, // pixels scrolled
			maxSessionTime: 30 * 60 * 1000, // 30 minutes max session

			// Behavioral triggers
			reshuffleOnInactivity: true,
			reshuffleOnScrollPause: false, // Disabled to prevent flashy behavior
			reshuffleOnTabFocus: false,
		};
	}

	/**
	 * Start the auto-reshuffle system
	 * @param {Function} reshuffleCallback - Function to call for reshuffling
	 * @param {Object} options - Additional options
	 */
	start(reshuffleCallback, options = {}) {
		if (this.isActive) return;
		this.isActive = true;

		const { userBehavior = {}, onReshuffleStart, onReshuffleEnd } = options;

		// Initial reshuffle after page load
		this.scheduleReshuffle(reshuffleCallback, this.config.initialDelay, {
			type: "initial",
			userBehavior,
			onStart: onReshuffleStart,
			onEnd: onReshuffleEnd,
		});

		// Set up activity tracking
		this.setupActivityTracking(reshuffleCallback, {
			userBehavior,
			onReshuffleStart,
			onReshuffleEnd,
		});

		// Set up progressive interval reshuffling
		this.setupProgressiveReshuffling(reshuffleCallback, {
			userBehavior,
			onReshuffleStart,
			onReshuffleEnd,
		});
	}

	/**
	 * Schedule a single reshuffle
	 */
	scheduleReshuffle(callback, delay, options = {}) {
		const timeoutId = setTimeout(async () => {
			const { type, userBehavior, onStart, onEnd } = options;

			try {
				if (onStart) onStart(type);
				await callback({
					trigger: type,
					userBehavior,
					timestamp: Date.now(),
					sessionDuration: Date.now() - this.sessionStartTime,
				});
				this.reshuffleCount++;
				if (onEnd) onEnd(type);
			} catch (error) {
				console.error("AutoReshuffleManager: Reshuffle failed:", error);
			}
		}, delay);

		this.timeouts.push(timeoutId);
		return timeoutId;
	}

	/**
	 * Set up activity-based reshuffling
	 */
	setupActivityTracking(callback, options) {
		const { userBehavior, onReshuffleStart, onReshuffleEnd } = options;
		let scrollTimeout;
		let lastScrollY = window.scrollY;

		// Track user activity
		const activityEvents = [
			"mousedown",
			"mousemove",
			"keypress",
			"touchstart",
			"click",
		];

		const handleActivity = () => {
			this.lastActivity = Date.now();
		};

		// Add activity listeners
		activityEvents.forEach((event) => {
			document.addEventListener(event, handleActivity, { passive: true });
		});

		// Scroll-based reshuffling
		if (this.config.reshuffleOnScrollPause) {
			const handleScroll = () => {
				clearTimeout(scrollTimeout);
				const currentScrollY = window.scrollY;
				const scrollDelta = Math.abs(currentScrollY - lastScrollY);

				if (scrollDelta > this.config.scrollThreshold) {
					scrollTimeout = setTimeout(() => {
						// Reshuffle after scroll pause
						this.scheduleReshuffle(callback, 5000, {
							type: "scroll_pause",
							userBehavior,
							onStart: onReshuffleStart,
							onEnd: onReshuffleEnd,
						});
					}, 60000); // Wait 1 minute after scrolling stops
				}

				lastScrollY = currentScrollY;
			};

			window.addEventListener("scroll", handleScroll, { passive: true });
		}

		// Inactivity-based reshuffling
		if (this.config.reshuffleOnInactivity) {
			const inactivityInterval = setInterval(() => {
				const timeSinceActivity = Date.now() - this.lastActivity;
				const sessionDuration = Date.now() - this.sessionStartTime;

				// Only reshuffle if user has been inactive and session isn't too long
				if (
					timeSinceActivity > this.config.inactivityThreshold &&
					sessionDuration < this.config.maxSessionTime &&
					this.reshuffleCount < 10
				) {
					// Max 10 inactivity reshuffles per session

					this.scheduleReshuffle(callback, 0, {
						type: "inactivity",
						userBehavior,
						onStart: onReshuffleStart,
						onEnd: onReshuffleEnd,
					});
				}
			}, 120000); // Check every 2 minutes

			this.intervals.push(inactivityInterval);
		}

		// Tab focus reshuffling
		if (this.config.reshuffleOnTabFocus) {
			const handleVisibilityChange = () => {
				if (!document.hidden) {
					// User returned to tab
					const timeAway = Date.now() - this.lastActivity;
					if (timeAway > 60000) {
						// If away for more than 1 minute
						this.scheduleReshuffle(callback, 1000, {
							type: "tab_focus",
							userBehavior,
							onStart: onReshuffleStart,
							onEnd: onReshuffleEnd,
						});
					}
				}
			};

			document.addEventListener("visibilitychange", handleVisibilityChange);
		}
	}

	/**
	 * Set up progressive interval reshuffling
	 */
	setupProgressiveReshuffling(callback, options) {
		const { userBehavior, onReshuffleStart, onReshuffleEnd } = options;

		let currentIntervalIndex = 0;
		let reshufflesInCurrentInterval = 0;

		const scheduleNextProgressive = () => {
			if (currentIntervalIndex >= this.config.progressiveIntervals.length)
				return;

			const currentConfig =
				this.config.progressiveIntervals[currentIntervalIndex];

			if (reshufflesInCurrentInterval >= currentConfig.maxReshuffles) {
				// Move to next interval
				currentIntervalIndex++;
				reshufflesInCurrentInterval = 0;

				if (currentIntervalIndex >= this.config.progressiveIntervals.length)
					return;
			}

			const intervalId = setInterval(() => {
				const sessionDuration = Date.now() - this.sessionStartTime;

				// Stop if session is too long
				if (sessionDuration > this.config.maxSessionTime) {
					clearInterval(intervalId);
					return;
				}

				this.scheduleReshuffle(callback, 0, {
					type: "progressive",
					userBehavior,
					onStart: onReshuffleStart,
					onEnd: onReshuffleEnd,
				});

				reshufflesInCurrentInterval++;

				// Check if we need to move to next interval
				if (reshufflesInCurrentInterval >= currentConfig.maxReshuffles) {
					clearInterval(intervalId);
					currentIntervalIndex++;
					reshufflesInCurrentInterval = 0;

					// Schedule next progressive reshuffle if available
					setTimeout(scheduleNextProgressive, 1000);
				}
			}, currentConfig.duration);

			this.intervals.push(intervalId);
		};

		// Start after initial delay
		setTimeout(scheduleNextProgressive, this.config.initialDelay);
	}

	/**
	 * Stop the auto-reshuffle system
	 */
	stop() {
		if (!this.isActive) return;

		this.isActive = false;

		// Clear all intervals
		this.intervals.forEach((intervalId) => clearInterval(intervalId));
		this.intervals = [];

		// Clear all timeouts
		this.timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
		this.timeouts = [];
	}

	/**
	 * Get current status
	 */
	getStatus() {
		return {
			isActive: this.isActive,
			reshuffleCount: this.reshuffleCount,
			sessionDuration: Date.now() - this.sessionStartTime,
			timeSinceLastActivity: Date.now() - this.lastActivity,
			activeIntervals: this.intervals.length,
			activeTimeouts: this.timeouts.length,
		};
	}
}

/**
 * Enhanced smart reshuffle with more sophisticated algorithms
 */
export const enhancedSmartReshuffle = (
	organizedAds,
	userBehavior = {},
	sessionContext = {},
	options = {}
) => {
	const {
		preferredCategories = [],
		clickedAds = [],
		avoidedAds = [],
		timeOnPage = 0,
		sessionDuration = 0,
		scrollDepth = 0,
		trigger = "unknown",
	} = userBehavior;

	// Dynamic strategy based on trigger type and user behavior
	let strategy = {
		considerRecency: true,
		considerPopularity: true,
		considerUserPreferences: true,
		boostClickedItems: false,
		randomizationFactor: 0.3,
	};

	// Adjust strategy based on trigger
	switch (trigger) {
		case "initial":
			// Initial load: balanced approach
			strategy.randomizationFactor = 0.2;
			break;
		case "inactivity":
			// User inactive: introduce more variety
			strategy.randomizationFactor = 0.8;
			strategy.considerRecency = timeOnPage > 60000; // Only if user engaged
			break;
		case "scroll_pause":
			// User scrolling: boost popular items
			strategy.considerPopularity = true;
			strategy.randomizationFactor = 0.1;
			break;
		case "progressive":
			// Regular reshuffle: maintain engagement
			strategy.randomizationFactor = 0.4;
			strategy.boostClickedItems = clickedAds.length > 0;
			break;
		default:
			strategy.randomizationFactor = 0.3;
	}

	// Adjust based on session duration
	if (sessionDuration > 600000) {
		// 10 minutes
		strategy.considerRecency = false; // Focus on fresh content for long sessions
		strategy.randomizationFactor = 0.6;
	}

	// Apply intelligent boosting
	const boostedAds = {};
	Object.keys(organizedAds).forEach((subcategoryId) => {
		const ads = organizedAds[subcategoryId];
		if (Array.isArray(ads)) {
			boostedAds[subcategoryId] = ads.map((ad) => {
				let boostScore = 0;

				// Category preferences
				if (strategy.considerUserPreferences) {
					const isPreferred = preferredCategories.includes(ad.category_name);
					if (isPreferred) boostScore += 0.3;
				}

				// Clicked items (for progressive reshuffles)
				if (strategy.boostClickedItems) {
					const isClicked = clickedAds.includes(ad.id);
					if (isClicked) boostScore += 0.2;
				}

				// Avoid recently avoided items
				const isAvoided = avoidedAds.includes(ad.id);
				if (isAvoided) boostScore -= 0.5;

				// Recency bonus
				if (strategy.considerRecency && ad.created_at) {
					const daysSinceCreation =
						(Date.now() - new Date(ad.created_at)) / (1000 * 60 * 60 * 24);
					if (daysSinceCreation < 7) boostScore += 0.2; // Boost very recent items
				}

				// Popularity bonus
				if (strategy.considerPopularity) {
					const rating = ad.rating || ad.mean_rating || ad.average_rating || 0;
					const reviewCount =
						ad.review_count || ad.reviews_count || ad.total_reviews || 0;
					boostScore += rating * 0.1 + Math.min(reviewCount, 20) * 0.01;
				}

				// Randomization to prevent predictability
				boostScore += (Math.random() - 0.5) * strategy.randomizationFactor;

				return {
					...ad,
					_boostScore: boostScore,
				};
			});

			// Sort by boost score (highest first)
			boostedAds[subcategoryId].sort(
				(a, b) => (b._boostScore || 0) - (a._boostScore || 0)
			);
		}
	});

	const result = reshuffleOrganizedAds(boostedAds, {
		...options,
		randomSeed: Date.now(),
		considerRecency: strategy.considerRecency,
		considerPopularity: strategy.considerPopularity,
	});

	return result;
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
