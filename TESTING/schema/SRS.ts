import mongoose, { Schema } from "mongoose";

export interface ISRS {
  nextReviewDate: Date;

  interval: number;

  efactor: number;
}

export const SRSSchema = new Schema<ISRS>(
  {
    nextReviewDate: { type: Date, default: Date.now },

    interval: { type: Number, default: 0 },

    efactor: { type: Number, default: 2.5 },
  },
  {
    timestamps: true,
  }
);

export const SRS = mongoose.model("SRS", SRSSchema);
