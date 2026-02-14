export async function getGoogleRanking(url: string, keyword: string): Promise<number | null> {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_CX;

    if (!apiKey || !cx) return null;

    try {
        const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(keyword)}&num=100`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        const items = data.items || [];
        const position = items.findIndex((item: any) => item.link.includes(url));

        return position !== -1 ? position + 1 : 101; // 101 means not found in top 100

    } catch (error) {
        console.error(`Google Ranking check failed for ${keyword}:`, error);
        return null;
    }
}

export async function getTopCompetitor(keyword: string, userDomain: string): Promise<string | null> {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_CX;

    if (!apiKey || !cx) return null;

    try {
        const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(keyword)}&num=3`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        const items = data.items || [];

        // Find the first result that is NOT the user's domain
        const competitor = items.find((item: any) => !item.link.includes(userDomain));

        return competitor ? competitor.link : null;

    } catch (error) {
        console.error(`Google Competitor Discovery failed for ${keyword}:`, error);
        return null;
    }
}
