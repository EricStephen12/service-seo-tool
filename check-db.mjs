import prisma from './lib/db/prisma.js';

async function check() {
    const email = process.argv[2];
    if (!email) {
        console.error("Please provide an email");
        return;
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
        console.log("User found:", { id: user.id, email: user.email, hasPassword: !!user.password });
    } else {
        console.log("User not found");
    }
}

check().catch(console.error);
