#!/usr/bin/env node

/**
 * Server-Side Meta Tag Injection
 * This creates a simple Express server that serves shop pages with proper meta tags
 * No nginx changes needed - just run this alongside your existing setup
 */

const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.META_SERVER_PORT || 3002;

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

// Route for shop pages
app.get('/shop/:slug', async (req, res) => {
    const { slug } = req.params;
    const userAgent = req.get('User-Agent') || '';
    
    // Check if it's a social media crawler
    const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Slackbot|Discordbot|SkypeUriPreview|Applebot|Googlebot|Bingbot|YandexBot|DuckDuckBot|Baiduspider|facebook|twitter|linkedin|whatsapp|telegram|slack|discord|skype/i.test(userAgent);
    
    if (isCrawler) {
        try {
            console.log(`🤖 Serving shop page for crawler: ${slug}`);
            
            // Fetch shop meta data
            const metaData = await makeRequest(`https://carboncube-ke.com/api/shop/${slug}/meta`);
            
            // Generate HTML with meta tags
            const html = generateShopHTML(metaData);
            
            res.send(html);
        } catch (error) {
            console.error('Error generating shop page:', error);
            // Fallback to redirect
            res.redirect(`https://carboncube-ke.com/shop/${slug}`);
        }
    } else {
        // For regular users, redirect to the actual React app
        res.redirect(`https://carboncube-ke.com/shop/${slug}`);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Meta Tag Server running on port ${PORT}`);
    console.log(`📱 Ready to serve social media crawlers with proper meta tags`);
    console.log(`🔗 Test URL: http://localhost:${PORT}/shop/pantech-kenya-ltd`);
});

module.exports = app;
