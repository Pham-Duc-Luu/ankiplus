import mongoose from "mongoose";
import { User } from "./schema/user.schema";
import add_random_users from "./user/add-1000-random-user";

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  add_random_users();
}

main();
