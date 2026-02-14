import puppeteer from 'puppeteer';

async function test(targetUrl) {
    console.log(`\n--- Testing Crawler with: ${targetUrl} ---`);
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        console.log(`[Test] Navigating...`);
        const response = await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

        console.log(`[Test] Response Status: ${response?.status() || 'Unknown'}`);

        if (response?.status() === 200) {
            const data = await page.evaluate(() => {
                return {
                    title: document.title,
                    contentLen: document.body.innerText.length,
                    linksFound: document.querySelectorAll('a').length
                };
            });
            console.log('SUCCESS: Page loaded.');
            console.log(`Title: ${data.title}`);
            console.log(`Content Length: ${data.contentLen}`);
            console.log(`Total Links Found: ${data.linksFound}`);
        } else {
            console.error(`FAILURE: Received status ${response?.status()}`);
        }
    } catch (err) {
        console.error(`[Test] Crash: ${err.message}`);
    } finally {
        await browser.close();
        console.log(`--- Test Finished ---\n`);
    }
}

async function runAll() {
    await test('https://socially.bio'); // Simpler
    await test('https://kyliecosmetics.com'); // Harder
}

runAll();
