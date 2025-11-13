import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { completeQuest } from "@/lib/completeQuest";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

    const { type } = await req.json();
    if (!type)
      return NextResponse.json({ error: "type 값 필요" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user)
      return NextResponse.json({ error: "유저 없음" }, { status: 404 });

    const result = await completeQuest(user.id, type);

    if (!result.success)
      return NextResponse.json({ error: result.error }, { status: 500 });

    return NextResponse.json({ message: result.message });
  } catch (err) {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
