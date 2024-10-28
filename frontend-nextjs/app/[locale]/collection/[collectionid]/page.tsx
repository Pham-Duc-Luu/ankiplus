"use client";
import { Button, Spinner } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import {
  MdNavigateBefore,
  MdNavigateNext,
  MdOutlineChangeCircle,
} from "react-icons/md";
import { PiCardsBold } from "react-icons/pi";
import { SiSpeedtest } from "react-icons/si";
import FlipCard from "@/components/ui/FlipCard";
import { AnimatePresence, motion } from "framer-motion";
import CardsTable from "./CardTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "@/i18n/routing";
import { useGetFLashCardsInCollectionQuery } from "@/store/graphql/COLLECTION.generated";
import { Card, setSelectedCard } from "@/store/collectionSlice";
import _ from "lodash";
const Page = () => {
  const t = useTranslations("collection.info");
  const t1 = useTranslations("review");
  const { collection } = useAppSelector((state) => state.persistedReducer);
  const dispatch = useAppDispatch();
  const route = useRouter();

  const { collectionid } = useParams<{ collectionid: string }>();
  const { data, isLoading } = useGetFLashCardsInCollectionQuery({
    ID: collectionid,
  });

  const next = () => {
    if (data?.getCollectionFlashCards.data) {
      const flashCards: Card[] = data.getCollectionFlashCards.data.map(
        (item) => ({ _id: item._id, front: item.front, back: item.back })
      );
      const currentIndex = _.findIndex(flashCards, function (o) {
        return o._id === collection.selectedCard?._id;
      });
      const nextIndex = currentIndex + 1;
      if (nextIndex >= 0 && currentIndex < flashCards.length - 1) {
        dispatch(setSelectedCard(flashCards[nextIndex]));
      }
    }
  };

  const prev = () => {
    if (data?.getCollectionFlashCards.data) {
      const flashCards: Card[] = data.getCollectionFlashCards.data.map(
        (item) => ({ _id: item._id, front: item.front, back: item.back })
      );
      const currentIndex = _.findIndex(flashCards, function (o) {
        return o._id === collection.selectedCard?._id;
      });
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0 && prevIndex < flashCards.length - 1) {
        dispatch(setSelectedCard(flashCards[prevIndex]));
      }
    }
  };
  useEffect(() => {
    if (data?.getCollectionFlashCards.data) {
      const card = data.getCollectionFlashCards.data[0];
      dispatch(setSelectedCard(card));
    }
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className=" flex justify-center m-6">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className=" w-full flex flex-col items-center p-6">
      <div className="lg:w-[1200px] w-full">
        <div className=" m-4 text-2xl font-bold">{collection?.name}</div>
        <div className="flex gap-4">
          <Button
            onClick={() => {
              route.push(`${collectionid}/learn`);
            }}
            startContent={<PiCardsBold size={28} />}
            size="lg"
          >
            {t("function.review")}
          </Button>
          <Button size="lg" startContent={<MdOutlineChangeCircle size={28} />}>
            {t("function.study")}
          </Button>
          <Button size="lg" startContent={<SiSpeedtest size={28} />}>
            {t("function.test")}
          </Button>
        </div>
        <main className=" my-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={collection.selectedCard?._id || 1}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.15 }}
            >
              {collection.selectedCard && (
                <FlipCard
                  front={collection.selectedCard.front}
                  back={collection.selectedCard.back}
                ></FlipCard>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <div className=" flex justify-center items-center gap-8">
          <Button
            isIconOnly
            onClick={() => {
              prev();
            }}
          >
            <MdNavigateBefore size={28} />
          </Button>
          <Button
            isIconOnly
            onClick={() => {
              next();
            }}
          >
            <MdNavigateNext size={28} />
          </Button>
        </div>
        <CardsTable
          cards={data?.getCollectionFlashCards.data.map((item) => ({
            _id: item._id,
            back: item.back,
            front: item.front,
          }))}
        ></CardsTable>
      </div>
    </div>
  );
};

export default Page;
