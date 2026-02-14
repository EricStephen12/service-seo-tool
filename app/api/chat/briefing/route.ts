import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { domain, context } = await req.json();

        // The "I just looked at your site" opening message
        const businessName = domain.replace(/^www\./, '').split('.')[0];
        const issueCount = context?.problems?.length || 0;

        let message = `Hey — I just looked at **${businessName}**.\n\n`;

        if (issueCount === 0) {
            message += `Good news: I didn't find any critical issues. Your site looks solid from a technical standpoint.\n\nWant to talk about growth strategies or have questions about SEO?`;
        } else if (issueCount === 1) {
            message += `I found **1 critical issue** that's stopping you from getting customers.\n\nLet me walk you through it and show you exactly how to fix it.`;
        } else {
            message += `I found **${issueCount} critical issues** that are stopping you from getting customers.\n\nLet me walk you through them, starting with the most important one.\n\nReady?`;
        }

        return NextResponse.json({ message });

    } catch (error) {
        console.error('Briefing generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate briefing' },
            { status: 500 }
        );
    }
}
