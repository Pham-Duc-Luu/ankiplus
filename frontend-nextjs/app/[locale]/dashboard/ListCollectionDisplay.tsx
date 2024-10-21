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
import { Divider, Spinner } from "@nextui-org/react";
import { useMutation, useQuery } from "@apollo/client";
import { graphql } from "@/__generated__/gql";
import { GET_USER_COLLECTIONS } from "@/graphql/GET_USER_COLLECTIONS";
import _ from "lodash";

export interface ListCollectionDisplayProps {
  LIMIT?: number;
  SKIP?: number;
}

const ListCollectionDisplay = ({
  LIMIT = 10,
  SKIP = 0,
}: ListCollectionDisplayProps) => {
  const { loading, error, data } = useQuery(GET_USER_COLLECTIONS, {
    variables: { LIMIT: LIMIT, SKIP: SKIP },
  });

  // const dispatch = useAppDispatch()

  if (loading) {
    return (
      <div className=" flex justify-center m-6">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {_.values(
        _.groupBy(data?.getUserCollections.data, function (o) {
          return o.createdAt;
        })
      ).map((items, index) => {
        return (
          <div key={index} className="flex flex-col gap-6">
            <Divider className="my-4" />
            <div className="space-y-1">
              <h4 className="text-xl font-medium">
                {dayjs(items[0].createdAt).format("YYYY MMMM DD")}
              </h4>
            </div>
            {items.map((item, i) => {
              return (
                <CollectionCard
                  _id={item._id}
                  key={i}
                  title={item.name}
                  description={item.description}
                ></CollectionCard>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ListCollectionDisplay;
