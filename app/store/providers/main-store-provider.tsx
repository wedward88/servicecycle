'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import { createMainStore, MainStoreInterface } from '../store';

export type MainStoreApi = ReturnType<typeof createMainStore>;

export const MainStoreContext = createContext<MainStoreApi | null>(
  null
);

export interface MainStoreProviderProps {
  children: React.ReactNode;
}

export const MainStoreProvider = ({
  children,
}: MainStoreProviderProps) => {
  const storeRef = useRef<MainStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createMainStore();
  }

  return (
    <MainStoreContext.Provider value={storeRef.current}>
      {children}
    </MainStoreContext.Provider>
  );
};

export const useMainStore = <T,>(
  selector: (store: MainStoreInterface) => T
): T => {
  const mainStoreContext = useContext(MainStoreContext);

  if (!mainStoreContext) {
    throw new Error(
      `useCounterStore must be used within CounterStoreProvider`
    );
  }

  return useStore(mainStoreContext, selector);
};
