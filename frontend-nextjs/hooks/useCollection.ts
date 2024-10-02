import { title } from "process";
import { create } from "zustand";
import { StoreApi, UseBoundStore } from "zustand";
import { createSelectors } from "./useCreateCollection";
import { devtools } from "zustand/middleware";
export interface Card {
  front: string;
  back: string;
  _id?: string | number;
}

export interface ICollection {
  id?: string | number;
  name?: string;
  description?: string;
  cards?: Card[];
  selectedCard: Card;
  selectedCardIndex: number;
}
export interface ICollectionStore extends ICollection {
  name?: string;
  description?: string;
  cards?: Card[];
  selectCard: (card: Card) => void;
  selectCardByIndex: (index: number) => void;
}

export interface ICollections {
  collections: ICollection[];
}

export interface ICollectionsStore extends ICollections {}
// export const useColletionsStore = create<ICollectionsStore>((set) => ({
//   collections: [
//     { id: 1, title: "Example title 1" },
//     { id: 2, title: "Example title 2" },
//     { id: 3, title: "Example title 3" },
//   ],
// }));

export const useCollectionStore = create<ICollectionStore>()(
  devtools(
    (set) => ({
      title: "Example title 1",
      selectedCardIndex: 0,
      selectCardByIndex: (index) =>
        set((state) => ({
          ...state,
          selectedCardIndex: index,
          selectedCard: state.cards ? state.cards[index] : state.selectedCard,
        })),
      selectedCard: {
        _id: 1,
        front: "Example front 1",
        back: "Example back 1",
      },
      selectCard:
        /**
         * ! Do not use this method
         */
        (value) => set((state) => ({ ...state, selectedCard: value })),
      id: 1,
      cards: [
        { _id: 1, front: "Example front 1", back: "Example back 1" },
        { _id: 2, front: "Example front 2", back: "Example back 2" },
        { _id: 3, front: "Example front 3", back: "Example back 3" },
        { _id: 4, front: "Example front 4", back: "Example back 4" },
      ],
    }),
    { name: "collection" }
  )
);

export const useCollection = createSelectors(useCollectionStore);
