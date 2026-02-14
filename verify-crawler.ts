import { crawlWebsite } from './lib/crawler/website-crawler';

async function test() {
    const url = 'https://kyliecosmetics.com';
    console.log(`Testing crawler with: ${url}`);

    try {
        const results = await crawlWebsite(url, 5);
        console.log(`Crawl completed. Found ${results.length} pages.`);

        results.forEach((page, i) => {
            console.log(`[${i + 1}] ${page.url}`);
            console.log(`    Title: ${page.title}`);
            console.log(`    Content length: ${page.content.length}`);
        });

        if (results.length === 0) {
            console.error('CRITICAL: No pages found. Checking logic...');
        }
    } catch (err) {
        console.error('Crawler crashed:', err);
    }
}

test();
