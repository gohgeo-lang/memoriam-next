import prisma from "@/lib/prisma";

export async function markQuestComplete(userId, type) {
  if (!userId || !type) return;

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
}
