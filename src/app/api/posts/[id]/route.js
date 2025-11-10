import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(request, context) {
  const { params } = context;
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const postId = parseInt(params.id, 10);
  const userId = parseInt(session.user.id, 10);
  const body = await request.json();
  const { title, content, petName, ownerName, thumbnailUrl } = body;

  if (isNaN(postId)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        authorId: userId,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "게시글이 존재하지 않거나 수정 권한이 없습니다." },
        { status: 403 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: title,
        content: content,
        PostMemorial: {
          update: {
            where: { postId: postId },
            data: {
              petName: petName,
              ownerName: ownerName,
              thumbnailUrl: thumbnailUrl,
            },
          },
        },
      },

      include: {
        author: {
          select: { name: true },
        },
        PostMemorial: true,
        comments: {
          include: {
            author: { select: { name: true } },
            replies: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Post PATCH Error:", error);
    return NextResponse.json(
      { error: "게시글 수정에 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  const { params } = context;
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const postId = parseInt(params.id, 10);
  const userId = parseInt(session.user.id, 10);

  if (isNaN(postId)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        authorId: userId,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "게시글이 존재하지 않거나 삭제 권한이 없습니다." },
        { status: 403 }
      );
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json(
      { message: "게시글이 삭제되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Post DELETE Error:", error);
    return NextResponse.json(
      { error: "게시글 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
