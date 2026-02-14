import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateAutoFix } from '@/lib/auto-fix';
import { handleApiError, AppError } from '@/lib/error-handler';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            throw new AppError('Unauthorized', 401);
        }

        const { issue, context } = await req.json();
        if (!issue) {
            throw new AppError('Issue data is required', 400);
        }

        const fix = await generateAutoFix(issue, context);

        return NextResponse.json({
            success: true,
            fix
        });

    } catch (error) {
        const { message, status } = handleApiError(error);
        return NextResponse.json({ error: message }, { status });
    }
}
