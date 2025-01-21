/*
  Warnings:

  - A unique constraint covering the columns `[providerId]` on the table `StreamingProvider` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StreamingProvider_providerId_key" ON "StreamingProvider"("providerId");
