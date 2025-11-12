import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cookieHistories: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalCookies =
      user.cookieHistories?.reduce((acc, c) => acc + c.amount, 0) ?? 0;

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      totalCookies,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("유저 조회 실패:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
