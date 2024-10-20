import { flattenDiagnosticMessageText } from "typescript";
import { Collection, collectionSchema } from "../schema/collection.schema";
import { FlashCard, type IFlashCard } from "../schema/flashcard.schema";
import { User } from "../schema/user.schema";
import { v4 as uuidv4 } from "uuid";
import Chance from "chance";
import { SRS } from "../schema/SRS";
import dayjs from "dayjs";

export default async function addFlashCard() {
  console.log("start");
  const total_collections = await Collection.countDocuments();

  let colletionBatch = 1;
  let collectionLimit = 100;
  while (1) {
    const collections = await Collection.find()
      .limit(collectionLimit)
      .skip((colletionBatch - 1) * collectionLimit)
      .select("_id name");

    for (let index = 0; index < collections.length; index++) {
      const collection = collections[index];

      // * random amount of collection that needs to be added
      // console.log({ curr: userBatch * 10, total: total_user_num });

      const numberOfFlashCard = Chance().integer({ min: 20, max: 30 });

      let newFlashCardList = [];

      for (let j = 0; j < numberOfFlashCard; j++) {
        newFlashCardList.push(
          new FlashCard({
            front: Chance().paragraph(),
            back: Chance().paragraph(),
            inCollection: collection._id.toString(),
          })
        );
      }
      const newFlashCard = await FlashCard.create(newFlashCardList);

      collection.cards = newFlashCard.map((card) => card._id.toString());

      console.log(collections[index]);

      console.log(`${colletionBatch}/${total_collections}`);
      await collection.save();
      newFlashCardList.length = 0;
    }

    colletionBatch++;
    if (!collections || collections.length === 0) {
      break;
    }
  }
}
