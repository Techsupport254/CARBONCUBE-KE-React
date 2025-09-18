/**
 * Centralized API Service for Carbon Cube
 * Provides optimized data fetching using constructed API endpoints
 */

import tokenService from "./tokenService";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

class ApiService {
	constructor() {
		this.cache = new Map();
		this.requestQueue = new Map();
	}

	/**
	 * Get authentication headers
	 */
	getAuthHeaders() {
		const token = tokenService.getToken();

		// Only include Authorization header if we have a valid token
		const headers = {
			"Content-Type": "application/json",
		};

		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		return headers;
	}

	/**
	 * Generic fetch method with caching, request deduplication, and token refresh
	 */
	async fetch(url, options = {}) {
		const cacheKey = `${url}_${JSON.stringify(options)}`;

		// Check cache first
		if (this.cache.has(cacheKey)) {
			const cached = this.cache.get(cacheKey);
			if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
				// 5 minute cache
				return cached.data;
			}
		}

		// Check if request is already in progress
		if (this.requestQueue.has(cacheKey)) {
			return this.requestQueue.get(cacheKey);
		}

		// Create new request
		const requestPromise = this._makeRequest(url, options);
		this.requestQueue.set(cacheKey, requestPromise);

		try {
			const data = await requestPromise;

			// Cache successful response
			this.cache.set(cacheKey, {
				data,
				timestamp: Date.now(),
			});

			return data;
		} finally {
			// Remove from queue
			this.requestQueue.delete(cacheKey);
		}
	}

	/**
	 * Make actual HTTP request with token refresh handling
	 */
	async _makeRequest(url, options = {}) {
		try {
			const response = await fetch(url, {
				headers: this.getAuthHeaders(),
				...options,
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));

				// Handle token expiration
				if (
					response.status === 401 &&
					errorData.error_type === "token_expired"
				) {
					try {
						// Try to refresh the token
						await tokenService.refreshToken();

						// Retry the original request with new token
						const retryResponse = await fetch(url, {
							headers: this.getAuthHeaders(),
							...options,
						});

						if (!retryResponse.ok) {
							throw new Error(
								`API request failed after token refresh: ${retryResponse.status} ${retryResponse.statusText}`
							);
						}

						return retryResponse.json();
					} catch (refreshError) {
						// If refresh fails, clear auth data
						tokenService.clearAuthData();
						throw refreshError;
					}
				}

				// Handle refresh not allowed (remember me not enabled)
				if (
					response.status === 403 &&
					errorData.error_type === "refresh_not_allowed"
				) {
					tokenService.clearAuthData();
					throw new Error("Session expired. Please log in again.");
				}

				throw new Error(
					`API request failed: ${response.status} ${response.statusText}`
				);
			}

			return response.json();
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Clear cache
	 */
	clearCache() {
		this.cache.clear();
	}

	/**
	 * Clear specific cache entry
	 */
	clearCacheEntry(pattern) {
		for (const key of this.cache.keys()) {
			if (key.includes(pattern)) {
				this.cache.delete(key);
			}
		}
	}

	// ==================== BUYER API METHODS ====================

	/**
	 * Fetch ads with optional filtering
	 */
	async getAds(params = {}) {
		const queryParams = new URLSearchParams();

		if (params.per_page) queryParams.set("per_page", params.per_page);
		if (params.page) queryParams.set("page", params.page);
		if (params.balanced) queryParams.set("balanced", params.balanced);
		if (params.category_id) queryParams.set("category_id", params.category_id);
		if (params.subcategory_id)
			queryParams.set("subcategory_id", params.subcategory_id);

		const url = `${API_BASE_URL}/buyer/ads?${queryParams.toString()}`;
		const result = await this.fetch(url);
		return result;
	}

	/**
	 * Search ads with query and filters
	 */
	async searchAds(query, filters = {}) {
		const queryParams = new URLSearchParams();

		queryParams.set("query", query);
		if (filters.category) queryParams.set("category", filters.category);
		if (filters.subcategory)
			queryParams.set("subcategory", filters.subcategory);
		if (filters.page) queryParams.set("page", filters.page);
		if (filters.per_page) queryParams.set("ads_per_page", filters.per_page);

		const url = `${API_BASE_URL}/buyer/ads/search?${queryParams.toString()}`;
		return this.fetch(url);
	}

	/**
	 * Get single ad by ID
	 */
	async getAd(adId) {
		const url = `${API_BASE_URL}/buyer/ads/${adId}`;
		return this.fetch(url);
	}

	/**
	 * Get related ads for an ad
	 */
	async getRelatedAds(adId) {
		const url = `${API_BASE_URL}/buyer/ads/${adId}/related`;
		return this.fetch(url);
	}

	/**
	 * Get seller info for an ad
	 */
	async getAdSeller(adId) {
		const url = `${API_BASE_URL}/buyer/ads/${adId}/seller`;
		return this.fetch(url);
	}

	/**
	 * Get categories
	 */
	async getCategories() {
		const url = `${API_BASE_URL}/buyer/categories`;
		return this.fetch(url);
	}

	/**
	 * Get subcategories
	 */
	async getSubcategories() {
		const url = `${API_BASE_URL}/buyer/subcategories`;
		return this.fetch(url);
	}

	/**
	 * Get category analytics
	 */
	async getCategoryAnalytics() {
		const url = `${API_BASE_URL}/buyer/categories/analytics`;
		return this.fetch(url);
	}

	/**
	 * Load more ads for a subcategory
	 */
	async loadMoreSubcategoryAds(subcategoryId, page = 1) {
		const url = `${API_BASE_URL}/buyer/ads/load_more_subcategory?subcategory_id=${subcategoryId}&page=${page}`;
		return this.fetch(url);
	}

	// ==================== SELLER API METHODS ====================

	/**
	 * Get seller profile
	 */
	async getSellerProfile() {
		const url = `${API_BASE_URL}/seller/profile`;
		return this.fetch(url);
	}

	/**
	 * Update seller profile
	 */
	async updateSellerProfile(profileData) {
		const url = `${API_BASE_URL}/seller/profile`;
		return this.fetch(url, {
			method: "PATCH",
			body: JSON.stringify(profileData),
		});
	}

	/**
	 * Get seller ads
	 */
	async getSellerAds(params = {}) {
		const queryParams = new URLSearchParams();

		if (params.page) queryParams.set("page", params.page);
		if (params.per_page) queryParams.set("per_page", params.per_page);
		if (params.status) queryParams.set("status", params.status);

		const url = `${API_BASE_URL}/seller/ads?${queryParams.toString()}`;
		return this.fetch(url);
	}

	/**
	 * Create new ad
	 */
	async createAd(adData) {
		const url = `${API_BASE_URL}/seller/ads`;
		return this.fetch(url, {
			method: "POST",
			body: JSON.stringify(adData),
		});
	}

	/**
	 * Update ad
	 */
	async updateAd(adId, adData) {
		const url = `${API_BASE_URL}/seller/ads/${adId}`;
		return this.fetch(url, {
			method: "PATCH",
			body: JSON.stringify(adData),
		});
	}

	/**
	 * Delete ad
	 */
	async deleteAd(adId) {
		const url = `${API_BASE_URL}/seller/ads/${adId}`;
		return this.fetch(url, {
			method: "DELETE",
		});
	}

	// ==================== ADMIN API METHODS ====================

	/**
	 * Get admin analytics
	 */
	async getAdminAnalytics() {
		const url = `${API_BASE_URL}/admin/analytics`;
		return this.fetch(url);
	}

	/**
	 * Get all ads for admin
	 */
	async getAdminAds(params = {}) {
		const queryParams = new URLSearchParams();

		if (params.page) queryParams.set("page", params.page);
		if (params.per_page) queryParams.set("per_page", params.per_page);
		if (params.flagged) queryParams.set("flagged", params.flagged);

		const url = `${API_BASE_URL}/admin/ads?${queryParams.toString()}`;
		return this.fetch(url);
	}

	/**
	 * Flag an ad
	 */
	async flagAd(adId) {
		const url = `${API_BASE_URL}/admin/ads/${adId}/flag`;
		return this.fetch(url, {
			method: "PATCH",
		});
	}

	/**
	 * Restore an ad
	 */
	async restoreAd(adId) {
		const url = `${API_BASE_URL}/admin/ads/${adId}/restore`;
		return this.fetch(url, {
			method: "PATCH",
		});
	}

	// ==================== WISHLIST API METHODS ====================

	/**
	 * Get wishlist
	 */
	async getWishlist() {
		const url = `${API_BASE_URL}/buyer/wish_lists`;
		return this.fetch(url);
	}

	/**
	 * Add to wishlist
	 */
	async addToWishlist(adId) {
		const url = `${API_BASE_URL}/buyer/wish_lists`;
		return this.fetch(url, {
			method: "POST",
			body: JSON.stringify({ ad_id: adId }),
		});
	}

	/**
	 * Remove from wishlist
	 */
	async removeFromWishlist(adId) {
		const url = `${API_BASE_URL}/buyer/wish_lists/${adId}`;
		return this.fetch(url, {
			method: "DELETE",
		});
	}

	/**
	 * Get wishlist count
	 */
	async getWishlistCount() {
		const url = `${API_BASE_URL}/buyer/wish_lists/count`;
		return this.fetch(url);
	}

	// ==================== CONVERSATION API METHODS ====================

	/**
	 * Get conversations
	 */
	async getConversations() {
		const url = `${API_BASE_URL}/conversations`;
		return this.fetch(url);
	}

	/**
	 * Get conversation messages
	 */
	async getConversationMessages(conversationId) {
		const url = `${API_BASE_URL}/conversations/${conversationId}/messages`;
		return this.fetch(url);
	}

	/**
	 * Get unread message count
	 */
	async getUnreadMessageCount() {
		const url = `${API_BASE_URL}/conversations/unread_count`;
		return this.fetch(url);
	}

	// ==================== UTILITY METHODS ====================

	/**
	 * Batch fetch multiple endpoints
	 */
	async batchFetch(endpoints) {
		const promises = endpoints.map((endpoint) => this.fetch(endpoint));
		return Promise.all(promises);
	}

	/**
	 * Get public ads (no auth required)
	 */
	async getPublicAds(params = {}) {
		const queryParams = new URLSearchParams();

		if (params.per_page) queryParams.set("per_page", params.per_page);
		if (params.page) queryParams.set("page", params.page);

		const url = `${API_BASE_URL}/ads?${queryParams.toString()}`;

		// Public endpoint doesn't need auth headers
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(
				`Public API request failed: ${response.status} ${response.statusText}`
			);
		}
		return response.json();
	}

	/**
	 * Get best sellers with pagination support
	 * @param {Object} params - Query parameters
	 * @param {number} params.page - Page number
	 * @param {number} params.per_page - Items per page
	 * @param {number} params.limit - Total limit (optional)
	 * @returns {Promise<Object>} Best sellers data
	 */
	async getBestSellers(params = {}) {
		const queryParams = new URLSearchParams();

		if (params.page) queryParams.set("page", params.page);
		if (params.per_page) queryParams.set("per_page", params.per_page);
		if (params.limit) queryParams.set("limit", params.limit);

		const url = `${API_BASE_URL}/best_sellers?${queryParams.toString()}`;
		return this.fetch(url);
	}
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
