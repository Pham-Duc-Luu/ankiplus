"use client";
import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  RadioGroup,
  Radio,
  Card,
  CardBody,
  Chip,
  Progress,
  Badge,
} from "@nextui-org/react";
import { PiCards } from "react-icons/pi";
import { FaCaretDown } from "react-icons/fa";
import { useParams } from "next/navigation";
import { useGetCollectionDetailQuery } from "@/store/graphql/COLLECTION.modify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RiArrowGoBackFill, RiRepeatLine, RiShuffleFill } from "react-icons/ri";
import BadgeLock from "./BadgeLock";
import ButtonLockDisable from "./ButtonLockDisable";
import LoadingSpinnerReplace from "./LoadingSpinnerReplace";
import { previousReviewCard } from "@/store/collectionSlice";
const ReviewNavbar = () => {
  const [option, setoption] = useState("Review");
  const { reviewCardIndex, listReviewCards } = useAppSelector(
    (state) => state.persistedReducer.collection
  );
  const dispatch = useAppDispatch();
  const { collectionid } = useParams<{ collectionid: string }>();
  // IMPORTANT : handle collection detail
  const useGetCollectionDetailQueryResult = useGetCollectionDetailQuery({
    ID: collectionid,
  });

  // if (!reviewCardIndex) {
  //   return <LoadingSpinnerReplace></LoadingSpinnerReplace>;
  // }

  return (
    <div className=" flex justify-center items-center gap-4">
      <Dropdown>
        <DropdownTrigger>
          <Button
            startContent={<PiCards size={28} />}
            color={"primary"}
            variant={"flat"}
            className="capitalize"
            radius="sm"
            endContent={<FaCaretDown size={28} />}
          >
            {option}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Dropdown Variants"
          color={"primary"}
          variant={"flat"}
        >
          <DropdownItem key="new"></DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Card>
        <CardBody className=" flex justify-center items-center flex-row gap-4">
          <div className=" flex-1 text-lg font-bold">
            {useGetCollectionDetailQueryResult?.data?.getCollectionById.name}
          </div>
          <Chip variant="flat" color="warning">
            {reviewCardIndex}
          </Chip>
          <Progress
            color="success"
            className=" w-28"
            value={
              reviewCardIndex && listReviewCards?.length
                ? (reviewCardIndex * 100) / listReviewCards?.length
                : 0
            }
          ></Progress>
          <Chip variant="flat" color="success">
            {listReviewCards?.length}
          </Chip>
        </CardBody>
      </Card>
      <Card>
        <CardBody className=" flex justify-center items-center gap-4 flex-row">
          <Button isIconOnly onPress={() => dispatch(previousReviewCard())}>
            <RiArrowGoBackFill />
          </Button>
          <Button isIconOnly>
            <RiRepeatLine />
          </Button>

          <ButtonLockDisable isIconOnly>
            <RiShuffleFill />
          </ButtonLockDisable>
        </CardBody>
      </Card>
    </div>
  );
};

export default ReviewNavbar;
