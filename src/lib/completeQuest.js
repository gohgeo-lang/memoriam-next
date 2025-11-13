import prisma from "@/lib/prisma";

export async function completeQuest(userId, type) {
  if (!userId || !type) return { success: false, error: "잘못된 요청" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.questProgress.findFirst({
    where: { userId, type, createdAt: { gte: today } },
  });

  if (!existing) {
    await prisma.questProgress.create({
      data: { userId, type, completed: true, rewarded: false },
    });
  } else if (!existing.completed) {
    await prisma.questProgress.update({
      where: { id: existing.id },
      data: { completed: true },
    });
  }

  const check = await prisma.questProgress.findFirst({
    where: { userId, type, createdAt: { gte: today } },
  });

  if (check.rewarded) return { success: true, message: "이미 보상 완료" };

  const meta = await prisma.questMeta.findUnique({
    where: { type },
    select: { reward: true, description: true },
  });

  const rewardAmount = meta?.reward || 1;
  const description = meta?.description || "미션 보상";

  await prisma.$transaction([
    prisma.cookieHistory.create({
      data: { userId, type, amount: rewardAmount, description },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { totalCookies: { increment: rewardAmount } },
    }),
    prisma.questProgress.updateMany({
      where: { userId, type, createdAt: { gte: today } },
      data: { rewarded: true },
    }),
  ]);

  return {
    success: true,
    message: `쿠키 ${rewardAmount}개 획득`,
  };
}
