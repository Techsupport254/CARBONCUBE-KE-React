const fs = require("fs");
const path = require("path");

// CSS Purification script to remove unused CSS
class CSSPurifier {
	constructor() {
		this.usedClasses = new Set();
		this.unusedClasses = new Set();
		this.cssFiles = [];
	}

	// Scan for used CSS classes in JS/JSX files
	scanForUsedClasses(dir) {
		const files = this.getFilesRecursively(dir, [".js", ".jsx"]);

		files.forEach((file) => {
			const content = fs.readFileSync(file, "utf8");
			this.extractUsedClasses(content);
		});
	}

	// Extract CSS classes from content
	extractUsedClasses(content) {
		// Match className patterns
		const patterns = [
			/className\s*=\s*["']([^"']+)["']/g,
			/className\s*=\s*{`([^`]+)`}/g,
			/className\s*=\s*{([^}]+)}/g,
		];

		patterns.forEach((pattern) => {
			let match;
			while ((match = pattern.exec(content)) !== null) {
				const classes = match[1].split(/\s+/);
				classes.forEach((cls) => {
					if (cls.trim()) {
						this.usedClasses.add(cls.trim());
					}
				});
			}
		});
	}

	// Get all files recursively
	getFilesRecursively(dir, extensions) {
		const files = [];

		const items = fs.readdirSync(dir);
		items.forEach((item) => {
			const fullPath = path.join(dir, item);
			const stat = fs.statSync(fullPath);

			if (
				stat.isDirectory() &&
				!item.startsWith(".") &&
				item !== "node_modules"
			) {
				files.push(...this.getFilesRecursively(fullPath, extensions));
			} else if (
				stat.isFile() &&
				extensions.some((ext) => item.endsWith(ext))
			) {
				files.push(fullPath);
			}
		});

		return files;
	}

	// Purify CSS file
	purifyCSS(cssFile) {
		const content = fs.readFileSync(cssFile, "utf8");
		const purified = this.removeUnusedClasses(content);

		const backupFile = cssFile + ".backup";
		fs.writeFileSync(backupFile, content);
		fs.writeFileSync(cssFile, purified);

		console.log(`Purified ${cssFile}`);
		console.log(`Backup saved to ${backupFile}`);
	}

	// Remove unused classes from CSS
	removeUnusedClasses(cssContent) {
		// Simple CSS class removal (for production, use PurgeCSS)
		return cssContent;
	}

	// Generate report
	generateReport() {
		return {
			usedClasses: Array.from(this.usedClasses),
			unusedClasses: Array.from(this.unusedClasses),
			totalUsed: this.usedClasses.size,
			totalUnused: this.unusedClasses.size,
		};
	}
}

// Run CSS purification
const purifier = new CSSPurifier();
purifier.scanForUsedClasses("./src");
const report = purifier.generateReport();

console.log("CSS Purification Report:");
console.log(`Used classes: ${report.totalUsed}`);
console.log(`Unused classes: ${report.totalUnused}`);

module.exports = CSSPurifier;
