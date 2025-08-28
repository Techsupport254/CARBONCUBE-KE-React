// Use the dynamic sitemap generator directly
const { generateDynamicSitemap } = require("./generate-dynamic-sitemap");

try {
	console.log("🔧 Generating sitemap...");
	generateDynamicSitemap();
	console.log("✅ Sitemap generated successfully!");
} catch (error) {
	console.error("❌ Error generating sitemap:", error.message);
	// Don't fail the build if sitemap generation fails
	process.exit(0);
}
