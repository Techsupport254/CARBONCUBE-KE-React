import axios from "axios";
import { getDeviceFingerprint } from "./deviceFingerprint";

class SourceTrackingService {
	constructor() {
		this.API_URL = process.env.REACT_APP_BACKEND_URL;
	}

	// Parse URL parameters to extract source information
	parseUrlParams() {
		const urlParams = new URLSearchParams(window.location.search);
		const referrer = document.referrer;

		return {
			utm_source: urlParams.get("utm_source"),
			utm_medium: urlParams.get("utm_medium"),
			utm_campaign: urlParams.get("utm_campaign"),
			referrer: referrer,
		};
	}

	// Determine the primary source from URL parameters and referrer
	determineSource() {
		const params = this.parseUrlParams();

		// Check for UTM source
		if (params.utm_source) {
			return this.sanitizeSource(params.utm_source);
		}

		// Check referrer
		if (params.referrer) {
			return this.parseReferrer(params.referrer);
		}

		// Default to direct
		return "direct";
	}

	// Sanitize and normalize source names
	sanitizeSource(source) {
		if (!source) return "direct";

		const sanitized = source.toLowerCase().trim();

		switch (sanitized) {
			case "fb":
			case "facebook":
				return "facebook";
			case "ig":
			case "instagram":
				return "instagram";
			case "tw":
			case "twitter":
			case "x":
				return "twitter";
			case "wa":
			case "whatsapp":
				return "whatsapp";
			case "tg":
			case "telegram":
				return "telegram";
			case "li":
			case "linkedin":
				return "linkedin";
			case "yt":
			case "youtube":
				return "youtube";
			case "tt":
			case "tiktok":
				return "tiktok";
			case "sc":
			case "snapchat":
				return "snapchat";
			case "pin":
			case "pinterest":
				return "pinterest";
			case "reddit":
			case "rd":
				return "reddit";
			case "google":
			case "g":
				return "google";
			case "bing":
			case "b":
				return "bing";
			case "yahoo":
			case "y":
				return "yahoo";
			case "127.0.0.1":
			case "carboncube-ke.com":
			case "carboncube.com":
				return "direct";
			default:
				return sanitized;
		}
	}

	// Parse referrer to determine source
	parseReferrer(referrer) {
		if (!referrer) return "direct";

		try {
			const url = new URL(referrer);
			const hostname = url.hostname.toLowerCase();

			// Skip development domains
			if (this.isDevelopmentDomain(hostname)) {
				return "direct";
			}

			// Social media platforms
			if (hostname.includes("facebook.com") || hostname.includes("fb.com"))
				return "facebook";
			if (hostname.includes("instagram.com")) return "instagram";
			if (
				hostname.includes("twitter.com") ||
				hostname.includes("x.com") ||
				hostname.includes("t.co")
			)
				return "twitter";
			if (hostname.includes("whatsapp.com") || hostname.includes("wa.me"))
				return "whatsapp";
			if (hostname.includes("telegram.org") || hostname.includes("t.me"))
				return "telegram";
			if (hostname.includes("linkedin.com")) return "linkedin";
			if (hostname.includes("youtube.com") || hostname.includes("youtu.be"))
				return "youtube";
			if (hostname.includes("tiktok.com")) return "tiktok";
			if (hostname.includes("snapchat.com")) return "snapchat";
			if (hostname.includes("pinterest.com")) return "pinterest";
			if (hostname.includes("reddit.com")) return "reddit";

			// Search engines
			if (hostname.includes("google.com") || hostname.includes("google.co.ke"))
				return "google";
			if (hostname.includes("bing.com")) return "bing";
			if (hostname.includes("yahoo.com")) return "yahoo";

			// Check if it's a social media domain
			if (this.isSocialMediaDomain(hostname)) {
				return this.extractSocialPlatform(hostname);
			}

			// For other domains, return 'other' instead of the full hostname
			return "other";
		} catch (error) {
			return "direct";
		}
	}

	// Check if domain is development/localhost
	isDevelopmentDomain(hostname) {
		const developmentDomains = [
			"127.0.0.1",
			"0.0.0.0",
			"::1",
			"localhost",
			"carboncube-ke.com",
			"www.carboncube-ke.com",
			"carboncube.com",
			"www.carboncube.com",
		];
		return developmentDomains.some((domain) => hostname.includes(domain));
	}

	// Check if domain is a social media platform
	isSocialMediaDomain(hostname) {
		const socialDomains = [
			"facebook",
			"twitter",
			"instagram",
			"linkedin",
			"whatsapp",
			"telegram",
			"youtube",
			"tiktok",
			"snapchat",
			"pinterest",
			"reddit",
			"discord",
			"slack",
			"wechat",
			"line",
			"viber",
			"skype",
			"zoom",
		];
		return socialDomains.some((social) => hostname.includes(social));
	}

	// Extract social platform from domain
	extractSocialPlatform(hostname) {
		if (hostname.includes("facebook")) return "facebook";
		if (hostname.includes("twitter") || hostname.includes("t.co"))
			return "twitter";
		if (hostname.includes("instagram")) return "instagram";
		if (hostname.includes("linkedin")) return "linkedin";
		if (hostname.includes("whatsapp") || hostname.includes("wa.me"))
			return "whatsapp";
		if (hostname.includes("telegram") || hostname.includes("t.me"))
			return "telegram";
		if (hostname.includes("youtube")) return "youtube";
		if (hostname.includes("tiktok")) return "tiktok";
		if (hostname.includes("snapchat")) return "snapchat";
		if (hostname.includes("pinterest")) return "pinterest";
		if (hostname.includes("reddit")) return "reddit";
		return "other";
	}

	// Clear session tracking (useful for testing)
	clearSessionTracking() {
		// Clear all UTM tracking keys
		const keys = Object.keys(sessionStorage);
		keys.forEach((key) => {
			if (key.startsWith("utm_tracked_")) {
				sessionStorage.removeItem(key);
			}
		});

		sessionStorage.removeItem("visit_source");
		sessionStorage.removeItem("visit_referrer");
		sessionStorage.removeItem("session_start");
	}

	// Track the current visit (only on meaningful visits)
	async trackVisit() {
		try {
			const params = this.parseUrlParams();
			const source = this.determineSource();

			// Only track if this is a meaningful visit
			if (!this.shouldTrackVisit(params, source)) {
				return null;
			}

			// Collect additional metadata
			const metadata = this.collectMetadata();

			// Get device fingerprint for internal user exclusion
			const deviceInfo = getDeviceFingerprint();

			const trackingData = {
				source: source,
				referrer: params.referrer,
				utm_source: params.utm_source,
				utm_medium: params.utm_medium,
				utm_campaign: params.utm_campaign,
				user_agent: navigator.userAgent,
				url: window.location.href,
				path: window.location.pathname,
				device_hash: deviceInfo.hash,
				...metadata,
			};

			const response = await axios.post(
				`${this.API_URL}/source-tracking/track`,
				trackingData
			);

			// Store source info in sessionStorage for this session
			const utmKey = this.createUtmKey(params);
			sessionStorage.setItem(`utm_tracked_${utmKey}`, "true");
			sessionStorage.setItem("visit_source", source);
			sessionStorage.setItem("visit_referrer", params.referrer || "");

			return response.data;
		} catch (error) {
			console.error("Failed to track visit:", error);
			return null;
		}
	}

	// Determine if this visit should be tracked
	shouldTrackVisit(params, source) {
		// Create a unique key for this UTM combination
		const utmKey = this.createUtmKey(params);

		// Don't track if this specific UTM combination was already tracked in this session
		if (sessionStorage.getItem(`utm_tracked_${utmKey}`) === "true") {
			return false;
		}

		// Track if there are UTM parameters (even in development)
		if (params.utm_source || params.utm_medium || params.utm_campaign) {
			return true;
		}

		// Don't track if no meaningful source information
		if (
			source === "direct" &&
			!params.utm_source &&
			!params.utm_medium &&
			!params.utm_campaign
		) {
			return false;
		}

		// Don't track if it's a development environment (unless UTM params present)
		if (this.isDevelopmentDomain(window.location.hostname)) {
			return false;
		}

		// Track if there's an external referrer
		if (
			params.referrer &&
			!this.isDevelopmentDomain(new URL(params.referrer).hostname)
		) {
			return true;
		}

		// Don't track internal navigation or direct visits without UTM
		return false;
	}

	// Create a unique key for UTM parameters
	createUtmKey(params) {
		const utmParams = [
			params.utm_source || "",
			params.utm_medium || "",
			params.utm_campaign || "",
		].filter((param) => param !== "");

		return utmParams.length > 0 ? utmParams.join("_") : "direct";
	}

	collectMetadata() {
		// Use persistent device identifier from deviceFingerprint util
		const deviceInfo = getDeviceFingerprint();
		const deviceFingerprint = deviceInfo?.hash;

		// Generate or retrieve session ID
		const sessionId = this.getSessionId();

		// Generate or retrieve visitor ID
		const visitorId = this.getVisitorId();

		const metadata = {
			device_fingerprint: deviceFingerprint,
			session_id: sessionId,
			visitor_id: visitorId,
			is_unique_visit: this.isUniqueVisit(visitorId),
			visit_count: this.getVisitCount(visitorId),
			screen_resolution: `${window.screen.width}x${window.screen.height}`,
			language: navigator.language || navigator.userLanguage,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			color_depth: window.screen.colorDepth,
			pixel_ratio: window.devicePixelRatio || 1,
			viewport_size: `${window.innerWidth}x${window.innerHeight}`,
			cookies_enabled: navigator.cookieEnabled,
			do_not_track: navigator.doNotTrack,
			platform: navigator.platform,
			connection: this.getConnectionInfo(),
			device_memory: navigator.deviceMemory,
			hardware_concurrency: navigator.hardwareConcurrency,
			max_touch_points: navigator.maxTouchPoints,
			on_line: navigator.onLine,
		};

		// Add session duration if available
		const sessionStart = sessionStorage.getItem("session_start");
		if (sessionStart) {
			const sessionDuration = Date.now() - parseInt(sessionStart);
			metadata.session_duration = sessionDuration;
		} else {
			sessionStorage.setItem("session_start", Date.now().toString());
		}

		// Add page load time if available
		if (window.performance && window.performance.timing) {
			const loadTime =
				window.performance.timing.loadEventEnd -
				window.performance.timing.navigationStart;
			if (loadTime > 0) {
				metadata.page_load_time = loadTime;
			}
		}

		return metadata;
	}

	getConnectionInfo() {
		if (navigator.connection) {
			return {
				effective_type: navigator.connection.effectiveType,
				downlink: navigator.connection.downlink,
				rtt: navigator.connection.rtt,
				save_data: navigator.connection.saveData,
			};
		}
		return null;
	}

	// Deprecated: legacy generator removed in favor of persistent UUID in deviceFingerprint util

	getSessionId() {
		let sessionId = sessionStorage.getItem("tracking_session_id");
		if (!sessionId) {
			sessionId =
				"session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
			sessionStorage.setItem("tracking_session_id", sessionId);
		}
		return sessionId;
	}

	getVisitorId() {
		let visitorId = localStorage.getItem("tracking_visitor_id");
		if (!visitorId) {
			visitorId =
				"visitor_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
			localStorage.setItem("tracking_visitor_id", visitorId);
		}
		return visitorId;
	}

	isUniqueVisit(visitorId) {
		// Check if this visitor has been recorded as unique before
		const hasBeenRecorded = localStorage.getItem(
			`unique_visitor_recorded_${visitorId}`
		);

		if (!hasBeenRecorded) {
			// Mark this visitor as recorded as unique
			localStorage.setItem(`unique_visitor_recorded_${visitorId}`, "true");
			return true;
		}

		return false;
	}

	getVisitCount(visitorId) {
		const visitCount = localStorage.getItem(`visit_count_${visitorId}`) || "0";
		const newCount = parseInt(visitCount) + 1;
		localStorage.setItem(`visit_count_${visitorId}`, newCount.toString());
		return newCount;
	}

	// Clear unique visitor tracking (for testing purposes)
	clearUniqueVisitorTracking() {
		const keys = Object.keys(localStorage);
		keys.forEach((key) => {
			if (key.startsWith("unique_visitor_recorded_")) {
				localStorage.removeItem(key);
			}
		});
		// Unique visitor tracking cleared silently
	}

	// Get source analytics data (all data - filtering done client-side)
	async getSourceAnalytics() {
		try {
			const token =
				localStorage.getItem("token") || localStorage.getItem("token");

			const url = `${this.API_URL}/source-tracking/analytics`;

			const response = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch (error) {
			console.error("Failed to get source analytics:", error);
			return null;
		}
	}

	// Get the current visit source (from localStorage or determine)
	getCurrentSource() {
		const storedSource = localStorage.getItem("visit_source");
		if (storedSource) {
			return storedSource;
		}

		return this.determineSource();
	}

	// Create shareable URLs with source tracking
	createShareableUrl(baseUrl, source, additionalParams = {}) {
		const url = new URL(baseUrl);
		url.searchParams.set("from", source);

		// Add any additional parameters
		Object.entries(additionalParams).forEach(([key, value]) => {
			if (value) {
				url.searchParams.set(key, value);
			}
		});

		return url.toString();
	}

	// Generate social media share URLs
	generateSocialShareUrls(pageUrl, title, description) {
		const encodedUrl = encodeURIComponent(pageUrl);
		const encodedTitle = encodeURIComponent(title);
		// Note: encodedDescription variable removed as it was unused

		return {
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
			linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
			whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
			telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
		};
	}
}

// Create a singleton instance
const sourceTrackingService = new SourceTrackingService();

export default sourceTrackingService;
