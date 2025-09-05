# BackstopJS Visual Regression Testing for Wagtail Bakerydemo

This project has been configured with BackstopJS for visual regression testing. The setup uses the site's sitemap to automatically generate test scenarios.

## Prerequisites

- Node.js (version as specified in package.json)
- Running instance of the Wagtail Bakerydemo site (default: http://localhost:8000)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize BackstopJS (optional - already configured):
   ```bash
   npm run backstop:init
   ```

## Usage

### Generating Reference Images

Before running tests, you need to generate reference images. These are the "approved" versions that future tests will be compared against.

```bash
npm run visual-reference
```

This will:
1. Fetch URLs from the sitemap
2. Generate reference images for each URL at different viewport sizes

### Running Visual Regression Tests

To test the current state of the site against the reference images:

```bash
npm run visual-test
```

This will:
1. Fetch URLs from the sitemap
2. Generate test images for each URL
3. Compare against reference images
4. Generate an HTML report

### Approving Changes

If the changes are expected and you want to update the reference images:

```bash
npm run backstop:approve
```

## Configuration

### Environment Variables

- `SITE_URL` - The base URL of your site (default: http://localhost:8000)
- `MAX_URLS` - Maximum number of URLs to test from the sitemap (default: 10)
- `USE_MOCK` - Use mock URLs instead of fetching from sitemap (default: false)

Examples:
```bash
# Use a different site URL
SITE_URL=https://example.com MAX_URLS=20 npm run visual-reference

# Use mock URLs when site is not available
npm run visual-reference:mock
```

### BackstopJS Configuration

The BackstopJS configuration is in `backstop.config.js`. You can modify:

- Viewport sizes
- Selectors to capture
- Mismatching thresholds
- And more!

### Sitemap Script

The script that fetches URLs from the sitemap is in `scripts/fetchSitemap.js`. It:

1. Fetches the sitemap.xml
2. Extracts URLs
3. Limits to a maximum number
4. Saves them to a JSON file for BackstopJS to use

## CI/CD Integration

To integrate with CI/CD systems, you can use the test command with appropriate environment variables:

```bash
SITE_URL=https://staging.example.com npm run visual-test
```

The test will exit with a non-zero code if visual differences are detected, causing the CI pipeline to fail.
