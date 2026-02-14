import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login",
    },
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/scan-website/:path*",
        "/api/analyze-gig/:path*",
    ],
};
