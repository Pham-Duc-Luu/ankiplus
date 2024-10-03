"use client";
import FlipCard from "@/components/ui/FlipCard";
import { useAppSelector } from "@/store/hooks";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import ReviewTimeOption from "./ReviewTimeOption";
import Proccess from "./LearningProgress";
import { useDispatch } from "react-redux";
import { startReview } from "@/store/collectionSlice";
import { initReviewCard } from "@/store/reviewCardSlice";

const Page = () => {
  const { collection, reviewCard } = useAppSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startReview());

    if (collection?.cards) dispatch(initReviewCard(collection.cards[0]));
  }, []);

  useEffect(() => {
    if (collection.cards)
      dispatch(initReviewCard(collection.cards[collection.reviewCard.index]));
  }, [collection.reviewCard]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="lg:w-[1200px] flex flex-col gap-8 items-center p-6">
        <div className=" w-full">{collection.name}</div>
        <Proccess></Proccess>
        <main className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={reviewCard._id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.15 }}
            >
              <FlipCard
                className="w-full"
                front={reviewCard.front}
                back={reviewCard.back}
              ></FlipCard>
            </motion.div>
          </AnimatePresence>
        </main>
        <></>
        <ReviewTimeOption className=""></ReviewTimeOption>
      </div>
    </div>
  );
};

export default Page;
