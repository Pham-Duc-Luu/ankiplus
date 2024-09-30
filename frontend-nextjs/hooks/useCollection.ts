import { title } from "process";
import { create } from "zustand";
import { StoreApi, UseBoundStore } from "zustand";
import { createSelectors } from "./useCreateCollection";

export interface Card {
  front: string;
  back: string;
}

export interface ICollection {
  id?: string | number;
  name?: string;
  description?: string;
  cards?: Card[];
}
export interface ICollectionStore extends ICollection {
  name?: string;
  description?: string;
  cards?: Card[];
}

export interface ICollections {
  collections: ICollection[];
}

export interface ICollectionsStore extends ICollections {}
export const useColletionsStore = create<ICollectionsStore>((set) => ({
  collections: [
    { id: 1, title: "Example title 1" },
    { id: 2, title: "Example title 2" },
    { id: 3, title: "Example title 3" },
  ],
}));

export const useCollectionStore = create<ICollectionStore>((set) => ({
  title: "Example title 1",

  id: 1,
  cards: [
    { front: "Example front 1", back: "Example back 1" },
    { front: "Example front 2", back: "Example back 2" },
    { front: "Example front 3", back: "Example back 3" },
    { front: "Example front 4", back: "Example back 4" },
  ],
}));

export const useCollection = createSelectors(useCollectionStore);
