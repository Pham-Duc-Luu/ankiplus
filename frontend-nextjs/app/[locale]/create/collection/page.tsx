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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addFlashCard, setFlashCards } from "@/store/createCollectionSlice";

export interface IReorderItemCard extends Partial<CardType> {
  positionId: number | string;
}

const page = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null]); // Array to store refs for each card
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { newCollection } = useAppSelector(
    (state) => state.persistedReducer.createNewCollection
  );
  // const [flashCardItems, setFlashCardItems] = useState<IReorderItemCard[]>([
  //   { positionId: v4() },
  //   { positionId: v4() },
  //   { positionId: v4() },
  // ]);
  const ref = useRef<HTMLElement | null>();

  const scrollToListItem = (id: string) => {
    if (ref.current) {
      const targetLi = ref.current.querySelector(`[data-item-id="${id}"]`); // Find the li by id
      if (targetLi) {
        targetLi.scrollIntoView({ behavior: "smooth" }); // Scroll the li into view
      }
    }
  };

  // useEffect(() => {
  //   dispatch(setFlashCards(flashCardItems));
  // }, [flashCardItems]);

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
        // onMouseEnter={(e) => {
        //   e.preventDefault();
        // }}
        >
          <Reorder.Group
            axis="y"
            values={newCollection.flashCards}
            onReorder={(values) => {
              dispatch(setFlashCards(values));
            }}
            // ref={ref}
          >
            {newCollection.flashCards.map((item, index) => (
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
            // add();
            dispatch(addFlashCard({}));
          }}
        >
          <Card className=" flex justify-center items-center p-8  flex-row">
            <IoMdAdd size={30}></IoMdAdd>
            {/* <p className=" text-xl font-bold">{t("card.add")}</p> */}
          </Card>
        </div>
        <div className="my-4 flex justify-end">
          <CreateButton></CreateButton>
        </div>
      </div>
    </div>
  );
};

export default page;
