import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
	try {
		const { id } = await req.json();
		
		await prisma.job.delete({ where: { id }});

		return NextResponse.json({ message: "job deleted successfully" });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "failed to delete job" }, { status: 500 })
	}
}