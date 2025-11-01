import prisma from "@lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const postId = parseInt(params.id, 10);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "잘못된 ID입니다." }, { status: 400 });
    }

    const updatedMemorial = await prisma.postMemorial.update({
      where: {
        postId: postId,
      },
      date: {
        rememberCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(updatedMemorial);
  } catch (error) {
    console.error("Remember POST Error:", error);
    return NextResponse.json(
      { error: "업데이트에 실패했습니다" },
      { status: 500 }
    );
  }
}
