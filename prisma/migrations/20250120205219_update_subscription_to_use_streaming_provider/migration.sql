/*
  Warnings:

  - Added the required column `streamingProviderId` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "streamingProviderId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_streamingProviderId_fkey" FOREIGN KEY ("streamingProviderId") REFERENCES "streaming_provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
