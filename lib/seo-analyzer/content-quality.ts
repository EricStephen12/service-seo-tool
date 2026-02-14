import { CrawledPage } from '../crawler/website-crawler';
import { SEOIssue } from './technical-seo';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function analyzeContentQuality(page: CrawledPage): Promise<SEOIssue[]> {
    const issues: SEOIssue[] = [];

    // Basic word count check
    const wordCount = page.content.split(/\s+/).length;
    if (wordCount < 300) {
        issues.push({
            category: 'Content Quality',
            severity: 'medium',
            issue: `Thin content (${wordCount} words)`,
            impact: 'Google prefers comprehensive content for ranking',
            fix_available: true,
            fix_action: 'generate_expanded_content',
            context: {
                content: page.content.substring(0, 1500)
            },
            explanation: {
                problem: 'Your page has very little text',
                what_it_means: 'Pages with less than 300 words are considered "thin" by Google',
                why_it_matters: 'Comprehensive content helps you rank for more keywords and builds trust',
                suggested_fix: 'Add more details about your service, process, or benefits.'
            }
        });
    }

    // AI analysis for readability and keyword usage
    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are an SEO expert. Analyze webpage content for readability, commercial intent, and service best practices.
                    
                    CRITICAL: You MUST return a valid JSON object following this EXACT schema:
                    {
                      "readability": "good" | "poor",
                      "missing_keywords": ["keyword1", "keyword2"],
                      "has_call_to_action": boolean,
                      "analysis_summary": "Short description of content health"
                    }`
                },
                {
                    role: "user",
                    content: `URL: ${page.url}\nTitle: ${page.title}\nContent: ${page.content.substring(0, 10000)}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const aiResult = JSON.parse(response.choices[0].message.content || '{}');

        if (aiResult.readability === 'poor') {
            issues.push({
                category: 'Content Quality',
                severity: 'medium',
                issue: 'Low readability score',
                impact: 'Users may leave your site if the text is hard to read',
                fix_available: true,
                explanation: {
                    problem: 'Your content is difficult to read',
                    what_it_means: 'The sentencing or vocabulary is too complex for a general audience',
                    why_it_matters: 'Simpler language keeps users on the page longer',
                    suggested_fix: 'Use shorter sentences and avoid industry jargon.'
                }
            });
        }

        if (!aiResult.has_call_to_action) {
            issues.push({
                category: 'Conversion Optimization',
                severity: 'high',
                issue: 'No clear Call to Action (CTA) detected',
                impact: 'Visitors are not being guided to contact or buy from you.',
                fix_available: true,
                explanation: {
                    problem: 'No clear "Call to Action" found in content',
                    what_it_means: 'Users do not know what step to take next',
                    why_it_matters: 'Without a CTA, your traffic will not convert into leads',
                    suggested_fix: 'Add a clear button or text saying "Contact Us Today" or "Get a Quote".'
                }
            });
        }

        if (aiResult.missing_keywords && aiResult.missing_keywords.length > 0) {
            issues.push({
                category: 'Content Quality',
                severity: 'low',
                issue: `Missing potential keywords: ${aiResult.missing_keywords.join(', ')}`,
                impact: 'You may be missing out on relevant search traffic',
                fix_available: true,
                explanation: {
                    problem: 'Relevant keywords are missing from your text',
                    what_it_means: 'Users often search for these terms when looking for your service',
                    why_it_matters: 'Including these naturally helps Google match you with users',
                    suggested_fix: `Incorporate these words naturally: ${aiResult.missing_keywords.join(', ')}`
                }
            });
        }

    } catch (error) {
        console.error('AI Content Analysis failed:', error);
    }

    return issues;
}
