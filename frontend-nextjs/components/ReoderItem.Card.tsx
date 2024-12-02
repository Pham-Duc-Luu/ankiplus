"use client";
import { Card, CardProps } from "@nextui-org/react";
import { Reorder, useDragControls } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  Button,
  CardBody,
  CardHeader,
  Divider,
  Input,
} from "@nextui-org/react";
import { cn } from "@/lib/utils";
import {
  MdDeleteOutline,
  MdOutlineAddPhotoAlternate,
  MdOutlineDragHandle,
} from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { useTranslations } from "next-intl";
import { IReorderItemCard } from "@/app/[locale]/create/collection/page";
import _ from "lodash";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  IReoderItemCard,
  remove_card,
  updateCard_Card,
} from "@/store/collectionSlice";
export interface IReoderItemCardProps extends CardProps {
  value: IReoderItemCard;
  order: number;
}

const ReoderItemCard = ({ value, className, order }: IReoderItemCardProps) => {
  const controls = useDragControls();
  const [front, setfront] = useState<string>(value.front || "");
  const [back, setback] = useState<string>(value.back || "");
  const t = useTranslations("collection.create.card");

  const [isGrapping, setisGrapping] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      updateCard_Card({
        _id: value._id?.toString(),
        positionId: value.positionId,
        front,
        back,
      })
    );
  }, [front, back]);

  return (
    <Reorder.Item
      value={value}
      dragListener={false}
      data-item-id={value.positionId}
      dragControls={controls}
    >
      <div className={cn(className, " my-4")}>
        <Card className={`${isGrapping ? " border border-blue-600" : ""}`}>
          <CardHeader
            onPointerDown={(e) => controls?.start(e)}
            onMouseDown={() => {
              setisGrapping(true);
            }}
            onMouseUp={() => {
              setisGrapping(false);
            }}
            className={`flex gap-3 justify-between items-center ${
              isGrapping ? "cursor-grabbing" : "cursor-grab"
            }  `}
          >
            <div className="flex flex-col">
              <p className="text-lg m-2">{order}</p>
            </div>
            <div className="flex justify-center items-center">
              <Button
                isIconOnly
                color="warning"
                variant="faded"
                className=" flex justify-center items-center"
                onClick={() => {
                  // ! remove a flash cards using postion id
                  dispatch(remove_card(value.positionId));
                }}
              >
                <MdDeleteOutline size={20}></MdDeleteOutline>
              </Button>
              <div className=" p-2 cursor-move reorder-handle ">
                <MdOutlineDragHandle
                  size={30}
                  className="mr-4 "
                ></MdOutlineDragHandle>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className=" flex flex-row gap-4 items-baseline p-8">
            <Input
              variant="underlined"
              labelPlacement="outside"
              // label={t("front.title")}
              // onBlur={handleUpdate} // Call onChange when input loses focus
              onChange={(e) => {
                setfront(e.target.value);
              }}
              onClear={() => setfront("")}
              value={front}
              // onClear={() => setcardFront(undefined)}
              isClearable
            ></Input>
            <Input
              isClearable
              value={back}
              onClear={() => setback("")}
              variant="underlined"
              labelPlacement="outside"
              // onBlur={handleUpdate} // Call onChange when input loses focus
              onChange={(e) => {
                setback(e.target.value);
              }}
              // onClear={() => setcardBack(undefined)}
              label={t("back.title")}
            ></Input>
            <div>
              <Button
                color="warning"
                variant="bordered"
                endContent={<MdOutlineAddPhotoAlternate />}
                startContent={<CiLock color={"warning"} />}
              >
                {t("picture.title")}
              </Button>
            </div>
          </CardBody>
          {/* <Divider /> */}
          {/* <CardFooter>
          <Link
            isExternal
            showAnchorIcon
            href="https://github.com/nextui-org/nextui">
            Visit source code on GitHub.
          </Link>
        </CardFooter> */}
        </Card>
      </div>
    </Reorder.Item>
  );
};

export default ReoderItemCard;
