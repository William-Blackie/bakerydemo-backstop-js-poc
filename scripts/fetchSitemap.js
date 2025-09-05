const axios = require('axios');
const { parseStringPromise } = require('xml2js');
const fs = require('fs').promises;
const path = require('path');

// Assuming the site is running locally on port 8000
const SITE_URL = process.env.SITE_URL || 'http://localhost:8000';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const MAX_URLS = process.env.MAX_URLS ? parseInt(process.env.MAX_URLS) : 10;
const USE_MOCK = process.env.USE_MOCK === 'true' || false;

// Mock data for testing when site is not available
const MOCK_URLS = [
  `${SITE_URL}/`,
  `${SITE_URL}/blog/`,
  `${SITE_URL}/breads/`,
  `${SITE_URL}/locations/`,
  `${SITE_URL}/recipes/`,
  `${SITE_URL}/search/`
];

/**
 * Fetches the sitemap and extracts URLs
 */
async function fetchSitemapUrls() {
  try {
    // Use mock data if requested or try to fetch real sitemap
    let urls = [];
    
    if (USE_MOCK) {
      console.log('Using mock sitemap URLs for testing...');
      urls = MOCK_URLS;
    } else {
      console.log(`Fetching sitemap from ${SITEMAP_URL}...`);
      try {
        const response = await axios.get(SITEMAP_URL, { timeout: 5000 });
        const result = await parseStringPromise(response.data);
        
        // Extract URLs from sitemap
        urls = result.urlset.url.map(item => item.loc[0]);
        console.log(`Found ${urls.length} URLs in sitemap`);
      } catch (error) {
        console.warn(`Failed to fetch sitemap: ${error.message}`);
        console.warn('Using mock URLs as fallback...');
        urls = MOCK_URLS;
      }
    }
    
    console.log(`Limiting to ${MAX_URLS} URLs for testing`);
    
    // Limit the number of URLs if needed
    const limitedUrls = urls.slice(0, MAX_URLS);
    
    // Save URLs to a JSON file for BackstopJS to use
    const outputPath = path.join(__dirname, '..', 'sitemap-urls.json');
    await fs.writeFile(outputPath, JSON.stringify(limitedUrls, null, 2));
    console.log(`URLs saved to ${outputPath}`);
    
    return limitedUrls;
  } catch (error) {
    console.error('Error processing URLs:', error.message);
    // Don't exit with error, instead return mock URLs as fallback
    const outputPath = path.join(__dirname, '..', 'sitemap-urls.json');
    await fs.writeFile(outputPath, JSON.stringify(MOCK_URLS.slice(0, MAX_URLS), null, 2));
    console.log(`Fallback URLs saved to ${outputPath}`);
    return MOCK_URLS.slice(0, MAX_URLS);
  }
}

// Execute if run directly
if (require.main === module) {
  fetchSitemapUrls();
}

module.exports = { fetchSitemapUrls };
