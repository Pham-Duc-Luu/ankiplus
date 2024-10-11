import { flattenDiagnosticMessageText } from "typescript";
import { Collection, collectionSchema } from "../schema/collection.schema";
import { FlashCard, type IFlashCard } from "../schema/flashcard.schema";
import { User } from "../schema/user.schema";
import { v4 as uuidv4 } from "uuid";

export default async function addFlashCard() {
  const total_user_num = 1000;

  for (let index = 0; index < total_user_num; index++) {
    const randomAmount = Math.floor(Math.random() * 20) + 5;

    const user = await User.findOne({
      email: `example_user_${index}@example.com`,
    }).populate({ path: "collections", model: Collection });

    for (let j = 0; j < user?.collections?.length; j++) {
      const collection = await Collection.findById(user?.collections[j]._id);

      collection.owner = user?._id;

      const flashCards: IFlashCard[] = [];

      const randomAmount = Math.floor(Math.random() * 20) + 10;
      for (let k = 0; k < randomAmount; k++) {
        flashCards.push(
          new FlashCard({
            front: `front-${uuidv4()}`,
            back: `back-${uuidv4()}`,
          })
        );
      }

      await FlashCard.create(flashCards);

      collection.cards = flashCards.map((card) => card._id);

      await collection?.save();
      flashCards.length = 0;
    }
  }
}
