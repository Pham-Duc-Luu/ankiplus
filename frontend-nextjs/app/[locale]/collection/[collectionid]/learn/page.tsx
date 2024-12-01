"use client";
import FlipCard from "@/components/ui/FlipCard";
import { useAppSelector } from "@/store/hooks";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useLayoutEffect } from "react";
import ReviewTimeOption from "./ReviewTimeOption";
import { useDispatch } from "react-redux";
import {
  display_back_reivewCard,
  setListReviewCard_card,
  startReview,
} from "@/store/collectionSlice";
import { initReviewCard } from "@/store/reviewCardSlice";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Button, Kbd, Tooltip } from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useGetFLashCardsInCollectionQuery } from "@/store/graphql/COLLECTION.modify";
import {
  useGetCollectionDetailQuery,
  useGetNeedToReviewFlashCardsQuery,
} from "@/store/graphql/COLLECTION.generated";
import LoadingSpinnerReplace from "@/components/LoadingSpinnerReplace";
import ReviewNavbar from "@/components/ReviewNavbar";

const Page = () => {
  const { collection } = useAppSelector((state) => state.persistedReducer);
  const dispatch = useDispatch();
  const { collectionid } = useParams<{ collectionid: string }>();

  // IMPORTANT : handle query need to review flashcards in collection
  const useGetNeedToReviewFlashCardsQueryResult =
    useGetNeedToReviewFlashCardsQuery({
      ID: collectionid,
    });

  // IMPORTANT : handle collection detail
  const useGetCollectionDetailQueryResult = useGetCollectionDetailQuery({
    ID: collectionid,
  });

  // IMPORTANT : update the list of review cards only once time when component is rendered
  useEffect(() => {
    if (
      useGetNeedToReviewFlashCardsQueryResult.data?.getNeedToReviewFlashCards
        .data
    ) {
      dispatch(
        setListReviewCard_card(
          useGetNeedToReviewFlashCardsQueryResult.data
            ?.getNeedToReviewFlashCards.data
        )
      );

      dispatch(startReview());
    }
  }, [useGetNeedToReviewFlashCardsQueryResult.data]);

  const t = useTranslations("review");

  const route = useRouter();

  /**
   * triggers when all of the cards have been studied
   */
  const finish = () => {
    route.push("finish");
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        dispatch(dispatch(display_back_reivewCard()));
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // IMPORTANT : member to remove all of the review cards before rendering
  useEffect(() => {
    if (collection.reviewCardIndex === collection.listReviewCards?.length) {
      dispatch(setListReviewCard_card());
      finish();
    }
  }, [collection, useGetNeedToReviewFlashCardsQueryResult]);

  if (useGetNeedToReviewFlashCardsQueryResult.isLoading) {
    return <LoadingSpinnerReplace></LoadingSpinnerReplace>;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="lg:w-[1200px] flex flex-col gap-8 items-center p-6">
        <div className=" w-full">
          <ReviewNavbar></ReviewNavbar>
        </div>
        {/* <Proccess></Proccess> */}
        <main className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={JSON.stringify(collection.reviewCard)}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FlipCard
                isFlipByPress={false}
                onPress={() => dispatch(display_back_reivewCard())}
                displaySide={collection.displaying_reviewCard}
                className="w-full"
                front={collection.reviewCard?.front}
                back={collection.reviewCard?.back}
              ></FlipCard>
            </motion.div>
          </AnimatePresence>
        </main>
        {collection.displaying_reviewCard === "front" && (
          <Tooltip content={<Kbd>{"Space"}</Kbd>}>
            <Button onClick={() => dispatch(display_back_reivewCard())}>
              {t("function.tab to show")}
            </Button>
          </Tooltip>
        )}
        {collection.displaying_reviewCard === "back" && (
          <ReviewTimeOption className=""></ReviewTimeOption>
        )}
      </div>
      {/* <Button onClick={() => finish()}>{t("function.finish")}</Button> */}
    </div>
  );
};

export default Page;
