"use client";
import { useCollection } from "@/hooks/useCollection";
import { Button, CardFooter } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  MdNavigateBefore,
  MdNavigateNext,
  MdOutlineChangeCircle,
} from "react-icons/md";
import { PiCardsBold } from "react-icons/pi";
import { SiSpeedtest } from "react-icons/si";

import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import FlipCard from "@/components/ui/FlipCard";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import CardsTable from "./CardTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCardByIndex } from "@/store/collectionSlice";
import { useRouter } from "@/i18n/routing";

const page = () => {
  const t = useTranslations("collection.info");
  const { collection } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const route = useRouter();
  // * if there is no flash card then direct to error page
  if (!collection?.cards) {
    return <>Error</>;
  }

  const [tabs, setTabs] = useState(collection.cards);

  const { collectionid } = useParams<{ collectionid: string }>();
  const next = () => {
    dispatch(
      selectCardByIndex(
        collection.selectedCardIndex >= collection?.cards.length - 1
          ? 0
          : collection.selectedCardIndex + 1
      )
    );
  };

  const prev = () => {
    dispatch(
      selectCardByIndex(
        collection.selectedCardIndex <= 0
          ? collection.cards?.length - 1
          : collection.selectedCardIndex - 1
      )
    );
  };

  return (
    <div className=" w-full flex flex-col items-center p-6">
      <div className="lg:w-[1200px] w-full">
        <div className=" m-4 text-2xl font-bold">{collection?.title}</div>
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
              key={collection.selectedCardIndex}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.15 }}
            >
              <FlipCard
                front={collection?.cards[collection.selectedCardIndex].front}
                back={collection?.cards[collection.selectedCardIndex].back}
              ></FlipCard>
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
        <CardsTable></CardsTable>
      </div>
    </div>
  );
};

export default page;
