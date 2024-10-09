import { User, userSChema, type IUser } from "../schema/user.schema";
import * as bcrypt from "bcrypt";
async function add_random_users() {
  /**
   * generate 1000 random users
   */

  const batch_size = 10;
  const total_amount = 1000;
  const users: IUser[] = [];

  for (let i = 0; i < 1000; i++) {
    console.log(i);

    users.push({
      email: `random_user_${i}@example.com`,
      password: await bcrypt.hash(`random_user_${i}@example.com`, 10),
      username: `random_user_${i}`,
    });
  }

  console.log(users, users.length);
}

export default add_random_users;
