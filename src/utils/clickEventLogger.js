// Centralized click event logging utility with internal user detection
import { getDeviceFingerprint, isInternalUser } from "./deviceFingerprint";

// Cache the device fingerprint to avoid regenerating it on every click
let cachedFingerprint = null;
let isInternalUserCached = null;

// Get or generate device fingerprint (async)
const getCachedFingerprint = async () => {
	if (!cachedFingerprint) {
		cachedFingerprint = await getDeviceFingerprint();
	}
	return cachedFingerprint;
};

// Check if current user is internal (cached, async)
const getCachedInternalUserStatus = async () => {
	if (isInternalUserCached === null) {
		const fingerprint = await getCachedFingerprint();
		isInternalUserCached = isInternalUser(fingerprint);
	}
	return isInternalUserCached;
};

// Enhanced click event logging with device fingerprinting
export const logClickEvent = async (
	adId,
	eventType,
	additionalMetadata = {}
) => {
	try {
		// Get device fingerprint
		const fingerprint = await getCachedFingerprint();
		const isInternal = await getCachedInternalUserStatus();

		// Prepare the request payload
		const payload = {
			ad_id: adId,
			event_type: eventType,
			device_hash: fingerprint.hash,
			user_agent: fingerprint.fingerprint.userAgent,
			metadata: {
				...additionalMetadata,
				device_fingerprint: {
					screen_width: fingerprint.fingerprint.screenWidth,
					screen_height: fingerprint.fingerprint.screenHeight,
					platform: fingerprint.fingerprint.platform,
					language: fingerprint.fingerprint.language,
					timezone: fingerprint.fingerprint.timezone,
					hardware_concurrency: fingerprint.fingerprint.hardwareConcurrency,
					is_internal_user: isInternal,
					canvas_hash: fingerprint.fingerprint.canvasFingerprint
						? fingerprint.fingerprint.canvasFingerprint.substring(0, 50) + "..."
						: null,
					webgl_vendor: fingerprint.fingerprint.webglVendor,
					webgl_renderer: fingerprint.fingerprint.webglRenderer,
				},
			},
		};

		// Send to backend
		const backendUrl = process.env.REACT_APP_BACKEND_URL;

		// Prepare headers - include Authorization only if token exists
		const headers = {
			"Content-Type": "application/json",
		};

		const token = localStorage.getItem("token");
		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		const response = await fetch(`${backendUrl}/click_events`, {
			method: "POST",
			headers,
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			// Silently handle failed requests - don't spam console
			return false;
		}

		// Note: result variable removed as it was unused
		return true;
	} catch (error) {
		// Silently handle errors - don't spam console
		return false;
	}
};

// Log ad search events
export const logAdSearch = async (
	searchQuery,
	searchCategory,
	searchSubcategory
) => {
	try {
		const fingerprint = getCachedFingerprint();
		const isInternal = getCachedInternalUserStatus();

		const payload = {
			search_term: searchQuery,
			metadata: {
				category: searchCategory,
				subcategory: searchSubcategory,
				device_hash: fingerprint.hash,
				is_internal_user: isInternal,
			},
		};

		const backendUrl = process.env.REACT_APP_BACKEND_URL;
		const response = await fetch(`${backendUrl}/ad_searches`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			// Silently handle failed requests - don't spam console
			return false;
		}

		return response.ok;
	} catch (error) {
		// Silently handle errors - don't spam console
		return false;
	}
};

// Log subcategory clicks
export const logSubcategoryClick = async (subcategory, category) => {
	try {
		const fingerprint = getCachedFingerprint();
		const isInternal = getCachedInternalUserStatus();

		const payload = {
			subcategory: subcategory,
			category: category,
			metadata: {
				device_hash: fingerprint.hash,
				is_internal_user: isInternal,
			},
		};

		const backendUrl = process.env.REACT_APP_BACKEND_URL;
		const response = await fetch(`${backendUrl}/subcategory_clicks`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			// Silently handle failed requests - don't spam console
			return false;
		}

		return response.ok;
	} catch (error) {
		// Silently handle errors - don't spam console
		return false;
	}
};

// Initialize device fingerprinting on app startup
export const initializeDeviceFingerprinting = async () => {
	try {
		const fingerprint = await getCachedFingerprint();
		const isInternal = await getCachedInternalUserStatus();

		return { fingerprint, isInternal };
	} catch (error) {
		console.error("Error initializing device fingerprinting:", error);
		return { fingerprint: null, isInternal: false };
	}
};

// Get current device information (for debugging)
export const getDeviceInfo = async () => {
	const fingerprint = await getCachedFingerprint();
	return {
		hash: fingerprint.hash,
		isInternalUser: await getCachedInternalUserStatus(),
		userAgent: fingerprint.fingerprint.userAgent,
		screenResolution: `${fingerprint.fingerprint.screenWidth}x${fingerprint.fingerprint.screenHeight}`,
		platform: fingerprint.fingerprint.platform,
		language: fingerprint.fingerprint.language,
		timezone: fingerprint.fingerprint.timezone,
	};
};
