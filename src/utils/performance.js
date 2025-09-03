// Performance optimization utilities

// Lazy load images with intersection observer
export const lazyLoadImage = (imgElement, src) => {
	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const img = entry.target;
				img.src = src;
				img.classList.remove("lazy");
				imageObserver.unobserve(img);
			}
		});
	});

	imageObserver.observe(imgElement);
};

// Fix preload links by ensuring they have proper 'as' attributes
export const fixPreloadLinks = () => {
	// Find all preload links without 'as' attribute
	const preloadLinks = document.querySelectorAll(
		'link[rel="preload"]:not([as])'
	);

	preloadLinks.forEach((link) => {
		const href = link.href;

		// Skip problematic font files that don't exist
		if (
			href.includes("poppins-var.woff2") ||
			href.includes("inter-var.woff2")
		) {
			link.remove();
			return;
		}

		// Determine the correct 'as' attribute based on the resource type
		let asValue = "fetch"; // default

		if (href.includes(".js") || href.includes("chunk")) {
			asValue = "script";
		} else if (href.includes(".css")) {
			asValue = "style";
		} else if (
			href.includes(".woff") ||
			href.includes(".woff2") ||
			href.includes(".ttf") ||
			href.includes(".otf")
		) {
			asValue = "font";
		} else if (
			href.includes(".jpg") ||
			href.includes(".jpeg") ||
			href.includes(".png") ||
			href.includes(".webp") ||
			href.includes(".gif") ||
			href.includes(".svg")
		) {
			asValue = "image";
		} else if (
			href.includes(".mp4") ||
			href.includes(".webm") ||
			href.includes(".ogg")
		) {
			asValue = "video";
		} else if (
			href.includes(".mp3") ||
			href.includes(".wav") ||
			href.includes(".ogg")
		) {
			asValue = "audio";
		}

		// Set the 'as' attribute
		link.setAttribute("as", asValue);
	});

	// Remove preload links that are not used within a few seconds
	setTimeout(() => {
		const unusedPreloadLinks = document.querySelectorAll('link[rel="preload"]');
		unusedPreloadLinks.forEach((link) => {
			// Check if the resource is actually loaded
			const href = link.href;
			const resourceLoaded =
				document.querySelector(`script[src="${href}"]`) ||
				document.querySelector(`link[href="${href}"]`) ||
				document.querySelector(`img[src="${href}"]`);

			// If not loaded and it's been more than 5 seconds, remove it
			if (!resourceLoaded) {
				link.remove();
			}
		});
	}, 5000);
};

// Preload critical resources
export const preloadResource = (href, as = "fetch") => {
	// Block requests to non-existent font files
	if (href.includes("inter-var.woff2") || href.includes("poppins-var.woff2")) {
		console.warn("Blocking preload request for non-existent font:", href);
		return;
	}

	const link = document.createElement("link");
	link.rel = "preload";
	link.href = href;
	link.as = as;
	document.head.appendChild(link);
};

// Global font request blocking - works even with cached code
if (typeof window !== "undefined") {
	// Override fetch to block font requests
	const originalFetch = window.fetch;
	window.fetch = function (url, options) {
		if (
			typeof url === "string" &&
			(url.includes("inter-var.woff2") || url.includes("poppins-var.woff2"))
		) {
			console.warn("Blocking fetch request for non-existent font:", url);
			return Promise.reject(new Error("Font file does not exist"));
		}
		return originalFetch.apply(this, arguments);
	};

	// Override XMLHttpRequest to block font requests
	const originalXHROpen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function (method, url, ...args) {
		if (
			typeof url === "string" &&
			(url.includes("inter-var.woff2") || url.includes("poppins-var.woff2"))
		) {
			console.warn("Blocking XHR request for non-existent font:", url);
			return;
		}
		return originalXHROpen.apply(this, [method, url, ...args]);
	};

	// Block any link elements for these fonts
	const originalAppendChild = Node.prototype.appendChild;
	Node.prototype.appendChild = function (child) {
		if (
			child.tagName === "LINK" &&
			child.href &&
			(child.href.includes("inter-var.woff2") ||
				child.href.includes("poppins-var.woff2"))
		) {
			console.warn("Blocking link element for non-existent font:", child.href);
			return child; // Return but don't append
		}
		return originalAppendChild.apply(this, arguments);
	};

	// Remove any existing problematic font links
	const removeFontLinks = () => {
		const problematicLinks = document.querySelectorAll(
			'link[href*="inter-var.woff2"], link[href*="poppins-var.woff2"]'
		);
		problematicLinks.forEach((link) => {
			console.warn("Removing existing problematic font link:", link.href);
			link.remove();
		});
	};

	// Run immediately and after DOM loads
	removeFontLinks();
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", removeFontLinks);
	} else {
		removeFontLinks();
	}
}

// Make the function available globally for debugging
if (typeof window !== "undefined") {
	window.fixPreloadLinks = fixPreloadLinks;
}

// Enhanced preload link management
export const managePreloadLinks = () => {
	// Run immediately
	fixPreloadLinks();

	// Set up a MutationObserver to watch for new preload links
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				if (node.nodeType === Node.ELEMENT_NODE) {
					// Check if the added node is a preload link
					if (node.tagName === "LINK" && node.rel === "preload") {
						fixPreloadLinks();
					}
					// Check if any preload links were added to the head
					const preloadLinks =
						node.querySelectorAll &&
						node.querySelectorAll('link[rel="preload"]');
					if (preloadLinks && preloadLinks.length > 0) {
						fixPreloadLinks();
					}
				}
			});
		});
	});

	// Start observing
	observer.observe(document.head, {
		childList: true,
		subtree: true,
	});

	// Clean up unused preload links periodically
	setInterval(() => {
		const allPreloadLinks = document.querySelectorAll('link[rel="preload"]');
		allPreloadLinks.forEach((link) => {
			const href = link.href;
			const url = new URL(href);

			// Check if this is a chunk file that might not be needed
			if (url.pathname.includes("chunk") && !url.pathname.includes("main")) {
				// For chunk files, we'll be more conservative and only remove after 10 seconds
				setTimeout(() => {
					if (link.parentNode) {
						link.remove();
					}
				}, 10000);
			}
		});
	}, 10000);

	return observer; // Return observer for cleanup if needed
};

// Preconnect to external domains
export const preconnectToDomain = (domain) => {
	const link = document.createElement("link");
	link.rel = "preconnect";
	link.href = domain;
	link.crossOrigin = "anonymous";
	document.head.appendChild(link);
};

// Note: preloadCriticalFonts function removed completely to prevent font 404 errors
// This project uses system fonts and Tailwind CSS - no custom font files needed

// Debounce function for performance
export const debounce = (func, wait) => {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

// Throttle function for performance
export const throttle = (func, limit) => {
	let inThrottle;
	return function () {
		const args = arguments;
		const context = this;
		if (!inThrottle) {
			func.apply(context, args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
};

// Optimize images with responsive sizes and WebP support
export const getOptimizedImageUrl = (
	url,
	width = 800,
	quality = 80,
	format = "auto"
) => {
	if (!url) return "";

	// If it's a Cloudinary URL, optimize it
	if (url.includes("cloudinary.com")) {
		const baseUrl = url.split("/upload/")[0] + "/upload/";
		const imagePath = url.split("/upload/")[1];
		const transformations = [];

		// Add width transformation
		if (width) {
			transformations.push(`w_${width}`);
		}

		// Add quality transformation
		if (quality) {
			transformations.push(`q_${quality}`);
		}

		// Add format transformation for WebP
		if (format === "webp") {
			transformations.push("f_webp");
		}

		// Add auto-optimization
		transformations.push("f_auto");

		return `${baseUrl}${transformations.join(",")}/${imagePath}`;
	}

	// For local images, return as is (they should be optimized during build)
	return url;
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
	// Note: start and end variables removed as they were unused
	const result = fn();
	// console.log(`${name} took ${end - start} milliseconds`);
	return result;
};

// Async performance monitoring
export const measureAsyncPerformance = async (name, fn) => {
	// Note: start and end variables removed as they were unused
	const result = await fn();
	// console.log(`${name} took ${end - start} milliseconds`);
	return result;
};

// Memory usage monitoring
export const logMemoryUsage = () => {
	if ("memory" in performance) {
		// Note: Memory variable removed as it was unused
		// console.log('Memory Usage:', {
		//   used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100 + ' MB',
		//   total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100 + ' MB',
		//   limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100 + ' MB'
		// });
	}
};

// Optimize bundle loading
export const loadScript = (src, async = true) => {
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = src;
		script.async = async;
		script.onload = resolve;
		script.onerror = reject;
		document.head.appendChild(script);
	});
};

// Optimize CSS loading
export const loadCSS = (href) => {
	return new Promise((resolve, reject) => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = href;
		link.onload = resolve;
		link.onerror = reject;
		document.head.appendChild(link);
	});
};

// Optimize font loading
export const optimizeFontLoading = () => {
	if ("fonts" in document) {
		document.fonts.ready.then(() => {
			document.documentElement.classList.add("fonts-loaded");
		});
	}
};

// Optimize critical rendering path
export const optimizeCriticalPath = () => {
	// Temporarily disabled to prevent font 404 errors from cached code
	return;
};

// Performance budget monitoring
export const checkPerformanceBudget = () => {
	try {
		const navigation = performance.getEntriesByType("navigation")[0];
		if (navigation) {
			// Note: Performance metrics variables removed as they were unused
			// console.log('Performance Metrics:', {
			//   loadTime: Math.round(loadTime) + 'ms',
			//   domContentLoaded: Math.round(domContentLoaded) + 'ms',
			//   budget: {
			//     loadTime: loadTime < 3000 ? '✅' : '❌',
			//     domContentLoaded: domContentLoaded < 1500 ? '✅' : '❌'
			//   }
			// });
		}
	} catch (error) {
		// console.warn('Performance monitoring failed:', error);
	}
};

// Optimize CSS delivery
export const optimizeCSSDelivery = () => {
	// Inline critical CSS
	const criticalCSS = `
		/* Critical CSS for above-the-fold content */
		body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
		.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
		.loading { opacity: 0.7; }
		.loaded { opacity: 1; }
	`;

	const style = document.createElement("style");
	style.textContent = criticalCSS;
	document.head.appendChild(style);

	// Defer non-critical CSS
	const nonCriticalCSS = document.querySelectorAll(
		'link[rel="stylesheet"]:not([data-critical])'
	);
	nonCriticalCSS.forEach((link) => {
		link.media = "print";
		link.onload = () => {
			link.media = "all";
		};
	});
};

// Optimize JavaScript loading
export const optimizeJavaScriptLoading = () => {
	// Defer non-critical scripts
	const nonCriticalScripts = document.querySelectorAll(
		"script:not([data-critical])"
	);
	nonCriticalScripts.forEach((script) => {
		script.defer = true;
	});
};
