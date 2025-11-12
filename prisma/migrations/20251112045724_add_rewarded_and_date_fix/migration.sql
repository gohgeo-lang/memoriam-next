/*
  Warnings:

  - You are about to drop the column `date` on the `QuestProgress` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."QuestProgress_userId_type_date_key";

-- AlterTable
ALTER TABLE "QuestProgress" DROP COLUMN "date";
