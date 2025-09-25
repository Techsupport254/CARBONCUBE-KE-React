// Performance utilities to reduce main thread blocking

// Debounce function to limit function calls
export const debounce = (func, wait, immediate = false) => {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			timeout = null;
			if (!immediate) func(...args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func(...args);
	};
};

// Throttle function to limit function calls
export const throttle = (func, limit) => {
	let inThrottle;
	return function executedFunction(...args) {
		if (!inThrottle) {
			func.apply(this, args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
};

// Use requestIdleCallback for non-critical tasks
export const runWhenIdle = (callback, timeout = 5000) => {
	if ("requestIdleCallback" in window) {
		return window.requestIdleCallback(callback, { timeout });
	} else {
		// Fallback for browsers without requestIdleCallback
		return setTimeout(callback, 1);
	}
};

// Use requestAnimationFrame for smooth animations
export const runOnNextFrame = (callback) => {
	if ("requestAnimationFrame" in window) {
		return window.requestAnimationFrame(callback);
	} else {
		// Fallback
		return setTimeout(callback, 16);
	}
};

// Batch DOM updates to reduce reflows
export const batchDOMUpdates = (updates) => {
	return new Promise((resolve) => {
		runOnNextFrame(() => {
			// Use DocumentFragment for efficient DOM updates
			const fragment = document.createDocumentFragment();
			updates.forEach((update) => update(fragment));
			resolve();
		});
	});
};

// Lazy load images with intersection observer
export const createImageObserver = (callback, options = {}) => {
	if (!("IntersectionObserver" in window)) {
		// Fallback for older browsers
		return {
			observe: () => {},
			unobserve: () => {},
			disconnect: () => {},
		};
	}

	const defaultOptions = {
		root: null,
		rootMargin: "50px",
		threshold: 0.1,
		...options,
	};

	return new IntersectionObserver(callback, defaultOptions);
};

// Optimize scroll events
export const createOptimizedScrollHandler = (callback, options = {}) => {
	const { throttleMs = 16, passive = true } = options;

	const throttledCallback = throttle(callback, throttleMs);

	return {
		add: () => {
			window.addEventListener("scroll", throttledCallback, { passive });
		},
		remove: () => {
			window.removeEventListener("scroll", throttledCallback);
		},
	};
};

// Memory-efficient event delegation
export const createEventDelegator = (
	container,
	eventType,
	selector,
	handler
) => {
	const delegatedHandler = (event) => {
		const target = event.target.closest(selector);
		if (target) {
			handler(event, target);
		}
	};

	container.addEventListener(eventType, delegatedHandler);

	return () => {
		container.removeEventListener(eventType, delegatedHandler);
	};
};

// Optimize heavy computations with Web Workers (if available)
export const createWorker = (workerFunction) => {
	if (!("Worker" in window)) {
		// Fallback: run on main thread with setTimeout to avoid blocking
		return {
			postMessage: (data) => {
				setTimeout(() => {
					const result = workerFunction(data);
					if (typeof result === "function") {
						result();
					}
				}, 0);
			},
			terminate: () => {},
		};
	}

	const blob = new Blob([`(${workerFunction.toString()})()`], {
		type: "application/javascript",
	});
	const workerUrl = URL.createObjectURL(blob);

	return new Worker(workerUrl);
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
	const start = performance.now();
	const result = fn();
	const end = performance.now();

	// Performance logging removed for production
	return result;
};

// Async performance measurement
export const measureAsyncPerformance = async (name, fn) => {
	const start = performance.now();
	const result = await fn();
	const end = performance.now();

	// Performance logging removed for production
	return result;
};

// Preload critical resources
export const preloadResource = (href, as = "script") => {
	const link = document.createElement("link");
	link.rel = "preload";
	link.href = href;
	link.as = as;
	document.head.appendChild(link);
};

// Prefetch resources for next page
export const prefetchResource = (href) => {
	const link = document.createElement("link");
	link.rel = "prefetch";
	link.href = href;
	document.head.appendChild(link);
};
