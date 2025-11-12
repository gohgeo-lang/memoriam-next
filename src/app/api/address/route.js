import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { completeQuest } from "@/lib/completeQuest";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json([], { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { addresses: true },
    });

    return NextResponse.json(user?.addresses || []);
  } catch (err) {
    console.error("주소 조회 실패:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    delete data.id;

    if (data.isDefault) {
      const session = await getServerSession(authOptions);
      await prisma.address.updateMany({
        where: {
          user: { email: session.user.email },
          NOT: { id: data.id ?? 0 },
        },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        ...data,
        user: { connect: { email: session.user.email } },
      },
    });

    return NextResponse.json(address);
  } catch (err) {
    console.error("주소 등록 실패:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
await completeQuest(user.id, "add_address");

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();

    const updated = await prisma.address.update({
      where: { id: data.id },
      data,
    });

    if (data.isDefault) {
      const session = await getServerSession(authOptions);
      await prisma.address.updateMany({
        where: {
          user: { email: session.user.email },
          NOT: { id: data.id ?? 0 },
        },
        data: { isDefault: false },
      });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("주소 수정 실패:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();

    await prisma.address.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("주소 삭제 실패:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
