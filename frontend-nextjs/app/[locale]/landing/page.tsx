"use client";
import BlurIn from "@/components/ui/blur-in";
import Globe from "@/components/ui/globe";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import React from "react";
import { IoIosLogIn } from "react-icons/io";

const page = () => {
  const route = useRouter();
  const t = useTranslations();
  return (
    <div className="flex justify-center items-center h-full gap-6">
      <div className=" flex-1 m-10">
        <BlurIn
          word={t("landing.title")}
          duration={2}
          className="text-4xl font-bold text-black dark:text-white text-start"
        />
        <RainbowButton
          className=" flex justify-between items-center gap-5"
          onClick={() => {
            route.push("/auth/sign-in");
          }}
        >
          <span className=" text-xl">{t("utils.sign in")}</span>
          <IoIosLogIn />
        </RainbowButton>
      </div>
      <div className="w-[500px] h-[500px] ">
        <Globe className="" />
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
      </div>
    </div>
  );
};

export default page;
