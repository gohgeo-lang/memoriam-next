import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const families = await prisma.family.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(families);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  const newFamily = await prisma.family.create({
    data: {
      user: { connect: { email: session.user.email } },
      name: data.name,
      species: data.species,
      breed: data.breed,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      memo: data.memo,
      photo: data.photo,
    },
  });

  return NextResponse.json(newFamily);
}

export async function PATCH(req) {
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
}

export async function DELETE(req) {
  const { id } = await req.json();
  await prisma.family.delete({ where: { id } });
  return NextResponse.json({ message: "삭제 완료" });
}
