import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { amount, description } = await req.json();

  const earned = Math.floor(amount * 0.03);

  await prisma.pointHistory.create({
    data: {
      userId: user.id,
      type: "earn",
      amount: earned,
      description: `결제 적립 (${description})`,
    },
  });

  const payment = await prisma.paymentMethod.findFirst({
    where: { userId: user.id, isDefault: true },
  });

  return NextResponse.json({
    success: true,
    message: `결제가 완료되었습니다. ${earned}P가 적립되었습니다.`,
    paymentMethod: payment ? payment.cardName : "기본결제수단 없음",
    earned,
  });
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { amount, description } = await req.json();

  const deducted = Math.floor(amount * 0.03);

  await prisma.pointHistory.create({
    data: {
      userId: user.id,
      type: "use",
      amount: deducted,
      description: `결제 환불 (${description})`,
    },
  });

  return NextResponse.json({
    success: true,
    message: `환불이 완료되었습니다. ${deducted}P가 차감되었습니다.`,
    deducted,
  });
}
