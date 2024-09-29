import { motion } from "framer-motion";
import { useState } from "react";

export default function FlipCard() {
  console.log(motion);
  const [flip, setFlip] = useState(true);

  return (
    <div className="App">
      <motion.div
        style={{ width: "20rem", height: "10rem" }}
        transition={{ duration: 0.7 }}
        animate={{ rotateY: flip ? 0 : 180 }}
      >
        <motion.div
          transition={{ duration: 0.7 }}
          animate={{ rotateY: flip ? 0 : 180 }}
          className="Card"
        >
          <motion.div
            transition={{ duration: 0.7 }}
            animate={{ rotateY: flip ? 0 : 180 }}
            className="front"
          >
            Front Side
          </motion.div>
          <motion.div
            initial={{ rotateY: 180 }}
            animate={{ rotateY: flip ? 180 : 0 }}
            // style={{ display: flip ? "none" : "block" }}
            transition={{ duration: 0.7 }}
            className="back"
          >
            Back Side
          </motion.div>
          <button onClick={() => setFlip((prevState) => !prevState)}>
            Click me
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
