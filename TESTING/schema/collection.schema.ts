import mongoose, { Schema } from "mongoose";

export interface ICollection {
  name: string;
  _id: string;
  description: string;

  thumnail?: string;

  icon?: string;

  isPublic: boolean;

  language: string;

  cards?: string[];

  owner: string | Schema.Types.ObjectId; // Reference to the User schema
}

export const collectionSchema = new Schema<ICollection>(
  {
    name: { type: String, unique: true },

    description: String,
    thumnail: String,
    icon: String,
    isPublic: { type: Boolean, default: true },
    language: { type: String, default: "en" },
    cards: [{ type: Schema.Types.ObjectId, ref: "Flashcard" }],
    owner: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to the User schema
  },
  {
    timestamps: true,
  }
);

export const Collection = mongoose.model("collections", collectionSchema);
