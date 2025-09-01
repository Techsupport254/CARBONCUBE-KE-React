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
			liveReload: false,
			watchOptions: {
				aggregateTimeout: 300,
				poll: 1000,
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
			splitChunks: {
				chunks: "all",
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: "vendors",
						chunks: "all",
						priority: 10,
					},
					common: {
						name: "common",
						minChunks: 2,
						chunks: "all",
						priority: 5,
						reuseExistingChunk: true,
					},
					// Separate React and React DOM
					react: {
						test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
						name: "react",
						chunks: "all",
						priority: 20,
					},
					// Separate analytics libraries
					analytics: {
						test: /[\\/]node_modules[\\/](@tensorflow|chart\.js|recharts)[\\/]/,
						name: "analytics",
						chunks: "all",
						priority: 15,
					},
				},
			},
			runtimeChunk: "single",
			minimize: true,
		},
		performance: {
			hints: "warning",
			maxEntrypointSize: 512000,
			maxAssetSize: 512000,
		},
	}),
};
