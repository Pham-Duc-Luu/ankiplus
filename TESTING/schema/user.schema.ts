import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IUser {
  email: string;

  password: string;
  username: string;
}

export const userSChema = new Schema<IUser>({
  email: String,

  password: String,
  username: String,
});

export const User = mongoose.model("User", userSChema);
