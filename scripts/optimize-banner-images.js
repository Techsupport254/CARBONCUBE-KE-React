#!/usr/bin/env node

/**
 * Image Optimization Script
 * Optimizes banner images and adds proper loading attributes
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const BANNERS_DIR = path.join(__dirname, "../public/Banners");
const OPTIMIZED_DIR = path.join(__dirname, "../public/optimized-banners");

// Image optimization configuration
const IMAGE_CONFIG = {
	formats: ["webp", "avif"],
	sizes: {
		mobile: { width: 768, height: 432 },
		tablet: { width: 1024, height: 576 },
		desktop: { width: 1600, height: 900 },
		"2xl": { width: 2400, height: 1350 },
	},
	quality: {
		webp: 85,
		avif: 80,
	},
};

async function optimizeBannerImages() {
	try {
		console.log("🖼️  Optimizing banner images...");

		// Create optimized directory if it doesn't exist
		if (!fs.existsSync(OPTIMIZED_DIR)) {
			fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
		}

		// Get all banner images
		const bannerFiles = fs
			.readdirSync(BANNERS_DIR)
			.filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file));

		console.log(`📁 Found ${bannerFiles.length} banner images to optimize`);

		let totalSavings = 0;
		let originalSize = 0;

		for (const file of bannerFiles) {
			const inputPath = path.join(BANNERS_DIR, file);
			const baseName = path.parse(file).name;

			// Get original file size
			const stats = fs.statSync(inputPath);
			originalSize += stats.size;

			console.log(`Processing: ${file}`);

			// Process each size and format
			for (const [sizeName, dimensions] of Object.entries(IMAGE_CONFIG.sizes)) {
				for (const format of IMAGE_CONFIG.formats) {
					const outputFileName = `${baseName}-${sizeName}.${format}`;
					const outputPath = path.join(OPTIMIZED_DIR, outputFileName);

					try {
						await sharp(inputPath)
							.resize(dimensions.width, dimensions.height, {
								fit: "cover",
								position: "center",
							})
							.webp({ quality: IMAGE_CONFIG.quality.webp })
							.toFile(outputPath);

						const optimizedStats = fs.statSync(outputPath);
						const savings = stats.size - optimizedStats.size;
						totalSavings += savings;

						console.log(
							`  ${outputFileName} (${(optimizedStats.size / 1024).toFixed(
								1
							)} KB)`
						);
					} catch (error) {
						console.error(
							`  Error processing ${outputFileName}:`,
							error.message
						);
					}
				}
			}
		}

		console.log("Banner image optimization completed");
		console.log(
			`💾 Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`
		);
		console.log(
			`💾 Total savings: ${(totalSavings / 1024 / 1024).toFixed(2)} MB`
		);

		// Generate responsive image configuration
		generateResponsiveImageConfig();
	} catch (error) {
		console.error("Error optimizing banner images:", error.message);
		process.exit(1);
	}
}

function generateResponsiveImageConfig() {
	console.log("📝 Generating responsive image configuration...");

	const config = {
		bannerImages: [
			{
				name: "banner-01",
				alt: "Banner 1",
				sizes: {
					mobile: "/optimized-banners/banner-01-mobile.webp",
					tablet: "/optimized-banners/banner-01-tablet.webp",
					desktop: "/optimized-banners/banner-01-desktop.webp",
					"2xl": "/optimized-banners/banner-01-2xl.webp",
				},
			},
			{
				name: "banner-02",
				alt: "Banner 2",
				sizes: {
					mobile: "/optimized-banners/banner-02-mobile.webp",
					tablet: "/optimized-banners/banner-02-tablet.webp",
					desktop: "/optimized-banners/banner-02-desktop.webp",
					"2xl": "/optimized-banners/banner-02-2xl.webp",
				},
			},
			{
				name: "banner-03",
				alt: "Banner 3",
				sizes: {
					mobile: "/optimized-banners/banner-03-mobile.webp",
					tablet: "/optimized-banners/banner-03-tablet.webp",
					desktop: "/optimized-banners/banner-03-desktop.webp",
					"2xl": "/optimized-banners/banner-03-2xl.webp",
				},
			},
			{
				name: "banner-04",
				alt: "Banner 4",
				sizes: {
					mobile: "/optimized-banners/banner-04-mobile.webp",
					tablet: "/optimized-banners/banner-04-tablet.webp",
					desktop: "/optimized-banners/banner-04-desktop.webp",
					"2xl": "/optimized-banners/banner-04-2xl.webp",
				},
			},
			{
				name: "banner-05",
				alt: "Banner 5",
				sizes: {
					mobile: "/optimized-banners/banner-05-mobile.webp",
					tablet: "/optimized-banners/banner-05-tablet.webp",
					desktop: "/optimized-banners/banner-05-desktop.webp",
					"2xl": "/optimized-banners/banner-05-2xl.webp",
				},
			},
		],
	};

	const configPath = path.join(__dirname, "../src/utils/imageConfig.js");
	const configContent = `// Auto-generated responsive image configuration
export const bannerImages = ${JSON.stringify(config.bannerImages, null, 2)};

export const getResponsiveImageSrc = (imageName, size = 'desktop') => {
  const image = bannerImages.find(img => img.name === imageName);
  return image ? image.sizes[size] : null;
};

export const getResponsiveImageSrcSet = (imageName) => {
  const image = bannerImages.find(img => img.name === imageName);
  if (!image) return '';
  
  return Object.entries(image.sizes)
    .map(([size, src]) => {
      const width = size === 'mobile' ? 768 : size === 'tablet' ? 1024 : size === 'desktop' ? 1600 : 2400;
      return \`\${src} \${width}w\`;
    })
    .join(', ');
};
`;

	fs.writeFileSync(configPath, configContent);
	console.log(`Image configuration saved to: ${configPath}`);
}

// Run if called directly
if (require.main === module) {
	optimizeBannerImages();
}

module.exports = { optimizeBannerImages };
