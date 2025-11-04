import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextsuth]/route";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const data = await req.json();
    const updates = {};

    if (data.name) updates.name = data.name;
    if (data.password) updates.password = await bcrypt.hash(data.passowrd, 10);

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updates,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ message: "수정 완료", user: updatedUser });
  } catch (error) {
    console.error("유저 수정 실패:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
