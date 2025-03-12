import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
	try {
		const { id, company, title, status, notes } = await req.json();

		const job = await prisma.job.update({
			where: { id },
			data: { company, title, status, notes },
		});

		return NextResponse.json(job);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "failed to update job"}, { status: 500 });
	}
}