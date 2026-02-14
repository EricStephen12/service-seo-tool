import { FiverrGigData } from './index';

export interface CompetitorAnalysis {
    category: string;
    competitionLevel: 'low' | 'medium' | 'high' | 'extreme';
    averagePrice: number;
    topTags: string[];
    commonKeywords: string[];
    sentimentOverview: string;
}

export function analyzeCompetitors(currentGig: FiverrGigData, competitors: FiverrGigData[]): CompetitorAnalysis {
    const allTags = competitors.flatMap(c => c.tags);
    const tagCounts = allTags.reduce((acc, tag) => ({ ...acc, [tag]: (acc[tag] || 0) + 1 }), {} as any);
    const sortedTags = Object.entries(tagCounts)
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 10)
        .map(t => t[0]);

    const prices = competitors.map(c => parseFloat(c.pricing[0]?.price?.replace(/[^0-9.]/g, '') || '0'));
    const avgPrice = prices.reduce((a, b) => a + b, 0) / (prices.length || 1);

    // Simple competition level logic based on review counts of competitors
    const avgReviews = competitors.reduce((a, b) => a + b.reviews, 0) / (competitors.length || 1);
    let competitionLevel: 'low' | 'medium' | 'high' | 'extreme' = 'low';

    if (avgReviews > 1000) competitionLevel = 'extreme';
    else if (avgReviews > 500) competitionLevel = 'high';
    else if (avgReviews > 100) competitionLevel = 'medium';

    return {
        category: currentGig.category,
        competitionLevel,
        averagePrice: avgPrice,
        topTags: sortedTags,
        commonKeywords: [], // Would normally extract from descriptions
        sentimentOverview: "Positive overall with focus on speed and quality"
    };
}
