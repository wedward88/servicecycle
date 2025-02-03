import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { DBSubscription, Subscription } from '@/app/subscriptions/types';

import { createSubscription, deleteSubscription, editSubscription } from '../actions/actions';
import { addToWatchList, removeFromWatchList } from '../actions/watch-list/actions';
import { SearchResultItemType } from '../watch/type';
import { WatchListItemType } from '../watch/watch-list/type';
import { SubscriptionError } from './SubscriptionError';

export interface MainStoreInterface {
  watchListMediaIds: number[];
  userWatchList: WatchListItemType[];
  setUserWatchList: (newList: WatchListItemType[]) => void;
  addToWatchList: (item: SearchResultItemType) => void;
  removeFromWatchList: (mediaId: number) => void;
  subscriptions: Subscription[];
  subscriptionIds: number[];
  setSubscriptions: (newList: DBSubscription[]) => void;
  createSubscription: (subscription: Subscription) => void;
  deleteSubscription: (id: number) => void;
  editSubscription: (subscription: Subscription) => void;
}

export const createMainStore = () => {
  return createStore<MainStoreInterface>()(
    persist(
      (set, get) => ({
        userWatchList: [],
        watchListMediaIds: [],
        subscriptions: [],
        subscriptionIds: [],
        setUserWatchList: (newList: WatchListItemType[]) => {
          set({
            userWatchList: newList,
            watchListMediaIds: newList.map((item) => item.mediaId),
          });
        },

        addToWatchList: async (item: SearchResultItemType) => {
          try {
            const addedItem = await addToWatchList(item);

            if (addedItem) {
              set((state: MainStoreInterface) => ({
                userWatchList: [...state.userWatchList, addedItem],
                watchListMediaIds: [
                  ...state.watchListMediaIds,
                  addedItem.mediaId,
                ],
              }));
            } else {
              console.error(
                'Failed to add item to the watch list, received null.'
              );
            }
          } catch (error) {
            throw Error(`Unable to add item to watch list. ${error}`);
          }
        },

        removeFromWatchList: async (mediaId: number) => {
          const state = get();
          const itemToRemove = state.userWatchList.find(
            (i) => i.mediaId === mediaId
          );

          if (itemToRemove) {
            set((state: MainStoreInterface) => ({
              userWatchList: state.userWatchList.filter(
                (i) => i.mediaId !== mediaId
              ),
              watchListMediaIds: state.watchListMediaIds.filter(
                (id) => id !== mediaId
              ),
            }));

            try {
              await removeFromWatchList(itemToRemove);
            } catch {
              set((state: MainStoreInterface) => ({
                userWatchList: [...state.userWatchList, itemToRemove],
                watchListMediaIds: [
                  ...state.watchListMediaIds,
                  itemToRemove.mediaId,
                ],
              }));
            }
          }
        },

        setSubscriptions: (newList: DBSubscription[]) => {
          set({
            subscriptions: newList,
            subscriptionIds: newList
              .map((item) => item.streamingProviderId)
              .filter((id): id is number => id !== undefined),
          });
        },

        createSubscription: async (formData: Subscription) => {
          /* eslint-disable @typescript-eslint/no-explicit-any */
          try {
            const addedItem: DBSubscription =
              await createSubscription(formData);

            if (addedItem) {
              set((state) => ({
                subscriptions: [...state.subscriptions, addedItem],
                subscriptionIds: [
                  ...state.subscriptionIds,
                  addedItem.id !== undefined ? addedItem.id : -1,
                ].filter((id) => id !== undefined),
              }));
            } else {
              console.error(
                'Failed to create subscription, received null.'
              );
            }
          } catch (error: any) {
            throw new SubscriptionError(error.message);
          }
        },

        deleteSubscription: async (id: number) => {
          try {
            const deletedSubscription = await deleteSubscription(id);

            set((state) => ({
              subscriptions: state.subscriptions.filter(
                (item) => item.id !== id
              ),
              subscriptionIds: state.subscriptionIds.filter(
                (providerId) =>
                  providerId !==
                  deletedSubscription.streamingProviderId
              ),
            }));
          } catch {
            throw Error('Unable to delete subscription.');
          }
        },

        editSubscription: async (formData: Subscription) => {
          try {
            await editSubscription(formData);

            set((state) => ({
              subscriptions: state.subscriptions.map((item) => {
                if (item.id === formData.id) {
                  return formData;
                }
                return item;
              }),
            }));
          } catch {
            throw Error('Unable to edit subscription.');
          }
        },
      }),
      {
        name: 'main-store',
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
};
