# Analytics Testing Guide

This guide shows you how to test that your analytics tracking is working properly.

## 🚀 Quick Start Testing

### Method 1: Use the Test Component (Recommended)

1. **Start your React app:**

   ```bash
   cd frontend
   npm start
   ```

2. **Navigate to the test page:**

   ```
   http://localhost:3000/analytics-test
   ```

3. **Click the test buttons** to verify each tracking function

### Method 2: Browser Console Testing

1. **Open your app** in the browser
2. **Open Developer Tools** (F12 or right-click → Inspect)
3. **Go to Console tab**
4. **Copy and paste** the contents of `analytics-test-console.js`
5. **Press Enter** to run the test

### Method 3: Manual Testing

1. **Open Developer Tools** → **Network tab**
2. **Navigate through your app**
3. **Look for requests to:**
   - `googletagmanager.com` (Google Analytics)
   - `matomo.cloud` (Matomo)

## 🔍 Detailed Testing Steps

### Step 1: Verify Script Loading

**Check if analytics scripts are loaded:**

```javascript
// In browser console
console.log("Google Analytics:", typeof window.gtag !== "undefined");
console.log("Matomo:", typeof window._mtm !== "undefined");
```

**Expected output:**

```
Google Analytics: true
Matomo: true
```

### Step 2: Test Google Analytics

**Send a test event:**

```javascript
// In browser console
window.gtag("event", "test_event", {
	event_category: "Testing",
	event_label: "Console Test",
	value: 1,
});
```

**Check in Google Analytics:**

1. Go to [Google Analytics](https://analytics.google.com)
2. Navigate to **Reports** → **Realtime** → **Events**
3. Look for your test event

### Step 3: Test Matomo

**Send a test event:**

```javascript
// In browser console
window._mtm.push({
	event: "custom",
	category: "Testing",
	action: "console_test",
	name: "Console Test Event",
	value: 1,
});
```

**Check in Matomo:**

1. Go to your [Matomo dashboard](https://carboncubeke.matomo.cloud)
2. Navigate to **Real-time** → **Live**
3. Look for your test event

### Step 4: Test Page Views

**Test page view tracking:**

```javascript
// In browser console
// Google Analytics
window.gtag("config", "G-JCS1KWM0GH", {
	page_title: "Test Page",
	page_location: window.location.href,
});

// Matomo
window._mtm.push({
	event: "page_view",
	page_title: "Test Page",
	page_url: window.location.href,
});
```

## 🛠️ Troubleshooting

### Issue: Analytics not loading

**Symptoms:**

- `window.gtag` is undefined
- `window._mtm` is undefined
- No network requests to analytics domains

**Solutions:**

1. **Check ad blockers** - Disable uBlock Origin, AdBlock Plus, etc.
2. **Check network connectivity**
3. **Verify tracking IDs** are correct
4. **Check browser console** for JavaScript errors

### Issue: Events not appearing in dashboards

**Symptoms:**

- Scripts load but events don't appear
- Network requests are made but no data

**Solutions:**

1. **Wait 24-48 hours** for data to appear (especially for Google Analytics)
2. **Check real-time reports** for immediate feedback
3. **Verify tracking IDs** match your dashboard
4. **Check for JavaScript errors** in console

### Issue: Duplicate tracking

**Symptoms:**

- Multiple events for single actions
- Inflated analytics numbers

**Solutions:**

1. **Check for multiple script inclusions**
2. **Ensure tracking components are mounted once**
3. **Review your tracking implementation**

## 📊 Verification Checklist

### ✅ Basic Setup

- [ ] Analytics scripts load without errors
- [ ] `window.gtag` is available
- [ ] `window._mtm` is available
- [ ] Network requests to analytics domains

### ✅ Event Tracking

- [ ] Google Analytics events appear in real-time
- [ ] Matomo events appear in real-time
- [ ] Page views are tracked
- [ ] Custom events work

### ✅ Integration Testing

- [ ] Test component works (`/analytics-test`)
- [ ] Console script works
- [ ] No JavaScript errors
- [ ] Network requests are successful

## 🎯 Advanced Testing

### Test Specific User Actions

**Login tracking:**

```javascript
// Simulate login
trackFormSubmission("user_login", true);
```

**Button click tracking:**

```javascript
// Simulate button click
trackButtonClick("test_button", "/test-page");
```

**User interaction tracking:**

```javascript
// Simulate user interaction
trackUserInteraction("product_view", "product_123");
```

### Test Error Scenarios

**Test with analytics disabled:**

```javascript
// Temporarily disable analytics
window.gtag = undefined;
window._mtm = undefined;

// Test your tracking functions
trackButtonClick("test_button", "/test-page");
// Should not throw errors
```

**Test network failures:**

- Disconnect internet
- Test tracking functions
- Verify graceful degradation

## 📈 Monitoring

### Regular Health Checks

**Daily:**

- Check analytics dashboards for data
- Monitor for JavaScript errors
- Verify tracking is working

**Weekly:**

- Review analytics data quality
- Check for unusual patterns
- Update tracking if needed

**Monthly:**

- Review privacy compliance
- Update tracking libraries
- Clean up unused tracking code

## 🔧 Debug Mode

**Enable debug logging:**

```javascript
// Google Analytics debug
window.gtag("config", "G-JCS1KWM0GH", {
	debug_mode: true,
});

// Matomo debug
window._mtm.push({
	event: "debug",
	message: "Debug message",
});
```

## 📞 Support

If you're still having issues:

1. **Check the browser console** for errors
2. **Verify your tracking IDs** are correct
3. **Test with the provided test component**
4. **Check network connectivity**
5. **Review the analytics documentation**

Remember: Analytics data can take 24-48 hours to appear in reports, but real-time data should be available immediately.
