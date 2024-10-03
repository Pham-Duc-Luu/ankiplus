import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Card {
  front: string;
  back: string;
  _id?: string | number;
}

interface Collection {
  id?: string | number;
  name?: string;
  description?: string;
  cards?: Card[];
  reviewCard: {
    index: number;
    id: string | number;
  };
  selectedCardIndex: number;
}
// Define the initial state using that type
const initialState: Collection = {
  id: 1,
  selectedCardIndex: 0,
  reviewCard: { index: 0, id: 0 },
  name: "Example collection name",
  cards: [
    { _id: 1, front: "Example front 1", back: "Example back 1" },
    { _id: 2, front: "Example front 2", back: "Example back 2" },
    { _id: 3, front: "Example front 3", back: "Example back 3" },
    { _id: 4, front: "Example front 4", back: "Example back 4" },
  ],
};

export const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    selectCardByIndex: (state, action: PayloadAction<number>) => {
      state.selectedCardIndex = action.payload;
    },
    startReview: (state) => {
      if (state.cards) {
        state.reviewCard = { id: state.cards[0]._id, index: 0 };
      }
    },
    nextReview: (state) => {
      if (state.cards && state.reviewCard.index < state.cards.length - 1) {
        state.reviewCard = {
          id: state.cards[state.reviewCard.index + 1]._id,
          index: state.reviewCard.index + 1,
        };
      }
    },
  },
});

export const { nextReview, selectCardByIndex, startReview } =
  collectionSlice.actions;

export default collectionSlice.reducer;
