import puppeteer, { Page, Browser } from 'puppeteer';

export interface CrawledPage {
    url: string;
    title: string;
    description: string;
    headings: { h1: string[], h2: string[] };
    images: { src: string, alt: string, width: number, height: number }[];
    loadTime: number;
    mobileFriendly: boolean;
    content: string;
    hasSitemap: boolean;
    hasRobots: boolean;
    hasSSL: boolean;
    schema?: any[];
    screenshot?: string;
    trust_signals?: { has_privacy_policy: boolean, has_terms: boolean };
    contact_info?: { phone: boolean, email: boolean, address: boolean, whatsapp: boolean, address_text?: string };
    social_links?: string[];
    cta_data?: { count: number, primary_text: string };
    content_signals?: {
        has_blog: boolean;
        has_testimonials: boolean;
        internal_links_count: number;
        external_links_count: number;
    };
}

export async function crawlWebsite(baseUrl: string, maxPages: number = 50): Promise<CrawledPage[]> {
    // ... URL Normalization ... (unchanged)
    let normalizedUrl = baseUrl.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = `https://${normalizedUrl}`;
    }

    console.log(`[Crawler] Starting optimized crawl for: ${normalizedUrl}`);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const results: CrawledPage[] = [];
    const visited = new Set<string>();
    const queue = [normalizedUrl];
    const BATCH_SIZE = 5;

    // Prioritization keywords
    const HIGH_PRIORITY = ['about', 'contact', 'service', 'project', 'portfolio', 'team'];

    try {
        while (queue.length > 0 && results.length < maxPages) {
            const currentBatch: string[] = [];
            while (queue.length > 0 && currentBatch.length < BATCH_SIZE && (results.length + currentBatch.length) < maxPages) {
                const url = queue.shift()!;
                if (!visited.has(url)) {
                    visited.add(url);
                    currentBatch.push(url);
                }
            }

            if (currentBatch.length === 0) break;

            // Homepage is always the first URL in the first batch
            const isFirstBatch = results.length === 0;

            const batchResults = await Promise.all(
                currentBatch.map((url, idx) => crawlPage(browser, url, normalizedUrl, isFirstBatch && idx === 0))
            );

            for (const res of batchResults) {
                if (res) {
                    results.push(res.pageData);
                    res.links.forEach(link => {
                        if (!visited.has(link) && !queue.includes(link)) {
                            queue.push(link);
                        }
                    });
                }
            }

            // Sort queue: High priority URLs first
            queue.sort((a, b) => {
                const aScore = HIGH_PRIORITY.some(k => a.toLowerCase().includes(k)) ? 1 : 0;
                const bScore = HIGH_PRIORITY.some(k => b.toLowerCase().includes(k)) ? 1 : 0;
                return bScore - aScore;
            });
        }
    } finally {
        try {
            await browser.close();
        } catch (e) {
            // Browser might already be closed
        }
    }

    return results;
}

async function crawlPage(browser: Browser, url: string, baseUrl: string, captureScreenshot: boolean = false) {
    const page = await browser.newPage();
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1280, height: 800 });

        if (!captureScreenshot) {
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                const resourceType = req.resourceType();
                if (['image', 'font', 'stylesheet', 'media'].includes(resourceType)) {
                    req.abort();
                } else {
                    req.continue();
                }
            });
        }

        const startTime = Date.now();
        // OPTIMIZATION: 'networkidle2' is too slow for many sites. We use 'domcontentloaded' + a safe visual buffer.
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // If capturing screenshot, give it a moment to render the paint, but don't hang on every network request
        if (captureScreenshot) {
            await new Promise(r => setTimeout(r, 3000));
        }

        const loadTime = Date.now() - startTime;

        let screenshot = undefined;
        if (captureScreenshot) {
            screenshot = await page.screenshot({ encoding: 'base64', type: 'webp', quality: 60 });
        }

        const data = await page.evaluate((base) => {
            const currentOrigin = window.location.origin;
            const links = Array.from(document.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => {
                    try {
                        const urlObj = new URL(href);
                        const baseHost = new URL(base).origin.replace('www.', '');
                        return urlObj.origin.replace('www.', '') === baseHost;
                    } catch {
                        return false;
                    }
                });

            const h1 = Array.from(document.querySelectorAll('h1')).map(h => (h as HTMLElement).innerText);
            const h2 = Array.from(document.querySelectorAll('h2')).map(h => (h as HTMLElement).innerText);

            const metaTitle = document.title;
            const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
            const bodyText = document.body.innerText;
            const htmlContent = document.body.innerHTML;

            // Image Extraction
            const images = Array.from(document.querySelectorAll('img'))
                .map(img => ({
                    src: img.src,
                    alt: img.alt || '',
                    width: img.naturalWidth || img.width,
                    height: img.naturalHeight || img.height
                }))
                .filter(img => img.width > 50 && img.height > 50);

            // --- RankMost Master System Extraction ---

            // 1. Trust Signals
            const hasPrivacy = links.some(l => l.toLowerCase().includes('privacy'));
            const hasTerms = links.some(l => l.toLowerCase().includes('terms') || l.toLowerCase().includes('condition'));

            // 2. Contact & Social Heuristics
            // Expanded regex for Nigerian & International addresses - Multiline safe with context & boundaries
            const addressRegex = /\b(address|location|suite|floor|street|road|close|plot|block|avenue|crescent|way|estate|plaza|building|off|opp|behind|adjacent|km|lagos|abuja|port harcourt|kano|ibadan|enugu)\b/i;
            const addressMatch = bodyText.match(new RegExp(`([\\s\\S]{0,50}${addressRegex.source}[\\s\\S]{0,150})`, 'i'));
            // Clean up: remove newlines/tabs, consolidate spaces
            const specificAddress = addressMatch ? addressMatch[0].replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim() : null;

            const contactInfo = {
                phone: /\+?\d[\d\s\-\(\)]{8,}\d/.test(bodyText) || Array.from(document.querySelectorAll('a[href^="tel:"]')).length > 0,
                email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(bodyText) || Array.from(document.querySelectorAll('a[href^="mailto:"]')).length > 0,
                whatsapp: /wa\.me|whatsapp\.com/.test(htmlContent) || bodyText.toLowerCase().includes('whatsapp'),
                address: !!specificAddress,
                address_text: specificAddress || undefined // Start capturing the actual string
            };

            const socialLinks = [
                'facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'linkedin.com', 'tiktok.com', 'youtube.com'
            ].filter(platform => htmlContent.includes(platform));

            // 3. CTA Detection
            const ctaButtons = Array.from(document.querySelectorAll('button, a.btn, a[class*="button"], a[class*="cta"]'))
                .map(el => (el as HTMLElement).innerText.trim())
                .filter(text => text.length > 0 && text.length < 30);

            const primaryCta = ctaButtons.find(t => /book|buy|order|get|start|contact|join/i.test(t)) || ctaButtons[0] || 'No CTA Found';

            // 4. Content Signals
            const hasBlog = links.some(l => l.toLowerCase().includes('blog') || l.toLowerCase().includes('news') || l.toLowerCase().includes('articles'));
            const hasTestimonials = bodyText.toLowerCase().includes('testimonial') || bodyText.toLowerCase().includes('what our clients say') || links.some(l => l.toLowerCase().includes('stories') || l.toLowerCase().includes('reviews'));

            // 5. Link categorization
            const internalLinksCount = links.filter(l => l.includes(window.location.hostname)).length;
            const externalLinksCount = links.length - internalLinksCount;

            const schema = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
                .map(script => {
                    try {
                        return JSON.parse(script.textContent || '{}');
                    } catch (e) {
                        return null;
                    }
                })
                .filter(Boolean);

            return { links, h1, h2, metaTitle, metaDesc, content: bodyText, schema, hasPrivacy, hasTerms, contactInfo, socialLinks, ctaCount: ctaButtons.length, primaryCta, hasBlog, hasTestimonials, internalLinksCount, externalLinksCount, images };
        }, baseUrl);

        const pageData: CrawledPage = {
            url,
            title: data.metaTitle,
            description: data.metaDesc,
            headings: { h1: data.h1, h2: data.h2 },
            images: data.images,
            loadTime,
            mobileFriendly: true,
            content: data.content,
            hasSitemap: false,
            hasRobots: false,
            hasSSL: url.startsWith('https://'),
            schema: (data as any).schema,
            screenshot: screenshot as string,
            // Master System Fields
            trust_signals: {
                has_privacy_policy: data.hasPrivacy,
                has_terms: data.hasTerms
            },
            contact_info: data.contactInfo,
            social_links: data.socialLinks,
            cta_data: {
                count: data.ctaCount,
                primary_text: data.primaryCta
            },
            content_signals: {
                has_blog: data.hasBlog,
                has_testimonials: data.hasTestimonials,
                internal_links_count: data.internalLinksCount,
                external_links_count: data.externalLinksCount
            }
        };

        return { pageData, links: data.links };

    } catch (err: any) {
        console.error(`[Crawler] Failed page ${url}:`, err.message);
        return null;
    } finally {
        try {
            if (page && !page.isClosed()) {
                await page.close();
            }
        } catch (e) {
            // Silence protocol errors if page is already gone
        }
    }
}

export async function checkFileExists(baseUrl: string, filename: string): Promise<boolean> {
    const url = new URL(filename, baseUrl).href;
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}
