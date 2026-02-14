import Groq from 'groq-sdk';
import { CrawledPage } from '../crawler/website-crawler';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function discoverKeywords(pages: CrawledPage[]): Promise<string[]> {
    if (pages.length === 0) return [];

    // Aggregate content from homepage and other key pages (limit to 15k chars)
    let aggregatedContent = "";
    for (const page of pages) {
        if (aggregatedContent.length < 15000) {
            aggregatedContent += `\n\n--- Page: ${page.url} ---\nTitle: ${page.title}\n${page.content.substring(0, 3000)}`;
        }
    }

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are an elite SEO Strategist. Analyze the provided website content (Homepage + Internal Pages) and extract exactly 15 high-value, high-intent keywords that this business MUST rank for to drive sales. Focus on 'Service + Location' or 'Product + Buy' intent. Return only a JSON array of strings called 'keywords'."
                },
                {
                    role: "user",
                    content: aggregatedContent.substring(0, 20000)
                }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content || '{"keywords": []}');
        return Array.isArray(result.keywords) ? result.keywords.slice(0, 20) : [];

    } catch (error) {
        console.error('Keyword Discovery failed:', error);
        return [];
    }
}
