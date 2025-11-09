import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const commentId = parseInt(params.commentId, 10);
  const userId = parseInt(session.user.id, 10);
  const { content } = await request.json();

  if (!content) {
    return NextResponse.json({ error: "내용이 필요합니다." }, { status: 400 });
  }

  if (isNaN(commentId)) {
    return NextResponse.json(
      { error: "잘못된 댓글 ID입니다." },
      { status: 400 }
    );
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json({ error: "댓글이 없습니다." }, { status: 404 });
    }

    if (comment.authorId !== userId) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content: content },
      include: { author: true }, // 갱신된 정보 반환
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error(`Comment ${commentId} PATCH Error:`, error);
    return NextResponse.json({ error: "댓글 수정 실패" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const commentId = parseInt(params.commentId, 10);
  const userId = parseInt(session.user.id, 10);

  if (isNaN(commentId)) {
    return NextResponse.json(
      { error: "잘못된 댓글 ID입니다." },
      { status: 400 }
    );
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { replies: { select: { id: true } } }, // 답글이 있는지 확인
    });

    if (!comment) {
      return NextResponse.json({ error: "댓글이 없습니다." }, { status: 404 });
    }

    if (comment.authorId !== userId) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    if (comment.replies && comment.replies.length > 0) {
      const softDeletedComment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          content: "삭제된 댓글입니다.",
          isDeleted: true,
          authorId: null,
        },
        include: { author: true },
      });
      return NextResponse.json({
        ...softDeletedComment,
        status: "soft-deleted",
      });
    } else {
      await prisma.comment.delete({
        where: { id: commentId },
      });
      return NextResponse.json({ id: commentId, status: "hard-deleted" });
    }
  } catch (error) {
    console.error(`Comment ${commentId} DELETE Error:`, error);
    return NextResponse.json({ error: "댓글 삭제 실패" }, { status: 500 });
  }
}
