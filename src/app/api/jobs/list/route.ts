import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
	try {
		const token = req.cookies.get("token")?.value;
		if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

		const decoded = jwt.verify(token, SECRET) as { userId: string };

		const jobs = await prisma.job.findMany({
			where: { userId: decoded.userId },
			orderBy: { date: "desc" }
		});

		return NextResponse.json(jobs)
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'failed to fetch jobs' }, { status: 500 });
	}
}