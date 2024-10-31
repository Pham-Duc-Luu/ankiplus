"use client";
import CollectionCard, { ICollectionCard } from "@/components/CollectionCard";
import { Avatar, Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import React, { useEffect, useLayoutEffect } from "react";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdAddCircleOutline } from "react-icons/md";

import { IoIosAdd } from "react-icons/io";
import { useRouter } from "@/i18n/routing";
import { useAppSelector } from "@/store/hooks";
const Page = () => {
  const t = useTranslations("dashboard.my collection");
  const route = useRouter();
  const { access_token, refresh_token } = useAppSelector(
    (state) => state.persistedReducer.auth
  );

  return (
    <div className=" w-full min-h-screen flex flex-col items-center p-6">
      <Card className=" lg:w-[1200px] w-full">
        <CardHeader>
          <p className=" lg:text-2xl font-bold m-4">{t("title")}</p>
        </CardHeader>
        <CardBody className="lg:max-w-[1200px]">
          <Button className="py-10 m-4" variant="ghost">
            <CardBody
              className=" flex flex-row items-center justify-center"
              onClick={() => {
                route.push("/create/collection");
              }}
            >
              <Avatar
                isBordered
                color="default"
                fallback={<IoIosAdd size={40} />}
              ></Avatar>
              <CardBody>
                <h4 className="font-bold text-large">{t("create")}</h4>
              </CardBody>
            </CardBody>
          </Button>
          {/* {profile?.collections?.map((item, index) => (
            <CollectionCard
              onClick={() => {
                route.push(`/collection/${item._id}`);
              }}
              key={index}
              title={item.name}
            ></CollectionCard>
          ))} */}
        </CardBody>
      </Card>
      {/* <Card className="flex-1">
        <CardBody className="lg:max-w-[1200px]">
          <CollectionCard {...example}></CollectionCard>
        </CardBody>
      </Card> */}
    </div>
  );
};

export default Page;
