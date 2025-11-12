import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { completeQuest } from "@/lib/completeQuest";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const userId = session.user.id;

    const comments = await prisma.comment.findMany({
      where: { authorId: userId },
      include: {
        post: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(comments);
  } catch (error) {
    console.error("내 댓글 조회 실패:", error);
    return Response.json(
      { error: "댓글 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const userId = session.user.id;
    const { postId, content, parentId } = await req.json();

    if (!postId || !content) {
      return Response.json(
        { error: "필수 데이터가 누락되었습니다." },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        content,
        authorId: userId,
        parentId: parentId || null,
      },
      include: {
        post: { include: { category: true } },
      },
    });

    await completeQuest(userId, "comment_support");

    return Response.json({
      message: "댓글이 성공적으로 등록되었습니다.",
      comment,
    });
  } catch (error) {
    console.error("댓글 작성 실패:", error);
    return Response.json(
      { error: "댓글 작성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
