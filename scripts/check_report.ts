
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const website = await prisma.website.findFirst({
        where: { url: { contains: 'yutaka' } },
        include: {
            scans: {
                orderBy: { scannedAt: 'desc' },
                take: 1
            }
        }
    });

    if (!website || website.scans.length === 0) {
        console.log("No scan found.");
        return;
    }

    console.log("--- LATEST REPORT DATE ---");
    console.log(website.scans[0].scannedAt);
    console.log("--- REPORT MARKDOWN ---");
    console.log(website.scans[0].reportMarkdown);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
