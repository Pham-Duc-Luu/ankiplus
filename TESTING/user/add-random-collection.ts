import { v4 as uuidv4 } from "uuid";
import { Collection, type ICollection } from "../schema/collection.schema";
import { User } from "../schema/user.schema";
export default async function add_randoms_collections() {
  /**
   * collection name : collection_ + 6 random digits
   * each user will have random numbers of collections from 5 - 30
   */

  const total_user_num = 1000;

  for (let index = 0; index < total_user_num; index++) {
    const randomAmount = Math.floor(Math.random() * 20) + 5;

    const user = await User.findOne({
      email: `example_user_${index}@example.com`,
    });

    const collections: ICollection[] = [];

    for (let j = 0; j < randomAmount; j++) {
      collections.push(new Collection({ name: `collection_${uuidv4()}` }));
    }
    await Collection.create(collections);
    user.collections = collections.map((item) => item._id);
    await user?.save();
    collections.length = 0;
  }
}
