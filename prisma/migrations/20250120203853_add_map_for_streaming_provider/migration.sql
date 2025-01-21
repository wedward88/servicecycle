/*
  Warnings:

  - You are about to drop the `StreamingProvider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "StreamingProvider";

-- CreateTable
CREATE TABLE "streaming_provider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "providerId" INTEGER NOT NULL,

    CONSTRAINT "streaming_provider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "streaming_provider_providerId_key" ON "streaming_provider"("providerId");
