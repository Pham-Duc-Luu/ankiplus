"use client";
import { cn } from "@/lib/utils";
import { nextReview } from "@/store/collectionSlice";
import { useAppSelector } from "@/store/hooks";
import { Button, Kbd, Tooltip } from "@nextui-org/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const ReviewTimeOption = ({ className }: { className?: string }) => {
  const colors = ["#dc2626", "#d97706", "#65a30d", "#0891b2"];
  const dispatch = useDispatch();
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      console.log(e);

      if (e.key === "1" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className={cn(className, " flex gap-6")}>
      {colors.map((color, index) => {
        return (
          <Tooltip content={<Kbd>{index + 1}</Kbd>}>
            <Button
              variant="bordered"
              key={index}
              style={{
                backgroundColor: `${color}50`,
                color: color,
                borderColor: color,
              }}
              onClick={() => {
                dispatch(nextReview());
              }}
            >
              {color}
            </Button>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ReviewTimeOption;
