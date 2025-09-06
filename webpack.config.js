const isDev = process.env.NODE_ENV === "development";

module.exports = {
	module: {
		rules: [
			...(isDev
				? []
				: [
						{
							test: /\.js$/,
							enforce: "pre",
							loader: "source-map-loader",
							exclude: /node_modules/,
						},
				  ]),
		],
	},
	...(isDev && {
		devServer: {
			hot: true,
			liveReload: true,
			watchOptions: {
				aggregateTimeout: 200,
				poll: 500,
				ignored: /node_modules/,
			},
		},
		optimization: {
			removeAvailableModules: false,
			removeEmptyChunks: false,
			splitChunks: false,
		},
	}),
	// Production optimizations
	...(!isDev && {
		optimization: {
			usedExports: true,
			sideEffects: false,
			splitChunks: {
				chunks: "all",
				maxInitialRequests: 25,
				minSize: 20000,
				cacheGroups: {
					// Vendor chunk for all node_modules
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: "vendors",
						chunks: "all",
						priority: 10,
						reuseExistingChunk: true,
					},
					// Separate React and React DOM
					react: {
						test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
						name: "react",
						chunks: "all",
						priority: 20,
						reuseExistingChunk: true,
					},
					// Separate Bootstrap
					bootstrap: {
						test: /[\\/]node_modules[\\/](bootstrap|react-bootstrap)[\\/]/,
						name: "bootstrap",
						chunks: "all",
						priority: 15,
						reuseExistingChunk: true,
					},
					// Separate analytics libraries
					analytics: {
						test: /[\\/]node_modules[\\/](@tensorflow|chart\.js|recharts|@fortawesome)[\\/]/,
						name: "analytics",
						chunks: "all",
						priority: 15,
						reuseExistingChunk: true,
					},
					// Separate utility libraries
					utils: {
						test: /[\\/]node_modules[\\/](axios|date-fns|lucide-react|jwt-decode)[\\/]/,
						name: "utils",
						chunks: "all",
						priority: 15,
						reuseExistingChunk: true,
					},
					// Common chunk for shared code
					common: {
						name: "common",
						minChunks: 2,
						chunks: "all",
						priority: 5,
						reuseExistingChunk: true,
					},
					// CSS optimization
					styles: {
						name: "styles",
						test: /\.css$/,
						chunks: "all",
						enforce: true,
					},
				},
			},
		},
	}),
};
