// src/app/api/posts/[id]/remember/route.js

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request, { params }) {
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

    // 2. PostRemember 테이블에 기록을 생성하여 중복을 방지합니다.
    //    이미 기록이 있다면 이 시점에서 데이터베이스의 UNIQUE 제약 조건에 의해 에러(P2002)가 발생합니다.
    await prisma.postremember.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });

    // 3. 기록 생성이 성공했다면, PostMemorial의 카운터를 1 증가시킵니다.
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
    // 4. 중복 공감 에러(P2002: UNIQUE constraint failed) 처리
    if (error.code === "P2002") {
      // 이미 공감한 경우, 카운트 업데이트 없이 성공 메시지를 반환합니다.
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
