/*
  Warnings:

  - You are about to drop the column `expiry` on the `PaymentMethod` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "expiry";
