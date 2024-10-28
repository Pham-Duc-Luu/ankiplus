import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GraphQLClient } from "graphql-request";
import { gql } from "@urql/core";

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
  selectedCard?: Card;
}
// Define the initial state using that type
const initialState: Collection = {
  id: 1,
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
    setSelectedCard: (state, { payload }: PayloadAction<Card>) => {
      state.selectedCard = payload;
    },
    setFlashCards: (state, { payload }: PayloadAction<Card[]>) => {
      state.cards = payload;
    },
    setCollection: (state, { payload }: PayloadAction<Partial<Collection>>) => {
      state.name = payload.name;
      state.description = payload.description;
      state.id = payload.id;
    },
    startReview: (state) => {
      if (state.cards) {
        state.reviewCard = { id: state.cards[0]._id || 0, index: 0 };
      }
    },
    nextReview: (state) => {
      if (state.cards && state.reviewCard.index < state.cards.length - 1) {
        state.reviewCard = {
          id: state.cards[state.reviewCard.index + 1]._id || 0,
          index: state.reviewCard.index + 1,
        };
      }
    },
  },
});

export const {
  nextReview,
  setSelectedCard,
  startReview,
  setCollection,
  setFlashCards,
} = collectionSlice.actions;

export default collectionSlice.reducer;
