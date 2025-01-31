'use server';
import { revalidatePath } from 'next/cache';

import { SearchResultItem } from '@/app/watch/type';
import prisma from '@/prisma/client';
import { User, WatchList, WatchListItem } from '@prisma/client';

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
  let userWatchList = await prisma.watchList.findUnique({
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

  return (
    userWatchList?.watchListOnItems.map(
      (item) => item.watchListItem
    ) || null
  );
};

const getOrCreateWatchListItem = async (
  item: SearchResultItem
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
  item: SearchResultItem
): Promise<WatchListItem[]> => {
  const user = await validateSessionUser();

  const watchListItem = await getOrCreateWatchListItem(item);
  const watchList = await getOrCreateWatchList(user);

  await prisma.watchListOnItems.create({
    data: {
      watchList: {
        connect: { id: watchList.id },
      },
      watchListItem: {
        connect: { id: watchListItem.id },
      },
    },
  });

  const updatedWatchList = await prisma.watchList.findUnique({
    where: { id: watchList.id },
    include: {
      watchListOnItems: {
        include: {
          watchListItem: true,
        },
      },
    },
  });

  revalidatePath('/search');
  return (
    updatedWatchList?.watchListOnItems.map(
      (item) => item.watchListItem
    ) || []
  );
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

  const updatedWatchList = await prisma.watchListOnItems.delete({
    where: {
      watchListId_watchListItemId: {
        watchListId: watchListOnItem.watchListId,
        watchListItemId: watchListItem.id,
      },
    },
  });

  const watchList = await prisma.watchList.findUnique({
    where: {
      id: watchListOnItem.watchListId, // Use the watchListId from the join table
    },
    include: {
      watchListOnItems: {
        include: {
          watchListItem: true,
        },
      },
    },
  });

  revalidatePath('/search');
  return (
    watchList?.watchListOnItems.map((item) => item.watchListItem) ??
    []
  );
};
