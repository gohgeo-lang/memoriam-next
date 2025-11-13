import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { completeQuest } from "@/lib/completeQuest";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { paymentMethods: { orderBy: { createdAt: "desc" } } },
    });

    return NextResponse.json(user?.paymentMethods || []);
  } catch (err) {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (data.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const method = await prisma.paymentMethod.create({
      data: {
        user: { connect: { id: user.id } },
        cardName: data.cardName,
        cardNumber: data.cardNumber,
        isDefault: data.isDefault,
      },
    });

    await completeQuest(user.id, "register_payment");

    return NextResponse.json(method);
  } catch (err) {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (data.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: user.id, NOT: { id: data.id } },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.paymentMethod.update({
      where: { id: data.id },
      data: {
        cardName: data.cardName,
        cardNumber: data.cardNumber,
        isDefault: data.isDefault,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    await prisma.paymentMethod.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
