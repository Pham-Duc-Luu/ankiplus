import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Card {
  front: string;
  back: string;
  _id?: string | number;
}

interface Collection {
  id?: string | number;
  name?: string;
  description?: string;
  cards?: Card[];

  selectedCardIndex: number;
}
// Define the initial state using that type
const initialState: Collection = {
  id: 1,
  selectedCardIndex: 0,
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
  },
});

export const { selectCardByIndex } = collectionSlice.actions;

export default collectionSlice.reducer;
