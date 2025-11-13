import prisma from "@/lib/prisma";

export async function markQuestComplete(userId, type) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.questProgress.findFirst({
    where: { userId, type, createdAt: { gte: today } },
  });

  if (!existing) {
    await prisma.questProgress.create({
      data: { userId, type, completed: true, rewarded: false },
    });
  } else {
    await prisma.questProgress.update({
      where: { id: existing.id },
      data: { completed: true },
    });
  }
}
