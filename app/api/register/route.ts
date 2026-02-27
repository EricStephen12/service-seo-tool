import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db/prisma";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const exists = await prisma.user.findUnique({
            where: { email },
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        if (exists) {
            if (!exists.password) {
                // This is a "ghost" account from previous failed attempts or OAuth
                // We'll update it with the new password
                const updatedUser = await prisma.user.update({
                    where: { email },
                    data: { password: hashedPassword, name },
                });
                return NextResponse.json(updatedUser);
            }
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
