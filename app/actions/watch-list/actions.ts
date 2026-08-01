'use server';

import { WatchListItemType } from '@/app/watch/watch-list/types';
import { requireUser } from '@/services/auth';
import { isAppError } from '@/services/errors';
import {
  addItemToWatchList,
  getOrCreateWatchList as getOrCreateWatchListService,
  getWatchListForUser,
  removeItemFromWatchList,
  reorderWatchListForUser,
} from '@/services/watch-list';
import { User, WatchListItem } from '@prisma/client';

function toActionError(error: unknown): Error {
  if (isAppError(error)) {
    return new Error(error.message);
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error('Unknown error');
}

export const getOrCreateWatchList = async (user: User) => {
  return getOrCreateWatchListService(user);
};

export const getUserWatchList = async (user: User) => {
  return getWatchListForUser(user.id);
};

export const addToWatchList = async (
  item: WatchListItemType
): Promise<WatchListItemType | null> => {
  try {
    const user = await requireUser();
    return await addItemToWatchList(user, item);
  } catch (error) {
    throw toActionError(error);
  }
};

export const removeFromWatchList = async (
  item: WatchListItem
): Promise<WatchListItem[]> => {
  try {
    const user = await requireUser();
    return await removeItemFromWatchList(user.id, item.id);
  } catch (error) {
    throw toActionError(error);
  }
};

export const reorderWatchList = async (
  orderedItemIds: number[]
): Promise<void> => {
  try {
    const user = await requireUser();
    await reorderWatchListForUser(user.id, orderedItemIds);
  } catch (error) {
    throw toActionError(error);
  }
};
