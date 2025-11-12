import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { loadQuests } from "@/lib/loadQuests";

const FIXED_QUESTS = [
  { type: "login_today", label: "오늘 로그인하기", reward: 1 },
  { type: "write_post", label: "게시글 작성하기", reward: 1 },
  { type: "write_comment", label: "댓글 작성하기", reward: 1 },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return Response.json({ error: "로그인 필요" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, totalCookies: true },
    });
    if (!user) return Response.json({ error: "사용자 없음" }, { status: 404 });

    const allQuests = loadQuests();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.questProgress.findMany({
      where: { userId: user.id, date: { gte: today } },
    });

    if (existing.length === 0) {
      const randomFive = allQuests.sort(() => 0.5 - Math.random()).slice(0, 5);
      const todayQuests = [...FIXED_QUESTS, ...randomFive];

      await prisma.questProgress.createMany({
        data: todayQuests.map((q) => ({
          userId: user.id,
          type: q.type,
        })),
      });
    }

    const quests = await prisma.questProgress.findMany({
      where: { userId: user.id, date: { gte: today } },
    });

    const allQuestData = [...FIXED_QUESTS, ...allQuests];

    const merged = quests.map((q) => {
      const meta = allQuestData.find((a) => a.type === q.type) || {};
      return {
        id: q.id,
        type: q.type,
        completed: q.completed,
        rewarded: q.rewarded,
        label: meta.label || q.type,
        reward: meta.reward || 1,
      };
    });

    return Response.json({
      quests: merged,
      totalCookies: user.totalCookies ?? 0,
    });
  } catch (error) {
    console.error("/api/cookies (고정퀘스트 포함) 에러:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
