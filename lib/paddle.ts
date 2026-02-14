import { Environment, Paddle, LogLevel } from '@paddle/paddle-node-sdk';

export const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
    environment: process.env.NODE_ENV === 'production' ? Environment.production : Environment.sandbox,
    logLevel: LogLevel.verbose
});

export const getPaymentLinks = async (userId: string, userEmail: string) => {
    return {
        starter: '',
        pro: '',
        agency: ''
    }
}
