import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, email, currentPassword, newPassword, notifDailyBrief, notifSecurity, notifCompetitors } = body;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email && email !== user.email) {
            // Check if email already taken
            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) return NextResponse.json({ error: "Email already taken" }, { status: 400 });
            updateData.email = email;
        }

        if (newPassword) {
            if (!user.password) {
                // User signed in with OAuth?
                return NextResponse.json({ error: "Password cannot be set for social logins" }, { status: 400 });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });
            }
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        if (typeof notifDailyBrief === 'boolean') updateData.notifDailyBrief = notifDailyBrief;
        if (typeof notifSecurity === 'boolean') updateData.notifSecurity = notifSecurity;
        if (typeof notifCompetitors === 'boolean') updateData.notifCompetitors = notifCompetitors;

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData
        });

        return NextResponse.json({
            success: true,
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                notifDailyBrief: updatedUser.notifDailyBrief,
                notifSecurity: updatedUser.notifSecurity,
                notifCompetitors: updatedUser.notifCompetitors
            }
        });

    } catch (error) {
        console.error("Settings Update Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
