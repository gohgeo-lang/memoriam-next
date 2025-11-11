import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("세션:", session);

    if (!session) {
      console.log("세션 없음 → 로그인 필요");
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { pointHistories: true },
    });

    console.log("유저:", user);

    if (!user) {
      console.log("유저 없음");
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const totalPoints =
      user.pointHistories?.reduce((acc, p) => {
        return p.type === "earn" ? acc + p.amount : acc - p.amount;
      }, 0) ?? 0;

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      totalPoints,
    });
  } catch (error) {
    console.error("유저 조회 실패:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
