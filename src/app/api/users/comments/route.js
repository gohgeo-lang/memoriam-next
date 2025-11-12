import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { markQuestComplete } from "@/lib/quests";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user)
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );

    const { postId, content, parentId } = await req.json();

    const newComment = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } },
        author: { connect: { id: user.id } },
        parentId: parentId || null,
      },
    });

    await markQuestComplete(user.id, "comment_support");

    return NextResponse.json(newComment);
  } catch (error) {
    console.error("댓글 작성 실패:", error);
    return NextResponse.json({ error: "댓글 작성 중 오류" }, { status: 500 });
  }
}
