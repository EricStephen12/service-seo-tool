import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { crawlWebsite } from '@/lib/crawler/website-crawler';
// Synchronizing with latest schema updates
import { runFullSEOAnalysis } from '@/lib/seo-analyzer';
import { discoverKeywords } from '@/lib/seo-analyzer/keyword-discovery';
import { getGoogleRanking, getTopCompetitor } from '@/lib/tracker/google-search';
import { rateLimit } from '@/lib/rate-limit';
import { handleApiError, AppError } from '@/lib/error-handler';
import { RankMostBrain } from '@/lib/rankmost-brain';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            throw new AppError('Unauthorized', 401);
        }

        const { url, auditType = 'full' } = await req.json();
        if (!url) {
            throw new AppError('URL is required', 400);
        }

        // Rate limiting
        await rateLimit((session.user as any).id, 'scan_website', 10, 3600);

        // 1. Crawl Website
        const crawledPages = await crawlWebsite(url, 50); // Limit to 5 pages for speed but depth
        if (crawledPages.length === 0) {
            throw new AppError('Could not crawl the provided website.', 422);
        }

        // 2. Run Analysis (Hybrid Mode: Technical + Master Brain)
        const analysis = await runFullSEOAnalysis(crawledPages);

        // --- NEW: LIVE COMPETITOR DISCOVERY ---
        let competitorData = null;
        try {
            // Heuristic: Use the title tag to guess the main keyword if not provided
            const inferredKeyword = crawledPages[0].title.split('|')[0].split('-')[0].trim().substring(0, 40);
            const competitorUrl = await getTopCompetitor(inferredKeyword, new URL(url).hostname);

            if (competitorUrl) {
                console.log(`[Scanner] Found #1 Competitor for "${inferredKeyword}": ${competitorUrl}`);
                const competitorCrawl = await crawlWebsite(competitorUrl, 1); // Just crawl the homepage
                if (competitorCrawl.length > 0) {
                    competitorData = competitorCrawl[0];
                }
            }
        } catch (e) {
            console.error("Competitor Discovery Failed:", e);
        }

        let discoveredKeywords: any[] = []; // Declare outside try/catch

        let masterReport = null;
        try {
            // Aggregate content for better Brain context
            const aggregatedContent = crawledPages.slice(0, 5).map(p => `--- Source: ${p.url} ---\nTitle: ${p.title}\n${p.content.substring(0, 3000)}`).join('\n\n');
            const totalWordCount = crawledPages.reduce((acc, p) => acc + p.content.split(/\s+/).length, 0);
            const totalImages = crawledPages.reduce((acc, p) => acc + (p.images ? p.images.length : 0), 0);

            // 2. Keyword Discovery (Run BEFORE Brain so we can feed it data)
            discoveredKeywords = await discoverKeywords(crawledPages);

            masterReport = await RankMostBrain.runAudit(crawledPages[0], {
                auditType: auditType as 'full' | 'quick',
                aggregatedContent: aggregatedContent,
                competitorData: competitorData,
                totalWordCount,
                totalImages,
                keywords: discoveredKeywords // Passing the ammo
            });
        } catch (e) {
            console.error("Master Brain Failed:", e);
        }

        // 3. Keyword Discovery (Already run above - discoveredKeywords is populated)
        // No need to call again, `discoveredKeywords` is already populated.

        // 4. Store Website in Database
        const website = await prisma.website.upsert({
            where: {
                id: (await prisma.website.findFirst({
                    where: { userId: (session.user as any).id, url }
                }))?.id || 'new-uuid'
            },
            update: {
                lastScanAt: new Date(),
                lastScanScore: analysis.score
            },
            create: {
                userId: (session.user as any).id,
                url,
                lastScanAt: new Date(),
                lastScanScore: analysis.score
            }
        });

        // 5. Initial Rank Tracking for discovered keywords
        const initialRankings = [];
        for (const keyword of discoveredKeywords) {
            const position = await getGoogleRanking(url, keyword);
            if (position !== null) {
                const ranking = await prisma.rankingHistory.create({
                    data: {
                        userId: (session.user as any).id,
                        websiteId: website.id,
                        url,
                        keyword,
                        position,
                        date: new Date()
                    }
                });
                initialRankings.push(ranking);
            }
        }

        const result = await prisma.scanResult.create({
            data: {
                websiteId: website.id,
                score: analysis.score,
                problems: analysis.problems as any,
                fixes: [] as any,
                screenshot: crawledPages[0]?.screenshot, // Homepage screenshot
                reportMarkdown: masterReport
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                id: result.id,
                score: analysis.score,
                problems: analysis.problems,
                pagesScanned: analysis.pagesScanned,
                discoveredKeywords,
                initialRankings
            }
        });

    } catch (error) {
        const { message, status } = handleApiError(error);
        return NextResponse.json({ error: message }, { status });
    }
}
