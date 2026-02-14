export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public isOperational: boolean = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export function handleApiError(error: unknown) {
    console.error('API Error:', error);

    if (error instanceof AppError) {
        return {
            message: error.message,
            status: error.statusCode
        };
    }

    if (error instanceof Error && error.message === 'Rate limit exceeded') {
        return {
            message: 'Too many requests. Please try again later.',
            status: 429
        };
    }

    return {
        message: process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        status: 500
    };
}
