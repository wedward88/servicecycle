-- CreateTable
CREATE TABLE "watch_list_item_on_streaming_provider" (
    "watchListItemId" INTEGER NOT NULL,
    "streamingProviderId" INTEGER NOT NULL,

    CONSTRAINT "watch_list_item_on_streaming_provider_pkey" PRIMARY KEY ("watchListItemId","streamingProviderId")
);

-- AddForeignKey
ALTER TABLE "watch_list_item_on_streaming_provider" ADD CONSTRAINT "watch_list_item_on_streaming_provider_watchListItemId_fkey" FOREIGN KEY ("watchListItemId") REFERENCES "watch_list_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watch_list_item_on_streaming_provider" ADD CONSTRAINT "watch_list_item_on_streaming_provider_streamingProviderId_fkey" FOREIGN KEY ("streamingProviderId") REFERENCES "streaming_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
