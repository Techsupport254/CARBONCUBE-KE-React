// Optimized icon loading utility to reduce bundle size
import { library } from "@fortawesome/fontawesome-svg-core";

// Lazy load icons to reduce initial bundle size
const iconCache = new Map();

// Define icon sets for different pages/components
const iconSets = {
	shop: [
		"faShare",
		"faStar",
		"faStarHalfAlt",
		"faTimes",
		"faCopy",
		"faSearch",
		"faFilter",
		"faFacebook",
		"faTwitter",
		"faWhatsapp",
		"faLinkedin",
	],
	navbar: [
		"faSearch",
		"faFilter",
		"faBars",
		"faTimes",
		"faChevronDown",
		"faUser",
		"faSignOutAlt",
		"faSignInAlt",
		"faTachometerAlt",
		"faHome",
		"faHeart",
		"faCog",
		"faChartBar",
		"faUsers",
		"faBox",
		"faEnvelope",
		"faList",
		"faPercent",
		"faShieldAlt",
		"faFileAlt",
	],
	analytics: [
		"faPencilAlt",
		"faExclamationTriangle",
		"faChartBar",
		"faClipboardList",
		"faComments",
		"faCrown",
		"faStar",
		"faGem",
		"faUser",
	],
};

// Lazy load icons for a specific set
export const loadIcons = async (setName) => {
	if (iconCache.has(setName)) {
		return iconCache.get(setName);
	}

	const icons = iconSets[setName] || [];
	const iconModules = [];

	// Load solid icons
	const solidIcons = icons.filter(
		(icon) =>
			!["faFacebook", "faTwitter", "faWhatsapp", "faLinkedin"].includes(icon)
	);

	if (solidIcons.length > 0) {
		const { fas } = await import("@fortawesome/free-solid-svg-icons");
		solidIcons.forEach((iconName) => {
			const iconKey = iconName.replace("fa", "");
			if (fas[iconKey]) {
				library.add(fas[iconKey]);
				iconModules.push(fas[iconKey]);
			}
		});
	}

	// Load brand icons
	const brandIcons = icons.filter((icon) =>
		["faFacebook", "faTwitter", "faWhatsapp", "faLinkedin"].includes(icon)
	);

	if (brandIcons.length > 0) {
		const { fab } = await import("@fortawesome/free-brands-svg-icons");
		brandIcons.forEach((iconName) => {
			const iconKey = iconName.replace("fa", "");
			if (fab[iconKey]) {
				library.add(fab[iconKey]);
				iconModules.push(fab[iconKey]);
			}
		});
	}

	iconCache.set(setName, iconModules);
	return iconModules;
};

// Preload critical icons for shop page
export const preloadShopIcons = () => {
	return loadIcons("shop");
};

// Preload critical icons for navbar
export const preloadNavbarIcons = () => {
	return loadIcons("navbar");
};

// Load icons on demand
export const loadIconsOnDemand = (setName) => {
	return new Promise((resolve) => {
		// Use requestIdleCallback for non-critical icon loading
		if (window.requestIdleCallback) {
			window.requestIdleCallback(() => {
				loadIcons(setName).then(resolve);
			});
		} else {
			setTimeout(() => {
				loadIcons(setName).then(resolve);
			}, 0);
		}
	});
};
