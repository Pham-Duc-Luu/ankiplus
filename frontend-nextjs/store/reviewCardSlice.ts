import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Card } from "./collectionSlice";

export interface IReviewCardOptions {
  type: number;
  message?: string;
}

export interface IReviewCard extends Card {
  selectedOption?: IReviewCardOptions;
  options: IReviewCardOptions[];
}

const initalReviewCard: IReviewCard = {
  _id: 1,
  front: "Review front",
  back: "Review back",

  options: [
    { type: 0, message: "again" },
    { type: 1, message: "1 day" },
    { type: 2, message: "2 days" },
    { type: 3, message: "4 days" },
  ],
  selectedOption: undefined,
};

export const reviewCardSlice = createSlice({
  name: "reviewCard",
  initialState: initalReviewCard,
  reducers: {
    initReviewCard: (state, { payload }: PayloadAction<Card>) => {
      state._id = payload._id;
      state.back = payload.back;
      state.front = payload.front;
    },
    selectOption: (state, action: PayloadAction<number>) => {
      const theOption = state.options.find(
        (option) => option.type === action.payload
      );

      if (theOption) {
        state.selectedOption = theOption;
      }
    },
  },
});

export const { selectOption, initReviewCard } = reviewCardSlice.actions;

export default reviewCardSlice.reducer;
