const fs = require("fs");
const path = require("path");
const imagemin = require("imagemin");
const imageminWebp = require("imagemin-webp");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");

// Asset optimization script
async function optimizeAssets() {
	console.log("🔧 Starting asset optimization...");

	try {
		const buildPath = path.join(__dirname, "../build");
		const publicPath = path.join(__dirname, "../public");

		// Optimize images in build directory
		console.log("📸 Optimizing images in build directory...");

		const buildImages = await imagemin([`${buildPath}/**/*.{jpg,jpeg,png}`], {
			destination: buildPath,
			plugins: [
				imageminMozjpeg({ quality: 80, progressive: true }),
				imageminPngquant({ quality: [0.6, 0.8] }),
				imageminWebp({ quality: 80 }),
			],
		});

		console.log(`Optimized ${buildImages.length} images in build directory`);

		// Optimize images in public directory
		console.log("📸 Optimizing images in public directory...");

		const publicImages = await imagemin([`${publicPath}/**/*.{jpg,jpeg,png}`], {
			destination: publicPath,
			plugins: [
				imageminMozjpeg({ quality: 80, progressive: true }),
				imageminPngquant({ quality: [0.6, 0.8] }),
				imageminWebp({ quality: 80 }),
			],
		});

		console.log(`Optimized ${publicImages.length} images in public directory`);

		// Generate WebP versions
		console.log("Generating WebP versions...");

		const webpImages = await imagemin([`${buildPath}/**/*.{jpg,jpeg,png}`], {
			destination: buildPath,
			plugins: [imageminWebp({ quality: 80 })],
		});

		console.log(`Generated ${webpImages.length} WebP versions`);

		// Analyze bundle sizes
		console.log("📊 Analyzing bundle sizes...");

		const jsFiles = fs
			.readdirSync(path.join(buildPath, "static/js"))
			.filter((file) => file.endsWith(".js"))
			.map((file) => {
				const filePath = path.join(buildPath, "static/js", file);
				const stats = fs.statSync(filePath);
				return {
					name: file,
					size: stats.size,
					sizeKB: (stats.size / 1024).toFixed(2),
				};
			})
			.sort((a, b) => b.size - a.size);

		const cssFiles = fs
			.readdirSync(path.join(buildPath, "static/css"))
			.filter((file) => file.endsWith(".css"))
			.map((file) => {
				const filePath = path.join(buildPath, "static/css", file);
				const stats = fs.statSync(filePath);
				return {
					name: file,
					size: stats.size,
					sizeKB: (stats.size / 1024).toFixed(2),
				};
			})
			.sort((a, b) => b.size - a.size);

		console.log("\n📦 Bundle Analysis:");
		console.log("==================");

		console.log("\nJavaScript Files:");
		jsFiles.forEach((file) => {
			console.log(`  ${file.name}: ${file.sizeKB} KB`);
		});

		console.log("\nCSS Files:");
		cssFiles.forEach((file) => {
			console.log(`  ${file.name}: ${file.sizeKB} KB`);
		});

		const totalJsSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
		const totalCssSize = cssFiles.reduce((sum, file) => sum + file.size, 0);

		console.log(`\n📊 Total JavaScript: ${(totalJsSize / 1024).toFixed(2)} KB`);
		console.log(`📊 Total CSS: ${(totalCssSize / 1024).toFixed(2)} KB`);
		console.log(
			`📊 Total Assets: ${((totalJsSize + totalCssSize) / 1024).toFixed(2)} KB`
		);

		// Generate optimization report
		const optimizationReport = {
			timestamp: new Date().toISOString(),
			buildImagesOptimized: buildImages.length,
			publicImagesOptimized: publicImages.length,
			webpVersionsGenerated: webpImages.length,
			bundleAnalysis: {
				javascript: jsFiles,
				css: cssFiles,
				totals: {
					js: totalJsSize,
					css: totalCssSize,
					total: totalJsSize + totalCssSize,
				},
			},
		};

		const reportPath = path.join(__dirname, "../optimization-report.json");
		fs.writeFileSync(reportPath, JSON.stringify(optimizationReport, null, 2));

		console.log(`\n📄 Optimization report saved to: ${reportPath}`);
		console.log("\nAsset optimization completed successfully!");
	} catch (error) {
		console.error("Error during asset optimization:", error.message);
	}
}

// Run optimization
optimizeAssets();
