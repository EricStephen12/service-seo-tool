import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Email",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (isValid) return user;
                return null;
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.notifDailyBrief = (user as any).notifDailyBrief;
                token.notifSecurity = (user as any).notifSecurity;
                token.notifCompetitors = (user as any).notifCompetitors;
            }
            if (trigger === "update" && session?.user) {
                token.name = session.user.name;
                token.email = session.user.email;
                if (session.user.notifDailyBrief !== undefined) token.notifDailyBrief = session.user.notifDailyBrief;
                if (session.user.notifSecurity !== undefined) token.notifSecurity = session.user.notifSecurity;
                if (session.user.notifCompetitors !== undefined) token.notifCompetitors = session.user.notifCompetitors;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).notifDailyBrief = token.notifDailyBrief;
                (session.user as any).notifSecurity = token.notifSecurity;
                (session.user as any).notifCompetitors = token.notifCompetitors;
            }
            return session;
        }
    }
};
