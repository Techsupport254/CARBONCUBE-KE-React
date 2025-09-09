#!/usr/bin/env node

/**
 * Simple Meta Tag Injection Script
 * This script modifies the index.html file to include dynamic meta tags
 * No nginx changes, no separate services - just modifies the static HTML
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

// Function to create dynamic meta tag injection script
function createMetaTagScript() {
    return `
<script>
// Dynamic Meta Tag Injection for Social Media Crawlers
(function() {
    // Check if we're on a shop page
    const path = window.location.pathname;
    const shopMatch = path.match(/^\/shop\/([^\/]+)$/);
    
    if (shopMatch) {
        const slug = shopMatch[1];
        
        // Fetch shop meta data
        fetch('/api/shop/' + slug + '/meta')
            .then(response => response.json())
            .then(data => {
                // Update meta tags
                document.title = data.title;
                
                // Update description
                let descMeta = document.querySelector('meta[name="description"]');
                if (descMeta) {
                    descMeta.setAttribute('content', data.description);
                } else {
                    const meta = document.createElement('meta');
                    meta.name = 'description';
                    meta.content = data.description;
                    document.head.appendChild(meta);
                }
                
                // Update Open Graph tags
                const ogTags = [
                    { property: 'og:title', content: data.og_title },
                    { property: 'og:description', content: data.og_description },
                    { property: 'og:image', content: data.og_image },
                    { property: 'og:url', content: data.og_url },
                    { property: 'og:type', content: 'website' },
                    { property: 'og:site_name', content: data.og_site_name },
                    { property: 'og:locale', content: data.og_locale }
                ];
                
                ogTags.forEach(tag => {
                    let meta = document.querySelector('meta[property="' + tag.property + '"]');
                    if (meta) {
                        meta.setAttribute('content', tag.content);
                    } else {
                        meta = document.createElement('meta');
                        meta.setAttribute('property', tag.property);
                        meta.setAttribute('content', tag.content);
                        document.head.appendChild(meta);
                    }
                });
                
                // Update Twitter Card tags
                const twitterTags = [
                    { name: 'twitter:card', content: data.twitter_card },
                    { name: 'twitter:site', content: data.twitter_site },
                    { name: 'twitter:creator', content: data.twitter_creator },
                    { name: 'twitter:title', content: data.twitter_title },
                    { name: 'twitter:description', content: data.twitter_description },
                    { name: 'twitter:image', content: data.twitter_image }
                ];
                
                twitterTags.forEach(tag => {
                    let meta = document.querySelector('meta[name="' + tag.name + '"]');
                    if (meta) {
                        meta.setAttribute('content', tag.content);
                    } else {
                        meta = document.createElement('meta');
                        meta.setAttribute('name', tag.name);
                        meta.setAttribute('content', tag.content);
                        document.head.appendChild(meta);
                    }
                });
                
                // Add structured data
                const script = document.createElement('script');
                script.type = 'application/ld+json';
                script.textContent = JSON.stringify(data.structured_data);
                document.head.appendChild(script);
            })
            .catch(error => {
                console.log('Meta tag injection failed:', error);
            });
    }
})();
</script>`;
}

// Main function
async function injectMetaTags() {
    try {
        console.log('🚀 Starting meta tag injection...');
        
        const indexPath = path.join(__dirname, '../build/index.html');
        
        if (!fs.existsSync(indexPath)) {
            console.error('❌ index.html not found. Please run npm run build first.');
            process.exit(1);
        }
        
        // Read the current index.html
        let html = fs.readFileSync(indexPath, 'utf8');
        
        // Create the meta tag injection script
        const metaScript = createMetaTagScript();
        
        // Inject the script before the closing head tag
        html = html.replace('</head>', metaScript + '\n</head>');
        
        // Write the modified HTML back
        fs.writeFileSync(indexPath, html);
        
        console.log('✅ Meta tag injection completed!');
        console.log('📱 Social media crawlers will now get dynamic meta tags');
        
    } catch (error) {
        console.error('❌ Error injecting meta tags:', error);
        process.exit(1);
    }
}

// Run the script
injectMetaTags();
