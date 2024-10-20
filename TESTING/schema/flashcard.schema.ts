import mongoose from "mongoose";
import { SRS, SRSSchema, type ISRS } from "./SRS";
const { Schema } = mongoose;

export interface IFlashCard {
  front: any;
  back: any;
  SRS: ISRS;
  inCollection: String;
  // _id?: string;
}

export const flashCardSchema = new Schema<IFlashCard>(
  {
    front: { type: Schema.Types.Mixed },

    back: { type: Schema.Types.Mixed },

    inCollection: Schema.Types.ObjectId,

    SRS: { type: SRSSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const FlashCard = mongoose.model("Flashcard", flashCardSchema);
