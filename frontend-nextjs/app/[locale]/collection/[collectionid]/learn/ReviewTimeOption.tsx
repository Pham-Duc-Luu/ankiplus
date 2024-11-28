"use client";
import { cn } from "@/lib/utils";
import { nextReview } from "@/store/collectionSlice";
import { useAppSelector } from "@/store/hooks";
import { Button, ButtonProps, Kbd, Tooltip } from "@nextui-org/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as dayjs from "dayjs";

import { useTranslations } from "next-intl";
const ReviewTimeOption = ({ className }: { className?: string }) => {
  const { reviewCard } = useAppSelector(
    (state) => state.persistedReducer.collection
  );

  const t = useTranslations("review");
  const dispatch = useDispatch();
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "1") {
        dispatch(nextReview());
      }
      if (e.key === "2") {
        dispatch(nextReview());
      }

      if (e.key === "3") {
        dispatch(nextReview());
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
                dispatch(nextReview());
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
