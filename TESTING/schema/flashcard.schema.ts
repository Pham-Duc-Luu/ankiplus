import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IFlashCard {
  front: any;
  back: any;
  inCollection: String;
}

export const flashCardSchema = new Schema<IFlashCard>({
  front: { type: Schema.Types.Mixed },

  back: { type: Schema.Types.Mixed },

  inCollection: Schema.Types.ObjectId,
});

export const FlashCard = mongoose.model("Flashcard", flashCardSchema);
