import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/route";
// Vercel Deploy
import { authOptions } from "../../auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return Response.json({ error: "로그인 필요" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cookieHistories: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) return Response.json({ error: "사용자 없음" }, { status: 404 });

    return Response.json(user.cookieHistories || []);
  } catch (error) {
    console.error("/api/cookies/history GET 에러:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
