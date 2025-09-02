// Device fingerprinting utility for identifying internal users
// This creates a unique fingerprint based on device characteristics

// Cookie helpers for redundant persistence
const COOKIE_NAME = "device_uuid_v1";
const COOKIE_MAX_AGE_DAYS = 730; // ~2 years

const getCookie = (name) => {
	try {
		const match = document.cookie.match(
			new RegExp("(^| )" + name + "=([^;]+)")
		);
		return match ? decodeURIComponent(match[2]) : null;
	} catch (_) {
		return null;
	}
};

const setCookie = (name, value, days = COOKIE_MAX_AGE_DAYS) => {
	try {
		const expires = new Date(
			Date.now() + days * 24 * 60 * 60 * 1000
		).toUTCString();
		document.cookie = `${name}=${encodeURIComponent(
			value
		)}; expires=${expires}; path=/; SameSite=Lax`;
	} catch (_) {}
};

// IndexedDB helpers for durable backup of the device UUID
const IDB_DB_NAME = "carbon_device";
const IDB_STORE = "kv";
const IDB_KEY = "device_uuid_v1";

const idbOpen = () =>
	new Promise((resolve) => {
		try {
			const req = indexedDB.open(IDB_DB_NAME, 1);
			req.onupgradeneeded = () => {
				const db = req.result;
				if (!db.objectStoreNames.contains(IDB_STORE)) {
					db.createObjectStore(IDB_STORE);
				}
			};
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => resolve(null);
		} catch (_) {
			resolve(null);
		}
	});

const idbGet = async (key) => {
	try {
		const db = await idbOpen();
		if (!db) return null;
		return await new Promise((resolve) => {
			const tx = db.transaction(IDB_STORE, "readonly");
			const store = tx.objectStore(IDB_STORE);
			const req = store.get(key);
			req.onsuccess = () => resolve(req.result || null);
			req.onerror = () => resolve(null);
		});
	} catch (_) {
		return null;
	}
};

const idbSet = async (key, value) => {
	try {
		const db = await idbOpen();
		if (!db) return false;
		return await new Promise((resolve) => {
			const tx = db.transaction(IDB_STORE, "readwrite");
			const store = tx.objectStore(IDB_STORE);
			const req = store.put(value, key);
			req.onsuccess = () => resolve(true);
			req.onerror = () => resolve(false);
		});
	} catch (_) {
		return false;
	}
};

// Generate or load a persistent per-device UUID (scoped to this browser profile)
const getOrCreateDeviceId = () => {
	try {
		const storageKey = "device_uuid_v1";
		// 1) Try cookie first (survives localStorage/sessionStorage clears if cookies remain)
		let deviceId = getCookie(COOKIE_NAME);
		if (deviceId) {
			try {
				if (!localStorage.getItem(storageKey))
					localStorage.setItem(storageKey, deviceId);
			} catch (_) {}
			// backfill IDB asynchronously
			idbSet(IDB_KEY, deviceId);
			return deviceId;
		}

		// 2) Fallback to localStorage
		deviceId = localStorage.getItem(storageKey);
		if (!deviceId) {
			if (window.crypto && typeof window.crypto.randomUUID === "function") {
				deviceId = window.crypto.randomUUID();
			} else {
				const bytes =
					window.crypto && window.crypto.getRandomValues
						? window.crypto.getRandomValues(new Uint8Array(16))
						: Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));
				bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
				bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
				const toHex = (n) => n.toString(16).padStart(2, "0");
				deviceId =
					toHex(bytes[0]) +
					toHex(bytes[1]) +
					toHex(bytes[2]) +
					toHex(bytes[3]) +
					"-" +
					toHex(bytes[4]) +
					toHex(bytes[5]) +
					"-" +
					toHex(bytes[6]) +
					toHex(bytes[7]) +
					"-" +
					toHex(bytes[8]) +
					toHex(bytes[9]) +
					"-" +
					toHex(bytes[10]) +
					toHex(bytes[11]) +
					toHex(bytes[12]) +
					toHex(bytes[13]) +
					toHex(bytes[14]) +
					toHex(bytes[15]);
			}
			try {
				localStorage.setItem(storageKey, deviceId);
			} catch (_) {}
			setCookie(COOKIE_NAME, deviceId);
			idbSet(IDB_KEY, deviceId);
		}
		// Ensure cookie exists if only localStorage had it
		setCookie(COOKIE_NAME, deviceId);
		// Ensure IDB holds a copy
		idbSet(IDB_KEY, deviceId);
		return deviceId;
	} catch (e) {
		const fallback =
			"dev-" +
			Date.now().toString(36) +
			"-" +
			Math.random().toString(36).slice(2, 10);
		try {
			localStorage.setItem("device_uuid_v1", fallback);
		} catch (_) {}
		setCookie(COOKIE_NAME, fallback);
		idbSet(IDB_KEY, fallback);
		return fallback;
	}
};

// Background recovery: if both cookie and localStorage are missing but IndexedDB has the ID,
// restore silently to maintain stability across clears.
(async () => {
	try {
		let lsVal = null;
		try {
			lsVal = localStorage.getItem("device_uuid_v1");
		} catch (_) {}
		const ckVal = getCookie(COOKIE_NAME);
		if (!lsVal && !ckVal) {
			const saved = await idbGet(IDB_KEY);
			if (saved) {
				try {
					localStorage.setItem("device_uuid_v1", saved);
				} catch (_) {}
				setCookie(COOKIE_NAME, saved);
			}
		}
	} catch (_) {}
})();

export const generateDeviceFingerprint = () => {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	// Basic device characteristics
	const fingerprint = {
		// Screen properties
		screenWidth: window.screen.width,
		screenHeight: window.screen.height,
		screenColorDepth: window.screen.colorDepth,
		screenPixelDepth: window.screen.pixelDepth,

		// Window properties
		windowWidth: window.innerWidth,
		windowHeight: window.innerHeight,
		windowDevicePixelRatio: window.devicePixelRatio,

		// Browser properties
		userAgent: navigator.userAgent,
		language: navigator.language,
		languages: navigator.languages ? navigator.languages.join(",") : "",
		platform: navigator.platform,
		cookieEnabled: navigator.cookieEnabled,
		doNotTrack: navigator.doNotTrack,

		// Hardware properties
		hardwareConcurrency: navigator.hardwareConcurrency,
		maxTouchPoints: navigator.maxTouchPoints,

		// Canvas fingerprint
		canvasFingerprint: null,

		// Timezone
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

		// Font detection removed for cross-browser consistency
		// fonts: getAvailableFonts(),

		// WebGL properties
		webglVendor: null,
		webglRenderer: null,

		// Audio fingerprint (removed for stability)
		// audioFingerprint: null,

		// Timestamp for uniqueness
		timestamp: Date.now(),
	};

	// Generate stable canvas fingerprint that works across all browsers
	try {
		canvas.width = 200;
		canvas.height = 50;
		ctx.textBaseline = "top";
		ctx.font = "14px Arial";
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, 200, 50);
		ctx.fillStyle = "#ffffff";
		ctx.fillText("Device fingerprint test 0123456789", 2, 2);
		ctx.fillText("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 2, 20);
		ctx.fillText("abcdefghijklmnopqrstuvwxyz", 2, 38);

		// Get pixel data for more stable fingerprint
		const imageData = ctx.getImageData(0, 0, 200, 50);
		const pixels = imageData.data;
		let hash = 0;
		// Use a more stable hashing approach - sample every 10th pixel
		for (let i = 0; i < pixels.length; i += 40) {
			hash = ((hash << 5) - hash + pixels[i]) & 0xffffffff;
		}
		fingerprint.canvasFingerprint = hash.toString(36);
	} catch (e) {
		fingerprint.canvasFingerprint = "canvas_not_supported";
	}

	// Generate WebGL fingerprint (consistent across browsers)
	try {
		const canvas3d = document.createElement("canvas");
		const gl =
			canvas3d.getContext("webgl") || canvas3d.getContext("experimental-webgl");
		if (gl) {
			const vendor = gl.getParameter(gl.VENDOR);
			const renderer = gl.getParameter(gl.RENDERER);
			const version = gl.getParameter(gl.VERSION);
			const shadingLanguageVersion = gl.getParameter(
				gl.SHADING_LANGUAGE_VERSION
			);

			fingerprint.webglVendor = vendor || "unknown";
			fingerprint.webglRenderer = renderer || "unknown";
			fingerprint.webglVersion = version || "unknown";
			fingerprint.webglShadingVersion = shadingLanguageVersion || "unknown";
		} else {
			fingerprint.webglVendor = "webgl_not_supported";
			fingerprint.webglRenderer = "webgl_not_supported";
			fingerprint.webglVersion = "webgl_not_supported";
			fingerprint.webglShadingVersion = "webgl_not_supported";
		}
	} catch (e) {
		fingerprint.webglVendor = "webgl_not_supported";
		fingerprint.webglRenderer = "webgl_not_supported";
		fingerprint.webglVersion = "webgl_not_supported";
		fingerprint.webglShadingVersion = "webgl_not_supported";
	}

	// Audio fingerprint removed for stability
	// Audio context can produce inconsistent results

	// Create a truly unique and stable device fingerprint that works across all browsers
	// Using the most reliable hardware characteristics available via web APIs
	const uniqueDeviceFingerprint = {
		// Core hardware characteristics (most reliable across browsers)
		screenWidth: fingerprint.screenWidth,
		screenHeight: fingerprint.screenHeight,
		hardwareConcurrency: fingerprint.hardwareConcurrency,
	};

	// Note: advancedHardwareFingerprint variable removed as it was unused

	const fingerprintString = JSON.stringify(fingerprint);
	const uniqueFingerprintString = JSON.stringify(uniqueDeviceFingerprint);
	// Note: advancedFingerprintString variable removed as it was unused

	// Primary identifier: persistent per-device UUID
	const deviceId = getOrCreateDeviceId();

	return {
		fingerprint: fingerprint,
		// Use persistent UUID as the primary identifier
		hash: deviceId,
		id: deviceId,
		string: fingerprintString,
		uniqueString: uniqueFingerprintString,
	};
};

// Helper: detect UUID-like value
const isUuidLike = (value) => {
	if (!value || typeof value !== "string") return false;
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
		value
	);
};

// Note: simpleHash function removed as it was unused

// Note: getAvailableFonts function removed as it was unused

// Check if device matches internal user patterns
export const isInternalUser = (fingerprint) => {
	const internalPatterns = [
		// Development tools and testing frameworks
		/Chrome-Lighthouse/i,
		/Chrome.*Headless/i,
		/PhantomJS/i,
		/Selenium/i,
		/Puppeteer/i,
		/Playwright/i,
		/Cypress/i,
		/Jest/i,
		/TestCafe/i,

		// Specific internal company patterns (customize these)
		/CarbonCube.*Internal/i,
		/Company.*Device/i,
		/Internal.*Browser/i,
		/Internal.*Testing/i,
		/QA.*Browser/i,
		/Test.*Environment/i,
	];

	// Check user agent
	const userAgent = fingerprint.fingerprint.userAgent;
	for (const pattern of internalPatterns) {
		if (pattern.test(userAgent)) {
			return true;
		}
	}

	// Check for development environment indicators
	// Only localhost users are automatically excluded
	if (
		window.location.hostname === "localhost" ||
		window.location.hostname === "127.0.0.1"
	) {
		return true;
	}

	// Check for specific screen resolutions common in development
	// Only for very specific development setups
	const { screenWidth, screenHeight } = fingerprint.fingerprint;

	// Only flag as internal if it's a very specific development setup
	// (e.g., high-res monitor with specific characteristics)
	if (
		screenWidth === 2560 &&
		screenHeight === 1440 &&
		fingerprint.fingerprint.hardwareConcurrency >= 16
	) {
		// This is likely a high-end development machine
		return true;
	}

	return false;
};

// Store fingerprint in localStorage for consistency
export const getStoredFingerprint = () => {
	const stored = localStorage.getItem("deviceFingerprint");
	if (stored) {
		try {
			return JSON.parse(stored);
		} catch (e) {
			// If stored data is corrupted, generate new one
			return generateDeviceFingerprint();
		}
	}
	return null;
};

export const storeFingerprint = (fingerprint) => {
	localStorage.setItem("deviceFingerprint", JSON.stringify(fingerprint));
};

// Main function to get or generate fingerprint
export const getDeviceFingerprint = () => {
	let fingerprint = getStoredFingerprint();

	// Migrate legacy fingerprints to UUID-based if needed
	if (fingerprint && (!fingerprint.hash || !isUuidLike(fingerprint.hash))) {
		const regenerated = generateDeviceFingerprint();
		storeFingerprint(regenerated);
		return regenerated;
	}

	if (!fingerprint) {
		fingerprint = generateDeviceFingerprint();
		storeFingerprint(fingerprint);
	}

	return fingerprint;
};
