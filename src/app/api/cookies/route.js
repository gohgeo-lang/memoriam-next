import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { loadQuests } from "@/lib/loadQuests";
import { markQuestComplete } from "@/lib/quests";

const FIXED_QUESTS = [
  { type: "login_today", label: "오늘 로그인하기", reward: 1 },
  { type: "write_post", label: "게시글 작성하기", reward: 1 },
  { type: "write_comment", label: "댓글 작성하기", reward: 1 },
  { type: "ad_watch", label: "광고 시청하기", reward: 1 },
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

    await markQuestComplete(user.id, "login_today");

    const existing = await prisma.questProgress.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: today },
      },
    });

    if (existing.length === 0) {
      const randomFive = allQuests.sort(() => 0.5 - Math.random()).slice(0, 5);
      const todayQuests = [...FIXED_QUESTS, ...randomFive];
      await prisma.questProgress.createMany({
        data: todayQuests.map((q) => ({
          userId: user.id,
          type: q.type,
          createdAt: new Date(),
        })),
      });
    }

    let quests = await prisma.questProgress.findMany({
      where: { userId: user.id, createdAt: { gte: today } },
    });

    const allQuestData = [...FIXED_QUESTS, ...allQuests];

    let merged = quests.map((q) => {
      const meta = allQuestData.find((a) => a.type === q.type) || {};
      return {
        id: q.id,
        type: q.type,
        completed: q.completed,
        rewarded: q.rewarded,
        label: meta.label || q.type,
        reward: meta.reward || 1,
        isFixed: FIXED_QUESTS.some((f) => f.type === q.type),
      };
    });

    for (const f of FIXED_QUESTS) {
      const exists = merged.find((q) => q.type === f.type);
      if (!exists) {
        merged.unshift({
          id: null,
          type: f.type,
          label: f.label,
          reward: f.reward,
          completed: false,
          rewarded: false,
          isFixed: true,
        });
      }
    }

    merged = merged.sort((a, b) => {
      if (a.isFixed && !b.isFixed) return -1;
      if (!a.isFixed && b.isFixed) return 1;
      return a.id - b.id;
    });

    const completedCount = merged.filter((q) => q.completed).length;

    return Response.json({
      quests: merged,
      totalCookies: user.totalCookies ?? 0,
      completedCount,
    });
  } catch (error) {
    console.error("🔥 /api/cookies GET 에러:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return Response.json({ error: "로그인 필요" }, { status: 401 });

    const { type, bonus } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) return Response.json({ error: "사용자 없음" }, { status: 404 });

    if (type === "ad_watch" || bonus === true) {
      await prisma.$transaction([
        prisma.cookieHistory.create({
          data: {
            userId: user.id,
            type: "ad_watch",
            amount: 1,
            description: "광고 보상",
          },
        }),
        prisma.user.update({
          where: { id: user.id },
          data: { totalCookies: { increment: 1 } },
        }),
        prisma.questProgress.updateMany({
          where: { userId: user.id, type: "ad_watch" },
          data: { completed: true, rewarded: true },
        }),
      ]);

      const completedCount = await prisma.questProgress.count({
        where: { userId: user.id, completed: true },
      });

      return Response.json({
        message: "광고 보상으로 쿠키 1개 획득 🍪",
        completedCount,
      });
    }

    const quest = await prisma.questProgress.findFirst({
      where: {
        userId: user.id,
        type,
        completed: true,
        rewarded: false,
      },
    });

    if (!quest)
      return Response.json(
        { message: "보상받을 수 없습니다 🐾" },
        { status: 400 }
      );

    await prisma.$transaction([
      prisma.cookieHistory.create({
        data: {
          userId: user.id,
          type,
          amount: 1,
          description: "퀘스트 보상",
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { totalCookies: { increment: 1 } },
      }),
      prisma.questProgress.update({
        where: { id: quest.id },
        data: { rewarded: true },
      }),
    ]);

    const completedCount = await prisma.questProgress.count({
      where: { userId: user.id, completed: true },
    });

    return Response.json({
      message: "쿠키 1개를 획득했습니다 🍪",
      completedCount,
    });
  } catch (error) {
    console.error("🔥 /api/cookies POST 에러:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
