import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request, context) {
  // 🔽 [수정] 이 라인을 추가하여 Next.js가 이 라우트를
  // 🔽 동적으로 처리하도록 명시합니다. (경고 해결용)
  // 이 변수를 사용하지 않아도 괜찮습니다.
  const { searchParams } = new URL(request.url);

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  try {
    const postId = parseInt(context.params.id, 10);
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
