"use client";
import BlurIn from "@/components/ui/blur-in";
import Globe from "@/components/ui/globe";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { World } from "@/components/ui/World";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import React from "react";
import { IoIosLogIn } from "react-icons/io";
import { GlobeDemo } from "./GlobaDemo";

const page = () => {
  const route = useRouter();
  const t = useTranslations();
  return (
    <div className="flex justify-center items-center ">
      <GlobeDemo />
    </div>
  );
};

export default page;
