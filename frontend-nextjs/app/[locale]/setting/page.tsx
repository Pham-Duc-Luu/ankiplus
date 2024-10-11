"use client";
import { useTranslations } from "next-intl";
import React from "react";
import Personal from "./personal";
import DevelopmentProccessAlert from "@/components/DevelopmentProccessAlert";

const page = () => {
  const t = useTranslations("settings");
  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6">
      <div className="lg:w-[1200px] w-full flex flex-col gap-10">
        <p className=" font-bold text-4xl">{t("title")}</p>
        <Personal></Personal>
      </div>
      <DevelopmentProccessAlert></DevelopmentProccessAlert>
    </div>
  );
};

export default page;
