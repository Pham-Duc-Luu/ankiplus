"use client";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import Header from "./Header";
import Functions from "./Functions";
import CreateCard from "@/components/flashcard.create";
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { removeItem } from "@/lib/utils";
import { MdAddToPhotos } from "react-icons/md";
import {
  CreateCollectionBody,
  flashCardDto,
} from "@/lib/api/collection.user.axios";
import CreateButton from "./Create.button";
import { v4 } from "uuid";
import { log } from "console";

export interface Card extends Partial<flashCardDto> {
  id: number | string;
}

export default function Page() {
  const t = useTranslations("collection.create");
  const [items, setItems] = useState<Card[]>([{ id: v4() }]);
  const add = () => {
    setItems([...items, { id: v4() }]);
  };
  const [title, settitle] = useState<string>();
  const [description, setdescription] = useState<string>();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null]); // Array to store refs for each card

  const remove = (position: number) => {
    console.log(position);

    const findItem = items.find((item) => item.id === position);
    if (findItem) setItems(removeItem(items, findItem));
  };

  const handleCardChange = (index: number | string, updatedCard: Card) => {
    // console.log(updatedCard);
    const updatedCards = [...items];
    const card = updatedCards.find((item) => item.id === updatedCard.id);

    // * check if card for adding is existing
    if (card) {
      card.front = updatedCard.front;
      card.back = updatedCard.back;
    }
    // console.log(updatedCards);

    setItems(updatedCards);
  };

  const ref = useRef<HTMLElement | null>();

  const scrollToListItem = (id: string) => {
    if (ref.current) {
      const targetLi = ref.current.querySelector(`[data-item-id="${id}"]`); // Find the li by id
      if (targetLi) {
        console.log(targetLi);
        // targetLi.scrollIntoView({ behavior: 'smooth' }); // Scroll the li into view
      }
    }
  };
  return (
    <div
      className=" w-full min-h-screen flex flex-col items-center p-6"
      ref={(e) => {
        cardRefs.current[0] = e;
      }}
    >
      <div className="lg:w-[1200px] mb-8">
        <Header
          onChange={(a, b) => {
            settitle(a);
            setdescription(b);
          }}
        ></Header>
        {/* <Functions></Functions> */}
        <div>
          <Reorder.Group axis="y" values={items} onReorder={setItems} ref={ref}>
            {items.map((item, index) => (
              <CreateCard
                key={item.id}
                value={item}
                order={index}
                onChange={(updatedCard: Card) =>
                  handleCardChange(item.id, updatedCard)
                }
                onRemove={remove}
              ></CreateCard>
            ))}
          </Reorder.Group>
        </div>

        <div
          className=" cursor-pointer my-4"
          onClick={() => {
            add();
          }}
        >
          <Card className=" flex justify-center items-center p-8  flex-row">
            <IoMdAdd size={30}></IoMdAdd>
            <p className=" text-xl font-bold">{t("card.add")}</p>
          </Card>
        </div>
        <div className="my-4 flex justify-end">
          <CreateButton
            onClick={() => {
              scrollToListItem(items[0]?.id.toString());
            }}
          ></CreateButton>
        </div>
      </div>
    </div>
  );
}
