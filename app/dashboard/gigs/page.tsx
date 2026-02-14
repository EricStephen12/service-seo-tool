import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import GigChatClient from "./GigChatClient";

export const metadata = {
    title: "Gig Optimizer - RankMost",
};

export default async function GigsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const gigs = await prisma.fiverrGig.findMany({
        where: {
            userId: (session.user as any).id,
        },
        include: {
            analyses: {
                orderBy: {
                    analyzedAt: 'desc'
                },
                take: 1
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return <GigChatClient />;
}
