#!/usr/bin/env node

/**
 * Development Cache Clearer
 * Clears all caches for development to prevent hard refresh issues
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function clearDevelopmentCache() {
	try {
		console.log("🧹 Clearing development cache...");

		// Step 1: Clear browser cache instructions
		console.log("\n📋 Browser Cache Clearing Instructions:");
		console.log("========================================");
		console.log("1. Open Developer Tools (F12)");
		console.log("2. Right-click the refresh button");
		console.log('3. Select "Empty Cache and Hard Reload"');
		console.log("4. Or use Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)");

		// Step 2: Clear service worker cache
		clearServiceWorkerCache();

		// Step 3: Clear build cache
		clearBuildCache();

		// Step 4: Clear node modules cache (optional)
		clearNodeCache();

		console.log("\n✅ Development cache cleared successfully!");
		console.log("🔄 Please restart your development server");
	} catch (error) {
		console.error("❌ Error clearing cache:", error.message);
	}
}

function clearServiceWorkerCache() {
	console.log("\n🔧 Clearing service worker cache...");

	const swClearScript = `
// Service Worker Cache Clearer
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
      console.log('Service worker unregistered');
    });
  });
  
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
        console.log('Cache deleted:', cacheName);
      });
    });
  }
}
`;

	const swClearPath = path.join(__dirname, "../public/sw-clear.js");
	fs.writeFileSync(swClearPath, swClearScript);

	console.log("✅ Service worker cache clearer created");
	console.log("📁 File: public/sw-clear.js");
	console.log("💡 Include this script in your HTML to clear SW cache");
}

function clearBuildCache() {
	console.log("\n📦 Clearing build cache...");

	const buildDir = path.join(__dirname, "../build");
	const cacheDirs = [
		path.join(__dirname, "../node_modules/.cache"),
		path.join(__dirname, "../.cache"),
		path.join(__dirname, "../.next"),
		path.join(__dirname, "../dist"),
	];

	cacheDirs.forEach((dir) => {
		if (fs.existsSync(dir)) {
			try {
				execSync(`rm -rf "${dir}"`, { stdio: "inherit" });
				console.log(`✅ Cleared: ${dir}`);
			} catch (error) {
				console.log(`⚠️  Could not clear: ${dir}`);
			}
		}
	});

	console.log("✅ Build cache cleared");
}

function clearNodeCache() {
	console.log("\n🟢 Clearing Node.js cache...");

	try {
		// Clear npm cache
		execSync("npm cache clean --force", { stdio: "inherit" });
		console.log("✅ NPM cache cleared");

		// Clear yarn cache if available
		try {
			execSync("yarn cache clean", { stdio: "inherit" });
			console.log("✅ Yarn cache cleared");
		} catch (error) {
			// Yarn not available, skip
		}
	} catch (error) {
		console.log("⚠️  Could not clear Node.js cache");
	}
}

// Create a simple HTML file to clear cache
function createCacheClearHTML() {
	console.log("\n📄 Creating cache clear HTML...");

	const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clear Cache - Carbon Cube Kenya</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            line-height: 1.6;
        }
        .button {
            background: #ffc107;
            color: #000;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
        }
        .button:hover {
            background: #e0a800;
        }
        .status {
            margin: 20px 0;
            padding: 15px;
            border-radius: 6px;
            background: #f8f9fa;
        }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <h1>🔄 Cache Management</h1>
    <p>Use these buttons to clear various caches for development:</p>
    
    <button class="button" onclick="clearServiceWorker()">Clear Service Worker</button>
    <button class="button" onclick="clearBrowserCache()">Clear Browser Cache</button>
    <button class="button" onclick="clearAllCaches()">Clear All Caches</button>
    <button class="button" onclick="reloadPage()">Reload Page</button>
    
    <div id="status"></div>
    
    <script>
        function showStatus(message, type = 'success') {
            const status = document.getElementById('status');
            status.innerHTML = '<div class="status ' + type + '">' + message + '</div>';
        }
        
        function clearServiceWorker() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then((registrations) => {
                    registrations.forEach((registration) => {
                        registration.unregister();
                    });
                    showStatus('✅ Service worker unregistered');
                });
                
                if ('caches' in window) {
                    caches.keys().then((cacheNames) => {
                        cacheNames.forEach((cacheName) => {
                            caches.delete(cacheName);
                        });
                        showStatus('✅ Service worker caches cleared');
                    });
                }
            } else {
                showStatus('⚠️ Service worker not supported', 'error');
            }
        }
        
        function clearBrowserCache() {
            if ('caches' in window) {
                caches.keys().then((cacheNames) => {
                    cacheNames.forEach((cacheName) => {
                        caches.delete(cacheName);
                    });
                    showStatus('✅ Browser cache cleared');
                });
            } else {
                showStatus('⚠️ Cache API not supported', 'error');
            }
        }
        
        function clearAllCaches() {
            clearServiceWorker();
            clearBrowserCache();
            showStatus('✅ All caches cleared');
        }
        
        function reloadPage() {
            window.location.reload(true);
        }
        
        // Auto-clear on page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                clearAllCaches();
            }, 1000);
        });
    </script>
</body>
</html>`;

	const htmlPath = path.join(__dirname, "../public/cache-clear.html");
	fs.writeFileSync(htmlPath, htmlContent);

	console.log("✅ Cache clear HTML created");
	console.log("📁 File: public/cache-clear.html");
	console.log("🌐 Visit: http://localhost:3000/cache-clear.html");
}

// Run if called directly
if (require.main === module) {
	clearDevelopmentCache();
	createCacheClearHTML();
}

module.exports = { clearDevelopmentCache };
