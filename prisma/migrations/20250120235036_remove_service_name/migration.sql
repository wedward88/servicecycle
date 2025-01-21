/*
  Warnings:

  - You are about to drop the column `logo` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `serviceName` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "logo",
DROP COLUMN "serviceName";
