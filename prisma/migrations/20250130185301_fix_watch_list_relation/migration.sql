/*
  Warnings:

  - You are about to drop the column `watchListId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `watch_lists` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `watch_lists` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_watchListId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "watchListId";

-- AlterTable
ALTER TABLE "watch_lists" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "watch_lists_userId_key" ON "watch_lists"("userId");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watch_lists" ADD CONSTRAINT "watch_lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
