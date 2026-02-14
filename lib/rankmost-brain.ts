import Groq from "groq-sdk";
import type { CrawledPage } from "./crawler/website-crawler";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// --- PART 1: THE SYSTEM PROMPT GENERATOR ---
const generateSystemPrompt = (pageData: any, context: any) => `
You are RankMost — an elite SEO Veteran (30 years exp).
Your client is a **BUSINESS OWNER**, not a developer.
They don't care about "H1 tags" or "Schema". They care about **CUSTOMERS** and **MONEY**.

**YOUR CORE PHILOSOPHY:**
"Don't just give me code. Tell me why I'm losing money, and give me the fix to hand to my geek."

**DATA AVAILABLE:**
- **Your Keywords:** ${context.keywords ? context.keywords.map((k: any) => k.keyword).join(', ') : "None detected"}
- **Competitor:** ${context.competitorData ? context.competitorData.title : "No live competitor data"}

**THE VETERAN PROTOCOL (EXECUTE THESE 5 CHECKS):**

**FORMAT FOR EVERY ISSUE:**
> **ISSUE #[N]: [Catchy Business Problem Headline]**
>
> **The Problem:** [Explain in plain English why this hurts their business. E.g., "Google thinks you are 'Home', not a 'Plumber'."]
>
> **The Fix (Copy This for Your Developer):**
> \`\`\`
> [Exact Code or Text Change]
> \`\`\`
>
> **Why This Matters:** [Impact on Revenue/Traffic. E.g. "You will capture the 80% of people searching on mobile."]

---

**CHECK 1: THE "MONEY KEYWORD" CHECK (Title & H1)**
*   *Check:* Does the Title/H1 match what people actually search for?
*   *If Bad:* "Your title says 'Home'. Nobody searches for 'Home'. They search for '[Service] in [City]'."
*   *Action:* Write the EXACT new Title and H1.

**CHECK 2: THE "COMPETITOR GAP"**
*   *CRITICAL:* Look at the COMPETITOR DATA section below. If it has real crawled data, USE IT.
*   *If Competitor is Winning:* "Your competitor [Name] has a blog. You don't. Google thinks they are the expert."
*   *If No Data:* "Based on your niche, your competitors are likely doing X. We need to check them."

**CHECK 3: THE "TRUST & CONVERSION"**
*   *Check:* Phone, WhatsApp, Address.
*   *Verdict:* "No WhatsApp button? usage is massive in your market. You are ignoring customers."
*   *Address Check:* If missing, say "Your business address is missing. Add it to build trust."

**CHECK 4: THE CONTENT REWRITE**
*   *Task:* Find "boring" text.
*   *Action:* Rewrite it to sell using the detected LOCATION (e.g. if site is .ng use Nigeria context, if .com/.uk use relevant context).
*   *Format:*
    *   **Current Boring Text:** "..."
    *   **Money-Making Upgrade:** "[Write the perfect version with local keywords and trust signals]"

**CHECK 5: TECHNICAL DEBT**
*   *Explanation:* "Google is blind. We need to tell Google exactly who you are."
*   *Action:* Generate the Schema JSON-LD ONLY IF YOU HAVE THE DATA (Address, Phone).
*   *CRITICAL:* If data is missing (e.g. no address in crawl), DO NOT generate code with placeholders like "YOUR_ADDRESS". Instead say: "**I can't generate the code because your address is missing relative to the crawl. Add it to your footer first.**"

**BANNED PHRASES:**
- "Phase 1", "Phase 2" (Use "ISSUE #1", "ISSUE #2")
- "Conduct further research"
- "It is recommended"
- "Optimize your H1"
- "Connect Google Search Console"
- "YOUR_ADDRESS_HERE" (Strictly banned)

**TONE:**
- Authoritative but accessible.
- Focus on **LOST REVENUE** and **MISSED OPPORTUNITIES**.
- Be the expensive consultant who tells the hard truth.
`;

export class RankMostBrain {

    static async runAudit(pageData: CrawledPage, context: { competitorUrl?: string, competitorData?: any, businessContext?: string, auditType?: 'full' | 'quick', aggregatedContent?: string, visualAnalysis?: string, totalWordCount?: number, totalImages?: number, keywords?: any[] } = {}) {

        const crawlPayload = {
            url: pageData.url,
            crawl_data: {
                title_tag: pageData.title,
                meta_description: pageData.description,
                h1_tags: pageData.headings.h1,
                h2_tags: pageData.headings.h2,
                word_count: context.totalWordCount || pageData.content.split(/\s+/).length,

                internal_links: pageData.content_signals?.internal_links_count || 0,
                external_links: pageData.content_signals?.external_links_count || 0,

                images_total: context.totalImages || pageData.images.length,
                images_with_alt: pageData.images.filter(i => i.alt).length,
                has_ssl: pageData.hasSSL,

                has_privacy_policy: pageData.trust_signals?.has_privacy_policy || false,
                has_terms: pageData.trust_signals?.has_terms || false,

                whatsapp_detected: pageData.contact_info?.whatsapp || false,
                phone_detected: pageData.contact_info?.phone || false,
                email_detected: pageData.contact_info?.email || false,
                address_detected: pageData.contact_info?.address || false,
                address_text: pageData.contact_info?.address_text || null,

                social_links: pageData.social_links || [],

                has_blog: pageData.content_signals?.has_blog || false,
                has_testimonials: pageData.content_signals?.has_testimonials || false,
            }
        };

        // HARD FACTS
        const hardFacts = `
**HARD FACTS:**
- **Business Address:** ${pageData.contact_info?.address_text || "⚠️ MISSING - This is a trust killer. Add your physical address."}
- **Confirmed Competitors:** ${context.competitorData ? context.competitorData.title + " (crawled)" : "None (no live data yet)"}
- **Discovered Keywords:** ${context.keywords ? context.keywords.map((k: any) => k.keyword).slice(0, 5).join(', ') : "None"}
`;

        const systemPrompt = generateSystemPrompt(pageData, context);

        const userMessage = `
${systemPrompt}

**CRAWL DATA:**
${JSON.stringify(crawlPayload, null, 2)}

**COMPETITOR DATA (IF AVAILABLE):**
${context.competitorData ? JSON.stringify({
            url: context.competitorData.url,
            title: context.competitorData.title,
            meta_description: context.competitorData.description,
            word_count: context.competitorData.content.split(/\s+/).length,
            h1_tags: context.competitorData.headings.h1,
            h2_tags: context.competitorData.headings.h2,
            has_whatsapp: context.competitorData.contact_info?.whatsapp || false,
            has_phone: context.competitorData.contact_info?.phone || false,
            has_address: context.competitorData.contact_info?.address || false,
            address_text: context.competitorData.contact_info?.address_text || null,
            has_schema: context.competitorData.schema && context.competitorData.schema.length > 0,
            has_ssl: context.competitorData.hasSSL,
            images_count: context.competitorData.images?.length || 0,
            images_with_alt: context.competitorData.images?.filter((i: any) => i.alt).length || 0,
            has_blog: context.competitorData.content_signals?.has_blog || false,
            social_links: context.competitorData.social_links || []
        }, null, 2) : "No live competitor data available."}

${hardFacts}

**YOUR MISSION:**
Execute the 5-phase Veteran Protocol. Give EXACT fixes. Ban all generic advice. Be BRUTALLY concise.
`;

        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "user", content: userMessage }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.6,
                max_tokens: 4096,
            });

            const report = completion.choices[0]?.message?.content || "Analysis failed.";
            return report;

        } catch (error) {
            console.error("RankMost Brain Error:", error);
            throw new Error("Failed to generate audit report");
        }
    }
}
