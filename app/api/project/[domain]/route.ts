import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { handleApiError, AppError } from '@/lib/error-handler';

export async function DELETE(
    req: NextRequest,
    { params }: { params: { domain: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            throw new AppError('Unauthorized', 401);
        }

        const domain = decodeURIComponent(params.domain);

        // Find the website first to ensure ownership
        const website = await prisma.website.findFirst({
            where: {
                userId: (session.user as any).id,
                url: {
                    contains: domain
                }
            }
        });

        if (!website) {
            throw new AppError('Project not found or unauthorized', 404);
        }

        // Delete associated scan results first (Prisma should handle cascaded if configured, but let's be safe)
        await prisma.scanResult.deleteMany({
            where: {
                websiteId: website.id
            }
        });

        // Delete the website
        await prisma.website.delete({
            where: {
                id: website.id
            }
        });

        return NextResponse.json({
            success: true,
            message: `Project ${domain} has been terminated.`
        });

    } catch (error) {
        const { message, status } = handleApiError(error);
        return NextResponse.json({ error: message }, { status });
    }
}
