
const { crawlWebsite } = require('./lib/crawler/website-crawler');

(async () => {
    try {
        const url = process.argv[2];
        if (!url) {
            console.error('Please provide a URL to test.');
            process.exit(1);
        }

        console.log(`Testing crawl for: ${url}`);
        const results = await crawlWebsite(url, 1);

        if (results.length > 0) {
            const page = results[0];
            console.log('--- Crawl Result ---');
            console.log('Contact Info:', JSON.stringify(page.contact_info, null, 2));
            console.log('Trust Signals:', JSON.stringify(page.trust_signals, null, 2));
            console.log('Content Signals:', JSON.stringify(page.content_signals, null, 2));
            // Also print raw content snippet to see if address is visible in text
            console.log('--- Content Snippet (first 500 chars) ---');
            console.log(page.content.substring(0, 500));
        } else {
            console.log('No results found.');
        }

    } catch (error) {
        console.error('Crawl failed:', error);
    }
})();
