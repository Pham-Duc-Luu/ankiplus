import mongoose from "mongoose";
import { User } from "./schema/user.schema";
import add_random_users from "./user/add-1000-random-user";
import add_randoms_collections from "./user/add-random-collection";
import addFlashCard from "./user/add-flashcard";
import addDescriptionCollection from "./user/add-description-collections";
import { getSvgFileNames } from "./folder/readingSvgFile";

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  // add_random_users();
  // await add_randoms_collections();

  // await addFlashCard();

  // await addDescriptionCollection();
  getSvgFileNames();
}

await main();
process.exit();
