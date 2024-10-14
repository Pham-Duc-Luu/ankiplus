import { v4 as uuidv4 } from "uuid";
import { Collection, type ICollection } from "../schema/collection.schema";
import { User } from "../schema/user.schema";
import dayjs from "dayjs";
import quotes from "../database/quotes.json";

export default async function add_randoms_collections() {
  /**
   * collection name : collection_ + 6 random digits
   * each user will have random numbers of collections from 5 - 30
   */

  const total_user_num = 100;
  console.log("start");

  for (let index = 0; index < total_user_num; index++) {
    const startDate = dayjs("2023-01-01"); // First day of 2024
    const endDate = dayjs("2024-10-14");
    console.log(`${((index / total_user_num) * 100).toFixed(2)}%`);

    let currentDay = startDate;

    const user = await User.findOne({
      email: `example_user_${index}@example.com`,
    });

    while (currentDay.isBefore(endDate) || currentDay.isSame(endDate)) {
      // * random amount of collection that needs to be added

      const randomAmount = Math.floor(Math.random() * 20) + 5;

      if (user) {
        const collections: ICollection[] = [];

        for (let j = 0; j < randomAmount; j++) {
          collections.push(
            new Collection({
              name: `collection_${uuidv4()}`,
              description: quotes[randomAmount].quote,
              owner: user.id,
              createdAt: currentDay.toDate(),
            })
          );
        }
        try {
          await Collection.create(collections);

          // if (!user.collections) {
          //   user.collections = collections.map((item) => item._id);
          // } else {
          //   user.collections.concat(collections.map((item) => item._id));
          // }
          collections.forEach((item) => {
            user?.collections?.push(item._id);
          });
          await user?.save();
        } catch (error) {
          console.log(error);
        }
        collections.length = 0;
      }

      currentDay = currentDay.add(1, "day"); // Move to the next day
    }
  }
}
