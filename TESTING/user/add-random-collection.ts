import { v4 as uuidv4 } from "uuid";
import {
  Collection,
  collectionSchema,
  type ICollection,
} from "../schema/collection.schema";
import { User } from "../schema/user.schema";
import dayjs from "dayjs";
import quotes from "../database/quotes.json";
import type { IFlashCard } from "../schema/flashcard.schema";
import Chance from "chance";
export default async function add_randoms_collections() {
  /**
   * collection name : collection_ + 6 random digits
   * each user will have random numbers of collections from 5 - 30
   */

  console.log("start");
  const total_user_num = await User.countDocuments();
  let userBatch = 1;
  while (1) {
    const users = await User.find()
      .limit(  10)
      .skip((userBatch - 1) * 10);

    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      const startDate = dayjs("2023-01-01"); // First day of 2024
      const endDate = dayjs();
      let currentDay = startDate;
      while (currentDay.isBefore(endDate) || currentDay.isSame(endDate)) {
        // * random amount of collection that needs to be added
        // console.log({ curr: userBatch * 10, total: total_user_num });

        const numberOfCollections = Chance().integer({ min: 1, max: 3 });

        for (let j = 0; j < numberOfCollections; j++) {
          const newCollection = await Collection.create({
            name: Chance().address(),
            description: Chance().paragraph(),
            owner: user.id,
            createdAt: currentDay.toDate(),
          });
          user.collections?.push(newCollection.id);
        }

        currentDay = currentDay.add(1, "day"); // Move to the next day
      }

      console.log(user);

      await user.save();
    }

    // users.forEach(async (user) => {
    //   const startDate = dayjs("2023-01-01"); // First day of 2024
    //   const endDate = dayjs();
    //   let currentDay = startDate;
    //   while (currentDay.isBefore(endDate) || currentDay.isSame(endDate)) {
    //     // * random amount of collection that needs to be added
    //     // console.log({ curr: userBatch * 10, total: total_user_num });

    //     const numberOfCollections = Chance().integer({ min: 2, max: 6 });

    //     for (let j = 0; j < numberOfCollections; j++) {
    //       const newCollection = await Collection.create({
    //         name: Chance().address(),
    //         description: Chance().paragraph(),
    //         owner: user.id,
    //         createdAt: currentDay.toDate(),
    //       });
    //       user.collections?.concat(newCollection.id);
    //     }

    //     currentDay = currentDay.add(1, "day"); // Move to the next day
    //   }

    //   console.log(user);

    //   await user.save();
    // });

    userBatch++;
    if (!users || users.length === 0) {
      break;
    }
  }
}
