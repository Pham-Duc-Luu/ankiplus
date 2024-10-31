import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CollectionDto, IFlashCardDto } from "./dto/dto.type";
import { v4 } from "uuid";
import { IReorderItemCard } from "@/app/[locale]/create/collection/page";
import _ from "lodash";
export interface INewCollection
  extends Partial<
    Pick<
      CollectionDto,
      "description" | "icon" | "isPublic" | "language" | "name" | "thumnail"
    >
  > {
  flashCards: IReorderItemCard[];
}

export interface ICreateCollectionSliceType {
  newCollection: INewCollection;
}

const initialState: ICreateCollectionSliceType = {
  newCollection: {
    name: "",
    description: "",
    flashCards: [{ positionId: v4() }, { positionId: v4() }],
  },
};

export const createCollectionSlice = createSlice({
  initialState,
  name: "createCollection",
  reducers: {
    addFlashCard: (
      state,
      payload: PayloadAction<Partial<Pick<IFlashCardDto, "back" | "front">>>
    ) => {
      state.newCollection.flashCards.push({
        ...payload.payload,
        positionId: v4(),
      });
    },
    setFlashCards: (
      state,
      payload: PayloadAction<INewCollection["flashCards"]>
    ) => {
      state.newCollection.flashCards = payload.payload;
    },
    addCollectionInformation: (
      state,
      payload: PayloadAction<
        Partial<
          Pick<
            CollectionDto,
            | "description"
            | "icon"
            | "isPublic"
            | "language"
            | "name"
            | "thumnail"
          >
        >
      >
    ) => {
      state.newCollection = { ...state.newCollection, ...payload.payload };
    },
    updateFlashCard: (state, payload: PayloadAction<IReorderItemCard>) => {
      const index = _.findIndex(state.newCollection.flashCards, function (o) {
        return o.positionId === payload.payload.positionId;
      });

      if (index !== -1) {
        state.newCollection.flashCards[index] = payload.payload;
      }
    },
    removeFlashCards: (state, payload: PayloadAction<IReorderItemCard>) => {
      _.remove(state.newCollection.flashCards, function (o) {
        return _.isEqual(payload.payload, o);
      });
    },
  },
});

export const {
  addFlashCard,
  addCollectionInformation,
  setFlashCards,
  updateFlashCard,
  removeFlashCards,
} = createCollectionSlice.actions;
export default createCollectionSlice.reducer;
