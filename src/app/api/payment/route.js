import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

async function alreadyEarnedToday(userId, category) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const record = await prisma.pointHistories.findFirst({
    where: {
      userId,
      category,
      createdAt: { gte: today },
    },
  });

  return !!record;
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { category } = await req.json(); // "login" | "post" | "comment"
    if (!category)
      return NextResponse.json(
        { error: "카테고리가 필요합니다." },
        { status: 400 }
      );

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const earned = await alreadyEarnedToday(user.id, category);
    if (earned)
      return NextResponse.json({
        message: "오늘은 이미 포인트를 받았습니다.",
      });

    const descriptionMap = {
      login: "로그인 보너스",
      post: "게시글 작성 보상",
      comment: "댓글 작성 보상",
    };

    const point = await prisma.pointHistories.create({
      data: {
        userId: user.id,
        type: "earn",
        category,
        amount: 100,
        description: descriptionMap[category],
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { totalPoints: { increment: 100 } },
    });

    return NextResponse.json(point);
  } catch (error) {
    console.error("포인트 적립 실패:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { pointHistories: { orderBy: { createdAt: "desc" } } },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user.pointHistories || []);
  } catch (error) {
    console.error("포인트 내역 조회 실패:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
