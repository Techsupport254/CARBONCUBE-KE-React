const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes to generate
const iconSizes = [
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'logo192.png', size: 192 },
  { name: 'logo512.png', size: 512 },
  { name: 'web-app-manifest-192x192.png', size: 192 },
  { name: 'web-app-manifest-512x512.png', size: 512 }
];

async function generateIcons() {
  try {
    console.log('🚀 Starting icon generation...');
    
    // Check if source logo exists
    const sourceLogo = path.join(__dirname, '../public/logo.png');
    if (!fs.existsSync(sourceLogo)) {
      console.error('❌ Source logo not found at:', sourceLogo);
      console.log('Please ensure logo.png exists in the public directory');
      return;
    }

    console.log('📁 Source logo found:', sourceLogo);
    
    // Generate each icon size
    for (const icon of iconSizes) {
      const outputPath = path.join(__dirname, '../public', icon.name);
      
      await sharp(sourceLogo)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Created: ${icon.name} (${icon.size}x${icon.size})`);
    }
    
    console.log('\n🎉 Icon generation completed successfully!');
    console.log('📁 All files have been saved to the public directory');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

// Run the generation
generateIcons();
