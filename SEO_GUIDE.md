# SEO Optimization Guide for Carbon Cube Kenya

## Overview

This guide explains the comprehensive SEO implementation for Carbon Cube Kenya's React application. The system provides per-page SEO optimization with dynamic metadata, social media sharing, and build-time pre-rendering.

## Architecture

### SEO Components

1. **ProductSEO** - For individual product/ad pages (`/ads/:adId`)
2. **ShopSEO** - For seller shop pages (`/shop/:slug`)
3. **CategorySEO** - For category pages (`/categories/:category`)
4. **StaticPageSEO** - For static pages (About, Contact, etc.)
5. **ComprehensiveSEO** - General-purpose SEO component
6. **SEOHead** - Simple SEO component for basic needs

### Key Features

- ✅ Dynamic meta tags per page
- ✅ Open Graph and Twitter Card support
- ✅ Structured data (JSON-LD) for search engines
- ✅ AI search optimization meta tags
- ✅ Build-time pre-rendering with react-snap
- ✅ Social media sharing optimization
- ✅ Mobile-friendly meta tags
- ✅ Canonical URLs
- ✅ Breadcrumb structured data

## Implementation

### 1. Product Pages (`/ads/:adId`)

```jsx
import ProductSEO from "../../components/ProductSEO";

const AdDetails = () => {
  const [ad, setAd] = useState(null);
  
  const productData = ad ? {
    id: ad.id,
    title: ad.title,
    description: ad.description,
    price: ad.price,
    currency: "KES",
    condition: ad.condition,
    category: ad.category_name,
    brand: ad.brand,
    seller: ad.seller_name,
    images: ad.media_urls,
    // ... other product data
  } : null;

  return (
    <>
      <ProductSEO product={productData} />
      {/* Rest of component */}
    </>
  );
};
```

**Generated Meta Tags:**
- Title: `{Product Title} | {Brand} - KSh {Price} | Carbon Cube Kenya`
- Description: `Buy {Product Title} for KSh {Price} on Carbon Cube Kenya...`
- Open Graph tags for social sharing
- Product structured data with offers, reviews, etc.
- Breadcrumb navigation

### 2. Shop Pages (`/shop/:slug`)

```jsx
import ShopSEO from "../../components/ShopSEO";

const ShopPage = () => {
  const [shop, setShop] = useState(null);
  
  const shopData = shop ? {
    enterprise_name: shop.enterprise_name,
    description: shop.description,
    location: shop.county,
    tier: shop.tier_name,
    product_count: shop.product_count,
    // ... other shop data
  } : null;

  return (
    <>
      <ShopSEO shop={shopData} />
      {/* Rest of component */}
    </>
  );
};
```

**Generated Meta Tags:**
- Title: `{Shop Name} - Shop | {Count} Products | {Tier} Tier Seller`
- Description: `Shop {Shop Name} on Carbon Cube Kenya...`
- Business structured data
- Collection page structured data

### 3. Static Pages

```jsx
import StaticPageSEO from "../../components/StaticPageSEO";

const AboutUs = () => {
  const pageData = {
    title: "About Us - Carbon Cube Kenya",
    description: "Learn about Carbon Cube Kenya...",
    keywords: ["about", "company", "mission"],
    section: "About",
    tags: ["About", "Company", "Team"]
  };

  return (
    <>
      <StaticPageSEO pageType="about" pageData={pageData} />
      {/* Rest of component */}
    </>
  );
};
```

## Build-Time Pre-rendering

### React-Snap Configuration

The application uses `react-snap` to pre-render pages at build time, ensuring crawlers see the correct metadata.

**Package.json Configuration:**
```json
{
  "scripts": {
    "postbuild": "react-snap"
  },
  "reactSnap": {
    "inlineCss": true,
    "puppeteerArgs": ["--no-sandbox", "--disable-setuid-sandbox"],
    "include": [
      "/",
      "/about-us",
      "/contact-us",
      // ... other routes
    ],
    "skipThirdPartyRequests": true,
    "cacheAjaxRequests": false,
    "preloadImages": false,
    "minifyHtml": {
      "collapseWhitespace": true,
      "removeComments": true
    }
  }
}
```

### Dynamic Routes Generation

Use the provided script to generate routes for popular ads and shops:

```bash
node scripts/generate-routes.js
```

This script:
1. Fetches popular ads and shops from your API
2. Generates route lists for react-snap
3. Updates package.json configuration
4. Creates fallback sample routes for testing

## SEO Features

### 1. Meta Tags

Each page includes comprehensive meta tags:

```html
<!-- Primary Meta Tags -->
<title>Page Title | Carbon Cube Kenya</title>
<meta name="description" content="Page description" />
<meta name="keywords" content="keywords" />

<!-- Open Graph Tags -->
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="Page description" />
<meta property="og:image" content="image-url" />
<meta property="og:url" content="page-url" />

<!-- Twitter Card Tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Page Title" />
<meta name="twitter:description" content="Page description" />
<meta name="twitter:image" content="image-url" />
```

### 2. Structured Data

Each page includes relevant structured data:

**Product Pages:**
- Product schema with offers, reviews, ratings
- Breadcrumb navigation
- Seller organization data

**Shop Pages:**
- Store schema with business information
- Collection page schema
- Aggregate ratings

**Static Pages:**
- WebPage schema
- Organization data
- Breadcrumb navigation

### 3. AI Search Optimization

Special meta tags for AI search engines:

```html
<meta name="ai:content_type" content="product" />
<meta name="ai:expertise_level" content="expert" />
<meta name="ai:content_depth" content="comprehensive" />
<meta name="ai:format_optimized" content="true" />
<meta name="ai:citation_optimized" content="true" />
<meta name="google:ai_overviews" content="optimized" />
<meta name="bing:ai_chat" content="optimized" />
<meta name="openai:chatgpt" content="optimized" />
```

### 4. Social Media Sharing

Optimized for social media platforms:

- **Facebook/LinkedIn**: Open Graph tags
- **Twitter**: Twitter Card tags
- **WhatsApp**: Open Graph fallback
- **Instagram**: Open Graph fallback

## Configuration

### SEO Config (`src/config/seoConfig.js`)

Centralized configuration for:
- Site information
- Page templates
- AI search settings
- Performance optimization
- Structured data templates

### Default Meta Tags (`public/index.html`)

Fallback meta tags for crawlers that don't execute JavaScript:
- Default title and description
- Open Graph tags
- Twitter Card tags
- Structured data

## Best Practices

### 1. Page-Specific SEO

- Use appropriate SEO component for each page type
- Provide comprehensive data objects
- Include relevant keywords and tags
- Set proper canonical URLs

### 2. Image Optimization

- Use high-quality images for social sharing (1200x630px)
- Provide alt text for accessibility
- Use absolute URLs for images
- Optimize image file sizes

### 3. Content Optimization

- Write compelling titles (50-60 characters)
- Create descriptive meta descriptions (150-160 characters)
- Use relevant keywords naturally
- Include location-based keywords for Kenya

### 4. Technical SEO

- Ensure fast page load times
- Use semantic HTML structure
- Implement proper heading hierarchy
- Include internal linking

## Testing

### 1. Social Media Testing

Test your pages on social media platforms:
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### 2. Search Engine Testing

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)

### 3. Pre-rendering Testing

After building with react-snap:
```bash
npm run build
# Check build/ folder for pre-rendered HTML files
```

## Deployment

### 1. Build Process

```bash
# Install dependencies
npm install

# Generate dynamic routes
node scripts/generate-routes.js

# Build with pre-rendering
npm run build
```

### 2. Server Configuration

Ensure your server:
- Serves static files from `build/` directory
- Has proper MIME types for HTML files
- Includes compression (gzip/brotli)
- Sets proper cache headers

### 3. Monitoring

Monitor SEO performance:
- Google Search Console
- Google Analytics
- Social media engagement metrics
- Page load speeds

## Troubleshooting

### Common Issues

1. **Meta tags not showing in social sharing**
   - Check if react-snap is working correctly
   - Verify image URLs are absolute
   - Test with social media debuggers

2. **Structured data errors**
   - Validate with Schema.org validator
   - Check for required fields
   - Ensure proper JSON-LD format

3. **Pre-rendering issues**
   - Check react-snap configuration
   - Verify routes are accessible
   - Test with sample data

### Debug Tools

- Browser DevTools (Elements tab)
- React DevTools
- Network tab for API calls
- Console for JavaScript errors

## Future Enhancements

1. **Dynamic Sitemap Generation**
   - Auto-generate sitemap.xml
   - Include all product and shop pages
   - Update on content changes

2. **Advanced Analytics**
   - Track SEO performance
   - Monitor social sharing
   - Measure conversion rates

3. **A/B Testing**
   - Test different meta descriptions
   - Optimize titles
   - Improve click-through rates

4. **Internationalization**
   - Multi-language support
   - Hreflang tags
   - Localized content

---

For questions or issues, refer to the component documentation or contact the development team.
