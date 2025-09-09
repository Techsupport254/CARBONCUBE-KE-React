#!/usr/bin/env node

/**
 * Static Shop Page Generator for Social Media Crawlers
 * This creates static HTML files for each shop that social media crawlers can read
 * No nginx changes needed - just serve these static files
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://carboncube-ke.com/api';
const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://carboncube-ke.com';

// Function to make API requests
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Function to generate shop-specific HTML
function generateShopHTML(shopData) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <!-- Shop-specific meta tags -->
    <title>${shopData.title}</title>
    <meta name="description" content="${shopData.description}" />
    <meta name="keywords" content="${shopData.keywords}" />
    
    <!-- Open Graph Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${shopData.url}" />
    <meta property="og:title" content="${shopData.og_title}" />
    <meta property="og:description" content="${shopData.og_description}" />
    <meta property="og:image" content="${shopData.og_image}" />
    <meta property="og:image:width" content="${shopData.og_image_width}" />
    <meta property="og:image:height" content="${shopData.og_image_height}" />
    <meta property="og:image:type" content="${shopData.og_image_type}" />
    <meta property="og:site_name" content="${shopData.og_site_name}" />
    <meta property="og:locale" content="${shopData.og_locale}" />
    
    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="${shopData.twitter_card}" />
    <meta name="twitter:site" content="${shopData.twitter_site}" />
    <meta name="twitter:creator" content="${shopData.twitter_creator}" />
    <meta name="twitter:title" content="${shopData.twitter_title}" />
    <meta name="twitter:description" content="${shopData.twitter_description}" />
    <meta name="twitter:image" content="${shopData.twitter_image}" />
    
    <!-- Business Meta Tags -->
    <meta name="business:name" content="${shopData.business_name}" />
    <meta name="business:type" content="${shopData.business_type}" />
    <meta name="business:location" content="${shopData.business_location}" />
    <meta name="business:rating" content="${shopData.business_rating}" />
    <meta name="business:review_count" content="${shopData.business_review_count}" />
    <meta name="business:product_count" content="${shopData.business_product_count}" />
    <meta name="business:tier" content="${shopData.business_tier}" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${shopData.canonical_url}" />
    
    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" />
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    ${JSON.stringify(shopData.structured_data, null, 2)}
    </script>
    
    <!-- Redirect to actual React app for regular users -->
    <script>
        // Only redirect if not a social media crawler
        const userAgent = navigator.userAgent.toLowerCase();
        const isCrawler = userAgent.includes('facebookexternalhit') || 
                         userAgent.includes('twitterbot') || 
                         userAgent.includes('linkedinbot') || 
                         userAgent.includes('whatsapp') || 
                         userAgent.includes('telegrambot') || 
                         userAgent.includes('slackbot') || 
                         userAgent.includes('discordbot') || 
                         userAgent.includes('skypeuripreview') || 
                         userAgent.includes('applebot') || 
                         userAgent.includes('googlebot') || 
                         userAgent.includes('bingbot') || 
                         userAgent.includes('yandexbot') || 
                         userAgent.includes('duckduckbot') || 
                         userAgent.includes('baiduspider');
        
        if (!isCrawler) {
            window.location.href = '${shopData.url}';
        }
    </script>
</head>
<body>
    <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
        <h1>${shopData.business_name}</h1>
        <p>${shopData.description}</p>
        <p><strong>Location:</strong> ${shopData.business_location}</p>
        <p><strong>Rating:</strong> ${shopData.business_rating}/5 stars (${shopData.business_review_count} reviews)</p>
        <p><strong>Products:</strong> ${shopData.business_product_count} products available</p>
        <p><strong>Tier:</strong> ${shopData.business_tier} seller</p>
        <p><a href="${shopData.url}">Visit Shop</a></p>
    </div>
</body>
</html>`;
}

// Main function
async function generateShopPages() {
    try {
        console.log('🚀 Starting static shop page generation...');
        
        // Create shop-pages directory
        const shopPagesDir = path.join(__dirname, '../public/shop-pages');
        if (!fs.existsSync(shopPagesDir)) {
            fs.mkdirSync(shopPagesDir, { recursive: true });
        }
        
        // Fetch all sellers
        console.log('📡 Fetching sellers...');
        const sellers = await makeRequest(`${API_BASE_URL}/sitemap/sellers`);
        
        console.log(`📊 Found ${sellers.length} sellers`);
        
        // Generate HTML for each shop
        for (const seller of sellers) {
            try {
                const slug = seller.enterprise_name
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
                
                console.log(`📝 Generating page for: ${seller.enterprise_name} (${slug})`);
                
                // Fetch shop meta data
                const metaData = await makeRequest(`${API_BASE_URL}/shop/${slug}/meta`);
                
                // Generate HTML
                const html = generateShopHTML(metaData);
                
                // Save HTML file
                const filePath = path.join(shopPagesDir, `${slug}.html`);
                fs.writeFileSync(filePath, html);
                
                console.log(`✅ Generated: ${slug}.html`);
                
            } catch (error) {
                console.error(`❌ Error generating page for ${seller.enterprise_name}:`, error.message);
            }
        }
        
        console.log('✅ Static shop page generation completed!');
        console.log(`📁 Generated ${sellers.length} shop pages in: ${shopPagesDir}`);
        console.log('📱 Social media crawlers can now read these static HTML files');
        
    } catch (error) {
        console.error('❌ Error generating shop pages:', error);
        process.exit(1);
    }
}

// Run the script
generateShopPages();
