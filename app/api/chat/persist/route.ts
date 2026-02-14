import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { websiteId, role, content, metadata } = await req.json();

        const message = await prisma.message.create({
            data: {
                websiteId,
                role,
                content,
                metadata: metadata || undefined
            }
        });

        return NextResponse.json({ success: true, message });

    } catch (error) {
        console.error('Persist error:', error);
        return NextResponse.json(
            { error: 'Failed to save message' },
            { status: 500 }
        );
    }
}
