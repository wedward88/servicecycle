/*
  Warnings:

  - You are about to drop the column `provider` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `serviceName` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "provider",
ADD COLUMN     "serviceName" TEXT NOT NULL;
