import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { redirect, notFound } from "next/navigation";
import ProjectChatClient from "./ProjectChatClient";

export const metadata = {
    title: "Project Dossier - RankMost",
};

export default async function ProjectPage({ params }: { params: { domain: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const domain = decodeURIComponent(params.domain);

    // Fetch the project data from database
    // We search by contains because the stored URL might have https:// etc.
    const website = await prisma.website.findFirst({
        where: {
            userId: (session.user as any).id,
            url: {
                contains: domain,
            },
        },
        include: {
            scans: {
                orderBy: {
                    scannedAt: 'desc'
                },
                take: 1
            },
            rankings: {
                orderBy: {
                    date: 'desc'
                },
                take: 50
            },
            messages: {
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    });

    if (!website) {
        return notFound();
    }

    const lastScan = website.scans[0];
    const latestRankings = website.rankings;

    // Data Transformation for the Dossier
    const dossierData = {
        id: website.id,
        health: website.lastScanScore || 0,
        authority: "N/A", // User Feedback: Do not fake this number.
        backlinks: "N/A", // User Feedback: Do not fake this number.
        keywords: latestRankings.length > 0 ? `${latestRankings.length}` : "N/A",
        traffic: "N/A",   // User Feedback: Do not fake this number.
        problems: lastScan ? (lastScan.problems as any[]) : [],
        isSecure: website.url.startsWith('https'),
        rankings: latestRankings,
        screenshot: lastScan?.screenshot as string | undefined,
        reportMarkdown: lastScan?.reportMarkdown as string | undefined,
        chatHistory: website.messages.map(m => ({
            id: m.id,
            role: m.role as 'user' | 'assistant' | 'system',
            content: m.content,
            timestamp: m.createdAt,
            attachments: m.metadata ? (m.metadata as any).attachments : undefined
        }))
    };

    return <ProjectChatClient domain={domain} data={dossierData} />;
}
