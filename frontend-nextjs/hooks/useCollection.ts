import { title } from "process";
import { create } from "zustand";
import { StoreApi, UseBoundStore } from "zustand";
import { createSelectors } from "./useCreateCollection";

export interface Card {
  front: string;
  back: string;
}

export interface ICollection {
  id?: string;
  title?: string;
  description?: string;
  cards?: Card[];
}
export interface ICollectionStore {
  title?: string;
  description?: string;
  cards?: Card[];
}

export const useCollectionStore = create<ICollectionStore>((set) => ({
  title: "Example title",
  cards: [
    { front: "Example front 1", back: "Example back 1" },
    { front: "Example front 2", back: "Example back 2" },
    { front: "Example front 3", back: "Example back 3" },
    { front: "Example front 4", back: "Example back 4" },
  ],
}));

export const useCollection = createSelectors(useCollectionStore);
