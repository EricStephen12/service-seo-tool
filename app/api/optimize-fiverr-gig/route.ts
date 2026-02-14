import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { scrapeFiverrGig, scrapeFiverrCompetitors } from '@/lib/fiverr-scraper';
import { analyzeCompetitors } from '@/lib/fiverr-scraper/competitor-analyzer';
import { optimizeGig } from '@/lib/fiverr-scraper/optimizer';
import { rateLimit } from '@/lib/rate-limit';
import { handleApiError, AppError } from '@/lib/error-handler';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            throw new AppError('Unauthorized', 401);
        }

        const { gig_url } = await req.json();
        if (!gig_url) {
            throw new AppError('Gig URL is required', 400);
        }

        if (!gig_url.includes('fiverr.com')) {
            throw new AppError('Please provide a valid Fiverr Gig URL', 400);
        }

        await rateLimit((session.user as any).id, 'fiverr_optimization', 5, 3600);

        // 1. Scrape Current Gig
        const currentData = await scrapeFiverrGig(gig_url);
        if (!currentData) {
            throw new AppError('Could not scrape Fiverr gig', 422);
        }

        // 2. Scrape Competitors (Simplified: needs a way to find category URL)
        // For now, assume we can deduce search URL from category name or use currentData
        const competitors = await scrapeFiverrCompetitors(`https://www.fiverr.com/search/gigs?query=${encodeURIComponent(currentData.category)}`);

        // 3. Analyze and Optimize
        const analysis = analyzeCompetitors(currentData, competitors);
        const optimized = await optimizeGig(currentData, analysis);

        // 4. Store in Database
        const gig = await prisma.fiverrGig.upsert({
            where: {
                id: (await prisma.fiverrGig.findFirst({
                    where: { userId: (session.user as any).id, gigUrl: gig_url }
                }))?.id || 'new-uuid'
            },
            update: {
                lastAnalysisAt: new Date(),
                lastAnalysisScore: optimized.score
            },
            create: {
                userId: (session.user as any).id,
                gigUrl: gig_url,
                category: currentData.category,
                lastAnalysisAt: new Date(),
                lastAnalysisScore: optimized.score
            }
        });

        await prisma.gigAnalysis.create({
            data: {
                gigId: gig.id,
                currentData: currentData as any,
                optimizedData: optimized as any,
                competitionLevel: analysis.competitionLevel
            }
        });

        return NextResponse.json({
            success: true,
            data: optimized
        });

    } catch (error) {
        const { message, status } = handleApiError(error);
        return NextResponse.json({ error: message }, { status });
    }
}
