// src/lib/completeQuest.js
import prisma from "@/lib/prisma";

export async function completeQuest(userId, type) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.questProgress.updateMany({
    where: {
      userId,
      type,
      date: { gte: today },
      completed: false,
    },
    data: { completed: true },
  });
}
