"use client";
import { cn } from "@/lib/utils";
import { nextReview, reviewAgain } from "@/store/collectionSlice";
import { useAppSelector } from "@/store/hooks";
import { Button, ButtonProps, Kbd, Tooltip } from "@nextui-org/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as dayjs from "dayjs";

import { useTranslations } from "next-intl";
import { useReviewFlashcardMutation } from "@/store/RTK-query/flashcardApi";
import { useParams } from "next/navigation";
const ReviewTimeOption = ({ className }: { className?: string }) => {
  const { reviewCard } = useAppSelector(
    (state) => state.persistedReducer.collection
  );
  const { collectionid } = useParams<{ collectionid: string }>();

  // IMPORTANT : this will handle call api when choose a review quality's options
  const handleQualityChooseOption = (quality: number) => {
    useReviewFlashcardMutationTrigger({ collectionId: collectionid, quality });
  };

  // * init review card mutation
  const [useReviewFlashcardMutationTrigger, useReviewFlashcardMutationResult] =
    useReviewFlashcardMutation();

  const t = useTranslations("review");
  const dispatch = useDispatch();
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "1") {
        handleQualityChooseOption(qualities[0]);
      }
      if (e.key === "2") {
        handleQualityChooseOption(qualities[1]);
      }

      if (e.key === "3") {
        handleQualityChooseOption(qualities[2]);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const qualities = [1, 3, 5];

  const hanldeButtonColor = (number: number): ButtonProps["color"] => {
    switch (number) {
      case 1:
        return "danger";
        break;

      case 2:
        return "warning";
      case 3:
        return "success";

      default:
        return "default";
        break;
    }
  };

  const handleDisplayTooltip = (number: number): string => {
    switch (number) {
      case 1:
        return t("review state.bad");

      case 2:
        return t("review state.ok");
      case 3:
        return t("review state.good");

      default:
        return t("review state.ok");
        break;
    }
  };

  if (!reviewCard) {
    return <>Some thing went wrong!!</>;
  }

  return (
    <div className={cn(className, " flex gap-6")}>
      {qualities.map((quality, index) => {
        return (
          <Tooltip content={<Kbd>{index + 1}</Kbd>}>
            <Button
              // variant=

              key={index}
              color={hanldeButtonColor(index + 1)}
              onClick={() => {
                handleQualityChooseOption(quality);
              }}
            >
              {handleDisplayTooltip(index + 1)}
            </Button>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ReviewTimeOption;
