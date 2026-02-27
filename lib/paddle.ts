import { Environment, Paddle, LogLevel } from '@paddle/paddle-node-sdk';

export const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
    environment: process.env.NODE_ENV === 'production' ? Environment.production : Environment.sandbox,
    logLevel: LogLevel.verbose
});

export const getTransactions = async (customerId: string) => {
    try {
        const transactionCollection = paddle.transactions.list({
            customerId: [customerId],
        });

        const transactions: any[] = [];
        for await (const t of transactionCollection) {
            transactions.push({
                id: t.id,
                date: t.createdAt,
                amount: t.details?.totals?.grandTotal ? (parseInt(t.details.totals.grandTotal) / 100).toFixed(2) : "0.00",
                status: t.status
            });
        }
        return transactions;
    } catch (error) {
        console.error("Paddle Transaction Error:", error);
        return [];
    }
}
