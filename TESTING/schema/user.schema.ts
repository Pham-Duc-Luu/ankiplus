import mongoose from "mongoose";
const { Schema } = mongoose;
import { Collection, type ICollection } from "./collection.schema";
export interface IUser {
  email: string;

  password: string;
  username: string;
  collections?: (string | ICollection)[];
}

export const userSChema = new Schema<IUser>({
  email: { type: String, unique: true },

  password: String,
  collections: { type: [{ type: Schema.Types.ObjectId, ref: "Collection" }] },
  username: String,
});

export const User = mongoose.model("User", userSChema);
