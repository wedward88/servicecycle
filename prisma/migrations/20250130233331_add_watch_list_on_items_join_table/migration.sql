/*
  Warnings:

  - You are about to drop the column `watchListId` on the `watch_list_items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "watch_list_items" DROP CONSTRAINT "watch_list_items_watchListId_fkey";

-- AlterTable
ALTER TABLE "watch_list_items" DROP COLUMN "watchListId";

-- CreateTable
CREATE TABLE "watch_list_on_items" (
    "watchListId" INTEGER NOT NULL,
    "watchListItemId" INTEGER NOT NULL,

    CONSTRAINT "watch_list_on_items_pkey" PRIMARY KEY ("watchListId","watchListItemId")
);

-- AddForeignKey
ALTER TABLE "watch_list_on_items" ADD CONSTRAINT "watch_list_on_items_watchListId_fkey" FOREIGN KEY ("watchListId") REFERENCES "watch_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watch_list_on_items" ADD CONSTRAINT "watch_list_on_items_watchListItemId_fkey" FOREIGN KEY ("watchListItemId") REFERENCES "watch_list_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
