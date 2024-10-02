import React, { useState } from "react";
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
export interface FlipCardProps extends CardProps {
  front?: string;
  back?: string;
  CustomCard?: {
    FrontCard?: React.JSX.Element;
    BackCard?: React.JSX.Element;
  };
  text?: string;
}

export const ExtendCard = ({ text, className }: FlipCardProps) => {
  return (
    <Card className={cn("py-4 min-w-[800px] min-h-80", className)}>
      <CardHeader className=" flex justify-end gap-3">
        <Button isIconOnly>
          <MdOutlineModeEdit size={28} size="lg" />
        </Button>
        <Button isIconOnly size="lg">
          <PiStarThin size={28} />
        </Button>
      </CardHeader>
      <CardBody className="overflow-visible py-2 flex justify-center items-center text-2xl ">
        {text}
      </CardBody>
    </Card>
  );
};

const FlipCard = ({ front, back, className, CustomCard }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };
  if (CustomCard) {
    <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
      <div className="front" onClick={() => handleClick()}>
        <CustomCard.FrontCard></CustomCard.FrontCard>
      </div>
      <div className="back" onClick={() => handleClick()}>
        <CustomCard.BackCard></CustomCard.BackCard>
      </div>
    </ReactCardFlip>;
  }

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
      <div className="front" onClick={() => handleClick()}>
        <ExtendCard className={cn(className)} text={front}></ExtendCard>
      </div>
      <div className="back" onClick={() => handleClick()}>
        <ExtendCard className={cn(className)} text={back}></ExtendCard>
      </div>
    </ReactCardFlip>
  );
};

export default FlipCard;
