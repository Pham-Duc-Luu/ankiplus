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
export interface ReviewCard {
  _id: string | number;
  front: string;
  back: string;
  inCollection: string | number;
  SRS: {
    _id: string | number;
    nextReviewDate: string;

    interval: number;
    efactor: number;
  };
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
  reviewCard?: ReviewCard;
  numberOfStudiedCards?: number;
  reviewCardIndex?: number;
  listReviewCards?: ReviewCard[];
  selectedCard?: Card;
  displaying_reviewCard?: "front" | "back";
}
// Define the initial state using that type
const initialState: Collection = {
  _id: 1,
  reviewCardIndex: 0,
  name: "Example collection name",
  cards: [{ positionId: uuv4() }],
  numberOfStudiedCards: 0,
};

export const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
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
    setListReviewCard_card: (
      state,
      { payload }: PayloadAction<Collection["listReviewCards"]>
    ) => {
      state.listReviewCards = payload;
    },
    setCollection: (state, { payload }: PayloadAction<Partial<Collection>>) => {
      state.name = payload.name;
      state.description = payload.description;
      state._id = payload._id;
    },
    previousReviewCard: (state) => {
      // IMPORTANT : back to the previous review card
      state?.reviewCardIndex &&
        (state.reviewCardIndex = state.reviewCardIndex - 1);

      state?.listReviewCards &&
        (state.reviewCard =
          state.listReviewCards[state.listReviewCards.length - 1 || 0]);
    },
    reviewAgain: (state) => {
      state.displaying_reviewCard = "front";

      if (state.listReviewCards) {
        const itemToMove = _.pullAt(
          state.listReviewCards,
          state.reviewCardIndex
        );

        state.listReviewCards.push(itemToMove[0]);
        state.reviewCard = state.listReviewCards[state.reviewCardIndex];
      }
    },
    startReview: (state) => {
      // Important : start review only when review card exists
      state.reviewCardIndex = 0;

      // Important : get the first review card from the listReviewCards

      state?.listReviewCards &&
        (state.reviewCard = state.listReviewCards[state.reviewCardIndex]);
      state.displaying_reviewCard = "front";
    },
    display_back_reivewCard: (state) => {
      state.displaying_reviewCard = "back";
    },
    display_front_reivewCard: (state) => {
      state.displaying_reviewCard = "front";
    },
    nextReview: (state) => {
      state.displaying_reviewCard = "front";

      state.reviewCardIndex = state.reviewCardIndex + 1;
      state?.listReviewCards &&
        (state.reviewCard = state.listReviewCards[state.reviewCardIndex || 0]);
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

  extraReducers(builder) {},
});

export const {
  nextReview,
  setSelectedCard,
  startReview,
  insert_card,
  append_card,
  previousReviewCard,
  setListReviewCard_card,
  display_back_reivewCard,
  display_front_reivewCard,
  reviewAgain,
  remove_card,
  updateCard_Card,
  setFlashCards_card,
} = collectionSlice.actions;

export const collectionSliceAction = collectionSlice.actions;
export default collectionSlice.reducer;
