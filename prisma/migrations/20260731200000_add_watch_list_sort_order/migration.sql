-- AlterTable
ALTER TABLE "watch_list_on_items" ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;

-- Backfill existing rows with a stable order per watch list
WITH ordered AS (
  SELECT
    "watchListId",
    "watchListItemId",
    ROW_NUMBER() OVER (
      PARTITION BY "watchListId"
      ORDER BY "watchListItemId"
    ) - 1 AS "sort_order"
  FROM "watch_list_on_items"
)
UPDATE "watch_list_on_items" AS w
SET "sort_order" = ordered."sort_order"
FROM ordered
WHERE w."watchListId" = ordered."watchListId"
  AND w."watchListItemId" = ordered."watchListItemId";
