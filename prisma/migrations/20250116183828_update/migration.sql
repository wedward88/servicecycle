/*
  Warnings:

  - You are about to drop the column `expiration_date` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "expiration_date",
ADD COLUMN     "expirationDate" TIMESTAMP(3);
