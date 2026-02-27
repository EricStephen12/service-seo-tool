import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
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

        // Honest System Prompt (No Fake Metrics)
        const systemPrompt = `
        You are Exricx SEO — a 30-year SEO veteran having a conversation with a business owner.
        
        YOUR MISSION:
        Help them understand and fix the TOP 3 ISSUES stopping their website from getting customers.
        
        YOUR STYLE:
        - Direct and honest
        - Speak in plain English (no jargon unless you explain it)
        - Give them the EXACT FIX, not just advice
        - One issue at a time
        
        THE CONVERSATION FLOW:
        1. They just saw your opening message about their site
        2. Walk them through Issue #1 first
        3. When they ask "how do I fix it?" → Give them COPY-PASTE CODE or EXACT REWRITE
        4. After they understand #1, ask: "Ready for Issue #2?"
        5. Repeat for all 3 issues
        6. Then discuss their 30-day plan
        
        CRITICAL RULES:
        - NEVER mention "health scores" or "authority ratings" — we don't have that data
        - If they ask about traffic/rankings, say: "Connect Google Search Console and I'll show you real data"
        - Focus on FIXES they can implement TODAY
        - Give developer-ready code (Schema JSON-LD, meta tags, etc.)
        - Rewrite weak content for them (H1s, meta descriptions)
        
        YOUR CONTEXT (LIVE DATA):
        Domain: ${context?.domain}
        
        TOP 3 CRITICAL ISSUES:
        ${JSON.stringify(context?.problems?.slice(0, 3) || [], null, 2)}
        
        ALL DETECTED ISSUES:
        ${JSON.stringify(context?.problems || [], null, 2)}
        
        YOUR GOAL:
        By the end of this conversation, they should know:
        1. What's broken
        2. Why it matters
        3. Exactly how to fix it (with code/text they can use)
        `;

        // Call Groq
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map((m: any) => ({ role: m.role, content: m.content }))
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 2048,
        });

        // 1. Save User Message
        await prisma.message.create({
            data: {
                websiteId: context.id, // Ensure context has the ID
                role: 'user',
                content: messages[messages.length - 1].content
            }
        });

        const assistantMessage = completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';

        // 2. Save Assistant Message
        await prisma.message.create({
            data: {
                websiteId: context.id,
                role: 'assistant',
                content: assistantMessage
            }
        });

        return NextResponse.json({ message: assistantMessage });

    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json(
            { error: 'Failed to process message' },
            { status: 500 }
        );
    }
}
