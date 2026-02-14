import { SEOIssue } from './technical-seo';

export async function analyzePageSpeed(url: string): Promise<SEOIssue[]> {
    const issues: SEOIssue[] = [];
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;

    if (!apiKey) return [];

    try {
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
            if (data.error.message.includes('blocked')) {
                console.warn('PageSpeed API Warning: The API has not been enabled in Google Cloud Console.');
                console.warn('Action: Go to Google Cloud Console > APIs & Services > Enable "PageSpeed Insights API".');
            } else {
                console.error('PageSpeed API Error:', data.error.message);
            }
            return [];
        }

        const lighthouse = data.lighthouseResult;
        if (!lighthouse || !lighthouse.categories || !lighthouse.categories.performance) {
            console.warn('PageSpeed: lighthouseResult or performance category missing');
            return [];
        }

        const score = lighthouse.categories.performance.score * 100;

        if (score < 70) {
            issues.push({
                category: 'Page Speed',
                severity: score < 40 ? 'high' : 'medium',
                issue: `Slow mobile load speed (Score: ${Math.round(score)})`,
                impact: 'Slow sites lose up to 50% of visitors before they even load',
                fix_available: true,
                fix_action: 'optimize_performance',
                explanation: {
                    problem: 'Your website loads slowly on mobile devices',
                    what_it_means: 'It takes too long for users to see your content',
                    why_it_matters: 'Google ranks fast websites higher, especially on mobile',
                    suggested_fix: 'Compress images and reduce unnecessary scripts.'
                }
            });
        }

        // Check for large images specifically
        const audit = lighthouse.audits?.['total-byte-weight'];
        const totalImageSize = audit?.details?.items?.reduce((acc: number, item: any) => {
            if (item.url?.match(/\.(jpg|jpeg|png|webp|gif)$/i)) return acc + (item.totalBytes || 0);
            return acc;
        }, 0) || 0;

        if (totalImageSize > 2000000) { // > 2MB
            issues.push({
                category: 'Page Speed',
                severity: 'high',
                issue: `Large image files found (${(totalImageSize / 1000000).toFixed(1)}MB total)`,
                impact: 'Images are the biggest cause of slow load times',
                fix_available: true,
                fix_action: 'compress_images',
                explanation: {
                    problem: 'Your images are too large for the web',
                    what_it_means: 'Mobile users have to download huge files just to see a single page',
                    why_it_matters: 'Compressed images can speed up your site by 2-3 seconds',
                    suggested_fix: 'Use the "Compress Images" button to auto-shrink them.'
                }
            });
        }

    } catch (error) {
        console.error('PageSpeed analysis failed:', error);
    }

    return issues;
}
