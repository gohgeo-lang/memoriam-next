import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unathorized" }, { status: 401 });

  const posts = await prisma.post.findMany({
    where: { author: { email: session.user.email } },
    include: {
      author: { select: { name: true } },
      comments: {
        include: { author: { select: { name: true } } },
      },
      PostMemorial: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}
