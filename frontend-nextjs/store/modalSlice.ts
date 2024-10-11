import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IModel {
  moderHeader?: string;
  moderContent?: string;
  isOpen: boolean;
  backdrops?: "opaque" | "blur" | "transparent";
}

const initialState: IModel = {
  moderHeader: "This function is being developed",
  isOpen: false,
  backdrops: "blur",
};

export const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    handleOpen: (state) => {
      state.isOpen = true;
    },
    handleClose: (state) => {
      state.isOpen = false;
    },
  },
});

export const { handleOpen, handleClose } = modelSlice.actions;

export default modelSlice.reducer;
