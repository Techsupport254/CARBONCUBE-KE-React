#!/usr/bin/env node

/**
 * Performance Analysis Script
 * Analyzes and reports on performance optimizations
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BUILD_DIR = path.join(__dirname, "../build");

function analyzePerformance() {
	try {
		console.log("📊 Analyzing performance optimizations...");

		const analysis = {
			timestamp: new Date().toISOString(),
			buildSize: analyzeBuildSize(),
			bundleAnalysis: analyzeBundleSize(),
			imageOptimization: analyzeImageOptimization(),
			recommendations: generateRecommendations(),
		};

		// Save analysis report
		const reportPath = path.join(__dirname, "../performance-analysis.json");
		fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));

		console.log("✅ Performance analysis completed");
		console.log(`📁 Report saved to: ${reportPath}`);

		// Display summary
		displaySummary(analysis);
	} catch (error) {
		console.error("❌ Error analyzing performance:", error.message);
		process.exit(1);
	}
}

function analyzeBuildSize() {
	console.log("📦 Analyzing build size...");

	const buildStats = {
		totalSize: 0,
		cssSize: 0,
		jsSize: 0,
		imageSize: 0,
		otherSize: 0,
	};

	function calculateDirectorySize(dirPath) {
		let totalSize = 0;
		const items = fs.readdirSync(dirPath);

		for (const item of items) {
			const itemPath = path.join(dirPath, item);
			const stats = fs.statSync(itemPath);

			if (stats.isDirectory()) {
				totalSize += calculateDirectorySize(itemPath);
			} else {
				totalSize += stats.size;

				// Categorize by file type
				if (item.endsWith(".css")) {
					buildStats.cssSize += stats.size;
				} else if (item.endsWith(".js")) {
					buildStats.jsSize += stats.size;
				} else if (/\.(png|jpg|jpeg|webp|avif|gif|svg)$/i.test(item)) {
					buildStats.imageSize += stats.size;
				} else {
					buildStats.otherSize += stats.size;
				}
			}
		}

		return totalSize;
	}

	buildStats.totalSize = calculateDirectorySize(BUILD_DIR);

	return {
		total: formatBytes(buildStats.totalSize),
		css: formatBytes(buildStats.cssSize),
		js: formatBytes(buildStats.jsSize),
		images: formatBytes(buildStats.imageSize),
		other: formatBytes(buildStats.otherSize),
		breakdown: {
			css: ((buildStats.cssSize / buildStats.totalSize) * 100).toFixed(1) + "%",
			js: ((buildStats.jsSize / buildStats.totalSize) * 100).toFixed(1) + "%",
			images:
				((buildStats.imageSize / buildStats.totalSize) * 100).toFixed(1) + "%",
			other:
				((buildStats.otherSize / buildStats.totalSize) * 100).toFixed(1) + "%",
		},
	};
}

function analyzeBundleSize() {
	console.log(" Analyzing bundle size...");

	const jsDir = path.join(BUILD_DIR, "static/js");
	const bundles = [];

	if (fs.existsSync(jsDir)) {
		const jsFiles = fs
			.readdirSync(jsDir)
			.filter((file) => file.endsWith(".js"));

		for (const file of jsFiles) {
			const filePath = path.join(jsDir, file);
			const stats = fs.statSync(filePath);
			const name = file.replace(/\.js$/, "").replace(/\.[a-f0-9]+$/, "");

			bundles.push({
				name,
				file,
				size: formatBytes(stats.size),
				sizeBytes: stats.size,
			});
		}
	}

	// Sort by size
	bundles.sort((a, b) => b.sizeBytes - a.sizeBytes);

	return {
		totalBundles: bundles.length,
		totalSize: formatBytes(
			bundles.reduce((sum, bundle) => sum + bundle.sizeBytes, 0)
		),
		bundles: bundles.map(({ name, file, size }) => ({ name, file, size })),
	};
}

function analyzeImageOptimization() {
	console.log("🖼️  Analyzing image optimization...");

	const originalDir = path.join(__dirname, "../public/Banners");
	const optimizedDir = path.join(__dirname, "../public/optimized-banners");

	const analysis = {
		originalImages: 0,
		optimizedImages: 0,
		totalOriginalSize: 0,
		totalOptimizedSize: 0,
		savings: 0,
		savingsPercentage: 0,
	};

	// Analyze original images
	if (fs.existsSync(originalDir)) {
		const originalFiles = fs
			.readdirSync(originalDir)
			.filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file));

		analysis.originalImages = originalFiles.length;

		for (const file of originalFiles) {
			const filePath = path.join(originalDir, file);
			const stats = fs.statSync(filePath);
			analysis.totalOriginalSize += stats.size;
		}
	}

	// Analyze optimized images
	if (fs.existsSync(optimizedDir)) {
		const optimizedFiles = fs
			.readdirSync(optimizedDir)
			.filter((file) => /\.(webp|avif)$/i.test(file));

		analysis.optimizedImages = optimizedFiles.length;

		for (const file of optimizedFiles) {
			const filePath = path.join(optimizedDir, file);
			const stats = fs.statSync(filePath);
			analysis.totalOptimizedSize += stats.size;
		}
	}

	// Calculate savings
	analysis.savings = analysis.totalOriginalSize - analysis.totalOptimizedSize;
	analysis.savingsPercentage =
		analysis.totalOriginalSize > 0
			? ((analysis.savings / analysis.totalOriginalSize) * 100).toFixed(1)
			: 0;

	return {
		original: {
			count: analysis.originalImages,
			size: formatBytes(analysis.totalOriginalSize),
		},
		optimized: {
			count: analysis.optimizedImages,
			size: formatBytes(analysis.totalOptimizedSize),
		},
		savings: {
			size: formatBytes(analysis.savings),
			percentage: analysis.savingsPercentage + "%",
		},
	};
}

function generateRecommendations() {
	return [
		{
			category: "Critical",
			title: "Optimize Banner Images",
			description: "Run npm run optimize-images to generate WebP/AVIF versions",
			impact: "High",
			effort: "Low",
		},
		{
			category: "Critical",
			title: "Remove Unused CSS",
			description: "Use PurgeCSS to remove unused styles",
			impact: "High",
			effort: "Medium",
		},
		{
			category: "Important",
			title: "Implement Lazy Loading",
			description: "Add lazy loading for below-the-fold images",
			impact: "Medium",
			effort: "Low",
		},
		{
			category: "Important",
			title: "Optimize Third-party Scripts",
			description: "Defer non-critical third-party scripts",
			impact: "Medium",
			effort: "Medium",
		},
		{
			category: "Nice to Have",
			title: "Implement AMP",
			description: "Consider AMP for mobile performance",
			impact: "Medium",
			effort: "High",
		},
	];
}

function displaySummary(analysis) {
	console.log("\n📊 Performance Analysis Summary");
	console.log("================================");

	console.log("\n📦 Build Size:");
	console.log(`   Total: ${analysis.buildSize.total}`);
	console.log(
		`   CSS: ${analysis.buildSize.css} (${analysis.buildSize.breakdown.css})`
	);
	console.log(
		`   JS: ${analysis.buildSize.js} (${analysis.buildSize.breakdown.js})`
	);
	console.log(
		`   Images: ${analysis.buildSize.images} (${analysis.buildSize.breakdown.images})`
	);

	console.log("\n JavaScript Bundles:");
	console.log(`   Total: ${analysis.bundleAnalysis.totalBundles} bundles`);
	console.log(`   Total Size: ${analysis.bundleAnalysis.totalSize}`);
	analysis.bundleAnalysis.bundles.slice(0, 5).forEach((bundle) => {
		console.log(`   - ${bundle.name}: ${bundle.size}`);
	});

	console.log("\n🖼️  Image Optimization:");
	console.log(
		`   Original: ${analysis.imageOptimization.original.count} images, ${analysis.imageOptimization.original.size}`
	);
	console.log(
		`   Optimized: ${analysis.imageOptimization.optimized.count} images, ${analysis.imageOptimization.optimized.size}`
	);
	console.log(
		`   Savings: ${analysis.imageOptimization.savings.size} (${analysis.imageOptimization.savings.percentage})`
	);

	console.log("\n🎯 Top Recommendations:");
	analysis.recommendations.slice(0, 3).forEach((rec, index) => {
		console.log(
			`   ${index + 1}. ${rec.title} (${rec.impact} impact, ${
				rec.effort
			} effort)`
		);
	});
}

function formatBytes(bytes) {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Run if called directly
if (require.main === module) {
	analyzePerformance();
}

module.exports = { analyzePerformance };
