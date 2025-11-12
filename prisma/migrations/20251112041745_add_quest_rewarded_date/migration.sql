/*
  Warnings:

  - You are about to drop the column `updatedaT` on the `QuestProgress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,type,date]` on the table `QuestProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `QuestProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuestProgress" DROP COLUMN "updatedaT",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "rewarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "QuestProgress_userId_type_date_key" ON "QuestProgress"("userId", "type", "date");
