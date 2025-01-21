-- CreateTable
CREATE TABLE "StreamingProvider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "providerId" INTEGER NOT NULL,

    CONSTRAINT "StreamingProvider_pkey" PRIMARY KEY ("id")
);
