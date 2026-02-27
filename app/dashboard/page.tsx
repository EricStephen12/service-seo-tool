import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

export const metadata = {
    title: "Command Center - Exricx SEO",
};

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    // Fetch the user's projects
    const websites = await prisma.website.findMany({
        where: { userId: (session.user as any).id },
        orderBy: { createdAt: 'desc' }
    });

    // Transform for client
    const websiteProjects = websites.map((site: any) => {
        let displayDomain = site.url;
        try {
            const urlObj = new URL(site.url.startsWith('http') ? site.url : `https://${site.url}`);
            displayDomain = urlObj.hostname;
        } catch (e) {
            displayDomain = site.url.replace(/^https?:\/\//, '').split('/')[0];
        }

        return {
            id: site.id,
            type: 'website',
            domain: displayDomain,
            grade: site.lastScanScore ? (site.lastScanScore > 90 ? 'A' : site.lastScanScore > 80 ? 'B' : site.lastScanScore > 60 ? 'C' : 'D') : '-',
            rank: '#-',
            issues: site.lastScanScore ? Math.max(0, 100 - site.lastScanScore) : 0,
            createdAt: site.createdAt.toISOString()
        };
    });

    const projects = websiteProjects.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return <DashboardClient initialProjects={projects as any} />;
}
