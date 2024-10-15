import mongoose from "mongoose";
import { User } from "./schema/user.schema";
import add_random_users from "./user/add-100-random-user";
import add_randoms_collections from "./user/add-random-collection";
import addFlashCard from "./user/add-flashcard";
import addDescriptionCollection from "./user/add-description-collections";
import { getSvgFileNames } from "./folder/readingSvgFile";

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    // await add_random_users();
    // await add_randoms_collections();

    await addFlashCard();
  } catch (error) {
    console.log(error?.stack);
  }

  // await addFlashCard();

  // await addDescriptionCollection();
  // getSvgFileNames();
}

await main();
process.exit();
