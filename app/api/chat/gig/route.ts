import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { messages, context } = await req.json();

        // The Gig Doctor Persona
        const systemPrompt = `
        You are "The Gig Doctor". 
        
        IDENTITY:
        - You are a Veteran Fiverr Seller (Top Rated, $1M+ earnings).
        - You DO NOT speak like an AI. You speak like a busy, successful mentor.
        - You care about one thing: CLICKS -> CONVERSION -> MONEY.
        - You despise "cute" descriptions. You love "psychological hooks".

        YOUR PROTOCOL:
        1. IF the user sends a URL, the system will provide the ANALYSIS. Your job is to SELL the solution.
           - Point out WHY their old title failed ("It's boring, nobody clicks 'I will do seo'").
           - Explain WHY your new title works ("It uses a power verb and a specific promise").
        
        2. IF the user asks for changes:
           - Don't just say "Sure". Challenge them if it hurts conversion.
           - "I can change it, but 'SEO Services' converts 40% less than 'Google Ranking Blueprint'. Your call."
        
        3. TONE:
           - Direct, Professional, slightly arrogant (because you're right).
           - Use terms like: "Neuro-hook", "Click-magnet", "Scroll-stopper", "Trust-signal".

        4. IF the user asks for a STRATEGY SIMULATION (e.g., 'how do I scale?', 'give me an example'):
           - Provide a "Zero to Hero" simulation.
           - STORY MODE: "Meet [Name]. They started with a generic gig. It failed. Here is exactly how they fixed it to make $5k/mo."
           - PHASES:
             * Phase 1 (The Fix): Niche down + Video.
             * Phase 2 (The Scale): Outsourcing to juniors.
             * Phase 3 (The Empire): Moving to Retainers.
           - MAKE IT CONCRETE. Use real numbers ($5 -> $45 -> $2000).

        CONTEXT (The Gig Data):
        ${context ? JSON.stringify(context, null, 2) : "No specific gig analyzed yet. If they ask for general advice or a simulation, USE PROTOCOL 4."}
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map((m: any) => ({ role: m.role, content: m.content }))
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1024,
        });

        const assistantMessage = completion.choices[0]?.message?.content || 'I need to analyze a gig first. Paste your link.';

        return NextResponse.json({ message: assistantMessage });

    } catch (error) {
        console.error('Gig Chat error:', error);
        return NextResponse.json(
            { error: 'Failed to process message' },
            { status: 500 }
        );
    }
}
