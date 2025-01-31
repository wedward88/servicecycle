-- AlterTable
ALTER TABLE "users" ADD COLUMN     "watchListId" INTEGER;

-- CreateTable
CREATE TABLE "watch_list_items" (
    "id" SERIAL NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "mediaType" TEXT NOT NULL,
    "originalTitle" TEXT NOT NULL,
    "posterPath" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "firstAirDate" TEXT NOT NULL,
    "watchListId" INTEGER,

    CONSTRAINT "watch_list_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watch_lists" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "watch_lists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "watch_list_items_mediaId_key" ON "watch_list_items"("mediaId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_watchListId_fkey" FOREIGN KEY ("watchListId") REFERENCES "watch_lists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watch_list_items" ADD CONSTRAINT "watch_list_items_watchListId_fkey" FOREIGN KEY ("watchListId") REFERENCES "watch_lists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
