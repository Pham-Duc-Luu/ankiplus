import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { Chip, Progress } from "@nextui-org/react";
import React from "react";

const LearningProgress = ({ className }: { className?: string }) => {
  const { collection } = useAppSelector((state) => state);
  if (!collection.cards) {
    return <></>;
  }

  return (
    <div className={cn(className, " flex gap-2 w-full items-center")}>
      <Chip color="default">{`${collection.reviewCard.index + 1} / ${
        collection.cards?.length
      }`}</Chip>
      <Progress
        aria-label="Downloading..."
        size="md"
        value={
          ((collection.reviewCard.index + 1) / collection.cards.length) * 100
        }
        color="success"
        className="max-w-md"
      />
    </div>
  );
};

export default LearningProgress;
