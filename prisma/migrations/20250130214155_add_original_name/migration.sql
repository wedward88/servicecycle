-- AlterTable
ALTER TABLE "watch_list_items" ADD COLUMN     "originalName" TEXT,
ALTER COLUMN "originalTitle" DROP NOT NULL;
