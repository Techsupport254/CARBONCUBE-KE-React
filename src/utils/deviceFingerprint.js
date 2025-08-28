// Device fingerprinting utility for identifying internal users
// This creates a unique fingerprint based on device characteristics

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

	// Advanced hardware fingerprint using GPU and CPU characteristics
	const advancedHardwareFingerprint = {
		// Screen characteristics (hardware-specific)
		screenArea: fingerprint.screenWidth * fingerprint.screenHeight,
		screenRatio:
			Math.round((fingerprint.screenWidth / fingerprint.screenHeight) * 100) /
			100,

		// CPU characteristics (hardware-specific)
		cpuCores: fingerprint.hardwareConcurrency,
		deviceMemory: fingerprint.deviceMemory || 0,

		// GPU characteristics (hardware-specific) - Most reliable for device identification
		gpuVendor: fingerprint.webglVendor || "unknown",
		gpuRenderer: fingerprint.webglRenderer || "unknown",
		gpuVersion: fingerprint.webglVersion || "unknown",

		// Touch capability (hardware-specific)
		touchCapable: fingerprint.maxTouchPoints > 0,
		maxTouchPoints: fingerprint.maxTouchPoints,

		// Additional hardware characteristics
		colorDepth: fingerprint.screenColorDepth,
		pixelDepth: fingerprint.screenPixelDepth,
	};

	const fingerprintString = JSON.stringify(fingerprint);
	const uniqueFingerprintString = JSON.stringify(uniqueDeviceFingerprint);
	const advancedFingerprintString = JSON.stringify(advancedHardwareFingerprint);

	// Use the advanced hardware fingerprint approach
	const hash = simpleHash(advancedFingerprintString);

	return {
		fingerprint: fingerprint,
		hash: hash,
		string: fingerprintString,
		uniqueString: uniqueFingerprintString,
	};
};

// Simple hash function
const simpleHash = (str) => {
	let hash = 0;
	if (str.length === 0) return hash;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	return Math.abs(hash).toString(36);
};

// Get available fonts (basic detection)
const getAvailableFonts = () => {
	const testString = "mmmmmmmmmmlli";
	const testSize = "72px";
	const h = document.getElementsByTagName("body")[0];
	const s = document.createElement("span");
	s.style.fontSize = testSize;
	s.innerHTML = testString;
	const defaultWidth = {};
	const defaultHeight = {};

	// Get default dimensions
	for (const font of ["monospace", "sans-serif", "serif"]) {
		s.style.fontFamily = font;
		h.appendChild(s);
		defaultWidth[font] = s.offsetWidth;
		defaultHeight[font] = s.offsetHeight;
		h.removeChild(s);
	}

	// Test specific fonts
	const fonts = [
		"Arial",
		"Verdana",
		"Helvetica",
		"Times New Roman",
		"Courier New",
		"Georgia",
		"Palatino",
		"Garamond",
		"Bookman",
		"Comic Sans MS",
		"Trebuchet MS",
		"Arial Black",
		"Impact",
		"Lucida Console",
	];

	const detectedFonts = [];

	for (const font of fonts) {
		s.style.fontFamily = `${font}, monospace`;
		h.appendChild(s);
		const width = s.offsetWidth;
		const height = s.offsetHeight;
		h.removeChild(s);

		if (
			width !== defaultWidth.monospace ||
			height !== defaultHeight.monospace
		) {
			detectedFonts.push(font);
		}
	}

	return detectedFonts.join(",");
};

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

	if (!fingerprint) {
		fingerprint = generateDeviceFingerprint();
		storeFingerprint(fingerprint);
	}

	return fingerprint;
};
