import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { completeQuest } from "@/lib/completeQuest";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const families = await prisma.family.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(families);
  } catch (err) {
    console.error("가족 조회 실패:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const userEmail = session.user.email;

    const newFamily = await prisma.family.create({
      data: {
        user: { connect: { email: userEmail } },
        name: data.name,
        species: data.species,
        breed: data.breed,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        memo: data.memo,
        photo: data.photo,
      },
    });

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });
    if (user) await completeQuest(user.id, "register_family");

    return NextResponse.json(newFamily);
  } catch (error) {
    console.error("가족 등록 실패:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    const updated = await prisma.family.update({
      where: { id: data.id },
      data: {
        name: data.name,
        species: data.species,
        breed: data.breed,
        memo: data.memo,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        photo: data.photo,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("가족 수정 실패:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    await prisma.family.delete({ where: { id } });

    return NextResponse.json({ message: "삭제 완료" });
  } catch (error) {
    console.error("가족 삭제 실패:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
