import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
	try {
		const token = req.cookies.get("token")?.value;

		if (!token) {
			return NextResponse.json({ error: "unauthorized"}, { status: 401 });
		}

		const decoded = jwt.verify(token, SECRET);
		return NextResponse.json({ user: decoded })
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return NextResponse.json({ error: "invalid token"}, {status: 401 });
	}
}