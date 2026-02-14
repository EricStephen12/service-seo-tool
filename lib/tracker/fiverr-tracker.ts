import puppeteer from 'puppeteer';

export async function getFiverrRanking(gigUrl: string, searchTerms: string): Promise<number | null> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        const searchUrl = `https://www.fiverr.com/search/gigs?query=${encodeURIComponent(searchTerms)}`;
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await new Promise(r => setTimeout(r, 2000));

        // Scrape positions (simplified: only checks first page)
        const position = await page.evaluate((url) => {
            const cards = Array.from(document.querySelectorAll('.gig-card-layout'));
            return cards.findIndex((card: any) => card.querySelector('a')?.href.includes(url));
        }, gigUrl);

        return position !== -1 ? position + 1 : null;

    } catch (error) {
        console.error(`Fiverr Ranking check failed for ${searchTerms}:`, error);
        return null;
    } finally {
        await browser.close();
    }
}
