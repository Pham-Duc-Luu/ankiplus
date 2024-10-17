"use client";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { IShortCollectionDto } from "@/store/dto/dto.type";
import { groupCollectionsByDayAction } from "@/store/userSlice";
import CollectionCard from "@/components/CollectionCard";
import { Divider } from "@nextui-org/react";

const ListCollectionDisplay = () => {
  const { user } = useAppSelector((state) => state.persistedReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(groupCollectionsByDayAction({}));
  }, [user.collections]);

  useEffect(() => {
    if (user?.collectionsGroupByDate) {
      console.log(
        Object.keys(user.collectionsGroupByDate).sort((a, b) => {
          return dayjs(a).isAfter(dayjs(b)) ? -1 : 1;
        })
      );
    }
  }, [user.collectionsGroupByDate]);

  if (user?.collectionsGroupByDate) {
    return (
      <>
        {Object.keys(user.collectionsGroupByDate)
          .sort((a, b) => {
            return dayjs(a).isAfter(dayjs(b)) ? -1 : 1;
          })
          .map((dayKeyValue, index) => {
            if (!user.collectionsGroupByDate) {
              return;
            }
            return (
              <div key={index} className="flex flex-col gap-6">
                <Divider className="my-4" />
                <div className="space-y-1">
                  <h4 className="text-xl font-medium">
                    {dayjs(dayKeyValue).format("YYYY MMMM DD")}
                  </h4>
                </div>
                {user?.collectionsGroupByDate[dayKeyValue]?.map(
                  (item, index) => {
                    return (
                      <CollectionCard
                        _id={item._id}
                        key={index}
                        title={item.name}
                      ></CollectionCard>
                    );
                  }
                )}
              </div>
            );
          })}
      </>
    );
  }

  return <div>{}</div>;
};

export default ListCollectionDisplay;
