"use client";
import { useCollection } from "@/hooks/useCollection";
import { Button, CardFooter } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React from "react";
import { MdOutlineChangeCircle } from "react-icons/md";
import { PiCardsBold } from "react-icons/pi";
import { SiSpeedtest } from "react-icons/si";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import FlipCard from "@/components/ui/FlipCard";

const page = () => {
  const t = useTranslations("collection.info");
  const collection = useCollection();
  const { collectionid } = useParams<{ collectionid: string }>();
  return (
    <div className=" w-full min-h-screen flex flex-col items-center p-6">
      <div className="lg:w-[1200px] w-full">
        <div>{collection?.title}</div>
        <div>
          <Button startContent={<PiCardsBold />}>{t("function.review")}</Button>
          <Button startContent={<MdOutlineChangeCircle />}>
            {t("function.study")}
          </Button>
          <Button startContent={<SiSpeedtest />}>{t("function.test")}</Button>
        </div>
        <Carousel className="w-full overflow-auto">
          <CarouselContent className=" ">
            {collection?.cards?.map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <FlipCard front={_.front} back={_.back}></FlipCard>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious />
          <CarouselNext /> */}
        </Carousel>
      </div>
    </div>
  );
};

export default page;
