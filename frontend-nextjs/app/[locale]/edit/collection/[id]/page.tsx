"use client";
import ReoderItemCard from "@/components/ReoderItem.Card";
import { Card as CardType } from "@/store/collectionSlice";
import { Card, Spinner } from "@nextui-org/react";
import { Reorder } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import Header from "./Header";
import { IoMdAdd } from "react-icons/io";
import CreateButton from "./Create.button";
import { useParams } from "next/navigation";
import { useGetFLashCardsInCollectionQuery } from "@/store/graphql/COLLECTION.generated";

export interface IReoderItemCard extends Partial<CardType> {
  positionId: number | string;
}

const page = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null]); // Array to store refs for each card

  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useGetFLashCardsInCollectionQuery({ ID: id });

  const [flashCardItems, setFlashCardItems] = useState<IReoderItemCard[]>([
    { positionId: v4() },
    { positionId: v4() },
    { positionId: v4() },
  ]);
  const ref = useRef<HTMLElement | null>();

  const scrollToListItem = (id: string) => {
    if (ref.current) {
      const targetLi = ref.current.querySelector(`[data-item-id="${id}"]`); // Find the li by id
      if (targetLi) {
        targetLi.scrollIntoView({ behavior: "smooth" }); // Scroll the li into view
      }
    }
  };

  useEffect(() => {
    if (data?.getCollectionFlashCards.data) {
      setFlashCardItems(
        data.getCollectionFlashCards.data.map((item, index) => {
          return {
            front: item.front,
            back: item.back,
            _id: item._id,
            positionId: v4(),
          };
        })
      );
    }
  }, [data?.getCollectionFlashCards.data]);

  if (isLoading) {
    return (
      <div className=" flex justify-center m-6">
        <Spinner size="lg" />
      </div>
    );
  }
  if (!data?.getCollectionFlashCards) {
    return <>Some thing when wrong</>;
  }

  return (
    <div
      className=" w-full min-h-screen flex flex-col items-center p-6"
      ref={(e) => {
        cardRefs.current[0] = e;
      }}
    >
      <div className="lg:w-[1200px] mb-8">
        <Header></Header>
        {/* <Functions></Functions> */}
        <div
          onMouseEnter={(e) => {
            e.preventDefault();
          }}
        >
          <Reorder.Group
            axis="y"
            values={flashCardItems}
            onReorder={setFlashCardItems}
            // ref={ref}
          >
            {flashCardItems.map((item, index) => (
              <ReoderItemCard
                order={index + 1}
                value={item}
                key={item.positionId}
              ></ReoderItemCard>
            ))}
          </Reorder.Group>
        </div>

        <div
          className=" cursor-pointer my-4"
          onClick={() => {
            setFlashCardItems([...flashCardItems, { positionId: v4() }]);
          }}
        >
          <Card className=" flex justify-center items-center p-8  flex-row">
            <IoMdAdd size={30}></IoMdAdd>
            {/* <p className=" text-xl font-bold">{t("card.add")}</p> */}
          </Card>
        </div>
        <div className="my-4 flex justify-end">
          <CreateButton
            onClick={() => {
              scrollToListItem(flashCardItems[0]?.positionId.toString());
            }}
          ></CreateButton>
        </div>
      </div>
    </div>
  );
};

export default page;
