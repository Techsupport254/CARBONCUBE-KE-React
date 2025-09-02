const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const inputDir = './Banners';
const outputDir = './public/optimized-banners';
const sizes = [
  { width: 640, suffix: 'sm' },
  { width: 768, suffix: 'md' },
  { width: 1024, suffix: 'lg' },
  { width: 1280, suffix: 'xl' },
  { width: 1600, suffix: '2xl' }
];

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
  try {
    console.log('Starting image optimization...');
    
    // Get all image files from input directory
    const files = fs.readdirSync(inputDir).filter(file => 
      /\.(jpg|jpeg|png)$/i.test(file)
    );

    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const baseName = path.parse(file).name;
      
      console.log(`Processing ${file}...`);

      // Create responsive images for each size
      for (const size of sizes) {
        const outputName = `${baseName}-${size.suffix}.webp`;
        const outputPath = path.join(outputDir, outputName);
        
        // Resize and convert to WebP
        await sharp(inputPath)
          .resize(size.width, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ 
            quality: 80,
            effort: 6
          })
          .toFile(outputPath);
        
        console.log(`Created ${outputName} (${size.width}px)`);
      }

      // Create fallback JPEG versions
      for (const size of sizes) {
        const outputName = `${baseName}-${size.suffix}.jpg`;
        const outputPath = path.join(outputDir, outputName);
        
        await sharp(inputPath)
          .resize(size.width, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ 
            quality: 80,
            progressive: true
          })
          .toFile(outputPath);
        
        console.log(`Created ${outputName} (${size.width}px)`);
      }
    }

    console.log('Image optimization completed successfully!');
    
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

optimizeImages();
