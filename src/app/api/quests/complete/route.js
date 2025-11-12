import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type } = await req.json();
  if (!type)
    return NextResponse.json({ error: "Missing type" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const existing = await prisma.questProgress.findFirst({
    where: { userId: user.id, type },
  });

  if (existing) {
    await prisma.questProgress.update({
      where: { id: existing.id },
      data: { completed: true },
    });
  } else {
    await prisma.questProgress.create({
      data: { userId: user.id, type, completed: true },
    });
  }

  return NextResponse.json({ status: "ok", message: "퀘스트 완료로 기록됨" });
}
