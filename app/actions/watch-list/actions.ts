'use server';
import { SearchResultItemType } from '@/app/watch/search/types';
import { WatchListItemType } from '@/app/watch/watch-list/types';
import prisma from '@/prisma/client';
import { User, WatchList, WatchListItem } from '@prisma/client';

import { fetchWatchProviders } from '../search/actions';
import { validateSessionUser } from '../utils';

export const getOrCreateWatchList = async (
  user: User
): Promise<WatchList & { watchListOnItems: WatchListItem[] }> => {
  // get user watchList if it exists, if not, create one

  let watchList = await prisma.watchList.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      watchListOnItems: {
        include: {
          watchListItem: true, // Fetch the full WatchListItem details
        },
      },
    },
  });

  if (!watchList) {
    watchList = await prisma.watchList.create({
      data: {
        userId: user.id,
      },
      include: {
        watchListOnItems: {
          include: {
            watchListItem: true, // Fetch the full WatchListItem details
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
};

export const getUserWatchList = async (user: User) => {
  const userWatchList = await prisma.watchList.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      watchListOnItems: {
        include: {
          watchListItem: {
            // Fetch the full WatchListItem details
            include: {
              watchListItemOnStreamingProviders: {
                //Join table
                include: {
                  streamingProvider: true, // Fetch full StreamingProvider details
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
};

const getOrCreateWatchListItem = async (
  item: SearchResultItemType
): Promise<WatchListItem> => {
  let watchListItem = await prisma.watchListItem.findUnique({
    where: {
      mediaId: item.id,
    },
  });

  if (!watchListItem) {
    watchListItem = await prisma.watchListItem.create({
      data: {
        mediaId: item.id,
        mediaType: item.media_type,
        originalTitle: item.original_title,
        originalName: item.original_name,
        posterPath: item.poster_path,
        overview: item.overview,
      },
    });
  }

  return watchListItem;
};

export const addToWatchList = async (
  item: SearchResultItemType
): Promise<WatchListItemType | null> => {
  const user = await validateSessionUser();
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
      await prisma.streamingProvider.findMany({
        where: {
          providerId: {
            in: watchProviderIds,
          },
        },
      });

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
    throw new Error('WatchListItem not found');
  }

  const updatedItemWithProviders: WatchListItemType = {
    ...updatedWatchListItem,
    streamingProviders:
      updatedWatchListItem.watchListItemOnStreamingProviders.map(
        (entry) => entry.streamingProvider
      ),
  };

  return updatedItemWithProviders;
};

export const removeFromWatchList = async (
  item: WatchListItem
): Promise<WatchListItem[]> => {
  await validateSessionUser();

  const watchListItem = await prisma.watchListItem.findUnique({
    where: {
      id: item.id,
    },
  });

  if (!watchListItem) {
    throw Error('WatchListItem not found.');
  }

  const watchListOnItem = await prisma.watchListOnItems.findFirst({
    where: {
      watchListItemId: item.id,
    },
  });

  if (!watchListOnItem) {
    throw Error('WatchListItem not associated with any WatchList.');
  }

  await prisma.watchListOnItems.delete({
    where: {
      watchListId_watchListItemId: {
        watchListId: watchListOnItem.watchListId,
        watchListItemId: watchListItem.id,
      },
    },
  });

  const watchList = await prisma.watchList.findUnique({
    where: {
      id: watchListOnItem.watchListId,
    },
    include: {
      watchListOnItems: {
        include: {
          watchListItem: true,
        },
      },
    },
  });

  return (
    watchList?.watchListOnItems.map((item) => item.watchListItem) ??
    []
  );
};
