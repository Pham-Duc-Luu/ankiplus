import quotes from "../database/quotes.json";
import { Collection } from "../schema/collection.schema";
import { User } from "../schema/user.schema";
export default async function addDescriptionCollection() {
  const total_user_num = 100;

  for (let index = 0; index < total_user_num; index++) {
    const user = await User.findOne({
      email: `example_user_${index}@example.com`,
    }).populate({ path: "collections", model: Collection });

    for (let j = 0; j < user?.collections?.length; j++) {
      const collection = await Collection.findById(user?.collections[j]._id);

      const randomIndex = Math.round(Math.random() * (quotes.length - 30)) + 1;
      collection.description = quotes[randomIndex].quote;

      await collection?.save();
    }
  }
}
