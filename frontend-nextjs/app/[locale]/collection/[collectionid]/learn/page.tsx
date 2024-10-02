"use client";
import FlipCard from "@/components/ui/FlipCard";
import { useAppSelector } from "@/store/hooks";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const Page = () => {
  const { collection } = useAppSelector((state) => state);
  return (
    <div className="w-full flex flex-col items-center p-6">
      <main className=" my-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={collection.selectedCardIndex}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.15 }}
          >
            <FlipCard
              className=" h-[400px]"
              front={collection?.cards[collection.selectedCardIndex].front}
              back={collection?.cards[collection.selectedCardIndex].back}
            ></FlipCard>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Page;
