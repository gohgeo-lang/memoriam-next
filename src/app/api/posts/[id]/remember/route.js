import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request, context) {
  const { params } = context;
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  try {
    const postId = parseInt(params.id, 10);
    const userId = parseInt(session.user.id, 10);

    if (isNaN(postId) || isNaN(userId)) {
      return NextResponse.json(
        { error: "잘못된 요청입니다." },
        { status: 400 }
      );
    }

    await prisma.postremember.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });

    const updatedMemorial = await prisma.postMemorial.update({
      where: {
        postId: postId,
      },
      data: {
        rememberCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(updatedMemorial);
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "이미 공감했습니다." },
        { status: 200 }
      );
    }

    console.error("Remember POST Error:", error);
    return NextResponse.json(
      { error: "업데이트에 실패했습니다" },
      { status: 500 }
    );
  }
}
