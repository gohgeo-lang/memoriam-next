import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { paymentMethods: true },
  });

  return NextResponse.json(user.paymentMethods);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const user = await priams.user.findUnique({
    where: { email: session.user.email },
  });

  if (data.isDefault) {
    await prisma.paymentMethod.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    });
  }

  const card = await prisma.paymentMethod.create({
    data: { ...data, userId: user.id },
  });

  return NextResponse.json(card);
}

export async function DELETE(req) {
  const data = await req.json();
  await prisma.paymentMethod.delete({ where: { id: data.id } });
  return NextResponse.json({ seccess: true });
}
