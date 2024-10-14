import { User, userSChema, type IUser } from "../schema/user.schema";
import * as bcrypt from "bcrypt";
async function add_random_users() {
  /**
   * generate 1000 random users
   */

  const batch_size = 10;
  const batch_size_count = 0;
  let index = 0;
  const total_amount = 100;
  const users: IUser[] = [];
  const list: number[] = [];

  while (index < total_amount) {
    for (let i = 0; i < batch_size; i++) {
      users.push({
        email: `example_user_${index}@example.com`,
        password: await bcrypt.hash(`example_user_${index}`, 10),
        username: `example_user_${index}`,
      });
      index++;
    }

    User.create(users);
    users.length = 0;

    console.log(`${(index / total_amount).toFixed(2)}%`);
  }
}

export default add_random_users;
