
import prisma from './lib/db/prisma';

async function main() {
    try {
        console.log('--- Debugging Dossier Data ---');

        // Fetch all websites to see what's available
        const websites = await prisma.website.findMany({
            include: {
                scans: { take: 1, orderBy: { scannedAt: 'desc' } },
                rankings: { take: 5 }
            }
        });

        console.log(`Found ${websites.length} websites in DB.`);

        for (const w of websites) {
            console.log(`\nURL: ${w.url} (ID: ${w.id})`);
            console.log(`User ID: ${w.userId}`);
            console.log(`Scans: ${w.scans.length}`);
            if (w.scans.length > 0) {
                const s = w.scans[0];
                console.log(`  - Latest Scan Score: ${s.score}`);
                console.log(`  - Problems Count: ${(s.problems as any[])?.length}`);
                console.log(`  - Has Screenshot: ${!!s.screenshot}`);
                console.log(`  - Report/Markdown: ${!!s.reportMarkdown ? 'Present' : 'Missing'}`);
            } else {
                console.log('  - No scans found.');
            }
            console.log(`Rankings: ${w.rankings.length}`);
        }

    } catch (e) {
        console.error('Error querying DB:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
