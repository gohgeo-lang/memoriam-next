import prisma from "@/lib/prisma";

export async function markQuestComplete(userId, type) {
  try {
    if (!userId || !type) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const quest = await prisma.questProgress.findFirst({
      where: {
        userId,
        type,
        createdAt: { gte: today },
      },
    });

    if (!quest) return;

    if (!quest.completed) {
      await prisma.questProgress.update({
        where: { id: quest.id },
        data: { completed: true },
      });
      console.log(`미션 완료 처리됨: ${type}`);
    }
  } catch (error) {
    console.error("markQuestComplete 오류:", error);
  }
}
