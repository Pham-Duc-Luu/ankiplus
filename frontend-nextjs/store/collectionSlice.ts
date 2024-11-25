import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GraphQLClient } from "graphql-request";
import { gql } from "@urql/core";
import { v4 as uuv4 } from "uuid";
import * as _ from "lodash";
export interface Card {
  front: string;
  back: string;
  _id?: string | number;
}

// * this is for edit cards
export interface IReoderItemCard extends Partial<Card> {
  positionId: string;
}
interface Collection {
  _id?: string | number;
  name?: string;
  description?: string;
  cards?: IReoderItemCard[];
  reviewCard: {
    index: number;
    _id: string | number;
  };
  selectedCard?: Card;
}
// Define the initial state using that type
const initialState: Collection = {
  _id: 1,
  reviewCard: { index: 0, _id: 0 },
  name: "Example collection name",
  cards: [{ positionId: uuv4() }],
};

export const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    setCollection: () => {},
    setSelectedCard: (
      state,
      { payload }: PayloadAction<Collection["selectedCard"]>
    ) => {
      state.selectedCard = payload;
    },
    setFlashCards_card: (
      state,
      { payload }: PayloadAction<Collection["cards"]>
    ) => {
      state.cards = payload;
    },
    setCollection: (state, { payload }: PayloadAction<Partial<Collection>>) => {
      state.name = payload.name;
      state.description = payload.description;
      state._id = payload._id;
    },
    startReview: (state) => {
      if (state.cards) {
        state.reviewCard = { _id: state.cards[0]._id || 0, index: 0 };
      }
    },
    nextReview: (state) => {
      if (state.cards && state.reviewCard.index < state.cards.length - 1) {
        state.reviewCard = {
          _id: state.cards[state.reviewCard.index + 1]._id || 0,
          index: state.reviewCard.index + 1,
        };
      }
    },
    insert_card: (state, payload?: PayloadAction<Collection["cards"]>) => {
      const need_to_unshift_cards = payload?.payload
        ? payload.payload
        : [{ positionId: uuv4() }];

      need_to_unshift_cards.reverse().forEach((card) => {
        state.cards?.unshift(card);
      });
    },
    append_card: (state, payload: PayloadAction<Collection["cards"]>) => {
      const need_to_unshift_cards = payload?.payload
        ? payload.payload
        : [{ positionId: uuv4() }];
      need_to_unshift_cards.forEach((card) => {
        state.cards?.push(card);
      });
    },
    // ! remove a flash cards using postion id
    remove_card: (state, { payload }: PayloadAction<string>) => {
      state.cards &&
        _.remove(state.cards, function (o) {
          return o.positionId === payload;
        });
    },
    updateCard_Card: (
      state,
      {
        payload,
      }: PayloadAction<{
        positionId: string;
        front?: string;
        back?: string;
        _id?: string;
      }>
    ) => {
      if (state.cards) {
        const { positionId, front, back, _id } = payload;
        const index = _.findIndex(state?.cards, function (o) {
          return o.positionId === payload.positionId;
        });
        state.cards[index] = { positionId, front, back, _id };
      }
    },
  },
});

export const {
  nextReview,
  setSelectedCard,
  startReview,
  insert_card,
  append_card,
  remove_card,
  updateCard_Card,
  setFlashCards_card,
} = collectionSlice.actions;

export const collectionSliceAction = collectionSlice.actions;
export default collectionSlice.reducer;
