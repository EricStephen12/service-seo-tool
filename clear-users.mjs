import prisma from './lib/db/prisma.js';

async function clear() {
    const count = await prisma.user.deleteMany({});
    console.log(`Deleted ${count.count} users successfully.`);
}

clear().catch(console.error);
