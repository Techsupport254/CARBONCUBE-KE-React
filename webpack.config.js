const path = require("path");

module.exports = {
	// Use default webpack configuration with performance optimizations
	optimization: {
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				// Vendor chunk for node_modules
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors",
					chunks: "all",
					priority: 10,
				},
				// Common chunk for shared code
				common: {
					name: "common",
					minChunks: 2,
					chunks: "all",
					priority: 5,
					reuseExistingChunk: true,
				},
				// Analytics chunk (defer loading)
				analytics: {
					test: /[\\/](matomo|google|analytics)[\\/]/,
					name: "analytics",
					chunks: "async",
					priority: 15,
				},
				// Chart.js chunk (defer loading)
				charts: {
					test: /[\\/](chart\.js|react-chartjs-2)[\\/]/,
					name: "charts",
					chunks: "async",
					priority: 15,
				},
				// TensorFlow chunk (defer loading)
				tensorflow: {
					test: /[\\/](@tensorflow|nsfwjs)[\\/]/,
					name: "tensorflow",
					chunks: "async",
					priority: 15,
				},
				// SweetAlert2 chunk (include in main bundle to avoid loading issues)
				sweetalert: {
					test: /[\\/](sweetalert2)[\\/]/,
					name: "vendors",
					chunks: "all",
					priority: 5,
				},
			},
		},
		// Enable tree shaking
		usedExports: true,
		sideEffects: false,
	},
	// Performance hints
	performance: {
		hints: "warning",
		maxEntrypointSize: 512000, // 500KB
		maxAssetSize: 512000, // 500KB
	},
	// Module resolution optimizations
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
};
