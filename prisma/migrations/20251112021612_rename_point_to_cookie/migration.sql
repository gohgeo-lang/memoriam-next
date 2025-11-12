/*
  Warnings:

  - You are about to drop the column `totalPoints` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `PointHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PointHistory" DROP CONSTRAINT "PointHistory_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "totalPoints",
ADD COLUMN     "totalCookies" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "public"."PointHistory";

-- CreateTable
CREATE TABLE "CookieHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CookieHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CookieHistory" ADD CONSTRAINT "CookieHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
