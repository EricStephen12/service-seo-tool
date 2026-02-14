import { CrawledPage } from '../crawler/website-crawler';
import { analyzeTechnicalSEO, SEOIssue } from './technical-seo';
import { analyzeContentQuality } from './content-quality';
import { analyzePageSpeed } from './page-speed';

export interface ScanSummary {
    score: number;
    problems: SEOIssue[];
    pagesScanned: number;
}

export async function runFullSEOAnalysis(pages: CrawledPage[]): Promise<ScanSummary> {
    let allIssues: SEOIssue[] = [];

    // Aggregate issues from all pages
    for (const page of pages) {
        // Technical SEO
        const techIssues = analyzeTechnicalSEO(page);
        allIssues = [...allIssues, ...techIssues];

        // Content Quality (limit to first 5 pages for cost/speed)
        if (pages.indexOf(page) < 5) {
            const contentIssues = await analyzeContentQuality(page);
            allIssues = [...allIssues, ...contentIssues];
        }
    }

    // Page Speed (Homepage only)
    if (pages.length > 0) {
        const speedIssues = await analyzePageSpeed(pages[0].url);
        allIssues = [...allIssues, ...speedIssues];
    }

    // Trust/E-E-A-T/Local SEO
    const trustIssues = analyzeTrustSignals(pages);
    allIssues = [...allIssues, ...trustIssues];

    // Remove duplicates and calculate score
    const uniqueIssues = deduplicateIssues(allIssues);
    const score = calculateScore(uniqueIssues, pages.length);

    return {
        score,
        problems: uniqueIssues,
        pagesScanned: pages.length
    };
}

function analyzeTrustSignals(pages: CrawledPage[]): SEOIssue[] {
    const issues: SEOIssue[] = [];
    const allContent = pages.map(p => p.content).join(' ');
    const allUrls = pages.map(p => p.url.toLowerCase());

    // 1. Contact Page Check
    if (!allUrls.some(url => url.includes('contact'))) {
        issues.push({
            category: 'E-E-A-T',
            severity: 'high',
            issue: 'Missing Contact Page',
            impact: 'Trust Failure. Google may classify site as a "Lead Gen" scam.',
            fix_available: true,
            fix_action: 'generate_contact_page',
            explanation: {
                problem: 'No dedicated Contact page found',
                what_it_means: 'Users and Google cannot verify your physical existence',
                why_it_matters: 'Essential for E-E-A-T and Local SEO ranking'
            }
        });
    }

    // 2. About Page Check
    if (!allUrls.some(url => url.includes('about'))) {
        issues.push({
            category: 'E-E-A-T',
            severity: 'medium',
            issue: 'Missing About Page',
            impact: 'Brand Authority Failure. Harder to rank for non-branded keywords.',
            fix_available: true,
            fix_action: 'generate_about_page',
            explanation: {
                problem: 'No "About Us" page found',
                what_it_means: 'Missing story and business context',
                why_it_matters: 'Differentiation is key to conversion'
            }
        });
    }

    // 3. Legal/Privacy Check (New "Legitimacy Triad")
    if (!allUrls.some(url => url.includes('privacy') || url.includes('policy'))) {
        issues.push({
            category: 'E-E-A-T',
            severity: 'high',
            issue: 'Missing Privacy Policy',
            impact: 'Critical Trust Failure. Ad campaigns may be blocked.',
            fix_available: true,
            fix_action: 'generate_privacy_policy',
            explanation: {
                problem: 'No Privacy Policy detected',
                what_it_means: 'You are not legally compliant',
                why_it_matters: 'Required by law and Google Ads/Analytics'
            }
        });
    }

    if (!allUrls.some(url => url.includes('terms') || url.includes('conditions'))) {
        issues.push({
            category: 'E-E-A-T',
            severity: 'medium',
            issue: 'Missing Terms of Service',
            impact: 'Legal Liability. Users are not bound by any agreement.',
            fix_available: true,
            fix_action: 'generate_terms',
            explanation: {
                problem: 'No Terms of Service page found',
                what_it_means: 'No contract between you and the user',
                why_it_matters: 'Protects your business from liability'
            }
        });
    }

    // 4. SSL Check
    if (pages.some(p => p.url.startsWith('http:'))) {
        issues.push({
            category: 'Technical SEO',
            severity: 'high',
            issue: 'Insecure Protocol (HTTP)',
            impact: 'Security Warning. Chrome will label site "Not Secure".',
            fix_available: false, // Cannot fix server config automatically yet
            fix_action: 'manual_ssl_fix',
            explanation: {
                problem: 'Site is served over HTTP',
                what_it_means: 'Data is not encrypted',
                why_it_matters: 'Ranking signal and massive user trust factor'
            }
        });
    }

    const phoneRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    if (!phoneRegex.test(allContent)) {
        issues.push({
            category: 'Local SEO', // ... existing logic
            severity: 'medium',
            issue: 'No phone number detected',
            impact: 'Missed leads and weak Local signals',
            fix_available: false,
            explanation: {
                problem: 'No phone number found in content',
                what_it_means: 'Local users cannot call you easily',
                why_it_matters: 'NAP consistency is critical for Local SEO'
            }
        });
    }

    return issues;
}

function deduplicateIssues(issues: SEOIssue[]): SEOIssue[] {
    const seen = new Set<string>();
    return issues.filter(issue => {
        const key = `${issue.category}:${issue.issue}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function calculateScore(issues: SEOIssue[], pageCount: number): number {
    let baseScore = 100;
    issues.forEach(issue => {
        if (issue.severity === 'high') baseScore -= 10;
        if (issue.severity === 'medium') baseScore -= 5;
        if (issue.severity === 'low') baseScore -= 2;
    });
    return Math.max(0, baseScore);
}
