// getting-started.js
import mongoose from "mongoose";
// getting-started.js

main()
  .then(() => {
    console.info("connected to Mongoose");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
