import { WatchListItemType } from '@/app/watch/watch-list/types';
import prisma from '@/prisma/client';
import { User, WatchListItem } from '@prisma/client';

import { AppError } from './errors';
import { findStreamingProvidersByTmdbIds } from './providers';
import { fetchWatchProviders } from './tmdb';

export async function getOrCreateWatchList(user: User) {
  let watchList = await prisma.watchList.findUnique({
    where: { userId: user.id },
    include: {
      watchListOnItems: {
        include: {
          watchListItem: true,
        },
      },
    },
  });

  if (!watchList) {
    watchList = await prisma.watchList.create({
      data: { userId: user.id },
      include: {
        watchListOnItems: {
          include: {
            watchListItem: true,
          },
        },
      },
    });
  }

  return {
    ...watchList,
    watchListOnItems: watchList.watchListOnItems.map(
      (item) => item.watchListItem
    ),
  };
}

export async function getWatchListForUser(userId: string) {
  const userWatchList = await prisma.watchList.findUnique({
    where: { userId },
    include: {
      watchListOnItems: {
        orderBy: { sortOrder: 'asc' },
        include: {
          watchListItem: {
            include: {
              watchListItemOnStreamingProviders: {
                include: {
                  streamingProvider: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    userWatchList?.watchListOnItems.map((item) => ({
      ...item.watchListItem,
      streamingProviders:
        item.watchListItem.watchListItemOnStreamingProviders.map(
          (wp) => wp.streamingProvider
        ),
    })) || null
  );
}

async function getOrCreateWatchListItem(
  item: WatchListItemType
): Promise<WatchListItem> {
  let watchListItem = await prisma.watchListItem.findUnique({
    where: { mediaId: item.id },
  });

  if (!watchListItem) {
    watchListItem = await prisma.watchListItem.create({
      data: {
        mediaId: item.id,
        mediaType: item.mediaType,
        originalTitle: item.originalTitle,
        originalName: item.originalName,
        posterPath: item.posterPath,
        overview: item.overview,
      },
    });
  }

  return watchListItem;
}

export async function addItemToWatchList(
  user: User,
  item: WatchListItemType
): Promise<WatchListItemType> {
  const watchList = await getOrCreateWatchList(user);
  const watchListItem = await getOrCreateWatchListItem(item);

  const existingProviders =
    await prisma.watchListItemOnStreamingProvider.findMany({
      where: { watchListItemId: watchListItem.id },
      select: { streamingProviderId: true },
    });

  if (existingProviders.length === 0) {
    const watchProviders = await fetchWatchProviders(
      watchListItem.mediaType,
      watchListItem.mediaId
    );

    const watchProviderIds = Object.keys(watchProviders).map(Number);
    const streamingProviders =
      await findStreamingProvidersByTmdbIds(watchProviderIds);

    await Promise.all(
      streamingProviders.map((provider) =>
        prisma.watchListItemOnStreamingProvider.upsert({
          where: {
            watchListItemId_streamingProviderId: {
              watchListItemId: watchListItem.id,
              streamingProviderId: provider.id,
            },
          },
          update: {},
          create: {
            watchListItemId: watchListItem.id,
            streamingProviderId: provider.id,
          },
        })
      )
    );
  }

  const maxOrder = await prisma.watchListOnItems.aggregate({
    where: { watchListId: watchList.id },
    _max: { sortOrder: true },
  });
  const nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;

  await prisma.watchListOnItems.upsert({
    where: {
      watchListId_watchListItemId: {
        watchListId: watchList.id,
        watchListItemId: watchListItem.id,
      },
    },
    update: {},
    create: {
      watchList: { connect: { id: watchList.id } },
      watchListItem: { connect: { id: watchListItem.id } },
      sortOrder: nextOrder,
    },
  });

  const updatedWatchListItem = await prisma.watchListItem.findUnique({
    where: { id: watchListItem.id },
    include: {
      watchListItemOnStreamingProviders: {
        include: {
          streamingProvider: true,
        },
      },
    },
  });

  if (!updatedWatchListItem) {
    throw new AppError(404, 'WatchListItem not found');
  }

  return {
    ...updatedWatchListItem,
    streamingProviders:
      updatedWatchListItem.watchListItemOnStreamingProviders.map(
        (entry) => entry.streamingProvider
      ),
  };
}

export async function removeItemFromWatchList(
  userId: string,
  watchListItemId: number
): Promise<WatchListItem[]> {
  const watchList = await prisma.watchList.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!watchList) {
    throw new AppError(404, 'Watch list not found.');
  }

  const watchListItem = await prisma.watchListItem.findUnique({
    where: { id: watchListItemId },
  });

  if (!watchListItem) {
    throw new AppError(404, 'WatchListItem not found.');
  }

  const watchListOnItem = await prisma.watchListOnItems.findUnique({
    where: {
      watchListId_watchListItemId: {
        watchListId: watchList.id,
        watchListItemId: watchListItem.id,
      },
    },
  });

  if (!watchListOnItem) {
    throw new AppError(
      404,
      'WatchListItem not associated with your WatchList.'
    );
  }

  await prisma.watchListOnItems.delete({
    where: {
      watchListId_watchListItemId: {
        watchListId: watchList.id,
        watchListItemId: watchListItem.id,
      },
    },
  });

  const updatedWatchList = await prisma.watchList.findUnique({
    where: { id: watchList.id },
    include: {
      watchListOnItems: {
        orderBy: { sortOrder: 'asc' },
        include: {
          watchListItem: true,
        },
      },
    },
  });

  return (
    updatedWatchList?.watchListOnItems.map(
      (row) => row.watchListItem
    ) ?? []
  );
}

export async function reorderWatchListForUser(
  userId: string,
  orderedItemIds: number[]
): Promise<void> {
  const watchList = await prisma.watchList.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!watchList) {
    throw new AppError(404, 'Watch list not found.');
  }

  const existing = await prisma.watchListOnItems.findMany({
    where: { watchListId: watchList.id },
    select: { watchListItemId: true },
  });
  const existingIds = new Set(
    existing.map((row) => row.watchListItemId)
  );

  if (
    orderedItemIds.length !== existingIds.size ||
    orderedItemIds.some((id) => !existingIds.has(id))
  ) {
    throw new AppError(400, 'Invalid watch list order.');
  }

  await prisma.$transaction(
    orderedItemIds.map((watchListItemId, index) =>
      prisma.watchListOnItems.update({
        where: {
          watchListId_watchListItemId: {
            watchListId: watchList.id,
            watchListItemId,
          },
        },
        data: { sortOrder: index },
      })
    )
  );
}
