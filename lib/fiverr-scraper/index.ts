import puppeteer from 'puppeteer';

export interface FiverrGigData {
    title: string;
    description: string;
    category: string;
    pricing: any;
    tags: string[];
    reviews: number;
    sellerRating: string;
    hasVideo?: boolean;
    faqCount?: number;
    responseTime?: string;
    lastDelivery?: string;
    imageUrl?: string;
}

export async function scrapeFiverrGig(url: string): Promise<FiverrGigData | null> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await new Promise(r => setTimeout(r, 1000));

        const gigData = await page.evaluate(() => {
            const title = document.querySelector('.gig-title')?.textContent?.trim() || '';
            const description = document.querySelector('.gig-description')?.textContent?.trim() || '';
            const category = document.querySelector('.gig-category-link')?.textContent?.trim() || '';
            const tags = Array.from(document.querySelectorAll('.tag-list li')).map(li => li.textContent?.trim() || '');

            // Extract Main Image
            const imageUrl = document.querySelector('.gig-gallery-component img')?.getAttribute('src') ||
                document.querySelector('.slide img')?.getAttribute('src') || '';

            const pricingElements = document.querySelectorAll('.package-tab');
            const pricing = Array.from(pricingElements).map((tab: any) => ({
                name: tab.querySelector('.package-title')?.textContent?.trim(),
                price: tab.querySelector('.price')?.textContent?.trim(),
                desc: tab.querySelector('.package-description')?.textContent?.trim()
            }));

            const reviews = parseInt(document.querySelector('.rating-count')?.textContent?.replace(/[\(\)]/g, '') || '0');
            const sellerRating = document.querySelector('.rating-score')?.textContent?.trim() || '0.0';

            // Human Trust Signals
            const hasVideo = !!document.querySelector('video') || !!document.querySelector('.video-player');
            const faqCount = document.querySelectorAll('.faq-accordion-item, .faq-item').length;

            // Seller Activity Stats
            const stats = Array.from(document.querySelectorAll('.seller-stat, .user-stats li'));
            let responseTime = 'Unknown';
            let lastDelivery = 'Unknown';

            stats.forEach(stat => {
                const text = stat.textContent || '';
                if (text.includes('Response time')) responseTime = text.replace('Avg. response time', '').trim();
                if (text.includes('Last delivery')) lastDelivery = text.replace('Last delivery', '').trim();
            });

            return {
                title,
                description,
                category,
                tags,
                pricing,
                reviews,
                sellerRating,
                hasVideo,
                faqCount,
                responseTime,
                lastDelivery
            };
        });

        return gigData;

    } catch (error) {
        console.error(`Failed to scrape Fiverr gig: ${url}`, error);
        return null;
    } finally {
        if (browser && browser.process() != null) browser.process()?.kill('SIGINT');
        try { await browser.close(); } catch (e) { }
    }
}

export async function scrapeFiverrCompetitors(categoryUrl: string, limit: number = 10): Promise<FiverrGigData[]> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    const competitors: FiverrGigData[] = [];

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
        await page.goto(categoryUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await new Promise(r => setTimeout(r, 2000));

        const gigUrls = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.gig-card-layout'))
                .slice(0, 10)
                .map((card: any) => card.querySelector('a')?.href)
                .filter(url => !!url);
        });

        for (const url of gigUrls) {
            const gigData = await scrapeFiverrGig(url);
            if (gigData) competitors.push(gigData);
        }

    } catch (error) {
        console.error(`Failed to scrape Fiverr category: ${categoryUrl}`, error);
    } finally {
        await browser.close();
    }

    return competitors;
}
