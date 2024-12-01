"use client";
import { useAppSelector } from "@/store/hooks";
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Card,
  CardBody,
  CardFooter,
  Chip,
  CardHeader,
  Button,
  Image,
  Link,
} from "@nextui-org/react";
import AnimatedCircularProgressBar from "@/components/ui/animated-circular-progress-bar";
import { ConfettiFireworks } from "../../../../../components/magicui/FireworksButton";
import confetti from "canvas-confetti";
import { useTranslations } from "next-intl";
import { MdOutlineChangeCircle } from "react-icons/md";
import { SiSpeedtest } from "react-icons/si";
import Confetti from "./Confetti";
import CustomConfettiButton from "./Confetti";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { GrLinkNext } from "react-icons/gr";
import { useGetCollectionDetailQuery } from "@/store/graphql/COLLECTION.modify";
const Page = () => {
  const [value, setValue] = useState(0);
  const t = useTranslations("review");
  const route = useRouter();
  const { collectionid } = useParams<{ collectionid: string }>();
  const GetCollectionDetailQuery = useGetCollectionDetailQuery({
    ID: collectionid,
  });
  useEffect(() => {
    const handleIncrement = (prev: number) => {
      if (prev === 100) {
        return 0;
      }
      return prev + 10;
    };
    setValue(handleIncrement);
    const interval = setInterval(() => setValue(handleIncrement), 2000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };
  useEffect(() => {
    GetCollectionDetailQuery.data?.getCollectionById && handleClick();
  }, [GetCollectionDetailQuery]);
  if (GetCollectionDetailQuery.isLoading) {
    return;
  }
  return (
    <div className=" w-full flex flex-col items-center p-6">
      <div className="lg:w-[1200px] w-full">
        {/* <div className=" w-full text-2xl font-bold">
          {GetCollectionDetailQuery.data?.getCollectionById.name}
        </div> */}
        <Card isBlurred className="p-4">
          <CardBody className=" flex-row gap-12 justify-between items-center">
            <div className="">
              <span>{t("congratulate.title")}</span>
              <span> {t("congratulate.more con")}</span>
            </div>
            <CustomConfettiButton></CustomConfettiButton>
          </CardBody>
        </Card>
        <div className=" flex mt-10 gap-10">
          <Card className=" flex justify-center items-center">
            <CardHeader>{t("your proccess")}</CardHeader>
            <AnimatedCircularProgressBar
              className=" m-4"
              max={100}
              min={0}
              value={value}
              gaugePrimaryColor="rgb(79 70 229)"
              gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
            />
            <CardBody className=" gap-3">
              <Chip
                color="success"
                variant="flat"
                className=" flex-1 max-w-full p-2 flex text-center justify-center items-center"
              >
                <>{`${t("your proccess")} : ${10}`}</>
              </Chip>
              <Chip
                color="warning"
                variant="flat"
                className=" flex-1 max-w-full p-2 flex text-center justify-center items-center"
              >
                <>{`${t("left")} : ${10}`}</>
              </Chip>
            </CardBody>
          </Card>

          <Card className=" flex-1 justify-center items-center">
            <CardHeader>{t("next.title")}</CardHeader>

            <CardBody className=" gap-3 p-8">
              <Button
                size="lg"
                variant="solid"
                color="success"
                startContent={<MdOutlineChangeCircle size={28} />}
              >
                {t("next.function.study")}
              </Button>
              <Button size="lg" startContent={<SiSpeedtest size={28} />}>
                {t("next.function.test")}
              </Button>
            </CardBody>
            <CardFooter className=" justify-end">
              <Button
                onClick={() => {
                  route.push(`/collection/${collectionid}`);
                }}
                startContent={<GrLinkNext size={28} />}
                size="lg"
              >
                Back to home
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
