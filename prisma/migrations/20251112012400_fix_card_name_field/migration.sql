/*
  Warnings:

  - You are about to drop the column `carName` on the `PaymentMethod` table. All the data in the column will be lost.
  - Added the required column `cardName` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "carName",
ADD COLUMN     "cardName" TEXT NOT NULL;
