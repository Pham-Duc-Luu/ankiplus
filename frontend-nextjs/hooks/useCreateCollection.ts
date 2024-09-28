import { title } from 'process';
import { create } from 'zustand';
import { StoreApi, UseBoundStore } from 'zustand';

export type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export interface Card {
  front: string;
  back: string;
}

export interface ICreateCollectionState {
  title?: string;
  description?: string;
  cards?: Card[];
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  addCard: (value: Card[]) => void;
  createCollection: () => void;
}

export const useCreateCollectionStore = create<ICreateCollectionState>(
  (set) => ({
    title: '',
    setTitle: (value) => set((state) => ({ ...state, title: value })),
    setDescription: (value) =>
      set((state) => ({ ...state, description: value })),
    addCard: (value) => set((state) => ({ ...state, cards: value })),
    createCollection: () =>
      set((state) => {
        console.log(state.cards);

        return state;
      }),
  })
);

export const useCreateCollection = createSelectors(useCreateCollectionStore);
