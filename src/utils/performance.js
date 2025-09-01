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

// Preload critical resources
export const preloadResource = (href, as = "fetch") => {
	const link = document.createElement("link");
	link.rel = "preload";
	link.href = href;
	link.as = as;
	document.head.appendChild(link);
};

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

// Optimize images with responsive sizes
export const getOptimizedImageUrl = (url, width = 800, quality = 80) => {
	if (!url) return "";

	// If it's a Cloudinary URL, optimize it
	if (url.includes("cloudinary.com")) {
		const baseUrl = url.split("/upload/")[0] + "/upload/";
		const imagePath = url.split("/upload/")[1];
		return `${baseUrl}w_${width},q_${quality}/${imagePath}`;
	}

	return url;
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
	const start = performance.now();
	const result = fn();
	const end = performance.now();
	// console.log(`${name} took ${end - start} milliseconds`);
	return result;
};

// Async performance monitoring
export const measureAsyncPerformance = async (name, fn) => {
	const start = performance.now();
	const result = await fn();
	const end = performance.now();
	// console.log(`${name} took ${end - start} milliseconds`);
	return result;
};

// Memory usage monitoring
export const logMemoryUsage = () => {
	if ("memory" in performance) {
		const memory = performance.memory;
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

// Cache management
export const clearOldCaches = async () => {
	if ("caches" in window) {
		const cacheNames = await caches.keys();
		const oldCaches = cacheNames.filter(
			(name) => name.startsWith("carbon-cube-") && name !== "carbon-cube-v1"
		);
		await Promise.all(oldCaches.map((name) => caches.delete(name)));
	}
};

// Service Worker registration with performance optimization
export const registerServiceWorker = async () => {
	if ("serviceWorker" in navigator) {
		try {
			const registration = await navigator.serviceWorker.register("/sw.js", {
				scope: "/",
				updateViaCache: "none",
			});
			// console.log('SW registered: ', registration);
			return registration;
		} catch (error) {
			// console.log('SW registration failed: ', error);
		}
	}
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
	// Remove render-blocking resources
	const renderBlocking = document.querySelectorAll(
		'link[rel="stylesheet"][media="print"]'
	);
	renderBlocking.forEach((link) => {
		link.media = "all";
	});
};

// Performance budget monitoring
export const checkPerformanceBudget = () => {
	try {
		const navigation = performance.getEntriesByType("navigation")[0];
		if (navigation) {
			const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
			const domContentLoaded =
				navigation.domContentLoadedEventEnd -
				navigation.domContentLoadedEventStart;

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
