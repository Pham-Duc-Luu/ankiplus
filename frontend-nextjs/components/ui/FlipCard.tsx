"use client";
import React, { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";

import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardProps,
  Button,
} from "@nextui-org/react";
import { MdOutlineModeEdit } from "react-icons/md";
import { PiStarThin } from "react-icons/pi";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { display_back_reivewCard } from "@/store/collectionSlice";
export interface FlipCardProps extends CardProps {
  front?: string;
  back?: string;
  options?: {
    replace: {
      front: boolean | string;
      back: boolean | string;
    };
  };
  CustomCard?: {
    FrontCard?: React.JSX.Element;
    BackCard?: React.JSX.Element;
  };
  text?: string;
}

export const ExtendCard = ({ text, className }: FlipCardProps) => {
  return (
    <Card className={cn("py-4  w-[100%] h-[100%] overflow-hidden", className)}>
      {/* <CardHeader className=" flex justify-end gap-3">
        <Button isIconOnly size="lg">
          <MdOutlineModeEdit size={28} />
        </Button>
        <Button isIconOnly size="lg">
          <PiStarThin size={28} />
        </Button>
      </CardHeader> */}
      <CardBody className=" overflow-hidden py-2 px-8 flex justify-center items-center text-2xl ">
        {text}
      </CardBody>
    </Card>
  );
};

const FlipCard = ({
  front,
  back,
  className,
  CustomCard,
  options,
}: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { displaying_reviewCard } = useAppSelector(
    (state) => state.persistedReducer.collection
  );
  const dispatch = useAppDispatch();
  function handleFlip() {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  }

  useEffect(() => {
    // if (displaying_reviewCard === "front") {
    //   setIsFlipped(false);
    // }
    if (displaying_reviewCard === "back") {
      setIsFlipped(true);
    }
  }, [displaying_reviewCard]);

  return (
    <div className="flex items-center justify-center  cursor-pointer">
      <div
        className="flip-card w-[800px] h-[360px] rounded-md"
        // onClick={handleFlip}
        onClick={() => {
          dispatch(display_back_reivewCard());
        }}
      >
        <motion.div
          className="w-[100%] h-[100%]"
          initial={false}
          style={{
            transformStyle: "preserve-3d",
          }}
          animate={{ rotateX: isFlipped ? 180 : 360 }}
          transition={{ duration: 0.4, animationDirection: "normal" }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <ExtendCard
            className="flip-card-front"
            text={front ? front : "..."}
          ></ExtendCard>
          <ExtendCard
            className="flip-card-back"
            text={back ? back : "..."}
          ></ExtendCard>
        </motion.div>
      </div>
    </div>
  );
};

export default FlipCard;
