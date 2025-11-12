import prisma from "@/lib/prisma";

/**
 * 지정된 유저에게 퀘스트 완료 및 쿠키 보상을 처리
 * 중복/하루 제한 자동 처리 포함
 *
 * @param {string} userId - 유저 ID
 * @param {string} type - 퀘스트 타입 (예: 'write_post', 'remember_post' 등)
 */
export async function completeQuest(userId, type) {
  if (!userId || !type) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.questProgress.findFirst({
    where: {
      userId,
      type,
      createdAt: { gte: today },
    },
  });

  if (!existing) {
    await prisma.questProgress.create({
      data: {
        userId,
        type,
        completed: true,
        rewarded: false,
      },
    });
  } else if (!existing.completed) {
    await prisma.questProgress.update({
      where: { id: existing.id },
      data: { completed: true },
    });
  }

  if (existing?.rewarded) return { message: "이미 보상 완료" };

  const questMeta = await prisma.questMeta.findUnique({
    where: { type },
    select: { reward: true, description: true },
  });

  const rewardAmount = questMeta?.reward || 1;
  const description = questMeta?.description || "미션 보상";

  await prisma.$transaction([
    prisma.cookieHistory.create({
      data: {
        userId,
        type,
        amount: rewardAmount,
        description,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { totalCookies: { increment: rewardAmount } },
    }),
    prisma.questProgress.updateMany({
      where: {
        userId,
        type,
        createdAt: { gte: today },
      },
      data: { rewarded: true },
    }),
  ]);

  return { message: `쿠키 ${rewardAmount}개 획득 🍪` };
}
