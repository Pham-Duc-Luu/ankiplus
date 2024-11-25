"use client";
import ReoderItemCard from "@/components/ReoderItem.Card";
import {
  Card as CardType,
  collectionSlice,
  collectionSliceAction,
  IReoderItemCard,
  setFlashCards_card,
} from "@/store/collectionSlice";
import { Button, Card, Spinner } from "@nextui-org/react";
import { Reorder } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import Header from "./Header";
import { IoMdAdd } from "react-icons/io";
import CreateButton from "./Create.button";
import { useParams } from "next/navigation";
import { useGetFLashCardsInCollectionQuery } from "@/store/graphql/COLLECTION.generated";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useDebounce } from "@uidotdev/usehooks";
import { useUpdateAllFlashcardsMutation } from "@/store/RTK-query/collectionApi";
import { useToast } from "@/hooks/use-toast";
import { IoReload } from "react-icons/io5";
import { useRouter } from "@/i18n/routing";

const page = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null]); // Array to store refs for each card

  const { id } = useParams<{ id: string }>();

  const useGetFLashCardsInCollectionResult = useGetFLashCardsInCollectionQuery({
    ID: id,
  });
  const [
    useUpdateAllFlashcardsMutationTrigger,
    useUpdateAllFlashcardsMutationResult,
  ] = useUpdateAllFlashcardsMutation();
  const { cards } = useAppSelector(
    (state) => state.persistedReducer.collection
  );
  const { toast } = useToast();
  const debounecCards = useDebounce(cards, 1000);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLElement | null>();

  const scrollToListItem = (id: string) => {
    if (ref.current) {
      const targetLi = ref.current.querySelector(`[data-item-id="${id}"]`); // Find the li by id
      if (targetLi) {
        targetLi.scrollIntoView({ behavior: "smooth" }); // Scroll the li into view
      }
    }
  };
  const router = useRouter();
  useEffect(() => {
    useGetFLashCardsInCollectionResult.isSuccess &&
      cards &&
      useUpdateAllFlashcardsMutationTrigger({
        collectionId: id,
        flashcards: cards.map((item) => {
          return {
            id: item._id?.toString(),
            back: item.back || "",
            front: item.front || "",
          };
        }),
      });
  }, [debounecCards, useGetFLashCardsInCollectionResult]);

  useEffect(() => {
    if (useGetFLashCardsInCollectionResult.data?.getCollectionFlashCards.data) {
      dispatch(
        setFlashCards_card(
          useGetFLashCardsInCollectionResult.data.getCollectionFlashCards.data.map(
            (item, index): IReoderItemCard => {
              return {
                front: item.front,
                back: item.back,
                _id: item._id,
                positionId: v4(),
              };
            }
          )
        )
      );
    }
  }, [useGetFLashCardsInCollectionResult.data?.getCollectionFlashCards.data]);

  // * handle update card to server side-effects
  useEffect(() => {
    if (useUpdateAllFlashcardsMutationResult.isError) {
      toast({
        variant: "destructive",
        title: "something went wrong",
        action: (
          <Button
            startContent={<IoReload size={20} />}
            onPress={() => {
              router.refresh();
            }}
          >
            Reload
          </Button>
        ),
      });
    }
  }, [useUpdateAllFlashcardsMutationResult]);

  if (useGetFLashCardsInCollectionResult.isLoading) {
    return (
      <div className=" flex justify-center m-6">
        <Spinner size="lg" />
      </div>
    );
  }
  if (!useGetFLashCardsInCollectionResult.data?.getCollectionFlashCards) {
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
          {cards && (
            <Reorder.Group
              axis="y"
              values={cards}
              onReorder={(value) => {
                dispatch(setFlashCards_card(value));
              }}
              // ref={ref}
            >
              {cards?.map((item, index) => (
                <ReoderItemCard
                  order={index + 1}
                  value={item}
                  key={item.positionId}
                ></ReoderItemCard>
              ))}
            </Reorder.Group>
          )}
        </div>

        <div
          className=" cursor-pointer my-4"
          onClick={() => {
            dispatch(collectionSliceAction.append_card());
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
              // TODO : scroll to top
              cards && scrollToListItem(cards[0].positionId);
            }}
          ></CreateButton>
        </div>
      </div>
    </div>
  );
};

export default page;
