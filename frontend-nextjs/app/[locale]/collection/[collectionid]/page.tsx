"use client";
import { useCollection } from "@/hooks/useCollection";
import { Button } from "@nextui-org/react";
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
        <div>{collection.title}</div>
        <div>
          <Button startContent={<PiCardsBold />}>{t("function.review")}</Button>
          <Button startContent={<MdOutlineChangeCircle />}>
            {t("function.study")}
          </Button>
          <Button startContent={<SiSpeedtest />}>{t("function.test")}</Button>
        </div>
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {collection?.cards?.map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="py-4">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                      <p className="text-tiny uppercase font-bold">Daily Mix</p>
                      <small className="text-default-500">12 Tracks</small>
                      <h4 className="font-bold text-large">Frontend Radio</h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                      <Image
                        alt="Card background"
                        className="object-cover rounded-xl"
                        src="https://nextui.org/images/hero-card-complete.jpeg"
                        width={270}
                      />
                    </CardBody>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <FlipCard></FlipCard>
    </div>
  );
};

export default page;
