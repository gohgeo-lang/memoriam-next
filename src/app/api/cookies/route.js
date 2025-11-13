import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { loadQuests } from "@/lib/loadQuests";

const FIXED_QUESTS = [
  { type: "login_today", reward: 1, label: "오늘 로그인하기" },
  { type: "write_post", reward: 1, label: "게시글 작성하기" },
  { type: "write_comment", reward: 1, label: "댓글 작성하기" },
  { type: "ad_watch", reward: 1, label: "광고 시청하기" },
];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, totalCookies: true },
  });
  if (!user) return Response.json({ error: "사용자 없음" }, { status: 404 });

  const questsAll = await loadQuests();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let todayQuests = await prisma.questProgress.findMany({
    where: { userId: user.id, createdAt: { gte: today } },
  });

  for (const f of FIXED_QUESTS) {
    const exists = todayQuests.some((q) => q.type === f.type);
    if (!exists) {
      await prisma.questProgress.create({
        data: {
          userId: user.id,
          type: f.type,
          completed: f.type === "login_today",
          rewarded: false,
          createdAt: new Date(),
        },
      });
    }
  }

  todayQuests = await prisma.questProgress.findMany({
    where: { userId: user.id, createdAt: { gte: today } },
  });

  const existingRandom = todayQuests.filter(
    (q) => !FIXED_QUESTS.some((f) => f.type === q.type)
  );

  if (existingRandom.length === 0) {
    const dailyPool = questsAll.filter(
      (q) =>
        q.category === "daily" && !FIXED_QUESTS.some((f) => f.type === q.type)
    );

    const random = dailyPool.sort(() => 0.5 - Math.random()).slice(0, 5);

    for (const r of random) {
      await prisma.questProgress.create({
        data: {
          userId: user.id,
          type: r.type,
          completed: false,
          rewarded: false,
          createdAt: new Date(),
        },
      });
    }

    todayQuests = await prisma.questProgress.findMany({
      where: { userId: user.id, createdAt: { gte: today } },
    });
  }

  const enriched = todayQuests.map((q) => {
    const meta =
      FIXED_QUESTS.find((f) => f.type === q.type) ||
      questsAll.find((m) => m.type === q.type) ||
      {};

    return {
      id: q.id,
      type: q.type,
      label: meta.label || q.type,
      reward: meta.reward || 1,
      completed: q.completed,
      rewarded: q.rewarded,
      isFixed: FIXED_QUESTS.some((f) => f.type === q.type),
    };
  });

  const sorted = enriched.sort((a, b) => {
    if (a.isFixed && !b.isFixed) return -1;
    if (!a.isFixed && b.isFixed) return 1;
    return a.id - b.id;
  });

  const completedCount = sorted.filter((q) => q.completed).length;

  return Response.json({
    quests: sorted,
    totalCookies: user.totalCookies,
    completedCount,
  });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "로그인 필요" }, { status: 401 });

  const { type, bonus } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return Response.json({ error: "사용자 없음" }, { status: 404 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (type === "ad_watch" || bonus === true) {
    const count = await prisma.cookieHistory.count({
      where: {
        userId: user.id,
        type: "ad_watch",
        createdAt: { gte: today },
      },
    });

    if (count >= 5) {
      return Response.json(
        { message: "오늘 광고 보상 횟수 초과" },
        { status: 400 }
      );
    }

    await prisma.cookieHistory.create({
      data: {
        userId: user.id,
        type: "ad_watch",
        amount: 1,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { totalCookies: { increment: 1 } },
    });

    await prisma.questProgress.updateMany({
      where: {
        userId: user.id,
        type: "ad_watch",
        createdAt: { gte: today },
      },
      data: { completed: true, rewarded: true },
    });

    const completedCount = await prisma.questProgress.count({
      where: { userId: user.id, completed: true },
    });

    return Response.json({ message: "광고 보상 완료", completedCount });
  }

  const quest = await prisma.questProgress.findFirst({
    where: {
      userId: user.id,
      type,
      completed: true,
      rewarded: false,
    },
  });

  if (!quest) {
    return Response.json(
      { message: "보상 조건을 만족하지 않음" },
      { status: 400 }
    );
  }

  await prisma.cookieHistory.create({
    data: {
      userId: user.id,
      type,
      amount: 1,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { totalCookies: { increment: 1 } },
  });

  await prisma.questProgress.update({
    where: { id: quest.id },
    data: { rewarded: true },
  });

  const completedCount = await prisma.questProgress.count({
    where: { userId: user.id, completed: true },
  });

  return Response.json({
    message: "미션 보상 완료",
    completedCount,
  });
}
