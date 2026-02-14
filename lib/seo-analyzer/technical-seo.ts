import { CrawledPage } from '../crawler/website-crawler';

export interface SEOIssue {
    category: 'Technical SEO' | 'Content Quality' | 'Page Speed' | 'Local SEO' | 'E-E-A-T' | 'Conversion Optimization';
    severity: 'high' | 'medium' | 'low';
    issue: string;
    impact: string;
    fix_available: boolean;
    fix_action?: string;
    context?: any;
    explanation: {
        problem: string;
        what_it_means: string;
        why_it_matters: string;
        suggested_fix?: string;
    };
}

export function analyzeTechnicalSEO(page: CrawledPage): SEOIssue[] {
    const issues: SEOIssue[] = [];

    // Title check
    if (!page.title) {
        issues.push({
            category: 'Technical SEO',
            severity: 'high',
            issue: 'Missing page title',
            impact: 'Google does not know what your page is about',
            fix_available: true,
            fix_action: 'generate_title',
            explanation: {
                problem: 'Your page is missing a title tag',
                what_it_means: 'This is the main heading Google shows in search results',
                why_it_matters: 'Titles are the single most important on-page SEO factor',
                suggested_fix: 'Add a descriptive title between 50-60 characters.'
            }
        });
    } else if (page.title.length < 30 || page.title.length > 60) {
        issues.push({
            category: 'Technical SEO',
            severity: 'medium',
            issue: `Title length is suboptimal (${page.title.length} characters)`,
            impact: 'Title might be cut off or look incomplete in search results',
            fix_available: true,
            explanation: {
                problem: 'Your title length is not ideal',
                what_it_means: 'Ideally, titles should be between 50-60 characters',
                why_it_matters: 'Optimized titles improve click-through rates from Google'
            }
        });
    }

    // Description check
    if (!page.description) {
        issues.push({
            category: 'Technical SEO',
            severity: 'high',
            issue: 'Missing meta description',
            impact: 'Lower click-through rate from search results',
            fix_available: true,
            fix_action: 'generate_description',
            explanation: {
                problem: "You're missing a meta description",
                what_it_means: "Google doesn't know what your page is about",
                why_it_matters: "Pages with meta descriptions get 30% more clicks",
                suggested_fix: 'Add a summary of the page (150-160 characters).'
            }
        });
    }

    // H1 check
    if (page.headings.h1.length === 0) {
        issues.push({
            category: 'Technical SEO',
            severity: 'high',
            issue: 'Missing H1 heading',
            impact: 'Poor content structure and SEO ranking',
            fix_available: true,
            explanation: {
                problem: 'Your page lacks an H1 tag',
                what_it_means: 'The H1 is the main header of your content',
                why_it_matters: 'Google uses H1 tags to understand the primary topic of the page'
            }
        });
    } else if (page.headings.h1.length > 1) {
        issues.push({
            category: 'Technical SEO',
            severity: 'low',
            issue: 'Multiple H1 headings found',
            impact: 'Confusing for search engines and accessibility',
            fix_available: true,
            explanation: {
                problem: 'You have more than one H1 tag',
                what_it_means: 'A page should ideally have only one main header',
                why_it_matters: 'Single H1 tags provide clearer structure for search engines'
            }
        });
    }

    // Image alt check
    const missingAltCount = page.images.filter(img => !img.alt).length;
    if (missingAltCount > 0) {
        issues.push({
            category: 'Technical SEO',
            severity: 'medium',
            issue: `${missingAltCount} images missing alt text`,
            impact: 'Lost SEO opportunity and poor accessibility',
            fix_available: true,
            fix_action: 'generate_alt_tags',
            explanation: {
                problem: 'Some images are missing descriptions (Alt text)',
                what_it_means: 'Search engines cannot "see" images without descriptions',
                why_it_matters: 'Alt text helps you rank in Image Search and is required for accessibility'
            }
        });
    }

    // Schema Markup Check
    if (!page.schema || page.schema.length === 0) {
        issues.push({
            category: 'Local SEO',
            severity: 'high',
            issue: 'Missing Structured Data (Schema)',
            impact: 'Google treats you as a generic page, not a verified Entity.',
            fix_available: true,
            fix_action: 'generate_local_schema',
            explanation: {
                problem: 'No Schema.org markup found (JSON-LD)',
                what_it_means: 'Search engines struggle to understand your business details',
                why_it_matters: 'Schema is required for Rich Snippets and Local Pack rankings'
            }
        });
    }

    return issues;
}
