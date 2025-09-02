const fs = require('fs');
const path = require('path');

// Performance metrics tracking
class PerformanceTracker {
  constructor() {
    this.metrics = {
      fcp: [],
      lcp: [],
      fid: [],
      cls: [],
      ttfb: [],
      fmp: []
    };
    this.reportPath = path.join(__dirname, '../performance-report.json');
  }

  // Track First Contentful Paint
  trackFCP(value) {
    this.metrics.fcp.push({
      value,
      timestamp: Date.now(),
      url: window.location.href
    });
  }

  // Track Largest Contentful Paint
  trackLCP(value) {
    this.metrics.lcp.push({
      value,
      timestamp: Date.now(),
      url: window.location.href
    });
  }

  // Track First Input Delay
  trackFID(value) {
    this.metrics.fid.push({
      value,
      timestamp: Date.now(),
      url: window.location.href
    });
  }

  // Track Cumulative Layout Shift
  trackCLS(value) {
    this.metrics.cls.push({
      value,
      timestamp: Date.now(),
      url: window.location.href
    });
  }

  // Track Time to First Byte
  trackTTFB(value) {
    this.metrics.ttfb.push({
      value,
      timestamp: Date.now(),
      url: window.location.href
    });
  }

  // Track First Meaningful Paint
  trackFMP(value) {
    this.metrics.fmp.push({
      value,
      timestamp: Date.now(),
      url: window.location.href
    });
  }

  // Get average metrics
  getAverageMetrics() {
    const averages = {};
    
    Object.keys(this.metrics).forEach(key => {
      const values = this.metrics[key].map(m => m.value);
      if (values.length > 0) {
        averages[key] = values.reduce((a, b) => a + b, 0) / values.length;
      }
    });

    return averages;
  }

  // Get performance score
  getPerformanceScore() {
    const averages = this.getAverageMetrics();
    let score = 100;

    // FCP scoring (0-100)
    if (averages.fcp) {
      if (averages.fcp > 2500) score -= 30;
      else if (averages.fcp > 1800) score -= 20;
      else if (averages.fcp > 1000) score -= 10;
    }

    // LCP scoring (0-100)
    if (averages.lcp) {
      if (averages.lcp > 4000) score -= 30;
      else if (averages.lcp > 2500) score -= 20;
      else if (averages.lcp > 1500) score -= 10;
    }

    // CLS scoring (0-100)
    if (averages.cls) {
      if (averages.cls > 0.25) score -= 20;
      else if (averages.cls > 0.1) score -= 10;
    }

    // FID scoring (0-100)
    if (averages.fid) {
      if (averages.fid > 300) score -= 20;
      else if (averages.fid > 100) score -= 10;
    }

    return Math.max(0, score);
  }

  // Save metrics to file
  saveMetrics() {
    try {
      const report = {
        timestamp: Date.now(),
        metrics: this.metrics,
        averages: this.getAverageMetrics(),
        score: this.getPerformanceScore()
      };

      fs.writeFileSync(this.reportPath, JSON.stringify(report, null, 2));
    } catch (error) {
      console.error('Failed to save performance metrics:', error);
    }
  }

  // Load metrics from file
  loadMetrics() {
    try {
      if (fs.existsSync(this.reportPath)) {
        const data = fs.readFileSync(this.reportPath, 'utf8');
        const report = JSON.parse(data);
        this.metrics = report.metrics || this.metrics;
        return report;
      }
    } catch (error) {
      console.error('Failed to load performance metrics:', error);
    }
    return null;
  }

  // Generate performance report
  generateReport() {
    const averages = this.getAverageMetrics();
    const score = this.getPerformanceScore();

    const report = {
      summary: {
        score,
        timestamp: Date.now(),
        url: typeof window !== 'undefined' ? window.location.href : 'unknown'
      },
      metrics: {
        fcp: {
          average: averages.fcp,
          unit: 'ms',
          target: '< 1800ms',
          status: averages.fcp < 1800 ? 'good' : 'needs-improvement'
        },
        lcp: {
          average: averages.lcp,
          unit: 'ms',
          target: '< 2500ms',
          status: averages.lcp < 2500 ? 'good' : 'needs-improvement'
        },
        cls: {
          average: averages.cls,
          unit: '',
          target: '< 0.1',
          status: averages.cls < 0.1 ? 'good' : 'needs-improvement'
        },
        fid: {
          average: averages.fid,
          unit: 'ms',
          target: '< 100ms',
          status: averages.fid < 100 ? 'good' : 'needs-improvement'
        },
        ttfb: {
          average: averages.ttfb,
          unit: 'ms',
          target: '< 600ms',
          status: averages.ttfb < 600 ? 'good' : 'needs-improvement'
        }
      },
      recommendations: this.generateRecommendations(averages)
    };

    return report;
  }

  // Generate performance recommendations
  generateRecommendations(averages) {
    const recommendations = [];

    if (averages.fcp > 1800) {
      recommendations.push({
        metric: 'FCP',
        issue: 'First Contentful Paint is too slow',
        suggestions: [
          'Optimize critical rendering path',
          'Reduce render-blocking resources',
          'Optimize server response time',
          'Use resource hints (preload, preconnect)'
        ]
      });
    }

    if (averages.lcp > 2500) {
      recommendations.push({
        metric: 'LCP',
        issue: 'Largest Contentful Paint is too slow',
        suggestions: [
          'Optimize images (WebP, responsive images)',
          'Implement lazy loading',
          'Use CDN for static assets',
          'Optimize CSS delivery'
        ]
      });
    }

    if (averages.cls > 0.1) {
      recommendations.push({
        metric: 'CLS',
        issue: 'Cumulative Layout Shift is too high',
        suggestions: [
          'Set explicit dimensions for images',
          'Avoid inserting content above existing content',
          'Use CSS transforms instead of changing layout properties',
          'Reserve space for dynamic content'
        ]
      });
    }

    if (averages.fid > 100) {
      recommendations.push({
        metric: 'FID',
        issue: 'First Input Delay is too high',
        suggestions: [
          'Reduce JavaScript execution time',
          'Split long tasks',
          'Optimize event handlers',
          'Use web workers for heavy computations'
        ]
      });
    }

    return recommendations;
  }
}

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceTracker;
} else if (typeof window !== 'undefined') {
  window.PerformanceTracker = PerformanceTracker;
}
