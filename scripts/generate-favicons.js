const { favicons } = require("favicons");
const fs = require("fs");
const path = require("path");

// Configuration for favicon generation
const configuration = {
	path: "/", // Path for overriding default icons path
	appName: "Carbon Cube Kenya",
	appShortName: "Carbon Cube Kenya",
	appDescription: "Kenya's most trusted and secure online marketplace",
	developerName: "Carbon Cube Kenya Team",
	developerURL: "https://carboncube-ke.com",
	dir: "ltr",
	lang: "en-US",
	background: "#ffc107",
	theme_color: "#ffc107",
	appleStatusBarStyle: "default",
	display: "standalone",
	orientation: "portrait-primary",
	scope: "/",
	start_url: "/",
	version: "1.0.0",
	logging: true,
	pixel_art: false,
	loadManifestWithCredentials: false,
	icons: {
		android: true,
		appleIcon: true,
		appleStartup: true,
		coast: false,
		favicons: true,
		firefox: false,
		windows: false,
		yandex: false,
	},
};

async function generateFavicons() {
	try {
		console.log("🚀 Starting favicon generation...");

		// Check if source logo exists
		const sourceLogo = path.join(__dirname, "../public/logo.png");
		if (!fs.existsSync(sourceLogo)) {
			console.error("❌ Source logo not found at:", sourceLogo);
			console.log("Please ensure logo.png exists in the public directory");
			return;
		}

		console.log("📁 Source logo found:", sourceLogo);

		// Generate favicons
		const response = await favicons(sourceLogo, configuration);

		console.log("✅ Favicons generated successfully!");

		// Create output directory if it doesn't exist
		const outputDir = path.join(__dirname, "../public");
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		// Write all generated files
		for (const image of response.images) {
			const filePath = path.join(outputDir, image.name);
			fs.writeFileSync(filePath, image.contents);
			console.log(`📄 Created: ${image.name}`);
		}

		for (const file of response.files) {
			const filePath = path.join(outputDir, file.name);
			fs.writeFileSync(filePath, file.contents);
			console.log(`📄 Created: ${file.name}`);
		}

		// Update HTML with generated favicon links
		const htmlContent = response.html.join("\n    ");
		console.log("\n📋 Add these HTML tags to your index.html <head> section:");
		console.log("=".repeat(60));
		console.log(htmlContent);
		console.log("=".repeat(60));

		console.log("\n🎉 Favicon generation completed successfully!");
		console.log("📁 All files have been saved to the public directory");
	} catch (error) {
		console.error("❌ Error generating favicons:", error);
	}
}

// Run the generation
generateFavicons();
