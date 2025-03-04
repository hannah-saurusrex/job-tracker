import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
	try {
		const {name, email, password} = await req.json();

		// check if user exists
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return NextResponse.json({ error: 'user already exists' }, { status: 400 });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// create user
		const user = await prisma.user.create({
			data: { name, email, password: hashedPassword },
		});

		return NextResponse.json({ message: "User registered", user }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: "something went wrong" }, { status: 500 });
	}
}