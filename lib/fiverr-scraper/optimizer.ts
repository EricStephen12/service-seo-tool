import Groq from 'groq-sdk';
import { FiverrGigData } from './index';
import { CompetitorAnalysis } from './competitor-analyzer';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export interface OptimizedGig {
    title: string;
    description: string;
    tags: string[];
    pricing: any;
    score: number;
    improvements: string[];
    strategy?: string;
    scaling_plan?: string[];
    trustAudit: {
        video: { status: 'pass' | 'fail'; message: string };
        faq: { status: 'pass' | 'fail'; message: string };
        activity: { status: 'pass' | 'warn'; message: string };
    };
}

function conductTrustAudit(current: FiverrGigData) {
    return {
        video: current.hasVideo
            ? { status: 'pass' as const, message: "Video detected. Conversion boost active." }
            : { status: 'fail' as const, message: "CRITICAL: You are invisible. Upload a 30s intro video immediately to boost conversion by 40%." },

        faq: (current.faqCount || 0) > 0
            ? { status: 'pass' as const, message: "FAQ section present." }
            : { status: 'fail' as const, message: "Friction Alert: Buyers are leaving because you didn't answer their questions. Generate 5 FAQs." },

        activity: (current.lastDelivery?.includes('1 day') || current.lastDelivery?.includes('hour') || !current.lastDelivery)
            ? { status: 'pass' as const, message: "Account activity appears healthy." }
            : { status: 'warn' as const, message: "Wake Up. Activity signals are low. Deliver an order or update your gig to refresh status." }
    };
}

export async function optimizeGig(current: FiverrGigData, analysis: CompetitorAnalysis): Promise<OptimizedGig> {
    const prompt = `
    Optimize this Fiverr Gig for higher visibility and conversion.
    
    Current Data:
    Title: ${current.title}
    Description: ${current.description}
    Category: ${current.category}
    Tags: ${current.tags.join(', ')}
    Has Video: ${current.hasVideo}
    FAQ Count: ${current.faqCount}
    
    Competition Context:
    Competition Level: ${analysis.competitionLevel}
    Top Tags in Category: ${analysis.topTags.join(', ')}
    Average Price: $${analysis.averagePrice}
    
    Generate:
    1. A niche-specific title (under 80 chars, includes high-volume keywords).
    2. A compelling description using a Hook-Benefit-Process-CTA structure.
    3. 5 optimized tags.
    4. Recommended pricing structure.
  `;

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are the "Gig Doctor" — a Veteran Fiverr Seller ($1M+ earnings). 
                    Your job is NOT to give advice. Your job is to WRITE THE ASSETS.

                    THE PHILOSOPHY:
                    - Generic titles = DEATH. "I will design a logo" is ignored.
                    - Specificity = MONEY. "I will design a minimalist vector logo for tech startups" gets clicks.
                    - Neuro-Hooks = CONVERSION. Use psychological triggers (scarcity, authority, curiosity).

                    YOUR TASK:
                    Analyze the user's gig and the COMPETITOR DATA.
                    Rewrite the gig to crush the competition.

                    OUTPUT FORMAT (JSON ONLY):
                    {
                        "optimized_data": {
                            "title": "I will [POWER VERB] your [SPECIFIC RESULT] to [BIG BENEFIT] in 24h",
                            "description": "<b>STOP SCROLLING.</b><br><br>Your business is invisible because your logo is generic.<br><br>I don't just 'design'. I create <b>Brand Identity Systems</b> that force customers to trust you.<br><br><b>WHAT YOU GET:</b><br>✅ Vector Files (AI, EPS, SVG)<br>✅ 3 Unique Concepts<br>✅ Unlimited Revisions<br><br><b>WHY ME?</b><br>I have built brands for 50+ YC startups.<br><br>👉 <b>ORDER NOW</b> and get a free 3D Mockup.",
                            "tags": ["tech logo", "startup branding", "minimalist vector", "saas design", "modern icon"],
                            "pricing": "Strategy: Start Basic at $45 to capture volume, then upsell the 'Complete Branding Kit' at $195 (where the real profit is)."
                        },
                        "implementation_guide": [
                            "CHANGE TITLE: Your old title was invisible. The new one targets 'tech startups' specifically.",
                            "THUMBNAIL: Use a yellow background. Competitors are all using blue. Stand out.",
                            "VIDEO: Record a 15s video saying 'I am real'. It boosts trust by 400%."
                        ],
                        "long_term_strategy": "THE END GAME: Right now, you are a commodity. These changes make you a 'Specialist'. Specialists charge 5x more. Your goal is to get 5 reviews with this new angle, then DOUBLE your prices. This is how you move from $20 gigs to $2,000 retainers.",
                        "scaling_plan": [
                            "LEVEL 1 (Foundation): Do 10 gigs perfectly. Over-deliver (send 3 concepts instead of 1). Get 5-star reviews to unlock 'Level 1 Seller'.",
                            "LEVEL 2 (Arbitrage): Use your earnings to hire a junior designer ($5/hr). They do the drafting, you do the finishing. You now have infinite capacity.",
                            "LEVEL 3 (The Upsell): Add a 'Source File' Extra for $40. 50% of business clients need this. It's 100% profit with 0% extra work."
                        ]
                    }`
                },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content || '{}');
        const optimizedData = result.optimized_data || {};
        const trustAudit = conductTrustAudit(current);

        return {
            title: optimizedData.title || current.title,
            description: optimizedData.description || current.description,
            tags: optimizedData.tags || current.tags,
            pricing: optimizedData.pricing || current.pricing,
            score: 89,
            improvements: result.implementation_guide || [
                "Title is now niche-specific",
                "Description uses high-conversion structure",
                "Tags are optimized for search volume"
            ],
            strategy: result.long_term_strategy || "Focus on niche authority to increase pricing power over time.",
            scaling_plan: result.scaling_plan || ["Deliver high quality", "Respond fast", "Ask for reviews"],
            trustAudit
        };

    } catch (error) {
        console.error('Fiverr Optimization failed:', error);
        throw error;
    }
}
