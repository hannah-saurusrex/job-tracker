import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
	try {
		const authHeader = req.headers.get("authorization");
		const token = authHeader?.split(" ")[1];

		if (!token) {
			return NextResponse.json({ error: "Unauthorized - missing token" }, { status: 401 });
		}
		
		console.log('received token', token);
		
		const decoded = jwt.verify(token, SECRET) as { userId: string };
		const { company, title, status, date, notes } = await req.json();

		const job = await prisma.job.create({
			data: {
				company,
				title,
				status,
				date: date ? new Date(date) : new Date(),
				notes,
				userId: decoded.userId,
			}
		});

		return NextResponse.json(job, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "failed to create job" }, { status: 500 });
	}
}