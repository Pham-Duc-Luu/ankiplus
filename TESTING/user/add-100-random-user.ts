import { User, userSChema, type IUser } from "../schema/user.schema";
import * as bcrypt from "bcrypt";
import Chance from "chance";

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
      const name = Chance().name({ middle: true });
      users.push({
        email: `${name.replace(/ /g, "_")}_${i}@example.com`,
        password: await bcrypt.hash(`${name.replace(/ /g, "_")}_${i}@`, 10),
        username: `${name.charAt(0).toUpperCase() + name.slice(1)}`,
      });
      index++;
    }

    User.create(users);
    users.length = 0;

    console.log(`${(index / total_amount).toFixed(2)}%`);
  }
}

export default add_random_users;
