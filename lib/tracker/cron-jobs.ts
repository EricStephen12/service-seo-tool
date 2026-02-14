import prisma from '@/lib/db/prisma';
import { getGoogleRanking } from './google-search';
import { getFiverrRanking } from './fiverr-tracker';

export async function updateDailyRankings() {
    console.log('Starting daily ranking update...');

    // 1. Process Website Rankings
    const websites = await prisma.website.findMany({
        include: { user: true }
    });

    for (const site of websites) {
        // In a real app, keywords would be stored in a separate table.
        // For now, we'll use a placeholder or derive from industry.
        const keywords = site.industry ? [`${site.industry} services near me`, site.url] : ['plumber brooklyn'];

        for (const kw of keywords) {
            const position = await getGoogleRanking(site.url, kw);
            if (position !== null) {
                await prisma.rankingHistory.create({
                    data: {
                        userId: site.userId,
                        url: site.url,
                        keyword: kw,
                        position,
                        websiteId: site.id
                    }
                });
            }
        }
    }

    // 2. Process Fiverr Rankings
    const gigs = await prisma.fiverrGig.findMany();
    for (const gig of gigs) {
        const kw = gig.category || 'logo design';
        const position = await getFiverrRanking(gig.gigUrl, kw);
        if (position !== null) {
            await prisma.rankingHistory.create({
                data: {
                    userId: gig.userId,
                    url: gig.gigUrl,
                    keyword: kw,
                    position,
                    fiverrGigId: gig.id
                }
            });
        }
    }

    console.log('Daily ranking update completed.');
}
