import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { handleApiError, AppError } from '@/lib/error-handler';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            throw new AppError('Unauthorized', 401);
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id'); // websiteId or fiverrGigId

        const history = await prisma.rankingHistory.findMany({
            where: {
                userId: (session.user as any).id,
                OR: [
                    { websiteId: id || undefined },
                    { fiverrGigId: id || undefined }
                ]
            },
            orderBy: { date: 'desc' },
            take: 30 // Last 30 days
        });

        // Process into trends
        const keywordStats = history.reduce((acc: any, entry: any) => {
            if (!acc[entry.keyword]) {
                acc[entry.keyword] = {
                    keyword: entry.keyword,
                    current_position: entry.position,
                    history: []
                };
            }
            acc[entry.keyword].history.push({ date: entry.date, position: entry.position });
            return acc;
        }, {});

        const processed = Object.values(keywordStats).map((kw: any) => {
            const prev = kw.history[1]?.position;
            const change = prev ? prev - kw.current_position : 0;
            return {
                ...kw,
                change,
                trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
            };
        });

        return NextResponse.json({
            success: true,
            data: {
                keywords: processed,
                history
            }
        });

    } catch (error) {
        const { message, status } = handleApiError(error);
        return NextResponse.json({ error: message }, { status });
    }
}
