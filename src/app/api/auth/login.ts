import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!; // add to .env

export async function POST(req: NextRequest) {
	try {
		const { email, password } = await req.json();
		
		// find user
		const user = await prisma.user.findUnique({ where: {email} });
		if (!user) { 
			return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
		}

		// check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return NextResponse.json({ error: "invalid credentials"}, { status: 401 });
		}

		// generate JWT
		const token = jwt.sign({ userId: user.id, email: user.email }, SECRET, {
			expiresIn: "1d",
		});

		// set token in HTTP-only cookie
		const response = NextResponse.json({ message: "login successful"});
		response.cookies.set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 24 * 60 * 60,
			path: "/",
		})

		return response;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return NextResponse.json({ error: "something went wrong"}, { status: 500 });
	}
}