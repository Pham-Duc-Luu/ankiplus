import { flattenDiagnosticMessageText } from "typescript";
import { Collection, collectionSchema } from "../schema/collection.schema";
import { FlashCard, type IFlashCard } from "../schema/flashcard.schema";
import { User } from "../schema/user.schema";
import { v4 as uuidv4 } from "uuid";

export default async function addFlashCard() {
  const total_user_num = 1000;
  for (let index = 86; index < total_user_num; index++) {
    const randomAmount = Math.floor(Math.random() * 20) + 5;

    console.log(
      `user index : ${index} / ${total_user_num}  => ${(
        (100 * index) %
        total_user_num
      ).toFixed(4)}%`
    );

    const user = await User.findOne({
      email: `example_user_${index}@example.com`,
    }).populate({ path: "collections", model: Collection });

    if (user?.collections) {
      for (let j = 0; j < user?.collections?.length; j++) {
        const collection = await Collection.findById(user?.collections[j]?._id);
        if (!collection) {
          return;
        }

        const flashCards: IFlashCard[] = [];
        const randomAmount = Math.floor(Math.random() * 20) + 10;
        for (let k = 0; k < randomAmount; k++) {
          flashCards.push(
            new FlashCard({
              front: `front-${uuidv4()}`,
              back: `back-${uuidv4()}`,
              inCollection: collection._id,
            })
          );
        }

        await FlashCard.create(flashCards);
        const cardIds = flashCards.map((card) => card._id) as string[];
        collection.cards = cardIds;
        await collection?.save();
        flashCards.length = 0;
      }
    }
  }

  // const index = 0;
  // const count = await Collection.countDocuments();
  // console.log(count);

  // while (index * 30 < count) {
  //   console.log(
  //     `process: ${index * 30}/${count} = ${((index * 30) / count).toFixed(2)}%`
  //   );

  //   const collections = await Collection.find()
  //     .sort({ createdAt: -1 })
  //     .limit(30)
  //     .skip(index * 30);

  //   collections.forEach(async (collection) => {
  //     const flashCards: IFlashCard[] = [];
  //     const randomAmount = Math.floor(Math.random() * 20) + 10;
  //     for (let k = 0; k < randomAmount; k++) {
  //       flashCards.push(
  //         new FlashCard({
  //           front: `front-${uuidv4()}`,
  //           back: `back-${uuidv4()}`,
  //           inCollection: collection._id,
  //         })
  //       );
  //     }

  //     await FlashCard.create(flashCards);
  //     const cardIds = flashCards.map((card) => card._id) as string[];
  //     collection.cards = cardIds;
  //     await collection?.save();
  //     flashCards.length = 0;
  //   });
  // }
}
