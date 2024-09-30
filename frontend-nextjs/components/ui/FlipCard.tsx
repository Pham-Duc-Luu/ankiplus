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
export interface FlipCardProps extends CardProps {
  front?: string;
  back?: string;
  text?: string;
}

export const ExtendCard = ({ text }: FlipCardProps) => {
  return (
    <Card className="py-4 min-w-[800px] min-h-80">
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

const FlipCard = ({ front, back }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
      <div className="front" onClick={() => handleClick()}>
        <ExtendCard text={front}></ExtendCard>
      </div>
      <div className="back" onClick={() => handleClick()}>
        <ExtendCard text={back}></ExtendCard>
      </div>
    </ReactCardFlip>
  );
};

export default FlipCard;
