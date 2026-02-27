import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { getTransactions } from "@/lib/paddle";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: (session.user as any).id },
            select: {
                paddlePriceId: true,
                paddleCurrentPeriodEnd: true,
                paddleSubscriptionId: true,
                paddleCustomerId: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Map Price IDs to human-readable names
        const planMap: Record<string, { name: string; price: string }> = {
            'pri_3_placeholder': { name: 'The Clinical', price: '3' },
            'pri_12_placeholder': { name: 'The Surgical', price: '12' },
            'pri_49_placeholder': { name: 'The Intelligence', price: '49' },
        };

        const currentPlan = user.paddlePriceId ? planMap[user.paddlePriceId] || { name: 'Custom Protocol', price: '?' } : null;

        // Fetch real transactions if customerId exists
        let transactions: any[] = [];
        if (user.paddleCustomerId) {
            transactions = await getTransactions(user.paddleCustomerId);
        }

        return NextResponse.json({
            success: true,
            billing: {
                hasSubscription: !!user.paddleSubscriptionId,
                planName: currentPlan?.name || "No Active Protocol",
                amount: currentPlan?.price || "0",
                nextBillingDate: user.paddleCurrentPeriodEnd ? user.paddleCurrentPeriodEnd.toISOString() : null,
                subscriptionId: user.paddleSubscriptionId,
                transactions: transactions
            }
        });
    } catch (error) {
        console.error("Billing API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
