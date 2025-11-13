import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { loadQuests } from "@/lib/loadQuests";

const FIXED_QUESTS = [
  { type: "로그인보상" },
  { type: "게시물작성" },
  { type: "댓글 작성" },
  { type: "광고보기" },
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

  await ensureFixedQuests(user.id);

  await ensureRandomQuests(user.id, questsAll);

  const todayQuests = await prisma.questProgress.findMany({
    where: { userId: user.id, createdAt: { gte: today } },
  });

  const enriched = todayQuests.map((q) => {
    const meta =
      questsAll.find((m) => m.type === q.type) ||
      FIXED_QUESTS.find((f) => f.type === q.type) ||
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

  const fixedSorted = enriched.filter((q) => q.isFixed);
  const randomSorted = enriched.filter((q) => !q.isFixed);

  const sorted = [...fixedSorted, ...randomSorted];

  const completedCount = sorted.filter((q) => q.completed).length;

  return Response.json({
    quests: sorted,
    totalCookies: user.totalCookies,
    completedCount,
  });
}

async function ensureFixedQuests(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.questProgress.findMany({
    where: { userId, createdAt: { gte: today } },
  });

  for (const f of FIXED_QUESTS) {
    if (!existing.some((q) => q.type === f.type)) {
      await prisma.questProgress.create({
        data: {
          userId,
          type: f.type,
          completed: f.type === "login_today",
          rewarded: false,
        },
      });
    }
  }
}

async function ensureRandomQuests(userId, questsAll) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.questProgress.findMany({
    where: { userId, createdAt: { gte: today } },
  });

  const randomExists = existing.filter(
    (q) => !FIXED_QUESTS.some((f) => f.type === q.type)
  );

  if (randomExists.length >= 3) return;

  const dailyPool = questsAll.filter(
    (q) =>
      q.category === "daily" && !FIXED_QUESTS.some((f) => f.type === q.type)
  );

  const needed = 3 - randomExists.length;

  const remainTypes = dailyPool
    .filter((q) => !randomExists.some((r) => r.type === q.type))
    .sort(() => 0.5 - Math.random())
    .slice(0, needed);

  for (const r of remainTypes) {
    await prisma.questProgress.create({
      data: {
        userId,
        type: r.type,
        completed: false,
        rewarded: false,
      },
    });
  }
}
