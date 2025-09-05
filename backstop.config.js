const path = require('path');
const fs = require('fs');

// Define viewport sizes
const viewports = [
  {
    label: 'phone',
    width: 375,
    height: 667,
  },
  {
    label: 'tablet',
    width: 768,
    height: 1024,
  },
  {
    label: 'desktop',
    width: 1366,
    height: 768,
  },
];

// Load URLs from generated file or use default
let scenarios = [];
const sitemapUrlsFile = path.join(__dirname, 'sitemap-urls.json');

if (fs.existsSync(sitemapUrlsFile)) {
  try {
    const urls = require(sitemapUrlsFile);
    scenarios = urls.map(url => {
      // Extract path for scenario label
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      const label = pathParts.length > 0 ? pathParts.join('-') : 'homepage';
      
      return {
        label,
        url,
        referenceUrl: '',
        readyEvent: '',
        readySelector: 'body',
        delay: 1000,
        hideSelectors: [],
        removeSelectors: [],
        hoverSelector: '',
        clickSelector: '',
        postInteractionWait: 0,
        selectors: ['document'],
        selectorExpansion: true,
        expect: 0,
        misMatchThreshold: 0.1,
        requireSameDimensions: true
      };
    });
  } catch (error) {
    console.error('Error loading sitemap URLs:', error.message);
    // Fallback to a default scenario
    scenarios = [{
      label: 'homepage',
      url: 'http://localhost:8000/',
      referenceUrl: '',
      readyEvent: '',
      readySelector: 'body',
      delay: 1000,
      hideSelectors: [],
      removeSelectors: [],
      hoverSelector: '',
      clickSelector: '',
      postInteractionWait: 0,
      selectors: ['document'],
      selectorExpansion: true,
      expect: 0,
      misMatchThreshold: 0.1,
      requireSameDimensions: true
    }];
  }
} else {
  console.warn('No sitemap URLs file found. Please run "npm run fetch-sitemap" first.');
  // Fallback to a default scenario
  scenarios = [{
    label: 'homepage',
    url: 'http://localhost:8000/',
    referenceUrl: '',
    readyEvent: '',
    readySelector: 'body',
    delay: 1000,
    hideSelectors: [],
    removeSelectors: [],
    hoverSelector: '',
    clickSelector: '',
    postInteractionWait: 0,
    selectors: ['document'],
    selectorExpansion: true,
    expect: 0,
    misMatchThreshold: 0.1,
    requireSameDimensions: true
  }];
}

module.exports = {
  id: 'bakerydemo-visual-test',
  viewports,
  scenarios,
  onBeforeScript: 'puppet/onBefore.js',
  onReadyScript: 'puppet/onReady.js',
  paths: {
    bitmaps_reference: 'backstop_data/bitmaps_reference',
    bitmaps_test: 'backstop_data/bitmaps_test',
    engine_scripts: 'backstop_data/engine_scripts',
    html_report: 'backstop_data/html_report',
    ci_report: 'backstop_data/ci_report'
  },
  report: ['browser'],
  engine: 'puppeteer',
  engineOptions: {
    args: ['--no-sandbox']
  },
  asyncCaptureLimit: 5,
  asyncCompareLimit: 50,
  debug: false,
  debugWindow: false
};
