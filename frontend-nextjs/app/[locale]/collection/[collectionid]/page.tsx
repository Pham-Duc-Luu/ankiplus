"use client";
import { Button, Divider, Spinner } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import {
  MdNavigateBefore,
  MdNavigateNext,
  MdOutlineChangeCircle,
} from "react-icons/md";
import { TbCards, TbTableImport } from "react-icons/tb";
import { PiCardsBold } from "react-icons/pi";
import { SiSpeedtest } from "react-icons/si";
import FlipCard from "@/components/ui/FlipCard";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "@/i18n/routing";
import { useGetFLashCardsInCollectionQuery } from "@/store/graphql/COLLECTION.generated";
import { Card, setSelectedCard } from "@/store/collectionSlice";
import _ from "lodash";
import { IoIosAdd } from "react-icons/io";
import { COLLECTION_EDIT, COLLECTION_LEARN } from "@/store/route.slice";
import CardsTable from "./CardTable";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Divide } from "lucide-react";
import CollectionOptions from "./CollectionOptions";
import Collectionheader from "./Collectionheader";

const Page = () => {
  const t = useTranslations("collection.info");
  const { collection } = useAppSelector((state) => state.persistedReducer);
  const dispatch = useAppDispatch();
  const route = useRouter();

  const { collectionid } = useParams<{ collectionid: string }>();
  const { data, isLoading, error, isError } = useGetFLashCardsInCollectionQuery(
    {
      ID: collectionid,
    }
  );

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
  useEffect(() => {}, [isError, error]);

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
  /**
   * render this if the collection is empty
   */
  if (
    data?.getCollectionFlashCards.data?.length === 0 ||
    data?.getCollectionFlashCards.total === 0
  ) {
    return (
      <>
        <div className=" flex flex-col justify-center gap-6 items-center">
          <div className=" flex flex-col justify-center items-center mt-10">
            <TbCards size={40} />
            <>{t("error.no cards")}</>
          </div>
          <Button
            size="lg"
            onPress={() => route.push(COLLECTION_EDIT(collectionid))}
            startContent={<IoIosAdd size={40} />}
          >
            {t("function.add cards")}
          </Button>
          <Button size="lg" startContent={<TbTableImport size={40} />}>
            {t("function.import")}
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className=" w-full flex flex-col items-center p-6">
      <div className="lg:w-[1200px] w-full">
        <Collectionheader></Collectionheader>
        <Divider className=" my-4"></Divider>
        {/* <div className="flex gap-4">
          <Button
            onClick={() => {
              route.push(COLLECTION_LEARN(collectionid));
            }}
            startContent={<PiCardsBold size={28} />}
            size="lg"
          >
            {t("function.review")}
          </Button>
        </div> */}
        <main className=" py-8 px-20  ">
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
                  className=" w-full h-[400px]"
                  front={collection.selectedCard.front}
                  back={collection.selectedCard.back}
                ></FlipCard>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <div className=" flex items-center justify-between my-4">
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
          <CollectionOptions></CollectionOptions>
        </div>
        <Divider className="my-4" />
        {/* <Divider className=" m-3"> </Divider> */}
        {data && (
          <CardsTable
            cards={data?.getCollectionFlashCards.data.map((item) => ({
              _id: item._id,
              back: item.back,
              front: item.front,
            }))}
          ></CardsTable>
        )}
      </div>
    </div>
  );
};

export default Page;
