// Utility functions for handling image URLs

/**
 * Checks if a URL is valid and absolute
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL is valid and absolute
 */
export const isValidImageUrl = (url) => {
	if (!url || typeof url !== "string") return false;

	// Check if it's a relative path (starts with / or doesn't have protocol)
	if (url.startsWith("/") || !url.match(/^https?:\/\//)) {
		return false;
	}

	// Check if it's a data URI
	if (url.startsWith("data:")) {
		return true;
	}

	return true;
};

/**
 * Gets a valid image URL or fallback
 * @param {string} url - The URL to validate
 * @returns {string} - Valid URL or fallback image
 */
export const getValidImageUrl = (url) => {
	if (!url || typeof url !== "string") {
		return getFallbackImage();
	}

	const cleanUrl = url.replace(/\n/g, "").trim();

	if (!isValidImageUrl(cleanUrl)) {
		return getFallbackImage();
	}

	return cleanUrl;
};

/**
 * Returns a fallback image (SVG data URI)
 * @returns {string} - SVG data URI for no image
 */
export const getFallbackImage = () => {
	return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTgwIDEwNUwxNTAgMTM1TDEyMCAxMDVMMTUwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
};

/**
 * Gets the best available image URL from an ad object
 * @param {Object} ad - The ad object
 * @returns {string} - Valid image URL or fallback
 */
export const getAdImageUrl = (ad) => {
	if (!ad) return getFallbackImage();

	// Try first_media_url
	if (ad.first_media_url) {
		const url = getValidImageUrl(ad.first_media_url);
		if (url !== getFallbackImage()) return url;
	}

	// Try media_urls array
	if (
		ad.media_urls &&
		Array.isArray(ad.media_urls) &&
		ad.media_urls.length > 0
	) {
		const url = getValidImageUrl(ad.media_urls[0]);
		if (url !== getFallbackImage()) return url;
	}

	// Try media array
	if (ad.media && Array.isArray(ad.media) && ad.media.length > 0) {
		const url = getValidImageUrl(ad.media[0]);
		if (url !== getFallbackImage()) return url;
	}

	return getFallbackImage();
};
