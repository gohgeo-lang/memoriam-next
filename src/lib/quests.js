import prisma from "@/lib/prisma";

export async function markQuestComplete(userId, type) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const quest = await prisma.questProgress.findFirst({
      where: {
        userId,
        type,
        createdAt: { gte: today },
      },
    });

    if (quest) {
      await prisma.questProgress.update({
        where: { id: quest.id },
        data: { completed: true },
      });
    } else {
      await prisma.questProgress.create({
        data: {
          userId,
          type,
          completed: true,
          rewarded: false,
          createdAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("퀘스트 완료 처리 실패:", error);
  }
}
