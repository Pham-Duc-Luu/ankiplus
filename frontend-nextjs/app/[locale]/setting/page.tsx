"use client";
import { useTranslations } from "next-intl";
import React from "react";
import Personal from "./personal";
import DevelopmentProccessAlert from "@/components/DevelopmentProccessAlert";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "@/i18n/routing";
import { AUTH_SIGN_IN } from "@/store/route.slice";

const page = () => {
  const t = useTranslations("settings");
  const { refresh_token } = useAppSelector(
    (state) => state.persistedReducer.auth
  );
  const route = useRouter();
  if (!refresh_token) {
    route.push(AUTH_SIGN_IN());
  }
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
