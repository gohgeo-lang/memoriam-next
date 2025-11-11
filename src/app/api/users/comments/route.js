import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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
    });

    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          include: {
            category: true,
            author: true,
          },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("내 댓글 조회 실패:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
