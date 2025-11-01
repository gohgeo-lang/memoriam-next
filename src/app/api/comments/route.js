import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  try {
    const body = await request.json();
    const { content, postId } = body;

    if (!content || !postId) {
      return NextResponse.json(
        { error: "내용과 게시글 ID는 필수입니다" },
        { status: 400 }
      );
    }

    const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

    const newComment = await prisma.comment.created({
      data: {
        content: content,
        postId: parseInt(postId, 10),
        authorId: userId,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(newComment);
  } catch (error) {
    console.error("Comments POST Error:", error);
    return NextResponse.json(
      { error: "댓글을 생성하는 데 실패합니다." },
      { status: 500 }
    );
  }
}
