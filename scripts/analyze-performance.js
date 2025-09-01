const fs = require('fs');
const path = require('path');

// Performance analysis script
function analyzePerformance() {
  try {
    // Read Lighthouse report
    const reportPath = path.join(__dirname, '../lighthouse-report.json');
    if (!fs.existsSync(reportPath)) {
      console.log('❌ Lighthouse report not found. Run "npm run lighthouse" first.');
      return;
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    console.log('🚀 Performance Analysis Report');
    console.log('================================');
    
    // Core Web Vitals
    const audits = report.audits;
    
    // First Contentful Paint
    const fcp = audits['first-contentful-paint'];
    console.log(`\n📊 First Contentful Paint: ${fcp.displayValue}`);
    console.log(`   Score: ${fcp.score * 100}/100`);
    console.log(`   Status: ${fcp.score >= 0.9 ? '✅ Good' : fcp.score >= 0.5 ? '⚠️ Needs Improvement' : '❌ Poor'}`);
    
    // Largest Contentful Paint
    const lcp = audits['largest-contentful-paint'];
    console.log(`\n📊 Largest Contentful Paint: ${lcp.displayValue}`);
    console.log(`   Score: ${lcp.score * 100}/100`);
    console.log(`   Status: ${lcp.score >= 0.9 ? '✅ Good' : lcp.score >= 0.5 ? '⚠️ Needs Improvement' : '❌ Poor'}`);
    
    // Total Blocking Time
    const tbt = audits['total-blocking-time'];
    console.log(`\n📊 Total Blocking Time: ${tbt.displayValue}`);
    console.log(`   Score: ${tbt.score * 100}/100`);
    console.log(`   Status: ${tbt.score >= 0.9 ? '✅ Good' : tbt.score >= 0.5 ? '⚠️ Needs Improvement' : '❌ Poor'}`);
    
    // Cumulative Layout Shift
    const cls = audits['cumulative-layout-shift'];
    console.log(`\n📊 Cumulative Layout Shift: ${cls.displayValue}`);
    console.log(`   Score: ${cls.score * 100}/100`);
    console.log(`   Status: ${cls.score >= 0.9 ? '✅ Good' : cls.score >= 0.5 ? '⚠️ Needs Improvement' : '❌ Poor'}`);
    
    // Speed Index
    const si = audits['speed-index'];
    console.log(`\n📊 Speed Index: ${si.displayValue}`);
    console.log(`   Score: ${si.score * 100}/100`);
    console.log(`   Status: ${si.score >= 0.9 ? '✅ Good' : si.score >= 0.5 ? '⚠️ Needs Improvement' : '❌ Poor'}`);
    
    // JavaScript execution time
    const jsTime = audits['bootup-time'];
    if (jsTime) {
      console.log(`\n📊 JavaScript Execution Time: ${jsTime.displayValue}`);
      console.log(`   Score: ${jsTime.score * 100}/100`);
      console.log(`   Status: ${jsTime.score >= 0.9 ? '✅ Good' : jsTime.score >= 0.5 ? '⚠️ Needs Improvement' : '❌ Poor'}`);
    }
    
    // Main thread work
    const mainThread = audits['mainthread-work-breakdown'];
    if (mainThread) {
      console.log(`\n📊 Main Thread Work: ${mainThread.displayValue}`);
      console.log(`   Score: ${mainThread.score * 100}/100`);
      console.log(`   Status: ${mainThread.score >= 0.9 ? '✅ Good' : mainThread.score >= 0.5 ? '⚠️ Needs Improvement' : '❌ Poor'}`);
    }
    
    // Overall Performance Score
    const performanceScore = report.categories.performance.score * 100;
    console.log(`\n🎯 Overall Performance Score: ${performanceScore.toFixed(1)}/100`);
    console.log(`   Status: ${performanceScore >= 90 ? '✅ Excellent' : performanceScore >= 70 ? '⚠️ Good' : performanceScore >= 50 ? '⚠️ Needs Improvement' : '❌ Poor'}`);
    
    // Recommendations
    console.log('\n🔧 Performance Recommendations:');
    console.log('================================');
    
    const opportunities = Object.values(audits).filter(audit => 
      audit.score !== null && audit.score < 1 && audit.details && audit.details.type === 'opportunity'
    );
    
    if (opportunities.length > 0) {
      opportunities.forEach(opportunity => {
        console.log(`\n• ${opportunity.title}`);
        console.log(`  Potential savings: ${opportunity.details.overallSavingsMs}ms`);
      });
    } else {
      console.log('✅ No major optimization opportunities found!');
    }
    
    // Critical issues
    const criticalIssues = Object.values(audits).filter(audit => 
      audit.score !== null && audit.score < 0.5
    );
    
    if (criticalIssues.length > 0) {
      console.log('\n🚨 Critical Issues to Address:');
      criticalIssues.forEach(issue => {
        console.log(`\n• ${issue.title}`);
        console.log(`  Score: ${issue.score * 100}/100`);
        console.log(`  Description: ${issue.description}`);
      });
    }
    
    // Generate performance report file
    const reportData = {
      timestamp: new Date().toISOString(),
      performanceScore,
      coreWebVitals: {
        fcp: { value: fcp.numericValue, score: fcp.score, displayValue: fcp.displayValue },
        lcp: { value: lcp.numericValue, score: lcp.score, displayValue: lcp.displayValue },
        tbt: { value: tbt.numericValue, score: tbt.score, displayValue: tbt.displayValue },
        cls: { value: cls.numericValue, score: cls.score, displayValue: cls.displayValue },
        si: { value: si.numericValue, score: si.score, displayValue: si.displayValue }
      },
      opportunities: opportunities.map(opp => ({
        title: opp.title,
        savings: opp.details.overallSavingsMs,
        description: opp.description
      })),
      criticalIssues: criticalIssues.map(issue => ({
        title: issue.title,
        score: issue.score,
        description: issue.description
      }))
    };
    
    const reportOutputPath = path.join(__dirname, '../performance-report.json');
    fs.writeFileSync(reportOutputPath, JSON.stringify(reportData, null, 2));
    console.log(`\n📄 Performance report saved to: ${reportOutputPath}`);
    
  } catch (error) {
    console.error('❌ Error analyzing performance:', error.message);
  }
}

// Run analysis
analyzePerformance();
